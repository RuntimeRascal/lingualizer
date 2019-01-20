"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var path = require("path");
var fse = require("fs-extra");
var request = require("request");
var chalkpack = require("chalk");
var chalk = chalkpack.default;
var app = chalk.white('lingualizer->');
var defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };
exports.command = 'create [locale] [file-name] [based-off]';
exports.describe = 'create a translation file and the localization directory if needed';
exports.builder = function (yargs) {
    return yargs
        .help()
        .option('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l'],
        required: false,
    })
        .option('file-name', {
        describe: "The translation filename",
        alias: ['f'],
        required: false,
    })
        .option('based-off', {
        describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
        alias: ['b'],
        required: false,
    })
        .option('force', {
        describe: "overwrite file if exists",
        required: false,
    })
        .option('verbose', {
        alias: 'v',
        required: false,
    })
        .demandCommand()
        .example('$0 create --locale en-US --based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"');
};
exports.handler = function (argv) { return __awaiter(_this, void 0, void 0, function () {
    var locDir, fileName, justName, name, getContentFromDefault, filePath, contents;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                locDir = createLocalizationDirectory(argv);
                fileName = _1.Lingualizer.DefaultranslationFileName == '%project%' ? path.basename(process.cwd()) : _1.Lingualizer.DefaultranslationFileName;
                justName = argv.fileName || fileName;
                name = justName;
                getContentFromDefault = false;
                if (!argv.locale || argv.locale == _1.Lingualizer.DefaultLocale) 
                // default locale - no locale in name
                {
                    name = name + ".json";
                }
                else 
                // put the locale in the file name
                {
                    getContentFromDefault = true;
                    name = name + "." + (argv.locale || _1.Lingualizer.DefaultLocale) + ".json";
                }
                filePath = path.join(locDir, name);
                if (fse.existsSync(filePath) && !argv.force) {
                    console.log(chalk.gray(app + " the file allready exists. please use '" + chalk.blue('--force') + "' to overwrite it."));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, getContents(argv, getContentFromDefault, locDir, justName)];
            case 1:
                contents = _a.sent();
                fse.writeJSONSync(filePath, contents, { encoding: 'utf8' });
                console.log(chalk.gray(app + " created file: '" + chalk.cyan(name) + "'"));
                return [2 /*return*/];
        }
    });
}); };
function getContents(argv, getDefault, dir, name) {
    return __awaiter(this, void 0, void 0, function () {
        var getFromUrl, contents, defaultLocalePath, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getFromUrl = argv.basedOff && argv.basedOff !== '' && validUrl(argv.basedOff);
                    contents = defaultTranslationContents;
                    if (getDefault && !getFromUrl) 
                    // get contents from default locale
                    {
                        defaultLocalePath = path.join(dir, name + ".json");
                        console.log(chalk.gray(app + " getting contents from default locale file: '" + chalk.cyan(defaultLocalePath) + "'"));
                        if (fse.existsSync(defaultLocalePath))
                            contents = fse.readJSONSync(defaultLocalePath);
                    }
                    if (!getFromUrl) return [3 /*break*/, 2];
                    console.log(chalk.gray(app + " downloading contents from '" + chalk.cyan(argv.basedOff) + "'"));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, getJsonFile(argv.basedOff)];
                case 1:
                    contents = _b.apply(_a, [_c.sent()]);
                    console.log(chalk.italic.gray(app + " downloaded contents '" + chalk.cyan(JSON.stringify(contents)) + "'"));
                    _c.label = 2;
                case 2: return [2 /*return*/, contents];
            }
        });
    });
}
function createLocalizationDirectory(argv) {
    var locDir = path.join(process.cwd(), _1.Lingualizer.DefaulLocalizationDirName);
    if (!fse.existsSync(locDir))
        console.log(chalk.gray(app + " created '" + chalk.cyanBright(_1.Lingualizer.DefaulLocalizationDirName) + "' directory"));
    fse.ensureDirSync(locDir);
    if (!fse.existsSync(locDir))
        throw new Error(app + " cannot create '" + chalk.cyanBright(_1.Lingualizer.DefaulLocalizationDirName) + "' directory at '" + chalk.red(locDir) + "'");
    return locDir;
}
function validUrl(url) {
    try {
        var uri = new URL(url);
    }
    catch (error) {
        return false;
    }
    return true;
}
function getJsonFile(url) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: 'https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json',
            qs: { '': '' },
            headers: { Accept: 'application/json' }
        };
        request(options, function (error, response, body) {
            if (error)
                reject(error);
            resolve(body);
        });
    });
}
