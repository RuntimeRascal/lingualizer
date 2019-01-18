import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import request from 'request';

interface createArgs
{
    locale?: Locale;
    fileName?: string;
    basedOff?: string;
}

export var command = 'create [locale]';
export var describe = 'create a translation file and the localization directory if needed';
export var builder = ( yargs: yargs.Argv ) =>
{
    return yargs.option( 'locale',
        {
            describe: "The locale",
            choices: [ 'es-MX', 'en-US' ],
            alias: [ 'l' ],
            required: false,
            default: Lingualizer.DefaultLocale,
        } )
        .option( 'file-name',
            {
                describe: "The translation filename",
                alias: [ 'f' ],
                required: false,
                default: ''
            } )
        .option( 'based-off',
            {
                describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
                alias: [ 'b' ],
                required: false,
                default: ''
            } )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
                default: false,
            } )
        ;
}
export var handler = ( argv: createArgs ) =>
{
    if ( argv.fileName && argv.fileName == '' && argv.basedOff && argv.basedOff == '' )
    {
        console.log( `no args` );
        return;
    }

    if ( argv.basedOff !== '' && argv.basedOff )
    {
        if ( !validUrl( argv.basedOff ) )
            return;

        let contents = getJsonFile( argv.basedOff ).then( ( res ) =>
        {
            console.log( `Got the contents of json file\n\n${ contents }` );
        } );
        return;
    }

    console.log( `creating translation directory with locale: ${ argv.locale }` );

    let locDir = path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName );

    fse.ensureDirSync( locDir );
    if ( !fse.existsSync( locDir ) ) throw new Error(
        `cannot create translation directory at '${ locDir }'` );

    let name = argv.fileName;
    if ( name == '' )
        name = path.basename( process.cwd() );

    if ( argv.locale == null || argv.locale == Lingualizer.DefaultLocale )
        argv.fileName = `${ name }.json`;
    else
        argv.fileName = `${ name }.${ argv.locale }.json`;

    let defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };

    //fse.writeFileSync( path.join( locDir, translationFilename ), JSON.stringify( defaultTranslationContents) );
    fse.writeJSONSync( path.join( locDir, argv.fileName ), defaultTranslationContents, { encoding: 'utf8' } );
    console.log( `created translation file named: '${ argv.fileName }'` );
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