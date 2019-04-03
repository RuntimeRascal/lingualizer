import { Lingualizer } from '.';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as request from 'request';

import chalkpack = require( 'chalk' );
import { ILingualizer } from './ILingualizer';
export const chalk: chalkpack.Chalk = chalkpack.default;
export const terminalPrefix = chalk.white( 'lingualizer->' );

export interface IArgV
{
    verbose?: boolean;
    basedOff?: string;
    v?: boolean;
    version?: boolean;
    value?: string;
    force?: boolean;
    defaultLocale?: string;
    defaultTranslationFileName?: string;
    defaultLocalizationDirName?: string;
    defaultTranslationFileExt?: string;
    isElectron?: boolean;
    key?: string;
    cwd?: string;
    cmdCwd?: string;
    k?: string;
    fileName?: string;
    locale?: string;
    l?: string;
    $0: string
    _: string;
    asyncResult: Promise<any>;
}

function valueSearch ( obj: object, searchWholeKey: string, lastKey: string, wholeKey = '', foundVal = null ): boolean
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
            foundVal = valueSearch( obj[ key ], searchWholeKey, lastKey, `${ key }.` );
            if ( foundVal != null )
                return foundVal;
        }
    }
}

function projectDirWithConfig ( cmd: boolean, optionalRoot = null )
{
    let myPath: string = null;
    if ( cmd && Lingualizer.CmdCwd )
        myPath = path.join( optionalRoot != null ? optionalRoot : Lingualizer.ProjectRoot, Lingualizer.CmdCwd );

    if ( !cmd && Lingualizer.Cwd )
        myPath = path.join( optionalRoot != null ? optionalRoot : Lingualizer.ProjectRoot, Lingualizer.Cwd );

    if ( myPath != null && myPath != '' )
        return myPath;
    else
        return optionalRoot != null ? optionalRoot : Lingualizer.ProjectRoot;
}

export function log ( message: any = '' )
{
    console.log( chalk.gray( `${ terminalPrefix } ${ message }` ) );
    return message;
}

export function getLocale ( argv: IArgV )
{
    return argv.locale || Lingualizer.DefaultLocale;
}

export function shouldUseProjectName ()
{
    return Lingualizer.DefaultranslationFileName == '%project%';
}

export function getLocalizationFileName ( cmd: boolean )
{
    if ( shouldUseProjectName() )
    {
        let mypath = projectDirWithConfig( cmd );

        return path.basename( mypath );
    }

    return Lingualizer.DefaultranslationFileName;

}

export function getLocalizationDirectoryPath ( cmd: boolean, optionalRoot = null )
{
    let myPath: string = projectDirWithConfig( cmd, optionalRoot );

    return path.join( myPath, Lingualizer.DefaulLocalizationDirName );
}

export function getFileNameWithExtention ( argv: IArgV, cmd: boolean )
{
    let locale = getLocale( argv );
    let fileName = getLocalizationFileName( cmd );
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

export function getNestedValueFromJson ( obj: object, dotSeperatedKey: string )
{
    if ( dotSeperatedKey.lastIndexOf( '.' ) == -1 )
    {
        return obj[ dotSeperatedKey ];
    }

    let tokens = dotSeperatedKey.split( '.' );
    let allButLast = dotSeperatedKey.substring( 0, dotSeperatedKey.lastIndexOf( '.' ) );

    let val = null;
    let value = valueSearch( obj, allButLast, tokens[ tokens.length - 1 ], '', val );

    return value;
};