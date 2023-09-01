/// <reference types="cypress" />

import domAlign from '../../src';

const { $ } = Cypress;

function toBeEqualRect(actual, expects) {
  for (const i in actual) {
    if (actual[i] - expects[i] >= 5) {
      return false;
    }
  }
  return true;
}

function ready(done) {
  return cy.get('[data-cy-root] > div').then(done);
}

describe('basic', () => {
  let root;

  beforeEach(() => {
    root = null;
    root = $('[data-cy-root]')[0];
  });

  it('unified getOffsetParent method', () => {
    cy.mount(
      <>
        <div>
          <div></div>
        </div>
        <div>
          <div style={{ position: 'relative' }}></div>
        </div>
        <div>
          <div>
            <div style={{ position: 'absolute' }}></div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div>
            <div style={{ position: 'absolute' }}></div>
          </div>
        </div>
      </>,
    );

    ready(() => {
      const getOffsetParent = domAlign.__getOffsetParent;

      const dom = [].concat.apply([], root.childNodes);

      expect(getOffsetParent(dom[0].firstChild)).to.equal(dom[0]);
      expect(getOffsetParent(dom[1].firstChild)).to.equal(dom[1]);
      expect(getOffsetParent(dom[2].firstChild.firstChild)).to.equal(null);
      expect(getOffsetParent(dom[3].firstChild.firstChild)).to.equal(dom[3]);
    });
  });

  it('getVisibleRectForElement clip by viewport if ancestor is fixed', () => {
    cy.mount(
      <>
        <div style={{ height: 1500, width: 100000 }}></div>
        <div style={{ position: 'fixed', top: 0, left: 0 }}>
          <div style={{ position: 'absolute', width: 10, height: 10 }}></div>
        </div>
      </>,
    );

    ready(() => {
      const node = $(root.childNodes[1]);
      const getVisibleRectForElement = domAlign.__getVisibleRectForElement;
      window.scrollTo(100, 100);

      const element = node.children().get(0);
      const visibleRect = getVisibleRectForElement(element);
      expect(visibleRect.top).to.equal(100);
      expect(visibleRect.left).to.equal(100);
      expect(visibleRect.right).to.equal(100 + $(window).width());
      expect(visibleRect.bottom).to.equal(100 + $(window).height());
    });
  });

  it('getVisibleRectForElement clip by document if ancestor is not fixed', () => {
    const getVisibleRectForElement = domAlign.__getVisibleRectForElement;

    const jsx = (
      <>
        <div style={{ height: 1500, width: 100000 }}></div>

        <div>
          <div></div>
        </div>

        <div style={{ width: 100, height: 100, overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}></div>
        </div>

        <div style={{ width: 100, height: 100, overflow: 'hidden' }}>
          <div>
            <div style={{ position: 'absolute' }}></div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: 100,
            height: 100,
            overflow: 'hidden',
          }}>
          <div>
            <div style={{ position: 'absolute' }}></div>
          </div>
        </div>
      </>
    );
    cy.mount(jsx);
    ready(() => {
      const dom = [].concat.apply([], root.childNodes).slice(1);

      // 1
      window.scrollTo(10, 10);

      const documentWidth = document.documentElement.scrollWidth;
      const documentHeight = document.documentElement.scrollHeight;

      let rect = getVisibleRectForElement(dom[0].firstChild);
      expect(rect.left).to.equal(0);
      expect(rect.top).to.equal(0);
      expect(rect.right).to.equal(documentWidth);
      expect(rect.bottom).to.equal(documentHeight);

      window.scrollTo(200, 200);

      rect = getVisibleRectForElement(dom[0].firstChild);
      expect(rect.left).to.equal(0);
      expect(rect.top).to.equal(0);
      expect(rect.right).to.equal(documentWidth);
      expect(rect.bottom).to.equal(documentHeight);

      $(dom[0]).hide();

      // 2
      window.scrollTo(10, 10);
      rect = getVisibleRectForElement(dom[1].firstChild);
      const expectedRect = {
        left: 0,
        top: $(dom[1]).offset().top,
        right: 100,
        bottom: $(dom[1]).offset().top + 100,
      };

      expect(toBeEqualRect(rect, expectedRect)).to.be.ok;

      window.scrollTo(200, 200);
      rect = getVisibleRectForElement(dom[1].firstChild);
      expect(
        toBeEqualRect(rect, {
          left: 0,
          top: $(dom[1]).offset().top,
          right: 100,
          bottom: $(dom[1]).offset().top + 100,
        }),
      ).to.be.ok;
      $(dom[1]).hide();

      // 3
      window.scrollTo(10, 10);
      rect = getVisibleRectForElement(dom[2].firstChild);
      expect(
        toBeEqualRect(rect, {
          left: 0,
          top: $(dom[2]).offset().top,
          right: 100,
          bottom: $(dom[2]).offset().top + 100,
        }),
      ).to.be.ok;

      window.scrollTo(200, 200);
      rect = getVisibleRectForElement(dom[2].firstChild);
      expect(
        toBeEqualRect(rect, {
          left: 0,
          top: $(dom[2]).offset().top,
          right: 100,
          bottom: $(dom[2]).offset().top + 100,
        }),
      ).to.be.ok;
      $(dom[2]).hide();

      // 4
      window.scrollTo(10, 10);
      rect = getVisibleRectForElement(dom[3].firstChild);
      expect(
        toBeEqualRect(rect, {
          left: 0,
          top: $(dom[3]).offset().top,
          right: 100,
          bottom: $(dom[3]).offset().top + 100,
        }),
      ).to.be.ok;

      window.scrollTo(200, 200);
      rect = getVisibleRectForElement(dom[3].firstChild);
      expect(
        toBeEqualRect(rect, {
          left: 0,
          top: $(dom[3]).offset().top,
          right: 100,
          bottom: $(dom[3]).offset().top + 100,
        }),
      ).to.be.ok;
      $(dom[3]).hide();
      window.scrollTo(0, 0);
      console.log(1);
    });
  });

  it('offset and percentage offset support percentage', () => {
    cy.mount(
      <>
        <div>
          <div
            style={{
              width: 100,
              height: 100,
              position: 'absolute',
              left: 0,
              top: 0,
            }}></div>
          <div
            style={{
              width: 50,
              height: 60,
              position: 'absolute',
              left: 0,
              top: 0,
            }}></div>
        </div>
      </>,
    );

    ready(() => {
      const target = root.firstChild.firstChild;
      const source = target.nextSibling;

      const result = domAlign(source, target, {
        points: ['tl', 'tl'],
        overflow: {
          adjustX: 0,
          adjustY: 0,
        },
        offset: ['-50%', '-50%'],
        targetOffset: ['-50%', '-50%'],
      });
      expect(result.points).to.eql(['tl', 'tl']);

      expect($(source).offset()).to.eql({
        top: 20,
        left: 25,
      });
    });
  });
});
