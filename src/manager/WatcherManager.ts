import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FileManager } from './FileManager';
import { ConfigManager } from './ConfigManager';
import { ProcessManager } from './ProcessManager';

export class WatcherManager {
  private _file: FileManager;
  private _config: ConfigManager;
  private _process: ProcessManager;
  private _watcher: vscode.FileSystemWatcher[] = [];
  private _recompile: boolean = false;

  constructor() {
    this._file     = new FileManager();
    this._config   = new ConfigManager();
    this._process  = new ProcessManager();
  }

  public set recompile(value: boolean) {
    this._recompile = value;
  }

  public get recompile(): boolean {
    return this._recompile;
  }
  
  public updateStatusBar() {

    if (!this._file.folderPath) {
      this._process.hideAllButtons();
      return;
    }
  
    const projectConfigs = [
      { type: 'C', dir: 'src', file: 'main.c', extra: ['Makefile'] },
      { type: 'C++', dir: 'src', file: 'main.cpp', extra: ['Makefile'] },
      { type: 'Go', dir: 'cmd', file: 'main.go', extra: ['go.mod', 'Makefile'] },
      { type: 'Java', dir: 'src', file: 'Main.java', extra: ['Makefile'] },
    ];
  
    const isProjectValid = projectConfigs.some(({ dir, file, extra }) => {
      const mainFileExists = this._file.findFileRecursive(path.join(this._file.folderPath!, dir), file);
      const extraFilesExist = extra.every(e => fs.existsSync(path.join(this._file.folderPath!, e)));
      return mainFileExists && extraFilesExist;
    });
  
    this._config.configureButton(this._process.items.create, '$(gear) Compile', 'Create Project', 'code-make-create.run', '#FF79C6');
    this._config.configureButton(this._process.items.start, '$(play) Run', 'Run Project', 'code-make-start.run', this._recompile ? '#FFD700' : '#89D185');
    this._config.configureButton(this._process.items.stop, '$(stop) Stop', 'Stop Project', 'code-make-stop.run', '#FF5555');
  
    if (!isProjectValid) {
      this._process.items.create.show();
      this._process.items.start.hide();
      this._process.items.stop.hide();
      return;
    }
  
    this._process.items.create.hide();
    this._process.items.start.show();
    this._process.items.stop.hide();
  
    const programName = this._file.getProgramNameFromMakefile();
    if (!programName) {
      vscode.window.showErrorMessage('Could not get program name from Makefile.');
      return;
    }
      
    const isWindows = os.platform() === "win32";
    const processName = isWindows ? programName.replace(/\.exe$/, '') : programName;
  
    this._process.monitorProcess(processName);
  }  

  public setupFileSystemWatcher() {
    const sourcePatterns = [
      '**/*build',
      '**/*.a',
      '**/*.c',
      '**/*.cpp',
      '**/*.h',
      '**/*.hpp',
      '**/*.go',
      '**/*.java',
      '**/*.jar',
      '**/*.sh',
      '**/*Makefile',
    ];
  
    sourcePatterns.forEach(pattern => {
      const watcher = vscode.workspace.createFileSystemWatcher(pattern);
      watcher.onDidChange(() => this.handleFileChange());
      watcher.onDidCreate(() => this.handleFileChange());
      watcher.onDidDelete(() => this.handleFileChange());
      this._watcher.push(watcher);
    });
  }

  private handleFileChange() {
    if (!this._process.runningP) {
      this.markForRecompile();
    }
  }

  private markForRecompile() {
    this._recompile = true;
    this.updateStatusBar();
  }

  public dispose() {
    this._watcher.forEach(watcher => watcher.dispose());
  }

}