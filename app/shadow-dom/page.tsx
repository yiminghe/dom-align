'use client';

import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import domAlign from '../../src';

function Test() {
  const source = useRef();
  const target = useRef();
  function align() {
    const ret = domAlign(source.current, target.current, {
      points: ['bl', 'bl'],
      overflow: {
        adjustY: 1,
      },
    });
    console.log(ret);
  }

  return (
    <div style={{ height: 1000 }}>
      <button ref={target}>target</button>

      <div style={{ height: 100 }} />

      <button onClick={align}>align</button>

      <div
        ref={source}
        style={{
          position: 'absolute',
          width: 100,
          height: 200,
          border: '1px solid red',
        }}>
        oo
      </div>
    </div>
  );
}

export default function ShadowDom() {
  const source = useRef<HTMLDivElement>();

  useEffect(() => {
    const shadowRoot = source.current.attachShadow({ mode: 'open' });
    ReactDOM.createRoot(shadowRoot).render(<Test />);
  }, []);

  return <div ref={source}></div>;
}
