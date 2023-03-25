import { Points } from '../../types/point'
import { flip } from './flip'

describe(flip.name, () => {
  it('lr', () => {
    const points: Points = ['tl', 'tr']

    const newPoints = flip(points, /[lr]/gi, {
      l: 'r',
      r: 'l',
    })

    expect(newPoints).toEqual(['tr', 'tl'])
  })

  it('tb', () => {
    const points: Points = ['tl', 'bl']

    const newPoints = flip(points, /[tb]/gi, {
      t: 'b',
      b: 't',
    })

    expect(newPoints).toEqual(['bl', 'tl'])
  })
})
