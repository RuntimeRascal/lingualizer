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
var getC = __importStar(require("./get"));
var setC = __importStar(require("./set"));
var createC = __importStar(require("./create"));
var _1 = require(".");
var chalkpack = require("chalk");
var chalk = chalkpack.default;
var app = chalk.white('lingualizer->');
var config = _1.Lingualizer.updateDefaults();
var argv = yargs
    .usage('Usage: $0 [command] [options]')
    .config(config)
    .pkgConf('lingualizer')
    .command(createC.command, createC.describe, createC.builder, createC.handler)
    .command(getC.command, getC.describe, getC.builder, getC.handler)
    .command(setC.command, setC.describe, setC.builder, setC.handler)
    //.demandCommand()
    .version(require('../package.json').version)
    .epilogue('for more information goto: https://github.com/simpert/lingualizer')
    .showHelpOnFail(true)
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
