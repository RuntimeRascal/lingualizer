"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
exports.defaultLocale = 'en-US';
exports._translations = {};
var defaultranslationFileName = 'translations';
var defaultranslationFileExt = 'json';
exports._locale = null;
/**
 * set `_translations` to json read from translations.json file according to the currently set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @returns
 */
function initTranslations() {
    var translationsPath = path.join(process.cwd(), 'localization');
    if (!fse.existsSync(translationsPath)) {
        throw new Error("unable to find a translations directory  at '" + translationsPath + "'.");
        return;
    }
    var file = path.join(translationsPath, defaultranslationFileName + "." + defaultranslationFileExt);
    if (exports._locale == exports.defaultLocale && !fse.existsSync(file)) {
        file = path.join(translationsPath, defaultranslationFileName + "." + exports._locale + "." + defaultranslationFileExt);
    }
    if (!fse.existsSync(file)) {
        throw new Error("unable to find a translations file for '" + exports._locale + "' at " + file + " ");
        return;
    }
    exports._translations = JSON.parse(fse.readFileSync(file, "utf8"));
}
exports.initTranslations = initTranslations;
/**
 * set the current locale and loads translations if found or default locale if cant find translations for set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @param {Locale} locale
 */
function setLocale(locale) {
    exports._locale = locale;
    initTranslations();
    console.log("set locale to " + exports._locale);
}
exports.setLocale = setLocale;
function getLocale() {
    return exports._locale;
}
exports.getLocale = getLocale;
