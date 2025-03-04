import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
  private _folderPath: string;

  constructor() {
    this._folderPath = this.getFolderPath() || '';
  }

  public get folderPath(): string {
    return this._folderPath;
  }

  public getFolderPath(): string {
    if (!vscode.workspace || !vscode.workspace.workspaceFolders) {
      return '';
    }
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  public createFolder(folderPath: string, folderName: string) {
    const fullPath: string = path.join(folderPath, folderName);

    if (!fs.existsSync(fullPath)) {
      try {
        fs.mkdirSync(fullPath, { recursive: true });
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create folder: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  public async createFile(filePath: string, templatePath: string) {
    if (!fs.existsSync(filePath)) {
      try {
        const content = fs.existsSync(templatePath) ? await fs.promises.readFile(templatePath, 'utf8') : templatePath;
        await fs.promises.writeFile(filePath, content, 'utf8');
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to create file: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  public findFileRecursive(startPath: string, filename: string): boolean {
    if (!fs.existsSync(startPath)) {return false;}
  
    const files = fs.readdirSync(startPath);
    if (files.length === 0) {return false;}
  
    for (const file of files) {
      const fullPath = path.join(startPath, file);
      const stat = fs.statSync(fullPath);
  
      if (stat.isDirectory()) {
        if (this.findFileRecursive(fullPath, filename)) {return true;}
      } else if (file === filename) {
        return true;
      }
    }
    return false;
  }
  
  public getProgramNameFromMakefile(): string | null {
    const makefilePath = path.join(this._folderPath, 'Makefile');
  
    if (!fs.existsSync(makefilePath)) {
      vscode.window.showWarningMessage('Makefile not found in the workspace.');
      return null;
    }
  
    const makefileContent = fs.readFileSync(makefilePath, 'utf-8');
  
    const targetRegex = /TARGET\s*[:]?\s*=\s*(\S+)/;
    const mainClassRegex = /MAIN_CLASS\s*[:]?\s*=\s*(\S+)/;
  
    let match = makefileContent.match(targetRegex);
    if (match && match[1]) {
      return match[1];
    }
  
    match = makefileContent.match(mainClassRegex);
    if (match && match[1]) {
      return match[1];
    }
  
    vscode.window.showWarningMessage('Neither TARGET nor MAIN_CLASS variables were found in Makefile.');
    return null;
  }  

}