import * as yargs from 'yargs'
import { Argv } from "yargs";
import * as chai from 'chai';
import * as cli from '../lib/cli';

var expect = chai.expect;
var should = chai.should();

describe( '', () =>
{
    it( "returns help output", async () =>
    {
        // Initialize parser using the command module
        // const parser = yargs.command( ).help();

        // // Run the command module with --help as argument
        // const output = await new Promise( ( resolve ) =>
        // {
        //     parser.parse( "--help", ( err, argv, output ) =>
        //     {
        //         resolve( output );
        //     } )
        // } );

        // // Verify the output is correct
        // expect( output ).to.be( "helpful message" );
    } );
} );