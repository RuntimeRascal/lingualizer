#! /usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = __importStar(require("yargs"));
//const configPath = findup.sync( [ '.lingualizerrc', '.lingualizerrc.json' ] );
//const config = configPath ? fse.readJSONSync( configPath ) : {}
var argv = yargs
    //.usage( 'Usage: $0 <command> [options]' )
    //.config( config )
    //.command( require( './create' ) )
    .command(require('./get'))
    //.command( require( './set' ) )
    .example('$0 create -locale en-US -file-name "translation" -based-off "http://somejsonfile.json"', 'create a en-US translation file named "translation.json" and base it of the contents downloaded from "http://somejsonfile.json"')
    .example('$0 get -key ok-btn -locale es-MX', "get the 'ok-btn' value from 'es-MX' locale")
    .example('$0 set -key ok-btn -value "ok" -locale es-MX', "set the 'ok-btn' value from 'es-MX' locale to \"ok\"")
    .help('h')
    //.version( require( '../package.json' ).version )
    //.epilogue( 'for more information goto: https://github.com/simpert/lingualizer' )
    .argv;
if (argv.verbose) {
    console.info("Verbose mode on.");
    //console.info( `argv:\n\t${ argv._ }` );
}
console.log('the script works');
