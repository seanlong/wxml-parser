var assert = require('assert')
var parser = require('../index.js')

function assertObject(result, expect) {
  return assert.equal(JSON.stringify(result), JSON.stringify(expect))
}

describe('Data binding', function() {

  describe('Simple binding', function() {

    it('data content', function() {
      var data = {
        message: 'Hello MINA!'
      }
      var input = `
        <view> {{ message }} </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              "Hello MINA!"
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('data content no single root', function() {
      var data = {
        message: 'Hello MINA!'
      }
      var input = `
        <view> {{ message }} </view>
        <view> {{ message }} </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              "Hello MINA!"
            ]
          },
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              "Hello MINA!"
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('widget attribute', function() {
      var data = {
        id: 0
      }
      var input = `
        <view id="item-{{id}}"> </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {
              "id": "item-0"
            },
            "children": []
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('control attribute: true', function() {
      var data = {
        condition: true
      }
      var input = `
        <view wx:if="{{condition}}"> </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {
              "wx:if": true
            },
            "children": []
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('control attribute: false', function() {
      var data = {
        condition: false
      }
      var input = `
        <view wx:if="{{condition}}"> </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": []
      }
      assertObject(parser(input, data), expect)
    });

  })


  describe('Computation', function() {

    it('ternary operation', function() {
      var data = {
        flag: 1
      }
      var input = `
        <view hidden="{{flag ? true : false}}"> Hidden </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {
              "hidden": true
            },
            "children": [
              "Hidden"
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('arithmetic operation', function() {
      var data = {
        a: 1,
        b: 2,
        c: 3
      }
      var input = `
        <view> {{a + b}} + {{c}} + d </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              "3 + 3 + d"
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('logical operation', function() {
      var data = {
        length: 4
      }
      var input = `
        <view wx:if="{{length > 5}}"> </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": []
      }
      assertObject(parser(input, data), expect)
    });

    it('string operation', function() {
      var data = {
        name: 'MINA'
      }
      var input = `
        <view>{{"hello" + name}}</view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              "helloMINA"
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

  })

  describe('Compositing', function() {

    it('array', function() {
      var data = {
        zero: 0
      }
      var input = `
        <view wx:for="{{[zero, 1, 2, 3, 4]}}"> {{item}} </view>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              0
            ]
          },
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              1
            ]
          },
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              2
            ]
          },
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              3
            ]
          },
          {
            "tag": "wx-view",
            "attr": {},
            "children": [
              4
            ]
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    it('object', function() {
      var data = {
        a: 1,
        b: 2
      }
      var input = `
        <xxx is="objectCombine" data="{{foo: a, bar: b}}"></xxx>
      `
      var expect = {
        "tag": "wx-body",
        "attr": {},
        "children": [
          {
            "tag": "wx-xxx",
            "attr": {
              "is": "objectCombine",
              "data": {
                "foo": 1,
                "bar": 2
              }
            },
            "children": []
          }
        ]
      }
      assertObject(parser(input, data), expect)
    });

    // TODO add babel eval transform support
    // it('object expand', function() {
    //   var data = {
    //     obj1: {
    //       a: 1,
    //       b: 2
    //     }
    //   }
    //   var input = `
    //     <xxx is="objectCombine" data="{{...obj1, e: 5}}"></xxx>
    //   `
    //   var expect = {
    //   }
    //   console.log(JSON.stringify(parser(input, data)))
    //   assertObject(parser(input, data), expect)
    // });

  })

});