import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { ODataConfiguration } from './angularODataConfiguration';

export abstract class ODataOperation<T> {
    private _expand: string;
    private _select: string;

    constructor(protected typeName: string, protected config: ODataConfiguration, protected http: HttpClient) {
    }

    public Expand(expand: string | string[]) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    }

    public Select(select: string | string[]) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    }

    protected getParams(): HttpParams {
        let params = new HttpParams();

        if (this._select && this._select.length > 0) {
            params = params.append(this.config.keys.select, this._select);
        }

        if (this._expand && this._expand.length > 0) {
            params = params.append(this.config.keys.expand, this._expand);
        }

        return params;
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

    protected getRequestOptions(): {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        const options = Object.assign({}, this.config.defaultRequestOptions);
        options.params = this.getParams();
        return options;
    }

    protected abstract Exec(...args: any[]): Observable<any>;

    protected parseStringOrStringArray(input: string | string[]): string {
        if (input instanceof Array) {
            return input.join(',');
        }

        return input as string;
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

export abstract class OperationWithKey<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entityKey: string | number | boolean) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export abstract class OperationWithEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export abstract class OperationWithKeyAndEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entityKey: string,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export class GetOperation<T> extends OperationWithKey<T> {
    public Exec(): Observable<T> {
        return super.handleResponse(this.http.get<T>(this.config.getEntityUri(this.entityKey, this.typeName), this.getRequestOptions()));
    }
}

// export class PostOperation<T> extends OperationWithEntity<T>{
//     public Exec():Observable<T>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.post(this.config.baseUrl + "/"+this._typeName, body, this.getRequestOptions()));
//     }
// }

// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }

// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
