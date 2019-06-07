// import fs from 'fs-extra';
const prettier = require('prettier');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');

const store = memFs.create();
const fs = editor.create(store);

export function writeFile(fn, data) {
  fs.write(fn, data);
}

export async function commit(format: boolean = true) {
  if (format) {
    fs.store.each(f => {
      if (f.extname.match(/ts?$|js?$|graphql$|gql$/)) {
        debugger;
        const fType = f.extname;
        const result = prettier.format(f.contents.toString('utf8'), {
          singleQuote: true,
          trailingComma: 'all',
          bracketSpacing: true,
          jsxBracketSameLine: true,
          parser: fType.match(/js?$/)
            ? 'babel'
            : fType.match(/ts?$/)
            ? 'typescript'
            : 'graphql',
        });
        fs.write(f.path, result);
      }
    });
  }
  return new Promise((res, rej) => {
    fs.commit(res);
  });
}
