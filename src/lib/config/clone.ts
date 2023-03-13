export function clone(obj: any): any {
  let i
  const ret: any = {}
  for (i in obj) {
    if (obj.hasOwnProperty(i)) {
      ret[i] = obj[i]
    }
  }
  const overflow = obj.overflow
  if (overflow) {
    for (i in obj) {
      if (obj.hasOwnProperty(i)) {
        ret.overflow[i] = obj.overflow[i]
      }
    }
  }
  return ret
}
