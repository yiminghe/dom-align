import { getTransitionName } from './get-transition-name'

export function getTransitionProperty(node: HTMLElement) {
  return node.style.transitionProperty || node.style[getTransitionName() as any]
}
