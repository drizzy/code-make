export const folders = [
'src/main/java/com/example',
'src/main/resources',
'src/test/java/com/example',
'lib',
'scripts',];

export const main = `package com.example;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World from Java!");
  }
}`;

export const makefile = `# ================================
# Makefile for Java project
# Cross-platform compatibility
# ================================

# change according to the name of the file to be executed
MAIN_CLASS := com.example.Main

# Detect OS
ifeq ($(OS),Windows_NT)
  DETECTED_OS := Windows
else
  DETECTED_OS := Unix
endif

# Detect OS and set correct file extensions and commands
ifeq ($(OS),Windows_NT)
  SHELL = cmd.exe
  MKDIR = if not exist "$(subst /,,$1)" mkdir "$(subst /,,$1)"
  RMDIR = if exist "$(subst /,,$1)" rmdir /s /q "$(subst /,,$1)"
  RM = if exist "$(subst /,,$1)" del /f /q
  FIND = cmd /c "for /r src %%i in (*.java) do @echo %%~fi"
  CLASSPATH_SEP = ;
else
  PRINTF = printf
  SHELL = /bin/sh
  MKDIR = mkdir -p $1
  RMDIR = rm -rf $1
  RM = rm -f $1
  FIND = find src -name "*.java"
  CLASSPATH_SEP = :

	RED    := \\033[31m
  GREEN  := \\033[32m
  CYAN   := \\033[36m
  RESET  := \\033[0m
endif

# Compiler and runner
JAVAC := javac
JAVA := java

# Directories
BIN := build
SRC := src
LIB := lib
COMPILE_FLAG := $(BIN)/.compiled

# Find all Java files recursively
SRCS := $(shell $(FIND))

# Find all JAR files in lib/
JARS := $(wildcard $(LIB)/*.jar)
CLASSPATH := $(BIN)$(if $(JARS),$(CLASSPATH_SEP)$(subst $(space),$(CLASSPATH_SEP),$(JARS)))

# Rule to compile Java files (only if there are changes)
.PHONY: all
all: $(BIN)/classes

$(BIN)/classes: $(SRCS) $(JARS)
	@$(call MKDIR,$(BIN))
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Compiling Java files... ' -ForegroundColor Cyan; Write-Host '' -ForegroundColor White"
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
		$(PRINTF) "$(CYAN)Compiling Java files...$(RESET)\\n"; \\
	fi
endif
	@$(JAVAC) -d $(BIN) -cp "$(CLASSPATH)" $(SRCS)
ifeq ($(DETECTED_OS),Windows)
	@if not exist $(COMPILE_FLAG) powershell -Command "Write-Host -NoNewline 'Compilation finished. ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
	@type nul > $(COMPILE_FLAG)
else
	@if [ ! -f $(COMPILE_FLAG) ]; then \\
		$(PRINTF) "$(GREEN)Compilation finished.$(RESET)\\n"; \\
		touch $(COMPILE_FLAG); \\
	fi
endif

# Rule to run the program
.PHONY: run
run: all
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Running: ' -ForegroundColor Cyan; Write-Host '$(MAIN_CLASS)' -ForegroundColor Green"
else
	@$(PRINTF) "$(CYAN)Running: $(GREEN)$(MAIN_CLASS)$(RESET)\\n"
endif
	@$(JAVA) -cp "$(CLASSPATH)" $(MAIN_CLASS)

# Rule to clean compiled files
.PHONY: clean
clean:
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Cleaning build files... ' -ForegroundColor Red; Write-Host '' -ForegroundColor White"
else
	@$(PRINTF) "$(RED)Cleaning build files...$(RESET)\\n"
endif
	@$(call RMDIR,$(BIN))
ifeq ($(DETECTED_OS),Windows)
	@powershell -Command "Write-Host -NoNewline 'Clean completed. ' -ForegroundColor Green; Write-Host '' -ForegroundColor White"
else
	@$(PRINTF) "$(GREEN)Clean completed.$(RESET)\\n"
endif`;