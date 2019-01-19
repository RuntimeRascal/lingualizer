import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import chalkpack = require( 'chalk' );

const chalk: chalkpack.Chalk = chalkpack.default;
const app = chalk.white( 'lingualizer->' );

interface setArgs
{
    locale?: Locale;
    key?: string;
    value?: string;
    verbose?: boolean;
}

export var command = 'set <key|k> <value|val|v> [locale]';
export var describe = 'set a value to the key for a certain locale or default locale if no locale is provided';
export var builder = ( yargs ) =>
{
    return yargs
        .positional( 'key',
            {
                type: 'string',
                description: "the key to set translation for"
            } as yargs.PositionalOptions )
        .positional( 'value',
            {
                type: 'string',
                description: "the value to set as the 'key'"
            } as yargs.PositionalOptions )
        .positional( 'locale',
            {
                describe: "the locale",
                choices: [ 'es-MX', 'en-US' ],
                alias: [ 'l', 'loc' ],
                required: false
            } as yargs.PositionalOptions )
        .option( 'verbose',
            {
                alias: 'v',
                required: false,
            } as yargs.Options )
        .demandOption( 'key', 'key: ' )
        .demandOption( 'value', 'val: ' )
        .showHelpOnFail( true )
        ;
}

export var handler = function ( argv: setArgs )
{
    let locale = argv.locale || Lingualizer.DefaultLocale;
    if ( argv.verbose )
        console.log( chalk.gray( `${ app } set loc: '${ chalk.cyan( locale ) }' key: '${ chalk.cyan( argv.key ) }' val: '${ chalk.cyan( argv.value ) }'` ) );

    let locDir = path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName );

    let files = fse.readdir( locDir );


}