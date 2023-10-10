import React from 'react';
import domAlign from '@rc-component/dom-align';

const Test = () => {
  const targetRef = React.useRef(null);
  const sourceRef = React.useRef(null);
  const align = () => {
    const ret = domAlign(sourceRef.current, targetRef.current, {
      points: ['bl', 'bl'],
      overflow: {
        adjustY: 1,
      },
    });
    console.log(ret);

    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 1000);
  };
    return (
      <div style={{ height: 400 }}>
        <button ref={targetRef}>target</button>

        <div style={{ height: 100 }} />

        <button onClick={align}>align</button>

        <div
          ref={sourceRef}
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
  };

  export default Test;