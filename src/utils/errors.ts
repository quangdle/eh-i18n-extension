import * as vscode from "vscode";

export const showKeyExistsErrorMessage = () => {
  vscode.window.showErrorMessage("Key already exists! Please use another key.");
};

export const showPathIsAStringErrorMessage = ({
  path,
  value,
}: {
  path: string;
  value: string;
}) => {
  vscode.window.showErrorMessage(`Path ${path} is a string: ${value}`);
};

export const noEditorError = () => {
  vscode.window.showErrorMessage("No active text editor!");
};

export const noTextSelectedError = () => {
  vscode.window.showInformationMessage("No text selected!");
};

export const localeFileNotFoundError = () => {
  vscode.window.showErrorMessage("Locale file not found!");
};

export const failToWriteFileError = () => {
  vscode.window.showErrorMessage("Failed to write file!");
};
