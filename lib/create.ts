import { Locale, defaulLocalizationDirName } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import { defaultLocale } from "./index";

interface createArgs
{
    locale: Locale | undefined;
    fileName: string | undefined;
}

export var command = 'create [locale] [fileName]';
export var describe = 'create a translation file and the localization directory if needed';
export var builder = yargs
    .option( 'locale',
        {
            describe: "The locale",
            choices: [ 'es-MX', 'en-US' ],
            alias: [ 'l' ]
            //default: 'en-US',
        } )
    .option( 'fileName',
        {
            describe: "The translation filename",
            alias: [ 'f' ],
            default: '',
        } )
    .option( 'verbose',
        {
            alias: 'v',
            default: false,
        } );



export var handler = function createTranslations ( argv: createArgs )
{
    if ( typeof argv.locale == 'undefined' && typeof argv.fileName == 'undefined' )
    {
        console.log( `no args` );
        return;
    }

    console.log( `creating translation directory with locale: ${ argv.locale }` );

    let locDir = path.join( process.cwd(), defaulLocalizationDirName );

    fse.ensureDirSync( locDir );
    if ( !fse.existsSync( locDir ) ) throw new Error(
        `cannot create translation directory at '${ locDir }'` );

    let name = argv.fileName;
    if ( name == '' )
        name = path.basename( process.cwd() );

    if ( argv.locale == null || argv.locale == defaultLocale )
        argv.fileName = `${ name }.json`;
    else
        argv.fileName = `${ name }.${ argv.locale }.json`;

    let defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };

    //fse.writeFileSync( path.join( locDir, translationFilename ), JSON.stringify( defaultTranslationContents) );
    fse.writeJSONSync( path.join( locDir, argv.fileName ), defaultTranslationContents, { encoding: 'utf8' } );
    console.log( `created translation file named: '${ argv.fileName }'` );
}