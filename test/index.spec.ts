

import * as chai from 'chai';
import { Lingualizer, Locale } from '../lib/index'

var expect = chai.expect;
var should = chai.should();

describe( 'index', () =>
{
    it( 'getLocale should return null', () =>
    {
        expect( Lingualizer.default.locale ).to.be.null;
    } );

    it.skip( 'setLocale should set locale to es-MX', () =>
    {
        let locale: Locale = 'es-MX';
        Lingualizer.default.locale = locale;
        expect( Lingualizer.default.locale ).to.equal( locale );
    } );
} );