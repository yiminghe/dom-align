import { getPBMWidth, Side } from './get-pbm-width'
import { getStyle } from './get-style'
import { CONTENT_INDEX, getWH } from './get-wh'
import { setStyle } from './set-style'

function getSize(elem: HTMLElement, v: number | undefined, name: 'width' | 'height'): number | undefined {
  const which: Side[] = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom']
  let val = v
  // TODO remove if-block because it seems like val is always undefined
  if (val !== undefined) {
    if (elem) {
      const isBorderBox = getStyle(elem, 'boxSizing') === 'border-box'
      if (isBorderBox) {
        val += getPBMWidth(elem, ['padding', 'border'], which)
      }
      setStyle(elem, name, val)
      return undefined
    }
    return undefined
  }
  return elem && getWH(elem, name, CONTENT_INDEX)
}

export function getWidth(elem: HTMLElement, v?: number) {
  return getSize(elem, v, 'width')
}

export function getHeight(elem: HTMLElement, v?: number) {
  return getSize(elem, v, 'height')
}
