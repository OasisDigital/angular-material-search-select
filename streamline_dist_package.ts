// This script streamlines the package file before distribution, removing the
// devDependencies and other unnecessary bits. An ideal distributed NPM package
// would not contain any extraneous files or lines of code or config; what is
// not there, cannot cause problems.

import * as fs from 'fs';
const stringify = require('json-stable-stringify');

const fName = './dist/package.json';
const data = require(fName);

delete data.devDependencies;
delete data.engines;
data.private = false; // so the source package can keep private: true

fs.writeFileSync(fName, stringify(data, { space: 2 }));
