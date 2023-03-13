import { getStyle } from './get-style';

type PBM = 'padding' | 'margin' | 'border';
type Side = 'Top' | 'Left' | 'Right' | 'Bottom';

export function getPBMWidth(elem: HTMLElement, props: PBM[], which: Side[]) {
  let value = 0;
  let prop;
  let j;
  let i;
  for (j = 0; j < props.length; j++) {
    prop = props[j];
    if (prop) {
      for (i = 0; i < which.length; i++) {
        let cssProp;
        if (prop === 'border') {
          cssProp = `${prop}${which[i]}Width`;
        } else {
          cssProp = prop + which[i];
        }
        value += parseFloat(getStyle(elem, cssProp)) || 0;
      }
    }
  }
  return value;
}
