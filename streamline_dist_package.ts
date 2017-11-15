import * as fs from 'fs';
const stringify = require('json-stable-stringify');

const fName = './dist/package.json';
const data = require(fName);

delete data.scripts;
delete data.devDependencies;
data.private = false; // so the source package can keep private: true

fs.writeFileSync(fName, stringify(data, { space: 2 }));
