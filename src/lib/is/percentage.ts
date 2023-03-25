import { isString } from './string'

export function isPercentage(input: unknown): input is `${number}%` {
  return isString(input) && /%$/.test(input)
}
