import * as vscode from 'vscode';
import { IgEditorEditorProvider } from './IGEditorEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log("activating ig editor extension");
	context.subscriptions.push(IgEditorEditorProvider.register(context));
}

export function deactivate() {}
