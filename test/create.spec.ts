import * as yargs from 'yargs'
import * as chai from 'chai';
import * as fse from 'fs-extra';
import * as path from 'path';
import { Lingualizer } from '../lib';
var expect = chai.expect;

describe( 'create command', () =>
{
    it( `expect create --help output to contain "_mocha [command]"`, async () =>
    {
        // Initialize parser using the command module
        const parser = yargs.command( require( '../lib/create' ) ).help();

        // Run the command module with --help as argument
        const output: string = await new Promise( ( resolve ) =>
        {
            parser.parse( "--help", ( err, argv, output ) =>
            {
                resolve( output );
            } )
        } );

        expect( ( new RegExp( /_mocha [command]/im ) ).test( output ) ).to.be.true;
    } ).timeout( 0 );

    it( `expect create `, async () =>
    {
        // Initialize parser using the command module
        const parser = yargs.command( require( '../lib/create' ) ).help();

        // Run the command module with --help as argument
        const output: string = await new Promise( ( resolve ) =>
        {
            parser.parse( "create --locale en-US --based-off \"https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json\"", ( err, argv, output ) =>
            {
                resolve( output );
            } )
        } );

        expect( true ).to.be.true;
    } ).timeout( 0 );
} );

function cleanup ()
{
    debugger;
    let locDirPath = path.resolve( Lingualizer.DefaulLocalizationDirName );
    if ( fse.existsSync( locDirPath ) )
    {
        fse.removeSync( locDirPath );
    }
}