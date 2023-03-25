import doAlign from './align'
import getOffsetParent from '../getOffsetParent'
import getVisibleRectForElement from '../getVisibleRectForElement'
import getRegion from '../getRegion'
import { Config } from '../types/config'

function isOutOfVisibleRect(target: HTMLElement, alwaysByViewport = false) {
  const visibleRect = getVisibleRectForElement(target, alwaysByViewport)
  const targetRegion = getRegion(target)

  return (
    !visibleRect ||
    targetRegion.left + targetRegion.width <= visibleRect.left ||
    targetRegion.top + targetRegion.height <= visibleRect.top ||
    targetRegion.left >= visibleRect.right ||
    targetRegion.top >= visibleRect.bottom
  )
}

function alignElement(el: HTMLElement, refNode: HTMLElement, align: Config) {
  const target = align.target || refNode
  const refNodeRegion = getRegion(target)

  const isTargetOutOfVisible = isOutOfVisibleRect(target, align?.overflow && align.overflow.alwaysByViewport)

  return doAlign(el, refNodeRegion, align, !isTargetOutOfVisible)
}

alignElement.__getOffsetParent = getOffsetParent

alignElement.__getVisibleRectForElement = getVisibleRectForElement

export default alignElement
