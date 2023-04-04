import * as vscode from "vscode";

type NestedObject = Record<string, any>;

const SEPARATOR = "--";

function assignValueToObjectPath<T extends NestedObject>(
  obj: T,
  paths: string[],
  value: string,
  duplicatedCallBack: () => void
): boolean {
  let currentObj: NestedObject = obj;

  for (let i = 0; i < paths.length - 1; i++) {
    const key = paths[i];
    if (!currentObj.hasOwnProperty(key)) {
      currentObj[key] = {};
    }
    currentObj = currentObj[key] as NestedObject;
  }
  const lastKey = paths[paths.length - 1];

  if (currentObj.hasOwnProperty(lastKey)) {
    duplicatedCallBack();
    return false;
  } else {
    currentObj[lastKey] = value;
    return true;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const userConfiguration = vscode.workspace.getConfiguration();
  const localePath = userConfiguration.get<string>(
    "createLocaleKey.localeFilePath"
  );
  const useBrackets = userConfiguration.get<boolean>(
    "createLocaleKey.withBrackets"
  );
  const disposable = vscode.commands.registerCommand(
    "createLocaleKey",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor!");
        return;
      }

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText || (selectedText || "").trim().length === 0) {
        vscode.window.showInformationMessage("No text selected!");
        return;
      }

      const key = await vscode.window.showInputBox({
        prompt: "Enter the locale text key",
      });

      if (!key || (key || "").trim().length === 0) {
        vscode.window.showInformationMessage("Key must not be empty!");
        return;
      }

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage("No workspace folder opened!");
        return;
      }

      if (!localePath) {
        vscode.window.showErrorMessage(
          "Please set locale file path in settings!"
        );
        return;
      }

      const filePath = vscode.Uri.joinPath(workspaceFolders[0].uri, localePath);

      let data = {};
      try {
        data = await vscode.workspace.fs.readFile(filePath);
      } catch {
        vscode.window.showErrorMessage("Locale file not found!");
      }

      const json = JSON.parse(data.toString());
      const paths = key.split(SEPARATOR);
      const formattedPath = paths.join(".");

      const assignedSuccess = assignValueToObjectPath(
        json.messages,
        paths,
        selectedText.replace(/^["'](.*)["']$/, "$1"),
        () => {
          vscode.window.showErrorMessage(
            "Key already exists! Please use another key."
          );
          return;
        }
      );

      if (!assignedSuccess) {
        return;
      }

      try {
        await vscode.workspace.fs.writeFile(
          filePath,
          Buffer.from(JSON.stringify(json, null, 2) + "\n")
        );
      } catch {
        vscode.window.showErrorMessage("Failed to write locale file!");
      }

      const replacementIntlExpression = useBrackets
        ? `\{Intl.formatMessage({id: '${formattedPath}'})\}`
        : `Intl.formatMessage({id: '${formattedPath}'})`;

      editor.edit((editBuilder) => {
        editBuilder.replace(selection, replacementIntlExpression);
      });
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
