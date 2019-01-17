#! /usr/bin/env node

import * as yargs from 'yargs'
import { Argv } from "yargs";
import * as config from '../package.json';

let argv = yargs
    .usage( 'Usage: $0 <command> [options]' )
    .command( require( './create' ) )
    .command( require( './get' ) )
    .command( require( './set' ) )
    .example( '$0 create -locale en-US', 'create a en-US based translation file' )
    .example( '$0 get -key ok-btn -locale es-MX', `get the 'ok-btn' value from 'es-MX' locale` )
    .example( '$0 set -key ok-btn -value "ok" -locale es-MX', `set the 'ok-btn' value from 'es-MX' locale to "ok"` )
    .help( 'h' )
    .version( config.version )
    .epilogue( 'for more information goto: https://github.com/simpert/lingualizer' )
    .argv;

if ( argv.verbose )
{
    console.info( "Verbose mode on." );
}

console.log( 'the script works' );