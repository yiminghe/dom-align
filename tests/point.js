import $ from 'jquery';
import expect from 'expect.js';
import { alignPoint } from '../src';

describe.only('point-align', () => {
  // const node = $('<div>' +
  //   '<div style="width:100px;height:100px;position: absolute;left:0;top:0"></div>' +
  //   '<div style="width:50px;height:60px;position: absolute;left:0;top:0"></div>' +
  //   '</div>').appendTo(document.body);
  let source;

  const width = 100;
  const height = 100;

  beforeEach(() => {
    const $ele = $('<div>')
      .css('position', 'absolute')
      .css('width', width)
      .css('height', height);
    $ele.appendTo(document.body);
    source = $ele[0];
  });

  afterEach(() => {
    $(source).remove();
  });

  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  it('point in the view', () => {
    alignPoint(source, { pageX: winWidth / 2, pageY: winHeight / 2 }, {
      points: ['cc'],
    });
    const offset = $(source).offset();
    expect(offset.left).to.be((winWidth - width) / 2);
    expect(offset.top).to.be((winHeight - height) / 2);
  });

  it('point out of the view', () => {
    alignPoint(source, { pageX: winWidth + width, pageY: winHeight + height }, {
      points: ['tl'],
    });
    const offset = $(source).offset();
    expect(offset.left).to.be(winWidth + width);
    expect(offset.top).to.be(winHeight + height);
  });

  it('adjust position when overflow', () => {
    alignPoint(source, { pageX: winWidth - 10, pageY: winHeight - 10 }, {
      points: ['tl'],
      overflow: {
        adjustX: true,
        adjustY: true,
      },
    });
    const offset = $(source).offset();
    expect(offset.left).to.be(winWidth - 10 - width);
    expect(offset.top).to.be(winHeight - 10 - height);
  });
});
