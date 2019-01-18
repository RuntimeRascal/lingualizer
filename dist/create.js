"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
var yargs = __importStar(require("yargs"));
var request_1 = __importDefault(require("request"));
exports.command = 'create [locale] [file-name] [based-off]';
exports.describe = 'create a translation file and the localization directory if needed';
exports.builder = yargs
    .option('locale', {
    describe: "The locale",
    choices: ['es-MX', 'en-US'],
    alias: ['l'],
    required: false,
    default: _1.Lingualizer.DefaultLocale,
})
    .option('file-name', {
    describe: "The translation filename",
    alias: ['f'],
    required: false,
    default: ''
})
    // .option( 'based-off',
    //     {
    //         describe: "url of json file to download and set contents of downloaded file as the new translation file contents",
    //         alias: [ 'b' ],
    //         required: false,
    //         default: ''
    //     } )
    .option('verbose', {
    alias: 'v',
    required: false,
    default: false,
});
function validUrl_Old(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if (!regex.test(str)) {
        alert("Please enter valid URL.");
        return false;
    }
    else {
        return true;
    }
}
function validUrl(url) {
    try {
        var uri = new URL(url);
    }
    catch (error) {
        return false;
    }
    return true;
}
exports.handler = function (argv) {
    if (argv.fileName && argv.fileName == '' && argv.basedOff && argv.basedOff == '') {
        console.log("no args");
        return;
    }
    if (argv.basedOff !== '' && argv.basedOff) {
        if (!validUrl(argv.basedOff))
            return;
        var contents_1 = getJsonFile(argv.basedOff).then(function (res) {
            console.log("Got the contents of json file\n\n" + contents_1);
        });
        return;
    }
    console.log("creating translation directory with locale: " + argv.locale);
    var locDir = path.join(process.cwd(), _1.Lingualizer.DefaulLocalizationDirName);
    fse.ensureDirSync(locDir);
    if (!fse.existsSync(locDir))
        throw new Error("cannot create translation directory at '" + locDir + "'");
    var name = argv.fileName;
    if (name == '')
        name = path.basename(process.cwd());
    if (argv.locale == null || argv.locale == _1.Lingualizer.DefaultLocale)
        argv.fileName = name + ".json";
    else
        argv.fileName = name + "." + argv.locale + ".json";
    var defaultTranslationContents = { "Testing": "We are testing a default tranlated string" };
    //fse.writeFileSync( path.join( locDir, translationFilename ), JSON.stringify( defaultTranslationContents) );
    fse.writeJSONSync(path.join(locDir, argv.fileName), defaultTranslationContents, { encoding: 'utf8' });
    console.log("created translation file named: '" + argv.fileName + "'");
};
function getJsonFile(url) {
    return new Promise(function (resolve, reject) {
        var options = {
            method: 'GET',
            url: 'https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json',
            qs: { '': '' },
            headers: { Accept: 'application/json' }
        };
        request_1.default(options, function (error, response, body) {
            if (error)
                reject(error);
            resolve(body);
        });
    });
}
