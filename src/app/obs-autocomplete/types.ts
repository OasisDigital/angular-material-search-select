import { Observable } from 'rxjs/Observable';

export interface OptionEntry {
  display: string;
  value: any;
  match: boolean;
  tip?: string;
}

export interface SearchResult {
  list?: OptionEntry[];
  errorMessage?: string;
}

export type DisplayValueFn = (value: any) => Observable<OptionEntry | null>;
export type SearchFn = (term: string) => Observable<OptionEntry[]>;
