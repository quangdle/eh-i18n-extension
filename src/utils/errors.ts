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
