import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yarg from 'yargs'
import * as request from 'request';
import chalkpack = require( 'chalk' );

const chalk: chalkpack.Chalk = chalkpack.default;
const app = chalk.white( 'lingualizer->' );
const defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };

interface createArgs
{
    locale?: string;
    fileName?: string;
    basedOff?: string;
    force?: boolean;
    verbose?: boolean;
}

export var command = 'create [locale] [file-name] [based-off]';
export var describe = 'create a translation file and the localization directory if needed';
export var builder = ( yargs: any ) =>
{
    return yargs
        .help()
        .option( 'locale',
            {
                describe: "The locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l' ],
                required: false,
            } )
        .option( 'file-name',
            {
                describe: "The translation filename",
                alias: [ 'f' ],
                required: false,
            } )
        .option( 'based-off',
            {
                describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
                alias: [ 'b' ],
                required: false,
            } )
        .option( 'force',
            {
                describe: "overwrite file if exists",
                required: false,
            } )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
            } )
        .demandCommand()
        .example( '$0 create --locale en-US --based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"' );
}
export var handler = async ( argv: createArgs ) =>
{
    let locDir: string = createLocalizationDirectory( argv );

    // if default is set to project then look that up
    let fileName = Lingualizer.DefaultranslationFileName == '%project%' ? path.basename( process.cwd() ) : Lingualizer.DefaultranslationFileName;

    // if name is specified then use that else use default
    let justName = argv.fileName || fileName;
    let name = justName;
    let getContentFromDefault = false;
    if ( !argv.locale || argv.locale == Lingualizer.DefaultLocale )
    // default locale - no locale in name
    {
        name = `${ name }.json`;
    }
    else
    // put the locale in the file name
    {
        getContentFromDefault = true;
        name = `${ name }.${ argv.locale || Lingualizer.DefaultLocale }.json`;
    }

    let filePath = path.join( locDir, name );

    if ( fse.existsSync( filePath ) && !argv.force )
    {
        console.log( chalk.gray( `${ app } the file allready exists. please use '${ chalk.blue( '--force' ) }' to overwrite it.` ) );
        return;
    }
    let contents = await getContents( argv, getContentFromDefault, locDir, justName );

    fse.writeJSONSync( filePath, contents, { encoding: 'utf8' } );

    console.log( chalk.gray( `${ app } created file: '${ chalk.cyan( name ) }'` ) );
}

async function getContents ( argv: createArgs, getDefault: boolean, dir: string, name: string )
{
    let getFromUrl = argv.basedOff && argv.basedOff !== '' && validUrl( argv.basedOff );
    let contents: any = defaultTranslationContents;
    if ( getDefault && !getFromUrl )
    // get contents from default locale
    {
        let defaultLocalePath = path.join( dir, `${ name }.json` );
        console.log( chalk.gray( `${ app } getting contents from default locale file: '${ chalk.cyan( defaultLocalePath ) }'` ) );

        if ( fse.existsSync( defaultLocalePath ) )
            contents = fse.readJSONSync( defaultLocalePath );
    }

    if ( getFromUrl )
    // get contents from a url
    {
        console.log( chalk.gray( `${ app } downloading contents from '${ chalk.cyan( argv.basedOff ) }'` ) )
        contents = JSON.parse( await getJsonFile( argv.basedOff ) );
        console.log( chalk.italic.gray( `${ app } downloaded contents '${ chalk.cyan( JSON.stringify( contents ) ) }'` ) )
    }

    return contents;
}

function createLocalizationDirectory ( argv: createArgs )
{
    let locDir = path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName );
    if ( !fse.existsSync( locDir ) )
        console.log( chalk.gray( `${ app } created '${ chalk.cyanBright( Lingualizer.DefaulLocalizationDirName ) }' directory` ) );

    fse.ensureDirSync( locDir );
    if ( !fse.existsSync( locDir ) )
        throw new Error( `${ app } cannot create '${ chalk.cyanBright( Lingualizer.DefaulLocalizationDirName ) }' directory at '${ chalk.red( locDir ) }'` );

    return locDir;
}

function validUrl ( url: string )
{
    try
    {
        let uri = new URL( url );
    } catch ( error )
    {
        return false;
    }
    return true;
}

function getJsonFile ( url: string ): Promise<string>
{
    return new Promise<string>( ( resolve, reject ) =>
    {
        var options: request.Options = {
            method: 'GET',
            url: 'https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json',
            qs: { '': '' },
            headers: { Accept: 'application/json' }
        };

        request( options, ( error: any, response: request.Response, body: any ) =>
        {
            if ( error )
                reject( error );

            resolve( body );
        } );
    } );
}