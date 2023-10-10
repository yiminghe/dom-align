import React from 'react';
import domAlign from '@rc-component/dom-align';

function $id(id) {
  return document.getElementById(id);
}

function $val(sel) {
  sel = $id(sel);
  return sel.value;
}

function align() {
  domAlign($id('source'), $id('target'), {
    points: [
      $val('source_align_tb') + $val('source_align_lr'),
      $val('target_align_tb') + $val('target_align_lr'),
    ],
    offset: [$val('offset1'), $val('offset2')],
    targetOffset: [$val('targetOffset1'), $val('targetOffset2')],
    overflow: {
      adjustX: $id('adjustX').checked,
      adjustY: $id('adjustY').checked,
    },
    useCssRight: $id('useCssRight').checked,
    useCssBottom: $id('useCssBottom').checked,
    useCssTransform: $id('useCssTransform').checked,

    ignoreShake: $id('ignoreShake').checked,
  });
}

export default () => (
  <div>
    <div>
      source:
      <select id="source_align_tb">
        <option value="t">t</option>
        <option value="c">c</option>
        <option value="b">b</option>
      </select>
      <select id="source_align_lr">
        <option value="l">l</option>
        <option value="c">c</option>
        <option value="r">r</option>
      </select>
      &nbsp; target:
      <select id="target_align_tb">
        <option value="t">t</option>
        <option value="c">c</option>
        <option value="b">b</option>
      </select>
      <select id="target_align_lr">
        <option value="l">l</option>
        <option value="c">c</option>
        <option value="r">r</option>
      </select>
      &nbsp; offset: [
      <input type="offset" id="offset1" defaultValue="0" size="3" />
      ,
      <input type="offset" id="offset2" defaultValue="0" size="3" />
      ] &nbsp; targetOffset: [
      <input type="offset" id="targetOffset1" defaultValue="0" size="3" />
      ,
      <input type="offset" id="targetOffset2" defaultValue="0" size="3" />]
      &nbsp; overflow: &nbsp;
      <label>
        adjustX:
        <input type="checkbox" id="adjustX" />
      </label>
      &nbsp;
      <label>
        adjustY:
        <input type="checkbox" id="adjustY" />
      </label>
      &nbsp;
      <label>
        useCssBottom:
        <input type="checkbox" id="useCssBottom" />
      </label>
      &nbsp;
      <label>
        useCssRight:
        <input type="checkbox" id="useCssRight" />
      </label>
      &nbsp;
      <label>
        useCssTransform:
        <input
          type="checkbox"
          id="useCssTransform"
          defaultChecked={!!window.TransitionEvent}
        />
      </label>
      &nbsp;
      <label>
        ignoreShake:
        <input type="checkbox" id="ignoreShake" />
      </label>
      &nbsp;
      <button id="align" onClick={align}>
        align
      </button>
      <br />
      <div
        style={{
          width: 400,
          height: 400,
          overflow: 'auto',
          border: '1px solid green',
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'yellow',
            width: 240,
            height: 240,
            margin: 50,
          }}
          id="target"
        >
          target node
        </div>
        <div style={{ width: 1000, height: 1000 }} />
        <div
          style={{
            background: 'red',
            width: 80,
            height: 80,
            left: 0,
            top: 0,
            position: 'absolute',
            transition: 'all 0.5s',
            overflowY: 'auto',
          }}
          id="source"
        >
          source node
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  </div>
);