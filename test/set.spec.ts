import * as yargs from 'yargs'
import * as chai from 'chai';
import * as setC from '../lib/set'
import { IArgV } from '../lib/common';
import * as helper from "./helper";

var expect = chai.expect;

before( helper.createTestDirStructure )
after( helper.cleanup )

describe( 'set command', () =>
{
    const testKey = 'testKey';
    const testValue = 'testValue';

    const nestedTestKey = 'testKey.category.sub';

    it( `given no args should return helpfull message`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( setC.command, setC.describe, setC.builder, setC.handler )
                .parse( `set`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( new RegExp( /you must provide a valid key and value/im ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );

    it( `given positional 'key' and 'value' args should return string /w 'key' and 'value'`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( setC.command, setC.describe, setC.builder, setC.handler )
                .parse( `set ${ testKey } ${ testValue } es-MX`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( new RegExp( `^(?=.*\\b${ testKey }\\b)(?=.*\\b${ testValue }\\b)`, 'gim' ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );

    it( `given explicit 'key' and 'value' args should return string /w 'key' and 'value'`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( setC.command, setC.describe, setC.builder, setC.handler )
                .parse( `set --key ${ testKey } --value ${ testValue } --locale es-MX`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        expect( new RegExp( `^(?=.*\\b${ testKey }\\b)(?=.*\\b${ testValue }\\b)`, 'gim' ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );

    it( `given explicit nested 'key' and 'value' args should return string /w 'key' and 'value'`, async () =>
    {
        const output = await new Promise( ( resolve ) =>
        {
            yargs.command( setC.command, setC.describe, setC.builder, setC.handler )
                .parse( `set --key ${ nestedTestKey } --value ${ testValue } --locale es-MX`, async ( err: any, argv: IArgV, output: string ) =>
                {
                    let result = await argv.asyncResult;
                    resolve( result );
                } )
        } );

        let tokens = nestedTestKey.split( '.' );

        expect( new RegExp( `^(?=.*\\b${ tokens[ 0 ] }\\b)(?=.*\\b${ tokens[ 1 ] }\\b)(?=.*\\b${ tokens[ 2 ] }\\b)(?=.*\\b${ testValue }\\b)`, 'gim' ).test( output as string ) )
            .to
            .be
            .true;
    } ).timeout( 0 );
} );