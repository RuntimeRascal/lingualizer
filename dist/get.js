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
exports.command = 'get [key] [locale]';
exports.describe = 'get a key from a certain locale or default in no locale';
exports.builder = function (yargs) {
    return yargs
        .positional('key', {
        type: 'string',
        describe: "The key to set translation for",
        alias: ['k'],
        required: false
    })
        .positional('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l', 'loc'],
        required: false
    })
        .option('verbose', {
        alias: 'v',
        required: false,
    })
        //.demandOption( 'key', 'key: ' )
        .example('$0 get', "get all key value pairs in default locale if exists")
        .example('$0 get --locale es-MX', "get all key value pairs in 'es-MX' locale if exists")
        .example('$0 get ok-btn', "get the 'ok-btn' value from default locale")
        .example('$0 get ok-btn es-MX', "get the 'ok-btn' value from 'es-MX' locale")
        .example('$0 get ok-btn --locale es-MX', "get the 'ok-btn' value from 'es-MX' locale")
        .help('help');
};
exports.handler = function (argv) {
    var locale = argv.locale || _1.Lingualizer.DefaultLocale;
    if (argv.verbose)
        console.log(chalk.gray(app + " get loc: '" + chalk.cyan(locale) + "' key: '" + chalk.cyan(argv.key) + "'"));
    var fileName = _1.Lingualizer.DefaultranslationFileName == '%project%' ? path.basename(process.cwd()) : _1.Lingualizer.DefaultranslationFileName;
    if (locale !== _1.Lingualizer.DefaultLocale)
        fileName = fileName + "." + locale + ".json";
    else
        fileName = fileName + ".json";
    var filePath = path.join(process.cwd(), _1.Lingualizer.DefaulLocalizationDirName, fileName);
    //let files = fse.readdir( locDir );
    if (!fse.existsSync(filePath)) {
        console.log(chalk.gray(app + " " + chalk.bgRedBright("cannot find translation file at: '" + chalk.bgBlue(filePath) + "'. please create it first")));
        return;
    }
    var json = fse.readJSONSync(filePath);
    var value = undefined;
    // if no key given show all key values
    if (argv.key) {
        value = json[argv.key];
        if (typeof value == undefined || !value) {
            console.log(chalk.gray(app + " cannot find key " + chalk.cyan(argv.key)));
            return;
        }
        console.log(chalk.gray(app + " key: '" + chalk.cyan(argv.key) + "' value: '" + chalk.cyan(value) + "'"));
    }
    else {
        printMembers(json);
        // value = JSON.stringify( json );
    }
};
function printMembers(obj, prefix) {
    if (prefix === void 0) { prefix = ''; }
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var v = obj[key];
            if (typeof v == typeof '') {
                console.log(chalk.gray(app + " key: '" + chalk.cyan("" + prefix + (prefix == '' ? '' : '.') + key) + "' value: '" + chalk.cyan(JSON.stringify(v)) + "'"));
            }
            else {
                printMembers(v, key);
            }
        }
    }
}
