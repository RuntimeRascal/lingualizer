#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var getC = require("./get");
var setC = require("./set");
var createC = require("./create");
var _1 = require(".");
var common_1 = require("./common");
//import chalkpack = require( 'chalk' );
//const chalk: chalkpack.Chalk = chalkpack.default;
var config = _1.Lingualizer.updateDefaults();
var argv = yargs
    .help()
    .showHelpOnFail(true)
    .usage('Usage: $0 [command] [options]')
    .config(config)
    .pkgConf('lingualizer')
    .command(createC.command, createC.describe, createC.builder, createC.handler)
    .command(getC.command, getC.describe, getC.builder, getC.handler)
    .command(setC.command, setC.describe, setC.builder, setC.handler)
    .version(require('../package.json').version)
    .epilogue('for more information goto: https://github.com/simpert/lingualizer')
    .fail(function (m, e) {
    if (m == null && e == null)
        return;
    if (e)
        console.error(e);
    common_1.log(common_1.chalk.cyan('Uh Oh!'));
    common_1.log("" + common_1.chalk.white.bgRed(m));
    common_1.log();
    common_1.log(common_1.chalk.bold.italic.cyan('HELP'));
    common_1.log(common_1.chalk.bold.italic.cyan('----------------------------'));
    yargs.showHelp();
})
    .argv;
if (argv.verbose) {
    //console.info( "Verbose mode on." );
    //console.info( `argv:\n\t${ JSON.stringify( argv ) }` );
    _1.Lingualizer.printDefaults();
}
