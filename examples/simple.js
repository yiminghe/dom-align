webpackJsonp([1],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(189);


/***/ },

/***/ 189:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var ReactDOM = __webpack_require__(43);
	
	function $id(id) {
	  return document.getElementById(id);
	}
	
	function $val(sel) {
	  sel = $id(sel);
	  return sel.value;
	}
	
	var domAlign = __webpack_require__(33);
	
	function align() {
	  domAlign($id('source'), $id('target'), {
	    points: [$val('source_align_tb') + $val('source_align_lr'), $val('target_align_tb') + $val('target_align_lr')],
	    offset: [$val('offset1'), $val('offset2')],
	    targetOffset: [$val('targetOffset1'), $val('targetOffset2')],
	    overflow: {
	      adjustX: $id('adjustX').checked,
	      adjustY: $id('adjustY').checked
	    },
	    useCssRight: $id('useCssRight').checked,
	    useCssBottom: $id('useCssBottom').checked,
	    useCssTransform: $id('useCssTransform').checked
	  });
	}
	
	var div = React.createElement(
	  'div',
	  null,
	  React.createElement(
	    'h1',
	    null,
	    'dom-align'
	  ),
	  React.createElement(
	    'div',
	    null,
	    'source:',
	    React.createElement(
	      'select',
	      { id: 'source_align_tb' },
	      React.createElement(
	        'option',
	        { value: 't' },
	        't'
	      ),
	      React.createElement(
	        'option',
	        { value: 'c' },
	        'c'
	      ),
	      React.createElement(
	        'option',
	        { value: 'b' },
	        'b'
	      )
	    ),
	    React.createElement(
	      'select',
	      { id: 'source_align_lr' },
	      React.createElement(
	        'option',
	        { value: 'l' },
	        'l'
	      ),
	      React.createElement(
	        'option',
	        { value: 'c' },
	        'c'
	      ),
	      React.createElement(
	        'option',
	        { value: 'r' },
	        'r'
	      )
	    ),
	    '\xA0 target:',
	    React.createElement(
	      'select',
	      { id: 'target_align_tb' },
	      React.createElement(
	        'option',
	        { value: 't' },
	        't'
	      ),
	      React.createElement(
	        'option',
	        { value: 'c' },
	        'c'
	      ),
	      React.createElement(
	        'option',
	        { value: 'b' },
	        'b'
	      )
	    ),
	    React.createElement(
	      'select',
	      { id: 'target_align_lr' },
	      React.createElement(
	        'option',
	        { value: 'l' },
	        'l'
	      ),
	      React.createElement(
	        'option',
	        { value: 'c' },
	        'c'
	      ),
	      React.createElement(
	        'option',
	        { value: 'r' },
	        'r'
	      )
	    ),
	    '\xA0 offset: [',
	    React.createElement('input', { type: 'offset', id: 'offset1', defaultValue: '0', size: '3' }),
	    ',',
	    React.createElement('input', { type: 'offset', id: 'offset2', defaultValue: '0', size: '3' }),
	    '] \xA0 targetOffset: [',
	    React.createElement('input', { type: 'offset', id: 'targetOffset1', defaultValue: '0', size: '3' }),
	    ',',
	    React.createElement('input', { type: 'offset', id: 'targetOffset2', defaultValue: '0', size: '3' }),
	    '] \xA0 overflow: \xA0',
	    React.createElement(
	      'label',
	      null,
	      'adjustX:',
	      React.createElement('input', { type: 'checkbox', id: 'adjustX' })
	    ),
	    '\xA0',
	    React.createElement(
	      'label',
	      null,
	      'adjustY:',
	      React.createElement('input', { type: 'checkbox', id: 'adjustY' })
	    ),
	    '\xA0',
	    React.createElement(
	      'label',
	      null,
	      'useCssBottom:',
	      React.createElement('input', { type: 'checkbox', id: 'useCssBottom' })
	    ),
	    '\xA0',
	    React.createElement(
	      'label',
	      null,
	      'useCssRight:',
	      React.createElement('input', { type: 'checkbox', id: 'useCssRight' })
	    ),
	    '\xA0',
	    React.createElement(
	      'label',
	      null,
	      'useCssTransform:',
	      React.createElement('input', { type: 'checkbox', id: 'useCssTransform', defaultChecked: !!window.TransitionEvent })
	    ),
	    '\xA0',
	    React.createElement(
	      'button',
	      { id: 'align', onClick: align },
	      'align'
	    ),
	    React.createElement('br', null),
	    React.createElement(
	      'div',
	      {
	        style: {
	          width: 400,
	          height: 400,
	          overflow: 'auto',
	          border: '1px solid green',
	          position: 'relative'
	        }
	      },
	      React.createElement(
	        'div',
	        {
	          style: {
	            background: 'yellow',
	            width: 240,
	            height: 240,
	            margin: 50
	          },
	          id: 'target'
	        },
	        'target node'
	      ),
	      React.createElement('div', { style: { width: 1000, height: 1000 } }),
	      React.createElement(
	        'div',
	        {
	          style: {
	            background: 'red',
	            width: 50,
	            height: 50,
	            left: 0,
	            top: 0,
	            position: 'absolute',
	            transition: 'all 0.5s'
	          },
	          id: 'source'
	        },
	        'source node'
	      )
	    )
	  )
	);
	
	ReactDOM.render(div, $id('__react-content'));

/***/ }

});
//# sourceMappingURL=simple.js.map