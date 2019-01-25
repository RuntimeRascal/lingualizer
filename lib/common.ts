import { Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as request from 'request';

import chalkpack = require( 'chalk' );

export const chalk: chalkpack.Chalk = chalkpack.default;
export const terminalPrefix = chalk.white( 'lingualizer->' );

export function log ( message: any = '' )
{
    console.log( chalk.gray( `${ terminalPrefix } ${ message }` ) );
    return message;
}

export interface IArgV
{
    verbose?: boolean;
    basedOff?: string;
    v?: boolean;
    version?: boolean;
    value?: string;
    force?: boolean;
    defaultLocale?: string;
    defaultranslationFileName?: string;
    defaulLocalizationDirName?: string;
    defaultranslationFileExt?: string;
    key?: string;
    k?: string;
    fileName?: string;
    locale?: string;
    l?: string;
    $0: string
    _: string;
    asyncResult: Promise<any>;
}

export function getLocale ( argv: IArgV )
{
    return argv.locale || Lingualizer.DefaultLocale;
}

export function shouldUseProjectName ()
{
    return Lingualizer.DefaultranslationFileName == '%project%';
}

/**
 * gets the name of the localization directory considering project dir name lookup
 */
export function getLocalizationFileName ()
{
    return shouldUseProjectName()
        ? path.basename( process.cwd() )
        : Lingualizer.DefaultranslationFileName;
}

/**
 * gets the path to the localization directory according to the default directory name
 */
export function getLocalizationDirectory ()
{
    return path.join( process.cwd(), Lingualizer.Cwd, Lingualizer.DefaulLocalizationDirName );
}

/**
 * given the locale will return the file name
 * @param locale the given locale, if none then assume default
 */
export function getFileName ( argv: IArgV )
{
    let locale = getLocale( argv );
    let fileName = getLocalizationFileName();
    if ( locale !== Lingualizer.DefaultLocale )
        fileName = `${ fileName }.${ locale }.json`;
    else
        fileName = `${ fileName }.json`;

    return fileName;
}

export function isValidUrl ( url: string )
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

/**
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
export async function getJsonFile ( url: string = null, filePath: string = null ): Promise<string>
{
    let urlGood = url != null && url && url != '' && isValidUrl( url );
    let filePathGood = filePath != null && filePath && filePath != '';

    if ( !urlGood && !filePathGood )
    {
        log( chalk.red( `no valid json file can be found` ) );
        return;
    }

    if ( filePathGood )
    {
        let contents = await fse.readFile( filePath );
        return contents.toString();
    }

    if ( urlGood )
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

/**
 * so yargs lib says is async but return promise from handler and will not wait for resolution
 * get json contents from a file or from a url
 * @param url a url that will return a json file
 * @param filePath a complete filepath to a valid json file
 */
export function getJsonFileSync ( url: string = null, filePath: string = null ): string
{
    let urlGood = url != null && url && url != '' && isValidUrl( url );
    let filePathGood = filePath != null && filePath && filePath != '';

    if ( !urlGood && !filePathGood )
    {
        log( chalk.red( `no valid json file can be found` ) );
        return;
    }

    if ( filePathGood )
    {
        let contents = fse.readFileSync( filePath );
        return contents.toString();
    }
}

export function writeFile ( filePath: string, contents: any ): boolean
{
    if ( filePath == null || !filePath || !fse.existsSync( path.dirname( filePath ) ) )
    {
        log( chalk.red( `cannot write file to: '${ filePath }' you must provide valid path of which directory exists.` ) );
        return false;
    }

    if ( contents == null )
        contents = '';

    if ( typeof contents != 'string' )
        contents = JSON.stringify( contents );

    fse.writeFileSync( filePath, contents, { encoding: 'utf8' } );

    return fse.existsSync( filePath );
}

export function getValue ( obj: object, dotSeperatedKey: string )
{
    if ( dotSeperatedKey.lastIndexOf( '.' ) == -1 )
    {
        return obj[ dotSeperatedKey ];
    }

    let tokens = dotSeperatedKey.split( '.' );
    let allButLast = dotSeperatedKey.substring( 0, dotSeperatedKey.lastIndexOf( '.' ) );

    let val = null;
    let value = getKeysValue( obj, allButLast, tokens[ tokens.length - 1 ], '', val );

    return value;
};

function getKeysValue ( obj: object, searchWholeKey: string, lastKey: string, wholeKey = '', foundVal = null ): boolean
{
    if ( !searchWholeKey )
    // there isnt any nesting to do so just update addKey on root
    {
        foundVal = obj[ lastKey ];
        return foundVal;
    }

    for ( const key in obj ) 
    {
        let thisKey = `${ wholeKey }${ key }`;
        if ( thisKey == searchWholeKey )
        {
            foundVal = obj[ key ][ lastKey ];
            if ( foundVal != null )
                return foundVal;
        }
        else if ( typeof obj[ key ] == 'object' )
        {
            foundVal = getKeysValue( obj[ key ], searchWholeKey, lastKey, `${ key }.` );
            if ( foundVal != null )
                return foundVal;
        }
    }
}
