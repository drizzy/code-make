import * as vscode from 'vscode';

export class TerminalManager {

  private _terminal: vscode.Terminal | undefined;

  public async runCommand(command: string) {
    
    if (!this._terminal || this._terminal.exitStatus !== undefined) {
      this._terminal = vscode.window.createTerminal({
        name: 'CodeMake',
        hideFromUser: true,
      });
    }

    await vscode.commands.executeCommand('workbench.action.terminal.clear');

    this._terminal.show();

    this._terminal.sendText(command);

  }

  public dispose(): void {
    if (this._terminal) {
      this._terminal.dispose();
      this._terminal = undefined;
    }
  }
}
