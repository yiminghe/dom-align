import * as getViewportSize from './get-viewport-size';

function getDocumentSize(refWin: Window, name: 'Width' | 'Height') {
  const d = refWin.document;
  return Math.max(
    // firefox chrome documentElement.scrollHeight< body.scrollHeight
    // ie standard mode : documentElement.scrollHeight> body.scrollHeight
    d.documentElement[`scroll${name}`],
    // quirks : documentElement.scrollHeight 最大等于可视窗口多一点？
    d.body[`scroll${name}`],
    // 🔴 Why document??? 🔴
    getViewportSize[`getViewport${name}`](d as any),
  );
}

export function getDocumentWidth(win: Window) {
  return getDocumentSize(win, 'Width');
}

export function getDocumentHeight(win: Window) {
  return getDocumentSize(win, 'Height');
}
