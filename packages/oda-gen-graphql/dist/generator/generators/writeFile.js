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
function writeFile(fn, data, format = true) {
    if (format) {
        let fType = fn.match(/ts?$|js?$|graphql$|gql$/);
        try {
            const result = fType
                ? prettier.format(data, {
                    singleQuote: true,
                    trailingComma: 'all',
                    bracketSpacing: true,
                    jsxBracketSameLine: true,
                    parser: fType[0].match(/js?$/)
                        ? 'babel'
                        : fType[0].match(/ts?$/)
                            ? 'typescript'
                            : 'graphql',
                })
                : data;
            fs.write(fn, result);
        }
        catch (_a) {
            fs.write(fn, data);
        }
    }
    else {
        fs.write(fn, data);
    }
}
exports.writeFile = writeFile;
function commit() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            fs.commit(res);
        });
    });
}
exports.commit = commit;
//# sourceMappingURL=writeFile.js.map