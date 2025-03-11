import * as vscode from 'vscode';
import * as path from 'path';
import { FileManager } from '../manager/FileManager';
import { ConfigManager } from '../manager/ConfigManager';
import { TerminalManager } from '../manager/TerminalManager';
import { WatcherManager } from '../manager/WatcherManager';
import { Language } from '../utils/types';

export class MakefileManager {
  private _file: FileManager;
  private _config: ConfigManager;
  private _terminal: TerminalManager;
  private _watcher: WatcherManager;
  private _isRunning: boolean = false;

  constructor() {
    this._file     = new FileManager();
    this._config   = new ConfigManager();
    this._terminal = new TerminalManager();
    this._watcher  = new WatcherManager();
   
    this._watcher.setupFileSystemWatcher();
    this._watcher.updateStatusBar();
  }

  public async create(language: Language = 'c') {
    try {

      if (!this._file.folderPath) {
        return vscode.window.showErrorMessage('Please open a project folder first');
      }
  
      const languageConfig = this._config.configureLanguage(language);
      if (!languageConfig) {
        return vscode.window.showErrorMessage('Unsupported language');
      }
  
      languageConfig.folders.forEach((folder) => this._file.createFolder(this._file.folderPath, folder));
  
      this._file.createFile(path.join(this._file.folderPath, languageConfig.mainFilePath), languageConfig.mainFileContent);
      this._file.createFile(path.join(this._file.folderPath, 'Makefile'), languageConfig.makefileContent);
  
      if (language === 'go') {
        const moduleName = await vscode.window.showInputBox({
          prompt: 'Enter the Go module name (e.g., github.com/username/project)',
          placeHolder: 'github.com/username/project',
        });
  
        if (moduleName) {
          this._terminal.runCommand(`go mod init ${moduleName}`);
          setTimeout(() => {
            this._watcher.updateStatusBar();
          }, 2000);
        } else {
          vscode.window.showErrorMessage('Go module name is required.');
          return;
        }
      }
  
      this._file.createFile(path.join(this._file.folderPath, '.gitignore'), languageConfig.gitignore);
      this._file.createFile(path.join(this._file.folderPath, 'README.md'), languageConfig.readme);

      vscode.window.showInformationMessage(`Project created successfully for ${language}!`);

    } catch (e) {
      console.log('An error occurred.', e);
      vscode.window.showErrorMessage('Failed to create project.');
    }
  }
  
  public async start() {

    if (!this._file.folderPath) {
      vscode.window.showErrorMessage('Please open a project folder first.');
      return;
    }
    
    this._isRunning = true;
    this._watcher.updateStatusBar();
    this._terminal.runCommand('make run');
  }

  public stop() {
    if (!this._isRunning) {
      return;
    }
  
    this._isRunning = false;
  
    try {
      if (this._terminal) {
        this._terminal.dispose;
      }
    } catch (e) {
      vscode.window.showErrorMessage('Failed to stop project.');
    } finally {
      this._watcher.updateStatusBar();
    }
  }
  
}