import * as fs from 'fs';
import * as faker from 'faker';
import * as _ from 'lodash';

let companies = [];

for (let i = 0; i < 10000; i++) {
  companies.push({
    id: i + 1,
    name: faker.company.companyName() + ' ' + faker.company.companySuffix(),
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    phone: faker.phone.phoneNumber()
  });
}

companies = _.sortBy(companies, ['name']);

const data = {
  companies
};

const json = JSON.stringify(data, undefined, 2);

const fileContents = `
// Generated data

window.testData = ${json}
`;

fs.writeFileSync('src/assets/long-options.js', fileContents);
