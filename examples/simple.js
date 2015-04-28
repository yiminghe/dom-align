var React = require('react');

function selectVal(sel) {
  sel = document.getElementById(sel);
  return sel.value;
}

var domAlign = require('dom-align');

function align() {
  domAlign(document.getElementById('source'), document.getElementById('target'), {
    points: [selectVal('source_align_tb') + selectVal('source_align_lr'), selectVal('target_align_tb') + selectVal('target_align_lr')],
    offset: [parseInt(document.getElementById('offset1').value), parseInt(document.getElementById('offset2').value)],
    overflow: {
      adjustX: document.getElementById('adjustX').checked,
      adjustY: document.getElementById('adjustY').checked
    }
  });
}

var div = (<div>
  <h1>dom-align</h1>
  <div>
    source:
    <select id='source_align_tb'>
      <option value='t'>t</option>
      <option value='c'>c</option>
      <option value='b'>b</option>
    </select>
    <select id='source_align_lr'>
      <option value='l'>l</option>
      <option value='c'>c</option>
      <option value='r'>r</option>
    </select>

    target:
    <select id='target_align_tb'>
      <option value='t'>t</option>
      <option value='c'>c</option>
      <option value='b'>b</option>
    </select>
    <select id='target_align_lr'>
      <option value='l'>l</option>
      <option value='c'>c</option>
      <option value='r'>r</option>
    </select>

    offset: [
    <input type='offset' id='offset1' defaultValue='0' size='2'/>
    ,
    <input type='offset' id='offset2' defaultValue='0' size='2'/>
    ]

    overflow:
    <label>adjustX:
      <input type='checkbox' id='adjustX'/>
    </label>
    <label>adjustY:
      <input type='checkbox' id='adjustY'/>
    </label>

    <button id='align' onClick={align}>align</button>
    <br/>

    <div style={{width:180,height:180,overflow:'auto',border:'1px solid green'}}>
      <div style={{background:'yellow',width:100,height:100,margin:100}} id='target'>
        target node
      </div>

      <div style={{background:'red',width:50,height:50,position:'absolute',top:-9999,left:-9999,position:'relative'}} id='source'>
      </div>
    </div>
  </div>
</div>);

React.render(div, document.getElementById('__react-content'));
