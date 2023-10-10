import React from 'react';
import { alignPoint } from '@rc-component/dom-align';

class Demo extends React.Component {
  state = {
    sy: 't',
    sx: 'l',
    overflowAdjust: false,
  };

  $rect: HTMLElement;

  onChangeY = ({ target: { value } }) => {
    this.setState({ sy: value });
  };

  onChangeX = ({ target: { value } }) => {
    this.setState({ sx: value });
  };

  onOverflowAdjust = () => {
    this.setState({
      overflowAdjust: !this.state.overflowAdjust,
    });
  };

  onClick = event => {
    const { sx, sy, overflowAdjust } = this.state;
    const { clientX, clientY } = event;

    const overflow = {} as any;
    if (overflowAdjust) {
      overflow.adjustX = true;
      overflow.adjustY = true;
    }

    alignPoint(
      this.$rect,
      { clientX, clientY },
      {
        points: [`${sy}${sx}`],
        overflow,
        useCssTransform: true,
      },
    );
  };

  rectRef = ele => {
    this.$rect = ele;
  };

  render() {
    const { sx, sy, overflowAdjust } = this.state;

    return (
      <div>
        <div>
          Source:
          <select value={sy} onChange={this.onChangeY}>
            <option value="t">t (Top)</option>
            <option value="c">c (Center)</option>
            <option value="b">b (Bottom)</option>
          </select>
          <select value={sx} onChange={this.onChangeX}>
            <option value="t">l (Left)</option>
            <option value="c">c (Center)</option>
            <option value="b">r (Right)</option>
          </select>{' '}
          Overflow Adjust:
          <input
            type="checkbox"
            checked={overflowAdjust}
            onClick={this.onOverflowAdjust}
          />
        </div>

        <div
          onClick={this.onClick}
          style={{
            border: '1px solid black',
            textAlign: 'center',
            margin: 20,
            padding: '150px 0',
          }}
        >
          <div
            ref={this.rectRef}
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
}

export default Demo;
