import * as vscode from 'vscode';
import { StatusBarItems } from './interface';
import { join, resolve } from 'path';
import { platform } from 'os';
import { existsSync, mkdirSync, readdirSync, statSync, Stats } from 'fs';
import { gitignore, maincpp, makefile, readme } from './templates';
import { promises as fsPromises } from 'fs';

export class CodeManage {
  private _terminal: vscode.Terminal;
  private _folderPath: string;
  private _items: StatusBarItems;
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

  private getFolderPath(): string {
    if (!vscode.workspace || !vscode.workspace.workspaceFolders) {
      return '';
    }
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  public start() {
    if (!this._folderPath) return;

    const binPath: string = join(resolve(this._folderPath), 'bin');
    try {
      const binStats: Stats = statSync(binPath);
      if (!binStats.isDirectory()) {
        this.build();
      } else {
        const files: string[] = readdirSync(binPath);
        if (files.length === 0) {
          this.build();
        } else {
          this.build();
          this.terminal('make run');
        }
      }
    } catch (e) {
      this.build();
    }
  }

  private updateStatusBar() {
    const isProjectValid =
      this._folderPath &&
      existsSync(join(this._folderPath, 'src')) &&
      existsSync(join(this._folderPath, 'src', 'main.cpp')) &&
      existsSync(join(this._folderPath, 'include')) &&
      existsSync(join(this._folderPath, 'Makefile'));

    this._items.create.text = `$(heart)`;
    this._items.create.tooltip = 'Create C++ Project';
    this._items.create.command = 'code-make-create.run';
    this._items.create.color = '#FF79C6';

    this._items.start.text = `$(debug-start)`;
    this._items.start.tooltip = 'Start C++ Project';
    this._items.start.command = 'code-make-start.run';
    this._items.start.color = '#89D185';

    !isProjectValid
      ? (this._items.create.show(), this._items.start.hide())
      : (this._items.start.show(), this._items.create.hide());
  }

  public create() {
    try {
      if (!this._folderPath) {
        return vscode.window.showErrorMessage('Please open a project folder first');
      }

      const folders: string[] = [
        'assets',
        'doc',
        'include',
        'include/core',
        'include/ui',
        'include/utils',
        'lib',
        'src',
        'src/core',
        'src/ui',
        'src/utils',
        'tests',
      ];

      folders.forEach((folder: string) => this.createFolder(this._folderPath, folder));

      this.createFile(join(this._folderPath, 'src', 'main.cpp'), maincpp);
      this.createFile(join(this._folderPath, '.gitignore'), gitignore);
      this.createFile(join(this._folderPath, 'Makefile'), makefile);
      this.createFile(join(this._folderPath, 'README.md'), readme);
    } catch (e) {
      console.log('An error occurred.', e);
    }
  }

  private build() {
    try {
      const srcFolder: string = join(this._folderPath, 'src');
      const mainFile: string = join(this._folderPath, 'src', 'main.cpp');

      if (!existsSync(srcFolder) && !existsSync(mainFile)) {
        return vscode.window.showErrorMessage('No such file main.cpp or directory src');
      }

      this.terminal('make');
    } catch (e) {
      console.log('An error occurred.', e);
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
      platform() === 'win32' ? this._terminal.sendText('cls') : this._terminal.sendText('clear');
      this._terminal.sendText(`${command}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Terminal error: ${error instanceof Error ? error.message : error}`);
    }
  }

  private createFolder(folderPath: string, folderName: string) {
    const fullPath: string = join(folderPath, folderName);

    if (!existsSync(fullPath)) {
      try {
        mkdirSync(fullPath, { recursive: true });
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create folder: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  private async createFile(filePath: string, templatePath: string) {
    if (!existsSync(filePath)) {
      try {
        await fsPromises.writeFile(filePath, templatePath, 'utf8');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create file: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  private setupFileSystemWatcher() {
    this._watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
    this._watcher.onDidChange(this.updateStatusBar.bind(this));
    this._watcher.onDidCreate(this.updateStatusBar.bind(this));
    this._watcher.onDidDelete(this.updateStatusBar.bind(this));
  }
}