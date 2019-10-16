import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ExchangeResponse } from '../interface/exchange';

@Injectable()
export class ExchangeApiRequestService {

  constructor(
    public http: HttpClient
  ) { }

  public getExchange(currency: string): Observable<ExchangeResponse> {
    return this.http.get<ExchangeResponse>(`${environment.exchangeAPIUrl}/api/latest.json?app_id=${environment.appID}&base=${currency}`);
  }
}
