export function getWindow(node: HTMLElement | Window | Document): Window {
  if (node && (node as any).document && (node as any).setTimeout) {
    return node as any
  }
  const doc = (node as any).ownerDocument || node
  return doc.defaultView || (doc as any).parentWindow
}
