import { NormalizedOffset, Offset, OffsetX, OffsetY } from '../../types/offset'
import { Size } from '../../types/rect'
import { isPercentage } from '../is/percentage'
import { isInteger } from '../is/integer'

export function normalize(offset: Offset, size: Size): NormalizedOffset {
  offset[0] = convertOffset(offset[0], size.width)
  offset[1] = convertOffset(offset[1], size.height)
  return offset as NormalizedOffset
}

function convertOffset(strOrInt: OffsetX | OffsetY, offsetLen: number): number {
  if (isInteger(strOrInt)) {
    return strOrInt
  }

  const int = parseInt(strOrInt, 10)

  if (isPercentage(strOrInt)) {
    return (int / 100) * offsetLen
  }

  return int
}
