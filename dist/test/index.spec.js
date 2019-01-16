"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai = __importStar(require("chai"));
var lib_1 = require("../lib");
var expect = chai.expect;
var should = chai.should();
describe('index', function () {
    it('getLocale should return null', function () {
        expect(lib_1.getLocale()).to.be.null;
    });
    it('setLocale should set locale to es-MX', function () {
        var locale = 'es-MX';
        lib_1.setLocale(locale);
        expect(lib_1.getLocale()).to.equal(locale);
    });
});
