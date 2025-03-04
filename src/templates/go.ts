export const folders = [
'cmd/app',
'config',
'internal/app',
'internal/middleware',
'internal/database',
'internal/routes',
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
else
  SHELL = /bin/sh
  MKDIR = mkdir -p $1
  RMDIR = rm -rf $1
  RM = rm -f $1
    
  CYAN  := \\033[36m
  GREEN := \\033[32m
  RED   := \\033[31m
  RESET := \\033[0m
endif

# Directories
CMD_DIR := cmd/app
BIN := build
COMPILE_FLAG := $(BIN)/.compiled

# Commands
BUILD_CMD := go build -o $(BIN)/$(TARGET) ./$(CMD_DIR)
RUN_CMD := $(BIN)/$(TARGET)
CLEAN_CMD := $(call RMDIR,$(BIN))

# Rule to build the Go project
.PHONY: build
build:
	@$(call MKDIR,$(BIN))
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Building Go program... ' -ForegroundColor Cyan; Write-Host '' -ForegroundColor White"
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
		printf "$(CYAN)Building Go program...$(RESET)\\n"; \\
	fi
endif
	@$(BUILD_CMD)
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Build complete! ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
	@type nul > $(COMPILE_FLAG)
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
    printf "$(GREEN)Build complete!$(RESET)\\n"; \\
		touch $(COMPILE_FLAG); \\
	fi
endif

# Rule to run the program
.PHONY: run
run: build
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Running: ' -ForegroundColor Cyan; Write-Host '$(RUN_CMD)' -ForegroundColor Green"
else
	@printf "$(CYAN)Running: $(GREEN)$(RUN_CMD)$(RESET)\\n";
endif
	@$(RUN_CMD)

# Rule to clean compiled files
.PHONY: clean
clean:
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Cleaning build files... ' -ForegroundColor Red; Write-Host '' -ForegroundColor White"
else
	@printf "$(RED)Cleaning build files...$(RESET)\\n";
endif
	@$(CLEAN_CMD)
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Clean completed! ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
else
	@printf "$(GREEN)Clean completed!$(RESET)\\n";
endif`;