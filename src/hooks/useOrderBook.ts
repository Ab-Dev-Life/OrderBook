import { useState, useEffect, useMemo } from 'react'
import { Centrifuge, PublicationContext, SubscribedContext } from 'centrifuge'
import { mergeOrderBookArrays } from '../components/order-book/helpers'
import {
  IOrderBookProps,
  TMarketData,
  TOrderBookData,
} from '../components/order-book/types'
import {
  JWT,
  MAX_RECONNECT_DELAY,
  MIN_RECONNECT_DELAY,
  WS_URL,
} from '../components/order-book/constants'

export const useOrderBook = ({ symbol }: IOrderBookProps) => {
  const [orderBook, setOrderBook] = useState<TOrderBookData>({
    bids: [],
    asks: [],
  })
  const [marketData, setMarketData] = useState<TMarketData | null>(null)
  const [isPriceUp, setIsPriceUp] = useState(false)

  // Adding a state to track the last known sequence
  const [lastSequence, setLastSequence] = useState<number | null>(null)
  // Adding a state to track the last known market timestamp
  const [lastMarketTimestamp, setLastMarketTimestamp] = useState<number | null>(
    null,
  )

  // Getting currency symbols
  const [priceSymbol, amountSymbol] = useMemo(() => symbol.split('-'), [symbol])

  useEffect(() => {
    const client = new Centrifuge(WS_URL, {
      debug: true,
      minReconnectDelay: MIN_RECONNECT_DELAY,
      maxReconnectDelay: MAX_RECONNECT_DELAY,
      token: JWT,
    })

    const orderBookSubscription = client.newSubscription(`orderbook:${symbol}`)

    orderBookSubscription
      .on('publication', (ctx: PublicationContext) => {
        if (lastSequence && ctx.data.sequence !== lastSequence + 1) {
          // Handling missed sequence number: Resubscribing
          orderBookSubscription.unsubscribe()
          orderBookSubscription.subscribe()
        }

        setOrderBook((prev: TOrderBookData) => ({
          bids: mergeOrderBookArrays(prev.bids, ctx.data.bids),
          asks: mergeOrderBookArrays(prev.asks, ctx.data.asks),
        }))

        setLastSequence(ctx.data.sequence)
      })
      .on('subscribed', (ctx: SubscribedContext) => {
        setOrderBook({
          bids: ctx.data.bids,
          asks: ctx.data.asks,
        })
      })
      .on('unsubscribed', () => {
        console.log('Unsubscribed')
      })

    orderBookSubscription.subscribe()

    // Subscription for market data
    const marketSubscription = client.newSubscription(`market:${symbol}`)

    marketSubscription
      .on('publication', (ctx: PublicationContext) => {
        const currentTimestamp = ctx?.data?.next_funding_rate_timestamp

        if (lastMarketTimestamp && currentTimestamp > lastMarketTimestamp + 1) {
          // Potential missed market updates. Resubscribing.
          marketSubscription.unsubscribe()
          marketSubscription.subscribe()
        }

        setLastMarketTimestamp(currentTimestamp)
        if (ctx.data.last_trade_price && ctx.data.index_price) {
          setMarketData((prev: TMarketData | null) => {
            prev?.index_price &&
              setIsPriceUp(prev?.index_price > ctx.data.index_price)
            return ctx.data
          })
        }
      })
      .on('subscribed', (ctx: SubscribedContext) => {
        setMarketData(ctx.data)
      })
      .on('unsubscribed', () => {
        console.log('Unsubscribed')
      })

    marketSubscription.subscribe()

    client.connect()

    return () => {
      orderBookSubscription.unsubscribe()
      marketSubscription.unsubscribe()
      client.disconnect()
    }
  }, [symbol])

  return { orderBook, marketData, isPriceUp, priceSymbol, amountSymbol }
}
