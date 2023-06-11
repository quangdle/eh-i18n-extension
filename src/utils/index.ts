import * as vscode from "vscode";

import { CREATE_LOCALE_KEY_COMMAND, SEPARATOR } from "../constants";

type NestedObject = Record<string, any>;

export function assignValueToObjectPath<T extends NestedObject>(
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

export function checkValueAndExistingKeys(
  obj: NestedObject,
  value: string,
  parentKeys: string[] = []
): { valueExists: boolean; existingKeys: string[] } {
  let valueExists = false;
  const existingKeys: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const currentKeys = parentKeys.concat(key);
      const result = checkValueAndExistingKeys(
        obj[key] as NestedObject,
        value,
        currentKeys
      );
      if (result.valueExists) {
        valueExists = true;
        existingKeys.push(...result.existingKeys);
      }
    } else if (obj[key] === value) {
      valueExists = true;
      const currentKeys = parentKeys.concat(key);
      existingKeys.push(currentKeys.join("."));
    }
  }

  return { valueExists, existingKeys };
}

export const getExtensionConfig = (configKey: string): unknown => {
  const userConfiguration = vscode.workspace.getConfiguration();
  return userConfiguration.get<string>(
    `${CREATE_LOCALE_KEY_COMMAND}.${configKey}`
  );
};

export const replaceSelectedText = (
  selection: vscode.Selection,
  key: string,
  useBrackets: boolean
) => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("No active text editor!");
    return;
  }

  const paths = key.split(SEPARATOR);
  const formattedPath = paths.join(".");

  const replacementIntlExpression = useBrackets
    ? `\{Intl.formatMessage({id: '${formattedPath}'})\}`
    : `Intl.formatMessage({id: '${formattedPath}'})`;

  editor.edit((editBuilder) => {
    editBuilder.replace(selection, replacementIntlExpression);
  });
};
