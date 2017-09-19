import utils from './utils';
import getOffsetParent from './getOffsetParent';
import isAncestorFixed from './isAncestorFixed';

/**
 * 获得元素的显示部分的区域
 */
function getVisibleRectForElement(element) {
  const visibleRect = {
    left: 0,
    right: Infinity,
    top: 0,
    bottom: Infinity,
  };
  let el = getOffsetParent(element);
  const doc = utils.getDocument(element);
  const win = doc.defaultView || doc.parentWindow;
  const body = doc.body;
  const documentElement = doc.documentElement;

  // Determine the size of the visible rect by climbing the dom accounting for
  // all scrollable containers.
  while (el) {
    // clientWidth is zero for inline block elements in ie.
    if (
      (navigator.userAgent.indexOf('MSIE') === -1 || el.clientWidth !== 0) &&
        // body may have overflow set on it, yet we still get the entire
        // viewport. In some browsers, el.offsetParent may be
        // document.documentElement, so check for that too.
        (el !== body &&
         el !== documentElement &&
         utils.css(el, 'overflow') !== 'visible')
    ) {
      const pos = utils.offset(el);
      // add border
      pos.left += el.clientLeft;
      pos.top += el.clientTop;
      visibleRect.top = Math.max(visibleRect.top, pos.top);
      visibleRect.right = Math.min(visibleRect.right,
        // consider area without scrollBar
        pos.left + el.clientWidth);
      visibleRect.bottom = Math.min(visibleRect.bottom,
        pos.top + el.clientHeight);
      visibleRect.left = Math.max(visibleRect.left, pos.left);
    } else if (el === body || el === documentElement) {
      break;
    }
    el = getOffsetParent(el);
  }

  // Set element position to fixed
  // make sure absolute element itself don't affect it's visible area
  // https://github.com/ant-design/ant-design/issues/7601
  let originalPosition = null;
  if (!utils.isWindow(element) && element.nodeType !== 9) {
    originalPosition = element.style.position;
    const position = utils.css(element, 'position');
    if (position === 'absolute') {
      element.style.position = 'fixed';
    }
  }

  const scrollX = utils.getWindowScrollLeft(win);
  const scrollY = utils.getWindowScrollTop(win);
  const viewportWidth = utils.viewportWidth(win);
  const viewportHeight = utils.viewportHeight(win);
  const documentWidth = documentElement.scrollWidth;
  const documentHeight = documentElement.scrollHeight;

  // Reset element position after calculate the visible area
  if (element.style) {
    element.style.position = originalPosition;
  }

  if (isAncestorFixed(element)) {
    // Clip by viewport's size.
    visibleRect.left = Math.max(visibleRect.left, scrollX);
    visibleRect.top = Math.max(visibleRect.top, scrollY);
    visibleRect.right = Math.min(visibleRect.right, scrollX + viewportWidth);
    visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + viewportHeight);
  } else {
    // Clip by document's size.
    const maxVisibleWidth = Math.max(documentWidth, scrollX + viewportWidth);
    visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);

    const maxVisibleHeight = Math.max(documentHeight, scrollY + viewportHeight);
    visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);
  }

  return (
    visibleRect.top >= 0 &&
      visibleRect.left >= 0 &&
      visibleRect.bottom > visibleRect.top &&
      visibleRect.right > visibleRect.left
  ) ? visibleRect : null;
}

export default getVisibleRectForElement;
