import React from 'react';
import domAlign from '../src';
import { createPortal } from 'react-dom';
import { storiesOf } from '@storybook/react';


class Test extends React.Component {
  align() {
    const ret = domAlign(this.refs.source, this.refs.target, {
      points: ['bl', 'bl'],
      overflow: {
        adjustY: 1,
      },
    });
    console.log(ret);
  }

  render() {
    window.align = this.align;
    return (<div style={{ height: 1000 }}>
      <button ref="target">target</button>

      <div style={{ height: 100 }}/>

      <button onClick={this.align.bind(this)}>align</button>

      <div
        ref="source"
        style={{ position: 'absolute', width: 100, height: 200, border: '1px solid red' }}
      >
        oo
      </div>
    </div>);
  }
}

class Demo extends React.Component {
  saveRoot = (root) => {
    this.root = root;
  };
  state = {};

  componentDidMount() {
    const reactContainer = this.root;
    const div = document.createElement('div');
    const shadowRoot = div.attachShadow({ mode: 'open' });
    reactContainer.appendChild(div);
    this.setState({
      element: createPortal(<Test/>, shadowRoot)
    });
  }

  render() {
    return <div ref={this.saveRoot}>{this.state.element}</div>;
  }
}

Demo.story = 'shadow-dom';

storiesOf(Demo.story, module).add('demo', () => <Demo/>);

export default Demo;

