# Install Make

## Windows

The easiest way to install `make` on Windows is by using [Chocolatey](https://chocolatey.org/install). Follow these steps:

1. Install Chocolatey by running the following command in a PowerShell with administrator privileges:

    ```powershell
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    ```

2. Once Chocolatey is installed, run the following command to install `make`:

    ```powershell
    choco install make
    ```

## GNU/Linux

Ensure that `make` is installed by checking its version:

```bash
make --version
```

If it's not installed, follow the instructions for your distribution:

#### Ubuntu

```bash
sudo apt update
sudo apt install build-essential
```

#### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S make
```

## macOS

You can install `make` through [Homebrew](https://docs.brew.sh/Installation), a popular package management system for macOS. If you don't have Homebrew installed yet, you can do so with the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installing Homebrew, use the following command to install make:

```bash
brew install make
```

# Install GCC

## Windows  

To install GCC on Windows using Chocolatey, follow these steps:  

1. Make sure you have [Chocolatey](https://chocolatey.org/install) installed on your system.  

2. Open a PowerShell terminal as an administrator and run the following command to install `mingw`:  

```powershell
choco install mingw -y
```

3. Once the installation is complete, verify that GCC is installed by running:

```powershell
gcc --version
```

This will install `mingw` and automatically configure the environment variables.


## GNU/Linux

Ensure that gcc is installed by checking its version:

```bash
gcc --version
```

If it's not installed, follow the instructions for your distribution:

#### Ubuntu

```bash
sudo apt update
sudo apt install build-essential
```

#### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S gcc
```

## macOS  

macOS includes `clang` as the default compiler. To check if `clang` or `gcc` is installed, run:  

```bash
clang --version
gcc --version
```

### Installing Clang (if not available)

If `clang` is not installed, you can install the Xcode command line tools by running:

```bash
xcode-select --install
```
In the window that appears, click **"Install"** and agree to the Terms of Service. Once the installation is complete, `clang` should be properly set up.

### Installing GCC with Homebrew

If you need `gcc` instead of `clang`, you can install it using [Homebrew](https://brew.sh/).

If Homebrew is not installed, first install it by running:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then, install gcc with:

```bash
brew install gcc
```

This will install the latest version of `gcc`, including the C++ compiler (`g++`).

### Verify the Installation

After installation, ensure that both compilers are working correctly by running:

```bash
clang --version
gcc --version
g++ --version
```

# Install Go

## Windows

To install Go on Windows, follow these steps:

1. Download the latest version of Go from the [official Go website](https://go.dev/).

2. Run the installer and follow the on-screen instructions.

3. Once the installation is complete, open a Command Prompt and check the Go version by running:

```bash
go version
```

4. Ensure that the Go binary is in your Path by running:

```powershell
echo %GOPATH%
```

If the GOPATH is not set, add the Go binary directory to your Path by doing the following:

- Right-click on This PC > Properties > Advanced system settings.
- Click on **Environment Variables**, then find the Path variable and click **Edit**.
- Add the Go binary path, typically: `:\Go\bin`.

## GNU/Linux

Ensure that Go is installed by checking its version:

```bash
go version
```

If it's not installed, follow the instructions for your distribution:

#### Ubuntu

```bash
sudo apt update
sudo apt install golang
```

#### Arch Linux
```bash
sudo pacman -Syu
sudo pacman -S go
```

## macOS

You can install Go through [Homebrew](https://docs.brew.sh/Installation). If you don't have Homebrew installed yet, you can do so with the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installing Homebrew, use the following command to install Go:

```bash
brew install go
```

To verify the installation, run:

```bash
go version
```

This will install the latest version of Go.

### Verify Installation

After installation, ensure that Golang is properly set up by checking its version:

```bash
go version
```

This should return the installed version of Golang, confirming the installation was successful.

# Install Java

## Windows  

To install Java on Windows using Chocolatey, follow these steps:  

1. Make sure you have [Chocolatey](https://chocolatey.org/install) installed on your system.  

2. Open a PowerShell terminal as an administrator and run the following command to install the latest JDK:  

```powershell
   choco install openjdk -y
```

3. Once the installation is complete, verify that Java is installed by running:

```powershell
   java -version
```

4. Ensure that the Java binary is in your `Path` by checking:

```powershell
   echo $env:JAVA_HOME
```

If the `JAVA_HOME` variable is not set, restart your computer, as Chocolatey typically configures it automatically. If necessary, manually set it by following these steps:

- Right-click on **This PC > Properties > Advanced system settings**.
- Click on **Environment Variables**, then find the **Path** variable under **System variables** and click **Edit**.
- Add the Java binary path (e.g., `C:\Program Files\Eclipse Adoptium\jdk-<version>\bin`) to the **Path** variable.
- Create a new system variable `JAVA_HOME` with the path to your Java JDK directory (e.g., `C:\Program Files\Eclipse Adoptium\jdk-<version>`).

## GNU/Linux

Ensure that Java is installed by checking its version:

```bash
java -version
```

If it's not installed, follow the instructions for your distribution:

#### Ubuntu

```bash
sudo apt update
sudo apt install openjdk-11-jdk
```

#### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S jdk-openjdk
```

## macOS

You can install Java through [Homebrew](https://docs.brew.sh/Installation). If you don't have Homebrew installed yet, you can do so with the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installing Homebrew, use the following command to install Java:

```bash
brew install openjdk@11
```

To link it properly after installation, run:

```bash
brew link --force --overwrite openjdk@11
```

### Verify Installation
After installation, ensure that Java is properly set up by checking its version:

```bash
java -version
```
This should return the installed version of Java, confirming the installation was successful.

> **Note:**  
> Please refer to your operating system's specific instructions to install Make, GCC, Go, and Java correctly.
