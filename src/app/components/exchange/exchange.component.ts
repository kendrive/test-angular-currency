import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Observable } from 'rxjs';

import { map, startWith } from 'rxjs/operators';
import { ExchangeApiRequestService } from '../../services/exchange-api-request.service';
import { ExchangeResponse, MappedCurrencyRateObject } from '../../interface/exchange';

import {
  FormNames,
  Currency,
} from '../../interface/enums.enum';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.styl'],
})
export class ExchangeComponent implements OnInit {
  public exchangeForm: FormGroup = new FormGroup({
    amountControl: new FormControl('', [Validators.required]),
    fromControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    toControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });
  public listFromValues: Observable<string[]>;
  public listToValues: Observable<string[]>;
  public responseExchangeRates: MappedCurrencyRateObject[];

  public amount: number;
  public fromRate: number;
  public fromCurrency: string;
  public toRate: number;
  public toCurrency: string;
  public result: string;

  public fromCurrencies: string[] = [];
  public toCurrencies: string[] = [];

  constructor(
    private apiRequestService: ExchangeApiRequestService,
  ) { }

  ngOnInit() {
    this.getRequest();
    this.listFromValues = this.valueFromChange(FormNames.FromControl);
    this.listToValues = this.valueToChange(FormNames.ToControl);
  }

  getRequest(): void {
    this.apiRequestService.getExchange(Currency.USD).subscribe((exchangeRate: ExchangeResponse): void => {
        this.responseExchangeRates = this.mapResponseData(exchangeRate);
        this.fromCurrencies = this.mapItemCurrencies();
        this.toCurrencies = this.mapItemCurrencies();
      },
      (error): void => {
        console.error(`Error: ${error.message}`);
      },
    );
  }

  valueFromChange(value: string): Observable<string[]> {
    return this.exchangeForm.get(value).valueChanges.pipe(
        startWith(''),
        map((val) => this.filterInputValue(val, this.fromCurrencies)),
    );
  }

  valueToChange(value: string): Observable<string[]> {
    return this.exchangeForm.get(value).valueChanges.pipe(
      startWith(''),
      map((val) => this.filterInputValue(val, this.toCurrencies)),
    );
  }

  mapItemCurrencies(): string[] {
    return this.responseExchangeRates.map((item: MappedCurrencyRateObject) => {
      return item.currency;
    }).sort();
  }

  mapResponseData(responseData: ExchangeResponse): MappedCurrencyRateObject[] {
    return Object.keys(responseData.rates).map(
      (item: string): MappedCurrencyRateObject => {
        return {
          currency: item,
          rate: responseData.rates[item],
        };
      },
    );
  }

  selectCurrency(event: MatOptionSelectionChange, inputName: string): void {
    if (event.isUserInput) {
      inputName = event.source.value;
    }
  }

  filterValue(value: string): MappedCurrencyRateObject {
    return this.responseExchangeRates.filter((item: MappedCurrencyRateObject) => {
      return item.currency === this.exchangeForm.get(value).value;
    })[0];
  }

  calculateExchangeRate(): string {
    return ((this.exchangeForm.get(FormNames.AmountControl).value * this.toRate) / this.fromRate).toFixed(3);
  }

  exchangeRates(): void {
    this.fromCurrency = this.filterValue(FormNames.FromControl).currency;
    this.toCurrency = this.filterValue(FormNames.ToControl).currency;

    this.amount = Math.floor(this.exchangeForm.get(FormNames.AmountControl).value);
    this.result = this.calculateExchangeRate();
  }

  private filterInputValue(value: string, arrayGoingFiltered: string[]): string[] {
    const filterValue = value.toLowerCase();

    return arrayGoingFiltered.filter((option) => option.toLowerCase().includes(filterValue));
  }

}
