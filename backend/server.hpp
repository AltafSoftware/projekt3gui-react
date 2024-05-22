#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>
#include <boost/asio.hpp>
#include <jsoncpp/json/json.h> // Correct include path for jsoncpp

using namespace boost::asio;
using ip::tcp;

class Session : public std::enable_shared_from_this<Session>
{
public:
    Session(tcp::socket socket) : socket_(std::move(socket)) {}

    void start()
    {
        readRequest();
    }

private:
    void readRequest()
    {
        auto self(shared_from_this());
        socket_.async_read_some(buffer(data_, max_length),
                                [this, self](boost::system::error_code ec, std::size_t length)
                                {
                                    if (!ec)
                                    {
                                        std::string request(data_, length);
                                        handleRequest(request);
                                    }
                                });
    }

    void handleRequest(const std::string &request)
    {
        if (request.find("OPTIONS") == 0)
        {
            handleOptionsRequest();
        }
        else if (request.find("GET") == 0)
        {
            handleGETRequest(request);
        }
        else if (request.find("POST") == 0)
        {
            handlePOSTRequest(request);
        }
        else
        {
            sendBadRequestResponse();
        }
    }

    void handleOptionsRequest()
    {
        std::string response = "HTTP/1.1 200 OK\r\n";
        response += "Access-Control-Allow-Origin: *\r\n";
        response += "Access-Control-Allow-Methods: GET, POST\r\n";
        response += "Access-Control-Allow-Headers: Content-Type\r\n";
        response += "Content-Length: 0\r\n\r\n";

        sendResponse(response);
    }

    void handleGETRequest(const std::string &request)
    {
        std::cout << "GET request received" << std::endl;

        // Extract the endpoint from the request
        size_t pathStart = request.find("GET ") + 4;
        size_t pathEnd = request.find(" ", pathStart);
        std::string path = request.substr(pathStart, pathEnd - pathStart);

        static double player_1_time, player_2_time;

        if (path == "/get_time_player1")
        {
            std::cout << "Enter time for player 1: ";
            std::cin >> player_1_time;

            Json::Value root;
            root["player_1_time"] = player_1_time;
            Json::StreamWriterBuilder writer;
            std::string responseBody = Json::writeString(writer, root);

            std::string response = "HTTP/1.1 200 OK\r\n";
            response += "Access-Control-Allow-Origin: *\r\n";
            response += "Content-Type: application/json\r\n";
            response += "Content-Length: " + std::to_string(responseBody.length()) + "\r\n\r\n";
            response += responseBody;

            sendResponse(response);
        }
        else if (path == "/get_time_player2")
        {
            std::cout << "Enter time for player 2: ";
            std::cin >> player_2_time;

            Json::Value root;
            root["player_2_time"] = player_2_time;
            Json::StreamWriterBuilder writer;
            std::string responseBody = Json::writeString(writer, root);

            std::string response = "HTTP/1.1 200 OK\r\n";
            response += "Access-Control-Allow-Origin: *\r\n";
            response += "Content-Type: application/json\r\n";
            response += "Content-Length: " + std::to_string(responseBody.length()) + "\r\n\r\n";
            response += responseBody;

            sendResponse(response);
        }
        else if (path == "/get_time_winner")
        {
            std::ostringstream winnerStream;
            winnerStream << std::fixed << std::setprecision(2); // Set the desired precision (e.g., 2 decimal places)

            std::string winner;
            if (player_1_time < player_2_time)
            {
                winnerStream << "Spiller 1 har vundet med tiden: " << player_1_time;
                winner = winnerStream.str();
            }
            else if (player_2_time < player_1_time)
            {
                winnerStream << "Spiller 2 har vundet med tiden: " << player_2_time;
                winner = winnerStream.str();
            }
            else
            {
                winner = "Ingen vinder. Spiller 1 og 2 drak på samme tid.";
            }

            Json::Value root;
            root["winner"] = winner;
            Json::StreamWriterBuilder writer;
            std::string responseBody = Json::writeString(writer, root);

            std::string response = "HTTP/1.1 200 OK\r\n";
            response += "Access-Control-Allow-Origin: *\r\n";
            response += "Content-Type: application/json\r\n";
            response += "Content-Length: " + std::to_string(responseBody.length()) + "\r\n\r\n";
            response += responseBody;

            sendResponse(response);
        }
        else
        {
            sendBadRequestResponse();
        }
    }

    void handlePOSTRequest(const std::string &request)
    {
        std::cout << "POST request received" << std::endl;

        size_t bodyStart = request.find("\r\n\r\n");
        std::string body = request.substr(bodyStart + 4);

        // Parse JSON body to extract the game status
        Json::Value root;
        Json::CharReaderBuilder reader;
        std::string errs;
        std::istringstream s(body);
        if (Json::parseFromStream(reader, s, &root, &errs))
        {
            int status = root["status"].asInt();
            if (status == 0)
            {
                std::cout << "SPIL IKKE STARTET!" << std::endl;
            }
            else if (status == 1)
            {
                std::cout << "SPIL STARTET!" << std::endl;
            }
        }

        std::string response = "HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n";
        sendResponse(response);
    }

    void sendBadRequestResponse()
    {
        std::string response = "HTTP/1.1 400 Bad Request\r\nContent-Length: 11\r\nAccess-Control-Allow-Origin: *\r\n\r\nBad Request";
        sendResponse(response);
    }

    void sendResponse(const std::string &response)
    {
        auto self(shared_from_this());
        async_write(socket_, buffer(response),
                    [this, self](boost::system::error_code ec, std::size_t /* length */)
                    {
                        if (!ec)
                        {
                            boost::system::error_code ignored_ec;
                            socket_.shutdown(tcp::socket::shutdown_both, ignored_ec);
                        }
                    });
    }

    tcp::socket socket_;
    enum
    {
        max_length = 1024
    };
    char data_[max_length];
};

class Server
{
public:
    Server(io_service &io_service, short port)
        : acceptor_(io_service, tcp::endpoint(tcp::v4(), port)),
          socket_(io_service)
    {
        doAccept();
    }

private:
    void doAccept()
    {
        acceptor_.async_accept(socket_,
                               [this](boost::system::error_code ec)
                               {
                                   if (!ec)
                                   {
                                       std::make_shared<Session>(std::move(socket_))->start();
                                   }

                                   doAccept();
                               });
    }

    tcp::acceptor acceptor_;
    tcp::socket socket_;
};