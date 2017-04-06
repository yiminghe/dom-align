webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var React = __webpack_require__(2);
	var domAlign = __webpack_require__(33);
	var ReactDOM = __webpack_require__(43);
	
	var Test = React.createClass({
	  displayName: 'Test',
	  align: function align() {
	    var ret = domAlign(this.refs.source, this.refs.target, {
	      points: ['bl', 'bl'],
	      overflow: {
	        adjustY: 1
	      }
	    });
	    console.log(ret);
	  },
	  render: function render() {
	    window.align = this.align;
	    return React.createElement(
	      'div',
	      { style: { height: 1000 } },
	      React.createElement(
	        'button',
	        { ref: 'target' },
	        'target'
	      ),
	      React.createElement('div', { style: { height: 100 } }),
	      React.createElement(
	        'button',
	        { onClick: this.align },
	        'align'
	      ),
	      React.createElement(
	        'div',
	        {
	          ref: 'source',
	          style: { position: 'absolute', width: 100, height: 200, border: '1px solid red' }
	        },
	        'oo'
	      )
	    );
	  }
	});
	
	ReactDOM.render(React.createElement(Test, null), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=fail.js.map