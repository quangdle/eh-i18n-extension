# EH i18n - VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file
- Replaces selected text with a reference to that key
- Supports custom locale file path
- Suggest existing keys whose value is the selected text
- Sort the json file

## Usage
### For creating new locale key
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
<img src="https://github.com/quangdle/eh-i18n-extension/assets/92286197/582413b0-f165-481a-958c-54987e038fbf" />

### For editing message of an existing key.
1. Select the key you want to edit its message
2. Open the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`)
3. Search for `EH i18n - Edit Locale Message` and select it
4. The extension will check the key you select(if it hasn't existed yet, it'll show error) and show the current message of the key
<img src="https://github.com/quangdle/eh-i18n-extension/assets/116699596/131105fb-cefb-460f-a795-2c9556422c9d" alt="invalid_key"/>

5. Enter a new message for the valid key you selected
<img src="https://github.com/quangdle/eh-i18n-extension/assets/116699596/a3f6e15c-59f2-4659-b370-8b381d04946f" alt="happy_case"/>

6. If you enter an empty message, it'll show error
<img width='581' src="https://github.com/quangdle/eh-i18n-extension/assets/116699596/863112fc-7f08-426e-b470-f2b430252567" alt="empty_text"/>

## Configuration

The extension can be configured with the following settings:

- `createLocaleKey.localeFilePath`: The file path to the JSON locale file (default: `src/packages/eh-locale/lang/en-AU.json`)
- `createLocaleKey.withBrackets`: Whether to format the replacement reference with brackets (default: `false`)
- `createLocaleKey.sort`: Whether to sort the keys in alphabetical order (default: `false`). 

> **_NOTE:_** Sorting criteria:
> 1. Sort the keys alphabetically.
> 2. Sort the keys with dots after keys without dots.
> 3. Sort keys whose values are objects after those whose values are strings

<img width="1249" alt="image" src="https://github.com/quangdle/eh-i18n-extension/assets/92286197/dbb2040f-569e-44d4-84d0-acb597380378">

#### If `createLocaleKey.sort` is checked:

![ezgif com-video-to-gif (2)](https://github.com/quangdle/eh-i18n-extension/assets/92286197/8144338e-f0c7-4093-b181-bd4dfc4c35b0)

## Known Issues

- None at the moment.

## Release Notes

### 0.0.6

Initial release of Create Locale Key

### 0.0.9

Add sort and suggestion of existing keys

### 0.0.10

Make default sort config true

### 0.0.11

Make default sort config false

## Contributing

Pull requests and bug reports are welcome on [GitHub](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME).
