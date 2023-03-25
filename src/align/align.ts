/**
 * align dom node flexibly
 * @author yiminghe@gmail.com
 */

import getVisibleRectForElement from '../getVisibleRectForElement'
import adjustForViewport from '../adjustForViewport'
import getRegion from '../getRegion'
import { CONTENT_INDEX, getWH, setStyle } from '../lib/dom'
import { getAbsolutePosition } from '../lib/area/get-absolute-position'
import { flip as flipPoints } from '../lib/points'
import { normalize as normalizeOffset, flip as flipOffset } from '../lib/offset'
import { setOffset } from '../lib/style/set-offset'
import { Position, Rect } from '../types/rect'
import { Config } from '../types/config'
import { NormalizedOffset } from '../types/offset'

// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos: Position, elRegion: Rect, visibleRect: Rect) {
  //                                                                                refactoring
  return elFuturePos.left < visibleRect.left || elFuturePos.left + elRegion.width > (visibleRect?.right || 0)
}

function isFailY(elFuturePos: Position, elRegion: Rect, visibleRect: Rect) {
  //                                                                                refactoring
  return elFuturePos.top < visibleRect.top || elFuturePos.top + elRegion.height > (visibleRect?.bottom || 0)
}

function isCompleteFailX(elFuturePos: Position, elRegion: Rect, visibleRect: Rect) {
  //                               refactoring
  return elFuturePos.left > (visibleRect.right || 0) || elFuturePos.left + elRegion.width < visibleRect.left
}

function isCompleteFailY(elFuturePos: Position, elRegion: Rect, visibleRect: Rect) {
  //                               refactoring
  return elFuturePos.top > (visibleRect?.bottom || 0) || elFuturePos.top + elRegion.height < visibleRect.top
}

/**
 * @param el
 * @param tgtRegion 参照节点所占的区域: { left, top, width, height }
 * @param align
 */
function doAlign(el: HTMLElement, tgtRegion: Rect, align: Config, isTgtRegionVisible: boolean) {
  let points = align.points
  let offset = align.offset || [0, 0]
  let targetOffset = align.targetOffset || [0, 0]
  let overflow = align.overflow
  const source = align.source || el
  offset = [...offset]
  targetOffset = [...targetOffset]
  overflow = overflow || {}
  const newOverflowCfg: Partial<Config['overflow']> = {}
  let fail = 0
  const alwaysByViewport = !!(overflow && overflow.alwaysByViewport)
  // 当前节点可以被放置的显示区域
  const visibleRect = getVisibleRectForElement(source, alwaysByViewport)
  // 当前节点所占的区域, left/top/width/height
  const elRegion = getRegion(source)
  // 将 offset 转换成数值，支持百分比
  normalizeOffset(offset, elRegion)
  normalizeOffset(targetOffset, tgtRegion)
  assertNormalizedOffset(offset)
  assertNormalizedOffset(targetOffset)
  // 当前节点将要被放置的位置
  let elFuturePos = getAbsolutePosition(elRegion, tgtRegion, points, offset, targetOffset)
  // 当前节点将要所处的区域
  let newElRegion = { ...elRegion, ...elFuturePos }

  // 如果可视区域不能完全放置当前节点时允许调整
  if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTgtRegionVisible) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect as any)) {
        // 对齐位置反下
        const newPoints = flipPoints(points, /[lr]/gi, {
          l: 'r',
          r: 'l',
        })
        // 偏移量也反下
        const newOffset = flipOffset(offset, 0)
        const newTargetOffset = flipOffset(targetOffset, 0)
        const newElFuturePos = getAbsolutePosition(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset)

        if (!isCompleteFailX(newElFuturePos, elRegion, visibleRect as any)) {
          fail = 1
          points = newPoints
          offset = newOffset
          targetOffset = newTargetOffset
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect as any)) {
        // 对齐位置反下
        const newPoints = flipPoints(points, /[tb]/gi, {
          t: 'b',
          b: 't',
        })
        // 偏移量也反下
        assertNormalizedOffset(offset)
        assertNormalizedOffset(targetOffset)
        const newOffset = flipOffset(offset, 1)
        const newTargetOffset = flipOffset(targetOffset, 1)
        const newElFuturePos = getAbsolutePosition(elRegion, tgtRegion, newPoints, newOffset, newTargetOffset)

        if (!isCompleteFailY(newElFuturePos, elRegion, visibleRect as any)) {
          fail = 1
          points = newPoints
          offset = newOffset
          targetOffset = newTargetOffset
        }
      }
    }

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      assertNormalizedOffset(offset)
      assertNormalizedOffset(targetOffset)
      elFuturePos = getAbsolutePosition(elRegion, tgtRegion, points, offset, targetOffset)
      newElRegion = { ...newElRegion, ...elFuturePos }
    }
    const isStillFailX = isFailX(elFuturePos, elRegion, visibleRect as any)
    const isStillFailY = isFailY(elFuturePos, elRegion, visibleRect as any)
    // 检查反下后的位置是否可以放下了，如果仍然放不下：
    // 1. 复原修改过的定位参数
    if (isStillFailX || isStillFailY) {
      let newPoints = points

      // 重置对应部分的翻转逻辑
      if (isStillFailX) {
        newPoints = flipPoints(points, /[lr]/gi, {
          l: 'r',
          r: 'l',
        })
      }
      if (isStillFailY) {
        newPoints = flipPoints(points, /[tb]/gi, {
          t: 'b',
          b: 't',
        })
      }

      points = newPoints

      offset = align.offset || [0, 0]
      targetOffset = align.targetOffset || [0, 0]
    }
    // 2. 只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX && isStillFailX
    newOverflowCfg.adjustY = overflow.adjustY && isStillFailY

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(elFuturePos as any, elRegion, visibleRect as any, newOverflowCfg)
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    setStyle(source, 'width', getWH(source, 'width', CONTENT_INDEX) + newElRegion.width - elRegion.width)
  }

  if (newElRegion.height !== elRegion.height) {
    setStyle(source, 'height', getWH(source, 'height', CONTENT_INDEX) + newElRegion.height - elRegion.height)
  }

  // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  setOffset(
    source,
    {
      left: newElRegion.left,
      top: newElRegion.top,
    },
    {
      useCssRight: align.useCssRight,
      useCssBottom: align.useCssBottom,
      useCssTransform: align.useCssTransform,
      ignoreShake: align.ignoreShake,
    },
  )

  return {
    points,
    offset,
    targetOffset,
    overflow: newOverflowCfg,
  }
}

export default doAlign
/**
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **/

// Private

// @ts-ignore
function assertNormalizedOffset(input: unknown): asserts input is NormalizedOffset {
  //
}
