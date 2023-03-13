import { getVendorPrefix, getTransitionName, setTransform } from './lib/style'

export function setTransitionProperty(node, value) {
  const name = getTransitionName()
  if (name) {
    node.style[name] = value
    if (name !== 'transitionProperty') {
      node.style.transitionProperty = value
    }
  }
}

export function getTransitionProperty(node) {
  return node.style.transitionProperty || node.style[getTransitionName()]
}

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

const matrix2d = /matrix\((.*)\)/
const matrix3d = /matrix3d\((.*)\)/

export function setTransformXY(node, xy) {
  const style = window.getComputedStyle(node, null)
  const transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName())
  if (transform && transform !== 'none') {
    let arr
    let match2d = transform.match(matrix2d)
    if (match2d) {
      match2d = match2d[1]
      arr = match2d.split(',').map((item) => {
        return parseFloat(item, 10)
      })
      arr[4] = xy.x
      arr[5] = xy.y
      setTransform(node, `matrix(${arr.join(',')})`)
    } else {
      const match3d = transform.match(matrix3d)[1]
      arr = match3d.split(',').map((item) => {
        return parseFloat(item, 10)
      })
      arr[12] = xy.x
      arr[13] = xy.y
      setTransform(node, `matrix3d(${arr.join(',')})`)
    }
  } else {
    setTransform(node, `translateX(${xy.x}px) translateY(${xy.y}px) translateZ(0)`)
  }
}
