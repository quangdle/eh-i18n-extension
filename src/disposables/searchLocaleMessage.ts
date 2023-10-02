import * as vscode from "vscode";

const searchLocaleMessage = async (filePath: vscode.Uri) => {
  let data = {};
  try {
    data = await vscode.workspace.fs.readFile(filePath);
  } catch {
    vscode.window.showErrorMessage("Locale file not found!");
  }

  const localeJSON = JSON.parse(data.toString());
  console.log(localeJSON.messages);
};

export default searchLocaleMessage;
