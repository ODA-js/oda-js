"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prettier = require('prettier');
const memFs = require('mem-fs');
const editor = require('mem-fs-editor');
const store = memFs.create();
const fs = editor.create(store);
function writeFile(fn, data) {
    fs.write(fn, data);
}
exports.writeFile = writeFile;
function commit(format = true) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
exports.commit = commit;
//# sourceMappingURL=writeFile.js.map