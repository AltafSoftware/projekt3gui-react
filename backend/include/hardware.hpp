#ifndef HARDWARE_HPP
#define HARDWARE_HPP

constexpr int PSoC_I2C_ADDR = 0x08;

int openI2CDevice();
bool checkConnection(int file);
bool setI2CSlaveAddress(int file, int addr);
bool writeData(int file, const unsigned char* data, size_t length);
void readI2CData(int file);

#endif // HARDWARE_HPP
