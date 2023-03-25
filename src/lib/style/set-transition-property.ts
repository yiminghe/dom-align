import { getTransitionName } from './get-transition-name'

export function setTransitionProperty(node: HTMLElement, value: string) {
  const name = getTransitionName()
  if (name) {
    node.style[name as any] = value
    if (name !== 'transitionProperty') {
      node.style.transitionProperty = value
    }
  }
}
