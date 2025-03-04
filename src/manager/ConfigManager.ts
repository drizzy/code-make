import * as vscode from 'vscode';
import * as c from '../templates/c';
import * as cpp from '../templates/cpp';
import * as go from '../templates/go';
import * as java from '../templates/java';
import * as misc from '../templates/misc';
import { Language, LanguageConfig } from '../utils/types';

export class ConfigManager {

  public configureLanguage(language: Language): LanguageConfig | undefined {
    const config: Record<Language, LanguageConfig> = {
      c: {
        folders: c.folders,
        mainFilePath: 'src/main.c',
        mainFileContent: c.main,
        makefileContent: c.makefile,
        gitignore: misc.gitignore,
        readme: misc.readme,
      },
      cpp: {
        folders: cpp.folders,
        mainFilePath: 'src/main.cpp',
        mainFileContent: cpp.main,
        makefileContent: cpp.makefile,
        gitignore: misc.gitignore,
        readme: misc.readme,
      },
      go: {
        folders: go.folders,
        mainFilePath: 'cmd/app/main.go',
        mainFileContent: go.main,
        makefileContent: go.makefile,
        gitignore: misc.gitignore,
        readme: misc.readme,
      },
      java: {
        folders: java.folders,
        mainFilePath: 'src/main/java/com/example/Main.java',
        mainFileContent: java.main,
        makefileContent: java.makefile,
        gitignore: misc.gitignore,
        readme: misc.readme,
      },
    };
  
    return config[language];
  }

  public configureButton(
    item: vscode.StatusBarItem, 
    text: string, 
    tooltip: string, 
    command: string, 
    color: string
  ) {
    item.text = text;
    item.tooltip = tooltip;
    item.command = command;
    item.color = color;
  }

}