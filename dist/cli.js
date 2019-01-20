#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var getC = require("./get");
var setC = require("./set");
var createC = require("./create");
var _1 = require(".");
var chalkpack = require("chalk");
var chalk = chalkpack.default;
var app = chalk.white('lingualizer->');
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
    console.log(chalk.cyan('Uh Oh!'));
    console.log("" + chalk.white.bgRed(m));
    console.log();
    console.log(chalk.bold.italic.cyan('HELP'));
    console.log(chalk.bold.italic.cyan('----------------------------'));
    yargs.showHelp();
})
    .argv;
if (argv.verbose) {
    //console.info( "Verbose mode on." );
    //console.info( `argv:\n\t${ JSON.stringify( argv ) }` );
    _1.Lingualizer.printDefaults();
}
