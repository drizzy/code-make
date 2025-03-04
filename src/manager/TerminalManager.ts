import * as vscode from 'vscode';
import * as os from 'os';

export class TerminalManager {

  private _terminal: vscode.Terminal | undefined;

  public async runCommand(command: string) {
    
    if (!this._terminal || this._terminal.exitStatus !== undefined) {
      this._terminal = vscode.window.createTerminal({
        name: 'CodeMake',
        hideFromUser: true,
      });
    }

    const shellPath = vscode.env.shell.toLowerCase();
    const isWindows = os.platform() === 'win32';
      
    let clearCommand: string;

    if (isWindows) {
      if (shellPath.includes('git') && shellPath.includes('bash.exe')) {
        clearCommand = 'clear';
      } else {
        clearCommand = 'cls';
      }
    } else {
      clearCommand = 'clear';
    }

    this._terminal.sendText(clearCommand);

    this._terminal.show();

    this._terminal.sendText(command);

  }

  public get dispose() {
    if (this._terminal) {
      return this._terminal.dispose();
    }
    return undefined;
  }
  
}
