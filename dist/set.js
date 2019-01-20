"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
var chalkpack = require("chalk");
var chalk = chalkpack.default;
var app = chalk.white('lingualizer->');
exports.command = 'set <key|k> <value|val|v> [locale]';
exports.describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
exports.builder = function (yargs) {
    return yargs
        .positional('key', {
        type: 'string',
        description: "the key to set translation for"
    })
        .positional('value', {
        type: 'string',
        description: "the value to set as the 'key'"
    })
        .positional('locale', {
        describe: "the locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l', 'loc'],
        required: false
    })
        .option('verbose', {
        alias: 'v',
        required: false,
    })
        .example('$0 set --key ok-btn --value "ok" --locale es-MX', "set the 'ok-btn' value from 'es-MX' locale to \"ok\"")
        //.demandOption( 'key', 'key: ' )
        //.demandOption( 'value', 'val: ' )
        .showHelpOnFail(true)
        .help('help');
};
exports.handler = function (argv) {
    var locale = argv.locale || _1.Lingualizer.DefaultLocale;
    if (argv.verbose)
        console.log(chalk.gray(app + " set loc: '" + chalk.cyan(locale) + "' key: '" + chalk.cyan(argv.key) + "' val: '" + chalk.cyan(argv.value) + "'"));
    var locDir = path.join(process.cwd(), _1.Lingualizer.DefaulLocalizationDirName);
    var files = fse.readdir(locDir);
};
