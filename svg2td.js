#!/usr/bin/env node
var file = process.argv[2];
var fs = require('fs');
var elements = JSON.parse(fs.readFileSync(__dirname + '/svg.json'));
var EasySax = require('easysax');

function onStartNode (elem, attr, uq, tagend, get_str) {
	var a = clean(elem, attr());
	var id = '';
	if (a && a.id) {
		id = '#' + a.id;
	}
	a && delete a.id;
	var s = (elem !== 'svg' ? ',\n[\'svg:' + elem : '[\'svg') + id + "'";
	if (a) {
		s += ', ' + JSON.stringify(a, null, '\t');// + (tagend ? '' : ',\n');
	}
	process.stdout.write(s);
}

function onError () {
	process.stdout.write('ERROR')
}
function onEndNode () {
	console.log(']')
}
function onTextNode () {}
function onCDATA () {}

var parser = new EasySax();

parser.on('error', onError);
parser.on('startNode', onStartNode);
parser.on('endNode', onEndNode);
parser.on('textNode', onTextNode);
parser.on('cdata', onCDATA);


fs.readFile(file, function (err, buf) {
	parser.parse(buf.toString());
})

function clean (key, obj) {
	if (typeof obj !== 'object') return;
    var o = {};
    Object.keys(obj).forEach(function (k) {
        if (elements[key].indexOf(k) > -1) {
            o[k] = obj[k];
        }
    });
    return o;
}
