# webapp utils

## 使用方法
```
/* 使用npm */
npm install --save webapp-utils
```
```
/* 使用bower */
bower install --save webapp-utils
```
```
/* 网页直接调用 */
<link rel="stylesheet" href="dist/orient.min.css">
<script src="dist/utils.min.js"></script>
```

## 本地测试

- 安装依赖

```
npm install
```

- 启动服务

```
npm start
```

- 项目发布

```
npm run dist
```

## 方法调用

- AJAX封装

``` javascript
/**
 * 若未使用jQuery等库，可使用此AJAX实例
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {String} type 返回值类型
 * @param {Function} callback 回调函数
 * @param {Boolean} [async=true] 是否异步
 */
utils.ajax.get(url, data, type, callback, async);
utils.ajax.post(url, data, type, callback, async);
utils.ajax.jsonp(url, data, callback);
```

- 获取手机操作系统

``` javascript
/**
 * @returns {String} ['Windows Phone' || 'Android' || 'iOS' || 'unknown']
 */
utils.getMobileOperatingSystem();
```

- 队列加载图片

``` javascript
/**
 * @param {Array} res 图片URL数组
 * @param {Number} [start=0] 起始值
 * @param {Number} [total=res.length] 总数
 * @param {Function} onLoadStart 加载开始回调函数
 * @param {Function} onLoading 加载中回调函数
 * @param {Function} onLoadEnd 加载结束回调函数
 */
utils.queue(res, start, total, onLoadStart, onLoading, onLoadEnd);
/**
 * 加载回调函数
 */
onLoadStart(res, start, total);
onLoading(res, start, total);
onLoadEnd(res, start, total);
```

- 数字前补0

``` javascript
/**
 * @param {Number} num 需要补齐的数字
 * @param {Number} length 总位数
 * @return {String}
 */
utils.prefixInteger(num, length);
```

- 验证是否是函数

``` javascript
/**
 * @param {Object} functionToCheck [description]
 * @return {Boolean}
 */
utils.isFunction(functionToCheck);
```

- 监测屏幕是否横屏

``` javascript
/**
 * @param  {Function} landscapeFunc 横屏回调函数
 * @param  {Function} portraitFunc  竖屏回调函数
 */
utils.detectOrient(landscapeFunc, portraitFunc)
```
- 获取url的参数值

``` javascript
/**
 * @param {String} strParamName 参数名
 * @param {String} url url地址
 * @return 参数值
 */
```
utils.getURLParam(strParamName, url);