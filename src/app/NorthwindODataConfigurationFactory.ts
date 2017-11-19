import { ODataConfiguration } from './angular-odata-fork';

export class NorthwindODataConfigurationFactory {

  constructor() {
    const config = new ODataConfiguration();
    config.baseUrl = 'https://odatateststef.azurewebsites.net/odata';
    return config;
  }
}
