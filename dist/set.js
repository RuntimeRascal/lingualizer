"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = __importStar(require("yargs"));
exports.command = 'set [key] [value] [locale]';
exports.describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
exports.builder = yargs
    .option('key', {
    describe: "The key to set translation for",
    alias: ['k']
})
    .option('value', {
    describe: "The value to set as the 'key'",
    alias: ['v']
})
    .option('locale', {
    describe: "The locale",
    choices: ['es-MX', 'en-US'],
    alias: ['l']
});
exports.handler = function (argv) {
    console.log("called set command");
};
