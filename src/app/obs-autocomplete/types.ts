import { Observable } from 'rxjs/Observable';

export interface OptionEntry {
  display: string;
  value: any;
  match: boolean;
  tip?: string;
}

export interface ErrorEntry {
  msg: string;
}

export type SearchResult = OptionEntry[] | ErrorEntry;

export type DisplayValueFn = (x: any) => Observable<OptionEntry | null>;
export type SearchFn = (x: string) => Observable<OptionEntry[]>;
