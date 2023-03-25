import { Position } from '../../types/rect'

export function getClientPosition(elem: HTMLElement): Position {
  const ownerDocument = elem.ownerDocument
  const body = ownerDocument.body
  const documentElement = ownerDocument && ownerDocument.documentElement

  const box = elem.getBoundingClientRect()

  const left = Math.floor(box.left) - (documentElement.clientLeft || body.clientLeft)
  const top = Math.floor(box.top) - (documentElement.clientTop || body.clientTop)

  return { left, top }
}
