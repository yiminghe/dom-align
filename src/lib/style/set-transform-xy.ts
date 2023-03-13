import { getTransformName } from './get-transform-name'
import { setTransform } from './set-transform'

const matrix2d = /matrix\((.*)\)/
const matrix3d = /matrix3d\((.*)\)/

// TODO refactoring
export function setTransformXY(node: HTMLElement, xy: Record<'x' | 'y', string>) {
  const style = window.getComputedStyle(node, null)
  const transform = style.getPropertyValue('transform') || style.getPropertyValue(getTransformName())
  if (transform && transform !== 'none') {
    let arr: any[]
    let match2d = transform.match(matrix2d)
    if (match2d) {
      // @ts-ignore
      match2d = match2d[1]
      // @ts-ignore
      arr = match2d.split(',').map((item) => {
        // @ts-ignore
        return parseFloat(item, 10)
      })
      arr[4] = xy.x
      arr[5] = xy.y
      setTransform(node, `matrix(${arr.join(',')})`)
    } else {
      // @ts-ignore
      const match3d = transform.match(matrix3d)[1]
      // @ts-ignore
      arr = match3d.split(',').map((item) => {
        // @ts-ignore
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
