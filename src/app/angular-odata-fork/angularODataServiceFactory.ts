import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ODataConfiguration } from './angularODataConfiguration';
import { ODataService } from './angularODataService';

@Injectable()
export class ODataServiceFactory {

    constructor(private http: HttpClient, private config: ODataConfiguration) {
    }

    public CreateService<T>(typeName: string, config?: ODataConfiguration): ODataService<T> {
        return new ODataService<T>(typeName, this.http, config != null ? config : this.config);
    }
}
