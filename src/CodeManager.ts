import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as SBar from './interface';
import * as c from './templates/c';
import * as cpp from './templates/cpp';
import * as go from './templates/go';
import * as java from './templates/java';
import * as misc from './templates/misc';

export class CodeManage {
  private _terminal: vscode.Terminal;
  private _folderPath: string;
  private _items: SBar.StatusBarItems;
  private _watcher: vscode.FileSystemWatcher | null;

  constructor() {
    this._terminal = vscode.window.createTerminal({
      name: 'Code Make',
      hideFromUser: true,
    });
    this._folderPath = this.getFolderPath();
    this._items = {
      create: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
      start: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
    };
    this._watcher = null;

    this.setupFileSystemWatcher();
    this.updateStatusBar();
  }

  public async create(language: string = 'cpp') {
    try {
      if (!this._folderPath) {
        return vscode.window.showErrorMessage('Please open a project folder first');
      }
  
      if (language === 'cpp') {
        const folders = [
          'assets',
          'docs',
          'include/app',
          'include/core',
          'include/utils',
          'lib',
          'scripts',
          'src/app',
          'src/core',
          'src/utils',
          'test',
        ];
  
        folders.forEach((folder) => this.createFolder(this._folderPath, folder));
  
        this.createFile(path.join(this._folderPath, 'src', 'main.cpp'), cpp.mainCPP);
        this.createFile(path.join(this._folderPath, 'Makefile'), cpp.makeCPP);
  
      } else if (language === 'c') {
        const folders = [
          'assets',
          'docs',
          'include/app',
          'include/core',
          'include/utils',
          'lib',
          'scripts',
          'src/app',
          'src/core',
          'src/utils',
          'test',
        ];
  
        folders.forEach((folder) => this.createFolder(this._folderPath, folder));
  
        this.createFile(path.join(this._folderPath, 'src', 'main.c'), c.mainC);
        this.createFile(path.join(this._folderPath, 'Makefile'), c.makeC);
  
      } else if (language === 'go') {
        const folders = [
          'assets',
          'api',
          'cmd',
          'configs',
          'docs',
          'internal/app',
          'pkg/utils',
          'scripts',
          'test',
        ];
  
        folders.forEach((folder) => this.createFolder(this._folderPath, folder));
  
        this.createFile(path.join(this._folderPath, 'main.go'), go.mainGo);
        this.createFile(path.join(this._folderPath, 'Makefile'), go.makeGo);
  
        const moduleName = await vscode.window.showInputBox({
          prompt: 'Enter the Go module name (e.g., github.com/username/project)',
          placeHolder: 'github.com/username/project',
        });
  
        if (moduleName) {
          this.terminal(`go mod init ${moduleName}`);
        } else {
          vscode.window.showErrorMessage('Go module name is required.');
          return;
        }
  
      } else if (language === 'java') {
        const folders = [
          'assets',
          'docs',
          'src/com/example',
          'lib',
          'scripts',
          'test',
        ];
  
        folders.forEach((folder) => this.createFolder(this._folderPath, folder));
  
        this.createFile(path.join(this._folderPath, 'src', 'com', 'example', 'Main.java'), java.mainJava);
        this.createFile(path.join(this._folderPath, 'Makefile'), java.makeJava);
      }
      
      this.createFile(path.join(this._folderPath, '.gitignore'), misc.gitignore);
      this.createFile(path.join(this._folderPath, 'README.md'), misc.readme);
      
      vscode.window.showInformationMessage(`Project created successfully for ${language}!`);
    } catch (e) {
      console.log('An error occurred.', e);
      vscode.window.showErrorMessage('Failed to create project.');
    }
  }

  private build() {
    try {

      if (!this._folderPath) {
        return vscode.window.showErrorMessage('No project folder is open.');
      }

      const mainC = this.findFileRecursive(path.join(this._folderPath, 'src'), 'main.c');
      const mainCpp = this.findFileRecursive(path.join(this._folderPath, 'src'), 'main.cpp');
      const mainGo = this.findFileRecursive(this._folderPath, 'main.go');
      const mainJava = this.findFileRecursive(path.join(this._folderPath, 'src'), 'Main.java');

      const isCProject = mainC && fs.existsSync(path.join(this._folderPath, 'Makefile'));
      const isCppProject = mainCpp && fs.existsSync(path.join(this._folderPath, 'Makefile'));
      const isJavaProject = mainJava && fs.existsSync(path.join(this._folderPath, 'Makefile'));
      const isGoProject = 
        mainGo && 
        fs.existsSync(path.join(this._folderPath, 'go.mod')) &&
        fs.existsSync(path.join(this._folderPath, 'Makefile'));

      if (isCProject) {
        this.terminal('make');
      } else if (isCppProject) {
        this.terminal('make');
      } else if (isGoProject) {
        this.terminal('make');
      } else if (isJavaProject) {
        this.terminal('make');
      } else {
        return vscode.window.showErrorMessage('No valid project found.');
      }
        
    } catch (e) {
        console.log('An error occurred.', e);
        vscode.window.showErrorMessage('Failed to build the project.');
    }
  }

  public start() {

    if (!this._folderPath) {
      return;
    }

    const binPath: string = path.join(path.resolve(this._folderPath), 'build');
    try {
      const binStats = fs.statSync(binPath);
      if (!binStats.isDirectory()) {
        this.build();
      } else {
        const files: string[] = fs.readdirSync(binPath);
        if (files.length === 0) {
          this.build();
        } else {
          this.terminal('make run');
        }
      }
    } catch (e) {
      this.build();
    }
  }

  private terminal(command: string) {
    try {

      if (this._terminal.exitStatus) {
        this._terminal = vscode.window.createTerminal({
          name: 'Code Make',
          hideFromUser: true,
        });
      }

      this._terminal.show();

      const isWindows = os.platform() === "win32";

      const shellPath = vscode.env.shell.toLowerCase();

      let clearCommand;
      if (isWindows) {
        if (shellPath.includes("git") && shellPath.includes("bash.exe")) {
          clearCommand = "clear";
        } else {
          clearCommand = "cls";
        }
      } else {
        clearCommand = "clear";
      }

      this._terminal.sendText(`${clearCommand}`);
      this._terminal.sendText(`${command}`);

    } catch (error) {
      vscode.window.showErrorMessage(`Terminal error: ${error instanceof Error ? error.message : error}`);
    }
  }

  private updateStatusBar() {
    if (!this._folderPath) {
      this._items.create.hide();
      this._items.start.hide();
      return;
    }
  
    const isCProject = 
      this.findFileRecursive(path.join(this._folderPath, 'src'), 'main.c') &&
      fs.existsSync(path.join(this._folderPath, 'Makefile'));
  
    const isCppProject = 
      this.findFileRecursive(path.join(this._folderPath, 'src'), 'main.cpp') &&
      fs.existsSync(path.join(this._folderPath, 'Makefile'));
  
    const isGoProject = 
      fs.existsSync(path.join(this._folderPath, 'go.mod')) &&
      fs.existsSync(path.join(this._folderPath, 'Makefile')) &&
      this.findFileRecursive(this._folderPath, 'main.go');
  
    const isJavaProject = 
      this.findFileRecursive(path.join(this._folderPath, 'src'), 'Main.java') &&
      fs.existsSync(path.join(this._folderPath, 'Makefile'));
    
    const isProjectValid = isCppProject || isCProject || isGoProject || isJavaProject;
  
    this._items.create.text = `$(gear) Compile`;
    this._items.create.tooltip = 'Create Project';
    this._items.create.command = 'code-make-create.run';
    this._items.create.color = '#FF79C6';
  
    this._items.start.text = `$(play) Run`;
    this._items.start.tooltip = 'Run Project';
    this._items.start.command = 'code-make-start.run';
    this._items.start.color = '#89D185';
  
    if (!isProjectValid) {
      this._items.create.show();
      this._items.start.hide();
    } else {
      this._items.start.show();
      this._items.create.hide();
    }
  }

  private setupFileSystemWatcher() {
    this._watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
    this._watcher.onDidChange(this.updateStatusBar.bind(this));
    this._watcher.onDidCreate(this.updateStatusBar.bind(this));
    this._watcher.onDidDelete(this.updateStatusBar.bind(this));
  }
  
  private createFolder(folderPath: string, folderName: string) {
    const fullPath: string = path.join(folderPath, folderName);

    if (!fs.existsSync(fullPath)) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create folder: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  private async createFile(filePath: string, templatePath: string) {
    if (!fs.existsSync(filePath)) {
      try {
        await fs.promises.writeFile(filePath, templatePath, 'utf8');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create file: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  private getFolderPath(): string {
    if (!vscode.workspace || !vscode.workspace.workspaceFolders) {
      return '';
    }
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  private findFileRecursive(startPath: string, filename: string): boolean {
    if (!fs.existsSync(startPath)) {
      return false;
    }

    const files = fs.readdirSync(startPath);
    for (const file of files) {
      const fullPath = path.join(startPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (this.findFileRecursive(fullPath, filename)) {
          return true;
        }
      } else if (file === filename) {
        return true;
      }
    }
    return false;
  }

}