import * as vscode from "vscode";
import { findKey, overwriteNewValue } from "../utils";

const editLocaleKeyMassage = async (filePath: vscode.Uri) => {
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

  const valueToFind = findKey(localeJSON.messages, trimedQuotedText);

  const newValue = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    value: valueToFind,
    prompt: "Replace the locale text key",
  });

  if (!newValue || (newValue || "").trim().length === 0) {
    vscode.window.showInformationMessage("New value must not be empty!");
    return;
  }

  try {
    const newDataForLocaleFile = overwriteNewValue(
      localeJSON.messages,
      trimedQuotedText,
      newValue
    );
    localeJSON.messages = newDataForLocaleFile;
    const modifiedContent = Buffer.from(JSON.stringify(localeJSON, null, 2));

    vscode.workspace.fs.writeFile(filePath, modifiedContent);
  } catch (error: any) {
    vscode.window.showErrorMessage("Error:", error.message);
  }
};

export default editLocaleKeyMassage;
