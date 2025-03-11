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

# Compiler and runner
JAVAC := javac
JAVA := java

# Directories
BIN := build
SRC := src
LIB := lib
COMPILE_FLAG := $(BIN)/.compiled

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
  FILE_FLAG = type nul > $(COMPILE_FLAG)
  PS = powershell -Command "Write-Host -NoNewline '$(1)' -ForegroundColor $(2); Write-Host '$(3)' -ForegroundColor $(4)"
else
  PRINTF = printf
  SHELL = /bin/sh
  MKDIR = mkdir -p $1
  RMDIR = rm -rf $1
  RM = rm -f $1
  FIND = find src -name "*.java"
  CLASSPATH_SEP = :
	FILE_FLAG = touch $(COMPILE_FLAG)
define ANSI_COLOR
$(if $(filter $(1),Red),\\033[31m,$(if $(filter $(1),Green),\\033[32m,$(if $(filter $(1),Cyan),\\033[36m,$(if $(filter $(1),White),\\033[37m,\\033[0m))))
endef
  PS = printf "$(call ANSI_COLOR,$(2))$(1)$(call ANSI_COLOR,$(4))$(3)\\033[0m\\n"
endif

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
	@$(JAVAC) -d $(BIN) -cp "$(CLASSPATH)" $(SRCS)
	@$(FILE_FLAG)

# Rule to run the program
.PHONY: run
run: all
	@$(call PS,Running:, Cyan, $(MAIN_CLASS), Green)
	@$(JAVA) -cp "$(CLASSPATH)" $(MAIN_CLASS)

# Rule to clean compiled files
.PHONY: clean
clean:
	@$(call PS,Cleaning build files:, Red, $(BIN)/$(MAIN_CLASS), Green)
	@$(call RMDIR,$(BIN))
	@$(call PS,Clean completed!:, Red, $(BIN)/$(MAIN_CLASS), Green)`;