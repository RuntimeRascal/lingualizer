#! /usr/bin/env node

import * as yargs from 'yargs'
import * as getC from './get';
import * as setC from './set';
import * as createC from './create';
import { Lingualizer } from '.';
import { log, chalk } from './common';

const config = Lingualizer.updateDefaults();

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
        if ( m == null && e == null )
            return;

        if ( e )
            console.error( e );

        log( chalk.cyan( 'Uh Oh!' ) );
        log( `${ chalk.white.bgRed( m ) }` );
        log();
        log( chalk.bold.italic.cyan( 'HELP' ) )
        log( chalk.bold.italic.cyan( '----------------------------' ) )
        yargs.showHelp();
    } )
    .argv;

if ( argv.verbose )
{
    //console.info( "Verbose mode on." );
    //console.info( `argv:\n\t${ JSON.stringify( argv ) }` );
    Lingualizer.printDefaults();
}