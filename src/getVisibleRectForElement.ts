import getOffsetParent from './getOffsetParent'
import isAncestorFixed from './isAncestorFixed'
import { getOffset } from './lib/area/get-offset'
import {
  getDocument,
  getScrollLeft,
  getScrollTop,
  getStyle,
  getViewportHeight,
  getViewportWidth,
  isDocument,
  isWindow,
} from './lib/dom'

/**
 * 获得元素的显示部分的区域
 */
function getVisibleRectForElement(element: HTMLElement, alwaysByViewport: boolean) {
  const visibleRect = {
    left: 0,
    right: Infinity,
    top: 0,
    bottom: Infinity,
  }
  let el = getOffsetParent(element)
  const doc = getDocument(element)
  const win = doc.defaultView || (doc as any).parentWindow
  const body = doc.body
  const documentElement = doc.documentElement

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  while (el) {
    // clientWidth is zero for inline block elements in ie.
    if (
      (navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) &&
      // body may have overflow set on it, yet we still get the entire
      // viewport. In some browsers, el.offsetParent may be
      // document.documentElement, so check for that too.
      el !== body &&
      el !== documentElement &&
      getStyle(el, 'overflow') !== 'visible'
    ) {
      const pos = getOffset(el)
      // add border
      pos.left += el.clientLeft
      pos.top += el.clientTop
      visibleRect.top = Math.max(visibleRect.top, pos.top)
      visibleRect.right = Math.min(
        visibleRect.right,
        // consider area without scrollBar
        pos.left + el.clientWidth,
      )
      visibleRect.bottom = Math.min(visibleRect.bottom, pos.top + el.clientHeight)
      visibleRect.left = Math.max(visibleRect.left, pos.left)
    } else if (el === body || el === documentElement) {
      break
    }
    el = getOffsetParent(el)
  }

  // Set element position to fixed
  // make sure absolute element itself don't affect it's visible area
  // https://github.com/ant-design/ant-design/issues/7601
  let originalPosition = null
  if (!isWindow(element) && !isDocument(element)) {
    originalPosition = element.style.position
    const position = getStyle(element, 'position')
    if (position === 'absolute') {
      element.style.position = 'fixed'
    }
  }

  const scrollX = getScrollLeft(win)
  const scrollY = getScrollTop(win)
  const viewportWidth = getViewportWidth(win)
  const viewportHeight = getViewportHeight(win)
  let documentWidth = documentElement.scrollWidth
  let documentHeight = documentElement.scrollHeight

  // scrollXXX on html is sync with body which means overflow: hidden on body gets wrong scrollXXX.
  // We should cut this ourself.
  const bodyStyle = window.getComputedStyle(body)
  if (bodyStyle.overflowX === 'hidden') {
    documentWidth = win.innerWidth
  }
  if (bodyStyle.overflowY === 'hidden') {
    documentHeight = win.innerHeight
  }

  // Reset element position after calculate the visible area
  if (element.style && originalPosition) {
    element.style.position = originalPosition
  }

  if (alwaysByViewport || isAncestorFixed(element)) {
    // Clip by viewport's size.
    visibleRect.left = Math.max(visibleRect.left, scrollX)
    visibleRect.top = Math.max(visibleRect.top, scrollY)
    visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth)
    visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight)
  } else {
    // Clip by document's size.
    const maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth)
    visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth)

    const maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight)
    visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight)
  }

  return visibleRect.top >= 0 &&
    visibleRect.left >= 0 &&
    visibleRect.bottom > visibleRect.top &&
    visibleRect.right > visibleRect.left
    ? visibleRect
    : null
}

export default getVisibleRectForElement
