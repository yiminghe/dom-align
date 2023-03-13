export interface Size {
  width: number
  height: number
}

export interface Position {
  top: number
  left: number
}

export interface Sides {
  top: number
  left: number
  right: number
  bottom: number
}

export interface Rect extends Size, Position, Sides {
  right?: number
  bottom?: number
}
