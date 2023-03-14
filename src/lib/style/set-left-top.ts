import { Config } from '../../types/config'
import { getOffset } from '../area/get-offset'

import { getOffsetDirection, getOppositeOffsetDirection } from '../config'
import { forceRelayout, getStyle } from '../dom'
import { setStyle } from '../dom/set-style'
import { getTransitionProperty } from './get-transition-property'
import { setTransitionProperty } from './set-transition-property'

// 设置 elem 相对 elem.ownerDocument 的坐标
export function setLeftTop(elem: HTMLElement, offset: any /** Offset */, option: Config) {
  // set position first, in-case top/left are set even on static elem
  if (getStyle(elem, 'position') === 'static') {
    elem.style.position = 'relative'
  }
  let presetH = -999
  let presetV = -999
  const horizontalProperty = getOffsetDirection('left', option)
  const verticalProperty = getOffsetDirection('top', option)
  const oppositeHorizontalProperty = getOppositeOffsetDirection(horizontalProperty)
  const oppositeVerticalProperty = getOppositeOffsetDirection(verticalProperty)

  if (horizontalProperty !== 'left') {
    presetH = 999
  }

  if (verticalProperty !== 'top') {
    presetV = 999
  }
  let originalTransition = ''
  const originalOffset: any = getOffset(elem)
  if ('left' in offset || 'top' in offset) {
    originalTransition = getTransitionProperty(elem) || ''
    setTransitionProperty(elem, 'none')
  }
  if ('left' in offset) {
    elem.style[oppositeHorizontalProperty] = ''
    elem.style[horizontalProperty] = `${presetH}px`
  }
  if ('top' in offset) {
    elem.style[oppositeVerticalProperty] = ''
    elem.style[verticalProperty] = `${presetV}px`
  }
  // force relayout
  forceRelayout(elem)
  const old: any = getOffset(elem)
  const originalStyle: any = {}
  for (const key in offset) {
    if (offset.hasOwnProperty(key)) {
      const dir = getOffsetDirection(key as any, option)
      const preset = key === 'left' ? presetH : presetV
      const off = originalOffset[key] - old[key]
      if (dir === key) {
        originalStyle[dir] = preset + off
      } else {
        originalStyle[dir] = preset - off
      }
    }
  }
  for (const i in originalStyle) {
    if (originalStyle.hasOwnProperty(i)) {
      setStyle(elem, i, originalStyle[i])
    }
  }
  // force relayout
  forceRelayout(elem)
  if ('left' in offset || 'top' in offset) {
    setTransitionProperty(elem, originalTransition)
  }
  const ret: any = {}
  for (const key in offset) {
    if (offset.hasOwnProperty(key)) {
      const dir = getOffsetDirection(key as any, option)
      const off = offset[key] - originalOffset[key]
      if (key === dir) {
        ret[dir] = originalStyle[dir] + off
      } else {
        ret[dir] = originalStyle[dir] - off
      }
    }
  }
  for (const i in ret) {
    if (ret.hasOwnProperty(i)) {
      setStyle(elem, i, ret[i])
    }
  }
}
