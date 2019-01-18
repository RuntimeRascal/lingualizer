import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'

interface getArgs
{
    locale: string;
    key: string;
}

export var command = 'get [key] [locale]';
export var describe = 'get a key from a certain locale or default in no locale';
export var builder = ( yargs: yargs.Argv ) =>
{
    return yargs.option( 'key',
        {
            describe: "The key to get translation for",
            alias: [ 'k' ],
            default: '',
            required: false
        } )
        .option( 'locale',
            {
                describe: "The locale",
                choices: [ 'es-MX', 'en-US' ],
                required: false,
                default: Lingualizer.DefaultLocale,
                alias: [ 'l' ]
            } )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
                default: false,
            } );;
}

export var handler = ( argv: getArgs ) =>
{
    console.log( `called get command` );
}