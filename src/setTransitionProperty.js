let js = '';

function getTransitionName() {
  if (js) {
    return js;
  }
// We should not do anything if required serverside.
  if (typeof document !== 'undefined') {
    const jsCssMap = [
      'Webkit',
      'Moz',
      'ms',
      'O',
    ];
    const style = document.createElement('p').style;
    const testProp = 'TransitionProperty';

    jsCssMap.forEach(key => {
      if (!js && ((key + testProp) in style)) {
        js = key;
      }
    });
  }
  return js;
}

export function setTransitionProperty(node, value) {
  const name = getTransitionName();
  node.style[name] = value;
  if (name !== 'transitionProperty') {
    node.style.transitionProperty = value;
  }
}

export function getTransitionProperty(node) {
  return node.style.transitionProperty || node.style[getTransitionName()];
}
