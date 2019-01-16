import * as path from 'path';
import * as fse from 'fs-extra';

export type Locale = 'en-US' | 'es-MX' | null;
export const defaultLocale: Locale = 'en-US';
export var _translations = {};
export const defaultranslationFileName = 'translations';
export const defaultranslationFileExt = 'json';

export var _locale: Locale | null = null;

/**
 * set `_translations` to json read from translations.json file according to the currently set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @returns 
 */
export function initTranslations ()
{
    let translationsPath = path.join( process.cwd(), 'localization' );
    if ( !fse.existsSync( translationsPath ) )
    {
        throw new Error( `unable to find a translations directory  at '${ translationsPath }'.` );
        return;
    }

    let file: string = path.join( translationsPath, `${ defaultranslationFileName }.${ defaultranslationFileExt }` );
    if ( _locale == defaultLocale && !fse.existsSync( file ) )
    {
        file = path.join( translationsPath, `${ defaultranslationFileName }.${ _locale }.${ defaultranslationFileExt }` );
    }

    if ( !fse.existsSync( file ) )
    {
        throw new Error( `unable to find a translations file for '${ _locale }' at ${ file } ` );
        return;
    }

    _translations = JSON.parse( fse.readFileSync( file, "utf8" ) );
}

/**
 * set the current locale and loads translations if found or default locale if cant find translations for set locale
 *
 * @author tsimper
 * @date 2019-01-15
 * @export
 * @param {Locale} locale
 */
export function setLocale ( locale: Locale )
{
    _locale = locale;
    initTranslations();
    console.log( `set locale to ${ _locale }` );
}

export function getLocale (): Locale
{
    return _locale;
}