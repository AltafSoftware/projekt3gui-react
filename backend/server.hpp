#include <iostream>
#include <string>
#include <boost/asio.hpp>

using namespace boost::asio;
using ip::tcp;

class Session : public std::enable_shared_from_this<Session> {
public:
    Session(tcp::socket socket) : socket_(std::move(socket)) {}

    void start() {
        readRequest();
    }

private:
    void readRequest() {
        auto self(shared_from_this());
        socket_.async_read_some(buffer(data_, max_length),
            [this, self](boost::system::error_code ec, std::size_t length) {
                if (!ec) {
                    std::string request(data_, length);
                    handleRequest(request);
                }
            });
    }

    void handleRequest(const std::string& request) {
        if (request.find("OPTIONS") == 0) {
            handleOptionsRequest();
        } else if (request.find("GET") == 0) {
            handleGETRequest();
        } else if (request.find("POST") == 0) {
            handlePOSTRequest(request);
        } else {
            sendBadRequestResponse();
        }
    }

    void handleOptionsRequest() {
    // Respond to OPTIONS requests with appropriate CORS headers
    std::string response = "HTTP/1.1 200 OK\r\n";
    response += "Access-Control-Allow-Origin: *\r\n";
    response += "Access-Control-Allow-Methods: GET, POST\r\n";
    response += "Access-Control-Allow-Headers: Content-Type\r\n";
    response += "Content-Length: 0\r\n\r\n";

    sendResponse(response);
}

    void handleGETRequest() {
        std::cout << "GET request received" << std::endl;
        // Respond to GET requests
        std::string response = "HTTP/1.1 200 OK\r\nContent-Length: 13\r\nAccess-Control-Allow-Origin: *\r\n\r\nHello, World!";
        sendResponse(response);
    }

    void handlePOSTRequest(const std::string& request) 
    {
        handleOptionsRequest();
        std::cout << "POST request received" << std::endl;
        size_t bodyStart = request.find("\r\n\r\n");
        // Respond to POST requests
         std::string response = "HTTP/1.1 200 OK\r\nContent-Length: " + std::to_string(request.size() - bodyStart - 4) + "\r\n\r\n" + request.substr(bodyStart + 4);
        sendResponse(response);
    }

    void sendBadRequestResponse() {
        std::string response = "HTTP/1.1 400 Bad Request\r\nContent-Length: 11\r\nAccess-Control-Allow-Origin: *\r\n\r\nBad Request";
        sendResponse(response);
    }

    void sendResponse(const std::string& response) {
        auto self(shared_from_this());
        async_write(socket_, buffer(response),
            [this, self](boost::system::error_code ec, std::size_t /* length */) {
                if (!ec) {
                    boost::system::error_code ignored_ec;
                    socket_.shutdown(tcp::socket::shutdown_both, ignored_ec);
                }
            });
    }

    tcp::socket socket_;
    enum { max_length = 1024 };
    char data_[max_length];
};

class Server {
public:
    Server(io_service& io_service, short port)
        : acceptor_(io_service, tcp::endpoint(tcp::v4(), port)),
          socket_(io_service) {
        doAccept();
    }

private:
    void doAccept() {
        acceptor_.async_accept(socket_,
            [this](boost::system::error_code ec) {
                if (!ec) {
                    std::make_shared<Session>(std::move(socket_))->start();
                }

                doAccept();
            });
    }

    tcp::acceptor acceptor_;
    tcp::socket socket_;
};

