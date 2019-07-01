webpackJsonp([4],{

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Demo = function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      sy: 't',
      sx: 'l',
      overflowAdjust: false
    }, _this.onChangeY = function (_ref2) {
      var value = _ref2.target.value;

      _this.setState({ sy: value });
    }, _this.onChangeX = function (_ref3) {
      var value = _ref3.target.value;

      _this.setState({ sx: value });
    }, _this.onOverflowAdjust = function () {
      _this.setState({
        overflowAdjust: !_this.state.overflowAdjust
      });
    }, _this.onClick = function (event) {
      var _this$state = _this.state,
          sx = _this$state.sx,
          sy = _this$state.sy,
          overflowAdjust = _this$state.overflowAdjust;
      var clientX = event.clientX,
          clientY = event.clientY;


      var overflow = {};
      if (overflowAdjust) {
        overflow.adjustX = true;
        overflow.adjustY = true;
      }

      __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__src__["b" /* alignPoint */])(_this.$rect, { clientX: clientX, clientY: clientY }, {
        points: ['' + sy + sx],
        overflow: overflow,
        useCssTransform: true
      });
    }, _this.rectRef = function (ele) {
      _this.$rect = ele;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Demo, [{
    key: 'render',
    value: function render() {
      var _state = this.state,
          sx = _state.sx,
          sy = _state.sy,
          overflowAdjust = _state.overflowAdjust;


      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          null,
          'Source:',
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'select',
            { value: sy, onChange: this.onChangeY },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 't' },
              't (Top)'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 'c' },
              'c (Center)'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 'b' },
              'b (Bottom)'
            )
          ),
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
            'select',
            { value: sx, onChange: this.onChangeX },
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 't' },
              'l (Left)'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 'c' },
              'c (Center)'
            ),
            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
              'option',
              { value: 'b' },
              'r (Right)'
            )
          ),
          ' ',
          'Overflow Adjust:',
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('input', { type: 'checkbox', checked: overflowAdjust, onClick: this.onOverflowAdjust })
        ),
        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
          'div',
          {
            onClick: this.onClick,
            style: { border: '1px solid black', textAlign: 'center', margin: 20, padding: '150px 0' }
          },
          __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement('div', {
            ref: this.rectRef,
            style: {
              background: 'red',
              position: 'fixed',
              width: 50,
              height: 50,
              transition: 'all 0.5s'
            }
          }),
          'Click me please!'
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ })

},[38]);
//# sourceMappingURL=point.js.map