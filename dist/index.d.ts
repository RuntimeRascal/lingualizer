export declare type Locale = 'en-US' | 'es-MX' | null;
export declare const defaultLocale: Locale;
export declare var _translations: {};
export declare const defaultranslationFileName = "translations";
export declare const defaultranslationFileExt = "json";
export declare var _locale: Locale | null;
/**
 * set `_translations` to json read from translations.json file according to the currently set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @returns
 */
export declare function initTranslations(): void;
/**
 * set the current locale and loads translations if found or default locale if cant find translations for set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @param {Locale} locale
 */
export declare function setLocale(locale: Locale): void;
export declare function getLocale(): Locale;
