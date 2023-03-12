function getViewportSize(win: Window, name: 'Width' | 'Height'): number {
  // pc browser includes scrollbar in window.innerWidth
  const prop = `client${name}`;
  const doc = win.document;
  const body = doc.body;
  const documentElement = doc.documentElement;
  const documentElementProp = (documentElement as any)[prop] as number;
  // 标准模式取 documentElement
  // backcompat 取 body
  return (
    (doc.compatMode === 'CSS1Compat' && documentElementProp) ||
    (body && (body as any)[prop]) ||
    documentElementProp
  );
}

export function getViewportWidth(win: Window): number {
  return getViewportSize(win, 'Width');
}

export function getViewportHeight(win: Window): number {
  return getViewportSize(win, 'Height');
}
