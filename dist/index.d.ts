import { IEvent } from "ste-events";
export declare type Locale = 'en-US' | 'es-MX' | 'fr-FR' | 'nl-NL' | 'de-DE' | 'it-IT' | 'pol' | 'el-GR' | 'pt-BR' | 'pt-PT' | 'ar-SA' | 'zh-CHT' | 'ko-KR' | 'ja-JP' | 'vi-VN' | 'ro-RO' | 'ru-RU' | 'bg-BG' | 'id-ID' | 'mk-MK' | 'th-TH' | 'zh-CHS' | 'tr-TR' | null;
export declare type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
};
/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
export declare class Lingualizer {
    private _errorMessages;
    static DefaultLocale: Locale;
    static DefaultranslationFileName: string;
    static DefaulLocalizationDirName: string;
    static DefaultranslationFileExt: string;
    static IsElectron: boolean;
    static Cwd: string;
    static CmdCwd: string;
    private static _instance;
    private _defaultLocaleTranslations;
    private _translations;
    private _locale;
    private _onLocaleChanged;
    /**
     * initialize a the single new instance of Lingualizer
     */
    private constructor();
    static readonly default: Lingualizer;
    /**
     * subscribe to get notified when the locale changes
     *
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
    readonly onLocaleChanged: IEvent<Lingualizer, LocaleChangedEventArgs>;
    /**
     * set the current locale. will trigger the `localeChanged` event so subscribers
     * can get translations from the newly set locale
     *
     * @memberof Lingualizer
     */
    /**
    * gets the currently set locale. will return `null` if locale has not been set
    * and can assume to use default locale
    *
    * @type {Locale}
    * @memberof Lingualizer
    */
    locale: Locale;
    /**
     * get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @author tsimper
     * @date 2019-01-24
     * @param {string} key the name of the string to look up
     * @returns {string} the tranlated string or default if no translation found or default locale set and if no default returns null
     * @memberof Lingualizer
     */
    get(key: string): string;
    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns
     */
    initTranslations(oldLocale?: Locale): void;
    private static config;
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
    static updateDefaults(configu?: any): any;
    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns
     * @memberof Lingualizer
     */
    static printDefaults(): void;
}
