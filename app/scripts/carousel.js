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
  var items; // 原始item
  var itemsLen;
  var clones; // 克隆item
  var clonesLen;
  var width; // 单个item宽度
  
  var position; // 当前位置

  var navWrap;
  var navPrev;
  var navNext;

  var dotWrap;

  function init(obj) {
    var i, len, child, childLen;
    var prevFrag = document.createDocumentFragment();
    var nextFrag = document.createDocumentFragment();

    copy(cfg, obj);

    // 复制左右两边补足项
    carousel = document.querySelector(cfg.el);
    child = carousel.children;
    childLen = child.length;

    for (i = 0, len = childLen; i < len; i++) {
      child[i].className += ' item';
    }

    for (i = 0, len = cfg.item; i < len; i++) {
      prevFrag.appendChild(clone(child[childLen - len + i]));
      nextFrag.appendChild(clone(child[i]));
    }

    carousel.appendChild(nextFrag);
    carousel.insertBefore(prevFrag, carousel.firstChild);

    // 获取items和clones
    items = carousel.querySelectorAll('.item:not(.cloned)');
    itemsLen = items.length;
    clones = carousel.querySelectorAll('.cloned');
    clonesLen = clones.length;

    // 添加外部wrap
    listWrap = append('div', carousel);
    listWrap.className = 'list-wrap';
    list = append('div', listWrap);
    list.className = 'list';

    // items移动至外部wrap
    for (i = 0; i < (itemsLen + clonesLen); i++) {
      child[0].style.width = listWrap.offsetWidth / cfg.item + 'px';

      list.appendChild(child[0]);
    }

    // 初始化list宽度,位置
    width = listWrap.offsetWidth / cfg.item;
    list.style.width = width * (itemsLen + clonesLen) + 'px';
    list.style.transform = 'translate3d(-' + width * clonesLen / 2 + 'px, 0px, 0px)';
    list.style.transition = '0s';

    // 添加nav
    navWrap = append('div', carousel, '<div class="prev">prev</div><div class="next">next</div>');
    navWrap.className = 'list-nav';
    navPrev = document.querySelector('.prev');
    navNext = document.querySelector('.next');
    navPrev.addEventListener('click', function(e) {
      e.preventDefault();
      toPrev();
    }, false);
    navNext.addEventListener('click', function(e) {
      e.preventDefault();
      toNext();
    }, false);

    // 添加dot 
    navWrap = append('div', carousel, '<span class="dot active"></span><span class="dot"></span><span class="dot"></span>');
    navWrap.className = 'list-dot';
  }

  /**
   * 属性复制
   * @param {Object} des 目标属性对象
   * @param {Object} src 输入的新属性对象
   */
  function copy(des, src) {
    var prop;

    for (prop in src) {
      if (des.hasOwnProperty(prop)) {
        des[prop] = src[prop];
      }
    }
  };

  function append(tagName, parentNode, innerStr) {
    var node = document.createElement(tagName);
    if (innerStr) {
      node.innerHTML = innerStr;
    }
    parentNode.appendChild(node);

    return node;
  }

  function clone(originNode) {
    var i, len, node, idNode;
    node = originNode.cloneNode(true);
    node.className += ' cloned';
    node.removeAttribute('id');

    idNode = node.querySelectorAll('[id]');
    for (i = 0, len = idNode.length; i < len; i++) {
      idNode[i].removeAttribute('id');
    }

    return node;
  }

  function toNext() {
    list.style.transform = 'translate3d(-' + width + 'px, 0px, 0px)';
    list.style.transition = '0.25s';
  }

  function toPrev() {
    list.style.transform = 'translate3d(' + width + 'px, 0px, 0px)';
    list.style.transition = '0.25s';
  }

  carousel.init = init;

  return carousel;
}));
