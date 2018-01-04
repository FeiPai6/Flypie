(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * flash的应用信息
 */
module.exports = {
    //domain: 'g-assets.daily.taobao.net',
    domain: 'g.alicdn.com',
    flashVersion: '1.2.1',
    h5Version: '1.4.7',
    logReportTo: '//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track'
};

},{}],2:[function(require,module,exports){
/** 
 * @fileoverview prismplayer的入口模块
 */

var Player = require('./player/player');
var FlashPlayer = require('./player/flashplayer');
var Dom = require('./lib/dom');
var UA = require('./lib/ua');
var _ = require('./lib/object');
var cfg = require('./config');

var prism = function  (opt) {
	var id = opt.id,
		tag;
	
	//如果是一个字符串，我们就认为是元素的id
	if('string' === typeof id){
		
		// id为#string的情况
		if (id.indexOf('#') === 0) {
			id = id.slice(1);
		}

		// 如果在此id上创建过prismplayer实例，返回该实例
		if (prism.players[id]) {
			return prism.players[id];
		} else {
			tag = Dom.el(id);
		}

	} else {
		//否则就认为是dom 元素
		tag = id;
	}

	if(!tag || !tag.nodeName){
		 throw new TypeError('没有为播放器指定容器');
	}

	var option = _.merge(_.copy(prism.defaultOpt), opt);

	//isLive 判断
	if (UA.IS_MOBILE&&opt.isLive) {
		option.skinLayout=[
			{name:"bigPlayButton", align:"blabs", x:30, y:80},
			{
				name:"controlBar", align:"blabs", x:0, y:0,
				children: [
					{name:"liveDisplay", align:"tlabs", x: 15, y:25},
					{name:"fullScreenButton", align:"tr", x:20, y:25},
					{name:"volume", align:"tr", x:20, y:25}
				]
			}
		]
	};

	if (UA.IS_IOS) {
		for(var i=0;i<option.skinLayout.length;i++){
			if(option.skinLayout[i].name=="controlBar"){
				var children=option.skinLayout[i];
				for(var c=0;c<children.children.length;c++){
					if(children.children[c].name=="volume"){
						children.children.splice(c,1);
						break;
					}
				}
			}
		}
	};


	if (option.width) {
		tag.style.width = option.width;
	}
    if (option.height) {
        var per_idx = option.height.indexOf("%");
        if (per_idx > 0)
        {
            var screen_height = window.screen.height;
            var per_value = option.height.replace("%", "");
            if(!isNaN(per_value))
            {
                var scale_value = screen_height * 9 * parseInt(per_value) / 1000;
                tag.style.height = String(scale_value % 2 ? scale_value + 1: scale_value) + "px";
            }
            else
            {
                tag.style.height = option.height;
            }
        }
        else
        {
            tag.style.height = option.height;
        }
    }

	//如果tag已指向一个存在的player，则返回这个player实例
	//否则初始化播放器
	return tag['player'] || 
			(UA.IS_MOBILE ? new Player(tag, option) : new FlashPlayer(tag, option));
			//new Player(tag, option);
}

var prismplayer = window['prismplayer'] = prism;

//全局变量，记录所有的播放器
prism.players = {};

/**
 * 默认的配置项
 */
prism.defaultOpt = {
	preload: false,                     // 是否预加载
	autoplay: true,                    // 是否自动播放
	useNativeControls: false,           // 是否使用默认的控制面板
	width: '100%',                      // 播放器宽度
	height: '300px',                    // 播放器高度
	cover: '',                          // 默认封面图
	from: 'prism_aliyun',               // 渠道来源
	trackLog: true,                     // 是否需要打点
	waterMark:"",					// swf水印配置 http://taobao.com/wm.swf||BR||11123 以||分割url||对齐方式||参数
	isLive:false,						//是否为直播状态(直播暂时只有flash版本支持)
	/* vid 淘宝视频的视频id，必填 */    // 视频id
	skinRes: '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/atlas/defaultSkin',  // String, ui皮肤图片地址，非必填，不填使用默认，纯h5播放器可以不考虑这个字段
	skinLayout: [                            // false | Array, 播放器使用的ui组件，非必填，不传使用默认，传false或[]整体隐藏
		{name:"bigPlayButton", align:"blabs", x:30, y:80},
		{
			name:"controlBar", align:"blabs", x:0, y:0,
			children: [
				{name:"progress", align:"tlabs", x: 0, y:0},
				{name:"playButton", align:"tl", x:15, y:26},
				{name:"nextButton", align:"tl", x:10, y:26},
				{name:"timeDisplay", align:"tl", x:10, y:24},
				{name:"fullScreenButton", align:"tr", x:10, y:25},
				//{name:"setButton", align:"tr", x:0, y:25},
				{name:"streamButton", align:"tr", x:10, y:23},
				{name:"volume", align:"tr", x:10, y:25}
			]
		},
		{
			name:"fullControlBar", align:"tlabs", x:0, y:0,
			children: [
				{name:"fullTitle", align:"tl", x:25, y:6},
				{name:"fullNormalScreenButton", align:"tr", x:24, y:13},
				{name:"fullTimeDisplay", align:"tr", x:10, y:12},
				{name:"fullZoom", align:"cc"}
			]
		}
	]
}

// AMD
if (typeof define === 'function' && define['amd']) {
	  define([], function(){ return prismplayer; });
// commonjs, 支持browserify
} else if (typeof exports === 'object' && typeof module === 'object') {
	  module['exports'] = prismplayer;
}

},{"./config":1,"./lib/dom":5,"./lib/object":10,"./lib/ua":12,"./player/flashplayer":16,"./player/player":17}],3:[function(require,module,exports){
module.exports.get = function(cname) {
	var name = cname + '';
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if(c.indexOf(name) == 0) {
			return unescape(c.substring(name.length + 1,c.length));
		}
	}
	return '';
};

module.exports.set = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = 'expires=' + d.toGMTString();
	document.cookie = cname + '=' + escape(cvalue) + '; ' + expires;
};

},{}],4:[function(require,module,exports){
var _ = require('./object');

/**
 * Element Data Store. Allows for binding data to an element without putting it directly on the element.
 * Ex. Event listneres are stored here.
 * (also from jsninja.com, slightly modified and updated for closure compiler)
 * @type {Object}
 * @private
 */
module.exports.cache = {};

/**
 * Unique ID for an element or function
 * @type {Number}
 * @private
 */
module.exports.guid = function(len, radix) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	} else {
		var r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random()*16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
};

/**
 * Unique attribute name to store an element's guid in
 * @type {String}
 * @constant
 * @private
 */
module.exports.expando = 'vdata' + (new Date()).getTime();

/**
 * Returns the cache object where data for an element is stored
 * @param  {Element} el Element to store data for.
 * @return {Object}
 * @private
 */
module.exports.getData = function(el){
  var id = el[module.exports.expando];
  if (!id) {
    id = el[module.exports.expando] = module.exports.guid();
    module.exports.cache[id] = {};
  }
  return module.exports.cache[id];
};

/**
 * Returns the cache object where data for an element is stored
 * @param  {Element} el Element to store data for.
 * @return {Object}
 * @private
 */
module.exports.hasData = function(el){
  var id = el[module.exports.expando];
  return !(!id || _.isEmpty(module.exports.cache[id]));
};

/**
 * Delete data for the element from the cache and the guid attr from getElementById
 * @param  {Element} el Remove data for an element
 * @private
 */
module.exports.removeData = function(el){
  var id = el[module.exports.expando];
  if (!id) { return; }
  // Remove all stored data
  // Changed to = null
  // http://coding.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
  // module.exports.cache[id] = null;
  delete module.exports.cache[id];

  // Remove the expando property from the DOM node
  try {
    delete el[module.exports.expando];
  } catch(e) {
    if (el.removeAttribute) {
      el.removeAttribute(module.exports.expando);
    } else {
      // IE doesn't appear to support removeAttribute on the document element
      el[module.exports.expando] = null;
    }
  }
};

},{"./object":10}],5:[function(require,module,exports){
/**
 * @fileoverview 封装对dom元素的基本操作
 */

var _ = require('./object');

/**
 * 根据id获取dom
 */
module.exports.el = function(id){
  return document.getElementById(id);
}

/**
 * Creates an element and applies properties.
 * @param  {String=} tagName    Name of tag to be created.
 * @param  {Object=} properties Element properties to be applied.
 * @return {Element}
 * @private
 */
module.exports.createEl = function(tagName, properties){
  var el;

  tagName = tagName || 'div';
  properties = properties || {};

  el = document.createElement(tagName);

  _.each(properties, function(propName, val){
    // Not remembering why we were checking for dash
    // but using setAttribute means you have to use getAttribute

    // The check for dash checks for the aria-* attributes, like aria-label, aria-valuemin.
    // The additional check for "role" is because the default method for adding attributes does not
    // add the attribute "role". My guess is because it's not a valid attribute in some namespaces, although
    // browsers handle the attribute just fine. The W3C allows for aria-* attributes to be used in pre-HTML5 docs.
    // http://www.w3.org/TR/wai-aria-primer/#ariahtml. Using setAttribute gets around this problem.
    if (propName.indexOf('aria-') !== -1 || propName == 'role') {
     el.setAttribute(propName, val);
    } else {
     el[propName] = val;
    }
  });

  return el;
};

/**
 * Add a CSS class name to an element
 * @param {Element} element    Element to add class name to
 * @param {String} classToAdd Classname to add
 * @private
 */
module.exports.addClass = function(element, classToAdd){
  if ((' '+element.className+' ').indexOf(' '+classToAdd+' ') == -1) {
    element.className = element.className === '' ? classToAdd : element.className + ' ' + classToAdd;
  }
};

/**
 * Remove a CSS class name from an element
 * @param {Element} element    Element to remove from class name
 * @param {String} classToAdd Classname to remove
 * @private
 */
module.exports.removeClass = function(element, classToRemove){
  var classNames, i;

  if (element.className.indexOf(classToRemove) == -1) { return; }

  classNames = element.className.split(' ');

  // no arr.indexOf in ie8, and we don't want to add a big shim
  for (i = classNames.length - 1; i >= 0; i--) {
    if (classNames[i] === classToRemove) {
      classNames.splice(i,1);
    }
  }

  element.className = classNames.join(' ');
};

/**
 *
 */
module.exports.getElementAttributes = function(tag){
  var obj, knownBooleans, attrs, attrName, attrVal;

  obj = {};

  // known boolean attributes
  // we can check for matching boolean properties, but older browsers
  // won't know about HTML5 boolean attributes that we still read from
  knownBooleans = ','+'autoplay,controls,loop,muted,default'+',';

  if (tag && tag.attributes && tag.attributes.length > 0) {
    attrs = tag.attributes;

    for (var i = attrs.length - 1; i >= 0; i--) {
      attrName = attrs[i].name;
      attrVal = attrs[i].value;

      // check for known booleans
      // the matching element property will return a value for typeof
      if (typeof tag[attrName] === 'boolean' || knownBooleans.indexOf(','+attrName+',') !== -1) {
        // the value of an included boolean attribute is typically an empty
        // string ('') which would equal false if we just check for a false value.
        // we also don't want support bad code like autoplay='false'
        attrVal = (attrVal !== null) ? true : false;
      }

      obj[attrName] = attrVal;
    }
  }

  return obj;
};
/*

*/
module.exports.insertFirst = function(child, parent){
  if (parent.firstChild) {
    parent.insertBefore(child, parent.firstChild);
  } else {
    parent.appendChild(child);
  }
};

// Attempt to block the ability to select text while dragging controls
module.exports.blockTextSelection = function(){
  document.body.focus();
  document.onselectstart = function () { return false; };
};
// Turn off text selection blocking
module.exports.unblockTextSelection = function(){ document.onselectstart = function () { return true; }; };

/**
 * 设置或获取css属性
 */
module.exports.css = function(el, cssName, cssVal) {
	if (!el.style) return false;
	
	if (cssName && cssVal) {
		el.style[cssName] = cssVal;
		return true;
	
	} else if (!cssVal && typeof cssName === 'string') {
		return el.style[cssName];
	
	} else if (!cssVal && typeof cssName === 'object') {
		_.each(cssName, function(k, v) {
			el.style[k] = v;
		});
		return true;
	}

	return false;
};



},{"./object":10}],6:[function(require,module,exports){
var _ = require('./object');
var Data = require('./data');

/**
 * @fileoverview Event System (John Resig - Secrets of a JS Ninja http://jsninja.com/)
 * (Original book version wasn't completely usable, so fixed some things and made Closure Compiler compatible)
 * This should work very similarly to jQuery's events, however it's based off the book version which isn't as
 * robust as jquery's, so there's probably some differences.
 */

/**
 * Add an event listener to element
 * It stores the handler function in a separate cache object
 * and adds a generic handler to the element's event,
 * along with a unique id (guid) to the element.
 * @param  {Element|Object}   elem Element or object to bind listeners to
 * @param  {String|Array}   type Type of event to bind to.
 * @param  {Function} fn   Event listener.
 * @private
 */
module.exports.on = function(elem, type, fn){
  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.on, elem, type, fn);
  }

  var data = Data.getData(elem);

  // We need a place to store all our handler data
  if (!data.handlers) data.handlers = {};

  if (!data.handlers[type]) data.handlers[type] = [];

  if (!fn.guid) fn.guid = Data.guid();

  data.handlers[type].push(fn);

  if (!data.dispatcher) {
    data.disabled = false;

    data.dispatcher = function (event){

      if (data.disabled) return;
      event = module.exports.fixEvent(event);

      var handlers = data.handlers[event.type];

      if (handlers) {
        // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
        var handlersCopy = handlers.slice(0);

        for (var m = 0, n = handlersCopy.length; m < n; m++) {
          if (event.isImmediatePropagationStopped()) {
            break;
          } else {
            handlersCopy[m].call(elem, event);
          }
        }
      }
    };
  }

  if (data.handlers[type].length == 1) {
    if (elem.addEventListener) {
      elem.addEventListener(type, data.dispatcher, false);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + type, data.dispatcher);
    }
  }
};

/**
 * Removes event listeners from an element
 * @param  {Element|Object}   elem Object to remove listeners from
 * @param  {String|Array=}   type Type of listener to remove. Don't include to remove all events from element.
 * @param  {Function} fn   Specific listener to remove. Don't incldue to remove listeners for an event type.
 * @private
 */
module.exports.off = function(elem, type, fn) {
  // Don't want to add a cache object through getData if not needed
  if (!Data.hasData(elem)) return;

  var data = Data.getData(elem);

  // If no events exist, nothing to unbind
  if (!data.handlers) { return; }

  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.off, elem, type, fn);
  }

  // Utility function
  var removeType = function(t){
     data.handlers[t] = [];
     module.exports.cleanUpEvents(elem,t);
  };

  // Are we removing all bound events?
  if (!type) {
    for (var t in data.handlers) removeType(t);
    return;
  }

  var handlers = data.handlers[type];

  // If no handlers exist, nothing to unbind
  if (!handlers) return;

  // If no listener was provided, remove all listeners for type
  if (!fn) {
    removeType(type);
    return;
  }

  // We're only removing a single handler
  if (fn.guid) {
    for (var n = 0; n < handlers.length; n++) {
      if (handlers[n].guid === fn.guid) {
        handlers.splice(n--, 1);
      }
    }
  }

  module.exports.cleanUpEvents(elem, type);
};

/**
 * Clean up the listener cache and dispatchers
 * @param  {Element|Object} elem Element to clean up
 * @param  {String} type Type of event to clean up
 * @private
 */
module.exports.cleanUpEvents = function(elem, type) {
  var data = Data.getData(elem);

  // Remove the events of a particular type if there are none left
  if (data.handlers[type].length === 0) {
    delete data.handlers[type];
    // data.handlers[type] = null;
    // Setting to null was causing an error with data.handlers

    // Remove the meta-handler from the element
    if (elem.removeEventListener) {
      elem.removeEventListener(type, data.dispatcher, false);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + type, data.dispatcher);
    }
  }

  // Remove the events object if there are no types left
  if (_.isEmpty(data.handlers)) {
    delete data.handlers;
    delete data.dispatcher;
    delete data.disabled;

    // data.handlers = null;
    // data.dispatcher = null;
    // data.disabled = null;
  }

  // Finally remove the expando if there is no data left
  if (_.isEmpty(data)) {
    Data.removeData(elem);
  }
};

/**
 * Fix a native event to have standard property values
 * @param  {Object} event Event object to fix
 * @return {Object}
 * @private
 */
module.exports.fixEvent = function(event) {

  function returnTrue() { return true; }
  function returnFalse() { return false; }

  // Test if fixing up is needed
  // Used to check if !event.stopPropagation instead of isPropagationStopped
  // But native events return true for stopPropagation, but don't have
  // other expected methods like isPropagationStopped. Seems to be a problem
  // with the Javascript Ninja code. So we're just overriding all events now.
  if (!event || !event.isPropagationStopped) {
    var old = event || window.event;

    event = {};
    // Clone the old object so that we can modify the values event = {};
    // IE8 Doesn't like when you mess with native event properties
    // Firefox returns false for event.hasOwnProperty('type') and other props
    //  which makes copying more difficult.
    // TODO: Probably best to create a whitelist of event props
    for (var key in old) {
      // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
      // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
      if (key !== 'layerX' && key !== 'layerY' && key !== 'keyboardEvent.keyLocation') {
        // Chrome 32+ warns if you try to copy deprecated returnValue, but
        // we still want to if preventDefault isn't supported (IE8).
        if (!(key == 'returnValue' && old.preventDefault)) {
          event[key] = old[key];
        }
      }
    }

    // The event occurred on this element
    if (!event.target) {
      event.target = event.srcElement || document;
    }

    // Handle which other element the event is related to
    event.relatedTarget = event.fromElement === event.target ?
      event.toElement :
      event.fromElement;

    // Stop the default browser action
    event.preventDefault = function () {
      if (old.preventDefault) {
        old.preventDefault();
      }
      event.returnValue = false;
      event.isDefaultPrevented = returnTrue;
      event.defaultPrevented = true;
    };

    event.isDefaultPrevented = returnFalse;
    event.defaultPrevented = false;

    // Stop the event from bubbling
    event.stopPropagation = function () {
      if (old.stopPropagation) {
        old.stopPropagation();
      }
      event.cancelBubble = true;
      event.isPropagationStopped = returnTrue;
    };

    event.isPropagationStopped = returnFalse;

    // Stop the event from bubbling and executing other handlers
    event.stopImmediatePropagation = function () {
      if (old.stopImmediatePropagation) {
        old.stopImmediatePropagation();
      }
      event.isImmediatePropagationStopped = returnTrue;
      event.stopPropagation();
    };

    event.isImmediatePropagationStopped = returnFalse;

    // Handle mouse position
    if (event.clientX != null) {
      var doc = document.documentElement, body = document.body;

      event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        (doc && doc.scrollTop || body && body.scrollTop || 0) -
        (doc && doc.clientTop || body && body.clientTop || 0);
    }

    // Handle key presses
    event.which = event.charCode || event.keyCode;

    // Fix button for mouse clicks:
    // 0 == left; 1 == middle; 2 == right
    if (event.button != null) {
      event.button = (event.button & 1 ? 0 :
        (event.button & 4 ? 1 :
          (event.button & 2 ? 2 : 0)));
    }
  }

  // Returns fixed-up instance
  return event;
};

/**
 * Trigger an event for an element
 * @param  {Element|Object}      elem  Element to trigger an event on
 * @param  {Event|Object|String} event A string (the type) or an event object with a type attribute
 * @private
 */
module.exports.trigger = function(elem, event) {
  // Fetches element data and a reference to the parent (for bubbling).
  // Don't want to add a data object to cache for every parent,
  // so checking hasData first.

  var elemData = (Data.hasData(elem)) ? Data.getData(elem) : {};
  var parent = elem.parentNode || elem.ownerDocument;
      // type = event.type || event,
      // handler;

  // If an event name was passed as a string, creates an event out of it
  if (typeof event === 'string') {
    var paramData = null;
    if(elem.paramData){
      paramData = elem.paramData;
      elem.paramData = null;
      elem.removeAttribute(paramData);
    }
    event = { type:event, target:elem, paramData:paramData };
  }
  // Normalizes the event properties.
  event = module.exports.fixEvent(event);

  // If the passed element has a dispatcher, executes the established handlers.
  if (elemData.dispatcher) {
    elemData.dispatcher.call(elem, event);
  }

  // Unless explicitly stopped or the event does not bubble (e.g. media events)
    // recursively calls this function to bubble the event up the DOM.
  if (parent && !event.isPropagationStopped() && event.bubbles !== false) {
    module.exports.trigger(parent, event);

  // If at the top of the DOM, triggers the default action unless disabled.
  } else if (!parent && !event.defaultPrevented) {
    var targetData = Data.getData(event.target);

    // Checks if the target has a default action for this event.
    if (event.target[event.type]) {
      // Temporarily disables event dispatching on the target as we have already executed the handler.
      targetData.disabled = true;
      // Executes the default action.
      if (typeof event.target[event.type] === 'function') {
        event.target[event.type]();
      }
      // Re-enables event dispatching.
      targetData.disabled = false;
    }
  }

  // Inform the triggerer if the default was prevented by returning false
  return !event.defaultPrevented;
};

/**
 * Trigger a listener only once for an event
 * @param  {Element|Object}   elem Element or object to
 * @param  {String|Array}   type
 * @param  {Function} fn
 * @private
 */
module.exports.one = function(elem, type, fn) {
  if (_.isArray(type)) {
    return _handleMultipleEvents(module.exports.one, elem, type, fn);
  }
  var func = function(){
    module.exports.off(elem, type, func);
    fn.apply(this, arguments);
  };
  // copy the guid to the new function so it can removed using the original function's ID
  func.guid = fn.guid = fn.guid || Data.guid();
  module.exports.on(elem, type, func);
};

/**
 * Loops through an array of event types and calls the requested method for each type.
 * @param  {Function} fn   The event method we want to use.
 * @param  {Element|Object} elem Element or object to bind listeners to
 * @param  {String}   type Type of event to bind to.
 * @param  {Function} callback   Event listener.
 * @private
 */
function _handleMultipleEvents(fn, elem, type, callback) {
  _.each(type, function(type) {
    fn(elem, type, callback); //Call the event method for each one of the types
  });
}

},{"./data":4,"./object":10}],7:[function(require,module,exports){
var Data = require('./data');

module.exports.bind = function(context, fn, uid) {
  // Make sure the function has a unique ID
  if (!fn.guid) { fn.guid = Data.guid(); }

  // Create the new function that changes the context
  var ret = function() {
    return fn.apply(context, arguments);
  };

  // Allow for the ability to individualize this function
  // Needed in the case where multiple objects might share the same prototype
  // IF both items add an event listener with the same function, then you try to remove just one
  // it will remove both because they both have the same guid.
  // when using this, you need to use the bind method when you remove the listener as well.
  // currently used in text tracks
  ret.guid = (uid) ? uid + '_' + fn.guid : fn.guid;

  return ret;
};

},{"./data":4}],8:[function(require,module,exports){
var Url = require('./url');

/**
 * Simple http request for retrieving external files (e.g. text tracks)
 * @param  {String}    url             URL of resource
 * @param  {Function} onSuccess       Success callback
 * @param  {Function=} onError         Error callback
 * @param  {Boolean=}   withCredentials Flag which allow credentials
 * @private
 */
module.exports.get = function(url, onSuccess, onError, withCredentials){
  var fileUrl, request, urlInfo, winLoc, crossOrigin;

  onError = onError || function(){};

  if (typeof XMLHttpRequest === 'undefined') {
    // Shim XMLHttpRequest for older IEs
    window.XMLHttpRequest = function () {
      try { return new window.ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e) {}
      try { return new window.ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (f) {}
      try { return new window.ActiveXObject('Msxml2.XMLHTTP'); } catch (g) {}
      throw new Error('This browser does not support XMLHttpRequest.');
    };
  }

  request = new XMLHttpRequest();

  urlInfo = Url.parseUrl(url);
  winLoc = window.location;
  // check if url is for another domain/origin
  // ie8 doesn't know location.origin, so we won't rely on it here
  crossOrigin = (urlInfo.protocol + urlInfo.host) !== (winLoc.protocol + winLoc.host);

  // Use XDomainRequest for IE if XMLHTTPRequest2 isn't available
  // 'withCredentials' is only available in XMLHTTPRequest2
  // Also XDomainRequest has a lot of gotchas, so only use if cross domain
  if(crossOrigin && window.XDomainRequest && !('withCredentials' in request)) {
    request = new window.XDomainRequest();
    request.onload = function() {
      onSuccess(request.responseText);
    };
    request.onerror = onError;
    // these blank handlers need to be set to fix ie9 http://cypressnorth.com/programming/internet-explorer-aborting-ajax-requests-fixed/
    request.onprogress = function() {};
    request.ontimeout = onError;

  // XMLHTTPRequest
  } else {
    fileUrl = (urlInfo.protocol == 'file:' || winLoc.protocol == 'file:');

    request.onreadystatechange = function() {
      if (request.readyState === 4) {
        if (request.status === 200 || fileUrl && request.status === 0) {
          onSuccess(request.responseText);
        } else {
          onError(request.responseText);
        }
      }
    };
  }

  // open the connection
  try {
    // Third arg is async, or ignored by XDomainRequest
    request.open('GET', url, true);
    // withCredentials only supported by XMLHttpRequest2
    if(withCredentials) {
      request.withCredentials = true;
    }
  } catch(e) {
    onError(e);
    return;
  }

  // send the request
  try {
    request.send();
  } catch(e) {
    onError(e);
  }
};

/**
 * jsonp请求
 */
module.exports.jsonp = function(url, onSuccess, onError) {
	var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
	var script = document.createElement('script');
	
	script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
	script.onerror = function() {
		delete window[callbackName];
		document.body.removeChild(script);
		onError();
	};
	// 防止接口返回不支持jsonp时的script标签堆积
	script.onload = function() {
		setTimeout(function() {
			if (window[callbackName]) {
				delete window[callbackName];
				document.body.removeChild(script);
			}
		}, 0);
	};
	
	window[callbackName] = function(data) {
		delete window[callbackName];
		document.body.removeChild(script);
		onSuccess(data);
	};
	
	document.body.appendChild(script);
}

},{"./url":13}],9:[function(require,module,exports){
/**
 * @fileoverview 根据配置渲染ui组件在父级组件中的layout
 * @author 首作<aloysious.ld@taobao.com>
 * @date 2015-01-12
 *
 * ui组件与layout相关的配置项
 * align {String}   'cc'  绝对居中
 *                | 'tl'  左上对齐，组件向左浮动，并以左上角作为偏移原点
 *                | 'tr'  右上对齐，组件向右浮动，并以右上角作为偏移原点
 *                | 'tlabs' 以左上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'trabs' 以右上角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'blabs' 以左下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 *                | 'brabs' 以右下角偏移，相对于父级组件绝对定位，不受同级组件的占位影响
 * x     {Number} x轴的偏移量，align为'cc'时无效
 * y     {Number} y轴的偏移量，align为'cc'时无效
 */

var Dom = require('./dom');

/**
 * 根据配置渲染dom元素的layout
 * @param el  {HTMLElement} dom元素
 * @param opt {Object}      layout配置对象
 */
module.exports.render = function(el, opt) {
	var align = opt.align ? opt.align : 'tl',
		x = opt.x ? opt.x : 0,
		y = opt.y ? opt.y : 0;

	if (align === 'tl') {
		Dom.css(el, {
			'float': 'left',
			'margin-left': x + 'px',
			'margin-top': y+ 'px'
		});
	
	} else if (align === 'tr') {
		Dom.css(el, {
			'float': 'right',
			'margin-right': x + 'px',
			'margin-top': y+ 'px'
		});
	
	} else if (align === 'tlabs') {
		Dom.css(el, {
			'position': 'absolute',
			'left': x + 'px',
			'top': y + 'px'
		});
	
	} else if (align === 'trabs') {
		Dom.css(el, {
			'position': 'absolute',
			'right': x + 'px',
			'top': y + 'px'
		});
	
	} else if (align === 'blabs') {
		Dom.css(el, {
			'position': 'absolute',
			'left': x + 'px',
			'bottom': y + 'px'
		});
	
	} else if (align === 'brabs') {
		Dom.css(el, {
			'position': 'absolute',
			'right': x + 'px',
			'bottom': y + 'px'
		});

	} else if (align === 'cc') {
		Dom.css(el, {
			'position': 'absolute',
			'left': '50%',
			'top': '50%',
			'margin-top': ( el.offsetHeight / -2 ) + 'px',
			'margin-left': ( el.offsetWidth / -2 ) + 'px'
		});
	}
};

},{"./dom":5}],10:[function(require,module,exports){
var hasOwnProp = Object.prototype.hasOwnProperty;
/**
 * Object.create shim for prototypal inheritance
 *
 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create
 *
 * @function
 * @param  {Object}   obj Object to use as prototype
 * @private
 */
module.exports.create = Object.create || function(obj){
  //Create a new function called 'F' which is just an empty object.
  function F() {}

  //the prototype of the 'F' function should point to the
  //parameter of the anonymous function.
  F.prototype = obj;

  //create a new constructor function based off of the 'F' function.
  return new F();
};

/**
 * Loop through each property in an object and call a function
 * whose arguments are (key,value)
 * @param  {Object}   obj Object of properties
 * @param  {Function} fn  Function to be called on each property.
 * @this {*}
 * @private
 */

module.exports.isArray = function(arr){
  return Object.prototype.toString.call(arg) === '[object Array]';
}

module.exports.isEmpty = function(obj) {
  for (var prop in obj) {
    // Inlude null properties as empty.
    if (obj[prop] !== null) {
      return false;
    }
  }
  return true;
};


module.exports.each = function(obj, fn, context){
  //
  if(module.exports.isArray(obj)){
    for (var i = 0, len = obj.length; i < len; ++i) {
      if (fn.call(context || this, obj[i], i) === false) {
	  	break;
	  }
    }
  }else{
     for (var key in obj) {
      if (hasOwnProp.call(obj, key)) {
        // if (key=="code") {
        //   console.log(obj);
        // };
        // console.log(key);
        // console.log(obj[key]);
        if (fn.call(context || this, key, obj[key]) === false) {
			break;
		}
      }
     }   
  }

  return obj;
};

/**
 * Merge two objects together and return the original.
 * @param  {Object} obj1
 * @param  {Object} obj2
 * @return {Object}
 * @private
 */
module.exports.merge = function(obj1, obj2){
  if (!obj2) { return obj1; }
  for (var key in obj2){
    if (hasOwnProp.call(obj2, key)) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
};

/**
 * Merge two objects, and merge any properties that are objects
 * instead of just overwriting one. Uses to merge options hashes
 * where deeper default settings are important.
 * @param  {Object} obj1 Object to override
 * @param  {Object} obj2 Overriding object
 * @return {Object}      New object. Obj1 and Obj2 will be untouched.
 * @private
 */
module.exports.deepMerge = function(obj1, obj2){
  var key, val1, val2;

  // make a copy of obj1 so we're not ovewriting original values.
  // like prototype.options_ and all sub options objects
  obj1 = module.exports.copy(obj1);

  for (key in obj2){
    if (hasOwnProp.call(obj2, key)) {
      val1 = obj1[key];
      val2 = obj2[key];

      // Check if both properties are pure objects and do a deep merge if so
      if (module.exports.isPlain(val1) && module.exports.isPlain(val2)) {
        obj1[key] = module.exports.deepMerge(val1, val2);
      } else {
        obj1[key] = obj2[key];
      }
    }
  }
  return obj1;
};

/**
 * Make a copy of the supplied object
 * @param  {Object} obj Object to copy
 * @return {Object}     Copy of object
 * @private
 */
module.exports.copy = function(obj){
  return module.exports.merge({}, obj);
};

/**
 * Check if an object is plain, and not a dom node or any object sub-instance
 * @param  {Object} obj Object to check
 * @return {Boolean}     True if plain, false otherwise
 * @private
 */
module.exports.isPlain = function(obj){
  return !!obj
    && typeof obj === 'object'
    && obj.toString() === '[object Object]'
    && obj.constructor === Object;
};

/**
 * Check if an object is Array
*  Since instanceof Array will not work on arrays created in another frame we need to use Array.isArray, but since IE8 does not support Array.isArray we need this shim
 * @param  {Object} obj Object to check
 * @return {Boolean}     True if plain, false otherwise
 * @private
 */
module.exports.isArray = Array.isArray || function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

module.exports.unescape = function(str) {
	return str.replace(/&([^;]+);/g, function(m,$1) {
		return {
			'amp': '&',
			'lt': '<',
		   	'gt': '>',
		   	'quot': '"',
		   	'#x27': "'",
		   	'#x60': '`'
		}[$1.toLowerCase()] || m;
	});
};

},{}],11:[function(require,module,exports){
var _ = require('./object');

var oo = function(){};
// Manually exporting module.exports['oo'] here for Closure Compiler
// because of the use of the extend/create class methods
// If we didn't do this, those functions would get flattend to something like
// `a = ...` and `this.prototype` would refer to the global object instead of
// oo

var oo = function() {};
/**
 * Create a new object that inherits from this Object
 *
 *     var Animal = oo.extend();
 *     var Horse = Animal.extend();
 *
 * @param {Object} props Functions and properties to be applied to the
 *                       new object's prototype
 * @return {module.exports.oo} An object that inherits from oo
 * @this {*}
 */
oo.extend = function(props){
  var init, subObj;

  props = props || {};
  // Set up the constructor using the supplied init method
  // or using the init of the parent object
  // Make sure to check the unobfuscated version for external libs
  init = props['init'] || props.init || this.prototype['init'] || this.prototype.init || function(){};
  // In Resig's simple class inheritance (previously used) the constructor
  //  is a function that calls `this.init.apply(arguments)`
  // However that would prevent us from using `ParentObject.call(this);`
  //  in a Child constuctor because the `this` in `this.init`
  //  would still refer to the Child and cause an inifinite loop.
  // We would instead have to do
  //    `ParentObject.prototype.init.apply(this, argumnents);`
  //  Bleh. We're not creating a _super() function, so it's good to keep
  //  the parent constructor reference simple.
  subObj = function(){
    init.apply(this, arguments);
  };

  // Inherit from this object's prototype
  subObj.prototype = _.create(this.prototype);
  // Reset the constructor property for subObj otherwise
  // instances of subObj would have the constructor of the parent Object
  subObj.prototype.constructor = subObj;

  // Make the class extendable
  subObj.extend = oo.extend;
  // Make a function for creating instances
  subObj.create = oo.create;

  // Extend subObj's prototype with functions and other properties from props
  for (var name in props) {
    if (props.hasOwnProperty(name)) {
      subObj.prototype[name] = props[name];
    }
  }

  return subObj;
};

/**
 * Create a new instace of this Object class
 *
 *     var myAnimal = Animal.create();
 *
 * @return {module.exports.oo} An instance of a oo subclass
 * @this {*}
 */
oo.create = function(){
  // Create a new object that inherits from this object's prototype
  var inst = _.create(this.prototype);

  // Apply this constructor function to the new object
  this.apply(inst, arguments);

  // Return the new object
  return inst;
};

module.exports = oo;

},{"./object":10}],12:[function(require,module,exports){
module.exports.USER_AGENT = navigator.userAgent;

/**
 * Device is an iPhone
 * @type {Boolean}
 * @constant
 * @private
 */
module.exports.IS_IPHONE = (/iPhone/i).test(module.exports.USER_AGENT);
module.exports.IS_IPAD = (/iPad/i).test(module.exports.USER_AGENT);
module.exports.IS_IPOD = (/iPod/i).test(module.exports.USER_AGENT);
module.exports.IS_IOS = module.exports.IS_IPHONE || module.exports.IS_IPAD || module.exports.IS_IPOD;

module.exports.IOS_VERSION = (function(){
  var match = module.exports.USER_AGENT.match(/OS (\d+)_/i);
  if (match && match[1]) { return match[1]; }
})();

module.exports.IS_ANDROID = (/Android/i).test(module.exports.USER_AGENT);
module.exports.ANDROID_VERSION = (function() {
  // This matches Android Major.Minor.Patch versions
  // ANDROID_VERSION is Major.Minor as a Number, if Minor isn't available, then only Major is returned
  var match = module.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i),
    major,
    minor;

  if (!match) {
    return null;
  }

  major = match[1] && parseFloat(match[1]);
  minor = match[2] && parseFloat(match[2]);

  if (major && minor) {
    return parseFloat(match[1] + '.' + match[2]);
  } else if (major) {
    return major;
  } else {
    return null;
  }
})();
// Old Android is defined as Version older than 2.3, and requiring a webkit version of the android browser
module.exports.IS_OLD_ANDROID = module.exports.IS_ANDROID && (/webkit/i).test(module.exports.USER_AGENT) && module.exports.ANDROID_VERSION < 2.3;

module.exports.IS_FIREFOX = (/Firefox/i).test(module.exports.USER_AGENT);
module.exports.IS_CHROME = (/Chrome/i).test(module.exports.USER_AGENT);

module.exports.TOUCH_ENABLED = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

module.exports.IS_MOBILE = module.exports.IS_IOS || module.exports.IS_ANDROID;
module.exports.IS_PC = !module.exports.IS_MOBILE;




},{}],13:[function(require,module,exports){
var Dom = require('./dom');

/**
 * Get abosolute version of relative URL. Used to tell flash correct URL.
 * http://stackoverflow.com/questions/470832/getting-an-absolute-url-from-a-relative-one-ie6-issue
 * @param  {String} url URL to make absolute
 * @return {String}     Absolute URL
 * @private
 */
module.exports.getAbsoluteURL = function(url){

  // Check if absolute URL
  if (!url.match(/^https?:\/\//)) {
    // Convert to absolute URL. Flash hosted off-site needs an absolute URL.
    url = Dom.createEl('div', {
      innerHTML: '<a href="'+url+'">x</a>'
    }).firstChild.href;
  }

  return url;
};


/**
 * Resolve and parse the elements of a URL
 * @param  {String} url The url to parse
 * @return {Object}     An object of url details
 */
module.exports.parseUrl = function(url) {
  var div, a, addToBody, props, details;

  props = ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'host'];

  // add the url to an anchor and let the browser parse the URL
  a = Dom.createEl('a', { href: url });

  // IE8 (and 9?) Fix
  // ie8 doesn't parse the URL correctly until the anchor is actually
  // added to the body, and an innerHTML is needed to trigger the parsing
  addToBody = (a.host === '' && a.protocol !== 'file:');
  if (addToBody) {
    div = Dom.createEl('div');
    div.innerHTML = '<a href="'+url+'"></a>';
    a = div.firstChild;
    // prevent the div from affecting layout
    div.setAttribute('style', 'display:none; position:absolute;');
    document.body.appendChild(div);
  }

  // Copy the specific URL properties to a new object
  // This is also needed for IE8 because the anchor loses its
  // properties when it's removed from the dom
  details = {};
  for (var i = 0; i < props.length; i++) {
    details[props[i]] = a[props[i]];
  }

  if (addToBody) {
    document.body.removeChild(div);
  }

  return details;
};

},{"./dom":5}],14:[function(require,module,exports){
// 将秒格式化为00:00:00格式
module.exports.formatTime = function(seconds) {
	var raw = Math.round(seconds),
	hour,
	min,
	sec;

	hour = Math.floor(raw / 3600);
	raw = raw % 3600;
	min = Math.floor(raw / 60);
	sec = raw % 60;

	if (hour === Infinity || isNaN(hour)
		|| min === Infinity || isNaN(min)
		|| sec === Infinity || isNaN(sec)) {
		return false;
	}

	hour = hour >= 10 ? hour: '0' + hour;
	min = min >= 10 ? min: '0' + min;
	sec = sec >= 10 ? sec: '0' + sec;

	return (hour === '00' ? '': (hour + ':')) + min + ':' + sec;
},

// 将00:00:00格式解析为秒
module.exports.parseTime = function(timeStr) {
	var timeArr = timeStr.split(':'),
	h = 0,
	m = 0,
	s = 0;

	if (timeArr.length === 3) {
		h = timeArr[0];
		m = timeArr[1];
		s = timeArr[2];
	} else if (timeArr.length === 2) {
		m = timeArr[0];
		s = timeArr[1];
	} else if (timeArr.length === 1) {
		s = timeArr[0];
	}

	h = parseInt(h, 10);
	m = parseInt(m, 10);
	// 秒可能有小数位，需要向上取整
	s = Math.ceil(parseFloat(s));

	return h * 3600 + m * 60 + s;
}

},{}],15:[function(require,module,exports){
var oo = require('../lib/oo');
var _ = require('../lib/object');
var Cookie = require('../lib/cookie');
var Data = require('../lib/data');
var IO = require('../lib/io');
var UA = require('../lib/ua');
var CONF = require('../config');

var EVENT = {
    'INIT':             1001,  // 初始化
    'CLOSE':            1002,  // 关闭播放器
    'PLAY':             2001,  // 开始播放
    'STOP':             2002,  // 停止，h5下指播放完毕
    'PAUSE':            2003,  // 暂停
    'RECOVER':          2010,  // 暂停恢复
    'SEEK':             2004,  // 拖动
    'SEEK_END':         2011,  // 拖动结束，h5暂时不实现
    'FULLSREEM':        2005,  // 全屏
    'QUITFULLSCREEM':   2006,  // 退出全屏
    'UNDERLOAD':        3002,  // 卡顿
    'LOADED':           3001,  // 卡顿恢复
    'RESOLUTION':       2007,  // 切换清晰度，h5暂时不实现
    'RESOLUTION_DONE':  2009,  // 切换清晰度完成，h5暂时不实现
    'HEARTBEAT':        9001,  // 心跳，5秒间隔
    'ERROR':            4001   // 发生错误
};

//实时监测id
var checkIntervalInt;

var Monitor = oo.extend({
    /**
     * @param player  {Player} 播放器实例
     * @param options {Object} 监控的配置参数
     *     - lv      (log_version)     日志版本，初始版本为1
     *     - b       (bussiness_id)    业务方id, 初始为prism_aliyun, 输入参数from
     *     - lm      (live_mode)       直播点播区分：prism_live,prism_vod
     *     - t       (terminal_type)   终端类型
     *     - pv      (player_version)  播放器版本号，1
     *     - uuid    (uuid)            设备或机器id，h5保存在cookie中
     *     - v       (video_id)        视频id
     *     - u       (user_id)         用户id
     *     - s       (session_id)      播放行为id，一个视频正常播放后需要重置（动态生成）
     *     - e       (event_id)        事件id（动态生成）
     *     - args    (args)            事件携带参数
     *     - d       (definition)      清晰度
     *     - cdn_ip  (cdn_ip)          下载数据的cdn地址，h5无法设置host，这个字段无用，写死为0.0.0.0
     *     - ct      (client_timestamp) 客户端事件戳
     */
    init: function(player, options) {
        this.player = player;
        var po=this.player.getOptions();

        var h5_log_version = "1";
        var h5_bussiness_id = options.from ? options.from : "prism_aliyun";
        var h5_live_mode = po.isLive?"prism_live":"prism_vod";

        // default: pcweb
        var h5_terminal_type = "pc";
        if (UA.IS_IPAD) {
            h5_terminal_type = "pad";
        } else if (UA.IS_IPHONE) {
            h5_terminal_type = "iphone";
        } else if (UA.IS_ANDROID) {
            h5_terminal_type = "andorid";
        }

        var h5_device_model = UA.IS_PC?'pc_h5':'h5';
        var h5_player_version = CONF.h5Version;
        var h5_uuid = this._getUuid();
        var h5_video_id = po.source ? encodeURIComponent(po.source) : options.video_id;
        var h5_user_id = "0";
        var h5_session_id = this.sessionId;
        var h5_event_id = "0";
        var h5_args = "0";
        var h5_definition = "custom";
        var h5_cdn_ip = "0.0.0.0";
        var h5_client_timestamp = new Date().getTime();

        this.opt = {
            APIVersion: '0.6.0',
            lv: h5_log_version,           //log_version
            b: h5_bussiness_id,           //business_id
            lm: h5_live_mode,             //live_mode
            t: h5_terminal_type,          //terminal_type
            m: h5_device_model,           //device_model
            pv: h5_player_version,        //player_version
            uuid: h5_uuid,                //uuid
            v: h5_video_id,               //video_id
            u: h5_user_id,                //user_id
            s: h5_session_id,             //session_id
            e: h5_event_id,               //event_id
            args: h5_args,                //args
            d: h5_definition,             //definition
            cdn_ip: h5_cdn_ip,            //cdn_ip
            ct: h5_client_timestamp,      //client_timestamp
        };

        this.bindEvent();
    },

    //更新视频信息,当播放器实例不变,播放内容更换时使用
    updateVideoInfo:function(options){
        var po=this.player.getOptions();

        var h5_log_version = "1";
        var h5_bussiness_id = options.from ? options.from : "prism_aliyun";
        var h5_live_mode = po.isLive?"prism_live":"prism_vod";

        // default: pcweb
        var h5_terminal_type = "pc";
        if (UA.IS_IPAD) {
            h5_terminal_type = "pad";
        } else if (UA.IS_IPHONE) {
            h5_terminal_type = "iphone";
        } else if (UA.IS_ANDROID) {
            h5_terminal_type = "andorid";
        }

        var h5_device_model = UA.IS_PC?'pc_h5':'h5';
        var h5_player_version = CONF.h5Version;
        var h5_uuid = this._getUuid();
        var h5_video_id = po.source ? encodeURIComponent(po.source) : options.video_id;
        var h5_user_id = "0";
        var h5_session_id = this.sessionId;
        var h5_event_id = "0";
        var h5_args = "0";
        var h5_definition = "custom";
        var h5_cdn_ip = "0.0.0.0";
        var h5_client_timestamp = new Date().getTime();

        this.opt = {
            APIVersion: '0.6.0',
            lv: h5_log_version,           //log_version
            b: h5_bussiness_id,           //business_id
            lm: h5_live_mode,             //live_mode
            t: h5_terminal_type,          //terminal_type
            m: h5_device_model,           //device_model
            pv: h5_player_version,        //player_version
            uuid: h5_uuid,                //uuid
            v: h5_video_id,               //video_id
            u: h5_user_id,                //user_id
            s: h5_session_id,             //session_id
            e: h5_event_id,               //event_id
            args: h5_args,                //args
            d: h5_definition,             //definition
            cdn_ip: h5_cdn_ip,            //cdn_ip
            ct: h5_client_timestamp,      //client_timestamp
        };
    },

    //event
    bindEvent: function() {
        var that = this;
        this.player.on('init',           function() {that._onPlayerInit();});
        window.addEventListener('beforeunload', function() {that._onPlayerClose();});
        this.player.on('ready',          function() {that._onPlayerReady();});
        this.player.on('ended',          function() {that._onPlayerFinish();});
        this.player.on('play',           function() {that._onPlayerPlay();});
        this.player.on('pause',          function() {that._onPlayerPause();});
        //this.player.on('seeking',      function(e){that._onPlayerSeekStart(e);});
        //this.player.on('seeked',       function(e){that._onPlayerSeekEnd(e);});
        this.player.on('seekStart',      function(e){that._onPlayerSeekStart(e);});
        this.player.on('seekEnd',        function(e){that._onPlayerSeekEnd(e);});
        this.player.on('waiting',        function() {that._onPlayerLoaded();});
        this.player.on('canplaythrough', function() {that._onPlayerUnderload();});
        //this.player.on('canplay',        function() {that._onPlayerUnderload();});
        //this.player.on('timeupdate',     function() {that._onPlayerHeartBeat();});
        this.player.on('error',          function() {that._onPlayerError();});
        //this.player.on('fullscreenchange', function() {that._onFullscreenChange);});
        //this.player.on('qualitychange', function() {that._onPlayerSwitchResolution);});

        checkIntervalInt=setInterval(function() {
            // 卡顿开始
            if (that.player.readyState() === 2 || that.player.readyState() === 3) {
                that._onPlayerLoaded();
            //alert("state_buffer");
            // 卡顿恢复
            } else if (that.player.readyState() === 4) {
                that._onPlayerUnderload();
            }
        }, 100);

    },

    removeEvent:function(){
        var that = this;
        this.player.off('init');
        this.player.off('ready');
        this.player.off('ended');
        this.player.off('play');
        this.player.off('pause');
        this.player.off('seekStart');
        this.player.off('seekEnd');
        this.player.off('canplaythrough');
        //this.player.off('timeupdate', function() {that._onPlayerHeartBeat();});
        this.player.off('error');
        //this.player.off('fullscreenchange');
        //this.player.off('qualitychange');

        clearInterval(checkIntervalInt);
    },

    //init
    _onPlayerInit: function() {
        // 重置sessionId
        this.sessionId = Data.guid();
        this._log('INIT', {});
        this.buffer_flag = 0;    //after first play, set 1
        this.pause_flag = 0;     //pause status
    },

    //beforeunload
    _onPlayerClose: function() {
        this._log('CLOSE', {vt: Math.floor(this.player.getCurrentTime() * 1000)});
    },

    //ready
    _onPlayerReady: function() {
        //保存开始播放时间戳
        this.startTimePlay = new Date().getTime();
    },

    //end
    _onPlayerFinish: function() {
        // 重置sessionId
        this.sessionId = Data.guid();
        this._log('STOP', {vt: Math.floor(this.player.getCurrentTime() * 1000)});
    },

    //play
    _onPlayerPlay: function() {
        //若为autoplay,点击开始才上报2001
        if (!this.buffer_flag && this.player._options.autoplay) {
            this.first_play_time = new Date().getTime();
            this._log('PLAY', {dsm: 'fix', vt: 0, cost: this.first_play_time - this.player.getReadyTime()});
            this.buffer_flag = 1;
            return;
        }

        //忽略播放前的暂停
        if (!this.buffer_flag) return;
        //若非暂停则返回
        if (!this.pause_flag) return;
        this.pause_flag = 0;
        this.pauseEndTime = new Date().getTime();
        this._log('RECOVER', {vt: Math.floor(this.player.getCurrentTime() * 1000), cost: this.pauseEndTime - this.pauseTime});
    },

    //pause
    _onPlayerPause: function() {
        //忽略播放前的暂停
        if (!this.buffer_flag) return;
        //未赋值不记录暂停
        if (!this.startTimePlay) return;
        //忽略seek时的暂停
        if (this.seeking) return;
        this.pause_flag = 1;
        this.pauseTime = new Date().getTime();
        this._log('PAUSE', {vt: Math.floor(this.player.getCurrentTime() * 1000)});
    },

    //seekstart
    _onPlayerSeekStart: function(e) {
        this.seekStartTime = e.paramData.fromTime;
        this.seeking = true;
        this.seekStartStamp = new Date().getTime();
    },

    //seekend
    _onPlayerSeekEnd: function(e) {
        this.seekEndStamp = new Date().getTime();
        this._log('SEEK', {drag_from_timestamp: Math.floor(this.seekStartTime * 1000), drag_to_timestamp: Math.floor(e.paramData.toTime * 1000)});
        this._log('SEEK_END', {vt: Math.floor(this.player.getCurrentTime() * 1000), cost: this.seekEndStamp - this.seekStartStamp });
        this.seeking = false;
    },

    //waiting
    _onPlayerLoaded: function() {
        // 第一次播放前不记录卡顿，卡顿不置位，不产生卡顿恢复
        if (!this.buffer_flag) return;
        //未赋值不记录卡顿
        if (!this.startTimePlay) return;
        // 已经处于卡顿或者拖拽过程中不去记录卡顿
        if (this.stucking || this.seeking) return;

        // 如果卡顿在开始播放1s以内发生则忽略
        this.stuckStartTime = new Date().getTime();
        //console.log(this.stuckStartTime);
        //console.log(this.startTimePlay);
        if ( this.stuckStartTime - this.startTimePlay <= 1000 )
            return;

        //alert("load_buffer");
        this.stucking = true;
        this._log('UNDERLOAD', {vt: Math.floor(this.player.getCurrentTime() * 1000)});
        this.stuckStartTime = new Date().getTime();
    },

     //canplaythrough, canplay:有些浏览器没有
    _onPlayerUnderload: function() { //卡顿恢复
        //第一次恢复,并且非自动播放，认为开始播放,(自动播放会提起load数据，导致上报过早)
        if (!this.buffer_flag && !this.player._options.autoplay) {
            this.first_play_time = new Date().getTime();
            this._log('PLAY', {play_mode: 'fix', vt: 0, cost: this.first_play_time - this.player.getReadyTime()});
            this.buffer_flag = 1;
            return;
        }

        //若未开播，且autoplay,则返回
        if(!this.buffer_flag && this.player._options.autoplay ) return;

        // 如果当前不在卡顿中，或者在拖拽过程中，不应该记录卡顿恢复
        if (!this.stucking || this.seeking) return;

        var currTime = Math.floor(this.player.getCurrentTime() * 1000),
            startTime = this.stuckStartTime || new Date().getTime(),
            cost = Math.floor(new Date().getTime() - startTime);

        if (cost < 0) cost = 0;
        this._log('LOADED', {vt: currTime, cost: cost});  
        this.stucking = false;
    },

    _onPlayerHeartBeat: function() {
        // 拖拽过程中不去记录心跳
        if (this.seeking) return;

        var currTime = Math.floor(this.player.getCurrentTime() * 1000),
            that = this;

        if (!this.timer) {
            this.timer = setTimeout(function() {
                !that.seeking && that._log('HEARTBEAT', {progress: currTime});
                clearTimeout(that.timer);
                that.timer = null;
            }, 60000);
        }
    },

    //error
    _onPlayerError: function() {
        var trackerError = {
                'MEDIA_ERR_NETWORK': -1,
                'MEDIA_ERR_SRC_NOT_SUPPORTED': -2,
                'MEDIA_ERR_DECODE': -3
            },
            errorObj = this.player.getError(),
            errorCode = errorObj.code,
            tMsg;

        _.each(errorObj.__proto__, function(k, v) {
            if (v === errorCode) {
                tMsg = k;
                return false;
            }
        });

        if (trackerError[tMsg]) {
            this._log('ERROR', {vt: Math.floor(this.player.getCurrentTime() * 1000), error_code: trackerError[tMsg], error_msg: tMsg});
        }
    },

    _log: function(eventType, extCfg) {
        var cfg = _.copy(this.opt);
        //var url='//log.video.taobao.com/stat/';
        //var url='//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track';
        var url= CONF.logReportTo;

        cfg.e = EVENT[eventType];
        cfg.s = this.sessionId;
        cfg.ct = new Date().getTime();

        var args_params = [];
        _.each(extCfg, function(k, v) {
            args_params.push(k + '=' + v);
        });
        args_params = args_params.join('&');

        if (args_params == "") {
            args_params = "0";
        }
        cfg.args = encodeURIComponent(args_params);

        /*
        if (extCfg.vt) {
            extCfg.vt = Math.round(extCfg.vt);
        }
        if (extCfg.cost) {
            extCfg.cost = Math.round(extCfg.cost);
        }

        extCfg.systs = new Date().getTime();

        cfg = _.merge(cfg, extCfg);
        */

        var params = [];
        _.each(cfg, function(k, v) {
            params.push(k + '=' + v);
        });
        params = params.join('&');

        IO.jsonp(url + '?' + params, function() {}, function() {});
    },

    /**
     * 唯一表示播放器的id缓存在cookie中
     */
    _getUuid: function() {
        // p_h5_u表示prism_h5_uuid
        var uuid = Cookie.get('p_h5_u');

        if (!uuid) {
            uuid = Data.guid();
            Cookie.set('p_h5_u', uuid, 7);
        }

        return uuid;
    }
});

module.exports = Monitor;

},{"../config":1,"../lib/cookie":3,"../lib/data":4,"../lib/io":8,"../lib/object":10,"../lib/oo":11,"../lib/ua":12}],16:[function(require,module,exports){
/*
* flash播放器核心类
*/
var Component = require('../ui/component');
var Data = require('../lib/data');
var _ = require('../lib/object');
var cfg = require('../config');
//var swfobj=require('../lib/swfobject');

var FlashPlayer = Component.extend({

	init: function(tag, options) {
		Component.call(this, this, options);
		
		// 在window下挂载变量,便于flash调用
		this._id = this.id = 'prism-player-' + Data.guid();
        this.tag = tag;
        this._el = this.tag;
		window[this.id] = this;
		
		var width = '100%';
		var height = '100%';
		// TODO 临时先用日常的
		var swfUrl = '//' + cfg.domain + '/de/prismplayer-flash/' + cfg.flashVersion + '/PrismPlayer.swf';
		var flashVar = this._comboFlashVars();
		var wmode=this._options.wmode?this._options.wmode:"opaque";

		tag.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="' + width + '" height="' + height + '" id="' + this.id + '">' +
			'<param name=movie value="' + swfUrl + '">'+
			'<param name=quality value=High>'+
			'<param name="FlashVars" value="' + flashVar + '">' +
			'<param name="WMode" value="'+wmode+'">' +
			'<param name="AllowScriptAccess" value="always">' +
			'<param name="AllowFullScreen" value="true">' +
			'<param name="AllowFullScreenInteractive" value="true">' +
			'<embed name="' + this.id + '" src="' + swfUrl + '" quality=high pluginspage="//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="' + width + '" height="' + height + '" AllowScriptAccess="always" AllowFullScreen="true" AllowFullScreenInteractive="true" WMode="'+wmode+'" FlashVars="' + flashVar + '">' +
			'</embed>'+
		'</object>';

		//swfobj.registerObject(this._id, "10.1.0");
	},
		
	_getPlayer: function(id) {
		if (navigator.appName.indexOf("Microsoft") != -1) { 
			return document.getElementById(id);
		}else{
		   return document[id];
		}
	},

	//增加对 domain,statisticService,videoInfoService,vurl(调整为 source) 的设置支持
	_comboFlashVars: function(){
		var opt = this._options,
			flashVarArr = {
				autoPlay: opt.autoplay ? 1 : 0,
				from: opt.from,
				isInner: 0,
				actRequest: 1,
				//ref: 'share',
				vid: opt.vid,
				domain: opt.domain ? opt.domain : '//tv.taobao.com',
				//statisticService: opt.statisticService ? opt.statisticService : '//log.video.taobao.com/stat/', 
				//statisticService: opt.statisticService ? opt.statisticService : '//videocloud.cn-hangzhou.log.aliyuncs.com/logstores/player/track', 
				statisticService: opt.statisticService ? opt.statisticService : cfg.logReportTo,
				videoInfoService: opt.videoInfoService?opt.videoInfoService:'/player/json/getBaseVideoInfo.do',
				disablePing: opt.trackLog ? 0 : 1,
				namespace: this.id,
				barMode:opt.barMode,
				//直播状态
				isLive:opt.isLive?1:0,
				//水印
				waterMark:opt.waterMark,
				//直接播放的地址
				vurl:opt.source ? encodeURIComponent(opt.source):"",
				//插件
				plugins:opt.plugins?opt.plugins:"",
                snapShotShow:opt.snapshot ? 1 : 0,
                encryp:opt.encryp ? opt.encryp : "null",
                secret:opt.secret ? opt.secret : "null"
			},
			flashVar = [];

		if (opt.cover) {
			flashVarArr.cover = opt.cover;
		}
        if (opt.extraInfo) {
            flashVarArr.extraInfo = encodeURIComponent(JSON.stringify(opt.extraInfo));
        }

		_.each(flashVarArr, function(k, v) {
			flashVar.push(k + '=' + v);
		});

		return flashVar.join('&');
	},
	
	/************************ flash调用js的函数 ***********************/
	
	/**
	 * flashPlayer初始化完毕
	 */
	flashReady: function() {
		this.flashPlayer = this._getPlayer(this.id);
		this._isReady = true;

		// 传递skin相关
		var skinRes = this._options.skinRes,
			skinLayout = this._options.skinLayout,
			skin;

		// 必须是false或者array
		if (skinLayout !== false && !_.isArray(skinLayout)) {
			throw new Error('PrismPlayer Error: skinLayout should be false or type of array!');
		}
		if (typeof skinRes !== 'string') {
			throw new Error('PrismPlayer Error: skinRes should be string!');
		}

		// 如果是false或者[]，隐藏ui组件
		if (skinLayout == false || skinLayout.length === 0) {
			skin = false;
		
		} else {
			skin = {
				skinRes: skinRes,
				skinLayout: skinLayout
			};
		}
		this.flashPlayer.setPlayerSkin(skin);
		
		this.trigger('ready');

		// 告知flash播放器页面关闭
		var that = this;
		window.addEventListener('beforeunload', function() {
			try{
				that.flashPlayer.setPlayerCloseStatus();
			}catch(e){

			}
		});
	},

	/**
	 * flash调用该函数，轮询js的函数声明是否完成
	 */
	jsReady: function() {
		return true;
	},

	uiReady: function() {
		this.trigger('uiReady');
	},

	onPlay: function() {
		this.trigger('play');		
	},

	onEnded: function() {
		this.trigger('ended');		
	},

	onPause: function() {
		this.trigger('pause');		
	},
	//flash弹幕插件初始化完成
	onBulletScreenReady:function(){
		this.trigger('bSReady');
	},
	//flash弹幕发送弹幕消息
	onBulletScreenMsgSend:function(msg){
		this.trigger('bSSendMsg',msg);
	},

	//flash视频开始渲染播放器内逻辑做了单个视频的发送滤重,可以作为canplay的依赖
	onVideoRender:function(time){
		this.trigger('videoRender');
		this.trigger('canplay',{loadtime:time});
	},
	//flash播放器捕捉到错误时调用
	onVideoError:function(type){
		this.trigger('error',{errortype:type});
	},
    //flash catch m3u8 request error and retry
    onM3u8Retry:function(){
        this.trigger('m3u8Retry');
    },
    //flash catch live stream stop
    liveStreamStop:function(){
        this.trigger('liveStreamStop');
    },
	//flash播放器捕捉到缓冲
	onVideoBuffer:function(){
		this.trigger('waiting');
	},

	/**
	 * js调用flash函数的基础方法
	 */
	_invoke: function() {
		var fnName = arguments[0],
			args = arguments;

		Array.prototype.shift.call(args);

		if (!this.flashPlayer) {
			throw new Error('PrismPlayer Error: flash player is not ready!');
		}
		if (typeof this.flashPlayer[fnName] !== 'function') {
			throw new Error('PrismPlayer Error: function ' + fnName + ' is not found!');
		}

		return this.flashPlayer[fnName].apply(this.flashPlayer, args);
	},

	/* ================ 公共接口 ====================== */
	play: function() {
		this._invoke('playVideo'); 
	},

	pause: function() {
		this._invoke('pauseVideo');	   
	},
	stop:function(){
		this._invoke('stopVideo');
	},
	// 秒
	seek: function(time) {
		this._invoke('seekVideo', time);	  
	},

	getCurrentTime: function() {
		return this._invoke('getCurrentTime');				
	},

	getDuration: function() {
		return this._invoke('getDuration');			 
	},

	mute: function() {
        this.setVolume(0);
	},

	unMute: function() {
        this.setVolume(0.5);
	},


	// 0-1
	getVolume: function() {
		return this._invoke('getVolume');		   
	},

	// 0-1
	setVolume: function(vol) {
		this._invoke('setVolume', vol);		   
	},
	//新增接口============================
	//通过id加载视频
	loadByVid: function(vid) {
		this._invoke('loadByVid', vid,false);		   
	},
	//通过url加载视频
	loadByUrl: function(url, seconds) {
		this._invoke('loadByUrl', url, seconds);
	},
	//销毁 暂停视频,其余的由业务逻辑处理
	dispose: function() {
		this._invoke('pauseVideo');		   
	},
	//推送弹幕消息,js获取到消息后推送给flash显示
	showBSMsg:function(msg){
		this._invoke('showBSMsg',msg);
	},
	//设置是否启用toast信息提示
	setToastEnabled:function(enabled){
		this._invoke('setToastEnabled',enabled);
	},
	//设置是否显示loading
	setLoadingInvisible:function(){
		this._invoke('setLoadingInvisible');
	},
    //set player size
    setPlayerSize:function(input_w, input_h){
        var that = this;
        this._el.style.width = input_w

        var per_idx = input_h.indexOf("%");
        if (per_idx > 0)
        {
            var screen_height = window.screen.height;
            var per_value = input_h.replace("%", "");
            if(!isNaN(per_value))
            {
                var scale_value = screen_height * 9 * parseInt(per_value) / 1000;
                this._el.style.height = String(scale_value % 2 ? scale_value + 1: scale_value) + "px";
            }
            else
            {
                this._el.style.height = input_h;
            }
        }
        else
        {
            this._el.style.height = input_h;
        }
        console.log(input_w + input_h);
    },
});

module.exports = FlashPlayer;

},{"../config":1,"../lib/data":4,"../lib/object":10,"../ui/component":18}],17:[function(require,module,exports){
/*
* 播放器核心类
*
*/
var Component = require('../ui/component');
var _ = require('../lib/object');
var Dom = require('../lib/dom');
var Event = require('../lib/event');
var io = require('../lib/io');
var UI = require('../ui/exports');
var Monitor = require('../monitor/monitor');
var UA = require('../lib/ua');

var debug_flag = 0;

var Player = Component.extend({
    init: function (tag, options) {
        this.tag = tag;
        this.loaded = false;

        //调用父类的构造函数
        Component.call(this, this, options);

        //初始化所有插件
        if (options['plugins']) {
            _.each(options['plugins'], function(key, val){
                this[key](val);
            }, this);
        }

        // 如果不使用默认的controls，并且不是iphone，才初始化ui组件
        if (!options['useNativeControls'] /*&& !UA.IS_IPHONE*/) {
            // 将所有可用的ui组件挂载在player下，供初始化组件时索引
            this.UI = UI;
            this.initChildren();
        // 否则设置controls即可
        } else {
            this.tag.setAttribute('controls','controls');
        }

        //监听视频播放器的事件
        this.bindVideoEvent();

        // 如果采用直接传入视频源的方式，则直接播放
        if (this._options.source) {
            // 开始监控
            if (this._options['trackLog']) {
                // 直接传视频源，没有vid和aid，用默认0代替
                this._monitor=new Monitor(this, {video_id: 0, album_id: 0, from: this._options.from});
            }

            // 可以认为此时player init
            this.trigger('init');
            if (debug_flag) {
                console.log('init');
            }

            if (this._options.autoplay) {
                this.getMetaData();
                this.tag.setAttribute('src', this._options.source);
                this.readyTime = new Date().getTime();
                this.loaded = true;
            }

        // 否则，调用接口加载视频资源
        } else if (this._options.vid) {
            this.loadVideoInfo();
        } else {
            // 开始监控
            if (this._options['trackLog']) {
                // 直接传视频源，没有vid和aid，用默认0代替
                this._monitor=new Monitor(this, {video_id: 0, album_id: 0, from: this._options.from});
            }

            // 可以认为此时player init
            this.trigger('init');
            if (debug_flag) {
                console.log('init');
            }
        }

        if (this._options.extraInfo) {
            var dict = eval(this._options.extraInfo);
            if (dict.liveRetry)
                this._options.liveRetry = dict.liveRetry;
        }

        //要想拿到video的元数据，必须等到readyState > 0
        this.on('readyState',function(){
            //是否出现控制面板
            //this.setControls();
            this.trigger('ready');
            if (debug_flag) {
                console.log('ready');
                //alert('ready');
            }
        });

    }
});

/**
 * 重写component的initChildren，
 * player的children通过options.skin传入
 */
Player.prototype.initChildren = function() {
    var opt = this.options(),
        skin = opt.skinLayout;

    // 必须是false或者array
    if (skin !== false && !_.isArray(skin)) {
        throw new Error('PrismPlayer Error: skinLayout should be false or type of array!');
    }

    // 如果是false或者[]，隐藏ui组件
    if (skin !== false && skin.length !== 0) {
        this.options({
            children: skin
        });
        Component.prototype.initChildren.call(this);
    }

    // 所有ui组件被正式添加到dom树后触发
    this.trigger('uiH5Ready');
    if (debug_flag) {
        console.log('uiH5ready');
    }
},

Player.prototype.createEl = function() {
    if(this.tag.tagName !== 'VIDEO'){
        this._el = this.tag;
        this.tag = Component.prototype.createEl.call(this, 'video');
        //如果设置了 inline 播放
        if (this._options.playsinline) {
            this.tag.setAttribute('webkit-playsinline','');
        };
    }

    var el = this._el,
        tag = this.tag,
        that = this;

    //该video已经被初始化为播放器
    tag['player'] = this;



    //把video标签上的属性转移到外围容器上
    var attrs = Dom.getElementAttributes(tag);
    
    _.each(attrs,function(attr){
        el.setAttribute(attr,attrs[attr]);
    });

    //设置video标签属性
    this.setVideoAttrs();

    // 把video标签包裹在el这个容器中
    if (tag.parentNode) {
        tag.parentNode.insertBefore(el, tag);
    }
    Dom.insertFirst(tag, el); // Breaks iPhone, fixed in HTML5 setup.*''

    // 为了屏蔽各个浏览器下video标签的默认样式，需要在其上加一层遮罩
    this.cover = Dom.createEl('div');
    Dom.addClass(this.cover, 'prism-cover');
    el.appendChild(this.cover);

    if (this.options().cover) {
        this.cover.style.backgroundImage = 'url(' + this.options().cover + ')';
    }
    if (!UA.IS_IOS) {
        /*
        this.cover = Dom.createEl('div');
        Dom.addClass(this.cover, 'prism-cover');
        el.appendChild(this.cover);

        if (this.options().cover) {
            this.cover.style.backgroundImage = 'url(' + this.options().cover + ')';
        }
        */

    // ios下用遮罩的方式触发播放有问题，只能使用display:none的方式
    } else {
        Dom.css(tag, 'display', 'none');
    }

    return el;
};

Player.prototype.setVideoAttrs = function(){
    var preload = this._options.preload,
        autoplay = this._options.autoplay;

    this.tag.style.width = '100%';
    this.tag.style.height = '100%';

    if (preload) {
        this.tag.setAttribute('preload','preload');
    }

    if (autoplay) {
        this.tag.setAttribute('autoplay','autoplay');
    }
}

/**
 * sleep function
 */
function sleep(d){
    for(var t = Date.now();Date.now() - t <= d;);
}

/**
 * player的id直接返回组件的id
 */
Player.prototype.id = function() {
    return this.el().id;
};

Player.prototype.renderUI = function() {};

Player.prototype.bindVideoEvent = function(){
    var tag = this.tag,
        that = this;

    //(1)开始load数据
    Event.on(tag, 'loadstart', function(e){
        that.trigger('loadstart');
        if (debug_flag) {
            console.log('loadstart');
            //alert('loadstart');
        }
    });

    //(2)加载视频时长
    Event.on(tag, 'durationchange', function(e){
        that.trigger('durationchange');
        if (debug_flag) {
            console.log('durationchange');
            //alert('durationchange');
        }
    });


    //(3)成功获取资源长度
    Event.on(tag, 'loadedmetadata', function(e){
        that.trigger('loadedmetadata');
        if (debug_flag) {
            console.log('loadedmetadata');
            //alert('loadedmetadata');
        }
    });

    //(4)已加载当前帧,但无足够数据播放
    Event.on(tag, 'loadeddata', function(e){
        that.trigger('loadeddata');
        if (debug_flag) {
            console.log('loadeddata');
            //alert('loadeddata');
        }
    });

    //(5)客户端正在请求数据 
    Event.on(tag, 'progress', function(e){
        that.trigger('progress');
        if (debug_flag) {
            console.log('progress');
            //alert('progress');
        }
    });

    //(6)可以播放数据
    Event.on(tag, 'canplay', function(e){
        var time=(new Date().getTime())-that.readyTime;
        that.trigger('canplay',{loadtime:time});
        if (debug_flag) {
            console.log('canplay');
            //alert('canplay');
        }
    });

    //(7)可以无缓冲播放数据
    Event.on(tag, 'canplaythrough', function(e){
        if (that.cover/* && !UA.IS_IOS*/) {
            Dom.css(that.cover, 'display', 'none');
            delete that.cover;
        }/* else */if (tag.style.display === 'none' && UA.IS_IOS) {
            setTimeout(function() {
                Dom.css(tag, 'display', 'block');
            }, 100);
        }

        that.trigger('canplaythrough');

        if (debug_flag) {
            console.log('canplaythrough');
        }
    });

    //开始播放触发事件 
    Event.on(tag, 'play', function(e){
        that.trigger('play');
        if (debug_flag) {
            console.log('play');
        }
    });

    //none
    Event.on(tag,'play',function(e){
        that.trigger('videoRender');
        if (debug_flag) {
            console.log('videoRender');
        }
    });

    //暂停触发事件 
    Event.on(tag, 'pause', function(e){
        that.trigger('pause');
        if (debug_flag) {
            console.log('pause');
        }
    });

    //结束
    Event.on(tag, 'ended', function(e){
        that.trigger('ended');
        if (debug_flag) {
            console.log('ended');
        }
    }); 

    //客户端尝试获取数据 none
    Event.on(tag, 'stalled', function(e){
        that.trigger('stalled');
        if (debug_flag) {
            console.log('stalled');
        }
    });

    //缓冲等待数据
    Event.on(tag, 'waiting', function(e){
        that.trigger('waiting');
        if (debug_flag) {
            console.log('waiting');
        }
    });

    //播放中
    Event.on(tag, 'playing', function(e){
        that.trigger('playing');
        if (debug_flag) {
            console.log('playing');
        }
    });

    Event.on(tag, 'error', function(e){
        console.log('error');
        //console.log(e);

        if (that._options.isLive)
        {
            if(that._options.liveRetry)
            {
                sleep(2000);
                that.tag.load(that._options.source);
                that.tag.play();
            }
            else
            {
                that.trigger('error');
            }

            that.trigger('liveStreamStop');
        }
        else
        {
            that.trigger('error');
        }
    });

    //not exist now
    Event.on(tag, 'onM3u8Retry', function(e){
        that.trigger('m3u8Retry');
        if (debug_flag) {
            console.log('m3u8Retry');
        }
    });

    //not exist now
    Event.on(tag, 'liveStreamStop', function(e){
        that.trigger('liveStreamStop');
        if (debug_flag) {
            console.log('liveStreamStop');
        }
    });

    //寻找中
    Event.on(tag, 'seeking', function(e){
        that.trigger('seeking');
        if (debug_flag) {
            console.log('seeking');
        }
    });

    //寻找完毕
    Event.on(tag, 'seeked', function(e){
        that.trigger('seeked');
        if (debug_flag) {
            console.log('seeked');
        }
    });

    //播放速率改变
    Event.on(tag, 'ratechange', function(e){
        that.trigger('ratechange');
        if (debug_flag) {
            console.log('ratechange');
        }
    });

    //播放过程触发的事件
    Event.on(tag,'timeupdate',function(e){
        //var currentTime = e.target.currentTime;
        //that.currentTime(currentTime);
        that.trigger('timeupdate');
        if (debug_flag) {
            console.log('timeupdate');
        }
    });

    //全屏修改
    Event.on(tag, 'webkitfullscreenchange', function(e){
        that.trigger('fullscreenchange');
        if (debug_flag) {
            console.log('fullscreenchange');
        }
    });

    this.on('requestFullScreen', function() {
        Dom.addClass(that.el(), 'prism-fullscreen');
        if (debug_flag) {
            console.log('request-fullscreen');
        }
    });
    this.on('cancelFullScreen', function() {
        Dom.removeClass(that.el(), 'prism-fullscreen');
        if (debug_flag) {
            console.log('cancel-fullscreen');
        }
    });

    //may not used
    Event.on(tag,'suspend',function(e){
        that.trigger('suspend');
        if (debug_flag) {
            console.log('sudpend');
        }
    });

    Event.on(tag,'abort',function(e){
        that.trigger('abort');
        if (debug_flag) {
            console.log('abort');
        }
    });

    Event.on(tag,'volumechange',function(e){
        that.trigger('volumechange');
        if (debug_flag) {
            console.log('volumechange');
        }
    });

    Event.on(tag,'drag',function(e){
        that.trigger('drag');
        if (debug_flag) {
            console.log('drag');
        }
    });

    Event.on(tag,'dragstart',function(e){
        that.trigger('dragstart');
        if (debug_flag) {
            console.log('dragstart');
            //alert('dragstart');
        }
    });

    Event.on(tag,'dragover',function(e){
        that.trigger('dragover');
        //console.log('dragover');
        //alert('dragover');
    });


    Event.on(tag,'dragenter',function(e){
        that.trigger('dragenter');
        //console.log('dragenter');
        //alert('dragenter');
    });

    Event.on(tag,'dragleave',function(e){
        that.trigger('dragleave');
        //console.log('dragleave');
        //alert('dragleave');
    });

    Event.on(tag,'ondrag',function(e){
        that.trigger('ondrag');
        //console.log('ondrag');
        //alert('ondrag');
    });

    Event.on(tag,'ondragstart',function(e){
        that.trigger('ondragstart');
        //console.log('ondragstart');
        //alert('ondragstart');
    });

    Event.on(tag,'ondragover',function(e){
        that.trigger('ondragover');
        //console.log('ondragover');
        //alert('ondragover');
    });

    Event.on(tag,'ondragenter',function(e){
        that.trigger('ondragenter');
        //console.log('ondragenter');
        //alert('ondragenter');
    });

    Event.on(tag,'ondragleave',function(e){
        that.trigger('ondragleave');
        //console.log('ondragleave');
        //alert('ondragleave');
    });


    Event.on(tag,'drop',function(e){
        that.trigger('drop');
        //console.log('drop');
        //alert('drop');
    });

    Event.on(tag,'dragend',function(e){
        that.trigger('dragend');
        //console.log('dragend');
        //alert('dragend');
    });

    Event.on(tag,'onscroll',function(e){
        that.trigger('onscroll');
        //console.log('onscroll');
        //alert('onscroll');
    });

}

/**
 * 异步获取videoinfo，成功后触发readyState的检测hack，
 * 因为有很多ui组件的ui更新需要依赖于metadata（时长、buffered等）
 */
Player.prototype.loadVideoInfo = function() {
    var vid = this._options.vid,
        that = this;

    if (!vid) {
        throw new Error('PrismPlayer Error: vid should not be null!');
    }

    // tv.taobao.com
    io.jsonp('//tv.taobao.com/player/json/getBaseVideoInfo.do?vid=' + vid + '&playerType=3', function(data) {

    // applewatch 和 new iphone的临时修改，由于这个活动访问量较大，接口请求临时走cdn
    //io.jsonp('//www.taobao.com/go/rgn/tv/ajax/applewatch-media.php?vid=' + vid + '&playerType=3', function(data) {
    
        if (data.status === 1 && data.data.source) {
            var src,
                maxDef = -1;
            _.each(data.data.source, function(k, v) {
                var def = +k.substring(1);
                if (def > maxDef) maxDef = def;
            });
            src = data.data.source['v' + maxDef];
            src = _.unescape(src)/*.replace(/n\.videotest\.alikunlun\.com/g, 'd.tv.taobao.com')*/;
            that._options.source = src;

            // 开始监控
            if (that._options['trackLog']) {
                that._monitor=new Monitor(that, {video_id: vid, album_id: data.data.baseInfo.aid, from: that._options.from});
            }
            
            // 可以认为此时player init
            that.trigger('init');
            if (debug_flag) {
                console.log('init');
            }

            if (that._options.autoplay) {
                that.getMetaData();
                that.tag.setAttribute('src', that._options.source);
                that.readyTime = new Date().getTime();
                that.loaded = true;
            }

        } else {
            throw new Error('PrismPlayer Error: #vid:' + vid + ' cannot find video resource!');
        }
        
    }, function() {
        throw new Error('PrismPlayer Error: network error!');
    }); 

};


Player.prototype.setControls = function(){
  var options = this.options();
  //如果指定使用系统默认的控制面板
  if(options.useNativeControls){
    //alert("native_control");
    this.tag.setAttribute('controls','controls');
  }else{
    //否则使用我们自定义的控制面板
    // TODO
    //alert("define_control");
    if(typeof options.controls === 'object'){
      //options.controls为controbar的配置项
      var controlBar = this._initControlBar(options.controls);
      this.addChild(controlBar);
    }
  }
}
//
Player.prototype._initControlBar = function(options){
    var controlBar = new ControlBar(this,options);
    return controlBar;
}

/** 
 * 获取视频元数据信息
 */
Player.prototype.getMetaData = function(){
    var that = this, 
        timer = null,
        video = this.tag;

    timer = window.setInterval(function(t){
        if (video.readyState > 0) {
            var vid_duration = Math.round(video.duration);
            that.tag.duration = vid_duration;
            //that.readyTime = new Date().getTime() - that.readyTime;
            that.trigger('readyState');
            if (debug_flag) {
                console.log('readystate');
            }
            clearInterval(timer);
        }
    }, 100);
};

Player.prototype.getReadyTime = function() {
    return this.readyTime;
};

Player.prototype.readyState = function() {
    return this.tag.readyState;
};

Player.prototype.getError = function() {
    return this.tag.error;
};

/* 标准化播放器api
============================================================================= */
//开始播放视频
Player.prototype.play = function(){
    var that = this;
    if (!this._options.autoplay && !this.loaded) {
        this.getMetaData();
        this.tag.setAttribute('src', this._options.source);
        this.readyTime = new Date().getTime();
        this.loaded = true;
    }
    this.tag.play();

    if (debug_flag) {
        //alert('click_play');
    }
    return this;
}
//暂停视频
Player.prototype.pause = function(){
  this.tag.pause();
  return this;
}
//停止视频
Player.prototype.stop = function(){
  this.tag.setAttribute('src',null);
  return this;
}
Player.prototype.paused = function(){
  // The initial state of paused should be true (in Safari it's actually false)
  return this.tag.paused === false ? false : true;
};
//获取视频总时长
Player.prototype.getDuration = function(){
  var totalDuration = this.tag.duration;
  return totalDuration;
}
//设置或者获取当前播放时间

Player.prototype.getCurrentTime = function(){
  var currentTime = this.tag.currentTime;
  return currentTime;
}

Player.prototype.seek = function(time){
    if (time === this.tag.duration) time--;
    try {
        this.tag.currentTime = time;
    } catch(e) {
        console.log(e);
    }
    return this;
}


//通过id加载视频
Player.prototype.loadByVid=function(vid) {
    this._options.vid=vid;
    var that = this;

    if (!vid) {
        throw new Error('PrismPlayer Error: vid should not be null!');
    }

    // tv.taobao.com
    io.jsonp('//tv.taobao.com/player/json/getBaseVideoInfo.do?vid=' + vid + '&playerType=3', function(data) {

    // applewatch 和 new iphone的临时修改，由于这个活动访问量较大，接口请求临时走cdn
    //io.jsonp('//www.taobao.com/go/rgn/tv/ajax/applewatch-media.php?vid=' + vid + '&playerType=3', function(data) {
    
        if (data.status === 1 && data.data.source) {
            var src,
                maxDef = -1;
            _.each(data.data.source, function(k, v) {
                var def = +k.substring(1);
                if (def > maxDef) maxDef = def;
            });
            src = data.data.source['v' + maxDef];
            src = _.unescape(src)/*.replace(/n\.videotest\.alikunlun\.com/g, 'd.tv.taobao.com')*/;
            that._options.source = src;

            // 开始监控
            if (that._options['trackLog']) {
                if (that._monitor) {
                    that._monitor.updateVideoInfo({video_id: vid, album_id: data.data.baseInfo.aid, from: that._options.from});
                }else{
                    that._monitor=new Monitor(that, {video_id: vid, album_id: data.data.baseInfo.aid, from: that._options.from});
                };
            }

            that._options.autoplay=true;

            
            // 可以认为此时player init
            if (!that.loaded) {
                that.trigger('init'); 
                if (debug_flag) {
                    console.log('init');
                }
            };
            
            that.getMetaData();
            that.tag.setAttribute('src', that._options.source);
            that.readyTime = new Date().getTime();
            that.loaded = true;
            
            that.tag.play();

        } else {
            throw new Error('PrismPlayer Error: #vid:' + vid + ' cannot find video resource!');
        }
        
    }, function() {
        throw new Error('PrismPlayer Error: network error!');
    });        
}
//通过url加载视频
Player.prototype.loadByUrl=function(url, seconds) {
    this._options.vid=0;
    this._options.source=url;
    this._options.autoplay=true;
    // 开始监控
    if (this._options['trackLog']) {
        if (this._monitor) {
            this._monitor.updateVideoInfo({video_id: 0, album_id: 0, from: this._options.from});
        }else{
            this._monitor=new Monitor(this,{video_id: 0, album_id: 0, from: this._options.from});
        };
    }

    // 可以认为此时player init
    if (!this.loaded) {
        this.trigger('init'); 
        if (debug_flag) {
            console.log('init');
        }
    };
    
    this.getMetaData();
    this.tag.setAttribute('src', this._options.source);
    this.readyTime = new Date().getTime();
    this.loaded = true;
    this.tag.play();
    if (seconds && !isNaN(seconds)) {
        this.seek(seconds);
    }
}

//播放器销毁方法在清除节点前调用
Player.prototype.dispose=function(){
    this.tag.pause();
    //remove events

    var tag = this.tag,
      that = this;

  //播放过程触发的事件
  Event.off(tag,'timeupdate');
  //开始播放触发事件 
  Event.off(tag, 'play');
  //暂停触发事件 
  Event.off(tag, 'pause');
  Event.off(tag, 'canplay'); 
  Event.off(tag, 'waiting');

  Event.off(tag, 'playing');

  Event.off(tag, 'ended'); 

  Event.off(tag, 'error'); 

  Event.off(tag, 'durationchange');
  Event.off(tag, 'loadedmetadata');
  Event.off(tag, 'loadeddata');
  Event.off(tag, 'progress');
  Event.off(tag, 'canplaythrough');

  Event.off(tag, 'webkitfullscreenchange');
  this.tag=null;
  this._options=null;

  if (this._monitor) {
    this._monitor.removeEvent();
    this._monitor=null;
  };
}

//设置静音或者获取是否静音

Player.prototype.mute = function(){
  this.tag.muted = true;
  return this;
}

Player.prototype.unMute = function(){
  this.tag.muted = false;
  return this;
}

Player.prototype.muted = function() {
    return this.tag.muted;
};

//设置或者获取音量
Player.prototype.getVolume = function(){
    return this.tag.volume;
}
//获取配置
Player.prototype.getOptions=function(){
    return this._options;
}
/*
0-1区间
*/
Player.prototype.setVolume = function(volume){
    this.tag.volume = volume;
}
//隐藏进度条控制
Player.prototype.hideProgress = function(){
    var that = this;
    that.trigger('hideProgress');
    console.log("send hide flag");
}
//取消隐藏进度条控制
Player.prototype.cancelHideProgress = function(){
    var that = this;
    that.trigger('cancelHideProgress');
    console.log("send cancel flag");
}

//set player size when play
Player.prototype.setPlayerSize = function(input_w, input_h){
    var that = this;
    this._el.style.width = input_w

    if (input_h)
    {
        var per_idx = input_h.indexOf("%");
        if (per_idx > 0)
        {
            var screen_height = window.screen.height;
            var per_value = input_h.replace("%", "");
            if(!isNaN(per_value))
            {
                var scale_value = screen_height * 9 * parseInt(per_value) / 1000;
                this._el.style.height = String(scale_value % 2 ? scale_value + 1: scale_value) + "px";
            }
            else
            {
                this._el.style.height = input_h;
            }
        }
        else
        {
            this._el.style.height = input_h;
        }
    }
}



/*
//no full sreen function call
var fullScreenNoSupportCall = (function() {
    var docHtml  = document.documentElement;
    var docBody  = document.body;
    var videobox  = document.getElementById('videobox');
    var cssText = 'width:100%;height:100%;overflow:hidden;';

    docHtml.style.cssText = cssText;
//    docBody.style.cssText = cssText;
    videobox.style.cssText = cssText+';'+'margin:0px;padding:0px;';
    document.IsFullScreen = true;

})()

//no full sreen function exit
var fullScreenNoSupportExit = (function() {
    var docHtml  = document.documentElement;
    var docBody  = document.body;
    var videobox  = document.getElementById('videobox');

    docHtml.style.cssText = "";
//    docBody.style.cssText = "";
    videobox.style.cssText = "";
    document.IsFullScreen = false;
})()
*/

// 检测fullscreen的支持情况，即时函数
var __supportFullscreen = (function() {
    var prefix, requestFS, div;

    div = Dom.createEl('div');
    requestFS = {};

    var apiMap = [
      // Spec: https://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
      [
        'requestFullscreen',
        'exitFullscreen',
        'fullscreenElement',
        'fullscreenEnabled',
        'fullscreenchange',
        'fullscreenerror',
        'fullScreen'
      ],
      // WebKit
      [
        'webkitRequestFullscreen',
        'webkitExitFullscreen',
        'webkitFullscreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
        'webkitfullScreen'
      ],
      // Old WebKit(Safari 5.1)
      [
        'webkitRequestFullScreen',
        'webkitCancelFullScreen',
        'webkitCurrentFullScreenElement',
        'webkitFullscreenEnabled',
        'webkitfullscreenchange',
        'webkitfullscreenerror',
        'webkitIsFullScreen'
      ],
      // // safari iOS
      // [
      //   'webkitEnterFullscreen',
      //   'webkitExitFullscreen',
      //   'webkitCurrentFullScreenElement',
      //   'webkitCancelFullScreen',
      //   'webkitfullscreenchange',
      //   'webkitfullscreenerror',
      //   'webkitDisplayingFullscreen'
      // ],
      // Mozilla
      [
        'mozRequestFullScreen',
        'mozCancelFullScreen',
        'mozFullScreenElement',
        'mozFullScreenEnabled',
        'mozfullscreenchange',
        'mozfullscreenerror',
        'mozfullScreen'
      ],
      // Microsoft
      [
        'msRequestFullscreen',
        'msExitFullscreen',
        'msFullscreenElement',
        'msFullscreenEnabled',
        'MSFullscreenChange',
        'MSFullscreenError',
        'MSFullScreen'
      ]
    ];

    if (UA.IS_IOS) {
        //IOS 特殊处理
        requestFS.requestFn="webkitEnterFullscreen";
        requestFS.cancelFn="webkitExitFullscreen";
        requestFS.eventName="webkitfullscreenchange";
        requestFS.isFullScreen ="webkitDisplayingFullscreen";
    }else{
        var l=5;
        for (var i = 0; i < l; i++) {
          // check for exitFullscreen function
          if (apiMap[i][1] in document) {
            requestFS.requestFn=apiMap[i][0];
            requestFS.cancelFn=apiMap[i][1];
            requestFS.eventName=apiMap[i][4];
            requestFS.isFullScreen =apiMap[i][6];
            break;
          }
        }

        //modify if has write fun
        //full screen
        if ( 'requestFullscreen' in document) {
            requestFS.requestFn='requestFullscreen';
        } else if ( 'webkitRequestFullscreen' in document ) {
            requestFS.requestFn='webkitRequestFullscreen';
        } else if ( 'webkitRequestFullScreen' in document ) {
            requestFS.requestFn='webkitRequestFullScreen';
        } else if ( 'webkitEnterFullscreen' in document ) {
            requestFS.requestFn='webkitEnterFullscreen';
        } else if ( 'mozRequestFullScreen' in document ) {
            requestFS.requestFn='mozRequestFullScreen';
        } else if ( 'msRequestFullscreen' in document ) {
            requestFS.requestFn='msRequestFullscreen';
        }

        //full screen change
        if ( 'fullscreenchange' in document) {
            requestFS.eventName='fullscreenchange';
        } else if ( 'webkitfullscreenchange' in document ) {
            requestFS.eventName='webkitfullscreenchange';
        } else if ( 'webkitfullscreenchange' in document ) {
            requestFS.eventName='webkitfullscreenchange';
        } else if ( 'webkitfullscreenchange' in document ) {
            requestFS.eventName='webkitfullscreenchange';
        } else if ( 'mozfullscreenchange' in document ) {
            requestFS.eventName='mozfullscreenchange';
        } else if ( 'MSFullscreenChange' in document ) {
            requestFS.eventName='MSFullscreenChange';
        }

        //full screen status
        if ( 'fullScreen' in document) {
            requestFS.isFullScreen='fullScreen';
        } else if ( 'webkitfullScreen' in document ) {
            requestFS.isFullScreen='webkitfullScreen';
        } else if ( 'webkitIsFullScreen' in document ) {
            requestFS.isFullScreen='webkitIsFullScreen';
        } else if ( 'webkitDisplayingFullscreen' in document ) {
            requestFS.isFullScreen='webkitDisplayingFullscreen';
        } else if ( 'mozfullScreen' in document ) {
            requestFS.isFullScreen='mozfullScreen';
        } else if ( 'MSFullScreen' in document ) {
            requestFS.isFullScreen='MSFullScreen';
        }

    };


    // 如果浏览器实现了W3C标准的定义
    /*if (div.cancelFullscreen !== undefined) {
        requestFS.requestFn = 'requestFullscreen';
        requestFS.cancelFn = 'cancelFullscreen';
        requestFS.eventName = 'fullscreenchange';
        requestFS.isFullScreen = 'fullScreen';

        // 如果是webkit和mozilla内核，调用全屏接口时需要带前缀
    } else {
        if (document.mozCancelFullScreen) {
            prefix = 'moz';
            requestFS.isFullScreen = prefix + 'FullScreen';
        } else {
            prefix = 'webkit';
            requestFS.isFullScreen = prefix + 'IsFullScreen';
        }

        if (div[prefix + 'RequestFullScreen']) {
            requestFS.requestFn = prefix + 'RequestFullScreen';
            requestFS.cancelFn = prefix + 'CancelFullScreen';
        }else if( div[prefix + 'EnterFullScreen']){
            requestFS.requestFn=prefix + 'EnterFullScreen';
            if(div[prefix + 'CancelFullScreen']){
                requestFS.cancelFn = prefix + 'CancelFullScreen';
            }else if(div[prefix + 'ExitFullscreen']){
                requestFS.cancelFn = prefix + 'ExitFullscreen';
            }
        }
        requestFS.eventName = prefix + 'fullscreenchange';
    }*/

    if (requestFS.requestFn) {
        return requestFS;
    }
    // 如果浏览器不支持全屏接口，返回null
    return null;
})();
// 注意，即时函数

/**
 * 不支持fullscreenAPI时的全屏模拟
 *
 * @method _enterFullWindow
 * @private
 */
Player.prototype._enterFullWindow = function() {
    var that = this;

    this.isFullWindow = true;
    this.docOrigOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    Dom.addClass(document.getElementsByTagName('body')[0], 'prism-full-window');
    //this.trigger('enterfullwindow');
};

/**
 * 不支持fullscreenAPI时的取消全屏模拟
 *
 * @method _exitFullWindow
 * @private
 */
Player.prototype._exitFullWindow = function() {
    this.isFullWindow = false;

    document.documentElement.style.overflow = this.docOrigOverflow;
    Dom.removeClass(document.getElementsByTagName('body')[0], 'prism-full-window');
    //this.trigger('exitfullwindow');
};

/**
 * 设置全屏
 *
 * @method requestFullScreen
 */
Player.prototype.requestFullScreen = function() {
    //alert("call_full");
    var requestFullScreen = __supportFullscreen,
        conTag = this.el(),
        that = this;

    if (UA.IS_IOS) {
        conTag=this.tag;
        conTag[requestFullScreen.requestFn]();

        return this;
    };

    this.isFullScreen = true;

    // 如果浏览器支持全屏接口
    if (requestFullScreen) {
        Event.on(document, requestFullScreen.eventName, function(e) {
            that.isFullScreen = document[requestFullScreen.isFullScreen];
            if (that.isFullScreen === true) {
                Event.off(document, requestFullScreen.eventName);
            }
            //alert("open status:" + that.isFullScreen);
            that.trigger('requestFullScreen');
        });
        conTag[requestFullScreen.requestFn]();

        // 如果不支持全屏接口，则模拟实现
    } else {
        this._enterFullWindow();
        this.trigger('requestFullScreen');
    }

    return this;
};

/**
 * 取消全屏
 *
 * @method cancelFullScreen
 */
Player.prototype.cancelFullScreen = function() {
    //alert("quit_full");
    var requestFullScreen = __supportFullscreen,
        that = this;
        
    this.isFullScreen = false;

    if (requestFullScreen) {
        Event.on(document, requestFullScreen.eventName, function(e) {
            that.isFullScreen = document[requestFullScreen.isFullScreen];

            if (that.isFullScreen === false) {
                Event.off(document, requestFullScreen.eventName);
            }

            //alert("close status:" + that.isFullScreen);
            that.trigger('cancelFullScreen');
        });
        
        document[requestFullScreen.cancelFn]();

        //alert("ray_cancel0");
        this.trigger('play');
    } else {
        this._exitFullWindow();
        this.trigger('cancelFullScreen');
        this.trigger('play');
    }

    return this;
};

/**
 * 是否处于全屏
 *
 * @method getIsFullScreen
 * @return {Boolean} 是否为全屏
 */
Player.prototype.getIsFullScreen = function() {
    return this.isFullScreen;
};
        
/**
 * 获取已经缓存的时间区间
 *
 * @method getBuffered
 * @return {Array} 时间区间数组timeRanges
 */
Player.prototype.getBuffered = function() {
    return this.tag.buffered;
};

//设置是否启用toast信息提示
Player.prototype.setToastEnabled=function(enabled){
    //for flash
    //this._invoke('setToastEnabled');
};

//设置是否显示loading
Player.prototype.setLoadingInvisible=function(){
    //for flash
    //this_invoke('setLoadingInvisible');
}

module.exports = Player;

},{"../lib/dom":5,"../lib/event":6,"../lib/io":8,"../lib/object":10,"../lib/ua":12,"../monitor/monitor":15,"../ui/component":18,"../ui/exports":27}],18:[function(require,module,exports){
var oo = require('../lib/oo');
var Data = require('../lib/data');
var _ = require('../lib/object');
var Dom = require('../lib/dom');
var Event = require('../lib/event'); 
var Fn = require('../lib/function');
var Layout = require('../lib/layout');

var Component = oo.extend({
	init: function (player, options) {
		var that = this;

		this._player = player;

		// Make a copy of prototype.options_ to protect against overriding global defaults
		this._options = _.copy(options);
		this._el = this.createEl();
		this._id = player.id() + '_component_' + Data.guid();

		this._children = [];
		this._childIndex = {};

		// 只有组件真正被添加到dom树中后再同步ui、绑定事件
		// 从而避免获取不到dom元素
		this._player.on('uiH5Ready', function() {
			that.renderUI();
			that.syncUI();
			that.bindEvent();
		});
	}
});

/**
 * 渲染ui 
 */
Component.prototype.renderUI = function() {
	// 根据ui组件的配置渲染layout
	Layout.render(this.el(), this.options());
	// 设置id
	this.el().id = this.id();
};

/**
 * 同步ui状态，子类中实现
 */
Component.prototype.syncUI = function() {};

/**
 * 绑定事件，子类中实现
 */
Component.prototype.bindEvent = function() {};

/**
 * 生成compoent的dom元素
 *
 */
Component.prototype.createEl = function(tagName, attributes){
  return Dom.createEl(tagName, attributes);
};

/**
 * 获取component的所有配置项
 *
 */

Component.prototype.options = function(obj){
  if (obj === undefined) return this._options;

  return this._options = _.merge(this._options, obj);
};

/**
 * 获取componet的dom元素
 *
 */
Component.prototype.el = function(){
  return this._el;
};


Component.prototype._contentEl;


Component.prototype.player = function(){
  return this._player;
}

/**
 * Return the component's DOM element for embedding content.
 * Will either be el_ or a new element defined in createEl.
 *
 * @return {Element}
 */
Component.prototype.contentEl = function(){
  return this._contentEl || this._el;
};

/**
 * 设置元素id
 *
 */

Component.prototype._id;

/**
 * 获取元素id
 *
 */
Component.prototype.id = function(){
  return this._id;
};

/* 子元素相关操作
============================================================================= */

/**
 * 添加所有子元素
 *
 */
Component.prototype.addChild = function(child, options){
    var component, componentClass, componentName, componentId;

    // 如果child是一个字符串
    if(typeof child === 'string'){
      if(!this._player.UI[child]) return;
      component = new this._player.UI[child](this._player,options);
    }else{
    // child是一个compnent对象
      component = child;
    }

    //
    this._children.push(component);

    if (typeof component.id === 'function') {
      this._childIndex[component.id()] = component;
    }

    // 把子元素的dom元素插入父元素中
    if (typeof component['el'] === 'function' && component['el']()) {
      this.contentEl().appendChild(component['el']());
    }

    // 返回添加的子元素
    return component;
};
/**
 * 删除指定的子元素
 *
 */
Component.prototype.removeChild = function(component){

    if (!component || !this._children) return;

    var childFound = false;
    for (var i = this._children.length - 1; i >= 0; i--) {
      if (this._children[i] === component) {
        childFound = true;
        this._children.splice(i,1);
        break;
      }
    }

    if (!childFound) return;

    this._childIndex[component.id] = null;

    var compEl = component.el();
    if (compEl && compEl.parentNode === this.contentEl()) {
      this.contentEl().removeChild(component.el());
    }
};
/**
 * 初始化所有子元素
 *
 */
Component.prototype.initChildren = function(){
  var parent, children, child, name, opts;

  parent = this;
  children = this.options()['children'];

  if (children) {
    // 如果多个子元素是一个数组
    if (_.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];

        if (typeof child == 'string') {
          name = child;
          opts = {};
        } else {
          name = child.name;
          opts = child;
        }

        parent.addChild(name, opts);
      }
    } else {
      _.each(children, function(name, opts){
        // Allow for disabling default components
        // e.g. vjs.options['children']['posterImage'] = false
        if (opts === false) return;

        parent.addChild(name, opts);
      });
    }
  }
};


/* 事件操作
============================================================================= */

/**
 * 在component上的的dom元素上添加一个事件监听器
 *
 *     var myFunc = function(){
 *       var myPlayer = this;
 *       // Do something when the event is fired
 *     };
 *
 *     myPlayer.on("eventName", myFunc);
 *
 * The context will be the component.
 *
 * @param  {String}   type The event type e.g. 'click'
 * @param  {Function} fn   The event listener
 * @return {Component} self
 */
Component.prototype.on = function(type, fn){

  Event.on(this._el, type, Fn.bind(this, fn));
  return this;
};

/**
 * 从component上删除指定事件的监听器
 *
 *     myComponent.off("eventName", myFunc);
 *
 * @param  {String=}   type Event type. Without type it will remove all listeners.
 * @param  {Function=} fn   Event listener. Without fn it will remove all listeners for a type.
 * @return {Component}
 */
Component.prototype.off = function(type, fn){
  Event.off(this._el, type, fn);
  return this;
};

/**
 * 在组件的元素上添加一个只执行一次的事件监听器
 *
 * @param  {String}   type Event type
 * @param  {Function} fn   Event listener
 * @return {Component}
 */
Component.prototype.one = function(type, fn) {
  Event.one(this._el, type, Fn.bind(this, fn));
  return this;
};

/**
 * 在组件的元素上触发一个事件
 */
Component.prototype.trigger = function(event,paramData){
  //
  if(paramData){
    this._el.paramData = paramData;
  }
  Event.trigger(this._el, event);
  return this;
};

/* 组件展现
============================================================================= */

/**
 * 在component上添加指定的className
 *
 * @param {String} classToAdd Classname to add
 * @return {Component}
 */
Component.prototype.addClass = function(classToAdd){
  Dom.addClass(this._el, classToAdd);
  return this;
};

/**
 * 从component删除指定的className
 *
 * @param {String} classToRemove Classname to remove
 * @return {Component}
 */
Component.prototype.removeClass = function(classToRemove){
  Dom.removeClass(this._el, classToRemove);
  return this;
};

/**
 * 显示组件
 *
 * @return {Component}
 */
Component.prototype.show = function(){
  this._el.style.display = 'block';
  return this;
};

/**
 * 隐藏组件
 *
 * @return {Component}
 */
Component.prototype.hide = function(){
  this._el.style.display = 'none';
  return this;
};

/**
 * 销毁component
 *
 * @return 
 */

Component.prototype.destroy = function(){
    this.trigger({ type: 'destroy', 'bubbles': false });

    // 销毁所有子元素
    if (this._children) {
      for (var i = this._children.length - 1; i >= 0; i--) {
        if (this._children[i].destroy) {
          this._children[i].destroy();
        }
      }
    }

    // 删除所有children引用
    this.children_ = null;
    this.childIndex_ = null;

    // 删除所有事件监听器.
    this.off();

    // 从dom中删除所有元素
    if (this._el.parentNode) {
      this._el.parentNode.removeChild(this._el);
    }
    // 删除所有data引用
    Data.removeData(this._el);
    this._el = null;
};

module.exports = Component;

},{"../lib/data":4,"../lib/dom":5,"../lib/event":6,"../lib/function":7,"../lib/layout":9,"../lib/object":10,"../lib/oo":11}],19:[function(require,module,exports){
/**
 * @fileoverview 大播放按钮
 */
var Component = require('../component');
var Dom = require('../../lib/dom');

var BigPlayButton = Component.extend({
	init: function  (player, options) {
		var that = this;
		Component.call(this, player, options);
		this.addClass(options.className || 'prism-big-play-btn');
	},
	
	bindEvent: function() {
		var that = this;

		this._player.on('canplay', function(){
			that.addClass('playing');
			Dom.css(that.el(), 'display', 'none');
		});

		this._player.on('pause', function(){
			that.removeClass('playing');
			Dom.css(that.el(), 'display', 'block');
		});

		this.on('click', function() {
			if (that._player.paused()) {
				that._player.play();
				Dom.css(that.el(), 'display', 'none');
			}
		});
	}
});

module.exports = BigPlayButton;

},{"../../lib/dom":5,"../component":18}],20:[function(require,module,exports){
/**
 * @fileoverview 控制条组件
*/
var Component = require('../component');

var ControlBar = Component.extend({
	init: function(player,options) {
		Component.call(this, player, options);
		this.addClass(options.className || 'prism-controlbar');
		this.initChildren();
		this.onEvent();
	},
	createEl: function() {
		var el = Component.prototype.createEl.call(this);
		el.innerHTML = '<div class="prism-controlbar-bg"></div>'
		return el;
	},
	onEvent: function(){
		var player = this.player();
		var that = this;
		
		this.timer = null;

		player.on('click',function(e){
			e.preventDefault();
			e.stopPropagation();
			that._show();
			that._hide();
		});
		player.on('ready',function(){
			that._hide();
		});
		this.on('touchstart', function() {
			that._show();
		});
		this.on('touchmove', function() {
			that._show();
		});
		this.on('touchend', function() {
			that._hide();
		});
	},
	_show: function() {
		this.show();
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	},
	_hide: function(){
		var that = this;
		this.timer = setTimeout(function(){
			that.hide();
		}, 5000);
	}
});

module.exports = ControlBar;

},{"../component":18}],21:[function(require,module,exports){
/**
 * @fileoverview 全屏按钮
 */
var Component = require('../component');

var FullScreenButton = Component.extend({
	init: function  (player,options) {
		var that = this;
		Component.call(this, player, options);
		this.addClass(options.className || 'prism-fullscreen-btn');
	},

	bindEvent: function() {
		var that = this;

		this._player.on('requestFullScreen', function() {
			that.addClass('fullscreen');
		});

		this._player.on('cancelFullScreen', function() {
			that.removeClass('fullscreen');
		});

		this.on('click', function() {
            //alert("click_full_status:" + this._player.getIsFullScreen());
			if (!this._player.getIsFullScreen()) {
				this._player.requestFullScreen();	
			} else {
				this._player.cancelFullScreen();
			}
		});
	}
});

module.exports = FullScreenButton;

},{"../component":18}],22:[function(require,module,exports){
/**
 * @fileoverview 直播状态 icon
 */
var Component = require('../component');
var Util = require('../../lib/util');

var LiveDisplay = Component.extend({
	init: function  (player,options) {
		var that = this;
		Component.call(this, player, options);

		this.className = options.className ? options.className : 'prism-live-display';
		this.addClass(this.className);
	}
});

module.exports = LiveDisplay;
},{"../../lib/util":14,"../component":18}],23:[function(require,module,exports){
/**
 * @fileoverview 播放按钮
 */
var Component = require('../component');

var PlayButton = Component.extend({
	init: function  (player, options) {
		var that = this;
		Component.call(this, player, options);
		this.addClass(options.className || 'prism-play-btn');
	},
	
	bindEvent: function() {
		var that = this;

		this._player.on('play', function(){
			that.addClass('playing');
		});
		
		this._player.on('pause', function(){
			that.removeClass('playing');
		});

		this.on('click', function() {
            //alert("click_play:" + that._player.paused())
			if (that._player.paused()) {
				that._player.play();
				that.addClass('playing');
			} else {
				that._player.pause();
				that.removeClass('playing');
			}
		});
	}
});

module.exports = PlayButton;

},{"../component":18}],24:[function(require,module,exports){
/**
 * @fileoverview 进度条
 */
var Component = require('../component');
var Dom = require('../../lib/dom');
var Event = require('../../lib/event');
var UA = require('../../lib/ua');
var Fn = require('../../lib/function');

var Progress = Component.extend({
	init: function (player, options) {
		var that = this;
		Component.call(this, player, options);

		this.className = options.className ? options.className : 'prism-progress';
		this.addClass(this.className);
	},

	createEl: function() {
		var el = Component.prototype.createEl.call(this);
		el.innerHTML = '<div class="prism-progress-loaded"></div>'
				     + '<div class="prism-progress-played"></div>'
				   	 + '<div class="prism-progress-cursor"></div>';
		return el;
	},

	bindEvent: function() {
		var that = this;
		
		this.loadedNode = document.querySelector('#' + this.id() + ' .prism-progress-loaded');
		this.playedNode = document.querySelector('#' + this.id() + ' .prism-progress-played');
		this.cursorNode = document.querySelector('#' + this.id() + ' .prism-progress-cursor');

		Event.on(this.cursorNode, 'mousedown', function(e) {that._onMouseDown(e);});
		Event.on(this.cursorNode, 'touchstart', function(e) {that._onMouseDown(e);});
		this._player.on('hideProgress', function(e) {that._hideProgress(e);});
		this._player.on('cancelHideProgress', function(e) {that._cancelHideProgress(e);});
		
		this.bindTimeupdate = Fn.bind(this, this._onTimeupdate);
		this._player.on('timeupdate', this.bindTimeupdate);
			
		// ipad下播放无法触发progress事件，原因待查
		if (UA.IS_IPAD) {
			this.interval = setInterval(function() {
				that._onProgress();
			}, 500);
		} else {
			this._player.on('progress', function() {that._onProgress();});
		}
	},

    //取消控制进度条
	_hideProgress: function(e) {
		var that = this;
        console.log("hidestart");
		Event.off(this.cursorNode, 'mousedown');
		Event.off(this.cursorNode, 'touchstart');
     },

    //打开控制进度条
    _cancelHideProgress: function(e) {
		var that = this;
        console.log("hidestop");
		Event.on(this.cursorNode, 'mousedown', function(e) {that._onMouseDown(e);});
		Event.on(this.cursorNode, 'touchstart', function(e) {that._onMouseDown(e);});
     },

	_onMouseDown: function(e) {
		var that = this;

		e.preventDefault();
		//e.stopPropagation();

		this._player.pause();
		this._player.trigger('seekStart', {fromTime: this._player.getCurrentTime()});
        console.log("seekstart");
        //alert("progress_seekstart");

		Event.on(this.cursorNode, 'mousemove', function(e) {that._onMouseMove(e);});
		Event.on(this.cursorNode, 'mouseup', function(e) {that._onMouseUp(e);});
		Event.on(this.cursorNode, 'touchmove', function(e) {that._onMouseMove(e);});
		Event.on(this.cursorNode, 'touchend', function(e) {that._onMouseUp(e);});
	},

	_onMouseUp: function(e) {
		var that = this;

		e.preventDefault();
		//e.stopPropagation();
		Event.off(this.cursorNode, 'mousemove');
		Event.off(this.cursorNode, 'mouseup');
		Event.off(this.cursorNode, 'touchmove');
		Event.off(this.cursorNode, 'touchend');
		
		// 设置当前时间，播放视频
		var sec = this.playedNode.offsetWidth / this.el().offsetWidth * this._player.getDuration();
        var sec_now = this._player.getDuration();
		this._player.seek(sec);
		
		this._player.play();
		this._player.trigger('seekEnd', {toTime: this._player.getCurrentTime()});
        console.log("seekend");
        //alert("progress_seekend");
	},

	_onMouseMove: function(e) {
		e.preventDefault();
		//e.stopPropagation();

		var pageX = e.touches? e.touches[0].pageX: e.pageX,
			distance = pageX - this.el().offsetLeft,
			width = this.el().offsetWidth,
			sec = (this._player.getDuration()) ? distance / width * this._player.getDuration(): 0;

		if (sec < 0) sec = 0;
		if (sec > this._player.getDuration()) sec = this._player.getDuration();

		this._player.seek(sec);
		//this._updateProgressBar(this.playedNode, sec);
		//this._updateCursorPosition(sec);
	},

	_onTimeupdate: function(e) {
		// ios下
		// 为了解决seek会跳转到原来的位置，需要进入lock的机制。。。丑陋的代码
		// 只有当前时刻与seekto的时刻间隔小于1秒，并且连续三次，才放开lock
		/*
		if (S.UA.ios) {
			var thre = Math.abs(this._player.getCurrentTime() - this._player.getLastSeekTime());
			if (this._player.getSeekLock()) {
				if (thre < 1 && this.lockCount > 3) {
					this._player.setSeekLock(false);
					this.lockCount = 1;
				} else if (thre < 1){
					this.lockCount++;
				}
			}

			if (!this._player.getSeekLock() ) {
				this._updateProgressBar(this.playedNode, this._player.getCurrentTime());
				this._updateCursorPosition(this._player.getCurrentTime());
				this._updateTip(this._player.getCurrentTime());
				
				this._player.fire('updateProgressBar', {
					time: this._player.getCurrentTime()
				});
			}
		
		} else {
		*/
		this._updateProgressBar(this.playedNode, this._player.getCurrentTime());
		this._updateCursorPosition(this._player.getCurrentTime());
		
		this._player.trigger('updateProgressBar', {
			time: this._player.getCurrentTime()
		});
		//}
	},

	_onProgress: function(e) {
		// 此时buffer可能还没有准备好
		if (this._player.getDuration()) {
			this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1));
		}
	},

	_updateProgressBar: function(node, sec) {
		var percent = (this._player.getDuration()) ? sec / this._player.getDuration(): 0;
		if (node) {
			Dom.css(node, 'width', (percent * 100) + '%');
		};		
	},

	_updateCursorPosition: function(sec) {
		var percent = (this._player.getDuration()) ? sec / this._player.getDuration(): 0;
		if (this.cursorNode) {
			Dom.css(this.cursorNode, 'left', (percent * 100) + '%');
		};
	}
});

module.exports = Progress;

},{"../../lib/dom":5,"../../lib/event":6,"../../lib/function":7,"../../lib/ua":12,"../component":18}],25:[function(require,module,exports){
/**
 * @fileoverview 播放时间
 */
var Component = require('../component');
var Util = require('../../lib/util');

var TimeDisplay = Component.extend({
	init: function  (player,options) {
		var that = this;
		Component.call(this, player, options);

		this.className = options.className ? options.className : 'prism-time-display';
		this.addClass(this.className);
	},

	createEl: function() {
		var el = Component.prototype.createEl.call(this,'div');
		el.innerHTML = '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="duration">00:00</span>';
		return el;
	},

	bindEvent: function() {
		var that = this;

		this._player.on('durationchange', function() {
			var dur = Util.formatTime(that._player.getDuration());
			if (dur) {
				document.querySelector('#' + that.id() + ' .duration').innerText = dur;
			} else {
				document.querySelector('#' + that.id() + ' .duration').style.display = 'none';
				document.querySelector('#' + that.id() + ' .time-bound').style.display = 'none';
			}
		});

		this._player.on('timeupdate', function() {
            //var curr_time = that._player.getCurrentTime();
			var curr = Util.formatTime(that._player.getCurrentTime());

            /*
            if (!this._player.last_curT) {
                this._player.last_curT = curr_time;
            }
            else {
                var diff = curr - this._player.last_curT;
                console.log("diff_time" + diff);
                this._player.last_curT = curr_time;
            }
            */
			if (curr) {
				document.querySelector('#' + that.id() + ' .current-time').innerText = curr;
			} else {
				document.querySelector('#' + that.id() + ' .current-time').style.display = 'none';
			}
		});
	}
});

module.exports = TimeDisplay;

},{"../../lib/util":14,"../component":18}],26:[function(require,module,exports){
/**
 * @fileoverview 音量按钮，h5下只做静音非静音的控制
 */
var Component = require('../component');

var Volume = Component.extend({
	init: function  (player, options) {
		var that = this;
		Component.call(this, player, options);
		this.addClass(options.className || 'prism-volume');
	},
	
	bindEvent: function() {
		var that = this;
		
		this.on('click', function() {
			if (that._player.muted()) {
				that._player.unMute();
				that.removeClass('mute');
			} else {
				that._player.mute();
				that.addClass('mute');
			}
		});
	}
});

module.exports = Volume;

},{"../component":18}],27:[function(require,module,exports){
/**
 * @fileoverview ui组件列表，fullversion会将定义的所有ui组件列于此做统一加载
 *               后期补上根据实际需求配置组件列表，从而一定程度上减少体积
 * @author 首作<aloysious.ld@taobao.com>
 * @date 2015-01-05
 */
module.exports = {
	'bigPlayButton'   : require('./component/big-play-button'),
	'controlBar'      : require('./component/controlbar'),
	'progress'        : require('./component/progress'),
	'playButton'      : require('./component/play-button'),
	'liveDisplay'     : require('./component/live-display'),
	'timeDisplay'     : require('./component/time-display'),
	'fullScreenButton': require('./component/fullscreen-button'),
	'volume'          : require('./component/volume')
};

},{"./component/big-play-button":19,"./component/controlbar":20,"./component/fullscreen-button":21,"./component/live-display":22,"./component/play-button":23,"./component/progress":24,"./component/time-display":25,"./component/volume":26}]},{},[2]);
