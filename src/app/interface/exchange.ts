export interface StringNumberPair {
    [key: string]: number;
}

export interface ExchangeResponse {
    base: string;
    rates: StringNumberPair;
}

export interface MappedCurrencyRateObject {
    currency: string;
    rate: number;
}
