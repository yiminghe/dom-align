export function getWindow(node: HTMLElement): Window {
  if (node && (node as any).document && (node as any).setTimeout) {
    return node as any
  }
  const doc = node.ownerDocument || node
  return doc.defaultView || (doc as any).parentWindow
}
