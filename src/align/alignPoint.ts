import { getDocument, getScrollLeft, getScrollTop, getViewportHeight, getViewportWidth } from '../lib/dom'
import { Config } from '../types/config'
import { Points } from '../types/point'
import doAlign from './align'

/**
 * `tgtPoint`: { pageX, pageY } or { clientX, clientY }.
 * If client position provided, will internal convert to page position.
 */

type Point =
  | {
      clientX: number
      clientY: number
    }
  | {
      pageX: number
      pageY: number
    }

function alignPoint(el: HTMLElement, tgtPoint: Point, align: Config) {
  let pageX
  let pageY

  const doc = getDocument(el)
  const win = doc.defaultView || (doc as any).parentWindow

  if ('pageX' in tgtPoint) {
    pageX = tgtPoint.pageX
  } else {
    const scrollX = getScrollLeft(win)
    pageX = scrollX + tgtPoint?.clientX
  }

  if ('pageY' in tgtPoint) {
    pageY = tgtPoint.pageY
  } else {
    const scrollY = getScrollTop(win)
    pageY = scrollY + tgtPoint.clientY
  }

  const tgtRegion = {
    left: pageX,
    top: pageY,
    width: 0,
    height: 0,
  }

  const isTgtRegionVisible =
    pageX >= 0 && pageX <= scrollX + getViewportWidth(win) && pageY >= 0 && pageY <= scrollY + getViewportHeight(win)

  // Provide default target point
  const points: Points = [align.points[0], 'cc']

  return doAlign(el, tgtRegion, { ...align, points }, isTgtRegionVisible)
}

export default alignPoint
