import * as vscode from "vscode";

import { getExtensionConfig } from "./utils";
import {
  CREATE_LOCALE_KEY_COMMAND,
  EDIT_LOCALE_MESSAGE_COMMAND,
} from "./constants";
import newLocaleKey from "./disposables/newLocaleKey";
import editLocaleKeyMassage from "./disposables/editLocaleKeyMessage";

export function activate(context: vscode.ExtensionContext) {
  const localePath = getExtensionConfig("localeFilePath") as string;
  const useBrackets = getExtensionConfig("withBrackets") as boolean;
  const useSort = getExtensionConfig("sort") as boolean;

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

  const disposables = vscode.Disposable.from(
    vscode.commands.registerCommand(CREATE_LOCALE_KEY_COMMAND, async () => {
      newLocaleKey(filePath, useBrackets, useSort);
    }),

    vscode.commands.registerCommand(EDIT_LOCALE_MESSAGE_COMMAND, async () => {
      editLocaleKeyMassage(filePath);
    })
  );

  context.subscriptions.push(disposables);
}

export function deactivate() {}
