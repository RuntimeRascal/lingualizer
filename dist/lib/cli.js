"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var path = __importStar(require("path"));
var fse = __importStar(require("fs-extra"));
function createTranslationsDirectory(locale) {
    var translationsDir = path.join(process.cwd(), _1.defaultranslationFileName);
    fse.ensureDirSync(translationsDir);
    // if ( !fse.existsSync( translationsDir ) )
    //     fse.mkdir( translationsDir );
    if (!fse.existsSync(translationsDir))
        throw new Error("cannot create translation directory at '" + translationsDir + "'");
}
exports.createTranslationsDirectory = createTranslationsDirectory;
