import $ from 'jquery';
import expect from 'expect.js';
import domAlign from '../src';

$('<style>html,body {padding:0;margin:0;border:none;}</style>')
  .appendTo(document.getElementsByTagName('head'));

describe('dom-align', () => {
  function toBeEqualRect(actual, expects) {
    for (const i in actual) {
      if (actual[i] - expects[i] >= 5) {
        return false;
      }
    }
    return true;
  }

  function run(useCssTransform) {
    describe(`useCssTransform=${!!useCssTransform}`, () => {
      describe('basic', () => {
        it('unified getOffsetParent method', () => {
          const getOffsetParent = domAlign.__getOffsetParent;
          const test = [];
          test[0] = `<div><div></div></div>`;

          test[1] = `<div><div style='position: relative;'></div></div>`;

          test[2] = `<div>` +
            `<div>` +
            `<div style='position: absolute;'></div>` +
            `</div>` +
            `</div>`;

          test[3] = `<div style='position: relative;'>` +
            `<div>` +
            `<div style='position: absolute;'></div>` +
            `</div>` +
            `</div>`;

          const dom = [];

          for (let i = 0; i < 4; i++) {
            dom[i] = $(test[i])[0];
            document.body.appendChild(dom[i]);
          }

          expect(getOffsetParent(dom[0].firstChild)).to.be(dom[0]);
          expect(getOffsetParent(dom[1].firstChild)).to.be(dom[1]);
          expect(getOffsetParent(dom[2].firstChild.firstChild)).to.be(null);
          expect(getOffsetParent(dom[3].firstChild.firstChild)).to.be(dom[3]);

          for (let i = 0; i < 4; i++) {
            $(dom[i]).remove();
          }
        });

        it('getVisibleRectForElement works', (done) => {
          const gap = $(`<div style='height: 1500px;width: 100000px;'></div>`)[0];
          document.body.appendChild(gap);

          const getVisibleRectForElement = domAlign.__getVisibleRectForElement;
          const test = [];

          test[0] = `<div><div></div></div>`;

          test[1] = `<div style='width: 100px;height: 100px;overflow: hidden;'>` +
            `<div style='position: relative;'></div></div>`;

          test[2] = `<div style='width: 100px;height: 100px;overflow: hidden;'>` +
            `<div>` +
            `<div style='position: absolute;'></div>` +
            `</div>` +
            `</div>`;

          test[3] = `<div style='position: relative;width: 100px;` +
            `height: 100px;overflow: hidden;'>` +
            `<div>` +
            `<div style='position: absolute;'></div>` +
            `</div>` +
            `</div>`;

          const dom = [];

          for (let i = 3; i >= 0; i--) {
            dom[i] = $(test[i])[0];
            document.body.appendChild(dom[i]);
          }

          // 1
          window.scrollTo(10, 10);

          const right = 10 + $(window).width();
          const bottom = 10 + $(window).height();

          let rect = getVisibleRectForElement(dom[0].firstChild);

          expect(rect.left - 10).within(-10, 10);
          expect(rect.top - 10).within(-10, 10);
          expect(rect.right - right).within(-10, 10);
          expect(rect.bottom - bottom).within(-10, 10);

          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return done();
          }

          window.scrollTo(200, 200);
          rect = getVisibleRectForElement(dom[0].firstChild);

          expect(rect.left).to.eql(200);
          expect(rect.bottom).to.eql(200 + $(window).height());
          expect(rect.top).to.eql(200);
          expect(rect.right).to.eql(200 + $(window).width());

          $(dom[0]).remove();

          // 2
          window.scrollTo(10, 10);
          rect = getVisibleRectForElement(dom[1].firstChild);
          expect(toBeEqualRect(rect, {
            left: 10,
            top: 10,
            right: 100,
            bottom: 100,
          })).to.be.ok();

          window.scrollTo(200, 200);
          rect = getVisibleRectForElement(dom[1].firstChild);
          expect(rect).to.be(null);
          $(dom[1]).remove();

          // 3
          window.scrollTo(10, 10);
          rect = getVisibleRectForElement(dom[2].firstChild);
          expect(toBeEqualRect(rect, {
            left: 10,
            top: 10,
            right: 100,
            bottom: 100,
          })).to.be.ok();

          window.scrollTo(200, 200);
          rect = getVisibleRectForElement(dom[2].firstChild);
          expect(rect).to.be(null);
          $(dom[2]).remove();

          // 4
          window.scrollTo(10, 10);
          rect = getVisibleRectForElement(dom[3].firstChild);
          expect(toBeEqualRect(rect, {
            left: 10,
            top: 10,
            right: 100,
            bottom: 100,
          })).to.be.ok();

          window.scrollTo(200, 200);
          rect = getVisibleRectForElement(dom[3].firstChild);
          expect(rect).to.be(null);
          $(dom[3]).remove();
          $(gap).remove();

          setTimeout(() => {
            window.scrollTo(0, 0);
            done();
          }, 200);
        });

        it('offset and percentage offset support percentage', () => {
          const node = $('<div>' +
            '<div style="width:100px;height:100px;position: absolute;left:0;top:0"></div>' +
            '<div style="width:50px;height:60px;position: absolute;left:0;top:0"></div>' +
            '</div>').appendTo(document.body);
          const target = node[0].firstChild;
          const source = target.nextSibling;

          domAlign(source, target, {
            points: ['tl', 'tl'],
            overflow: {
              adjustX: 0,
              adjustY: 0,
            },
            offset: ['-50%', '-50%'],
            targetOffset: ['-50%', '-50%'],
          });

          expect($(source).offset()).to.eql({
            top: 20,
            left: 25,
          });
        });
      });

      describe('useCssRight and useCssBottom', () => {
        it('works', () => {
          const node = $('<div>' +
            '<div style="width:100px;height:100px;position: absolute;left:0;top:0;"></div>' +
            '<div style="width:50px;height:60px;position: absolute;"></div>' +
            '</div>').appendTo(document.body);
          const target = node[0].firstChild;
          const source = target.nextSibling;

          domAlign(source, target, {
            points: ['tl', 'tl'],
            overflow: {
              adjustX: 0,
              adjustY: 0,
            },
            useCssRight: 1,
            useCssBottom: 1,
            offset: ['-50%', '-50%'],
            targetOffset: ['-50%', '-50%'],
          });
          expect($(source)[0].style.left).to.be('');
          expect($(source)[0].style.top).to.be('');
          expect($(source)[0].style.right).not.to.be('');
          expect($(source)[0].style.bottom).not.to.be('');

          expect($(source).offset()).to.eql({
            top: 20,
            left: 25,
          });
        });
      });

      it('center align must ok', () => {
        if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
          return;
        }
        const node = $(`<div style='position: absolute;left:0;top:0;
        width: 100px;height: 100px;
        overflow: hidden'>
        <div style='position: absolute;
        width: 50px;
        height: 50px;'>
        </div>
        <div style='position: absolute;left:0;top:20px;'></div>
        <div style='position: absolute;left:0;top:80px;width:100px;height:5px;'></div>
        </div>`).appendTo('body');

        const target = node.children().eq(0);
        // upper = node.children().eq(1),
        const lower = node.children().eq(2);

        const containerOffset = node.offset();
        // const targetOffset = target.offset();

        domAlign(target[0], lower[0], {
          points: ['bc', 'tc'],
        });

        //    _____________
        //   |             |
        //   |  ________   |
        //   |  |      |   |
        //   |__|______|___|
        //   |_____________|
        expect(target.offset().left - 25).within(-10, 10);

        expect(target.offset().top - containerOffset.top - 30).within(-10, 10);
      });

      it('works when target is window', () => {
        if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
          return;
        }
        const node = $(`
          <div style='position: absolute;left:50px;top:80px;width:100px;height:5px;'></div>
        `).appendTo('body');
        domAlign(node.get(0), window, {
          points: ['tl', 'tl'],
        });
        expect(node.offset().top).to.be(0);
        expect(node.offset().left).to.be(0);
      });

      it('works when target is document', () => {
        if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
          return;
        }
        const node = $(`
          <div style='position: absolute;left:50px;top:80px;width:100px;height:5px;'></div>
        `).appendTo('body');
        domAlign(node.get(0), document, {
          points: ['tl', 'tl'],
        });
        expect(node.offset().top).to.be(0);
        expect(node.offset().left).to.be(0);
      });

      describe('auto align', () => {
        it('should not auto adjust if current position is right', () => {
          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return;
          }
          const node = $(`<div style='position: absolute;left:0;top:0;
        width: 100px;height: 100px;
        overflow: hidden'>
        <div style='position: absolute;
        width: 50px;
        height: 50px;'>
        </div>
        <div style='position: absolute;left:0;top:20px;'></div>
        <div style='position: absolute;left:0;top:80px;width:5px;height:5px;'></div>
        </div>`).appendTo('body');

          const target = node.children().eq(0);
          // upper = node.children().eq(1),
          const lower = node.children().eq(2);

          let containerOffset = node.offset();
          // const targetOffset = target.offset();

          domAlign(target[0], lower[0], {
            points: ['bl', 'tl'],
          });

          // const afterTargetOffset = target.offset();

          //    _____________
          //   |             |
          //   |______       |
          //   |      |      |
          //   |______|______|
          //   |_____________|

          expect(target.offset().left - containerOffset.left).within(-10, 10);

          expect(target.offset().top - containerOffset.top - 30).within(-10, 10);

          domAlign(target[0], lower[0], {
            points: ['tl', 'bl'],
            overflow: {
              adjustX: 1,
              adjustY: 1,
            },
          });

          //    _____________
          //   |             |
          //   |______       |
          //   |      |      |
          //   |______|______|
          //   |_____________|
          // flip 然后 ok
          containerOffset = node.offset();
          expect(target.offset().left - containerOffset.left).within(-10, 10);
          const actual = target.offset().top;
          const expected = containerOffset.top + 30;
          expect(actual - expected).within(-5, 5);

          domAlign(target[0], lower[0], {
            points: ['bl', 'tl'],
            offset: ['50%', '50%'],
          });
          expect(target.offset().left - containerOffset.left).to.be(25);
          expect(target.offset().top - containerOffset.top).to.be(55);
        });


        it('should not auto adjust if target is out of visible rect', () => {
          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return;
          }
          const node = $(`
           <div style='position:absolute;left:0;top:0;width:100px;height:100px;overflow:hidden'>
            <div style='position:absolute;top:0;left:0;width:50px;height:50px;'></div>
            <div style='position:absolute;left:80px;top:80px;'></div>
           </div>
          `).appendTo('body');

          const target = node.children().eq(0);
          const source = node.children().eq(1);
          domAlign(source[0], target[0], {
            points: ['tl', 'tl'],
            overflow: {
              adjustX: 1,
              adjustY: 1,
            },
          });

          expect(source.offset().top - target.offset().top).to.be(0);
          expect(source.offset().left - target.offset().left).to.be(0);

          target.css({ top: -50, left: -50 });
          domAlign(source[0], target[0], {
            points: ['tl', 'tl'],
            overflow: {
              adjustX: 1,
              adjustY: 1,
            },
          });

          expect(source.offset().top - target.offset().top).to.be(0);
          expect(source.offset().left - target.offset().left).to.be(0);
        });

        it('should not flip if target area is smaller than origin', () => {
          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return;
          }
          const node = $(`<div style='position: absolute;left:100px;top:100px;
          width: 100px;height: 100px;
          overflow: hidden'>
          <div style='position: absolute;
          width: 50px;
          height: 100px;'>
          </div>
          <div style='position: absolute;left:0;top:20px;'></div>
          <div style='position: absolute;left:0;top:30px;'></div>
          </div>`).appendTo('body');

          const target = node.children().eq(0);
          // upper = node.children().eq(1),
          const lower = node.children().eq(2);

          const containerOffset = node.offset();
          domAlign(target[0], lower[0], {
            points: ['tl', 'bl'],
            overflow: {
              adjustY: 1,
              resizeHeight: 1,
            },
          });
          //   | ___________ |
          //   |      |      |
          //   | ____ | ____ |
          //   |      |      |
          //   |      |      |
          //   |------|______|

          expect(target.offset().left - containerOffset.left).within(-5, 5);
          expect(target.offset().top - containerOffset.top - 30).within(-5, 5);
        });

        it('should auto adjust if current position is not right', () => {
          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return;
          }
          const node = $(`<div style='position: absolute;left:100px;top:100px;
        width: 100px;height: 100px;
        overflow: hidden'>
        <div style='position: absolute;
        width: 50px;
        height: 90px;'>
        </div>
        <div style='position: absolute;left:0;top:20px;'></div>
        <div style='position: absolute;left:0;top:80px;width:5px;height:5px;'></div>
        </div>`).appendTo('body');

          const target = node.children().eq(0);
          // upper = node.children().eq(1),
          const lower = node.children().eq(2);

          const containerOffset = node.offset();
          domAlign(target[0], lower[0], { points: ['bl', 'tl'] });
          //   |------|
          //   | _____|________
          //   |      |      |
          //   |      |      |
          //   |      |      |
          //   |______|______|
          //   |_____________|

          expect(target.offset().left - containerOffset.left).within(-5, 5);

          expect(target.offset().top - (containerOffset.top - 10)).within(-5, 5);

          domAlign(target[0], lower[0], {
            points: ['tl', 'bl'],
            overflow: {
              adjustX: 1,
              adjustY: 1,
            },
          });

          //    _____________
          //   |      |      |
          //   |--- --|      |
          //   |      |      |
          //   |______|______|
          //   |      |      |
          //   |______|______|
          // flip 不 ok，对 flip 后的 adjustY 到视窗边界
          expect(target.offset().left - containerOffset.left).within(-5, 5);

          expect(target.offset().top - containerOffset.top).within(-5, 5);
        });

        it('should consider offset when caculate realXRegion and realYRegion', () => {
          if (navigator.userAgent.toLowerCase().indexOf('phantomjs') !== -1) {
            return;
          }
          const node = $(`
            <div style="position: absolute;width: 100px;height: 100px;">
              <div style="position: absolute;top: 25px;left:25px;width: 50px;height: 50px;">
              </div>
              <div style="position: absolute;width: 5px;height: 5px"></div>
            </div>
          `).appendTo('body');
          const source = node.children().eq(1);
          const target = node.children().eq(0);
          // See: https://github.com/ant-design/ant-design/issues/6347
          domAlign(source[0], target[0], {
            points: ['tl', 'tl'],
            offset: [-9, -9],
            overflow: {
              adjustX: 1,
              adjustY: 1,
            },
          });
          expect(source.offset().top + 9 - target.offset().top).within(-5, 5);
          expect(source.offset().left + 9 - target.offset().left).within(-5, 5);
        });
      });
    });
  }

  run(false);

  if (window.TransitionEvent) {
    run(true);
  }
});
