import $ from 'jquery';
import expect from 'expect.js';
import { alignPoint } from '../src';

describe('point-align', () => {
  let source;

  const width = 100;
  const height = 100;

  let winWidth;
  let winHeight;

  beforeEach(() => {
    const $ele = $('<div>')
      .css('position', 'absolute')
      .css('width', width)
      .css('height', height);
    $ele.appendTo(document.body);
    source = $ele[0];

    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
  });

  afterEach(() => {
    $(source).remove();
  });

  it('point in the view', () => {
    alignPoint(
      source,
      { pageX: winWidth / 2, pageY: winHeight / 2 },
      {
        points: ['cc'],
      },
    );
    const offset = $(source).offset();
    expect(offset.left).to.be(Math.ceil((winWidth - width) / 2));
    expect(offset.top).to.be(Math.ceil((winHeight - height) / 2));
  });

  it('adjust position when overflow', () => {
    alignPoint(
      source,
      { pageX: winWidth - 10, pageY: winHeight - 10 },
      {
        points: ['tl'],
        overflow: {
          adjustX: true,
          adjustY: true,
        },
      },
    );
    const offset = $(source).offset();
    expect(offset.left).to.be(winWidth - 10 - width);
    expect(offset.top).to.be(winHeight - 10 - height);
  });

  it('point out of the view', () => {
    alignPoint(
      source,
      { pageX: winWidth + width, pageY: winHeight + height },
      {
        points: ['tl'],
      },
    );
    const offset = $(source).offset();
    expect(offset.left).to.be(winWidth + width);
    expect(offset.top).to.be(winHeight + height);
  });
});
