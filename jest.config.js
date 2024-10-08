
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
    verbose: true,
    testRegex: "src/test/.*\\.spec\\.(ts|tsx)$",
    moduleDirectories: [
      "node_modules"
    ],
    transform: {
      ".*\\.ts": "ts-jest"
    },
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js"
    ]
  }