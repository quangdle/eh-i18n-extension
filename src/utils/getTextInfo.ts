import * as vscode from "vscode";
import { GetTextBy } from "../constants";

function getTextInfoByCursor(
  document: vscode.TextDocument,
  position: vscode.Position
) {
  const line = document.lineAt(position);
  const lineText = line.text;
  let start, end;
  let startBySingleQuote = false;
  let endBySingleQuote = false;

  // Find the farthest quote before the cursor
  for (let i = position.character; i >= 0; i--) {
    if (lineText.charAt(i) === "'" || lineText.charAt(i) === '"') {
      start = new vscode.Position(position.line, i);
      startBySingleQuote = lineText.charAt(i) === "'";
    }
  }

  // Find the farthest quote after the cursor
  for (let i = position.character; i < lineText.length; i++) {
    if (lineText.charAt(i) === "'" || lineText.charAt(i) === '"') {
      end = new vscode.Position(position.line, i);
      endBySingleQuote = lineText.charAt(i) === "'";
    }
  }

  if (start && end) {
    const textInQuotes = lineText.substring(start.character + 1, end.character);
    return {
      textInQuotes,
      start,
      end,
      by: GetTextBy.cursor,
      isSingleQuoted: startBySingleQuote && endBySingleQuote,
    };
  }

  return null;
}

const getTextInfoByRange = (
  document: vscode.TextDocument,
  range: vscode.Range
) => {
  const text = document.getText(range);
  const firstCharacter = text.charAt(0);
  const lastCharacter = text.charAt(text.length - 1);
  const isSingleQuoted = firstCharacter === "'" && lastCharacter === "'";
  if (text) {
    return {
      textInQuotes: text,
      start: range.start,
      end: range.end,
      by: GetTextBy.range,
      isSingleQuoted,
    };
  }

  return null;
};

export { getTextInfoByCursor, getTextInfoByRange };
