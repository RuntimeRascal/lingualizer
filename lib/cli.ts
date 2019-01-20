#! /usr/bin/env node

import * as yargs from 'yargs'
import * as getC from './get';
import * as setC from './set';
import * as createC from './create';
import { Lingualizer } from '.';
import chalkpack = require( 'chalk' );

const chalk: chalkpack.Chalk = chalkpack.default;
const app = chalk.white( 'lingualizer->' );

const config = Lingualizer.updateDefaults();

export interface IArgV
{
    verbose?: boolean;
    v?: boolean;
    version?: boolean;
    defaultLocale?: string;
    defaultranslationFileName?: string;
    defaulLocalizationDirName?: string;
    defaultranslationFileExt?: string;
    key?: string;
    k?: string;
    locale?: string;
    l?: string;
    $0: string
    _: string;
}

let argv = yargs
    .help()
    .showHelpOnFail( true )
    .usage( 'Usage: $0 [command] [options]' )
    .config( config )
    .pkgConf( 'lingualizer' )
    .command( createC.command, createC.describe, createC.builder, createC.handler )
    .command( getC.command, getC.describe, getC.builder, getC.handler )
    .command( setC.command, setC.describe, setC.builder, setC.handler )
    .version( require( '../package.json' ).version )
    .epilogue( 'for more information goto: https://github.com/simpert/lingualizer' )
    .fail( ( m, e ) =>
    {
        console.log( chalk.cyan( 'Uh Oh!' ) );
        console.log( `${ chalk.white.bgRed( m ) }` );
        console.log();
        console.log( chalk.bold.italic.cyan( 'HELP' ) )
        console.log( chalk.bold.italic.cyan( '----------------------------' ) )
        yargs.showHelp();
    } )
    .argv;

if ( argv.verbose )
{
    //console.info( "Verbose mode on." );
    //console.info( `argv:\n\t${ JSON.stringify( argv ) }` );
    Lingualizer.printDefaults();
}