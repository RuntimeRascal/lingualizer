#! /usr/bin/env node

import { Locale, defaultranslationFileName } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import { Argv } from "yargs";

let argv = yargs.command( 'create', "Create the localization directory", ( yargs: Argv ) =>
{
    return yargs.option( 'port',
    {
        describe: "Port to bind on",
        default: "5000",
    } ).option( 'verbose',
    {
        alias: 'v',
        default: false,
    } )
} ).argv;

if ( argv.verbose )
{
    console.info( "Verbose mode on." );
}

serve( argv.port as string );

function serve( port: string )
{
    console.info( `Serve on port ${port}.` );
}

function createTranslationsDirectory( locale: Locale )
{
    let translationsDir = path.join( process.cwd( ), defaultranslationFileName );
    fse.ensureDirSync( translationsDir );
    // if ( !fse.existsSync( translationsDir ) )
    //     fse.mkdir( translationsDir );
    if ( !fse.existsSync( translationsDir ) ) throw new Error(
        `cannot create translation directory at '${translationsDir}'` );
}
console.log( 'the script works' );