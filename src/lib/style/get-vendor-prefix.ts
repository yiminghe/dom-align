let vendorPrefix: string

const jsCssMap = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  // IE did it wrong again ...
  ms: '-ms-',
  O: '-o-',
}

export function getVendorPrefix() {
  if (vendorPrefix !== undefined) {
    return vendorPrefix
  }
  vendorPrefix = ''
  const style = document.createElement('p').style
  const testProp = 'Transform'
  for (const key in jsCssMap) {
    if (key + testProp in style) {
      vendorPrefix = key
    }
  }
  return vendorPrefix
}
