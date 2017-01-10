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
    el: '.carousel'
  };
  var itemShow = 1;

  /* 全局变量 */
  var carousel;

  var listWrap;
  var list;

  var total; // 所有item
  var totalLen;
  var origin; // 原始item
  var originLen;
  var clones; // 克隆item
  var clonesLen;

  var width; // 单个item宽度
  var position; // 当前位置

  var navWrap;
  var navPrev;
  var navNext;

  var dotWrap;
  var animating; // 防止多次触发click事件

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

    for (i = 0, len = itemShow; i < len; i++) {
      prevFrag.appendChild(clone(child[childLen - len + i]));
      nextFrag.appendChild(clone(child[i]));
    }

    carousel.appendChild(nextFrag);
    carousel.insertBefore(prevFrag, carousel.firstChild);

    // 获取total,origin和clones
    total = carousel.querySelectorAll('.item');
    totalLen = total.length;
    origin = carousel.querySelectorAll('.item:not(.cloned)');
    originLen = origin.length;
    clones = carousel.querySelectorAll('.cloned');
    clonesLen = clones.length;

    listWrap = append('div', carousel);
    listWrap.className = 'list-wrap';
    list = append('div', listWrap);
    list.className = 'list';

    // item移动至list
    for (i = 0; i < totalLen; i++) {
      total[i].style.width = listWrap.offsetWidth / itemShow + 'px';
      list.appendChild(total[i]);
    }

    // 初始化list宽度,位置
    position = 1;
    width = listWrap.offsetWidth / itemShow;
    list.style.width = width * (originLen + clonesLen) + 'px';
    translate(0);

    for (i = 0; i < itemShow; i++) {
      origin[i].className += ' active';
    }

    // 添加nav
    navWrap = append('div', carousel, '<div class="prev">prev</div><div class="next">next</div>');
    navWrap.className = 'list-nav';
    onNavClick();

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

  function onNavClick() {
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
  }

  function onDotClick() {

  }

  function fixLoop() {
    if (position === totalLen - 1) {
      position = 1;
      translate(0);
    } else if (position === 0) {
      position = totalLen - 2;
      translate(0);
    }
    animating = false;
  }

  function toNext() {
    if (!animating) {
      position++;
      translate(0.25);
      setTimeout(fixLoop, 250);
    }
    animating = true;
  }

  function toPrev() {
    if (!animating) {
      position--;
      translate(0.25);
      setTimeout(fixLoop, 250);
    }
    animating = true;
  }

  function translate(t) {
    list.style.transform = 'translate3d(-' + width * position * itemShow + 'px, 0px, 0px)';
    list.style.transition = t + 's';
  }

  carousel.init = init;

  return carousel;
}));
