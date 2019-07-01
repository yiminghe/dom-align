webpackJsonp([3],{

/***/ 1:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src___ = __webpack_require__(4);

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__src___["a" /* default */]);

/***/ }),

/***/ 14:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_dom_align__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);




var Test = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createClass({
  displayName: 'Test',
  align: function align() {
    var ret = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_dom_align__["a" /* default */])(this.refs.source, this.refs.target, {
      points: ['tl', 'bl'],
      overflow: {
        adjustY: 1,
        adjustX: 1
      }
    });
    console.log(ret);

    setTimeout(function () {
      document.body.style.overflow = 'hidden';
    }, 1000);
  },
  render: function render() {
    window.align = this.align;
    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      { style: { height: 1000 } },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'button',
        { ref: 'target', style: { position: 'absolute', right: 0, top: 300 } },
        'target'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', { style: { height: 100 } }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'button',
        { onClick: this.align },
        'align'
      ),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
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

__WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Test, null), document.getElementById('__react-content'));

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ })

},[36]);
//# sourceMappingURL=body-overflow.js.map