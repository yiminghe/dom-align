import {
  setTransitionProperty,
  getTransitionProperty,
  getTransformXY,
  setTransformXY,
  getTransformName,
} from './propertyUtils';

const RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;

let getComputedStyleX;

// https://stackoverflow.com/a/3485654/3040605
function forceRelayout(elem) {
  const originalStyle = elem.style.display;
  elem.style.display = 'none';
  elem.offsetHeight; // eslint-disable-line
  elem.style.display = originalStyle;
}

function css(el, name, v) {
  let value = v;
  if (typeof name === 'object') {
    for (const i in name) {
      if (name.hasOwnProperty(i)) {
        css(el, i, name[i]);
      }
    }
    return undefined;
  }
  if (typeof value !== 'undefined') {
    if (typeof value === 'number') {
      value = `${value}px`;
    }
    el.style[name] = value;
    return undefined;
  }
  return getComputedStyleX(el, name);
}

function getClientPosition(elem) {
  let box;
  let x;
  let y;
  const doc = elem.ownerDocument;
  const body = doc.body;
  const docElem = doc && doc.documentElement;
  // 根据 GBS 最新数据，A-Grade Browsers 都已支持 getBoundingClientRect 方法，不用再考虑传统的实现方式
  box = elem.getBoundingClientRect();

  // 注：jQuery 还考虑减去 docElem.clientLeft/clientTop
  // 但测试发现，这样反而会导致当 html 和 body 有边距/边框样式时，获取的值不正确
  // 此外，ie6 会忽略 html 的 margin 值，幸运地是没有谁会去设置 html 的 margin

  x = box.left;
  y = box.top;

  // In IE, most of the time, 2 extra pixels are added to the top and left
  // due to the implicit 2-pixel inset border.  In IE6/7 quirks mode and
  // IE6 standards mode, this border can be overridden by setting the
  // document element's border to zero -- thus, we cannot rely on the
  // offset always being 2 pixels.

  // In quirks mode, the offset can be determined by querying the body's
  // clientLeft/clientTop, but in standards mode, it is found by querying
  // the document element's clientLeft/clientTop.  Since we already called
  // getClientBoundingRect we have already forced a reflow, so it is not
  // too expensive just to query them all.

  // ie 下应该减去窗口的边框吧，毕竟默认 absolute 都是相对窗口定位的
  // 窗口边框标准是设 documentElement ,quirks 时设置 body
  // 最好禁止在 body 和 html 上边框 ，但 ie < 9 html 默认有 2px ，减去
  // 但是非 ie 不可能设置窗口边框，body html 也不是窗口 ,ie 可以通过 html,body 设置
  // 标准 ie 下 docElem.clientTop 就是 border-top
  // ie7 html 即窗口边框改变不了。永远为 2
  // 但标准 firefox/chrome/ie9 下 docElem.clientTop 是窗口边框，即使设了 border-top 也为 0

  x -= docElem.clientLeft || body.clientLeft || 0;
  y -= docElem.clientTop || body.clientTop || 0;

  return {
    left: x,
    top: y,
  };
}

function getScroll(w, top) {
  let ret = w[`page${top ? 'Y' : 'X'}Offset`];
  const method = `scroll${top ? 'Top' : 'Left'}`;
  if (typeof ret !== 'number') {
    const d = w.document;
    // ie6,7,8 standard mode
    ret = d.documentElement[method];
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method];
    }
  }
  return ret;
}

function getScrollLeft(w) {
  return getScroll(w);
}

function getScrollTop(w) {
  return getScroll(w, true);
}

function getOffset(el) {
  const pos = getClientPosition(el);
  const doc = el.ownerDocument;
  const w = doc.defaultView || doc.parentWindow;
  pos.left += getScrollLeft(w);
  pos.top += getScrollTop(w);
  return pos;
}

/**
 * A crude way of determining if an object is a window
 * @member util
 */
function isWindow(obj) {
  // must use == for ie8
  /* eslint eqeqeq:0 */
  return obj !== null && obj !== undefined && obj == obj.window;
}

function getDocument(node) {
  if (isWindow(node)) {
    return node.document;
  }
  if (node.nodeType === 9) {
    return node;
  }
  return node.ownerDocument;
}

function _getComputedStyle(elem, name, cs) {
  let computedStyle = cs;
  let val = '';
  const d = getDocument(elem);
  computedStyle = computedStyle || d.defaultView.getComputedStyle(elem, null);

  // https://github.com/kissyteam/kissy/issues/61
  if (computedStyle) {
    val = computedStyle.getPropertyValue(name) || computedStyle[name];
  }

  return val;
}

const _RE_NUM_NO_PX = new RegExp(`^(${RE_NUM})(?!px)[a-z%]+$`, 'i');
const RE_POS = /^(top|right|bottom|left)$/;
const CURRENT_STYLE = 'currentStyle';
const RUNTIME_STYLE = 'runtimeStyle';
const LEFT = 'left';
const PX = 'px';

function _getComputedStyleIE(elem, name) {
  // currentStyle maybe null
  // http://msdn.microsoft.com/en-us/library/ms535231.aspx
  let ret = elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name];

  // 当 width/height 设置为百分比时，通过 pixelLeft 方式转换的 width/height 值
  // 一开始就处理了! CUSTOM_STYLE.height,CUSTOM_STYLE.width ,cssHook 解决@2011-08-19
  // 在 ie 下不对，需要直接用 offset 方式
  // borderWidth 等值也有问题，但考虑到 borderWidth 设为百分比的概率很小，这里就不考虑了

  // From the awesome hack by Dean Edwards
  // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
  // If we're not dealing with a regular pixel number
  // but a number that has a weird ending, we need to convert it to pixels
  // exclude left right for relativity
  if (_RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)) {
    // Remember the original values
    const style = elem.style;
    const left = style[LEFT];
    const rsLeft = elem[RUNTIME_STYLE][LEFT];

    // prevent flashing of content
    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];

    // Put in the new values to get a computed value out
    style[LEFT] = name === 'fontSize' ? '1em' : ret || 0;
    ret = style.pixelLeft + PX;

    // Revert the changed values
    style[LEFT] = left;

    elem[RUNTIME_STYLE][LEFT] = rsLeft;
  }
  return ret === '' ? 'auto' : ret;
}

if (typeof window !== 'undefined') {
  getComputedStyleX = window.getComputedStyle
    ? _getComputedStyle
    : _getComputedStyleIE;
}

function getOffsetDirection(dir, option) {
  if (dir === 'left') {
    return option.useCssRight ? 'right' : dir;
  }
  return option.useCssBottom ? 'bottom' : dir;
}

function oppositeOffsetDirection(dir) {
  if (dir === 'left') {
    return 'right';
  } else if (dir === 'right') {
    return 'left';
  } else if (dir === 'top') {
    return 'bottom';
  } else if (dir === 'bottom') {
    return 'top';
  }
}

// 设置 elem 相对 elem.ownerDocument 的坐标
function setLeftTop(elem, offset, option) {
  // set position first, in-case top/left are set even on static elem
  if (css(elem, 'position') === 'static') {
    elem.style.position = 'relative';
  }
  let presetH = -999;
  let presetV = -999;
  const horizontalProperty = getOffsetDirection('left', option);
  const verticalProperty = getOffsetDirection('top', option);
  const oppositeHorizontalProperty = oppositeOffsetDirection(
    horizontalProperty,
  );
  const oppositeVerticalProperty = oppositeOffsetDirection(verticalProperty);

  if (horizontalProperty !== 'left') {
    presetH = 999;
  }

  if (verticalProperty !== 'top') {
    presetV = 999;
  }
  let originalTransition = '';
  const originalOffset = getOffset(elem);
  if ('left' in offset || 'top' in offset) {
    originalTransition = getTransitionProperty(elem) || '';
    setTransitionProperty(elem, 'none');
  }
  if ('left' in offset) {
    elem.style[oppositeHorizontalProperty] = '';
    elem.style[horizontalProperty] = `${presetH}px`;
  }
  if ('top' in offset) {
    elem.style[oppositeVerticalProperty] = '';
    elem.style[verticalProperty] = `${presetV}px`;
  }
  // force relayout
  forceRelayout(elem);
  const old = getOffset(elem);
  const originalStyle = {};
  for (const key in offset) {
    if (offset.hasOwnProperty(key)) {
      const dir = getOffsetDirection(key, option);
      const preset = key === 'left' ? presetH : presetV;
      const off = originalOffset[key] - old[key];
      if (dir === key) {
        originalStyle[dir] = preset + off;
      } else {
        originalStyle[dir] = preset - off;
      }
    }
  }
  css(elem, originalStyle);
  // force relayout
  forceRelayout(elem);
  if ('left' in offset || 'top' in offset) {
    setTransitionProperty(elem, originalTransition);
  }
  const ret = {};
  for (const key in offset) {
    if (offset.hasOwnProperty(key)) {
      const dir = getOffsetDirection(key, option);
      const off = offset[key] - originalOffset[key];
      if (key === dir) {
        ret[dir] = originalStyle[dir] + off;
      } else {
        ret[dir] = originalStyle[dir] - off;
      }
    }
  }
  css(elem, ret);
}

function setTransform(elem, offset) {
  const originalOffset = getOffset(elem);
  const originalXY = getTransformXY(elem);
  const resultXY = { x: originalXY.x, y: originalXY.y };
  if ('left' in offset) {
    resultXY.x = originalXY.x + offset.left - originalOffset.left;
  }
  if ('top' in offset) {
    resultXY.y = originalXY.y + offset.top - originalOffset.top;
  }
  setTransformXY(elem, resultXY);
}

function setOffset(elem, offset, option) {
  if (option.ignoreShake) {
    const oriOffset = getOffset(elem);

    const oLeft = oriOffset.left.toFixed(0);
    const oTop = oriOffset.top.toFixed(0);
    const tLeft = offset.left.toFixed(0);
    const tTop = offset.top.toFixed(0);

    if (oLeft === tLeft && oTop === tTop) {
      return;
    }
  }

  if (option.useCssRight || option.useCssBottom) {
    setLeftTop(elem, offset, option);
  } else if (
    option.useCssTransform &&
    getTransformName() in document.body.style
  ) {
    setTransform(elem, offset, option);
  } else {
    setLeftTop(elem, offset, option);
  }
}

function each(arr, fn) {
  for (let i = 0; i < arr.length; i++) {
    fn(arr[i]);
  }
}

function isBorderBoxFn(elem) {
  return getComputedStyleX(elem, 'boxSizing') === 'border-box';
}

const BOX_MODELS = ['margin', 'border', 'padding'];
const CONTENT_INDEX = -1;
const PADDING_INDEX = 2;
const BORDER_INDEX = 1;
const MARGIN_INDEX = 0;

function swap(elem, options, callback) {
  const old = {};
  const style = elem.style;
  let name;

  // Remember the old values, and insert the new ones
  for (name in options) {
    if (options.hasOwnProperty(name)) {
      old[name] = style[name];
      style[name] = options[name];
    }
  }

  callback.call(elem);

  // Revert the old values
  for (name in options) {
    if (options.hasOwnProperty(name)) {
      style[name] = old[name];
    }
  }
}

function getPBMWidth(elem, props, which) {
  let value = 0;
  let prop;
  let j;
  let i;
  for (j = 0; j < props.length; j++) {
    prop = props[j];
    if (prop) {
      for (i = 0; i < which.length; i++) {
        let cssProp;
        if (prop === 'border') {
          cssProp = `${prop}${which[i]}Width`;
        } else {
          cssProp = prop + which[i];
        }
        value += parseFloat(getComputedStyleX(elem, cssProp)) || 0;
      }
    }
  }
  return value;
}

const domUtils = {
  getParent(element) {
    let parent = element;
    do {
      if (parent.nodeType === 11 && parent.host) {
        parent = parent.host;
      } else {
        parent = parent.parentNode;
      }
    } while (parent && parent.nodeType !== 1 && parent.nodeType !== 9);
    return parent;
  },
};

each(['Width', 'Height'], name => {
  domUtils[`doc${name}`] = refWin => {
    const d = refWin.document;
    return Math.max(
      // firefox chrome documentElement.scrollHeight< body.scrollHeight
      // ie standard mode : documentElement.scrollHeight> body.scrollHeight
      d.documentElement[`scroll${name}`],
      // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
      d.body[`scroll${name}`],
      domUtils[`viewport${name}`](d),
    );
  };

  domUtils[`viewport${name}`] = win => {
    // pc browser includes scrollbar in window.innerWidth
    const prop = `client${name}`;
    const doc = win.document;
    const body = doc.body;
    const documentElement = doc.documentElement;
    const documentElementProp = documentElement[prop];
    // 标准模式取 documentElement
    // backcompat 取 body
    return (
      (doc.compatMode === 'CSS1Compat' && documentElementProp) ||
      (body && body[prop]) ||
      documentElementProp
    );
  };
});

/*
 得到元素的大小信息
 @param elem
 @param name
 @param {String} [extra]  'padding' : (css width) + padding
 'border' : (css width) + padding + border
 'margin' : (css width) + padding + border + margin
 */
function getWH(elem, name, ex) {
  let extra = ex;
  if (isWindow(elem)) {
    return name === 'width'
      ? domUtils.viewportWidth(elem)
      : domUtils.viewportHeight(elem);
  } else if (elem.nodeType === 9) {
    return name === 'width'
      ? domUtils.docWidth(elem)
      : domUtils.docHeight(elem);
  }
  const which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
  let borderBoxValue =
    name === 'width'
      ? elem.getBoundingClientRect().width
      : elem.getBoundingClientRect().height;
  const computedStyle = getComputedStyleX(elem);
  const isBorderBox = isBorderBoxFn(elem, computedStyle);
  let cssBoxValue = 0;
  if (
    borderBoxValue === null ||
    borderBoxValue === undefined ||
    borderBoxValue <= 0
  ) {
    borderBoxValue = undefined;
    // Fall back to computed then un computed css if necessary
    cssBoxValue = getComputedStyleX(elem, name);
    if (
      cssBoxValue === null ||
      cssBoxValue === undefined ||
      Number(cssBoxValue) < 0
    ) {
      cssBoxValue = elem.style[name] || 0;
    }
    // Normalize '', auto, and prepare for extra
    cssBoxValue = parseFloat(cssBoxValue) || 0;
  }
  if (extra === undefined) {
    extra = isBorderBox ? BORDER_INDEX : CONTENT_INDEX;
  }
  const borderBoxValueOrIsBorderBox =
    borderBoxValue !== undefined || isBorderBox;
  const val = borderBoxValue || cssBoxValue;
  if (extra === CONTENT_INDEX) {
    if (borderBoxValueOrIsBorderBox) {
      return (
        val - getPBMWidth(elem, ['border', 'padding'], which, computedStyle)
      );
    }
    return cssBoxValue;
  } else if (borderBoxValueOrIsBorderBox) {
    if (extra === BORDER_INDEX) {
      return val;
    }
    return (
      val +
      (extra === PADDING_INDEX
        ? -getPBMWidth(elem, ['border'], which, computedStyle)
        : getPBMWidth(elem, ['margin'], which, computedStyle))
    );
  }
  return (
    cssBoxValue +
    getPBMWidth(elem, BOX_MODELS.slice(extra), which, computedStyle)
  );
}

const cssShow = {
  position: 'absolute',
  visibility: 'hidden',
  display: 'block',
};

// fix #119 : https://github.com/kissyteam/kissy/issues/119
function getWHIgnoreDisplay(...args) {
  let val;
  const elem = args[0];
  // in case elem is window
  // elem.offsetWidth === undefined
  if (elem.offsetWidth !== 0) {
    val = getWH.apply(undefined, args);
  } else {
    swap(elem, cssShow, () => {
      val = getWH.apply(undefined, args);
    });
  }
  return val;
}

each(['width', 'height'], name => {
  const first = name.charAt(0).toUpperCase() + name.slice(1);
  domUtils[`outer${first}`] = (el, includeMargin) => {
    return (
      el &&
      getWHIgnoreDisplay(el, name, includeMargin ? MARGIN_INDEX : BORDER_INDEX)
    );
  };
  const which = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

  domUtils[name] = (elem, v) => {
    let val = v;
    if (val !== undefined) {
      if (elem) {
        const computedStyle = getComputedStyleX(elem);
        const isBorderBox = isBorderBoxFn(elem);
        if (isBorderBox) {
          val += getPBMWidth(elem, ['padding', 'border'], which, computedStyle);
        }
        return css(elem, name, val);
      }
      return undefined;
    }
    return elem && getWHIgnoreDisplay(elem, name, CONTENT_INDEX);
  };
});

function mix(to, from) {
  for (const i in from) {
    if (from.hasOwnProperty(i)) {
      to[i] = from[i];
    }
  }
  return to;
}

const utils = {
  getWindow(node) {
    if (node && node.document && node.setTimeout) {
      return node;
    }
    const doc = node.ownerDocument || node;
    return doc.defaultView || doc.parentWindow;
  },
  getDocument,
  offset(el, value, option) {
    if (typeof value !== 'undefined') {
      setOffset(el, value, option || {});
    } else {
      return getOffset(el);
    }
  },
  isWindow,
  each,
  css,
  clone(obj) {
    let i;
    const ret = {};
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret[i] = obj[i];
      }
    }
    const overflow = obj.overflow;
    if (overflow) {
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          ret.overflow[i] = obj.overflow[i];
        }
      }
    }
    return ret;
  },
  mix,
  getWindowScrollLeft(w) {
    return getScrollLeft(w);
  },
  getWindowScrollTop(w) {
    return getScrollTop(w);
  },
  merge(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      utils.mix(ret, args[i]);
    }
    return ret;
  },
  viewportWidth: 0,
  viewportHeight: 0,
};

mix(utils, domUtils);

export default utils;
