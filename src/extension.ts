import * as vscode from 'vscode';
import { CodeManage } from './CodeManager';

/**
 * It registers the commands that are defined in the `package.json` file
 * @param context - This is the context of the extension.
 */
export function activate(context: vscode.ExtensionContext) {
  const manager = new CodeManage();

  const createProject: vscode.Disposable = vscode.commands.registerCommand('code-make-create.run', async () => {
    
    const selectedLanguage = await vscode.window.showQuickPick(
      ['C', 'C++', 'Go', 'Java'],
      { placeHolder: 'Select the project type' }
    );

    if (selectedLanguage) {
      switch (selectedLanguage) {
        case 'C':
          manager.create('c');
          break;
        case 'C++':
          manager.create('cpp');
          break;
        case 'Go':
          manager.create('go');
          break;
        case 'Java':
          manager.create('java');
          break;  
        default:
          vscode.window.showErrorMessage('Invalid project type selected.');
          break;
      }
    } else {
      vscode.window.showInformationMessage('No project type selected.');
    }
  });

  const start: vscode.Disposable = vscode.commands.registerCommand('code-make-start.run', () => {
    manager.start();
  });

  context.subscriptions.push(createProject, start);
}

/**
 * A function declaration. It is a function that is named deactivate. It does not take any parameters.
 * It does not return anything.
 */
export function deactivate () {}