#! /usr/bin/env node

import * as yargs from 'yargs'
import * as getC from './get';
import * as setC from './set';
import * as createC from './create';
import { Lingualizer } from '.';

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
    .usage( 'Usage: $0 <command> [options]' )
    .config( config )
    .command( createC.command, createC.describe, createC.builder, createC.handler )
    .command( getC.command, getC.describe, getC.builder, getC.handler )
    .command( setC.command, setC.describe, setC.builder, setC.handler )
    .example( '$0 create -locale en-US -file-name "translation" -based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"' )
    .example( '$0 get -key ok-btn -locale es-MX', `get the 'ok-btn' value from 'es-MX' locale` )
    .example( '$0 set -key ok-btn -value "ok" -locale es-MX', `set the 'ok-btn' value from 'es-MX' locale to "ok"` )
    .help( 'h' )
    .version( require( '../package.json' ).version )
    .epilogue( 'for more information goto: https://github.com/simpert/lingualizer' )
    .argv;

if ( argv.verbose )
{
    console.info( "Verbose mode on." );
    console.info( `argv:\n\t${ JSON.stringify( argv ) }` );
    console.info( `default settings: ${ Lingualizer.printDefaults() }` );
}