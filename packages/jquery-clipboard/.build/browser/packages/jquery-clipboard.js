(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/jquery-clipboard/jquery.clipboard.js                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/*                                                                                                           // 1
 * jQuery Clipboard :: Fork of zClip :: Uses ZeroClipboard v1.2.3                                            // 2
 *                                                                                                           // 3
 * https://github.com/valeriansaliou/jquery.clipboard                                                        // 4
 * http://www.steamdev.com/zclip/                                                                            // 5
 *                                                                                                           // 6
 * Copyright 2013, Valérian Saliou                                                                           // 7
 * Copyright 2011, SteamDev                                                                                  // 8
 *                                                                                                           // 9
 * Released under the MIT license.                                                                           // 10
 * http://www.opensource.org/licenses/mit-license.php                                                        // 11
 *                                                                                                           // 12
 * Version: v1.2                                                                                             // 13
 * Date: Sun Dec 1, 2013                                                                                     // 14
 */                                                                                                          // 15
                                                                                                             // 16
/* Component: jQuery Clipboard */                                                                            // 17
(function ($) {                                                                                              // 18
  var $clip = null;                                                                                          // 19
  var $is_loaded = false;                                                                                    // 20
                                                                                                             // 21
  $.fn.clipboard = function (params) {                                                                       // 22
    if ((typeof params == 'object' && !params.length) || (typeof params == 'undefined')) {                   // 23
      var settings = $.extend({                                                                              // 24
        path: '/packages/meteor-jquery-clipboard/jquery.clipboard.swf',                                      // 25
        copy: null,                                                                                          // 26
        beforeCopy: null,                                                                                    // 27
        afterCopy: null,                                                                                     // 28
        clickAfter: true                                                                                     // 29
      }, (params || {}));                                                                                    // 30
                                                                                                             // 31
      return this.each(function () {                                                                         // 32
        var o = $(this);                                                                                     // 33
                                                                                                             // 34
        if (o.is(':visible') && (typeof settings.copy == 'string' || $.isFunction(settings.copy))) {         // 35
          if ($.isFunction(settings.copy)) {                                                                 // 36
            o.bind('Clipboard_copy',settings.copy);                                                          // 37
          }                                                                                                  // 38
          if ($.isFunction(settings.beforeCopy)) {                                                           // 39
            o.bind('Clipboard_beforeCopy',settings.beforeCopy);                                              // 40
          }                                                                                                  // 41
          if ($.isFunction(settings.afterCopy)) {                                                            // 42
            o.bind('Clipboard_afterCopy',settings.afterCopy);                                                // 43
          }                                                                                                  // 44
                                                                                                             // 45
          if($clip === null) {                                                                               // 46
            $clip = new ZeroClipboard(null, {                                                                // 47
              moviePath: settings.path,                                                                      // 48
              trustedDomains: '*',                                                                           // 49
              hoverClass: 'hover',                                                                           // 50
              activeClass: 'active'                                                                          // 51
            });                                                                                              // 52
                                                                                                             // 53
            $clip.on('load', function(client) {                                                              // 54
              client.on('mouseover', function (client) {                                                     // 55
                $(this).trigger('mouseenter');                                                               // 56
              });                                                                                            // 57
                                                                                                             // 58
              client.on('mouseout', function (client) {                                                      // 59
                $(this).trigger('mouseleave');                                                               // 60
              });                                                                                            // 61
                                                                                                             // 62
              client.on('mousedown', function (client) {                                                     // 63
                $(this).trigger('mousedown');                                                                // 64
                                                                                                             // 65
                if (!$.isFunction(settings.copy)) {                                                          // 66
                   client.setText(settings.copy);                                                            // 67
                } else {                                                                                     // 68
                   client.setText($(this).triggerHandler('Clipboard_copy'));                                 // 69
                }                                                                                            // 70
                                                                                                             // 71
                if ($.isFunction(settings.beforeCopy)) {                                                     // 72
                    $(this).trigger('Clipboard_beforeCopy');                                                 // 73
                }                                                                                            // 74
              });                                                                                            // 75
                                                                                                             // 76
              client.on('complete', function (client, args) {                                                // 77
                if ($.isFunction(settings.afterCopy)) {                                                      // 78
                  $(this).trigger('Clipboard_afterCopy');                                                    // 79
                } else {                                                                                     // 80
                  $(this).removeClass('hover');                                                              // 81
                }                                                                                            // 82
                                                                                                             // 83
                if (settings.clickAfter) {                                                                   // 84
                  $(this).trigger('click');                                                                  // 85
                }                                                                                            // 86
              });                                                                                            // 87
            });                                                                                              // 88
          }                                                                                                  // 89
                                                                                                             // 90
          $clip.glue(o[0]);                                                                                  // 91
        }                                                                                                    // 92
      });                                                                                                    // 93
    }                                                                                                        // 94
  };                                                                                                         // 95
})(jQuery);                                                                                                  // 96
                                                                                                             // 97
/* Component: ZeroClipboard */                                                                               // 98
(function() {                                                                                                // 99
  "use strict";                                                                                              // 100
  var _camelizeCssPropName = function() {                                                                    // 101
    var matcherRegex = /\-([a-z])/g, replacerFn = function(match, group) {                                   // 102
      return group.toUpperCase();                                                                            // 103
    };                                                                                                       // 104
    return function(prop) {                                                                                  // 105
      return prop.replace(matcherRegex, replacerFn);                                                         // 106
    };                                                                                                       // 107
  }();                                                                                                       // 108
  var _getStyle = function(el, prop) {                                                                       // 109
    var value, camelProp, tagName, possiblePointers, i, len;                                                 // 110
    if (window.getComputedStyle) {                                                                           // 111
      value = window.getComputedStyle(el, null).getPropertyValue(prop);                                      // 112
    } else {                                                                                                 // 113
      camelProp = _camelizeCssPropName(prop);                                                                // 114
      if (el.currentStyle) {                                                                                 // 115
        value = el.currentStyle[camelProp];                                                                  // 116
      } else {                                                                                               // 117
        value = el.style[camelProp];                                                                         // 118
      }                                                                                                      // 119
    }                                                                                                        // 120
    if (prop === "cursor") {                                                                                 // 121
      if (!value || value === "auto") {                                                                      // 122
        tagName = el.tagName.toLowerCase();                                                                  // 123
        possiblePointers = [ "a" ];                                                                          // 124
        for (i = 0, len = possiblePointers.length; i < len; i++) {                                           // 125
          if (tagName === possiblePointers[i]) {                                                             // 126
            return "pointer";                                                                                // 127
          }                                                                                                  // 128
        }                                                                                                    // 129
      }                                                                                                      // 130
    }                                                                                                        // 131
    return value;                                                                                            // 132
  };                                                                                                         // 133
  var _elementMouseOver = function(event) {                                                                  // 134
    if (!ZeroClipboard.prototype._singleton) return;                                                         // 135
    if (!event) {                                                                                            // 136
      event = window.event;                                                                                  // 137
    }                                                                                                        // 138
    var target;                                                                                              // 139
    if (this !== window) {                                                                                   // 140
      target = this;                                                                                         // 141
    } else if (event.target) {                                                                               // 142
      target = event.target;                                                                                 // 143
    } else if (event.srcElement) {                                                                           // 144
      target = event.srcElement;                                                                             // 145
    }                                                                                                        // 146
    ZeroClipboard.prototype._singleton.setCurrent(target);                                                   // 147
  };                                                                                                         // 148
  var _addEventHandler = function(element, method, func) {                                                   // 149
    if (element.addEventListener) {                                                                          // 150
      element.addEventListener(method, func, false);                                                         // 151
    } else if (element.attachEvent) {                                                                        // 152
      element.attachEvent("on" + method, func);                                                              // 153
    }                                                                                                        // 154
  };                                                                                                         // 155
  var _removeEventHandler = function(element, method, func) {                                                // 156
    if (element.removeEventListener) {                                                                       // 157
      element.removeEventListener(method, func, false);                                                      // 158
    } else if (element.detachEvent) {                                                                        // 159
      element.detachEvent("on" + method, func);                                                              // 160
    }                                                                                                        // 161
  };                                                                                                         // 162
  var _addClass = function(element, value) {                                                                 // 163
    if (element.addClass) {                                                                                  // 164
      element.addClass(value);                                                                               // 165
      return element;                                                                                        // 166
    }                                                                                                        // 167
    if (value && typeof value === "string") {                                                                // 168
      var classNames = (value || "").split(/\s+/);                                                           // 169
      if (element.nodeType === 1) {                                                                          // 170
        if (!element.className) {                                                                            // 171
          element.className = value;                                                                         // 172
        } else {                                                                                             // 173
          var className = " " + element.className + " ", setClass = element.className;                       // 174
          for (var c = 0, cl = classNames.length; c < cl; c++) {                                             // 175
            if (className.indexOf(" " + classNames[c] + " ") < 0) {                                          // 176
              setClass += " " + classNames[c];                                                               // 177
            }                                                                                                // 178
          }                                                                                                  // 179
          element.className = setClass.replace(/^\s+|\s+$/g, "");                                            // 180
        }                                                                                                    // 181
      }                                                                                                      // 182
    }                                                                                                        // 183
    return element;                                                                                          // 184
  };                                                                                                         // 185
  var _removeClass = function(element, value) {                                                              // 186
    if (element.removeClass) {                                                                               // 187
      element.removeClass(value);                                                                            // 188
      return element;                                                                                        // 189
    }                                                                                                        // 190
    if (value && typeof value === "string" || value === undefined) {                                         // 191
      var classNames = (value || "").split(/\s+/);                                                           // 192
      if (element.nodeType === 1 && element.className) {                                                     // 193
        if (value) {                                                                                         // 194
          var className = (" " + element.className + " ").replace(/[\n\t]/g, " ");                           // 195
          for (var c = 0, cl = classNames.length; c < cl; c++) {                                             // 196
            className = className.replace(" " + classNames[c] + " ", " ");                                   // 197
          }                                                                                                  // 198
          element.className = className.replace(/^\s+|\s+$/g, "");                                           // 199
        } else {                                                                                             // 200
          element.className = "";                                                                            // 201
        }                                                                                                    // 202
      }                                                                                                      // 203
    }                                                                                                        // 204
    return element;                                                                                          // 205
  };                                                                                                         // 206
  var _getZoomFactor = function() {                                                                          // 207
    var rect, physicalWidth, logicalWidth, zoomFactor = 1;                                                   // 208
    if (typeof document.body.getBoundingClientRect === "function") {                                         // 209
      rect = document.body.getBoundingClientRect();                                                          // 210
      physicalWidth = rect.right - rect.left;                                                                // 211
      logicalWidth = document.body.offsetWidth;                                                              // 212
      zoomFactor = Math.round(physicalWidth / logicalWidth * 100) / 100;                                     // 213
    }                                                                                                        // 214
    return zoomFactor;                                                                                       // 215
  };                                                                                                         // 216
  var _getDOMObjectPosition = function(obj) {                                                                // 217
    var info = {                                                                                             // 218
      left: 0,                                                                                               // 219
      top: 0,                                                                                                // 220
      width: 0,                                                                                              // 221
      height: 0,                                                                                             // 222
      zIndex: 999999999                                                                                      // 223
    };                                                                                                       // 224
    var zi = _getStyle(obj, "z-index");                                                                      // 225
    if (zi && zi !== "auto") {                                                                               // 226
      info.zIndex = parseInt(zi, 10);                                                                        // 227
    }                                                                                                        // 228
    if (obj.getBoundingClientRect) {                                                                         // 229
      var rect = obj.getBoundingClientRect();                                                                // 230
      var pageXOffset, pageYOffset, zoomFactor;                                                              // 231
      if ("pageXOffset" in window && "pageYOffset" in window) {                                              // 232
        pageXOffset = window.pageXOffset;                                                                    // 233
        pageYOffset = window.pageYOffset;                                                                    // 234
      } else {                                                                                               // 235
        zoomFactor = _getZoomFactor();                                                                       // 236
        pageXOffset = Math.round(document.documentElement.scrollLeft / zoomFactor);                          // 237
        pageYOffset = Math.round(document.documentElement.scrollTop / zoomFactor);                           // 238
      }                                                                                                      // 239
      var leftBorderWidth = document.documentElement.clientLeft || 0;                                        // 240
      var topBorderWidth = document.documentElement.clientTop || 0;                                          // 241
      info.left = rect.left + pageXOffset - leftBorderWidth;                                                 // 242
      info.top = rect.top + pageYOffset - topBorderWidth;                                                    // 243
      info.width = "width" in rect ? rect.width : rect.right - rect.left;                                    // 244
      info.height = "height" in rect ? rect.height : rect.bottom - rect.top;                                 // 245
    }                                                                                                        // 246
    return info;                                                                                             // 247
  };                                                                                                         // 248
  var _noCache = function(path, options) {                                                                   // 249
    var useNoCache = !(options && options.useNoCache === false);                                             // 250
    if (useNoCache) {                                                                                        // 251
      return (path.indexOf("?") === -1 ? "?" : "&") + "nocache=" + new Date().getTime();                     // 252
    } else {                                                                                                 // 253
      return "";                                                                                             // 254
    }                                                                                                        // 255
  };                                                                                                         // 256
  var _vars = function(options) {                                                                            // 257
    var str = [];                                                                                            // 258
    var origins = [];                                                                                        // 259
    if (options.trustedOrigins) {                                                                            // 260
      if (typeof options.trustedOrigins === "string") {                                                      // 261
        origins.push(options.trustedOrigins);                                                                // 262
      } else if (typeof options.trustedOrigins === "object" && "length" in options.trustedOrigins) {         // 263
        origins = origins.concat(options.trustedOrigins);                                                    // 264
      }                                                                                                      // 265
    }                                                                                                        // 266
    if (options.trustedDomains) {                                                                            // 267
      if (typeof options.trustedDomains === "string") {                                                      // 268
        origins.push(options.trustedDomains);                                                                // 269
      } else if (typeof options.trustedDomains === "object" && "length" in options.trustedDomains) {         // 270
        origins = origins.concat(options.trustedDomains);                                                    // 271
      }                                                                                                      // 272
    }                                                                                                        // 273
    if (origins.length) {                                                                                    // 274
      str.push("trustedOrigins=" + encodeURIComponent(origins.join(",")));                                   // 275
    }                                                                                                        // 276
    if (typeof options.amdModuleId === "string" && options.amdModuleId) {                                    // 277
      str.push("amdModuleId=" + encodeURIComponent(options.amdModuleId));                                    // 278
    }                                                                                                        // 279
    if (typeof options.cjsModuleId === "string" && options.cjsModuleId) {                                    // 280
      str.push("cjsModuleId=" + encodeURIComponent(options.cjsModuleId));                                    // 281
    }                                                                                                        // 282
    return str.join("&");                                                                                    // 283
  };                                                                                                         // 284
  var _inArray = function(elem, array) {                                                                     // 285
    if (array.indexOf) {                                                                                     // 286
      return array.indexOf(elem);                                                                            // 287
    }                                                                                                        // 288
    for (var i = 0, length = array.length; i < length; i++) {                                                // 289
      if (array[i] === elem) {                                                                               // 290
        return i;                                                                                            // 291
      }                                                                                                      // 292
    }                                                                                                        // 293
    return -1;                                                                                               // 294
  };                                                                                                         // 295
  var _prepGlue = function(elements) {                                                                       // 296
    if (typeof elements === "string") throw new TypeError("ZeroClipboard doesn't accept query strings.");    // 297
    if (!elements.length) return [ elements ];                                                               // 298
    return elements;                                                                                         // 299
  };                                                                                                         // 300
  var _dispatchCallback = function(func, element, instance, args, async) {                                   // 301
    if (async) {                                                                                             // 302
      window.setTimeout(function() {                                                                         // 303
        func.call(element, instance, args);                                                                  // 304
      }, 0);                                                                                                 // 305
    } else {                                                                                                 // 306
      func.call(element, instance, args);                                                                    // 307
    }                                                                                                        // 308
  };                                                                                                         // 309
  var currentElement, gluedElements = [], flashState = {};                                                   // 310
  var ZeroClipboard = function(elements, options) {                                                          // 311
    if (elements) (ZeroClipboard.prototype._singleton || this).glue(elements);                               // 312
    if (ZeroClipboard.prototype._singleton) return ZeroClipboard.prototype._singleton;                       // 313
    ZeroClipboard.prototype._singleton = this;                                                               // 314
    this.options = {};                                                                                       // 315
    for (var kd in _defaults) this.options[kd] = _defaults[kd];                                              // 316
    for (var ko in options) this.options[ko] = options[ko];                                                  // 317
    this.handlers = {};                                                                                      // 318
    if (!flashState.hasOwnProperty(this.options.moviePath)) {                                                // 319
      flashState[this.options.moviePath] = {                                                                 // 320
        noflash: !ZeroClipboard.detectFlashSupport(),                                                        // 321
        wrongflash: false,                                                                                   // 322
        ready: false,                                                                                        // 323
        version: "0.0.0"                                                                                     // 324
      };                                                                                                     // 325
    }                                                                                                        // 326
    if (flashState[this.options.moviePath].noflash === false) {                                              // 327
      _bridge();                                                                                             // 328
    }                                                                                                        // 329
  };                                                                                                         // 330
  ZeroClipboard.prototype.setCurrent = function(element) {                                                   // 331
    currentElement = element;                                                                                // 332
    this.reposition();                                                                                       // 333
    var titleAttr = element.getAttribute("title");                                                           // 334
    if (titleAttr) {                                                                                         // 335
      this.setTitle(titleAttr);                                                                              // 336
    }                                                                                                        // 337
    var useHandCursor = this.options.forceHandCursor === true || _getStyle(element, "cursor") === "pointer"; // 338
    _setHandCursor.call(this, useHandCursor);                                                                // 339
    return this;                                                                                             // 340
  };                                                                                                         // 341
  ZeroClipboard.prototype.setText = function(newText) {                                                      // 342
    if (newText && newText !== "") {                                                                         // 343
      this.options.text = newText;                                                                           // 344
      if (this.ready()) this.flashBridge.setText(newText);                                                   // 345
    }                                                                                                        // 346
    return this;                                                                                             // 347
  };                                                                                                         // 348
  ZeroClipboard.prototype.setTitle = function(newTitle) {                                                    // 349
    if (newTitle && newTitle !== "") this.htmlBridge.setAttribute("title", newTitle);                        // 350
    return this;                                                                                             // 351
  };                                                                                                         // 352
  ZeroClipboard.prototype.setSize = function(width, height) {                                                // 353
    if (this.ready()) this.flashBridge.setSize(width, height);                                               // 354
    return this;                                                                                             // 355
  };                                                                                                         // 356
  ZeroClipboard.prototype.setHandCursor = function(enabled) {                                                // 357
    enabled = typeof enabled === "boolean" ? enabled : !!enabled;                                            // 358
    _setHandCursor.call(this, enabled);                                                                      // 359
    this.options.forceHandCursor = enabled;                                                                  // 360
    return this;                                                                                             // 361
  };                                                                                                         // 362
  var _setHandCursor = function(enabled) {                                                                   // 363
    if (this.ready()) this.flashBridge.setHandCursor(enabled);                                               // 364
  };                                                                                                         // 365
  ZeroClipboard.version = "1.2.3";                                                                           // 366
  var _defaults = {                                                                                          // 367
    moviePath: "ZeroClipboard.swf",                                                                          // 368
    trustedOrigins: null,                                                                                    // 369
    text: null,                                                                                              // 370
    hoverClass: "zeroclipboard-is-hover",                                                                    // 371
    activeClass: "zeroclipboard-is-active",                                                                  // 372
    allowScriptAccess: "sameDomain",                                                                         // 373
    useNoCache: true,                                                                                        // 374
    forceHandCursor: false                                                                                   // 375
  };                                                                                                         // 376
  ZeroClipboard.setDefaults = function(options) {                                                            // 377
    for (var ko in options) _defaults[ko] = options[ko];                                                     // 378
  };                                                                                                         // 379
  ZeroClipboard.destroy = function() {                                                                       // 380
    if (ZeroClipboard.prototype._singleton) {                                                                // 381
      ZeroClipboard.prototype._singleton.unglue(gluedElements);                                              // 382
      var bridge = ZeroClipboard.prototype._singleton.htmlBridge;                                            // 383
      if (bridge && bridge.parentNode) {                                                                     // 384
        bridge.parentNode.removeChild(bridge);                                                               // 385
      }                                                                                                      // 386
      delete ZeroClipboard.prototype._singleton;                                                             // 387
    }                                                                                                        // 388
  };                                                                                                         // 389
  ZeroClipboard.detectFlashSupport = function() {                                                            // 390
    var hasFlash = false;                                                                                    // 391
    if (typeof ActiveXObject === "function") {                                                               // 392
      try {                                                                                                  // 393
        if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {                                            // 394
          hasFlash = true;                                                                                   // 395
        }                                                                                                    // 396
      } catch (error) {}                                                                                     // 397
    }                                                                                                        // 398
    if (!hasFlash && navigator.mimeTypes["application/x-shockwave-flash"]) {                                 // 399
      hasFlash = true;                                                                                       // 400
    }                                                                                                        // 401
    return hasFlash;                                                                                         // 402
  };                                                                                                         // 403
  var _amdModuleId = null;                                                                                   // 404
  var _cjsModuleId = null;                                                                                   // 405
  var _bridge = function() {                                                                                 // 406
    var flashBridge, len;                                                                                    // 407
    var client = ZeroClipboard.prototype._singleton;                                                         // 408
    var container = document.getElementById("global-zeroclipboard-html-bridge");                             // 409
    if (!container) {                                                                                        // 410
      var opts = {};                                                                                         // 411
      for (var ko in client.options) opts[ko] = client.options[ko];                                          // 412
      opts.amdModuleId = _amdModuleId;                                                                       // 413
      opts.cjsModuleId = _cjsModuleId;                                                                       // 414
      var flashvars = _vars(opts);                                                                           // 415
      var html = '      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">         <param name="movie" value="' + client.options.moviePath + _noCache(client.options.moviePath, client.options) + '"/>         <param name="allowScriptAccess" value="' + client.options.allowScriptAccess + '"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="' + flashvars + '"/>         <embed src="' + client.options.moviePath + _noCache(client.options.moviePath, client.options) + '"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-zeroclipboard-flash-bridge"           allowScriptAccess="always"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="' + flashvars + '"           scale="exactfit">         </embed>       </object>';
      container = document.createElement("div");                                                             // 417
      container.id = "global-zeroclipboard-html-bridge";                                                     // 418
      container.setAttribute("class", "global-zeroclipboard-container");                                     // 419
      container.style.position = "absolute";                                                                 // 420
      container.style.left = "0px";                                                                          // 421
      container.style.top = "-9999px";                                                                       // 422
      container.style.width = "15px";                                                                        // 423
      container.style.height = "15px";                                                                       // 424
      container.style.zIndex = "9999";                                                                       // 425
      document.body.appendChild(container);                                                                  // 426
      container.innerHTML = html;                                                                            // 427
    }                                                                                                        // 428
    client.htmlBridge = container;                                                                           // 429
    flashBridge = document["global-zeroclipboard-flash-bridge"];                                             // 430
    if (flashBridge && (len = flashBridge.length)) {                                                         // 431
      flashBridge = flashBridge[len - 1];                                                                    // 432
    }                                                                                                        // 433
    client.flashBridge = flashBridge || container.children[0].lastElementChild;                              // 434
  };                                                                                                         // 435
  ZeroClipboard.prototype.resetBridge = function() {                                                         // 436
    if (this.htmlBridge) {                                                                                   // 437
      this.htmlBridge.style.left = "0px";                                                                    // 438
      this.htmlBridge.style.top = "-9999px";                                                                 // 439
      this.htmlBridge.removeAttribute("title");                                                              // 440
    }                                                                                                        // 441
    if (currentElement) {                                                                                    // 442
      _removeClass(currentElement, this.options.activeClass);                                                // 443
      currentElement = null;                                                                                 // 444
    }                                                                                                        // 445
    this.options.text = null;                                                                                // 446
    return this;                                                                                             // 447
  };                                                                                                         // 448
  ZeroClipboard.prototype.ready = function() {                                                               // 449
    return flashState[this.options.moviePath].ready === true;                                                // 450
  };                                                                                                         // 451
  ZeroClipboard.prototype.reposition = function() {                                                          // 452
    if (!currentElement) return false;                                                                       // 453
    var pos = _getDOMObjectPosition(currentElement);                                                         // 454
    this.htmlBridge.style.top = pos.top + "px";                                                              // 455
    this.htmlBridge.style.left = pos.left + "px";                                                            // 456
    this.htmlBridge.style.width = pos.width + "px";                                                          // 457
    this.htmlBridge.style.height = pos.height + "px";                                                        // 458
    this.htmlBridge.style.zIndex = pos.zIndex + 1;                                                           // 459
    this.setSize(pos.width, pos.height);                                                                     // 460
    return this;                                                                                             // 461
  };                                                                                                         // 462
  ZeroClipboard.dispatch = function(eventName, args) {                                                       // 463
    ZeroClipboard.prototype._singleton.receiveEvent(eventName, args);                                        // 464
  };                                                                                                         // 465
  ZeroClipboard.prototype.on = function(eventName, func) {                                                   // 466
    var events = eventName.toString().split(/\s/g), added = {};                                              // 467
    for (var i = 0, len = events.length; i < len; i++) {                                                     // 468
      eventName = events[i].toLowerCase().replace(/^on/, "");                                                // 469
      added[eventName] = true;                                                                               // 470
      if (!this.handlers[eventName]) {                                                                       // 471
        this.handlers[eventName] = func;                                                                     // 472
      }                                                                                                      // 473
    }                                                                                                        // 474
    if (added.noflash && flashState[this.options.moviePath].noflash) {                                       // 475
      this.receiveEvent("onNoFlash", {});                                                                    // 476
    }                                                                                                        // 477
    if (added.wrongflash && flashState[this.options.moviePath].wrongflash) {                                 // 478
      this.receiveEvent("onWrongFlash", {                                                                    // 479
        flashVersion: flashState[this.options.moviePath].version                                             // 480
      });                                                                                                    // 481
    }                                                                                                        // 482
    if (added.load && flashState[this.options.moviePath].ready) {                                            // 483
      this.receiveEvent("onLoad", {                                                                          // 484
        flashVersion: flashState[this.options.moviePath].version                                             // 485
      });                                                                                                    // 486
    }                                                                                                        // 487
    return this;                                                                                             // 488
  };                                                                                                         // 489
  ZeroClipboard.prototype.addEventListener = ZeroClipboard.prototype.on;                                     // 490
  ZeroClipboard.prototype.off = function(eventName, func) {                                                  // 491
    var events = eventName.toString().split(/\s/g);                                                          // 492
    for (var i = 0; i < events.length; i++) {                                                                // 493
      eventName = events[i].toLowerCase().replace(/^on/, "");                                                // 494
      for (var event in this.handlers) {                                                                     // 495
        if (event === eventName && this.handlers[event] === func) {                                          // 496
          delete this.handlers[event];                                                                       // 497
        }                                                                                                    // 498
      }                                                                                                      // 499
    }                                                                                                        // 500
    return this;                                                                                             // 501
  };                                                                                                         // 502
  ZeroClipboard.prototype.removeEventListener = ZeroClipboard.prototype.off;                                 // 503
  ZeroClipboard.prototype.receiveEvent = function(eventName, args) {                                         // 504
    eventName = eventName.toString().toLowerCase().replace(/^on/, "");                                       // 505
    var element = currentElement;                                                                            // 506
    var performCallbackAsync = true;                                                                         // 507
    switch (eventName) {                                                                                     // 508
     case "load":                                                                                            // 509
      if (args && args.flashVersion) {                                                                       // 510
        if (!_isFlashVersionSupported(args.flashVersion)) {                                                  // 511
          this.receiveEvent("onWrongFlash", {                                                                // 512
            flashVersion: args.flashVersion                                                                  // 513
          });                                                                                                // 514
          return;                                                                                            // 515
        }                                                                                                    // 516
        flashState[this.options.moviePath].ready = true;                                                     // 517
        flashState[this.options.moviePath].version = args.flashVersion;                                      // 518
      }                                                                                                      // 519
      break;                                                                                                 // 520
                                                                                                             // 521
     case "wrongflash":                                                                                      // 522
      if (args && args.flashVersion && !_isFlashVersionSupported(args.flashVersion)) {                       // 523
        flashState[this.options.moviePath].wrongflash = true;                                                // 524
        flashState[this.options.moviePath].version = args.flashVersion;                                      // 525
      }                                                                                                      // 526
      break;                                                                                                 // 527
                                                                                                             // 528
     case "mouseover":                                                                                       // 529
      _addClass(element, this.options.hoverClass);                                                           // 530
      break;                                                                                                 // 531
                                                                                                             // 532
     case "mouseout":                                                                                        // 533
      _removeClass(element, this.options.hoverClass);                                                        // 534
      this.resetBridge();                                                                                    // 535
      break;                                                                                                 // 536
                                                                                                             // 537
     case "mousedown":                                                                                       // 538
      _addClass(element, this.options.activeClass);                                                          // 539
      break;                                                                                                 // 540
                                                                                                             // 541
     case "mouseup":                                                                                         // 542
      _removeClass(element, this.options.activeClass);                                                       // 543
      break;                                                                                                 // 544
                                                                                                             // 545
     case "datarequested":                                                                                   // 546
      var targetId = element.getAttribute("data-clipboard-target"), targetEl = !targetId ? null : document.getElementById(targetId);
      if (targetEl) {                                                                                        // 548
        var textContent = targetEl.value || targetEl.textContent || targetEl.innerText;                      // 549
        if (textContent) {                                                                                   // 550
          this.setText(textContent);                                                                         // 551
        }                                                                                                    // 552
      } else {                                                                                               // 553
        var defaultText = element.getAttribute("data-clipboard-text");                                       // 554
        if (defaultText) {                                                                                   // 555
          this.setText(defaultText);                                                                         // 556
        }                                                                                                    // 557
      }                                                                                                      // 558
      performCallbackAsync = false;                                                                          // 559
      break;                                                                                                 // 560
                                                                                                             // 561
     case "complete":                                                                                        // 562
      this.options.text = null;                                                                              // 563
      break;                                                                                                 // 564
    }                                                                                                        // 565
    if (this.handlers[eventName]) {                                                                          // 566
      var func = this.handlers[eventName];                                                                   // 567
      if (typeof func === "string" && typeof window[func] === "function") {                                  // 568
        func = window[func];                                                                                 // 569
      }                                                                                                      // 570
      if (typeof func === "function") {                                                                      // 571
        _dispatchCallback(func, element, this, args, performCallbackAsync);                                  // 572
      }                                                                                                      // 573
    }                                                                                                        // 574
  };                                                                                                         // 575
  ZeroClipboard.prototype.glue = function(elements) {                                                        // 576
    elements = _prepGlue(elements);                                                                          // 577
    for (var i = 0; i < elements.length; i++) {                                                              // 578
      if (elements[i] && elements[i].nodeType === 1) {                                                       // 579
        if (_inArray(elements[i], gluedElements) == -1) {                                                    // 580
          gluedElements.push(elements[i]);                                                                   // 581
          _addEventHandler(elements[i], "mouseover", _elementMouseOver);                                     // 582
        }                                                                                                    // 583
      }                                                                                                      // 584
    }                                                                                                        // 585
    return this;                                                                                             // 586
  };                                                                                                         // 587
  ZeroClipboard.prototype.unglue = function(elements) {                                                      // 588
    elements = _prepGlue(elements);                                                                          // 589
    for (var i = 0; i < elements.length; i++) {                                                              // 590
      _removeEventHandler(elements[i], "mouseover", _elementMouseOver);                                      // 591
      var arrayIndex = _inArray(elements[i], gluedElements);                                                 // 592
      if (arrayIndex != -1) gluedElements.splice(arrayIndex, 1);                                             // 593
    }                                                                                                        // 594
    return this;                                                                                             // 595
  };                                                                                                         // 596
  function _isFlashVersionSupported(flashVersion) {                                                          // 597
    return parseFloat(flashVersion.replace(/,/g, ".").replace(/[^0-9\.]/g, "")) >= 10;                       // 598
  }                                                                                                          // 599
  if (typeof define === "function" && define.amd) {                                                          // 600
    define([ "require", "exports", "module" ], function(require, exports, module) {                          // 601
      _amdModuleId = module && module.id || null;                                                            // 602
      return ZeroClipboard;                                                                                  // 603
    });                                                                                                      // 604
  } else if (typeof module === "object" && module && typeof module.exports === "object" && module.exports) { // 605
    _cjsModuleId = module.id || null;                                                                        // 606
    module.exports = ZeroClipboard;                                                                          // 607
  } else {                                                                                                   // 608
    window.ZeroClipboard = ZeroClipboard;                                                                    // 609
  }                                                                                                          // 610
})();                                                                                                        // 611
                                                                                                              // 612
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);
