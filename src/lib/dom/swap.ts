// TODO refactoring
export function swap(elem: HTMLElement, options: any, callback: any) {
  const old: any = {};
  const style = elem.style;
  let name: any;

  // Remember the old values, and insert the new ones
  for (name in options) {
    if (options.hasOwnProperty(name)) {
      // 🔴 style[name] return empty string! what the point?? is it ok for IE only? 🔴
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
