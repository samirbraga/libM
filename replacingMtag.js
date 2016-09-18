
function replaceMtags() {
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
      if (showWay == 'true') {
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
        if(focused){
          e.preventDefault();
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
document.addEventListener('DOMContentLoaded', replaceMtags)