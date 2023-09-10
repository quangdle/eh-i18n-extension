# EH i18n - VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file and replaces selected text with a reference to that key
- Supports custom locale file path
- Suggest existing keys whose value is the selected text
- Sort the json file

## Usage
### Creation


#### Place the mouse cursor on the string and click to Light bulb icon or `Cmd + .` to see code actions
![createNewKey](https://github.com/quangdle/eh-i18n-extension/assets/92286197/3813df7e-b350-4508-be60-39c972dfe3e9)


#### Using command (Legacy)(`Ctrl + Shift + P` or `Cmd + Shift + P` and search for `EH i18n - Create Locale Key`)
![edit](https://user-images.githubusercontent.com/92286197/229753494-544aa4eb-c807-4386-9cdb-7d562daaa9d7.gif)


> **_NOTE:_** For nested keys, separate the keys with `--` (e.g. `parent--child--grandchild`)
![nested](https://user-images.githubusercontent.com/92286197/229753517-c2eec429-9cd9-400b-aefb-1ca39bf9487b.gif)

> **_NOTE:_** If the the text exists, suggest existing keys whose value is the selected text
![existingKeySelect](https://github.com/quangdle/eh-i18n-extension/assets/92286197/18ec14b9-0d06-4165-9411-1c59a5028db6)


### For editing message of an existing key.

#### Place the mouse cursor on the string and click to Light bulb icon or `Cmd + .` to see code actions
![editKey](https://github.com/quangdle/eh-i18n-extension/assets/92286197/229b97d7-c5dc-41c5-8aaf-f61873e3d7ab)


#### Using command (Legacy)(`Ctrl + Shift + P` or `Cmd + Shift + P` and search for `EH i18n - Edit Locale Message`)
<img src="https://github.com/quangdle/eh-i18n-extension/assets/116699596/a3f6e15c-59f2-4659-b370-8b381d04946f" alt="happy_case"/>


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

### 0.1.0
Add edit message

### 0.1.1
Support code action providers and add key to more correct position

## Contributing

Pull requests and bug reports are welcome. Happy coding 🤍
