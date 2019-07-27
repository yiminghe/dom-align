import React from 'react';
import domAlign from '../src';
import { storiesOf } from '@storybook/react';

const Demo = React.createClass({
  align() {
    const ret = domAlign(this.refs.source, this.refs.target, {
      points: ['tl', 'bl'],
      overflow: {
        adjustY: 1,
        adjustX: 1,
      },
    });
    console.log(ret);

    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 1000);
  },
  render() {
    window.align = this.align;
    return (<div style={{ height: 1000 }}>
      <button ref="target" style={{ position: 'absolute', right: 0, top: 300 }}>target</button>

      <div style={{ height: 100 }}/>

      <button onClick={this.align}>align</button>

      <div
        ref="source"
        style={{ position: 'absolute', width: 100, height: 200, border: '1px solid red' }}
      >
        oo
      </div>
    </div>);
  },
});

Demo.story = 'body-overflow';

storiesOf(Demo.story, module).add('demo', () => <Demo />);

export default Demo;
