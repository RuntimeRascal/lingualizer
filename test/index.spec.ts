

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
        expect( Lingualizer.default.locale ).to.be.equal( 'en-US' );
    } );

    it( 'setLocale should set locale to es-MX', () =>
    {
        let locale: Locale = 'es-MX';
        Lingualizer.default.locale = locale;
        expect( Lingualizer.default.locale ).to.equal( locale );
    } );

    const tryAgainKeyEs = 'try-again';
    const tryAgainValueEs = 'por favor inténtelo de nuevo';
    it( `get '${ tryAgainKeyEs }' should return '${ tryAgainValueEs }'`, () =>
    {
        Lingualizer.default.locale = 'es-MX';
        expect( Lingualizer.default.get( tryAgainKeyEs ) ).to.equal( tryAgainValueEs );
    } );

    it( 'setLocale should set locale to en-US', () =>
    {
        let locale: Locale = 'en-US';
        Lingualizer.default.locale = 'en-US';
        expect( Lingualizer.default.locale ).to.equal( locale );
    } );

    const tryAgainKeyEn = 'try-again';
    const tryAgainValueEn = 'please try again';
    it( `get '${ tryAgainKeyEn }' should return '${ tryAgainValueEn }' for 'en-US'`, () =>
    {
        Lingualizer.default.locale = 'en-US';
        expect( Lingualizer.default.get( tryAgainKeyEn ) ).to.equal( tryAgainValueEn );
    } );

    const onlyInDefaultKey = 'only-in-default';
    const onlyInDefaultValue = 'default key only';

    it( `get '${ onlyInDefaultKey }' should return '${ onlyInDefaultValue }' for 'es-MX' even know doesnt exist in that locale`, () =>
    {
        Lingualizer.default.locale = 'es-MX';
        let val = Lingualizer.default.get( onlyInDefaultKey );
        expect( val ).to.equal( onlyInDefaultValue );
    } );

    const nestedKey = 'titlebar.welcome';
    const nestedValue = 'Welcome to SMSE v%s';

    it( `get '${ nestedKey }' should return '${ nestedValue }'`, () =>
    {
        Lingualizer.default.locale = 'en-US';
        let val = Lingualizer.default.get( nestedKey );
        expect( val ).to.equal( nestedValue );
    } );
} );