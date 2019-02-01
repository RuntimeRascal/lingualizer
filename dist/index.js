"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fse = require("fs-extra");
var findup = require("find-up");
var ste_events_1 = require("ste-events");
var util_1 = require("util");
var chalk_1 = require("chalk");
var common_1 = require("./common");
var app = chalk_1.default.white('lingualizer->');
var Lookup = [
    { locale: 'en-US', tag: 'English', language: 'United States' },
    { locale: 'es-MX', tag: 'Spanish', language: 'Mexico' },
    { locale: 'fr-FR', tag: 'French', language: 'France' },
    { locale: 'nl-NL', tag: 'Dutch', language: 'Netherlands' },
    { locale: 'de-DE', tag: 'German', language: 'Germany' },
    { locale: 'it-IT', tag: 'Italian', language: 'Italian' },
    { locale: 'pol', tag: 'Polish', language: 'Poland' },
    { locale: 'el-GR', tag: 'Greek ', language: 'Greece' },
    { locale: 'pt-BR', tag: 'Portuguese', language: 'Brazil' },
    { locale: 'pt-PT', tag: 'Portuguese', language: 'Portugal' },
    { locale: 'ar-SA', tag: 'Arabic', language: 'Arabic' },
    { locale: 'zh-CHT', tag: 'Chinese', language: 'Traditional' },
    { locale: 'ko-KR', tag: 'Korean', language: 'Korea' },
    { locale: 'ja-JP', tag: 'Japanese', language: 'Japan' },
    { locale: 'vi-VN', tag: 'Vietnamese', language: 'Vietnamese' },
    { locale: 'ro-RO', tag: 'Romanian', language: 'Romanian' },
    { locale: 'ru-RU', tag: 'Russian', language: 'Russian' },
    { locale: 'bg-BG', tag: 'Bulgarian', language: 'Bulgarian' },
    { locale: 'id-ID', tag: 'Indonesian ', language: 'Indonesia' },
    { locale: 'mk-MK', tag: 'Macedonian', language: 'Macedonian' },
    { locale: 'th-TH', tag: 'Thai', language: 'Thailand' },
    { locale: 'zh-CHS', tag: 'Chinese ', language: 'Simplified' },
    { locale: 'tr-TR', tag: 'Turkish', language: 'Turkey' },
];
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
    }
    // private constructor ()
    // {
    //     this._onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();
    //     Lingualizer.updateDefaults();
    //     this._locale = Lingualizer.DefaultLocale;
    //     //this.initTranslations();
    // }
    Lingualizer.logInfo = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (!Lingualizer._logger || Lingualizer._logger === null)
            return;
        if (typeof Lingualizer._logger.info == 'undefined' || typeof Lingualizer._logger.info !== 'function')
            return;
        Lingualizer._logger.info(params);
    };
    Lingualizer.logError = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        if (!Lingualizer._logger || Lingualizer._logger === null)
            return;
        if (typeof Lingualizer._logger.error == 'undefined' || typeof Lingualizer._logger.error !== 'function')
            return;
        Lingualizer._logger.error(params);
    };
    Object.defineProperty(Lingualizer, "root", {
        get: function () {
            return Lingualizer._projectRoot;
        },
        set: function (root) {
            Lingualizer._projectRoot = root;
            Lingualizer.logInfo(common_1.terminalPrefix + " setting project root to: '" + root + "'");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lingualizer, "onLocaleChanged", {
        /**
         * #### Lingualizer singleton instance
         * > use to access the members of the `Lingualizer` module.
         *
         * @readonly
         * @static
         * @type {Lingualizer}
         * @memberof Lingualizer
         */
        // public static get default (): Lingualizer
        // {
        //     if ( Lingualizer._instance == null )
        //     {
        //         if ( typeof process.versions[ 'electron' ] !== 'undefined' && process.versions[ 'electron' ] )
        //         {
        //             // try to get module using remote from main proccess if exists else create it and set it globally
        //             try 
        //             {
        //                 let electron = require( 'electron' );
        //                 if ( typeof electron != 'undefined' && electron )
        //                 {
        //                     if ( typeof electron.remote != 'undefined' )
        //                     {
        //                         let remote = electron.remote;
        //                         if ( typeof remote != 'undefined' && typeof remote.getGlobal != 'undefined' && typeof remote.getGlobal == 'function' )
        //                         {
        //                             let lingualizer = null;
        //                             try
        //                             {
        //                                 lingualizer = remote.getGlobal( 'lingualizer' );
        //                             } catch ( error )
        //                             {
        //                             }
        //                             if ( typeof lingualizer != 'undefined' && lingualizer != null )
        //                                 Lingualizer._instance = lingualizer;
        //                         }
        //                     }
        //                 }
        //             } catch ( error ) 
        //             {
        //             }
        //             if ( Lingualizer._instance == null )
        //                 Lingualizer._instance = new Lingualizer();
        //             // set it electron global so can access from renderer proccess.
        //             ( global as any ).lingualizer = Lingualizer._instance;
        //         } else
        //         {
        //             Lingualizer._instance = new Lingualizer();
        //         }
        //     }
        //     //TODO: look for and read in `.lingualizerrc settings
        //     return Lingualizer._instance;
        // }
        /**
         * #### Get the localeChanged event
         * > subscribe to event to get notified of locale changing.
         *
         * @property {IEvent<Lingualizer, LocaleChangedEventArgs>} Lingualizer.default.onLocaleChanged
         * @readonly
         * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
         * @memberof Lingualizer
         */
        get: function () {
            return Lingualizer._onLocaleChanged.asEvent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lingualizer, "locale", {
        /**
         * #### Gets the current locale.
         * > will return `null` if locale has not been set
         * > if not set, @{link Lingualizer.default.get()} will use @{link Lingualizer#DefaultLocale}
         */
        get: function () {
            return Lingualizer._locale;
        },
        /**
         * #### Set the current locale.
         * > will trigger the `localeChanged` event so subscribers can get translations from the newly set locale
         *
         * @fires onLocaleChanged
         * @type {Locale}
         * @property {Locale} Lingualizer.default.locale
         * @memberof Lingualizer
         */
        set: function (locale) {
            var oldLocale = Lingualizer._locale;
            if (oldLocale == locale)
                return;
            Lingualizer._locale = locale;
            try {
                Lingualizer.initTranslations(oldLocale);
            }
            catch (error) {
                util_1.log("failed to initialize translations. error: " + error.message);
                Lingualizer.logError(common_1.terminalPrefix + " failed to initialize translations. error: " + error.message);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * #### Get a translation
     * > get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @param {string} key the name _[key]_ of the string to look up
     * @returns {string} get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     * @memberof Lingualizer
     */
    Lingualizer.get = function (key) {
        if (Lingualizer._defaultLocaleTranslations == null && Lingualizer._translations == null) {
            Lingualizer.logError(common_1.terminalPrefix + " cannot get key: '" + key + "' since there are no translations found or loaded");
            return '';
        }
        var value = null;
        if (Lingualizer.locale !== Lingualizer.DefaultLocale && Lingualizer._translations !== null) {
            var getVal = common_1.getNestedValueFromJson(Lingualizer._translations, key);
            if (typeof getVal !== 'undefined') {
                return getVal;
            }
        }
        // allways try to return the string from default tranlation file even if cant find a translated one
        if (Lingualizer._defaultLocaleTranslations !== null) {
            var getVal = common_1.getNestedValueFromJson(Lingualizer._defaultLocaleTranslations, key);
            if (typeof getVal !== 'undefined')
                value = getVal;
        }
        return value;
    };
    /**
     * #### Initialize translations.
     * > reads the translation file json into memory for future get requests
     *
     * @export
     * @returns
     */
    Lingualizer.initTranslations = function (oldLocale) {
        if (oldLocale === void 0) { oldLocale = Lingualizer._locale; }
        var translationsPath = common_1.getLocalizationDirectoryPath(false, Lingualizer._projectRoot);
        if (!fse.existsSync(translationsPath)) {
            // return;
            Lingualizer.logError(common_1.terminalPrefix + " attempt to init translations from '" + translationsPath + "' directory failed as the directory does not exist.");
            throw new Error(util_1.format(Lingualizer._errorMessages[0], translationsPath));
        }
        ;
        var defaultFile = path.join(translationsPath, common_1.getLocalizationFileName(false) + "." + Lingualizer.DefaultTranslationFileExt);
        var localeFile = path.join(translationsPath, common_1.getLocalizationFileName(false) + "." + Lingualizer.locale + "." + Lingualizer.DefaultTranslationFileExt);
        // allways try load the default locale translations as we dish them if translated cant be found and it's the most common
        //  as in what would be loaded at starup only changing if set locale to non-default
        if (fse.existsSync(defaultFile)) {
            Lingualizer._defaultLocaleTranslations = JSON.parse(fse.readFileSync(defaultFile, "utf8"));
            Lingualizer._onLocaleChanged.dispatch(Lingualizer, { oldLocale: oldLocale, newLocale: Lingualizer._locale });
        }
        else {
            if (Lingualizer.locale == Lingualizer.DefaultLocale) {
                throw new Error(util_1.format(Lingualizer._errorMessages[1], Lingualizer._locale, defaultFile));
            }
        }
        if (Lingualizer.locale !== Lingualizer.DefaultLocale) 
        // try load non-default locale
        {
            if (fse.existsSync(localeFile)) {
                Lingualizer._translations = JSON.parse(fse.readFileSync(localeFile, "utf8"));
                Lingualizer._onLocaleChanged.dispatch(Lingualizer, { oldLocale: oldLocale, newLocale: Lingualizer._locale });
            }
            else {
                //console.log( `${ terminalPrefix } requested locale translation file cannot be found.` );
                throw new Error(util_1.format(Lingualizer._errorMessages[1], Lingualizer._locale, defaultFile));
            }
        }
    };
    /**
     * #### Set the Lingualizer logger.
     * > all logging messages will try to log using set logger with info and error functions if they exist.
     *
     * @param {ILogger} logger a logger object that contains at least a info and error logging methods
     * @memberof Lingualizer
     */
    Lingualizer.setLogger = function (logger) {
        Lingualizer._logger = logger;
    };
    /**
     * #### Set the project's absolute path
     * > use if default's are not working for your configuration.
     * > the path must exist to successfully set the ProjectRoot.
     *
     * @static
     * @param {string} projectDir the absolute path to use for determining Lingualizer related paths.
     * @memberof Lingualizer
     */
    Lingualizer.setProjectDir = function (projectDir) {
        Lingualizer.ProjectRoot = projectDir;
        // if ( fse.existsSync( projectDir ) )
        //     Lingualizer.ProjectRoot = projectDir;
        // else
        //     log( chalk.red( `cannot set project root directory to a directory that does not exist. '${ projectDir }'` ) );
    };
    /**
     * # for internal use
     * > sets all @{link Lingualizer} static defaults with provided `configu` or:
     * > - looks up any `.lingualizerrc` | `.lingualizerrc.json` and uses this if found
     * > - looks up any `lingualizer` in `package.json` and uses this if found
     *
     * > if no `configu` argument is provided and the configuration has allready been looked up, it will not be looked up again.
     *
     * @static
     * @param {*} [configu] configuration object to use to set all defaults with
     * @returns {*} the current determined configuration object
     * @memberof Lingualizer
     */
    Lingualizer.updateDefaults = function (configu) {
        if (typeof Lingualizer.config == 'undefined' || !Lingualizer.config) 
        // try to find the config
        {
            if (!configu) {
                var configPath = findup.sync(['.lingualizerrc', '.lingualizerrc.json']);
                Lingualizer.config = configPath ? fse.readJSONSync(configPath) : null;
                if (!Lingualizer.config || Lingualizer.config == null) {
                    //TODO: read in from package json
                }
            }
            else {
                Lingualizer.config = configu;
            }
            if (typeof Lingualizer.config == 'undefined' || !Lingualizer.config)
                return;
        }
        else {
            // we have allready gotten config so dont get it again.
            // we dont want cli and index to interfere with eachother
            return;
        }
        // set all static defaults
        if (typeof Lingualizer.config.defaultLocale != undefined)
            Lingualizer.DefaultLocale = Lingualizer.config.defaultLocale;
        if (typeof Lingualizer.config.defaulLocalizationDirName != undefined)
            Lingualizer.DefaulLocalizationDirName = Lingualizer.config.defaulLocalizationDirName;
        if (typeof Lingualizer.config.defaultTranslationFileName != undefined)
            Lingualizer.DefaultranslationFileName = Lingualizer.config.defaultTranslationFileName;
        if (typeof Lingualizer.config.defaultTranslationFileExt != undefined)
            Lingualizer.DefaultTranslationFileExt = Lingualizer.config.defaultTranslationFileExt;
        if (typeof Lingualizer.config.cmdCwd != undefined)
            Lingualizer.CmdCwd = Lingualizer.config.cmdCwd;
        if (typeof Lingualizer.config.cwd != undefined)
            Lingualizer.Cwd = Lingualizer.config.cwd;
        if (typeof Lingualizer.config.isElectron != undefined)
            Lingualizer.IsElectron = Lingualizer.config.isElectron;
        return Lingualizer.config;
    };
    /**
     * # for internal use
     * > prints to console all the configuration and current defaults as determined.
     *
     * @static
     * @returns
     * @memberof Lingualizer
     */
    Lingualizer.printDefaults = function () {
        console.log(chalk_1.default.gray(app + " \n        " + chalk_1.default.bold.green('------- Default Settings -------') + " \n        Locale    : '" + chalk_1.default.cyan(Lingualizer.DefaultLocale) + "' \n        Directory : '" + chalk_1.default.cyan(Lingualizer.DefaulLocalizationDirName) + "'\n        File      : '" + chalk_1.default.cyan(common_1.getLocalizationFileName(false)) + "' \n        Ext       : '" + chalk_1.default.cyan(Lingualizer.DefaultTranslationFileExt) + "'\n        Cwd       : '" + chalk_1.default.cyan(Lingualizer.Cwd) + "'\n        Cmd Cwd   : '" + chalk_1.default.cyan(Lingualizer.CmdCwd) + "'\n        Electron  : '" + chalk_1.default.cyan(Lingualizer.IsElectron.toString()) + "'\n\n        Project ------------\n        Directory : '" + chalk_1.default.cyan(common_1.getLocalizationDirectoryPath(false)) + "'\n        Filename  : '" + chalk_1.default.cyan(common_1.getLocalizationFileName(false) + "." + Lingualizer.DefaultTranslationFileExt) + "'\n       \n        Terminal -----------\n        Directory : '" + chalk_1.default.cyan(common_1.getLocalizationDirectoryPath(true)) + "'\n        Filename  : '" + chalk_1.default.cyan(common_1.getLocalizationFileName(true) + "." + Lingualizer.DefaultTranslationFileExt) + "'\n        " + chalk_1.default.bold.green('--------------------------------')));
    };
    Lingualizer._errorMessages = [
        "unable to find a translations directory  at '%s'.",
        "unable to find a translations file for '%s' at %s" /* initTranslations sub 1 */
    ];
    /**
     * #### Default locale or config's `defaultLocale` if found.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultLocale`|
     * |package.json|`lingualizer.defaultLocale`|
     * @static
     * @type {Locale}
     * @memberof Lingualizer
     */
    Lingualizer.DefaultLocale = 'en-US';
    /**
     * #### Translation file name _[without extention]_.
     * > If `%project%` then the @{link Lingualizer#ProjectRoot} dir **basename** name is used.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultranslationFileName`|
     * |package.json|`lingualizer.defaultranslationFileName`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.DefaultranslationFileName = '%project%';
    /**
     * #### Name of localization directory where translation files are stored.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaulLocalizationDirName`|
     * |package.json|`lingualizer.defaulLocalizationDirName`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.DefaulLocalizationDirName = 'localization';
    /**
     * #### Translation file extention to use.
     * > currently only `json` is supported.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`defaultTranslationFileExt`|
     * |package.json|`lingualizer.defaultTranslationFileExt`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.DefaultTranslationFileExt = 'json';
    /**
     * #### Is an `electron` application.
     * _ignored if set abs path with @{link Lingualizer#setProjectRoot}_
     *
     * > this is used to try different methods of determining project root.
     * > for instance may be in `.asar` at runtime.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`isElectron`|
     * |package.json|`lingualizer.isElectron`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.IsElectron = false;
    /**
     * #### Alternative directory path relative to @{link Linugalizer#ProjectRoot}
     * > use this to specify a directory path from the project root directory of the directory to create the `localization` directory in.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`cwd`|
     * |package.json|`lingualizer.cwd`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.Cwd = '';
    /**
     * #### _(for terminal use)_ Alternative directory path relative to @{link Linugalizer#ProjectRoot}
     * > use this to specify a directory path from the project root directory of the directory to create the `localization` directory in.
     *
     * |config|name|
     * |:------|:----|
     * |.lingualizerrc|`cmdCwd`|
     * |package.json|`lingualizer.cmdCwd`|
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.CmdCwd = '';
    /**
     * #### The project directory's absolute path.
     * > please use @{link Lingualizer#setProjectDir} to modify root
     *
     * @static
     * @memberof Lingualizer
     */
    Lingualizer.ProjectRoot = process.cwd();
    //private static _instance: Lingualizer = null;
    Lingualizer._defaultLocaleTranslations = {};
    Lingualizer._translations = {};
    Lingualizer._locale = null;
    Lingualizer._projectRoot = null;
    Lingualizer.__ctor__ = (function () {
        Lingualizer._onLocaleChanged = new ste_events_1.EventDispatcher();
        Lingualizer.updateDefaults();
        Lingualizer._locale = Lingualizer.DefaultLocale;
    })();
    return Lingualizer;
}());
exports.Lingualizer = Lingualizer;
