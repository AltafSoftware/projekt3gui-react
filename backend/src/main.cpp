#include "server.hpp"
#include "hardware.hpp"
#include <thread>

int main() {
    try {
        std::cout << "Server is running on port 8080..." << std::endl;

        io_service io_service;
        Server server(io_service, 8080);

        // Hardware part
        int file = openI2CDevice();
        if (file < 0) {
            return 1;
        }

        if (!checkConnection(file)) {
            close(file);
            return 1;
        }

        if (!setI2CSlaveAddress(file, PSoC_I2C_ADDR)) {
            close(file);
            return 1;
        }

        // Start the hardware reader thread
        std::thread hardware_thread(readI2CData, file);
        hardware_thread.detach();

        io_service.run();

    } catch (std::exception& e) {
        std::cerr << "Exception: " << e.what() << "\n";
    }

    return 0;
}
