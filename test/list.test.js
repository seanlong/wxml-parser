var assert = require('assert')
var parser = require('../index.js')

function assertObject(result, expect) {
  return assert.equal(JSON.stringify(result), JSON.stringify(expect))
}

describe('List rendering', function() {

  it('wx:for', function() {
    var data = {
      items: [{
        message: 'foo',
      }, {
        message: 'bar'
      }]
    }
    var input = `
      <view wx:for="{{items}}">
        {{index}}: {{item.message}}
      </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "0: foo"
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "1: bar"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('wx:for-item wx:for-index', function() {
    var data = {
      array: [
        { message: 'a' },
        { message: 'b' }
      ]
    }
    var input = `
      <view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
        {{idx}}: {{itemName.message}}
      </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "0: a"
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "1: b"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('wx:for embedding', function() {
    var data = {}
    var input = `
      <view wx:for="{{[1, 2, 3]}}" wx:for-item="i">
        <view wx:for="{{[1, 2, 3]}}" wx:for-item="j">
          <view wx:if="{{i <= j}}">
            {{i}} * {{j}} = {{i * j}}
          </view>
        </view>
      </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "1 * 1 = 1"
                  ]
                }
              ]
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "1 * 2 = 2"
                  ]
                }
              ]
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "1 * 3 = 3"
                  ]
                }
              ]
            }
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            {
              "tag": "wx-view",
              "attr": {},
              "children": []
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "2 * 2 = 4"
                  ]
                }
              ]
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "2 * 3 = 6"
                  ]
                }
              ]
            }
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            {
              "tag": "wx-view",
              "attr": {},
              "children": []
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": []
            },
            {
              "tag": "wx-view",
              "attr": {},
              "children": [
                {
                  "tag": "wx-view",
                  "attr": {
                    "wx:if": true
                  },
                  "children": [
                    "3 * 3 = 9"
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('block wx:for', function() {
    var data = {}
    var input = `
      <block wx:for="{{[1, 2, 3]}}">
        <view> {{index}}: </view>
        <view> {{item}} </view>
      </block>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "0:"
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
            "1:"
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
            "2:"
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            3
          ]
        }
      ]
    }
    //console.log(JSON.stringify(parser(input, data), null, 2));
    assertObject(parser(input, data), expect)
  });

})