import * as vscode from 'vscode';
import { ContentGenerator } from './ig-editor-lib/src/ContentManager';

export class IgEditorEditorProvider implements vscode.CustomTextEditorProvider {

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        console.log("registering custom editor");
        const ret = new IgEditorEditorProvider(context);
        const registration = vscode.window.registerCustomEditorProvider(
            IgEditorEditorProvider.viewType,
            ret
        );
        return registration;
    }

    public static viewType: string = "IgEditorVsCode.IgEditorIGJson";

    private _context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this._context = context;
    }

    resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): void | Thenable<void> {
        console.log("resolving custom editor");
        webviewPanel.webview.options = {
            enableScripts: true
        };
        webviewPanel.webview.html = this.generateHtmlContent(webviewPanel.webview);
        
        let isReady = false;

        function updateDescriptionJson() {
            if (isReady) {
                webviewPanel.webview.postMessage(document.getText());
            }
        }
        
        const onChangeSub = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateDescriptionJson();
			}
		});
        webviewPanel.onDidDispose(() => {
			onChangeSub.dispose();
		});
        webviewPanel.webview.onDidReceiveMessage(e => {
			switch (e.type) {
				case "ready":
                    isReady = true;
                    updateDescriptionJson();
			}
		});
    }

    private generateHtmlContent(webview: vscode.Webview): string {
       let content = ContentGenerator.generateFor();
       
       content = content.replace(/top\.postMessage/gm, "vscode.postMessage");
       content = content.replace(/var library = null;/gm, "var library = null; const vscode = acquireVsCodeApi()");
       
       return content;
    }

    public updateFromDocument(doc: vscode.TextDocument) {
        let text = doc.getText();

    }

}