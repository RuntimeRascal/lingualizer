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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var path = require("path");
var fse = require("fs-extra");
var common_1 = require("./common");
var defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };
exports.command = 'create [locale] [based-off] [force]';
exports.describe = 'create a translation file and the localization directory if needed';
exports.builder = function (yargs) {
    return yargs
        .positional('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l'],
    })
        .positional('based-off', {
        describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
        alias: ['b'],
    })
        .positional('force', {
        describe: "overwrite file if exists",
    })
        .option('verbose', {
        alias: 'v',
        required: false,
    })
        .example('$0 create --locale en-US --based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"');
};
function handler(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    argv.asyncResult = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var locDir, fileName, filePath, defaultLocaleFilePath, contents;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    locDir = ensureLocalizationDirectory();
                                    fileName = common_1.getFileNameWithExtention(argv, true);
                                    filePath = path.join(locDir, fileName);
                                    if (fse.existsSync(filePath) && !argv.force) {
                                        resolve(common_1.log("the file allready exists. please use '" + common_1.chalk.blue('--force') + "' to overwrite it."));
                                        return [2 /*return*/];
                                    }
                                    defaultLocaleFilePath = null;
                                    if (argv.locale && argv.locale !== _1.Lingualizer.DefaultLocale)
                                        defaultLocaleFilePath = path.join(locDir, common_1.getLocalizationFileName(true) + ".json");
                                    return [4 /*yield*/, getContents(argv, defaultLocaleFilePath)];
                                case 1:
                                    contents = _a.sent();
                                    fse.writeJSONSync(filePath, contents, { encoding: 'utf8' });
                                    resolve(common_1.log("created file: '" + common_1.chalk.cyan(fileName) + "'"));
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, argv.asyncResult];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.handler = handler;
/**
 * get the contents to write to translation file
 * @param argv the arguments passed to script
 * @param getDefault wether or not to get the contents from the default locale file. this is for translated files so to allow not createing the file with all the default locale keys to translate from
 * @param defaultFilePath path to the default file in order to base off default locale file contents or `null` to base off default content
 */
function getContents(argv, defaultFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var getFromUrl, contents, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    getFromUrl = argv.basedOff && argv.basedOff !== '' && common_1.isValidUrl(argv.basedOff);
                    contents = defaultTranslationContents;
                    if (defaultFilePath != null && fse.existsSync(defaultFilePath) && !getFromUrl) 
                    // get contents from default locale
                    {
                        common_1.log("getting contents from default locale file: '" + common_1.chalk.cyan(defaultFilePath) + "'");
                        contents = fse.readJSONSync(defaultFilePath);
                    }
                    if (!getFromUrl) return [3 /*break*/, 2];
                    common_1.log("downloading contents from '" + common_1.chalk.cyan(argv.basedOff) + "'");
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, common_1.getJsonFile(argv.basedOff, null)];
                case 1:
                    contents = _b.apply(_a, [_c.sent()]);
                    common_1.log("downloaded contents '" + common_1.chalk.cyan(JSON.stringify(contents)) + "'");
                    _c.label = 2;
                case 2: return [2 /*return*/, contents];
            }
        });
    });
}
/**
 * create the localization directory if it does not allready exist
 */
function ensureLocalizationDirectory() {
    var locDir = common_1.getLocalizationDirectoryPath(true);
    if (!fse.existsSync(locDir))
        common_1.log("created '" + common_1.chalk.cyanBright(_1.Lingualizer.DefaulLocalizationDirName) + "' directory");
    fse.ensureDirSync(locDir);
    if (!fse.existsSync(locDir))
        throw new Error(common_1.terminalPrefix + " cannot create '" + common_1.chalk.cyanBright(_1.Lingualizer.DefaulLocalizationDirName) + "' directory at '" + common_1.chalk.red(locDir) + "'");
    return locDir;
}
