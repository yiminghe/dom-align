import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

setOptions({
  name: 'dom-align',
  url: 'https://github.com/yiminghe/dom-align/'
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
