import * as fse from 'fs-extra';
import * as path from 'path';

const root = path.join( __dirname, '../' );

/**
 * I mostly use these tests to develop the commands with.
 * it is helpfull to be able to debug the commands and to have a quick way to execute
 * command with certain params
 */

export function createTestDirStructure () 
{
    if ( fse.existsSync( path.join( __dirname, '../localization' ) ) )
    {
        fse.removeSync( path.join( __dirname, '../localization' ) );
    }

    //if ( !fse.existsSync( path.join( __dirname, '../localization' ) ) )
    //{
    fse.ensureDir( path.join( root, 'localization' ) );
    if ( !fse.existsSync( path.join( __dirname, '../localization/lingualizer.json' ) ) )
    {
        let contents = fse.readFileSync( path.join( __dirname, './data.json' ) );
        fse.writeFileSync( path.join( __dirname, '../localization/lingualizer.json' ), contents );
    }

    if ( !fse.existsSync( path.join( __dirname, '../localization/lingualizer.es-MX.json' ) ) )
    {
        let contents = fse.readFileSync( path.join( __dirname, './data.es-MX.json' ) );
        fse.writeFileSync( path.join( __dirname, '../localization/lingualizer.es-MX.json' ), contents );
    }
    //}
};

export function cleanup ()
{
    if ( fse.existsSync( path.join( __dirname, '../localization' ) ) )
    {
        fse.removeSync( path.join( __dirname, '../localization' ) );
    }
};
