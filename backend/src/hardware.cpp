#include "hardware.hpp"
#include <atomic>
#include <mutex>
#include <iostream>
#include <unistd.h>
#include <cstring>
#include <chrono>
#include <thread>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/i2c-dev.h>
#include <cstddef>  // Add this line to include size_t

// External shared variables
std::atomic<double> player_1_time(0.0);
std::atomic<double> player_2_time(0.0);
std::mutex game_mutex;

int openI2CDevice() {
    int file;
    if ((file = open("/dev/i2c-1", O_RDWR)) < 0) {
        perror("Failed to open the I2C bus");
        return -1;
    }
    return file;
}

bool checkConnection(int file) {
    unsigned long funcs;
    if (ioctl(file, I2C_FUNCS, &funcs) < 0) {
        perror("could not get the I2C functionality");
        return false;
    }
    return true;
}

bool setI2CSlaveAddress(int file, int addr) {
    if (ioctl(file, I2C_SLAVE, addr) < 0) {
        perror("Failed to acquire bus access and/or talk to slave");
        return false;
    }
    return true;
}

bool writeData(int file, const unsigned char* data, std::size_t length) {
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    if (write(file, data, length) != static_cast<ssize_t>(length)) {
        perror("Failed to write to the I2C bus");
        return false;
    }
    return true;
}

void readI2CData(int file) {
    char receivedData[1];
    usleep(10000);
    if (read(file, receivedData, sizeof(receivedData)) != sizeof(receivedData)) {
        perror("Failed to read from slave");
        close(file);
        return;
    }

    for (;;) {
        usleep(10000);
        if (read(file, receivedData, sizeof(receivedData)) != sizeof(receivedData)) {
            perror("Failed to read from slave");
            close(file);
            return;
        }

        if (receivedData[0] == 1) {
            std::cout << "Begynd at fyld drik op" << std::endl;
        } else if (receivedData[0] == 2) {
            uint8_t receivedData[4] = {0x01, 0x02, 0x03, 0x04};
            std::cout << "Stoerrelsen af array er: " << sizeof(receivedData) << std::endl;
        } else if (receivedData[0] == 3) {
            std::cout << "Startskop ikke registreret. Placer kop" << std::endl;
        } else if (receivedData[0] == 4) {
            std::cout << "Går fra ingen vaegt til vaegt" << std::endl;
            usleep(500000);
            unsigned char data[2] = {0x00, 0x15};
            if (!writeData(file, data, sizeof(data))) {
                close(file);
                return;
            }
        } else {
            std::cout << "Anden vaerdi end 1 2 3 4: " << std::endl << "Vaerdien er: " << std::endl;
            for (std::size_t i = 0; i < sizeof(receivedData); ++i) {
                std::cout << (unsigned int)receivedData[i] << std::endl;
                usleep(100000);
            }
            unsigned int RealTime = receivedData[0];
            std::cout << "Tid: " << RealTime / 10 << "," << RealTime % 10 << " sekunder" << std::endl;
            break;
        }

        usleep(50000);
    }

    memset(receivedData, 0, sizeof(receivedData));
    close(file);
}
