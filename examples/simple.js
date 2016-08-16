const React = require('react');
const ReactDOM = require('react-dom');

function $id(id) {
  return document.getElementById(id);
}

function $val(sel) {
  sel = $id(sel);
  return sel.value;
}

const domAlign = require('dom-align');

function align() {
  domAlign($id('source'), $id('target'), {
    points: [$val('source_align_tb') + $val('source_align_lr'),
      $val('target_align_tb') + $val('target_align_lr')],
    offset: [
      $val('offset1'),
      $val('offset2'),
    ],
    targetOffset: [
      $val('targetOffset1'),
      $val('targetOffset2'),
    ],
    overflow: {
      adjustX: $id('adjustX').checked,
      adjustY: $id('adjustY').checked,
    },
    useCssRight: $id('useCssRight').checked,
    useCssBottom: $id('useCssBottom').checked,
  });
}

const div = (<div>
  <h1>dom-align</h1>

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

    &nbsp;

    target:
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

    &nbsp;

    offset: [
    <input type="offset" id="offset1" defaultValue="0" size="3"/>
    ,
    <input type="offset" id="offset2" defaultValue="0" size="3"/>
    ]

    &nbsp;

    targetOffset: [
    <input type="offset" id="targetOffset1" defaultValue="0" size="3"/>
    ,
    <input type="offset" id="targetOffset2" defaultValue="0" size="3"/>
    ]

    &nbsp;

    overflow:

    &nbsp;

    <label>adjustX:
      <input type="checkbox" id="adjustX"/>
    </label>

    &nbsp;

    <label>adjustY:
      <input type="checkbox" id="adjustY"/>
    </label>

    &nbsp;

    <label>useCssBottom:
      <input type="checkbox" id="useCssBottom"/>
    </label>

    &nbsp;

    <label>useCssRight:
      <input type="checkbox" id="useCssRight"/>
    </label>

    &nbsp;

    <button id="align" onClick={align}>align</button>
    <br/>

    <div style={{ width: 180, height: 180, overflow: 'auto', border: '1px solid green' }}>
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

      <div
        style={{
          background: 'red',
          width: 50,
          height: 50,
          position: 'absolute',
          transition: 'all 0.5s',
        }}
        id="source"
      >
        source node
      </div>
    </div>
  </div>
</div>);

ReactDOM.render(div, $id('__react-content'));
