import utils from './utils';

const { getParent } = utils;

export default function isAncestorFixed(element) {
  if (utils.isWindow(element) || element.nodeType === 9) {
    return false;
  }

  const doc = utils.getDocument(element);
  const body = doc.body;
  let parent = null;
  for (
    parent = getParent(element);
    parent && parent !== body;
    parent = getParent(parent)
  ) {
    const positionStyle = utils.css(parent, 'position');
    if (positionStyle === 'fixed') {
      return true;
    }
  }
  return false;
}
