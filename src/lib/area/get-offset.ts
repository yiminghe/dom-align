import { Position } from '../../types/rect'
import { getScrollLeft, getScrollTop } from '../dom'
import { getClientPosition } from './get-client-position'

export function getOffset(el: HTMLElement): Position {
  const pos = getClientPosition(el)
  const doc = el.ownerDocument
  const w = doc.defaultView || (doc as any).parentWindow
  pos.left += getScrollLeft(w)
  pos.top += getScrollTop(w)
  return pos
}
