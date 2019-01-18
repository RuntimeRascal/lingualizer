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
exports.command = 'get [key] [locale]';
exports.describe = 'get a key from a certain locale or default in no locale';
exports.builder = yargs
    .option('key', {
    describe: "The key to get translation for",
    alias: ['k'],
    required: false
})
    .option('locale', {
    describe: "The locale",
    choices: ['es-MX', 'en-US'],
    required: false,
    alias: ['l']
});
exports.handler = function (argv) {
    console.log("called get command");
};
