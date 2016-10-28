wxml-parser
=======

[![Build Status](https://travis-ci.org/seanlong/wxml-parser.svg?branch=master)](https://travis-ci.org/seanlong/wxml-parser)

## What
这是一个微信小程序[WXML](http://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/)文件的JavaScript parser实现。输出微信官方提供的native可执行文件类似的数据结构。  
该数据可以被后续微信小程序的Virtual DOM generator生成真实DOM。

目前版本支持除了模板和模板引用外的基本语法。

## Run
```
var parser = require('wxml-parser);
console.log(JSON.stringify(parser('<view> {{ message }} </view>', {message: 'Hello MINA!'}), null, 2));
```
output:
```
{
  "tag": "wx-body",
  "attr": {},
  "children": [{
    "tag": "wx-view",
    "attr": {},
    "children": ["Hello MINA!"]
  }]
}
```
## License

[MIT](LICENSE.txt)
