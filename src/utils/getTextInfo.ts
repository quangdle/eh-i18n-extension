import * as vscode from "vscode";
import { GetTextBy } from "../constants";

function getTextInfoByCursor(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const line = document.lineAt(position);
  const lineText = line.text;
  let start, end;

  // Find the farthest quote before the cursor
  for (let i = position.character; i >= 0; i--) {
    if (lineText.charAt(i) === "'" || lineText.charAt(i) === '"') {
      start = new vscode.Position(position.line, i);
    }
  }

  // Find the farthest quote after the cursor
  for (let i = position.character; i < lineText.length; i++) {
    if (lineText.charAt(i) === "'" || lineText.charAt(i) === '"') {
      end = new vscode.Position(position.line, i);
    }
  }

  if (start && end) {
    const textInQuotes = lineText.substring(start.character + 1, end.character);
    return { textInQuotes, start, end, by: GetTextBy.cursor };
  }

  return null;
}

const getTextInfoByRange = (
  document: vscode.TextDocument,
  range: vscode.Range
) => {
  const text = document.getText(range);
  if (text) {
    return {
      textInQuotes: text,
      start: range.start,
      end: range.end,
      by: GetTextBy.range,
    };
  }

  return null;
};

export { getTextInfoByCursor, getTextInfoByRange };
