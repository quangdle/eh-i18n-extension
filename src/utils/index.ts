import * as vscode from "vscode";
import { CREATE_LOCALE_KEY_COMMAND, SEPARATOR } from "../constants";
import findTheMostSuitablePosition from "./findTheMostSuitablePosition";
import {
  showKeyExistsErrorMessage,
  showPathIsAStringErrorMessage,
} from "./errors";

type NestedObject = Record<string, any>;
type MessageObject = Record<string, string | NestedObject>;

const addKeyNextToTheMostSuitablePosition = <T extends NestedObject>({
  jsonObj,
  key,
  value,
  nextToKey,
}: {
  jsonObj: T;
  key: string;
  value: string;
  nextToKey: string;
}): MessageObject | null => {
  const keys = Object.keys(jsonObj);
  const index = keys.indexOf(nextToKey);

  if (index !== -1) {
    const updatedJson: MessageObject = {};
    for (let i = 0; i <= index; i++) {
      const currentKey = keys[i];
      updatedJson[currentKey] = jsonObj[currentKey];
    }
    updatedJson[key] = value;
    for (let i = index + 1; i < keys.length; i++) {
      const currentKey = keys[i];
      updatedJson[currentKey] = jsonObj[currentKey];
    }
    return updatedJson;
  }

  // If the nextToKey is not found, return the original JSON object
  return jsonObj;
};

const handleAddStringKey = ({
  newKey,
  value,
  messagesObject,
}: {
  newKey: string;
  value: string;
  messagesObject: MessageObject;
}): MessageObject | null => {
  const theMostSuitablePosition = findTheMostSuitablePosition({
    inputKey: newKey,
    keySet: Object.keys(messagesObject).filter(
      (key) => typeof messagesObject[key] !== "object"
    ),
  });

  if (!theMostSuitablePosition) {
    return {
      ...messagesObject,
      [newKey]: value,
    };
  }

  return addKeyNextToTheMostSuitablePosition({
    jsonObj: messagesObject,
    key: newKey,
    value,
    nextToKey: theMostSuitablePosition,
  });
};

const handleAddNestedKey = ({
  paths,
  value,
  messagesObject,
}: {
  paths: string[];
  value: string;
  messagesObject: MessageObject;
}) => {
  let currentObj: NestedObject = messagesObject;

  for (let i = 0; i < paths.length - 1; i++) {
    const key = paths[i];
    if (!currentObj.hasOwnProperty(key)) {
      currentObj[key] = {};
    }

    if (currentObj.hasOwnProperty(key) && typeof currentObj[key] === "string") {
      showPathIsAStringErrorMessage({
        path: paths.slice(0, i + 1).join("."),
        value,
      });
      return null;
    }
    currentObj = currentObj[key] as NestedObject;
  }

  const lastKey = paths[paths.length - 1];

  if (currentObj.hasOwnProperty(lastKey)) {
    showKeyExistsErrorMessage();
    return null;
  } else {
    currentObj[lastKey] = value;
    return messagesObject;
  }
};

export function assignValueToObjectPath<T extends NestedObject>({
  obj,
  key,
  value,
}: {
  obj: T;
  key: string;
  value: string;
}): MessageObject | null {
  const paths = key.split(SEPARATOR);

  const updatedMessages = { ...obj };

  if (paths.length === 1) {
    const newKey = paths[0];

    if (updatedMessages.hasOwnProperty(newKey)) {
      showKeyExistsErrorMessage();
      return null;
    }

    return handleAddStringKey({
      newKey,
      value,
      messagesObject: updatedMessages,
    });
  }

  return handleAddNestedKey({
    paths,
    value,
    messagesObject: updatedMessages,
  });
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
  selection: vscode.Range,
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

export const checkIfShouldUseBrackets = ({
  fileExtension,
  useBracketsConfig,
  isSingleQuoted,
}: {
  fileExtension: string;
  useBracketsConfig: boolean;
  isSingleQuoted: boolean;
}) =>
  !isSingleQuoted &&
  (fileExtension === ".tsx" || fileExtension === ".jsx") &&
  useBracketsConfig;

export const getFilePathWithFallback = async (
  filePath: vscode.Uri,
  fallbackList: vscode.Uri[]
) => {
  if (await checkFilePathExist(filePath)) {
    return filePath;
  }

  for (let fallbackPath of fallbackList) {
    if (await checkFilePathExist(fallbackPath)) {
      return fallbackPath;
    }
  }

  return null;
};

const checkFilePathExist = async (filePath: vscode.Uri) => {
  try {
    await vscode.workspace.fs.stat(filePath);
    return true;
  } catch (err) {
    return false;
  }
};
