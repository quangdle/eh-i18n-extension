import * as vscode from "vscode";

import {
  checkValueAndExistingKeys,
  assignValueToObjectPath,
  replaceSelectedText,
  getExtensionConfig,
} from "./utils";
import { SEPARATOR, CREATE_LOCALE_KEY_COMMAND } from "./constants";

export function activate(context: vscode.ExtensionContext) {
  const localePath = getExtensionConfig("localeFilePath") as string;
  const useBrackets = getExtensionConfig("withBrackets") as boolean;

  /* Check localePath config */
  if (!localePath) {
    vscode.window.showErrorMessage("Please set locale file path in settings!");
    return;
  }

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage("No workspace folder opened!");
    return;
  }

  const filePath = vscode.Uri.joinPath(workspaceFolders[0].uri, localePath);

  const disposable = vscode.commands.registerCommand(
    CREATE_LOCALE_KEY_COMMAND,
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor!");
        return;
      }

      const fileName = editor.document.fileName;
      /* Check selected text */

      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);

      if (!selectedText || (selectedText || "").trim().length === 0) {
        vscode.window.showInformationMessage("No text selected!");
        return;
      }

      let data = {};
      try {
        data = await vscode.workspace.fs.readFile(filePath);
      } catch {
        vscode.window.showErrorMessage("Locale file not found!");
      }
      const localeJSON = JSON.parse(data.toString());

      const trimedQuotedText = selectedText.replace(/^["'](.*)["']$/, "$1");

      const { valueExists, existingKeys } = checkValueAndExistingKeys(
        localeJSON.messages,
        trimedQuotedText
      );

      if (valueExists) {
        const quickPickItems = existingKeys.map((key) => ({
          label: key,
        }));

        const createNewOption = {
          label: "Create new key...",
          detail: "Create a new key if exsiting keys are not suitable",
          alwaysShow: true,
        };

        const separator = {
          label: "Please try using the existing keys below if possible",
          kind: vscode.QuickPickItemKind.Separator,
        };

        const userSelect = await vscode.window.showQuickPick(
          [createNewOption, separator, ...quickPickItems],
          {
            ignoreFocusOut: true,
            title: "Please review the existing keys",
            placeHolder: "Please choose an existing key or create a new key...",
          }
        );

        if (!userSelect) {
          return;
        }

        if (userSelect && existingKeys.includes(userSelect.label)) {
          await replaceSelectedText(
            selection,
            userSelect.label,
            useBrackets,
            fileName
          );
          return;
        }
      }

      const key = await vscode.window.showInputBox({
        ignoreFocusOut: true,
        prompt: "Enter the locale text key",
      });

      if (!key || (key || "").trim().length === 0) {
        vscode.window.showInformationMessage("Key must not be empty!");
        return;
      }

      const paths = key.split(SEPARATOR);

      const assignedSuccess = assignValueToObjectPath(
        localeJSON.messages,
        paths,
        trimedQuotedText,
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
          Buffer.from(JSON.stringify(localeJSON, null, 2) + "\n")
        );
      } catch {
        vscode.window.showErrorMessage("Failed to write locale file!");
      }

      await replaceSelectedText(selection, key, useBrackets, fileName);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
