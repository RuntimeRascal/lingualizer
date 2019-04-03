import * as yargs from 'yargs'
import * as chai from 'chai';
import * as getC from '../lib/get'
import { IArgV } from '../lib/common';
import * as helper from './helper';

var expect = chai.expect;


//before( helper.createTestDirStructure )
//after( helper.cleanup )

describe( 'get command', () =>
{
    const testKey = 'titlebar.welcome';
    const testKey2 = 'try-again';
    const testValue2 = 'please try again';

    it( `given no args should return all keys and values`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( getC.command, getC.describe, getC.builder, getC.handler )
                .parse( `get`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );


        let result = `ok : "ok"
close : "close"
try-again : "please try again"
only-in-default : "default key only"
no-key-found : ""\n`;

        expect( result ).to.equal( output as string );

    } ).timeout( 0 );

    it( `given key '${ testKey }' should return value`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( getC.command, getC.describe, getC.builder, getC.handler )
                .parse( `get ${ testKey }`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( new RegExp( `Welcome to SMSE v%s`, 'gim' ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );

    it( `given key '${ testKey2 }' should return '${ testValue2 }'`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( getC.command, getC.describe, getC.builder, getC.handler )
                .parse( `get ${ testKey2 }`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( new RegExp( testValue2, 'gim' ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );
} );