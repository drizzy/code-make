import * as vscode from 'vscode';
import { CodeManage } from './CodeManager';

/**
 * It registers the commands that are defined in the `package.json` file
 * @param context - This is the context of the extension.
 */
export function activate(context: vscode.ExtensionContext) {

	const manager = new CodeManage();
	
	const create: vscode.Disposable = vscode.commands.registerCommand('code-make-create.run', () => {
		manager.create();
	});

	const start: vscode.Disposable = vscode.commands.registerCommand('code-make-start.run', () => {
		manager.start();
	});

	context.subscriptions.push(create);
	context.subscriptions.push(start);
	
};

/**
 * A function declaration. It is a function that is named deactivate. It does not take any parameters.
 * It does not return anything.
 */
export function deactivate () {}