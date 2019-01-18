import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'

interface setArgs
{
    locale: Locale | undefined;
    key: string | undefined;
}

export var command = 'set [key] [value] [locale]';
export var describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
export var builder = ( yargs ) =>
{
    return yargs
        .option( 'key',
            {
                describe: "The key to set translation for",
                alias: [ 'k' ]
            } )
        .option( 'value',
            {
                describe: "The value to set as the 'key'",
                alias: [ 'v' ]
            } )
        .option( 'locale',
            {
                describe: "The locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l' ]
            } );
}

export var handler = function ( argv: setArgs )
{
    console.log( `called set command` );
}