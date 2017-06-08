import React from 'react';
import domAlign from 'dom-align';
import ReactDOM from 'react-dom';

const Test = React.createClass({
  align() {
    const ret = domAlign(this.refs.source, this.refs.target, {
      points: ['bl', 'bl'],
      overflow: {
        adjustY: 1,
      },
    });
    console.log(ret);
  },
  render() {
    window.align = this.align;
    return (<div style={{ height: 1000 }}>
      <button ref="target">target</button>

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

ReactDOM.render(<Test />, document.getElementById('__react-content'));
