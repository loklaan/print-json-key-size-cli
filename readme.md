# Print JSON Sizes CLI

![npm](https://img.shields.io/npm/v/print-json-key-size-cli)

Print the size of JSON keys, in Byte/KB/MB.

`print-json-size ./file.json`
```
 JSON file size, broken-down by root keys.

  ./package.json

  {
     "description"          19% 73 b
     "dependencies"         16% 60 b
     "author"               13% 50 b
     "bin"                  11% 43 b
     "name"                 10% 39 b
     "files"                10% 39 b
     "version"               5% 20 b
     "main"                  5% 20 b
     "license"               5% 17 b
  }                             384 b total
```

## Getting started

Run the following against a `.json` file.

```shell
# Install globally
npm install -g print-json-key-size-cli
json-key-size ./file.json

# Or, invoke directly
npx print-json-key-size-cli ./file.json
```
