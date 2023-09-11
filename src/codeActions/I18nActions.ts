import * as vscode from "vscode";
import {
  CREATE_LOCALE_KEY_CODE_ACTION_COMMAND,
  VIEW_EDIT_LOCALE_KEY_COMMAND,
} from "./constants";
import { checkValueAndExistingKeys } from "../utils";
import { getTextInfoByCursor, getTextInfoByRange } from "../utils/getTextInfo";
import { GetTextBy } from "../constants";

export class I18nActions implements vscode.CodeActionProvider {
  private filePath: vscode.Uri;
  private useBrackets: boolean;

  constructor({
    filePath,
    useBrackets,
  }: {
    filePath: vscode.Uri;
    useBrackets: boolean;
  }) {
    this.filePath = filePath;
    this.useBrackets = useBrackets;
  }
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
    vscode.CodeActionKind.RefactorInline,
  ];

  public async provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): Promise<vscode.CodeAction[] | undefined> {
    const activeTextEditor = vscode.window.activeTextEditor;

    if (!activeTextEditor) {
      return;
    }

    const cursorPosition = activeTextEditor.selection.active;
    const selectedTextData =
      getTextInfoByRange(document, range) ||
      getTextInfoByCursor(document, cursorPosition);

    const isTextByRange = selectedTextData?.by === GetTextBy.range;

    if (!selectedTextData) {
      return;
    }

    let data = {};
    try {
      data = await vscode.workspace.fs.readFile(this.filePath);
    } catch {}

    if (!data) {
      return;
    }

    const localeJSON = JSON.parse(data.toString());
    const { existingKeys } = checkValueAndExistingKeys(
      localeJSON.messages,
      selectedTextData?.textInQuotes
    );

    // return promise of code actions

    const actions = existingKeys.map((key) =>
      this.createFix(
        document,
        key,
        selectedTextData.start,
        isTextByRange
          ? selectedTextData.end
          : selectedTextData.end.translate(0, 1)
      )
    );

    const createAction = this.createCommand();
    const updateAction = this.updateCommand();

    return [...actions, createAction, updateAction];
  }

  private createFix(
    document: vscode.TextDocument,
    key: string,
    startPos: vscode.Position,
    endPos: vscode.Position
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      `Intl key: ${key}`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    const replacementIntlExpression = this.useBrackets
      ? `\{Intl.formatMessage({id: '${key}'})\}`
      : `Intl.formatMessage({id: '${key}'})`;

    fix.edit.replace(
      document.uri,
      new vscode.Range(startPos, endPos),
      replacementIntlExpression
    );

    return fix;
  }

  private createCommand(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "Create new intl key",
      vscode.CodeActionKind.RefactorInline
    );
    action.command = {
      command: CREATE_LOCALE_KEY_CODE_ACTION_COMMAND,
      title: "Create new intl key",
    };
    return action;
  }

  private updateCommand(): vscode.CodeAction {
    const action = new vscode.CodeAction(
      "View / Update intl key",
      vscode.CodeActionKind.RefactorInline
    );
    action.command = {
      command: VIEW_EDIT_LOCALE_KEY_COMMAND,
      title: "Update intl key",
    };
    return action;
  }
}
