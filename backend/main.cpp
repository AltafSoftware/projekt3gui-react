#include <iostream>
#include <exception>
#include <boost/asio.hpp>
#include "server.hpp"

int main() {
    try {
        std::cout << "Server is running on port 8080..." << std::endl;

        boost::asio::io_service io_service;
        Server server(io_service, 8080);
        io_service.run();

    } catch (const std::exception& e) {
        std::cerr << "Exception: " << e.what() << std::endl;
    }

    return 0;
}
