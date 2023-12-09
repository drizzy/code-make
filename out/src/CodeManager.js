"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeManage = void 0;
const vscode = __importStar(require("vscode"));
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
const templates_1 = require("./templates");
class CodeManage {
    _terminal;
    _folderPath;
    _items;
    _watcher;
    constructor() {
        this._terminal = vscode.window.createTerminal({
            name: 'Code Make',
            hideFromUser: true
        });
        this._folderPath = vscode.workspace?.workspaceFolders?.[0]?.uri?.fsPath;
        this._items = {
            create: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
            start: vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right),
        };
        this._watcher = null;
        this.setupFileSystemWatcher();
        this.updateStatusBar();
    }
    start() {
        const binPath = (0, path_1.join)((0, path_1.resolve)(this._folderPath), 'bin');
        try {
            const binStats = (0, fs_1.statSync)(binPath);
            if (!binStats.isDirectory()) {
                this.build();
            }
            else {
                const files = (0, fs_1.readdirSync)(binPath);
                if (files.length == 0) {
                    this.build();
                }
                else {
                    this.build();
                    this.terminal('make run');
                }
            }
        }
        catch (e) {
            this.build();
        }
    }
    create() {
        try {
            if (!this._folderPath)
                return vscode.window.showErrorMessage('Please open a project folder first');
            const folders = [
                'assets',
                'doc',
                'include',
                'include/core',
                'include/ui',
                'include/utils',
                'lib',
                'src',
                'src/core',
                'src/ui',
                'src/utils',
                'tests'
            ];
            folders.forEach((folder) => this.createFolder(this._folderPath, folder));
            this.createFile((0, path_1.join)(this._folderPath, 'src', 'main.cpp'), templates_1.maincpp);
            this.createFile((0, path_1.join)(this._folderPath, '.gitignore'), templates_1.gitignore);
            this.createFile((0, path_1.join)(this._folderPath, 'Makefile'), templates_1.makefile);
            this.createFile((0, path_1.join)(this._folderPath, 'README.md'), templates_1.readme);
        }
        catch (e) {
            console.log('An error occurred.', e);
        }
    }
    build() {
        try {
            const srcFolder = (0, path_1.join)(this._folderPath, 'src');
            const mainFile = (0, path_1.join)(this._folderPath, 'src', 'main.cpp');
            if (!(0, fs_1.existsSync)(srcFolder) && !(0, fs_1.existsSync)(mainFile))
                return vscode.window.showErrorMessage('No such file main.cpp or directory src');
            this.terminal('make');
        }
        catch (e) {
            console.log('An error occurred.', e);
        }
    }
    updateStatusBar() {
        try {
            vscode.window.showInformationMessage('Update executed!');
            const srcPath = (0, path_1.join)(this._folderPath, 'src');
            const maincpp = (0, path_1.join)(this._folderPath, 'src', 'main.cpp');
            const includePath = (0, path_1.join)(this._folderPath, 'include');
            const makefilePath = (0, path_1.join)(this._folderPath, 'Makefile');
            const isProjectValid = (0, fs_1.existsSync)(srcPath) && (0, fs_1.existsSync)(maincpp) && (0, fs_1.existsSync)(includePath) && (0, fs_1.existsSync)(makefilePath);
            this._items.create.text = `$(heart)`;
            this._items.create.tooltip = 'Code Make (Create Project)';
            this._items.create.command = 'code-make-create.run';
            this._items.create.color = '#FF79C6';
            this._items.start.text = `$(debug-start)`;
            this._items.start.tooltip = 'Code Make (Start Project)';
            this._items.start.command = 'code-make-start.run';
            this._items.start.color = '#89D185';
            !isProjectValid
                ? (this._items.create.show(), this._items.start.hide())
                : (this._items.start.show(), this._items.create.hide());
        }
        catch (e) {
            vscode.window.showErrorMessage(e.message || e.toString());
        }
    }
    terminal(command) {
        try {
            if (this._terminal.exitStatus)
                this._terminal = vscode.window.createTerminal({
                    name: 'Code Make',
                    hideFromUser: true
                });
            this._terminal.show();
            (0, os_1.platform)() === 'win32' ? this._terminal.sendText('cls') : this._terminal.sendText('clear');
            this._terminal.sendText(`${command}`);
        }
        catch (e) {
            vscode.window.showErrorMessage(e);
        }
    }
    createFolder(folderPath, folderName) {
        const fullPath = (0, path_1.join)(folderPath, folderName);
        if (!(0, fs_1.existsSync)(fullPath)) {
            try {
                (0, fs_1.mkdirSync)(fullPath, { recursive: true });
            }
            catch (e) {
                vscode.window.showErrorMessage('Failed to create folder');
            }
        }
    }
    createFile(filePath, templatePath) {
        if (!(0, fs_1.existsSync)(filePath)) {
            (0, fs_1.writeFile)(filePath, templatePath, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    vscode.window.showErrorMessage('Failed to create file');
                }
            });
        }
    }
    setupFileSystemWatcher() {
        this._watcher = vscode.workspace.createFileSystemWatcher('**/*', false, false, false);
        this._watcher.onDidChange(this.updateStatusBar.bind(this));
        this._watcher.onDidCreate(this.updateStatusBar.bind(this));
        this._watcher.onDidDelete(this.updateStatusBar.bind(this));
    }
}
exports.CodeManage = CodeManage;
;
