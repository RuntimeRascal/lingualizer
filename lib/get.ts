import * as path from 'path';
import * as fse from 'fs-extra';
import { getLocale, getFileNameWithExtention, IArgV, getLocalizationDirectoryPath, chalk, terminalPrefix, log, getNestedValueFromJson } from "./common";

export var command = 'get [key] [locale]';
export var describe = 'get a key from a certain locale or default in no locale';
export var builder = ( yargs ) =>
{
    return yargs
        .positional( 'key',
            {
                type: 'string',
                describe: "The key to set translation for",
                alias: [ 'k' ],
            } )
        .positional( 'locale',
            {
                describe: "The locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l', 'loc' ],
            } )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
            } )
        .example( '$0 get', `get all key value pairs in default locale if exists` )
        .example( '$0 get --locale es-MX', `get all key value pairs in 'es-MX' locale if exists` )
        .example( '$0 get ok-btn', `get the 'ok-btn' value from default locale` )
        .example( '$0 get ok-btn es-MX', `get the 'ok-btn' value from 'es-MX' locale` )
        .example( '$0 get ok-btn --locale es-MX', `get the 'ok-btn' value from 'es-MX' locale` );
}

export function handler ( argv: IArgV )
{
    argv.asyncResult = new Promise<any>( async ( resolve ) =>
    {
        let locale = getLocale( argv as IArgV );
        if ( argv.verbose )
        {
            log( `get loc: '${ chalk.cyan( locale ) }' key: '${ chalk.cyan( argv.key ) }'` );
        }

        let fileName = getFileNameWithExtention( argv, true );
        let filePath = path.join( getLocalizationDirectoryPath( true ), fileName );

        if ( !fse.existsSync( filePath ) )
        {
            resolve( log( `${ chalk.bgRedBright( `cannot find translation file at: '${ chalk.bgBlue( filePath ) }'. please create it first` ) }` ) );
            return;
        }

        let json = fse.readJSONSync( filePath );
        let value = undefined;
        if ( argv.key )
        {
            value = getNestedValueFromJson( json, argv.key );
            //value = json[ argv.key ];
            if ( typeof value == undefined || !value )
            {
                resolve( log( `cannot find key ${ chalk.cyan( argv.key ) }` ) );
                return;
            }

            printTranslation( argv.key, value );
        }
        else // if no key given show all key values
        {
            printMembers( json );
        }
        resolve( value );
    } );

    return argv.asyncResult;
}

function printTranslation ( key: string, value: string )
{
    log( `'${ chalk.cyan( key ) }' : '${ chalk.cyan( value ) }'` );
}

function printMembers ( obj: any, prefix: string = '' )
{
    for ( const key in obj )
    {
        if ( obj.hasOwnProperty( key ) )
        {
            const v = obj[ key ];
            if ( typeof v == typeof '' )
                printTranslation( `${ prefix }${ prefix == '' ? '' : '.' }${ key }`, JSON.stringify( v ) );
            else
                printMembers( v, key );
        }
    }
}
