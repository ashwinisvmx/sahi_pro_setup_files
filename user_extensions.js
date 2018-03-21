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
 


__sahiDebug__("user_ext.js: end");
