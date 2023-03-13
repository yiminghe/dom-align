import { BORDER_INDEX, getWHIgnoreDisplay, MARGIN_INDEX } from './get-wh'

function getOuterSize(el: HTMLElement, name: 'width' | 'height', includeMargin: boolean) {
  return el && getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX)
}

export function getOuterWidtht(el: HTMLElement, includeMargin: boolean) {
  return getOuterSize(el, 'width', includeMargin)
}

export function getOuterHeight(el: HTMLElement, includeMargin: boolean) {
  return getOuterSize(el, 'height', includeMargin)
}
