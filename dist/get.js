"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
exports.command = 'get [key] [locale]';
exports.describe = 'get a key from a certain locale or default in no locale';
exports.builder = function (yargs) {
    return yargs.option('key', {
        describe: "The key to get translation for",
        alias: ['k'],
        default: '',
        required: false
    })
        .option('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        required: false,
        default: _1.Lingualizer.DefaultLocale,
        alias: ['l']
    })
        .option('verbose', {
        alias: 'v',
        required: false,
        default: false,
    });
    ;
};
exports.handler = function (argv) {
    console.log("called get command");
};
