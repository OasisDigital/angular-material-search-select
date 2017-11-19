import { Observable } from 'rxjs/Observable';

export interface OptionEntry {
  display: string;
  match: boolean;
  value: any;
  details: any;
}

export interface SearchResult {
  list?: OptionEntry[];
  errorMessage?: string;
}

export type DisplayValueFn = (value: any) => Observable<OptionEntry | null>;
export type SearchFn = (term: string) => Observable<OptionEntry[]>;
