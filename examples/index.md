# dom-align@1.x
---


source: <select id='source_align_tb'>
<option value='t'>t</option>
<option value='c'>c</option>
<option value='b'>b</option>
</select> <select id='source_align_lr'>
<option value='l'>l</option>
<option value='c'>c</option>
<option value='r'>r</option>
</select>

target: <select id='target_align_tb'>
<option value='t'>t</option>
<option value='c'>c</option>
<option value='b'>b</option>
</select> <select id='target_align_lr'>
<option value='l'>l</option>
<option value='c'>c</option>
<option value='r'>r</option>
</select>

offset: [ <input type='offset' id='offset1' value='0' size=2/>, <input type='offset' id='offset2' value='0' size=2/> ]

overflow: <label>adjustX: <input type='checkbox' id='adjustX'/></label> <label>adjustY: <input type='checkbox' id='adjustY'/></label>

<button id='align'>align</button>
<br>


````html
<div style='width:180px;height:180px;overflow:auto;border:1px solid green;'>
<div style='background:yellow;width:100px;height:100px;margin:100px;' id='target'>
target node
</div>

<div style='background:red;width:50px;height:50px;position:absolute;top:-9999px;left:-9999px;position:relative;' id='source'>
</div>
</div>
````

````js
function selectVal(sel){
  sel = document.getElementById(sel);
  return sel.value;
}
var domAlign = require('../');
document.getElementById('align').onclick = function(){
  domAlign(document.getElementById('source'),document.getElementById('target'),{
    points: [selectVal('source_align_tb')+selectVal('source_align_lr'), selectVal('target_align_tb')+selectVal('target_align_lr')],
    offset: [parseInt(document.getElementById('offset1').value), parseInt(document.getElementById('offset2').value)],
    overflow: {
      adjustX: document.getElementById('adjustX').checked,
      adjustY: document.getElementById('adjustY').checked
    }
  });
};
````