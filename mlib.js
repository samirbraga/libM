  /*
  Mlib - powered by Mathers.com.br
  All rights reserveds - Copyright
  */

(function(){

var _Scope = {};
var _callback;
function intScope(key, value){
  key = key.replace(/\s/g, '');
  if(arguments.length == 1){
    return eval('_Scope.'+key);
  }else{
    eval('_Scope.'+key+" = "+value+";");
  }
}

var fnScope = {
  _refreshScope: function(elem, callback){
    var inputs = elem.querySelectorAll('input, select, .m-input, .m-select, video');
    callbackString = callback.toString('base64');
    var scopeVar = callbackString.match(/^\s*function\s*\(.*\)\s*\{/g)[0].replace(/\s/g, '').substring(9, callbackString.match(/^\s*function\s*\(.*\)\s*\{/g)[0].length - 3);
    eval(callback ? callbackString.replace(/^\s*function\s*\(.*\)\s*\{/g, '').replace(/\s/g, '').replace(/\}$/, '').replace(new RegExp(scopeVar, 'g'), "_Scope") : "");
    [].forEach.call(inputs, function(el, i) {
      var keyScope = el.getAttribute('m-listen');
      if (keyScope) {
        var valueScope = intScope(keyScope);
        if (el.className.split(' ').indexOf('m-input-range') > -1) {
          var type = el.getAttribute('type');
          var mInput = M(el);
          switch (type) {
            case "range":
              if (valueScope) {
                _updateView.range(el, valueScope);
              } else {
                intScope(keyScope, mInput.attrs('data-value'))
              }
              break;
          }
        } else if (M(el).hasClass("m-select")) {
          intScope(keyScope, el.getAttribute('data-value'));
          valueScope = intScope(keyScope)
        } else if (el.tagName == "VIDEO") {
          if (valueScope != undefined && valueScope != null && valueScope != 'undefined') {
            el.currentTime = valueScope;
          } else {
            intScope(keyScope, el.currentTime);
            valueScope = intScope(keyScope);
            el.currentTime = valueScope;
          }
        }else if (el.tagName == "INPUT" && el.type == "checkbox") {
          if (valueScope != undefined && valueScope != null && valueScope != 'undefined') {
            //el.currentTime = valueScope;
          } else {
            intScope(keyScope, el.checked == false ? false : "'"+el.value+"'");
            valueScope = intScope(keyScope);
            el.checked = valueScope;
          }
        }else if (el.tagName == "INPUT" && el.type == "radio") {
          if (valueScope != undefined && valueScope != null && valueScope != 'undefined') {
            M('input[type="radio"][name="'+ (valueScope || "") +'"]').pure().checked = true;
          } else {
            var radioValue;
            M('input[type="radio"][name="'+ (el.name || "") +'"]').each(function(el){
              if(el.checked) radioValue = el.value
                else radioValue = false
            })
            intScope(keyScope, "'"+radioValue+"'");
            valueScope = intScope(keyScope);
            if (M('input[type="radio"][name="'+ (valueScope || "") +'"]').pure()) M('input[type="radio"][name="'+ (valueScope || "") +'"]').pure().checked = true;
          }
        }else {
          if(valueScope){
            el.value = valueScope
          }else{

            intScope(keyScope, "'"+el.value+"'")
            valueScope = intScope(keyScope);
          }
        }

        function bind(e) {
          if (/m\-input\-range(\-)?./g.test(e.target.className)) {
            var type = M(e.target).closest('.m-input-range').attrs('type');
            var mInput = M(e.target).closest('.m-input-range');
            switch (type) {
              case "range":
                intScope(keyScope, mInput.attrs('data-value'));
                valueScope = intScope(keyScope);
                break;
            }
          } else if (/m\-select.*/g.test(e.target.className)) {
            var mSelect = M(e.target).hasClass('m-select') ? M(e.target) : M(e.target).closest('.m-select');
            intScope(keyScope, mSelect.attrs('data-value'));
            valueScope = intScope(keyScope);
          } else if (e.target.tagName == 'VIDEO') {
            intScope(keyScope, e.target.currentTime);
            valueScope = intScope(keyScope);
          }else if (e.target.tagName == "INPUT" && e.target.type == "checkbox") {
            intScope(keyScope, e.target.checked == false ? false : "'"+e.target.value+"'");
            valueScope = intScope(keyScope);
          }else if (e.target.tagName == "INPUT" && e.target.type == "radio") {
            var radioValue;
            M('input[type="radio"][name="'+ (e.target.name || "") +'"]').each(function(el){
              if(el.checked) radioValue = el.value
                else radioValue = false
            })
            intScope(keyScope, "'"+radioValue+"'");
            valueScope = intScope(keyScope);
          }else {
            intScope(keyScope, "'"+e.target.value+"'");
            valueScope = intScope(keyScope);
          }
          [].forEach.call(elem.querySelectorAll('input, select, .m-input, .m-select, video'), function(input, index) {
            if (input.className.split(' ').indexOf('m-input') > -1 && input != e.target && input.getAttribute('m-listen') == keyScope) {
              var type = input.getAttribute('type');
              switch (type) {
                case "range":
                  _updateView.range(input, valueScope)
                  break;
              }
            } else if (input.tagName == 'VIDEO' && input.getAttribute('m-listen') == keyScope && input != e.target) {
              input.currentTime = valueScope;
            }  else if (input.tagName == 'INPUT' && input.getAttribute('m-listen') == keyScope  && input.type == 'checkbox' && input != e.target) {
              input.checked = valueScope != false ? true : false;
            }   else if (input.tagName == 'INPUT' && input.getAttribute('m-listen') == keyScope  && input.type == 'radio' && input != e.target) {
              M('input[type="radio"][name="'+ (valueScope || "") +'"]').pure().checked = true;
            } else if (input.getAttribute('m-listen') == keyScope && input != e.target) {
              input.value = valueScope;
            }
          })
          fnScope._load();
        }
        if (M(el).hasClass('m-input-range')) {
          var draggingLeft = false;
          var eTarget = {
            target: M(el).children('.m-input-range-container').pure()
          };
          M('body').on("mousedown", function(e) {
            focused = false;
          });
          function bindChildren(e){
            e.stopPropagation();
            draggingLeft = true;
            eTarget = e;
            bind(e);
          }
          M(el).children().on('mousedown', bindChildren);
          document.addEventListener('keydown', function(e){
            if(el == document.activeElement){
              bind(eTarget)
            }
          });
          M(window).on("mouseup", function(e) {
            draggingLeft = false;
          });
          M(window).on("mousemove", function(e) {
            if (draggingLeft) {
              bind(eTarget);
            }
          });
        }
       // M(el).change(bind)
        el.addEventListener('mousedown', bind);
        el.addEventListener('change', bind);
        el.addEventListener('input', bind);
        if (el.tagName == "VIDEO") el.addEventListener('timeupdate', bind);
        if (M(el).hasClass("m-input-range")){ M(el).children().on('mousedown', bind); }
        if (M(el).hasClass("m-input-number")){
          var target;
          M(el).closest('.m-input-number-container').on('mousedown', function(e){
            target = {
              target: el
            };
          });
          M(el).on('input', function(e){
            bind(e);
            target = e;
          });
          M(el).parent().children('.m-input-number-buttons button').on('mousedown', function(e){
            bind(target);
          });
        }
        if (M(el).hasClass("m-select")) M(el).children().on('mousedown', bind);
        //el.addEventListener('keydown', bind);
      }
    });
  }
}
function _changeReference(fn, scope) {
  var args = Array.prototype.slice.call(arguments, 2, arguments.length);
  return function(evento) {
    fn.apply(scope, args);
  }
}
var roundTo = function(num, step, decrement) {
  return Math.floor((num / step) + .5) * parseFloat(step) - (decrement || 0);
}
var bind;
var callbackString;
var _updateView = {
  range: function(elem, value){
    var rangeStep = parseFloat(elem.getAttribute('step')) || 1;
    var rangeMax = parseFloat(elem.getAttribute('max')) || 100;
    var rangeWay = elem.querySelector('.m-input-range-container .m-input-range-line .m-input-range-way');
    var rangeMarker = elem.querySelector('.m-input-range-container .m-input-range-marker');
    var rangeLeft = rangeMarker.offsetLeft;
    var rangeWidth = rangeMarker.offsetWidth;
    var rangeContainerWidth = elem.querySelector('.m-input-range-container').offsetWidth;
    value = value > rangeMax ? rangeMax : (value < 0 ? 0 : value);
    var left = (rangeContainerWidth * roundTo(value, rangeStep)) / rangeMax - rangeWidth / 2;
    left = left >= rangeContainerWidth - rangeWidth / 2 ? rangeContainerWidth - rangeWidth / 2 : left;
    if(arguments.length == 2){
      if (rangeWay) rangeWay.style.width = left < 0 ? 0 : left + "px"
      rangeMarker.style.left = left + "px";
      elem.setAttribute('data-value', roundTo(value, rangeStep));
    }else{
      var rangeValue = roundTo(((rangeMax*(left + rangeWidth/2))/rangeContainerWidth), rangeStep);
      return rangeValue;
    }
  },
  pgBar: function(elem, value){
    var max = elem.getAttribute('max') || 100;
    var valBar = elem.querySelector('.m-progressbar-value');
    valBar.style.width = (100*value)/max + "%"
    elem.setAttribute('data-value', value);
  }
}

function loadMLiB() {
  var M = function() {
    var _arg = arguments[0];

    if (!(this instanceof M)) {
      return new M(_arg);
    }
    if(typeof _arg == "string"){
      if (/\<.+\>/g.test(_arg.toString())) {
        var element = document.createElement('div');
        element.innerHTML = _arg;
        element = element.children[0];
        return M(element);
      }
    }
    var _updateVal = {
      range: function(elem, left){

      }
    }
    var _self = this;
    var each = function(selection, callback) {
      if (selection == window) {
        callback(window, 0);
      } else if (typeof selection == "string") {
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
    _self.show = function(display) {
      display = display || 'block'
      each(_arg, function(elem, ind) {
        elem.style.display = display;
      })
    }
    _self.fadeOut = function(time, callback) {
      each(_arg, function(elem, ind) {
        var animation;
        var opacity = +elem.style['opacity'] || 1;
        var duration = +time,
          end = +new Date() + duration;
        var steps = time < 200 ? 0.25 : 0.1;
        var step = function() {
          var current = +new Date(),
            remaining = end - current;
          if (remaining < 60) {
            window.cancelAnimationFrame(animation);
            elem.style.display = "none";
            elem.style.opacity = 1;
            if (callback) callback();
            else return;
          } else {
            opacity -= steps;
            elem.style.opacity = opacity;
          }
          animation = window.requestAnimationFrame(step);
        }
        step();
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
    _self.removeAttr = function(attr) {
      each(_arg, function(el, i) {
        el.removeAttribute(attr);
      })
    }
    _self.change = function(callback) {
      each(_arg, function(el, i) {
        if (el.tagName == "INPUT" || el.tagName == "SELECT") {
          el.addEventListener('change', callback);
        } else {
          if (M(el).hasClass('m-input-range')) {
            var self;
            var draggingLeft = false;
            var container = M(el).children('.m-input-range-container');
            var marker = M(el).children('.m-input-range-container .m-input-range-marker');
            var line = M(el).children('.m-input-range-container .m-input-range-line');
            var steps = M(el).children('.m-input-range-container .m-input-range-line .m-input-range-steps');
            var way = M(el).children('.m-input-range-container .m-input-range-line .m-input-range-way');
            var eTarget;
            var focused = false;
            M(el).on("mousedown", function() {
              self = this;
              draggingLeft = true;
            });
            M(el).on("mousedown", callback);
            container.on("mousedown", function(e) {
              draggingLeft = true;
              self = this.parentNode;
              (_changeReference(callback, self))();
            });
            M('body').on("mousedown", function(e) {
              focused = false;
            });
            function bindChildren(e){
              e.stopPropagation();
              draggingLeft = true;
              eTarget = e;
              focused = true;
              self = M(e.target).closest('.m-input-range').pure();
            }
            M(el).children().on('mousedown', bindChildren);
            document.addEventListener('keydown', function(e){
              if(focused){
                (_changeReference(callback, self))();
              }
            });
            M(window).on("mouseup", function(e) {
              draggingLeft = false;
            });
            M(window).on("mousemove", function(e) {
              if (draggingLeft) {
                (_changeReference(callback, self))();
              }
            });
          } else if (M(el).hasClass('m-input-checkbox-label')) {
            M(el).children('.m-input-checkbox-check').on('change', function(){
              (_changeReference(callback, el))()
            })
          } else if (M(el).hasClass('m-select')) {
            var prevNow = [];
            var title = M(el).children('span').html();
            prevNow[0] = title;
            var options = M(el).children('.m-select-options ul li');
            options.on('mousedown', function(e) {
              //prevNow.push(M(el).children('span').html());
              //if(prevNow[prevNow.length] != prevNow[prevNow.length - 1]){
              (_changeReference(callback, this))()
              //}
            })
          }
        }
      })
    }
    _self.offset = function() {
      var _newElement;
      var returned;
      each(_arg, function(elem) {
        var rect = elem.getBoundingClientRect();
        x = rect.left;
        y = rect.top;
        w = rect.right - rect.left;
        h = rect.bottom - rect.top;
        returned = {
          left: x,
          top: y,
          width: w,
          height: h
        }
      })
      return returned;
    }
    _self.position = function() {
      var _newElement;
      var returned;
      each(_arg, function(elem) {
        x = elem.offsetLeft;
        y = elem.offsetTop;
        returned = {
          left: x,
          top: y
        }
      })
      return returned;
    }
    _self.setTabindex = function(){
      each(_arg, function(el, index){
        M(el).children('buttom, select, option, input, .m-input-checkbox-label, .m-input-range, .m-select, .m-select li, .m-input-radio-label').each(function(el, i){
          M(el).attrs({
            tabindex: 0
          })
        })
      })
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
        el.className += (el.className != '' ? " " : "") + classes;
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
    _self.customScrollbar = function() {
      each(_arg, function(container, i) {
        var fullcontainer = container;
        container.innerHTML = container.outerHTML;  
        M(container).addClass('overflow-container')
        M(container).css({overflow: 'hidden'})
        container = container.children[0];
        container.className = 'container overflow'
        M(container).css({overflow: 'auto'})
        //var container = fullContainer.children[0];
        //container.children[0].className = "";
        var scrollTopBar = document.createElement('div');
        var topBar = document.createElement('div');
        var scrollLeftBar = document.createElement('div');
        var leftBar = document.createElement('div');
        scrollLeftBar.className = "scrollLeftBar scrollBar";
        scrollTopBar.className = "scrollTopBar scrollBar";
        leftBar.className = "bar";
        topBar.className = "bar";
        fullcontainer.appendChild(scrollLeftBar);
        fullcontainer.appendChild(scrollTopBar);
        scrollLeftBar.appendChild(leftBar);
        scrollTopBar.appendChild(topBar);
        var optimizedResize = (function() {
          var callbacks = [],
            running = false;

          function resize() {
            if (!running) {
              running = true;
              if (window.requestAnimationFrame) {
                window.requestAnimationFrame(runCallbacks);
              } else {
                setTimeout(runCallbacks, 66);
              }
            }
          }

          function runCallbacks() {
            callbacks.forEach(function(callback) {
              callback();
            });
            running = false;
          }

          function addCallback(callback) {
            if (callback) {
              callbacks.push(callback);
            }
          }
          return {
            add: function(callback) {
              if (!callbacks.length) {
                window.addEventListener('resize', resize);
              }
              addCallback(callback);
            }
          }
        }());

        optimizedResize.add(resizeBar);

        var containerW, containerSW, containerSL, containerH, containerSW, containerST;

        function resizeBar() {
          containerW = fullcontainer.offsetWidth;
          containerH = fullcontainer.offsetHeight;
          containerSW = container.scrollWidth;
          containerSH = container.scrollHeight;
          containerSL = container.scrollLeft;
          containerST = container.scrollTop;
          scrollLeftBar.style.width = containerW + 1 + "px";
          scrollTopBar.style.height = containerH + 1 + "px";
          leftBar.style.width = (containerW * 100) / containerSW + "%";
          leftBar.style.left = (containerSL * 100) / containerSW + "%";
          scrollLeftBar.style.top = containerH+containerST-leftBar.offsetHeight + "px";
          topBar.style.height = (containerH * 100) / containerSH + "%";
          topBar.style.top = (containerST * 100) / containerSH + "%";
          scrollTopBar.style.left = containerW+containerSL-topBar.offsetWidth + "px";
          if (container.offsetWidth >= containerSW + 17) {
            scrollLeftBar.style.display = "none";
          } else {
            scrollLeftBar.style.display = "block";
          }
          if (containerH >= containerSH + 17) {
            scrollTopBar.style.display = "none";
          } else {
            scrollTopBar.style.display = "";
          }
        }

        function moveBar() {
          var x;
          var y;
          var left;
          var top;
          var draggingLeft = false;
          var draggingTop = false;

          leftBar.addEventListener("mousedown", function(e) {
            x = +e.pageX +  document.body.scrollLeft;
            left = this.getBoundingClientRect().left;
            draggingLeft = true;
            if (leftBar.offsetLeft <= 0) {
              leftBar.style.left = "0px";
            }
          })
          topBar.addEventListener("mousedown", function(e) {
            y = e.pageY+document.body.scrollTop;
            top = this.getBoundingClientRect().top;
            draggingTop = true;
            if (topBar.offsetTop <= 0) {
              topBar.style.top = "0px";
            }
          })
          scrollLeftBar.addEventListener("mousedown", function(e) {
            var _x = +e.pageX +  document.body.scrollLeft;
              if (leftBar.getBoundingClientRect().left >= _x) {
                container.scrollLeft = container.scrollLeft - (10 * container.scrollWidth) / 100
              }
              if (leftBar.getBoundingClientRect().left + leftBar.offsetWidth <= _x) {
                container.scrollLeft = container.scrollLeft + (10 * container.scrollWidth) / 100
              }
              leftBar.style.left = (container.scrollLeft * 100) / containerSW + "%";
          })
          scrollTopBar.addEventListener("mousedown", function(e) {
            var _y = +e.pageY +  document.body.scrollTop;
              if (topBar.getBoundingClientRect().top >= _y) {
                container.scrollTop = container.scrollTop - (10 * container.scrollHeight) / 100
              }
              if (topBar.getBoundingClientRect().top + topBar.offsetHeight <= _y) {
                container.scrollTop = container.scrollTop + (10 * container.scrollHeight) / 100
              }
              topBar.style.top = (container.scrollTop * 100) / containerSH + "%";
          })
          document.addEventListener("mousemove", function(e) {
            e.preventDefault();
            var _x = +e.pageX +  document.body.scrollLeft;
            var _y = +e.pageY +  document.body.scrollTop;
            var spaceX = (x + container.getBoundingClientRect().left) - left;
            var spaceY = (y + container.getBoundingClientRect().top) - top;
            var percentLeft = (leftBar.offsetLeft * 100) / (scrollLeftBar.offsetWidth);
            var percentTop = (topBar.offsetTop * 100) / (scrollTopBar.offsetHeight);
            if (draggingLeft == true) {
              leftBar.style.left = (_x - spaceX)+ "px";
              container.scrollLeft = (percentLeft * containerSW) / 100
              if (leftBar.offsetLeft <= 0) {
                leftBar.style.left = "0";
              }
              if (leftBar.offsetLeft + leftBar.offsetWidth > fullcontainer.offsetWidth) {
                console.log('hit')
                leftBar.style.left = fullcontainer.offsetWidth - leftBar.offsetWidth + "px";
              }
            }
            if (draggingTop == true) {
              topBar.style.top = (_y - spaceY) + "px";
              container.scrollTop = (percentTop * containerSH) / 100 
            
              if (topBar.offsetTop <= 0) {
                topBar.style.top = "0";
              }
              if (topBar.offsetTop + topBar.offsetHeight >= fullcontainer.offsetHeight) {
                topBar.style.top = scrollTopBar.offsetHeight - topBar.offsetHeight - 1 + "px";
              }
            }
          })
          window.addEventListener("mouseup", function(e) {
            draggingLeft = false;
            draggingTop = false;
          })
        }
        container.addEventListener('scroll', function() {  
          //scrollLeftBar.style.left = this.scrollLeft + "px";
          //scrollTopBar.style.left = this.scrollLeft+this.offsetWidth - scrollTopBar.offsetWidth - 20 + "px";
          //scrollTopBar.style.top = this.scrollTop + "px";
          //scrollLeftBar.style.top = this.scrollTop+this.offsetHeight - scrollLeftBar.offsetHeight - 20 + "px";
          topBar.style.top = (this.scrollTop * 100) / this.scrollHeight + "%";
          leftBar.style.left = (this.scrollLeft * 100) / this.scrollWidth + "%";
        })
        moveBar();
        resizeBar();
          
      })
    }
    _self.closest = function(match) {
      var parent;
      each(_arg, function(elem, i) {
        function closest(el, selector) {
          var matchesFn;
          ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
            if (typeof document.body[fn] == 'function') {
              matchesFn = fn;
              return true;
            }
            return false;
          })
          var parent;
          while (el) {
            parent = el.parentElement;
            if (parent && parent[matchesFn](selector)) {
              return parent;
            }
            el = parent;
          }
          return null;
        }
        parent = closest(elem, match)
      })
      return M(parent);
    }
    _self.animate = function(style, time, easing, callback) {
      var EasingFunctions = {
        linear: function (t) { return t },
        easeInQuad: function (t) { return t*t },
        easeOutQuad: function (t) { return t*(2-t) },
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        easeInCubic: function (t) { return t*t*t },
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        easeInQuart: function (t) { return t*t*t*t },
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        easeInQuint: function (t) { return t*t*t*t*t },
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
      }
      easing = arguments.length > 2 ? easing : 'linear';
      each(_arg, function(elem, i) {
        var frame = function(styleProperty, newVal){
          var timeout;
          if(styleProperty == "opacity" || styleProperty == "scrolltop"  || styleProperty == "scrollTop" ){
            var unit = ""
          }else{
            if(/.+\%$/g.test(newVal)){  
              var unit = "px";
              var value = parseFloat(newVal);
              newVal = (elem.parentNode.offsetWidth*value)/100
            }else{
              var unit = "px";
            }
          }
          var count = 0;
          if(styleProperty == "scrollTop"){
            var prevStyleVal = parseFloat(elem.scrollTop) || 1;
          }else{
            switch (styleProperty){
              case 'width':
                var prevStyleVal = parseFloat(elem.style[styleProperty]) || parseFloat(elem.offsetWidth);
                break;
              case 'height':
                var prevStyleVal = parseFloat(elem.style[styleProperty]) || elem.offsetHeight;
                break;
              case 'top':
                var prevStyleVal = parseFloat(elem.style[styleProperty]) || elem.offsetTop;
                break;
              case 'left':
                var prevStyleVal = parseFloat(elem.style[styleProperty]) || elem.offsetLeft;
                break;
              default:
                var prevStyleVal = parseFloat(elem.style[styleProperty]) || 1
            }
            
          }
          var styleVal = 1;
          elem.style[styleProperty] = prevStyleVal;
          var intervals = [];
          function stop(){
            interval.forEach(function(el){
              clearTimeout(el);
            })
          }
          while (count < time){
            timeout = setTimeout(function(){
              if(styleProperty == "scrollTop"){
                elem.scrollTop = +prevStyleVal+EasingFunctions[easing](styleVal/time)*(newVal - prevStyleVal) + ""+unit;
              }else{
                elem.style[styleProperty] = (+prevStyleVal+EasingFunctions[easing](styleVal/time)*(newVal - prevStyleVal)) + ""+unit;
              }
              styleVal += 1;
              if(styleVal >= time){
                styleVal = time;
                count = time;
                clearTimeout(timeout);
                if(callback) callback()
              }
            }, count)
            intervals.push(timeout);
            count += 1;
          }
        }
        for(styleProperty in style){
          if(parseFloat(elem.style[styleProperty]) != style[styleProperty])
            frame(styleProperty, style[styleProperty])
        }
      })
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
    _self.find = function(selector) {
      each(_arg, function(el, i) {
        [].forEach.call(el.childNodes, function(){

        });
      })
    }
    _self.getJSON = function(events) {
      var json = {};
      each(_arg, function(el, i) {
        M(el).children('input[type="text"], select, .m-input, .m-select, .m-input-radio-label, .m-input-checkbox-label').each(function(elem, index){
          json[(M(elem).hasClass('m-input-radio-label') || M(elem).hasClass('m-input-checkbox-label') ? M(elem).attrs('data-name') : M(elem).attrs('name'))] = M(elem).val()
        })
      })
      return json;
    }
    _self.val = function() {
      var value;
      var argumentsList = arguments;
      var _newVal = arguments[0];
      if (arguments.length == 1) {
        each(_arg, function(elem, ind) {
          if (/.?m\-input.*/.test(elem.className) && elem.tagName != "INPUT") {
            elem.querySelector('.m-input-range .m-input-range-marker').style.left = _updateView.range(elem, _newVal) + 'px';
            M(elem).attrs({'data-value': _newVal});
          }else if (/m\-progressbar.*/.test(elem.className)  && elem.tagName != "INPUT") {
            _updateView.pgBar(elem, _newVal);
          } else {
            if(elem.type == "checkbox"){
              elem.checked = _newVal != false ? true : false;
            }else{
              elem.value = _newVal;
            }
          }
        })
      } else {
        each(_arg, function(elem, ind) {
          if (/m\-select.*/.test(elem.className)) {
            if (M(elem).hasClass('m-select-option')) {
              value = M(elem).closest('.m-select').attrs('data-value')
            } else {
              value = M(elem).attrs('data-value')
            }
          }else if (/.*m\-input.*/.test(elem.className)  && elem.tagName != "INPUT") {
            value = M(elem).attrs('data-value');
          }else if (/m\-progressbar.*/.test(elem.className)  && elem.tagName != "INPUT") {
            value = M(elem).attrs('data-value');
          } else {
            value = elem.value;
          }
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
      each(_arg, function(elem, i) {
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
    _self.scopeEvents = function(event, callback) {
      each(_arg, function(el, i) {
        el.addEventListener(event, eval('_Scope.'+callback), true);
        el.addEventListener(event, function(e){
          //fnScope._refreshScope(el, callback)
        });
      });
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
        setTimeout(function(){ elem.focus() })
      })
    }
    _self.loaded = function(callback) {
      if (_arg == document) _arg.addEventListener('DOMContentLoaded', callback);
    }
    _self.pure = function() {
      var pureElement;
      each(_arg, function(elem, ind) {
         pureElement = elem;
      })
      return pureElement;
    }
    _self.tagName = function(callback) {
      var tagName
      each(_arg, function(el, i) {
        tagName = el.tagName;
      })
      return tagName;
    }
    _self.index = function(selector) {
      var index
      each(_arg, function(el, i) {
        var parent = el.parentNode;
        var children = Array.prototype.slice.call(parent.querySelectorAll(selector))
        index = children.indexOf(el);
      })
      return index;
    }
    _self.css = function(object) {
      function splitInUpper(string) {
        var split = string.split(/(?=[A-Z])/);
        split.forEach(function(el, i) {
          split[i] = el.toLowerCase();
        })
        return split.join('-');
      }
      each(_arg, function(el, i) {
        var prevStyle = el.getAttribute('style') || "";
        var style = "";
        for (property in object) {
          var regex = new RegExp(splitInUpper(property) + "\\s*\\:\\s*[^:]+\\;\\s*", 'g');
          style += splitInUpper(property) + ": " + object[property] + "; ";
          prevStyle = prevStyle.replace(regex, '')
        }
        el.setAttribute('style', prevStyle + "" + style);
      })
    }
    _self.check = function(bool) {
      bool = bool || true
      each(_arg, function(el, i) {
        if(M(el).hasClass('m-input-checkbox-label') || M(el).hasClass('m-input-radio-label'))
          M(el).children('input').pure().checked = bool;
        else
          el.checked = bool
      })
    }
    _self.scope = function(callback) {
      var returned;
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
            }
          } else {
            return undefined;
          }
        }
        var filterLastChild = function(el) {
          if (el.tagName != "STYLE" && el.tagName != "SCRIPT" && _scopeElements.indexOf(el) == -1) {
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
            if (_listAttributes(el)) {
              if (/\M\{[^M{]+\}/g.test(_listAttributes(el).join(' '))) {
                _scopeElementsbyAttrs.push(el);
                _scopeElementsAttributes.push(_listAttributes(el));
              }
            }
          }
        };
        Array.prototype.forEach.call(_length, function(el, i) {
          filterLastChild(el);
        });

        fnScope._refreshScope(elem, callback);
        replaceMtags();
        _callback = callback;
      
        function parseToReg(str){
          return str.replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+').replace(/\-/g, '\\-').replace(/\//g, '\\/').replace(/\"/g, '\\"').replace(/\'/g, "\\'").replace(/\,/g, '\\,').replace(/\&/g, '\\&')
        }
        function parseScopeString(value, prevValue){
          var fullCapture = value.substring(2, value.length - 1).split('->');
          var keys = fullCapture[0];
          var currentVar = keys;
          var returned = prevValue;
          if (/[$A-Za-z_.]+[0-9]*[$A-Za-z_.]*/g.test(keys)) {
            keys.match(/[$A-Za-z_.]+[0-9]*[$A-Za-z_.]*/g).forEach(function(key, index) {
              var firstKey = (key.match(/^[^.]+\./g) || [key + "."])[0].substring(0, (key.match(/^[^.]+\./g) || [key + "."])[0].length - 1);
              var valueScopeFirstKey = intScope(firstKey);
              if ((valueScopeFirstKey) || parseFloat(valueScopeFirstKey) == 0) {
                var valueScope = intScope(key);
                var regex = new RegExp(key, 'g');
                if (typeof valueScope == "number") {
                  currentVar = currentVar.replace(regex, valueScope);
                } else if (valueScope instanceof Object) {
                  currentVar = currentVar.replace(regex, "'" + (Array.isArray(valueScope) ? valueScope : JSON.stringify(valueScope)) + "'");
                } else {
                  currentVar = currentVar.replace(regex, "'" + valueScope + "'");
                }
              } else {
                currentVar = '';
              }
            });
          }
          var filter = (fullCapture[1] || "") || null;
          //filters.split('&').forEach(function(filter, index){
            if (/\w/g.test(filter) && filter != null) {
              var selector = new RegExp("\\M\\{(" + parseToReg(keys) + ")\\-\\>" + parseToReg(filter) + "\\}", 'g');
              var checkFilter = filter.replace(/\s/g, '');
              if (checkFilter == "round") {
                returned = returned.replace(selector, eval("Math.round(" + currentVar + ")"));
              }else if(/(roundTo)\(.+\)/g.test(checkFilter)){
                var arguments = checkFilter.replace(/\s/g, '').substring(7, checkFilter.replace(/\s/g, '').length-1).split(',');
                var step = arguments[0].substring(1, arguments[0].length);
                var decrement = arguments[1] || 0;
                returned = returned.replace(selector, (eval("roundTo(" + currentVar + ", "+step+", "+decrement+")")));
              }else if(/(join)\(.+\)/g.test(checkFilter)){
                var arguments = (checkFilter).substring(5, checkFilter.length-1).split(',');
                var join = arguments[0];
                console.log(join);
                returned = returned.replace(selector, (eval(currentVar + ".split(',').join("+join+")")));
              }else if(checkFilter == "floor"){
                returned = returned.replace(selector, eval('Math.floor(' + currentVar + ')') || "");
              }else if(checkFilter == "ceil"){
                returned = returned.replace(selector, eval('Math.ceil(' + currentVar + ')') || "");
              }else if(checkFilter == "uppercase"){
                returned = returned.replace(selector, eval('(' + (currentVar == "" ? "''" : currentVar) + ').toUpperCase()') || "");
              }else if(checkFilter == "lowercase"){
                returned = returned.replace(selector, eval('(' + (currentVar == "" ? "''" : currentVar) + ').toLowerCase()') || "");
              }else if(checkFilter == "percent"){
                returned = returned.replace(selector, eval('' + (currentVar == "" ? "''" : currentVar) + '+"%"') || "");
              }
            } else {
              var selector = new RegExp("\\M\\{" + parseToReg(keys) + "\\}", 'g');
              returned = returned.replace(selector, (((!(eval(currentVar)) || eval(currentVar)) == "undefined" || eval(currentVar) == undefined) ? "" : eval(currentVar) ) );
            }
          //}/)
          return returned;
        }
        function _reloadHTMLText() {
          _scopeElements.forEach(function(el, i) {
            var currentText = _scopeElementsPrevHTML[i];
            var matched = _scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g) instanceof Array ? _scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g) : [_scopeElementsPrevHTML[i].toString().match(/\M\{[^M{]+\}/g)]
            var parsedStr = currentText;
            matched.forEach(function(str, ind) {
              parsedStr = parseScopeString(str, parsedStr);
              el.textContent = parsedStr ? parsedStr : "";
            });
          });
        }
        function _reloadAttributes() {
          _scopeElementsbyAttrs.forEach(function(el, i) {
            _scopeElementsAttributes[i].forEach(function(attr, i) {
              var currentAttr = attr[1].toString();
              if (/\M\{[^M{]+\}/g.test(attr[1].toString())) {
                attr[1].toString().match(/\M\{[^M{]+\}/g).forEach(function(value, ind) {
                  var parsedValue = parseScopeString(value, currentAttr);
                  el[attr[0]] = parsedValue;
                  el.setAttribute(attr[0], parsedValue);
                  currentAttr = parsedValue;
                });
              }
            });
          });
        }
        /*var _mRepeatParent = document.createElement('div');
        function _reloadMRepeat(currentScopeVar){
          M(_mRepeatParent).append(M('.m-repeat-parent'));
          var mRepeat = document.querySelectorAll('.m-repeat-parent');
          Array.prototype.forEach.call(mRepeat, function(el, i){
            var countVal = el.getAttribute('data-count');
            if(countVal){
              var html = el.innerHTML;
              var count = parseFloat(countVal);
              var div = M(el).insertAfter('div');
              div.addClass('m-repeat-parent');
              div.attrs({
                'data-count': countVal
              });
              var outerHTMl = "";
              for(var i = 1; i < count; i++) {
                outerHTMl += html;
              }
              div.html(outerHTMl);  
            }
          })
}*/
        fnScope._load = function() {
          _reloadHTMLText();
          _reloadAttributes();
          //_reloadMRepeat(); 
        };
        fnScope._load();

        /*function _replaceMRepeat(){
          M('m-repeat').each(function(elem, i){
            M(elem).children().addClass('m-repeat');
            var countVal = M(elem).attrs('count');
            if(/\M\{[^M{]+\}/g.test(countVal)){
              var count = parseFloat((countVal).match(/\M\{[^M{]+\}/g)[0].replace(/^M\{/g, '').replace(/\}/g, ''));
            }else{
              var count = parseFloat(countVal);
            }
            var outerHTMl = "";
            var html = M(elem).html();
            for(var i = 0; i < count; i++) {
              var div = M(elem).insertAfter('div');
              div.addClass('m-repeat-parent');
              div.attrs({
                'data-count': countVal
              });
              div.html(html);
            }
            M(elem).remove();
          })
}*/
        returned = {
          reload: function(input, value) {
            if (input)
              eval('_Scope.' + input.attrs('m-listen').toString() + " = " + ("'" + (value || input.val()) + "'"));
              _load();
          }
        }
      })
      return returned
    };

  }
  window.M = M;
}

loadMLiB();

function replaceMtags() {
  M('m-repeat').each(function(elem, i) {
    var children = M(elem).html();
    var attrList = M(elem).attrList();
    var countVal = M(elem).attrs('count');
    var rule = M(elem).attrs('rule');
    if(rule) var array = intScope(rule.split('in')[1]);
    var count = parseFloat(countVal);
    if(countVal){
      var div = M(elem).insertAfter('div');
      div.addClass('m-repeat-parent');
      div.attrs(attrList);
      div.html(children);
      for (var i = 1; i < count; i++) {
        div = div.insertAfter('div');
        div.addClass('m-repeat-parent');
        div.attrs(attrList);
        div.html(children);
      }
    }else if(array){
      console.log('dddd')
      var div = M(elem).insertAfter('div');
      array.forEach(function(el, ind){
        div = div.insertAfter('div');
        div.addClass('m-repeat-parent');
        div.attrs(attrList);
        div.html(children);
      })
    }
    M(elem).remove();
  })
  M('m-progressbar').each(function(elem, i) {
    var self = M(elem);
    var valueMatch = (self.attrs('value').match(/\M\{[^M{]+\}/g) || ['M{' + self.attrs('value') + "}"]);
    var maxMatch = (self.attrs('max').match(/\M\{[^M{]+\}/g) || ['M{' + self.attrs('max') + "}"]);
    var attrs = {
      value: valueMatch[0].substring(2, valueMatch[0].length - 1).replace(/\s/g, ''),
      max: maxMatch[0].substring(2, maxMatch[0].length - 1).replace(/\s/g, ''),
      style: self.attrs('style')
    }
    var show = {};
    if (self.attrs('show-text') == "percent") {
      show = {
        value: value + "%",
        max: "100%"
      }
    } else {
      show = attrs;
    }
    var content = self.html();
    /*var match = content.match(/\M\{[^M{]+\}/g) || [];
    match.forEach(function(el, i) {
      var attr = el.substring(2, el.length - 1);
      var regex = new RegExp(el, 'g');
      content = content.replace(regex, show[attr]);
    })*/
    var container = self.insertAfter('div');
    container.attrs(self.attrList())
    container.addClass('m-progressbar');

    container.attrs({
      style: attrs.style
    })
  
    var markValue = container.newElement('div');
    var text = container.newElement('div');
    text.addClass('m-progressbar-info');
    text.html(content);
    markValue.addClass('m-progressbar-value');
    markValue.css({
      width: 'M{(100*(' + attrs.value + '))/' + attrs.max + '}%',
      maxWidth: container.offset().width + "px"
    })
    container.attrs({'data-value': 'M{'+attrs.value+"}"})
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
        fontSize: Math.floor(parseFloat(newInput.height()) / 4) + "px",
      }
      add.style(style);
      sub.style(style);

      var step = parseFloat(mInput.attrs('step')) || 1;
      var max = parseFloat(mInput.attrs('max')) == 0 ? 0 : (!(mInput.attrs('max')) ? Infinity : parseFloat(mInput.attrs('max')));
      var min = parseFloat(mInput.attrs('min')) == 0 ? 0 : (!(mInput.attrs('min')) ? -Infinity : parseFloat(mInput.attrs('min')));
      var keyDown = Boolean(mInput.attrs('keydown')) || true;
      newInput.attrs({
        'tadindex': '-1'
      })
      var increment = function(e) {
        var inputN = newInput;
        var value = parseFloat(inputN.val()) || 0;
        if (value < max && +(value) + step < max) {
          inputN.val(+(value) + step)
        }else{
          inputN.val(max)
        }
        setTimeout(function(){
          inputN.focus()
        }, 0)
      }
      var decrement = function() {
        var inputN = newInput;
        var value = parseFloat(inputN.val()) || 0;
        if (value > min && +(value) - step > min) {
          inputN.val(+(value) - step)
        }else{
          inputN.val(min)
        }
        setTimeout(function(){
          inputN.focus()
        }, 0)
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
      if (keyDown == true) {
        newInput.events({
          keydown: function(e) {
            if (e.keyCode == 38) {
              e.preventDefault();
              increment();
            } else if (e.keyCode == 40) {
              e.preventDefault();
              decrement();
            }
          }
        });
      }
      mInput.remove();
    } else if (M(elem).attrs('type') == 'range') {
      var mInput = M(elem);
      var showStep = (M(elem).attrs('show-steps'));
      var showWay = (M(elem).attrs('show-way'));
      var attributes = mInput.attrList();
      var input = mInput.insertAfter('div');
      var attributes = mInput.attrList();
      input.attrs(attributes);
      input.addClass('m-input');
      input.addClass('m-input-range');
      var container = input.newElement('div');
      container.addClass('m-input-range-container');
      var rangeBar = container.newElement('div');
      rangeBar.addClass('m-input-range-line');
      var range = container.newElement('div');
      range.addClass('m-input-range-marker');
      range.attrs({
        'tadindex': '-1'
      })

      var containerWidth = (container.offset().width);
      var containerLeft = (container.offset().left);
      var x;
      var draggingLeft = false;
      var max = (/\M\{[^M{]+\}/g.test(mInput.attrs('max')) ? intScope(mInput.attrs('max').substring(2, mInput.attrs('max').length - 1).replace(/\s/g, '')) : mInput.attrs('max')) || 100;
      var value = (/\M\{[^M{]+\}/g.test(mInput.attrs('value')) ? mInput.attrs('value').substring(2, mInput.attrs('value').length - 1).replace(/\s/g, '') : parseFloat(mInput.attrs('value'))) || max/2;
      var step = ((/\M\{[^M{]+\}/g.test(mInput.attrs('step')) ? mInput.attrs('step').substring(2, mInput.attrs('step').length - 1).replace(/\s/g, '') : mInput.attrs('step'))) || 1;
      var markLeft = 
      'M{(' + containerWidth + '*' + value + ')/'+max+' -> roundTo('+Math.floor((step*(containerWidth))/max)+', '+range.offset().width/2+')}';
      var left;
      var eventChange = mInput.attrs('m-change');

      M(window).on("resize", function(e) {
        containerWidth = (container.offset().width);
        containerLeft = (container.offset().left);
      });
      var setMarkerPosition = function(value) {
        return (value * containerWidth) / max - range.offset().width / 2 + "px"
      }
      if (showStep == 'true') {
        var stepsMarker = [];
        for (var i = 1; i < max; i++) {
          if (stepsMarker.indexOf(roundTo(i, step)) == -1) {
            stepsMarker.push(roundTo(i, step));
          }
        }
        stepsMarker.forEach(function(step, index) {
          if(index > 0){
            var stepDiv = container.children('.m-input-range-line').newElement("div");
            stepDiv.addClass('m-input-range-steps');
            var left = (parseFloat(setMarkerPosition(step)) < 0 ? 0 : parseFloat(setMarkerPosition(step)) + range.offset().width/2 - 5);
            stepDiv.css({
              left: left + "px"
              //left: 'calc('+(100*left)/containerWidth + "% - "+range.offset().width/2+"px)"
            })
          }
        })
        M(window).on("resize", function(e) {
          container.children('.m-input-range-line .m-input-range-steps').each(function(el, i){        
            var _step = stepsMarker[i];      
            var left = (parseFloat(setMarkerPosition(_step)) < 0 ? 0 : parseFloat(setMarkerPosition(_step)) + range.offset().width/2 - 5);
            M(el).css({
              left: left + "px"
            })
          })
        });
      }
      input.attrs({
        'data-value': mInput.attrs('value')
      });
      if (showWay == 'true' || showWay == '') {
        var wayDiv = container.children('.m-input-range-line').newElement("div");
        wayDiv.addClass('m-input-range-way');
        var updateWay = function() {
          wayDiv.css({
            width: (parseFloat(setMarkerPosition(input.attrs('data-value'))) < 0 ? 0 : setMarkerPosition(input.attrs('data-value')))
          })
        }
      }
      range.style({
        left: setMarkerPosition(input.attrs('data-value'))
      })
      var focused = false;
      M(window).on("resize", function(e) {
        _updateView.range(input.pure(), input.attrs('data-value'))
      });
      M(window).on("load", function(e) {
        _updateView.range(input.pure(), input.attrs('data-value'))
      });
/*
      range.css({
          left: markLeft + 'px'
      });*/
      container.on("mousedown", function(e) {
        e.stopPropagation();

        max = (/\M\{[^M{]+\}/g.test(input.attrs('max')) ? input.attrs('max').substring(2, input.attrs('max').length - 1).replace(/\s/g, '') : input.attrs('max')) || 100;
        containerWidth = (container.offset().width);
        containerLeft = (container.offset().left);
        x = e.pageX - document.body.scrollLeft;
        var _rangeLeft = (x - containerLeft < 0 ? 0 : x - containerLeft);
        left = M(this).offset().left;
        draggingLeft = true;
        var _value = (max * _rangeLeft) / containerWidth;
        input.attrs({
          'data-value': roundTo(_value, step)
        });
        var dataValue = parseFloat(input.attrs('data-value'));
        range.css({
          left: setMarkerPosition(dataValue)
        });
        if (range.position().left <= -range.offset().width / 2) {
          range.style({
            left: -range.offset().width / 2 + "px"
          });
        };
        if (x >= +containerWidth + left) {
          range.style({
            left: containerWidth - range.offset().width / 2 + "px"
          });
        };
        eval(eventChange);
        e.preventDefault();

        focused = true;
        if (updateWay) updateWay();
      });
      M('body').on('mousedown', function() {
        focused = false;
      })
      M(window).on("mouseup", function(e) {
        draggingLeft = false;
      });
        _updateView.range(input.pure(), input.attrs('data-value'))

      M(window).on("mousemove", function(e) {
        if (draggingLeft) {
          var _x = e.pageX - document.body.scrollLeft;
          var _rangeLeft = (_x - containerLeft < 0 ? 0 : (_x - containerLeft > containerWidth ? containerWidth : _x - containerLeft));
          var _value = (max * (_rangeLeft)) / containerWidth;

          input.attrs({
            'data-value': parseFloat(roundTo(_value, step))
          });
          var dataValue = parseFloat(input.attrs('data-value'));

          range.css({
            left: setMarkerPosition(dataValue)
          });

          if (range.position().left <= -range.offset().width / 2) {
            range.style({
              left: -range.offset().width / 2 + "px"
            });
          }
          if (_x - left >= containerWidth) {
            range.style({
              left: container.offset().width - range.offset().width / 2 + "px"
            });
          }
          eval(eventChange);
          if (updateWay) updateWay();
        }
      });
      document.addEventListener('keydown', function(e){
        if(input.pure() == document.activeElement){
          var _value = parseFloat(input.attrs('data-value'))
          if(e.keyCode == 37){
            _value -= step;
          }else if(e.keyCode == 39){
            _value = parseFloat(step) + parseFloat(_value);
          }else if(e.keyCode == 36){
            _value = parseFloat(0);
          }else if(e.keyCode == 35){
            _value = parseFloat(max);
          }
          _updateView.range(input.pure(), _value)
        }
      });
      input.attrs({'data-value': roundTo(max/2, step)})
      _updateView.range(input.pure(), input.attrs('data-value'))

      //if(wayDiv) wayDiv.css({width: markLeft + 'px'});
      mInput.remove();
    } else if (M(elem).attrs('type') == 'checkbox') {
      var mInput = M(elem);
      
      var keygen = "";
      for(var i = 0; i <= 9; i++){
        keygen += String.fromCharCode(97 + Math.floor(Math.random()*24));
      }
      var inputID = mInput.attrs('id') || keygen;
      var inputValue = mInput.attrs('value') || '';
      var inputMListen = mInput.attrs('m-listen') || '';
      var inputChecked = mInput.attrs('checked') == '' || mInput.attrs('checked') == true ? true : false;
      var inputLabel = mInput.insertAfter('label');
      mInput.removeAttr('id');
      inputLabel.attrs(mInput.attrList());
      inputLabel.attrs({
        'for': inputID,
      })
      inputLabel.addClass('m-input-checkbox-label');
      var inputCheck = inputLabel.newElement('input');
      inputCheck.attrs({
        'id': inputID,
        'type': 'checkbox',
        'class': 'm-input-checkbox-check',
        'm-listen': inputMListen,
        'value': inputValue
      })
      inputCheck.pure().checked = inputChecked;
      document.addEventListener('keydown', function(e){
        if(inputLabel.pure() == document.activeElement && ( e.keyCode == 13 || e.keyCode == 32)){
          inputCheck.pure().checked = !inputCheck.pure().checked
        }
      })
      function _setCheck(){
        inputLabel.attrs({
          'data-value': inputCheck.pure().checked == false ? false : inputCheck.pure().value,
          'data-checked': inputCheck.pure().checked
        })
      }
      _setCheck();
      inputCheck.on('change', _setCheck)
      var input = inputLabel.newElement('div');
      M('label').by.attr('for', inputID).events({
        mouseenter: function(){
          input.removeClass('m-input-checkbox-default');
          input.addClass('m-input-checkbox-hover');
        },
        mouseleave: function(){
          input.removeClass('m-input-checkbox-hover');
          input.addClass('m-input-checkbox-default');
        }
      })
      input.addClass('m-input');
      input.addClass('m-input-checkbox');
      input.addClass('m-input-checkbox-default');
      var inputMarker = input.newElement('div');
      inputMarker.addClass('m-input-checkbox-marker');
      mInput.remove();

    } else if (M(elem).attrs('type') == 'radio') {
      var mInput = M(elem);
      
      var keygenID = "";
      for(var i = 0; i <= 9; i++){
        keygenID += String.fromCharCode(97 + Math.floor(Math.random()*24));
      }
      var inputID = mInput.attrs('id') || keygenID;
      var inputName = mInput.attrs('name') || '';
      var inputValue = mInput.attrs('value') || '';
      var inputMListen = mInput.attrs('m-listen') || '';
      var inputChecked = mInput.attrs('checked') == '' || mInput.attrs('checked') == true ? true : false;
      var inputLabel = mInput.insertAfter('label');
      inputLabel.attrs(mInput.attrList());
      inputLabel.removeAttr('id');
      inputLabel.removeAttr('name');
      inputLabel.attrs({
        'for': inputID,
        'data-name': inputName
      })
      inputLabel.addClass('m-input-radio-label')
      var inputCheck = inputLabel.newElement('input');
      inputCheck.attrs({
        'id': inputID,
        'type': 'radio',
        'class': 'm-input-radio-check',
        'm-listen': inputMListen,
        'value': inputValue,
        'name': inputName
      })
      inputCheck.pure().checked = inputChecked;
      function getChecked(){
        var _value;
        M('input[type="radio"][name="'+inputName+'"').each(function(_elem, _index){
          if(_elem.checked) _value = _elem.value
        })
        M('.m-input-radio-label').by.attr('data-name', inputName).each(function(_elem, _index){
          M(_elem).attrs({'data-value': _value})
        })
      }
      M('input[type="radio"]').by.attr('name', inputName).on('change', function(){
        getChecked();
      })
      document.addEventListener('keydown', function(e){
        if(inputLabel.pure() == document.activeElement && ( e.keyCode == 13 || e.keyCode == 32)){
          inputCheck.pure().checked = !inputCheck.pure().checked
          getChecked();
        }
      })
      function _setCheck(){
        inputLabel.attrs({
          'data-value': inputCheck.pure().checked == false ? false : inputCheck.pure().value,
          'data-checked': inputCheck.pure().checked
        })
      }
      _setCheck();
      inputCheck.on('change', _setCheck)
      var input = inputLabel.newElement('div');
      M('label').by.attr('for', inputID).events({
        mouseenter: function(){
          input.removeClass('m-input-radio-default');
          input.addClass('m-input-radio-hover');
        },
        mouseleave: function(){
          input.removeClass('m-input-radio-hover');
          input.addClass('m-input-radio-default');
        }
      })
      input.addClass('m-input');
      input.addClass('m-input-radio');
      input.addClass('m-input-radio-default');
      mInput.remove();
    };
  });
  M('m-select').each(function(el, i) {
    var mSelect = M(el);
    var mOptions = mSelect.children('m-option');
    var select = mSelect.insertAfter('div');
    select.attrs(mSelect.attrList())
    select.addClass('m-select');
    var title = select.newElement('span');
    title.addClass('m-select-title')
    var optionContainer = select.newElement('div');
    optionContainer.addClass('m-select-options');
    var ul = optionContainer.newElement('ul');
    ul.addClass('m-select-options-list')
    mOptions.each(function(el, i) {
      var li = ul.newElement('li');
      li.html(M(el).html());
      li.addClass('m-select-option')
      li.attrs(M(el).attrList())
      li.attrs({
        'data-value': M(el).attrs('value')
      })
      if (M(el).attrs('default') == '') {
        li.attrs({
          'default': ''
        })
      }
    })
    //optionContainer.customScrollbar();
    var defaultOp = select.children('.m-select-options ul li[default]');
    defaultOp.attrs({
      'selected': ''
    });
    var options = select.children('.m-select-options');
    var optionsList = select.children('.m-select-options ul li');
    title.html(defaultOp.html());

    function loadValue() {
      select.attrs({
        'data-value': select.children().by.attr('selected', '').attrs('data-value')
      })
    }
    loadValue();
    var display = "none";
    M('body').on('click', function(e) {
      display = options.style('display');
      options.style({
        'display': "none"
      })
    })
    select.on('mousedown', function(e) {
      e.preventDefault();
    })
    select.on('click', function(e) {
      e.preventDefault();
      display = options.style('display');
      if (display == "none") {
        options.style({
          'display': "block"
        })
      } else {
        options.style({
          'display': "none"
        })
      }
      optionsList.by.attr('selected', '').focus()
      loadValue();
    })
    optionsList.each(function(el, i) {
      M(el).on('mousedown', function() {
        title.html(M(this).html());
        optionsList.removeAttr('selected')
        M(this).attrs({
          'selected': ''
        });
        options.fadeOut(200);
        loadValue();
      })
    })
    
    document.addEventListener('keydown', function(e){
      if(select.pure() == document.activeElement && ( e.keyCode == 13 || e.keyCode == 32 )){
        display = options.style('display');
        if (display == "none") {
          options.style({
            'display': "block"
          })
        } else {
          options.style({
            'display': "none"
          })
        }
        optionsList.by.attr('selected', '').focus()
        loadValue();
      }else if(select.pure() == document.activeElement && e.keyCode == 40){
        options.style({
          'display': "block"
        })
        optionsList.by.attr('selected', '').focus()
      }
    });
    
    document.addEventListener('keydown', function(e){
      if(M(document.activeElement).hasClass('m-select-option') && ( e.keyCode == 13 || e.keyCode == 32)){
        title.html(M(document.activeElement).html());
        optionsList.removeAttr('selected')
        M(document.activeElement).attrs({
          'selected': ''
        });
        options.fadeOut(200);
        loadValue();
      }else if(M(document.activeElement).hasClass('m-select-option') && ( e.keyCode == 38)){
        e.preventDefault();
        var tabindex = M(document.activeElement).index('.m-select-option');
        var upEl = optionsList.eq((+tabindex-1 < 0 ? 0 : +tabindex-1));
        upEl.focus()
      }else if(M(document.activeElement).hasClass('m-select-option') && ( e.keyCode == 40)){
        e.preventDefault();
        var tabindex = M(document.activeElement).index('.m-select-option');
        tabindex = parseFloat(tabindex) < 0 ? 0 : (parseFloat(tabindex) >  optionsList.length ? optionsList.length : tabindex)
        var downEl = optionsList.eq((+tabindex+1 > optionsList.length-1 ? optionsList.length-1 : +tabindex+1));
        downEl.focus()
      }
    });
    mSelect.remove();
  })

  M('m-polygon').each(function(elem, i) {
    if (M(elem).attrs('type') == 'octagon') {
      var height = parseFloat(M(elem).attrs('size'));
      var background = M(elem).attrs('background') == "" || !(M(elem).attrs('background')) ? "#3c948b" : M(elem).attrs('background');
      var mPolygon = M(elem);
      var polygonBox = mPolygon.insertAfter('div');
      var polygonContainer = polygonBox.newElement('div');
      polygonContainer.addClass('m-polygon-' + M(elem).attrs('type'));
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
      var realSize = Math.ceil(2 * (height / 3));
      polygonBox.css({
        position: 'relative',
        height: Math.ceil(realSize / 2) / 2 + height + "px",
        width: Math.ceil(realSize / 2) / 2 + height + "px"
      });
      polygonContainer.css({
        position: 'relative',
        height: 'auto',
        width: 'auto',
        display: 'inline-block'
      });
      polygonContainer.children('div').css({
        width: height / 2 + 'px',
        height: height / 2 + 'px',
        position: 'absolute',
        background: background
      });
      polygonContainer.children('.center').css({
        left: Math.ceil(realSize / 2) + 'px',
        top: Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .left').css({
        left: -Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .right').css({
        right: -Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .top').css({
        top: -Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .bottom').css({
        bottom: -Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .bottom, .center .top').css({
        height: Math.ceil(realSize / 2) + 'px',
        background: background
      });
      polygonContainer.children('.center .left, .center .right').css({
        width: Math.ceil(realSize / 2) + 'px',
        background: background
      });
      leftTop.css({
        'width': 0,
        'height': 0,
        'border-left': Math.ceil(realSize / 2) + 'px solid transparent',
        'border-bottom': Math.ceil(realSize / 2) + 'px solid ' + background,
        'background': 'transparent'
      });
      rightTop.css({
        width: 0,
        height: 0,
        borderRight: Math.ceil(realSize / 2) + 'px solid transparent',
        borderBottom: Math.ceil(realSize / 2) + 'px solid ' + background,
        background: 'transparent'
      });
      center.children('.left.bottom').css({
        width: 0,
        'height': 0,
        'border-left': Math.ceil(realSize / 2) + 'px solid transparent',
        'border-top': Math.ceil(realSize / 2) + 'px solid ' + background,
        'background': 'transparent'
      });
      center.children('.right.bottom').css({
        'width': 0,
        'height': 0,
        'border-right': Math.ceil(realSize / 2) + 'px solid transparent',
        'border-top': Math.ceil(realSize / 2) + 'px solid ' + background,
        'background': 'transparent'
      })
      var content = polygonBox.newElement('div');
      content.html(mPolygon.html());
      content.css({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'absolute'
      })
      mPolygon.remove();

    } else if (M(elem).attrs('type') == 'hexagon') {
      var height = parseFloat(M(elem).attrs('size'));
      var background = M(elem).attrs('background') == "" || !(M(elem).attrs('background')) ? "#3c948b" : M(elem).attrs('background');
      var mPolygon = M(elem);
      var polygonBox = mPolygon.insertAfter('div');
      var polygonContainer = polygonBox.newElement('div');
      polygonContainer.addClass('m-polygon-' + M(elem).attrs('type'));
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
      var realSize = Math.ceil(4 * (height / 7));
      polygonBox.css({
        position: 'relative',
        height: height + "px",
        width: realSize * 2 + "px"
      });
      polygonContainer.css({
        position: 'relative',
        height: 'auto',
        width: 'auto',
        display: 'inline-block'
      });
      polygonContainer.children('div').css({
        position: 'absolute',
        background: background
      });
      polygonContainer.children('.center').css({
        width: (realSize) + 'px',
        height: height + 'px',
        left: Math.ceil(realSize / 2) + 'px',
        top: 0 + 'px',
        background: background
      });
      leftTop.css({
        left: -Math.ceil(realSize / 2) + 'px',
        top: 0,
        width: 0,
        height: 0,
        borderLeft: Math.ceil(realSize / 2) + 'px solid transparent',
        borderBottom: Math.ceil(height / 2) + 'px solid ' + background,
        background: 'transparent'
      });
      rightTop.css({
        right: -Math.ceil(realSize / 2) + 'px',
        top: 0,
        width: 0,
        height: 0,
        borderRight: Math.ceil(realSize / 2) + 'px solid transparent',
        borderBottom: Math.ceil(height / 2) + 'px solid ' + background,
        background: 'transparent'
      });
      center.children('.left.bottom').css({
        left: -Math.ceil(realSize / 2) + 'px',
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: Math.ceil(realSize / 2) + 'px solid transparent',
        borderTop: Math.ceil(height / 2) + 'px solid ' + background,
        background: 'transparent'
      });
      center.children('.right.bottom').css({
        right: -Math.ceil(realSize / 2) + 'px',
        bottom: 0,
        width: 0,
        height: 0,
        borderRight: Math.ceil(realSize / 2) + 'px solid transparent',
        borderTop: Math.ceil(height / 2) + 'px solid ' + background,
        background: 'transparent'
      })
      var content = polygonBox.newElement('div');
      content.html(mPolygon.html());
      content.css({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        position: 'absolute'
      })
      mPolygon.remove();
    } else if (M(elem).attrs('type') == 'pentagon') {
      var height = parseFloat(M(elem).attrs('size'));
      var background = M(elem).attrs('background') == "" || !(M(elem).attrs('background')) ? "#3c948b" : M(elem).attrs('background');
      var mPolygon = M(elem);
      var polygonBox = mPolygon.insertAfter('div');
      var polygonContainer = polygonBox.newElement('div');
      polygonContainer.addClass('m-polygon-' + M(elem).attrs('type'));
      var center = polygonContainer.newElement('div');
      center.addClass("center");
      var top = center.newElement('div');
      top.addClass("top");
      var left = center.newElement('div');
      left.addClass("left");
      var right = center.newElement('div');
      right.addClass("right");
      var topSize = Math.ceil(height / 15);
      var sideSize = Math.ceil(height / 18);
      polygonBox.css({
        position: 'relative',
        height: height + "px",
        width: realSize * 2 + "px"
      });
      polygonContainer.css({
        position: 'relative',
        height: 'auto',
        width: 'auto',
        display: 'inline-block'
      });
      polygonContainer.children('div').css({
        position: 'absolute',
        background: background
      });
      polygonContainer.children('.center').css({
        width: Math.ceil(height / 1.6) + 'px',
        height: Math.ceil(height / 1.6) + 'px',
        left: sideSize + 'px',
        top: topSize + 'px',
        background: background
      });
      top.css({
        width: 0,
        height: 0,
        top: -topSize + 'px',
        borderLeft: sideSize + 'px solid transparent',
        borderRight: sideSize + 'px solid transparent',
        borderBottom: sideSize + 'px solid ' + background
      });
      left.css({
        left: -sideSize + 'px',
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: sideSize + 'px solid transparent',
        borderTop: Math.ceil(height / 1.6) + 'px solid ' + background,
        background: 'transparent'
      });
      right.css({
        right: -sideSize + 'px',
        bottom: 0,
        width: 0,
        height: 0,
        borderRight: sideSize + 'px solid transparent',
        borderTop: Math.ceil(height / 1.6) + 'px solid ' + background,
        background: 'transparent'
      });
      var content = polygonBox.newElement('div');
      content.html(mPolygon.html());
      content.css({
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
document.addEventListener('DOMContentLoaded', function(){
  replaceMtags();
})
})()