# Compiler
CXX = g++

# Compiler flags
CXXFLAGS = -Wall -std=c++11 -pthread

# Include directories
INCLUDES = -Iinclude

# Libraries
LIBS = -lboost_system -ljsoncpp -latomic

# Source files
SRCS = src/main.cpp src/server.cpp src/hardware.cpp

# Object files
OBJS = $(SRCS:.cpp=.o)

# Executable
TARGET = server

# Default target
all: $(TARGET)

# Link
$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJS) $(LIBS)

# Compile
%.o: %.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -c $< -o $@

# Clean
clean:
	rm -f $(OBJS) $(TARGET)

# Phony targets
.PHONY: all clean
