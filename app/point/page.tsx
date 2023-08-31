'use client';

import { useRef, useState } from 'react';
import { alignPoint } from '../../src';
export default function Point() {
  const [sx, setSx] = useState('l');
  const [sy, setSy] = useState('t');
  const [overflowAdjust, setOverflowAdjust] = useState(false);

  const rect = useRef();

  const onChangeY = ({ target: { value } }) => {
    setSy(value);
  };

  const onChangeX = ({ target: { value } }) => {
    setSx(value);
  };

  const onOverflowAdjust = () => {
    setOverflowAdjust((v) => {
      return !v;
    });
  };

  const onClick = (event) => {
    const { clientX, clientY } = event;

    const overflow: any = {};
    if (overflowAdjust) {
      overflow.adjustX = true;
      overflow.adjustY = true;
    }

    alignPoint(
      rect.current,
      { clientX, clientY },
      {
        points: [`${sy}${sx}`],
        overflow,
        useCssTransform: true,
      },
    );
  };

  return (
    <div>
      <div>
        Source:
        <select value={sy} onChange={onChangeY}>
          <option value="t">t (Top)</option>
          <option value="c">c (Center)</option>
          <option value="b">b (Bottom)</option>
        </select>
        <select value={sx} onChange={onChangeX}>
          <option value="t">l (Left)</option>
          <option value="c">c (Center)</option>
          <option value="b">r (Right)</option>
        </select>{' '}
        Overflow Adjust:
        <input
          type="checkbox"
          checked={overflowAdjust}
          onChange={onOverflowAdjust}
        />
      </div>

      <div
        onClick={onClick}
        style={{
          border: '1px solid black',
          textAlign: 'center',
          margin: '20px 0',
          padding: '150px 0',
        }}>
        <div
          ref={rect}
          style={{
            background: 'red',
            position: 'fixed',
            width: 50,
            height: 50,
            transition: 'all 0.5s',
          }}
        />
        Click me please!
      </div>
    </div>
  );
}
