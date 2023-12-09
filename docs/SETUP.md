# Install Make

## Windows

The easiest way to install `make` on Windows is by using [Chocolatey](https://chocolatey.org/install). Follow these steps:

1. Install Chocolatey by running the following command in a terminal with administrator privileges:

    ```bash
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    ```

2. Once Chocolatey is installed, run the following command to install `make`:

    ```bash
    choco install make
    ```

## GNU/Linux

Ensure that `make` is installed by checking its version:

```bash
make --version
```

If it's not installed, follow the instructions for your distribution:

### Ubuntu

```bash
sudo apt update
sudo apt install build-essential
```

### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S make
```

## Mac

If you're on macOS and have [Homebrew](https://docs.brew.sh/Installation) installed, you can easily install make with the following command:

```bash
brew install make
```

# Install GCC

## Windows

To install gcc on Windows, follow these steps:

Download [ Mingw-w64](https://sourceforge.net/projects/mingw/files/Installer/mingw-get-setup.exe/download " Mingw-w64")  and launch the installer.

In the "MinGW Installation Manager," select "mingw32-gcc-g++-bin" and click "Installation > Apply Changes."

Edit your "Environment Variables" by adding the following path to the end of the "Path" variable:

```bash
C:\MinGW\bin
```
`(Assuming you didn't manually change any installation paths). Open a Command Prompt terminal and verify the installation with:`

```bash
gcc --version
```

## GNU/Linux

Ensure that gcc is installed by checking its version:

```bash
gcc --version
```

If it's not installed, follow the instructions for your distribution:

### Ubuntu

```bash
sudo apt update
sudo apt install build-essential

```

### Arch Linux

```bash
sudo pacman -Syu
sudo pacman -S gcc

```

## Mac

Ensure that Clang is installed by checking its version:

```bash
clang --version
```

If it's not installed, open "Terminal" and run the command:

```bash
xcode-select --install
```
In the window that pops up, click "Install" and agree to the Terms of Service. Once the installation is complete, the command line utilities should be set up properly.

Refer to the specific instructions for your operating system to install make and gcc successfully.
