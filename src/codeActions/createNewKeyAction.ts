import * as vscode from "vscode";
import {
  assignValueToObjectPath,
  replaceSelectedText,
  sortJson,
} from "../utils";
import { getTextInfoByCursor, getTextInfoByRange } from "../utils/getTextInfo";
import {
  failToWriteFileError,
  localeFileNotFoundError,
  noEditorError,
  noTextSelectedError,
} from "../utils/errors";
import { GetTextBy } from "../constants";

const createNewKeyAction = async (
  filePath: vscode.Uri,
  useBrackets: boolean,
  useSort: boolean
) => {
  {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      noEditorError();
      return;
    }

    const fileName = editor.document.fileName;

    const cursorPosition = editor.selection.active;
    const range = editor.selection;

    const selectedTextData =
      getTextInfoByRange(editor.document, range) ||
      getTextInfoByCursor(editor.document, cursorPosition);

    if (!selectedTextData) {
      noTextSelectedError();
      return;
    }

    const isTextByRange = selectedTextData?.by === GetTextBy.range;

    const {
      textInQuotes,
      start: textStartPosition,
      end: textEndPosition,
    } = selectedTextData;

    if (!textInQuotes || (textInQuotes || "").trim().length === 0) {
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

    const trimedQuotedText = textInQuotes.replace(/^["'](.*)["']$/, "$1");

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
      failToWriteFileError();
    }

    await replaceSelectedText(
      new vscode.Range(
        textStartPosition,
        isTextByRange ? textEndPosition : textEndPosition.translate(0, 1)
      ),
      key,
      useBrackets,
      fileName
    );
  }
};

export default createNewKeyAction;
