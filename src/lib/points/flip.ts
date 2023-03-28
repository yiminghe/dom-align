import { Points } from '../../types/point'

export function flip(points: Points, reg: RegExp, map: Record<string, string>): Points {
  return points.map((point) => point.replace(reg, (pointSymbol) => map[pointSymbol] as any)) as Points
}

export function flipHorizontally(points: Points): Points {
  return flip(points, /[lr]/gi, {
    l: 'r',
    r: 'l',
  })
}

export function flipVertically(points: Points): Points {
  return flip(points, /[tb]/gi, {
    t: 'b',
    b: 't',
  })
}
