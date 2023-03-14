import { getDocumentHeight, getDocumentWidth } from './get-document-size'
import { getPBMWidth } from './get-pbm-width'
import { getStyle } from './get-style'
import { getViewportHeight, getViewportWidth } from './get-viewport-size'
import { isDocument } from './is/document'
import { isWindow } from './is/window'

type Side = 'Top' | 'Left' | 'Right' | 'Bottom'

const BOX_MODELS = ['margin', 'border', 'padding'] as const
export const CONTENT_INDEX = -1
export const PADDING_INDEX = 2
export const BORDER_INDEX = 1
export const MARGIN_INDEX = 0

/*
 Get the size information of the element
 @param elem
 @param name
 @param {String} [extra]  'padding' : (css width) + padding
 'border' : (css width) + padding + border
 'margin' : (css width) + padding + border + margin
 */
export function getWH(elem: HTMLElement | Document, name: string, ex: number) {
  let extra = ex
  if (isWindow(elem)) {
    return name === 'width' ? getViewportWidth(elem) : getViewportHeight(elem)
  } else if (isDocument(elem)) {
    // ??? 🔴 getDocumentWidth expects window! 🔴 ???
    return name === 'width' ? getDocumentWidth(elem as any) : getDocumentHeight(elem as any)
  }
  const which: Side[] = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom']
  let borderBoxValue: number | undefined =
    name === 'width' ? Math.floor(elem.getBoundingClientRect().width) : Math.floor(elem.getBoundingClientRect().height)
  const isBorderBox = getStyle(elem, 'boxSizing') === 'border-box'
  let cssBoxValue: string | number = 0
  if (borderBoxValue === null || borderBoxValue === undefined || borderBoxValue <= 0) {
    borderBoxValue = undefined
    // Fall back to computed then un computed css if necessary
    cssBoxValue = getStyle(elem, name)
    if (cssBoxValue === null || cssBoxValue === undefined || Number(cssBoxValue) < 0) {
      cssBoxValue = elem.style[name as any] || 0
    }
    // Normalize '', auto, and prepare for extra
    cssBoxValue = Math.floor(parseFloat(cssBoxValue as any)) || 0
  }
  if (extra === undefined) {
    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX
  }
  const borderBoxValueOrIsBorderBox = borderBoxValue !== undefined || isBorderBox
  const val = borderBoxValue || cssBoxValue
  if (extra === CONTENT_INDEX) {
    if (borderBoxValueOrIsBorderBox) {
      return val - getPBMWidth(elem, ['border', 'padding'], which)
    }
    return cssBoxValue
  } else if (borderBoxValueOrIsBorderBox) {
    if (extra === BORDER_INDEX) {
      return val
    }
    return (
      val + (extra === PADDING_INDEX ? -getPBMWidth(elem, ['border'], which) : getPBMWidth(elem, ['margin'], which))
    )
  }
  return cssBoxValue + getPBMWidth(elem, BOX_MODELS.slice(extra), which)
}
