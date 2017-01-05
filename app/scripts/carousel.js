;
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser globals
    global.carousel = factory();
  }
}(this, function() {

  var carousel = {};

  /* 配置属性 */
  var cfg = {
    el: '.carousel',
    item: 1
  };

  /* 全局变量 */
  var carousel;
  var listWrap;
  var list;
  var items;

  function init(obj) {
    clone(cfg, obj);

    carousel = document.querySelector(cfg.el);
    items = carousel.children;

    listWrap = append('div', carousel);
    listWrap.className = 'list-wrap';

    list = append('div', listWrap);
    list.className = 'list';

    for (var i = 0, len = items.length; i < len; i++) {
      console.log(len, items[i]);
    }
  }

  /**
   * 属性赋值
   * @param {Object} des 目标属性对象
   * @param {Object} src 输入的新属性对象
   */
  function clone(des, src) {
    var prop;

    for (prop in src) {
      if (des.hasOwnProperty(prop)) {
        des[prop] = src[prop];
      }
    }
  };

  function append(tagName, parentNode) {
    var node = document.createElement(tagName);
    parentNode.appendChild(node);

    return node;
  }


  carousel.init = init;

  return carousel;
}));
