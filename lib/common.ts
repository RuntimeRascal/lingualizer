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
 * gets the path to the localization directory according to the default directory name
 */
export function getLocalizationDirectory ()
{
    return path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName );
}

/**
 * 
 * @param locale the given locale, if none then assume default
 */
export function getFileName ( argv: IArgV )
{
    let locale = getLocale( argv );
    let fileName = shouldUseProjectName() ? path.basename( process.cwd() ) : Lingualizer.DefaultranslationFileName;
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