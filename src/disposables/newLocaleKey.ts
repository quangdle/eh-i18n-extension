import * as vscode from "vscode";
import {
  assignValueToObjectPath,
  checkValueAndExistingKeys,
  replaceSelectedText,
  sortJson,
} from "../utils";
import { SEPARATOR } from "../constants";

const newLocaleKey = async (
  filePath: vscode.Uri,
  useBrackets: boolean,
  useSort: boolean
) => {
  {
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

    const newMessagesObject = assignValueToObjectPath({
      obj: localeJSON.messages,
      key,
      value: trimedQuotedText,
    });

    if (!newMessagesObject) {
      return;
    }

    localeJSON.messages = useSort
      ? sortJson(newMessagesObject)
      : newMessagesObject;

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
};

export default newLocaleKey;
