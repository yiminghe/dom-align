import { Config } from '../../types/config'

export function getOffsetDirection(dir: 'left' | 'top', option: Config) {
  if (dir === 'left') {
    return option.useCssRight ? 'right' : dir
  }
  return option.useCssBottom ? 'bottom' : dir
}
