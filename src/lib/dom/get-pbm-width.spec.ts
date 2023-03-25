import { getPBMWidth } from './get-pbm-width'

describe(getPBMWidth.name, () => {
  it('margin', async () => {
    const div = document.createElement('div')
    div.style.margin = '4px'
    expect(getPBMWidth(div, ['margin'], ['Left'])).toBe(4)
    div.remove()
  })
  it('padding', async () => {
    const div = document.createElement('div')
    div.style.padding = '4px'
    expect(getPBMWidth(div, ['padding'], ['Left'])).toBe(4)
    div.remove()
  })
  it('padding', async () => {
    const div = document.createElement('div')
    div.style.border = '4px'
    expect(getPBMWidth(div, ['border'], ['Left'])).toBe(4)
    div.remove()
  })
  it('padding margin border', async () => {
    const div = document.createElement('div')
    div.style.border = '1px'
    div.style.margin = '10px'
    div.style.padding = '100px'
    expect(getPBMWidth(div, ['border', 'margin', 'padding'], ['Left'])).toBe(111)
    expect(getPBMWidth(div, ['border', 'margin', 'padding'], ['Left', 'Right'])).toBe(222)
    div.remove()
  })
})
