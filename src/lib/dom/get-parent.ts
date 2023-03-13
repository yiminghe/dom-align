import { isDocument } from './is/document'
import { isElement } from './is/element'

export function getParent(element: HTMLElement): HTMLElement {
  let parent = element

  do {
    if (parent.nodeType === 11 && (parent as any).host) {
      parent = (parent as any).host as HTMLElement
    } else {
      parent = parent.parentNode as HTMLElement
    }
  } while (parent && !isElement(parent) && !isDocument(parent))

  return parent
}
