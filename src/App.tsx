import React from 'react'
import OrderBook from './components/order-book/OrderBook'
import { SYMBOL } from './components/order-book/constants'

const App = () => {
  return (
    <div className="App">
      <OrderBook symbol={SYMBOL} />
    </div>
  )
}

export default App
