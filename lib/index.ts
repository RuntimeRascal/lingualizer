import * as path from 'path';
import * as fse from 'fs-extra';
import * as findup from 'find-up';
import { EventDispatcher, IEvent } from "ste-events";
import { format } from 'util';
import chalk from 'chalk';


const configPath = findup.sync( [ '.lingualizerrc', '.lingualizerrc.json' ] );
const configrc = configPath ? fse.readJSONSync( configPath ) : {}
const app = chalk.white( 'lingualizer->' );

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
    private _errorMessages = [
        `unable to find a translations directory  at '%s'.`, /* initTranslations sub 0 */
        `unable to find a translations file for '%s' at %s` /* initTranslations sub 1 */
    ];
    /* if config provided, these defaults will be set to config upon file load */
    public static DefaultLocale: Locale = 'en-US';
    public static DefaultranslationFileName = '%project%';
    public static DefaulLocalizationDirName = 'localization';
    public static DefaultranslationFileExt = 'json';
    private static _instance: Lingualizer = null;
    private _translations = {};
    private _locale: Locale | null = null;
    private _onLocaleChanged: EventDispatcher<Lingualizer, LocaleChangedEventArgs>;

    /**
     * initialize a the single new instance of Lingualizer
     */
    private constructor ()
    {
        this._onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();
        this._locale = Lingualizer.DefaultLocale;
        this.initTranslations();
    }

    public static get default (): Lingualizer
    {
        if ( Lingualizer._instance == null )
            Lingualizer._instance = new Lingualizer();

        //TODO: look for and read in `.lingualizerrc settings
        return Lingualizer._instance;
    }

    /**
     * subscribe to get notified when the locale changes
     *
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
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
        let oldLocale = this._locale;
        if ( oldLocale == locale )
            return;

        this._locale = locale;
        this.initTranslations( oldLocale );

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

    get ( key: string ): string
    {
        if ( this._translations == null )
            return '';

        let value = this._translations[ key ];
        if ( typeof value === undefined || value == null )
            return '';

        return value;
    }

    /**
     * set `_translations` to json read from translations.json file according to the currently set locale
     *
     * @author tsimper
     * @date 2019-01-15
     * @export
     * @returns 
     */
    initTranslations ( oldLocale: Locale = this._locale )
    {
        let translationsPath = path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName );
        if ( !fse.existsSync( translationsPath ) )
            throw new Error( format( this._errorMessages[ 0 ], translationsPath ) );

        let file: string = path.join( translationsPath, `${ Lingualizer.DefaultranslationFileName }.${ Lingualizer.DefaultranslationFileExt }` );
        if ( this._locale == Lingualizer.DefaultLocale && !fse.existsSync( file ) )
            file = path.join( translationsPath, `${ Lingualizer.DefaultranslationFileName }.${ this._locale }.${ Lingualizer.DefaultranslationFileExt }` );

        if ( !fse.existsSync( file ) )
            throw new Error( format( this._errorMessages[ 1 ], this._locale, file ) );

        this._translations = JSON.parse( fse.readFileSync( file, "utf8" ) );

        this._onLocaleChanged.dispatch( this, { oldLocale: oldLocale, newLocale: this._locale } )
    }

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
    static updateDefaults ( configu?: any ): any
    {
        let config = configu || configrc;
        if ( config == null )
            return;

        if ( config.defaultLocale )
            Lingualizer.DefaultLocale = config.defaultLocale;

        if ( config.defaulLocalizationDirName )
            Lingualizer.DefaulLocalizationDirName = config.defaulLocalizationDirName;

        if ( config.defaultranslationFileName )
            Lingualizer.DefaultranslationFileName = config.defaultranslationFileName;

        if ( config.defaultranslationFileExt )
            Lingualizer.DefaultranslationFileExt = config.defaultranslationFileExt;

        return config;
    }

    /**
     * # for internal use
     *
     * @author tsimper
     * @date 2019-01-18
     * @static
     * @returns 
     * @memberof Lingualizer
     */
    static printDefaults ()
    {
        console.log( chalk.gray( `${ app } ${ chalk.bold.green( 'Default Settings' ) } locale: ${ chalk.cyan( Lingualizer.DefaultLocale ) } directory: ${ chalk.cyan( Lingualizer.DefaulLocalizationDirName ) } file: ${ chalk.cyan( Lingualizer.DefaultranslationFileName ) } ext: '${ chalk.cyan( Lingualizer.DefaultranslationFileExt ) }'` ) );
    }
}


