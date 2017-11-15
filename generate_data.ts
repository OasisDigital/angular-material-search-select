import * as fs from 'fs';
import * as faker from 'faker';
import * as _ from 'lodash';

let companies = [];

for (let i = 0; i < 10000; i++) {
  companies.push({
    id: i,
    name: faker.company.companyName()
  });
}

companies = _.sortBy(companies, ['name']);

const data = {
  companies
};

const json = JSON.stringify(data, undefined, 2);

fs.writeFileSync('db.json', json);

const fileContents = `
// Generated data

window.testData = ${json}
`;

fs.writeFileSync('src/assets/long-options.js', fileContents);
