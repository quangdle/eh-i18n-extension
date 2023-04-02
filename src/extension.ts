// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "createLocaleKey",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      const key = await vscode.window.showInputBox({
        prompt: "Enter the locale text key",
      });
      if (!key) {
        return;
      }

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage("No workspace folder opened");
        return;
      }
      const filePath = vscode.Uri.joinPath(
        workspaceFolders[0].uri,
        "src/packages/eh-locale/lang/en-AU.json"
      );

      const data = await vscode.workspace.fs.readFile(filePath);
      const json = JSON.parse(data.toString());
      json.messages[key] = selectedText.replace(/^["'](.*)["']$/, "$1");

      await vscode.workspace.fs.writeFile(
        filePath,
        Buffer.from(JSON.stringify(json, null, 2))
      );

      editor.edit((editBuilder) => {
        editBuilder.replace(
          selection,
          `\{Intl.formatMessage({id: '${key}'})\}`
        );
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
