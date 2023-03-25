import { getDocument } from './get-document';

let getStyle: (el: Element, name: string) => string;

const RE_NUM = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
const _RE_NUM_NO_PX = new RegExp(`^(${RE_NUM})(?!px)[a-z%]+$`, 'i');
const RE_POS = /^(top|right|bottom|left)$/;
const CURRENT_STYLE = 'currentStyle';
const RUNTIME_STYLE = 'runtimeStyle';
const LEFT = 'left';
const PX = 'px';

function _getStyleIE(elem: any, name: string) {
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

function _getStyle(elem: HTMLElement, name: string) {
  const d = getDocument(elem);

  let computedStyle = d.defaultView?.getComputedStyle(elem, null);
  const value =
    computedStyle?.getPropertyValue(name) ||
    (computedStyle as Record<string, any>)[name];

  return computedStyle ? value : '';
}

if (typeof window !== 'undefined') {
  // @ts-ignore This condition will always return true since this function is always defined. Did you mean to call it instead?
  getStyle = window.getComputedStyle ? _getStyle : _getStyleIE;
}

export { getStyle };
