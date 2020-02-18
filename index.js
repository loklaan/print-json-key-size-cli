#! /usr/bin/env node
'use strict';

const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const meow = require("meow");
const { bin } = require("./package");
const fileJson = require("./file");

const cli = meow(`
 Usage

   $ ${Object.keys(bin)[0]} [file]

 Examples

   $ ${Object.keys(bin)[0]} ./file.json
${getPrint(Buffer.from(JSON.stringify(fileJson, null, 2)), './file.json').split('\n').map(l => '    ' + l).join('\n')}`, {
  flags: {
    rainbow: {
      type: 'boolean',
      alias: 'r'
    }
  }
});

function formatByteSize(bytes, fixed = 2) {
  if (bytes < 1024) return bytes.toFixed(0) + " b";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(fixed) + " kb";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(fixed) + " mb";
  else return (bytes / 1073741824).toFixed(fixed) + " gb";
}

function getPrint (jsonBuf, filePath) {
  let printContent = '';
  function queueForPrint (str) {
    printContent += str + '\n'
  }

  const minifiedBuf = Buffer.from(
    JSON.stringify(JSON.parse(jsonBuf.toString()))
  );

  queueForPrint(`\n JSON file size, broken-down by root keys.\n`);

  const jsonStr = jsonBuf.toString();
  const jsonObj = JSON.parse(jsonStr);
  const keys = Object.keys(jsonObj);
  const maxKeyLength = keys.reduce((t, k) => (t < k.length ? k.length : t), 0);

  queueForPrint(chalk.dim(`  ${filePath}`));
  queueForPrint(chalk.grey.dim(`\n  {`));
  keys
    .map(key => {
      const byteLength = Buffer.from(`"${key}"` + JSON.stringify(jsonObj[key])).byteLength;
      return {
        key,
        percent: (byteLength / minifiedBuf.byteLength) * 100,
        byteLength: (byteLength / minifiedBuf.byteLength) * jsonBuf.byteLength
      };
    })
    .sort((a, b) => (a.byteLength < b.byteLength ? 1 : -1))
    .forEach(({ key, byteLength, percent }) => {
      percent = percent.toFixed(0);
      percent = percent.length === 1 ? ` ${percent}` : percent;
      queueForPrint(
        `     ${chalk.grey.dim('"')}${chalk.bold(key)}${chalk.grey.dim(
          '"'
        )}  ${" ".repeat(maxKeyLength - key.length)}       ${chalk(
          `${percent}%`
        )} ${chalk.dim(formatByteSize(byteLength))}`,
      );
    });

  queueForPrint(
    `  ${chalk.grey.dim("}")}   ${" ".repeat(
      maxKeyLength
    )}              ${chalk.dim.underline(
      formatByteSize(jsonBuf.byteLength, 0)
    )} ${chalk.dim.grey("total")}`
  );

  return printContent;
}

function main() {
  let filePath = process.argv[2];

  if (!filePath) {
    cli.showHelp(1);
  }

  filePath = path.resolve(filePath);
  const filePathRelative = `.${path.sep}${path.relative(process.cwd(), filePath)}`;
  const jsonBuf = fs.readFileSync(filePath);

  console.log(getPrint(jsonBuf, filePathRelative));
}

main();
