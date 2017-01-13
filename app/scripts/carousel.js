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
  var MIN_SPEED = 250;

  /* 配置属性 */
  var cfg = {
    el: '.carousel', // 元素类名、id或标签名
    speed: MIN_SPEED, // 滑动速度
    auto: false, // 是否自动播放
    duration: 3000, // 自动播放间隔
    hoverPause: false, // 鼠标划入停止自动播放
    nav: true, // 是否有nav按钮
    navEl: '', // 自定义nav样式
    dot: true // 是否有dot按钮
  };

  var itemShow = 1;

  /* 全局变量 */
  var carouselWrap; // carousel外部wrap

  var listWrap; // list外部wrap
  var list;

  var total; // 所有item
  var totalLen;
  var origin; // 原始item
  var originLen;
  var clones; // 克隆item
  var clonesLen;

  var width; // 单个item宽度
  var position; // 当前位置

  var navWrap; // nav外部wrap

  var dotWrap; // dot外部wrap
  var dot; // 所有dot

  var animating; // 防止多次触发click事件
  var hovered; // 鼠标是否移入
  var autoTimer; // 自动滑动计时器

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

    if (cfg.speed < MIN_SPEED) {
      fg.speed = MIN_SPEED;
    }
    if (cfg.duration <= cfg.speed) {
      cfg.duration = cfg.speed + 500;
    }

    // 复制左右两边补足项
    carouselWrap = document.querySelector(cfg.el);
    child = carouselWrap.children;
    childLen = child.length;

    for (i = 0, len = childLen; i < len; i++) {
      child[i].className += ' item';
    }

    for (i = 0, len = itemShow; i < len; i++) {
      prevFrag.appendChild(clone(child[childLen - len + i]));
      nextFrag.appendChild(clone(child[i]));
    }

    carouselWrap.appendChild(nextFrag);
    carouselWrap.insertBefore(prevFrag, carouselWrap.firstChild);

    // 获取total,origin和clones
    total = carouselWrap.querySelectorAll('.item');
    totalLen = total.length;
    origin = carouselWrap.querySelectorAll('.item:not(.cloned)');
    originLen = origin.length;
    clones = carouselWrap.querySelectorAll('.cloned');
    clonesLen = clones.length;

    // 添加list
    listWrap = append('div', carouselWrap);
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

    // 添加nav
    if (cfg.nav) {
      addNav();
    }

    // 添加dot 
    if (cfg.dot) {
      dotWrap = append('div', carouselWrap);
      dotWrap.className = 'list-dot';
      dot = dotWrap.children;
      for (i = 0; i < originLen; i++) {
        addDot();
      }
    }

    // 初始化自动播放
    if (cfg.auto) {
      autoPlay();
      if (cfg.hoverPause) {
        hoverToggleStatus();
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

  /**
   * 添加元素
   * @param {String} tagName 元素标签名
   * @param {Element Object} parentNode 父元素对象
   * @param {String} innerStr 内部内容
   * @return {Element Object} 添加后的元素对象
   */
  function append(tagName, parentNode, innerStr) {
    var node = document.createElement(tagName);
    if (innerStr) {
      node.innerHTML = innerStr;
    }
    parentNode.appendChild(node);

    return node;
  }

  /**
   * 克隆元素
   * @param {Element Object} originNode 原始元素对象
   * @return {Element Object} 克隆后的元素对象
   */
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

  /**
   * 添加nav
   */
  function addNav() {
    navWrap = append('div', carouselWrap, cfg.navEl || '<div class="prev">prev</div><div class="next">next</div>');
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

  /**
   * 添加dot
   */
  function addDot() {
    var current = append('span', dotWrap);
    current.className += 'dot';
    current.addEventListener('click', function(e) {
      e.preventDefault();

      eventPlay(getIndex(dot, current) + 1);
    }, false);
  }

  /**
   * 获取当前元素index
   * @param {Element Object} elementObj  元素对象集合
   * @param {Element Ojbect} currentNode 当前元素
   * @return {Number} index
   */
  function getIndex(elementObj, currentNode) {
    var nodeList = Array.prototype.slice.call(elementObj);

    return nodeList.indexOf(currentNode);
  }

  function translate(t) {
    list.style.transform = 'translate3d(-' + width * position * itemShow + 'px, 0px, 0px)';
    list.style.transition = t + 'ms';
  }

  /**
   * 循环轮播修复
   */
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

  /**
   * 滑动到前一个item
   */
  function toPrev() {
    if (!animating) {
      eventPlay(--position);
    }
    animating = true;
  }

  /**
   * 滑动到后一个item
   */
  function toNext() {
    if (!animating) {
      eventPlay(++position);
    }
    animating = true;
  }

  /**
   * 滑动到特定index
   * @param {Number} index 特定index
   * @param {时间} t 滑动时间
   */
  function toPosition(index, t) {
    position = index;
    translate(t);
    setTimeout(fixLoop, t);
  }

  /**
   * 设置当前item的class为acitve
   */
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

  /**
   * 自动滑动
   */
  function autoPlay() {
    autoTimer = setInterval(play, cfg.duration);

    function play() {
      toPosition(++position, cfg.speed);
    }
  }

  /**
   * 事件触发滑动
   * @param {Number} index 滑动到特定index
   */
  function eventPlay(index) {
    if (cfg.auto) {
      clearInterval(autoTimer);
      if (!hovered) {
        autoPlay();
      }
    }
    toPosition(index, cfg.speed);
  }

  /**
   * 鼠标移入移出切换自动播放状态
   */
  function hoverToggleStatus() {
    carouselWrap.addEventListener('mouseenter', function() {
      hovered = true;
      clearInterval(autoTimer);
    }, false);

    carouselWrap.addEventListener('mouseleave', function() {
      hovered = false;
      autoPlay();
    }, false);
  }

  carousel.init = init;

  return carousel;
}));
