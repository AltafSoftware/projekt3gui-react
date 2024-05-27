#ifndef SERVER_HPP
#define SERVER_HPP

#include <iostream>
#include <string>
#include <sstream>
#include <iomanip>
#include <boost/asio.hpp>
#include <jsoncpp/json/json.h>
#include <atomic>
#include <mutex>

using namespace boost::asio;
using ip::tcp;

extern std::atomic<double> player_1_time;
extern std::atomic<double> player_2_time;
extern std::mutex game_mutex;

class Session : public std::enable_shared_from_this<Session> {
public:
    Session(tcp::socket socket);
    void start();

private:
    void readRequest();
    void handleRequest(const std::string &request);
    void handleOptionsRequest();
    void handleGETRequest(const std::string &request);
    void handlePOSTRequest(const std::string &request);
    void sendBadRequestResponse();
    void sendResponse(const std::string &response);

    tcp::socket socket_;
    enum { max_length = 1024 };
    char data_[max_length];
};

class Server {
public:
    Server(io_service &io_service, short port);

private:
    void doAccept();
    tcp::acceptor acceptor_;
    tcp::socket socket_;
};

#endif // SERVER_HPP
