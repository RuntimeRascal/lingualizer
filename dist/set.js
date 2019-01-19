"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = 'set [key] [value] [locale]';
exports.describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
exports.builder = function (yargs) {
    return yargs
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
};
exports.handler = function (argv) {
    console.log("called set command");
};
