"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fse = require("fs-extra");
var common_1 = require("./common");
exports.command = 'get [key] [locale]';
exports.describe = 'get a key from a certain locale or default in no locale';
exports.builder = function (yargs) {
    return yargs
        .help()
        .positional('key', {
        type: 'string',
        describe: "The key to set translation for",
        alias: ['k'],
    })
        .positional('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l', 'loc'],
    })
        .option('verbose', {
        alias: 'v',
        required: false,
    })
        .demandCommand()
        .example('$0 get', "get all key value pairs in default locale if exists")
        .example('$0 get --locale es-MX', "get all key value pairs in 'es-MX' locale if exists")
        .example('$0 get ok-btn', "get the 'ok-btn' value from default locale")
        .example('$0 get ok-btn es-MX', "get the 'ok-btn' value from 'es-MX' locale")
        .example('$0 get ok-btn --locale es-MX', "get the 'ok-btn' value from 'es-MX' locale");
};
exports.handler = function (argv) {
    var locale = common_1.getLocale(argv);
    if (argv.verbose)
        common_1.log("get loc: '" + common_1.chalk.cyan(locale) + "' key: '" + common_1.chalk.cyan(argv.key) + "'");
    var fileName = common_1.getFileName(argv);
    var filePath = path.join(common_1.getLocalizationDirectory(), fileName);
    if (!fse.existsSync(filePath)) {
        common_1.log("" + common_1.chalk.bgRedBright("cannot find translation file at: '" + common_1.chalk.bgBlue(filePath) + "'. please create it first"));
        return;
    }
    var json = fse.readJSONSync(filePath);
    var value = undefined;
    if (argv.key) {
        value = json[argv.key];
        if (typeof value == undefined || !value) {
            common_1.log("cannot find key " + common_1.chalk.cyan(argv.key));
            return;
        }
        printTranslation(argv.key, value);
    }
    else // if no key given show all key values
     {
        printMembers(json);
    }
};
function printTranslation(key, value) {
    common_1.log("'" + common_1.chalk.cyan(key) + "' : '" + common_1.chalk.cyan(value) + "'");
}
function printMembers(obj, prefix) {
    if (prefix === void 0) { prefix = ''; }
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var v = obj[key];
            if (typeof v == typeof '')
                printTranslation("" + prefix + (prefix == '' ? '' : '.') + key, JSON.stringify(v));
            else
                printMembers(v, key);
        }
    }
}
