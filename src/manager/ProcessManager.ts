import * as vscode from 'vscode';
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

  private async isProcessRunning(processName: string): Promise<boolean> {
    const psList = (await import('ps-list')).default;

    const processes = await psList();
    return processes.some(p => 
      p.name === processName || p.name === `${processName}.exe`
    );
  }

  public async monitorProcess(processName: string) {
    if (!this._isProcessRunning) {
      const running = await this.isProcessRunning(processName);
      this.toggleProcessButtons(running);
      this._isProcessRunning = running;
    }

    if (this._isRunningCheckInterval) {
      clearInterval(this._isRunningCheckInterval);
    }

    this._isRunningCheckInterval = setInterval(async () => {
      const isRunning = await this.isProcessRunning(processName);
      if (isRunning !== this._isProcessRunning) {
        this.toggleProcessButtons(isRunning);
        this._isProcessRunning = isRunning;
      }
    }, 500);
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