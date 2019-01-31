import * as path from 'path';
import * as fse from 'fs-extra';
import * as findup from 'find-up';
import { EventDispatcher, IEvent } from "ste-events";
import { format, log } from 'util';
import chalk from 'chalk';
import { getLocalizationDirectoryPath, getLocalizationFileName, getNestedValueFromJson } from './common';


const app = chalk.white( 'lingualizer->' );

/* specifies all possible locale's */
export type Locale = 'en-US' |
    'es-MX' |
    'fr-FR' |
    'nl-NL' |
    'de-DE' |
    'it-IT' |
    'pol' |
    'el-GR' |
    'pt-BR' |
    'pt-PT' |
    'ar-SA' |
    'zh-CHT' |
    'ko-KR' |
    'ja-JP' |
    'vi-VN' |
    'ro-RO' |
    'ru-RU' |
    'bg-BG' |
    'id-ID' |
    'mk-MK' |
    'th-TH' |
    'zh-CHS' |
    'tr-TR' |
    null;

interface ILocale
{
    locale: Locale;
    tag: string;
    language: string;
}

var Lookup: ILocale[] = [
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

/* specifies data args to pass to subscribers on locale changed event raised */
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
    private static _instance: Lingualizer = null;
    private _defaultLocaleTranslations = {};
    private _translations = {};
    private _locale: Locale | null = null;
    private _onLocaleChanged: EventDispatcher<Lingualizer, LocaleChangedEventArgs>;

    private constructor ()
    {
        this._onLocaleChanged = new EventDispatcher<Lingualizer, LocaleChangedEventArgs>();
        Lingualizer.updateDefaults();
        this._locale = Lingualizer.DefaultLocale;
        //this.initTranslations();
    }

    /**
     * #### Lingualizer singleton instance  
     * > use to access the members of the `Lingualizer` module.  
     * 
     * @readonly
     * @static
     * @type {Lingualizer}
     * @memberof Lingualizer
     */
    public static get default (): Lingualizer
    {
        if ( Lingualizer._instance == null )
            Lingualizer._instance = new Lingualizer();

        //TODO: look for and read in `.lingualizerrc settings
        return Lingualizer._instance;
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
    public get onLocaleChanged (): IEvent<Lingualizer, LocaleChangedEventArgs>
    {
        return this._onLocaleChanged.asEvent();
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
    public set locale ( locale: Locale )
    {
        let oldLocale = this._locale;
        if ( oldLocale == locale )
            return;

        this._locale = locale;
        try
        {
            this.initTranslations( oldLocale );
        } catch ( error )
        {
            log( `failed to initialize translations. error: ${ error.message }` );
        }
    }

    /**
     * #### Gets the current locale. 
     * > will return `null` if locale has not been set
     * > if not set, @{link Lingualizer.default.get()} will use @{link Lingualizer#DefaultLocale}
     */
    public get locale (): Locale
    {
        return this._locale;
    }

    /**
     * #### Get a translation
     * > get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     *
     * @param {string} key the name _[key]_ of the string to look up
     * @returns {string} get a keys value from translated locale or default locale if non-default locale is set and the key cannot be found
     * @memberof Lingualizer
     */
    public get ( key: string ): string
    {
        if ( this._defaultLocaleTranslations == null && this._translations == null )
            return '';

        let value: string = null;
        if ( this.locale !== Lingualizer.DefaultLocale && this._translations !== null )
        {
            let getVal = getNestedValueFromJson( this._translations, key );
            if ( typeof getVal !== 'undefined' )
            {
                return getVal;
            }
        }

        // allways try to return the string from default tranlation file even if cant find a translated one
        if ( this._defaultLocaleTranslations !== null )
        {
            let getVal = getNestedValueFromJson( this._defaultLocaleTranslations, key );

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
    public initTranslations ( oldLocale: Locale = this._locale )
    {
        let translationsPath = getLocalizationDirectoryPath( false );

        if ( !fse.existsSync( translationsPath ) )
        {
            // return;
            throw new Error( format( this._errorMessages[ 0 ], translationsPath ) );
        };

        let defaultFile: string = path.join( translationsPath, `${ getLocalizationFileName( false ) }.${ Lingualizer.DefaultTranslationFileExt }` );
        let localeFile: string = path.join( translationsPath, `${ getLocalizationFileName( false ) }.${ this.locale }.${ Lingualizer.DefaultTranslationFileExt }` );


        // allways try load the default locale translations as we dish them if translated cant be found and it's the most common
        //  as in what would be loaded at starup only changing if set locale to non-default
        if ( fse.existsSync( defaultFile ) )
        {
            this._defaultLocaleTranslations = JSON.parse( fse.readFileSync( defaultFile, "utf8" ) );
            this._onLocaleChanged.dispatch( this, { oldLocale: oldLocale, newLocale: this._locale } );
        }
        else
        {
            if ( this.locale == Lingualizer.DefaultLocale )
                throw new Error( format( this._errorMessages[ 1 ], this._locale, defaultFile ) );
        }


        if ( this.locale !== Lingualizer.DefaultLocale )
        // try load non-default locale
        {
            if ( fse.existsSync( localeFile ) )
            {
                this._translations = JSON.parse( fse.readFileSync( localeFile, "utf8" ) );
                this._onLocaleChanged.dispatch( this, { oldLocale: oldLocale, newLocale: this._locale } );
            } else
            {
                //console.log( `${ terminalPrefix } requested locale translation file cannot be found.` );
                throw new Error( format( this._errorMessages[ 1 ], this._locale, defaultFile ) );
            }
        }
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

        // if ( fse.existsSync( projectDir ) )
        //     Lingualizer.ProjectRoot = projectDir;
        // else
        //     log( chalk.red( `cannot set project root directory to a directory that does not exist. '${ projectDir }'` ) );
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
        console.log( chalk.gray( `${ app } 
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
        ${chalk.bold.green( '--------------------------------' ) }` ) );
    }
}


