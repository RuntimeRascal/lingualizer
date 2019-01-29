import * as fse from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

const root = path.join( __dirname, '../' );

/**
 * I mostly use these tests to develop the commands with.
 * it is helpfull to be able to debug the commands and to have a quick way to execute
 * command with certain params
 */

export function createTestDirStructure () 
{
    console.log( chalk.bgCyan.yellow( 'before hook -> ensure localization direcoty' ) );

    if ( fse.existsSync( path.join( root, 'localization' ) ) )
    {
        fse.removeSync( path.join( root, 'localization' ) );
    }

    //if ( !fse.existsSync( path.join( __dirname, '../localization' ) ) )
    //{
    fse.ensureDir( path.join( root, 'localization' ) );
    if ( !fse.existsSync( path.join( root, 'localization/lingualizer.json' ) ) )
    {
        let contents = fse.readFileSync( path.join( __dirname, './data.json' ) );
        fse.writeFileSync( path.join( root, 'localization/lingualizer.json' ), contents );
    }

    if ( !fse.existsSync( path.join( root, 'localization/lingualizer.es-MX.json' ) ) )
    {
        let contents = fse.readFileSync( path.join( __dirname, './data.es-MX.json' ) );
        fse.writeFileSync( path.join( root, 'localization/lingualizer.es-MX.json' ), contents );
    }
    //}
};

export function cleanup ()
{
    console.log( chalk.bgCyan.yellow( 'after hook -> delete localization directory' ) );

    if ( fse.existsSync( path.join( root, 'localization' ) ) )
    {
        fse.removeSync( path.join( root, 'localization' ) );
    }
};
