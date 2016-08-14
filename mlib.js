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
