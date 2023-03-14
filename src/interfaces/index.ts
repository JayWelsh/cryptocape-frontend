export interface IAsset {
    address: string
    symbol: string
    decimals: number
}

export interface IAddressBundle {
    name: string
    addresses: string[]
}

export interface ITimeseriesResponse {
    value: string
    timestamp: string
}

export interface ITimeseriesEntry {
    date: string;
    value: number;
}

export interface IBalancesCombinedAssetRecordResponse {
    balance: string
    value: string
    symbol: string
    token_price: string
    token_decimals: string
    percentage_of_total: string
    market_cap_usd: string
    volume_24hr_usd: string
    change_24hr_usd_percent: string
}

export interface IBalancesCombinedResponseData {
    total: string
    assetAddressToValue: {[key: string]: IBalancesCombinedAssetRecordResponse}
}

export interface IBalancesCombinedResponse {
    data: IBalancesCombinedResponseData
}

export interface IPortfolioOverviewData {
    symbol: string;
    tokenPrice: number;
    portfolioValue: number;
    marketCap: number;
    tokenQuantity: number;
    portfolioPortion: number;
    tokenPriceChangePercent24Hr: number;
    relativePortfolioValueChangePercent24Hr: number;
}