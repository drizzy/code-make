# Install Make

## windows

- The easiest option is to use [Chocolatey](https://chocolatey.org/install) . First you need to install this package manager. Once installed,
you can install `make` (you may need to run it in a terminal as administrator)

Install chocolatey
```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Install make on windows
```bash
choco install make
```

## GNU/Linux

- Ensure `make` is installed
- It is probably already installed to check open a terminal and execute the following command:

```bash
make --version
```

- If it is not installed do the following

- Before installing the make package, it is better to update your already installed packages; otherwise you may encounter compatibility issues with some software. You can do it by typing.

### Ubuntu

Update packages
```bash
sudo apt update
```

Install make on ubuntu
```bash
sudo apt install build-essential
```
The command installs a bunch of new packages including `gcc`, `g++` and `make`.


### Arch Linux

Update packages
```bash
sudo pacman -Syu
```

Install make on Arch Linux
```bash
sudo pacman -S make
```

## Mac
- With Homebrew installed on your Mac it's super easy to install `make`, it may require root permissions.

- If you don't have [Homebrew](https://docs.brew.sh/Installation) installed, read the documentation on how to install it.

Install make on Mac
```bash
brew install make
```

# Install GCC

## Windows
- Go to [ Mingw-w64](https://sourceforge.net/projects/mingw/files/Installer/mingw-get-setup.exe/download " Mingw-w64") 

- Look for **mingw-get-setup.exe** for downloading. Download it and launch the installer. Accept the terms and move on.

- You'll now see that the installer is connecting to the Internet and downloading a lot of tiny and small files. Wait till it ends.

- Right when it ends (which won't take long), you'll be presented a window with title **MinGW Installation Manager.** You should be in the 'Basic Setup' tab by default when it launches. If not, click on **Basic Setup.**

- Out of the numerous check boxes presented to you on the right side, tick "**mingw32-gcc-g++-bin**". If you are prompted with a menu, click on Mark for Install.

- Then on the top left corner click on **Installation > Apply Changes.** And wait while it downloads a billion files and installs them.

- Now you gotta edit your "Environment Variables" as well, so that gcc works in cmd no matter the file location.

- For that go to **Windows Explorer > Right click on This PC > Properties > Advanced system settings > Environment Variables** or you could just search for "Environment Variables" in Windows Search...

- At the bottom "System Variables" panel, look for a Variable named "Path" and double click on it. Some systems show a good UI for adding a New Path easily (by clicking New), else you just need to add ; at the end and add the following path

```bash
C:\MinGW\bin
```
`(This is assuming you didn't manually change any installation paths and went with just clicking 'Next' during installation)`

- Click on OK, and OK and close the other windows. Open a Command Prompt Terminal and try typing and press Enter. `gcc --version`

## GNU/Linux

- Ensure `gcc` is installed
- It is probably already installed to check open a terminal and execute the following command:

```bash
gcc --version
```

- If it is not installed do the following

### Ubuntu

Update packages
```bash
sudo apt update
```

Install gcc on ubuntu
```bash
sudo apt install build-essential
```
The command installs a bunch of new packages including `gcc`, `g++` and `make`.


### Arch Linux

Update packages
```bash
sudo pacman -Syu
```

Install gcc on Arch Linux
```bash
sudo pacman -S gcc
```

## Mac

- Ensure `Clang` is installed
- It is probably already installed to check open a terminal and execute the following command:

```bash
clang --version
```

- If it is not installed do the following

- Open "Terminal" (it is located in Applications/Utilities)
- In the terminal window, run the command 
```bash
xcode-select --install
```
- In the windows that pops up, click , and agree to the Terms of Service. `Install`
Once the installation is complete, the command line utilities should be set up property.
