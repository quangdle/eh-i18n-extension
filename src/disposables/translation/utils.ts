import { Position, Range, TextDocument } from "vscode";

export const getLocaleKeyAndKeyRange = (
  document: TextDocument,
  position: Position,
  isComplete: boolean = true
) => {
  let localeKey = "";
  let localeKeyRange = null;

  const quotedRegex = /id:\s*("(?<group1>.*?)"|'(?<group2>.*?)')/dg;
  const formatFunctionRegex = /Intl\.formatMessage|Intl\.formatHTMLMessage/;

  const currentLineText = document.lineAt(position.line).text;

  let isIntlIdHover = false;
  try {
    // if same line
    if (currentLineText.match(formatFunctionRegex)) {
      isIntlIdHover = true;
    } else if (currentLineText.match(/id:/)) {
      // if spanned multi lines
      const prevLineText =
        position.line >= 1 ? document.lineAt(position.line - 1).text : "";
      const prevTwoLineText =
        position.line >= 2 ? document.lineAt(position.line - 2).text : "";
      if (
        prevLineText.match(formatFunctionRegex) ||
        prevTwoLineText.match(formatFunctionRegex)
      ) {
        isIntlIdHover = true;
      }
    }
  } catch (err) {
    console.error(err);
  }

  // if hover does not belong to id in intl, return
  if (!isIntlIdHover) {
    return { localeKey, localeKeyRange };
  }

  const regexMatches = [...currentLineText.matchAll(quotedRegex)];

  for (let regexMatch of regexMatches) {
    const matchedGroups = regexMatch.groups || {};
    const matchedGroupsIndices = (regexMatch as any).indices?.groups || {};

    let matchedKey = "";
    let matchedKeyStart = -1;
    let matchedKeyEnd = -1;

    if (typeof matchedGroups.group1 === "string") {
      matchedKey = matchedGroups.group1 || "";
      [matchedKeyStart, matchedKeyEnd] = matchedGroupsIndices.group1 || [
        -1, -1,
      ];
    } else if (typeof matchedGroups.group2 === "string") {
      matchedKey = matchedGroups.group2 || "";
      [matchedKeyStart, matchedKeyEnd] = matchedGroupsIndices.group2 || [
        -1, -1,
      ];
    }

    const cursorAfterStart = position.character >= matchedKeyStart;
    const cursorBeforeEnd = isComplete
      ? position.character < matchedKeyEnd
      : position.character <= matchedKeyEnd;

    // find word that captures current cursor position
    if (cursorAfterStart && cursorBeforeEnd) {
      localeKey = matchedKey;
      localeKeyRange = new Range(
        new Position(position.line, matchedKeyStart),
        new Position(position.line, matchedKeyEnd)
      );
      break;
    }
  }

  return { localeKey, localeKeyRange };
};
