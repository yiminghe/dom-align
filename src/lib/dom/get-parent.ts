import { isDocument } from './is/document'
import { isElement } from './is/element'
import { isShadowRoot } from './is/shadow-root'

export function getParent(element: HTMLElement | Document | ShadowRoot): HTMLElement {
  let parent = element

  do {
    if (isShadowRoot(parent) && parent.host) {
      parent = (parent as any).host as HTMLElement
    } else {
      parent = parent.parentNode as HTMLElement
    }
  } while (parent && !isElement(parent) && !isDocument(parent))

  return parent
}
