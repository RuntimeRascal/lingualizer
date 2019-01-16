import { Locale, defaultranslationFileName } from ".";
import * as path from 'path';
import * as fse from 'fs-extra';


export function createTranslationsDirectory ( locale: Locale )
{
    let translationsDir = path.join( process.cwd(), defaultranslationFileName );
    fse.ensureDirSync( translationsDir );

    // if ( !fse.existsSync( translationsDir ) )
    //     fse.mkdir( translationsDir );

    if ( !fse.existsSync( translationsDir ) )
        throw new Error( `cannot create translation directory at '${ translationsDir }'` );
}