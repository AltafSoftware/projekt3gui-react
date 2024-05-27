#ifndef HARDWARE_HPP
#define HARDWARE_HPP

#include <cstddef>  // Add this line to include size_t

constexpr int PSoC_I2C_ADDR = 0x08;

int openI2CDevice();
bool checkConnection(int file);
bool setI2CSlaveAddress(int file, int addr);
bool writeData(int file, const unsigned char* data, std::size_t length);  // Changed size_t to std::size_t
void readI2CData(int file);

#endif // HARDWARE_HPP
