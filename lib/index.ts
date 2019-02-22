import * as path from 'path';
import * as fse from 'fs-extra';
import * as findup from 'find-up';
import { EventDispatcher, IEvent } from "ste-events";
import { format, log } from 'util';
import chalk from 'chalk';
import
{
    getLocalizationDirectoryPath,
    getLocalizationFileName,
    getNestedValueFromJson,
    terminalPrefix,
    Locale
} from './common';


const app = chalk.white( 'lingualizer->' );



/* specifies data args to pass to subscribers on locale changed event raised */
export type LocaleChangedEventArgs = {
    oldLocale: Locale;
    newLocale: Locale;
}

export interface ILogger
{
    error?( ...params: any[] ): void;
    warn?( ...params: any[] ): void;
    info?( ...params: any[] ): void;
    verbose?( ...params: any[] ): void;
    debug?( ...params: any[] ): void;
    log?( ...params: any[] ): void;
}

/**
 *  lingualizer class to offer all functionality of module
 *
 * @export
 * @class Lingualizer
 */
export class Lingualizer
{
    private static _errorMessages = [
        `unable to find a translations directory  at '%s'.`, /* initTranslations sub 0 */
        `unable to find a translations file for '%s' at %s` /* initTranslations sub 1 */
    ];

    private static _logger: ILogger;

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
    public static DefaultLocale: Locale = 'en-US';

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
    public static DefaultranslationFileName = '%project%';

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
    public static DefaulLocalizationDirName = 'localization';

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
    public static DefaultTranslationFileExt = 'json';

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
    public static IsElectron = false;

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
    public static Cwd = '';

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
    public static CmdCwd = '';

    /**
     * #### The project directory's absolute path.  
     * > please use @{link Lingualizer#setProjectDir} to modify root
     *
     * @static
     * @memberof Lingualizer
     */
    public static ProjectRoot = process.cwd();

    private static config: any;
    private static _defaultLocaleTranslations = null;
    private static _translations = null;
    private static _locale: Locale | null = null;
    private static _onLocaleChanged: EventDispatcher<Lingualizer, LocaleChangedEventArgs>;
    private static _projectRoot = null;

    static __ctor__ = ( () =>
    {
        Lingualizer._onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();
        Lingualizer.updateDefaults();
        Lingualizer._locale = Lingualizer.DefaultLocale;
    } )();

    private static logInfo ( ...params: any[] )
    {
        if ( !Lingualizer._logger || Lingualizer._logger === null )
            return;

        if ( typeof Lingualizer._logger.info == 'undefined' || typeof Lingualizer._logger.info !== 'function' )
            return;

        Lingualizer._logger.info( params );
    }

    private static logError ( ...params: any[] )
    {
        if ( !Lingualizer._logger || Lingualizer._logger === null )
            return;

        if ( typeof Lingualizer._logger.error == 'undefined' || typeof Lingualizer._logger.error !== 'function' )
            return;

        Lingualizer._logger.error( params );
    }

    public static get root ()
    {
        return Lingualizer._projectRoot;
    }

    public static set root ( root: string )
    {
        Lingualizer._projectRoot = root;
        Lingualizer.logInfo( `${ terminalPrefix } setting project root to: '${ root }'` );
    }

    /**
     * #### Get the localeChanged event  
     * > subscribe to event to get notified of locale changing.  
     * 
     * @property {IEvent<Lingualizer, LocaleChangedEventArgs>} Lingualizer.default.onLocaleChanged
     * @readonly
     * @type {IEvent<Lingualizer, LocaleChangedEventArgs>} gives the Lingualizer instance that raised the event and a object containing the old and new locales
     * @memberof Lingualizer
     */
    public static get onLocaleChanged (): IEvent<Lingualizer, LocaleChangedEventArgs>
    {
        return Lingualizer._onLocaleChanged.asEvent();
    }

    /**
     * #### Set the current locale. 
     * > will trigger the `localeChanged` event so subscribers can get translations from the newly set locale
     * 
     * @fires onLocaleChanged
     * @type {Locale}
     * @property {Locale} Lingualizer.default.locale
     * @memberof Lingualizer
     */
    public static set locale ( locale: Locale )
    {
        Lingualizer.logInfo( `${ terminalPrefix } setting locale to: '${ locale }'` );

        let oldLocale = Lingualizer._locale;
        if ( oldLocale == locale && this._defaultLocaleTranslations !== null )
            return;

        Lingualizer._locale = locale;
        try
        {
            Lingualizer.initTranslations( oldLocale );
        } catch ( error )
        {
            log( `failed to initialize translations. error: ${ error.message }` );
            Lingualizer.logError( `${ terminalPrefix } failed to initialize translations. error: ${ error.message }` );
        }
    }

    /**
     * #### Gets the current locale. 
     * > will return `null` if locale has not been set
     * > if not set, @{link Lingualizer.default.get()} will use @{link Lingualizer#DefaultLocale}
     */
    public static get locale (): Locale
    {
        return Lingualizer._locale;
    }

    /**
     * #### Get a translation
     * > get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @param {string} key the name _[key]_ of the string to look up
     * @returns {string} get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     * @memberof Lingualizer
     */
    public static get ( key: string ): string
    {
        if ( Lingualizer._defaultLocaleTranslations == null && Lingualizer._translations == null )
        {
            Lingualizer.logError( `${ terminalPrefix } cannot get key: '${ key }' since there are no translations found or loaded` );
            return null;
        }

        let value: string = null;
        // case non-default locale
        if ( Lingualizer.locale !== Lingualizer.DefaultLocale && Lingualizer._translations !== null )
        {
            let getVal = getNestedValueFromJson( Lingualizer._translations, key );
            if ( typeof getVal !== 'undefined' )
                return getVal;
        }

        // allways try to return the string from default tranlation file even if cant find a translated one
        if ( Lingualizer._defaultLocaleTranslations !== null )
        {
            let getVal = getNestedValueFromJson( Lingualizer._defaultLocaleTranslations, key );

            if ( typeof getVal !== 'undefined' )
                value = getVal;
        }

        return value;
    }

    /**
     * #### Initialize translations.  
     * > reads the translation file json into memory for future get requests
     *
     * @export
     * @returns 
     */
    public static initTranslations ( oldLocale: Locale = Lingualizer._locale )
    {
        let translationsPath = getLocalizationDirectoryPath( false, Lingualizer._projectRoot );

        if ( !fse.existsSync( translationsPath ) )
        {
            let message = format( Lingualizer._errorMessages[ 0 ], translationsPath );
            Lingualizer.logError( `${ terminalPrefix } ${ message }` );
            throw new Error( message );
        };

        let defaultFile: string = path.join( translationsPath, `${ getLocalizationFileName( false ) }.${ Lingualizer.DefaultTranslationFileExt }` );
        let localeFile: string = path.join( translationsPath, `${ getLocalizationFileName( false ) }.${ Lingualizer.locale }.${ Lingualizer.DefaultTranslationFileExt }` );

        let defaultLoaded = Lingualizer._defaultLocaleTranslations && Lingualizer._defaultLocaleTranslations !== null;

        if ( Lingualizer.locale === Lingualizer.DefaultLocale && defaultLoaded )
        // ask for default and default is loaded so just raise ev and get out
        {
            if ( Lingualizer._onLocaleChanged )
                Lingualizer._onLocaleChanged.dispatch( Lingualizer,
                    {
                        oldLocale: oldLocale,
                        newLocale: Lingualizer._locale
                    } );
            return;
        }

        // allways try load the default locale translations as we dish them if translated cant be found and it's the most common
        //  as in what would be loaded at starup only changing if set locale to non-default
        if ( !defaultLoaded && fse.existsSync( defaultFile ) )
        {
            Lingualizer._defaultLocaleTranslations = JSON.parse( fse.readFileSync( defaultFile, "utf8" ) );
            if ( Lingualizer._onLocaleChanged )
                Lingualizer._onLocaleChanged.dispatch( Lingualizer, { oldLocale: oldLocale, newLocale: Lingualizer._locale } );
        }
        else
        // error out if not asking for non-default since default doesnt exist
        {
            if ( Lingualizer.locale == Lingualizer.DefaultLocale )
            {
                let message = format( Lingualizer._errorMessages[ 1 ], Lingualizer._locale, defaultFile );
                Lingualizer.logError( `${ terminalPrefix } ${ message }` );

                throw new Error( message );
            }
        }


        if ( Lingualizer.locale !== Lingualizer.DefaultLocale )
        // try load non-default locale
        {
            if ( fse.existsSync( localeFile ) )
            {
                Lingualizer._translations = JSON.parse( fse.readFileSync( localeFile, "utf8" ) );
                if ( Lingualizer._onLocaleChanged )
                    Lingualizer._onLocaleChanged.dispatch( Lingualizer, { oldLocale: oldLocale, newLocale: Lingualizer._locale } );
            } else
            {
                let message = format( Lingualizer._errorMessages[ 1 ], Lingualizer._locale, localeFile );
                Lingualizer.logError( `${ terminalPrefix } ${ message }` );

                throw new Error( format( message ) );
            }
        }
    }

    /**
     * #### Set the Lingualizer logger.
     * > all logging messages will try to log using set logger with info and error functions if they exist.
     *
     * @param {ILogger} logger a logger object that contains at least a info and error logging methods
     * @memberof Lingualizer
     */
    public static setLogger ( logger: ILogger )
    {
        Lingualizer._logger = logger;
        Lingualizer.logInfo( `${ terminalPrefix } setting logger` );
    }

    /**
     * #### Set the project's absolute path
     * > use if default's are not working for your configuration.   
     * > the path must exist to successfully set the ProjectRoot.   
     * 
     * @static
     * @param {string} projectDir the absolute path to use for determining Lingualizer related paths.
     * @memberof Lingualizer
     */
    static setProjectDir ( projectDir: string )
    {
        Lingualizer.ProjectRoot = projectDir;
        Lingualizer.logInfo( `${ terminalPrefix } setting project directory to: ${ projectDir }` );
    }

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
    static updateDefaults ( configu?: any ): any
    {
        if ( typeof Lingualizer.config == 'undefined' || !Lingualizer.config )
        // try to find the config
        {
            if ( !configu )
            {
                const configPath = findup.sync( [ '.lingualizerrc', '.lingualizerrc.json' ] );
                Lingualizer.config = configPath ? fse.readJSONSync( configPath ) : null
                if ( !Lingualizer.config || Lingualizer.config == null )
                {
                    //TODO: read in from package json

                }
            } else
            {
                Lingualizer.config = configu;
            }

            if ( typeof Lingualizer.config == 'undefined' || !Lingualizer.config )
                return;
        }
        else
        {
            // we have allready gotten config so dont get it again.
            // we dont want cli and index to interfere with eachother
            return;
        }

        // set all static defaults
        if ( typeof Lingualizer.config.defaultLocale != undefined )
            Lingualizer.DefaultLocale = Lingualizer.config.defaultLocale;

        if ( typeof Lingualizer.config.defaulLocalizationDirName != undefined )
            Lingualizer.DefaulLocalizationDirName = Lingualizer.config.defaulLocalizationDirName;

        if ( typeof Lingualizer.config.defaultTranslationFileName != undefined )
            Lingualizer.DefaultranslationFileName = Lingualizer.config.defaultTranslationFileName;

        if ( typeof Lingualizer.config.defaultTranslationFileExt != undefined )
            Lingualizer.DefaultTranslationFileExt = Lingualizer.config.defaultTranslationFileExt;

        if ( typeof Lingualizer.config.cmdCwd != undefined )
            Lingualizer.CmdCwd = Lingualizer.config.cmdCwd;

        if ( typeof Lingualizer.config.cwd != undefined )
            Lingualizer.Cwd = Lingualizer.config.cwd;

        if ( typeof Lingualizer.config.isElectron != undefined )
            Lingualizer.IsElectron = Lingualizer.config.isElectron;

        return Lingualizer.config;
    }

    /**
     * # for internal use
     * > prints to console all the configuration and current defaults as determined.  
     * 
     * @static
     * @returns 
     * @memberof Lingualizer
     */
    static printDefaults ()
    {
        let message = chalk.gray( `${ app } 
        ${ chalk.bold.green( '------- Default Settings -------' ) } 
        Locale    : '${ chalk.cyan( Lingualizer.DefaultLocale ) }' 
        Directory : '${ chalk.cyan( Lingualizer.DefaulLocalizationDirName ) }'
        File      : '${ chalk.cyan( getLocalizationFileName( false ) ) }' 
        Ext       : '${ chalk.cyan( Lingualizer.DefaultTranslationFileExt ) }'
        Cwd       : '${ chalk.cyan( Lingualizer.Cwd ) }'
        Cmd Cwd   : '${ chalk.cyan( Lingualizer.CmdCwd ) }'
        Electron  : '${ chalk.cyan( Lingualizer.IsElectron.toString() ) }'

        Project ------------
        Directory : '${ chalk.cyan( getLocalizationDirectoryPath( false ) ) }'
        Filename  : '${ chalk.cyan( `${ getLocalizationFileName( false ) }.${ Lingualizer.DefaultTranslationFileExt }` ) }'
       
        Terminal -----------
        Directory : '${ chalk.cyan( getLocalizationDirectoryPath( true ) ) }'
        Filename  : '${ chalk.cyan( `${ getLocalizationFileName( true ) }.${ Lingualizer.DefaultTranslationFileExt }` ) }'
        ${chalk.bold.green( '--------------------------------' ) }` );

        console.log( message );

        Lingualizer.logInfo( `${ terminalPrefix } printing verbose defaults` );
        Lingualizer.logInfo( message );

        return message;
    }
}


