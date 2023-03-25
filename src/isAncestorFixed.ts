import { getDocument, getStyle, isDocument, isWindow } from './lib/dom'
import { getParent } from './lib/dom/get-parent'

export default function isAncestorFixed(element: HTMLElement | Document) {
  if (isWindow(element) || isDocument(element)) {
    return false
  }

  const doc = getDocument(element)
  const body = doc.body
  let parent = null
  for (
    parent = getParent(element);
    // 修复元素位于 document.documentElement 下导致崩溃问题
    // @ts-ignore This comparison appears to be unintentional because the types 'HTMLElement' and 'Document' have no overlap
    parent && parent !== body && parent !== doc;
    parent = getParent(parent)
  ) {
    const positionStyle = getStyle(parent, 'position')
    if (positionStyle === 'fixed') {
      return true
    }
  }
  return false
}
