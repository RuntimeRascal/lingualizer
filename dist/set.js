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
var path = require("path");
var fse = require("fs-extra");
var common_1 = require("./common");
exports.command = 'set [key] [value] [locale]';
exports.describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
exports.builder = function (yargs) {
    return yargs
        .positional('key', {
        type: 'string',
        description: "the key to set translation for",
        alias: ['k'],
    })
        .positional('value', {
        type: 'string',
        description: "the value to set as the 'key'",
        alias: ['v', 'val']
    })
        .positional('locale', {
        describe: "The locale",
        choices: ['es-MX', 'en-US'],
        alias: ['l', 'loc'],
    })
        .option('verbose', {
        required: false,
    })
        .example('$0 set "ok-btn" "ok" --locale es-MX', "set the 'ok-btn' value from 'es-MX' locale to \"ok\"");
};
function handler(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            argv.asyncResult = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var locale, locDir, fileName, filePath, contents, json, tokens, lastKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            locale = common_1.getLocale(argv);
                            if (argv.verbose)
                                console.log(common_1.chalk.gray(common_1.terminalPrefix + " set key: '" + common_1.chalk.cyan(argv.key) + "' val: '" + common_1.chalk.cyan(argv.value) + "' loc: '" + common_1.chalk.cyan(locale) + "'"));
                            if (!argv.key || !argv.value) {
                                resolve(common_1.log(common_1.chalk.red('you must provide a valid key and value')));
                                return [2 /*return*/];
                            }
                            locDir = common_1.getLocalizationDirectoryPath(true);
                            fileName = common_1.getFileNameWithExtention(argv, true);
                            filePath = path.join(locDir, fileName);
                            if (!fse.existsSync(filePath)) {
                                resolve(common_1.log("" + common_1.chalk.bgRedBright("cannot find translation file at: '" + common_1.chalk.bgBlue(filePath) + "'. please create it first")));
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, common_1.getJsonFile(null, filePath)];
                        case 1:
                            contents = _a.sent();
                            json = null;
                            try {
                                json = JSON.parse(contents);
                            }
                            catch (error) {
                                json = null;
                            }
                            if (json == null) {
                                resolve(common_1.log("" + common_1.chalk.bgRedBright("unable to parse: '" + common_1.chalk.bgBlue(filePath) + "' to valid json object")));
                                return [2 /*return*/];
                            }
                            try {
                                tokens = argv.key.split('.');
                                lastKey = argv.key.substring(0, argv.key.lastIndexOf('.'));
                                ensureKey(json, lastKey);
                                update(json, lastKey, tokens[tokens.length - 1], argv.value);
                            }
                            catch (error) {
                                resolve(common_1.log("" + common_1.chalk.bgRedBright("unable to parse: '" + common_1.chalk.bgBlue(argv.key) + "' to valid json object")));
                                return [2 /*return*/];
                            }
                            common_1.writeFile(filePath, json);
                            resolve(common_1.log(common_1.chalk.green("successfully upadated key: " + common_1.chalk.italic.bold.cyan(" " + argv.key + " ") + " to '" + common_1.chalk.italic.bold.cyan(" " + argv.value + " ") + "'")));
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/, argv.asyncResult];
        });
    });
}
exports.handler = handler;
/**
 * update a json property nested or not from a dot-seperated property key
 *
 * if '@addKey' or '@addValue' is empty then nothing will be updated
 * if '@searchWholeKey' is empty then the '@addKey' will be placed on the root
 * if '@addKey' exists and and is an object then it will be replaced with the '@addValue'
 * if '@addKey' does not exist then it will not be udpated. please ensure the key to add a new key to exists
 *      before calling this function call @ensureKey first
 *
 * @param obj the root json object to update
 * @param searchWholeKey the whole dot-seperated property of which to add the new key to
 * @param addKey the new key to add to the @searchWholeKey property
 * @param addValue the value to asign to @addKey
 * @param wholeKey the recursive dot-seperated key to keep track of where were at. pass nothing in here
 */
function update(obj, searchWholeKey, addKey, addValue, wholeKey) {
    if (wholeKey === void 0) { wholeKey = ''; }
    if (!addKey || !addValue) {
        common_1.log(common_1.chalk.red('must have a key and value to update'));
        return;
    }
    if (!searchWholeKey) 
    // there isnt any nesting to do so just update addKey on root
    {
        obj[addKey] = addValue;
        return;
    }
    for (var key in obj) {
        var thisKey = "" + wholeKey + key;
        if (thisKey == searchWholeKey) {
            obj[key][addKey] = addValue;
            return;
        }
        else if (typeof obj[key] == 'object') {
            update(obj[key], searchWholeKey, addKey, addValue, key + ".");
        }
    }
}
/**
 * ensure that the dot-seperated property @key exists and if not create an empty object
 *
 * @param obj the json object to ensure property exists no matter how many levels deep it is
 * @param key the dot-seperated property to ensure exists
 */
function ensureKey(obj, key) {
    if (!key)
        return;
    var tokens = key.split('.');
    var nestedObj = obj;
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (typeof nestedObj[token] == 'undefined') {
            nestedObj[token] = {};
        }
        if ((tokens.length - 1) !== i && typeof nestedObj[token] !== 'object')
            // its not the last one so ensure we have a object not a string
            nestedObj[token] = {};
        nestedObj = nestedObj[token];
    }
}
