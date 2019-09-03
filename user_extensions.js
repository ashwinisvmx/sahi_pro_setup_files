/**
 * Copyright Tyto Software Pvt. Ltd.
 */
__sahiDebug__("user_ext.js: start");

Sahi.prototype.setValue = function (el, val) {
    this.checkNull(el, "_setValue", 1);
    this.checkVisible(el);

//    try{
//    this.getWindow(el).focus();
//    }catch(e){}
    if (this._isIE()) {
    try{
    el.setActive();
    } catch(e){}
    this.simulateEvent(el, "focusin");
    }
    this.simulateEvent(el, "focus");
    val = "" + val;
    var ua = this.navigator.userAgent.toLowerCase();
    if (ua.indexOf("windows") != -1) {
    val = val.replace(/\r/g, '');
    if (!this._isFF() || this._getFFVersion() >= 12) val = val.replace(/\n/g, '\r\n');
    } else if (ua.indexOf("macintosh")) {
val = val.replace(/\r\n/g, '\r');
val = val.replace(/\n/g, '\r');
} else if (ua.indexOf("linux") != -1){
val = val.replace(/\r\n/g, '\n');
val = val.replace(/\r/g, '\n');
}
    var prevVal = el.value;
    //if (!window.document.createEvent) el.value = val;
    if (this._isFF4Plus()) this._focus(el); // test with textarea.sah
    if (el.type && (el.type == "hidden")){
    el.value = val;
    return;
    } else if (el.type &&  (el.type == "range" || el.type == "date" || el.type == "number")){
    el.value = val;
    } else if (el.type && el.type.indexOf("select") != -1) {
    } else {
        var append = this.shouldAppend(el);
        if (this.isEditableFormElement(el)) {
        el.value = "";
        } else if (el.isContentEditable) {
        //this._selectRange(el);
        }
        if (typeof val == "string") {
        var len = val.length;
        if (el.maxLength && el.maxLength>=0 && val.length > el.maxLength)
        len = el.maxLength;
            for (var i = 0; i < len; i++) {
                var c = val.charAt(i);
                this.simulateKeyPressEvents(el, c, null, append);
            }
        }
    }
    var triggerOnchange = prevVal != val;
    if(this.blurEnabled){
    this.setLastBlurFn(function(){
        try{
        // on IE9, sequence is change, deactivate, focusout, blur
        // others change, blur, focusout
            if (triggerOnchange) {
                if (!_sahi._isFF3())
                _sahi.simulateEvent(el, "change");
            }
        if (_sahi._isIE()) {
        _sahi.simulateEvent(el, "deactivate");
        _sahi.simulateEvent(el, "focusout");
        }
        if (_sahi._isIE()) {
        el.blur();
        }
        _sahi.simulateEvent(el, "blur");
        if (!_sahi._isIE()) _sahi.simulateEvent(el, "focusout");
        }catch(e){}
        });
    }
};
Sahi.prototype.simulateKeyPressEvents = function (el, val, combo, append) {
var origVal = el.value;
var keyCode = 0;
var charCode = 0;
var c = null;
if (typeof val == "number"){
charCode = val;
    keyCode = this.getKeyCode(charCode);
} else if (typeof val == "object") {
keyCode = val[0];
charCode = val[1];
} else if (typeof val == "string") {
    charCode = val.charCodeAt(0);
    keyCode = this.getKeyCode(charCode);
}
c = String.fromCharCode(charCode);;
    var isShift = (charCode >= 65 && charCode <= 90);
    if (isShift) combo = "" + combo + "|SHIFT|";
    this.simulateKeyEvent([(isShift ? 16 : keyCode), 0], el, "keydown", combo);
    if (this.isSafariLike()) {
    this.simulateKeyEvent([keyCode, charCode], el, "keypress", combo);
    } else {
    this.simulateKeyEvent([0, charCode], el, "keypress", combo);
    }
    if (append && charCode!=10 && origVal == el.value) {
    if (!this._isFF4Plus() || (this._isFF4Plus() && !(combo == "CTRL" || combo == "ALT"))) {
    if (this.isEditableFormElement(el)) {
    el.value += c;
    } else if (el.isContentEditable) { // IE returns el.isContentEditable true for textbox also
    el.innerHTML += c;
    }
    }
    }
    try {
    if (this._isIE() && !this._isIE9PlusStrictMode()) {
    // lower IEs don't trigger input event
    } else {
    this.simulateKeyEvent([keyCode, 0], el, "input", combo);
    }
    } catch(e) {
    // may not work on older browsers
    }
    this.simulateKeyEvent([keyCode, 0], el, "keyup", combo);
};
Sahi.prototype.simulateKeyPressEvents = function (el, val, combo, append) {
var origVal = el.value;
var keyCode = 0;
var charCode = 0;
var c = null;
if (typeof val == "number"){
charCode = val;
    keyCode = this.getKeyCode(charCode);
} else if (typeof val == "object") {
keyCode = val[0];
charCode = val[1];
} else if (typeof val == "string") {
    charCode = val.charCodeAt(0);
    keyCode = this.getKeyCodeForChar(val);
}
c = String.fromCharCode(charCode);
    var isShift = (charCode >= 65 && charCode <= 90);
    if (isShift) combo = "" + combo + "|SHIFT|";
    var keyDownReturnValue = this.simulateKeyEvent([(isShift ? 16 : keyCode), 0], el, "keydown", combo);
    if (keyDownReturnValue) {
    var keyPressReturnValue = null;
    if (this.isSafariLike()) {
     keyPressReturnValue = this.simulateKeyEvent([keyCode, charCode], el, "keypress", combo);     
    } else {
     keyPressReturnValue = this.simulateKeyEvent([0, charCode], el, "keypress", combo);
    }
 
    if (keyPressReturnValue && charCode!=10) {
     if (!this._isFF4Plus() || (this._isFF4Plus() && !(combo == "CTRL" || combo == "ALT"))) {
     if (this.isEditableFormElement(el)) {
     if (this.isSelectionSupported(el)) {
     var origSelStart = el.selectionStart;
     var newVal = el.value;
     if (isNaN(origSelStart)) origSelStart = el.value.length; // happens in IE8-
     newVal = newVal.substring(0, origSelStart) + c + newVal.substring(origSelStart);
     this.setNativeValue(el, newVal); 
     el.selectionStart = origSelStart + 1;
     el.selectionEnd = origSelStart + 1;
     } else {
     this.setNativeValue(el, el.value + c);
     }
     } else if (el.isContentEditable) { // IE returns el.isContentEditable true for textbox also
     el.innerHTML += c;
     }     
     }
      try {
       if (origVal != el.value) {
       if (this._isIE() && !this._isIE9PlusStrictMode()) {
       // lower IEs don't trigger input event
       } else {
       this.simulateKeyEvent([keyCode, 0], el, "input", combo);
       }
       }
      } catch(e) {
       // may not work on older browsers
      }
    }
    }
    this.simulateKeyEvent([keyCode, 0], el, "keyup", combo);
};
Sahi.prototype.isSelectionSupported = function (el) {
if (el == null) return false;
if(typeof el.selectionStart == "number") return true;
else return false;
};
Sahi.prototype.setValue = function (el, val) {
    this.checkNull(el, "_setValue", 1);
    this.checkVisible(el);
    if (el.disabled) return;
    try {
     el.focus();
    } catch(e){}
//    try{
//     this.getWindow(el).focus();
//    }catch(e){}
    if (this._isIE()) { 
     try{
     el.setActive();
     } catch(e){}
    }
    this.simulateEvent(el, "focus");
    this.simulateEvent(el, "focusin");
    val = "" + val;
    var ua = this.navigator.userAgent.toLowerCase();
    if (ua.indexOf("windows") != -1) {
     val = val.replace(/\r/g, '');
     if (!this._isFF() || this._getFFVersion() >= 12) val = val.replace(/\n/g, '\r\n');
    } else if (ua.indexOf("macintosh")) {
val = val.replace(/\r\n/g, '\r');
val = val.replace(/\n/g, '\r');
} else if (ua.indexOf("linux") != -1){
val = val.replace(/\r\n/g, '\n');
val = val.replace(/\r/g, '\n');
}
    var prevVal = el.value;
    //if (!window.document.createEvent) el.value = val;
//    if (this._isFF4Plus()) this._focus(el); // test with textarea.sah
    if (el.type && (el.type == "hidden")){
     el.value = val;    
     return;
    } else if (el.type &&  (el.type == "range" || el.type == "date" || el.type == "number")){
    this.setNativeValue(el, val);
    } else if (el.type && el.type.indexOf("select") != -1) {
    } else {
        var append = this.shouldAppend(el);
        if (this.isEditableFormElement(el)) {
         this.clearElementValue(el);
         //this.setNativeValue(el, "");
        } else if (el.isContentEditable) {
         //this._selectRange(el);
        }
        if (typeof val == "string") {
         var len = val.length;
         if (el.maxLength && el.maxLength>=0 && val.length > el.maxLength) 
         len = el.maxLength;
            for (var i = 0; i < len; i++) {
                var c = val.charAt(i);                
                this.simulateKeyPressEvents(el, c, null, append);
            }
        }
    }
    var triggerOnchange = prevVal != el.value;
    if(this.blurEnabled){
     this.setLastBlurFn(function(){
         try{
         // on IE9, sequence is change, deactivate, focusout, blur
         // others change, blur, focusout
             if (triggerOnchange) {
                 if (!_sahi._isFF3()) 
                  _sahi.simulateEvent(el, "change");  
             }      
         if (_sahi._isIE()) {
         _sahi.simulateEvent(el, "deactivate");
         _sahi.simulateEvent(el, "focusout");
         }
         if (_sahi._isIE()) {
         el.blur(); 
         } 
         _sahi.simulateEvent(el, "blur");
         if (!_sahi._isIE()) _sahi.simulateEvent(el, "focusout");
         }catch(e){}
        }); 
    }
};
 
Sahi.prototype.clearElementValue = function(el) {
if (el.value == "") return;
if (this.isSelectionSupported(el)) {
this._selectTextRange(el, el.value);
this._keyDown(el, 8);
if (el.value != "") this.setNativeValue(el, "");
} else {
this.setNativeValue(el, "");
}
// this.selectAndClearElementValue(el);
}  
 
Sahi.prototype.getKeyCodeForChar = function (c) {
var charCode = c.charCodeAt(0);
if (charCode >= 48 && charCode <=57) return charCode; // numbers
if (charCode >= 65 && charCode <=90) return charCode; // A-Z
if (charCode >= 97 && charCode <=122) return charCode - 32; // a-z
var otherKeyCodes = {
';':186,
'=':187,
',':188,
'-':189,
'.':110,
'/':191,
'`':192,
'[':219,
'\\':220,
']':221,
'\'':222,
'*':106, //numpad
'+':107, //numpad
' ':32,
'\t':9,
'\n':13,
'(':57,
')':48,
'{':219,
'}':221 
};
if (otherKeyCodes[c]) return otherKeyCodes[c];
return charCode;
};
Sahi.prototype.simulateKeyEvent = function (codes, target, evType, combo) {
var keyCode = codes[0];
var charCode = codes[1];
if (!combo) combo = "";
    var isShift = combo.indexOf("SHIFT")!=-1;
    var isCtrl = combo.indexOf("CTRL")!=-1;
    var isAlt = combo.indexOf("ALT")!=-1;
    var isMeta = combo.indexOf("META")!=-1;
 
    if (!this._isIE() || this._isIE9PlusStrictMode()) { // FF chrome safari opera
        if (this.isSafariLike() || window.opera || this._isIE9PlusStrictMode()) {
         if (target.ownerDocument.createEvent) {
            var event = target.ownerDocument.createEvent('HTMLEvents');
            
            var bubbles = true;
            var cancelable = true;
            var evt = event;
            if (!window.opera){
             // this may not have any effect.
            evt.bubbles = bubbles;
            evt.cancelable = cancelable;
            }
            evt.ctrlKey = isCtrl;
            evt.altKey = isAlt;
            evt.metaKey = isMeta;
            if (evType != "input") {
             evt.charCode = charCode;
             evt.keyCode =  (evType == "keypress") ? charCode : keyCode;
            }
            evt.shiftKey = isShift;
            evt.which = evt.keyCode;
            evt.detail = 0;
            evt.view = target.ownerDocument.defaultView;
            evt.initEvent(evType, bubbles, cancelable); // don't use evt.bubbles etc. because it may be readonly and never be set to true. Chrome enter on extjs.
            return target.dispatchEvent(evt);
         }
        } else { //FF
            var evt = new Object();
            evt.type = evType;
            evt.bubbles = true;
            evt.cancelable = true;
            evt.ctrlKey = isCtrl;
            evt.altKey = isAlt;
            evt.metaKey = isMeta;
            if (evType != "input") {
         evt.keyCode = keyCode;             
         evt.charCode = charCode;
            }
            evt.shiftKey = isShift;
 
            if (!target) return;
            var event = target.ownerDocument.createEvent("KeyEvents");
            event.initKeyEvent(evt.type, evt.bubbles, evt.cancelable, target.ownerDocument.defaultView.window,
            evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, evt.keyCode, evt.charCode);
            return target.dispatchEvent(event);
        }
    } 
    if (this._isIE() && !this._isIE11Plus()) { // IE
        var evt = target.ownerDocument.createEventObject();
        evt.type = evType;
        evt.bubbles = true;
        evt.cancelable = true;
        var xy = this.findClientPosWithOffset(target);
        evt.clientX = xy[0];
        evt.clientY = xy[1];
        evt.ctrlKey = isCtrl;
        evt.altKey = isAlt;
        evt.metaKey = isMeta;
        evt.keyCode = (this._isIE() && evType == "keypress") ? charCode : keyCode;            
        evt.shiftKey = isShift; //c.toUpperCase().charCodeAt(0) == evt.charCode;
        evt.shiftLeft = isShift;
        evt.cancelBubble = true;
        evt.target = target;
        return target.fireEvent(this.getEventTypeName(evType), evt);
    }
};
Sahi.prototype.setNativeValue =  function (el, val) {
var valueSetter = null;
if(Object.getOwnPropertyDescriptor != undefined){
var propertyDescriptor = Object.getOwnPropertyDescriptor(el, 'value');
if(propertyDescriptor){
valueSetter = propertyDescriptor.set; 
}
}
var prototypeValueSetter = null;
if (Object.getPrototypeOf != undefined) { // ie8 simulation
var objPrototype = Object.getPrototypeOf(el);
var protoPropertyDescriptor = Object.getOwnPropertyDescriptor(objPrototype, 'value');
if(protoPropertyDescriptor){
  prototypeValueSetter = protoPropertyDescriptor.set;
}
}
if (prototypeValueSetter) {
  prototypeValueSetter.call(el, val);
} else if(valueSetter){
  valueSetter.call(el, val);
} else {
  el.value = val;
}
}




Sahi.prototype._keyDown = function (el, codes, combo) {
if (this.isFlexObj(el)){
if(this.lookInside != null) el = el.inside(this.lookInside);
return el.keyDown(codes);
}
    this.checkNull(el, "_keyDown", 1);
    this.checkVisible(el);
    this.simulateKeyEvent(((typeof codes == "number")? [codes, 0] : codes), el, "keydown", combo);
};
Sahi.prototype._keyUp = function (el, codes, combo) {
if (this.isFlexObj(el)){
if(this.lookInside != null) el = el.inside(this.lookInside);
return el.keyUp(codes);
}
    this.checkNull(el, "_keyUp", 1);
    this.checkVisible(el);
    this.simulateKeyEvent(((typeof codes == "number")? [codes, 0] : codes), el, "keyup", combo);
};

SflWrapper.prototype.addAccessorFns = function(){
var actionMethodNames = ["getGlobalXY", "click", "mouseDown", "mouseOver", "mouseUp", "dragDrop", "dragDropXY", "setAsDroppable",
                         "setValue", "keyDown", "keyUp", "fetch", "choose", "listProperties",
                         "introspect", "executeFn", "selectRange", "getSelectedText",
                         "set", "highlight", "getValue",
                         "getText", "getRowNo", "getColumnNo", "getGridData",
                         "getTextOrToolTip", "getDataProviderData",
                         "rightClick", "doubleClick", "identifyParent" , "identifySelf"];
for (var i=0; i<actionMethodNames.length; i++){
var methodName = actionMethodNames[i];
this[methodName] = this.getFlexFn(methodName, true);
}
}


__sahiDebug__("user_ext.js: end");
