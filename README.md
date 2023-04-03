# VS Code Create Locale Key

A VS Code extension for creating a new key in a JSON locale file and replacing selected text with a reference to that key.

## Features

- Creates a new key in a JSON locale file
- Replaces selected text with a reference to that key
- Supports custom locale file paths and

## Usage

1. Select the text you want to create a key for
2. Open the command palette (`Ctrl + Shift + P` or `Cmd + Shift + P`)
3. Search for `Create Locale Key` and select it
4. Enter a unique key for the selected text when prompted
5. The selected text will be replaced with a reference to the new key

![ezgif com-video-to-gif (1)](https://user-images.githubusercontent.com/92286197/229586068-558807f8-de69-4b10-bd75-30ca5b3486d7.gif)

6. For nested keys, separate the keys with `--` (e.g. `parent--child--grandchild`)

![ezgif com-video-to-gif (2)](https://user-images.githubusercontent.com/92286197/229586730-36ef2175-5ddf-4ba7-b872-0167960a3978.gif)


7. If your key exists, it throw error!  

![ezgif com-video-to-gif](https://user-images.githubusercontent.com/92286197/229585058-407f1926-2e9e-40b4-b37b-804882aaa467.gif)

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
