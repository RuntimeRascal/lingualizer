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
var request = require("request");
var chalkpack = require("chalk");
exports.chalk = chalkpack.default;
exports.terminalPrefix = exports.chalk.white('lingualizer->');
function log(message) {
    if (message === void 0) { message = ''; }
    console.log(exports.chalk.gray(exports.terminalPrefix + " " + message));
    return message;
}
exports.log = log;
function getLocale(argv) {
    return argv.locale || _1.Lingualizer.DefaultLocale;
}
exports.getLocale = getLocale;
function shouldUseProjectName() {
    return _1.Lingualizer.DefaultranslationFileName == '%project%';
}
exports.shouldUseProjectName = shouldUseProjectName;
/**
 * gets the name of the localization directory considering project dir name lookup
 */
function getLocalizationFileName() {
    return shouldUseProjectName()
        ? path.basename(process.cwd())
        : _1.Lingualizer.DefaultranslationFileName;
}
exports.getLocalizationFileName = getLocalizationFileName;
/**
 * gets the path to the localization directory according to the default directory name
 */
function getLocalizationDirectory() {
    return path.join(process.cwd(), _1.Lingualizer.Cwd, _1.Lingualizer.DefaulLocalizationDirName);
}
exports.getLocalizationDirectory = getLocalizationDirectory;
/**
 * given the locale will return the file name
 * @param locale the given locale, if none then assume default
 */
function getFileName(argv) {
    var locale = getLocale(argv);
    var fileName = getLocalizationFileName();
    if (locale !== _1.Lingualizer.DefaultLocale)
        fileName = fileName + "." + locale + ".json";
    else
        fileName = fileName + ".json";
    return fileName;
}
exports.getFileName = getFileName;
function isValidUrl(url) {
    try {
        var uri = new URL(url);
    }
    catch (error) {
        return false;
    }
    return true;
}
exports.isValidUrl = isValidUrl;
/**
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
function getJsonFile(url, filePath) {
    if (url === void 0) { url = null; }
    if (filePath === void 0) { filePath = null; }
    return __awaiter(this, void 0, void 0, function () {
        var urlGood, filePathGood, contents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlGood = url != null && url && url != '' && isValidUrl(url);
                    filePathGood = filePath != null && filePath && filePath != '';
                    if (!urlGood && !filePathGood) {
                        log(exports.chalk.red("no valid json file can be found"));
                        return [2 /*return*/];
                    }
                    if (!filePathGood) return [3 /*break*/, 2];
                    return [4 /*yield*/, fse.readFile(filePath)];
                case 1:
                    contents = _a.sent();
                    return [2 /*return*/, contents.toString()];
                case 2:
                    if (urlGood)
                        return [2 /*return*/, new Promise(function (resolve, reject) {
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
                            })];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getJsonFile = getJsonFile;
/**
 * so yargs lib says is async but return promise from handler and will not wait for resolution
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
function getJsonFileSync(url, filePath) {
    if (url === void 0) { url = null; }
    if (filePath === void 0) { filePath = null; }
    var urlGood = url != null && url && url != '' && isValidUrl(url);
    var filePathGood = filePath != null && filePath && filePath != '';
    if (!urlGood && !filePathGood) {
        log(exports.chalk.red("no valid json file can be found"));
        return;
    }
    if (filePathGood) {
        var contents = fse.readFileSync(filePath);
        return contents.toString();
    }
}
exports.getJsonFileSync = getJsonFileSync;
function writeFile(filePath, contents) {
    if (filePath == null || !filePath || !fse.existsSync(path.dirname(filePath))) {
        log(exports.chalk.red("cannot write file to: '" + filePath + "' you must provide valid path of which directory exists."));
        return false;
    }
    if (contents == null)
        contents = '';
    if (typeof contents != 'string')
        contents = JSON.stringify(contents);
    fse.writeFileSync(filePath, contents, { encoding: 'utf8' });
    return fse.existsSync(filePath);
}
exports.writeFile = writeFile;
function getValue(obj, dotSeperatedKey) {
    if (dotSeperatedKey.lastIndexOf('.') == -1) {
        return obj[dotSeperatedKey];
    }
    var tokens = dotSeperatedKey.split('.');
    var allButLast = dotSeperatedKey.substring(0, dotSeperatedKey.lastIndexOf('.'));
    var val = null;
    var value = getKeysValue(obj, allButLast, tokens[tokens.length - 1], '', val);
    return value;
}
exports.getValue = getValue;
;
function getKeysValue(obj, searchWholeKey, lastKey, wholeKey, foundVal) {
    if (wholeKey === void 0) { wholeKey = ''; }
    if (foundVal === void 0) { foundVal = null; }
    if (!searchWholeKey) 
    // there isnt any nesting to do so just update addKey on root
    {
        foundVal = obj[lastKey];
        return foundVal;
    }
    for (var key in obj) {
        var thisKey = "" + wholeKey + key;
        if (thisKey == searchWholeKey) {
            foundVal = obj[key][lastKey];
            if (foundVal != null)
                return foundVal;
        }
        else if (typeof obj[key] == 'object') {
            foundVal = getKeysValue(obj[key], searchWholeKey, lastKey, key + ".");
            if (foundVal != null)
                return foundVal;
        }
    }
}
