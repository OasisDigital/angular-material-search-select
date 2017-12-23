import { Observable } from 'rxjs/Observable';

export interface OptionEntry {
  display: string;
  match: boolean;
  value: any;
  details: any;
}

export interface DataSource {
  displayValue: (value: any) => Observable<OptionEntry | null>;
  search: (term: string) => Observable<OptionEntry[]>;
}
