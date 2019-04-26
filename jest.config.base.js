const { defaults } = require("jest-config");

module.exports = {
   "testEnvironment": "node",
  "transform": {
    ".(ts|tsx)": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/dist/"
  ],
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?|jsx?)$",
  "moduleFileExtensions": [
    ...defaults.moduleFileExtensions,
    "ts",
    "tsx",
    "js",
    "json"
  ]
};