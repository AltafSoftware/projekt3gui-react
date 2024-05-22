#include <iostream>  
#include <fcntl.h>
#include <unistd.h>
#include <linux/i2c-dev.h>
#include <sys/ioctl.h>
#include <cstring>
#include <chrono>
#include <thread>
#include <iostream>
using namespace std;
constexpr int PSoC_I2C_ADDR = 0x08;

//function to open the I2C device 
int openI2CDevice()
{
    int file;
    if((file=open("/dev/i2c-1",O_RDWR))<0)
    {
        perror("Failed to open the I2C bus");
        return -1;
    }
    return file;
}

//function to check the connection by trying to het the funtionality of the I2C bus
bool checkConnection(int file)
{
    unsigned long funcs;
    if(ioctl(file,I2C_FUNCS,&funcs)<0)
    {
        perror("could not get the I2C funtionality");
        return false;
    }
    return true;
}

//Functions to set the I2C slave adress
bool setI2CSlaveAddress(int file,int addr)
{
    if(ioctl(file,I2C_SLAVE,addr)<0)
    {
        perror("Failed to acquire bus access and/or talk to slave");
        return false;
    }
    return true;
}

//Function to write data to the I2C device
bool writeData(int file,const unsigned char* data,size_t lenght)
{
    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    if(write(file, data, lenght)!=lenght)
    {
        perror("Failed to write to the I2C bus");
    return false;
    }
    return true;
}


int main()
{
    //open the I2C device
    int file =openI2CDevice();
    if(file<0)
    {
        return 1;
    }

    //Check the connection
if(!checkConnection(file))
{
    close(file);
    return 1;
}

    //set the slave adress
    if(!setI2CSlaveAddress(file,PSoC_I2C_ADDR))
    {
        close(file);
        return 1;
    }
//Data to be sent 
unsigned char data[2]={0x00, 0x55};

//Write data to the I2C device
if(!writeData(file,data,sizeof(data)))
{
    close(file);
    return 1;
}


char receivedData[1];
usleep(10000); //1mil micro = 1sek
if (read(file,receivedData,sizeof(receivedData))!=sizeof(receivedData))
{
    perror("Failed to read from slave");
    close(file);
    return 1;
}

for(;;){
   
usleep(10000); //1mil micro = 1sek
if (read(file,receivedData,sizeof(receivedData))!=sizeof(receivedData))
{
    perror("Failed to read from slave");
    close(file);
    return 1;
}
for(auto i=0; i < sizeof(receivedData);++i)
    {
        cout << (unsigned int)receivedData[i] << endl;
        usleep(100000); 

    }

if(receivedData[0]== 1)
{
    cout<<"Begynd at fyld drik op" << endl;
}
else if (receivedData[0]== 2)
{
    uint8_t receivedData[4] = {0x01, 0x02, 0x03, 0x04};


   

   /* for(auto i=0; i < sizeof(receivedData);++i)
    {
        cout << (unsigned int)receivedData[i] << endl;
    } */ 

cout << "Stoerrelsen af array er: " << sizeof(receivedData) <<endl; 
}
else if(receivedData[0]== 3)
{
    cout<<"Startskop ikke registreret. Placer kop" << endl;
}
else if(receivedData[0]== 4)
{
    cout<<"Går fra ingen vaegt til vaegt" << endl;

    usleep(500000); //5 sekunder tror jeg

    unsigned char data[2]={0x00, 0x15};

    //Write data to the I2C device
    if(!writeData(file,data,sizeof(data))){
    close(file);
    return 1;
} 
}
else {
    cout<<"Anden vaerdi end 1 2 3 4: " << endl << "Vaerdien er: " << endl;
    for(auto i=0; i < sizeof(receivedData);++i)
    {
        cout << (unsigned int)receivedData[i] << endl;
        usleep(100000); 

    }
    unsigned int RealTime = receivedData[0];
    cout << "Tid: " << RealTime / 10 << "," << RealTime % 10 << " sekunder" << endl;


    break;
}



usleep(50000); 
}
memset(receivedData,0,sizeof(receivedData));



//close the I2C device
close(file); 
return 0;



}

