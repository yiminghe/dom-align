import { getVendorPrefix, getTransitionName, setTransform } from './lib/style'

export function getTransformXY(node) {
  const style = window.getComputedStyle(node, null)
  const transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName())
  if (transform && transform !== 'none') {
    const matrix = transform.replace(/[^0-9\-.,]/g, '').split(',')
    return {
      x: parseFloat(matrix[12] || matrix[4], 0),
      y: parseFloat(matrix[13] || matrix[5], 0),
    }
  }
  return {
    x: 0,
    y: 0,
  }
}
