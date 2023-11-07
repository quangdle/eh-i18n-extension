import {
  DefinitionProvider,
  LocationLink,
  Position,
  TextDocument,
} from "vscode";
import TranslationCache from "./TranslationCache";
import { getLocaleKeyAndKeyRange } from "./utils";

class TranslationDefinitionProvider implements DefinitionProvider {
  private translationCache: TranslationCache;

  constructor(translationCache: TranslationCache) {
    this.translationCache = translationCache;
  }

  public async provideDefinition(document: TextDocument, position: Position) {
    const { localeKey, localeKeyRange } = getLocaleKeyAndKeyRange(
      document,
      position
    );

    if (!localeKey || !localeKeyRange) {
      return;
    }

    const translationResult = this.translationCache.getTranslation(localeKey);

    if (!translationResult?.location) {
      return;
    }

    const locationLink: LocationLink = {
      originSelectionRange: localeKeyRange,
      targetRange: translationResult?.location.range,
      targetUri: translationResult?.location.uri,
    };

    return [locationLink];
  }
}

export default TranslationDefinitionProvider;
