/*
Mlib - powered by Mathers.com.br
All rights reserveds - Copyright
*/

function loadMLiB() {
	var M = function() {
		var _arg = arguments[0];
		
		if (!(this instanceof M)) {
			return new M(_arg);
		}
		if (/\<.+\>/g.test(_arg.toString())) {
			var element = document.createElement('div');
			element.innerHTML = _arg;
			element = element.children[0];
			return M(element);
		}


		var _self = this;
		var each = function(selection, callback) {
			if (typeof selection == "string") {
				Array.prototype.forEach.call(document.querySelectorAll(selection), function(el, i) {
					callback(el, i);
				})
			} else if (selection instanceof Array) {
				selection.forEach(function(el, i) {
					callback(el, i);
				})
			} else if (selection instanceof HTMLElement || selection instanceof Element) {
				callback(selection);
			} else if (NodeList.prototype.isPrototypeOf(selection)) {
				Array.prototype.forEach.call(selection, function(el, i) {
					callback(el, i);
				})
			}
		}
		_self.hide = function() {
			each(_arg, function(elem, ind) {
				elem.style.display = "none";
			})
		}
		_self.newElement = function(tag) {
			var _newElement;
			each(_arg, function(elem) {
				_newElement = document.createElement(tag);
				elem.appendChild(_newElement)
			})
			return M(_newElement);
		}
		_self.html = function() {
			var html;
			var argumentsList = arguments;
			if (arguments.length == 1) {
				each(_arg, function(elem, ind) {
					elem.innerHTML = argumentsList[0];
				})
			} else {
				each(_arg, function(elem, ind) {
					html = elem.innerHTML;
				})
				return html;
			}
		}
		_self.outerHTML = function() {
			var outerHTML;
			each(_arg, function(elem, ind) {
				outerHTML = elem.outerHTML;
			})
			return outerHTML;
		}
		_self.style = function(style) {
			var styleReturned;
			if (typeof style == "object" && arguments.length == 1) {
				each(_arg, function(el, i) {
					for (property in style) {
						el.style[property] = style[property];
					}
				})
			} else if (typeof style == "string" && arguments.length == 1) {
				each(_arg, function(el, i) {
					styleReturned = el.style[style];
				})
				return styleReturned;
			}
		}
		_self.attrs = function(attrs) {
			var attrReturned;
			if (typeof attrs == "string") {
				each(_arg, function(el, i) {
					attrReturned = el.getAttribute(attrs);
				})
				return attrReturned;
			} else {
				each(_arg, function(el, i) {
					for (attr in attrs) {
						el.setAttribute(attr, attrs[attr]);
					}
				})
			}
		}
		_self.insertBefore = function(tag) {
			var elReturned;
			each(_arg, function(el, i) {
				var newElement = document.createElement(tag);
				el.parentNode.insertBefore(newElement, el);
				elReturned = newElement;
			})
			return M(elReturned);
		}
		_self.append = function(tag) {
			if (typeof tag == "string") {
				each(_arg, function(el, i) {
					el.innerHTML += tag;
				})
			} else if (tag instanceof HTMLElement || tag instanceof Element) {
				each(_arg, function(el, i) {
					el.appendChild(tag);
				})
			} else if (typeof tag == "object") {
				each(_arg, function(el, i) {
					el.innerHTML += tag.outerHTML();
				})
			}
		}
		_self.prepend = function(tag) {
			if (typeof tag == "string") {
				each(_arg, function(el, i) {
					el.innerHTML = tag + "" + el.innerHTML;
				})
			} else if (tag instanceof HTMLElement || tag instanceof Element) {
				each(_arg, function(el, i) {
					el.innerHTML = tag.outerHTML + "" + el.innerHTML
				})
			} else if (typeof tag == "object") {
				each(_arg, function(el, i) {
					el.innerHTML = tag.outerHTML() + '' + el.innerHTML;
				})
			}
		}
		_self.insertAfter = function(tag) {
			var elReturned;
			each(_arg, function(el, i) {
				if (/\<.+\>/g.test(tag.toString())) {
					var newElement = document.createElement('div');
					newElement.innerHTML = tag;
					newElement = newElement.children[0];
					el.parentNode.insertBefore(newElement, el.nextSibling);
					elReturned = newElement;
				} else {
					var newElement = document.createElement(tag);
					el.parentNode.insertBefore(newElement, el.nextSibling);
					elReturned = newElement;
				}
			})
			return M(elReturned);
		}
		_self.addClass = function(classes) {
			each(_arg, function(el, i) {
				el.className += classes;
			})
		}
		_self.removeClass = function(removedClass) {
			each(_arg, function(el, i) {
				var classes = el.className.split(' ');
				classes.splice(classes.indexOf(removedClass), 1)
				el.className = classes.join(' ');
			})
		}
		_self.hasClass = function(hadClass) {
			var returned;
			each(_arg, function(el, i) {
				var classes = el.className.split(' ');
				if (classes.indexOf(hadClass) == -1) {
					returned = false;
				} else {
					returned = true;
				}
			})
			return returned;
		}
		_self.eq = function(index) {
			var nthChild;
			each(_arg, function(el, i) {
				if (i == index) nthChild = el
			})
			return M(nthChild);
		}
		
		_self.last = function() {
			var lastChild;
			lastChild = document.querySelectorAll(_arg)[document.querySelectorAll(_arg).length - 1];
			return M(lastChild);
		}
		_self.first = function() {
			var lastChild;
			lastChild = document.querySelectorAll(_arg)[0];
			return M(lastChild);
		}
		_self.parent = function() {
			var parent;
			each(_arg, function(el, i) {
				parent = el.parentNode;
			})
			return M(parent);
		}
		_self.closest = function(selector) {
			var parent;
			each(_arg, function(el, i) {
				for (var parentSibling = el; document.querySelector(selector) != parentSibling; parentSibling = parentSibling.parentNode) {
					parent = parentSibling.parentNode;
				}
			})
			return M(parent);
		}
		_self.not = function(selector) {
			var parent;
			each(_arg, function(el, i) {

			})
			return M(parent);
		}
		_self.remove = function() {
			each(_arg, function(el, i) {
				el.parentNode.removeChild(el);
			})
		}
		_self.on = function(event, callback) {
			each(_arg, function(el, i) {
				el.addEventListener(event, callback, true);
			})
		}
		_self.events = function(events) {
			for (event in events) {
				each(_arg, function(el, i) {
					el.addEventListener(event, events[event], true);
				})
			}
		}
		_self.val = function() {
			var value;
			var argumentsList = arguments;
			if (arguments.length == 1) {
				each(_arg, function(elem, ind) {
					elem.value = argumentsList[0];
				})
			} else {
				each(_arg, function(elem, ind) {
					value = elem.value;
				})
				return value;
			}
		}
		_self.each = function(callback) {
			each(_arg, function(elem, ind) {
				callback(ind, elem)
			})
		}
		_self.children = function(selector) {
			var children;
			each(_arg, function(elem, ind) {
				children = elem.querySelectorAll((selector || "*"));
			})
			return M(children);
		}
		_self.length = (typeof _arg == "string" ? document.querySelectorAll(_arg).length : _arg.length)
		_self.copied = {};
		_self.copy = function(code) {
			each(_arg, function(elem, ind) {
				var element = document.createElement('div');
				element.innerHTML = M(elem).outerHTML();
				_self.copied[code] = M(element.children[0]);
			})
		}
		_self.paste = function(code) {
			each(_arg, function(elem, ind) {
				M(elem).append(_self.copied[code]);
				alert(_self.copied[code]);
			})
		}
		_self.each = function(callback) {
			each(_arg, function(elem, i){
				callback(elem, i)
			})
		}
		_self.replaceBy = function(elem) {
			var reference = document.createElement('div');
			reference.innerHTML = elem;
			var returned = reference.children[0].outerHTML;
			each(_arg, function(el, i) {
				M(el).insertAfter(returned);
			})
			M(_arg).remove();
		}
		_self.by = {
			attr: function(attr, value) {
				var selected = [];
				each(_arg, function(elem, ind) {
					if (elem.getAttribute(attr) == value) {
						selected.push(elem)
					}
				})
				return M(selected);
			}
		}
		_self.attrList = function() {
			var output = {};
			each(_arg, function(elem, ind) {
				if (elem.outerHTML) {
					if (elem.hasAttributes()) {
						var attrs = elem.attributes;
						for (var i = attrs.length - 1; i >= 0; i--) {
							output[attrs[i].name] = attrs[i].value;
						}
					}
				} else {
					return undefined;
				}
			})
			return output;
		}
		_self.height = function() {
			var height;
			each(_arg, function(elem, ind) {
				var rect = elem.getBoundingClientRect();
				height = rect.bottom - rect.top;
			})
			return height;
		}
		_self.next = function() {
			var next;
			each(_arg, function(elem, ind) {
				next = elem.nextSibling;
			})
			return M(next);
		}
		_self.focus = function() {
			each(_arg, function(elem, ind) {
				elem.focus();
			})
		}
		_self.scope = function(callback) {
			each(_arg, function(elem, ind) {
				var _length = elem.childNodes;
				var _scopeElements = [];
				var _scopeElementsPrevHTML = [];
				var _scopeElementsbyAttrs = [];
				var _scopeElementsAttributes = [];

				function _listAttributes(el) {
					if (el.outerHTML) {
						if (el.hasAttributes()) {
							var attrs = el.attributes;
							var output = [];
							for (var i = attrs.length - 1; i >= 0; i--) {
								var attr = [attrs[i].name, attrs[i].value];
								output.push(attr);
							}
							return output;
							console.log(output)
						}
					} else {
						return undefined;
					}
				}
				var filterLastChild = function(el) {
					if(el.tagName != "STYLE" && el.tagName != "SCRIPT"){
						var childs = el.childNodes;
						if (childs.length > 0) {
							[].forEach.call(childs, function(elem, i) {
								filterLastChild(elem);
							});
						} else {
							if (/\M\{[^M{]+\}/g.test(el.textContent)) {
								_scopeElements.push(el);
								_scopeElementsPrevHTML.push(el.textContent);
							}
						}
						if(_listAttributes(el)){
							if(/\M\{[^M{]+\}/g.test(_listAttributes(el).join(' '))){
								_scopeElementsbyAttrs.push(el);
								_scopeElementsAttributes.push(_listAttributes(el));
							}
						}
					}
				};
				Array.prototype.forEach.call(_length, function(el, i) {
					filterLastChild(el);
				});

				var inputs = elem.querySelectorAll('input');
				var scope = {};
				eval(callback.toString('base64').replace(/^\s*function\s*\(.*\)\s*\{/g, '').replace(/\}$/g, ''));
				[].forEach.call(inputs, function(el, i) {
					var keyScope = el.getAttribute('m-listen');
					if (keyScope) {
						el.value = scope[keyScope] ? scope[keyScope] : "";
						function bind(e) {
							callback(scope);
							scope[keyScope] = e.target.value;
							[].forEach.call(elem.querySelectorAll('input'), function(input, index) {
								if(input.getAttribute('m-listen') == keyScope && input != e.target){
									input.value = scope[keyScope] ? scope[keyScope] : "";
								}
							})
							_load();
						}
						el.addEventListener('mousedown', bind);
						el.addEventListener('change', bind);
						el.addEventListener('input', bind);
						el.addEventListener('keydown', bind);
					}
				});
				function _load() {
					_scopeElements.forEach(function(el, i) {
						var currentText = _scopeElementsPrevHTML[i];
						var matched = _scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g) instanceof Array ? _scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g) : [_scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g)]
						matched.forEach(function(str, ind) {
							var key = str.substring(2, str.length - 1);
							var regex = new RegExp("\\M\\{"+key.toString()+"\\}", 'g');

							currentText = currentText.replace(regex, (scope[key] || ""))
							el.textContent = currentText ? currentText : "";
						});
					});
					_scopeElementsbyAttrs.forEach(function(el, i) {
						_scopeElementsAttributes[i].forEach(function(attr, i) {
							var currentAttr = attr[1].toString();
							if(/\M\{[^M{]+\}/g.test(attr[1].toString())){
								attr[1].toString().match(/\M\{[^M{]+\}/g).forEach(function(value, ind) {
									var key = value.substring(2, value.length - 1);
									var regex = new RegExp("\\M\\{"+key+"\\}", 'g');
									currentAttr = currentAttr.replace(regex, scope[key] || "")
									el[attr[0]] = currentAttr != undefined ? currentAttr : "";
									el.setAttribute(attr[0], (currentAttr != undefined ? currentAttr : ""));
								});
							}
						});
					});
				};
				_load();
			})
}

}

window.M = M;

/* Replacing MTags */

M('m-repeat').each(function(elem, i){
	var html = M(elem).html();
	var count = parseFloat(M(elem).attrs('count'));
	var i = 1;
	var div = M(elem).insertAfter('div');
	var outerHTMl = ""
	while (i < count) {
		outerHTMl += html;
		i++
	}
	div.html(outerHTMl);
})
M('m-progressbar').each(function(elem, i) {
	console.log('aaa')
	var self = M(elem);
	var attrs = {
		value: parseFloat(self.attrs('value')) || 50,
		max: parseFloat(self.attrs('max')) || 100
	}
	var percent = attrs.value > attrs.max ? 100 : (100 * attrs.value) / attrs.max;
	var show = {};
	if (self.attrs('show-text') == "percent") {
		show = {
			value: Math.round(percent) + "%",
			max: "100%"
		}
	} else {
		show = attrs;
	}
	var content = self.html();
	var match = content.match(/\M\{[^M{]+\}/g);
	match.forEach(function(el, i) {
		var attr = el.substring(2, el.length - 1);
		var regex = new RegExp(el, 'g');
		content = content.replace(regex, show[attr]);
	})
	var container = self.insertAfter('div');
	container.addClass('m-progressbar');
	var markValue = container.newElement('div');
	var text = container.newElement('div');
	text.addClass('m-progressbar-info');
	text.html(content);
	markValue.addClass('m-progressbar-value');
	markValue.style({
		width: percent + "%"
	})
	self.remove();
})
M('m-input').each(function(elem, i) {
	if (M(elem).attrs('type') == 'number') {
		var mInput = M(elem);
		var inputContainer = mInput.insertAfter('div');
		inputContainer.addClass('m-input-number-container');
		var align = inputContainer.newElement('div');
		var content = align.newElement('div');
		var newInput = M('<input type="text" class="m-input-number">');
		content.append(newInput);
		newInput = content.children('input');
		newInput.attrs(mInput.attrList());
		var buttonsContainer = content.newElement('div');
		buttonsContainer.addClass('m-input-number-buttons')
		var add = buttonsContainer.newElement('button');
		var sub = buttonsContainer.newElement('button');
		add.addClass('m-input-number-increment');
		sub.addClass('m-input-number-decrement');
		add.html('&#x25B2;');
		sub.html('&#x25BC;');
		add.insertAfter('br')
		var style = {
			height: Math.ceil(parseFloat(newInput.height()) / 2) + "px",
			width: Math.ceil(parseFloat(newInput.height()) / 2) + "px",
			fontSize: Math.ceil(parseFloat(newInput.height()) / 4) + "px",
		}
		add.style(style);
		sub.style(style);

		var step = parseFloat(mInput.attrs('step')) || 1;
		var max = parseFloat(mInput.attrs('max')) || Infinity;
		var min = parseFloat(mInput.attrs('min')) || -Infinity;
		var keyDown = Boolean(mInput.attrs('keydown')) || true;
		var increment = function(e){
			var inputN = newInput;
			var value = inputN.val() || 0;
			if(value < max){
				inputN.val(+(value)+step)
			}
			inputN.focus();
		}
		var decrement = function(){
			var inputN = newInput;
			var value = inputN.val() || 0;
			if(value > min){
				inputN.val(+(value)-step)
			}
			inputN.focus();
		}
		add.events({
			mousedown: increment
		})
		sub.events({
			mousedown: decrement
		})
		newInput.attrs({
			type: 'text',
			class: 'm-input-number'
		});
		if(keyDown == true){
			newInput.events({
				keydown: function(e){
					if(e.keyCode == 38){
						e.preventDefault();
						increment();
					}else if(e.keyCode == 40){
						e.preventDefault();
						decrement();
					}
				}
			});
		}
		mInput.remove();
	}
})

M('m-polygon').each(function(elem, i) {

	M(elem).next().events({
		mouseenter: function(){
			M(this).addClass(M(this).attrs('hover'))
		},
		mouseleave: function(){
			M(this).removeClass(M(this).attrs('hover'))
		}
	})
	if (M(elem).attrs('type') == 'octagon') {
		var height = parseFloat(M(elem).attrs('size'));
		var background = M(elem).attrs('background');
		var mPolygon = M(elem);
		var polygonBox = mPolygon.insertAfter('div');
		var polygonContainer = polygonBox.newElement('div');
		polygonContainer.addClass('m-polygon-'+M(elem).attrs('type'));
		var center = polygonContainer.newElement('div');
		center.addClass("center");
		var left = center.newElement('div');
		left.addClass("left");
		var right = center.newElement('div');
		right.addClass("right");
		var top = center.newElement('div');
		top.addClass("top");
		var bottom = center.newElement('div');
		bottom.addClass("bottom");
		var leftTop = center.newElement('div');
		leftTop.addClass("left top");
		var rightTop = center.newElement('div');
		rightTop.addClass("right top");
		var leftBottom = center.newElement('div');
		leftBottom.addClass("left bottom");
		var rightBottom = center.newElement('div');
		rightBottom.addClass("right bottom");
		var realSize = Math.ceil(2*(height/3));
		polygonBox.style({
			position: 'relative',
			height: Math.ceil(realSize/2)/2 + height + "px",
			width: Math.ceil(realSize/2)/2 + height + "px"
		});
		polygonContainer.style({
			position: 'relative',
			height: 'auto',
			width: 'auto',
			display: 'inline-block'
		});
		polygonContainer.children('div').style({
			width: height/2 + 'px',
			height: height/2 + 'px',
			position: 'absolute',
			background: background
		});
		polygonContainer.children('.center').style({
			left: Math.ceil(realSize/2) + 'px',
			top: Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .left').style({
			left: -Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .right').style({
			right: -Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .top').style({
			top: -Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .bottom').style({
			bottom: -Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .bottom, .center .top').style({
			height: Math.ceil(realSize/2) + 'px',
			background: background
		});
		polygonContainer.children('.center .left, .center .right').style({
			width: Math.ceil(realSize/2) + 'px',
			background: background
		});
		leftTop.style({
			'width': 0,
			'height': 0,
			'border-left': Math.ceil(realSize/2) + 'px solid transparent',
			'border-bottom': Math.ceil(realSize/2) + 'px solid ' + background,
			'background': 'transparent'
		});
		rightTop.style({
			width: 0,
			height: 0,
			borderRight: Math.ceil(realSize/2) + 'px solid transparent',
			borderBottom: Math.ceil(realSize/2) + 'px solid ' + background,
			background: 'transparent'
		});
		center.children('.left.bottom').style({
			width: 0,
			'height': 0,
			'border-left': Math.ceil(realSize/2) + 'px solid transparent',
			'border-top': Math.ceil(realSize/2) + 'px solid ' + background,
			'background': 'transparent'
		});
		center.children('.right.bottom').style({
			'width': 0,
			'height': 0,
			'border-right': Math.ceil(realSize/2) + 'px solid transparent',
			'border-top': Math.ceil(realSize/2) + 'px solid ' + background,
			'background': 'transparent'
		})
		var content = polygonBox.newElement('div');
		content.html(mPolygon.html());
		content.style({
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'transparent',
			position: 'absolute'
		})
		mPolygon.remove();

	}else if (M(elem).attrs('type') == 'hexagon') {
		var height = parseFloat(M(elem).attrs('size'));
		var background = M(elem).attrs('background');
		var mPolygon = M(elem);
		var polygonBox = mPolygon.insertAfter('div');
		var polygonContainer = polygonBox.newElement('div');
		polygonContainer.addClass('m-polygon-'+M(elem).attrs('type'));
		var center = polygonContainer.newElement('div');
		center.addClass("center");
		var leftTop = center.newElement('div');
		leftTop.addClass("left top");
		var rightTop = center.newElement('div');
		rightTop.addClass("right top");
		var leftBottom = center.newElement('div');
		leftBottom.addClass("left bottom");
		var rightBottom = center.newElement('div');
		rightBottom.addClass("right bottom");
		var realSize = Math.ceil(4*(height/7));
		polygonBox.style({
			position: 'relative',
			height: height + "px",
			width: realSize*2 + "px"
		});
		polygonContainer.style({
			position: 'relative',
			height: 'auto',
			width: 'auto',
			display: 'inline-block'
		});
		polygonContainer.children('div').style({
			position: 'absolute',
			background: background
		});
		polygonContainer.children('.center').style({
			width: (realSize) + 'px',
			height: height + 'px',
			left: Math.ceil(realSize/2) + 'px',
			top: 0 + 'px',
			background: background
		});
		leftTop.style({
			left: -Math.ceil(realSize/2) + 'px',
			top: 0,
			width: 0,
			height: 0,
			borderLeft: Math.ceil(realSize/2) + 'px solid transparent',
			borderBottom: Math.ceil(height/2) + 'px solid ' + background,
			background: 'transparent'
		});
		rightTop.style({
			right: -Math.ceil(realSize/2) + 'px',
			top: 0,
			width: 0,
			height: 0,
			borderRight: Math.ceil(realSize/2) + 'px solid transparent',
			borderBottom: Math.ceil(height/2) + 'px solid ' + background,
			background: 'transparent'
		});
		center.children('.left.bottom').style({
			left: -Math.ceil(realSize/2) + 'px',
			bottom: 0,
			width: 0,
			height: 0,
			borderLeft: Math.ceil(realSize/2) + 'px solid transparent',
			borderTop: Math.ceil(height/2) + 'px solid ' + background,
			background: 'transparent'
		});
		center.children('.right.bottom').style({
			right: -Math.ceil(realSize/2) + 'px',
			bottom: 0,
			width: 0,
			height: 0,
			borderRight: Math.ceil(realSize/2) + 'px solid transparent',
			borderTop: Math.ceil(height/2) + 'px solid ' + background,
			background: 'transparent'
		})
		var content = polygonBox.newElement('div');
		content.html(mPolygon.html());
		content.style({
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'transparent',
			position: 'absolute'
		})
		mPolygon.remove();
	}else if (M(elem).attrs('type') == 'pentagon') {
		var height = parseFloat(M(elem).attrs('size'));
		var background = M(elem).attrs('background');
		var mPolygon = M(elem);
		var polygonBox = mPolygon.insertAfter('div');
		var polygonContainer = polygonBox.newElement('div');
		polygonContainer.addClass('m-polygon-'+M(elem).attrs('type'));
		var center = polygonContainer.newElement('div');
		center.addClass("center");
		var top = center.newElement('div');
		top.addClass("top");
		var left = center.newElement('div');
		left.addClass("left");
		var right = center.newElement('div');
		right.addClass("right");
		var topSize = Math.ceil(height/15);
		var sideSize = Math.ceil(height/18);
		polygonBox.style({
			position: 'relative',
			height: height + "px",
			width: realSize*2 + "px"
		});
		polygonContainer.style({
			position: 'relative',
			height: 'auto',
			width: 'auto',
			display: 'inline-block'
		});
		polygonContainer.children('div').style({
			position: 'absolute',
			background: background
		});
		polygonContainer.children('.center').style({
			width: Math.ceil(height/1.6) + 'px',
			height: Math.ceil(height/1.6) + 'px',
			left: sideSize + 'px',
			top: topSize + 'px',
			background: background
		});
		top.style({
			width: 0,
			height: 0, 
			top: -topSize+'px',
			borderLeft: sideSize + 'px solid transparent',
			borderRight: sideSize+ 'px solid transparent',
			borderBottom: sideSize+ 'px solid '+background
		});
		left.style({
			left: -sideSize + 'px',
			bottom: 0,
			width: 0,
			height: 0,
			borderLeft: sideSize + 'px solid transparent',
			borderTop: Math.ceil(height/1.6) + 'px solid ' + background,
			background: 'transparent'
		});
		right.style({
			right: -sideSize + 'px',
			bottom: 0,
			width: 0,
			height: 0,
			borderRight: sideSize + 'px solid transparent',
			borderTop: Math.ceil(height/1.6) + 'px solid ' + background,
			background: 'transparent'
		});
		var content = polygonBox.newElement('div');
		content.html(mPolygon.html());
		content.style({
			width: '100%',
			height: '100%',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			background: 'transparent',
			position: 'absolute'
		})
		mPolygon.remove();
	}
})
}

loadMLiB();

window.onload = function(){
	loadMLiB();
}
=======
(function() {
  var myArg;
  var self;
  var M = function() {
    self = this;
    var arg = arguments[0];
    var index = arguments[1];
    if (!(this instanceof M)) {
      return new M(arg, index);
    }
    self.myArg = arg;
    self.myIndex = index;
  }

  function each(selector, callback) {
    if (typeof selector == 'string') {
    	if(document.querySelectorAll(selector) != undefined){
        if (self.myIndex == undefined) {
          [].forEach.call(document.querySelectorAll(selector), function(el, i) {
            callback(el, i)
          })
        } else {
          callback(document.querySelectorAll(selector)[self.myIndex], self.myIndex)
        }
      }
    } else {
      if (selector instanceof HTMLElement) {
        callback(selector, self.myIndex, "one")
      } else if (typeof selector.length == 'number' && typeof selector.item == 'function') {
        if (self.myIndex == undefined) {
          [].forEach.call(selector, function(el, i) {
            callback(el, i)
          })
        } else {
          callback(selector[self.myIndex], self.myIndex)
        }
      } else if (typeof selector == 'object' && typeof selector.myArg == 'string') {
        callback(selector, self.myIndex)
      }
    }
  }

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  M.fn = M.prototype = {
    css: function(style) {
      each(self.myArg, function(el, i) {
        var styles = [];
        for (property in style) {
          styles.push(property + ": " + style[property])
        }
        styles = styles.join('; ');
        el.setAttribute("style", styles + "; " + (el.getAttribute("style") || "" ) );
      })
    },
    append: function(newElement) {
      each(self.myArg, function(el, i) {
        el.innerHTML += newElement;
      })
    },
    prepend: function(newElement) {
      each(self.myArg, function(el, i) {
        el.innerHTML = newElement + el.innerHTML;
      })
    },
    eq: function(index) {
      var selected;
      each(self.myArg, function(el, i) {
        if (index == i) {
          selected = new M(self.myArg, index)
        }
      })
      return selected;
    },
    click: function(callback) {
      each(self.myArg, function(el, i) {
        el.addEventListener('click', callback);
      })
    },
    toggle: function(callback1, callback2) {
      var n = 0;
    },
    children: function(selector) {
      var children;
      var selector = selector || "*";
      each(self.myArg, function(elem, ind, n) {
        children = new M(elem.querySelectorAll(selector))
      })
	    return children
    },
    fadeOut: function(time, callback) {
      each(self.myArg, function(elem, ind) {
        var increment = -2;
        var opacity = 100;
        interval = setInterval(function() {
          if (opacity <= 0.1) {
            opacity += increment
            elem.style.opacity = 0 / 100;
            elem.style.filter = "alpha(opacity=" + 0 + ")";
            elem.style.display = "none";
            clearInterval(interval);
            if (callback) callback();
          } else {
            opacity += increment
            elem.style.opacity = opacity / 100;
            elem.style.filter = "alpha(opacity=" + opacity + ")";
          }
        }, (time / 1000) * 10);
      })
    },
    scrollTo: function(target) {
      return {
        top: function() {
          var options = arguments[0] ? arguments[0] : undefined;
          each(self.myArg, function(elem, ind) {
            if (options) {
              if (options.animate == true) {
                function scrollToY(scrollTargetY, speed, easing) {
                  var scrollY = elem.scrollTop,
                    scrollTargetY = scrollTargetY || 0,
                    speed = speed || 2000,
                    easing = easing || 'easeOutSine',
                    currentTime = 0;
                  var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
                  var easingEquations = {
                    easeOutSine: function(pos) {
                      return Math.sin(pos * (Math.PI / 2));
                    },
                    easeInOutSine: function(pos) {
                      return (-0.5 * (Math.cos(Math.PI * pos) - 1));
                    },
                    easeInOutQuint: function(pos) {
                      if ((pos /= 0.5) < 1) {
                        return 0.5 * Math.pow(pos, 5);
                      }
                      return 0.5 * (Math.pow((pos - 2), 5) + 2);
                    }
                  };

                  function tick() {
                    currentTime += 1 / 60;

                    var p = currentTime / time;
                    var t = easingEquations[easing](p);

                    if (p < 1) {
                      requestAnimFrame(tick);
                      elem.scrollTop = scrollY + ((scrollTargetY - scrollY) * t);
                    } else {
                      elem.scrollTop = scrollTargetY
                    }
                  }
                  tick();
                }
                scrollToY(target, options.speed);
              } else {
                elem.scrollTop = target;
              }
            } else {
              elem.scrollTop = target;
            }
          })
        },
        left: function() {

        }
      }
    },
    offset: function() {
      var returned = {};
      each(self.myArg, function(elem, ind) {
        returned.left = elem.getBoundingClientRect().left;
        returned.top = elem.getBoundingClientRect().top;
      })
      return returned;
    },
    html: function() {
      var argumentsList = arguments;
      var html;
      each(self.myArg, function(elem, ind) {
        if(argumentsList.length > 0){
        	elem.innerHTML = argumentsList[0]
        }else{
        	html = elem.innerHTML;
        }
      })
      return html;
    },
    remove: function(){
    	each(self.myArg, function(el, i) {
      	el.parentNode.removeChild(el);
      })
    },
    newElement: function(element){
    	var _newElement;
    	each(self.myArg, function(el, i) {
      	_newElement = document.createElement(element)
        el.appendChild(_newElement);
      })
      return M(_newElement)
    },
    attrs: function(attributes){
    	each(self.myArg, function(el, i) {
        for (attribute in attributes) {
          el.setAttribute(attribute, attributes[attribute])
        }
      })
    },
    parent: function(attributes){
    	var parent;
    	each(self.myArg, function(el, i) {
        parent = el.parentNode;
      })
      return M(parent);
    },
    insertBefore: function(newEl){
    	var newEl = document.createElement(newEl);
    	each(self.myArg, function(el, i) {
        el.parentNode.insertBefore(newEl, el);
      })
    },
    length: function(){
    	var length;
    	each(self.myArg, function(el, i) {
        length = self.myArg.length;
      })
    	return length;
    }
  }

  window.M = M, window.$$ = M;
})();
