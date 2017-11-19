import { ODataConfiguration } from 'angular-odata-es5';

export class NorthwindODataConfigurationFactory {

  constructor() {
    const config = new ODataConfiguration();
    config.baseUrl = 'https://odatateststef.azurewebsites.net/odata';
    return config;
  }
}
