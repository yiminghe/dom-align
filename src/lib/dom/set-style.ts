// TODO refactoring
export function setStyle(el: HTMLElement, name: any, value: number | string) {
  if (typeof value === 'number') {
    el.style[name] = `${value}px`
  } else {
    el.style[name] = value
  }
}
