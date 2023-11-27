export type TSymbolType = 'BTC-USD'
export type TOrderBookEntry = [number, number] // [price, size]

export type TMarketData = {
  average_daily_volume: string
  average_daily_volume_change_basis: string
  average_daily_volume_change_premium: string
  base_currency: string
  last_trade_price_24h_change_basis: string
  last_trade_price_24h_change_premium: string
  last_trade_price_24high: string
  last_trade_price_24low: string
  long_ratio: string
  next_funding_rate_timestamp: number
  open_interest: string
  product_type: string
  quote_currency: string
  short_ratio: string
  last_trade_price: string
  index_price: string
}

export type TOrderBookData = {
  bids: TOrderBookEntry[]
  asks: TOrderBookEntry[]
}

export interface IOrderBookProps {
  symbol: TSymbolType
}
