import utils from './utils';
import getOffsetParent from './getOffsetParent';

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

  // Clip by document's size.
  const scrollX = utils.getWindowScrollLeft(win);
  const viewportWidth = utils.viewportWidth(win);
  const maxVisibleWidth = Math.max(documentElement.scrollWidth, scrollX + viewportWidth);
  visibleRect.right = Math.min(visibleRect.right, maxVisibleWidth);

  const scrollY = utils.getWindowScrollTop(win);
  const viewportHeight = utils.viewportHeight(win);
  const maxVisibleHeight = Math.max(documentElement.scrollHeight, scrollY + viewportHeight);
  visibleRect.bottom = Math.min(visibleRect.bottom, maxVisibleHeight);

  return (
    visibleRect.top >= 0 &&
      visibleRect.left >= 0 &&
      visibleRect.bottom > visibleRect.top &&
      visibleRect.right > visibleRect.left
  ) ? visibleRect : null;
}

export default getVisibleRectForElement;
