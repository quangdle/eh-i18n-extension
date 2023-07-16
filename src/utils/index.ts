import * as vscode from "vscode";

import { CREATE_LOCALE_KEY_COMMAND, SEPARATOR } from "../constants";

type NestedObject = Record<string, any>;

export function assignValueToObjectPath<T extends NestedObject>(
  obj: T,
  paths: string[],
  value: string
): boolean {
  let currentObj: NestedObject = obj;

  for (let i = 0; i < paths.length - 1; i++) {
    const key = paths[i];
    if (!currentObj.hasOwnProperty(key)) {
      currentObj[key] = {};
    }

    if (currentObj.hasOwnProperty(key) && typeof currentObj[key] === "string") {
      vscode.window.showErrorMessage(
        `Path ${paths.slice(0, i + 1).join(".")} is a string: ${
          currentObj[key]
        }`
      );
      return false;
    }
    currentObj = currentObj[key] as NestedObject;
  }
  const lastKey = paths[paths.length - 1];

  if (currentObj.hasOwnProperty(lastKey)) {
    vscode.window.showErrorMessage(
      "Key already exists! Please use another key."
    );
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

export function findKey(nestedObje: any, keyToDelete: any) {
  if (nestedObje[keyToDelete]) {
    return nestedObje[keyToDelete];
  } else {
    let nestedKeys = keyToDelete.split("."); // split the key by dots to handle nested properties
    let temp = nestedObje;
    for (let i = 0; i < nestedKeys.length - 1; i++) {
      // traverse the nested properties
      temp = temp[nestedKeys[i]];
      if (!temp) {
        return null;
      } // if any property is not found, return the original object
    }
    let lastKey = nestedKeys[nestedKeys.length - 1];
    return temp[lastKey];
  }
}

export const getExtensionConfig = (configKey: string): unknown => {
  const userConfiguration = vscode.workspace.getConfiguration();
  return userConfiguration.get<string>(
    `${CREATE_LOCALE_KEY_COMMAND}.${configKey}`
  );
};

export const replaceSelectedText = async (
  selection: vscode.Selection,
  key: string,
  useBrackets: boolean,
  filePath: string
) => {
  const textDocument = await vscode.workspace.openTextDocument(filePath);

  const edit = new vscode.WorkspaceEdit();

  const paths = key.split(SEPARATOR);
  const formattedPath = paths.join(".");

  const replacementIntlExpression = useBrackets
    ? `\{Intl.formatMessage({id: '${formattedPath}'})\}`
    : `Intl.formatMessage({id: '${formattedPath}'})`;

  edit.replace(textDocument.uri, selection, replacementIntlExpression);
  await vscode.workspace.applyEdit(edit);
  await textDocument.save();
};
// Function to sort localeObject.messages with below criteria:
// 1. Sort the keys alphabetically.
// 2. Sort the keys with dots after keys without dots.
// 3. Sort keys whose values are objects after those whose values are strings
export function sortJson(jsonObj: NestedObject) {
  const sortedKeys = Object.keys(jsonObj)
    .sort((a, b) => {
      // compare keys alphabetically
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    })
    .sort((a, b) => {
      // sort keys with dots after keys without dots
      const aHasDot = a.indexOf(".") !== -1;
      const bHasDot = b.indexOf(".") !== -1;
      if (aHasDot && !bHasDot) {
        return 1;
      } else if (!aHasDot && bHasDot) {
        return -1;
      } else {
        return 0;
      }
    })
    .sort((a, b) => {
      // sort keys whose values are objects after those whose values are strings
      const aValueIsObject =
        typeof jsonObj[a] === "object" && jsonObj[a] !== null;
      const bValueIsObject =
        typeof jsonObj[b] === "object" && jsonObj[b] !== null;
      if (aValueIsObject && !bValueIsObject) {
        return 1;
      } else if (!aValueIsObject && bValueIsObject) {
        return -1;
      } else {
        return 0;
      }
    });
  const sortedJsonObj: NestedObject = {};
  sortedKeys.forEach((key) => {
    if (typeof jsonObj[key] === "object" && jsonObj[key] !== null) {
      sortedJsonObj[key] = sortJson(jsonObj[key]);
    } else {
      sortedJsonObj[key] = jsonObj[key];
    }
  });
  return sortedJsonObj;
}

export function overwriteNewValue(nestedObject: any, key: any, newValue: any) {
  if (nestedObject[key]) {
    nestedObject[key] = newValue;
    return nestedObject;
  } else {
    const keys = key.split(".");
    const updatedObject = { ...nestedObject };

    let currentObject = updatedObject;
    for (let i = 0; i < keys.length - 1; i++) {
      const currentKey = keys[i];
      if (currentKey in currentObject) {
        currentObject[currentKey] = { ...currentObject[currentKey] };
        currentObject = currentObject[currentKey];
      } else {
        throw new Error(`Key "${currentKey}" not found.`);
      }
    }

    const lastKey = keys[keys.length - 1];
    currentObject[lastKey] = newValue;

    return updatedObject;
  }
}
