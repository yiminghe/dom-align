// https://stackoverflow.com/a/3485654/3040605
export function forceRelayout(elem: HTMLElement) {
  const originalStyle = elem.style.display
  elem.style.display = 'none'
  elem.offsetHeight // eslint-disable-line
  elem.style.display = originalStyle
}
