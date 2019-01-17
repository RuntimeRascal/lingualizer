import { Locale, defaulLocalizationDirName } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import { defaultLocale } from "./index";

interface getArgs
{
    locale: Locale | undefined;
    key: string | undefined;
}

export var command = 'get [key] [locale]';
export var describe = 'get a key from a certain locale or default in no locale';
export var builder = yargs
    .option( 'key',
        {
            describe: "The key to get translation for",
            alias: [ 'k' ]
        } )
    .option( 'locale',
        {
            describe: "The locale",
            choices: [ 'es-MX', 'en-US' ],
            alias: [ 'l' ]
        } );

export var handler = function ( argv: getArgs )
{
    console.log( `called get command` );
}