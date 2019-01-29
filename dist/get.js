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
exports.command = 'get [key] [locale]';
exports.describe = 'get a key from a certain locale or default in no locale';
exports.builder = function (yargs) {
    return yargs
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
        .example('$0 get', "get all key value pairs in default locale if exists")
        .example('$0 get --locale es-MX', "get all key value pairs in 'es-MX' locale if exists")
        .example('$0 get ok-btn', "get the 'ok-btn' value from default locale")
        .example('$0 get ok-btn es-MX', "get the 'ok-btn' value from 'es-MX' locale")
        .example('$0 get ok-btn --locale es-MX', "get the 'ok-btn' value from 'es-MX' locale");
};
function handler(argv) {
    var _this = this;
    argv.asyncResult = new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
        var locale, fileName, filePath, json, value;
        return __generator(this, function (_a) {
            locale = common_1.getLocale(argv);
            if (argv.verbose) {
                common_1.log("get loc: '" + common_1.chalk.cyan(locale) + "' key: '" + common_1.chalk.cyan(argv.key) + "'");
            }
            fileName = common_1.getFileNameWithExtention(argv, true);
            filePath = path.join(common_1.getLocalizationDirectoryPath(true), fileName);
            if (!fse.existsSync(filePath)) {
                resolve(common_1.log("" + common_1.chalk.bgRedBright("cannot find translation file at: '" + common_1.chalk.bgBlue(filePath) + "'. please create it first")));
                return [2 /*return*/];
            }
            json = fse.readJSONSync(filePath);
            value = undefined;
            if (argv.key) {
                value = common_1.getNestedValueFromJson(json, argv.key);
                //value = json[ argv.key ];
                if (typeof value == undefined || !value) {
                    resolve(common_1.log("cannot find key " + common_1.chalk.cyan(argv.key)));
                    return [2 /*return*/];
                }
                printTranslation(argv.key, value);
            }
            else // if no key given show all key values
             {
                printMembers(json);
            }
            resolve(value);
            return [2 /*return*/];
        });
    }); });
    return argv.asyncResult;
}
exports.handler = handler;
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
