/**
 * Copyright Tyto Software Pvt. Ltd.
 */
__sahiDebug__("user_ext.js: start");



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

__sahiDebug__("user_ext.js: end");
