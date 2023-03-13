import { Offset } from './offset'
import { Points } from './point'

export interface Config {
  target?: HTMLElement
  source?: HTMLElement
  /**
   * move point of source node to align with point of target node.
   * Such as ['tr','cc'], align top right point of source node with center point of target node.
   * Point can be 't'(top), 'b'(bottom), 'c'(center), 'l'(left), 'r'(right) */
  points?: Points
  offset?: Offset
  targetOffset?: Offset

  overflow?: {
    alwaysByViewport?: boolean
    adjustX?: boolean
    adjustY?: boolean
    resizeWidth?: boolean
    resizeHeight?: boolean
  }

  useCssRight: boolean
  useCssBottom: boolean
  useCssTransform: boolean
  ignoreShake: boolean
}
