# Change Log

### [v3.1.0](https://github.com/drizzy/code-make/releases/tag/v3.1.0)

> 03 March 2025

### Features

- **Added a new function** to stop the program when required.
- **Improved Status Bar Updates**: The extension now ensures that the status bar shows the correct button based on the program's current state (compile, run, stop) without unnecessary delays.
- **Optimized Start/Stop Button Logic**: The "Run" button is now only visible when there is a valid project and the program is not currently running, while the "Stop" button appears when the program is actively running.
- **Optimized Process Check**: The extension now checks the process state every few seconds, ensuring the buttons reflect the actual status without introducing unnecessary performance overhead.

### [v3.0.0](https://github.com/drizzy/code-make/releases/tag/v3.0.0)

> 15 February 2025

### Features

- Now supports C, C++, Golang, and Java.
- The Makefile for each programming language is configured to work with all operating systems.
- The project structure adapts dynamically based on the selected language.
- Status bar improvements: Icons have been updated for better visual representation and usability. The build button now uses ⚙️ Compile and the run button has a more intuitive icon. ▶ Run

### [v2.2.1](https://github.com/drizzy/code-make/releases/tag/v2.2.1)

> 08 November 2024

### Note

This release corrects an unintentional versioning error from `v2.2.0` to maintain continuity. This release does not introduce any new features or functionality changes.

### [v2.1.0](https://github.com/drizzy/code-make/releases/tag/v2.1.0)

> 04 November 2024

### Features

- Icons now display directly without requiring an active workspace.
- Workspace warning only appears when attempting to create a project.
- Optimized folder and file checks to avoid unnecessary errors when opening Visual Studio Code.
- The project creation icon remains a heart, and the play icon now compiles and runs the project.
- Improved status bar update logic, ensuring icons are always visible.

### [v2.0.0](https://github.com/drizzy/code-make/releases/tag/v2.0.0)

> 25 December 2023

### Features

- Project migrated to TypeScript. 
- A more complete structure for the development of your programs. 
- Icons are now located in the bottom right corner. 
- The icon for creating a C++ project is now a heart. 
- The Play icon compiles and runs the program. 
- Faster when creating and compiling your projects.

### [v1.2.0](https://github.com/drizzy/code-make/releases/tag/v1.2.0)

> 02 December 2023

### Features

- Improved performance by avoiding frequent status bar updates
- Commands and key assignments removed
- Flags for compiling programs with SDL2 added to Makefile

### [v1.1.0](https://github.com/drizzy/code-make/releases/tag/v1.1.0)

> 22 November 2023

### Features

- Makefile change to support libraries like gkmm.h

### [v1.0.2](https://github.com/drizzy/code-make/releases/tag/v1.0.2)

> 01 February 2023

### Features

- Add flags in makefile

### [v1.0.1](https://github.com/drizzy/code-make/releases/tag/v1.0.1)

> 08 October 2022

### Features

- Problems creating projects on windows fixed

- Brief documentation to be able to install `make`

- Brief documentation to be able to install the `C++ compiler`

- Modification of the `Makefile` for better compilation

### [v1.0.0](https://github.com/drizzy/code-make/releases/tag/v1.0.0)

> 04 October 2022

### Features

- Initial release