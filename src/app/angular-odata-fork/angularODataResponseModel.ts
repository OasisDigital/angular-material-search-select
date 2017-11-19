export interface IODataResponseModel<T> {
    '@odata.context': string;

    '@odata.count'?: number;

    value: T[];
}
