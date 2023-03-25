import { getTransformName } from './get-transform-name'

export function setTransform(node: HTMLElement, value: string) {
  const name = getTransformName()
  if (name) {
    node.style[name as any] = value
    if (name !== 'transform') {
      node.style.transform = value
    }
  }
}
