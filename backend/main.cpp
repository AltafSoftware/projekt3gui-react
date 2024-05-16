#include "server.hpp"

int main() {
    try {

        std::cout << "Server is running on port 8080..." << std::endl;

        io_service io_service;
        Server server(io_service, 8080);
        io_service.run();

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
