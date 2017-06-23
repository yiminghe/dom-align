/**
 * align dom node flexibly
 * @author yiminghe@gmail.com
 */

import utils from './utils';
import getOffsetParent from './getOffsetParent';
import getVisibleRectForElement from './getVisibleRectForElement';
import adjustForViewport from './adjustForViewport';
import getRegion from './getRegion';
import getElFuturePos from './getElFuturePos';
import getAlignOffset from './getAlignOffset';

// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left < visibleRect.left ||
    elFuturePos.left + elRegion.width > visibleRect.right;
}

function isFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top < visibleRect.top ||
    elFuturePos.top + elRegion.height > visibleRect.bottom;
}

function isCompleteFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left > visibleRect.right ||
    elFuturePos.left + elRegion.width < visibleRect.left;
}

function isCompleteFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top > visibleRect.bottom ||
    elFuturePos.top + elRegion.height < visibleRect.top;
}

function isOutOfVisibleRect(target) {
  const visibleRect = getVisibleRectForElement(target);
  const targetRegion = getRegion(target);

  return !visibleRect ||
    (targetRegion.left + targetRegion.width) <= visibleRect.left ||
    (targetRegion.top + targetRegion.height) <= visibleRect.top ||
    targetRegion.left >= visibleRect.right ||
    targetRegion.top >= visibleRect.bottom;
}

function flip(points, reg, map) {
  const ret = [];
  utils.each(points, (p) => {
    ret.push(p.replace(reg, (m) => {
      return map[m];
    }));
  });
  return ret;
}

function flipOffset(offset, index) {
  offset[index] = -offset[index];
  return offset;
}

function convertOffset(str, offsetLen) {
  let n;
  if (/%$/.test(str)) {
    n = parseInt(str.substring(0, str.length - 1), 10) / 100 * offsetLen;
  } else {
    n = parseInt(str, 10);
  }
  return n || 0;
}

function ySize(region) {
  return region.bottom - region.top;
}

function xSize(region) {
  return region.right - region.left;
}

function normalizeOffset(offset, el) {
  offset[0] = convertOffset(offset[0], el.width);
  offset[1] = convertOffset(offset[1], el.height);
}

// If page is not scrollable, then use VisibleRect of browser edge
function fixVisibleRect(region, visibleRect, sourceNode) {
  if (typeof document === 'undefined') {
    return region;
  }
  let offsetParent = getOffsetParent(sourceNode);
  if (offsetParent === document.body) {
    offsetParent = document.documentElement;
  }
  const scrollTop = offsetParent.scrollTop;
  const scrollLeft = offsetParent.scrollLeft;
  const scrollWidth = offsetParent.scrollWidth;
  const scrollHeight = offsetParent.scrollHeight;
  const windowWidth = offsetParent.clientWidth;
  const windowHeight = offsetParent.clientHeight;
  const newRegion = { ...region };

  // 不可向上滚动
  if (scrollTop === 0) {
    newRegion.top = visibleRect.top;
  }
  // 不可向下滚动
  if (scrollTop + windowHeight === scrollHeight) {
    newRegion.bottom = visibleRect.bottom;
  }
  // 不可向左滚动
  if (scrollLeft === 0) {
    newRegion.left = visibleRect.left;
  }
  // 不可向右滚动
  if (scrollLeft + windowWidth === scrollWidth) {
    newRegion.right = visibleRect.right;
  }
  return newRegion;
}

function domAlign(el, refNode, align) {
  let points = align.points;
  let offset = align.offset || [0, 0];
  let targetOffset = align.targetOffset || [0, 0];
  let overflow = align.overflow;
  const target = align.target || refNode;
  const source = align.source || el;
  offset = [].concat(offset);
  targetOffset = [].concat(targetOffset);
  overflow = overflow || {};
  const newOverflowCfg = {};
  let fail = 0;
  // 当前节点可以被放置的显示区域
  const visibleRect = getVisibleRectForElement(source);
  // 当前节点所占的区域, left/top/width/height
  const elRegion = getRegion(source);
  // 参照节点所占的区域, left/top/width/height
  const refNodeRegion = getRegion(target);
  // 将 offset 转换成数值，支持百分比
  normalizeOffset(offset, elRegion);
  normalizeOffset(targetOffset, refNodeRegion);
  // 当前节点将要被放置的位置
  let elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset);
  // 当前节点将要所处的区域
  let newElRegion = utils.merge(elRegion, elFuturePos);

  const isTargetNotOutOfVisible = !isOutOfVisibleRect(target);
  const refNodeOffset = utils.merge(refNodeRegion, getAlignOffset(refNodeRegion, points[1]));

  let Xregion;
  let YRegion;
  const xRefPoint = points[0].charAt(1);
  // TODO if visibleRect.xx < refNodeOffset.left ??
  if (xRefPoint === 'c') {
    Xregion = utils.merge(visibleRect, {
      left: refNodeOffset.left - elRegion.width / 2,
    });
  } else {
    Xregion = utils.merge(visibleRect, {
      [xRefPoint === 'l' ? 'left' : 'right']: refNodeOffset.left + offset[0],
    });
  }

  const yRefPoint = points[0].charAt(0);
  if (yRefPoint === 'c') {
    YRegion = utils.merge(visibleRect, {
      top: refNodeOffset.top - elRegion.height / 2,
    });
  } else {
    YRegion = utils.merge(visibleRect, {
      [yRefPoint === 't' ? 'top' : 'bottom']: refNodeOffset.top + offset[1],
    });
  }

  let realXRegion = Xregion;
  let realYRegion = YRegion;
  // 如果可视区域不能完全放置当前节点时允许调整
  if (visibleRect && (overflow.adjustX || overflow.adjustY) && isTargetNotOutOfVisible) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[lr]/ig, {
          l: 'r',
          r: 'l',
        });
        // 偏移量也反下
        const newOffset = flipOffset(offset, 0);
        const newTargetOffset = flipOffset(targetOffset, 0);
        const newElFuturePos = getElFuturePos(elRegion, refNodeRegion,
          newPoints, newOffset, newTargetOffset);

        let XregionReversal;
        if (newPoints[0].charAt(1) === 'c') {
          XregionReversal = utils.merge(visibleRect, {
            left: refNodeOffset.left - elRegion.width / 2,
          });
        } else {
          XregionReversal = utils.merge(visibleRect, {
            [newPoints[0].charAt(1) === 'l' ?
              'left' : 'right']: getAlignOffset(refNodeRegion, newPoints[1]).left,
          });
        }

        const canXFlip = xSize(XregionReversal) > xSize(Xregion);
        if (canXFlip && !isCompleteFailX(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
          realXRegion = XregionReversal;
        }
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        // 对齐位置反下
        const newPoints = flip(points, /[tb]/ig, {
          t: 'b',
          b: 't',
        });
        // 偏移量也反下
        const newOffset = flipOffset(offset, 1);
        const newTargetOffset = flipOffset(targetOffset, 1);
        const newElFuturePos = getElFuturePos(elRegion, refNodeRegion,
          newPoints, newOffset, newTargetOffset);

        let YRegionReversal;
        if (newPoints[0].charAt(0) === 'c') {
          YRegionReversal = utils.merge(visibleRect, {
            top: refNodeOffset.top - elRegion.height / 2,
          });
        } else {
          YRegionReversal = utils.merge(visibleRect, {
            [newPoints[0].charAt(0) === 't' ?
              'top' : 'bottom']: getAlignOffset(refNodeRegion, newPoints[1]).top,
          });
        }

        const canYFlip = ySize(YRegionReversal) > ySize(YRegion);

        if (canYFlip && !isCompleteFailY(newElFuturePos, elRegion, visibleRect)) {
          fail = 1;
          points = newPoints;
          offset = newOffset;
          targetOffset = newTargetOffset;
          realYRegion = YRegionReversal;
        }
      }
    }

    // 根据是否能滚动修正可视区域
    realXRegion = fixVisibleRect(realXRegion, visibleRect, source);
    realYRegion = fixVisibleRect(realYRegion, visibleRect, source);

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset);
      utils.mix(newElRegion, elFuturePos);
    }

    newOverflowCfg.resizeHeight = overflow.resizeHeight;
    newOverflowCfg.resizeWidth = overflow.resizeWidth;
    // 检查反下后的位置是否可以放下了
    // 如果仍然放不下只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX &&
      isFailX(elFuturePos, elRegion, realXRegion);

    newOverflowCfg.adjustY = overflow.adjustY &&
      isFailY(elFuturePos, elRegion, realYRegion);

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(elFuturePos, elRegion,
        realXRegion, realYRegion, newOverflowCfg);
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    utils.css(source, 'width', utils.width(source) + newElRegion.width - elRegion.width);
  }

  if (newElRegion.height !== elRegion.height) {
    utils.css(source, 'height', utils.height(source) + newElRegion.height - elRegion.height);
  }

  // https://github.com/kissyteam/kissy/issues/190
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  utils.offset(source, {
    left: newElRegion.left,
    top: newElRegion.top,
  }, {
    useCssRight: align.useCssRight,
    useCssBottom: align.useCssBottom,
    useCssTransform: align.useCssTransform,
  });

  return {
    points,
    offset,
    targetOffset,
    overflow: newOverflowCfg,
  };
}

domAlign.__getOffsetParent = getOffsetParent;

domAlign.__getVisibleRectForElement = getVisibleRectForElement;

export default domAlign;
/**
 *  2012-04-26 yiminghe@gmail.com
 *   - 优化智能对齐算法
 *   - 慎用 resizeXX
 *
 *  2011-07-13 yiminghe@gmail.com note:
 *   - 增加智能对齐，以及大小调整选项
 **/
