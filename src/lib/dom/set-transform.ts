import { getTransformXY } from '../style/get-transform-xy'
import { setTransformXY } from '../style/set-transform-xy'
import { getOffset } from './get-offset'

export function setTransform(elem, offset) {
  const originalOffset = getOffset(elem)
  const originalXY = getTransformXY(elem)
  const resultXY = { x: originalXY.x, y: originalXY.y }
  if ('left' in offset) {
    resultXY.x = originalXY.x + offset.left - originalOffset.left
  }
  if ('top' in offset) {
    resultXY.y = originalXY.y + offset.top - originalOffset.top
  }
  setTransformXY(elem, resultXY as any)
}
