const vscode    = require('vscode');
const os        = require('os');
const fs        = require('fs');
const path      = require('path');
const workspace = vscode.workspace;
const window    = vscode.window;
const commands  = vscode.commands;

let folderPath = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : workspace.rootPath;

/* Creating a new status bar item for each of the commands. */
let items = {
  work:    window.createStatusBarItem(vscode.StatusBarAlignment.Left),
  create:  window.createStatusBarItem(vscode.StatusBarAlignment.Left),
  build:   window.createStatusBarItem(vscode.StatusBarAlignment.Left),
  run:     window.createStatusBarItem(vscode.StatusBarAlignment.Left),
  clear:   window.createStatusBarItem(vscode.StatusBarAlignment.Left),
  destroy: window.createStatusBarItem(vscode.StatusBarAlignment.Left),
}

/**
 * It updates the status bar items based on the current workspace
 */
let updateStatusBar = function () {

  const srcPath = path.join(folderPath, 'src');
  const includePath = path.join(folderPath, 'include');
  const makefilePath = path.join(folderPath, 'Makefile');

  const isProjectValid = fs.existsSync(srcPath) && fs.existsSync(includePath) && fs.existsSync(makefilePath);

  items.work.text = `$(folder-active) ${workspace.name}`;
  items.work.command = null;
  items.work.color = '#FF79C6';

  items.create.text = `$(add)`;
  items.create.command = 'code-make-create.run';
  items.create.color = '#FF79C6';

  items.build.text = `$(gear)`;
  items.build.command = 'code-make-build.run';
  items.build.color   = '#5F6E9F';

  items.run.text = `$(debug-start)`;
  items.run.command = 'code-make.run';
  items.run.color = '#89D185' 

  items.clear.text = `$(trash)`;
  items.clear.command = 'code-make-clean.run';
  items.clear.color = '#A7E0FB';
    
  items.destroy.text = `$(close)`;
  items.destroy.command = 'code-make-destroy.run';
  items.destroy.color = '#ED836E';

  if (isProjectValid){

    items.create.hide();

    items.work.show();

    items.build.show();
  
    items.run.show();
  
    items.clear.show();
  
    items.destroy.show();

  
  } else {
    
    items.create.show();
    
    items.work.hide();

    items.build.hide();
  
    items.run.hide();
  
    items.clear.hide();
  
    items.destroy.hide();
  
  }

}

let watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
watcher.onDidChange(updateStatusBar);
watcher.onDidCreate(updateStatusBar);
watcher.onDidDelete(updateStatusBar);

updateStatusBar();

module.exports = {
  os,
  fs,
  path,
  workspace,
  folderPath,
  window,
  commands
}