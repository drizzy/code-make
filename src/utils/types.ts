import * as vscode from 'vscode';

export type Language = 'c' | 'cpp' | 'go' | 'java';

export interface StatusBarItems {
  create: vscode.StatusBarItem;
  start: vscode.StatusBarItem;
  stop: vscode.StatusBarItem;
}

export interface LanguageConfig {
  folders: string[];
  mainFilePath: string;
  mainFileContent: string;
  makefileContent: string;
  gitignore: string;
  readme: string
}