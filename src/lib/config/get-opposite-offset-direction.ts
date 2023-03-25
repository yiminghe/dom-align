export function getOppositeOffsetDirection(dir: 'left' | 'right' | 'top' | 'bottom') {
  if (dir === 'left') {
    return 'right'
  } else if (dir === 'right') {
    return 'left'
  } else if (dir === 'top') {
    return 'bottom'
  }
  return 'top'
}
