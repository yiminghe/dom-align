import { Size } from '../../types/rect'
import { normalize } from './normalize'

describe(normalize.name, () => {
  const rect: Size = {
    width: 200,
    height: 200,
  }

  it('normalize numeric offset', () => {
    const ret = normalize([5, 50], rect)

    expect(ret).toEqual([5, 50])
  })

  it('normalize stringified numeric offset', () => {
    const ret = normalize(['5', '50'], rect)

    expect(ret).toEqual([5, 50])
  })

  it('normalize percentage offset', () => {
    const ret = normalize(['5%', '50%'], rect)

    expect(ret).toEqual([10, 100])
  })
})
