import * as vscode from "vscode";
import { findKey, overwriteNewValue } from "../utils";
import {
  localeFileNotFoundError,
  noEditorError,
  noTextSelectedError,
} from "../utils/errors";
import { getTextInfoByCursor } from "../utils/getTextInfo";

const editLocaleKeyAction = async (filePath: vscode.Uri) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    noEditorError();
    return;
  }

  const cursorPosition = editor.selection.active;

  const selectedTextData = getTextInfoByCursor(editor.document, cursorPosition);

  if (!selectedTextData) {
    noTextSelectedError();
    return;
  }

  const { textInQuotes: intlKey } = selectedTextData;

  if (!intlKey || (intlKey || "").trim().length === 0) {
    noTextSelectedError();
    return;
  }

  let data = {};

  try {
    data = await vscode.workspace.fs.readFile(filePath);
  } catch {
    localeFileNotFoundError();
  }
  const localeJSON = JSON.parse(data.toString());

  const valueToFind = findKey(localeJSON.messages, intlKey);

  if (!valueToFind || typeof valueToFind !== "string") {
    vscode.window.showErrorMessage("Key is invalid or not exists");
    return;
  }

  const newValue = await vscode.window.showInputBox({
    ignoreFocusOut: true,
    value: valueToFind,
    prompt: `New value for the key ${intlKey}`,
  });

  if (!newValue || (newValue || "").trim().length === 0) {
    return;
  }

  try {
    const newDataForLocaleFile = overwriteNewValue(
      localeJSON.messages,
      intlKey,
      newValue
    );
    localeJSON.messages = newDataForLocaleFile;
    const modifiedContent = Buffer.from(
      JSON.stringify(localeJSON, null, 2) + "\n"
    );

    await vscode.workspace.fs.writeFile(filePath, modifiedContent);
    vscode.window.showInformationMessage("Edit key successfully!");
  } catch (error: any) {
    vscode.window.showErrorMessage("Error:", error.message);
  }
};

export default editLocaleKeyAction;
