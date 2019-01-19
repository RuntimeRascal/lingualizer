import { Locale, Lingualizer } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';
import * as yargs from 'yargs'
import chalkpack = require( 'chalk' );

const chalk: chalkpack.Chalk = chalkpack.default;
const app = chalk.white( 'lingualizer->' );

interface getArgs
{
    locale?: string;
    key?: string;
    verbose?: string;
}

export var command = 'get [key] [locale]';
export var describe = 'get a key from a certain locale or default in no locale';
export var builder = ( yargs ) =>
{
    return yargs
        .positional( 'key',
            {
                type: 'string',
                describe: "The key to set translation for",
                alias: [ 'k' ],
                required: false
            } as yargs.PositionalOptions )
        .positional( 'locale',
            {
                describe: "The locale",
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
        ;
}

export var handler = ( argv: getArgs ) =>
{
    let locale = argv.locale || Lingualizer.DefaultLocale;
    if ( argv.verbose )
        console.log( chalk.gray( `${ app } get loc: '${ chalk.cyan( locale ) }' key: '${ chalk.cyan( argv.key ) }'` ) );

    let fileName = Lingualizer.DefaultranslationFileName == '%project%' ? path.basename( process.cwd() ) : Lingualizer.DefaultranslationFileName;
    if ( locale !== Lingualizer.DefaultLocale )
        fileName = `${ fileName }.${ locale }.json`;
    else
        fileName = `${ fileName }.json`;

    let filePath = path.join( process.cwd(), Lingualizer.DefaulLocalizationDirName, fileName );
    //let files = fse.readdir( locDir );
    if ( !fse.existsSync( filePath ) )
    {
        console.log( chalk.gray( `${ app } ${ chalk.bgRedBright( `cannot find translation file at: '${ chalk.bgBlue( filePath ) }'. please create it first` ) }` ) );
        return;
    }

    let json = fse.readJSONSync( filePath );

    let value = undefined;
    // if no key given show all key values
    if ( argv.key )
    {
        value = json[ argv.key ];
        if ( typeof value == undefined || !value )
        {
            console.log( chalk.gray( `${ app } cannot find key ${ chalk.cyan( argv.key ) }` ) )
            return;
        }

        console.log( chalk.gray( `${ app } key: '${ chalk.cyan( argv.key ) }' value: '${ chalk.cyan( value ) }'` ) )
    }
    else
    {
        printMembers( json );

        // value = JSON.stringify( json );
    }

}

function printMembers ( obj: any, prefix: string = '' )
{
    for ( const key in obj )
    {
        if ( obj.hasOwnProperty( key ) )
        {
            const v = obj[ key ];
            if ( typeof v == typeof '' )
            {
                console.log( chalk.gray( `${ app } key: '${ chalk.cyan( `${ prefix }${ prefix == '' ? '' : '.' }${ key }` ) }' value: '${ chalk.cyan( JSON.stringify( v ) ) }'` ) );
            }
            else
            {
                printMembers( v, key );
            }
        }
    }
}