import * as yargs from 'yargs'
import * as chai from 'chai';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as createC from '../lib/create'
import * as helper from "./helper";
import { IArgV } from '../lib/common';

var expect = chai.expect;

//before( helper.createTestDirStructure )
after( helper.cleanup )
beforeEach( helper.cleanup )

describe( 'create command', () =>
{
    it( `expect create --help output to contain "_mocha [command]"`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( createC.command, createC.describe, createC.builder, createC.handler )
                .help()
                .parse( `--help`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    console.log( output );
                    let result = await argv.asyncResult;
                    resolve( output );
                } )
        } );

        expect( ( new RegExp( /_mocha [command]/im ) ).test( output as string ) ).to.be.true;
    } ).timeout( 0 );

    it( `expect create with --locale 'en-US' and --based-off set to create default translation file`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( createC.command, createC.describe, createC.builder, createC.handler )
                .help()
                .parse( `create --locale en-US --based-off \"https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json\"`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    console.log( output );
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( output ).to.contain( 'created file:', 'command output contains \'created file:\'' );
        expect( fse.existsSync( path.join( __dirname, '../localization/lingualizer.json' ) ) ).to.be.equal( true, 'file exists on local machine' );
    } ).timeout( 0 );
} );