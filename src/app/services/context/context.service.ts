import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: "root"
})
export class ContextService {
  private context: Map<string, any>;
  private context$: BehaviorSubject<any>;
  constructor() {
    this.context = new Map<string, any>();
    this.context$ = new BehaviorSubject(this.context);
  }
  set(key: string, value: any) {
    this.context.set(key, value);
    this.context$.next(this.context);
  }
  getContext() {
    return this.context$;
  }
}