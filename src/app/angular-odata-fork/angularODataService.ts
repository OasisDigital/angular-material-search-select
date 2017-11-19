import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { GetOperation } from './angularODataOperation';
import { ODataUtils } from './angularODataUtils';
import { ODataConfiguration } from './angularODataConfiguration';
import { ODataQuery } from './angularODataQuery';

export class ODataService<T> {
    private _entitiesUri: string;

    constructor(private _typeName: string, private _http: HttpClient, private config: ODataConfiguration) {
        this._entitiesUri = config.getEntitiesUri(_typeName);
    }

    public get TypeName(): string {
        return this._typeName;
    }

    public Get(key: string | number | boolean): GetOperation<T> {
        return new GetOperation<T>(this._typeName, this.config, this._http, key);
    }

    public Post(entity: T): Observable<T> {
        const body = entity ? JSON.stringify(entity) : null;
        return this.handleResponse(this._http.post<T>(this._entitiesUri, body, this.config.postRequestOptions));
    }

    public Patch(entity: any, key: string | number | boolean): Observable<HttpResponse<T>> {
        const body = entity ? JSON.stringify(entity) : null;
        return this._http.patch<T>(this.getEntityUri(key), body, this.config.postRequestOptions);
    }

    public Put(entity: T, key: string | number | boolean): Observable<T> {
        const body = entity ? JSON.stringify(entity) : null;
        return this.handleResponse(this._http.put<T>(this.getEntityUri(key), body, this.config.postRequestOptions));
    }

    public Delete(key: string | number | boolean): Observable<HttpResponse<T>> {
        return this._http.delete<T>(this.getEntityUri(key), this.config.defaultRequestOptions);
    }

    public CustomAction(key: string | number | boolean, actionName: string, postdata: any): Observable<any> {
        const body = postdata ? JSON.stringify(postdata) : null;
        return this._http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.defaultRequestOptions).map(resp => resp);
    }

    public CustomFunction(functionName: string, parameters?: any): Observable<any> {
        if (parameters) {
            const params: string = ODataUtils.convertObjectToString(parameters);
            functionName = `${functionName}(${params})`;
        } else if (!functionName.endsWith(')') && !functionName.endsWith('()')) {
            functionName = `${functionName}()`;
        }

        return this._http.get(`${this._entitiesUri}/${functionName}`, this.config.defaultRequestOptions).map(resp => resp);
    }

    public Query(): ODataQuery<T> {
        return new ODataQuery<T>(this.TypeName, this.config, this._http);
    }

    protected getEntityUri(entityKey: string | number | boolean): string {
        return this.config.getEntityUri(entityKey, this._typeName);
    }

    protected handleResponse(entity: Observable<HttpResponse<T>>): Observable<T> {
        return entity.map(this.extractData)
            .catch((err: any, caught: Observable<T>) => {
                if (this.config.handleError) {
                    this.config.handleError(err, caught);
                }
                return Observable.throw(err);
            });
    }

    private extractData(res: HttpResponse<T>): T {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body: any = res.body;
        const entity: T = body;

        return entity || null;
    }
}
