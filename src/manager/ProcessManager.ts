import * as vscode from 'vscode';
import * as process from 'child_process';
import * as os from 'os';
import { StatusBarItems } from '../utils/types';

export class ProcessManager {
  private _items: StatusBarItems;
  private _isRunningCheckInterval: NodeJS.Timeout | null = null;
  private _isProcessRunning: boolean = false; 

  constructor() {
    this._items = {
      create: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
      start: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
      stop: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
    };
  }

  public get items(): StatusBarItems {
    return this._items;
  }

  public get running(): boolean {
    return this._isProcessRunning;
  }

  private isProcessRunning(processName: string): boolean {
  
    try {

      const isWindows = os.platform() === "win32";
        
      let command = isWindows ? `tasklist /FI "IMAGENAME eq ${processName}.exe"` : `ps aux`;

      const output = process.execSync(command, { stdio: 'pipe' }).toString();

      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes(processName) && !line.includes('grep')) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  public monitorProcess(processName: string) {

    if (!this._isProcessRunning) {
      this.toggleProcessButtons(this.isProcessRunning(processName));
    }

    if (this._isRunningCheckInterval) {
      clearInterval(this._isRunningCheckInterval);
    }

    this._isRunningCheckInterval = setInterval(() => {
      const isRunning = this.isProcessRunning(processName);
      if (isRunning !== this._isProcessRunning) {
        this.toggleProcessButtons(isRunning);
      }
    }, 1000);
  }
  
  private toggleProcessButtons(isRunning: boolean) {
    if (isRunning) {
      this._items.stop.show();
      this._items.start.hide();
    }else {
      this._items.start.show();
      this._items.stop.hide();
    }
    this._isProcessRunning = isRunning;
  }

  public hideAllButtons() {
    this._items.create.hide();
    this._items.start.hide();
    this._items.stop.hide();
  }

}