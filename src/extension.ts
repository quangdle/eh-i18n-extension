import * as vscode from "vscode";

import { getExtensionConfig } from "./utils";
import {
  CREATE_LOCALE_KEY_COMMAND,
  EDIT_LOCALE_MESSAGE_COMMAND,
} from "./constants";
import newLocaleKey from "./disposables/newLocaleKey";
import editLocaleKeyMassage from "./disposables/editLocaleKeyMessage";
import { I18nActions } from "./codeActions/I18nActions";
import {
  CREATE_LOCALE_KEY_CODE_ACTION_COMMAND,
  VIEW_EDIT_LOCALE_KEY_COMMAND,
} from "./codeActions/constants";
import createNewKeyAction from "./codeActions/createNewKeyAction";
import editLocaleKeyAction from "./codeActions/editLocaleKeyAction";

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
    }),

    vscode.commands.registerCommand(
      CREATE_LOCALE_KEY_CODE_ACTION_COMMAND,
      async () => await createNewKeyAction(filePath, useBrackets, useSort)
    ),
    vscode.commands.registerCommand(
      VIEW_EDIT_LOCALE_KEY_COMMAND,
      async () => await editLocaleKeyAction(filePath)
    )
  );

  context.subscriptions.push(disposables);

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      ["javascript", "typescript", "typescriptreact", "javascriptreact"],
      new I18nActions({ filePath, useBrackets }),
      {
        providedCodeActionKinds: I18nActions.providedCodeActionKinds,
      }
    )
  );
}

export function deactivate() {}
