import jsonSourceMap from "json-source-map";
import { get } from "lodash";
import { Location, Position, Range, Uri, workspace } from "vscode";

const POINTER_KEY_PREFIX = "/messages";

type LocaleMessages = {
  [key: string]: string | LocaleMessages;
};

type LocalePointer = {
  line: number;
  column: number;
  pos: number;
};

type LocalePointers = {
  [key: string]: {
    key: LocalePointer;
    keyEnd: LocalePointer;
    value: LocalePointer;
    valueEnd: LocalePointer;
  };
};

type TranslationResult = {
  value: string;
  location?: Location;
};

class TranslationCache {
  private filePath: Uri;
  private localeMessages: LocaleMessages = {};
  private localePointers: LocalePointers = {};
  private localeLeafKeys: string[] = [];

  constructor(filePath: Uri) {
    this.filePath = filePath;
  }

  async init() {
    await this.parseJsonLocale();
    this.refreshCacheOnFileChange();
  }

  private async parseJsonLocale() {
    try {
      const localeJsonString = (
        await workspace.openTextDocument(this.filePath)
      ).getText();

      const localeJsonSourceMap = jsonSourceMap.parse(localeJsonString) || {};
      const localeMessages = localeJsonSourceMap.data?.messages || {};
      this.localeMessages = localeMessages;

      const localePointers = localeJsonSourceMap.pointers || {};
      this.formatPointersKeyName(localePointers);
      this.localePointers = localePointers;
      this.localeLeafKeys = this.getLeafKeys(localeMessages) as string[];
    } catch (err) {
      console.error(err);
    }
  }

  private formatPointersKeyName = (pointers: LocalePointers) => {
    const existingKeys = Object.keys(pointers);
    for (let key of existingKeys) {
      if (key.startsWith(POINTER_KEY_PREFIX)) {
        const currentLocaleKey = key.slice(POINTER_KEY_PREFIX.length + 1);
        if (!currentLocaleKey) {
          continue;
        }
        const formattedKey = currentLocaleKey
          .split("/")
          .join(".")
          .replace(/~1/g, "/");
        if (formattedKey !== currentLocaleKey) {
          pointers[`${POINTER_KEY_PREFIX}/${formattedKey}`] = pointers[key];
          delete pointers[key];
        }
      }
    }
  };

  private getLeafKeys(
    data: string | LocaleMessages,
    prefix: string[] = []
  ): string | string[] {
    if (typeof data === "string") {
      return prefix.join(".");
    }
    return Object.entries(data).flatMap(([k, v]) =>
      this.getLeafKeys(v, [...prefix, k])
    );
  }

  private refreshCacheOnFileChange = () => {
    workspace
      .createFileSystemWatcher(this.filePath.path)
      .onDidChange(async () => {
        await this.parseJsonLocale();
      });
  };

  getTranslation(localeKey: string): TranslationResult {
    const errorTranslationResult = {
      value: "",
    };

    try {
      const translationValue = get(this.localeMessages, localeKey);
      if (typeof translationValue !== "string" || !translationValue) {
        return errorTranslationResult;
      }
      const translationResult = {
        value: translationValue,
      };

      const pointerInfo =
        this.localePointers[`${POINTER_KEY_PREFIX}/${localeKey}`];
      if (!pointerInfo) {
        return translationResult;
      }

      const location = new Location(
        this.filePath,
        new Range(
          new Position(pointerInfo.key.line, pointerInfo.key.column),
          new Position(pointerInfo.valueEnd.line, pointerInfo.valueEnd.column)
        )
      );

      return { ...translationResult, location };
    } catch (err) {
      return errorTranslationResult;
    }
  }

  getLocaleKeys() {
    return this.localeLeafKeys || [];
  }
}

export default TranslationCache;
