import * as vscode from 'vscode';
import { StatusBarItems } from './interface';
import { join, resolve } from 'path';
import { platform } from 'os';
import { existsSync, mkdirSync, readdirSync, writeFile, statSync } from 'fs';
import { gitignore, maincpp, makefile, readme } from './templates'

export class CodeManage {

  private _terminal: vscode.Terminal;
  private _folderPath: string;
  private _items: StatusBarItems;
  private _watcher: vscode.FileSystemWatcher | null

  constructor(){

    this._terminal = vscode.window.createTerminal({
      name: 'Code Make',
      hideFromUser: true
    });
    this._folderPath = vscode.workspace?.workspaceFolders?.[0]?.uri?.fsPath as string;
    this._items = {
      create: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
      start:  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
    }
    this._watcher = null;
    this.setupFileSystemWatcher();
    this.updateStatusBar();

  }

  public start(){

    const binPath: string = join(resolve(this._folderPath), 'bin');
    
    try {
    
      const binStats = statSync(binPath);

      if (!binStats.isDirectory()) {
        this.build();
      } else {
        const files = readdirSync(binPath);
        if (files.length == 0) {
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

  public create(){
   
    try {

    if (!this._folderPath) return vscode.window.showErrorMessage('Please open a project folder first');
  
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
      'tests'
    ];
  
    folders.forEach((folder) => this.createFolder(this._folderPath, folder));
  
    this.createFile(join(this._folderPath, 'src', 'main.cpp'), maincpp);
    this.createFile(join(this._folderPath, '.gitignore'), gitignore);
    this.createFile(join(this._folderPath, 'Makefile'), makefile);
    this.createFile(join(this._folderPath, 'README.md'), readme);
    
    } catch (e) {
      console.log('An error occurred.', e);
    }

  }

  private build(){

    try {

      const srcFolder: string = join(this._folderPath, 'src');
      const mainFile: string = join(this._folderPath, 'src', 'main.cpp');

      if (!existsSync(srcFolder) && !existsSync(mainFile)) return vscode.window.showErrorMessage('No such file main.cpp or directory src');
        
      this.terminal('make');
  
    } catch (e) {
      console.log('An error occurred.', e);
    }

  }

  private updateStatusBar(){

    try {

      vscode.window.showInformationMessage('Update executed!');
  
      const srcPath: string = join(this._folderPath, 'src');
      const maincpp: string = join(this._folderPath, 'src', 'main.cpp');
      const includePath: string = join(this._folderPath, 'include');
      const makefilePath: string = join(this._folderPath, 'Makefile');
  
      const isProjectValid: boolean = existsSync(srcPath) && existsSync(maincpp) && existsSync(includePath) && existsSync(makefilePath);
  
      this._items.create.text = `$(heart)`;
      this._items.create.tooltip = 'Code Make (Create Project)';
      this._items.create.command = 'code-make-create.run';
      this._items.create.color = '#FF79C6';
  
      this._items.start.text = `$(debug-start)`;
      this._items.start.tooltip = 'Code Make (Start Project)';
      this._items.start.command = 'code-make-start.run';
      this._items.start.color = '#89D185';

      !isProjectValid 
        ? (this._items.create.show(), this._items.start.hide())
        : (this._items.start.show(), this._items.create.hide());

    } catch (e: any) {
      vscode.window.showErrorMessage(e.message || e.toString());
    }

  }
  
  private terminal(command: string) {

    try {

      if (this._terminal.exitStatus) this._terminal = vscode.window.createTerminal({
        name: 'Code Make',
        hideFromUser: true
      });
  
      this._terminal.show();
  
      platform() === 'win32' ? this._terminal.sendText('cls') : this._terminal.sendText('clear');
  
      this._terminal.sendText(`${command}`);
  
    } catch (e: any) {
      vscode.window.showErrorMessage(e);
    }

  }

  private createFolder(folderPath: string, folderName: string) {

    const fullPath: string = join(folderPath, folderName);

    if(!existsSync(fullPath)){
      try {
        mkdirSync(fullPath, { recursive: true });
      } catch (e) {
        vscode.window.showErrorMessage('Failed to create folder');
      }
    }

  }

  private createFile(filePath: string, templatePath: string) {

    if(!existsSync(filePath)){
      writeFile(filePath, templatePath, 'utf8', (err) => {
        if(err){
          console.error(err)
          vscode.window.showErrorMessage('Failed to create file');
        }
      })
    }
    
  }

  private setupFileSystemWatcher() {
    this._watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
    this._watcher.onDidChange(this.updateStatusBar.bind(this));
    this._watcher.onDidCreate(this.updateStatusBar.bind(this));
    this._watcher.onDidDelete(this.updateStatusBar.bind(this));
  }

};