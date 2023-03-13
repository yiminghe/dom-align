import { getOffset } from '../dom'
import { getTransformName } from './get-transform-name'
import { setLeftTop } from './set-left-top'
import { setTransform } from './set-transform'

export function setOffset(elem: HTMLElement, offset: any, option: any) {
  if (option.ignoreShake) {
    const oriOffset = getOffset(elem)

    const oLeft = oriOffset.left.toFixed(0)
    const oTop = oriOffset.top.toFixed(0)
    const tLeft = offset.left.toFixed(0)
    const tTop = offset.top.toFixed(0)

    if (oLeft === tLeft && oTop === tTop) {
      return
    }
  }

  if (option.useCssRight || option.useCssBottom) {
    setLeftTop(elem, offset, option)
  } else if (option.useCssTransform && getTransformName() in document.body.style) {
    setTransform(elem, offset)
  } else {
    setLeftTop(elem, offset, option)
  }
}
