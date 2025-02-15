export const makeCPP =`# ================================
# Makefile for C++ project
# Cross-platform compatibility
# ================================

# Executable name
TARGET := my-cpp-program

# Detect OS
ifeq ($(OS),Windows_NT)
    TARGET := $(TARGET).exe
    DETECTED_OS := Windows
else
    DETECTED_OS := Unix
endif

# Comandos de sistema según el entorno
ifeq ($(DETECTED_OS),Windows)
    SHELL = cmd.exe
    MKDIR = if not exist "$(subst /,,$1)" mkdir "$(subst /,,$1)"
    RMDIR = if exist "$(subst /,,$1)" rmdir /s /q "$(subst /,,$1)"
    RM = if exist "$(subst /,,$1)" del /f /q
else
    SHELL = /bin/sh
    PRINTF = printf
    MKDIR = mkdir -p $1
    RMDIR = rm -rf $1
    RM = rm -f $1

    CYAN  := \\033[36m
    GREEN := \\033[32m
    RED   := \\033[31m
    RESET := \\033[0m
endif

# Compiler
CXX := g++

# Directories
BIN := build
SRC := src
OBJ := obj
LIB := lib
INCLUDE := include
COMPILE_FLAG := $(BIN)/.compiled

# Find source and header files (include both root and subdirectories)
SRCS := $(wildcard $(SRC)/*.cpp) $(wildcard $(SRC)/**/*.cpp)
HDRS := $(wildcard $(INCLUDE)/*.h) $(wildcard $(INCLUDE)/**/*.h)
OBJS := $(patsubst $(SRC)/%.cpp, $(OBJ)/%.o, $(SRCS))

# Check if pkg-config is available
NULL_DEVICE := $(if $(ComSpec),NUL,/dev/null)

PKG_CONFIG := $(shell command -v pkg-config 2>$(NULL_DEVICE))

ifneq ($(PKG_CONFIG),)
    PKG_FLAGS := $(shell pkg-config --cflags gtkmm-4.0 2>$(NULL_DEVICE))
    PKG_LIBS  := $(shell pkg-config --libs gtkmm-4.0 2>$(NULL_DEVICE))
else
    PKG_FLAGS :=
    PKG_LIBS :=
endif

# Find static libraries in lib/
LIBS_STATIC := $(wildcard $(LIB)/*.a)

# Additional libraries
LIBS_EXTRA ?=

# Compiler flags (includes headers and compiler flags)
CXXFLAGS := -Wall -std=c++17 -I$(INCLUDE) $(PKG_FLAGS)

# Linker flags (libraries from lib/ and system libraries)
LFLAGS := $(PKG_LIBS) $(LIBS_STATIC) $(LIBS_EXTRA)

# Rule to compile the project (checks .compiled)
.PHONY: all
all: $(BIN)/$(TARGET)
$(BIN)/$(TARGET): $(OBJS)
	@$(call MKDIR,$(BIN))
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Linking... ' -ForegroundColor Cyan; Write-Host '' -ForegroundColor White"
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
		$(PRINTF) "$(CYAN)Linking...$(RESET)\\n"; \\
	fi
endif
	@$(CXX) $(OBJS) $(LFLAGS) -o $@
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Build complete! ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
	@type nul > $(COMPILE_FLAG)
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
        $(PRINTF) "$(GREEN)Build complete!$(RESET)\\n"; \\
		touch $(COMPILE_FLAG); \\
	fi
endif

# Rule to create object files
$(OBJ)/%.o: $(SRC)/%.cpp $(HDRS)
	@$(call MKDIR,$(dir $@))
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Compiling: ' -ForegroundColor Cyan; Write-Host '$<' -ForegroundColor Green"
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
	    $(PRINTF) "$(CYAN)Compiling: $(GREEN)$<$(RESET)\\n"; \\
	fi
endif
	@$(CXX) $(CXXFLAGS) -c $< -o $@

# Rule to run the program
.PHONY: run
run: all
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Running: ' -ForegroundColor Cyan; Write-Host '$(BIN)/$(TARGET)' -ForegroundColor Green"
else
	@$(PRINTF) "$(CYAN)Running: $(GREEN)$(BIN)/$(TARGET) $(RESET)\\n";
endif
	@$(BIN)/$(TARGET)

# Rule to clean compiled files
.PHONY: clean
clean:
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Cleaning build files... ' -ForegroundColor Red; Write-Host '' -ForegroundColor White"
else
	@$(PRINTF) "$(RED)Cleaning build files...$(RESET)\\n";
endif
	@$(call RMDIR,$(BIN))
	@$(call RMDIR,$(OBJ))
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Clean completed! ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
else
	@$(PRINTF) "$(GREEN)Clean completed!$(RESET)\\n";
endif`;

export const mainCPP =`#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
  cout << "Hello, World from C++!" << endl;
  return 0;
}`;