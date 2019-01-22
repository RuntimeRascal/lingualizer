import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yarg from 'yargs'
import chalkpack = require( 'chalk' );
import { getLocale, IArgV, getLocalizationDirectory, getFileName, log, getJsonFile } from "./common";

const chalk: chalkpack.Chalk = chalkpack.default;
const app = chalk.white( 'lingualizer->' );

interface setArgs
{
    locale?: Locale;
    key?: string;
    value?: string;
    verbose?: boolean;
}

export var command = 'set <key|k> <value|val|v> [locale] [verbose] [help]';
export var describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
export var builder = ( yargs: yarg.Argv<IArgV> ) =>
{
    return yargs
        .help()
        .positional( 'key',
            {
                type: 'string',
                description: "the key to set translation for"
            } as yarg.PositionalOptions )
        .positional( 'value',
            {
                type: 'string',
                description: "the value to set as the 'key'"
            } as yarg.PositionalOptions )
        .positional( 'locale',
            {
                describe: "the locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l', 'loc' ],
            } as yarg.PositionalOptions )
        .option( 'verbose',
            {
                required: false,
            } as yarg.Options )
        .demandCommand()
        .help()
        .example( '$0 set "ok-btn" "ok" --locale es-MX', `set the 'ok-btn' value from 'es-MX' locale to "ok"` );
}

export var handler = async ( argv: IArgV ) =>
{
    let locale = getLocale( argv );
    if ( argv.verbose )
        console.log( chalk.gray( `${ app } set key: '${ chalk.cyan( argv.key ) }' val: '${ chalk.cyan( argv.value ) }' loc: '${ chalk.cyan( locale ) }'` ) );

    if ( !argv.key || !argv.value )
    {
        log( chalk.red( 'you must provide a valid key and value' ) );
        return;
    }

    let locDir = getLocalizationDirectory();
    let fileName = getFileName( argv );
    let filePath = path.join( locDir, fileName );
    if ( !fse.existsSync( filePath ) )
    {
        log( `${ chalk.bgRedBright( `cannot find translation file at: '${ chalk.bgBlue( filePath ) }'. please create it first` ) }` );
        return;
    }

    let contents = await getJsonFile( null, filePath );
    let json: any = null;
    try
    {
        let json = JSON.parse( contents );
    } catch ( error )
    {
        json = null;
    }

    if ( json == null )
    {
        log( `${ chalk.bgRedBright( `unable to parse: '${ chalk.bgBlue( filePath ) }' to valid json object` ) }` );
        return;
    }

    json[ argv.key ] = argv.value;
}