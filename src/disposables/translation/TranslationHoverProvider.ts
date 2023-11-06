import {
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import TranslationCache from "./TranslationCache";
import { getLocaleKeyAndKeyRange } from "./utils";

class TranslationHoverProvider implements HoverProvider {
  private translationCache: TranslationCache;

  constructor(translationCache: TranslationCache) {
    this.translationCache = translationCache;
  }

  public async provideHover(document: TextDocument, position: Position) {
    const { localeKey, localeKeyRange } = getLocaleKeyAndKeyRange(
      document,
      position
    );

    if (!localeKey || !localeKeyRange) {
      return;
    }

    const translationValue =
      this.translationCache.getTranslation(localeKey)?.value;

    if (!translationValue) {
      return;
    }

    const markdownTranslationText = new MarkdownString(
      `**Translation**\n\n${translationValue}`
    );

    return new Hover(markdownTranslationText, localeKeyRange);
  }
}

export default TranslationHoverProvider;
