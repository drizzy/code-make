import * as vscode from 'vscode';
import * as os from 'os';
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
    
    this._watcher.updateStatusBar();
    this._terminal.runCommand('make run');
  }

  public async stop() {
    const programName = this._file.getProgramNameFromMakefile();

    if (!programName) {
      vscode.window.showErrorMessage('The name of the program to stop could not be determined.');
      return;
    }

    try {
      const isWin = os.platform() === 'win32';
      const psList = (await import('ps-list')).default;
      const processes = await psList();
      let processFound = false;

      for (const p of processes) {
        const nameMatch = p.name === programName || p.name === `${programName}.exe`;
        const cmdMatch = p.cmd && p.cmd.includes(programName);

        if (nameMatch || cmdMatch) {
          processFound = true;
          try {
            process.kill(p.pid, isWin ? undefined : 'SIGKILL');
            console.log(`Killed process: ${p.name} (PID: ${p.pid})`);
          } catch (killError) {
            console.error(`Failed to kill process ${p.pid}:`, killError);
          }
        }
      }

      const orphanedTerminals = vscode.window.terminals.filter(t => t.name === 'CodeMake');
      for (const terminal of orphanedTerminals) {
        try {
          terminal.dispose();
          console.log(`Disposed orphaned terminal: ${terminal.name}`);
        } catch (disposeError) {
          console.error('Failed to dispose terminal:', disposeError);
        }
      }

      if (this._terminal) {
        try {
          this._terminal.dispose();
        } catch (disposeError) {
          console.error('Failed to dispose current terminal:', disposeError);
        }
      }

      if (!processFound) {
        vscode.window.showWarningMessage('No running process was found to stop.');
      }

    } catch (e) {
      const error = e as Error;
      vscode.window.showErrorMessage(`Failed to stop process: ${error.message}`);
    } finally {
      this._watcher?.updateStatusBar();
    }
  }
}