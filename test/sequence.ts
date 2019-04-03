import * as helper from './helper';


before( helper.createTestDirStructure )
after( helper.cleanup )

const get = require( './get.spec' );
const set = require( './set.spec' );
const index = require( './index.spec' );
//const create = require( "./create.spec" );