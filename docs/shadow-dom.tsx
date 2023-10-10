import React, { useEffect } from 'react';
import domAlign from '@rc-component/dom-align';
import ReactDOM from 'react-dom';

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
    return (
      <div style={{ height: 500 }}>
        <button ref="target">target</button>

        <div style={{ height: 100 }} />

        <button onClick={this.align.bind(this)}>align</button>

        <div
          ref="source"
          style={{
            position: 'absolute',
            width: 100,
            height: 200,
            border: '1px solid red',
          }}
        >
          oo
        </div>
      </div>
    );
  }
}

export default () => {
  const divRef = React.useRef(null);
  useEffect(() => {
    const div = document.createElement('div');
    const shadowRoot = div.attachShadow({ mode: 'open' });
    divRef.current.appendChild(div);
    ReactDOM.render(<Test />, shadowRoot);
  }, []);
  return <div ref={divRef} />;
}