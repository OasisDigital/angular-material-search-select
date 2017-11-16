import { Observable } from 'rxjs/Observable';

export interface OptionEntry {
  display: string;
  value: any;
  match: boolean;
}

export interface ErrorEntry {
  msg: string;
}

export type SearchResult = OptionEntry[] | ErrorEntry;

export type SearchFn = (x: string) => Observable<OptionEntry[]>;
