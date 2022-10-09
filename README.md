# Code Make

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/drizzy.code-make.svg)](https://marketplace.visualstudio.com/items?itemName=drizzy.code-make)
[![Downloads](https://vsmarketplacebadge.apphb.com/downloads-short/drizzy.code-make.svg)](https://marketplace.visualstudio.com/items?itemName=drizzy.code-make)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/drizzy.code-make.svg)](https://marketplace.visualstudio.com/items?itemName=drizzy.code-make)

## Features

Create projects in c++ Compile and run the program directly from the vscode interface just by pressing an icon.

## Requirements

* You have to have `make` installed on your computer ([see instructions](docs/SETUP.md#make)) 
* If you are on linux you must install `gcc` ([see instructions](docs/ETUP.md#linux))
* If you are on window you must install `mingw` ([see instructions](docs/SETUP.md#windows))
* If you are on mac os you must install `clang` ([see instructions](docs/SETUP.md#mac))

## How to use

After installing the extension I'm sure you saw a `+` symbol in the bottom left corner, if you click on it it will create a C++ project structure for you.
To compile just click the gear wheel, the play symbol to run the program, the trash can to delete files from the `bin` and `obj` directories, and x is to delete both directories.

## Keybindings
| Linux  | Windows | Mac | Description  |
| ------------ | ------------ | ------------ | ------------ |
| ctrl+alt+f   | ctrl+alt+f | ctrl+alt+f   | Make Create Folder |
| ctrl+alt+b   | ctrl+alt+b | ctrl+alt+b   | Make Build Folder  |
| ctrl+alt+r   | ctrl+alt+r | ctrl+alt+r   | Make Run Folder    |
| ctrl+alt+c   | ctrl+alt+c | ctrl+alt+c   | Make Clean Folder  |
| ctrl+alt+d   | ctrl+alt+d | ctrl+alt+d   | Make Delete Folder |

## Release Notes

Refer to [CHANGELOG](CHANGELOG.md)