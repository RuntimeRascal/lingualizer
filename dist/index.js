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
var ste_events_1 = require("ste-events");
var util_1 = require("util");
var configPath = findup.sync(['.lingualizerrc', '.lingualizerrc.json']);
var configrc = configPath ? fse.readJSONSync(configPath) : {};
/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
var Lingualizer = /** @class */ (function () {
    /**
     * initialize a the single new instance of Lingualizer
     */
    function Lingualizer() {
        this._errorMessages = [
            "unable to find a translations directory  at '%s'.",
            "unable to find a translations file for '%s' at %s" /* initTranslations sub 1 */
        ];
        this._translations = {};
        this._locale = null;
        this._onLocaleChanged = new ste_events_1.EventDispatcher();
        this._locale = Lingualizer.DefaultLocale;
        this.initTranslations();
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
    Object.defineProperty(Lingualizer.prototype, "onLocaleChanged", {
        /**
         * subscribe to get notified when the locale changes
         *
         * @readonly
         * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
         * @memberof Lingualizer
         */
        get: function () {
            return this._onLocaleChanged.asEvent();
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
            var oldLocale = this._locale;
            if (oldLocale == locale)
                return;
            this._locale = locale;
            this.initTranslations(oldLocale);
            console.log("set locale to " + this._locale);
        },
        enumerable: true,
        configurable: true
    });
    Lingualizer.prototype.get = function (key) {
        if (this._translations == null)
            return '';
        var value = this._translations[key];
        if (typeof value === undefined || value == null)
            return '';
        return value;
    };
    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns
     */
    Lingualizer.prototype.initTranslations = function (oldLocale) {
        if (oldLocale === void 0) { oldLocale = this._locale; }
        var translationsPath = path.join(process.cwd(), Lingualizer.DefaulLocalizationDirName);
        if (!fse.existsSync(translationsPath))
            throw new Error(util_1.format(this._errorMessages[0], translationsPath));
        var file = path.join(translationsPath, Lingualizer.DefaultranslationFileName + "." + Lingualizer.DefaultranslationFileExt);
        if (this._locale == Lingualizer.DefaultLocale && !fse.existsSync(file))
            file = path.join(translationsPath, Lingualizer.DefaultranslationFileName + "." + this._locale + "." + Lingualizer.DefaultranslationFileExt);
        if (!fse.existsSync(file))
            throw new Error(util_1.format(this._errorMessages[1], this._locale, file));
        this._translations = JSON.parse(fse.readFileSync(file, "utf8"));
        this._onLocaleChanged.dispatch(this, { oldLocale: oldLocale, newLocale: this._locale });
    };
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @param {*} [configu]
     * @returns {*}
     * @memberof Lingualizer
     */
    Lingualizer.updateDefaults = function (configu) {
        var config = configu || configrc;
        if (config == null)
            return;
        if (config.defaultLocale)
            Lingualizer.DefaultLocale = config.defaultLocale;
        if (config.defaulLocalizationDirName)
            Lingualizer.DefaulLocalizationDirName = config.defaulLocalizationDirName;
        if (config.defaulLocalizationDirName)
            Lingualizer.DefaultranslationFileName = config.defaulLocalizationDirName;
        if (config.defaultranslationFileExt)
            Lingualizer.DefaultranslationFileExt = config.defaultranslationFileExt;
        return config;
    };
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns
     * @memberof Lingualizer
     */
    Lingualizer.printDefaults = function () {
        return "locale: " + Lingualizer.DefaultLocale + " dir: " + Lingualizer.DefaulLocalizationDirName + " file: " + Lingualizer.DefaultranslationFileName + " ext: " + Lingualizer.DefaultranslationFileExt;
    };
    /* if config provided, these defaults will be set to config upon file load */
    Lingualizer.DefaultLocale = 'en-US';
    Lingualizer.DefaultranslationFileName = 'translations';
    Lingualizer.DefaulLocalizationDirName = 'localization';
    Lingualizer.DefaultranslationFileExt = 'json';
    Lingualizer._instance = null;
    return Lingualizer;
}());
exports.Lingualizer = Lingualizer;
