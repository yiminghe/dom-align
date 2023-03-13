import { getVendorPrefix } from './get-vendor-prefix'

export function getTransformName() {
  return getVendorPrefix() ? `${getVendorPrefix()}Transform` : 'transform'
}
