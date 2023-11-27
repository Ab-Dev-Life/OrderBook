import { TOrderBookEntry } from './types'

export const parseToNumber = (value: string | number): number => {
  return Number.parseFloat(String(value))
}

export const mergeOrderBookArrays = (
  existingArray: TOrderBookEntry[],
  newArray: TOrderBookEntry[],
): TOrderBookEntry[] => {
  const orderBookMap = new Map<number, number>(
    existingArray?.map((entry) => [entry[0], entry[1]]),
  )

  newArray?.forEach(([price, size]) => {
    Number(size) === 0 ? orderBookMap.delete(price) : orderBookMap.set(price, size)
  })

  return Array.from(orderBookMap).sort((a, b) => a[0] - b[0])
}
