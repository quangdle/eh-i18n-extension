# EH i18n - VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file
- Replaces selected text with a reference to that key
- Supports custom locale file path

## Usage

1. Select the text you want to create a key for
2. Open the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`)
3. Search for `EH i18n - Create Locale Key` and select it
4. Enter a unique key for the selected text when prompted
5. The selected text will be replaced with a reference to the new key

![edit](https://user-images.githubusercontent.com/92286197/229753494-544aa4eb-c807-4386-9cdb-7d562daaa9d7.gif)

6. For nested keys, separate the keys with `--` (e.g. `parent--child--grandchild`)

![nested](https://user-images.githubusercontent.com/92286197/229753517-c2eec429-9cd9-400b-aefb-1ca39bf9487b.gif)


7. If your key exists, it throw error!

![ok](https://user-images.githubusercontent.com/92286197/229753537-d30555d4-3d4b-4ba0-bff1-98512234d1c0.gif)


## Configuration

The extension can be configured with the following settings:

- `createLocaleKey.localeFilePath`: The file path to the JSON locale file (default: `locales/en.json`)
- `createLocaleKey.withBrackets`: Whether to format the replacement reference with brackets (default: `false`)

<img width="853" alt="image" src="https://user-images.githubusercontent.com/92286197/229587670-463c6c5f-c9ad-490e-adee-d88759a02059.png">

## Known Issues

- None at the moment.

## Release Notes

### 1.0.0

Initial release of Create Locale Key

## Contributing

Pull requests and bug reports are welcome on [GitHub](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME).
