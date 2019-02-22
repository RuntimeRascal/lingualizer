import * as path from 'path';
import * as fse from 'fs-extra';
import * as yarg from 'yargs'
import { getLocale, IArgV, getLocalizationDirectoryPath, getFileNameWithExtention, log, getJsonFile, chalk, terminalPrefix, writeFile, Lookup } from "./common";

export var command = 'set [key] [value] [locale]';
export var describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
export var builder = ( yargs: yarg.Argv<IArgV> ) =>
{
    return yargs
        .positional( 'key',
            {
                type: 'string',
                description: "the key to set translation for",
                alias: [ 'k' ],
            } as yarg.PositionalOptions )
        .positional( 'value',
            {
                type: 'string',
                description: "the value to set as the 'key'",
                alias: [ 'v', 'val' ]
            } as yarg.PositionalOptions )
        .positional( 'locale',
            {
                describe: "The locale",
                choices: Lookup.map( l => l.locale ),
                alias: [ 'l', 'loc' ],
            } )
        .option( 'verbose',
            {
                required: false,
            } as yarg.Options )
        .example( '$0 set "ok-btn" "ok" --locale es-MX', `set the 'ok-btn' value from 'es-MX' locale to "ok"` );
}

export async function handler ( argv: IArgV )
{
    argv.asyncResult = new Promise<string>( async ( resolve ) =>
    {
        let locale = getLocale( argv );
        if ( argv.verbose )
            console.log( chalk.gray( `${ terminalPrefix } set key: '${ chalk.cyan( argv.key ) }' val: '${ chalk.cyan( argv.value ) }' loc: '${ chalk.cyan( locale ) }'` ) );

        if ( !argv.key || !argv.value )
        {
            resolve( log( chalk.red( 'you must provide a valid key and value' ) ) );
            return;
        }

        let locDir = getLocalizationDirectoryPath( true );
        let fileName = getFileNameWithExtention( argv, true );
        let filePath = path.join( locDir, fileName );
        if ( !fse.existsSync( filePath ) )
        {
            resolve( log( `${ chalk.bgRedBright( `cannot find translation file at: '${ chalk.bgBlue( filePath ) }'. please create it first` ) }` ) );
            return;
        }

        let contents = await getJsonFile( null, filePath );
        let json: any = null;
        try
        {
            json = JSON.parse( contents );
        } catch ( error )
        {
            json = null;
        }

        if ( json == null )
        {
            resolve( log( `${ chalk.bgRedBright( `unable to parse: '${ chalk.bgBlue( filePath ) }' to valid json object` ) }` ) );
            return;
        }

        try
        {
            let tokens = argv.key.split( '.' );
            let lastKey = argv.key.substring( 0, argv.key.lastIndexOf( '.' ) );
            ensureKey( json, lastKey );
            update( json, lastKey, tokens[ tokens.length - 1 ], argv.value );
        } catch ( error )
        {
            resolve( log( `${ chalk.bgRedBright( `unable to parse: '${ chalk.bgBlue( argv.key ) }' to valid json object` ) }` ) );
            return;
        }

        writeFile( filePath, json );

        resolve( log( chalk.green( `successfully upadated key: ${ chalk.italic.bold.cyan( ` ${ argv.key } ` ) } to '${ chalk.italic.bold.cyan( ` ${ argv.value } ` ) }'` ) ) );
    } );

    return argv.asyncResult;
}

/**
 * update a json property nested or not from a dot-seperated property key
 * 
 * if '@addKey' or '@addValue' is empty then nothing will be updated
 * if '@searchWholeKey' is empty then the '@addKey' will be placed on the root 
 * if '@addKey' exists and and is an object then it will be replaced with the '@addValue'
 * if '@addKey' does not exist then it will not be udpated. please ensure the key to add a new key to exists
 *      before calling this function call @ensureKey first
 * 
 * @param obj the root json object to update
 * @param searchWholeKey the whole dot-seperated property of which to add the new key to
 * @param addKey the new key to add to the @searchWholeKey property
 * @param addValue the value to asign to @addKey
 * @param wholeKey the recursive dot-seperated key to keep track of where were at. pass nothing in here
 */
function update ( obj: object, searchWholeKey: string, addKey: string, addValue: string, wholeKey = '' ): boolean
{
    if ( !addKey || !addValue )
    {
        log( chalk.red( 'must have a key and value to update' ) );
        return;
    }

    if ( !searchWholeKey )
    // there isnt any nesting to do so just update addKey on root
    {
        obj[ addKey ] = addValue;
        return;
    }

    for ( const key in obj ) 
    {
        let thisKey = `${ wholeKey }${ key }`;
        if ( thisKey == searchWholeKey )
        {
            obj[ key ][ addKey ] = addValue;
            return;
        }
        else if ( typeof obj[ key ] == 'object' )
        {
            update( obj[ key ], searchWholeKey, addKey, addValue, `${ key }.` );
        }
    }
}

/**
 * ensure that the dot-seperated property @key exists and if not create an empty object
 * 
 * @param obj the json object to ensure property exists no matter how many levels deep it is
 * @param key the dot-seperated property to ensure exists
 */
function ensureKey ( obj: object, key: string ): void
{
    if ( !key )
        return;

    let tokens = key.split( '.' );
    let nestedObj = obj;
    for ( let i = 0; i < tokens.length; i++ )
    {
        let token = tokens[ i ];
        if ( typeof nestedObj[ token ] == 'undefined' )
        {
            nestedObj[ token ] = {};
        }

        if ( ( tokens.length - 1 ) !== i && typeof nestedObj[ token ] !== 'object' )
            // its not the last one so ensure we have a object not a string
            nestedObj[ token ] = {};

        nestedObj = nestedObj[ token ];
    }
}