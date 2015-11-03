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

// http://yiminghe.iteye.com/blog/1124720

function isFailX(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.left < visibleRect.left ||
    elFuturePos.left + elRegion.width > visibleRect.right;
}

function isFailY(elFuturePos, elRegion, visibleRect) {
  return elFuturePos.top < visibleRect.top ||
    elFuturePos.top + elRegion.height > visibleRect.bottom;
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

function normalizeOffset(offset, el) {
  offset[0] = convertOffset(offset[0], el.width);
  offset[1] = convertOffset(offset[1], el.height);
}

/*
 * align node
 * @param {Element} node current dom node
 * @param {Object} align align config
 *
 *    @example
 *    {
 *      node: null,         // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
 *      points: ['cc','cc'], // ['tr', 'tl'] 表示 overlay 的 tr 与参考节点的 tl 对齐
 *      offset: [0, 0]      // 有效值为 [n, m]
 *    }
 */
function domAlign(el, refNode, align) {
  let points = align.points;
  let offset = align.offset || [0, 0];
  let targetOffset = align.targetOffset || [0, 0];
  let overflow = align.overflow;
  offset = [].concat(offset);
  targetOffset = [].concat(targetOffset);
  overflow = overflow || {};
  const newOverflowCfg = {};

  let fail = 0;
  // 当前节点可以被放置的显示区域
  const visibleRect = getVisibleRectForElement(el);
  // 当前节点所占的区域, left/top/width/height
  const elRegion = getRegion(el);
  // 参照节点所占的区域, left/top/width/height
  const refNodeRegion = getRegion(refNode);
  // 将 offset 转换成数值，支持百分比
  normalizeOffset(offset, elRegion);
  normalizeOffset(targetOffset, refNodeRegion);
  // 当前节点将要被放置的位置
  let elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset);
  // 当前节点将要所处的区域
  let newElRegion = utils.merge(elRegion, elFuturePos);

  // 如果可视区域不能完全放置当前节点时允许调整
  if (visibleRect && (overflow.adjustX || overflow.adjustY)) {
    if (overflow.adjustX) {
      // 如果横向不能放下
      if (isFailX(elFuturePos, elRegion, visibleRect)) {
        fail = 1;
        // 对齐位置反下
        points = flip(points, /[lr]/ig, {
          l: 'r',
          r: 'l',
        });
        // 偏移量也反下
        offset = flipOffset(offset, 0);
        targetOffset = flipOffset(targetOffset, 0);
      }
    }

    if (overflow.adjustY) {
      // 如果纵向不能放下
      if (isFailY(elFuturePos, elRegion, visibleRect)) {
        fail = 1;
        // 对齐位置反下
        points = flip(points, /[tb]/ig, {
          t: 'b',
          b: 't',
        });
        // 偏移量也反下
        offset = flipOffset(offset, 1);
        targetOffset = flipOffset(targetOffset, 1);
      }
    }

    // 如果失败，重新计算当前节点将要被放置的位置
    if (fail) {
      elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset, targetOffset);
      utils.mix(newElRegion, elFuturePos);
    }

    // 检查反下后的位置是否可以放下了
    // 如果仍然放不下只有指定了可以调整当前方向才调整
    newOverflowCfg.adjustX = overflow.adjustX &&
      isFailX(elFuturePos, elRegion, visibleRect);

    newOverflowCfg.adjustY = overflow.adjustY &&
      isFailY(elFuturePos, elRegion, visibleRect);

    // 确实要调整，甚至可能会调整高度宽度
    if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
      newElRegion = adjustForViewport(elFuturePos, elRegion,
        visibleRect, newOverflowCfg);
    }
  }

  // need judge to in case set fixed with in css on height auto element
  if (newElRegion.width !== elRegion.width) {
    utils.css(el, 'width', el.width() + newElRegion.width - elRegion.width);
  }

  if (newElRegion.height !== elRegion.height) {
    utils.css(el, 'height', el.height() + newElRegion.height - elRegion.height);
  }

  // https://github.com/kissyteam/kissy/issues/190
  // http://localhost:8888/kissy/src/overlay/demo/other/relative_align/align.html
  // 相对于屏幕位置没变，而 left/top 变了
  // 例如 <div 'relative'><el absolute></div>
  utils.offset(el, {
    left: newElRegion.left,
    top: newElRegion.top,
  }, {
    useCssRight: align.useCssRight,
    useCssBottom: align.useCssBottom,
  });

  return {
    points: points,
    offset: offset,
    targetOffset: targetOffset,
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
