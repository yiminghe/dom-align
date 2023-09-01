/// <reference types="cypress" />

import { alignPoint } from '../../src';

const { $ } = Cypress;

function ready(done) {
  return cy.get('[data-cy-root] > div').then(done);
}

describe('point', () => {
  let root;

  let source;

  const width = 100;
  const height = 100;

  let winWidth;
  let winHeight;

  beforeEach((done) => {
    root = null;
    root = $('[data-cy-root]')[0];

    cy.mount(
      <>
        <div
          style={{
            position: 'absolute',
            width,
            height,
          }}></div>
      </>,
    );

    ready(() => {
      winWidth = window.innerWidth;
      winHeight = window.innerHeight;
      source = root.firstChild;
      done();
    });
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
    expect(offset.left).to.equal(Math.ceil((winWidth - width) / 2));
    expect(offset.top).to.equal(Math.ceil((winHeight - height) / 2));
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
    expect(offset.left).to.equal(winWidth - 10 - width);
    expect(offset.top).to.equal(winHeight - 10 - height);
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
    expect(offset.left).to.equal(winWidth + width);
    expect(offset.top).to.equal(winHeight + height);
  });
});
