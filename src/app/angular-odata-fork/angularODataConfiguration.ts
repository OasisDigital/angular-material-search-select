import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ODataUtils } from './angularODataUtils';
import { IODataResponseModel } from './angularODataResponseModel';
import { ODataPagedResult } from './angularODataPagedResult';

export class KeyConfigs {
    public filter = '$filter';
    public top = '$top';
    public skip = '$skip';
    public orderBy = '$orderby';
    public select = '$select';
    public expand = '$expand';
}

@Injectable()
export class ODataConfiguration {
    private readonly _postHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

    private _baseUrl = 'http://localhost/odata';

    public keys: KeyConfigs = new KeyConfigs();
    public defaultRequestOptions: {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } = { observe: 'response' };

    public postRequestOptions: {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } = { headers: this._postHeaders, observe: 'response' };

    set baseUrl(baseUrl: string) {
        this._baseUrl = baseUrl.replace(/\/+$/, '');
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    public getEntitiesUri(typeName: string): string {
        return this.baseUrl + '/' + this.sanitizeTypeName(typeName);
    }

    public getEntityUri(entityKey: string | number | boolean, typeName: string): string {
        return this.getEntitiesUri(typeName) + `(${ODataUtils.quoteValue(entityKey)})`;
    }

    public handleError(err: any, caught: any): void {
        console.warn('OData error: ', err, caught);
    }

    public extractQueryResultData<T>(res: HttpResponse<IODataResponseModel<T>>): T[] {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        return (res && res.body && res.body.value) as T[];
    }

    public extractQueryResultDataWithCount<T>(res: HttpResponse<IODataResponseModel<T>>): ODataPagedResult<T> {
        const pagedResult: ODataPagedResult<T> = new ODataPagedResult<T>();

        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body: any = res.body;
        const entities: T[] = body.value;

        pagedResult.data = entities;

        try {
            const count: number = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        } catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length.');
            pagedResult.count = entities.length;
        }

        return pagedResult;
    }

    private sanitizeTypeName(typeName: string): string {
        return typeName.replace(/\/+$/, '').replace(/^\/+/, '');
    }
}
