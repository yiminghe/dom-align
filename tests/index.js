import $ from 'jquery';

$('<style>html,body {padding:0;margin:0;border:none;}</style>').appendTo(
  document.getElementsByTagName('head'),
);

require('./basic');
require('./point');
