import { NormalizedOffset } from '../../types/offset'
import { Points } from '../../types/point'
import { Rect } from '../../types/rect'
import { getPosition } from './get-position'

export function getAbsolutePosition(
  absoluteRect: Rect,
  relativeRect: Rect,
  points: Points,
  absoluteOffset: NormalizedOffset,
  relativeOffset: NormalizedOffset,
) {
  const p1 = getPosition(relativeRect, points[1])
  const p2 = getPosition(absoluteRect, points[0])
  const diff = [p2.left - p1.left, p2.top - p1.top] as const

  return {
    left: Math.round(absoluteRect.left - diff[0] + absoluteOffset[0] - relativeOffset[0]),
    top: Math.round(absoluteRect.top - diff[1] + absoluteOffset[1] - relativeOffset[1]),
  }
}
