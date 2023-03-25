function getScroll(windw: Window, isTop: boolean): number {
  let ret = windw[`page${isTop ? 'Y' : 'X'}Offset`]
  const method = `scroll${isTop ? 'Top' : 'Left'}`
  if (typeof ret !== 'number') {
    const d: any = windw.document
    // ie6,7,8 standard mode
    ret = d.documentElement[method]
    if (typeof ret !== 'number') {
      // quirks mode
      ret = d.body[method]
    }
  }
  return ret
}

export function getScrollTop(windw: Window): number {
  return getScroll(windw, true)
}

export function getScrollLeft(windw: Window): number {
  return getScroll(windw, false)
}
