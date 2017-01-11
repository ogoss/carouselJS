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
    changeSpeed: 250,
    auto: false,
    durationSpeed: 2000,
    nav: true,
    navEl: '',
    dot: true
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

  var dotWrap;
  var dot;

  var animating; // 防止多次触发click事件

  var eventArrs = [
    'onInit', 'onChange', 'onChanged'
  ];

  /**
   * 初始化
   * @param {Object} params 自定义参数
   */
  function init(params) {
    var i, len, child, childLen, dotStr;
    var prevFrag = document.createDocumentFragment();
    var nextFrag = document.createDocumentFragment();

    copy(cfg, params);

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
    toPosition(position, 0);

    // for (i = 0; i < itemShow; i++) {
    //   origin[i].className += ' active';
    // }

    // 添加nav
    if (cfg.nav) {
      addNav();
    }

    // 添加dot 
    if (cfg.dot) {
      dotWrap = append('div', carousel);
      dotWrap.className = 'list-dot';
      dot = dotWrap.children;
      for (i = 0; i < originLen; i++) {
        addDot();
      }
    }
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

  function addNav() {
    navWrap = append('div', carousel, cfg.navEl || '<div class="prev">prev</div><div class="next">next</div>');
    navWrap.className = 'list-nav';
    document.querySelector('.prev').addEventListener('click', function(e) {
      e.preventDefault();
      toPrev();
    }, false);
    document.querySelector('.next').addEventListener('click', function(e) {
      e.preventDefault();
      toNext();
    }, false);
  }

  function addDot() {
    var current = append('span', dotWrap);
    current.className += 'dot';
    current.addEventListener('click', function(e) {
      e.preventDefault();
      toPosition(index(dot, current) + 1, cfg.changeSpeed);
    }, false);
  }

  function index(elementObj, currentNode) {
    var nodeList = Array.prototype.slice.call(elementObj);

    return nodeList.indexOf(currentNode);
  }

  function translate(t) {
    list.style.transform = 'translate3d(-' + width * position * itemShow + 'px, 0px, 0px)';
    list.style.transition = t + 'ms';
  }

  function fixLoop() {
    if (position === totalLen - 1) {
      position = 1;
      translate(0);
    } else if (position === 0) {
      position = totalLen - 2;
      translate(0);
    }

    toggleClass();

    animating = false;
  }

  function toNext() {
    if (!animating) {
      toPosition(++position, cfg.changeSpeed);
    }
    animating = true;
  }

  function toPrev() {
    if (!animating) {
      toPosition(--position, cfg.changeSpeed);
    }
    animating = true;
  }

  function toPosition(index, t) {
    position = index;
    translate(t);
    setTimeout(fixLoop, t);
  }

  function toggleClass() {
    for (var i = 0, len = originLen; i < len; i++) {
      if (cfg.dot) {
        dot[i].classList.remove('active');
      }
      origin[i].classList.remove('active');
    }

    if (cfg.dot) {
      dot[position - 1].className += ' active';
    }
    origin[position - 1].className += ' active';
  }

  carousel.init = init;

  return carousel;
}));
