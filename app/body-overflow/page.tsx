'use client';

import React, { useRef, useEffect } from 'react';
import domAlign from '../../src';

export default function Overflow() {
  const source = useRef();
  const target = useRef();
  const timer = useRef<any>();
  const align = () => {
    const ret = domAlign(source.current, target.current, {
      points: ['tl', 'bl'],
      overflow: {
        adjustY: 1,
        adjustX: 1,
      },
    });
    console.log(ret);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ height: 1000 }}>
      <button ref={target} style={{ position: 'absolute', right: 0, top: 300 }}>
        target
      </button>

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
