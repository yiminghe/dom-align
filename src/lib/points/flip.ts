import { Points } from '../../types/point'

export function flip(points: Points, reg: RegExp, map: Record<string, string>): Points {
  return points.map((point) => point.replace(reg, (pointSymbol) => map[pointSymbol])) as Points
}
