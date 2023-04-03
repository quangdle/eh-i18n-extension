# VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file
- Replaces selected text with a reference to that key
- Supports custom locale file paths and key separators
- Can format the replacement reference with brackets

## Usage

1. Select the text you want to create a key for
2. Open the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`)
3. Search for `Create Locale Key` and select it
4. Enter a unique key for the selected text when prompted
5. The selected text will be replaced with a reference to the new key

## Configuration

The extension can be configured with the following settings:

- `createLocaleKey.localeFilePath`: The file path to the JSON locale file (default: `locales/en.json`)
- `createLocaleKey.withBrackets`: Whether to format the replacement reference with brackets (default: `false`)

## Known Issues

- None at the moment.

## Release Notes

### 1.0.0

Initial release of Create Locale Key

## Contributing

Pull requests and bug reports are welcome on [GitHub](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME).
