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
var findup = __importStar(require("find-up"));
var configPath = findup.sync(['.lingualizerrc', '.lingualizerrc.json']);
var config = configPath ? fse.readJSONSync(configPath) : {};
/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
var Lingualizer = /** @class */ (function () {
    function Lingualizer() {
        this._translations = {};
        this._locale = null;
    }
    Object.defineProperty(Lingualizer, "default", {
        get: function () {
            if (Lingualizer._instance == null)
                Lingualizer._instance = new Lingualizer();
            //TODO: look for and read in `.lingualizerrc settings
            return Lingualizer._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lingualizer.prototype, "locale", {
        /**
         * gets the currently set locale. will return `null` if locale has not been set
         * and can assume to use default locale
         *
         * @type {Locale}
         * @memberof Lingualizer
         */
        get: function () {
            return this._locale;
        },
        /**
         * set the current locale. will trigger the `localeChanged` event so subscribers
         * can get translations from the newly set locale
         *
         * @memberof Lingualizer
         */
        set: function (locale) {
            this._locale = locale;
            this.initTranslations();
            //TODO: trigger event
            console.log("set locale to " + this._locale);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns
     */
    Lingualizer.prototype.initTranslations = function () {
        var translationsPath = path.join(process.cwd(), 'localization');
        if (!fse.existsSync(translationsPath)) {
            throw new Error("unable to find a translations directory  at '" + translationsPath + "'.");
            return;
        }
        var file = path.join(translationsPath, Lingualizer.DefaultranslationFileName + "." + Lingualizer.DefaultranslationFileExt);
        if (this._locale == Lingualizer.DefaultLocale && !fse.existsSync(file)) {
            file = path.join(translationsPath, Lingualizer.DefaultranslationFileName + "." + this._locale + "." + Lingualizer.DefaultranslationFileExt);
        }
        if (!fse.existsSync(file)) {
            throw new Error("unable to find a translations file for '" + this._locale + "' at " + file + " ");
            return;
        }
        this._translations = JSON.parse(fse.readFileSync(file, "utf8"));
    };
    Lingualizer.DefaultLocale = 'en-US';
    Lingualizer.DefaultranslationFileName = 'translations';
    Lingualizer.DefaulLocalizationDirName = 'localization';
    Lingualizer.DefaultranslationFileExt = 'json';
    Lingualizer._instance = null;
    return Lingualizer;
}());
exports.Lingualizer = Lingualizer;
