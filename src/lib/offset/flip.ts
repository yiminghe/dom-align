import { NormalizedOffset } from '../../types/offset'

export function flip(offset: NormalizedOffset, index: 0 | 1): NormalizedOffset {
  offset[index] = -offset[index]
  return offset
}
