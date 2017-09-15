import utils from './utils';

export default function isAncestorFixed(element) {
  if (utils.isWindow(element) || element.nodeType === 9) {
    return false;
  }

  const doc = utils.getDocument(element);
  const body = doc.body;
  let parent = null;
  for (parent = element.parentNode; parent && parent !== body; parent = parent.parentNode) {
    const positionStyle = utils.css(parent, 'position');
    if (positionStyle === 'fixed') {
      return true;
    }
  }
  return false;
}
