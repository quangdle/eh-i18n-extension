import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import TranslationCache from "./TranslationCache";
import { getLocaleKeyAndKeyRange } from "./utils";

class TranslationCompletionProvider implements CompletionItemProvider {
  private translationCache: TranslationCache;

  constructor(translationCache: TranslationCache) {
    this.translationCache = translationCache;
  }

  public async provideCompletionItems(
    document: TextDocument,
    position: Position
  ) {
    const { localeKeyRange } = getLocaleKeyAndKeyRange(
      document,
      position,
      false
    );

    if (!localeKeyRange) {
      return [];
    }

    const localeKeys = this.translationCache.getLocaleKeys() || [];

    return localeKeys.map((key) => {
      const completionItem = new CompletionItem(key, CompletionItemKind.Value);
      completionItem.range = localeKeyRange;
      return completionItem;
    });
  }

  public resolveCompletionItem(item: CompletionItem) {
    const translationValue = this.translationCache.getTranslation(
      item.label.toString()
    )?.value;

    if (translationValue) {
      const markdownTranslationText = new MarkdownString(
        `**Translation**\n\n${translationValue}`
      );
      item.documentation = markdownTranslationText;
    }

    return item;
  }
}

export default TranslationCompletionProvider;
