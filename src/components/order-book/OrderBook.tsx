import React from 'react'
import { useOrderBook } from '../../hooks/useOrderBook'
import { IOrderBookProps } from './types'
import { parseToNumber } from './helpers'
import './OrderBook.scss'
import { UpArrow } from '../../icons/UpArrow'
import { DownArrow } from '../../icons/DownArrow'

const OrderBook = ({ symbol }: IOrderBookProps) => {
  const { orderBook, marketData, isPriceUp, priceSymbol, amountSymbol } =
    useOrderBook({ symbol })

  return (
    <div className="order-book">
      <div className="header">
        <div>Price {priceSymbol}</div>
        <div>Amount {amountSymbol}</div>
        <div>Total {amountSymbol}</div>
      </div>
      <div className="entries">
        <div className="bids">
          {orderBook?.asks.slice(0, 10).map(([price, amount], index) => (
            <div key={index} className="entry bid">
              <div>{parseToNumber(price).toFixed(2)}</div>
              <div>{parseToNumber(amount).toFixed(4)}</div>
              <div>
                {(parseToNumber(price) * parseToNumber(amount)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        {!!marketData?.last_trade_price && (
          <div className="market">
            <div>
              {isPriceUp ? <UpArrow /> : <DownArrow />}
              {marketData?.last_trade_price &&
                parseToNumber(marketData?.last_trade_price).toFixed(2)}
            </div>
            <div>
              {marketData?.index_price &&
                parseToNumber(marketData.index_price).toFixed(2)}
            </div>
          </div>
        )}
        <div className="asks">
          {orderBook?.bids.slice(-10).map(([price, amount], index) => (
            <div key={index} className="entry ask">
              <div>{parseToNumber(price).toFixed(2)}</div>
              <div>{parseToNumber(amount).toFixed(4)}</div>
              <div>
                {(parseToNumber(price) * parseToNumber(amount)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderBook
