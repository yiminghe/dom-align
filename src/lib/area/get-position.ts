import { Point } from '../../types/point'
import { Position, Rect } from '../../types/rect'

export function getPosition(region: Rect, point: Point): Position {
  const V = point.charAt(0)
  const H = point.charAt(1)
  const w = region.width
  const h = region.height

  let left = region.left
  let top = region.top

  if (V === 'c') {
    top += h / 2
  } else if (V === 'b') {
    top += h
  }

  if (H === 'c') {
    left += w / 2
  } else if (H === 'r') {
    left += w
  }

  return { left, top }
}
