import {
  isWindow,
  isDocument,
  getWindow,
  getOffset,
  getOuterWidth,
  getOuterHeight,
  getScrollLeft,
  getScrollTop,
  getViewportWidth,
  getViewportHeight,
} from './lib/dom'

function getRegion(node: HTMLElement | Window | Document) {
  let offset: any
  let w
  let h
  if (!isWindow(node) && !isDocument(node)) {
    offset = getOffset(node)
    w = getOuterWidth(node)
    h = getOuterHeight(node)
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
