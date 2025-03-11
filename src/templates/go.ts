export const folders = [
'cmd/app',
'config',
'internal/app',
'internal/middleware',
'internal/database',
'internal/repository',
'pkg/utils',
'scripts',
'test',];

export const main = `package main

import "fmt"
	
func main() {
	fmt.Println("Hello, World from Golang!")
}`;

export const makefile = `# ================================
# Makefile for Golang project
# Cross-platform compatibility
# ================================

# Executable name
TARGET := my-go-program

# Directories
CMD_DIR := cmd/app
BIN := build
COMPILE_FLAG := $(BIN)/.compiled

# Detect OS
ifeq ($(OS),Windows_NT)
  TARGET := $(TARGET).exe
  DETECTED_OS := Windows
else
  DETECTED_OS := Unix
endif

# System commands
ifeq ($(DETECTED_OS),Windows)
  SHELL = cmd.exe
  MKDIR = if not exist "$(subst /,,$1)" mkdir "$(subst /,,$1)"
  RMDIR = if exist "$(subst /,,$1)" rmdir /s /q "$(subst /,,$1)"
  RM = if exist "$(subst /,,$1)" del /f /q
	FILE_FLAG = type nul > $(COMPILE_FLAG)
  PS = powershell -Command "Write-Host -NoNewline '$(1)' -ForegroundColor $(2); Write-Host '$(3)' -ForegroundColor $(4)"
else
  SHELL = /bin/sh
  MKDIR = mkdir -p $1
  RMDIR = rm -rf $1
  RM = rm -f $1
	FILE_FLAG = touch $(COMPILE_FLAG)
define ANSI_COLOR
$(if $(filter $(1),Red),\\033[31m,$(if $(filter $(1),Green),\\033[32m,$(if $(filter $(1),Cyan),\\033[36m,$(if $(filter $(1),White),\\033[37m,\\033[0m))))
endef
  PS = printf "$(call ANSI_COLOR,$(2))$(1)$(call ANSI_COLOR,$(4))$(3)\\033[0m\\n"
endif

# Rule to build the Go project
.PHONY: build
build:
	@$(call MKDIR,$(BIN))
	@go build -o $(BIN)/$(TARGET) ./$(CMD_DIR)
	@$(FILE_FLAG)

# Rule to run the program
.PHONY: run
run: build
	@$(call PS,Running:, Cyan, $(TARGET), Green)
	@$(BIN)/$(TARGET)
	
# Rule to clean compiled files
.PHONY: clean
clean:
	@$(call PS,Cleaning build files:, Red, $(BIN)/$(TARGET), Green)
	@$(call RMDIR,$(BIN))
	@$(call PS,Clean completed!:, Red, $(BIN)/$(TARGET), Green)`;