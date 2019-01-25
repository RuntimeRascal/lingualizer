import { Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yarg from 'yargs'
import { IArgV, getLocalizationDirectory, log, chalk, terminalPrefix, getFileName, getJsonFile, isValidUrl, getLocalizationFileName } from "./common";

const defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };

export var command = 'create [locale] [based-off] [force]';
export var describe = 'create a translation file and the localization directory if needed';
export var builder = ( yargs: yarg.Argv<IArgV> ) =>
{
    return yargs
        .positional( 'locale',
            {
                describe: "The locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l' ],
            } )
        .positional( 'based-off',
            {
                describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
                alias: [ 'b' ],
            } )
        .positional( 'force',
            {
                describe: "overwrite file if exists",
            } )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
            } )
        .example( '$0 create --locale en-US --based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"' );
}
export async function handler ( argv: IArgV )
{
    argv.asyncResult = new Promise<string>( async ( resolve ) =>
    {
        let locDir = ensureLocalizationDirectory();

        let fileName = getFileName( argv );

        let filePath = path.join( locDir, fileName );
        if ( fse.existsSync( filePath ) && !argv.force )
        {
            resolve( log( `the file allready exists. please use '${ chalk.blue( '--force' ) }' to overwrite it.` ) );
            return;
        }

        let defaultLocaleFilePath: string = null;
        if ( argv.locale && argv.locale !== Lingualizer.DefaultLocale )
            defaultLocaleFilePath = path.join( locDir, `${ getLocalizationFileName() }.json` );

        let contents = await getContents( argv, defaultLocaleFilePath );

        fse.writeJSONSync( filePath, contents, { encoding: 'utf8' } );

        resolve( log( `created file: '${ chalk.cyan( fileName ) }'` ) );
    } );

    return await argv.asyncResult;

}

/**
 * get the contents to write to translation file
 * @param argv the arguments passed to script
 * @param getDefault wether or not to get the contents from the default locale file. this is for translated files so to allow not createing the file with all the default locale keys to translate from
 * @param defaultFilePath path to the default file in order to base off default locale file contents or `null` to base off default content
 */
async function getContents ( argv: IArgV, defaultFilePath: string )
{
    let getFromUrl = argv.basedOff && argv.basedOff !== '' && isValidUrl( argv.basedOff );

    // contents will be set to default
    let contents: any = defaultTranslationContents;

    if ( defaultFilePath != null && fse.existsSync( defaultFilePath ) && !getFromUrl )
    // get contents from default locale
    {
        log( `getting contents from default locale file: '${ chalk.cyan( defaultFilePath ) }'` );
        contents = fse.readJSONSync( defaultFilePath );
    }

    if ( getFromUrl )
    // get contents from a url
    {
        log( `downloading contents from '${ chalk.cyan( argv.basedOff ) }'` )
        contents = JSON.parse( await getJsonFile( argv.basedOff, null ) );
        log( `downloaded contents '${ chalk.cyan( JSON.stringify( contents ) ) }'` )
    }

    return contents;
}

/**
 * create the localization directory if it does not allready exist
 */
function ensureLocalizationDirectory ()
{
    let locDir = getLocalizationDirectory();
    if ( !fse.existsSync( locDir ) )
        log( `created '${ chalk.cyanBright( Lingualizer.DefaulLocalizationDirName ) }' directory` );

    fse.ensureDirSync( locDir );
    if ( !fse.existsSync( locDir ) )
        throw new Error( `${ terminalPrefix } cannot create '${ chalk.cyanBright( Lingualizer.DefaulLocalizationDirName ) }' directory at '${ chalk.red( locDir ) }'` );

    return locDir;
}