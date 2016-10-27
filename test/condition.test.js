var assert = require('assert')
var parser = require('../index.js')

function assertObject(result, expect) {
  return assert.equal(JSON.stringify(result), JSON.stringify(expect))
}

describe('Conditional rendering', function() {

  it('wx:if', function() {
    var data = {
      condition: 'true'
    }
    var input = `
      <view wx:if="{{condition}}"> True </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {
            "wx:if": "true"
          },
          "children": [
            "True"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('wx:if/else', function() {
    var data = {
      length: 7
    }
    var input = `
      <view wx:if="{{length > 5}}"> 1 </view>
      <view wx:else> 3 </view>
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
          "children": [
            "1"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('wx:if/else embedding', function() {
    var data = {
      length: 7
    }
    var input = `
      <view wx:if="{{length > 10}}"> 1 </view>
      <view wx:else>
        3
        <view wx:if="{{length > 5}}"> 4 </view>
        <view wx:else> 5 </view>
      </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {
            "wx:else": ""
          },
          "children": [
            "3",
            {
              "tag": "wx-view",
              "attr": {
                "wx:if": true
              },
              "children": [
                "4"
              ]
            }
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('wx:if/elif/else', function() {
    var data = {
      length: 3
    }
    var input = `
      <view wx:if="{{length > 5}}"> 1 </view>
      <view wx:elif="{{length > 2}}"> 2 </view>
      <view wx:else> 3 </view>
    `
    var expect = {
      "tag": "wx-body",
      "attr": {},
      "children": [
        {
          "tag": "wx-view",
          "attr": {
            "wx:elif": true
          },
          "children": [
            "2"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

  it('block wx:if', function() {
    var data = {}
    var input = `
      <block wx:if="{{true}}">
        <view> view1 </view>
        <view> view2 </view>
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
            "view1"
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "view2"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });


  it('block wx:else', function() {
    var data = {}
    var input = `
      <block wx:if="{{false}}">
        <view> view1 </view>
        <view> view2 </view>
      </block>
      <block wx:else>
        <view> view3 </view>
        <view> view4 </view>
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
            "view3"
          ]
        },
        {
          "tag": "wx-view",
          "attr": {},
          "children": [
            "view4"
          ]
        }
      ]
    }
    assertObject(parser(input, data), expect)
  });

})