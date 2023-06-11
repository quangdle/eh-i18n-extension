# EH i18n - VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file
- Replaces selected text with a reference to that key
- Supports custom locale file path
- Suggest existing keys whose value is the selected text
- Sort the json file

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

8. If the the text exists, suggest existing keys whose value is the selected text
![ezgif com-video-to-gif (1)](https://github.com/quangdle/eh-i18n-extension/assets/92286197/582413b0-f165-481a-958c-54987e038fbf)


## Configuration

The extension can be configured with the following settings:

- `createLocaleKey.localeFilePath`: The file path to the JSON locale file (default: `src/packages/eh-locale/lang/en-AU.json`)
- `createLocaleKey.withBrackets`: Whether to format the replacement reference with brackets (default: `false`)
- `createLocaleKey.sort`: Whether to sort the keys in alphabetical order (The keys with dots will come after keys without dots.) (default: `false`)

<img width="1249" alt="image" src="https://github.com/quangdle/eh-i18n-extension/assets/92286197/dbb2040f-569e-44d4-84d0-acb597380378">

#### If `createLocaleKey.sort` is checked:

![ezgif com-video-to-gif](https://github.com/quangdle/eh-i18n-extension/assets/92286197/a5aefba0-86e1-4608-b916-533c561d6531)
## Known Issues

- None at the moment.

## Release Notes

### 0.0.6

Initial release of Create Locale Key

### 0.0.7

Add sort and suggestion of existing keys

## Contributing

Pull requests and bug reports are welcome on [GitHub](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME).
