import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { IODataResponseModel } from './angularODataResponseModel';
import { ODataConfiguration } from './angularODataConfiguration';
import { ODataOperation } from './angularODataOperation';
import { ODataPagedResult } from './angularODataPagedResult';

export class ODataQuery<T> extends ODataOperation<T> {
  private _filter: string;
  private _top: number;
  private _skip: number;
  private _orderBy: string;
  private _entitiesUri: string;

  constructor(typeName: string, config: ODataConfiguration, http: HttpClient) {
    super(typeName, config, http);

    this._entitiesUri = config.getEntitiesUri(this.typeName);
  }

  public Filter(filter: string): ODataQuery<T> {
    this._filter = filter;
    return this;
  }

  public Top(top: number): ODataQuery<T> {
    this._top = top;
    return this;
  }

  public Skip(skip: number): ODataQuery<T> {
    this._skip = skip;
    return this;
  }

  public OrderBy(orderBy: string): ODataQuery<T> {
    this._orderBy = orderBy;
    return this;
  }

  public Exec(): Observable<T[]> {
    const requestOptions: {
      headers?: HttpHeaders;
      observe: 'response';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } = this.getQueryRequestOptions(false);

    return this.http.get<IODataResponseModel<T>>(this._entitiesUri, requestOptions)
      .map(res => this.extractArrayData(res, this.config))
      .catch((err: any, caught: Observable<Array<T>>) => {
        if (this.config.handleError) {
          this.config.handleError(err, caught);
        }
        return Observable.throw(err);
      });
  }

  public ExecWithCount(): Observable<ODataPagedResult<T>> {
    const requestOptions: {
      headers?: HttpHeaders;
      observe: 'response';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    } = this.getQueryRequestOptions(true);

    return this.http.get<IODataResponseModel<T>>(this._entitiesUri, requestOptions)
      .map(res => this.extractArrayDataWithCount(res, this.config))
      .catch((err: any, caught: Observable<ODataPagedResult<T>>) => {
        if (this.config.handleError) {
          this.config.handleError(err, caught);
        }
        return Observable.throw(err);
      });
  }

  private getQueryRequestOptions(odata4: boolean): {
    headers?: HttpHeaders;
    observe: 'response';
    params?: HttpParams;
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  } {
    let params = super.getParams();

    if (this._filter) {
      params = params.append(this.config.keys.filter, this._filter);
    }

    if (this._top) {
      params = params.append(this.config.keys.top, this._top.toString());
    }

    if (this._skip) {
      params = params.append(this.config.keys.skip, this._skip.toString());
    }

    if (this._orderBy) {
      params = params.append(this.config.keys.orderBy, this._orderBy);
    }

    if (odata4) {
      params = params.append('$count', 'true'); // OData v4 only
    }

    const options = Object.assign({}, this.config.defaultRequestOptions);
    options.params = params;

    return options;
  }

  private extractArrayData(res: HttpResponse<IODataResponseModel<T>>, config: ODataConfiguration): T[] {
    return config.extractQueryResultData(res);
  }

  private extractArrayDataWithCount(res: HttpResponse<IODataResponseModel<T>>, config: ODataConfiguration): ODataPagedResult<T> {
    return config.extractQueryResultDataWithCount(res);
  }
}
