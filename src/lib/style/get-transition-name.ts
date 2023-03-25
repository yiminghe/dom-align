import { getVendorPrefix } from './get-vendor-prefix'

export function getTransitionName() {
  return getVendorPrefix() ? `${getVendorPrefix()}TransitionProperty` : 'transitionProperty'
}
