

import * as chai from 'chai';
import { getLocale, setLocale, Locale } from '../lib'

var expect = chai.expect;
var should = chai.should();

describe('index', () => {
    it('getLocale should return null', () => {
        expect(getLocale()).to.be.null;
    });

    it.skip('setLocale should set locale to es-MX', () => {
        let locale: Locale = 'es-MX';
        setLocale(locale);
        expect(getLocale()).to.equal(locale);
    });
});