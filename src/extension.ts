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

import { getFilePathWithFallback } from "./utils";
import TranslationCache from "./disposables/translation/TranslationCache";
import TranslationHoverProvider from "./disposables/translation/TranslationHoverProvider";
import TranslationDefinitionProvider from "./disposables/translation/TranslationDefinitionProvider";
import TranslationCompletionProvider from "./disposables/translation/TranslationCompletionProvider";

const DOCUMENT_FILTERS = [
  "javascript",
  "typescript",
  "typescriptreact",
  "javascriptreact",
];

export async function activate(context: vscode.ExtensionContext) {
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

  const intendedFilePath = vscode.Uri.joinPath(
    workspaceFolders[0].uri,
    localePath
  );

  // fallback to default mobile repo en-AU.json path
  const fallbackList = [
    vscode.Uri.joinPath(
      workspaceFolders[0].uri,
      "app/state/intl-configs/en-AU.json"
    ),
  ];

  const filePath = await getFilePathWithFallback(
    intendedFilePath,
    fallbackList
  );

  if (!filePath) {
    return;
  }

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
      DOCUMENT_FILTERS,
      new I18nActions({ filePath, useBrackets }),
      {
        providedCodeActionKinds: I18nActions.providedCodeActionKinds,
      }
    )
  );

  // Translation providers
  const translationCache = new TranslationCache(filePath);
  await translationCache.init();

  // hover
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      DOCUMENT_FILTERS,
      new TranslationHoverProvider(translationCache)
    )
  );

  // go to definition
  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      DOCUMENT_FILTERS,
      new TranslationDefinitionProvider(translationCache)
    )
  );

  // suggestion
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      DOCUMENT_FILTERS,
      new TranslationCompletionProvider(translationCache)
    )
  );
}

export function deactivate() {}
