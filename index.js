'use strict';

function XML2DataTree(root, context, newRoot, layerOps, layerIdx) {
	if (!newRoot)
		newRoot = { tag: 'body', children: [] };
	else if (!newRoot.children)
		throw new Error('cannot add child to leaf node');

	if (!root.attributes && root.nodeType == 3) {
		var newNode = parseTextNode(root, context);
	} else {
		var newNode = parseElementNode(root, context, layerOps, layerIdx);
	}
	if (newNode == null)
		return;

	if (newNode.tag !== 'wx-block') {
		if (newNode.items && newNode.array && newNode.array.length)
			newNode.array.forEach(n => newRoot.children.push(n));
		else
			newRoot.children.push(newNode);
	}
	var newLayerOps = [];
	var newLayerIdx = 0;
	for (var i = 0; i < root.childNodes.length; ++i) {
		var child = root.childNodes[i];
		if (child.nodeType != 1 && child.nodeType != 3)
			continue;
		if (child.nodeType == 3 && !child.nodeValue.trim().length)
			continue;
		if (newNode.items && newNode.array && newNode.array.length) {
			newNode.array.forEach((n, idx) => {
				n = n.tag === 'wx-block' ? newRoot : n;
				var newContext = JSON.parse(JSON.stringify(context));
				newContext['item'] = newNode.items[idx];
				newContext['index'] = idx;
				return XML2DataTree(child, newContext, n, newLayerOps, newLayerIdx++)
			});
		} else {
			newNode = newNode.tag === 'wx-block' ? newRoot : newNode;
			XML2DataTree(child, context, newNode, newLayerOps, newLayerIdx++);
		}
	}

	return newRoot;
}

function parseTextNode(node, data) {
	return stringEvaluate(node.nodeValue.trim(), data, false);
}

function parseElementNode(node, data, layerOps, layerIdx) {
	var ret = {};
	ret.tag = 'wx-' + (node.tagName == 'IMG' ? 'image' : node.tagName.toLowerCase());
	ret.attr = {};
	ret.children = [];
	for (var i = 0; i < node.attributes.length; ++i) {
		var attr = node.attributes[i];
		var value = stringEvaluate(attr.value.trim(), data, attr.name === 'data');
		if (attr.name.split('-').length > 1) {
			var newAttrName = attr.name.split('-')
				.map((p, i) => i != 0 ? p[0].toUpperCase() + p.substring(1) : p)
				.join('');
			ret.attr[newAttrName] = value;
		} else {
			ret.attr[attr.name] = value;
		}
		if (attr.name.startsWith('wx:')) {
			ret = processWxAttribute(attr.name, ret, layerOps, layerIdx);
			if (!ret)
				break;
		}
	}
	return ret;
}

function processWxAttribute(name, node, operations, idx) {
	switch (name) {
		case 'wx:if':
			var condition = !!node.attr[name];
			operations[idx] = ['if', condition];
			if (condition == false)
				return;
			break;
		case 'wx:elif':
			var condition = !!node.attr[name];
			operations[idx] = ['elif', condition];
			if (operations[idx-1] == undefined || operations[idx-1][0] != 'if')
				throw new Error('no corresponding wx:if found');
			if (operations[idx-1][1] == true || condition == false)
				return;
			break;
		case 'wx:else':
			if (operations[idx-1] == undefined || (operations[idx-1][0] != 'if' && operations[idx-1][0] != 'elif'))
				throw new Error('no corresponding wx:if/elif found');
			if (operations[idx-1][1] == true || (operations[idx-1][0] == 'elif' && operations[idx-2][1] == true))
				return;
			break;
		case 'wx:for':
			var items = Array.isArray(node.attr[name]) ? node.attr[name] : [];
			delete node.attr[name];
			node = {
				items: items,
				array: items.map(i => { return { tag: node.tag, attr: node.attr, children: [] } })
			};
			break;
	}
	return node;
}

function stringEvaluate(str, data, toObject) {
	if (str.match(/^{{[^{}]+}}$/)) {
		return mustacheEvaluate(str.replace(/^{{/, '').replace(/}}$/, ''), data, toObject);
	} else {
		return str.replace(
			/({{[^{}]+}})/g,
			v => mustacheEvaluate(v.replace(/^{{/, '').replace(/}}$/, ''), data, toObject));
	}
}

function mustacheEvaluate(str, data, toObject) {
	var s = '(function() { ';
	for (var k in data) {
		s += 'var ' + k + ' = JSON.parse(\'' + JSON.stringify(data[k]) + '\');';
	}
	s += 'return ';
	var exp = toObject ? s + '{' + str + '}})()' : s + str + '})()';
	try {
		var ret = eval(exp);
	} catch (e) {
		console.log(exp)
		console.error(e)
	}
	return ret;
}

function parser(input, data) {
  	var doc = new DOMParser().parseFromString(input, 'text/html');
  	var tree = XML2DataTree(doc.body, data, null, []);
  	return tree.children[0];
}

module.exports = parser;