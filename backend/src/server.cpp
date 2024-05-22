#include "server.hpp"

Session::Session(tcp::socket socket) : socket_(std::move(socket)) {}

void Session::start() {
    readRequest();
}

void Session::readRequest() {
    auto self(shared_from_this());
    socket_.async_read_some(buffer(data_, max_length),
        [this, self](boost::system::error_code ec, std::size_t length) {
            if (!ec) {
                std::string request(data_, length);
                handleRequest(request);
            }
        });
}

void Session::handleRequest(const std::string &request) {
    if (request.find("OPTIONS") == 0) {
        handleOptionsRequest();
    } else if (request.find("GET") == 0) {
        handleGETRequest(request);
    } else if (request.find("POST") == 0) {
        handlePOSTRequest(request);
    } else {
        sendBadRequestResponse();
    }
}

void Session::handleOptionsRequest() {
    std::string response = "HTTP/1.1 200 OK\r\n";
    response += "Access-Control-Allow-Origin: *\r\n";
    response += "Access-Control-Allow-Methods: GET, POST\r\n";
    response += "Access-Control-Allow-Headers: Content-Type\r\n";
    response += "Content-Length: 0\r\n\r\n";
    sendResponse(response);
}

void Session::handleGETRequest(const std::string &request) {
    std::cout << "GET request received" << std::endl;
    size_t pathStart = request.find("GET ") + 4;
    size_t pathEnd = request.find(" ", pathStart);
    std::string path = request.substr(pathStart, pathEnd - pathStart);

    if (path == "/get_time_player1") {
        double time;
        {
            std::lock_guard<std::mutex> lock(game_mutex);
            time = player_1_time;
        }

        Json::Value root;
        root["player_1_time"] = time;
        Json::StreamWriterBuilder writer;
        std::string responseBody = Json::writeString(writer, root);

        std::string response = "HTTP/1.1 200 OK\r\n";
        response += "Access-Control-Allow-Origin: *\r\n";
        response += "Content-Type: application/json\r\n";
        response += "Content-Length: " + std::to_string(responseBody.length()) + "\r\n\r\n";
        response += responseBody;

        sendResponse(response);
    } else if (path == "/get_time_player2") {
        double time;
        {
            std::lock_guard<std::mutex> lock(game_mutex);
            time = player_2_time;
        }

        Json::Value root;
        root["player_2_time"] = time;
        Json::StreamWriterBuilder writer;
        std::string responseBody = Json::writeString(writer, root);

        std::string response = "HTTP/1.1 200 OK\r\n";
        response += "Access-Control-Allow-Origin: *\r\n";
        response += "Content-Type: application/json\r\n";
        response += "Content-Length: " + std::to_string(responseBody.length()) + "\r\n\r\n";
        response += responseBody;

        sendResponse(response);
    } else if (path == "/get_time_winner") {
        double p1_time, p2_time;
        {
            std::lock_guard<std::mutex> lock(game_mutex);
            p1_time = player_1_time;
            p2_time = player_2_time;
        }

        std::ostringstream winnerStream;
        winnerStream << std::fixed << std::setprecision(2);
        std::string winner;

        if (p1_time < p2_time) {
            winnerStream << "Spiller 1 har vundet med tiden: " << p1_time;
            winner = winnerStream.str();
        } else if (p2_time < p1_time) {
            winnerStream << "Spiller 2 har vundet med tiden: " << p2_time;
            winner = winnerStream.str();
        } else {
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
    } else {
        sendBadRequestResponse();
    }
}

void Session::handlePOSTRequest(const std::string &request) {
    std::cout << "POST request received" << std::endl;
    size_t bodyStart = request.find("\r\n\r\n");
    std::string body = request.substr(bodyStart + 4);

    Json::Value root;
    Json::CharReaderBuilder reader;
    std::string errs;
    std::istringstream s(body);

    if (Json::parseFromStream(reader, s, &root, &errs)) {
        int status = root["status"].asInt();
        if (status == 0) {
            std::cout << "SPIL IKKE STARTET!" << std::endl;
        } else if (status == 1) {
            std::cout << "SPIL STARTET!" << std::endl;
        }
    }

    std::string response = "HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n";
    sendResponse(response);
}

void Session::sendBadRequestResponse() {
    std::string response = "HTTP/1.1 400 Bad Request\r\nContent-Length: 11\r\nAccess-Control-Allow-Origin: *\r\n\r\nBad Request";
    sendResponse(response);
}

void Session::sendResponse(const std::string &response) {
    auto self(shared_from_this());
    async_write(socket_, buffer(response),
        [this, self](boost::system::error_code ec, std::size_t /* length */) {
            if (!ec) {
                boost::system::error_code ignored_ec;
                socket_.shutdown(tcp::socket::shutdown_both, ignored_ec);
            }
        });
}

Server::Server(io_service &io_service, short port)
    : acceptor_(io_service, tcp::endpoint(tcp::v4(), port)),
      socket_(io_service) {
    doAccept();
}

void Server::doAccept() {
    acceptor_.async_accept(socket_,
        [this](boost::system::error_code ec) {
            if (!ec) {
                std::make_shared<Session>(std::move(socket_))->start();
            }
            doAccept();
        });
}
