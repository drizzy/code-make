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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const CodeManager_1 = require("./CodeManager");
/**
 * It registers the commands that are defined in the `package.json` file
 * @param context - This is the context of the extension.
 */
function activate(context) {
    const manager = new CodeManager_1.CodeManage();
    const create = vscode.commands.registerCommand('code-make-create.run', () => {
        manager.create();
    });
    const start = vscode.commands.registerCommand('code-make-start.run', () => {
        manager.start();
    });
    context.subscriptions.push(create);
    context.subscriptions.push(start);
}
exports.activate = activate;
;
/**
 * A function declaration. It is a function that is named deactivate. It does not take any parameters.
 * It does not return anything.
 */
function deactivate() { }
exports.deactivate = deactivate;
