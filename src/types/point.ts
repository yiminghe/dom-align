export type PointSymbolTBC = 't' | 'b' | 'c'
export type PointSymbolLRC = 'l' | 'r' | 'c'

export type Point = `${PointSymbolTBC}${PointSymbolLRC}`
export type Points = [Point, Point]
