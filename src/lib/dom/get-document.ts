import { isDocument } from './is/document'
import { isWindow } from './is/window'

export function getDocument(el: HTMLElement | Document): Document {
  if (isWindow(el)) {
    return el.document
  }
  if (isDocument(el)) {
    return el
  }
  return el.ownerDocument
}
