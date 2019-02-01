

import * as chai from 'chai';
import { Lingualizer, Locale } from '../lib/index'
import * as helper from "./helper";

var expect = chai.expect;
var should = chai.should();

//before( helper.createTestDirStructure )
//after( helper.cleanup )

describe( 'index', () =>
{
    it( 'getLocale should return en-US default', () =>
    {
        expect( Lingualizer.locale ).to.be.equal( 'en-US' );
    } );

    it( 'setLocale should set locale to es-MX', () =>
    {
        let locale: Locale = 'es-MX';
        Lingualizer.locale = locale;
        expect( Lingualizer.locale ).to.equal( locale );
    } );

    const tryAgainKeyEs = 'try-again';
    const tryAgainValueEs = 'por favor inténtelo de nuevo';
    it( `get '${ tryAgainKeyEs }' should return '${ tryAgainValueEs }'`, () =>
    {
        Lingualizer.locale = 'es-MX';
        expect( Lingualizer.get( tryAgainKeyEs ) ).to.equal( tryAgainValueEs );
    } );

    it( 'setLocale should set locale to en-US', () =>
    {
        let locale: Locale = 'en-US';
        Lingualizer.locale = 'en-US';
        expect( Lingualizer.locale ).to.equal( locale );
    } );

    const tryAgainKeyEn = 'try-again';
    const tryAgainValueEn = 'please try again';
    it( `get '${ tryAgainKeyEn }' should return '${ tryAgainValueEn }' for 'en-US'`, () =>
    {
        Lingualizer.locale = 'en-US';
        expect( Lingualizer.get( tryAgainKeyEn ) ).to.equal( tryAgainValueEn );
    } );

    const onlyInDefaultKey = 'only-in-default';
    const onlyInDefaultValue = 'default key only';

    it( `get '${ onlyInDefaultKey }' should return '${ onlyInDefaultValue }' for 'es-MX' even know doesnt exist in that locale`, () =>
    {
        Lingualizer.locale = 'es-MX';
        let val = Lingualizer.get( onlyInDefaultKey );
        expect( val ).to.equal( onlyInDefaultValue );
    } );

    const nestedKey = 'titlebar.welcome';
    const nestedValue = 'Welcome to SMSE v%s';

    it( `get '${ nestedKey }' should return '${ nestedValue }'`, () =>
    {
        Lingualizer.locale = 'en-US';
        let val = Lingualizer.get( nestedKey );
        expect( val ).to.equal( nestedValue );
    } );
} );