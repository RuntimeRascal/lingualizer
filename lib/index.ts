import * as path from 'path';
import * as fse from 'fs-extra';
import * as findup from 'find-up';
import { EventDispatcher, IEvent } from "ste-events";

const configPath = findup.sync( [ '.lingualizerrc', '.lingualizerrc.json' ] );
const configrc = configPath ? fse.readJSONSync( configPath ) : {}

/* specifies all possible locale's */
export type Locale = 'en-US' | 'es-MX' | null;
export type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
}

/**
 * singleton lingualizer type to offer all functionality of module
 *
 * @author tsimper
 * @date 2019-01-17
 * @export
 * @class Lingualizer
 */
export class Lingualizer
{
    public static DefaultLocale: Locale = 'en-US';
    public static DefaultranslationFileName = 'translations';
    public static DefaulLocalizationDirName = 'localization';
    public static DefaultranslationFileExt = 'json';
    private static _instance: Lingualizer = null;
    private _translations = {};
    private _locale: Locale | null = null;
    private _onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();

    public static get default (): Lingualizer
    {
        if ( Lingualizer._instance == null )
            Lingualizer._instance = new Lingualizer();

        //TODO: look for and read in `.lingualizerrc settings
        return Lingualizer._instance;
    }

    public get onLocaleChanged (): IEvent<Lingualizer, LocaleChangedEventArgs>
    {
        return this._onLocaleChanged.asEvent();
    }

    /**
     * set the current locale. will trigger the `localeChanged` event so subscribers
     * can get translations from the newly set locale
     *
     * @memberof Lingualizer
     */
    set locale ( locale: Locale )
    {
        this._locale = locale;
        this.initTranslations();
        //TODO: trigger event
        console.log( `set locale to ${ this._locale }` );
    }

    /**
     * gets the currently set locale. will return `null` if locale has not been set
     * and can assume to use default locale
     *
     * @type {Locale}
     * @memberof Lingualizer
     */
    get locale (): Locale
    {
        return this._locale;
    }

    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns 
     */
    initTranslations ()
    {
        let translationsPath = path.join( process.cwd(), 'localization' );
        if ( !fse.existsSync( translationsPath ) )
        {
            throw new Error( `unable to find a translations directory  at '${ translationsPath }'.` );
            return;
        }

        let file: string = path.join( translationsPath, `${ Lingualizer.DefaultranslationFileName }.${ Lingualizer.DefaultranslationFileExt }` );
        if ( this._locale == Lingualizer.DefaultLocale && !fse.existsSync( file ) )
        {
            file = path.join( translationsPath, `${ Lingualizer.DefaultranslationFileName }.${ this._locale }.${ Lingualizer.DefaultranslationFileExt }` );
        }

        if ( !fse.existsSync( file ) )
        {
            throw new Error( `unable to find a translations file for '${ this._locale }' at ${ file } ` );
            return;
        }

        this._translations = JSON.parse( fse.readFileSync( file, "utf8" ) );
    }

    static updateDefaults ( configu?: any ): any
    {
        let config = configu || configrc;
        if ( config == null )
            return;

        if ( config.defaultLocale )
            Lingualizer.DefaultLocale = config.defaultLocale;

        if ( config.defaulLocalizationDirName )
            Lingualizer.DefaulLocalizationDirName = config.defaulLocalizationDirName;

        if ( config.defaulLocalizationDirName )
            Lingualizer.DefaultranslationFileName = config.defaulLocalizationDirName;

        if ( config.defaultranslationFileExt )
            Lingualizer.DefaultranslationFileExt = config.defaultranslationFileExt;

        return config;
    }

    static printDefaults ()
    {
        return `locale: ${ Lingualizer.DefaultLocale } dir: ${ Lingualizer.DefaulLocalizationDirName } file: ${ Lingualizer.DefaultranslationFileName } ext: ${ Lingualizer.DefaultranslationFileExt }`;
    }
}


