import { getOffset } from './lib/area/get-offset'
import {
  isWindow,
  isDocument,
  getWindow,
  getScrollLeft,
  getScrollTop,
  getViewportWidth,
  getViewportHeight,
  getWH,
  BORDER_INDEX,
} from './lib/dom'

function getRegion(node: HTMLElement | Window | Document) {
  let offset: any
  let w
  let h
  if (!isWindow(node) && !isDocument(node)) {
    offset = getOffset(node)
    w = getWH(node, 'width', BORDER_INDEX)
    h = getWH(node, 'height', BORDER_INDEX)
  } else {
    const win = getWindow(node)
    offset = {
      left: getScrollLeft(win),
      top: getScrollTop(win),
    }
    w = getViewportWidth(win)
    h = getViewportHeight(win)
  }
  offset.width = w
  offset.height = h
  return offset
}

export default getRegion
