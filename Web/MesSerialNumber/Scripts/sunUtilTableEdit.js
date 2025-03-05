/* DO NOT USE setAttribute to set an Element into another object, when getAttribute get back,the returned object loss all method and properties*/
var layoutedrV; //"1.1";, flowdlgV
function getJSver() {
if (layoutedrV == null) {
if (document.location.hostname == "localhost" || true) layoutedrV = Math.random();
else {
var scrps = document.getElementsByTagName("SCRIPT");
for (var i = 0; i < scrps.length; i++) {
var src = scrps[i].src, ix = src.indexOf("?");
if (ix > 0) { layoutedrV = src.substring(ix + 1).replace("v=", ""); break; }
}
if (layoutedrV == null) layoutedrV = Math.random();
}
}
return layoutedrV;
}
var i18nm = null;
try { i18nm = CommonI18n.common; } catch (exx) { }
// *** Because W3C specification event.button: left button == 0, middle button == 1, right button == 2
//it is impossible to distinguish whether left button is down when mousemoving
var BWRT = { IE: 1, FIREFOX: 2, CHROME: 3, SAFARI: 4, OPERA: 5 };
//Array.prototype.pushA = function (o) { this.push(o); return this; }
Array.prototype.contains = function (element) {
for (var i = 0, k = this.length; i < k; i++) { if (this[i] == element) return true; }
return false;
}
Array.prototype.indexOf = function (element) {
for (var i = 0, k = this.length; i < k; i++) { if (this[i] == element) return i; }
return -1;
}
function parseIntD(iv, defV) { iv = parseInt(iv, 10); if (isNaN(iv)) iv = defV; return iv; }
function parseFloatD(iv, defV) { iv = parseFloat(iv, 10); if (isNaN(iv)) iv = defV; return iv; }
//Below Date.prototype.format code　was copied from：http://blog.csdn.net/akunshenjk/archive/2008/06/12/2539638.aspx
//Revised by Paul at 2013/02/27
Date.prototype.format = function (mask) {
var d = this;
var zeroize = function (value, length) {
if (!length) length = 2;
value = String(value);
for (var i = 0, zeros = ''; i < (length - value.length); i++) {
zeros += '0';
}
return zeros + value;
};
return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
switch ($0) {
case 'd': return d.getDate();
case 'dd': return zeroize(d.getDate());
case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
case 'M': return d.getMonth() + 1;
case 'MM': return zeroize(d.getMonth() + 1);
case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
case 'yy': return String(d.getFullYear()).substr(2);
case 'yyyy': return d.getFullYear();
case 'h': return d.getHours() % 12 || 12;
case 'hh': return zeroize(d.getHours() % 12 || 12);
case 'H': return d.getHours();
case 'HH': return zeroize(d.getHours());
case 'm': return d.getMinutes();
case 'mm': return zeroize(d.getMinutes());
case 's': return d.getSeconds();
case 'ss': return zeroize(d.getSeconds());
case 'l': return zeroize(d.getMilliseconds(), 3);
case 'L': var m = d.getMilliseconds();
if (m > 99) m = Math.round(m / 10);
return zeroize(m);
case 'tt': return d.getHours() < 12 ? 'am' : 'pm';
case 'TT': return d.getHours() < 12 ? 'AM' : 'PM';
case 'Z': return d.toUTCString().match(/[A-Z]+$/);
// Return quoted strings with the surrounding quotes removed
default: return $0.substr(1, $0.length - 2);
}
});
}
Date.prototype.toISO8601 = function (key) {
function f(n) {
// Format integers to have at least two digits.
return n < 10 ? '0' + n : n;
}
function f3(n) {
if (n < 10) return '00' + n;
if (n < 100) return '0' + n;
return n;
}
return this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) +
'.' + f3(this.getUTCMilliseconds()) + '0000' + 'Z';
};

Date.prototype.fromISO8601 = function (tx) {
//2013-04-19T16:20:41.0480000Z
if (!tx) return;
var isUTC = tx.substring(tx.length - 1) == "Z";
if (isUTC) tx = tx.substring(0, tx.length - 1);
if (tx.length < 19) return;
var oDt = new Date(0), sY = tx.substring(0, 4), sM = tx.substring(5, 7), sD = tx.substring(8, 10),
sH = tx.substring(11, 13), sN = tx.substring(14, 16), sS = tx.substring(17, 19), sMS = parseIntD(tx.substring(20, 23), 0);
if (isUTC) {
oDt.setUTCFullYear(parseInt(sY, 10), parseInt(sM, 10) - 1, parseInt(sD, 10));
oDt.setUTCHours(parseInt(sH, 10), parseInt(sN, 10), parseInt(sS, 10), sMS);
} else {
oDt.setFullYear(parseInt(sY, 10), parseInt(sM, 10) - 1, parseInt(sD, 10));
oDt.setHours(parseInt(sH, 10), parseInt(sN, 10), parseInt(sS, 10), sMS);
}
return oDt;
};
Date.prototype.beginOfDate = function () {
var b = new Date(this.getTime());
b.setHours(0); b.setMinutes(0); b.setSeconds(0); b.setMilliseconds(0);
return b;
}
Date.prototype.endOfDate = function () {
var e = new Date(this.getTime());
e.setHours(23); e.setMinutes(59); e.setSeconds(59); e.setMilliseconds(999);
return e;
}
function hasBit(n, b) { return (n & b) == b; }

//after try Firefox,Google Chrome, MS IE , only userAgent
// ** BEGIN GJT (Giant Javascript Tool)
var GJT = new function () {

var navUserAgent = navigator.userAgent,
ls = [new RegExp("&", "gi"), "&amp;", new RegExp("\"", "gi"), "&quot;", new RegExp(">", "gi"), "&gt;",
new RegExp("<", "gi"), "&lt;", new RegExp("'", "gi"), "&apos;", new RegExp(String.fromCharCode(13), "gi"), "&#13;", new RegExp("\n", "gi"), "&#10;"],

lsD = [new RegExp("&amp;", "gi"), "&", new RegExp("&quot;", "gi"), "\"", new RegExp("&gt;", "gi"), ">",
new RegExp("&lt;", "gi"), "<", new RegExp("&apos;", "gi"), "'", new RegExp("&#13;", "gi"), String.fromCharCode(13), new RegExp("&#10;", "gi"), "\n"];
var mBrowserType, mIsBrowserFollowW3C = true, mouseButtonIsDown = false;
if (navUserAgent.indexOf("MSIE") > -1) {
mBrowserType = BWRT.IE;
mIsBrowserFollowW3C = false;
}
else if (navUserAgent.indexOf(".NET CLR") > -1) {
mBrowserType = BWRT.IE;
}
else if (navUserAgent.indexOf("Chrome") > -1) {// || navUserAgent.indexOf("like Gecko") > -1
//Chrome support outerHTML
mBrowserType = BWRT.CHROME;
}
else if (navUserAgent.indexOf("Firefox") > -1 || navUserAgent.indexOf("Safari") > -1) {
mBrowserType = BWRT.FIREFOX;
if (navUserAgent.indexOf("Safari") > -1)
{ mBrowserType = BWRT.SAFARI; }
//Below Codes block were copied from http://www.cnblogs.com/doll-net/archive/2007/06/17/786835.html
if (typeof (HTMLElement) != "undefined" && !window.opera) {
HTMLElement.prototype.__defineGetter__("outerHTML", function () {
var a = this.attributes, str = "<" + this.tagName, i = 0; for (; i < a.length; i++)
if (a[i].specified)
str += " " + a[i].name + '="' + GJT.encodeAttr(a[i].value) + '"';
if (!this.canHaveChildren)
return str + " />";
return str + ">" + this.innerHTML + "</" + this.tagName + ">";
});
HTMLElement.prototype.__defineSetter__("outerHTML", function (s) {
var r = this.ownerDocument.createRange();
r.setStartBefore(this);
var df = r.createContextualFragment(s);
this.parentNode.replaceChild(df, this);
return s;
});
HTMLElement.prototype.__defineGetter__("canHaveChildren", function () {
return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());
});
HTMLElement.prototype.__defineGetter__("innerText", function () {
return this.textContent.replace(/\xA0/g, " "); //replace nbsp
});
HTMLElement.prototype.__defineSetter__("innerText", function (txt) {
this.textContent = txt;
});
}
}
else if (navUserAgent.indexOf("Opera/") > -1) {
mBrowserType = BWRT.OPERA;
}
if (typeof (Document) != "undefined" && !Document.prototype.loadXML) {
Document.prototype.loadXML = function (sXml) {
var oParser = new DOMParser();
try {
var oXmlDom = oParser.parseFromString(sXml, "text/xml"); // "text/xml");
} catch (ex) { return; }
while (this.firstChild) {
this.removeChild(this.firstChild);
}
for (var i = 0; i < oXmlDom.childNodes.length; i++) {
var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
this.appendChild(oNewNode);
}
};
}
if (typeof (HTMLElement) != "undefined" && !HTMLElement.prototype.insertAdjacentHTML) {
HTMLElement.prototype.insertAdjacentHTML = function (sWhere, sHTML) {
var df; // : DocumentFragment
var r = this.ownerDocument.createRange();

switch (String(sWhere).toLowerCase()) { // convert to string and unify case
case "beforebegin":
r.setStartBefore(this);
df = r.createContextualFragment(sHTML);
this.parentNode.insertBefore(df, this);
break;
case "afterbegin":
r.selectNodeContents(this);
r.collapse(true);
df = r.createContextualFragment(sHTML);
this.insertBefore(df, this.firstChild);
break;
case "beforeend":
r.selectNodeContents(this);
r.collapse(false);
df = r.createContextualFragment(sHTML);
this.appendChild(df);
break;
case "afterend":
r.setStartAfter(this);
df = r.createContextualFragment(sHTML);
this.parentNode.insertBefore(df, this.nextSibling);
break;
}
return df;
};
}
if (!window.execScript) {
window.execScript = function (sScript, sType) { eval(sScript); };
}
if (mBrowserType != BWRT.IE) {
//FireFox and Chrome no name property
HTMLElement.prototype.__defineGetter__("name", function () {
return this.getAttribute("name");
});
HTMLElement.prototype.__defineSetter__("name", function (myName) {
this.setAttribute("name", myName);
});
}
// ****Codes for Firefox & Google Browser compatible
function gjtmousemove() {
}
function gjtmousedown() {
var e = getEvent(), o = getSrcElement(e), fx = e.offsetX, fy = e.offsetY, cw = o.clientWidth, ch = o.clientHeight;// document.title = fx + "," + cw + "," + fy + "," + ch + " ButtonIsDown" + Math.random();
if (fx == 0 && fy == 0 && o.tagName == "HTML") return;
if ((cw > 0 && fx > cw) || (ch > 0 && fy > ch)) return; //in scrollbar, scroll bar fire only mousedown ,no mouseup || e.clientX >= cw || e.clientY >= ch
mouseButtonIsDown = true;
}
function gjtmouseup() {
mouseButtonIsDown = false;// document.title = "ButtonIsUp" + Math.random();
}
function getSrcElement(evt) {
if (!evt) evt = getEventDo(getSrcElement);
return getSrcElementDo(evt);
}
function getSrcElementDo(evt) {
if (!evt) return;
if (mBrowserType == BWRT.FIREFOX) return evt.target;
return evt.srcElement;
}
function getEvent() {
return getEventDo(getEvent);
}
this.stopBubble = function () {
var ev = getEvent(); if (!ev) return;
if (ev.cancelBubble != undefined) ev.cancelBubble = true;
else if (ev.stopPropagation != undefined) { ev.stopPropagation(); }
}
this.trim = function (suStr) {
if (suStr == null) return null;
if (typeof suStr != "string") return suStr;
var strtpos = 0, endpos = suStr.length; if (endpos == strtpos) return "";
while (suStr.substring(strtpos, strtpos + 1) == " ") { strtpos++; if (endpos == strtpos) return ""; }
while (suStr.substring(endpos - 1, endpos) == " ") { endpos--; }
return suStr.substring(strtpos, endpos);
}
this.runByName = function (ObjectName) {
if (!nm || nm.length == 0) return;
var MyParam = "()", res = null; //加入evt反而造成次階呼叫出問題
if (nm.indexOf("(") > 0) MyParam = "";
res = eval(nm + MyParam + ";");
}
this.event = getEvent;
this.eventSrc = getSrcElement;
if (window.addEventListener) {//for get mouse button being pressed
window.addEventListener('mousedown', gjtmousedown, true); //here use capture to prevent cancelBubble by srcElement
window.addEventListener('mouseup', gjtmouseup, true);
}
else {
document.attachEvent('onmousedown', gjtmousedown);
document.attachEvent('onmouseup', gjtmouseup);
}
function getEventDo(myCaller) {//This is for FireFox
//Google Browser Chrome support window.event, FireFox not
var evt = window.event; if (evt) return evt;
if (!myCaller) myCaller = arguments.callee.caller;
var cnt = 0;
while (myCaller != null && cnt < 100) {
if (myCaller.arguments.length > 0) {
var arg0 = myCaller.arguments[0];
if (arg0) {
var ttx = "" + arg0.constructor;
if (ttx.indexOf("Event") >= 0) { return arg0; }
}
}
myCaller = myCaller.caller;
cnt++;
}
return null;
}
this.eventKeyCode = function (evt) {
if (!evt) evt = getEvent();
if (evt.which) return evt.which; //FireFox
return evt.keyCode;
}
this.eventSetKeyCode = function (newKeyCode, evt) {
if (!evt) evt = getEvent();
if (evt.which) { evt.which = newKeyCode; return; } //FireFox
evt.keyCode = newKeyCode;
}
this.isLeftButton = function () {
//For Google Browser Chrome, button = 0 means left button,
//Gecko DOM event: button = 0 means left button
//refer to http://www.quirksmode.org/js/events_properties.html#button
//refer to https://developer.mozilla.org/en/DOM_Client_Object_Cross-Reference/navigator
var button = getEvent().button;
if (mIsBrowserFollowW3C) {
return (button == 0);
} else if (mBrowserType == BWRT.IE) {
return (button == 1);
}
else {
return (button == 0);
}
}
this.isRightButton = function () {
//For Google Browser Chrome, button = 0 means left button,
//Gecko DOM event: button = 0 means left button
//refer to http://www.quirksmode.org/js/events_properties.html#button
//refer to https://developer.mozilla.org/en/DOM_Client_Object_Cross-Reference/navigator
var button = getEvent().button;
if (mIsBrowserFollowW3C) {
return (button == 2);
} else if (BWRT.IE == mBrowserType) {
return (button == 2);
}
else {
return (button == 2);
}
}
this.isButtonDown = function () {
if (mIsBrowserFollowW3C) {
return mouseButtonIsDown;
} else {
var ev = getEvent();
if (ev.button != 0) return true;
}
return false;
}
this.isButtonDownLeft = function () {
if (this.isButtonDown()) {
return this.isLeftButton(getEvent().button);
}
return false;
}
this.isButtonDownRight = function () {
if (this.isButtonDown()) {
return this.isRightButton(getEvent().button);
}
return false;
}
this.eventAddHandle = function (oTarget, eventName, fnPointer, useCapture) {//登記事件捕捉
if(!oTarget)return;
if (oTarget instanceof Array) {
for (var i = 0, k = oTarget.length; i < k; i++) { this.eventAddHandle(oTarget[i], eventName, fnPointer, useCapture); }
}
if (eventName.indexOf(",") >= 0) {
var evs = eventName.split(",");
for (var i = 0; i < evs.length; i++) { this.eventAddHandle(oTarget, evs[i], fnPointer, useCapture); }
return;
}
if (oTarget.addEventListener) {
oTarget.addEventListener(eventName, fnPointer, useCapture);
}
else if (oTarget.attachEvent) {
oTarget.attachEvent("on" + eventName, fnPointer);
}
}
this.eventRemoveHandle = function (oTarget, eventName, fnPointer,useCapture) {//移除已登記的事件捕捉
if (eventName.indexOf(",") >= 0) {
var evs = eventName.split(",");
for (var i = 0; i < evs.length; i++) { this.eventRemoveHandle(oTarget, evs[i], fnPointer,useCapture); }
return;
}
if (oTarget.removeEventListener) {
oTarget.removeEventListener(eventName, fnPointer, useCapture);
}
else if (oTarget.detachEvent) {
oTarget.detachEvent("on" + eventName, fnPointer);
}
}
this.getChildById = function (ancester, myId, coll) {
if (!ancester) ancester = document;
if (ancester.all) {//IE will return collection if more than one object with same id,so return only first one
var a = ancester.all(myId); //&& ancester.all(myId)
if (a && a.length && !coll) return a[0];
return a;
}
return getChildByIdRecursive(ancester, myId, coll);
}
function getChildByIdRecursive(ancester, myId, coll) {
var chrn = ancester.children;
if (!chrn || chrn.length == 0) return null;
var descendant = chrn[myId];
if (descendant) {
if (!coll) return descendant;
//else coll.push(descendant);
}
for (var i = 0; i < chrn.length; i++) {
if (myId && (chrn[i].getAttribute("id") == myId || chrn[i].getAttribute("name") == myId)) {
if (!coll) return chrn[i];
else coll.push(chrn[i]);
}
descendant = getChildByIdRecursive(chrn[i], myId, coll);
if (descendant && !coll) return descendant;
}
if (coll) return coll;
}
this.descendantCount = function (ancester) {
if (ancester == document && document.all) return document.all.length;
else if (ancester == document.body && document.body.all) return document.body.all.length;
var res = ancester.children.length, il = res;
for (var i = 0; i < il; i++) {
res += this.descendantCount(ancester.children[i]);
}
return res;
}
this.xmlHttpRequest = function () {
if (window.XMLHttpRequest) {
return new XMLHttpRequest();
} else if (window.ActiveXObject) {
var aVersions = ["MSXML2.XMLHttp.6.0", "MXSML2.XMLHttp.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"]; //MSXML2.XMLHTTP
for (var i = 0; i < aVersions.length; i++) {
try {
var oXHR = new ActiveXObject(aVersions[i]);
return oXHR;
} catch (oError) {
// Do nothing
}
}
}
throw new Error("XMLHttp object could not be created.");
}
function bwrCreateMSXMLDOM() {
var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0", "MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument", "Microsoft.XmlDom"];
for (var i = 0; i < arrSignatures.length; i++) {
try {
var oXmlDom = new ActiveXObject(arrSignatures[i]);
return oXmlDom;
} catch (oError) {
//ignore
}
}
throw new Error("MSXML is not installed on your system.");
}
this.xmlDocument = function () {
var xDoc = null;
if (document.implementation && document.implementation.createDocument) {
//This returns null with Chrome but works with Firefox :)
xDoc = document.implementation.createDocument("", "", null); // alert(xDoc);
if (typeof xDoc.loadXML == "undefined") xDoc = bwrCreateMSXMLDOM();
}
else if (typeof ActiveXObject != "undefined") {
xDoc = bwrCreateMSXMLDOM();
}
if (xDoc == null || typeof xDoc.load == "undefined") {
//xDoc = null;
}
return xDoc;
}
function bwrDictionary() {
this.dict = {};
this.k = [];
if (typeof bwrDictionary._initialized == "undefined") {
var po = bwrDictionary.prototype;
po.Add = function (key, value) {
if (this.dict[key] == null) { this.dict[key] = value; this.k.push(key); this[key] = value; }
return;
};
po.add = po.Add;
po.item = function (key) {
return this.dict[key];
}
po.Item = po.item;
po.Exists = function (key) {
if (this.dict[key] != null) return true;
return false;
};
po.exists = po.Exists;
po.Keys = function () { return this.k; };
po.keys = po.Keys;
po.Remove = function (key) {
if (this.dict[key] == null) return;
delete this.dict[key];
delete this[key];
var i = this.k.indexOf(key);
if (i > -1) this.k.splice(i, 1);
}
po.remove = po.Remove;
bwrDictionary._initialized = true;
}
}
this.newDictionary = function () {
return new bwrDictionary(); //Never use ActiveXObject("Scripting.Dictionary"), it is bad for item() property
var res;
try { res = new ActiveXObject("Scripting.Dictionary"); } catch (e) { res = new bwrDictionary(); } return res;
}
this.browserType = mBrowserType;
this.isFollowW3C = mIsBrowserFollowW3C;
this.encodeAttr = function (OriStr) {//encode html attribute text
var res = OriStr; if (!res) return res;
for (var i = 0; i < ls.length; i += 2) { res = res.replace(ls[i], ls[i + 1]); }
return res;
}
this.decodeAttr = function (OriStr) {//decode html attribute text
var res = OriStr; if (!res) return res;
for (var i = 0; i < lsD.length; i += 2) { res = res.replace(lsD[i], lsD[i + 1]); }
return res;
}
this.encodeHTML = function (txt) { return txt.replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
this.getWindowHeight = function (owin) {
var d = owin ? owin.document : self.document, bdy = d.body;
var de = d.documentElement;
return window.innerHeight || (de && de.clientHeight) || (bdy && bdy.clientHeight) || 0;
}
this.getWindowWidth = function (owin) {
var d = owin ? owin.document : self.document, bdy = d.body;
var de = d.documentElement;
return window.innerWidth || (de && de.clientWidth) || (bdy && bdy.clientWidth) || 0;
}
this.getWindowScrollTop = function (owin) {
var d = owin ? owin.document : self.document, bdy = d.body;
var de = d.documentElement;
return (de && de.scrollTop) || (bdy && bdy.scrollTop) || 0;
}
this.getWindowScrollLeft = function (owin) {
var d = owin ? owin.document : self.document, bdy = d.body;
var de = d.documentElement;
return (de && de.scrollLeft) || (bdy && bdy.scrollLeft) || 0;
}
this.getComputedStyle = function (element, pseudo) {
if (!element || !element.tagName) return; //not an element
if (window.getComputedStyle) return window.getComputedStyle(element, pseudo);
return element.currentStyle;
}
this.keyWord = {
EditLogValue: "EditLogValue_", AppOpSetting: "AppOpSetting", UserOpSetting: "UserOpSetting",
FirstDataRow: "FirstDataRow", FirstDataColumn: "FirstDataColumn", opAttr: "zatr",
opDataType: "zdtp", NextRowNo: "znxrn", DspFormat: "zdf",
CommonInfo: "sCommonInfo", OriginalData: "sOldData", IdPrefix: "sIdPrefix",
EXEOPTION: "exeOption",
KeyFields: "sunKeyfields", KeyFieldsForDelete: "sunKeyfields4Del",
RqrFields: "sunRQRfields", AllFields: "sunAllfields",
VariableItems: "zVI", SelectedItems: "zSI", SelectedItemsNew: "zSIN",
FieldfmtFiles: "fmtFiles", TableViewMode: "tblvwmode",
ProgramPrivilege: "pgr", //tag attribute name for program config
DataPrivilege: "dpvg", //tag attribute for data privilege
SpecialTools: "sunTools_Special", NoPredefinedFields: "znpf",
ObjectName: "objN", ReplyReport: "sunSaveReport", ValueFields: "sunValueFields",
PtyNameRecordState: "s", PtyNameRecordId: "sRID", attrFields: "attrFlds", attrFldPrefix: "_", attrFldPrefixOrig: "_zOri_",
Caption: "zCp", Tip: "zTip", ObjectTabs: "zOT", FieldName: "zFN", AlertMessage: "sunAlertMessage",
PageName: "PageName", //Page name used as request.parameter name for Save user profile
GridName: "GirdName", //Grid name used as request.parameter name for Save user profile
ColumnsList: "ColumnsList", //Column names list used as request.parameter name for Save user profile
ViewName: "vwName", TableName: "tblName", TableMode: "tblMode",
Choice: "zCh", ControllerId: "zCt", PtyOrigValue: "orv", PtyOrigValueN: "orvN", ByInteractive: "bitv",
QueryItems: "attrQueryItems", QueryItemsLast: "attrQueryItemsLast", QueryItemsExtra: "attrQueryItemsExtra",
CurrentObjectName: "sunCurNm", RelationItems: "sunRelaItems", PtyNameColumnsSREC: "FieldsColumn",
PtyNameWinID: "sunWID", //window id for check refresh or not,ex: select part for lineup/Spec,the part selector window will set the id to spec item no,if Spec item changed then window must refresh,if not keep original window
PtyNameHotQryFields: "sunHotQryFlds", ColumnsSet: "clst", BusTypeOfAttrH: "zbto", ForeignKeys: "fgks",
WildChar: "sunWildChar",
SelectedBlock: "sunSelectedBlock",
relaDirFrom: "from", relaDirTo: "to",
DefaultValue: "DefaultValue", //The default value for a item
DefaultQryValue: "DefaultQryValue", //The default query item value for a item
ItmsToHide: "ItmsToHide", //The items need to hide in value selector
ptyCloneFrom: "cloneFrom", ptyDtlEditLog: "sDtlEdLog",
MaxLength: "MaxLength",
Dlm_: String.fromCharCode(3), Dlm0: String.fromCharCode(4), Dlm1: String.fromCharCode(5), Dlm2: String.fromCharCode(6),
RelationshipFieldHead: String.fromCharCode(7),
ExpLevel: String.fromCharCode(7) + "L",
ExpRelaName: String.fromCharCode(7) + "R",
ExpAnotherEndId: String.fromCharCode(7) + "_AnotherEndId", //virtual field represent the other end object id,used in expand table and connect object manual interface
dbNull: String.fromCharCode(7), //must not = Dlm_ ...
dmlA0: "^", dmlA1: "|", dmlA2: "`",
dmlA3: "!", dmlA4: "&", dmlA5: "~", dmlN: ",",

//below define http query parameter names
PrmResponseContentType: "_rspCntType",
PrmLanguage: "_Language",
PrmCharSet: "_CharSet",
PrmOpMode: "opMode",
PrmObjId: "oid",
PrmPartId: "prtoid",
PrmSignNm: "SignNm",
PrmShowItems: "ShowItems",
PrmAction: "prmAction",
PrmValue0: "prmValue0",
PrmOIdFromToDoList: "OIdFromToDoList",
PrmToDoListOId: "TDLOId",
PrmRoleList: "RoleList", //Role name list
PrmPersonList: "PersonList", //Person name list
PrmGroupList: "GroupList", //Group name list

PrmRequestType: "ObjType",
PrmRequestAction: "OAction",
PrmRequestTarget: "OTarget",
PrmRequestVal: "OIdsSendtoRpt",
PrmRequestExtraPara: "OExtraPara",
PageRows: "rwpp", PageNo: "pgno",
TotalPages: "ttlpgs", TotalRecords: "xttlrcds",
httpPrmSortBy: "hpsb",
BPCAction: "bpAction",
PopupMenu: "PopupMenu",
PrmTimezoneOffset: "tzos",
busCtrl: "busCtrl",
PageConfig: "pgcfg", UserCaption: "usrcpt",
DefinedReportsCount: "pdrptC", ReportId: "rptid", PreDefinedFilterCount: "pdqryfC", FilterId: "fltid", RelativeItemsCount: "pdriC", ValueCarriersInfo: "vcifo",
dataTypeEnum: { String: 1, Integer: 2, Real: 3, Boolean: 4, DateTime: 5, Date: 6, Short: 12, Structure: 20, Table: 21 } //Declare data type
}
this.itemOpConfigEnum = {//Item Attribute
Required: 0x1, OutPutDenied: 0x2, Disabled: 0x4, Hidden: 0x8,
Checked: 0x10, WithSubValues: 0x20, IsKey: 0x40, Virtual: 0x80,
SortDenied: 0x100, NoKeyPress: 0x200, ReadDenied: 0x400, SaveDenied: 0x800,
WriteDenied: 0x1000, ChangeDenied: 0x2000, RemoveDenied: 0x4000, NoTabStop: 0x8000,
MultiLine: 0x10000, StepUpValue: 0x20000, FlexibleVal: 0x40000, QueryDenied: 0x80000,
IsAttribute: 0x100000, NoNull: 0x200000, IsSystemItem: 0x400000, AddTimePartAuto: 0x800000,
OmitDenied: 0x1000000, SelectAllAfterFocus: 0x2000000, ValueIsOuterHTML: 0x4000000,
SupportUnicode: 0x8000000, UpperCaseOnly: 0x10000000, UseCheckboxAsUI: 0x20000000,
NoNullForQuery: 0x40000000
}
this.dataPrivilegeEnum = {//DataPvgEnum
Create: 0x1,
Delete: 0x2,
Modify: 0x4,
Read: 0x8,
Show: 0x10,
Execute: 0x20,
ChangeName: 0x40,
ChangeOwner: 0x80,
ChangeType: 0x100,
ChangePolicy: 0x200,
Enable: 0x400, //This means the privilege for "Enable business object",
Disable: 0x800, //This means the privilege for "Disable business object",
Lock: 0x1000,
Unlock: 0x2000,
Promote: 0x4000,
Demote: 0x8000,
Connect: 0x10000,
Disconnect: 0x20000,
Schedule: 0x40000,
CheckIn: 0x80000,
CheckOut: 0x100000,
NoteInfoWrite: 0x200000,
NoteInfoRead: 0x400000
}
this.programPrivilegeEnum = {//Program Config
Insert: 0x1,
Update: 0x2,
Delete: 0x4,
Query: 0x8,
Execute: 0x10,
CacheData: 0x20,
ExportData: 0x40,
ShowMeEvenIfNotExecutable: 0x100,
ClipBoard: 0x200,
InsertRows: 0x400,
MoveColumn: 0x800,
MoveRow: 0x1000,
RemoveColumns: 0x2000,
RemoveRows: 0x4000,
ShowCheckbox: 0x8000,
Save: 0x10000,
Sort: 0x20000,
MultiSelect: 0x40000, //disa
InsertRowsAfter: 0x80000,
KeepSpaceChar: 0x100000,
NeverFormatData: 0x200000,
NoEditLog: 0x400000,
ValidateByPass: 0x800000,
RefreshAfterSave: 0x1000000,
SaveAllWhenDoSave: 0x2000000,
AdminUser: 0x8000000,
CheckinFile: 0x10000000,
CheckoutFile: 0x20000000,
canInsertRow: function (config) {
return hasBit(config, this.Insert) || hasBit(config, this.InsertRows);
},
canEdit: function (config) { return ((config & this.Insert) == this.Insert) || ((config & this.Delete) == this.Delete) || ((config & this.Update) == this.Update); },
canRemoveRow: function (config) { return ((config & this.RemoveRows) == this.RemoveRows); }, // || ((config & this.Delete) == this.Delete)},
canQuery: function (config) { return ((config & this.Query) == this.Query); },
canSave: function (config) { return ((config & this.Save) == this.Save); },
canDelete: function (config) { return ((config & this.Delete) == this.Delete); },
canSort: function (config) { return ((config & this.Sort) == this.Sort); }
}
this.WorkflowActionTypeEnum = {
GetStateInfoList: 1, /// 讀取物件的目前狀態資訊 (目前所處狀態,簽核情況,簽核意見等...)
StartFlow: 3, // 啟動流程
CloseFlow: 4, // 啟動流程
ChangeStatus: 6, // 直接變更狀態(階段)到指定的狀態
Promote: 9, // 將狀態推動到下一個階段
Demote: 12, // 將狀態倒推動回上一個階段
Approve: 15, // 簽署同意
Disapprove: 18, // 簽署不同意
Ignore: 21, // 簽署沒意見
Reject: 24, // 簽署退回
Sign: 27, // 簽核行動
Recant: 28,
DeleteToDo:29,//刪除To Do
InviteSigner: 30, //邀請簽核
DisinviteSigner: 31//取消邀請簽核
}
this.WorkflowPrivilegeEnum = {
Create: 0x1,
Approve: 0x2,
Disapprove: 0x4, // 可不同意
Reject: 0x8, // 可退回
Ignore: 0x10, // 可表示沒有意見(棄權)
AllowNoComment: 0x20, // 允許不填寫簽核意見,即 簽核意見欄可以空白
Recant: 0x40, //允許撤回意見(撤簽)
Promote: 0x80, //往下推動
Demote: 0x100, //退回上一關
PromoteSuper: 0x200, /// 可以忽略簽核結果強制推到下一關
CloseFlow: 0x400 //結束流程(取消)
}
this.toolbarModeEnum = { none: 0, //No toolbar
withIcon: 0x1, //Show Icon
withText: 0x2, //Show Text
withStatusBar: 0x4, //Show Status bar
withMenuButtons: 0x8,
statusBarOnTop: 0x10,
noButtonBar: 0x20,
standard: 0x1 | 0x2 | 0x4 | 0x8, //icon + text + statusbar
simple: 0x1 | 0x4,
standardT: 0x1 | 0x2 | 0x4 | 0x8 | 0x10
};
this.gridLinkConfigEnum = { Disabled: 0x1, LinkSub: 0x2, External: 0x4, SetLinkForNewRow: 0x8, KeepSync: 0x10, OneWayLink: 0x20, LoosenLink: 0x40, SingleMaster: 0x80,
DblClickToShow: 0x100, ActivateAftShowed: 0x200, SyncParameters: 0x400, Hidden: 0x800, NoPaging: 0x1000, IgnoreLinkFail: 0x2000, BypassHiddenObject: 0x4000,
CaptionExclusive: 0x8000, ForAddNewRelativeRow: 0x10000, AllMaster: 0x20000, AutoShowAfterSave: 0x40000, RemoveRelativeRows: 0x80000,
NoExpandAll: 0x100000, AllowNewMast: 0x200000, IgnorePrivilege: 0x400000, NoEditLog: 0x800000, NoEvent: 0x1000000, ForModifyRelative: 0x2000000,
AutoSearchMatch: 0x4000000, OverwriteBlankOnly: 0x8000000, PendingQuery: 0x10000000, ClearNoUsedParameters: 0x20000000, ExpandAfterQuery:0x40000000
}//Grid Link Config Enum
this.executeOptionEnum = { IgnoreAllAttribute: 0x1, KeepOriginal: 0x2, ExactCompare: 0x4, MatchCase: 0x8, CascadeShow: 0x10, NoEditLog: 0x20}//Execute Option Enum
this.compareModeEnum = { NotDefnied: 0, Equal: 0x1, Greater: 0x2, Smaller: 0x4, Between: 0x8, Like: 0x10, In: 0x20,
CommaToAND: 0x40, // 當同一個欄位的比較值有逗號出現時,如果比較模式包含本bit 則會讓逗號隔開的各值以 AND 方式 進行filter
CommaToOR: 0x80, /// 當同一個欄位的比較值有逗號出現時,如果比較模式包含本bit 則會讓逗號隔開的各值以 OR 方式 進行filter
IsNull: 0x100, JoinSetByAND: 0x200, JoinSetByOR: 0x400, OrderDescent: 0x800, Reverse: 0x1000, WildCompare: 0x2000, CaseSensitive: 0x4000, ValueIsFormula: 0x8000, Value2IsFormula: 0x10000,
ValueIsNativeCommand: 0x20000,
ExcludeDescendent: 0x40000, //不包含子孫階物件
ValueMustDoPairWithOthers: 0x80000
}
this.displayModeEnum = {
Default: 0,
GridEdit: 1, //顯示為可編輯的表格
GridEditWithCheckbox: 2, GridEditWithRadio: 3, GridValueSelector: 10, //作為資料值選擇器的表格
GridValueSelectorWithCheckbox: 11, GridValueSelectorWithRadio: 12,
GridStandard: 15, //一般標準的表格 , 不含任何的event設定
TextBox: 20, //文字輸入框
CheckBox: 30, Radio: 40, Button: 50, //按鈕形式
Frame: 60, TabStrip: 70, Span: 80, Div: 90, ComboBox: 100, Option: 101, ListBox: 105
}
this.FileCheckinOptionEnum = { IsPrivate: 0x1, LockWrite: 0x2, AllowPublicWrite: 0x4, LockDelete: 0x8, CheckoutToPDF: 0x10, CheckoutToHTML: 0x20, SendMailToFileOwnerWhenCheckedOut: 0x10000, IsPartnerAttachment: 0x40000 }
this.PageConfigEnum =
{
/// 讓頁面內容預設字體大小為標準的2倍大
LargeFont200: 0x1,
/// 不要有通用工具列
NoToolbar: 0x4,
/// 不要讓通用工具列浮動顯示
DoNotFloatToolbar: 0x8,
/// 加大查詢條件輸入區的字體大小
EnlargeHotQueryAreaFont: 0x10,
/// 使用自己特有的程式碼頁面,勾許此項時 共用頁面程式碼需要Forward給同名的program page處理
UseSelfPageProgram: 0x20

}
this.TreeViewOperOptionsEnum = {
IgnoreRepeat : 0x1,
AllowEditNodeProperty : 0x2,
AllowMoveNode: 0x4,
AllowChangeParent: 0x10,
ExpandDown: 0x20,
ExpandUp: 0x40,
ExpandForward: 0x80,
ExpandBackward: 0x100
}
this.OpDisplayOptionEnum = {
NoStatusBar: 0x1, NoToolBar: 0x2, WithRadio: 0x4, WithCheckbox: 0x8, HideTools: 0x10, AutoPlotChart: 0x20, SupportChart: 0x40, PutStatusBarInToolBar: 0x80, DelayDisplayContent: 0x100, AutoMaxWidthHeight: 0x200,
AllowLayoutCtrl: 0x400, AllowSwitchSplitMode: 0x800, ShowAsForm: 0x1000, ShowInFloatDialog: 0x2000, AutoHideAfterExecuted: 0x4000
}
this.DSO = this.OpDisplayOptionEnum;
this.LayoutOperOptions = { Disabled: 0x1, NoBorder: 0x2, NoSplitBar: 0x4, NoSplitButton: 0x8, AbsoluteWidth: 0x40, AbsoluteHeight: 0x80, AutoSizeContainer: 0x100, AutoScrollBar: 0x200, AutoExtendSize: 0x400 }
this.ChartLYOptionsEnum = {ShowAllChartsInLayout:0x1}
this.ChartOperOptionEnum = { Disabled: 0x1, AutoPlotAfterQuery: 0x2, PlotWholeTable: 0x4, BesideTableL: 0x8, BesideTableR: 0x10, BesideTableT: 0x20, BesideTableB: 0x40, VerticalArrange: 0x80, HorizontalArrange: 0x100, AutoPlotAfterEdit:0x400 } //圖表操作選項
this.ChartDataSeriesOperOptionEnum = { Disabled: 0x1, HoriDataSeries: 0x2, Is3D: 0x4, ShowDataPointLabel: 0x8, OneColumnXvsOneColumnY: 0x10, OneColumnZvsOneColumnY: 0x20, OneColumnLblvsOneColumnY: 0x40, ForSubTotalData:0x80 } //圖表資料數列操作選項
this.ChartDataSeriesFilterOperOptionEnum = {Disabled: 0x1 } //圖表資料數列操作選項
this.commandEnum = {//制式(預先定義)指令 定義
mnuFile: -1, mnuEdit: -2, mnuView: -3, ContextTool: -4, Close: -5, mnuView1: -6, mnuView2: -7, mnuEdit1: -8, mnuEdit2: -9,
Save: 1, SaveWhole: 2, Delete: 3,
SortA: 4, SortD: 5, SortN: 6,
InsertRow: 7, AppendRow: 8,
Copy: 9, CopyWithTitle: 10, CopyHTML: 11, CopyHTMLWithTitle: 12,
Paste: 13, PasteInsert: 14, FillLR: 15, FillUD: 16, FillUDIncr: 17,
RemoveRows: 18, UndoPull: 19, UndoPush: 20,
ClearRange: 21, SwitchSelMode: 22, ArrangeColumns: 23, HideColumns: 24, ShowColumns: 25,
HideRows: 26, ShowRows: 27, SetRowColor: 28,
RefreshRows: 29, SpecialTool: 30, SetPrintOneTable: 31, Logout: 32, Start: 33, ExtendSel: 34, MoveCols: 35, MoveRows: 36, BeginEdit: 37,
FloatHeader: 38, SelColumnsSet: 39, ShowProperties: 40, ShowRecordForm: 41, HideRecordForm: 42, MovePointer: 43, SelectAll: 44, CreateReport: 45,
ExportReport: 46, Query: 47, Export: 48, ExportReportToWindow: 49, Personalizing: 50, Developer: 51, advQuery: 52, expandQry: 53, expandQryRv: 54,
ShowMemoBox: 55, HideMemoBox: 56, ShowNumMemoBox: 57, HideNumMemoBox: 58, swToDocumentMode: 59, swToSheetMode: 60, ShowMemoSymbo: 61, QuickQuery: 62,
QuickQueryExp: 63, expandQryWithChildren: 64, expandQryOnlyChildren: 65, Refresh: 66, CloneRows: 67, showRelatedItem: 68, RefreshAll: 69, ShowChgHistory: 70,
ExpandAll: 71, CheckinFile: 72, CheckoutFile: 73, CheckFileCount: 74, ShowAnnexImg: 75, ShowAnnexList: 76, ShowFlowCtrl: 77, ChgColumnWidth: 78, ImportForeignInfo:79,
tlReviseRequest: 80, tlFreeNote: 81, MoveUp: 82, MoveDown: 83, Upgrade: 84, Downgrade: 85, RmvDuplicateRows:86, CopyDataRowURL:87
}
this.CondFmtOptnEnum = { useParamStyle: 0x1, keepStyleIfFalse: 0x2, appendStyle: 0x4, forIntervalChange: 0x8, mustEvalAllRows: 0x10, playSound: 0x20 }
this.geFormulaOptnEnum = { EvalOnly4Changed: 0x1, ShowResultInDlg: 0x2, OverwriteBlankOnly: 0x4, OverwriteNewRecOnly: 0x8, NoAlert: 0x10, EditLog: 0x20, RaiseEvent: 0x40, EvalAfterInsertRows: 0x80 }
this.ValueCarrierOptnEnum = { ForceSet: 0x1 }
this.eventEnum = {
Focus: 1,
Blur: 2,
NotifyExecute: 3, //通知執行某功能
RowInserted: 4,//新列加入後
QueryDone:5,//資料查詢完成顯示後
UIEvent: 1000//畫面互動操作的事件例如 keydown keyup keypress 等 在無輸入的物件上可能不會觸發(Chrome)
}
this.opExecute = function (cmd, param) {
var m = this.activeItem, ts;
if (m && m.opExecute) {
ts = new OpItems();
if (cmd == CMDE.ContextTool) {
if (m.queryTools) ts = m.queryTools(cmd, ts);
SysShowMenu(ts);
}
else return m.opExecute(cmd, param);
}
}
this.opEvent = function (Source, evtIndex, Param, vSources) {
var ei = this.eventEnum, e = evtIndex;
if (e == ei.Focus) {
//this.activeItem = Source;
if (this.tabCtrl) this.tabCtrl.setActiveItem(Source);
this.setActiveItem(Source);
} else if (e == ei.NotifyExecute) {
if (Source.opExecute) Source.opExecute(Param[0], Param[1]);
else this.opExecute(Param[0], Param[1]);
}
}
this.setActiveItem = function (itm) {
var oritm = this.activeItem;
if (oritm && oritm != itm) {
if (oritm._lvlOpg) showItA(oritm._lvlOpg, 0);
}
this.activeItem = itm;
if (itm && itm._lvlOpg) showItA(itm._lvlOpg, 1);
if (this.tabCtrl) this.tabCtrl.setActiveItem(itm);
}
this.xmlca = [[new RegExp("&#x3;", "gi"), "##x3;"], [new RegExp("&#x4;", "gi"), "##x4;"], [new RegExp("&#x5;", "gi"), "##x5;"], [new RegExp("&#x6;", "gi"), "##x6;"], [new RegExp("&#x7;", "gi"), "##x7;"]];
this.xmlcaR = [[new RegExp("##x3;", "gi"), "&#x3;"], [new RegExp("##x4;", "gi"), "&#x4;"], [new RegExp("##x5;", "gi"), "&#x5;"], [new RegExp("##x6;", "gi"), "&#x6;"], [new RegExp("##x7;", "gi"), "&#x7;"]];
this.xmlc4s = function (txt, restore) {//return inTxt;
var r = restore ? this.xmlcaR : this.xmlca;
for (var i = 0; i < r.length; i++) {
txt = txt.replace(r[i][0], r[i][1]);
}
return txt;
}
this.chgPageLayout = function (layoutTxt) {
var chrn = this.children, txt = layoutTxt;
var a = this.activeItem;
if (!txt) txt = teBpcSync("GetHtmlPageLayOut", a);
if (!txt) return;
var n = newEm("div"), atrPv = ["xctnr4", "tbr4", "sts4", "recf4", "grd4"];
n.innerHTML = txt;
if (n.children.length == 1 && n.children[0].tagName == "DIV") n = n.children[0];
for (var i = 0; i < chrn.length; i++) {
var itm = chrn[i], id = itm.id, b = getChiHasAtr(n, "xctnr4", id);
if (!b) continue;
if (itm instanceof GridEdit) {
var tbr = getChiHasAtr(n, "tbr4", id), sts = getChiHasAtr(n, "sts4", id), rcf = getChiHasAtr(n, "recf4", id), gcf = getChiHasAtr(n, "grd4", id);
var tbrT = itm.ToolBar, stsT = itm.StatusBar, rcfT = itm._recForm, gcfT = itm.gridContainer, bT = itm.container;
if (rcfT) rcfT = rcfT.uio;
if (tbr && tbrT) lyReplaceNode(tbr, tbrT, atrPv);
if (sts && stsT) lyReplaceNode(sts, stsT, atrPv);
if (gcf && gcfT) {
lyReplaceNode(gcf, gcfT, atrPv);
if (itm._ftb && itm.floatHeader) itm._needRvHd = 1;
}
if (rcf) {
if (rcfT) lyReplaceNode(rcf, rcfT, atrPv);
else { itm._recFormTmp = rcf; hideIt(rcf); }
}
if (bT) {
copyAttr(bT, b, ["style"]);
bT.parentNode.removeChild(bT); //這可確保如果layout不顯示某元件,就會移除
itm.container = b;
}
}
else if (itm instanceof opTreeView) {
lyReplaceNode(b, itm.cntr, atrPv);
}

}
var ns = n.childNodes, bdy = BDY();
while (ns.length > 0) { bdy.appendChild(ns[0]); }
for (var i = 0; i < chrn.length; i++) {
var itm = chrn[i];
if (itm._needRvHd) { itm.floatHeader(0); itm.floatHeader(1); }
}
}

this.getFixedPanel = function () {
var nn = document.body.childNodes;
for (var i = 0; i < nn.length; i++) {
var cs = this.getComputedStyle(nn[i]); if (!cs) continue;
var xx = cs.position;
if (xx == "fixed" && nn[i].className != "teDialog") return nn[i];
}
}

this.replaceChild = function (tar, oldEnt, addQryString) //置換指定的UI元件成另外一個
{
var newEnt = teGenGridEdit(tar, oldEnt.toolbarMode, null, oldEnt.qryURL, null, getTargetPage(), getAppId(), 1, addQryString);
if (!newEnt) return;
oldEnt.container.parentNode.replaceChild(newEnt.container,oldEnt.container);
if (this.lyoDispatcher) this.lyoDispatcher.replaceItm(newEnt, oldEnt);
var chn = this.children;
chn.remove(oldEnt.name);
if (oldEnt._recFormDg){oldEnt._recFormDg.close(1);}
if (PROG.tabCtrl){PROG.tabCtrl.replaceChild(newEnt,oldEnt);}
newEnt.floatHeader(1);
return newEnt;
}
this.getWorkCalendar = function(name){
if (!this._calendars) this._calendars={};
var c = this._calendars[name];
if(!c){
c = new WorkCalendar(name);
this._calendars[name] = c;
}
return c;
}
this.getTextO = function (name) { try { var o = eval(name); if (o && o.text) return o; } catch (exx) { } }
this.acSymbolPersonSelByRole = "~acpsnselxro~";
} // ***** END GJT


var msAjaxPageName = "BPC.aspx";
var msAjaxPageName4UI = "BPC4UI.aspx";
var miTimeout4PopupMenu;
function ShowPopupMenu(o) {
window.clearTimeout(miTimeout4PopupMenu);
MenuHide();
if (o.uio) o = o.uio; o.id = KW.PopupMenu;
var s = GJT.eventSrc(); if (s) o.tgr = s;
showBesideMouse(o); GJT.stopBubble();return;
var obr=o.onblur;
// o.tabIndex = "0";Chrome show a blue rect if set tabIndex
o.focus();
o.onblur=function(){
if(obr){obr();}
miTimeout4PopupMenu = window.setTimeout(function(){MenuHide();},300);
};
}
function SysShowMenuT(ts, hnd) {
window.setTimeout(function () { SysShowMenu(ts, hnd) }, 50);
}
function SysShowMenu(ts, hnd) {
MenuHide();
if (!ts || ts.length == 0) return;
var mnu = new teMenus(BDY(), ts), o = mnu.uio;
o.oncontextmenu = function () { return false; }//避免右鍵選單本身觸發 瀏覽器系統選單
if (!hnd) hnd = SysMenuClick;
mnu.onclick = hnd;
ShowPopupMenu(mnu);
}
function SysToolbarClick(itm, itms) {
var x = itm.name, m = GJT.activeItem, ci = parseInt(x, 10), cm = CMDE, ts = new OpItems();
if (!m) return;
if (x == "mnuNoMouse") {

}
if (m.queryTools) ts = m.queryTools(ci, ts);
if (ci == cm.mnuFile) {
if (ts && ts.length > 0) mnuAddHline(ts); else ts = new OpItems();
sysCmdAdd(ts, [cm.SetPrintOneTable, cm.Logout]);
} else if (ci == cm.mnuEdit) {
} else if (ci == cm.ExtendSel) {
var o = new teShaft(BDY(), null, PROG, 0);
o.onclick = RangeSelectorClick;
return showBesideMouse(o, 0, 0, true);
}
SysShowMenu(ts);
}
function SysMenuClick(itm, itms, menuObj) {
var x = itm.name, ci = parseInt(x, 10), m = itms.executer ? itms.executer : GJT.activeItem, cm = CMDE;
if (isNaN(ci)) {
return;
}
if (ci == cm.SetPrintOneTable) return tlSetPrintOneTable();
if (ci == cm.Logout) return cmnLogout();
if (ci == cm.ExtendSel) {
var o = new teShaft(BDY(), null, m, 0);
o.onclick = RangeSelectorClick;
return showBesideMouse(o, 0, 0, false);
}
if (ci == cm.MoveRows || ci == cm.MoveCols) {
var o = new teShaft(BDY(), null, m, ci == cm.MoveCols ? 1 : 2);
o.onclick = MoveColRowDlgClick;
return showBesideMouse(o, 0, 0, false);
}
if (m && m.opExecute) return m.opExecute(ci);
}
function PointerMoveClick(sMode, ShaftObj) {
var m = ShaftObj.executer ? ShaftObj.executer : GJT.activeItem, t = sMode, ci, cm = CMDE, rg;
if (t == "RSH" && m.refreshMainRow) return m.refreshMainRow(1);
rg = t == "L" ? -1 : (t == "R" ? 1 : (t == "MF" ? -1000000 : (t == "ML" ? 100000 : 0)));
if (m && m.opExecute) return m.opExecute(cm.MovePointer, rg);
}
function RangeSelectorClick(sMode, ShaftObj) {
var m = ShaftObj.executer ? ShaftObj.executer : GJT.activeItem, t = sMode, ci, cm = CMDE, rg;
rg = t == "L" ? [-1, 0] : (t == "R" ? [1, 0] : (t == "U" ? [0, -1] : (t == "D" ? [0, 1] :
(t == "LD" ? [-1, 1] : (t == "RD" ? [1, 1] : (t == "LU" ? [-1, -1] : (t == "RU" ? [1, -1] : [0, 0])))))));
if (m && m.opExecute) return m.opExecute(cm.ExtendSel, rg);
}
function MoveColRowDlgClick(sMode, ShaftObj) {
var m = ShaftObj.executer ? ShaftObj.executer : GJT.activeItem, t = sMode, ci, cm = CMDE, rg;
if (!m || !m.opExecute) return;
if (t == "L") m.opExecute(cm.MoveCols, -1);
if (t == "R") m.opExecute(cm.MoveCols, 1);
if (t == "U") m.opExecute(cm.MoveRows, -1);
if (t == "D") m.opExecute(cm.MoveRows, 1);
}
function teSetOverflow(o, ovfType) {
var st = o.style;
st.overflow = ovfType; st.overflowX = ovfType; st.overflowY = ovfType;
var c =o.children[0];
if (o.children.length == 1 && o.tagName=="DIV") teSetOverflow(c, ovfType);
}
function mainEventDispatch(ev) {
var m = GJT.activeItem;
if (!ev) ev = GJT.event();
if (m && m.opEvent) return m.opEvent(m, EVI.UIEvent, ev);
}
function teOnCopy() {//接收user copy事件,以便消除臨時畫面內容,Chrome
var k = 0;
if (dlgForCopyData) {
window.setTimeout(function () { dlgForCopyData.close(); dlgForCopyData = null; }, 400);
}
}
function teOnPaste() {//接收user paste事件,以便消除臨時畫面內容
var l = 0;
}

var PITEMS = new OpItems();
var PROG = GJT; //Main Program Controller
PROG.children = PITEMS; PROG.bfrStartProgram = null; PROG.aftStartProgram = null; PROG.activeItemChanged = null;
PROG.activeItem = null;
PROG.onUnauthorized = teHndUnauthorized;
PROG.url4Authorization = "Login.aspx";

var KW = GJT.keyWord, GDT = KW.dataTypeEnum, mBrowserType = GJT.browserType, DPVG = GJT.dataPrivilegeEnum, PPVG = GJT.programPrivilegeEnum,
GIA = GJT.itemOpConfigEnum, GLC = GJT.gridLinkConfigEnum, EXO = GJT.executeOptionEnum, TBM = GJT.toolbarModeEnum, DSM = GJT.displayModeEnum,
dmlMnu = KW.Dlm_, dmlMnuItm = KW.Dlm0, EVI = GJT.eventEnum, CMDE = GJT.commandEnum, PGC = GJT.PageConfigEnum;

function dtypeIsNum(dt) {
if (dt.dataType) dt = dt.dataType;
return (dt == GDT.Integer || dt == GDT.Real || dt == GDT.Short);
}
function OpItem(name, caption, description, dataType, opconfig, programPrivilege, dataPrivilege) {
dataType = parseIntD(dataType, GDT.String); opconfig = parseIntD(opconfig, 0); programPrivilege = parseIntD(programPrivilege, 0); dataPrivilege = parseIntD(dataPrivilege, 0);
this.name = name; this.text = caption; this.tip = description; this.dataType = dataType; this.programPrivilege = programPrivilege; this.dataPrivilege = dataPrivilege;
this.choice = null; this.ctrlId = null; this.defaultValue = null; this.defaultCritera = null; this.displayFormat = null; this.value = null; this.fieldName = null;
this.opConfig = opconfig; this.maxLength = 0;
if (typeof OpItem._initialized == "undefined") {
var po = OpItem.prototype;
po.dataPvgToOpConfig = function (oriOpAttr, myDataPvg) {
if (!oriOpAttr) oriOpAttr = 0;
if ((myDataPvg & DPVG.Read) != DPVG.Read) oriOpAttr = oriOpAttr | GIA.ReadDenied;
if (((myDataPvg & DPVG.Modify) != DPVG.Modify) && ((myDataPvg & DPVG.Create) != DPVG.Create)) oriOpAttr = oriOpAttr | GIA.WriteDenied;
return oriOpAttr;
}
po.isVirtual = function () { return (this.opConfig && (this.opConfig & GIA.Virtual) == GIA.Virtual); }
po.isAttribute = function () { return (this.opConfig && (this.opConfig & GIA.IsAttribute) == GIA.IsAttribute); }
po.isSaveDenied = function () { return (this.opConfig && (this.opConfig & GIA.SaveDenied) == GIA.SaveDenied); }
po.isWriteDenied = function () { return (this.opConfig && (this.opConfig & GIA.WriteDenied) == GIA.WriteDenied); }
po.isChangeDenied = function () { return (this.opConfig && (this.opConfig & GIA.ChangeDenied) == GIA.ChangeDenied); }
po.isHidden4User = function () {
var oa = this.opConfig;
return (oa && (hasBit(oa, GIA.Hidden) || hasBit(oa, GIA.OutPutDenied) || hasBit(oa, GIA.IsAttribute) || hasBit(oa, GIA.Disabled)));
}
po.isInChoice = function (val) {
var chc = this.choice; if (chc == null) return;
var v = parseChoiceA(chc, 1);
for (var i = 0; i < v.length; i++) {
if (v[i][0] == val) return 1;
}
if (this.valuesMap && this.valuesMap[val] != null) return 1; //value map
}
po.isNumber = function () { var dt = this.dataType; return dt && (dt == GDT.Integer || dt == GDT.Real || dt == GDT.Short); }
po.addOpconfig = function (cfg, remove) {
this.opConfig = this.opConfig | cfg;
if (remove) this.opConfig = this.opConfig ^ cfg;
}
po.clone = function (newName) {
var o = new OpItem();
for (var v in this){o[v]=this[v];}
o.name=newName;
return o;
}
OpItem._initialized = true;
}
//if (this.dataPvgToOpConfig) this.opConfig = this.dataPvgToOpConfig(opconfig, dataPrivilege);
}

function OpItems() {
this.items = [];
this.length = 0;
if (typeof OpItems._initialized == "undefined") {
var po = OpItems.prototype;
po.add = function (opitem) {
var m = this, itms = m.items, nm = opitem.name;
if (!isNaN(parseInt(nm, 10))) nm = nm + " ";
if(nm !=null) m[nm] = opitem;
m[itms.length] = opitem;
if(opitem.id && itms.length != opitem.id)m[opitem.id] = opitem;//讓id也能索引
itms.push(opitem);
m.length = m.items.length;
if (opitem.fieldName && opitem.name != opitem.fieldName && m[opitem.fieldName] == undefined) {
m[opitem.fieldName] = opitem;
}
return opitem;
}
po.item = function (index, caseInsensitive) {
if (typeof index == "string") {
var res = this[index]; if (res || !index) return res;
if (caseInsensitive) {
var itms = this.items,nm0 = index.toLowerCase();
for (var i = 0; i < itms.length; i++) {
var itm = itms[i], nm1 = itm.name, nm2 = itm.fieldName;
if (nm0 == nm1.toLowerCase() || nm0 == nm2.toLowerCase()) {
this[index] = itm; return itm;
}
}
}
//js 如果property name 是以數字開頭的,無法使用[index]得到,需要尾巴多一個空格,因為js似乎在這種情況會把屬性名稱尾巴自動加一個空格
if (!isNaN(parseInt(index.substring(0, 1), 10))) return this[index + " "];
}
else return this.items[index];
}
po.contains = function (itm) {
if (typeof itm == "string") return !!(this.item(itm));
var itms = this.items;
for (var i = 0; i < itms.length; i++) {
if (itms[i] == itm) return true;
}
return false;
}
po.getIndex = function (itm) {
var itms = this.items;
for (var i = 0; i < itms.length; i++) {
if (itms[i] == itm) return i;
if (itms[i].name == itm) return i;
if (itms[i].id== itm) return i;
}
return -1;
}
po.insert = function (sur, index) {
var m = this, itm = index, itms = m.items;
if (!(itm instanceof OpItem) && itm.name) { itm = m[itm.name]; if (!itm) return; }
for (var i = 0; i < itms.length; i++) { if (sur == itms[i]) return; }
m.clear();
for (var i = 0; i < itms.length; i++) {
if (itm == i || itm == itms[i]) m.add(sur);
m.add(itms[i]);
}
}
po.remove = function (index) {
if (index == null) return;
var m = this, itm;
if (index instanceof OpItems) {
for (var i = 0; i < index.length; i++) { m.remove(index[i].name); }
return;
} else if (index.name != null) {
itm = index;
} else if (typeof index == "number" || typeof index == "string") {
itm = m[index]; if (!itm) return;
} else itm = index;
var newitms = [], itms = m.items;
for (var i = 0; i < itms.length; i++) {
if (itm != itms[i]) {
m[newitms.length] = itms[i];
newitms.push(itms[i]);
}
}
for (var i = newitms.length; i < itms.length; i++) { delete m[i]; }
delete m[itm.name];
if (itm.fieldName) delete m[itm.fieldName];
m.items = newitms;
m.length = newitms.length;
}
po.replaceItem = function (newItm, oldItm) {
var m = this, itms = m.items, idx = -1;
for (var i = 0; i < itms.length; i++) { if (i == oldItm || itms[i] == oldItm) { idx = i; break; } }
if (i == -1) return;
m.insert(newItm, idx); m.remove(idx + 1);
return newItm;
}
po.clear = function () {
//這裡絕不可以把this.items 指標的內容刪除,再po.insert 裡假設this.items 指標的內容還是會存在
var itms = this.items;
for (var i = 0; i < itms.length; i++) {
var itm = itms[i];
if (this[itm.name]) delete this[itm.name];
if (this[itm.fieldName]) delete this[itm.fieldName];
if (this[i]) delete this[i];
}
this.items = []; this.length = 0;
}
po.addByString = function (str) {
if (!str) return;
if (str.indexOf("&#x9") > -1) v = cmnSplit2(str, "&#xA", "&#x9");
else v = cmnSplit2(str, KW.Dlm1, KW.Dlm2);
for (var i = 0; i < v.length; i++) {//name, caption, description, dataType, itmAttr, programPrivilege, dataPrivilege, id
var v1 = v[i];
var itm = new OpItem(v1[0], v1[1], v1[2], v1[3], v1[4], v1[11], v1[12]);
itm.choice = v1[5]; itm.ctrlId = v1[6]; itm.defaultValue = v1[7]; itm.DefaultCritera = v1[8]; itm.fieldName = v1[9]; itm.displayFormat = v1[10];
if (v1.length > 13 && v1[13].length > 0) {
var dict = GJT.newDictionary(), dictR = GJT.newDictionary(), vv = cmnSplit2(v1[13], KW.Dlm0, KW.Dlm_);
for (var j = 0; j < vv.length; j++) {
dict.add(vv[j][0], vv[j][1]);
dictR.add(vv[j][1], vv[j][0]);
}
itm.valuesMap = dict; itm.valuesMapRvs = dictR;
}
this.add(itm);
}
}
po.getIdList = function (sDelimiter) { return this.getNames(sDelimiter,0,0,0,0,1); }
po.getNames = function (sDelimiter, opConfigIncl, opConfigExcl, getText, getFldName,getId) {
return this.getNamesArray(opConfigIncl, opConfigExcl, getText, getFldName, getId).join(sDelimiter);
}
po.getNamesArray = function (opConfigIncl, opConfigExcl, getText, getFldName, getId) {
var res = [], itms = this.items, itm, nl = opConfigIncl, xl = opConfigExcl; if (itms.length <= 0) return res;
for (var i = 0, k = itms.length; i < k; i++) {
itm = itms[i];
if (nl && !hasBit(itm.opConfig, nl)) continue;
if (xl && hasBit(itm.opConfig, xl)) continue;
if (getFldName) {
txt = itm.fieldName; if (!txt) txt = itm.name; res.push(txt);
}
else if (getText) res.push(itm.text);
else if (getId) { txt = itm.id; if (!txt) txt = itm.name; res.push(txt); }
else res.push(itm.name);
}
return res;
}
po.collect = function (names, opConfigIncl, opConfigExcl, exclHidden) {//names == null means all items, opConfig is filter of opConfig
var res = new OpItems(), itms = this.items, ls, f = opConfigIncl, x = opConfigExcl;
if (names) {
ls = names.split(",");
for (var i = 0, k = ls.length; i < k; i++) {
var itm = this[ls[i]];
if (!itm) continue;
if (f && (itm.opConfig & f) != f) continue;
if (x && (itm.opConfig & x) == x) continue;
if (exclHidden && isHidden(itm)) continue;
res.add(itm);
}
} else {
for (var i = 0, k = itms.length; i < k; i++) {
var itm = itms[i];
if (f && (itm.opConfig & f) != f) continue;
if (x && (itm.opConfig & x) == x) continue;
if (exclHidden && isHidden(itm)) continue;
if (ls && !ls.contains(itm.name) && !ls.contains(itm.fieldName)) continue;
res.add(itm);
}
}
return res;
}
po.concat = function (itms) {
if (!itms) return this;
for (var i = 0; i < itms.length; i++) {
if (itms[i]) this.add(itms[i]);
else if (itms.item) this.add(itms.item(i));
}
return this;
}
po.clone = function () { return this.collect(); }
po.getAll = function (res) {//含所有子孫
if (!res) res = new OpItems();
for (var i = 0; i < this.length; i++) {
var itm = this.item(i);
res.add(itm);
if (itm.children && itm.children.getAll) res = itm.children.getAll(res);
}
return res;
}
OpItems._initialized = true;
}
} //end OpItems
function OpItemFilter(itm, value1, comparisonMode, value2) {
if(itm==null){
return;
}
OpItem.call(this, itm.name, itm.text, itm.tip, itm.dataType, itm.opConfig, itm.programPrivilege, itm.dataPrivilege);
this.fieldName = itm.fieldName; this.DefaultCritera = itm.DefaultCritera;
this.ComparisonMode = comparisonMode; //use GJT.compareModeEnum value
this.value1 = value1; this.value2 = value2;
}
function OpItemData(itm, newValue, originalValue, originalValueSeri) {
OpItem.call(this, itm.name, itm.text, itm.tip, itm.dataType, itm.opConfig, itm.programPrivilege, itm.dataPrivilege);
this.fieldName = itm.fieldName;
this.value = newValue;
this.originalValue = originalValue;
this.originalValueSerialized = originalValueSeri;
}
function OpItemOrderBy(opItem, sortDescending) {
OpItem.call(this, opItem.name, opItem.text, opItem.tip, opItem.dataType);
this.SortDescending = sortDescending ? true : false;
}
function OpQueryCriterion() {//查詢條件
this.filters = new OpItems();
this.orderBy = new OpItems();
this.selection = new OpItems();
}
function Component(name, caption) {
this.children = new OpItems(); //keep components
if (typeof Component._initialized == "undefined") {
var po = Component.prototype;
po.addChild = function (child) {
}
}
}
function opRela() {
var m = this, n = null;
m.name = "untitled"; m.text = m.name;
m.linkMode = 0;
m.from = n; m.to = n;
m.fromFields = new OpItems(); m.toFields = new OpItems(), m.fieldsForAnchor = new OpItems(); m.styleForAnchor = "";m.styleForButton = "";
m.filter = ""; m.relaAssm = ""; m.noteX = ""; m.textRev = "";m.textName = "";m.textNameRev = "";
}
function tvQueryByAjax(tv, aryP, aryV, qryURL, tarNd, byUser) {
if (!qryURL) qryURL = tv.qryURL;
if (!qryURL) qryURL = msAjaxPageName;
var req = GJT.xmlHttpRequest();
if (!tarNd) tarNd = tv.actNd;
req.onreadystatechange = function () { tvQueryByAjaxOncomplete(tv, tarNd, req); };
return teQueryByAjaxAu(tv.cntr, aryP, aryV, qryURL, byUser, null, req);
}
function tvQueryByAjaxOncomplete(tv, tarNd, req) {
if (req.readyState != 4) return;
if (req.status == 401 && PROG.onUnauthorized) return PROG.onUnauthorized();
if (req.status != 200) return alert('There was a problem with the request.');
var txt = req.responseText;
try {
var s;
try { s = JSON.parse(txt); } catch (ex) { eval("s=" + txt); } //JSON.parse只能接受可見字元的字串,控制字元會發成字元無效 的錯誤
tv.createTree(s, tarNd);
} catch (ex) { alert(ex); }
}
function opComponent(s) {
this.handleResized = null;
if (typeof opComponent._initialized == "undefined") {
var po = opComponent.prototype;
po.init = function (s) {if(!s)return;
var m = this, o = s;
if (!o.tagName) o = addChi(BDY(), "div"); //is not tag
m.container = o;m.cntr=o;
m.id = m.gd(s, "id"); m.name = m.gd(s, "name"); m.text = m.gd(s, "text");
var e=function(){m.evtHnd.call(m);};
}
po.setVisible = function (vis) { if (vis) showIt(this.cntr); else hideIt(this.cntr); }
po.visible = function () { return !isHidden(this.cntr); }
po.gd = function (sur, nm) {if (sur[nm]) return sur[nm]; else return getAtr(sur, nm);}
po.moveTo = function (l, t, w, h) { var m = this; cmnMoveObjTo(m.cntr, l, t, w, h); if (m.handleResized) m.handleResized(m); }
po.evtHnd=function(){
}
po.resizeMx = function () {
  var m = this, cn = m.cntr; if (!cn)return;
  var p = cn.parentElement; if (!p) return;
if (!hasBit(m._dspOptions, GJT.DSO.AutoMaxWidthHeight)) return;
var h0, w0, cnst = GJT.getComputedStyle(cn);
var isB = p == document.body;
h0 = GJT.getWindowHeight() - floatBarsHeight() - 2;
cn.style.height = toPx(h0);
if (m.resize) m.resize();
}
po.scrollToVisible = function () { this.cntr.scrollIntoView(); }
opComponent._initialized = true;
}
this.init(s);
}//end opComponent
function opListBox(s){
if (typeof opListBox._initialized == "undefined") {
var po = opListBox.prototype;
po.moveTo = function (l, t, w, h) {cmnMoveObjTo(this.cntr, l, t, w+1, h+1);}
opListBox._initialized = true;
}
this.init(s);
} //opListBox
opListBox.prototype = new opComponent(); //prototype chaining must run

function opTabStrip(sur, dspMode, dspOptn) {
if (typeof opTabStrip._initialized == "undefined") {
var po = opTabStrip.prototype;
po.moveTo = function (l, t, w, h) {
cmnMoveObjTo(this.cntr, l, t, w, h);this.resize();}
po.resize = function () {
var m = this;
if (m._lyoctrl) { m._lyoctrl.resizeLYO(); return; }// window.setTimeout(function () { m._lyoctrl.resizeLYO(); }, 50);
var a=m.activeItem,c=m.cntr, h2=getActHgt(m.tabCtnr,1),w=c.offsetWidth,h=c.offsetHeight;
if(a && a.moveTo) a.moveTo(0, h2,toCssWdt(c,w-1),toCssHgt(c,h)-h2-1);
}
po.opEvent = function (Source, evtIndex, Param, vSources) {
var m=this, ei = GJT.eventEnum, e = evtIndex;
if (e == ei.Focus) {
if (m.tabctr) m.tabctr.setActiveItem(Source);
m.setActiveItem(Source);
var p = m.parent; if (p && p.opEvent) return p.opEvent(m, EVI.Focus);
} else if (e == ei.NotifyExecute) {
if (Source.opExecute) Source.opExecute(Param[0], Param[1]);
else m.opExecute(Param[0], Param[1]);
}
else {
var a = this.activeItem; if (a && a.opEvent) return a.opEvent(Source, evtIndex, Param, vSources);
}
}
po.setActiveItem = function (itm) { var m = this; m.activeItem = itm; m.resize(); m.tabctr.setActiveItem(itm);}
po.queryTools = function (cmdTypeCode, itms) {
var a=this.activeItem;if(a && a.queryTools) return a.queryTools(cmdTypeCode, itms);
}
po.add = function (newEnt) {
var m = this, chn = m.children;
m.tabctr.add(newEnt);
newEnt.parent = m;
if (newEnt.container) m.container.appendChild(newEnt.container);
if (!m._isFrame && newEnt.showCaption) newEnt.showCaption(1);
if (!m.activeItem) m.setActiveItem(newEnt);
m.resize();
}
po.remove = function (itm) {
var m = this; m.tabctr.remove(itm);
if (itm.container) itm.container.parentNode.removeChild(itm.container);
}
po.replaceChild = function (newEnt, index) //置換指定的UI元件成另外一個
{
var m = this;
if (!newEnt) return;
var chn = this.children;
var oldEnt = index.name ? index : chn[index];
if (oldEnt) {
m.tabctr.replaceItem(newEnt, oldEnt);
if(newEnt.container && oldEnt.container) oldEnt.container.parentNode.replaceChild(newEnt.container, oldEnt.container);
if (oldEnt._recFormDg) { oldEnt._recFormDg.close(1); }
} else m.tabctr.add(newEnt);
newEnt.parent = m;
//if (m.tabctr) m.tabctr.createUIO();
if (!m._isFrame && newEnt.showCaption) newEnt.showCaption(1);
if (!m.activeItem) m.setActiveItem(newEnt);
m.resize();
return newEnt;
}
po.prcsTabDblClick = function(ldgr, itms, tabO){ //ondblclick
//alert(this.activeItem.text);
if(this.onTabDblclick) return this.onTabDblclick(ldgr, itms, tabO);
}
po.opExecute = function (cmd, param) {var a=this.activeItem;if(a && a.opExecute) return a.opExecute(cmd, param);}
opTabStrip._initialized = true;
}
var m = this;
m._isFrame = dspMode == "frame";
m._dspOptn = dspOptn;
m.init(sur);//m.cntr.className="tabStripContainer";
var o = m.cntr, o1 = o; //addE("<div class='tabStrip' />",o);
var chrn = new OpItems();
var chiTab = teCreateOpItems(o, new OpItems(), m);
if (chiTab) { for (var i = 0; i < chiTab.length; i++) { if (!m._isFrame && chiTab[i].showCaption) chiTab[i].showCaption(1); chrn.add(chiTab[i]); } }
m._itms = chrn;
m.children = chrn;
var t = new teTabsCtrl(o1, chrn, null, m); o1 = t.uio;
var bgch = getAtr(o, "bgch"); if (bgch) { o1.style.backgroundColor = bgch; o1.style.width="100%";}
m.tabctr = t;//o.children[0].style.clear="both";
t.ondblclick = function(ldgr, itms, tabO){m.prcsTabDblClick.call(m, ldgr, itms, tabO);};
if(!o.style.backgroundColor) o.style.backgroundColor = "white";
o.style.position = "relative";//讓children排列成absolute時可正確
m.tabCtnr = o1;if(!m._isFrame) t.switchSplitMode(- 2);
o.insertBefore(o1,o.children[0]);
m._dspMode = dspMode;
if (m._isFrame) {
hideIt(o1);
var lyScales = getAtr(m.cntr, "lyoscales");
if (!lyScales) lyScales = "{mode:\"V\", ver:1.0, gap:3,scales:[{rt:1}]}"; // 不可調比率
if (!hasBit(dspOptn, GJT.DSO.AllowLayoutCtrl)) {
//移除最後一個又大括弧
var ix = lyScales.lastIndexOf("}");
lyScales = lyScales.substring(0, ix);
lyScales += ",\"options\":14";
lyScales += "}";
}
var lyo = new layoutDispatcher(lyScales, m.cntr, chrn, getAtr(m.cntr, "lyoscalesUsr"));
m._lyoctrl = lyo;
}
//initial的時候不要setActiveItem,因為所有會有很多個物件initial
//if (chrn.length) { t.setActiveItem(chiTab[0]); }
}//end opTabStrip
opTabStrip.prototype = new opComponent();

function opTreeView(sur, symSize, iconSize) {
var m = this;
m.iconSize = iconSize == null ? 22 : iconSize;
m.symSize = symSize == null ? 22 : symSize;
this.aftAddNode = null; //handle for new node created
this.bfrRefreshChildren = null; this.onRefreshChildren = null; this.aftRefreshChildren = null;
this.aftNodeSelected = null;
m.specialTools = new OpItems();
if (typeof opTreeView._initialized == "undefined") {
var po = opTreeView.prototype;
po.init = function (sur) {
var m = this, s = sur, o = s, flds = new OpItems(), fldsR = new OpItems();
if (!o.tagName) o = addChi(BDY(), "div"); //is not tag
flds.addByString(m.gd(s, "afds"));
fldsR.addByString(m.gd(s, "afdsR"));
m.fieldsAllO = flds;
m.fieldsAllR = fldsR;
m.fieldsAll = (new OpItems()).concat(flds).concat(fldsR);
m.fieldsInSchmO =(new OpItems()).addByString(m.gd(s, "allfdso"));
m.ignoreRepeat = (m.gd(s, "igrt") == "Y");
m.operOptions = parseInt(m.gd(s, "operOptn"),10);
var dlm = m.gd(s, "dlmf");
m.dlmrL = dlm; m.dlmrR = "";
m.dmlrRvs(dlm, ["()", "[]", "{}", "（）", "［］", "｛｝"]);
m.id = m.gd(s, "id"); m.name = m.gd(s, "name"); m.text = m.gd(s, "text");
OpItem.call(m, m.gd(s, "name"), m.gd(s, "text"), "", 0, 0, parseInt(m.gd(s, KW.ProgramPrivilege), 10), 0);
m.cntr = o;
m.container = o;
m.style = o.style;
o.className = "TreeView";
m.createTree(s, o);
PROG.children.add(m);
if (m.id) PROG.children[m.id] = m;
m.parent = PROG;
var evh = m.evtHandle, rf = m, er = function () { evh.call(rf); };
setEvtHandleAll(o, er);
o.oncontextmenu = function () { if (!event.ctrlKey) { m.showToolsInPlace(); return false; } };
}
po.dmlrRvs = function (dlm, qa) {
var m = this;
for (var i = 0; i < qa.length; i++) {
var idx = dlm.indexOf(qa[i]);
if (idx < 0) continue;
m.dlmrL = dlm.substring(0, idx + 1);
m.dlmrR = dlm.substring(idx + 1);
break;
}
if (dlm.length > 2) { var idx = dlm.indexOf("*"); if (idx > 0) { m.dlmrL = dlm.substring(0, idx); m.dlmrR = dlm.substring(idx + 1); }; }
}
po._createTreeDo = function (jd, c, forRela, reverse) {
if (!jd) return;
var m = this, cn = m.cntr, rv = reverse, ir = forRela;
if (!jd) return;
var a = jd.split(KW.Dlm0), diOT, diRT, par = c, isTop = (c == cn);
var ixOT = m.gda(cn, "idxObjType"), ixRT = m.gda(cn, "idxRelaType"), ixN = m.gda(cn, "idxNode"), ixR = m.gda(cn, "idxRela"), ixRTF = m.gda(cn, "idxRelaTxF"), ixRTT = m.gda(cn, "idxRelaTxT");
var ixTip = m.gda(cn, "idxTip"), ixRTipF = m.gda(cn, "idxRelaTipF"), ixRelaTipT = m.gda(cn, "idxRelaTipT");
var doCa = (ixOT && cn == c), doRCa = (ir && m.hasF(ixRT) && (!doCa || (isTop && c.children.length == 0)));
if (doCa) diOT = {}; if (doRCa) diRT = {};
for (var i = 0; i < a.length; i++) {
var b = a[i].split(KW.Dlm1);
var n = m.newNode(), txt, tip;
n._data = b; if (ir) { n.r4 = ir; n.rv = rv; }
if (ir) { txt = m.gatt((rv ? ixRTF : ixRTT), b); tip = m.gatt((rv ? ixRTipF : ixRelaTipT), b); }
else { txt = m.gatt(ixN, b); tip = m.gatt(ixTip, b); }
m.setNodeText(n, txt, tip);
if (doCa) {
txt = m.gatt(ixOT, b);
var ca = diOT[txt];
if (!ca) {
ca = m.newNodeA(c); diOT[txt] = ca;
m.setNodeText(ca, txt);
ca.style.marginLeft = toPx(0);
ca.vc = 0; ca.className = "tvNodeFolded"; ca.expanded = 1;
}
ca.appendChild(n);
hideIt(n);
} else if (doRCa) {
//m.satt(n, ixRT, b, "rt");
txt = m.gatt(ixRT, b);
var ca = diRT[txt];
if (!ca) {
ca = m.newNodeA(c); diRT[txt] = ca; m.setNodeText(ca, txt);
m.setNodeClass(ca, rv ? "txtRelaR" : "txtRela"); ca.vc = 0; ca.className = "tvNodeFolded"; ca.expanded = 1;
} //ca.rt = txt;
ca.appendChild(n); hideIt(n);
} else {
c.appendChild(n);
if (isTop) n.style.marginLeft = toPx(0);
}
}
if (!isTop) {
c.expanded = 1;
c.className = "tvNodeUnfolded";
}
}
po.createTree = function (sur, container) {
if (!sur) return;
var m = this, cn = m.cntr, c = container; if (!c) c = cn; else c.vc = 1;
while (c.children.length > 1) {
c.removeChild(c.children[1]);
}
m._createTreeDo(m.gd(sur, "dataO"), c, 0);
m._createTreeDo(m.gd(sur, "dataOT"), c, 0, 1);
m._createTreeDo(m.gd(sur, "dataR"), c, 1, 0);
m._createTreeDo(m.gd(sur, "dataRT"), c, 1, 1);
if (sur.tagName) {
rmvAtr(sur, "dataO");
rmvAtr(sur, "dataOT");
rmvAtr(sur, "dataR");
rmvAtr(sur, "dataRT");
}
if (c == cn) return;
c.expanded = 1;
if (c.children.length < 2) {
c.className = "tvNodeNoChildren";
}
}
po.gFocus = function () {
var p = this.parent;
if (p && p.opEvent) return p.opEvent(this, EVI.Focus);
}
po.queryTools = function (cmdTypeCode, itms) {
var m = this, c = CMDE, ct = cmdTypeCode, pvg = m.programPrivilege, P = PPVG, n = GJT.TreeViewOperOptionsEnum,
opo = m.operOptions;
if (!itms) itms = new OpItems();
if (ct == c.mnuView) {
} else if (ct == c.mnuEdit) {
if ((opo & n.AllowEditNodeProperty) == n.AllowEditNodeProperty) sysCmdAdd(itms, [c.BeginEdit]);
if ((opo & n.AllowMoveNode) == n.AllowMoveNode) sysCmdAdd(itms, [c.MoveUp, c.MoveDown]);
//如果沒有parentId field就不支援
if (m.gd(m.cntr,"idxParentId") && (opo & n.AllowChangeParent) == n.AllowChangeParent) sysCmdAdd(itms, [c.Upgrade, c.Downgrade]);
sysCmdAdd(itms, [c.SelectAll]);
} else if (ct == c.SpecialTool) {
if (m.specialTools.length) { itms.concat(m.specialTools); itms.add(mnuHLine()); }
m.queryTools("cmnt", itms);
} else if (ct == c.ContextTool) {
m.queryTools("cmnt", itms);
itms.add(mnuHLine());
m.queryTools(c.mnuEdit, itms);
}
else if (ct == "cmnt") {
sysCmdAdd(itms, [c.Refresh, c.RefreshAll]);
if (m.relaF && m.relaF.length > 1) sysCmdAdd(itms, [c.ExpandAll]);
if (m.relaF) sysCmdAdd(itms, [c.expandQry, c.expandQryWithChildren, c.expandQryOnlyChildren]);
if (m.relaT) sysCmdAdd(itms, [c.expandQryRv]);
if (hasBit(pvg, PPVG.AdminUser)) sysCmdAdd(itms, [c.Developer]);
}
return itms;
}
po.showToolsInPlace = function () {
var m = this, p = m.parent;
if (p && p.opEvent && BWRT.FIREFOX != GJT.browserType) return p.opEvent(m, EVI.NotifyExecute, [CMDE.ContextTool, 0]);
else return m.opExecute(CMDE.ContextTool);
}
po.opExecute = function (cmd, param) {
var c = CMDE, m = this;
if (cmd == c.SelectAll) return selectElementContents(m.cntr);
if (cmd == c.Developer) return tePersonalizing(m, 1);
if (cmd == c.ContextTool) {
var ts = m.queryTools(CMDE.ContextTool, null);
if (ts) ts.executer = m;
SysShowMenu(ts);
}
else if (cmd == c.Close) {
var chrn = m.parent.children;
chrn.remove(m.name);
killIt(m.cntr);
}
else if (cmd == c.Refresh) return m.refreshChildren();
else if (cmd == c.RefreshAll) return m.refreshAll();
else if (cmd == c.ExpandAll) return teExpandQry(m, 0, 0, 1);
else if (cmd == c.expandQry) return teExpandQry(m, 0);
else if (cmd == c.expandQryRv) return teExpandQry(m, 1);
else if (cmd == c.expandQryWithChildren) return teExpandQry(m, 0, 1);
else if (cmd == c.expandQryOnlyChildren) return teExpandQry(m, 0, 2);
else if (cmd == c.MoveUp) return m.moveNode(-1);
else if (cmd == c.MoveDown) return m.moveNode(1);
}
po.gd = function (sur, nm) {
if (sur[nm]) return sur[nm]; else return getAtr(sur, nm);
}
po.gda = function (sur, nm) {
var d = this.gd(sur, nm); if (!d) return;
var da = d.split(",");
for (var i = 0; i < da.length; i++) {
da[i] = parseInt(da[i], 10);
}
return da;
}
po.satt = function (n, idx, b, AtrNm) {
if (!this.hasF(idx)) return;
x = b[idx[0]];
for (var j = 1; j < idx.length; j++) { x += KW.Dlm1 + b[idx[j]]; }
setAtr(n, AtrNm, x);
return 1;
}
po.gatt = function (idx, b) {
if (!this.hasF(idx)) return;
var m = this, x = b[idx[0]];
if (m.ignoreRepeat) {
for (var j = 1; j < idx.length; j++) {
var x2 = b[idx[j]];
if (x2 == b[idx[j - 1]] || (x2 == "" && m.dlmrR)) continue;
x += m.dlmrL + x2 + m.dlmrR;
}
} else { for (var j = 1; j < idx.length; j++) { x += m.dlmrL + b[idx[j]] + m.dlmrR; } }
return x;
}
po.getChildNodes = function (nd, res) {
var m = this;
nd = m.getNode(nd);
res = collEmHasAtr(nd, "ndty", "txt", res);
return res;
}
po.getFieldValues = function (fldName, tarTRs) {//multi rows
var m = this, res = [], fldsA;
if (!tarTRs) tarTRs = [m.actNd];
if (!tarTRs) return;
if (!(tarTRs instanceof Array)) tarTRs = [tarTRs];
for (var i = 0; i < tarTRs.length; i++) {
var n = m.getNode(tarTRs[i]), ir = n.r4, b = n._data;
if (ir) fldsA = m.fieldsAllR; else fldsA = m.fieldsAllO;
for (var j = 0; j < fldsA.length; j++) {
if (fldsA[j].id == fldName || fldsA[j].name == fldName || fldsA[j].fieldName == fldName) {
res.push(b[j]); break;
}
}
}
return res;
}
po.getFieldsValues = function (fldNames, tarNodes, fieldDelimiter, bSeparateField, getReal, nodeMode) {//arguments must same as GridEdit
var m = this, res = [], flds, fl, fldsA, cmb = fieldDelimiter != null, tnds = tarNodes, ndm = nodeMode;
if (!tnds) {
tnds = [m.actNd];
if (ndm) tnds = m.getChildNodes(m.actNd);
if (ndm == 2) tnds.shift();
}
if (typeof fldNames == "string") flds = fldNames.split(","); else flds = fldNames;
fl = flds.length;
for (var i = 0; i < fl; i++) {
var v = m.getFieldValues(flds[i], tnds);
if (!v) return;
res.push(v);
}
if (cmb || !bSeparateField) {
var resN = [], l2 = res[0].length;
for (var j = 0; j < l2; j++) {
var v = [];
for (var i = 0; i < fl; i++) { v.push(res[i][j]); }
if (cmb) resN.push(v.join(fieldDelimiter)); else resN.push(v);
}
return resN;
}
return res;
}
po.getNodeVal = function (n, idx) {
var b = n._data, x = [];
if (!b || !this.hasF(idx)) return;
for (var j = 0; j < idx.length; j++) { x.push(b[idx[j]]); }
return x;
}
po.hasF = function (idx) {
if (!idx) return;
for (var j = 0; j < idx.length; j++) { if (idx[j] < 0) return 0; }
return 1;
}
po.addIdFilter = function (n, filters) {
var m = this, ir = n.r4, rv = n.rv, a = ["idxObjId", "idxParentId"], fldsA = m.fieldsAllO; //, "idxRelaId", "idxFromId", "idxToId"
if (ir) { a = ["idxFromId", "idxToId"]; fldsA = m.fieldsAllR; }
for (var h = 0; h < a.length; h++) {
var idx = m.gda(m.cntr, a[h]), v = m.getNodeVal(n, idx);
if (!v) return;
for (var i = 0; i < v.length; i++) {
var itm = fldsA[idx[i]];
if (!itm) continue;
var f = new OpItemFilter(itm, v, GJT.compareModeEnum.Equal, v[i]);
filters.add(f);
}
}
}
po.refreshChildren = function (n) {
var m = this, o = m.cntr; if (!n) n = m.actNd;
n = m.getNode(n); if (!n) return;
var crin = new OpQueryCriterion();
m.addIdFilter(n, crin.filters);
if (crin.filters.length > 0) m.tvQuery(crin, n, 1, 1);
}
po.refreshAll = function () {
var m = this, c = m.cntr;
var txt = teQueryByAjax(null, ["Action", "TableID"], ["genDataTbl", m.id], null, 0, null, null, 1);
var oRes = newEm("DIV"); oRes.innerHTML = txt;
while (c.children.length > 0) {
c.removeChild(c.children[0]);
}
m.createTree(oRes.children[0], c);
}
po.tvQuery = function (criterion, parNode, byUser, forExpand) {
var m = this, cn = criterion, pn = m.getNode(parNode);
if (!cn) return;
if (cn.filters.items.length == 0) return alert(i18nm.QryItmCanNotBeNull.text);
var aryP, aryV, flt = cn.filters, qtx = [];
for (var i = 0; i < flt.length; i++) {
var q = flt.item(i);
qtx.push([q.name, KW.Dlm2, q.value1, KW.Dlm2, q.dataType, KW.Dlm2, q.opConfig, KW.Dlm2, q.ComparisonMode, KW.Dlm2, q.value2].join(""));
}
aryP = [KW.QueryItems + m.id, "TableID", KW.PrmResponseContentType];
aryV = [qtx.join(KW.Dlm1), m.id, "application/json"];
if (forExpand) { aryP.push("expand"); aryV.push("Y") }
if (pn.r4) { aryP.push("isRelaNode"); aryV.push("Y") }
if (pn.rv) { aryP.push("isReverse"); aryV.push("Y") }
var tId = m.id;
return tvQueryByAjax(m, aryP, aryV, m.qryURL ? m.qryURL : msAjaxPageName, pn, byUser);
}
po.moveNode = function (steps) {
var m = this, nd = m.actNd; if (!nd) return alert("No node selected!");
var n = m.getNode(nd);
}
po.newNode = function () {
var m = this, n = newEm("div"), st = n.style;
setAtr(n, "class", "tvNode"); setAtr(n, "ndty", "tvNode");
st.paddingLeft = toPx(this.symSize + 1);
st.backgroundSize = toPx(this.symSize) + " " + toPx(this.symSize);
var s2 = addChi(n, "div"), st2 = s2.style;
s2.className = "txt"; setAtr(s2, "ndty", "txt");
st2.paddingLeft = toPx(m.iconSize + 2);
if (m.iconSize > 0) {
st2.minHeight = toPx(m.iconSize);
st2.backgroundSize = toPx(this.iconSize) + " " + toPx(this.iconSize);
} else st2.backgroundImage = "url()";
if (m.aftAddNode) m.aftAddNode(n, m);
return n;
}
po.newNodeA = function (par) {
return apdC(par, this.newNode());
}
po.setNodeText = function (n, txt, tip) {
n.children[0].innerText = txt;
if (tip) n.children[0].title = tip;
}
po.setNodeClass = function (n, clss) {
n.children[0].className = clss;
}
po.setAct = function (nd) {
var m = this, oriNd = m.actNd;
if (oriNd && oriNd != nd) restoreColor(oriNd);
m.actNd = nd;
if (nd) setColor(nd, "highlighttext", "HIGHLIGHT");
if (m.aftNodeSelected) m.aftNodeSelected(nd);
if (oriNd != nd && nd) m.expand4ChgRow();
}
po.getNode = function (n) {
while (n && getAtr(n, "ndty") != "tvNode") {
n = n.parentNode;
}
return n;
}
po.expand4ChgRow = function () {
var rs = this.syncRs; if (!rs) return; //teExpandQry(ge, rvs) teExpandQryDo(itms[0],rvs);
for (var i = 0; i < rs.length; i++) {
teExpandQryDo(rs[i]);
}
}
po.expand4DblClk = function () {
var rs = this.dblckcRs; if (!rs) return; //teExpandQry(ge, rvs) teExpandQryDo(itms[0],rvs);
for (var i = 0; i < rs.length; i++) {
teExpandQryDo(rs[i], 0,0, 0, 1);
}
return 1;
}
po.evtHandle = function () {
var m = this, ev = GJT.event(), s = GJT.eventSrc(), ty = ev.type;
GJT.stopBubble();
if (ty == "click") {
if (getAtr(s, "ndty") == "tvNode") {
var x = ev.clientX, y = ev.clientY, c = s.getBoundingClientRect();
x = x - c.left; y = y - c.top;
if (x < m.symSize && y < m.symSize) {
if (s.expanded) m.swChiNodeVis(s);
else m.refreshChildren(s);
}
}
else if (getAtr(s, "ndty") == "txt") {
m.setAct(s);
var x = ev.clientX, y = ev.clientY, c = s.getBoundingClientRect();
x = x - c.left; y = y - c.top;
if (x < m.iconSize && y < m.iconSize) m.refreshChildren();
}
m.gFocus();
} else if (ty == "mousedown") {
tegMenuHide();
}
}
po.swChiNodeVis = function (nd, vi) {
if (vi == null) {
nd.vc = !nd.vc;
vi = nd.vc;
}
var cn = nd.children, nl = cn.length;
if (nl < 2) return;
if (vi) { vi = ""; nd.className = "tvNodeUnfolded"; } else { vi = "none"; nd.className = "tvNodeFolded"; }
for (var i = 1; i < nl; i++) {
cn[i].style.display = vi;
}

}
po.moveTo = function (l, t, w, h) {
cmnMoveObjTo(this.cntr, l, t, w, h);
}
opTreeView._initialized = true;
}
this.init(sur);
} //End TreeView

function opGrid(name, caption, oTbl, isTemp, parent) {
var m = this; m.grid = oTbl; m.name = name; m.caption = caption;
if (!parent) parent = PROG;
if (typeof opGrid._initialized == "undefined") {
var po = opGrid.prototype;
po.getFieldsValues = function (fldNames, tarTRs, fieldDelimiter, bSeparateField, getRealV, useNullIfMiss) {
var m = this,res=[], flds, fl, cmb = fieldDelimiter != null;
if (!tarTRs || tarTRs == -1) tarTRs = m.getAllDataTRs();
if (typeof fldNames == "string") flds = fldNames.split(","); else flds = fldNames;
fl = flds.length;
for (var i = 0; i < fl; i++) {
var v;// = m.getFieldValues(flds[i], tarTRs, getRealV);
if (m._getSTTL && m.pvtData) v = m.pvtData.getFieldValuesSTTL(m._lblName4STTL, flds[i], m._Field4STTL);
else v = m.getFieldValues(flds[i], tarTRs, getRealV);

if (!v && !useNullIfMiss) return;//欄位未顯示
res.push(v);
}
if (cmb || !bSeparateField) {
var resN = [], l2 = res[0].length;
for (var j = 0; j < l2; j++) {
var v = [];
if (useNullIfMiss) { for (var i = 0; i < fl; i++) { if (res[i]) v.push(res[i][j]); } } else { for (var i = 0; i < fl; i++) { v.push(res[i][j]); } }
if (cmb) resN.push(v.join(fieldDelimiter)); else resN.push(v);
}
return resN;
}
return res;
}
po.getFieldValues = function (fldName, tarTRs, getRealV) {
var m = this, gd = m.grid, itms = m.fieldsAll, ix = -1, itm;
if (m.pvtData) return m.pvtData.getFieldValues(fldName, tarTRs, getRealV);
for (var i = 0; i < itms.length; i++) {
if (itms[i].name == fldName) {itm = itms[i]; ix = i +m.colBeginData() ; break; }
}
if (ix < 0) return;
if (!tarTRs || tarTRs == -1) tarTRs = m.getAllDataTRs();
var av = [], isNum=itm.isNumber();
for (var i = 0; i < tarTRs.length; i++) {
var v = teTdGetValue(tarTRs[i].cells[ix]);
if (v != "" && isNum) v = Number(v);
av.push(v);
}
return av;
}

po.getAllDataRows = function () { return this.getAllDataTRs(); }
po.getAllDataTRs = function () {
var res = [], g = this.grid, rws = g.rows, rl = rws.length;
for (var i = this.rowBeginData() ; i < rl; i++) { res.push(rws[i]); }
return res;
}
po.getSelectedTRs = function () {
//opGrid沒有GUI選取功能,只能使用browser標準的select 來判斷
var res = this.getAllDataTRs();//先回傳全部
return res;
}
po.rowBeginData = function () { return parseInt(getAtr(this.grid, KW.FirstDataRow, 1), 10); }
po.colBeginData = function () { return parseInt(getAtr(this.grid, KW.FirstDataColumn, 0), 10); }
po._getGrdEvtHnd = function () {
var m = this;
if (!m._evgHnd) {
var evRef = m.evtGridArea;
m._evgHnd = function () { evRef.call(m); };
}
return m._evgHnd;
}
po.floatHeader = function (unfloat) {
var m = this, f = unfloat, s;
if (f == null) s = !m._ftb; else s = f;
var er = m._getGrdEvtHnd();
if (s) {
m._ftb = ftCopyHeadRow(m.grid, m._ftb, 0);
var t0 = m._ftb; if (!t0) return;
var t = t0.children[0];
ftSyncV(m.grid, m._ftb);
GJT.eventAddHandle(t, "click", er); GJT.eventAddHandle(t, "focus", er);
var p = t0.parentNode; //alert(p.tagName);
if (p.tagName == "BODY") { GJT.eventAddHandle(window, "scroll", er); GJT.eventAddHandle(window, "resize", er); }
else { GJT.eventAddHandle(p, "scroll", er); GJT.eventAddHandle(p, "resize", er); }
}
else if (m._ftb) { killIt(m._ftb); delete m._ftb; }
}
po.gFocus = function () {
var p = this.parent;
if (p && p.opEvent) return p.opEvent(this, EVI.Focus);
}

po.ReviseFTR0 = function () {
var m = this; if (!m._ftb) return;
if (m.iftr) window.clearTimeout(m.iftr);
m.iftr = window.setTimeout(function () { m.ReviseFTR(); }, 100);
}
po.ReviseFTR = function () {
ftSyncV(this.grid, this._ftb);
}
po.evtGridArea = function (ev) {
if (!ev) ev = GJT.event();
var su = GJT.eventSrc(ev), m = this, td = getTD(su), tdf; if (td && td.srtd) { tdf = td; td = td.srtd };
var ty = ev.type, tr = td ? td.parentNode : null, tbl = m.grid, st = tbl.style;
if (!GJT.isDraging) GJT.stopBubble();
if (ty == "click") {
m.gFocus();
if (m.btn4Close) showObjAt(m.btn4Close, tbl.offsetLeft, tbl.offsetTop - m.btn4Close.offsetHeight);
if (td && td.cellIndex == 0 && tr.rowIndex == 0) {
selectElementContents(m.grid);
} else if (su && su == m.btn4Close) { m.opExecute(CMDE.Close); }
}
else if (ty == "scroll" || ty == "resize") { m.ReviseFTR0(); }
}
po.queryTools = function (cmdTypeCode, itms) {
var m = this, c = CMDE, ct = cmdTypeCode;
if (!itms) itms = new OpItems();
if (m.bfrQueryTools && m.bfrQueryTools(m, cmdTypeCode, itms)) return;
if (ct == c.mnuFile) {
} else if (ct == c.mnuEdit) {
sysCmdAdd(itms, [c.SelectAll]);
} else if (ct == c.mnuView) {
sysCmdAdd(itms, [c.FloatHeader]);
} else if (ct == c.SpecialTool) {
} else if (ct == c.ContextTool) {
if (itms.length && m.specialTools.length) { itms.add(mnuHLine()); itms.concat(m.specialTools); }
}
if (m.aftQueryTools && m.aftQueryTools(m, cmdTypeCode, itms)) return;
return itms;
}
po.opExecute = function (cmd, param) {
var c = CMDE, m = this;
if (cmd == c.FloatHeader) return m.floatHeader();
if (cmd == c.SelectAll) return selectElementContents(m.grid);
if (cmd == c.ContextTool) {
var ts = m.queryTools(CMDE.ContextTool, null);
if (ts) ts.executer = m;
SysShowMenu(ts);
}
else if (cmd == c.Close) {
m.close();
}
}
po.close = function () {
var m = this;m.floatHeader(0);
var chrn = m.parent.children;
chrn.remove(m);
killIt(m.grid); killIt(m.btn4Close);
}
po.opEvent = function (Source, evtIndex, Param, vSources) {
if (evtIndex == EVI.UIEvent) {
this.evtGridArea(Param);
}
}
opGrid._initialized = true;
}
var er = m._getGrdEvtHnd();
oTbl.onclick = er;
if (isTemp) {
var oc = addE("<div class='btnClose'></div>", oTbl.offsetParent); oc.onclick = er; m.btn4Close = oc;
showObjAt(oc, oTbl.offsetLeft, oTbl.offsetTop - oc.offsetHeight);
}

oTbl.rows[0].cells[0].style.cursor = "pointer";
//oTbl.rows[0].cells[0].onclick = selWholeTbl;
parent.children.add(m);
this.parent = parent;
var flds = new OpItems();
var pvtSchm = getAtr(m.grid, "pvtSchm");
if (pvtSchm) {
pvtSchm = JSON.parse(pvtSchm);
var pvo=new PivotData(pvtSchm);
m.pvtData =pvo; //樞紐分析表的內容
flds = pvo.fieldsAll;
//pvo.getFieldValues(flds[0].name);
m.labels = pvo.labels;
m.labels4STTL = pvo.labels4STTL;
//m.getFieldValuesSTTL = function (p, t) { return pvo.getFieldValuesSTTL.call(pvo, p, t); };//(LblFldName, tarFldName)
m.getFieldsForSTTL = function (p,b) {return pvo.getFieldsForSTTL.call(pvo,p,b); };
} else {
flds.addByString(getAtr(m.grid, KW.VariableItems, ""));
}
m.fieldsAll = flds;
} //End opGrid
function VirtualTR() { //用於代替某些需要用到TR物件可是不得不帶空的

}//End VirtualTR
var _AnnxF = "_zxAnnx", _AnnxL = "_zxAnnxL", _AnnxI = "_zxAnnxI", _WFzxV = "_zxVerify", _WFzxSts = "_zxStatus"; //附件欄位 數量 檔名 圖片檔
function GridEdit(iniItem, toolbarMode, container, qryURL, displayMode) {
var t = this, n = null;
t.grid = n; t.toolbarMode = toolbarMode, t.gridContainer = n, t.container = container, t.parent = n;
t.handleBeforeQuery = n; t.handleBeforeSave = n; t.handleBeforeDelete = n;
t.handleQuery = n; t.handleSave = n; t.handleDelete = n; t.handleExportData = n;
t.handleAfterQuery = n; t.handleAfterSave = n; t.handleAfterDelete = n;
t.handleBeforeRemoveRows = n; t.handleAfterRemoveRows = n;
t.bfrEdit = n; t.bfrChangeValue = n; t.aftChangeValue = n; t.cellClick = n; t.cellDblClick = n;
t.bfrInsertRows = n; t.aftInsertRows = n; t.bfrChangeSelection = n; t.aftChangeSelection = n;
t.bfrMainRowChanged = n; t.aftMainRowChanged = n; t.aftRecordFormCreated = n; t.aftRecordFormShowValues = n;
t.bfrQueryTools = n; t.aftQueryTools = n, t.aftToolbarClick = n, t.aftStateChanged = n;
t.handleSelectValue = n;
t.bfrCopy = n; t.aftCopy = n;t.bfrArrangeColumns = n;t.aftArrangeColumns = n;
t.programPrivilege = 0;
t.enableSelect = true; //允許方塊式選取
t.wholeRowSelection = false; t._checkboxSel = false; //整列選取 & 使用checkbox物件選取
t.lockColumns = false; t.lockRows = false;
t.multiSelect = true;
t.parent = PROG;
t._color4NoNull = "#2244aa";
t.specialTools = new OpItems(); //t.specialTools.add(NIT("ttt","Special","Special Tools",null,"images/save.png"));
if (qryURL) t.qryURL = qryURL; else t.qryURL = n;
if (!displayMode) displayMode = DSM.GridEdit;
t.displayMode = displayMode;
t.ToolBar = n; t.StatusBar = n;
t._selection = new teRange();
//B GridEdit prototype
if (typeof GridEdit._initialized == "undefined") {

var po = GridEdit.prototype;
po.init = function (grid) {
var m = this, oriGrid = m.grid, gd = grid, myName = getAtr(gd, KW.ObjectName, ""), flds = new OpItems(), rws = gd.rows,
myCapt = getAtr(gd, KW.Caption, ""), oriPvg = 0, grdCntr = gd.parentNode, cntr = grdCntr.parentNode, pvg = m.programPrivilege, myTip = getAtr(gd, KW.Tip, ""),
valCri = getAtr(gd, KW.ValueCarriersInfo, "");
m._dspOptions = Number(getAtr(gd, "dspoptn", "0"));
m._evtOutter = function (ev) { m.evtOutter.call(m, ev); };
if (hasBit(m._dspOptions, GJT.DSO.AutoPlotChart)) startPlotly(1);
m.evt4ckx = function () { m.evtckx.call(m); };
if (!cntr || !cntr.tagName) {
if (m.container && m.container.tagName) cntr = m.container;
else cntr = newEm("DIV");
cntr.appendChild(grdCntr);
}
if (!myCapt) myCapt = "";
if (pvg != undefined) { oriPvg = pvg; }
pvg = parseIntD(getAtr(gd, KW.ProgramPrivilege, 0), 0) | oriPvg; m.programPrivilege = pvg;
flds.addByString(getAtr(gd, KW.VariableItems, ""));
var nfdn = flds.length == 0, rpc = parseInt(getAtr(gd, KW.DefinedReportsCount), 10), pqfc = parseInt(getAtr(gd, KW.PreDefinedFilterCount), 10);
OpItem.call(m, myName, myCapt, myTip, 0, 0, pvg, 0);
m.id = gd.id; m.canExport = !oriGrid && hasBit(pvg, PPVG.ExportData); m.hasReport = !isNaN(rpc); m.hasQuickQry = !isNaN(pqfc); m.hasRelatedtems = !isNaN(parseInt(getAtr(gd, KW.RelativeItemsCount), 10));
m.canQuery = hasBit(pvg, PPVG.Query);
if (!m.tarPage) m.tarPage = getTargetPage(gd);
if (!m.tableName) m.tableName = getAtr(gd, KW.TableName);
if (valCri) { try { m.valCarriers = JSON.parse(valCri); } catch (ex) { m.valCarriers = eval(valCri); } }
m.appId = getAtr(gd, "appId");
grdCntr.style.clear = "left";  grdCntr.className = "GridContainer";
if (rws.length > 0) {
var tr = rws[0], inp = EmsByTag(tr, "INPUT"), cs = tr.cells, h = cs.length, fd, td, xl, cols = getEM(gd, "COL");
for (var i = 0; i < h; i++) {
td = cs[i]; fd = td.opField; if (fd) continue;
fd = flds.item(td.id || getAtr(td,"name"));
if (!fd && nfdn) fd = new OpItem("~vf" + i, teTdGetValue(td), null, (i == 0 ? GDT.Integer : GDT.String), GIA.Virtual | GIA.SaveDenied | GIA.WriteDenied);
if (fd) {
td.opField = fd;
var fbc = td.style.backgroundColor; if (fbc) fd._backcolorH = fbc;
var fc = td.style.color;
if (hasBit(fd.opConfig, GIA.NoNull) && !hasBit(fd.opConfig, GIA.WriteDenied) && !fc) {
fc = m._color4NoNull; td.style.color = fc;
}
if (fc) fd._forecolorH = fc;
xl = parseInt(getAtr(td, KW.MaxLength), 10);
if (!isNaN(xl)) fd.maxLength = xl;
var col = cols[i]; if (!col) continue;
fbc = col.style.backgroundColor; if (fbc) fd._backcolor = fbc;
fc = col.style.color; if (fc) fd._forecolor = fc;

}
}
if (inp.length && (inp[0].type == "checkbox" || inp[0].type == "radio") && getTD(inp[0]).cellIndex < 3) {
m.wholeRowSelection = true; m._checkboxSel = true;
m.multiSelect = inp[0].type == "checkbox";
}
}
m.grid = gd;
m.hasSchemaFlds = getAtr(gd, KW.NoPredefinedFields) != "Y";
gd.GridEdit = m;
m.gridContainer = grdCntr;
setAtr(grdCntr, "lyoedb", "Y"); //LayoutEditable
m.container = cntr;
var cst = cntr.style, st = grdCntr.style; // st.overflow = "auto" //st.position = "relative";
var se = m._selection; //for float title bar
m.is4Pvt = getAtr(gd, "ispvtt") == "Y";
if (getAtr(gd, "nosbar") == "Y") m.toolbarMode = (m.toolbarMode | TBM.withStatusBar) ^ TBM.withStatusBar;
if (getAtr(gd, "notbar") == "Y") m.toolbarMode = m.toolbarMode | TBM.noButtonBar;

m.setHiLiColor(msClrHiLi, msBgClrHiLi);
se.boss = m;
m.fieldsAll = flds;
//tePutValCarrierMenu(null, m);
m.fieldsKey = flds.collect(null, GIA.IsKey);
m._ckxFlds();
m.CriterionAreaShow(true);
//m.ToolbarShow(m.toolbarMode);
var er = m._getGrdEvtHnd();
//FireFox & Operag使用這種動態設定事件處理物件時 在keydown keyup keypress 事件中event.type 是undefined
grdCntr.onscroll = er; //function () { m.ReviseFTR0(); };
gd.ondblclick = er; gd.onclick = er; gd.onselectstart = er; gd.onmouseover = er; gd.onmouseout = er;
gd.onmousemove = er; gd.onmousedown = er; gd.onmouseup = er; gd.ondragstart = er;
gd.onbeforepaste = er; gd.onpaste = er;
gd.oncontextmenu = function () { if (!event.ctrlKey && m.enableSelect) { if (!m.noMenu) { m.showToolsInPlace(); }; return false; } };
if (!m._undoCtrl) m._undoCtrl = new teUndoCtrl(m);
se.colBeginData = m.colBeginData(); se.rowBeginData = m.rowBeginData();
if (se.rowBeginData > 1 && gd) gd.rows[1].style.backgroundColor = "transparent";
if (m.is4Pvt) se.colBeginData = -1;
var inqId = "InqPrm" + gd.id, oa = [], parO = gd.parentNode;
var oprm = GJT.getChildById(parO, inqId), nnQ;
while (!oprm && parO) {
parO = parO.parentNode;
oprm = GJT.getChildById(parO, inqId);
}
if (oprm && !oriGrid) {//if never initialized
m.InqPrmO = oprm;
var fldsResu = new OpItems();
fldsResu.addByString(getAtr(oprm, KW.VariableItems, ""));
if (fldsResu.length > 0) { m.fieldsPreDef = fldsResu; }
var ap = oprm.getElementsByTagName("INPUT"), q1 = getEmByClass(oprm, "QryLaunch"), q2 = getEmByClass(oprm, "BatchQueryC"), o9 = oprm.children[0];
o9.onclick = shrinkParHgt; o9.style.cursor = "pointer";
for (var w = 0, k = ap.length; w < k; w++) {
var c = ap[w], mode = getAtr(c, "timeSel"), dty = getAtr(c, KW.opDataType);
if (dty == GDT.DateTime) { if (mode) addTimePicker(c, mode); oa.push(c); }
else if (ValueCanChoose(c)) oa.push(c);
//if (c.type == "checkbox" || c.type == "radio")
//{ var cs = c.style; cs.width = "20px"; }
else c.onpaste = teHotQryOnPaste;
if (c.type == "text") c.onchange = teHiLiNotNullTextBox;
}
for (var i = 0; i < oa.length; i++) {
var btn = oa[i].nextSibling;
if (btn && btn.tagName == "INPUT" && btn.type == "button") { }
else {
addValPickButton(oa[i]);
}
}
oprm.onclick = function () { m.geFocus(); };
oprm.oncontextmenu = function () { if (!event.ctrlKey && m.enableSelect && GJT.eventSrc() == oprm) { if (!m.noMenu) { m.showToolsInPlace(); }; return false; } };
nnQ = getAtr(q1, "isNoneQry") == "Y";
if (q1) q1.innerText = nnQ ? i18nm.execute.text : i18nm.tlQry.text;
if (nnQ) { m.canExport = 0; hideIt(q2); m.toolbarMode = m.toolbarMode | TBM.noButtonBar; m._isnnQ = 1; }
else if (q2) q2.innerText = i18nm.BatchQuery.text;
if (m.canExport) {
var x = addEm("<u class=\"ExportData\">" + i18nm.Export.text + "</u>", getEmByClass(oprm, "ExportData"), q1.parentNode);
x.onclick = function () { m.exportData() };
if (!m.canQuery) { hideIt(q1) };//可匯出不可查詢時 就將查詢按鈕隱藏
}
var q3 = getChiHasAtr(oprm, "pvtrowlbl");
while (q3) {
if (getAtr(q3, "pvtrowlbl")) {
q3.q1 = q1;
q3.onclick = function () { pvtUsrMenu(); }
q3.chrl = getAtr(q3, "chrl"); q3.chcl = getAtr(q3, "chcl");
if (!q1.pvtL) q1.pvtL = [];
q1.pvtL.push(q3); //keep Pointer
}
q3 = q3.nextSibling;
}
}
m.ToolbarShow(m.toolbarMode);
if (nnQ || getAtr(m.grid, KW.PageNo) == null) {
hideIt(getChiHasAtr(m.StatusBar, "z_pginfobk"));
}
//if (getAtr(gd, "useSGrid") == "Y") m.sngrid = new SunGrid(m);
//UI filter
var uiflval = getAtr(gd, "adoflts");
if (uiflval) { var adfo = addonFilterCreate(m.ToolBar, JSON.parse(uiflval)); adfo.className = "addOnFilter"; m.addonFltrO = adfo; }//產生UI
m._mkTxtAlign();
m.rvsRHcolor();
var oriOpst = m.opst, newOpst = getAtr(gd, "opsettxt");
if (!oriOpst && newOpst) m.setOps(dvXmlToOpSet(newOpst, 1));
tePutValCarrierMenu(null, m);
m._ckxRvs();
m.setColWidthByProfile();
m.queryDone();
m.tileModeAuto();
m.container.ondragover = function (ev) { m.evtSysDragOver.call(m,ev) };
m.container.ondrop = function (ev) { m.evtSysDrop.call(m, ev); }
FieldMultiFlagCtrlAdd(m);
m.hiliNotNullCriterionBox();
} //END po.init
po.close=function(){
//delete this.grid;
return;//刪除property 會有問題暫時不處理
var m=this, cntr = m.container,so = m._recForm, dg = m._recFormDg;
for (var prop in m) { if (m.hasOwnProperty(prop)) { delete m[prop]; } }
if(cntr && cntr.parentNode) cntr.parentNode.removeChild(cntr);
if(dg)dg.close(1);
delete m;
}
po._getGrdEvtHnd = function () {
var m = this;
if (!m._evgHnd) {
var evRef = m.evtGridArea;
m._evgHnd = function () { evRef.call(m); };
}
return m._evgHnd;
}
po.evtListenerAdd = function (evtType, eh, doRmv) {
var c = this._evtLstn; if (!c) { c = {}; this._evtLstn = c; }
if (evtType.indexOf(",") > 0) {
var v = evtType.split(",");
for (var i = 0; i < v.length; i++) { this.evtListenerAdd(v[i], eh, doRmv); }
return;
}
var cn = c[evtType];
if (doRmv) {
if (!cn) return;
for (var i = 0; i < cn.length; i++) {
if (cn[i] == eh) { cn.splice(i, 1); i--; }
}
return eh;
}
if (!cn) { cn = []; c[evtType] = cn; }
for (var i = 0; i < cn.length; i++) { if (cn[i] == eh) return eh;}//避免重複登記造成多次觸發相同目標
cn.push(eh); return eh;
}
po.evtListenerRemove = function (evtType, eh) {return this.evtListenerAdd(evtType, eh, true);}
po.evtBroadcast = function (evtType, prm) {
var c = this._evtLstn; if (!c) return;
var cn = c[evtType]; if (!cn) return;
for (var i = 0; i < cn.length; i++) {
var r = cn[i](evtType, prm); //call
if (r) return r;
}
}
po.floatHeader = function (unfloat) {
var m = this, f = unfloat, s;
if (f == null) s = !m._ftb; else s = f;
var er = m._getGrdEvtHnd();
if (s) {
var se = m._selection; se.setColor(1);
m._ftb = ftCopyHeadRow(m.grid, m._ftb, 1, m.container);
se.setColor(0);
var t0 = m._ftb; if (!t0) return;
var t = t0.children[0];
t.onselectstart = er; t.onmousemove = er; t.onmousedown = er; t.onmouseup = er;
t.oncontextmenu = function () { if (!event.ctrlKey && m.enableSelect) { if (!m.noMenu) { m.showToolsInPlace(); }; return false; } };
ftSyncV(m.grid, m._ftb);
var p = t0.parentNode; //alert(p.tagName);
GJT.eventAddHandle(window, "scroll", er); GJT.eventAddHandle(window, "resize", er);
if (p.tagName == "BODY") { }
else { GJT.eventAddHandle(p, "scroll", er); GJT.eventAddHandle(p, "resize", er); }
}
else if (m._ftb) { killIt(m._ftb); delete m._ftb; }
}
po.ReviseFTR0 = function () {
var m = this; if (!m._ftb) return;
if (m.iftr) window.clearTimeout(m.iftr);
//var cntr = this.gridContainer;
m.iftr = window.setTimeout(function () { m.ReviseFTR(); }, 50);
}
po.ReviseFTR = function () {
ftSyncV(this.grid, this._ftb);
}
po.addGridNeighbor = function (Neighbor, option) {//需要支援 上下左右四邊任選一, option 是一個選項物件
var m = this, gn = m.gridContainer, lyo = m._grdlyor, nv, cn = m.container, tbr = m.ToolBar, stsBar = m.StatusBar, nbr = Neighbor,opo=option; //, sidePos, arrangeDirection, occupyRate
var sp = opo ? opo.sidePos: "R", ad = opo ? opo.arrangeDirection : "";
var rt1 = 1, rt2 = opo ? opo.occupyRate : 1; if (!rt2) rt2 = 1;//房間大小比例
//var nolyo = opo ? opo.NoLayout : 0; //不使用排位器
//實際實作試驗,不使用排位器 的畫面不美觀,有粗製的感覺,決定捨棄 "不使用排位器"的構想,改成讓排位器可以有最小高度 最小寬度的特性,這樣子兼具畫面整齊與使用彈性
rt2 = Number(rt2);
if (nbr.tagName) nv = new opComponent(nbr);
else nv = nbr;
//if (nolyo) {
// var cv = nv.tagName ? nv : nv.container, gn1 = m.gridContainer, gn2 = m.gridContainer2, gn = gn2 ? gn2 : gn1, chn = cn.children;
// if (cv.parentElement == cn) return;//已經加入的不再動
// var h = rt2 *(GJT.getWindowHeight() - floatBarsHeight()) -2;
// if (!cv) return alert("Not a valid object for arrange!");
// if (nbr.embedInto) nbr.embedInto(cn);
// cv.style.height = toPx(h);
// if (sp == "T" || sp == "L") {//不使用排位器時,只能放表格上或下,無法放左右,因為是使用static 排列
// cn.insertBefore(cv,gn);
// } else {
// //如果cn的最後一個物件是statusbar 就插入到statusbar之前,否則就加入到最後面
// if (chn[chn.length - 1] == m.StatusBar) cn.insertBefore(cv, m.StatusBar);
// else cn.appendChild(cv);
// }
//} else
if (!lyo) {
var c2 = newEm("div"), gst = gn.style;
gst.overflow = "auto"; gst.overflowX = "auto"; gst.overflowY = "auto";
cn.replaceChild(c2, gn);
c2.appendChild(gn);
if (m._ftb) c2.appendChild(m._ftb);
var ggs = m.siblingGrids;
//改變浮動標題物件的父階
if (ggs) {
for (var i = 0; i < ggs.length; i++) { if (ggs[i]._ftb) { c2.appendChild(ggs[i]._ftb); } }// ggs[i].floatHeader(1);
}
if (nbr.embedInto) nbr.embedInto(c2);
else c2.appendChild(nbr);
m.gridContainer2 = c2;
//c2.style.width = "100%";
var cmp = new opComponent(gn), itmsN = new OpItems();
cmp.id = m.id; cmp.name = m.name; cmp.text = m.text;
//cmp.handleResized = function (s) { m.hndGridResized.call(m, s); };
itmsN.add(cmp);
if (!sp || sp == "R" || sp == "B") itmsN.add(nv);
else { itmsN.insert(nv, 0); var rt3 = rt1; rt1 = rt2; rt2 = rt3;}//需要交換比率才能得到正確的比率
//取得設計的layout
var map = LayoutSettingForUserPlot(m.id, "R");
if (map && hasBit(map.options,GJT.LayoutOperOptions.Disabled)) map = null;
if (!map || !map.scales) {//沒有設計畫面排列或停用
map = { mode: (!sp || sp == "L" || sp == "R" ? "H" : "V"), scales: [{ rt: rt1 }, { rt: rt2 }] };
}
var lyo = new layoutDispatcher(map, c2, itmsN);
m._grdlyor = lyo;
lyo.setMargin(0, 0, 0, 1);
setAtr(m.grid, "shwOwnScrlbr", "Y"); m.resizeMx();
//m.resizeMx();
} else if (!lyo.itemExist(nv, nv instanceof opComponent))
{
var c2 = m.gridContainer2;
if (nbr.embedInto) nbr.embedInto(c2);
else c2.appendChild(nbr);
//檢查是否有已預定的房間
var cu0 = lyo.getCustomerByName(nbr.name);
if (cu0) { lyo.replaceItm(nbr, cu0); var cnr = cu0.container; if (cnr) cnr.parentElement.removeChild(cnr); } //
else { lyo.insertItem(nbr, gn, sp, ad, rt2); }//由lyo統一控制排列才單純 lyo.resizeLYO();
}//防止加入相同的container的物件
else return;
}
po.resizeMx = function (noAdjgrdlyr) {
var m = this, g = m.grid, cn = m.container, p = cn.parentElement, gn1 = m.gridContainer, gn2 = m.gridContainer2, gn = gn2 ? gn2 : gn1, gst = gn.style, cnh = cn.children;
var h0, w0, cnst = GJT.getComputedStyle(cn), qro = m.getQryParamtersUIO(), gnpc = gn.parentElement.children;
if (!p) return;
if (qro && p !=document.body) p = p.parentElement;//參數查詢表多一層
var isB = p == document.body;
h0 = GJT.getWindowHeight() - floatBarsHeight() - 2;
//扣除和gn 同一層的其他物件的高度
//h0=h0-getActHgt(m.ToolBar, 1) - getActHgt(m.StatusBar, 1) - getActHgt(qro, 1);
for (var i = 0; i < gnpc.length; i++) {
if (gnpc[i] != gn) h0 = h0 - getActHgt(gnpc[i], 1);
}
if (!isB || getAtr(g, "shwOwnScrlbr") != "Y") {
return;
}
gst.clear = "left";
//gn2不應該有scrollbar
var ovf = gn != gn2 ? "auto" : "hidden";
setAtr(gn, "style", "height:" + toPx(h0) + ";overflow:"+ovf + ";overflow-y:"+ovf+";overflow-x:" + ovf + ";clear:both;position: relative;");
if (!noAdjgrdlyr && m._grdlyor) m._grdlyor.resizeLYO();
m.showAsFormAuto();
}
po.moveTo = function (l, t, w, h) {
l = parseInt(l); t = parseInt(t); w = parseInt(w); h = parseInt(h);
var m = this, cn = m.container, cnst = cn.style, h0;
if (w <= 0 || h <= 0) return;
cmnMoveObjTo(cn, l, t, w, h); if (w > 3 & h > 3) showIt(cn);//為了得到正確的getActHgt(m.ToolBar, 1)
m.resizeTo(w,h);
//var cnh = cn.children, gn2 = m.gridContainer2, gn = gn2 ? gn2 : m.gridContainer, gst = gn.style, h0;
//h0 = toCssHgt(cn, h) - 0;// - getActHgt(m.ToolBar, 1) - getActHgt(m.StatusBar, 1);
//for (var i = 0; i < cnh.length; i++) {
// if (cnh[i] != gn) h0 = h0 - getActHgt(cnh[i], 1);
//}
//if (m._grdlyor) {
//setActHgt(gn, h0);
//m._grdlyor.resizeLYO();
////window.setTimeout(function () { m._grdlyor.resizeLYO(); }, 300);
//} else {
//setActHgt(gn, h0);
//gst.width = "100%";
//gst.overflow = "auto"; gst.overflowX = "auto"; gst.overflowY = "auto";
//}
//m.ReviseFTR();
//m.showAsFormAuto();
}
po.resizeTo = function (w,h) {
var m = this, cn = m.container, cnst = cn.style;
if (w) cnst.width = w;
if (h) cnst.height = h;
var cnh = cn.children, gn2 = m.gridContainer2, gn = gn2 ? gn2 : m.gridContainer, gst = gn.style, h0;
h0 = toCssHgt(cn, h) - 0;// - getActHgt(m.ToolBar, 1) - getActHgt(m.StatusBar, 1);
for (var i = 0; i < cnh.length; i++) {
if (cnh[i] != gn) h0 = h0 - getActHgt(cnh[i], 1);
}
if (m._grdlyor) {
setActHgt(gn, h0);
m._grdlyor.resizeLYO();
//window.setTimeout(function () { m._grdlyor.resizeLYO(); }, 300);
} else {
setActHgt(gn, h0);
gst.width = "100%";
gst.overflow = "auto"; gst.overflowX = "auto"; gst.overflowY = "auto";
}
m.ReviseFTR();
m.showAsFormAuto();
}
po.showAsFormAuto = function () {
var m = this;
if (!hasBit(m._dspOptions, GJT.DSO.ShowAsForm)) return;
//顯示表單,並把表單嵌入
if (!m._recForm) {
m.showRecordForm(); m.addGridNeighbor(m._recFormDg);
}
}
po.setHiLiColor = function (c, bgc) { var se = this._selection; se.hiliColor = c; se.hiliBgColor = bgc; }
po.getGrid = function () { return this.grid; }
po._noQryBar = function () {
return (this.rowBeginData() < 2 || !this.hasSchemaFlds || !hasBit(this.programPrivilege, PPVG.Query));
}
po._lastQCT = function () {
var lasrQryItms = getAtr(this.grid, KW.QueryItemsLast, "");
if (lasrQryItms) return cmnSplit2(lasrQryItms, KW.Dlm1, KW.Dlm2);
}
po._cvtQryVal = function (vaQ, itmName) {
if (!vaQ) return "";
var qryV = "", e = GJT.compareModeEnum;
for (var j = 0; j < vaQ.length; j++) {
var vq = vaQ[j];
if (vq[0] == itmName) {
qryV = vq[1];
if (vq.length > 5) {
var cm = parseInt(vq[4]), v2 = vq[5];
if (hasBit(cm, e.Equal)) qryV = +"=";
if (hasBit(cm, e.Greater)) qryV = ">" + qryV;
else if (hasBit(cm, e.Smaller)) qryV = "<" + qryV;
else if (hasBit(cm, e.Between)) qryV += "~" + v2;
}
break;
}
}
return qryV;
}
po.CriterionAreaShow = function (visible, vaQ) {//控制查詢條件區的顯示隱藏
var rw = 1, grid = this.grid, fldsA = this.fieldsAll, evRef = this.evtCriterionArea, oTR = grid.rows[rw];
if (!vaQ) vaQ = this._lastQCT();
if (this._noQryBar()) { if (this.rowBeginData() > rw) hideIt(oTR); return; }
var geRef = this, er = function () { evRef.call(geRef); }; //set pointer to this
var hds = tbGetHeads(grid), tdF = oTR.cells[0];
if (visible) showIt(oTR); else return hideIt(oTR);
setEvtHandleAll(oTR, er);
oTR.className = "GridCriterionArea";
setAtr(oTR, "zz_criterion_row", "Y"); //used to mark
tdF.className = "QryButton"; tdF.onmousedown = function () { if (!teIsInResizeArea(tdF)) borderDown(); }; tdF.onmouseup = borderUp; tdF.innerText = " ";
for (var i = this.colBeginData(); i < hds.length; i++) {
var itm = fldsA.item(hds[i].id);
if (!itm) itm = fldsA.item(hds[i].name);
if (!itm) { }
else if (!hasBit(itm.opConfig, GIA.QueryDenied) && !hasBit(itm.opConfig, GIA.Virtual)) {
var qryV = this._cvtQryVal(vaQ, itm.name); // "";
if (oTR.cells[i].children.length == 0) oTR.cells[i].innerHTML = "<input type=text tarFld='" + itm.name + "' value='" + GJT.encodeAttr(qryV) + "' title='" + GJT.encodeAttr(i18nm.InputQryItemsHere.text) + "' onpaste='teHotQryOnPaste()' oncontextmenu='GJT.stopBubble()' />";
else oTR.cells[i].children[0].value = qryV;
var o = oTR.cells[i].children[0];
if (itm.choice) setAtr(o, KW.Choice, itm.choice);
if (itm.ctrlId) setAtr(o, KW.ControllerId, itm.ctrlId);
setAtr(o, KW.opDataType, itm.dataType);
o.onfocus = er;
o.onblur = er;
o.forQry = 1;
o.onchange = teHiLiNotNullTextBox;
o._surItm = itm;
}
}
}
po._isEditable = function () {
var af = this.fieldsAll, bf = af.collect("", GIA.WriteDenied);
return af.length != bf.length;
}
po._ckxFlds=function(){this._ckxc=this.fieldsAll.collect("", GIA.UseCheckboxAsUI);}
po._ckxRvs=function(trs){
var m=this,a=m._ckxc;if(!a || !a.length)return;
if(!trs)trs=m.getAllDataTRs();
for(var i=0;i<a.length;i++){
var itm=a[i],chc=itm.choice;
if(!chc)continue; else chc=parseChoiceA(chc,1);
var ix=m.getCellIndex(itm.name);if(ix<0)continue;
for(var r=0;r<trs.length;r++){
var td=trs[r].cells[ix],chn=td.children;
if(chn.length>0) continue;
var v = teTdGetValue(td);
setAtr(td, KW.PtyOrigValue, v);
m._ckxMkEm(itm,td,v,chn,chc);
}
}
}
po._ckxMkEm=function(itm,td,v,chn,chc){
if(!chc) {chc=itm.choice;if(!chc) return;chc=parseChoiceA(chc,1);}
if(!chn)chn=td.children;
if(!chn.length){td.innerHTML="<input type='checkbox' />";var co=td.children[0];co.valueY=chc[0][0];co.valueN=chc[1][0];co.onclick=this.evt4ckx;}else{var co=td.children[0];}
co.checked = chc[0][0] == v;setAtr(co,"vkKx",v);
co.disabled = itm.isWriteDenied() || (itm.isChangeDenied() && !this.isNewRow(getTR(td)));
}
po.evtckx=function(){
var m=this,co= GJT.eventSrc(),v,td=getTD(co),f=m.getField(td);
if (co.checked) v = co.valueY; else v = co.valueN;
m.pushUndo(m.CellsEditing);
m.tdSetValue(td,v,0,0,f);
}
po.ToolbarShow = function (toolbarMode) {
var m = this, grid = m.grid, n = i18nm, h = [], pvg = m.programPrivilege, t1 = "<span onmousedown='borderDown(this)' onmouseup='borderUp(this)' class='", t2 = "</span>", canQ = hasBit(pvg, PPVG.Query);
var tm = toolbarMode; if (tm == null) tm = m.toolbarMode;
var noText = !hasBit(tm, TBM.withText), noIcon = !hasBit(tm, TBM.withIcon), noButtonBar = hasBit(tm, TBM.noButtonBar),
noStatusBar = !hasBit(tm, TBM.withStatusBar), stsBarOnTop = hasBit(tm, TBM.statusBarOnTop);
m.toolbarMode = tm;
//if previousSibling is toolbar, no need create again
//grid must locate in double container,
var grdCtnr = grid.parentElement, grdCtnrG = m.container, td0 = grid.rows[0], cptn = getAtr(grid, KW.Caption, "");
var oBar = getChiHasAtr(grdCtnrG, "z_zk_xBar");
if (tm && !oBar) {
if (canQ && m.hasSchemaFlds) {
//h.push(t1, "QryClear' >", n.ClearCriterion.text, t2, t1, "SetOrderBy' >", n.SetOrderBy.text, t2)
//h.push(t1, "Query' sxyis4qry='Y' >", n.Query.text, t2);
}
//h.push(t1, "swtFixed' style='width:10px;'>", " ", t2);
if (PPVG.canInsertRow(pvg)) {
h.push(t1, "InsertRow' title='", GJT.encodeAttr(getTip(n.InsertRow)), "'>", GJT.encodeAttr(n.InsertRow.text), t2, t1, "AppendRow' title='", GJT.encodeAttr(getTip(n.AddRow)), "'>", GJT.encodeAttr(n.AddRow.text), t2);
} else if (hasBit(pvg, PPVG.InsertRowsAfter)) {//單獨指定只能加列
h.push(t1, "AppendRow' title='", GJT.encodeAttr(getTip(n.AddRow)), "'>", GJT.encodeAttr(n.AddRow.text), t2);
}
if (PPVG.canRemoveRow(pvg)) h.push(t1, "RemoveRow' title='", getTip(n.RemoveRow), "'>", n.RemoveRow.text, t2);
if (hasBit(pvg, PPVG.Save)) {
h.push(t1, "Save' >", n.Save.text, t2);
h.push(t1, "SaveWhole' title='", getTip(n.SaveWhole), "'>", n.SaveWhole.text, t2);
}
if (hasBit(pvg, PPVG.Sort)) {
if (m._checkboxSel) {
grid.rows[0].style.cursor ="alias";
}
else {
h.push(t1, "SortA' title='", n.SortA.text, "' >", t2, t1, "SortD' title='", n.SortD.text, "'>", t2);
}
}
h.push(t1, "SumCells' title='", "Sum Selected Cells", "' >", "", t2);
if (m.canExport && hasBit(pvg, PPVG.Query)) h.push(t1, "Export' >", n.Export.text, t2);
if (m.fieldsKey.length) h.push(t1, "ShwForm' title='", n.mnuShowRecordForm.text, "' >", t2);

if (hasBit(pvg, PPVG.Delete)) {h.push(t1, "DeleteData' title='", GJT.encodeAttr(getTip(n.DeleteData)), "'>", GJT.encodeAttr(n.DeleteData.text), t2);}
h.push(t1, "mnuOthers' title='", getTip(n.tlOthers), "'>", n.tlOthers.text, t2);
if (canQ && m.hasQuickQry) h.push(t1, "mnuQuickQry' title='", getTip(n.QuickQuery), "'>", n.QuickQuery.text, t2,t1,"QuickQryM' title='", getTip(n.QuickQuery), "...' style='min-width:9px;' >",t2);
if (m.hasRelatedtems) h.push(t1, "mnuShowRelated' title='", getTip(n.ShowRelatedItems), "'>", n.ShowRelatedItems.text, t2);
if (getAtr(m.grid, "supflow") == "Y") h.push(t1, "mnuShowFlowCtrl' title='", getTip(n.ShowFlowCtrl), "'>", n.ShowFlowCtrl.text, t2); // sysCmdAdd(itms, c.ShowFlowCtrl);
if (mIsMobileDev) {
if (m._isEditable()) h.push(t1, "BeginEdit' title='", getTip(n.tlEdit), "'>", n.tlEdit.text, t2);
}
if (getAtr(m.grid, "hidetools") == "Y") h=[""];
if (h.length > 0) {
grdCtnr.insertAdjacentHTML("beforebegin", "<div class='GridToolBar' z_zk_xBar='Y' >" + h.join("") + "</div>"); //set z_zk_xBar attr for檢查是否已有Toolbar <div class='Caption'>" + cptn + "</div>
var evRef1 = m.evtToolbar, geRef = m;
oBar = grdCtnr.previousSibling;
//if (td0) { var s = GJT.getComputedStyle(td0), c = s.color, bc = s.backgroundColor; oBar.style.backgroundColor=bc; }
var er = function () { evRef1.call(geRef); };
setEvtHandleAll(oBar, er);
}
}
if (oBar && oBar.children) {
var chrn = oBar.children;
for (var i = 0; i < chrn.length; i++) {
var chi = chrn[i];
if (!getAtr(chi, "oriTxt")) setAtr(chi, "oriTxt", teTdGetValue(chi));
if (!getAtr(chi, "oriTtitle")) setAtr(chi, "oriTtitle", chi.title);
if (!getAtr(chi, "oriIcon")) setAtr(chi, "oriIcon", GJT.getComputedStyle(chi).backgroundImage);
if (noText) {//remove all inner Text, set it into title
var st = GJT.getComputedStyle(chi); // alert(st.backgroundImage + " | " + chi.style.backgroundImage);
if (st.backgroundImage.length > 6) chi.innerText = ""; //set only has icon
chi.title = getAtr(chi, "oriTxt", "") + getAtr(chi, "oriTtitle", "");
} else { chi.innerText = getAtr(chi, "oriTxt", ""); chi.title = getAtr(chi, "oriTtitle", "") }
}
}
if (!noStatusBar) {
var oBar = getChiHasAtr(grdCtnrG, "z_zk_stsBar");
if (!oBar) {
h = []; h.push("<div class='GridStatusBar' z_zk_stsBar='Y' >");
if (m.hasSchemaFlds) h.push(dataPageInfTxt());
h.push("</div>");
if (stsBarOnTop) {
grdCtnr.insertAdjacentHTML("beforebegin", h.join(""));
oBar = grdCtnr.previousSibling;
}
else {
grdCtnr.insertAdjacentHTML("afterend", h.join(""));
oBar = grdCtnr.nextSibling;
}
var c = getChiHasAtr(oBar, "z_lkrhpgrows");
if (c) {
var evRef = m.evtResponseStatusbar, geRef = m, er = function () { evRef.call(geRef); };
setEvtHandleAll(oBar, er); dataPageInfShw(grid, oBar);
addValPickButton(c);
}
}
}
var oBar = getChiHasAtr(grdCtnrG, "z_zk_xBar"); if (oBar) { oBar.style.display = (tm == 0 || noButtonBar) ? "none" : ""; m.ToolBar = oBar; }
oBar = getChiHasAtr(grdCtnrG, "z_zk_stsBar");
if (oBar) {
oBar.style.display = (noStatusBar ? "none" : ""); m.StatusBar = oBar; if (stsBarOnTop) { oBar.style.marginBottom = '1px'; };
if (m.ToolBar && 0) hideIt(oBar);
if (hasBit(m._dspOptions, GJT.DSO.PutStatusBarInToolBar)) {
m.ToolBar.appendChild(oBar);
}
}

m.showCaptionInTbr();
if (getAtr(m.grid, "shwflowctrl")) {
m.sel();
teShowFlowCtrl(m);
m.setActive();
}
if (getAtr(m.grid, "shwRevReqF")) {
m.sel();
m.ChangeRequest();
}
}
po.showCaptionInTbr = function (oldTxt) {
var m = this, o = m.ToolBar; if (!o) return;
var txt = m.text, nd, nds = o.childNodes; // o.childNodes;
for (var i = 0; i < nds.length; i++) {
var c = nds[i];
if (c.nodeValue == txt || (oldTxt && c.nodeValue == oldTxt)) { nd = c; break; }
if (c.tagName == "FONT" && (c.innerText == txt || (oldTxt && c.innerText == oldTxt))) { nd = c; break; }; // continue;
if (c.tagName == "FONT" && c.childNodes &&(c.childNodes[0].nodeValue == txt || (oldTxt && c.childNodes[0].nodeValue == oldTxt))) {
nd = c; break;
}; // continue;
}
if (!txt) return;
if (!nd) {
nd = newEm("FONT"); // document.createTextNode(txt);
nd.style.float = "left";
nd.className = "GridLabel";
if (m.grid.rows[0]) nd.style.backgroundColor = m.grid.rows[0].style.backgroundColor;
nd.appendChild(document.createTextNode(""));
m.gridLabel = nd;
nd.oncontextmenu = function () { if (!event.ctrlKey) { m.showToolsInPlace(); return false; } };
}
nd.title = m.tip;
nd.childNodes[0].nodeValue = txt;
o.insertBefore(nd, o.childNodes[0]);
}
po.showCaption = function (hide) { showItA(getEmByClass(this.ToolBar, "GridLabel"), !hide); showItA(getEmByClass(this.ToolBar, "swtFixed"), !hide) }
po.getOriginalValue = function (oTR, fieldName, _headTDs, getRealV) {
var m = this, gd = m.grid, hds = _headTDs, hd, fn = m.fieldNameA(fieldName), v;
if (!hds) hds = tbGetHeads(gd);
hd = hds[fn];
if (hd == null) {
if (hasAtr(oTR, teAtrFldNm4OrigVal(fn))) v = getAtr(oTR, teAtrFldNm4OrigVal(fn)); else v = getAtr(oTR, teAtrFldNm(fn));
} else {
var atNm = KW.PtyOrigValue, oTD = oTR.cells[hd.cellIndex]; if (!oTD) return;
if (hasAtr(oTD, atNm)) v = getAtr(oTD, atNm); else v = teTdGetValue(oTD);
}
if (getRealV) {
var itm = m.fieldsAll[fieldName]; if (!itm) itm = m.fieldsAll.item(fieldName);
v = teMapVal(itm.valuesMapRvs, v);
}
return v;
}
po.getEditCriterion = function (oaTR, _forDelete, _MsgShow) {
var m = this, se = m._selection, oTbl = m.grid, fa = m.fieldsAll, res = [], fl = fa.length, trMap = {},
fk = fa.collect("", GIA.IsKey), fr = fa.collect("", GIA.Required), fshw = m.getFields(), hds = tbGetHeads(oTbl);
if (!fk || fk.length == 0) return _MsgShow ? alertA(i18nm.NoKeyFlds.text + "\n" + _MsgShow) : null;
if (!oaTR) oaTR = se.getDataTRs();
if (!oaTR || oaTR.length == 0 || getTable(oaTR[0]) != oTbl) return (_MsgShow ? alert("Invalid TR!") : null);
for (var i = 0; i < oaTR.length; i++) {
var tr = oaTR[i], edl = tr._editLog;
if ((!edl || edl.length == 0) && !_forDelete) continue;
if (_forDelete && m.isNewRow(tr)) continue;
var resROW = {}, flt = new OpItems(), rqrItms = new OpItems(), dataItms = new OpItems();
mintRecordIdCnt++; resROW.id = "_" + mintRecordIdCnt; resROW.tr = tr; resROW.isNew = m.isNewRow(tr); resROW._clonedFrom = tr._clonedFrom;
trMap[resROW.id] = tr;
resROW.filters = flt; resROW.required = rqrItms; resROW.data = dataItms;
for (var j = 0; j < fk.length; j++) {
var f = new OpItemFilter(fk[j], m.getOriginalValue(tr, fk[j].name, hds, 1), GJT.compareModeEnum.Equal);
flt.add(f);
}
for (var j = 0; j < fr.length; j++) {
var v = m.getFieldValue(fk[j].name, tr, 1), f = new OpItemData(fr[j], v, v);
rqrItms.add(f);
}
var oEdlogs = [];
if (edl) {
for (var j = 0; j < edl.length; j++) {
var ed = edl[j], itm = fa.item(ed.name), nV = ed.value, oV = ed.primalValue, oVO = null; if (!itm) continue;
if (nV == KW.dbNull) nV = null; if (oV == KW.dbNull) oV = null;
if (itm.dataType == GDT.DateTime) {
if (nV) {
var nDt = new Date(Date.parse(nV));
if (!isNaN(nDt)) nV = nDt.toISO8601();
}
if (oV) {
var nDt = new Date(Date.parse(oV));
if (!isNaN(nDt)) oV = nDt.toISO8601();
}
}
var f = new OpItemData(itm, nV, oV, oVO);
oEdlogs.push(f);
}
}
resROW.editLog = oEdlogs;
for (var j = 0; j < fl; j++) {
var itm = fa.item(j), isKey = hasBit(itm.opConfig, GIA.IsKey), isRqr = hasBit(itm.opConfig, GIA.Required);
var newV = m.getFieldValue(itm.name, tr, 1), oriV = m.getOriginalValue(tr, itm.name, hds, 1);
if (newV != null || isKey || isRqr) {
if (newV == KW.dbNull) newV = null; if (oriV == KW.dbNull) oriV = null;
if (itm.dataType == GDT.DateTime) {
var nDt = new Date(Date.parse(newV));
if (!isNaN(nDt)) newV = nDt.toISO8601();
}
var f = new OpItemData(itm, newV, oriV, null);
dataItms.add(f);
}
}
var mySta = getAtr(tr, KW.PtyNameRecordState, "");
resROW.recordState = mySta;
resROW.timezoneOffset = (new Date()).getTimezoneOffset();
resROW.tableName = m.tableName; resROW.tarId = oTbl.id;
res.push(resROW);
}
res.tableName = m.tableName; res.tarId = m.id; res.action = _forDelete ? "delete" : "save";
res.GridEdit = m; res.trMap = trMap;
res.appId = m.appId;
res.pageId = m.getPageId();
return res;
}
po.getQryCriterion = function (oa) {
var grid = this.grid;
var useDft = this.handleQuery == null, res = [];
if (!oa) oa = grid.rows[1].getElementsByTagName("INPUT");
var rw = teGetFstRowT(grid); if (rw < 2 || oa.length == 0) { alert("No creterion to query data"); return; }
var criterion = new OpQueryCriterion();
var e = GJT.compareModeEnum;
for (var i = 0; i < oa.length; i++) {
var v = oa[i].value, v2 = null;
if (GJT.trim(v) != "") {
var nm = getAtr(oa[i], "tarFld"); if (!nm) continue;
var itm = this.fieldsAll.item(nm), compm = e.NotDefnied, t = v.substring(0, 1), rvsi = 0;
//res.push(nm + KW.Dlm2 + v + KW.Dlm2 + itm.dataType);
/*
if (v.indexOf("!") == 0) { rvsi = 1; v = v.substring(1); }
if (v.indexOf(">=") == 0) { compm = e.Greater | e.Equal; v = v.substring(2); }
else if (v.indexOf("<=") == 0) { compm = e.Smaller | e.Equal; v = v.substring(2); }
else if (v.indexOf("=") == 0) { compm = e.Equal; v = v.substring(1); }
else if (v.indexOf(">") == 0) { compm = e.Greater; v = v.substring(1); }
else if (v.indexOf("<") == 0) { compm = e.Smaller; v = v.substring(1); }
else if (v.indexOf("~") > 0) { compm = e.Between; var va = v.split("~"); v = va[0]; v2 = va[1]; }
else if (v.indexOf(",") > 0) { compm = e.In; }
else if (v == "@ISNULL") { compm = e.IsNull; }
else compm = e.NotDefnied;
if (compm != e.Equal && (v.indexOf("%") >= 0 || v.indexOf("_") >= 0 || v.indexOf("*") >= 0 || v.indexOf("?") >= 0)) compm = (compm | e.Like | e.CommaToOR);
if (rvsi) compm = (compm | e.Reverse);
*/
v = teMapVal4Qry(itm.valuesMapRvs, v);
v2 = teMapVal4Qry(itm.valuesMapRvs, v2);
var s = new OpItemFilter(itm, v, compm, v2);
criterion.filters.add(s);
}
}
//check sort items
var sorttxt = getAtr(grid, KW.httpPrmSortBy, null);
if (sorttxt) {
var sa = cmnSplit2(sorttxt, KW.Dlm0, KW.Dlm1);
for (var i = 0; i < sa.length; i++) {
var itm = this.fieldsAll.item(sa[i][0]);
if (itm) {
var isSortD = false;
if (parseInt(sa[i][1]) != 0) isSortD = true;
var s = new OpItemOrderBy(itm, isSortD);
criterion.orderBy.add(s);
}
}
}
if (sorttxt == "-") criterion.orderBy.add(new OpItemOrderBy(new OpItem("-"), 0));//通知清除
this.setPageRows(criterion);
//if (useDft) return res;
return criterion;
}
po.setPageRows = function (criterion) {
var oBar = this.StatusBar, grid = this.grid;
if (oBar) {
oPgno = getChiHasAtr(oBar, "z_lkrhpgno"), oPgRows = getChiHasAtr(oBar, "z_lkrhpgrows");
if (oPgno && oPgRows) {
setAtr(grid, KW.PageNo, oPgno.value); setAtr(grid, KW.PageRows, oPgRows.value);
var pgno = parseIntD(getAtr(grid, KW.PageNo, ""), 1), pgrows = parseIntD(getAtr(grid, KW.PageRows, ""), 1);
if (pgno < 1) { pgno = 1; oPgno.value = pgno; }
if (pgrows < 1) { pgrows = 200; oPgRows.value = pgrows; }
if (criterion) { if (pgno) criterion.pageNo = pgno; if (pgrows) criterion.pageRows = pgrows; }
}
}
}
po.setWrapStyleAuto = function () {//如果是多行欄位,自動設成自動折行
var m=this,fa=m.getFields(),trs;
if(!fa) return;
for (var i = 0; i < fa.length; i++) {
var iml = hasBit(fa[i].opConfig, GIA.MultiLine);
//if (!hasBit(fa[i].opConfig, GIA.MultiLine) && fa[i].maxLength < 21) continue;
//if(!trs)trs=m.getAllDataRows();
var c = m.getCellIndex(fa[i].name);
if (c < 0) continue;
var st =m.getColStyle(c);
if (st) st.whiteSpace = (iml || st.width) ? "pre-wrap" : "pre";
}
}
po.getAddOnFilters=function(){
var o = this.addonFltrO; if (!o) return;
var v = [], d = EmsByTag(o, "INPUT");
for (var i = 0; i < d.length; i++) {
if (d[i].checked) v.push(d[i].value);
}
d = EmsByTag(o, "SELECT");
for (var i = 0; i < d.length; i++) {
v.push(d[i].value);
}
return v.join(",");
}
po.hintQryBusy = function (hintDone, chkDocState) {
var tbr = this.ToolBar, o = getChiHasAtr(tbr, "sxyis4qry"), ge = this.grid, clsNm = "", stb = this.StatusBar, timrPrgs, oTimeHint; //QryAnim
if (stb) oTimeHint = getEmByClass(stb, "TimePrgsHint");
if (oTimeHint) {
if (hintDone) { window.clearInterval(oTimeHint.timeIntvHintPrgs); }
else {
if (oTimeHint.timeIntvHintPrgs) window.clearInterval(oTimeHint.timeIntvHintPrgs);
oTimeHint.chkDocState = chkDocState;
oTimeHint.bgnTime = new Date(); geHintTimeElapsed(oTimeHint); oTimeHint.timeIntvHintPrgs = window.setInterval(function () { geHintTimeElapsed(oTimeHint); }, 250, "JavaScript");
}
}
if (!o && ge.rows.length > 1) o = ge.rows[1].cells[0];
if (!o) return;
if (!getAtr(o, "oriClass")) setAtr(o, "oriClass", o.className);
if (hintDone) o.className = getAtr(o, "oriClass"); else o.className = "QryAnim";
}
po.QueryByDlg = function (crn, cntType) {
var m = this, d = m.dlgQry;
if (d && d.dlgCtrl) {
if (!d.dlgCtrl.isDestroyed()) {
d.dlgCtrl.showMe(0, 1);
d.baseCriteria = crn;
d.cntType = cntType;
return toZTopC(d.dlgCtrl.dlg);
}
}
var d = new Dialog4Qry(m);
m.dlgQry = d;
d.baseCriteria = crn;
d.cntType = cntType;
showBesideMouse(d.dlgCtrl.dlg);
}
po.queryByHist = function () {
//撈取所有查詢歷史
var m = this, xp = ["Action", "subact", "tarid", "pageId"], vp = ["inquiryHist", "getHist", m.id, getTargetPage(m)];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return alert("No inquiry history!");
var flds = m.fieldsAll, o;
try { o = JSON.parse(txt); } catch (ex) { o = eval("o=" + txt); }
for (var i = 0; i < o.length; i++) {
var cnt = o[i].content;
cnt = cmnSplit2(cnt, KW.Dlm1, KW.Dlm2);
var cpt = "";
for (var j = 0; j < cnt.length; j++) {
if (j > 0) cpt += " & ";
var fd = flds[cnt[j][0]];
cpt += (fd ? fd.text : "") + ":" + m._cvtQryVal(cnt, cnt[j][0]);
}
if (cpt.length > 150) cpt = cpt.substring(0, 150);
o[i].text = cpt;
}
o.onclick = function (a, b) { m.queryByHist2.call(m, a, b); }
SysShowMenu(o);
}
po.queryByHist2 = function (itm, itms) {
var m = this, cnt = itm.content, d = m.dlgQry;
cnt = cmnSplit2(cnt, KW.Dlm1, KW.Dlm2);
var tDlg = d && !isHidden(d.dlgCtrl.dlg);
if (tDlg) {
var fo = m.criterionButtons.tarObject; //如果正在使用Dialog4Qry 才把條件放到Dialog4Qry
tDlg = getObjByTagNameBubble(fo, "DIV") == d.valCtnr;
}
if (tDlg) d.setHistQryVal(cnt); else m.CriterionAreaShow(true, cnt);
}
po.queryByUserL = function () {
var cc = this.lastQryCriterion;
this.setPageRows(cc);
return this.queryByUser(cc);
}
po.queryByUser = function (criterion, reqContentType) {
if (!PPVG.canQuery(this.programPrivilege)) { alertA(i18nm.SorryQueryDenied.text); return; }
return this.query(criterion, reqContentType, true);
}
po.getQryParameterValue = function (name) {
var itms = this.getQryParamters();
return itms[name].value;
}
po.getQryParamters = function () {
var m = this, grid = m.grid;
var p = m.getQryParamtersUIO();
if (!p) return;
var prmAll = doInqSqlGetPrmVal(p), itms = new OpItems();
if (!prmAll) return;
for (var i = 0; i < prmAll.length; i++) {
var nm = prmAll[i].split(KW.Dlm2), itm = new OpItem(nm[0], nm[0]); itm.value = nm[1];
itms.add(itm);
}
return itms;
}
po.setQryParameterValue = function (name, value) {
var m = this;
var p = m.getQryParamtersUIO();// document.getElementById("InqPrm" + grid.id);
if (!p) return alert("No parameter defined!");
doInqSqlGetPrmVal(p, name, value);
}
po.getQryParamtersUIO = function () {
var p = document.getElementById("InqPrm" + this.grid.id);
if (!p) {//如果沒有歸到BODY會找不到
p = GJT.getChildById(this.container, "InqPrm" + this.grid.id);
}
return p;//document.getElementById("InqPrm" + this.grid.id);
}
po.query_Sync=function(criterion){var n=null;return this.query(criterion,n,n,n,n,n,1);}
po.query = function (criterion, reqContentType, byUser, _tarReportId, _tarFilterId, _rptType, sync) {
var m = this, grid = m.grid;
if (!grid) { alert("No grid property defined in m object"); return; }
var oBar = m.StatusBar;
if (oBar) {
var oPgno = getChiHasAtr(oBar, "z_lkrhpgno"), oPgRows = getChiHasAtr(oBar, "z_lkrhpgrows");
if (oPgno) setAtr(grid, KW.PageNo, oPgno.value); if (oPgRows) setAtr(grid, KW.PageRows, oPgRows.value);
}
if (!criterion) {
//check is it a inqSQL or not
var s = getChiHasAtr(BDY(), "PrmId", "InqPrm" + grid.id);
if (s && (getAtr(s, "tarId") == grid.id || m.is4Pvt)) return doInqSQL0(s, true, reqContentType, byUser, _tarReportId, _tarFilterId, _rptType);
var d = this.dlgQry;
if (_tarFilterId) { criterion = new OpQueryCriterion() }
else if (m.qByDlg && !criterion && d && d.dlgCtrl && !isHidden(d.dlgCtrl.dlg)) {
criterion = d.getQryCriterion();
}
else criterion = m.getQryCriterion();
}
if ((!criterion || criterion == "" || criterion.filters.items.length == 0)) {
if (!_tarFilterId) {
if (!m.lastTarFilterId) return alert(i18nm.QryItmCanNotBeNull.text);
else _tarFilterId = m.lastTarFilterId;
}
m.lastTarFilterId = _tarFilterId;
} else m.lastTarFilterId = null;
m.lastQryCriterion = criterion;
delete m["_lstqck"];//清除上次關聯查詢標記
//m.tarReportId=_tarReportId;
var adoflts = byUser ? m.getAddOnFilters() : null;

if (m.handleBeforeQuery && m.handleBeforeQuery(m, criterion, reqContentType, byUser, _tarReportId, _tarFilterId, _rptType)) return;
var prm = [m, criterion, reqContentType, byUser, _tarReportId, _tarFilterId, _rptType, adoflts];
if (m.evtBroadcast("bfrQuery", prm)) return;
reqContentType = prm[2]; _tarReportId = prm[4]; _tarFilterId = prm[5]; _rptType = prm[6]; adoflts = prm[7]; //事件攔截者可能改變值
var grdCntr = grid.parentElement, qryMode, grdNm = getNameA(grid);
if (m.handleQuery == null) {
var res = criterion;
var cmnInfo = getAtr(grid, KW.CommonInfo, ""), NextRowNo = 1, okl = GJT.getChildById(m.criterionButtons, "chkKeep$OldhGR"), ko = (okl && okl.checked),
aryP, aryV, MyQryItem, flt = criterion.filters, qtx = [], ok2 = GJT.getChildById(m.criterionButtons, "chk$NoDescendant"), xdsdnt = (ok2 && ok2.checked);
if (ko || grid.keepOldDataA) { NextRowNo = teGetNextRowId(grid); grid.keepOldData = true; } else { grid.keepOldData = false; };
rmvAtr(grid, KW.NextRowNo);
for (var i = 0; i < flt.length; i++) {
var q = flt.item(i); if (xdsdnt) q.ComparisonMode = q.ComparisonMode | GJT.compareModeEnum.ExcludeDescendent;
qtx.push([q.name, KW.Dlm2, q.value1, KW.Dlm2, q.dataType, KW.Dlm2, q.opConfig, KW.Dlm2, q.ComparisonMode, KW.Dlm2, q.value2].join(""));
}
aryP = [KW.CommonInfo, KW.QueryItems + grdNm, KW.ValueFields, KW.NextRowNo + grdNm];
aryV = [cmnInfo, qtx.join(KW.Dlm1), teValueFields(), NextRowNo];
if (_tarReportId) { aryP.push(KW.ReportId); aryV.push(_tarReportId); qryMode = "genReport"; }
if (_tarFilterId) { aryP.push(KW.FilterId); aryV.push(_tarFilterId); }
if (_rptType) { aryP.push("rptType"); aryV.push(_rptType); }
if (adoflts) { aryP.push("addonflts"); aryV.push(adoflts); }
var odby = res.orderBy, srtBy = "", prw = res.pageRows, pno = res.pageNo, tId = grdNm;
//var srtBy = getAtr(grid, KW.httpPrmSortBy), prw = getAtr(grid, KW.PageRows), pno = getAtr(grid, KW.PageNo), tId = getName(grid);
if (odby) {
for (var i = 0; i < odby.length; i++) {
if (i > 0) srtBy += KW.Dlm0;
srtBy += odby[i].name + KW.Dlm1 + (odby[i].SortDescending ? "1" : "0");
}
}
//if(res.pageNo) pno = res.pageNo; if (res.pageRows != null) prw=res.pageRows;
if (srtBy) { aryP.push(KW.httpPrmSortBy + tId); aryV.push(srtBy); }
if (prw != null) { aryP.push(KW.PageRows + tId); aryV.push(prw); }
if (pno) { aryP.push(KW.PageNo + tId); aryV.push(pno); }
var fldshw = m.getFields();
if (fldshw) {
var colsNow = fldshw.getNames(",");
if (grid.saveColumnsArrange) { aryP.push(KW.ColumnsList + tId); aryV.push(colsNow); } //save only if required
aryP.push("colsUsing" + tId); aryV.push(colsNow);
}
if (reqContentType) {
aryP.push(KW.PrmResponseContentType, "tarPage", "TableID", KW.PrmTimezoneOffset, "FunctionName");
aryV.push(reqContentType, getTargetPage(grid), grdNm, (new Date()).getTimezoneOffset(), "Ajax_CallGenTable");
var ge = grid.GridEdit, qyl = (m.qryURL ? m.qryURL : msAjaxPageName); // if (ge) ge.hintQryBusy(false, true); //Never Hint when use new window
if (reqContentType == "text/HTML") return cmnOpenWindow(null, qyl, null, aryP, aryV, " ", null, true);
return cmnShowNewWindow("", qyl, null, aryP, aryV);
}
var rs = m.getTRsNeedSave(null,1);
if (rs && rs.length > 0) { if (!confirm(i18nm.ShwDataNotSavedAsk.text)) return; }
m.hintQryBusy();
if (m.opst && m.opst.f4lvlindent) { xp.push("grpField"); xv.push(m.opst.f4lvlindent); }
return teQueryByAjax(grid, aryP, aryV, m.qryURL, byUser, qryMode, null, sync);
}
else {
m.hintQryBusy();
var res = m.handleQuery(criterion, byUser);
//Check format, if is not correct format, alert it
m.showData(res);
m.hintQryBusy(1);
//output
}
}
po.queryDone = function () {
this._selection.clear();
var m = this, gd = m.grid, rws = gd.rows, rbd = m.rowBeginData(), cbd = m.colBeginData(); //renew one
m.hideColumnsUser();
if (!m._checkboxSel && rws.length > rbd) m.sel(rws[rbd].cells[cbd]);
setAtr(gd, KW.ProgramPrivilege, m.programPrivilege);
var opnolist = getChiHasAtr(m.StatusBar, "z_xk_xPgNoList");
var ttlPages, beginPageNo, pno = parseFloat(getAtr(gd, KW.PageNo)), rowsPage = parseFloat(getAtr(gd, KW.PageRows)), totalRecords = parseFloat(getAtr(rws[rbd], KW.TotalRecords));
var rl = rws.length - 1;
if (rl > 0 && rws[rl].cells.length == 0) {
if (isNaN(totalRecords)) {
totalRecords = parseFloat(getAtr(rws[rl], KW.TotalRecords)); //某些查詢只有在輸出完資料時才知道共有幾筆資料
setAtr(rws[rbd], KW.TotalRecords, totalRecords);
}
killIt(rws[rl]);
}
//if (rws.length > rbd && m.isNewRow(rws[rbd])) m.setValueForLink(0, [rws[rbd]]);
if (opnolist) {
if (totalRecords && rowsPage && pno && (totalRecords > rws.length - rbd)) {
ttlPagesF = totalRecords / rowsPage;
ttlPages = parseIntD(ttlPagesF, 0);
if (ttlPagesF > ttlPages) ttlPages++;
}
if (ttlPages && ttlPages > 1) {
h = [];
var pf = true; pp = true;
h.push("<div move='-1' class='MoveBack'>&lt;</div><div move='1' class='MoveForward'>&gt;</div>");
for (var i = 1; i <= ttlPages; i++) {
var shw = (ttlPages < 21) || i <= 2 || (ttlPages - i) <= 2; //頭尾各三頁
if (!shw) shw = ((pno - i >= 0) && (pno - i <= 2)) || ((i - pno >= 0) && (i - pno <= 3));
if (!shw && i < pno && pf) { h.push("<span>...</span>"); pf = false; }
if (!shw && i > pno && pp) { h.push("<span>...</span>"); pp = false; }
if (!shw) continue;
h.push("<span page='", i, "'");
if (i == pno) h.push(" class='Current' ");
h.push(">", i, "</span>");
}
opnolist.innerHTML = h.join("");
}
else opnolist.innerHTML = "";
}
if (isNaN(totalRecords)) totalRecords = 0;
m.totalRecords = totalRecords;
o = getChiHasAtr(m.StatusBar, "xzswttlrcrds");
if (o) o.innerText = totalRecords;
m.setRowColor(null, null, 1);
var rwsA;
if (!m._fciHasLAG()) { rwsA = m.getAllDataRows(); m._fmtByCndn(rwsA); } //有LAG函數時m.setRowColor 會執行過
if (m._needEvalFLS()) { if (!rwsA) rwsA = m.getAllDataRows(); m._formualEval(rwsA,null,EVI.QueryDone); }
m.rvsRHcolor();
if (m.sutoShowMemoSym) m.showMemoSym();
m.hintQryBusy(true);
m._shwLvlTool();
m.hintAnnexAuto();
//if (m.getCellIndex(_WFzxV) >= 0 || m.getCellIndex(_WFzxSts) >= 0) teShowFlowCtrl(m);
if (m.dgfwc) teShowFlowCtrl(m);//已經開啟了
m._ckxRvs();
m.setWrapStyleAuto();
m._setAnchorByRela();
m.evtBroadcast("aftQueryDone", [m]);
m.expand4AftQry();
if (hasBit(m._dspOptions, GJT.DSO.AutoPlotChart)) {
//自動繪製圖表 var itms = ChartsSettingUserGet(m.sur, m.channel),
//檢查資料列有沒有內容(如果只有一列 且是新資料列就不要
if (rws.length > rbd && !m.isNewRow(rws[rbd])) {

teChartShow(m, "U", 1, 1);
}
}
}
po.expand4AftQry = function () {
    var rs = this.aftQRs; if (!rs) return;
    for (var i = 0; i < rs.length; i++) {
        teExpandQryDo(rs[i]);
    }
}
po._shwLvlTool = function (lvl, trs, swC) {
var m = this, fa = m.fieldsAll, o = m.opst, l; if (!o || !fa || !o.f4lvlindent) return; swC = lvl == 0 || swC;
if (!trs) trs = swC ? m.getSelectedTRs() : m.getAllDataTRs();
var f = o.f4lvlindent, v = m.getFieldValues(f, trs); if (!v) return;
var fo = fa[f], isTxt = fo.dataType == GDT.String, mxl = -1, tarL = parseInt(lvl), dh = !isNaN(tarL);
for (var i = 0; i < v.length; i++) {
if (isTxt) l = v[i].split(".").length;
else l = parseInt(v[i], 10);
if (swC) {
var ntr = trs[i].nextSibling, vis = isHidden(ntr), idx = m.getCellIndex(f); if (vis) vis = ""; else vis = "none";
while (ntr) {
var ln, vn = teTdGetValue(ntr.cells[idx]); if (!vn) break;
if (isTxt) ln = vn.split(".").length;
else ln = parseInt(vn, 10);
if (ln <= l) break;
ntr.style.display = vis;
ntr = ntr.nextSibling;
}
return;
}
if (mxl < l) mxl = l;
if (dh) showItA(trs[i], l <= tarL);
}
if (dh) return;
if (!m._lvlOpg) {
var cntr = PROG.floatPanels ? PROG.floatPanels[0] : null;
if (!cntr) cntr = m.ToolBar;
if (isHidden(cntr)) cntr = m.StatusBar;
if (isHidden(cntr)) cntr = null;
m._lvlOpg = new NumberButtons(mxl, m, cntr);
var dd = m.grid.rows; if (dd) dd = dd[0];
if (dd) m._lvlOpg.bgColor = dd.bkColor ? dd.bkColor : dd.style.backgroundColor;
}
var dg = m._lvlOpg;
dg.showButtons(mxl);

}
po.rvsRHcolor = function (oaTR) {
var m = this, cbd = m.colBeginData(), t0 = m.grid.rows[0]; if (!t0) return;
var s = GJT.getComputedStyle(t0), c = s.color, bc = s.backgroundColor;
if (!c && !bc) return;
if (!oaTR) oaTR = this.getAllDataTRs();
var rl = oaTR.length;
for (var r = 0; r < rl; r++) {
var td = oaTR[r].cells[0]; if (!td) continue;
var ts = td.style;
//if (c && !ts.color) ts.color = c; //no need
if (bc && !ts.backgroundColor) ts.backgroundColor = bc;
}
}
po.fixToolbar = function () {
var m = this, b = m.ToolBar; if (!b) return;
var s = b.style;
var pns = PROG.getFixedPanel();
if (pns && pns.length) pns = pns[0];
if (b._fixed == undefined) {
b._oriPar = b.parentElement;
b.nxsb = b.nextSibling;
b.oriWdt = s.width; b.oriHgt = s.height;
b.oriDsp = s.display;
if (pns) {
s.clear = "left";
b.style.left = "-100px";
pns.appendChild(b); b._fixed = pns;
} else {
var dlg = new DialogInBody(""), evh = m.fixToolbar;
dlg.setClient(b);
b._fixed = dlg;
dlg.handleClose = function () { evh.call(m); }
dlg.moveToLT();
}
} else {
dlg = b._fixed; delete b._fixed;
s.display = b.oriDsp;
if (b.nxsb) b._oriPar.insertBefore(b, b.nxsb);
else b._oriPar.appendChild(b);
if (pns != dlg) {
delete dlg.handleClose;
s.width = b.oriWdt; s.height = b.oriHgt;
dlg.close();
}
}
teRevFltPosition();
}
po.hiliColumn = function (td, _restore) {
var m = this, st = m.getColStyle(td.cellIndex), se = m._selection;
if (st) {
if (_restore) { st.backgroundColor = ""; st.color = ""; }
else { st.backgroundColor = se.hiliBgColor; st.color = se.hiliColor; }
return true;
}
}
po._getColsStylesText = function () {
var m = this, g = m.grid, rw = g.rows[0]; if (!rw) return;
var cl = rw.cells.length, rs = {};
for (var i = 0; i < cl; i++) {
var s = m.getColStyle(i), so = {},f=m.getField(rw.cells[i]);
if (f) {
so.nm = f.name; so.id = f.id;
so.cssText = s ? s.cssText : null;
rs[so.nm] = so;if(so.id)rs[so.id] = so;
}
}
return rs;
}
po._RestoreColsStyles = function (rs) {
var m = this, g = m.grid, rw = g.rows[0]; if (!rw) return;
var cl = rw.cells.length;
for (var i = 0; i < cl; i++) {
var s = m.getColStyle(i), f = m.getField(rw.cells[i]);
if (f) {
so = rs[f.name]; if (!so) so = rs[f.id]
if (so) s.cssText = so.cssText;
else s.display = "";//避免用到原本被隱藏的nth
}
}
}
po.getColStyle = function (index, useCOL) {
if (index == undefined) return;
try {
var m = this, g = m.grid, rw = g.rows[0]; if (!rw) return;
var d = g.id, doc = document, sth = m.styleSheet, cl = rw.cells.length;
if (!sth) {
sth = xEm(doc, "style");
EmByTag(doc, "head").appendChild(sth);
if (sth.sheet) sth = sth.sheet;
else if (sth.styleSheet) sth = sth.styleSheet;
m.styleSheet = sth;
}
var rus = sth.cssRules || sth.rules, useIns = sth.insertRule;
while (rus.length < cl) {
var sl = "#" + d + " TR TD:nth-of-type(" + (rus.length + 1) + ")";
if (useIns) sth.insertRule(sl + "{text-align:}", rus.length);
else sth.addRule(sl, "text-align:");
}
var st= rus[index].style;
return st;
} catch (ex) {
if (useCOL) { var cols = oTbl.getElementsByTagName("COL"); if (cols.length > index) return cols[ci]; }
}
}
po._mkTxtAlign = function () {
var m = this, g = m.grid, rw = g.rows[0]; if (!rw || !getAtr(g, KW.VariableItems, "")) return;
var d = g.id, doc = document, sth = m.styleSheet, cl = rw.cells.length, ra = "text-align:right;";
for (var c = 0; c < cl; c++) {
var itm = rw.cells[c].opField, dtp, st = m.getColStyle(c); if (!st) continue;
if (itm) {
dtp = itm.dataType;
if (dtp == GDT.String || dtp == GDT.DateTime) {
st.textAlign = "left";
}
else if (1) {
st.textAlign = "right";
}
} else if (c == 0) {
st.textAlign = "right";
} else st.textAlign = "";
}
}
po.showRelative = function (surFields, relaGridEdit, relaFields, myRows, keepOld) {
//get my data
if (!surFields instanceof Array) surFields = [surFields];
if (relaFields == null) relaFields = surFields;
if (!relaFields instanceof Array) relaFields = [relaFields];
var v = [], mf = surFields, rf = relaFields, crtn = new OpQueryCriterion(), itm, e = GJT.compareModeEnum, rg = relaGridEdit,
sfa = this.fieldsAll, rfa = rg.fieldsAll;
for (var i = 0; i < mf.length; i++) {
itm = sfa.item(mf[i]);
v.push(this.getFieldValues(itm, myRows));
}
var k = v[0].length, cn = [];
for (var j = 0; j < k; j++) {
cn[j] = new OpQueryCriterion();
for (var i = 0; i < rf.length; i++) {
itm = rfa.item(rf[i]);
var s = new OpItemFilter(itm, v[i][j], e.Equals, null);
cn[j].filters.add(s);
}
}
relaGridEdit.query(cn[0]);
}
po.refreshMainRow = function (forRecForm) {
var m = this, r = m.mainTR(); if (!r) return;
return m.refreshRows([r], null, null, forRecForm);
}
po.refreshRows = function (tarTRs, keyFields, tarFields, forRecForm, forCheck, sync) {
var itmsA = this.fieldsAll, itms = keyFields ? itmsA.collect(keyFields) : this.fieldsKey;
var il = itms.length; if (il == 0) return;
var va = [], aryP = [], aryV = [], qtx = [], oTbl = this.grid, dict = GJT.newDictionary();
tarTRs = this._strsau(tarTRs);
if (!tarTRs || !tarTRs.length) return;
if (!tarFields) tarFields = itmsA.getNames(",", 0, GIA.IsKey); //exclude key
if (typeof tarFields == "string") {
var itmsTar = itmsA.collect(tarFields, 0, GIA.Virtual); //exclude virtual
tarFields = itmsTar.getNames(",");
} else if (tarFields.getNames) tarFields = tarFields.getNames(",");//化成字串
for (var i = 0; i < il; i++) {
var itm = itms.item(i), nm = itms.item(i).name, v = this.getFieldValues(nm, tarTRs); if (!v) continue;
var vlst = v.join(",");
if (itm.dataType != GDT.String) {
while (vlst.indexOf(",,") > -1) {
vlst = vlst.replace(/,,/g, ","); //防止null造成查詢失敗
}
if (vlst.indexOf(",") == 0) vlst = vlst.substring(1);
if (vlst.lastIndexOf(",") == vlst.length - 1) vlst = vlst.substring(0, vlst.length - 1);
}
if (vlst == "" || (il > 1 && vlst == ",")) continue;
qtx.push([nm, KW.Dlm2, vlst, KW.Dlm2, itm.dataType, KW.Dlm2, itm.opConfig, KW.Dlm2, GJT.compareModeEnum.In, KW.Dlm2, ""].join(""));
va.push(v);
}
if (va.length == 0) return;
for (var h = 0, k = va[0].length; h < k; h++) {
var vk = va[0][h];
for (var i = 1; i < il; i++) {
vk += "\t" + va[i][h];
}
if (vk == "") continue;
dict.add(vk, tarTRs[h]);
}
if (dict.k.length == 0) return;
if (forCheck) return 1; //can refresh
dict.tarFields = tarFields; dict.keyItems = itms; dict.forRecForm = forRecForm;
aryP.push(KW.QueryItems + getNameA(oTbl), KW.PrmResponseContentType, KW.ColumnsList + getNameA(oTbl));
aryV.push(qtx.join(KW.Dlm1), "application/json", tarFields);
teQueryByAjax(oTbl, aryP, aryV, null, false, "json-rows", dict, sync);
}
po.getFieldsForQuerySelect = function () {
//return OpItems for all required fields for query data
//call this before query data for call showData
var res = new OpItems(), af = this.fieldsAll, oTbl = this.grid, hds = tbGetHeads(oTbl);
for (var i = 0; i < af.length; i++) {
var itm = af.item(i); if (!itm) continue;
var a = itm.opConfig;
if (hasBit(a, GIA.Required) || hasBit(a, GIA.IsKey) || hasBit(a, GIA.RemoveDenied)) {
res.add(itm);
} else if (hds[itm.name]) res.add(itm);
}
return res;
}
po.resetNextRowNo = function () {
setAtr(this.grid, KW.NextRowNo, 1);
}
po.showData = function (dataToShow, keepOld) {
//format of dataToShow:[{FieldName1:Value, FieldName2:value,...},{},...]
var flds = this.getFieldsForQuerySelect(), oTbl = this.grid, tbdy = getTBody(oTbl), fl = flds.length, hds = tbGetHeads(oTbl), hl = hds.length,
tbchrn = tbdy.children;
var h = dataToShow.length, startNo = teGetNextRowId(oTbl), oaTR = []; //setAtr(oTbl,KW.NextRowNo, maxId);
var tmp = document.createDocumentFragment();
if (!keepOld) {
startNo = 1;
while (tbchrn.length > 0) { tbdy.removeChild(tbchrn[0]); }
}
for (var r = 0; r < dataToShow.length; r++) {
var oTr = newEm("TR"), oTD;
oTD = newEm("TD"); oTD.innerText = startNo; startNo++;
oTr.appendChild(oTD);
for (var i = 1; i < hl; i++) {
oTr.appendChild(newEm("TD"));
}
oaTR.push(oTr);
tmp.appendChild(oTr);
}
tbdy.appendChild(tmp);
setAtr(oTbl, KW.NextRowNo, startNo);
for (var c = 0; c < fl; c++) {
var aVal = [], itm = flds.item(c);
for (var r = 0; r < dataToShow.length; r++) {
var ds = dataToShow[r], v;
v = ds[itm.name];
if (v == null) v = ds[itm.fieldName];
if (typeof v == "undefined") {
throw new Error("Property name " + itm.name + " not defined in data object");
}
aVal.push(v);
teSetAsOld(oaTR[r]);
}
this.setFieldValuesQ(itm.name, aVal, oaTR, true);
}

}
po.clearCriterionText = function () {
var cn = getChiHasAtr(this.grid, "zz_criterion_row"); if (!cn) return;
if (this.qByDlg) cn = this.cQdg;
var oa = cn.getElementsByTagName("INPUT");
for (var i = 0; i < oa.length; i++) {
if (getAtr(oa[i], "tarFld")) oa[i].value = "";
}
this.hiliNotNullCriterionBox();
}
po.hiliNotNullCriterionBox = function () {
//提示不是空白的查詢文字框
var m = this, o = m.InqPrmO;
if (!o) o = getChiHasAtr(m.grid, "zz_criterion_row");
if (!o) return;
var oa = o.getElementsByTagName("INPUT");
for (var i = 0; i < oa.length; i++) {
teHiLiNotNullTextBox(oa[i]);
}
}
po.getAllDataRows = function () { return this.getAllDataTRs(); }
po.getAllDataTRs = function () {
var res = [], g = this.grid, rws = g.rows, rl = rws.length;
for (var i = this.rowBeginData(); i < rl; i++) { res.push(rws[i]); }
return res;
}
po.getTRsNeedSave = function (rws,onlyHasPvg) {
if (!rws) rws = this.getAllDataRows();
var res = [];
if (onlyHasPvg) {
var pvg = this.programPrivilege, P = PPVG;
if (!P.canSave(pvg)) return res;
}
for (var r = 0; r < rws.length; r++) {
var lg = rws[r]._editLog;
if (!lg || lg.length == 0) continue;
res.push(rws[r]);
}
return res;
}
po.saveDataChk = function (oaTR) {
var m = this, f = m.opst ? m.opst.f4jnr : null, itms = m.fieldsAll.collect(null, 0, GIA.SaveDenied);
if (!f || !oaTR || oaTR.length == 0) return;
for (var i = 0; i < oaTR.length; i++) {
var tr = oaTR[i], vf = m.getFieldValueR(f, tr);
if (vf) continue;
var edl = tr._editLog; if (!edl || edl.length == 0) continue; //沒有異動
for (var j = 0; j < itms.length; j++) {
var nm = itms[j].name, v = m.getFieldValueR(nm, tr);
if (v) m.editLogAdd(tr, nm, v);
}
teRowSetAsNewRow(tr);
}
}
po.saveData = function (saveWhole, oaTR, _ignorePvg, _noAlert, syncSave) {
var m = this, oTbl = m.grid, se = m._selection;
if (!m.tableName) return alertA(i18nm.ItsReadOnlyTable.text);
if (!m.endEdit()) return;
if (!oaTR) oaTR = (saveWhole ? m.getAllDataTRs() : se.getDataTRs());
if (m.saveDataChk(oaTR)) return;
var criterion = m.getEditCriterion(oaTR, null, !_noAlert);
if (!_ignorePvg && !hasBit(m.programPrivilege, PPVG.Save)) return _noAlert ? false : alertA(i18nm.SorrySaveDenied.text);
if (m.handleBeforeSave) { if (m.handleBeforeSave(m, criterion)) return; }
if (m.evtBroadcast) { if (m.evtBroadcast("BeforeSave", [m, oaTR, criterion])) return;}
if (m.handleSave == null) {
return teSaveDataN(m, criterion, syncSave);
}
else {
m.handleSave(criterion, m);
}
return true;
}
po.saveDoneNotify = function (criterion) {
if (!criterion) return;
//var oTbl = this.grid, hds = tbGetHeads(oTbl), oriRows = oTbl.rows;
var m = this, trMap = criterion.trMap;
for (var i = 0; i < criterion.length; i++) {
var cr = criterion[i];
if (cr && cr.cudStatus != undefined) {
//recordState data rowId
var tr = trMap[cr.id], dts = cr.data, itm, clls = tr.cells, edlg = cr.editLog, isOk = (cr.cudStatus == 0);
if (!tr) continue;
for (var j = 0; j < dts.length; j++) {
itm = dts.item(j);
var nv = itm.originalValue;
m.setFieldValue(itm.name, nv, tr, true, true, true); //orginal value keep raw data
if (itm.dataType == GDT.DateTime) {
nv = (new Date()).fromISO8601(nv);
if (!nv || isNaN(nv)) nv = null;
else if (itm.displayFormat) nv = nv.format(itm.displayFormat);
else nv = nv.format("yyyy/MM/dd HH:mm:ss");
m.setFieldValueQ(itm.name, nv, tr);
} else {
if (nv == KW.dbNull || nv == null) nv = "";
m.setFieldValueQ(itm.name, nv, tr);
}
}
if (isOk) { teSetAsOld(tr); m.editLogClear(tr); } //if success
}
}
if (m.handleAfterSave) { if (m.handleAfterSave(m, criterion)) return; }
if (m.evtBroadcast) m.evtBroadcast("AfterSave", [m, criterion]);
m.expand4AftSave();
}
po.expand4AftSave = function () {
var rs = this.relaAfS; if (!rs) return; //teExpandQry(ge, rvs) teExpandQryDo(itms[0],rvs);
for (var i = 0; i < rs.length; i++) {
teExpandQryDo(rs[i]);
}
}
po.addToolBarButton = function (opitem, evtHandleClick, position) {
var m = this, obar = m.ToolBar, tagNm, chrn, htm, obj;
if (!obar || isHidden(obar)) {
if (m.StatusBar && !isHidden(m.StatusBar)) obar = m.StatusBar;
var ot = getEmByClass(obar, "GridToolBar");
if (!ot) { ot = addE("<div class='GridToolBar' style='display:inline-block;background-color:inherit' />", obar); }
obar = ot;
}
if (!obar) { m.ToolbarShow(TBM.withText); obar = m.ToolBar; }
if (obar) chrn = obar.children; else return;
//if (chrn.length > 1) tagNm = chrn[1].tagName; //不要自動判斷,多增變數而已
//else if (chrn.length > 0) tagNm = chrn[0].tagName;
if (!tagNm) tagNm = "span";
var h0 = "<" + tagNm + " onmousedown='borderDown(this)' onmouseup='borderUp(this)' ", h1 = "</" + tagNm + ">";
if (typeof opitem == "string") {
if (opitem.indexOf("<") >= 0) htm = opitem;
else htm = h0 + ">" + opitem + h1;
}
else if (opitem instanceof OpItem || opitem.text) {
htm = h0 + i18htmTitle(opitem) + ">" + opitem.text + h1;
}
else {
htm = h0 + ">" + opitem + h1;
}
if (opitem.tagName) {//is an element
obj = opitem;
}
else obj = addE(htm, obar);
if (position != null) obar.insertBefore(obj, obar.children[position]);
else {
var tbc = m._recTabs;
if (tbc) obar.insertBefore(obj, tbc.uio);
else obar.appendChild(obj);
}
if (evtHandleClick) GJT.eventAddHandle(obj, "click", evtHandleClick);
m.showCaptionInTbr();
return obj;
}
po.deleteData = function (oaTR, _ignorePvg, _noAlert) {
var m = this;
if (!_ignorePvg && !hasBit(m.programPrivilege, PPVG.Delete)) return alertA(i18nm.SorryDeleteDenied.text);
if (!_noAlert && !window.confirm(i18nm.CfmDelete.text)) return;
oaTR = m._strsau(oaTR);
var criterion = m.getEditCriterion(oaTR, true);
if (m.handleBeforeDelete) { if (m.handleBeforeDelete(m, criterion)) return; }
if (m.handleDelete) {
var res = m.handleDelete(criterion, m);
}
else {
teDeleteDataN(m, criterion);
}
return true;
}
po.deleteDoneNotify = function (criterion) {
if (!criterion) return;
//var oTbl = this.grid, hds = tbGetHeads(oTbl), oriRows = oTbl.rows;
var m = this, trMap = criterion.trMap;
for (var i = 0; i < criterion.length; i++) {
var cr = criterion[i];
if (cr && cr.cudStatus != undefined && cr.cudStatus == 0) {
//recordState data rowId
var tr = trMap[cr.id];
if (!tr) continue;
tr.parentNode.removeChild(tr);
//teRowsRemoveTR(oTbl, [tr]);
}
}
if (m.handleAfterDelete) { m.handleAfterDelete(m, criterion); }
m.evtBroadcast("aftDelete",[m,criterion]);
}
po.exportData = function () {
var m = this;
if (m.handleExportData == null) return m.geExportDataStep1(geExportDataStepN);
m.handleExportData(m.getQryCriterion(), m);
}
po.geExportDataStep1 = function (hndStepN) {
var m = this, n = i18nm, itms = getExportContentTypeItems();
itms.tar = m;
SysShowMenu(itms, hndStepN);
}
po._sortBy1Col = function (itm) {
var m=this;
if (!itm) { var su = GJT.eventSrc(), itm = m.getField(getTD(su)); }
if (!itm) return;
var sm = itm._sortmode;
sm = ((sm == null ? 0 : sm) + 1) % 3;
itm._sortmode = sm;
m.selClear();
m._sortDo(sm, null, 0, 0, itm);
}
po.sortAscending = function () { return this._sortDo(1); }
po.sortDescending = function () { return this._sortDo(2); }
po.sortNone = function () { return this._sortDo(3); }
po._sortDo = function (SortMode, _range, _ignorePvg, _noAlert, itmSort) {
var m = this, se = _range ? _range : m._selection, gd = m.grid, sm = SortMode, sn, rbd = m.rowBeginData();
if (!_ignorePvg && !hasBit(m.programPrivilege, PPVG.Sort)) return _noAlert ? gd : m.showHintMsg("Sort Denied!");
var oTBdy = getTBody(gd); if (oTBdy == null) return false;
gd.style.curosr = 'wait';
var allrows = gd.rows, tbrws = oTBdy.rows, brL = tbrws.length, fR = m.rowBeginData(),
TDs = se.getDataTDsOROA(1, 0), recps = se.getRectsPosition(), sel1Row = true;
if (!allrows[rbd]) return false;//no data rows
if (sm != 1 && sm != 2) { sn = true; sm = 1; TDs = [[[allrows[rbd].cells[0]]]]; }
else if (TDs.length > 1) {//如果所有選取的範圍是相同的列,就合併一次排序
var comb = true, r1 = getTR(TDs[0][0][0]).rowIndex, r2 = getTR(TDs[0][TDs[0].length - 1][0]).rowIndex;
for (var i = 1; i < TDs.length; i++) { comb = comb && r1 == getTR(TDs[i][0][0]).rowIndex && r2 == getTR(TDs[i][TDs[i].length - 1][0]).rowIndex; }
if (comb) {
var oaTR, oaTDs = TDs[0], rl = oaTDs.length;
for (var i = 1; i < TDs.length; i++) {
for (var j = 0; j < rl; j++) {
oaTDs[j] = oaTDs[j].concat(TDs[i][j]);
}
}
TDs = [oaTDs];
}
}
if (itmSort && !sn) {
var hds = tbGetHeads(m.grid), hd = hds[m.fieldNameA(itmSort.name, 0)];
TDs =[[[hd]]];
}
for (var i = 0; i < TDs.length; i++) {
var oaTR = [], refTR = null, oaTDs = TDs[i], rl = oaTDs.length, aDType = [], aCIdx = [];
var oaTD = oaTDs[0];
for (var k = 0; k < oaTD.length; k++) {
var itm = m.getField(oaTD[k]);
if (itm) aDType[k] = itm.dataType;
else if (sn) aDType[k] = GDT.Integer;
else aDType[k] = GDT.String;
aCIdx[k] = oaTD[k].cellIndex;
}
if (rl == 1) {
var tdsN = [];
for (var d = rbd, g = allrows.length; d < g; d++) {
var oaTDN = [];
for (var k = 0; k < oaTD.length; k++) {
oaTDN.push(allrows[d].cells[aCIdx[k]]);
}
tdsN.push(oaTDN);
}
oaTDs = tdsN;
rl = oaTDs.length;
} else sel1Row = false;
for (var j = 0; j < rl; j++) {
var oaTD = oaTDs[j];
oaTR[j] = getTR(oaTD[0]);
}
if (oaTR[rl -1]!= tbrws[brL - 1]) refTR = oaTR[rl -1].nextSibling; //排序的不是最後一列,以下一列為參考插入點
var il = aDType.length,
vcmpr = function (oTR1, oTR2) {
for (var h = 0; h < il; h++) {
var od1 = oTR1.cells[aCIdx[h]], od2 = oTR2.cells[aCIdx[h]], v1 = teTdGetValue(od1), v2 = teTdGetValue(od2);
if (!v1) v1 = getValueFromTD(od1);
if (!v2) v2 = getValueFromTD(od2);
if ((v1 == null || v1 == "") && (v2 == null || v2 == "")) continue; //equal, compare next
if (v1 == null || v1 == "") return -1;
if (v2 == null || v2 == "") return 1;
if (aDType[h] == GDT.Integer || aDType[h] == GDT.Real || aDType[h] == GDT.Short) {
var v1n = parseFloat(teDeformatNumDo(v1)), v2n = parseFloat(teDeformatNumDo(v2));
if (!isNaN(v1n)) v1 = v1n; if (!isNaN(v2n)) v2 = v2n;
}
else if (aDType[h] == GDT.DateTime) {
v1 = new Date(Date.parse(v1));
v2 = new Date(Date.parse(v2));
}
if (v1 < v2) return -1;
else if (v1 > v2) return 1;
else continue;
}
return 0;
}; //end vcmpr

oaTR.sort(vcmpr);
if (sm == 2) oaTR.reverse();
var fgm = document.createDocumentFragment();
for (var j = 0; j < oaTR.length; j++) { fgm.appendChild(oaTR[j]); }
if (refTR == null) oTBdy.appendChild(fgm); else oTBdy.insertBefore(fgm, refTR);
}
m.setRowColor(null, null, 1);
if (!m._checkboxSel && !sel1Row) m._selByRectPos(recps);
m.evtBroadcast("aftSort",[oaTR]);
return gd;
}
po.setRowColor = function (steps, color, redo) {
var m = this;
if (!m._getFCI()) tlSetRowColorTBL(m.grid, redo, steps, color);
if (m._fciHasLAG()) m._fmtByCndn(m.getAllDataRows());
}
po._eventTD = function (ev) {
var td = getTD(GJT.eventSrc(ev)), tbl = getTable(td);
while (tbl && (tbl != this.grid)) { td = getTD(tbl); tbl = getTable(td); }
if (tbl) return td;
}
po.firstDataTD = function () {
var m = this, rws = m.grid.rows, rbd = m.rowBeginData(), cbd = m.colBeginData();
if (rws.length > rbd && rws[rbd].cells.length > cbd) td = rws[rbd].cells[cbd];
}
po._SelByMD = function (ev, su) {
var m = this,se=m._selection, td = getTD(su);
m.geFocus();
if (!m.enableSelect) return;
if (m._checkboxSel) {
if (getTR(td).rowIndex == 0) return m._sortBy1Col();
return m.selByCheckbox(su);
}
if (ev.shiftKey) return m.selAdd(td, true);
if (ev.ctrlKey) m.selAdd(td, false, true);
else {
//如果點到的物件已經被選取了不
//if (se.isMember(td)) return;
m.sel(td);
}
}
//po._selByClick = function (ev, su) {
//var m = this,se=m._selection, td = getTD(su);
//m.geFocus();
//if (!m.enableSelect) return;
//if (m._checkboxSel) return m.selByCheckbox(su);
//if (ev.shiftKey) return m.selAdd(td, true);
//if (ev.ctrlKey) m.selAdd(td, false, true);
//else {
// m.sel(td);
//}
//}
po._selByKeyDown = function (key, ev) {//selRect = ev.shiftKey, appendSel = ev.ctrlKey
var m = this, td = m._selection.lastTD(), dN, rN, rws, rbd;
if (m.wholeRowSelection) return;
if (!td && (key == 37 || key == 38 || key == 39 || key == 40)) { m.sel(m.firstDataTD()); return true; }
var tr = getTR(td);
if (key == 37) {
dN = td.previousSibling; if (!dN || dN.cellIndex < m.colBeginData()) return;
} else if (key == 38) {
rN = tr.previousSibling; if (!rN || rN.rowIndex < m.rowBeginData()) return;
dN = rN.cells[td.cellIndex];
} else if (key == 39) {
dN = td.nextSibling; if (!dN) return;
} else if (key == 40) {
rN = tr.nextSibling; if (!rN) return;
dN = rN.cells[td.cellIndex];
} else { return false; }
if (ev.shiftKey) m.selAdd(dN, true);
else if (ev.ctrlKey) m.selAdd(dN, false, true);
else if (ev.altKey) m.selAdd(dN, false, false, true);
else m.sel(dN);
m.scrollToVisible(td);
//dN.focus();
cmnEvtSetReturn(false); GJT.stopBubble();
return true;
}
po.geFocus = function () {
var p = this.parent;
if (p && p.opEvent) return p.opEvent(this, EVI.Focus);
}
po.receiveValue = function (val,va) {
return this.setClipText(null, val, true, true);
}
po._showPickButton = function (hideit, td) {
var m = this, c = this.gridContainer, o = c.children["btnValSel"];
if (!td) td = m.mainTD();if (!td) return hideIt(o);
var itm = m.getField(td), cho = ValueCanChoose(itm, m.isNewRow(getTR(td)), m.fieldsAll);
if (isHidden(m.grid) || !cho || !m.enableSelect) hideit = 1;
if (hideit) return hideIt(o);
if (!o) {
o = addEm("<button id=\"btnValSel\" tabindex=\"-1\" style=\"height:20px;width:20px;padding-left:3px;'\">...</button>", null, c);
var er = m._showPicker; o.onclick = function () { er.call(m); };// o.onmousedown = function () { er.call(m); }; //
}
matchLoc(o, td, td.offsetWidth, 0, 0, c.getBoundingClientRect()); showItA(o, 1);
makeSureInsideWindowDo(o);//這會使按鈕在有卷軸容器內位置受限
if (itm.vcri) o.title = itm.vcri.text; else o.title = "";
}
po._showPicker = function (tarObj) {
var m = this, td = m.mainTD(), itm = m.getField(td);
if (!ValueCanChoose(itm, m.isNewRow(getTR(td)), m.fieldsAll)) return;
if (m.bfrEdit) {
var itms = m.getSelectedFields(), oaTR = m._strsau();
for (var c = 0; c < itms.length; c++) { if (m.bfrEdit(m, oaTR, itms[c])) return; }
}
var ctr = itm.ctrlId, chc = itm.choice, aIN, aIV;
if (!chc && itm.dataType == GDT.Boolean) chc = "TRUE,FALSE";
var vcr = itm.vcri; if (vcr && !ctr) return tePrcsValCarrier(vcr);
if (ctr) {
if (m.handleSelectValue) {
if (m.handleSelectValue(ctr, itm, m)) return;
ctr = itm.ctrlId; //Must read again, handleSelectValue may change contrllerid
}
}
chc = getChoiceAuto(chc, itm);
return showValuePicker(td, chc, ctr, (tarObj && tarObj.tagName == "INPUT") ? tarObj.value : teTdGetValue(td),
m, itm.text, itm.dataType == GDT.DateTime || itm.dataType == GDT.Date);
}
po.changeFieldOpConfig = function (fldName, cfgFlag, removeFlag) {
var m = this, g = m.grid, hds = tbGetHeads(g), fa = m.fieldsAll, fn = m.fieldNameA(fldName), itm = fa[fn];
if (!itm || !cfgFlag) return;
itm.opConfig = itm.opConfig | cfgFlag;
if (removeFlag) itm.opConfig = itm.opConfig ^ cfgFlag;
var hd = hds[fn]; if (!hd) return;
hd.style.fontWeight = itm.isWriteDenied() ? "" : "bold";
}
po.changeFieldCaption = function (fldName, Cpt, mode) {
var m = this, g = m.grid, hds = tbGetHeads(g), fa = m.fieldsAll, fn = m.fieldNameA(fldName), itm = fa[fn];
if (!itm) return;
var oriTxt = itm.text;
if (mode == 1) { if (oriTxt.indexOf(Cpt) < 0) Cpt = Cpt + oriTxt; else Cpt = oriTxt; }
if (mode == -1) { if (oriTxt.indexOf(Cpt) < 0) Cpt = oriTxt + Cpt; else Cpt = oriTxt; }
itm.text = Cpt;
var hd = hds[fn]; if (!hd) return;
hd.children[0].innerText = Cpt;
}
po.switchSelMode = function (_mode) {
var m = this, se = m._selection, g = m.grid, e = !m.enableSelect, _x = _mode;
if (_x != null) {
if (_x == -1) { m.enableSelectX = m.enableSelect; e = 0; }
else if (_x == 1 && m.enableSelectX != undefined) { e = m.enableSelectX; }
else if (_x == 0) e = 1;
else if (_x == 2) e = 0;
}
if (GJT.browserType == BWRT.FIREFOX) {
for (var i = 0; i < document.styleSheets.length; i++) {
var shts = document.styleSheets[i];
var rules = shts.cssRules;
for (var j = 0; j < rules.length; j++) {
if (rules[j].selectorText == "table.DataEdit") {
rules[j].style.setProperty("-moz-user-select", (e ? "none" : ""), "important");
}
}
}
}
m.enableSelect = e; se.setColor(!e);
se.showUI = e;
m._showPickButton(!e, m.mainTD());
}
po.selExtend = function (stepsLR, stepsUD) {
var m = this, se = m._selection, td = se.lastTD(); if (!td) return;
var tr = getTR(td), ci = td.cellIndex, ri = tr.rowIndex, td2 = td, rws = m.grid.rows,
rbd = m.rowBeginData(), cbd = m.colBeginData(), cl = tr.cells.length - 1, rl = rws.length - 1;
if (stepsLR) ci += stepsLR;
if (stepsUD) ri += stepsUD;
if (ci < 0 || ri < 0) return;
if (ci > cl) ci = cl;
if (ri > rl) ri = rl;
td = rws[ri].cells[ci];
m.selAdd(td, true);
}
po.sel = function (td) {
var m = this, se = m._selection, g = m.grid, otd = m.mainTD(), otr = otd ? getTR(otd) : null;
if (!m.enableSelect) return;
if (!td) td = m.grid.rows[m.rowBeginData()].cells[m.colBeginData()];
if (m.wholeRowSelection) td = getTR(td).cells[0];
var ntr = getTR(td);
if (m.bfrMainRowChanged && otr != ntr) { if (m.bfrMainRowChanged(otr, ntr, m)) return; }
if (m.bfrChangeSelection) { if (m.bfrChangeSelection(m)) return; }
se.sel(td);
if (otr != ntr) {
if (m.aftMainRowChanged) m.aftMainRowChanged(otr, ntr, m);
m.evtBroadcast("aftMainRowChanged", [otr, ntr, m]);
m.expand4ChgRow();
}
if (m.aftChangeSelection) m.aftChangeSelection(m);
m.evtBroadcast("aftChangeSelection", [m]);
td = m.mainTD();
m.HintTextLength(td);
m._showPickButton(0, td);
if (otr != ntr) m.showRecordFormValues();
m.nummDlgShowDtl();
m.memoDlgShowDtl();
}
po.selAdd = function (td, _expandRect, _AddXor, _replaceLast) {
var m = this, se = m._selection;
if (!m.multiSelect) return m.sel(td);
if (!m.enableSelect) return;
if (m.wholeRowSelection) td = getTR(td).cells[0];
if (m.bfrChangeSelection) { if (m.bfrChangeSelection(m)) return; }
se.add(td, _expandRect, _AddXor, _replaceLast);
if (m.aftChangeSelection) m.aftChangeSelection(m);
m.evtBroadcast("aftChangeSelection", [m]);
m.nummDlgShowDtl();
}
po._selByRectPos = function (recps) {
var m = this, rws = m.grid.rows, rl = rws.length, rk = recps, s = 0; if (!rk) return;
for (var i = 0; i < rk.length; i++) {
if (rl <= rk[i][0] || rl <= rk[i][2] || rk[i][0] < 0 || rk[i][2] < 0) continue;
if (!s) { m.sel(rws[rk[i][0]].cells[rk[i][1]]); m.selAdd(rws[rk[i][2]].cells[rk[i][3]], 1); s = 1; }
else { m.selAdd(rws[rk[i][0]].cells[rk[i][1]]); m.selAdd(rws[rk[i][2]].cells[rk[i][3]], 1); }
}
//return this._selection.setRectsByPosition(recps,this.grid);
}
po.selRemove = function (td) {
var m = this, se = m._selection;
if (m.wholeRowSelection) td = getTR(td).cells[0];
se.remove(td);
m.nummDlgShowDtl();
}
po.selClear = function () {
var m = this; m._selection.clear();
if (m._checkboxSel) {
var trs = m.grid.rows;//getAllDataRows();
for (var r = 0; r < trs.length; r++) {
var inp = EmsByTag(trs[r], "INPUT");
if (inp.length > 0) inp[0].checked =false;
}
}
m._showPickButton(1);
}
po.selByCheckbox = function (su) {
var m = this, se = m._selection, td = getTD(su), tr = getTR(td), td0 = tr.cells[0], inp = EmsByTag(tr, "INPUT");
if (inp.length > 0) {
var tdN = getTD(inp[0]), ci = tdN.cellIndex, chkd;
if (tr.rowIndex != 0 && su != inp[0] && td != tdN) {if(inp[0].type=="radio") inp[0].checked = true; else inp[0].checked = !inp[0].checked;}
chkd = inp[0].checked;
if (tr.rowIndex == 0) {
var rws = this.grid.rows;
for (var r = m.rowBeginData(); r < rws.length; r++) {
inp = EmsByTag(rws[r], "INPUT");
if (inp.length > 0) {
inp[0].checked = chkd;
if (chkd) m.selAdd(rws[r].cells[0]); else m.selRemove(rws[r].cells[0]);
}
}
}
else if (chkd) m.selAdd(td0);
else m.selRemove(td0);
}
}
po.nummDlgShowDtl = function () {
var m = this, dg = m.nummDlg;
if (isHidden(dg)) return;
var trs0 = m._strsau(), trs1 = dg.cTRs;
if (!trs0 || !trs0.length) return;
if (trs0 && trs1 && trs0.length == trs1.length) {
var s = 1;
for (var i = 0; i < trs0.length; i++) {
if (trs0[i] != trs1[i]) { s = 0; break; }
}
if (s) return;
}
if (trs0.length > 6) trs0.length = 6;
dg.showDtl(trs0);
}
po.moveRows = function (tarIndex, aTR, steps) {
var m = this, sl = m._selection, ti = tarIndex, oTbl = this.grid, s = 0, r, rbd = m.rowBeginData();
if (!aTR) aTR = sl.getTRs(0);
if (aTR.length == 0) return;
if (ti == null) {
if (steps < 0) ti = aTR[0].rowIndex + steps; else ti = aTR[aTR.length - 1].rowIndex + steps;
}
if (ti < m.rowBeginData()) return;
for (var i = 0; i < aTR.length; i++) {
if (aTR[i].rowIndex == ti || aTR[i].rowIndex < rbd) return;
}
for (var i = 0; i < aTR.length; i++) {
r = aTR[i].rowIndex;
try {
oTbl.moveRow(r, ti + s);
} catch (e) {
var opn = aTR[i].parentNode;
var tarTR = oTbl.rows[ti + s];
if (tarTR.rowIndex > r) { if (tarTR.rowIndex < oTbl.rows.length - 1) tarTR = tarTR.nextSibling; else tarTR = null; }
if (tarTR) opn.insertBefore(aTR[i], tarTR); else opn.appendChild(aTR[i]);
}
if (r >= ti) s += 1;
}
m.setRowColor(null, null, 1);
sl.setColor();
m.evtBroadcast("aftMoveRows", [m, tarIndex, aTR, steps]);
return true;
}
po.moveCols = function (tarIndex, TDs, steps) {
var m = this, sl = m._selection, ti = tarIndex, ni = m.colBeginData(), tarNm;
if (getAtr(m.grid,"colarrdnd")=="Y") return;
if (!TDs) TDs = sl.getTDs(1, 1, 1); if (TDs.length == 0) return;
if (ti == null) {
if (steps < 0) { ti = TDs[0].cellIndex + steps; if (ti < ni) ti = ni; }
else { ti = TDs[TDs.length - 1].cellIndex + steps; }
}
else if (ti < ni) return;
var tbl = m.grid, cs = tbl.rows[0].cells, h = cs.length, itms = new OpItems(), itms2 = new OpItems(),
mr = ti > TDs[0].cellIndex, opf;
if (ti >= h) ti = h - 1;
tarNm = cs[ti].id;
if (!tarNm) tarNm = cs[ti].opField.name;
for (var j = 0; j < TDs.length; j++) {
var ci=TDs[j].cellIndex;
if (ci< ni) return;
//opf = cs[TDs[j].id];
opf = cs[ci];
if (opf) opf = opf.opField;
if (!opf) continue;
itms2.add(opf);
}
if (!itms2.length || itms2.item(tarNm)) return;
for (var c = m.colBeginData(); c < cs.length; c++) {
var itm = cs[c].opField, fn = itm.name;
if (itms2.item(fn)) continue;
if (mr) itms.add(itm);
if (fn == tarNm) itms.concat(itms2);
if (!mr) itms.add(itm);
}
m.arrangeColumns(itms.getNames(","));
return true;
}
po.enableTextLengthHint = function (FieldName, lenLimit) {
var itm = this.fieldsAll.item(FieldName);
if (itm) itm._hintTextLen = lenLimit;
}
po.HintTextLength = function (surObj) {
if (mTimeoutIdForHintTestLen) { window.clearTimeout(mTimeoutIdForHintTestLen); mTimeoutIdForHintTestLen = 0; }
var m = this, o = surObj, itm, v, l;
if (!o) return;
if (o.tagName == "TD") { itm = m.getField(o); v = teTdGetValue(o); }
else { itm = m.getField(m.CellsEditing ? m.CellsEditing[0] : m.mainTD()); v = o.value; }
if (!itm || !itm._hintTextLen || itm.dataType != GDT.String) return cmnHintTxtLen("");
l = itm._hintTextLen;
mTimeoutIdForHintTestLen = window.setTimeout(function () { teHintTextLenDo(o, l); }, 100);
}

po.arrangeColumns = function (sNmList, booSaveProfile) {
tegMenuHide();
var m = this, oTbl = m.grid, flds = m.fieldsAll, al = flds.length;
if (!oTbl || !oTbl.rows || oTbl.rows.length == 0) return;
var cs0 = oTbl.rows[0].cells, cbd = m.colBeginData(),
headsF = m.getFields(); //, se = m._selection.getRectsPosition();m._selection.clear();
if (!sNmList) {
if (m.lockColumns) return alert("Disallowed!");
var nm = "dlgArnColOf" + oTbl.id;
var o = document.getElementById(nm); if (o) { return toZTop(o); }
var shwFldNm = false, ev = GJT.event();
if (ev && ev.shiftKey) {
var pvg = m.programPrivilege;
shwFldNm = hasBit(pvg, PPVG.AdminUser);
}
var so = selItems(nm, i18nm.tlArrangeCol.text + " " + m.text, flds, headsF, 600, 550, handleArngCols,0,0,shwFldNm), dg = so.dlgCtrl.dlg; //getCaption(oTbl)
so.tarObject = m;
dg.besideMouse = 1;
//showBesideMouse(dg, -dg.offsetWidth / 2);
return so.setModal(true);
}
sNmList = sNmList.replace(new RegExp(KW.dmlN + KW.dmlN, "gi"), KW.dmlN);
if (sNmList.lastIndexOf(KW.dmlN) == sNmList.length - 1) { sNmList = sNmList.substring(0, sNmList.length - 1); }
if (sNmList == null || sNmList == "") return true;
var colsx = m._getColsStylesText();
if(m.bfrArrangeColumns){if(m.bfrArrangeColumns(sNmList,sNmList.split(KW.dmlN))) return;}
if (booSaveProfile == null || booSaveProfile == true) teSaveUserSetting(oTbl, KW.ColumnsList, sNmList);
var saNmLst = sNmList.split(KW.dmlN), sl = saNmLst.length, intSelIdx_Old = [], intSelIdx_All = [],
chrn = oTbl.children, oFragM = document.createDocumentFragment(), fgm = document.createDocumentFragment(), itmsAdded = new OpItems(), clrd;
for (var i = 0; i < sl; i++) {
intSelIdx_Old[i] = -1; intSelIdx_All[i] = -1;
for (var j = 0; j < headsF.length; j++) { if (headsF.item(j).name == saNmLst[i]) { intSelIdx_Old[i] = j + cbd; break; } }
for (var j = 0; j < al; j++) { if (flds.item(j).name == saNmLst[i]) { intSelIdx_All[i] = j; break; } }
}
while (chrn.length > 0) { oFragM.appendChild(chrn[0]); }
chrn = oFragM.childNodes;
for (var h = 0; h < chrn.length; h++) {
var chi = chrn[h], tgn = chi.tagName;
if (tgn == "COLGROUP") {
var colgrp = chi, MyCols = chi.children; //getElementsByTagName("COL"),
aH = [], cl = MyCols.length;
for (var i = 0; i < cl; i++) { aH[i] = MyCols[i]; } //must keep in array, MyCols will change when append or remove
for (i = 0; i < cbd; i++) {
if (aH.length > i) { fgm.appendChild(aH[i]); } else { fgm.appendChild(newEm("COL")); }
}
//column has no outerHTML property
for (i = 0; i < sl; i++) {
if (intSelIdx_Old[i] != -1 && aH.length > intSelIdx_Old[i]) {
fgm.appendChild(aH[intSelIdx_Old[i]]);
} else {
var idx = intSelIdx_All[i];
if (idx < 0) {
fgm.appendChild(newEm("COL")); //new item not exist in available items use a blank column instead
} else {
var itm = flds.item(idx), atr = itm.opConfig;
if (hasBit(atr, GIA.OutPutDenied)) {
} else if (hasBit(atr.opCnfig, GIA.Hidden)) {
var c = newEm("COL"); hideIt(c);
fgm.appendChild(c);
} else {
fgm.appendChild(newEm("COL"));
}
}
}
}
while (colgrp.children.length > 0) { colgrp.removeChild(colgrp.lastChild); }
colgrp.appendChild(fgm);
}
else if (tgn == "TBODY" || tgn == "THEAD") {
var allrows = chi.children, rl = allrows.length;
for (var r = 0; r < rl; r++) {
var oTR = allrows[r], oaTD = [], cc = oTR.children, cl = cc.length;
if(cl==0)continue;
for (var i = 0; i < cl; i++) { oaTD[i] = cc[i]; }
for (var i = 0; i < cbd; i++) { fgm.appendChild(oaTD[i]); }
for (i = 0; i < sl; i++) {
if (intSelIdx_Old[i] != -1) {
fgm.appendChild(oaTD[intSelIdx_Old[i]]);
} else {
var idx = intSelIdx_All[i];
if (idx < 0) {
var oTD = newEm("TD");
if (r == 0 && tgn == "THEAD") {
setAtr(oTD, "name", saNmLst[i]);
setAtr(oTD, "id", saNmLst[i]);
setAtr(oTD, KW.opAttr, GIA.Virtual);
setAtr(oTD, KW.opDataType, GDT.String);
oTD.innerHTML = "<span style=\"overflow-x:hidden;background-color:\">" + saNmLst[i] + "</span>";
oTD.opField = new OpItem(saNmLst[i], saNmLst[i], GDT.String, GIA.Virtual);
}
fgm.appendChild(oTD);
} else {
var itm = flds.item(idx), atr = itm.opConfig;
if (hasBit(atr, GIA.OutPutDenied)) {
} else {
var oTD = newEm("TD");
if (r == 0 && tgn == "THEAD") {
setAtr(oTD, "name", itm.fieldName);
setAtr(oTD, "id", itm.name);
setAtr(oTD, KW.opAttr, atr);
setAtr(oTD, KW.opDataType, itm.dataType);
setAtr(oTD, KW.Caption, itm.text);
if (itm.choice) setAtr(oTD, KW.Choice, itm.choice);
if (itm.ctrlId) setAtr(oTD, KW.ControllerId, itm.ctrlId);
if (itm.tip) setAtr(oTD, "title", itm.tip);
if (itm.displayFormat) setAtr(oTD, KW.DspFormat, itm.displayFormat);
if (!hasBit(atr, GIA.WriteDenied)) oTD.style.fontWeight = "bold";
oTD.innerHTML = "<span style=\"overflow-x:hidden;\">" + GJT.encodeAttr(itm.text) + "</span>";
oTD.opField = itm;
if (!hasBit(atr, GIA.Virtual)) itmsAdded.add(itm);
}
fgm.appendChild(oTD);
}
}
}
}
while (oTR.children.length > 0) {
if (!clrd) { m.selClear(); clrd = 1; }
oTR.removeChild(oTR.lastChild);
}
oTR.appendChild(fgm);
}
}
}
oTbl.appendChild(oFragM);
GJT.stopBubble();
m._clearOpsCache();
oTbl.saveColumnsArrange = true;
m.CriterionAreaShow(true);
m._RestoreColsStyles(colsx);
m._mkTxtAlign();
m.floatHeader(m._ftb);
if (itmsAdded.length > 0) m.refreshRows(m.getAllDataTRs(), null, itmsAdded);
//m._selection.setRectsByPosition(se, oTbl);
if (booSaveProfile == null || booSaveProfile == true) m.saveColWidth();
if (m.aftArrangeColumns) { m.aftArrangeColumns(sNmList, sNmList.split(KW.dmlN)); }
return oTbl;
}
po._clearOpsCache = function () {
var m = this, fci = m._getFCI();
if (fci) { for (var i = 0; i < fci.length; i++) { delete fci[i].prm; delete fci[i].prmSt; } } //clear condition format cache
fci = m._getFLS();
if (fci) { for (var i = 0; i < fci.length; i++) { delete fci[i].prm; } }
}
po.showRows = function (_hideIt, _tarTRs) {
var m = this, se = _tarTRs, ca = _hideIt ? hideIt : showIt;
if (!se) se = m._selection;
if (se instanceof teRange) se = se.getDataTRs();
for (var i = 0; i < se.length; i++) { ca(se[i]); }
}
po.showColumns = function (_hideIt, _selcols, _NoSaveProfile) {
var m = this, gd = m.grid, AllCols = gd.getElementsByTagName("COL"); if (AllCols == null) return; ;
var AllHeads = tbGetHeads(gd), dsp = "", PtyToSet = "display", dspTD = "", selcols = _selcols;
if (!_selcols) _selcols = m._selection;
if (_selcols instanceof teRange) {
var tds = _selcols.getDataTDs(1, 1, 1);
selcols = [];
for (var i = 0; i < tds.length; i++) {
selcols.push(tds[i].cellIndex);
}
}
try {
for (var i = 0; i < selcols.length; i++) {
var st = m.getColStyle(selcols[i]);
if (st) st.display = _hideIt ? "none" : "";
}
var fh = [];
var cl = gd.rows[0].cells.length;
for (var i = 0; i < cl; i++) {
if (m.getColStyle(i).display == "none") fh.push(AllHeads[i].id);
}
if (!_NoSaveProfile) { teSaveUserSetting(gd, "ColDspNone", fh.join(",")); }
return;
}
catch (ex) { }
if (BWRT.IE == GJT.browserType && false) {//new IE no support col hidden
PtyToSet = "display";
if (_hideIt) { dsp = "none"; dspTD = "none"; }
} else {
PtyToSet = "visibility";
if (_hideIt) { dsp = "collapse"; dspTD = "none"; }
}
for (var i = 0; i < selcols.length; i++) {
//Note,if there is any rows display set to none,the IE will become very slow when hide a COL,any column can be invisible for user
var ci = selcols[i], itm = m.getField(AllHeads[ci]);
if (!itm || !hasBit(itm.opConfig, GIA.Hidden)) {
if (AllCols.length > ci) {
if (PtyToSet == "display") {
AllCols[ci].style.display = dsp;
} else if (PtyToSet == "visibility") {
showIt(AllCols[ci]); //FireFox must let display not none to make visibility be effected
AllCols[ci].style.visibility = dsp;
if (GJT.browserType != BWRT.FIREFOX) {//till now only FireFox support W3C visibility collapse specification,
//hide/Show all TD in col
var rws = gd.rows;
for (var j = 0; j < rws.length; j++) {
rws[j].cells[ci].style.display = dspTD;
}
}
}
}
}
}
var fh = [];
var AllCols = gd.getElementsByTagName("COL");
for (var i = 0; i < AllCols.length; i++) {
if (PtyToSet == "display") { if (AllCols[i].style.display == "none") fh.push(AllHeads[i].id); }
else if (PtyToSet == "visibility") { if (AllCols[i].style.visibility == "collapse") fh.push(AllHeads[i].id); }
}
if (!_NoSaveProfile) { teSaveUserSetting(gd, "ColDspNone", fh.join(",")); }
}
po.hideColumnsUser = function () {
if (BWRT.IE == GJT.browserType && false) return;
var t = this.grid, cols = t.getElementsByTagName("COL");
var selCols = [];
for (var j = 0; j < cols.length; j++) {
if (cols[j].style.display == "none" || cols[j].style.visibility == "collapse") {
selCols.push(j);
}
}
if (selCols.length > 0) this.showColumns(true, selCols, true);
}
po.changeColWidth = function (TDs, newValue, byIncrement, bestFit, chkTitleRow) {
var m = this, tbl = m.grid, COLs = EmsByTag(tbl, "COL"), rw0 = tbl.rows[0];
for (var i = 0; i < TDs.length; i++) {
var oTD = rw0.cells[TDs[i].cellIndex], ci = oTD.cellIndex, MyCol = COLs[ci], newWidth = 0;
if (!MyCol) MyCol = oTD;
if (!oTD) continue;
var colst = m.getColStyle(ci), olw = parseInt(oTD.offsetWidth);
if (bestFit) {
} else if (byIncrement) {
newWidth = olw + parseInt(newValue);
} else { newWidth = newValue; }
if (newWidth <= 1) newWidth = 2;
if (!bestFit) {
MyCol.style.width = toPx(newWidth); MyCol.widthByUser = newWidth;
if (colst) {
colst.width = toPx(newWidth); if (newWidth < olw * 2 / 3) colst.whiteSpace = "pre-wrap";
colst.wordBreak = "break-all";
//colst.wordWrap = "break-word";
//colst.textOverflow ="ellipsis";
}
}
if (oTD.children.length > 0) {
var MyDiv = oTD.children[0], stl = MyDiv.style;
if (MyDiv.tagName == "SPAN") {
if (chkTitleRow) { stl.display = ""; stl.overflowX = "visible"; } else { stl.display = "none"; stl.overflowX = "hidden"; }
oTD.noWrap = true; oTD.style.width = toPx(newWidth);
if (oTD.clientWidth > 0) { stl.width = toPx(oTD.clientWidth); stl.display = ""; }
}
} else { oTD.noWrap = bestFit; }
}
}
po.saveColWidth = function () {
var m = this, tbl = m.grid, tds = tbl.rows[0].cells,aw=[];
for(var i=m.colBeginData();i<tds.length;i++){
aw.push(tds[i].style.width);
}
teSaveUserSetting(tbl, "colwdtxx", aw.join(","));
}
po.setColWidthByProfile=function(){
var m = this, tbl = m.grid,aw=getAtr(tbl,"colwdtxx"),k=0;if(!aw)return;
var r=tbl.rows[0];if(!r)return;
var tds = r.cells;
aw=aw.split(",");
for(var i=m.colBeginData();i<tds.length;i++){
if (aw[k]) {
var otd = tds[i], olw = parseInt(otd.offsetWidth);
otd.style.width = aw[k];
if (parseInt(aw[k], 10) < olw * 2 / 3) {
var colst = m.getColStyle(i);
if (!colst) continue;
colst.width = aw[k];
colst.whiteSpace = "pre-wrap";
}
}
k++;
}
}
po.changeRowsHeight = function (TRs, newHgt, byIncrement) {
for (var i = 0; i < TRs.length; i++) {
var oTR = TRs[i], nv1 = newHgt; if (byIncrement) nv1 += parseInt(oTR.offsetHeight);
if (nv1 > 0) oTR.style.height = toPx(nv1);
}
}
po.showToolsInPlace = function () {
var m = this, p = m.parent;
if (p && p.opEvent && BWRT.FIREFOX != GJT.browserType) return p.opEvent(m, EVI.NotifyExecute, [CMDE.ContextTool, 0]);
else return m.opExecute(CMDE.ContextTool);
}
po.evtEditBox = function () {
var ev = GJT.event(), su = GJT.eventSrc(ev), m = this, ty = ev.type, itm;
GJT.stopBubble(ev);
if (m.CellsEditing) itm = m.getField(m.CellsEditing[0]);
if (ty == "keydown") {
var kcode = GJT.eventKeyCode(ev);
if (kcode == 113) m.endEdit();
else if (kcode == 13 && ev.ctrlKey) m.endEdit();
else if (kcode == 8) m.HintTextLength(su);
else if (kcode == 27) {su.isCanceled = true;m.cancelEdit();return;}
}
else if (ty == "keypress") {
var chrCode = GJT.eventKeyCode(ev);//document.title=chrCode;
switch (chrCode) {
case 13:
if (!hasBit(itm.opConfig, GIA.MultiLine)) {
//because if a alertA message is show the EditTextbox will fire a onblur event,so it must set flag before end edit
//su.blur(); //Never use blur, problems of event sequence
//ev.returnValue = false;
cmnEvtSetReturn(0, ev);
su.isCanceled = true; //prevent onblur do endedit again
m.endEdit();
//var tds=m._selection.getTDs(),tdm=m.mainTD();
//if (tds.length == 1 && tdm == tds[0]) {
// var tr = getTR(tdm).nextSibling, ntdm = tr ? tr.cells[tdm.cellIndex] : null;
// if(ntdm)m.sel(ntdm);
//}
}
break;
case 27:
m.cancelEdit(); break;
case 8:
break;
default:
var maxlen = itm.maxLength;
if (maxlen != 0) { if (su.value.length >= maxlen) cmnEvtSetReturn(0, ev); } // ev.returnValue = false;
if (chrCode > 31) {
if (cmnIsCharTypeCorrect(String.fromCharCode(chrCode), itm.dataType) == false) cmnEvtSetReturn(0, ev); // ev.returnValue = false;
if (chrCode > 96 && chrCode < 123) {
if (hasBit(itm.opConfig, GIA.UpperCaseOnly)) ev.keyCode = chrCode - 32;
}
}
break;
}
m.HintTextLength(su);
}
else if (ty == "blur") {//teHintTextLenAutoSet();
//ev.returnValue = false;
cmnEvtSetReturn(0, ev);
if (!su.isCanceled) m.endEdit();
}
}
po._aftUndo = function (tds) {
this.shwFgnDataTds(tds);
}
po._doUndo = function (td, myHtml) {
var itm = this.getField(td);
if (hasBit(itm.opConfig, GIA.ValueIsOuterHTML)) this.tdSetValue(td, myHtml, true, false, itm);
else {
var kpo = hasBit(itm.opConfig, GIA.UseCheckboxAsUI);
if (kpo) { var o2 = newEm("div"); o2.innerHTML = myHtml; nv = getAtr(o2.children[0], "vkKx"); return this.tdSetValue(td, nv); }
var od = td.innerHTML;
td.innerHTML = myHtml;
var nv = teTdGetValue(td);
td.innerHTML = od;
this.tdSetValue(td, nv);
}
}
po.pushUndo = function (rng) {
var m = this;
if (!rng) rng = m._selection;
m._undoCtrl.push(rng);
}
po.pullUndo = function (steps) {
this._undoCtrl.pull(steps);
}
po.addField = function (name, text, tip, datatype, opconfig, addColumn, forceShow, index) {
var m = this, fa = m.fieldsAll, itm = fa[name];
if (itm) { if (!forceShow) return; }
else {
itm = new OpItem(name, text, tip, datatype, (opconfig ? opconfig : 0) | GIA.Virtual);
itm.fieldName = name;
fa.add(itm);
}
if (addColumn) {
var itms = m.getFields();
if (!itms[name]) {
if (index != null) itms.insert(itm, index);
else itms.add(itm);
m.arrangeColumns(itms.getNames(","), 0);
}
}
return itm;
}
po.evtOutter = function (ev) {//攔截自身以外的其他事件,用於特殊控制
if (!ev) ev = GJT.event();
var ty = ev.type;
if (m.resizing) {
if (ty == "mousemove") {
if (GJT.isButtonDownLeft()) { }
}
document.title = ev.clientX;
}
}
po.evtGridArea = function (ev) {
if (!ev) ev = GJT.event();
var su = GJT.eventSrc(ev), m = this, td = getTD(su), tdf; if (td && td.srtd) { tdf = td; td = td.srtd };
var sl = m._selection, ty = ev.type, tr = td ? td.parentNode : null, tbl = m.grid, st = tbl.style;
//document.title = ty + "_" + Math.random();
if (!GJT.isDraging) GJT.stopBubble();
if (ty == "mousemove") {
//if (!td) return;
//if (GJT.isButtonDownRight()){
// if(!GJT.isDraging){
// GJT.isDraging = 1;GJT.Draging = this;
// }
// return; //This cause Chrome failed to select cells
//}
if (GJT.isButtonDownLeft()) {
//document.title = ev.x + "..";
m._showPickButton(1);
if (st.cursor == "col-resize" || st.cursor == "row-resize") {
} else {
if (m._checkboxSel) return;
if (!GJT.isButtonDownLeft() || !m.enableSelect || GJT.isDraging) return;
if(td) m.selAdd(td, true);
}
} else if (!GJT.isRightButton()) {// && !tdf
m.resizing = false;
if (!td) { }
else if (td.cellIndex == 0) {
if (teIsInResizeArea(td, null)) { st.cursor = "row-resize"; } else if (teIsInResizeArea(td, tr)) { st.cursor = "col-resize"; } else { st.cursor = "default"; }
} else if (tr.rowIndex == 0) {
if (teIsInResizeArea(td, tr)) { st.cursor = "col-resize"; } else { st.cursor = "default"; }
} else { st.cursor = "default"; }
if (tdf) { getTable(tdf).style.cursor = st.cursor; }
}
// } else if (ty == "mouseover") {//mouseover事件無法判斷鼠按鍵
// } else if (ty == "mouseout") {
} else if (ty == "mousedown") {
tegMenuHide(); hideIt(m.criterionButtons);
if (!td) return;
if (GJT.isLeftButton()) {
if (st.cursor == "col-resize") {
m.DragX = ev.clientX; m.resizingTD = td; m.resizing = true;
addEVt4Drag(teHtm(), m._getGrdEvtHnd(), 1);
} else if (st.cursor == "row-resize") {
m.DragY = ev.clientY; m.resizingTD = td; m.resizing = true;
addEVt4Drag(teHtm(), m._getGrdEvtHnd(), 1);
} else {
m._SelByMD(ev, td);
}
} else if (GJT.isRightButton()) {
GJT.stopBubble(ev); m.noMenu = false; cmnEvtSetReturn(0, ev); // ev.returnValue = false;
var mtd = sl.mainTD();
if (tr.rowIndex == 0 && mtd && sl.isWholeCol(mtd) && !m.lockColumns) { if (m.moveCols(td.cellIndex)) m.noMenu = true; }
else if (td.cellIndex == 0 && mtd && sl.isWholeRow(mtd) && !m.lockRows) { if (m.moveRows(tr.rowIndex)) m.noMenu = true; }
}
} else if (ty == "mouseup") {
m.resizing = false;
rmvEvt4Drag(teHtm(), m._getGrdEvtHnd(), 1);
m._showPickButton(0);
if (!GJT.isLeftButton()) return;
if (m.DragX != null) {
var b = m.resizingTD, newval = (ev.clientX - m.DragX); m.DragX = null;
if (newval == 0 || !b) return;
m.changeColWidth([b], newval, true, false, ev.shiftKey);
if (sl.isWholeCol(b)) { var tds = sl.getTDs(); if (tds.contains(b)) m.changeColWidth(tds, b.offsetWidth, false, false, ev.shiftKey); }
m.saveColWidth();
if (tdf) ftSyncV(m.grid, m._ftb);
} else if (m.DragY != null) {
var b = m.resizingTD, newval = (ev.clientY - m.DragY); m.DragY = null;
if (newval == 0 || !b) return;
m.changeRowsHeight([getTR(b)], newval, true);
if (sl.isWholeRow(b)) m.changeRowsHeight(sl.getTRs(), getTR(b).offsetHeight);
}
if (!m.enableSelect && td && td.cellIndex == 0 && getTR(td).rowIndex == 0) selectElementContents(m.grid);
}
else if (ty == "click") {
if (su.tagName == "INPUT" && (su.type == "checkbox" || su.type == "radio")) {
m.selByCheckbox(su);
}
else if (su.tagName == "TD") {
//m._selByClick(ev, su);
if (m.CheckoutByUI(ev, su, 0)) return;
if (m.cellClick) {
var fldNm = m.getFieldName(su);
if (m.cellClick(m, su, fldNm)) return;
}
if (m.is4Pvt && td && td.cellIndex == 0 && getTR(td).rowIndex == 0) { m.switchSelMode(-1); selectElementContents(m.grid); }
else if (m.is4Pvt) m.switchSelMode(1);
}
}
else if (ty == "dblclick") {
if (!td) return;
if (m.CheckoutByUI(ev, su, 1)) return;
if (m.cellDblClick) { if (m.cellDblClick(m, td)) return; }
if (td.cellIndex == 0) {
if (tr.rowIndex == 0) {
} else if (teCmnGetAtr(KW.RelationItems, "") != "") {
return;
}
else if (tlSetSelValue(m)) return;
}
var f = m.opst ? m.opst.f4lvlindent : null, fd = m.getField(td);
if (f && fd && (f == fd.name || f == fd.fieldName)) {
m._shwLvlTool(1, [getTR(td)], 1);
}
if (!m._beginEdit(td, false, "")) m.expand4DblClk();
}
else if (ty == "keydown") {
if (!m.enableSelect) return;
if (m.EditBox == document.activeElement) return; //is editing
var key = GJT.eventKeyCode(ev), o = document.activeElement;
if (o && (o.tagName == "INPUT" || o.tagName == "TEXTAREA")) return;
if (m._selByKeyDown(key, ev)) return;
if (ev.ctrlKey) {
if (key == 67) m.copy();
else if (key == 68) m.fillUD();
else if (key == 83) m.saveData(0);
else if (key == 86) m.paste();
else if (key == 90) m.pullUndo();
else if (key == 65) m.sel(tbl.rows[0].cells[0]);
else return;
cmnEvtSetReturn(false, ev);
} else {
if (key == 45) m.insertRows();
else if (key == 46) m.setClipText(sl, "", true, true);
else if (key == 113) m._beginEdit();
}
}
else if (ty == "keyup") { }
else if (ty == "keypress") {
var kcode = GJT.eventKeyCode(ev), o = document.activeElement;
if (o && (o.tagName == "INPUT" || o.tagName == "TEXTAREA")) return;
//if (kcode == 27) return m.selClear();
if (ev.charCode == 0) {//FireFox raise keypress after keydown immediately even though keyboard not released yet
}
else if (kcode > 31) {
if (m.visible()) {
td = m.mainTD(); if (!td) return;
var MyChar = String.fromCharCode(kcode), itm = m.getField(td), dtype = itm ? itm.dataType : 0, cfg = itm ? itm.opConfig : 0;
if (hasBit(cfg, GIA.UpperCaseOnly)) MyChar = MyChar.toUpperCase();
if (!cmnIsCharTypeCorrect(MyChar, dtype)) { cmnEvtSetReturn(0, ev); } // ev.returnValue = false; return; }
m._beginEdit(null, true, MyChar);
GJT.stopBubble(); cmnEvtSetReturn(false);
}
}
}
else if (ty == "focus") {
var k = 0;
}
else if (ty == "selectstart") { if (m.enableSelect) { cmnEvtSetReturn(false); GJT.stopBubble(); return false;} }
else if (ty == "dragstart") {
if (m.resizing) { cmnEvtSetReturn(false); GJT.stopBubble(); }
}
else if (ty == "beforepaste") { cmnEvtSetReturn(false); }
else if (ty == "scroll" || ty == "resize") {
m.ReviseFTR0();
} else if (ty == "paste") {
cmnEvtSetReturn(false);
m.paste();
}
else if (ty == "contextmenu") {
if (!ev.ctrlKey && m.enableSelect) {
if (!m.noMenu) { m.showToolsInPlace(); }
if (ev.preventDefault) ev.preventDefault();
return false;
}
}
}
po.setClipText = function (range, data, KeepUndo, CheckPvg, bKeepFormat, pasteInsert, bInclHidden) {
//CheckPvg means to check wether the cell is editable
if (data == null) return;
var m = this, oTbl = m.grid, allrows = oTbl.rows, se = range ? range : m._selection,
aTDs = se.getDataTDsOROA(1, 1), pasteAll = (aTDs.length == 1 && aTDs[0].length == 1 && aTDs[0][0].length == 1),
isDom = (data.nodeName == "#document-fragment" || data.tagName);
if (!aTDs.length) return;
if (isDom) {//未完成
return;
}
var rowDat, noRp, chkQuot = data.indexOf("\"") > -1 && data.indexOf("\n") > -1;
if (data.indexOf("\r\n") < 0 && data.indexOf("\"") == 0 && data.substring(data.length - 1, data.length) == "\"") rowDat = [data];
else if (data.indexOf("\r\n") >= 0) rowDat = data.split("\r\n"); else rowDat = data.split("\n");
var rwU = rowDat.length, td, doApnd;
for (var i = 0; i < rwU; i++) {
rowDat[i] = rowDat[i].split("\t");
if (chkQuot) {
for (var j = 0; j < rowDat[i].length; j++) {
var xx = rowDat[i][j];
if (xx.indexOf("\"") == 0 && xx.indexOf("\n") > 0 && xx.substring(xx.length - 1, xx.length) == "\"")
rowDat[i][j] = xx.substring(1, xx.length - 1).replace(/\"\"/gi, "\"");
}
}
}
if (pasteAll || pasteInsert) {
if (aTDs[0].length) td = aTDs[0][0][0];
else if (pasteInsert) {
td = se.mainTD(); if (!td) return;
td = oTbl.rows[oTbl.rows.length - 1].cells[td.cellIndex];
doApnd = 1;
}
else return;
var tr = getTR(td), a = [], c = td.cellIndex, mx = 0, chkHdn = !pasteInsert && !bInclHidden;
if (pasteInsert) {
var nrs = m.insertRows(rwU, tr.rowIndex, doApnd);
if (!nrs) return;
tr = nrs[0]; td = tr.cells[c];
}
if (chkHdn && isHidden(td)) return;
se.sel(td); noRp = 1;
for (var i = 0; i < rwU; i++) {
while (true) {
var a1 = [], k, cs = tr.cells, cl = cs.length, sht = 0;
for (var j = 0; j < rowDat[i].length; j++) {
k = c + j + sht;
if (chkHdn) {
while (cs[k] && isHidden(cs[k]))
{ sht++; k = c + j + sht; }
}
if (k >= cl) break;
if (!chkHdn || !isHidden(cs[k])) { a1.push(cs[k]); if (mx < k) mx = k; }
}
if (a1.length > 0) { a.push(a1); td = cs[mx]; break; }
tr = tr.nextSibling; if (!tr) break;
}
if (!tr) break;
tr = tr.nextSibling; if (!tr) break;
}
se.add(td, true);
aTDs = [a];
}
else if (!bInclHidden) {
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i];
for (var r = 0; r < a1.length; r++) {
for (var k = 0; k < a1[r].length; k++) {
if (isHidden(a1[r][k])) { a1[r].splice(k, 1); k--; }
}
if (a1[r].length == 0) { a1.splice(r, 1); r--; }
}
if (a1.length == 0) { aTDs.splice(i, 1); i--; }
}
if (aTDs.length == 0) return;
}
if (KeepUndo) m.pushUndo(se);
var alrtd = [], fgTDs = [];
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i], a2 = a1[0], itm, cfg = [], dtype = [], cpt = [], vmp = [], vmo = [];
for (var k = 0; k < a2.length; k++) {
itm = m.getField(a2[k]);
cfg.push(itm.opConfig); dtype.push(itm.dataType); cpt.push(itm.text); vmo.push(itm.valuesMap); vmp.push(itm.valuesMapRvs);
}
for (var j = 0; j < a1.length; j++) {
var a2 = a1[j], ru = j % rwU, rul = rowDat[ru].length, tr = getTR(a2[0]); //row
for (var k = 0; k < a2.length; k++) {
if (CheckPvg && !m.isChangeable(a2[k], false, cfg[k], a2[k], tr)) continue;
if (k >= rul && noRp) continue;
var v = teMapVal(vmo[k], rowDat[ru][k % rul]), ci = a2[k].cellIndex;
if (hasBit(cfg[k], GIA.UpperCaseOnly)) v = v.toUpperCase();
if (dtype[k] == GDT.Integer || dtype[k] == GDT.Real || dtype[k] == GDT.Short) {
if (v && v.toString().indexOf("%") > 0) {
v = teDeformatNumDo(v);
}
}

if (!m.tdSetValueCheckDo(a2[k], v, !alrtd.contains(ci), cfg[k], dtype[k], cpt[k], vmp[k])) {
if (!alrtd.contains(ci)) alrtd.push(ci);
} else fgTDs.push(a2[k]);
}
}
}
m.shwFgnDataTds(fgTDs);
return true;
}
po.getClipText = function (range, withTitle, getDOM, bInclHidden) {
if (!range) range = this._selection;
var m = this, aTDs = range.getTDsOROA(1, 1), u = aTDs.length, td = aTDs[0][0][0],
wholeTbl = td.cellIndex == 0 && td.parentNode.rowIndex == 0, nqb = m._noQryBar(),
rbd = m.rowBeginData(), cbd = m.colBeginData(), tbl = m.grid, rws = tbl.rows, x = [], fg, h, cnt = 0; //aTDs是三層式陣列[][][]
if (getDOM) fg = document.createDocumentFragment();
for (var i = 0; i < u; i++) {//Rect
var nT, nTH, nTB, nTF, nTC = null, oTC, nR, a1 = aTDs[i], ar = a1[0], tr = ar[0].parentNode, wholeCol = tr.rowIndex == 0 && a1.length == 1 || wholeTbl;
if (!bInclHidden) {
//移除隱藏的
for (var r = 0; r < a1.length; r++) {
for (var k = 0; k < a1[r].length; k++) {
if (isHidden(a1[r][k])) { a1[r].splice(k, 1); k--; }
}
if (a1[r].length == 0) { a1.splice(r, 1); r--; }
}
if (a1.length == 0) continue;
}
if (wholeCol) {//將所有列都加入
for (var r = rbd; r < rws.length; r++) {
var res = [], tr = rws[r];
for (var k = 0; k < ar.length; k++) {
var tdn = tr.cells[ar[k].cellIndex];
if (bInclHidden || !isHidden(tdn)) res.push(tdn);
}
if (res.length > 0) a1.push(res);
}
if (!withTitle) a1.splice(0, 1); //移除第一列
} else if (withTitle) {
//加入第一列
var res = [], tr = rws[0];
for (var k = 0; k < ar.length; k++) {
var tdn = tr.cells[ar[k].cellIndex];
if (bInclHidden || !isHidden(tdn)) res.push(tdn);
}
a1.splice(0, 0, res);
}
var v = a1.length, a2 = a1[0], wholeRow = a2.length == 1 && a2[0].cellIndex == 0;
if (getDOM) {
nT = fg.appendChild(tbl.cloneNode(false));
//clone required node
var chn = tbl.children;
for (var k = 0; k < chn.length; k++) {
if (chn[k].tagName == "COLGROUP") {
if (chn[k].children.length > 0) { oTC = chn[k]; nTC = nT.appendChild(oTC.cloneNode(false)); }
} else if (chn[k].tagName == "THEAD") {
nTH = nT.appendChild(chn[k].cloneNode(false));
} else if (chn[k].tagName == "TBODY") {
nTB = nT.appendChild(chn[k].cloneNode(false));
} else if (chn[k].tagName == "TFOOT") {
nTF = nT.appendChild(chn[k].cloneNode(false));
}
}
}
else if (i > 0) x.push("\r\n");
cnt = 0;
for (var j = 0; j < v; j++) {//row
var a2 = a1[j], w = a2.length, tr = a2[0].parentNode;
if (wholeRow) {
var cels = tr.cells; a2 = []; w = cels.length;
for (var k = cbd; k < w; k++) {
if (bInclHidden || !isHidden(cels[k])) a2.push(cels[k]);
}
w = a2.length;
}
if (getDOM) {
if (nTC) {//加入COL
for (var k = 0; k < w; k++) {
h = a2[k].cellIndex;
if (oTC.children[h]) nTC.appendChild(oTC.children[h].cloneNode(false));
}
nTC = null;
}
var pn = tr.parentNode, nTP;
nR = tr.cloneNode(false);
if (pn.tagName == "TBODY") nTB.appendChild(nR);
else if (pn.tagName == "THEAD") nTH.appendChild(nR);
else if (pn.tagName == "TFOOT") nTF.appendChild(nR);
for (var k = 0; k < w; k++) {
var nD = nR.appendChild(a2[k].cloneNode(false));
nD.innerHTML = a2[k].innerHTML;
}
}
else {
if (cnt > 0) x.push("\r\n");
cnt = 0;
if (a2.length > 0) {
cnt = 1;
for (var k = 0; k < w; k++) {//cells
var txt = teTdGetValue(a2[k]);
var ixt = txt.lastIndexOf("\t");//2018/10/22 Chrome ver 70.0.3538.67 的innerText
if (ixt == txt.length - 1) txt = txt.substring(0, ixt);
if (txt.indexOf("\n") > -1) {
txt = "\"" + txt.replace(/\r/g, "").replace(/\"/g, "\"\"") + "\"";
}
if (k == 0) x.push(txt); else x.push("\t", txt);
}
}
}
}
}
if (getDOM) return fg;
if (x.length == 1 && x[0].indexOf("\n") > -1) { x[0] = x[0].substring(1, x[0].length - 1); }
return x.join("");
} //end getClipText
po.copy = function (withTitle, bKeepFormat, booToNewWindow, bInclHidden) {
var m = this, se = m._selection, oTD = se.mainTD();
if (m.bfrCopy) { if (m.bfrCopy(m, withTitle, bKeepFormat)) return; }
if (!m.enableSelect) {
var s = document.selection;
if (!s) s = document.getSelection();
if (s.type != "none") { var txtrng = s.createRange(); txtrng.execCommand("Copy"); }
if (m.aftCopy) m.aftCopy(m, withTitle, bKeepFormat);
return;
} else if (!oTD) return;
if (bKeepFormat) {
var oTbl = m.grid;
se.setColor(true); //prevent hili color copied
if (withTitle && oTD == oTbl.rows[0].cells[0]) {
try {
var brng = BDY().createControlRange();
rng.add(oTbl); rng.execCommand("Copy");
return;
} catch (e3) {
}
}
mContentHTMLCopied = m.getClipText(se, withTitle, bKeepFormat, bInclHidden);
if (mContentHTMLCopied) teCopyToClipboard(mContentHTMLCopied);
se.setColor(false);
} else {
mContentCopied = m.getClipText(se, withTitle, 0, bInclHidden);
teCopyToClipboard(mContentCopied);
}
if (m.aftCopy) m.aftCopy(m, withTitle, bKeepFormat);
}
po.copyDataRowURL = function () {
var m = this,fk=m.fieldsKey;
if (fk.length != 1) return alert("Sorry! This grid doesn't support this function.");
var v = m.getFieldValues(fk[0].name);
var lo = document.location, url = lo.href, ix = url.indexOf("&tdts");
if (ix > 0) url = url.substring(0, ix);
var tt = (lo.search ? "&" : "?") + "tdts=" + m.id + "&tarrow=" + v.join(",");
var url2 = url + tt;
teCopyToClipboard(url2);
var txt = window.prompt("Input text for this URL", "");
if(txt) teShowAnchorInDlg("", "", url2, txt);
}
po.paste = function (useHtml, bPasteInsert) {
var m = this, se = m._selection;
try {
if (useHtml) {
if (mContentHTMLCopied != null) return m.setClipText(se, mContentHTMLCopied, true, true, true, bPasteInsert);
} else {
var evt = GJT.event(), clpData;
if (GJT.browserType == BWRT.IE) clpData = window.clipboardData;
else { clpData = evt.clipboardData; }
var MyCpy = clpData.getData("Text");
if (MyCpy != null && MyCpy != "") mContentCopied = MyCpy;
MyCpy = mContentCopied;
if (MyCpy == null) return;
if (MyCpy.lastIndexOf("\n") == MyCpy.length - 1) {
MyCpy = MyCpy.substring(0, MyCpy.length - 1);
if (MyCpy.lastIndexOf("\r") == MyCpy.length - 1) MyCpy = MyCpy.substring(0, MyCpy.length - 1);
}
m.setClipText(se, MyCpy, true, true, true, bPasteInsert);
}
} catch (e) {
cmnShowPasteDlg(bPasteInsert, m);
}
}
po.clearRange = function (range, _ignorePvg, noUndo) {
var m = this, se = range;
if (!se) se = m._selection;
m.setClipText(se, "", true, true);
}
po.fillUD = function (range, autoIncrease, _ignorePvg, noUndo, bInclHidden) {
var m = this, se = range, doIncr = autoIncrease, fgTDs = [], increment;
if (!se) se = m._selection;
var aTDs = se.getDataTDsOROA(), alrtd = [];
if (!bInclHidden) {//除除隱藏格
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i];
for (var r = 0; r < a1.length; r++) {
for (var k = 0; k < a1[r].length; k++) {
if (isHidden(a1[r][k])) { a1[r].splice(k, 1); k--; }
}
if (a1[r].length == 0) { a1.splice(r, 1); r--; }
}
if (a1.length == 0) { aTDs.splice(i, 1); i--; }
}
if (aTDs.length == 0) return;
}
if (!noUndo) m.pushUndo(se);
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i], a20 = a1[0];
var incV = [], cfg = [], dtype = [], cpt = [], a21 = a1[1], suV = [], IncrByM = [], pfx = [],inclHMS=[],minLen=[];
for (var k = 0; k < a20.length; k++) {
var itm = m.getField(a20[k]);
cfg.push(itm.opConfig); dtype.push(itm.dataType); cpt.push(itm.text);
}
if (doIncr && a1.length > 1) {
pfx.length = a20.length;
for (var k = 0; k < a20.length; k++) {
var txt1 = teTdGetValue(a20[k]), txt2 = teTdGetValue(a21[k]);
minLen[k] = txt1.length;
if (txt2 == "" && increment == null) {
var incrDft = m.__incrdftVal; if (!incrDft) incrDft = 1;
increment = pFloat(prompt("Input increment", incrDft));
if (!increment) return;
m.__incrdftVal = increment;
}
if (dtype[k] == GDT.DateTime) {
var surDt = new Date(txt1), dt2 = new Date(txt2);
if (!isNaN(surDt)) {suV[k] = surDt.getTime();inclHMS[k]=txt1.indexOf(" ")>0;}
if (isNaN(dt2)) incV[k] = 86400000 * increment; //one day
else if (!isNaN(surDt)) {
incV[k] = dt2.getTime() - surDt.getTime();
if ((dt2.getDate() == surDt.getDate() && dt2.getHours() == surDt.getHours() && dt2.getMinutes() == surDt.getMinutes() && dt2.getSeconds() == surDt.getSeconds()) && dt2.getMonth() != surDt.getMonth()) {
IncrByM[k] = true; suV[k] = surDt;
incV[k] = (dt2.getMonth() - surDt.getMonth() + (dt2.getYear() - surDt.getYear()) * 12);
}
}
} else if (dtype[k] == GDT.Integer || dtype[k] == GDT.Real || dtype[k] == GDT.Short) {
suV[k] = pFloat(txt1);
if (txt2 == "") incV[k] = increment;
else if (isNaN(pFloat(txt2))) incV[k] = 1;
else if (!isNaN(suV[k])) { incV[k] = pFloat(txt2) - suV[k]; }
} else {
var idx = 0, idx2 = 0, cd = txt1.charCodeAt(idx);
while (cd > 57 || cd < 48) {
idx++; minLen[k]--;
if (idx >= txt1.length) break;
cd = txt1.charCodeAt(idx);
}
if (txt2 != "") {
cd = txt2.charCodeAt(idx2);
while (cd > 57 || cd < 48) {
idx2++; if (idx2 >= txt2.length) break;
cd = txt2.charCodeAt(idx2);
}
}
if (idx < txt1.length) {
suV[k] = pFloat(txt1.substring(idx));
pfx[k] = txt1.substring(0, idx);
incV[k] = 1;
if (txt2 != "" && idx2 < txt2.length) {
incV[k] = pFloat(txt2.substring(idx2)) - suV[k];
}
else if (increment) incV[k] = increment;
}
}

}
for (var j = 1; j < a1.length; j++) {
var a2 = a1[j], tr = getTR(a2[0]);
for (var k = 0; k < a20.length; k++) {
if (!_ignorePvg && !m.isChangeable(a2[k], false, cfg[k], a2[k], tr)) continue;
var nV = suV[k], ci = a2[k].cellIndex;
if (dtype[k] == GDT.DateTime) {
if (IncrByM[k]) {
nV = new Date(suV[k]);nV.setMonth(suV[k].getMonth() + incV[k] * j);
} else {
nV = new Date(suV[k] + incV[k] * j);
}
nV = inclHMS[k] ? nV.format("yyyy/MM/dd HH:mm:ss") : (nV.getFullYear() + "/" + (nV.getMonth() + 1) + "/" + nV.getDate());
} else {
nV = (suV[k] + incV[k] * j) + "";
if (minLen[k] > nV.length) { nV = (new Array(minLen[k] - nV.length+1).join("0")) + nV; } //補零
if (pfx[k] != null) nV = pfx[k] + nV;
}
if (!m.tdSetValueCheck(a2[k], nV, !alrtd.contains(ci))) {
if (!alrtd.contains(ci)) alrtd.push(ci);
} else fgTDs.push(a2[k]);
}
}
continue;
}
for (var j = 1; j < a1.length; j++) {
var a2 = a1[j];
for (var k = 0; k < a2.length; k++) {
if (!_ignorePvg && !m.isChangeable(a2[k], false, cfg[k], a2[k], tr)) continue;
var v = teTdGetValue(a20[k]), ci = a2[k].cellIndex;
if (!m.tdSetValueCheck(a2[k], v, !alrtd.contains(ci))) {
if (!alrtd.contains(ci)) alrtd.push(ci);
} else fgTDs.push(a2[k]);
}
}
}
m.shwFgnDataTds(fgTDs);
}
po.fillLR = function (range, _ignorePvg, noUndo, bInclHidden) {
var m = this, se = range;
if (!se) se = m._selection;
var aTDs = se.getDataTDsOROA(), alrtd = [], fgTDs = [];
if (!bInclHidden) {//除除隱藏格
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i];
for (var r = 0; r < a1.length; r++) {
for (var k = 0; k < a1[r].length; k++) {
if (isHidden(a1[r][k])) { a1[r].splice(k, 1); k--; }
}
if (a1[r].length == 0) { a1.splice(r, 1); r--; }
}
if (a1.length == 0) { aTDs.splice(i, 1); i--; }
}
if (aTDs.length == 0) return;
}
if (!noUndo) m.pushUndo(se);
for (var i = 0; i < aTDs.length; i++) {
var a1 = aTDs[i], a2 = a1[0], itm, cfg = [], dtype = [], cpt = [];
for (var k = 0; k < a2.length; k++) {
itm = m.getField(a2[k]);
cfg.push(itm.opConfig); dtype.push(itm.dataType); cpt.push(itm.text);
}
for (var j = 0; j < a1.length; j++) {
var a2 = a1[j], tr = getTR(a2[0]);
for (var k = 1; k < a2.length; k++) {
if (!_ignorePvg && !m.isChangeable(a2[k], false, cfg[k], a2[k], tr)) continue;
var v = teTdGetValue(a2[0]), ci = a2[k].cellIndex;
if (!m.tdSetValueCheck(a2[k], v, !alrtd.contains(ci))) {
if (!alrtd.contains(ci)) alrtd.push(ci);
} else fgTDs.push(a2[k]);
}
}
}
m.shwFgnDataTds(fgTDs);
}
po.visible = function () { return !isHidden(this.grid); }
po._showEditBox = function (td, clearOld, newText) {
var m = this, itm = m.getField(td), cfg = itm.opConfig, mtln = hasBit(cfg, GIA.MultiLine), dtype = itm.dataType,
txt, Hgt = td.offsetHeight, Wdt = td.offsetWidth, Mytbl = m.grid, oTxB = m.EditBox, otp = "INPUT", clr = "#e6e6fa";
if (mtln) { Wdt += 20; clr = "#ddff00"; if (Hgt < 80) Hgt = 80; otp = "TEXTAREA"; }
if (dtype == GDT.String && Wdt < 30) Wdt = 30;
if (clearOld) {
txt = newText; if (!cmnIsCharTypeCorrect(txt, dtype)) { txt = ""; cmnEvtSetReturn(false); }
} else { txt = teTdGetValue(td); }
//if (oTxB) {oTxB.outerHTML = ""; oTxB = null;}
//if (!oTxB || otp != oTxB.type) {
if (oTxB) oTxB.outerHTML = "";
oTxB = addE("<" + otp + " type='text' />"); //, m.gridContainer
m.EditBox = oTxB;
setColor(oTxB, "", clr);
var evRef = m.evtEditBox, er = function () { evRef.call(m); }
GJT.eventAddHandle(oTxB, "keydown", er); GJT.eventAddHandle(oTxB, "keypress", er); GJT.eventAddHandle(oTxB, "blur", er);
//setEvtHandleAll(oTxB, er);
//}
//var ofpos = getOffsetO(td, oTxB.parentNode);
    //showObjAt(oTxB, ofpos[0], ofpos[1], Wdt, Hgt);
matchLoc(oTxB, td, 0, 0, 0, null, 1);
oTxB.focus();
oTxB.value = txt;
teCopyFont(td, oTxB);
// var cSt = GJT.getComputedStyle(td), st = oTxB.style;
// st.fontFamily = cSt.fontFamily; st.fontSize = cSt.fontSize;
// st.fontWeight = cSt.fontWeight; st.fontStyle = cSt.fontStyle;
// st.fontVariant = cSt.fontVariant; st.verticalAlign = cSt.verticalAlign;
// st.textAlign = cSt.textAlign;
// st.paddingLeft = cSt.paddingLeft;
oTxB.style.border = "";
}
po._focusEditBox = function () {
var tb = this.EditBox;
try {
tb.focus();
if (tb.value2 != null) tb.value = tb.value2;
} catch (e) { }
}
po.hideEditBox = function () {
if (this.EditBox) {
this.EditBox.outerHTML = "";
delete this.EditBox;
}
}
po.ShowChgHistory = function (td, keepLocation) {
var m = this, td = td || m.mainTD(), fk = m.fieldsKey.getNames(","); if (!td || !fk) return;
var kl = keepLocation, kv = m.getFieldsValues(fk, [getTR(td)],",",0,1,1);
var xp = ["Action", "tarid", "kv", "kf", KW.PrmTimezoneOffset], vp = ["getHist", m.id, kv.join(""), fk, (new Date()).getTimezoneOffset()];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
var dg = m._histdg;
if (!dg) {
dg = dlgShowContents();
dg.handleClose = function () { dg.showMe(1); return true; }
m._histdg = dg;
}
var cpt = m.getTextUIKF();
cpt = i18nm.ShowChgLog.text + " - " + m.text + (cpt ? ("(" + cpt + ")") : "");
dg.setCaption(cpt);
dg.main.innerHTML = txt;
dg.showMe();
if (!kl) { dg.moveToLT(); showBesideMouse(dg.dlg); }
}
po.checkinByDrop = function (dataTransfer) {
var dg = fkCheckin(this);
if (dg && dg.checkinByDrop) return dg.checkinByDrop(dataTransfer);
//return alert("Check in file not allowed!");
//var m = this, dtf = dataTransfer, tx = "";
//if (dtf.files && dtf.files.length) {
// //drag file 應該不會再有其他格式
// for (var i = 0; i < dtf.files.length; i++) {
// var ty = dtf.files[i];
// tx += ty.name + ">>" + ty.size + "\n";
// }
//}
//else {
// for (var i = 0; i < dtf.types.length; i++) {
// var ty = dtf.types[i];
// tx += ty + ">>" + dtf.getData(ty) + "\n";
// }
//}
////依據傳入的資料格式決定file checkin的選項
////IE 的type 沒有遵循MIME的命名,只有Url Files Text, Url的text (標題無法接收到, Sender有傳)
//alert(tx);
}
po.CheckinFile = function (td) { return fkCheckin(this, null, td); }
po.CheckoutFile = function (td) { return fkCheckout(this, null, td); }
po.CheckoutByUI = function (ev, su, autoShw) {
var m = this, f = m.getField(su), sl = m._selection;
if (f && (f.name == _AnnxF || f.fieldName == _AnnxF) && ev.offsetX < 17 && ev.offsetY < 17 && !sl.isWholeCol(su) && !sl.isWholeRow(su)) {
var dg = this.dlgchkoutF; if (dg) dg = dg.dg.dlg;
if (autoShw || !isHidden(dg)) { m.CheckoutFile(su); return true; }
}
}
po.ChangeRequest = function () { teShowRevReqCtrl(this, null, this.mainTD()); }
po.FreeNote = function () { teShowFreeNoteDlg(this, null, this.mainTD()); }
po._beginEdit = function (td, clearOld, newText) {
var m = this, se = m._selection, oaTR;
if (!td) td = se.mainDataTD();
else if (td.cellIndex < m.colBeginData() || getTR(td).rowIndex < m.rowBeginData()) return;
if (!m.enableSelect || !td) return;
if (!se.isMember(td)) m.sel(td);
oaTR = se.getDataTRs();
if (m.bfrEdit) {
var itms = m.getSelectedFields();
for (var i = 0; i < itms.length; i++) { if (m.bfrEdit(m, oaTR, itms[i])) return; }
}
m.CellsEditing = se.getDataTDs();
if (m.isChangeable(td, true)) {
m._showEditBox(td, clearOld, newText); return 1;
} else if (m.isChangeable(td)) {
m._showPicker(); return 1;
}
}
po.endEdit = function () {
if (!this.CellsEditing) return true;
var m = this, oTxB = m.EditBox, td = m.CellsEditing[0], itm = m.getField(td), rng = m._selection, res = false, vm = itm.valuesMap, ci = td.cellIndex;
if (!itm || !oTxB || !td) return true;

var cfg = itm.opConfig, v = GJT.trim(oTxB.value), xl = itm.maxLength, i,dtpy = itm.dataType;
if (hasBit(cfg, GIA.UpperCaseOnly)) v = v.toUpperCase();
m.pushUndo(m.CellsEditing);
var oaTD = m.CellsEditing, tl = oaTD.length;
if (dtpy == GDT.Integer || dtpy == GDT.Real || dtpy == GDT.Short) {
if (v && v.toString().indexOf("%") > 0) {
v = teDeformatNumDo(v);
}
}
for (i = 0; i < tl; i++) {
var tdN = oaTD[i], ciN = tdN.cellIndex, vN = teMapVal(vm, v);
if (ciN != ci) vN = teMapVal(m.getField(tdN).valuesMap, v);
if (teTdGetValue(tdN) == vN) continue;
res = m.tdSetValueCheck(tdN, vN, tl == 1) || res;
}
m.shwFgnDataTds(oaTD);
m.CellsEditing = null;
m.hideEditBox();
try { td.focus(); } catch (ex) { }
return res;
}
po.tdSetValueCheck = function (td, value, ShowMsg,itm,noEvent) {if(!itm)itm = this.getField(td);
var m = this, cfg = itm.opConfig, dtype = itm.dataType, v = value;
if (hasBit(cfg, GIA.WriteDenied)) return false;
if (hasBit(cfg, GIA.NoNull)) v = GJT.trim(v);
//Chrome parse MM/dd to 2001/MM/dd , parse dd to 2001/dd/1, so enforce to yyyy/MM/dd before parse
if (dtype == GDT.DateTime && v !=""){
var idx = v.indexOf("/"),idx2=v.lastIndexOf("/");
if(idx == idx2 && idx < 0) v = (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + v;
else if (idx == idx2) v =(new Date()).getFullYear() + "/" + v;
}
if (cmnIsTextTypeCorrect(teDeformatNum(teMapVal(itm.valuesMapRvs, v), dtype), dtype) || hasBit(cfg, GIA.FlexibleVal)) return m.tdSetValue(td, v, 0, 0, itm, noEvent);
if (ShowMsg) alertA(itm.text + "\n" + i18nm.DataTypeIncorrect.text + "(" + v + ")");
}
po.tdSetValueCheckDo = function (td, v, ShowMsg, cfg, dtype, caption, valMapDict,itm,noEvent) {if(!itm)itm = this.getField(td);
if (hasBit(cfg, GIA.WriteDenied)) return false;
if (hasBit(cfg, GIA.NoNull) && dtype == GDT.String) v = GJT.trim(v);
if (dtype == GDT.DateTime && v != ""){
var idx = v.indexOf("/"),idx2=v.lastIndexOf("/");
if(idx == idx2 && idx < 0) v = (new Date()).getFullYear() + "/" + ((new Date()).getMonth() + 1) + "/" + v;
else if (idx == idx2) v =(new Date()).getFullYear() + "/" + v;
}
if (cmnIsTextTypeCorrect(teDeformatNum(teMapVal(valMapDict, v), dtype), dtype) || hasBit(cfg, GIA.FlexibleVal)) return this.tdSetValue(td, v, 0, 0, itm, noEvent);
if (ShowMsg) alertA(caption + "\n" + i18nm.DataTypeIncorrect.text + "(" + v + ")");
}
po.tdSetValue = function (td, value, isHTML, isSetByCode,itm,noEvent) {
if (!td) return;
if(!itm)itm = this.getField(td);
var curV, nv, oriV, m = this, cfg = itm.opConfig, tr = getTR(td), dtyp = itm.dataType;
curV = teTdGetValue(td,isHTML);
if (teDeformatNum(value, dtyp) == teDeformatNum(curV, dtyp)) return true;
if (!hasAtr(td, KW.PtyOrigValue)) { setAtr(td, KW.PtyOrigValue, curV); oriV = curV; } else oriV = getAtr(td, KW.PtyOrigValue, null);
if (oriV == KW.Dlm2) oriV = null;
if (m.bfrChangeValue && !noEvent) { if (m.bfrChangeValue(m, tr, itm, value, td)) return false; }
if (isHTML) { if (!m.tdSetValueQ(td, value, 0, 0, true,itm)) return; } else { if (!m.tdSetValueQ(td, value,0,0,0,itm)) return; }
var abortEditLog = false;
if (m.aftChangeValue && !noEvent) { abortEditLog = m.aftChangeValue(m, tr, itm, value, isSetByCode); }
if (!abortEditLog) abortEditLog = m.evtBroadcast("aftChangeValue", [m, tr, itm, value, isSetByCode]);
if (hasBit(cfg, GIA.SaveDenied) || hasBit(cfg, GIA.Virtual)) {
} else {
if ((oriV != null && oriV == value) || (KW.dbNull == oriV && value == "")) m.editLogRemove(tr, itm.name);
else if (!abortEditLog) m.editLogAdd(tr, itm.name, value, oriV);
}
if (m._recForm) m.showRecordFormValue(itm.name, value, tr,isHTML);
return true;
}
po.tdSetValueQ = function (td, value, booRaiseEvent, isSetByCode, isHTML,itm) {if(!itm)itm=this.getField(td);
var m = this, vmp = itm.valuesMap, tr = getTR(td), chn = td.children, v = (value == null ? "" : teMapVal(vmp, value));
if (booRaiseEvent && m.bfrChangeValue) { if (m.bfrChangeValue(m, tr, itm, value, td)) return; }
v = teFormatNum(v, itm.dataType, itm.displayFormat);
if (hasBit(itm.opConfig, GIA.UseCheckboxAsUI)) {m._ckxMkEm(itm,td,value,chn);}
else if (chn.length > 0 && !isHTML) {
if (chn[0].tagName == "SPAN") {
chn[0].innerText = v;
} else { td.innerText = v; }
} else { if (isHTML) td.innerHTML = v; else td.innerText = v; }
if (booRaiseEvent) {
if (m.aftChangeValue) { m.aftChangeValue(m, tr, itm, value, isSetByCode); }
m.evtBroadcast("aftChangeValue", [m, tr, itm, value, isSetByCode]);
}
return true; //must return true
}
po.editLogAdd = function (tr, name, value, primalValue) {
var edl = tr._editLog;
if (!edl) { edl = new teEditLogs(); tr._editLog = edl; }
var m = this, itm = m.fieldsAll[name], vmp = itm.valuesMapRvs;
m.hintEdited(tr);
if (itm) {//convert to UTC ISO8601
value = teDeformatNum(teMapVal(vmp, value), itm.dataType);
primalValue = teDeformatNum(teMapVal(vmp, primalValue), itm.dataType);
if (itm.dataType == GDT.DateTime && value) {
if ((itm.opConfig & GIA.AddTimePartAuto)==GIA.AddTimePartAuto) {
//檢查看看有沒有輸入時間區段
if (value.indexOf(" ") < 0 || value.indexOf(":") < 0) {
//加入當下時間的時間區段
var dtnf = (new Date()).format("yyyy/MM/dd HH:mm:ss");
value = value + " " + dtnf.substring(11);
}
}
//var nDt = new Date(Date.parse(value));
//if (!isNaN(nDt)) value = nDt.toISO8601();
}
}

return edl.add(itm ? itm.name : name, value, primalValue);
}
po.editLogRemove = function (tr, name) {
var edl = tr._editLog; if (!edl) return;
var itm = this.fieldsAll[name];
var res = edl.remove(itm ? itm.name : name);
if (edl.length == 0) this.hintEdited(tr, 1);
}
po.editLogExist = function (tr, name) {
var edl = tr._editLog; if (!edl) return;
if (name == null) return edl != null && edl.length > 0;
var itm = this.fieldsAll[name];
return edl.exist(itm ? itm.name : name);
}
po.hintEdited = function (tr, clear) {
if (!tr) tr = this.mainTR();
if (!tr) return;
setColor(tr.cells[0], "", clear ? (this.grid.rows[0].style.backgroundColor) : "#D2691E");
}
po.editLogClear = function (tr, rmvPrimalVal) {
var edl = tr._editLog, f = this._recForm; if (!edl) return;
if (rmvPrimalVal) {
for (var i = 0; i < edl.length; i++) {
this.setFieldValue(edl[i].name, edl[i].value, tr, 1, 1, 1);
}
}
edl.clear();
delete tr._recjson;
if (f && f.tr == tr) f.clearChange();
setColor(tr.cells[0], null, (this.grid.rows[0].style.backgroundColor));
}
po.cancelEdit = function () {
var m = this;
if (m.CellsEditing) m.CellsEditing[0].focus();
return m.hideEditBox();
var m = this, oTxB = m.EditBox; if (!oTxB) return;
oTxB.isCanceled = true;
//try { oTxB.blur(); } catch (ex) { }
oTxB.isCanceled = false;
}
po.isChangeable = function (src, forKeyPress, cfg, td, tr) {
var m = this;
if (!td) td = getTD(src);
if (cfg == null) {
var itm = m.getField(td); if (!itm) return;
cfg = itm.opConfig;
}
if (cfg == null) return false;
if (hasBit(cfg, GIA.Disabled)) return false;
if (hasBit(cfg, GIA.WriteDenied)) return false;
if (hasBit(cfg, GIA.NoKeyPress) && forKeyPress) return false;
if (!tr) tr = getTR(td);
if (hasBit(cfg, GIA.ChangeDenied) && !m.isNewRow(tr)) return false;
return true;
}
po.isNewRow = function (tr) {
var m = this, f = m.opst ? m.opst.f4jnr : null;
if (f) { var vf = m.getFieldValueR(f, tr); if (!vf) return true; }
return (getAtr(tr, KW.PtyNameRecordState, "") != "1");
}
po.getField = function (td) {
if (!td) return;
var cs = this.grid.rows[0].cells, td0 = cs[td.cellIndex];
if (td0) return td0.opField;
}
po.getFields = function (names) {//get fields Items in table
var m = this, tbl = m.grid;
if(!tbl.rows[0])
return;
var cs0 = tbl.rows[0].cells, res = new OpItems(), ns = names;
if (ns == null || ns == "*") {//all fields showed in table
for (var i = m.colBeginData(); i < cs0.length; i++) {var ofd=cs0[i].opField; if(ofd) res.add(ofd); }
} else if (typeof ns == "string") {
ns = ns.split(",");
}
if (ns instanceof Array) {
for (var i = 0; i < ns.length; i++) {
var td = cs0[m.fieldNameA(ns[i])];
if (td && td.opField) res.add(td.opField);
}
}
return res;
}
po.getSelectedFields = function () {
var m = this, res = new OpItems(), tds = m._selection.getTDs(0, 0, 1), cs0 = m.grid.rows[0].cells;
for (var i = 0; i < tds.length; i++) {
res.add(cs0[tds[i].cellIndex].opField);
}
return res;
}
po.getFieldName = function (td) { var itm = this.getField(td); if (itm) return itm.name; }
po.evtCriterionButton = function () {
var ev = GJT.event(), o = GJT.eventSrc(), ty = ev.type;
if (ty == "click") {
if ((o.tagName == "INPUT" && o.type == "button") || o.tagName == "BUTTON" || o.tagName == "SPAN") {
//var ctnr = BDY(), tbr = ctnr.children["zz_$QtbR"], tar = tbr.tarObject, sm;
var tbr = this.criterionButtons, tar = tbr.tarObject, sm, m = this;
if (hasAtr(o, "isGT")) sm = ">";
else if (hasAtr(o, "isGT")) sm = ">";
else if (hasAtr(o, "isLT")) sm = "<";
else if (hasAtr(o, "isEQ")) sm = "=";
else if (hasAtr(o, "isBT")) sm = "~";
else if (hasAtr(o, "isNEQ")) sm = "!";
else if (hasAtr(o, "isAny")) sm = "%";
else if (hasAtr(o, "isAny1")) sm = "_";
else if (hasAtr(o, "Clear1")) { if (o.lstCTime && ((new Date()).getTime() - o.lstCTime.getTime() < 1000)) { this.clearCriterionText(); } else { tar.value = ""; o.lstCTime = new Date(); }; tar.focus(); teHiLiNotNullTextBox(tar); }
else if (hasAtr(o, "ClearO")) this.clearCriterionText();
else if (hasAtr(o, "SetQrySort")) uiSetQryOrderItms(this);
else if (hasAtr(o, "QryGo")) this.queryByUser();
else if (hasAtr(o, "ExpGo")) this.exportData();
else if (hasAtr(o, "QryHistory")) this.queryByHist();
else if (hasAtr(o, "isClose")) hideIt(this.criterionButtons);
else if (hasAtr(o, "QryM")) {
var itms = new OpItems();
if (m.hasQuickQry) {
sysCmdAdd(itms, [CMDE.QuickQuery]);
if (m.canExport) sysCmdAdd(itms, [CMDE.QuickQueryExp]);
}
if (m.canExport) sysCmdAdd(itms, [CMDE.Export]);
if (m.hasReport) {
sysCmdAdd(itms, [CMDE.CreateReport]);
if (m.canExport) sysCmdAdd(itms, [CMDE.ExportReport, CMDE.ExportReportToWindow]);
}
itms.executer = m;
SysShowMenu(itms);
}
if (sm && tar) {
var v = tar.value, idx = v.indexOf(sm);
if (idx < 0) {
if (sm == "~") v = v + sm; else v = sm + v;
}
else {
v = v.replace(sm, "")
var ra = [">", "<", "=", "!", "~"];
for (var i = 0, j = ra.length; i < j; i++) {
v = v.replace(ra[i] + sm, sm).replace(sm + ra[i], sm);
}
}
v = v.replace("=>", ">=").replace("=<", "<=").replace("><", "!").replace("<>", "!").replace("=!", "!=");
tar.value = v;
tar.focus();
}
}
}
}
po.evtExternal = function () {
var ev = GJT.event(), o = GJT.eventSrc(), ty = ev.type;
}
po.evtCriterionArea = function () {
var m = this, ev = GJT.event(), o = GJT.eventSrc(), ty = ev.type;
if (ty == "keypress") {
var kc = GJT.eventKeyCode(ev);
if (kc == 13) m.queryByUser();
}
else if (ty == "click") {
MenuHide();
if (o.className == "QryButton") { m.qByDlg = 0; m.queryByUser(); }
else if (o.tagName == "TD") { hideIt(m.criterionButtons); }
}
else if (ty == "focus" && o.tagName == "INPUT") {
if (GJT.isDraging) return;
var ctnr = m.container, tbr = m.criterionButtons, n = i18nm, sym = n.MathSymbol;
if (!tbr) tbr = ctnr.children["zz_$QtbR"];
if (!tbr) {
var t1 = "<button", t2 = "</button>", h = [], $C = sym.ClearC, $G = sym.GreaterThan, $L = sym.LessThan, $E = sym.Equal, $B = sym.Between, $NE = sym.NotEqual,
$SQO = sym.SetQryOrder, $Q = n.Query, $R = n.ReportZ, $X = n.Export, sppih = getAtr(m.grid, "suppInhttyp") == "Y", $W = sym.AnyChar, $W1 = sym.AnyOneChar;
h.push("<div class=\"CriterionButton\" style=\"display:none;position:absolute;\" id=\"zz_$QtbR\">");
var t1 = "<input type='button' ", t2 = " />", pvg = m.programPrivilege;
h.push(t1, " onclick=\"valPickButtonClick()\" id=\"zz_Klh_btnQ\" style=\"display:none;\" value=\"...\" ", t2,
t1, i18htmValue($C), i18htmTitle($C), " Clear1='Y'", t2, t1, i18htmValue($W), i18htmTitle($W), " isAny='Y'", t2,
t1, i18htmValue($W1), i18htmTitle($W1), " isAny1='Y'", t2, t1, i18htmValue($G), i18htmTitle($G), " isGT='Y'", t2,
t1, i18htmValue($L), i18htmTitle($L), " isLT='Y'", t2, t1, i18htmValue($E), i18htmTitle($E), " isEQ='Y'", t2,
t1, i18htmValue($B), i18htmTitle($B), " isBT='Y'", t2, t1, i18htmValue($NE), i18htmTitle($NE), " isNEQ='Y'", t2); //,
if (hasBit(pvg, PPVG.Sort)) h.push(t1, i18htmValue($SQO), i18htmTitle($SQO), " SetQrySort='Y'", t2);
h.push(t1, i18htmValue($Q), i18htmTitle($Q), " QryGo='Y'", t2);
h.push(t1, " QryHistory='Y' class='QueryHist'", t2);
if (m.canExport || m.hasReport) {
if (!m.hasReport) h.push(t1, i18htmValue($X), i18htmTitle($X), " ExpGo='Y' ", t2);
else h.push(t1, "", "", " QryM='Y' class='MoreD' ", t2);
}
h.push("<input type='checkbox'", i18htmTitle2(n.KeepOldRows), " id='chkKeep$OldhGR' />");
if (sppih) h.push("<input type='checkbox'", i18htmTitle2(n.NoDescentant), " id='chk$NoDescendant' />");
//h.push("<div style='width:30px;height:30px;' >X</div>");
h.push("<span isClose='Y' style='margin-top:8px;margin:3px;cursor:default;' >X</span>" );
h.push("</div>");
tbr = addE(h.join("")); //, ctnr
m.criterionButtons = tbr;
var evRef1 = m.evtCriterionButton, geRef = m;
var er = function () { evRef1.call(geRef); }; setEvtHandleAll(tbr, er);
GJT.eventAddHandle(m.container, "click", function () { hideIt(m.criterionButtons) });
///加入HTML攔截
}
toZTopC(tbr);
//showIt(tbr);// showBeside(tbr, o, -o.offsetWidth, o.offsetHeight);
tbr.tarObject = o;
setTimeout(function () { showIt(tbr); showBeside(tbr, o, -o.offsetWidth, o.offsetHeight); }, 100);
m.qByDlg = (getTable(o) != m.grid);
if (m.qByDlg) {
if (!m.cQdg) m.cQdg = getTable(o).parentNode;
// if (tbr.parentNode != m.cQdg) m.cQdg.appendChild(tbr);
}
var btn = tbr.children["zz_Klh_btnQ"];
if (btn && ValueCanChoose(o)) { showIt(btn); btn.tarObject = o; } else hideIt(btn);
//SetQrySort
}
else if ((o.tagName == "TD" && o.cellIndex == 0)) {
if (ty == "mousemove" || ty == "mouseup") m.evtGridArea(ev);
if (teIsInResizeArea(o) && ty == "mousedown") m.evtGridArea(ev);
}

GJT.stopBubble();
}
//處理程序ondragover ondrop內都必須執行event.preventDefault()方法才能客製化ondrop 的處理方式,否則瀏覽器會以自己的處理方式進行drop的處理
po.evtSysDragOver = function (ev) {
if (!ev) ev = GJT.event();
cmnEvtSetReturn();
//ev.preventDefault();
}
po.evtSysDrop = function (ev) {
if (!ev) ev = GJT.event();
cmnEvtSetReturn();
var m = this, pvg = m.programPrivilege;
if (hasBit(pvg, PPVG.CheckinFile)) return m.checkinByDrop(ev.dataTransfer);
}
po.evtToolbar = function () {
var ev = GJT.event(), o = GJT.eventSrc(), m = this;
if (m.aftToolbarClick) m.aftToolbarClick();
if (ev.type == "click") {
var grd = this.grid, sn = o.className;
if (sn == "InsertRow") m.insertRows();
else if (sn == "AppendRow") m.appendRows();
else if (sn == "RemoveRow") m.removeRows();
else if (sn == "SetOrderBy") uiSetQryOrderItms(this);
else if (sn == "Query") m.queryByUser();
else if (sn == "QryClear") m.clearCriterionText();
else if (sn == "SortA") m.sortAscending();
else if (sn == "SortD") m.sortDescending();
else if (sn == "SumCells") m.sumCells();
else if (sn == "Save") m.saveData();
else if (sn == "SaveWhole") m.saveData(true);
else if (sn == "DeleteData") m.deleteData();
else if (sn == "Export") m.exportData();
else if (sn == "BeginEdit") m._beginEdit();
else if (sn == "mnuOthers") m.opExecute(CMDE.ContextTool);
else if (sn == "mnuQuickQry") m.opExecute(CMDE.QuickQuery);
else if (sn == "QuickQryM") m.QuickQryMore();
else if (sn == "mnuShowRelated") m.opExecute(CMDE.showRelatedItem);
else if (sn == "mnuShowFlowCtrl") teShowFlowCtrl(m);
else if (sn == "HideGrid") m.showGridnStatusBar(1);
else if (sn == "ShowGrid") m.showGridnStatusBar(0);
else if ((sn == "GridLabel")) { var hgt = this.container.style.height; if (!hgt) m.showGridnStatusBar(); } //sn == "GridToolBar" ||
else if (sn == "ExpandAll") teExpandQry(m, 0, 0, 1,1);
else if (sn == "Expand") { var r = o._surRela; if (r) teExpandQryDo(r,0,0,0,1); else teExpandQry(m, 0, 0, 0, 1); }
else if (sn == "ExpandRvs") { var r = o._surRela; if (r) teExpandQryDo(r, 1, 0, 0, 1); else teExpandQry(m, 1); }
else if (sn == "ExpandAdv") teExpandQryAdv(m, 0);
else if (sn == "ExpandRvsAdv") teExpandQryAdv(m, 1);
else if (sn == "swtFixed") m.fixToolbar();
else if (sn == "ShwForm") { m.showRecordForm(m._recFormDg && !isHidden(m._recFormDg.dlg)); }
m.evtBroadcast("toolbarClick", [m, o]);
}
else if (ev.type == "mousedown") {
GJT.lstX = ev.clientX; GJT.lstY = ev.clientY;
hideIt(m.criterionButtons);
}
}
po.evtResponseStatusbar = function () {
var m = this, ev = GJT.event(), o = GJT.eventSrc(), sn = o.className;
GJT.stopBubble();
if (ev.type == "keypress") {
var kc = GJT.eventKeyCode(ev);
if (sn == "pageno" || sn == "pagerows") {
if (kc == 13) m.queryByUserL();
}
}
else if (ev.type == "click") {
MenuHide(); hideIt(m.criterionButtons);
if (sn == "Expand") { var r = o._surRela; if (r) teExpandQryDo(r); else teExpandQry(m, 0, 0, 0, 1); }
else if (sn == "ExpandRvs") { var r = o._surRela; if (r) teExpandQryDo(r, 1); else teExpandQry(m, 1); }
var tarpgno = parseInt(getAtr(o, "page"), 10), n = getChiHasAtr(m.StatusBar, "z_lkrhpgno");
if (!isNaN(tarpgno)) {
if (n) n.value = tarpgno;
m.queryByUserL();
} else {
tarpgno = parseInt(n.value, 10);
var stp = parseInt(getAtr(o, "move"), 10);
if (!isNaN(stp) && !isNaN(tarpgno) && n) { n.value = stp + tarpgno; m.queryByUserL(); }
}
}
}
po.showGridnStatusBar = function (hide) {
var m = this, rc = m._recForm, cnr = m.gridContainer2 ? m.gridContainer2 : m.gridContainer, h = hide;
if (h == null) h = !isHidden(cnr);
showItA(cnr, !h);
showItA(m.StatusBar, !h);
if (rc) showItA(rc.uio, !h);
var o = m.ToolBar, b = getEmByClass(o, "ShowGrid") || getEmByClass(o, "HideGrid");
if (b) { b.innerText = h ? i18nm.ShowIt.text : i18nm.HideIt.text; b.className = h ? "ShowGrid" : "HideGrid"; }
}
po.insertRows = function (rowsToInsert, positionToInsert, doAppend, _ignorePvg, _noAlert) {
var m = this, gd = m.grid, rwis = parseInt(rowsToInsert, 10), posI = parseInt(positionToInsert, 10), TRs, se = m._selection, rws = gd.rows,
tr, ni, ntr, ntd, cs, newNo = teGetNextRowId(gd), res = [], trT, pn, rcpos, rbd = m.rowBeginData(), idxInpt, inptHtml, tbdy=getEM(gd,"TBODY")[0],
pvg=m.programPrivilege;
if (!_ignorePvg && !hasBit(pvg, PPVG.Insert) && !(hasBit(pvg, PPVG.InsertRows) || hasBit(pvg, PPVG.InsertRowsAfter))) return _noAlert ? null : alertA(i18nm.SorryInsertDenied.text);
if(!hasBit(pvg, PPVG.InsertRows) && doAppend==null)doAppend=true;
TRs = se.getDataTRsOROA(1); rcpos = se.getRectsPosition();
if (!m._checkboxSel) se.clear();
if ((isNaN(rwis) || rwis < 0) && isNaN(posI)) {//use selected
} else {
if (!isNaN(posI) && doAppend) posI ++; //****** 20190604
if (isNaN(posI)) {posI = rws.length - (doAppend ? 0 : 1);if (posI < rbd) posI = rbd;}
else if (posI < rbd) posI = rbd;
else if (posI >= rws.length) posI = rws.length; // return; //未指定插入位置 就加到最後面
tr = rws[posI - 1]; TRs = [];
if (isNaN(rwis) || rwis < 0) rwis = se.getDataTRs(1).length;
for (var i = 0; i < rwis; i++) { TRs.push(tr); }
doAppend = true;
TRs = [TRs];
}
if ((TRs.length == 0 || (TRs.length == 1 && TRs[0].length == 0)) && rws.length <= rbd) { TRs = [[rws[rws.length - 1]]]; doAppend = true; rcpos.push([0, 0, 0, 0]); }
for (var i = 0; i < m.colBeginData(); i++) {
var chi = EmByTag(rws[0].cells[i], "INPUT");
if (chi) { idxInpt = i; inptHtml = chi.outerHTML; break; }
}
if (!m.setValueForLink(1)) return;
if (m.bfrInsertRows) {
var refTRs = [];
for (var i = 0; i < TRs.length; i++) {
if (TRs[i].length == 0) { TRs[i].push(rws[rws.length - 1]); }
for (var j = 0; j < TRs[i].length; j++) {
refTRs.push(TRs[i][j]);
}
}
if (m.bfrInsertRows(refTRs, doAppend, m)) return;
}
for (var i = 0; i < TRs.length; i++) {
if (TRs[i].length == 0) { TRs[i].push(rws[rws.length - 1]); rcpos[i] = [0, 0, 0, 0]; }
if (rcpos.length <= i) rcpos[i] = [0, 0, 0, 0];
if (doAppend) {
tr = TRs[i][TRs[i].length - 1]; ni = tr.rowIndex + 1;
} else {
tr = TRs[i][0]; ni = tr.rowIndex;
}
if (!tr) { tr = rws[0]; ni = -1; rcpos[i] = []; }
for (var j = 0; j < TRs[i].length; j++) {
if (ni >= rws.length) ni = -1;
if (!trT) {
//Chrome的insertRow 在TBODY沒有任何row的情況下會把row加入到THEAD下,這會造成問題,只好改成用InsertBefore 或者是AppendChild
if (ni < 0 || !tbdy.children[0]) ntr = tbdy.appendChild(newEm("TR"));
else ntr = gd.insertRow(ni);
cs = tr.cells;
for (var c = 0; c < cs.length; c++) { ntr.appendChild(newEm("TD")); }
trT = ntr; pn = trT.parentNode;
if (idxInpt != null) { addE(inptHtml, ntr.cells[idxInpt]); }
} else {
ntr = trT.cloneNode(true);
if (ni < 0) pn.appendChild(ntr);
else pn.insertBefore(ntr, rws[ni]);
}
res.push(ntr);
if (j == 0) rcpos[i].tr1 = ntr;
if (m.colBeginData() > 0) { ntd = ntr.cells[0]; ntd.innerText = newNo; newNo++; setColor(ntd, "", null, 1); } // se.add(ntd, j > 0);s
if (ni > 0) ni++;
}
rcpos[i].tr2 = ntr;
}
rcpos.length = TRs.length;
for (var i = 0; i < TRs.length; i++) {
if (rcpos[i][0] < rbd && rcpos[i][0] == rcpos[i][2] || (i == 0 && !doAppend)) continue; //wholeCol keep it
rcpos[i][0] = rcpos[i].tr1.rowIndex; rcpos[i][2] = rcpos[i].tr2.rowIndex;
}
if (!m._checkboxSel) m._selByRectPos(rcpos);
setAtr(gd, KW.NextRowNo, newNo);
teShowRows(gd);
m.setRowColor(null, null, 1);
m.rvsRHcolor(res);
m.setValueForLink(0, res);
if (m._needEvalFLS(1)) { m._formualEval(res,null,EVI.RowInserted); }
m._ckxRvs();
if (m.aftInsertRows) m.aftInsertRows(res, doAppend, m);
m.evtBroadcast("aftInsertRows", [res, doAppend, m]);
return res;
}
po.setValueForLink = function (chkValid, trs) {
var m = this, rs = m.relaNR; if (!rs) return 1;
for (var i = 0; i < rs.length; i++) {//get master data and set to GLC.LoosenLink
var r = rs[i], lm = r.linkMode, f = r.from, t = r.to, ff = r.fromFields, tf = r.toFields, fTR, vQ;
if (m != t) continue;
fTR = f.mainTR ? f.mainTR() : null;
vQ = f.getFieldsValues(ff.getNames(","), fTR, null, 1, 1);
var isNwR = fTR ? f.isNewRow(fTR) : 0, abt = 0;
if (chkValid && (!hasBit(lm, GLC.LoosenLink))) {
if ((!vQ || isNwR) && (!hasBit(lm, GLC.IgnoreLinkFail))) return alert("Relationship between '" + f.text + "' and '" + t.text + "' will be failed to built. This action is aborted.");
}
if (!vQ || !trs) continue;
for (var j = 0; j < tf.length; j++) {
t.setFieldValues(tf[j].name, vQ[j][0], trs);
}
//for (var h=0;h<trs.length;h++){
// for (var j=0;j<tf.length;j++){
// t.setFieldValue(tf[j].name, vQ[j][0], trs[h]);
// }
//}
}
return 1;
}
po.appendRows = function (rowsToAppend, _ignorePvg, _noAlert) {
return this.insertRows(rowsToAppend, null, true, _ignorePvg, _noAlert);
}
po.cloneRows = function (range, FieldsNotCopy, FieldsCopy, doAppend, _ignorePvg, _noAlert) {
var m = this, se = range, fnc = FieldsNotCopy, fc = FieldsCopy,fk=m.fieldsKey;
if (!se) se = m._selection;
if (!fnc) fnc = m.fieldsKey.clone(); else if (!fnc instanceof OpItems) fnc = m.getFields(fnc).concat(m.fieldsKey);
if (!fc) fc = m.getFields("*").concat(m.fieldsAll.collect(null, GIA.IsAttribute));
else if (!fc instanceof OpItems) fc = m.getFields(fc);
var fsv = m.fieldsAll.collect(null, GIA.Virtual);
fc.remove(fnc);fc.remove(fsv);
var TRs = (se instanceof Array) ? se : se.getDataTRs(), ri = TRs[0].rowIndex, nTRs = m.insertRows(TRs.length, ri, doAppend, _ignorePvg, _noAlert); //if (!(tarTRs instanceof Array))
if (!nTRs) return;
var v = m.getFieldsValues(fc, TRs, null, 1, 1),vk=m.getFieldsValues(fk, TRs, ",", 0, 1);//PK 用逗號隔開
for (var i = 0; i < fc.length; i++) {
//prevent refresh foreign fileds
m.setFieldValues(fc[i].name, v[i], nTRs, 0, 0, 0, 0, 1, 1, 0, 1);
}
for (var i = 0; i < nTRs.length; i++) {
nTRs[i]._clonedFrom =vk[i];
}
m._fmtByCndn(nTRs);
return nTRs;
}
po.ChgColumnWidth = function(){
var m=this,sl=m._selection, mtd=m.mainTD(),tds=sl.getTDs();if(!mtd) return;
nw=window.prompt(i18nm.ChgColumnWidth.text, mtd.offsetWidth);
nw=parseInt(nw,10);if(!nw || isNaN(nw)) return;
m.changeColWidth(tds, toCssWdtNoMargin(mtd,nw));
m.saveColWidth();
}
po.removeColumn = function(fldNames, booSaveProfile){
var rs=this.getFields(), a=fldNames.split(","), c = rs.length;
for(var i=0;i<a.length;i++){rs.remove(a[i]);}
if(rs.length != c){this.arrangeColumns(rs.getNames(","), booSaveProfile)}
}
po.removeRowsAll = function () { return this.removeRows(-1); }
po.removeDuplicateRowsAsk = function (so) {
var fds = so.itemsSelected.getNames(",");
return this.removeDuplicateRows(so.tarRows, fds);
}
po.removeDuplicateRows = function (rowsToCheck, fields4Compare) {
var m=this,fds = fields4Compare;
if (!fds) {
var hds = m.getFields(), hdss = m.getSelectedFields();
var so = selItems("", i18nm.RmvDuplicateRows.text, hds, hdss, null, null, function (slrr) { m.removeDuplicateRowsAsk.call(m, slrr); });
so.tarRows = rowsToCheck;
so.setModal(true);
return;
}
return this.removeRows(rowsToCheck, 0, 1, fds);
}
po.removeRows = function (rowsToRemove, _noAlert, rmvDuplicate, fields4Compare) {
var m = this, se = m._selection, rcpos = se.getRectsPosition(), rws = rowsToRemove, gd = this.grid, arws = gd.rows, u = arws.length - 1, rbd = m.rowBeginData(), alrt = 0;
if (rws == null) rws = se.getDataTRs();
else if (!isNaN(parseInt(rws, 10))) {
var k = parseInt(rws, 10), j; if (k < 0) k = u;
rws = [];
for (var i = 0; i < k; i++) {
j = u - i; if (j < rbd) break;
rws.push(arws[j]);
}
}
if (rmvDuplicate) {
if (!fields4Compare) return alert("No fields specified for comparison!");
var fv = m.getFieldsValues(fields4Compare, rws, "|"), cko = {},nrws=[];
for (var r = 0; r < fv.length; r++) {
if (cko[fv[r]]) nrws.push(rws[r]); else cko[fv[r]] = rws[r];
}
rws = nrws;
}
if (m.handleBeforeRemoveRows && rws.length) { if (m.handleBeforeRemoveRows(m, rws)) return; }
for (var i = 0, k = rws.length; i < k; i++) {
var tr = rws[i]; pn = tr.parentNode;
var lg = tr._editLog;
if (lg && lg.length > 0 && !_noAlert) {
if (!alrt && !window.confirm(i18nm.ShwDataNotSavedAsk.text)) return;
alrt = 1;
}
pn.removeChild(tr);
}
if (rcpos.length > 0) m._selByRectPos(rcpos);
if (m.handleAfterRemoveRows) m.handleAfterRemoveRows(m, rws);
m.evtBroadcast("aftRemoveRows", [m, rws]);
teShowRows(gd);
m.setRowColor(null, null, 1);
return;
}
po.fieldNameA = function (name, caseInsensitive) { var itm = this.fieldsAll.item(name, caseInsensitive); if (!itm) return; return itm.name; } //getfieldName Auto, input id or fieldname, return id(name)
po.getFieldTDs = function (fldName, tarTRs) {
var m = this, gd = this.grid, res = [], fldId = (fldName instanceof OpItem) ? fldName.name : m.fieldNameA(fldName), idx = m.getCellIndex(fldId);
if (idx < 0) return;
if (tarTRs == -1) tarTRs = m.getAllDataTRs(); //all rows
tarTRs = m._strsau(tarTRs);
if (!tarTRs || tarTRs.length == 0) return;
for (var i = 0; i < tarTRs.length; i++) { res.push(tarTRs[i].cells[idx]); }
return res;
}
po.getKey = function (tr) { if (!tr) tr = this.mainTR(); return this.getFieldValue(this.fieldsKey.getNames(","), getTR(tr)); } //必要方法
po.getFieldValue = function (fldName, oTR, getRealV) { //single row, row == null means selected main row
var m = this, gd = this.grid, fldId = m.fieldNameA(fldName), vm = null, itm = m.fieldsAll[fldId];
if (!itm) itm = this.fieldsAll.item(fldName);
if(!itm)return;
if (!oTR) oTR = m._selection.getDataTRs(0, 1)[0];
if (!oTR) return;
if (getRealV) {vm = itm.valuesMapRvs;}
var hds = tbGetHeads(gd), hd = hds[fldId];
if (hd == null) return teMapVal(vm, getAtr(oTR, teAtrFldNm(fldId)));
var oTD = oTR.cells[hd.cellIndex]; if (oTD == null) return;
return teMapVal(vm, teTdGetValue(oTD, hasBit(itm.opConfig, GIA.ValueIsOuterHTML)));
}
po.getFieldValueR = function (fldName, oTR) { return this.getFieldValue(fldName, oTR, 1); }
po.getFieldValues = function (fldName, tarTRs, getRealV) {//multi rows
var m = this, gd = this.grid, res = [], vm, fldId = (fldName instanceof OpItem) ? fldName.name : m.fieldNameA(fldName), itm = m.fieldsAll[fldId]; if (!itm) return;
if (tarTRs == -1) tarTRs = m.getAllDataTRs(); //all rows
tarTRs = m._strsau(tarTRs);
if (!tarTRs || tarTRs.length == 0 || !tarTRs[0]) return;
if (getRealV) {
vm = itm.valuesMapRvs;
}
var hds = tbGetHeads(gd), hd = hds[fldId];
if (!hd) {
//check td name
for (var i = 0; i < hds.length; i++) {
if (getAtr(hds[i],"name") == fldId) {
hd = hds[i]; break;
}
}
}
var idx = hd ? hd.cellIndex : -1, atrNm = teAtrFldNm(fldId), itm = idx == -1 ? null : m.getField(hd);
if (idx == -1) {
for (var i = 0; i < tarTRs.length; i++) { res.push(teMapVal(vm, getAtr(tarTRs[i], atrNm))); }
} else {
var ishtml = getRealV && hasBit(itm.opConfig, GIA.ValueIsOuterHTML);
for (var i = 0; i < tarTRs.length; i++) { var otd = tarTRs[i].cells[idx]; res.push(ishtml ? otd.innerHTML : teMapVal(vm, teTdGetValue(otd))); }
}
if (getRealV && itm) {
var dty = itm.dataType, iL = res.length;
if (dty == GDT.Integer || dty == GDT.Real || dty == GDT.Short) {
for (var i = 0; i < iL; i++) {
res[i] = teDeformatNumDo(res[i]);
}
}
}
return res;
}
po.getFieldValuesR = function (fldName, tarTRs) { return this.getFieldValues(fldName, tarTRs, 1); }
po.getFieldsValues = function (fldNames, tarTRs, fieldDelimiter, bSeparateField, getRealV, useNullIfMiss) {
//bSeparateField 表示傳回的資料是一個欄位一組陣列,否則是和表格一樣,一個記錄一列
var m = this, res = [], flds, fl, cmb = fieldDelimiter != null;
if (tarTRs == -1) tarTRs = m.getAllDataTRs(); //all rows
tarTRs = m._strsau(tarTRs);
if (!tarTRs) return;
if (!(tarTRs instanceof Array)) tarTRs = [tarTRs];
if (typeof fldNames == "string") flds = fldNames.split(","); else flds = fldNames;
fl = flds.length;
for (var i = 0; i < fl; i++) {
var v = m.getFieldValues(flds[i], tarTRs, getRealV);
if (!v && !useNullIfMiss) return;//欄位未顯示
res.push(v);
}
if (cmb || !bSeparateField) {
var resN = [], l2 = res[0].length;
for (var j = 0; j < l2; j++) {
var v = [];
if (useNullIfMiss) { for (var i = 0; i < fl; i++) { if (res[i]) v.push(res[i][j]); } } else { for (var i = 0; i < fl; i++) { v.push(res[i][j]); } }
if (cmb) resN.push(v.join(fieldDelimiter)); else resN.push(v);
}
return resN;
}
return res;
}
po.getFieldsValuesRCSN = function (fldNames, tarTRs) { return this.getFieldsValues(fldNames, tarTRs, null, 1, 1,1); }
po.getFieldsValuesRCS = function (fldNames, tarTRs) { return this.getFieldsValues(fldNames, tarTRs, null, 1, 1); }
po.getFieldsValuesR = function (fldNames, tarTRs, fieldDelimiter, bSeparateField) { return this.getFieldsValues(fldNames, tarTRs, fieldDelimiter, bSeparateField, 1); }
po.getSelectedFields = function () {
var m = this, s = m._selection, tds = s.getDataTDsOROA(1, 1, 1), h = tds.length, itms = new OpItems();
for (var i = 0; i < h; i++) {
var ts1 = tds[i][0];
for (var k = 0; k < ts1.length; k++) {
var itm = m.getField(ts1[k]);
if (!itms[itm.name]) itms.add(itm);
}
}
return itms;
}
po.getSelectedTRs = function (shwAlert) {
var se = this._selection, res = se.getDataTRs(0,0,1);
if ((!res || res.length < 1) && shwAlert) alert(i18nm.NoObjectSelected);
return res;
}
po.getPageId = function () { return getTargetPage(this); }
po.getId = function () { return this.id; }; //必要方法
po.getCaption = function () { return this.text; }
po.getTextUIKF = function (oaTR, fldCntDft, noJoin) {
if (!oaTR || oaTR.length == 0) oaTR = [this.mainTR()];//return;
var m = this, g = m.grid, fs = getAtr(g, "uikfs");
if (!fs) {
if (!fldCntDft) return;
var k = 0, tr = g.rows[0], nm;
for (var i = m.colBeginData(); i < tr.cells.length; i++) {
nm = m.getField(tr.cells[i]).name;
if (fs) fs = fs + "," + nm;
else fs = nm;
k++;
if (k >= fldCntDft) break;
}
}
if (noJoin) return m.getFieldsValues(fs, oaTR, null, 1, 1); //各欄位獨立讀取
var v = m.getFieldsValues(fs, oaTR, "\t");
return v.join("\r");
}
po.mainTD = function () { return this._selection.mainDataTD(); }
po.mainTR = function () { return this._selection.mainDataTR(); }
po.getSelectedColsIdx = function (LeftToRight) {
var tds = this._selection.getTDs(1, LeftToRight, 1), res = [];
for (var i = 0; i < tds.length; i++) { res.push(tds[i].cellIndex); }
return res;
}
po.setFieldValueQ = function (fldName, val, tarRow) { return this.setFieldValue(fldName, val, tarRow, true, true); }
po.setFieldValuesQ = function (fldName, aVal, oaTR, isPrimalVal, forceSet) { return this.setFieldValues(fldName, aVal, oaTR, true, true, isPrimalVal,null,null,forceSet); }
po.setFieldValue = function (fldName, val, tarRow, bNoEditLog, bNoEvent, isPrimalVal, isHTML, isSetByCode) {
if (!tarRow) tarRow = this.mainTR();
if (!tarRow) return;
if (tarRow.tagName == undefined) tarRow = this.grid.rows[tarRow];
return this.setFieldValues(fldName, [val], [tarRow], bNoEditLog, bNoEvent, isPrimalVal, isHTML, isSetByCode);
}
po.setFieldValues = function (fldName, aVal, oaTR, bNoEditLog, bNoEvent, isPrimalVal, isHTML, isSetByCode, forceSet, chkOldVal, noFgnRefresh, ignoreNull) {
var m = this, tb = m.grid, fldId = m.fieldNameA(fldName), fa = m.fieldsAll, itm = fa[fldId]; if (!itm) return;
var opatr = itm.opConfig, dtpy = itm.dataType, cpt = itm.text, tr4Fg, vo,
hds = tbGetHeads(tb), hd = hds[fldId], tr, v, vmDict = itm.valuesMapRvs, autoRpt = !oaTR, ix;
if (forceSet) opatr = ((opatr | GIA.WriteDenied) ^ GIA.WriteDenied);
oaTR = m._strsau(oaTR); if (!oaTR.length) return;
tr4Fg = oaTR;
if (!(aVal instanceof Array)) {
var naV = [];
for (var r = 0, rl = oaTR.length; r < rl; r++) {
naV.push(aVal);
}
aVal = naV; autoRpt = 0;
}
if (dtpy == GDT.Integer || dtpy == GDT.Real || dtpy == GDT.Short) {
for (var i = 0; i < aVal.length; i++) {
if (aVal[i] && aVal[i].toString().indexOf("%") > 0) {
aVal[i] = teDeformatNumDo(aVal[i]);
}
}
}
if (chkOldVal) {
vo = m.getFieldValues(fldId, oaTR, 1);
if (!vo) return alert("failed to get val for foreign fields update");
tr4Fg = [];
for (var i = 0; i < vo.length; i++) {
if (vo[i] != aVal[i] && aVal[i] != null) tr4Fg.push(oaTR[i]);
}
}
if (itm.isAttribute()) {
if (!vo) vo = m.getFieldValues(fldId, oaTR, 1);
for (var r = 0, rl = oaTR.length; r < rl; r++) {
if (ignoreNull && aVal[r] == null) continue;
if (hasBit(opatr, GIA.NoNull)) aVal[r] = GJT.trim(aVal[r]);
tr = oaTR[r]; ix = r;
if (autoRpt) ix = r % aVal.length;
v = aVal[ix];
if (vo && (vo[r] == v)) { }
else if (bNoEditLog) { atrFldSetV(tr, fldId, v, bNoEvent); }
else {
if (cmnIsTextTypeCorrect(teMapVal(vmDict, v), dtpy)) {
atrFldSetV(tr, fldId, v, bNoEvent);
if (!hasBit(opatr, GIA.SaveDenied) && !hasBit(opatr, GIA.Virtual)) {
if (getAtr(tr, teAtrFldNm4OrigVal(fldId)) == v) m.editLogRemove(tr, fldId); //back to primal Value
else m.editLogAdd(tr, fldId, v);
}
}
}
if (isPrimalVal) setAtr(tr, teAtrFldNm4OrigVal(fldId), v == null ? KW.dbNull : v);
}
}
if (noFgnRefresh || isPrimalVal) tr4Fg = null; //no foreign action
if (!hd) {
m.shwFgnData(itm, tr4Fg);
return false;
}
var cix = hd.cellIndex;
for (var r = 0; r < oaTR.length; r++) {
if (ignoreNull && aVal[r] == null) continue;
oTD = oaTR[r].cells[cix];
if (isPrimalVal) setAtr(oTD, KW.PtyOrigValue, (aVal[r] == null ? KW.dbNull : aVal[r]));
if (bNoEditLog) { m.tdSetValueQ(oTD, aVal[r], !bNoEvent); }
else m.tdSetValueCheckDo(oTD, aVal[r], !isSetByCode, opatr, dtpy, cpt, vmDict, null, bNoEvent);
}
m.shwFgnData(itm, tr4Fg,[oTD]);
}
po.getFgnSet = function () {
var m = this; if (m._fgnSet != undefined) return m._fgnSet;
if (!m.opst) m.setOps(getDvOpSetting(m, ""));
var fgns = m.opst.fgns;
if (!fgns || fgns.length == 0) m._fgnSet = 0; else m._fgnSet = fgns;
return m._fgnSet;
}
po._getFLS = function () { var o = this.opst; if (o && o.fls && o.fls.length > 0) return o.fls; }
po._getFCI = function () { var o = this.opst; if (o && o.fci && o.fci.length > 0) return o.fci; }
po._needEvalFLS = function (forIns) {
var m = this, e = GJT.geFormulaOptnEnum, fls = m._getFLS(); if (!fls) return;
for (var i = 0; i < fls.length; i++) {
var f = fls[i], opn = f.fmtOpn; if (f.disabled) continue;
if (forIns) { if ((opn & e.EvalAfterInsertRows) == e.EvalAfterInsertRows) return 1; }
else { if ((opn & e.EvalOnly4Changed) != e.EvalOnly4Changed) return 1; }
}
}
po._isInCFI = function (itms, fci) {
var m = this;
if (!fci) fci = m._getFCI(); if (!fci) return;
if (!itms) itms = m.getSelectedFields();
for (var i = 0; i < fci.length; i++) { if (m._isInCFI0(fci[i], itms)) return 1; }
}
po._fciHasLAG = function () {
var m = this, fci = m._getFCI(), e = GJT.CondFmtOptnEnum; if (!fci) return;
for (var i = 0; i < fci.length; i++) { if (!fci[i].disabled && (fci[i].formula.indexOf("LAG") > -1 || (fci[i].fmtOpn & e.forIntervalChange) == e.forIntervalChange)) return 1; }
}
po._isInCFI0 = function (f, itms) {
if (f.disabled) return;
var fml = f.formula; if (!fml) return;
if (fml.indexOf("[%") < 0 || fml.indexOf("%]") < 0) return 1; //constant formula
for (var i = 0; i < itms.length; i++) {
if (fml.indexOf("[%" + itms[i].name + "%]") > -1 || fml.indexOf("[%" + itms[i].fieldName + "%]") > -1) return 1;
}
}
po._fmtcndParse = function (f) {
var m = this, tarF = f.tarFld, fml = f.formula, paramSty = f.paramstyle, prm = [];
if (tarF) {
var tarIdx = [], atf = tarF.split(","), tarItm = [];
for (var i = 0; i < atf.length; i++) {
tarIdx.push(m.getCellIndex(atf[i]));
}
prm.tarIdx = tarIdx;
}
if (paramSty) {
var xx = m._fmtcndParse2([], paramSty, "{%", "%}");
for (var i = 0; i < xx.length; i++) {
if (xx[i].field || xx[i].rawField) xx[i].prm = m._fmtcndParse2([], xx[i].field || xx[i].rawField, "[%", "%]");
}
f.prmSt = xx;
} else delete f.prmSt;
f.prm = m._fmtcndParse2(prm, fml, "[%", "%]");
return prm;
}

po._fmtcndParse2 = function (prm, fml, Q1, Q2) {
var m = this, ix0 = 0, ix1 = 0, ix2, ix3, ixG, p, n, x, xa, fldnm = "", afs = m.fieldsAll;
while (ix0 > -1) {
ix1 = fml.indexOf(Q1, ix0); p = { cellIdx: -1, sft: 0, cnst: "", field: "" }; n = 0;
prm.push(p); p.cellIdx = -1; p.sft = 0; //列偏移量
if (ix1 >= 0) {
ix2 = fml.indexOf(Q2, ix1);
if (ix2 < 0) { prm.err = 1; break; } //未成對,有錯
ixG = fml.indexOf("LAG", ix0);
if (ixG > -1 && ixG < ix1) {//有LAG 函數
ix3 = fml.indexOf(")", ix2);
p.cnst = fml.substring(ix0, ixG); //常數
x = fml.substring(ix2 + Q2.length, ix3);
xa = x.split(",");
p.sft = parseInt(xa[1], 10);
ix3++;
} else {
p.cnst = fml.substring(ix0, ix1); //常數
ix3 = ix2 + Q2.length;
}
fldnm = fml.substring(ix1 + Q1.length, ix2);
p.rawField = fldnm;
p.field = m.fieldNameA(fldnm);
p.opField = afs[p.field];
if (p.opField) p.vm = p.opField.valuesMapRvs; //for get real value
p.cellIdx = m.getCellIndex(fldnm);
ix0 = ix3;
} else {
p.cnst = fml.substring(ix0, fml.length);
break;
}
}
return prm;
}

po._strsau = function (rws) { if (!rws) return this._selection.getDataTRs(0,0,1); else return rws; } //依照使用者選取順序,tr唯一化
po._formualEval = function (oaTRs, oaTD, evtType) {
var m = this, rws = m._strsau(oaTRs), fci = m._getFLS(); if (!fci || !rws) return;
var il = rws.length, ul = 100;
if (il > ul) return m._formualEvalSlice(rws, 0, ul, ul, oaTD, evtType); //分批顯示
m._formualEval0(rws, oaTD, evtType);
}

po._formualEvalSlice = function (rws, idx1, idx2, ul, oaTD, evtType) {
var m = this, rn = rws.slice(idx1, idx2);
m._formualEval0(rn, oaTD, evtType);
var idx3 = idx1 + ul, idx4 = idx2 + ul;
if (idx3 >= rws.length) return;
window.setTimeout(function () { m._formualEvalSlice(rws, idx3, idx4, ul, oaTD, evtType); }, 1000);
}
po._formualEval0 = function (rws, oaTD, evtType) {
var m = this, fci = m._getFLS(); if (!fci) return;
try {
var rwsA = m.grid.rows, e = GJT.geFormulaOptnEnum;
for (var i = 0; i < fci.length; i++) {
var f = fci[i], opn = f.fmtOpn;
var prm = f.prm, inDlg = hasBit(opn, e.ShowResultInDlg), doBlank = hasBit(opn, e.OverwriteBlankOnly), newonly = hasBit(opn, e.OverwriteNewRecOnly)
, evChg = hasBit(opn, e.EvalOnly4Changed), noAlrt = hasBit(opn, e.NoAlert), edlog = hasBit(opn, e.EditLog), doEvt = hasBit(opn, e.RaiseEvent),aftInsRows=hasBit(opn, e.EvalAfterInsertRows);
if (f.disabled || (!f.tarFld && !inDlg)) continue;
if (aftInsRows && evtType != EVI.RowInserted) continue;
if (!prm) prm = m._fmtcndParse(f);
if (prm.err) continue;
var pl = prm.length, v = [], tfa = f.tarFld.split(",");
for (var j = 0, k = rws.length; j < k; j++) {
var tr = rws[j];
if (doBlank) {
var tx2 = m.getFieldValue(tfa[0], tr, 1);
if (tx2) { v[j] = tx2; continue; }
} else if (newonly && !m.isNewRow(tr)) {
var tx2 = m.getFieldValue(tfa[0], tr, 1);
v[j] = tx2; continue;
}
if (evChg) {
var ignr = 1;
if (oaTD && prm.length) {
for (var h = 0; h < oaTD.length; h++) {
if (!ignr || oaTD[h].parentNode != tr) continue;
var opfd = m.getField(oaTD[h]);
for (var p = 0; p < pl; p++) {
if (opfd == prm[p].opField) { ignr = 0; break; }
}
}
}
if (ignr) { v[j] = m.getFieldValue(tfa[0], tr, 1); continue; }
}
var txt = m._fmtByCndnEval(m, tr, prm, pl, rwsA, "");
if (!txt) continue;
if (noAlrt) {
try { v[j] = eval(txt); } catch (ex2) { v[j] = m.getFieldValue(tfa[0], tr, 1); }
}
else v[j] = eval(txt);
}
if (f.tarFld) { for (var j = 0; j < tfa.length; j++) { m.setFieldValues(tfa[j], v, rws, !edlog, !doEvt, 0, 0, 1, !edlog, 1, 0, 1); } }
if (inDlg) {
var dga = m._dlg4Fml;
if (!dga) { dga = []; m._dlg4Fml = dga; }
if (!dga[i] || isHidden(dga[i])) {
dga[i] = new DialogInBody("", f.name);
dga[i].moveToLT(); showBesideMouse(dga[i].dlg);
}
dga[i].main.innerText = v.join("\r\n");
}
}
} catch (ex) { alert(ex); }
}
po._fmtByCndn = function (oaTRs) {
var m = this, rws = m._strsau(oaTRs), fci = m._getFCI(); if (!fci || !rws) return;
var il = rws.length, ul = 100;
if (il > ul) return m._fmtCndnSlice(rws, 0, ul, ul); //分批顯示
m._fmtByCndn0(rws);
}
po._fmtCndnSlice = function (rws, idx1, idx2, ul) {
var m = this, rn = rws.slice(idx1, idx2);
m._fmtByCndn0(rn);
var idx3 = idx1 + ul, idx4 = idx2 + ul;
if (idx3 >= rws.length) return;
window.setTimeout(function () { m._fmtCndnSlice(rws, idx3, idx4, ul); }, 1000);
}
po._fmtByCndn0 = function (oaTRs) {
var m = this, rws = oaTRs, fci = m._getFCI();
if (!fci) return;
//m.switchSelMode(-1);
try {
var rwsA = m.grid.rows, e = GJT.CondFmtOptnEnum, rwsAD;
for (var i = 0; i < fci.length; i++) {
var f = fci[i], opn = f.fmtOpn, refsty = f.refstyle;
if (f.disabled) continue;
var prm = f.prm, apndSty = hasBit(opn, e.appendStyle), clearSty = !hasBit(opn, e.keepStyleIfFalse), usePrmSty = hasBit(opn, e.useParamStyle),
forIntv = hasBit(opn, e.forIntervalChange), evAll = hasBit(opn, e.mustEvalAllRows), plSnd = hasBit(opn, e.playSound);
if (!prm) prm = m._fmtcndParse(f);
if (prm.err) continue;
var pl = prm.length, lastev, curSty, lastdoIt;
if (evAll) { if (!rwsAD) rwsAD = m.getAllDataRows(); rws = rwsAD; }
else rws = oaTRs;
for (var j = 0, k = rws.length; j < k; j++) {
var tr = rws[j];
var txt = m._fmtByCndnEval(m, tr, prm, pl, rwsA, "false");
if (txt == "") continue;
var ev = 0;
try {
ev = eval(txt);
}
catch (ex4) { continue; }
var doIt = ev, tarIdx = prm.tarIdx, styN = refsty;
if (usePrmSty && f.prmSt) {
var nx = "", pst = f.prmSt;
for (var h = 0; h < pst.length; h++) {
var p = pst[h]; nx += p.cnst;
if (p.prm) {
var fmx = m._fmtByCndnEval(m, tr, p.prm, p.prm.length, rwsA, ""), evr;
try{
evr = eval(fmx);
} catch (ex5) { evr = fmx; }
nx += evr;
}
}
styN = nx;
}
if (forIntv) {
clearSty = 1;
if (j == 0) { doIt = 0; }
else if (lastev == ev) { doIt = lastdoIt; }
else { doIt = !lastdoIt; }
}
if (!tarIdx) m.setRefSty(tr, styN, doIt, apndSty, clearSty);
else {
for (var h = 0, hl = prm.tarIdx.length; h < hl; h++) {
if (tarIdx[h] > -1) m.setRefSty(tr.cells[tarIdx[h]], styN, doIt, apndSty, clearSty);
}
}
if (doIt && plSnd) tePlaySound(f.name, f.soundURL, f.soundparam);
lastev = ev; lastdoIt = doIt;
}
}

} catch (ex) { }
//m.switchSelMode(1);
}
po._fmtByCndnEval = function (m, tr, prm, pl, rwsA, dftV) {
var txt = "", tr2, tx0;
for (var h = 0; h < pl; h++) {
var p = prm[h];
txt += p.cnst;
if (p.field) {
if (p.sft != 0) {
var r2 = tr.rowIndex - p.sft;
if (r2 < m.rowBeginData() || r2 >= rwsA.length) { txt += dftV; continue; } //列超出範圍 設定為false
tr2 = rwsA[r2];
} else tr2 = tr;
if (!tr2 || tr2.cells.length == 0) continue;
if (p.cellIdx > -1) tx0 = teTdGetValue(tr2.cells[p.cellIdx]);//.innerText;
else tx0 = tr2.getAttribute(teAtrFldNm(p.field));
if (p.opField.displayFormat) tx0 = teDeformatNum(tx0);
//if(tx0==null)return null; //null also must be evaluated
tx0 = teMapVal(p.vm, tx0);
txt += tx0;
//if (p.cellIdx > -1) txt += teMapVal(p.vm, tr2.cells[p.cellIdx].innerText);
//else txt += tr2.getAttribute(teAtrFldNm(p.field));
}
}
return txt;
}
po.setRefSty = function (o, refsty, setIt, apndSty, clearSty) {
if (setIt) {
if (!o._oriStt) { o._oriSty = getAtr(o, "style"); o._oriStt = 1; }
if (apndSty) {
refsty = o.getAttribute("style") + ";" + refsty;
}
o.setAttribute("style", refsty);
var s = o.style; o.oriC = s.color; o.oriBgC = s.backgroundColor;
}
else if (clearSty && o._oriStt) {
if (o._oriSty) o.setAttribute("style", o._oriSty); else o.removeAttribute("style");
var s = o.style; o.oriC = s.color; o.oriBgC = s.backgroundColor;
}
}
po.setOps = function (ops) {
var m = this; m.opst = ops;
if (!m.opst) m.opst = {};
var rwp = m.opst.rowscsp;
if (rwp != null) {
m.setRowColor(rwp);
}
delete m._fgnSet; delete m._impfgn;
var fgns = m.getFgnSet(), itms = m.fieldsAll, hds = tbGetHeads(m.grid);
if (fgns) {
for (var i = 0; i < fgns.length; i++) {
var r = fgns[i];
if (r.disabled) continue;
if (!r._mstF) r._mstF = itms.collect(r.mflds); // strToItems(r.mflds);
var itmsRfs = itms.collect(r.fgrfsflds);
var _nnl = itmsRfs[0] && hasBit(itmsRfs[0].opConfig, GIA.NoNull);
if (r.ImportAsNewColumns) {if(!m._impfgn) {m._impfgn=[]};m._impfgn.push(r); continue; }
for (var j = 0; j < r._mstF.length; j++) {
var itm = itms[r._mstF[j].name];
if (!itm) continue;
if (r.mfdenied) continue;
itm.opConfig =( (itm.opConfig | GIA.WriteDenied) ^ GIA.WriteDenied) | ( _nnl ? GIA.NoNull : 0); //default editable
var hd = hds[itm.name];
if (hd) {hd.style.fontWeight = "bold"; if(_nnl) hd.style.color= m._color4NoNull; }
}
}
}
m._fmtByCndn(m.getAllDataRows());
m._clearOpsCache();
}
po.ImportForeignInfo = function () {
var m = this, itms = new OpItems(), ifg = m._impfgn;
if (!ifg) return;
for (var i = 0; i < ifg.length; i++) {
var r = ifg[i], itm = new OpItem(r.name, r.caption);
itm._r = r;
itm.onclick = function (a,b,c) { m.ImportForeignInfoDo(a,b,c); };
itms.add(itm);
}
SysShowMenu(itms);
}
po.ImportForeignInfoDo = function (itm,itms) {
//alert(this.text + "--" + r.name + "--" + r.caption);
var m=this, trs = m.getSelectedTRs(1),r=itm._r;
if (!trs) return;
if (r.AskUserSelColumns) {
//let user select columns to import
var tarTb=fgFieldsGetTarTbl(m,r);
var nitms = tarTb.fldsItems;
//remove hidden fields
nitms = nitms.collect(null, 0, GIA.IsAttribute, 1);
var itmsel=nitms.collect(r.fgrfsflds);
var slr = selItems("",i18nm.SelectTargetField.text, nitms, itmsel, null,null,function(slrr){m.ImportForeignInfoAskColDone.call(m,slrr);}); //(name, text, itmsAll, itmsSel, width, height, handleDone, shwAllItems, freeRemove)
slr._tarR=r;
return;
}
return this.shwFgnDataDo(r, trs, null);
}
po.ImportForeignInfoAskColDone = function (slr) {
var r=slr._tarR;
r.fgrfsflds = slr.itemsSelected.getNames(",");
var m=this, trs = m.getSelectedTRs(1);
if (!trs) return;
return this.shwFgnDataDo(r, trs, null);
}
po.shwFgnDataTds = function (oaTD) {
var m = this, fgns = m.getFgnSet(), fci = m._getFCI(), fls = m._getFLS(); if ((!fgns && !fci && !fls) || !oaTD || oaTD.length == 0) return;
var itms = new OpItems(), dict = GJT.newDictionary(), oaTR = [], tl = oaTD.length;
for (i = 0; i < tl; i++) {
var tdN = oaTD[i], tr = getTR(tdN), rx = tr.rowIndex + "";
var itmN = m.getField(tdN);
if (!itms[itmN.name]) itms.add(itmN);
if (!dict.exists(rx)) { dict.add(rx, oaTR); oaTR.push(tr); }
}
m.shwFgnData(itms, oaTR, oaTD);
}
po.shwFgnData = function (itms, oaTR, oaTD) {
var m = this, fgns = m.getFgnSet(), fci = m._getFCI(), fls = m._getFLS();
if ((!fgns && !fci && !fls) || !oaTR || oaTR.length == 0) return;
if (!(itms instanceof OpItems)) {
var ims = new OpItems(); ims.add(itms);
itms = ims;
}
if (fci && m._isInCFI(itms)) m._fmtByCndn(oaTR, oaTD);
if (fls && m._isInCFI(itms, fls)) m._formualEval(oaTR, oaTD);
for (var i = 0; i < fgns.length; i++) {
var r = fgns[i];
if (r.disabled || r.ImportAsNewColumns) continue;
if (!r._mstF) r._mstF = m.fieldsAll.collect(r.mflds); // strToItems(r.mflds);
var doit = false;
for (var j = 0; j < r._mstF.length; j++) {
if (itms[r._mstF[j].name]) { doit = true; break; }
}
if (!doit) continue;
m.shwFgnDataDo(r, oaTR, null);
}
}
po.shwFgnDataDo = function (fgn, oaTR, loosenLvl) {
var m = this, r = fgn, itmsM = r._mstF, v = m.getFieldsValues(r.mflds, oaTR, null, 1, 1), dict = GJT.newDictionary(), vk = [];
if (!r._fgF) r._fgF = strToItems(r.fgflds);
var fl = itmsM.length, noDat = 1;
if (loosenLvl != null) fl -= loosenLvl;
if (fl < 1) return;
for (var j = 0; j < fl; j++) {
vk[j] = GJT.newDictionary();
}
for (var i = 0; i < oaTR.length; i++) {
var kx = v[0][i], hasBlnk = 0;
vk[0].add(kx);
if (kx) noDat = 0; else hasBlnk = 1;
for (var j = 1; j < fl; j++) {
if (v[j][i]) noDat = 0; else hasBlnk = 1;
kx += "\t" + v[j][i];
vk[j].add(v[j][i]);
}
if (hasBlnk && !r.allowBlankVal) continue;
var trs = dict.item(kx);
if (!trs) { trs = []; dict.add(kx, trs); }
trs.push(oaTR[i]); //collect tr by key
}
if ((noDat && !r.allowBlankVal && fl < 2) || !dict.keys().length) return;
var qtx = [];
for (var j = 0; j < fl; j++) {
var itm = r._fgF[j];
qtx.push([itm.name, KW.Dlm2, vk[j].keys().join(","), KW.Dlm2, itmsM[j].dataType, KW.Dlm2, itmsM[j].opConfig, KW.Dlm2, GJT.compareModeEnum.In, KW.Dlm2, ""].join(""));
}
var prm = ["Action=rshFgFlds&surTbl="]; prm.push(encodeURIComponent(r.ftbl));
prm.push("&tarid=", encodeURIComponent(m.id));
prm.push("&shw=", encodeURIComponent(r.rfsflds));
prm.push("&qry=", encodeURIComponent(qtx.join(KW.Dlm1)));
prm.push("&sel=", encodeURIComponent(r.fgrfsflds));
prm.push("&tarkey=", encodeURIComponent(r.mflds));
prm.push("&surkey=", encodeURIComponent(r.fgflds));
if (r.filter) prm.push("&fgfilter=", encodeURIComponent(r.filter));
prm.push("&", KW.PrmResponseContentType, "=", encodeURIComponent("application/json"));
prm.push("&", KW.PrmTimezoneOffset, "=", (new Date()).getTimezoneOffset());
if (r.ImportAsNewColumns || r.ImportAsNewAttr) {
var nmpx = r.nameprefixImpt;
if (!nmpx) { nmpx = "_vfimpxz_"; r.nameprefixImpt = nmpx; }
prm.push("&nmPrefix=", encodeURIComponent(nmpx));
}
var req = GJT.xmlHttpRequest(), qryURL = m.qryURL;
req.onreadystatechange = function () { teGetFgFieldsValDone(req, m, dict, fgn, loosenLvl); };

if (!qryURL) qryURL = msAjaxPageName;
req.open("POST", qryURL, true);
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8"); //用於send(content) ， server端用request["變數名"] 接收
req.send(prm.join(""));
}
po.validateValue = function (fldName, val, tr, forSetVal) {
var m = this, itm = m.fieldsAll[fldName], opatr = itm.opConfig, dtpy = itm.dataType;
if (hasBit(opatr, GIA.NoNull)) { val = GJT.trim(val); if (val == "") return 0 }
if (cmnIsTextTypeCorrect(teMapVal(itm.valuesMapRvs, val), dtpy)) {
if (forSetVal && tr && (hasBit(opatr, GIA.ChangeDenied) && !m.isNewRow(tr))) return 0;
return true;
}
}

po.getCellIndex = function (fldNm, caseInsensitive) {
if (!fldNm) return -1;
var hds = tbGetHeads(this.grid); if (!hds) return -1;
var hd = hds[this.fieldNameA(fldNm, caseInsensitive)];
if (!hd) {
for (var i = 0; i < hds.length; i++) {
if (getAtr(hds[i], "name") == fldNm) {
hd = hds[i]; break;
}
}
}
if (hd) return hd.cellIndex;
return -1;
}
po.firstRow = function () {
return this.grid.rows[this.rowBeginData()];
}
po.rowBeginData = function () {
return parseInt(getAtr(this.grid, KW.FirstDataRow, 1), 10);
}
po.colBeginData = function () { return parseInt(getAtr(this.grid, KW.FirstDataColumn, 1), 10); }
po.scrollToVisible = function (td) {
if (!td) td = this.mainTD(), w = window;
if (!td) td = this.grid;
if (isHidden(td)) return;
var bdy = BDY(), pos = getOffsetO(td, bdy), nx, ny, sl = GJT.getWindowScrollLeft(), st = GJT.getWindowScrollTop();
pos[1] = pos[1] - 40; //toolbar
if (pos[0] < sl) nx = pos[0];
else if (pos[0] > sl + GJT.getWindowWidth()) nx = pos[0] + td.offsetWidth;
if (pos[1] < st) ny = pos[1];
else if (pos[1] > st + GJT.getWindowHeight()) ny = pos[1] + td.offsetHeight;
if (nx != null || ny != null) {
//if (td.scrollIntoView) return td.scrollIntoView();//do not use this method, it cause object covered by float toolbar
if (nx == null) nx = pos[0]; if (ny == null) ny = pos[1]; window.scroll(nx, ny);
}
}
po.setVisible = function (show) {
var m=this, ds = show ? "" : "none";
m.container.style.display = ds;
if(!m.tileMode)m.grid.style.display = ds;
m.ReviseFTR();
if(!show) hideIt(m.criterionButtons);
//this._hidden=!show;
}
po.selColumnsSet = function () {
var m = this, ss = getAtr(m.grid, KW.ColumnsSet); if (!ss) return;
var sa = cmnSplit2(ss, KW.Dlm0, KW.Dlm1), itms = [];
for (var i = 0; i < sa.length; i++) {
itms.push({ name: sa[i][0], text: sa[i][0], onclick: m._prcsCLST, flds: sa[i][1], m: m });
}
SysShowMenu(itms);
}
po._prcsCLST = function (itm) {
itm.m.arrangeColumns(itm.flds.replace(new RegExp(KW.Dlm2, "gi"), ","));
}
po.queryTools = function (cmdTypeCode, itms) {
var m = this, c = CMDE, ct = cmdTypeCode, pvg = m.programPrivilege, P = PPVG, idx, se = m._selection, tds = se.getTDs(), y = tds.length > 0;
if (!itms) itms = new OpItems();
if (m.bfrQueryTools && m.bfrQueryTools(m, cmdTypeCode, itms)) return;
if (getAtr(m.grid, "hidetools") == "Y") return itms;
if (ct == c.mnuFile) {
if (P.canSave(pvg)) sysCmdAdd(itms, [c.Save, c.SaveWhole]);
if (hasBit(pvg, P.CheckinFile)) sysCmdAdd(itms, [c.CheckinFile]);
if (hasBit(pvg, P.CheckoutFile)) sysCmdAdd(itms, [c.CheckoutFile, c.CheckFileCount]);
} else if (ct == c.mnuEdit) {
m.queryTools(c.mnuEdit1, itms);
m.queryTools(c.mnuEdit2, itms);
} else if (ct == c.mnuEdit1) {
if (m._undoCtrl.length > 0) sysCmdAdd(itms, c.UndoPull);
idx = itms.length;
if (y) {
var dtds = se.getDataTDsOROA(); if (!dtds[0]) return itms;
var cb = dtds[0].length == 0 ? 0 : m.isChangeable(dtds[0][0][0]);
sysCmdAdd(itms, [c.Copy, c.CopyWithTitle, c.CopyHTML, c.CopyHTMLWithTitle]);
idx = itms.length;
if (cb) {
sysCmdAdd(itms, c.Paste)
}
if (P.canEdit(pvg) || cb) {
if (P.canInsertRow(pvg)) sysCmdAdd(itms, [c.PasteInsert, c.CloneRows]);
if (dtds[0].length > 1) sysCmdAdd(itms, [c.FillUD, c.FillUDIncr]);
if (dtds[0].length > 0 && dtds[0][0].length > 1) sysCmdAdd(itms, c.FillLR);
sysCmdAdd(itms, c.ClearRange);
}
if (itms.length > idx) itms.insert(mnuHLine(), idx);
if (P.canInsertRow(pvg)) sysCmdAdd(itms, [c.InsertRow, c.AppendRow]);
if (P.canRemoveRow(pvg)) sysCmdAdd(itms, c.RemoveRows);
}
//if (itms.length > idx) itms.add(mnuHLine());
} else if (ct == c.mnuEdit2) {
idx = itms.length;
if (getAtr(m.grid, "supflow") == "Y") sysCmdAdd(itms, c.ShowFlowCtrl);
if(getAtr(m.grid, "supchglog") == "Y") sysCmdAdd(itms, c.ShowChgHistory);
if (getAtr(m.grid, "supFreeNote") == "Y") sysCmdAdd(itms, c.tlFreeNote);
if (getAtr(m.grid, "supRevReq") == "Y") sysCmdAdd(itms, c.tlReviseRequest);
if (y && P.canRemoveRow(pvg)) sysCmdAdd(itms, c.RmvDuplicateRows);
sysCmdAdd(itms, [m.enableSelect ? c.swToDocumentMode : c.swToSheetMode]);
if (m.fieldsKey.length == 1) sysCmdAdd(itms, c.CopyDataRowURL);
//swToDocumentMode swToSheetMode
if (y && P.canEdit(pvg) && cb) {
sysCmdAdd(itms, c.BeginEdit);
var itm = itms[itms.length - 1]; itm.text = itm.text + (itm.text.indexOf("F2") < 0 ? " ( F2 )" : "");
}
if (y && mIsMobileDev) sysCmdAdd(itms, c.ExtendSel);
if (y && P.canDelete(pvg)) {
if (itms.length > idx) itms.add(mnuHLine());
sysCmdAdd(itms, c.Delete);
}
} else if (ct == c.mnuView) {
m.queryTools(c.mnuView1, itms);
m.queryTools(c.mnuView2, itms);
} else if (ct == c.mnuView1) {
if (P.canSort(pvg) && y) { sysCmdAdd(itms, [c.SortA, c.SortD, c.SortN]);}
if (!(getAtr(m.grid,"colarrdnd")=="Y")) sysCmdAdd(itms, [c.ArrangeColumns]);
if (m.fieldsKey.length > 0) { sysCmdAdd(itms, [(!m._recFormDg || isHidden(m._recFormDg.dlg) ? c.ShowRecordForm : c.HideRecordForm)]); if (y) sysCmdAdd(itms, c.RefreshRows); }
} else if (ct == c.mnuView2) {
if (getAtr(m.grid, KW.ColumnsSet)) sysCmdAdd(itms, c.SelColumnsSet);
if (y) sysCmdAdd(itms, [c.FloatHeader, c.HideColumns, c.ShowColumns, c.HideRows, c.ShowRows, c.SetRowColor]);
if (se.isWholeRow(se.mainTD())) sysCmdAdd(itms, c.MoveRows);
if (se.isWholeCol(se.mainTD())) sysCmdAdd(itms, c.MoveCols);
if(y) sysCmdAdd(itms, c.ChgColumnWidth);
} else if (ct == c.SpecialTool) {
if (m.specialTools.length) { itms.concat(m.specialTools); itms.add(mnuHLine()); }
m.queryTools("cmnt", itms);
} else if (ct == c.ContextTool) {
m.queryTools("cmnt", itms);
if (itms.length && m.specialTools.length) { itms.add(mnuHLine()); itms.concat(m.specialTools); }
} else if (ct == "cmnt") {
if (P.canSave(pvg)) {
var ss = m.getTRsNeedSave(m.getSelectedTRs()), ss2 = m.getTRsNeedSave();
if (ss.length) sysCmdAdd(itms, c.Save);
if (ss2.length > ss.length) sysCmdAdd(itms, c.SaveWhole);
if(ss.length || ss2.length) itms.add(mnuHLine());
}
m.queryTools(c.mnuEdit1, itms); itms.add(mnuHLine()); m.queryTools(c.mnuView1, itms);
idx = itms.length;
if (hasBit(pvg, P.CheckinFile) && !m.isNewRow(m.mainTR())) sysCmdAdd(itms, [c.CheckinFile]);
if (hasBit(pvg, P.CheckoutFile) && !m.isNewRow(m.mainTR())) { sysCmdAdd(itms, [c.CheckoutFile, c.ShowAnnexImg, c.ShowAnnexList]); }
if (idx != itms.length) {
itms.insert(mnuHLine(), idx); itms.add(mnuHLine());
}
if (m.canExport) sysCmdAdd(itms, [c.Export]);
if (m.hasQuickQry && m.canQuery) {
sysCmdAdd(itms, c.QuickQuery);
if (m.canExport) sysCmdAdd(itms, c.QuickQueryExp);
}
if (m.hasReport) {
sysCmdAdd(itms, [c.CreateReport]);
if (m.canExport) sysCmdAdd(itms, [c.ExportReport, c.ExportReportToWindow]);
}
if (m.hasRelatedtems) sysCmdAdd(itms, [c.showRelatedItem]);
if (m._impfgn && m._impfgn.length) { sysCmdAdd(itms, c.ImportForeignInfo)
}
tePutValCarrierMenu(itms, m)
if (m.canQuery && !m.InqPrmO) sysCmdAdd(itms, c.advQuery);
if (y && m.relaFA && m.relaFA.length > 1) sysCmdAdd(itms, [c.ExpandAll]);
if (y && m.relaF) sysCmdAdd(itms, [c.expandQry]);
if (y && m.relaT) sysCmdAdd(itms, [c.expandQryRv]);
var ops = m.opst;
if (ops) {
if (ops.f4memosave) { if (isHidden(m.memoDlg)) sysCmdAdd(itms, [c.ShowMemoBox]); else sysCmdAdd(itms, [c.HideMemoBox]);
}
if (ops.f4numdtl && m.opst.f4numdtlsave) { if (isHidden(m.nummDlg)) sysCmdAdd(itms, [c.ShowNumMemoBox]); else sysCmdAdd(itms, [c.HideNumMemoBox]);
}
if (ops.f4memosave || ops.f4numdtl) sysCmdAdd(itms, [c.ShowMemoSymbo]);
}
if (y) sysCmdAdd(itms, c.ShowProperties);
sysCmdAdd(itms,c.SetPrintOneTable);
itms.add(mnuHLine());
sysCmdAdd(itms, [c.Personalizing]);
if (hasBit(pvg, PPVG.AdminUser)) sysCmdAdd(itms, [c.Developer]);
itms.add(mnuHLine());
m.queryTools(c.mnuEdit2, itms);
itms.add(mnuHLine());
m.queryTools(c.mnuView2, itms);
}
if (m.aftQueryTools && m.aftQueryTools(m, cmdTypeCode, itms)) return;
return itms;
}
po.hintAnnexAuto = function(otr,forForm){
var m=this,vn=[_AnnxF,_AnnxI,_AnnxL];
var flds = m.fieldsAll,c=flds.length;
for(var i=0;i < vn.length;i++){
if (m.getCellIndex(vn[i]) >= 0 || (forForm && flds[vn[i]])) { otr = otr ? otr : m.getAllDataTRs(); m.hintAnnexIcon(otr, i, 0, null, null, null, forForm); }
for(var k=0; k<c; k++){//檢查是否有外部附件欄位
var nm=flds[k].fieldName;if(!nm) continue;
var idx = nm.indexOf(vn[i] + "@");
if(idx == 0) {
var nmpfx = nm.substring(vn[i].length + idx + 1), ss = nmpfx.split("@");
if(ss.length > 1)
m.hintAnnexIcon(otr, i, 0, ss[0], ss[1], "@" + nmpfx, forForm);
}
}
}
}
po.hintAnnexIcon = function (otr, shwImg, forceShow, keyFld, tarId, nmpfx, forForm) {
var m = this, o, fk = keyFld ? keyFld : m.fieldsKey.getNames(",");
if (!tarId) tarId = m.id;
otr = otr ? otr : m.getAllDataTRs(); if (!otr || !fk || !otr.length) return;
var kv = m.getFieldValues(fk, otr, 1), wm = shwImg;
for (var i = kv.length - 1; i >= 0; i--) {//remove blank
if (!kv[i]) { kv.splice(i, 1); otr.splice(i, 1); }
}
if (!kv.length) return;
var sac = wm == 1 ? "getImgs" : (wm == 2 ? "getLists" : "getBrfInf"), xp = ["Action", "subact", "tarid", "kv"], vp = ["checkoutFile", sac, tarId, kv.join()];
var fnm, fcp, dty = GDT.String;
if (wm == 1) { fnm = _AnnxI; fcp = "Image"; }
else if (wm == 2) { fnm = _AnnxL; fcp = "Files List"; }
else { fnm = _AnnxF; fcp = "Files"; dty = GDT.Integer }
if (nmpfx) { fnm += nmpfx; fcp += nmpfx; }
//如果是為了顯示在表單上就不需要強制加入表格欄位
if (!forForm) m.addField(fnm, fcp, "", dty, GIA.WriteDenied | GIA.ValueIsOuterHTML, 1, forceShow); //(name, text, tip, datatype, opconfig, addColumn,forceShow)
if (wm > 0) m.changeFieldOpConfig(fnm, GIA.ValueIsOuterHTML);
var ix = m.getCellIndex(fnm), ix2, hm2, fco = GJT.FileCheckinOptionEnum;
if ((ix < 0 && !forForm) || (ix >= 0 && forForm)) return; //如果為了顯示在表單上,則只要欄位顯示在表格上就不需要重查,因為可以直接從表格內得到
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return;
var o;
try { o = JSON.parse(txt);} catch(ex) { o= eval(txt);}
if (o.err) return alert(o.err);
for (var i = 0; i < kv.length; i++) {
var td = otr[i].cells[ix], htm = [], t = o[kv[i]], ix2, hm2, k2 = 0, cc = [];
if (wm) {
if (t) {
for (var j = 0; j < t.length; j++) {
var f = t[j], ix2 = m.getCellIndex(f.fld), tItm = m.fieldsAll.item(f.fld), mtm, swi = (ix2 > -1 && tItm && tItm.isVirtual());
var src = msAjaxPageName4UI + "?act=checkoutFile&tarId=" + tarId + "&uid=" + f.uid, finm = f.fnm, nwWin = "";
if (f.isurl) { finm = f.ntx; src = f.fnm; nwWin = " target='opn" + tarId + "'"; if (!finm) finm = "URL";}
var xatr = f.fld ? (" fldblng='" + f.fld + "' ") : "";
if (wm == 1) mtm = "<img style='width:98%' src='" + src + "' onclick='teShowImgInDlg(this);' onmouseover='teShowImgInDlg2(this);'" + xatr + " />";
else mtm = "<a class='AnnexList" + (f.pnratt ? "Link" : "") + "'" + nwWin + " oncontextmenu='GJT.stopBubble()' href='" + src + "'" + xatr + " >" + GJT.encodeAttr(finm) + ((swi || !tItm) ? "" : ("<u style='background-color:#ddddee'>@" + tItm.text) + "</u>") + "</a>";
if (swi) cc[ix2] = (cc[ix2] ? cc[ix2] + "<br/>" : "") + mtm;
else {
if (k2) htm.push("<br/>");
htm.push(mtm); k2++;
}
}
}
if (td) td.innerHTML = htm.join("");
if (forForm) m.showRecordFormValue(fnm, htm.join(""), otr[i],wm > 0);
for (var j = 0; j < cc.length; j++) {
if (cc[j]) otr[i].cells[j].innerHTML = cc[j];
}
} else if(td) {
td.innerText = t ? t : "";
td.className = t ? "HasAnnex" : "";
}
}
if(!forForm) m.showRecordFormValues(null, null, 1);
}
po.expand4ChgRow = function () {
var rs = this.syncRs; if (!rs) return; //teExpandQry(ge, rvs) teExpandQryDo(itms[0],rvs);
for (var i = 0; i < rs.length; i++) {
teExpandQryDo(rs[i]);
}
}
po.expand4DblClk = function () {
var rs = this.dblckcRs; if (!rs) return; //teExpandQry(ge, rvs) teExpandQryDo(itms[0],rvs);
for (var i = 0; i < rs.length; i++) {
teExpandQryDo(rs[i], 0, 0, 0, 1);
}
return 1;
}
po.expandRela = function (rvs) { teExpandQry(this, rvs); }
po.opExecute = function (cmd, param) {
var c = CMDE, m = this;
if (cmd == c.Save) return m.saveData(0);
if (cmd == c.SaveWhole) return m.saveData(1);
if (cmd == c.Delete) return m.deleteData();
if (cmd == c.SortA) return m.sortAscending();
if (cmd == c.SortD) return m.sortDescending();
if (cmd == c.SortN) return m.sortNone();
if (cmd == c.InsertRow) return m.insertRows();
if (cmd == c.AppendRow) return m.appendRows();
if (cmd == c.RemoveRows) return m.removeRows();
if (cmd == c.RmvDuplicateRows) return m.removeDuplicateRows();
if (cmd == c.Copy) return m.copy();
if (cmd == c.CopyWithTitle) return m.copy(true);
if (cmd == c.CopyHTML) return m.copy(false, true);
if (cmd == c.CopyHTMLWithTitle) return m.copy(true, true);
if (cmd == c.Paste) return m.paste(false, false);
if (cmd == c.PasteInsert) return m.paste(false, true);
if (cmd == c.FillLR) return m.fillLR(null);
if (cmd == c.FillUD) return m.fillUD(null);
if (cmd == c.FillUDIncr) return m.fillUD(null, true);
if (cmd == c.UndoPull) return m.pullUndo();
if (cmd == c.ClearRange) return m.clearRange();
if (cmd == c.SwitchSelMode) return m.switchSelMode();
if (cmd == c.swToSheetMode) return m.switchSelMode(0);
if (cmd == c.swToDocumentMode) return m.switchSelMode(2);
if (cmd == c.ArrangeColumns) return m.arrangeColumns();
if (cmd == c.HideColumns) return m.showColumns(true);
if (cmd == c.ShowColumns) return m.showColumns();
if (cmd == c.HideRows) return m.showRows(true);
if (cmd == c.ShowRows) return m.showRows();
if (cmd == c.SetRowColor) return m.setRowColor();
if (cmd == c.RefreshRows) return m.refreshRows();
if (cmd == c.ExtendSel) return m.selExtend(param[0], param[1]);
if (cmd == c.MoveCols) return m.moveCols(null, null, param);
if (cmd == c.MoveRows) return m.moveRows(null, null, param);
if (cmd == c.BeginEdit) return m._beginEdit();
if (cmd == c.FloatHeader) return m.floatHeader();
if (cmd == c.CopyDataRowURL) return m.copyDataRowURL();
if (cmd == c.ContextTool) {
var ts = m.queryTools(CMDE.ContextTool, null);
if (ts) ts.executer = m;
SysShowMenu(ts);
}
if (cmd == c.SelColumnsSet) return m.selColumnsSet();
if (cmd == c.ShowProperties) return m.showProperties();
if (cmd == c.ShowRecordForm) { teSaveUserSetting(m.grid, "shwRecForm", "Y"); return m.showRecordForm(); }
if (cmd == c.HideRecordForm) { teSaveUserSetting(m.grid, "shwRecForm", "N"); return m.showRecordForm(true); }
if (cmd == c.MovePointer) return m.movePointer(param);
if (cmd == c.CreateReport) return m.CreateReport(param);
if (cmd == c.ExportReport) return m.ExportReport(param);
if (cmd == c.QuickQuery) return m.QuickQuery(param);
if (cmd == c.QuickQueryExp) return m.QuickQueryExp(param);
if (cmd == c.ExportReportToWindow) return m.CreateReportToWindow(param);
if (cmd == c.Export) return m.exportData();
if (cmd == c.Query) return m.queryByUser();
if (cmd == c.advQuery) return m.QueryByDlg();
if (cmd == c.Personalizing) return tePersonalizing(m);
if (cmd == c.Developer) return tePersonalizing(m, 1);
if (cmd == c.expandQry) return teExpandQry(m, 0);
if (cmd == c.ExpandAll) return teExpandQry(m, 0, 0, 1);
if (cmd == c.expandQryRv) return teExpandQry(m, 1);
if (cmd == c.ShowMemoBox) return m.showMemoBox();
if (cmd == c.HideMemoBox) return m.showMemoBox(1);
if (cmd == c.showRelatedItem) return m.showRelatedItem(param);
if (cmd == c.ShowNumMemoBox) return m.showNumMemoBox();
if (cmd == c.HideNumMemoBox) return m.showNumMemoBox(1);
if (cmd == c.ShowMemoSymbo) { m.sutoShowMemoSym = 1; return m.showMemoSym(); }
if (cmd == c.CloneRows) return m.cloneRows();
if (cmd == c.ShowChgHistory) return m.ShowChgHistory();
if (cmd == c.CheckinFile) return m.CheckinFile();
if (cmd == c.CheckoutFile) return m.CheckoutFile();
if (cmd == c.CheckFileCount) return m.hintAnnexIcon(0, 0, 1);
if (cmd == c.ShowAnnexImg) return m.hintAnnexIcon(0, 1, 1);
if (cmd == c.ShowAnnexList) return m.hintAnnexIcon(0, 2, 1);
if (cmd == c.ShowFlowCtrl) return teShowFlowCtrl(m);
if (cmd == c.ChgColumnWidth) return m.ChgColumnWidth();
if (cmd == c.ImportForeignInfo) return m.ImportForeignInfo();
if (cmd == c.tlReviseRequest) return m.ChangeRequest();
if (cmd == c.tlFreeNote) return m.FreeNote();
}
po.opEvent = function (Source, evtIndex, Param, vSources) {
if (evtIndex == EVI.UIEvent) {
this.evtGridArea(Param);
}
}
po.firstDataRow = function () {
var rws = this.grid.rows; if (rws.length == 0) return;
return rws[this.rowBeginData()];
}
po.showMemoBox = function (hide) {
var m = this, dg = m.memoDlg;
if (hide) return hideItD(dg);
showItD(dg);
if (!dg || isHidden(dg)) {
m.memoDlg = new MemoEditor(m);
dg = m.memoDlg;
showInCenter(dg, 100);
}
m.memoDlgShowDtl();
dg.dlgCtrl.showMe();
}
po.memoDlgShowDtl = function () {
var m = this, dg = m.memoDlg;
if (isHidden(dg)) return;
var itm = m.getSelectedFields()[0];
if (!itm) return;
dg.showDtl(itm, m._strsau()[0]);
}
po.showMemoSym = function (trs) {
var m = this, cn = m.container, fv = m.opst.f4memosave, fvn = m.opst.f4numdtlsave; if (!fv && !fvn) return;
if (!trs) trs = m.getAllDataTRs();
var x = m.getFieldValues(fv, trs), xn = (fvn == fv) ? x : m.getFieldValues(fvn, trs);
var tbl = m.grid, cs = tbl.rows[0].cells, h = cs.length, opf = [];
for (var j = 0; j < cs.length; j++) { opf[j] = cs[j].opField; }
var dc = GJT.xmlDocument();
for (var i = 0; i < trs.length; i++) {
var tr = trs[i], ts = tr.cells;
if (!x[i]) continue;
dc.loadXML(x[i]); var ndt = dc.firstChild, md = ndt.getElementsByTagName("md")[0], nd = ndt.getElementsByTagName("nd")[0];
for (var j = 0; j < ts.length; j++) {
if (!opf[j]) continue;
var tarF = opf[j].name, txt = "", cr = "", cr2 = "", ss = ts[j].style;
if (nd) {
var nd2 = nd.getElementsByTagName(tarF)[0];
if (nd2) txt = lySX(xGetAtr(nd2, "t"));
cr = (nd2 && nd2.childNodes.length) ? "#ff0000" : "";
}
if (md) {
var md2 = md.getElementsByTagName(tarF)[0];
if (md2) txt = lySX(xGetAtr(md2, "t"));
if (txt) {
//cr = cr ? "#ff00ff" : "#0000ff";
cr2 = "#0000ff";
}
}
ss.borderBottomColor = cr;
ss.borderBottomWidth = cr ? toPx(2) : "";
ss.borderRightColor = cr2;
ss.borderRightWidth = cr2 ? toPx(2) : "";
}
}
}
po.showPivotDesigner = function (channel) {
var m = this, ky = "pvtEDlg" + channel, dg = m[ky];
if (!LoadScript4Designer()) {
return setTimeout(function () { m.showPivotDesigner(channel); }, 1000);
}
showItD(dg);
if (!dg || isHidden(dg)) {
dg = new PivotTableDesigner(m, channel);
if (!dg.fields) return;//no fields defined
m[ky] = dg;
showInCenter(dg, 100);
}
}
po.CreatePivotTable = function () {
//先詢問可用報表
var m = this, xp = ["Action", "subact", "tarid"], vp = ["Misc", "getUserPivotItems", m.id];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return alert("No Pivot report defnied");
var itms;// = eval(txt);
try { itms = JSON.parse(txt); } catch (ex) { itms = eval(txt); };
if (itms.items) itms = itms.items;
if (!itms.length) return;
var dg = this._dlg4PvtRpt;
if (!dg) dg = new PivotReportDialog(this, itms);
else dg.dg.showMe();
}
po.showNumMemoBox = function (hide) {
var m = this, dg = m.nummDlg;
if (hide) return hideItD(dg);
showItD(dg);
if (!dg || isHidden(dg)) {
m.nummDlg = new NumDetailEditor(m, 10);
dg = m.nummDlg;
showInCenter(dg, 100);
}
m.nummDlgShowDtl();
dg.dlgCtrl.showMe();
}
po.getCellsSum = function () {
var TDs = this._selection.getDataTDs(), numC = 0, blnC = 0, sum = 0.0, tc = TDs.length, avg = 0.0;
for (var i = 0; i < tc; i++) {
var n = parseFloat(teDeformatNum(teTdGetValue(TDs[i]), GDT.Real), 10);
if (isNaN(n)) { blnC += (teTdGetValue(TDs[i]) == "" ? 1 : 0); }
else { numC++; sum += n; }
}
if (tc > 0) { avg =Math.round((sum / tc) * 1000)/1000; }
var x = i18nm.teProperties.text;
x = x.replace("{1}", tc).replace("{2}", numC).replace("{3}", blnC).replace("{4}", sum).replace("{5}", avg);
return x;
}
po.showProperties = function () {
var x = this.getCellsSum(); alert(x);
}
po.sumCells = function () {
this.showHintMsg(this.getCellsSum());
}
po.showHintMsg = function (x) {
var stsT = this.StatusBar;
if (!stsT) return alert(x);
var o = getEmByClass(stsT, "SumInfoArea");
if (!o) {
o = addEm("<span class='SumInfoArea' style='margin-left:6px;' />", o, stsT);
}
o.innerText = x;
}
po.movePointer = function (steps) {
var m = this, rws = m.grid.rows, se = m._selection, td = se.mainTD(), tr = getTR(td), rbd = m.rowBeginData();
if (!tr) { tr = rws[rbd]; td = tr.cells[0]; }
if (!td || !tr) return;
var ci = td.cellIndex, ri = tr.rowIndex;
ri += steps;
if (ri < rbd) ri = rbd;
if (ri >= rws.length) ri = rws.length - 1;
m.sel(rws[ri].cells[ci]);
}
po.prcsRecFormEv = function (evType, itm, f) {
if (evType == "blur") {
var ge = f._ge;
if (ge) ge._setValueByRecForm1(itm, f);
}
else if (evType == "click") {
var ge = f._ge, s = GJT.eventSrc(); if (!ge || !s) return;
if (s.type == "radio") return ge.prcsRecFormEv("blur", itm, f);
var pv = getEM(s, "input")[0];
if (pv && pv.parentNode == s && (pv.type == "radio" || pv.type == "checkbox")) { setTimeout(function () { pv.focus(); setTimeout(function () { pv.click(); }, 20); }, 20); }
else {
var cn = s.className;
var rg = cn == "L" ? -1 : (cn == "R" ? 1 : (cn == "MF" ? -1000000 : (cn == "ML" ? 100000 : 0)));
if (rg) ge.movePointer(rg);
}
}
else if (evType == "change") {
var ge = f._ge;
if (ge) ge._setValueByRecForm1(itm, f);
}
}
po.prcsTabSplit = function (tabCtrl) {
var ge = tabCtrl.ge;
//teSaveUserSetting(ge.grid, "recSplitMode", tabCtrl.splitMode);
}
po._setValueByRecForm1 = function (itm, f) {
var etr = f.tr; if (!etr) return;
var m = this, nm = itm.name, dty = m.fieldsAll[nm].dataType, v = teDeformatNum(itm.getValue(), dty), ov = teDeformatNum(m.getFieldValue(nm, etr), dty);
if (v == ov) return;
if (!itm.isChanged()) return;
if (m.validateValue(nm, v, etr, true)) { m.setFieldValue(nm, v, etr); m.editLogAdd(etr, nm, v); }
else itm.setValue(ov);
}
po.CreateReport = function (cntType) {
var m=this, itms=teQryReportDefItems(m);
itms.onclick=function(itm, itms){m.CreateReportDo.call(m,itm.name,cntType);};
return SysShowMenu(itms);
}
po.CreateReportToWindow =function(){return this.CreateReport("text/HTML");}
po.ExportReport=function(){var m = this; return m.geExportDataStep1(function(itm){m.ExportReport2.call(m,itm);});}
po.ExportReport2 = function(itmExpType){
var m=this, itms=teQryReportDefItems(m);
itms.onclick = function(itm1, itms1){m.CreateReportDo.call(m,itm1.name,itmExpType.name);};
SysShowMenu(itms);
}
po.CreateReportDo = function(rptId, _cntType){this.query(null, _cntType, true, rptId);}

po.QuickQryMore=function(){
var m=this,itms=new OpItems(),n=i18nm,ne=n.Export;
itms.add({name:"IntQQ", text: n.IntersectionInquiry.text});
itms.add({name:"QQexp", text: n.QuickQuery.text + " (" + ne.text + ")"});
itms.add({name:"IntQQexp", text: n.IntersectionInquiry.text+ " ("+ne.text+")"});
//itms.add({name:"UniQQ", text: n.UnionInquiry.text});
//itms.add({name:"UniQQexp", text: n.UnionInquiry.text+ "("+ne.text+")"});
itms.onclick=function(a,b){m.QuickQryMore2.call(m,a,b);};
SysShowMenu(itms);
}
po.QuickQryMore2=function(itm,itms){
var m=this,nm=itm.name;
if(nm=="QQexp")return m.QuickQueryExp();
return m.QQM(nm.indexOf("UniQQ")==0,nm.indexOf("exp")>0);
}
po.QQM=function(uniQ,exp){
//
var m=this;if(!m._QQitms) m._QQitms = teQryDefinedQryItems(m);
var QryItms=m._QQitms, o=addEm("<div style='max-height:70%;overflow-y:auto;overflow-x:visible;padding:4px;cursor:default;' class='teMenus'/>");
for(var i=0;i<QryItms.length;i++){
var itm=QryItms[i], e=addEm("<div onmouseover=\"this.style.backgroundColor='#ffee00'\" onmouseout=\"this.style.backgroundColor=''\"><input type='checkbox' name='" + itm.name + "' /></div>", null,o),c=e.children[0];
c.sur=itm,c.checked=itm.isChecked;
c.onclick=function(){GJT.stopBubble();}
var s=addEm("<span />",null,e); s.innerText=itm.text;s.style.paddingLeft="2px;";
//s.onclick=function(){this.previousSibling.checked=!this.previousSibling.checked;}
e.onclick=function(){var sr=this;if(sr.tagName=="DIV"){var c1=sr.children[0];if(c1 && c1.tagName=="INPUT") c1.checked=!c1.checked;}};
}
var b=addEm("<input type='button' class='OK' >",null,o);b.value=i18nm.OK.text;
b=addEm("<input type='button' class='Cancel' style='margin-left:4px;'>",null,o);b.value=i18nm.Cancel.text;
b=addEm("<input type='checkbox' style='margin-left:8px;' class='chkACF'>",null,o);
b.checked = m._QQACF;
b=addEm("<span />",null,o);b.innerText=i18nm.AddCurrentFilter.text;
b.onclick=function(){this.previousSibling.checked=!this.previousSibling.checked;};
o.onclick=function(){m.QQM2.call(m);};
o.uniQ=uniQ;o.exp=exp;
MenuHide();
showBesideMouse(o);
window.setTimeout(function(){o.id= KW.PopupMenu;},100);
}
po.QQM2=function(){GJT.stopBubble();
var m=this, e=GJT.eventSrc(),cn=e.className;
if(cn=="Cancel"){MenuHide();}
if(cn=="OK"){
var o=e.parentNode;
while(o && o.uniQ == null){o=o.parentNode;}
var uniQ=o.uniQ, exp=o.exp,ca=EmsByTag(o,"INPUT"),ids="";
for(var i=0;i<ca.length;i++){
var c=ca[i],s=c.sur;
if(s)s.isChecked=c.checked;
if(!s || !c.checked)continue;
ids += uniQ ? "|" : "&" + s.name;
}
var bacf=getEmByClass(o,"chkACF").checked; m._QQACF=bacf;
MenuHide();
if(exp)return m.geExportDataStep1(function(itm,itms){m.QuickQueryDo.call(m,ids,itm.name,bacf);});
m.QuickQueryDo(ids, null,bacf);
}
}
po.QuickQuery = function () {
var m=this,QryItms=teQryDefinedQryItems(m);
QryItms.onclick = function(itm, itms){m.QuickQueryDo.call(m,itm.name);};
SysShowMenu(QryItms);
}
po.QuickQueryExp = function(){var m = this; return m.geExportDataStep1(function(itm,itms){m.QuickQueryExp2.call(m,itm,itms);});}
po.QuickQueryExp2 = function(itmExpType, itms){
var m=this,QryItms=teQryDefinedQryItems(m);
QryItms.onclick = function(itm1, itms1){m.QuickQueryDo.call(m,itm1.name,itmExpType.name);};
SysShowMenu(QryItms);
}

po.QuickQueryDo = function(qryId, _cntType,addCurFltr){
var crtn;if(addCurFltr) crtn = this.getQryCriterion();
this.query(crtn, _cntType, true, null, qryId);
}
po.showRelatedItem = function (qryId) {
if (!qryId && this.rldItems) return SysShowMenu(this.rldItems);
if (!qryId) return teQryDefinedRelatedItems(this); //ask obj Id from server and user
return teShowRelatedItem(qryId,this);
}
po.showRelatedItems = function () {
var m = this; if (!m.hasRelatedtems) return;
if (!m.rldItems) { teQryDefinedRelatedItems(m); MenuHide(); }
var rls = m.rldItems, cc = [];
for (var i = 0; i < rls.length; i++) {
cc.push(m.showRelatedItem(rls[i].name, m));
}
return cc;
}
po.showRecordForm = function (hidden, mode, lyotxt) {
var m = this, fa = m.fieldsAll, so = m._recForm, dg = m._recFormDg;
var forEmbed = hasBit(m._dspOptions, GJT.DSO.ShowAsForm);
if (hidden && !forEmbed) { if (dg) { dg.embedInto(); hideIt(dg.dlg); }; return hideIt(so); }
if (!so) {
dg = new DialogInBody(m.id + "_recform", m.text);
m._recFormDg = dg;
so = newRecForm(fa, BDY(), getNameA(m.grid), m.prcsRecFormEv, lyotxt, m);
if (m._recFormTmp) {
lyReplaceNode(m._recFormTmp, so.uio, "recf4");
}
dg.setClient(so.uio);
so.uio.style.overflow = "visible";
m._recForm = so;
setAtr(so.uio, "lyoedb", "Y");
so._ge = m;
dg.handleClose = function (dg, force) { return m.evtRecFormClose.call(m, dg, force); }
//dg.moveToLT();
if(!forEmbed) showInCenter(dg.dlg);
if (m.aftRecordFormCreated) m.aftRecordFormCreated(m, so);
}
if (!forEmbed) dg.embedEscape();
showIt(dg.dlg); showIt(so);
window.setTimeout(function () { m.showRecordFormValues(); }, 100);
}
po.evtRecFormClose = function (dg,force) {
var m=this;teSaveUserSetting(m.grid, "shwRecForm", "N");
hideIt(dg.dlg); hideIt(m._recForm);
if(force){delete m._recFormDg; delete m._recForm;}
return true;
}
po.getDataForm = function (getDlg) {
var m = this;
if (!m._recFormDg) m.showRecordForm();
return getDlg ? m._recFormDg : m._recForm;
}
po.showRecordFormValues = function (tr, jsonV,force) {
var m = this, f = m._recForm; if (!f || isHidden(f)) return;
if (!tr) tr = m.mainTR();
if (!tr) tr = m.firstDataRow();
if (!tr) return;
var etr = f.tr;
if (tr == etr && !force) return; //same row
if (etr) {
for (var i = 0; i < f.items.length; i++) {
var itm = f.items[i];
//if (v == ov) continue;
if (!itm.isChanged()) continue;
var v = itm.getValue(), nm = itm.name; //, ov = m.getFieldValue(nm, etr);
if (m.validateValue(nm, v, etr, true)) { m.setFieldValue(nm, v, etr); m.editLogAdd(etr, nm, v); }
}
}
var c = tr.cells, c0 = m.grid.rows[0].cells, cbd = m.colBeginData();
if (f.items && (c.length - cbd < f.items.length)) {
if (!tr._recjson) {
if (!jsonV && !m.isNewRow(tr) && m.refreshRows([tr], null, null, 1, 1)) return m.refreshRows([tr], null, null, 1);
}
}

if (jsonV) tr._recjson = jsonV; //cache it
else jsonV = tr._recjson;
f.showValues(jsonV);
f.tr = tr;
m.hintAnnexAuto([tr],1);
for (var i = cbd; i < c.length; i++) {
if (!c0[i]) continue;
var itm = c0[i].opField, nm = itm.name, v = m.getFieldValue(nm, tr);
if (hasBit(itm.opConfig, GIA.ValueIsOuterHTML)) {
f.showValue(nm, c[i].innerHTML, 1);
} else f.showValue(nm, v);
}
var edl = tr._editLog;
for (var j = 0, k = edl ? edl.length : 0; j < k; j++) {
var ed = edl[j];
f.showValue(ed.name, ed.value);
}
var ttr = m.grid.rows.length, fr = m.rowBeginData();
f.showPosition(tr.rowIndex - fr + 1, ttr - fr);
if (!f.usrOpSetted) { f.setUsrSetting(); f.usrOpSetted=1; }
if (m.aftRecordFormShowValues) m.aftRecordFormShowValues(m, f);
}
po.showRecordFormValue = function (nm, val, tr, isHTML) {
var m = this, f = m._recForm; if (!f) return;
if (f.tr != tr) return; //different tr
f.showValue(nm, val, isHTML);
}
po.rvsQryPrmLyo = function (txt) {
var m = this, o = m.InqPrmO;
if (!o || !txt) return;
var op = getChiHasAtr(o, "zqjtf", m.id), p = newEm("div"); p.innerHTML = txt, atrPvs = ["zqjlf", "name", "id", "value"];
if (p.children.length == 1) p = p.children[0];
lyQryPrmChg(p, o, atrPvs);
o.insertBefore(p, o.children[0]);
if (op) op.parentNode.removeChild(op);
}
po.setActive=function(){
var m=this,p=m.parent;
if (p && p.setActiveItem) p.setActiveItem(m);
if (p && p.opEvent) return p.opEvent(m, EVI.Focus);
}
po._setAnchorByRela = function (trs) {
var m = this, rs = m.relaF; if (!rs) return;
for (var i = 0; i < rs.length; i++) {
var anf = rs[i].fieldsForAnchor; if (!anf) continue;
if (!trs) trs = m.getAllDataTRs();
//設定超連結欄位
var evh = m._evhAnchor4R, stx = rs[i].styleForAnchor;
if (!evh) { evh = function () { m._evhForRelaAnchor.call(m); }; m._evhAnchor4R = evh; }
for (var j = 0; j < anf.length; j++) {
var c = m.getCellIndex(anf[j].name);
for (var r = 0; r < trs.length; r++) {
var td = trs[r].children[c];
if(!td)continue;
td.className = "RelaAnchor";
if (stx) td.style.cssText = stx;
td.onclick = evh;
}
}
}
}
po._evhForRelaAnchor = function () {
var m = this, rs = m.relaF; if (!rs) return;
var td = getTD(GJT.eventSrc()), f = m.getField(td); if (!f) return;
for (var i = 0; i < rs.length; i++) {
var anf = rs[i].fieldsForAnchor; if (!anf) continue;
for (var j = 0; j < anf.length; j++) {
if (anf[j].name == f.name) teExpandQryDo(rs[i]);
}
}
}
po.tileModeAuto = function () {
//depend on screen resolution
if (isSmallScreen()) this.tileModeOn(); else this.tileModeOff();
}
po.tileModeOn = function () {
var m = this, tmc = m._tmcr; m.tileMode = true; //tmc:tile mode container
if (!tmc) { tmc = addE("<div class='tileContainer' />", m.gridContainer); m._tmcr = tmc; }
m.tileModeShowIt();
hideIt(m.grid); showIt(tmc);
}
po.tileModeOff = function () {
var m = this; m.tileMode = false;
hideIt(m._tmcr); showIt(m.grid);
}
po.tileModeShowIt = function () {
var m = this, tmc = m._tmcr, oaTR = m.getAllDataRows(), v = m.getTextUIKF(oaTR, 3, 1);
tmc.innerHTML = ""; //清除舊資料 if (hasBit(itm.opConfig, GIA.ValueIsOuterHTML))
if (!v || !v.length) return;
var e = function () { m.tileClick.call(m); }, vL = v.length;
for (var r = 0; r < oaTR.length; r++) {
var d = addE("<div class='tile' />", tmc);
var tx = v[0][r];
for (var i = 1; i < vL; i++) {
tx += "<br />" + v[i][r];
}
d.innerHTML = tx;
//d.title = d.innerText;
d.onclick = e;
d._tr = oaTR[r];
}
}
po.tileClick = function () {
var m = this, o = GJT.eventSrc();
if (o._tr) {
m.sel(o._tr.cells[0]);
m.showRecordForm();
}
}
GridEdit._initialized = true;
}
//End GridEdit prototype

if (iniItem == null) {
}
else if (iniItem.tagName == undefined) {
if (!container) container = document.body;
var ini = iniItem;
this._isCreatedByJS=true;//使用javascript建立的
if (!ini.dataCol) ini.dataCol = 1; if (!ini.dataRow) ini.dataRow = 1;
var h = [], varFlds = [], fds = ini.fields, dsm = this.displayMode, chkb = (dsm == DSM.GridEditWithCheckbox), rdo = (dsm == DSM.GridEditWithRadio);
if ((chkb || rdo) && ini.dataCol < 2) ini.dataCol = 2;
for (var i = 0; i < fds.length; i++) {
var f = fds[i];
varFlds.push([f.name, f.text, f.tip, f.dataType, f.opConfig, f.choice, f.ctrlId, f.defaultValue, f.defaultCriteria, f.fieldName, f.displayFormat,
f.programPrivilege, f.dataPrivilege].join(KW.Dlm2));
}
var dv1 = newEm("div"), dv2 = dv1.appendChild(newEm("div")), gd = dv2.appendChild(newEm("table")), cg = gd.appendChild(newEm("colgroup")), thead = gd.appendChild(newEm("thead")),
tbd = gd.appendChild(newEm("tbody")), trh = thead.appendChild(newEm("tr")), trhQ, tr1 = tbd.appendChild(newEm("tr")),
tiColor = ini.titleColor; if (!tiColor) tiColor = "#eeeeee";
setColorBG(trh, tiColor);
if (hasBit(ini.programPrivilege, PPVG.Query)) {
trhQ = thead.appendChild(newEm("tr"));
setColorBG(trhQ, tiColor);
if (!ini.dataRow || ini.dataRow < 2) ini.dataRow = 2;
}
setAtrByOpItem(gd, ini); gd.className = "DataEdit";
setAtr(gd, KW.VariableItems, varFlds.join(KW.Dlm1));
setAtr(gd, KW.ViewName, ini.viewName); this.tableName = ini.tableName;
setAtr(gd, KW.FirstDataRow, ini.dataRow); setAtr(gd, KW.FirstDataColumn, ini.dataCol);
setAtr(gd, KW.Caption, ini.text);
if (ini.programPrivilege != null) setAtr(gd, KW.ProgramPrivilege, ini.programPrivilege);
var a = [], itms = new OpItems();
for (var i = 0; i < fds.length; i++) {
itms.add(fds[i]);
var opcfg = fds[i].opConfig;
if (hasBit(opcfg, GIA.OutPutDenied) || hasBit(opcfg, GIA.Hidden)) { }
else {
a.push(fds[i].name);
}
}
if (!ini.columnsShow) ini.columnsShow = a;
var b = ini.columnsShow, col;
for (var i = 0; i < ini.dataCol; i++) {
col = cg.appendChild(newEm("col"));
setColorBG(col, tiColor); col.className = "DataEdit";
var td = trh.appendChild(newEm("td")); setColorBG(td, tiColor); td.appendChild(newEm("span")),
td1 = tr1.appendChild(newEm("td")); setColorBG(td, tiColor);
if (i == 1 && (chkb || rdo)) {
var htm = chkb ? "<input type=\"checkbox\" value=\"on\" />" : "<input type=\"radio\" name=\"zkSelTR$_" + ini.name + "\" />"; //"<input type=\"radio\" value=\"on\" />";
setAtr(td, "name", "zkSelTR_" + ini.name);
setAtr(td, KW.Caption, htm);
setAtr(td, "href0H", htm);
td.children[0].innerHTML = htm;
td1.innerHTML = htm;
}
if (trhQ) { td = trhQ.appendChild(newEm("td")); setColorBG(td, tiColor); }
if (i == 0) td1.innerText = "1";
}

for (var i = 0; i < b.length; i++) {
var itm = itms.item(b[i]); opcfg = itm.opConfig;
if (hasBit(opcfg, GIA.OutPutDenied)) { }
else {
col = cg.appendChild(newEm("col"));
col.className = "DataEdit"; setAtrByOpItem(col, itm);
var td = trh.appendChild(newEm("td")); setAtrByOpItem(td, itm); td.appendChild(newEm("span")).innerText = itm.text;
if (!hasBit(opcfg, GIA.WriteDenied)) {
td.style.fontWeight = "bold";
}
if (trhQ) { td = trhQ.appendChild(newEm("td")); setColorBG(td, tiColor); }
td = tr1.appendChild(newEm("td"));
}
}
container.appendChild(dv1);
this.init(gd);
teShowRows(gd);
}
else {//passed parameter is a HTMLElement,
if (iniItem.tagName == "TABLE") {//if a table is passed, use parent element as container
this.init(iniItem);
teShowRows(this.grid);
}
}
PROG.children.add(this);
if (this.id) PROG.children[this.id] = this;
} // * End GridEdit Class


function teUndoCtrl(undoHandler) {//BEGIN teUndoCtrl

this.coll = []; this.maxSteps = 2000; this.handleUndo = undoHandler;
if (typeof teUndoCtrl._initialized == "undefined") {

var po = teUndoCtrl.prototype;
po.push = function (range) {
var c = this.coll, tds = range, rx = [];
if (tds instanceof teRange) tds = tds.getDataTDs();
for (var i = 0; i < tds.length; i++) {
rx.push(tds[i].innerHTML);
}
if (c.length >= this.maxSteps) c.shift();
c.push({ "range": tds, "content": rx });
this.length = c.length;
}
po.pull = function () {
var c = this.coll, h = c.length - 1, hu = this.handleUndo;
if (h < 0) return;
try {
var tds = c[h].range, rx = c[h].content, tdsU = [];
for (var i = 0; i < tds.length; i++) {
if (!tds[i].parentNode) continue; //有可能已經移除掉
tdsU.push(tds[i]);
if (hu) hu._doUndo(tds[i], rx[i]);
else tds[i].innerHTML = rx[i];
}
if (hu && tds.length > 0) hu._aftUndo(tds);
} catch (ex) { }
c.pop();
this.length = c.length;
}
po.clear = function () { this.coll = []; }
teUndoCtrl._initialized = true;
}
} //END teUndoCtrl


function teEditLogs() {

this.length = 0;
if (typeof teEditLogs._initialized == "undefined") {
var po = teEditLogs.prototype;
po.add = function (name, value, primalValue) {
var m = this, log = m[name];
if (!log) {
log = { "name": name, "value": value }; m[name] = log;
m[this.length] = log; this.length = this.length + 1;
} else { log.value = value; }
if (primalValue != undefined) log.primalValue = primalValue;
}
po.remove = function (name) {
var m = this, log = m[name], il = m.length;
if (!log) return;
for (var i = 0; i < il; i++) {
if (log == m[i]) {
il--;
for (var j = i; j < il; j++) { m[j] = m[j + 1]; }
delete m[il]; this.length = il; if (m[name]) delete m[name];
return log;
}
}
}
po.exist = function (name) {
return this[name] != null;
}
po.clear = function () {
var m = this, il = m.length;
for (var i = 0; i < il; i++) {
delete m[m[i].name];
delete m[i];
}
this.length = 0;
}
teEditLogs._initialized = true;
}
} //END teEditLog

function CellsRect(td1, td2) {
if (typeof CellsRect._initialized == "undefined") {
var po = CellsRect.prototype;
po.expand = function (tdNew) {
var m = this;
if (m.td2 != m.td1) m.td3 = m.td2;
m.td2 = tdNew;
}
po._collTDs = function (tr, c1, c2, res) {
var cs = tr ? tr.cells : null; if (!cs) return;
if (c1 > c2) { for (var c = c1; c >= c2; c--) { res.push(cs[c]); } }
else { for (var c = c1; c <= c2; c++) { res.push(cs[c]); } }
}
po.isMember = function (td, rbd, cbd) {
var m = this, td1 = m.td1, td2 = m.td2, r1 = td1.parentNode.rowIndex, r2 = td2.parentNode.rowIndex, r,
c1 = td1.cellIndex, c2 = td2.cellIndex, c, ci = td.cellIndex, ri = td.parentNode.rowIndex;
if (r1 > r2) { r = r1; r1 = r2; r2 = r; }
if (c1 > c2) { c = c1; c1 = c2; c2 = c; }
if (rbd != null) {
//c1 = 0; c2 = 100000;
if (r1 < rbd || r2 < rbd) { r1 = 0; r2 = 100000; };//小於資料列的是為整欄全選
}
if (cbd != null) {
//r1 = 0; r2 = 100000;
if (c1 < cbd || c2 < cbd) { c1 = 0; c2 = 100000; };
}
return ci >= c1 && ci <= c2 && ri >= r1 && ri <= r2;
}
po.getTDs = function (UpToDown, LeftToRight, bOneRow) {
var m = this, td1 = m.td1, td2 = m.td2, tr1 = td1.parentNode, tr2 = td2.parentNode, r1 = tr1.rowIndex, r2 = tr2.rowIndex, res = [], tr, r,
c1 = td1.cellIndex, c2 = td2.cellIndex, td, c;
if (UpToDown && r1 > r2) { tr = tr1; tr1 = tr2; tr2 = tr; r = r1; r1 = r2; r2 = r; }
if (LeftToRight && c1 > c2) { td = td1; td1 = td2; td2 = td; c = c1; c1 = c2; c2 = c; }
tr = tr1; m._collTDs(tr, c1, c2, res);
if (bOneRow);
else if (r1 > r2) {
while (tr != tr2) { tr = tr.previousSibling; m._collTDs(tr, c1, c2, res); }
} else {
while (tr != tr2) { tr = tr.nextSibling; m._collTDs(tr, c1, c2, res); }
}
return res;
}
po.getTDsOROA = function (UpToDown, LeftToRight, bOneRow) {//collect td one row one array
var m = this, td1 = m.td1, td2 = m.td2; if (!td1 || !td2) return;
var tr1 = td1.parentNode, tr2 = td2.parentNode, r1 = tr1.rowIndex, r2 = tr2.rowIndex, res = [], tr, r,
c1 = td1.cellIndex, c2 = td2.cellIndex, td, c, res0 = [];
if (UpToDown && r1 > r2) { tr = tr1; tr1 = tr2; tr2 = tr; r = r1; r1 = r2; r2 = r; }
if (LeftToRight && c1 > c2) { td = td1; td1 = td2; td2 = td; c = c1; c1 = c2; c2 = c; }
tr = tr1; m._collTDs(tr, c1, c2, res);
res0.push(res);
if (bOneRow);
else if (r1 > r2) {
while (tr != tr2) { tr = tr.previousSibling; if (!tr) break; res = []; m._collTDs(tr, c1, c2, res); res0.push(res); }
} else {
while (tr != tr2) { tr = tr.nextSibling; if (!tr) break; res = []; m._collTDs(tr, c1, c2, res); res0.push(res); }
}
return res0;
}
po.getTRs = function (UpToDown, bOneRow) {
var m = this, td1 = m.td1, td2 = m.td2, tr1 = td1.parentNode, tr2 = td2.parentNode, r1 = tr1.rowIndex, r2 = tr2.rowIndex, res, tr, r;
if (r1 == r2) return [tr1];
if (UpToDown && r1 > r2) { tr = tr1; tr1 = tr2; tr2 = tr; r = r1; r1 = r2; r2 = r; }
res = [tr1];
if (bOneRow);
else if (r1 > r2) {
tr = tr1.previousSibling; while (tr != tr2) { res.push(tr); tr = tr.previousSibling; }; res.push(tr2);
}
else {
tr = tr1.nextSibling; while (tr != tr2) { res.push(tr); tr = tr.nextSibling; }; res.push(tr2);
}
return res;
}

po.c1 = function () { return this.td1.cellIndex; }
po.c2 = function () { return this.td2.cellIndex; }
po.r1 = function () { return this.td1.parentNode.rowIndex; }
po.r2 = function () { return this.td2.parentNode.rowIndex; }

CellsRect._initialized = true;
}

var t = this; t.td1 = td1; t.td2 = td2;
} //END CellsRect

function teRange(td, showUI) {//BEGIN teRange

this.UseOpacity = 0; // GJT.isFollowW3C;透明方式不好,有HTML內容時不好看
this.showUI = true; //標記是否要顯示互動效果
this.allowSelWholeRC = true; //是否允許整欄整列選取,預設yes
this.coll = []; this.hiliColor = msClrHiLi; this.hiliBgColor = msBgClrHiLi;
this.colBeginData = 1; this.rowBeginData = 1;
this.boss = null;
if (showUI != null) this.showUI = showUI;
if (typeof teRange._initialized == "undefined") {
var po = teRange.prototype;
po.clone = function () {
var res = new teRange(), c = this.coll;
for (var i = 0; i < c.length; i++) {
res.addRect(c[i].td1, c[i].td2);
}
return res;
}
po.isSelWholeTable = function (td) { return this.isWholeRow(td) && this.isWholeCol(td); }
po.isWholeRow = function (td) { return td && td.cellIndex < this.colBeginData; }
po.isWholeCol = function (td) { return td && td.parentNode.rowIndex < this.rowBeginData; }
po.add = function (oTD, expandRect, AddXor, replaceLastOne) {
if (!oTD || oTD.tagName != "TD") return;
var m = this, dN = oTD, whR = m.isWholeRow(dN), whC = m.isWholeCol(dN), c = m.coll, h = c.length, asw = m.allowSelWholeRC, rc, oTbl = getTable(dN);
if (h > 0 && asw) {
if (whR && whC) return;
var d0 = c[0].td1, whR2 = m.isWholeRow(d0), whC2 = m.isWholeCol(d0);
if (whR2 && whC2) return;
if (whR2) {
if (!whR) {
if (expandRect) dN = getTR(dN).cells[0];
else return;
}
} else if (whC2) {
if (!whC) {
if (expandRect) dN = getTable(dN).rows[0].cells[dN.cellIndex];
else return;
}
} else {
if (whR || whC) return;
}
}
if (!asw && (whR || whC)) return; //不允許全選
if (expandRect && h > 0) { m.expandRect(dN); } //擴大選取方塊
else {
if (replaceLastOne && h > 0 && c[h - 1].td1 == c[h - 1].td2) m.showHiLiRect(c.pop(), true);
m.addRect(dN, dN, AddXor);
}
}
po.sel = function (oTD) { this.clear(); this.add(oTD); }
po.expandRect = function (oTD, _tarRect) {
var rc = _tarRect, c = this.coll, h = c.length;
if (!rc && h > 0) rc = c[h - 1];
rc.expand(oTD);
this.showHiLiRect(rc);
}
po.addRect = function (oTD1, oTD2, AddXor) {
if (!oTD1 || !oTD2) return;
var c = this.coll, h = c.length;
for (var i = 0; i < h; i++) {
if (c[i].td1 == oTD1 && c[i].td2 == oTD2) {
if (AddXor) {
this.showHiLiRect(c.splice(i, 1)[0], true);
}
return;
}
}
c.push(new CellsRect(oTD1, oTD2));
this.showHiLiRect(c[h]);
}
po.selRect = function (oTD1, oTD2) { this.clear(); this.addRect(oTD1, oTD2); }
po.clear = function () {//清除所有
var c = this.coll; this.coll = [];
if (!this.showUI) return;
for (var i = 0; i < c.length; i++) {
this.showHiLiRect(c[i], true);
}
}
po.remove = function (td1, td2) {
var c = this.coll, rc;
for (var i = 0; i < c.length; i++) {
rc = c[i];
if (rc.td1 == td1 && ((!td2 && rc.td1 == rc.td2) || (td2 && rc.td2 == td2))) {
this.showHiLiRect(c.splice(i, 1)[0], true);
return;
}
}
}
po.showHiLiRect = function (rect, _restore) {
if (!this.showUI) return;
var m = this, x = m.coll, rc = rect, r, c, c1, c2, c3, r1, r2, r3 = rc.r3,
ls1 = {}, ls3, tbl = getTable(rc.td1), td, cs, ky, kys;
if (!tbl) return;
if (rc.td3) {
ls3 = {};
c1 = rc.c1(); c3 = rc.td3.cellIndex; if (c1 > c3) { c = c1; c1 = c3; c3 = c; }
r1 = rc.r1(); r3 = rc.td3.parentNode.rowIndex; if (r1 > r3) { r = r1; r1 = r3; r3 = r; }
for (r = r1; r <= r3; r++) {
cs = tbl.rows[r].cells;
for (c = c1; c <= c3; c++) {
ls3[r + "," + c] = cs[c];
}
}
delete rc.td3;
}
c1 = rc.c1(); c2 = rc.c2(); if (c1 > c2) { c = c1; c1 = c2; c2 = c; }
r1 = rc.r1(); r2 = rc.r2(); if (r1 > r2) { r = r1; r1 = r2; r2 = r; }
for (r = r1; r <= r2; r++) {
cs = tbl.rows[r].cells;
for (c = c1; c <= c2; c++) {
ky = r + "," + c;
if (ls3 && ls3[ky]) delete ls3[ky]; //移除原本已經選取的
else ls1[ky] = cs[c];
}
}
for (var pty in ls1) {
if (ls1.hasOwnProperty(pty)) m._setHiliTD(ls1[pty], _restore);
}
if (ls3) {
for (var pty in ls3) {
if (ls3.hasOwnProperty(pty)) {
if (!_restore) {
var seled = 0;
for (var i = 0; i < x.length; i++) {
if (x[i] != rect && x[i].isMember(ls3[pty])) { seled = true; break; }
}
if (seled) continue;
}
m._setHiliTD(ls3[pty], true);
}
}
}
if (_restore || x[0] != rc) return;
dN = x[0].td1;
if (m.isWholeRow(dN) || m.isWholeCol(dN)) return;
if (m.UseOpacity) {
setColor(dN, m.hiliColor, m.hiliBgColor, 0, 1);
setOpacity(dN, 0.3);
}
else {
if (dN.bgColor == "#FFFF00") setColor(dN, "", "#FFDD00");
else setColor(dN, "", "#FFFF00");
}
}
po._setHiliTD = function (dN, _restore) {
if (!dN) return;
var m = this, b = m.boss, tr = dN.parentNode, whR = m.isWholeRow(dN), whC = m.isWholeCol(dN), stc = _restore ? restoreColor : setColor, frC = m.hiliColor, bgC = m.hiliBgColor, o1, o2;
if (whR && whC) o1 = getTable(dN);
else {
if (whC) { o1 = teGetCOL(dN); o2 = dN; }
else if (whR) o1 = tr;
else o1 = dN;
}
if (m.UseOpacity) {
setColor(o1, frC, bgC, 0, 1);
stc = _restore ? restoreOpacity : setOpacity; frC = 0.6; bgC = 0;
if (_restore) { restoreColor(o1); restoreColor(o2); }
}
stc(o1, frC, bgC);
stc(o2, frC, bgC);
}
po.setColor = function (_restoreColor) {
var c = this.coll, h = c.length, i;
for (i = 0; i < h; i++) {
this.showHiLiRect(c[i], _restoreColor);
}
}
po.getTDs = function (UpToDown, LeftToRight, bOneRow) {
var c = this.coll, h = c.length, i, res = [];
for (i = 0; i < h; i++) {
res = res.concat(c[i].getTDs(UpToDown, LeftToRight, bOneRow));
}
return res;
}
po.getTDsOROA = function (UpToDown, LeftToRight, bOneRow) {
var c = this.coll, h = c.length, i, res = [];
for (i = 0; i < h; i++) {
res.push(c[i].getTDsOROA(UpToDown, LeftToRight, bOneRow));
}
return res;
}
po.getDataTDs = function (UpToDown, LeftToRight, bOneRow) {
var a = this.getDataTDsOROA(UpToDown, LeftToRight, bOneRow), res = [];
for (var i = 0; i < a.length; i++) {
var a1 = a[i];
for (var j = 0; j < a1.length; j++) {
for (var k = 0; k < a1[j].length; k++) {
res.push(a1[j][k]);
}
if (bOneRow) break;
}
if (bOneRow) break;
}
return res;
}
po.getDataTDsOROA = function (UpToDown, LeftToRight, bOneRow) {
var m = this, ds = m.getTDsOROA(UpToDown, LeftToRight), rs = [], rb = m.rowBeginData, cb = m.colBeginData;
for (var i = 0; i < ds.length; i++) {
var ds1 = ds[i], ds1N, tb = ds1 ? getTable(ds1[0][0]) : null;
if (!tb) continue;
if (ds1.length == 1 && m.isWholeCol(ds1[0][0])) {
var rws = tb.rows, rl = rws.length, ds2 = ds1[0]; ds1N = [];
for (var j = rb; j < rl; j++) {
var tr = rws[j], ds2N = [];
for (var k = 0; k < ds2.length; k++) {
ds2N.push(tr.cells[ds2[k].cellIndex]);
}
ds1N.push(ds2N);
if (bOneRow) break;
}
}
else if (bOneRow) { ds1N = [ds1[0]]; }
else ds1N = ds1;

for (var j = 0; j < ds1N.length; j++) {
var ds2 = ds1N[j];
if (ds2.length == 1 && m.isWholeRow(ds2[0])) {
var ds2N = [], tr = ds2[0].parentNode, cs = tr.cells;
for (var k = cb; k < cs.length; k++) { ds2N.push(cs[k]); }
ds1N[j] = ds2N;
}
}
rs.push(ds1N);
}
return rs;
}
po.getTRs = function (UpToDown, bOneRow, unique) {
var c = this.coll, h = c.length, res = [];
for (var i = 0; i < h; i++) {
if ( i > 0 && unique) {
//排除重複的TR
var rst = c[i].getTRs(UpToDown, bOneRow);
for (var j = 0; j < rst.length; j++) {
var igi = false;
for(var k=0;k<res.length;k++)
{
if (res[k] == rst[j]) {igi = true;break;}
}
if (igi) continue;
res.push(rst[j]);
}
}
else res = res.concat(c[i].getTRs(UpToDown, bOneRow));
}
return res;
}
po.getDataTRs = function (UpToDown, bOneRow,unique) {
var m = this, rs = m.getTRs(UpToDown, bOneRow, unique), h = rs.length, res = [], rb = m.rowBeginData;
for (var i = 0; i < h; i++) {
if (rs[i].rowIndex < 0) continue; //maybe removed from table
else if (rs[i].rowIndex < rb) {//all data rows
var rws = getTable(rs[i]).rows, rl = rws.length;
if (bOneRow) {
if (rl > rb) res.push(rws[rb]);
break;
}
for (var j = rb; j < rl; j++) { res.push(rws[j]); }
}
else res.push(rs[i]);
if (bOneRow) break;
}
return res;
}
po.getDataTRsOROA = function (UpToDown, bOneRow) {
var ds = this.getDataTDsOROA(UpToDown, 1, bOneRow);
for (var i = 0; i < ds.length; i++) {
var ds1 = ds[i];
for (var j = 0; j < ds1.length; j++) {
ds1[j] = ds1[j][0].parentNode;
}
}
return ds;
}
po.getRectsPosition = function () {
var c = this.coll, res = [];
for (var i = 0; i < c.length; i++) {
res.push([c[i].r1(), c[i].c1(), c[i].r2(), c[i].c2()]);
}
return res;
}
po.setRectsByPosition = function (rectsPostion, tbl) {
var c = this.coll, rk = rectsPostion;
if (!tbl) tbl = getTable(this.mainTD());
if (!tbl) return;
this.clear();
var rws = tbl.rows, rl = rws.length;
for (var i = 0; i < rk.length; i++) {
if (rl <= rk[i][0] || rl <= rk[i][2]) continue;
var cl = rws[i].cells.length;
if (cl <= rk[i][1] || cl <= rk[i][3]) continue;
this.addRect(rws[rk[i][0]].cells[rk[i][1]], rws[rk[i][2]].cells[rk[i][3]]);
}
}
po.mainTD = function () {
var c = this.coll; if (c.length == 0) return;
return c[0].td1;
}
po.mainDataTD = function () {
var tds = this.getDataTDs(0, 0, 1);
if (tds) return tds[0];
}
po.mainDataTR = function () {
return getTR(this.mainDataTD());
}
po.lastTD = function () {
var c = this.coll, h = c.length; if (h == 0) return;
return c[h - 1].td2;
}
po.isMember = function (td) {
var m = this, c = m.coll, h = c.length; if (h == 0) return;
for (var i = 0; i < h; i++) {
if (c[i].isMember(td, m.rowBeginData, m.colBeginData)) return true;
}
}
teRange._initialized = true;
}

if (td) this.add(td);

} //END teRange

function geHintTimeElapsed(tarO) {
if (!tarO || !tarO.bgnTime) return;
var d = tarO.bgnTime, d2 = new Date(), s = parseInt((d2.getTime() - d.getTime()) / 1000);
var h = parseInt(s / 3600), m; s = h > 0 ? s % (h * 3600) : s; m = parseInt(s / 60); s = m > 0 ? s % (m * 60) : s;
h = "0" + h; m = "0" + m; s = "0" + s;
tarO.innerText = " " + tRight(m, 2) + ":" + tRight(s, 2); // + tRight(h, 2) + ":"
if (tarO.chkDocState) {
if (document.readyState == "complete") {
window.clearInterval(tarO.timeIntvHintPrgs);
}
}
}
function tRight(s, n) {
if (n <= 0) return "";
else if (n > s.length) return s;
else { var iLen = s.length; return s.substring(iLen - n, iLen); }
}
function geExportDataStepN(itm, itms) {
var cntType = itm.name, tar = itms.tar;
if (tar instanceof GridEdit) return tar.query(null, cntType, 1);
if (hasAtr(tar, "PrmId")) return doInqSQL0(tar, false, cntType, true);
}
function gridEditQuery(grid, criterion) {
GridEdit.prototype.query(grid, criterion);
}
//Below variables need to be decalre on client script only
var C_Page_DialogStart = "Index.aspx",
C_Page_ValueSelector = "sun_Dialog_ValueSelector.aspx",
C_Page_Logout = "sun_Logout.aspx",
mDlgZIndex = 10000,
cnstDlgNH = "ipdlg", mtimeoutCloseDlgWin; //, profileTarget = null
function setEvtHandleAll(obj, er) {//onscroll can not be register
obj.onclick = er; obj.ondblclick = er; obj.onkeypress = er; obj.onkeydown = er; obj.onkeyup = er;
obj.onmousemove = er; obj.onmousedown = er; obj.onmouseup = er; obj.onselectstart = er; obj.ondragstart = er;
obj.onfocus = er; obj.onblur = er; obj.onmouseover = er; obj.onmouseout = er; //obj.onresize = er;
}
function setAtrByOpItem(tar, itm) {
if (itm.name) setAtr(tar, "id", itm.name); setAtr(tar, "name", itm.name);
if (itm.fieldName) setAtr(tar, "name", itm.fieldName);
if (itm.text) setAtr(tar, KW.Caption, itm.text);
if (itm.tip) setAtr(tar, "title", itm.tip);
if (itm.dataType) setAtr(tar, KW.opDataType, itm.dataType);
if (itm.dataPrivilege) setAtr(tar, KW.DataPrivilege, itm.dataPrivilege);
if (itm.programPrivilege) setAtr(tar, KW.ProgramPrivilege, itm.programPrivilege);
if (itm.opConfig) setAtr(tar, KW.opAttr, itm.opConfig);
if (itm.choice) setAtr(tar, KW.Choice, itm.choice);
if (itm.ctrlId) setAtr(tar, KW.ControllerId, itm.ctrlId);
if (itm.displayFormat) setAtr(tar, KW.DspFormat, itm.displayFormat);
if (itm.defaultValue) setAtr(tar, KW.DefaultValue, itm.defaultValue);
if (itm.defaultCritera) setAtr(tar, KW.DefaultQryValue, itm.defaultCritera);
return tar;
}
var reg13 = new RegExp(String.fromCharCode(13), "gi"), reg10 = new RegExp(String.fromCharCode(10), "gi");
function replaceNR(txt, dlmr) {
if (!dlmr) dlmr = "";
return txt.replace(reg13, "").replace(reg10, dlmr);
}
function replaceDC(txt, dlmr) {
if (!dlmr) dlmr = ",";
var d = dlmr, d2 = d + d, rx = new RegExp(d2, "gi");
while (txt.indexOf(d2) >= 0) {
txt = txt.replace(rx, d);
}
return txt;
}
function hasAtr(srcObj, sAttrNm) { if (srcObj && srcObj.hasAttribute != undefined) return srcObj.hasAttribute(sAttrNm); else if (srcObj && srcObj.getAttributeNode) return srcObj.getAttributeNode(sAttrNm) != null; }
function getAtr(srcObj, sAttrNm, vDft) {
if (srcObj == null) return vDft;
if (!srcObj.style && srcObj[0]) srcObj = srcObj[0];
if (hasAtr(srcObj, sAttrNm)) return srcObj.getAttribute(sAttrNm, 1); else return (vDft != undefined ? vDft : null);
}
function lySX(ix) { return ix != null ? ix : ""; }
function xGetAtr(nd, sAttrNm) { return nd.getAttribute(sAttrNm); }
function xGetAtrA(nd, sAttrNm) { return lySX(nd.getAttribute(sAttrNm)); }
function xGetText(nd) { if (typeof nd.textContent == "undefined") return nd.text; else return nd.textContent; }
function xSetText(nd, txt) { try { nd.textContent = txt; } catch (ex) { nd.text = txt; } }
function setAtr(srcObj, sAttrNm, val) {
if (srcObj) srcObj.setAttribute(sAttrNm, val);
}
function rmvAtr(srcObj, sAttrNm) {
if (srcObj) srcObj.removeAttribute(sAttrNm);
}
function isChecked(tar) { if (tar && tar.checked) return true; }
function getName(o) { return getAtr(o, "name"); }
function getNameA(o) { var n = getAtr(o, "name"); if (!n) n = getAtr(o, "id"); return n; }
function setName(o, nm) { setAtr(o, "name", nm); }
function newEm(tag) { return document.createElement(tag); }
function xEm(xdoc, tag) { return xdoc.createElement(tag); }
function addChi(o, tag) { return o.appendChild(newEm(tag)); }
function apdC(o, c) { return o.appendChild(c); }
function newEmH(txtHtml) {
var o = newEm("div"); o.innerHTML = txtHtml;
return o.childNodes[0];
}
function newNd(tag) { return document.createElement(tag); }
function getEM(o, tag) { return o.getElementsByTagName(tag); }
function getEMT(o, tag, type) {
var rs = [], a = o.getElementsByTagName(tag);
for (var i = 0; i < a.length; i++) {
if (a[i].type == type) rs.push(a[i]);
}
return rs;
}
function GBI() { } //get by id
function newITM(name, text, tip) {
return { name: name, text: text, tip: tip };
}
function newITM2(name, textO) {
return { name: name, text: textO.text, tip: textO.tip };
}
function strToItems(txt, dlm) {
if (!dlm) dlm = ",";
var res = new OpItems(); if (!txt) return res;
var a = txt.split(dlm);
for (var i = 0; i < a.length; i++) { res.add(newITM(a[i], a[i])); }
return res;
}
function teCopyFont(refO, tarO) {
if (tarO instanceof Array) {
for (var i = 0, k = tarO.length; i < k; i++) { teCopyFont(refO, tarO[i]); }
return;
}
var cSt = GJT.getComputedStyle(refO), st = tarO.style;
st.fontFamily = cSt.fontFamily; st.fontSize = cSt.fontSize;
st.fontWeight = cSt.fontWeight; st.fontStyle = cSt.fontStyle;
st.fontVariant = cSt.fontVariant; st.verticalAlign = cSt.verticalAlign;
st.textAlign = cSt.textAlign;
st.paddingLeft = cSt.paddingLeft;
}
function isHidden(o) {
if (!o) return true;
if (o.tagName == "BODY") return false; //Body
var st = GJT.getComputedStyle(o);
if (st) {
if (st.display == "none" || st.visibility == "collapse") return true;
return false; //已經用ComputedStyle 不需要找parent isHidden(o.parentNode);
}
if (o.dlgCtrl) return isHidden(o.dlgCtrl);
if (o.dlg) return isHidden(o.dlg);
if (o.visible) return !o.visible();
if (o.opConfig) return hasBit(o.opConfig, GIA.Hidden);
}
function hideIt(obj) {
if (!obj) return;
if (obj instanceof Array || (obj.length && obj[0])) {
for (var i = 0, k = obj.length; i < k; i++) {
if (obj[i]) obj[i].style.display = "none";
}
}
else obj.style.display = "none";
}
function hideItD(obj) {
if (!obj) return;
if (obj instanceof Array) {
for (var i = 0, k = obj.length; i < k; i++) { hideItD(obj[i]) }
return;
}
if (obj.dlgCtrl) return hideItD(obj.dlgCtrl);
if (obj.dlg) return hideItD(obj.dlg);
hideIt(obj);
}
function isPureNum(v) { var n = parseInt(v, 10); if (!isNaN(n) && ("" + v == "" + n)) return true; }
function showIt(obj) {
if (!obj) return;
if (obj instanceof Array || (obj.length && obj[0])) {
for (var i = 0, k = obj.length; i < k; i++) {
if (obj[i] && obj[i].style) obj[i].style.display = "";
}
}
else if (obj.style) obj.style.display = "";
else if (obj.setVisible) obj.setVisible(1);
}
function showItD(obj) {
if (!obj) return;
if (obj instanceof Array) {
for (var i = 0, k = obj.length; i < k; i++) { showItD(obj[i]); }
return;
}
if (obj.dlgCtrl) return showItD(obj.dlgCtrl);
if (obj.dlg) return showItD(obj.dlg);
showIt(obj);
}
function shrinkParHgt() {
var o = GJT.eventSrc();
var p = o.parentElement, s = p.style;
if (s.height == "") { s.height = toPx(o.offsetHeight); s.overflow = "hidden" } else s.height = "";
}
function showItA(obj, visible) {
if (!obj) return;
if (obj instanceof Array) {
for (var i = 0, k = obj.length; i < k; i++) { showItA(obj[i], visible); }
return;
}
if (obj.setVisible) return obj.setVisible(visible);
if (visible) showIt(obj); else hideIt(obj);
}
function disableItA(obj, disabled) {
if (!obj) return;
if (obj.length) {for (var i = 0, k = obj.length; i < k; i++) { disableItA(obj[i],disabled); };return;}
obj.disabled = disabled;
}
function toZBottom(obj) { obj.style.zIndex = 0; }
function toZTopC(o) {//移到容器中所有物件的最高z層
if (!o) return;
var p = o.parentElement, z = getMaxZ(p, 0), z0 = o.style.zIndex;
if (!z) return toZTop(o);
if (z0 < z) { z0 = z;o.style.zIndex = z0;if (mDlgZIndex < z) mDlgZIndex = z;}
}
function getMaxZ(o, z) {
var tgN = o.tagName;
if (tgN == "DIV" || tgN == "SPAN" || tgN == "TABLE" || tgN == "CANVAS" || tgN == "SVG") {
var z1 = o.style.zIndex;
if (z1 && z1 > z) z = z1;
var chrn = o.children;
for (var i = 0; i < chrn.length; i++) { z = getMaxZ(chrn[i], z); }
}
return z;
}
function toZTop(obj) { if (obj) obj.style.zIndex = zIndex4Top(); }
function killIt(obj) { if (obj) { try { obj.outerHTML = ""; } catch (ex) { if (obj.parentNode) obj.parentNode.removeChild(obj); } } } //必須使用outerHTML = "",不能用 removeChild 否則IE有問題 obj.parentNode.removeChild(obj); obj.outerHTML = "";
function killThem(ary) {
if (!ary) return;
for (var i = 0; i < ary.length; i++) { killIt(ary[i]); };
}
function zIndex4Top(cntr) { return mDlgZIndex++; }
function isSmallScreen() { return false && (screen.width < 480 || screen.height < 480); }
function evtOffset(ev) {
if (ev.offsetX != undefined) return [ev.offsetX, ev.offsetY];
var xy = getOffsetO(ev.target);
return [ev.pageX - xy[0], ev.pageY - xy[1]];
}
function evtOffsetX(ev) { return evtOffset(ev)[0]; }
function evtOffsetY(ev) { return evtOffset(ev)[1]; }
function setColor(o, c, bc, setDft, noOverwrite) {
if (!o) return;
var s = o.style; if (!s) s = o;
if (o.oriC == undefined) o.oriC = s.color;
if (o.oriBgC == undefined) o.oriBgC = s.backgroundColor;
if (c != null) {
if (!noOverwrite || !o.oriC) s.color = c;
if (setDft) o.oriC = c;
}
if (bc != null) {
if (!noOverwrite || !o.oriBgC) s.backgroundColor = bc;
if (setDft) o.oriBgC = bc;
}
}
function restoreColor(o) {
if (!o) return;
var s = o.style; if (!s) s = o;
if (o.oriBgC != undefined) s.backgroundColor = o.oriBgC;
if (o.oriC != undefined) s.color = o.oriC;
}
function setOpacity(o, c, setDft) {
if (!o) return;
var s = o.style; if (!s) s = o;
if (o.oriOpacity == undefined) o.oriOpacity = s.opacity;
if (c != null) { s.opacity = c; if (setDft) o.oriOpacity = c; }
}
function restoreOpacity(o) {
if (!o) return;
var s = o.style; if (!s) s = o;
if (o.oriOpacity != undefined) s.opacity = o.oriOpacity;
}
function setHiliO(o, v) {
setAtr(o, "zhili", v);
}
function rmvHiliO(o) { rmvAtr(o, "zhili"); }
function setColorBG(o, c) { if (o) o.style.backgroundColor = c; }
function toPx(v) {return parseFloat(v) + "px";}// { return parseInt(v, 10) + "px"; }
function fromPx(v) { if (!v) return 0; else return parseInt(v, 10); }
//這個function 會自動考慮: The css width property does not include padding, borders, or margins; it sets the width of the area inside the padding, border, and margin of the element
//確保物件的實際占用的高寬是指定的高寬
function cmnMoveObjTo(obj, left, top, width, height, forceDo) {
var st, pn; if (obj == null) return;
if (obj.position != undefined) st = obj; //is a style object
else if (obj.style != undefined) { st = obj.style; pn = obj.offsetParent; }
else return alert("Invalid object!");
if (left != null) st.left = toPx(left);
if (top != null) st.top = toPx(top);
if (width != null) st.width = toPx(toCssWdt(obj, width));
if (height != null) st.height = toPx(toCssHgt(obj, height));
//if(pn && pn.style.position != "relative") st.position = "relative";
if (st.position == "static" && !forceDo)
return; //刻意指定static的不要移動
st.position = "absolute";
}
function showInCenter(obj, msw) {
if (!obj) return;
if (obj.dlgCtrl) return showInCenter(obj.dlgCtrl, msw);
if (obj.dlg) return showInCenter(obj.dlg, msw);
if (!msw) msw = 500;
window.setTimeout(function () { showInCenterDo(obj); }, msw);
}
function showInCenterDo(obj) {
var srl = GJT.getWindowScrollLeft(), srt = GJT.getWindowScrollTop(), xm = GJT.getWindowWidth(), ym = GJT.getWindowHeight(), w = obj.offsetWidth, h = obj.offsetHeight;
showObjAt(obj, srl + (xm - w) / 2, srt + (ym - h) / 2);
makeSureInsideWindowDo(obj);
}

function showBesideMouse(obj, shiftX, shiftY, fixIt) {
if (obj.uio) obj = obj.uio;
var ev = GJT.event(), x = ev ? ev.clientX : null, y = ev ? ev.clientY : null, srl = GJT.getWindowScrollLeft(), srt = GJT.getWindowScrollTop();
if (!shiftX) shiftX = 0; if (!shiftY) shiftY = 0;
var xm = GJT.getWindowWidth(), ym = GJT.getWindowHeight(), w = obj.offsetWidth, h = obj.offsetHeight;
if (x == null) {//not mouse event,no x y property
if (GJT.lstX != null) { x = GJT.lstX; y = GJT.lstY; }
else { x = xm / 2 - w / 2; y = ym / 2 - h / 2; }
}
if (x + w > xm && w < xm / 2) x = xm - w; if (y + h > ym) y = ym - h; if (y < 30) y = 30; if (x < 0) x = 0;
showObjAt(obj, x + shiftX + srl, y + shiftY + srt);
makeSureInsideWindow(obj);
if (fixIt) obj.style.position = "fixed";
}
function makeSureWdtHgtInWindow(obj, mW, mH,sftW,sftH) {
window.setTimeout(function () { makeSureWdtHgtInWindowDo(obj, mW, mH, sftW, sftH); }, 100);
}
function makeSureWdtHgtInWindowDo(obj, mW, mH, sftW, sftH) {
var xm = GJT.getWindowWidth() - (sftW ? sftW : 0), ym = GJT.getWindowHeight() - (sftH ? sftH : 0), w = obj.offsetWidth, h = obj.offsetHeight, st = obj.style;
if (w > xm && mW) st.width = toPx(xm);
if (h > ym && mH) st.height = toPx(ym);
}
function makeSureInsideWindow(obj) {
window.setTimeout(function () { makeSureInsideWindowDo(obj); }, 100);
}
function makeSureInsideWindowDo(obj) {if (!obj || obj.parentNode !=BDY()) return;
var srl = GJT.getWindowScrollLeft(), srt = GJT.getWindowScrollTop(), xm = GJT.getWindowWidth() - 3, ym = GJT.getWindowHeight() - 3,
l = obj.offsetLeft, t = obj.offsetTop, w = obj.offsetWidth, h = obj.offsetHeight, st = obj.style, t1, l1;
if (t + h > srt + ym && h <= ym) t1 = srt + ym - h;
else if (t < srt) t1 = srt; //優先讓上邊界可見 && h <= ym
if (l + w > srl + xm && w <= xm) l1 = srl + xm - w;
else if (l < srl) l1 = srl; //優先上左邊界可見 && w <= xm

if (t1 !=null) st.top = toPx(t1);
if (l1 !=null) st.left = toPx(l1);
}
function htmlSelect(attr, ValAry) {
var h = ["<select ", attr, " >"], k = ValAry.length;
for (var i = 0; i < k; i++) { h.push("<option value=\"", GJT.encodeAttr(ValAry[i] + ""), "\">", GJT.encodeAttr(ValAry[i] + ""), "</option>"); }
h.push("</select>");
return h.join("");

}
function matchLoc(o, baseO, sftX, sftY, noZ, rectLimit, mmatchWH, sftR, sftB) {
    if (rectLimit) showIt(o);
    o.style.position = "absolute";
var b = baseO, rt = o.getBoundingClientRect(), rtb = b.getBoundingClientRect(), rl = rectLimit;
if (sftX == null) sftX = 0; if (sftY == null) sftY = 0;
var ost = o.style, dx = rtb.left - rt.left, dy = rtb.top - rt.top; // dx = rtb.left - (rt.left <= 0 ? 0 : rt.left), dy = rtb.top - (rt.top <= 0 ? 0 : rt.top);
ost.left = toPx(o.offsetLeft + dx + sftX);
ost.top = toPx(o.offsetTop + dy + sftY);
if (mmatchWH) {
if (sftR == null) sftR = 0; if (sftB == null) sftB = 0;
ost.width = toPx(rtb.right - rtb.left - sftX - sftR); ost.height = toPx(rtb.bottom - rtb.top - sftY - sftB);
}
rt = o.getBoundingClientRect();
if (rl) showItA(o, !(rt.left < rl.left || rt.right > rl.right || rt.top < rl.top || rt.bottom > rl.bottom));
if (!noZ) toZTopC(o);
}
function showObjAt(tarObj, MyLeft, MyTop, myWidth, myHeight, noZ) { var st = tarObj.style; cmnMoveObjTo(tarObj, MyLeft, MyTop, myWidth, myHeight); st.display = ""; if (!noZ) toZTopC(tarObj); };
function i18nText(o, dftText) { if (o && o.text) return o.text; else return dftText; }
function getTip(obj) { if (obj && obj.tip) return obj.tip; else return ""; }
function i18htmTitle(obj) { if (obj && obj.tip) return " title=\"" + GJT.encodeAttr(obj.tip) + "\""; else return ""; }
function i18htmTitle2(obj) { if (obj && obj.text) return " title=\"" + GJT.encodeAttr(obj.text) + "\""; else return ""; }
function i18htmValue(obj) { if (obj && obj.text) return " value=\"" + GJT.encodeAttr(obj.text) + "\""; else return ""; }
function getCaption(obj) { var res = getAtr(obj, KW.Caption); if (!res) res = obj.text; return res; }
function dataPageInfTxt() { return ["<span z_pginfobk='Y'>", i18nm.GridQryPageInfo.text.replace("%1", "<input type=text class='pageno' z_lkrhpgno='Y' />").replace("%2", "<input type=text class='pagerows' z_lkrhpgrows='Y' " + KW.Choice + "='10,20,50,100,200,500,1000' />").replace("%3", "<span xzswttlrcrds='Y'>0</span>"), "<span class='PageNoList' z_xk_xPgNoList='Y'></span></span>&nbsp;&nbsp;<span class='TimePrgsHint'></span>"].join(""); }
function dataPageInfShw(grid, oBar) {
var myrows = parseInt(getAtr(grid, KW.PageRows)); if (!myrows) myrows = 50;
var mypgno = parseInt(getAtr(grid, KW.PageNo)); if (!mypgno) mypgno = 1;
var inpt = getChiHasAtr(oBar, "z_lkrhpgrows");
if (inpt) inpt.value = myrows
inpt = getChiHasAtr(oBar, "z_lkrhpgno");
if (inpt) inpt.value = mypgno;
}
function setTargetPage(val) { setAtr(document.body, "tarPage", val); }
function getTargetPage(O2) {
var res, o;
res = O2 ? O2.tarPage : null;
if (!res) res = getAtr(O2, "tarPage");
if (!res) res = getAtr(BDY(), "tarPage");
if (!res) { o = document.getElementById("tarPage"); if (o) res = o.value; }
if (!res) {
var chn = PROG.children;
for (var i = 0; i < chn.length; i++) {
res = chn[i].tarPage;
if (!res) res = getAtr(chn[i], "tarPage");
if (res) return res;
}
}
return res;
}
function getAppId() {
var chn = PROG.children,res,refObj=PROG.activeItem;
if(refObj && refObj.appId) return refObj.appId;
for (var i = 0; i < chn.length; i++) {
res = chn[i].appId;//有可能同page內的不同表格的AppId不同
if (res) return res;
}
}
function getActHgt(c, forArng) {
if (!c) return 0;
if (forArng) {
var ps=GJT.getComputedStyle(c),psn = ps.position;
if (psn == "fixed" || psn == "absolute" || isHidden(c)) return 0;
if (ps.overflowY == "auto" || ps.overflowY == "hidden") return c.offsetHeight;
}
var chrn = c.children, mxh = c.offsetHeight, ns = GJT.getComputedStyle(c), mt = parseIntD(ns.marginTop, 0), mb = parseIntD(ns.marginBottom, 0),
bh = parseIntD(ns.borderTopWidth, 0) + parseIntD(ns.borderBottomWidth, 0) + parseIntD(ns.paddingTop, 0) + parseIntD(ns.paddingBottom, 0);
var sh = c.scrollHeight, sh2 = c.offsetHeight + mt + mb; //offsetHeight已經包含邊框
if (sh) sh += (mt + mb + bh);
if (sh2 > sh) sh = sh2;
if (sh) c.__sh = sh; else sh = c.__sh;
return sh;
}
function getActWdt(c, forArng) {
if (!c) return 0;
if (forArng) {
var ps = GJT.getComputedStyle(c), psn = ps.position;
if (psn == "fixed" || psn == "absolute" || isHidden(c)) return 0;
if (ps.overflowX == "auto" || ps.overflowX == "hidden") return c.offsetWidth;
}
var chrn = c.children, mxh = c.offsetHeight, ns = GJT.getComputedStyle(c), mt = parseIntD(ns.marginLeft, 0), mb = parseIntD(ns.marginRight, 0),
bh = parseIntD(ns.borderLeftWidth, 0) + parseIntD(ns.borderRightWidth, 0) + parseIntD(ns.paddingLeft, 0) + parseIntD(ns.paddingRight, 0);
var sh = c.scrollWidth, sh2 = c.offsetWidth + mt + mb;
if (sh) sh += (mt + mb + bh);
if (sh2 > sh) sh = sh2;
if (sh) c.__sh = sh; else sh = c.__sh;
return sh;
}
//取得指定物件設定css width 時與實際會占用的寬度的差異
function cssDiff4Wdt(c) {//取得指定物件設定css width 時與實際會占用的寬度的差異,css 的width The css width property does not include padding, borders, or margins; it sets the width of the area inside the padding, border, and margin of the element
var ns = GJT.getComputedStyle(c);
return (parseIntD(ns.marginLeft, 0) + parseIntD(ns.marginRight, 0) + parseIntD(ns.borderLeftWidth, 0) + parseIntD(ns.borderRightWidth, 0) + parseIntD(ns.paddingLeft, 0) + parseIntD(ns.paddingRight, 0));
}
//取得指定物件設定css width 時與實際會占用的高度的差異,很多狀況是由程式計算物件可以置放的大小位置,(layout control),
function cssDiff4Hgt(c) {//,css 的width The css width property does not include padding, borders, or margins; it sets the width of the area inside the padding, border, and margin of the element
var ns = GJT.getComputedStyle(c);
return (parseIntD(ns.marginTop, 0) + parseIntD(ns.marginBottom, 0) + parseIntD(ns.borderTopWidth, 0) + parseIntD(ns.borderBottomWidth, 0)
+ parseIntD(ns.paddingTop, 0) + parseIntD(ns.paddingBottom, 0));
}

//The offsetHeight property returns the viewable height of an element in pixels, including padding, border and scrollbar, but not the margin.
//Use the clientHeight and clientWidth properties to return the viewable height and width of an element, only including the padding.
function toCssHgt(c, h) {//總高度轉成style的height,style的height width 只有
var ns = GJT.getComputedStyle(c); h -= (parseIntD(ns.marginTop, 0) + parseIntD(ns.marginBottom, 0) + parseIntD(ns.borderTopWidth, 0) + parseIntD(ns.borderBottomWidth, 0)
+ parseIntD(ns.paddingTop, 0) + parseIntD(ns.paddingBottom, 0)); return h;
}
function toCssWdt(c, w) {
var ns = GJT.getComputedStyle(c); w -= (parseIntD(ns.marginLeft, 0) + parseIntD(ns.marginRight, 0) + parseIntD(ns.borderLeftWidth, 0) + parseIntD(ns.borderRightWidth, 0)
+ parseIntD(ns.paddingLeft, 0) + parseIntD(ns.paddingRight, 0)); return w;
}
function toCssWdtNoMargin(c, w) {
var ns = GJT.getComputedStyle(c); w -= (parseIntD(ns.borderLeftWidth, 0) + parseIntD(ns.borderRightWidth, 0)
+ parseIntD(ns.paddingLeft, 0) + parseIntD(ns.paddingRight, 0)); return w;
}
function setActHgt(c, h) { c.style.height = toPx(toCssHgt(c, h)); }
function setActWdt(c, w) { c.style.width = toPx(toCssWdt(c, w)); }
function setHgt(tar, hgt) {
if (!tar.length) tar = [tar];
for (var i = 0; i < tar.length; i++) {
if (tar[i] && tar[i].style) tar[i].style.height = hgt;
}
}
function rvsTimePicked() {
var rf = GJT.eventSrc(); if (!rf) return;
rvsTimePickedDo(rf);
}
function rvsTimePickedDo(rf) {
var tarObj = rf.tarObj, oa = rf.grp; if (!tarObj || !oa) return;
var v = GJT.trim(tarObj.value);
for (var i = 0; i < oa.length; i++) {
if (i > 2) v = v + ".";
else if (i > 0) v = v + ":";
else v = v + " ";
v = v + oa[i].value;
}
tarObj.realValue = v;
//alert(tarObj.realValue);
}
function addTimePicker(tarObj, mode) {
var h, k = [24, 60, 60, 10], v, rv = getAtr(tarObj, "realValue"), idx, rf = tarObj, ov = ["00", "00", "00", "00"], txt;
mode = parseIntD(mode, 2);
if (mode > k.length) mode = k.length; var oa = [];
if (!rv) rv = tarObj.value;
tarObj.realValue = rv;
if (rv) {
idx = rv.indexOf(" ");
if (idx > 0) txt = rv.substring(idx + 1).split(":");
if (txt) {
if (txt.length > 2) {
idx = txt[2].indexOf(".");
if (idx > 0) { txt[3] = txt[2].substring(idx + 1); txt[2] = txt[2].substring(0, idx); }
}
for (var j = 0; j < txt.length; j++) {
ov[j] = txt[j];
}
}
}
for (var i = 0; i < mode; i++) {
h = [];
h.push("<select onchange=\"rvsTimePicked()\" >");
for (var j = 0; j < k[i]; j++) {
if (i < 3 || j == 0) v = j < 10 ? "0" + j : "" + j; else v = j * 10;
h.push("<option ");
if (v == ov[i]) h.push(" selected ");
h.push("value=\"", v, "\">", v, "</option>");
}
h.push("</select>");
rf.insertAdjacentHTML("AfterEnd", h.join(""));
rf = rf.nextSibling; oa.push(rf);
rf.grp = oa; rf.tarObj = tarObj;
if (i > 2) rf.insertAdjacentHTML("BeforeBegin", ".");
else if (i > 0) rf.insertAdjacentHTML("BeforeBegin", ":");
}
tarObj.grp = oa;
tarObj.tarObj = tarObj;
tarObj.onchange = rvsTimePicked;
}
function BDY() { return document.body; }

function cmnEvtSetReturn(MyVal, ev) {
if (!ev) ev = GJT.event(); if (!ev) return;
if (ev.preventDefault) { if (!MyVal) ev.preventDefault(); return; }
ev.returnValue = MyVal; return MyVal;
}
function getObjByTagNameBubble(srcObj, tagName) {
if (!srcObj) srcObj = GJT.eventSrc(); if (!srcObj) return;
var Obj = srcObj, oDoc;
try { oDoc = srcObj.ownerDocument; } catch (e) { }
while (Obj != null) {
if (oDoc) { if (Obj == oDoc) return; }
else { if (Obj == document) return; }
if (Obj.tagName == tagName) return Obj;
var objP = Obj.parentNode;
if (objP == Obj) return;
Obj = objP;
}
}
function getTable(srcObj) { return getObjByTagNameBubble(srcObj, "TABLE"); }
function tbGetTable(srcObj) { return getTable(srcObj); }
function getTBody(srcObj) { return getTBODY(srcObj); }
function getTR(srcObj) { return getObjByTagNameBubble(srcObj, "TR"); }
function getTD(srcObj) { return getObjByTagNameBubble(srcObj, "TD"); }
function getTBODY(srcObj) {
var oTbl = getTable(srcObj); if (oTbl == null) return null;
for (var i = 0, chrn = oTbl.children; i < chrn.length; i++) {
if (chrn[i].tagName == "TBODY") return chrn[i];
}
}
function getTHEAD(srcObj) {
var oTbl = getTable(srcObj); if (oTbl == null) return null;
var ths = oTbl.getElementsByTagName("THEAD");
if (ths.length == 0) return null;
return ths[0];
}
function tbGetCells(tb) {//把表格的td放入陣列
var rws = tb.rows, res = [];
for (var r = 0; r < rws.length; r++) {
res[r] = [];
for (var c = 0, cs = rws[r].cells; c < cs.length; c++) {res[r][c] = cs[c];}
}
return res;
}

function EmsByTag(parent, tag) { return parent.getElementsByTagName(tag); }
function EmByTag(parent, tag) { var a = EmsByTag(parent, tag); if (a.length > 0) return a[0]; }
function EmsOfChild(parent, tag) {
var res = [], chn = parent.childNodes;
for (var i = 0; i < chn.length; i++) {
if (chn[i].tagName == tag) res.push(chn[i]);
}
return res;
}
function getEmByClass(parent, className) {
if (!parent) return;
var cs = className, chrn = parent.children, n, k = chrn.length;
if (k <= 0) return;
for (var i = 0; i < k; i++) {
n = chrn[i]; if (n.className == cs) return n;
}
for (var i = 0; i < k; i++) {
n = getEmByClass(chrn[i], cs); if (n) return n;
}
}
function cfmCloseDlg() { if (!window.confirm("Are you sure to close this editor?")) return true; }
function getAllByClass(parent, className, ary) {
if (!ary) ary = [];
var cs = className, cn = parent.children, k = cn.length; if (k == 0) return ary;
for (var i = 0; i < k; i++) {
if (cn[i].className == cs) ary.push(cn[i]);
}
for (var i = 0; i < k; i++) {
ary = getAllByClass(cn[i], cs, ary);
}
return ary;
}
function getAncesterHasAttr(parent, attrName) {
while (getAtr(parent, attrName, null) == null) {
parent = parent.parentElement;
if (parent == null) return;
}
return parent;
}
function getAncesterByClass(parent, className) {
while (parent.className != className) {
parent = parent.parentElement;
if (parent == null) return;
}
return parent;
}
function noNullTxt(v) { if (v == null) return ""; return v; }
function getChiHasAtr(tar, attrName, atrV, lvl) {
if (!tar) return;
var chrn = tar.children, v = getAtr(tar, attrName, null);
if (v != null) {
if (atrV == null) return tar;
else if (atrV == v) return tar;
}
if (lvl == null) lvl = 1000;
if (lvl <= 0) return;
if (!chrn) return;
for (var i = 0; i < chrn.length; i++) {
v = getAtr(chrn[i], attrName, null);
if (v != null) {
if (atrV == null) return chrn[i];
else if (atrV == v) return chrn[i];
}
}
for (var i = 0; i < chrn.length; i++) {
var chi = getChiHasAtr(chrn[i], attrName, atrV, lvl - 1);
if (chi != null) return chi;
}
return null;
}
function collEmHasAtr(tar, attrName, atrV, res, lvl) {
if (!res) res = []; //must return array forever,codes suppose it is.
if (!tar) return res;
var chrn = tar.children, v = getAtr(tar, attrName, null);
if (v != null) {
if (atrV == null) res.push(tar);
else if (atrV == v) res.push(tar);
}
if (lvl == null) lvl = 100;
else if (lvl <= 0) return res;
for (var i = 0; i < chrn.length; i++) {
res = collEmHasAtr(chrn[i], attrName, atrV, res, lvl - 1);
}
return res;
}
function setEmTxt(o, txt) {
if (o.nodeName == "#text") { o.nodeValue = txt; return; }
var ns = o.childNodes;
for (var i = 0; i < ns.length; i++) {
if (ns[i].nodeName == "#text") { ns[i].nodeValue = txt; return; }
}
o.appendChild(document.createTextNode(txt));
}
function getOffsetT(surObj, tagNameRecurseTo) {
var offt = 0, offL = 0, oo = surObj;
if (oo != null) {
while (oo.tagName != tagNameRecurseTo) {
if (!oo.offsetParent) break;
var sclTop = oo.offsetParent.scrollTop, sclLeft = oo.offsetParent.scrollLeft;
if (oo.offsetParent == document.body) { sclTop = 0; sclLeft = 0; }
offt += oo.offsetTop; if (sclTop) offt -= sclTop;
offL += oo.offsetLeft; if (sclLeft) offL -= sclLeft; oo = oo.offsetParent;
if (!oo) break;
}
}
return [offL, offt];
}
function getOffsetO(surObj, oContainer) {
var offt = 0, offL = 0, oo = surObj, obdy = BDY();
if (oContainer == null) oContainer = obdy;
while (oo != oContainer) {
offt += oo.offsetTop; offL += oo.offsetLeft; oo = oo.offsetParent;
if (oo == null || oo == obdy) break;
}
return [offL, offt];
}
function selectText(em) {//copied from web http://stackoverflow.com/questions/11128130/select-text-in-javascript
var doc = document;
if (!em.value && !em.innerText) return;
if (em.select) return em.select();
try {
if (doc.body.createTextRange) { // ms
var range = doc.body.createTextRange();
range.moveToElementText(em);
range.select();
} else if (window.getSelection) { // moz, opera, webkit
var selection = window.getSelection();
var range = doc.createRange();
range.selectNodeContents(em);
selection.removeAllRanges();
selection.addRange(range);
}
} catch (ex) { }
}
function borderDown(obj) {
var evt = GJT.event(); if (!obj) obj = GJT.eventSrc(); if (!obj) return;
if (obj.srcElement || obj.target) obj = GJT.eventSrc();
var ori = getAtr(obj, "oriBdrColor"), s = GJT.getComputedStyle(obj), oriPad = getAtr(obj, "oriPadd");
if (!ori) { ori = [s.borderLeftColor, s.borderTopColor, s.borderRightColor, s.borderBottomColor]; setAtr(obj, "oriBdrColor", ori.join(KW.Dlm0)); }
else ori = ori.split(KW.Dlm0);
s = obj.style; s.borderLeftColor = ori[2]; s.borderTopColor = ori[3]; s.borderRightColor = ori[0]; s.borderBottomColor = ori[1];
}
function borderUp(obj) {
var evt = GJT.event(); if (!obj) obj = GJT.eventSrc();
if (obj.srcElement || obj.target) obj = GJT.eventSrc();
var ori = getAtr(obj, "oriBdrColor"); if (!ori) return;
ac = ori.split(KW.Dlm0);
s = obj.style; s.borderLeftColor = ac[0]; s.borderTopColor = ac[1]; s.borderRightColor = ac[2]; s.borderBottomColor = ac[3];
}
function teHiLiNotNullTextBox(o) {
if(!o || o==GJT.event())o=GJT.eventSrc();
if (o && o.type == "text") {
o.style.backgroundColor = o.value == "" ? "" : "#ffdd88";
}
}
function cmnRunToolByEvent(evt) {
if (evt == null) evt = GJT.event();
var Obj = GJT.eventSrc(evt); //.srcElement; //evt.srcElement;
for (var i = 0; i < 2; i++) {
if (Obj.tagName == "INPUT") return;
var nm = getName(Obj);
if (nm == null || nm == "") nm = Obj.id;
if (nm != null && nm != "") break;
Obj = Obj.parentNode;
}
if (nm == null || nm == "") return;
var MyTD = getTD(Obj), res = null;
if (MyTD == null || getAtr(MyTD, "Enabled", true)) {
Obj.style.curosr = 'wait'; res = cmnRunToolByName(nm); Obj.style.curosr = 'default'; return res;
}
}
function cmnRunToolByName(nm) {
if (!nm || nm.length == 0) return;
var MyParam = "()", res = null; //加入evt反而造成次階呼叫出問題
if (nm.indexOf("(") > 0) MyParam = "";
res = eval(nm + MyParam + ";");
}
function cmnExecWaitWin(MyWin, fun) {
if (MyWin.document.readyState != "complete") { }
}
function cmnOpenWindow(sName, sURL, sMethod, aryN, aryV, sFeature, MyOpener, booRefresh, acptCharset) {
var baseFeature = "scrollbars=yes,resizable=yes,status=no,toolbar=no,location=no";
if (sFeature == null || sFeature == "") {
sFeature = baseFeature;
} else { if (sFeature.substr(0, 1) == "+") sFeature = baseFeature + "," + sFeature.substr(1); }
var MyWin = window.open("", sName, sFeature, true), doc = MyWin.document;
if (sName == null) doc.write("<span />");
if (!booRefresh) {
if (MyWin == null) { booRefresh = true; } else {
if (MyWin.document.readyState != "complete") {
booRefresh = true;
} else if (MyWin.document.body.children.length == 0) { booRefresh = true; }
}
}
if (booRefresh) {
cmnShowNewWindow(sName, sURL, sMethod, aryN, aryV, sFeature, MyOpener, null, null, MyWin, acptCharset);
} else { MyWin.focus(); if (MyOpener && MyOpener != self) MyWin.opener = MyOpener; }
return MyWin;
}
function cmnShowNewWindow(sName, sURL, sMethod, aryN, aryV, sFeature, MyOpener, bUseIFRAME, IFramePosition, MyWin, acptCharset) {
var MyInrHtml = "", bdy = BDY(), newwin, MyForm, inputs, MyIdx = document.all.length;
var baseFeature = "scrollbars=yes,resizable=yes,status=no,toolbar=no,location=no";
if (sFeature == null || sFeature == "") {
sFeature = baseFeature;
} else { if (sFeature.substr(0, 1) == "+") sFeature = baseFeature + "," + sFeature.substr(1); }
if (!sMethod) sMethod = "POST";
var tarBdy = bdy;
if (MyWin && MyWin.document) tarBdy = MyWin.document.body;
if (sName) {
if (bUseIFRAME) {
var MyHTML = "<iframe src=\"AboutBlank.htm\" style=\"position:absolute;display:none\" id=\"" + sName + "\" name=\"" + sName + "\"></iframe>";
try { newwin = window.frames[sName]; } catch (e) { }
if (!newwin) {
addE(MyHTML);
newwin = window.frames[sName];
}
var of = document.getElementById(sName);
if (of) {
if (IFramePosition) { showObjAt(of, IFramePosition[0], IFramePosition[1], IFramePosition[2], IFramePosition[3]); }
else hideIt(of);
}
} else {
newwin = window.open("", sName, sFeature);
}
try {
//if (newwin.document.readyState == "complete") {
//由於Google Chrome 在body 尚未ready時 document.readyState 就 == "complete" 如果這裡 使用新open的window建立form 會有問題
//if(newwin.document.body)tarBdy=newwin.document.body;
//}
} catch (e) { }
}
if (aryN != null) { for (var i = 0; i < aryN.length; i++) { MyInrHtml += "<input type=\"hidden\" name=\"" + aryN[i] + "\"></INPUT>"; } }
MyForm = tarBdy.ownerDocument.getElementById("teForm4Submit");
if (!MyForm) {
tarBdy.insertAdjacentHTML("BeforeEnd", "<form style=\"display:none\" name=\"form_" + sName + "\" id=\"form_" + sName + "\" action=\"" + sURL + "\" method=\"" + sMethod + "\" target=\"" + sName + "\">" + MyInrHtml + "</form>");
//MyForm=tarBdy.children["form_"+sName];
MyForm = tarBdy.ownerDocument.getElementById("form_" + sName);
} else {
MyForm.action = sURL; MyForm.innerHTML = MyInrHtml; MyForm.method = sMethod;
}
try {
if (MyForm == null) { alert("form_" + sName + " not found"); return; }
MyForm.acceptCharset = acptCharset ? acptCharset : "UTF-8";//Charset must be set for Chrome
inputs = MyForm.getElementsByTagName("INPUT");
} catch (e) { MyForm = MyForm[0]; inputs = MyForm.getElementsByTagName("INPUT"); }
if (aryV != null) { for (var i = 0; i < aryN.length; i++) { inputs[i].value = aryV[i]; } }
if (tarBdy == bdy) { MyForm.target = sName; } else { MyForm.target = ""; }
try { MyForm.submit(); } catch (e) { alert(e + " " + MyForm); }
if (tarBdy == bdy) {
if (MyForm.id != "teForm4Submit") { killIt(MyForm); } else { MyForm.innerHTML = ""; }
}
if (newwin) { if (MyOpener && MyOpener != self) newwin.opener = MyOpener; try { newwin.focus(); } catch (e) { } }
return MyWin ? MyWin : newwin;
}

function putWinBesideMouse(MyWindow, PutMode) {
try {
var evt = GJT.event();
var MyLeft = evt.screenX, MyTop = evt.screenY, myBdy = MyWindow.document.body;
maxwdt = myBdy.clientWidth + 30; maxHgt = myBdy.clientHeight + 60;
if ((MyLeft + maxwdt) > screen.availWidth) MyLeft = screen.availWidth - maxwdt;
if ((MyTop + maxHgt) > screen.availHeight) MyTop = 0;
//Chrome cause problem if call MyWindow.moveTo directly, maybe due to multi threads
MyWindow.setTimeout("this.moveTo(" + MyLeft + "," + MyTop + ")", 100);
} catch (e) { return; }
}
function addE(MyHTML, ctnr) { return addEm(MyHTML, null, ctnr); }
function addEm(MyHTML, ElementChk, ctnr, sPosition) {//Never change rule of this, outer code supposed it
if (ElementChk != null) return ElementChk; if (!ctnr) ctnr = document.body;
if (!sPosition) sPosition = "BeforeEnd";
try {//IE
ctnr.insertAdjacentHTML(sPosition, MyHTML);
}
catch (ex) {
//ctnr.insertAdjacentHTML(sPosition, MyHTML);
var df; // : DocumentFragment
var r = document.createRange();
switch (String(sPosition).toLowerCase()) { // convert to string and unify case
case "beforebegin":
r.setStartBefore(ctnr);
df = r.createContextualFragment(MyHTML);
ctnr.parentNode.insertBefore(df, ctnr);
break;
case "afterbegin":
r.selectNodeContents(ctnr);
r.collapse(true);
df = r.createContextualFragment(sHTML);
ctnr.insertBefore(df, ctnr.firstChild);
break;
case "beforeend":
r.selectNodeContents(ctnr);
r.collapse(false);
df = r.createContextualFragment(sHTML);
ctnr.appendChild(df);
break;
case "afterend":
r.setStartAfter(ctnr);
df = r.createContextualFragment(sHTML);
ctnr.parentNode.insertBefore(df, ctnr.nextSibling);
break;
}
//if (ctnr.tagName=="TABLE"){
// getEM(ctnr,"TBODY")[0].insertAdjacentHTML(sPosition, MyHTML);
// ctnr =getEM(ctnr,"TBODY")[0];
//}
}
var oo;
switch (String(sPosition).toLowerCase()) { // convert to string and unify case
case "beforebegin":
oo = ctnr.previousSibling;
break;
case "afterbegin":
oo = ctnr.childNodes[0];
break;
case "beforeend":
oo = ctnr.childNodes[ctnr.childNodes.length - 1];
break;
case "afterend":
oo = ctnr.nextSibling;
break;
}
return oo;
}
function showBeside(tarObj, refObj, sftL, sftT) {
if (tarObj == null || refObj == null) return;
var tarContainer = tarObj.offsetParent;
var offsetpos = getOffsetO(refObj, tarContainer);
if (sftL == null) sftL = 0; if (sftT == null) sftT = 0;
sftL += offsetpos[0] + refObj.offsetWidth; sftT += offsetpos[1];
showObjAt(tarObj, sftL, sftT);
makeSureInsideWindowDo(tarObj);
}
function cmnSplit2(s, dm0, dm1) { if (s == null) return; var a = s.split(dm0), b = []; for (var i = 0; i < a.length; i++) { b.push(a[i].split(dm1)); } return b; }
function GetItmNameByAry(inObj) { return inObj[0]; }
function GetItmCaptionByAry(inObj) { return inObj[1]; }
function GetItmFieldNameByAry(inObj) { if (inObj.length > 9) { return inObj[9]; } else { return ""; } }
function CreateItemsArrayFromString(strItemsList) { return cmnSplit2(strItemsList, KW.Dlm1, KW.Dlm2); }
function cmnIsCharTypeCorrect(inChar, dataType) {
/*+43 - 45 . 46 / 47 */
for (var i2 = 0; i2 < inChar.length; i2++) {
var kcode = inChar.charCodeAt(i2);
switch (dataType) {
case GDT.DateTime:
if (kcode != 32 && (kcode < 45 || kcode > 58)) return false;
break;
case GDT.Integer:
case GDT.Short:
if ((kcode < 48 || kcode > 57) && kcode != 45 && kcode != 43) return false;
break;
case GDT.Real:
if ((kcode < 48 || kcode > 57) && kcode != 46 && kcode != 45 && kcode != 43) return false;
break;
case GDT.Boolean:
var C = inChar.substr(i2, 1).toUpperCase();
if (C == "T" || C == "R" || C == "U" || C == "E" || C == "F" || C == "A" || C == "L" || C == "S" || C == "E") return true;
return false;
default:
}
}
return true;
}
function cmnIsTextTypeCorrect(MyText, MyType) {
if (MyText == "") return true;
switch (MyType) {
case GDT.String:
return true;
case GDT.Real:
var MyReal = parseFloat(MyText);
if (isNaN(MyReal)) return false;
if (MyReal != MyText) return false;
return true;
case GDT.Integer:
case GDT.Short:
var MyInt = parseInt(MyText);
if (isNaN(MyInt)) return false;
if (MyInt != MyText) return false;
return true;
case GDT.Boolean:
return true;
case GDT.DateTime:
var MyDateprs = Date.parse(MyText);
if (isNaN(MyDateprs)) return false;
return true;
default:
}
}
function cmnSwitchInputChecked() {
src = GJT.eventSrc();
for (i = 0; i < src.children.length; i++) {
var chi = src.children[i]; if (chi.tagName == "INPUT") { if (chi.type == "radio" || chi.type == "RADIO") { chi.checked = true; return chi; } else if (chi.type == "checkbox" || chi.type == "CHECKBOX") { chi.checked = !chi.checked; return chi; } }
}
return src;
}
function cmnSelectValueModal(winTitle, strCtrlId, strChoice, booMultiSelect, OriginalVal) {
var MyParam = "Title=" + winTitle;
if (OriginalVal != null) MyParam += "&OriginalValue=" + OriginalVal; if (booMultiSelect) MyParam += "&MultiSelect=Y";
if (strCtrlId) MyParam += "&" + KW.ControllerId + "=" + strCtrlId; if (strChoice) MyParam += "&" + KW.Choice + "=" + strChoice;
return window.showModalDialog(C_Page_ValueSelector + "?" + MyParam, "MODAL");
}
function cmnSelectValue(winNm, winTitle, strCtrlId, strChoice, booMultiSelect, OriginalVal) {
var aP = ["Title"], aV = [winTitle];
if (strCtrlId) { aP.push(KW.ControllerId); aV.push(strCtrlId); }
if (strChoice) { aP.push(KW.Choice); aV.push(strChoice); }
if (OriginalVal) { aP.push("OriginalValue"); aV.push(OriginalVal); }
if (booMultiSelect) { aP.push("MultiSelect"); aV.push("Y"); }
cmnOpenWindow(winNm, C_Page_ValueSelector, "POST", aP, aV, " ", self);
}
//Below are functions special
function MenuHide() {
var popmenu = document.body.children[KW.PopupMenu]; if (popmenu == null) return;
try { killIt(popmenu); } catch (e) { for (i = 0; i < popmenu.length; i++) { killIt(popmenu[i]); } }
}
function MenuHideChk() {
var s = GJT.eventSrc(), o = document.body.children[KW.PopupMenu]; //alert(o.tgr);
if (s && o && s != o.tgr) MenuHide();
}
function MenuShowDo(MenuObj, alignV, alignH) {
GJT.stopBubble();
showBesideMouse(MenuObj);
MenuObj.focus();
}
function cmnDateObjToString(oDate, booUseMMDDYYYY) {
if (!oDate) return "";
if (booUseMMDDYYYY) {
var MyMM = oDate.getMonth() + 1;
if (MyMM < 10) MyMM = "0" + MyMM;
var MyDD = oDate.getDate();
if (MyDD < 10) MyDD = "0" + MyDD;
return MyMM + "/" + MyDD + "/" + oDate.getFullYear();
} else {
return (oDate.getMonth() + 1) + "/" + oDate.getDate() + "/" + oDate.getFullYear();
}
}
function cmnDateStringToObj(strDate, booUseMMDDYYYY) {
if (!strDate) return null;
if (booUseMMDDYYYY) {
var ary = strDate.split("/");
var MyY = parseInt(ary[2]);
if (MyY < 50) { MyY += 2000; } else if (MyY < 1000) { MyY += 1900; }
return new Date(MyY, parseInt(ary[0]) - 1, parseInt(ary[1]));
} else {
return new Date(strDate);
}
}
function cmnGetDatePortion(strDateTime) {
if (strDateTime == null) return null; if (strDateTime == "") return "";
var ary = strDateTime.split(" "); return ary[0];
}
function cmnGetDatePortionMMDD(strDateTime) {
var vv = cmnGetDatePortion(strDateTime); if (vv == null) return ""; var ary = vv.split("/");
vv = ary[0]; if (ary.length > 1) vv += "/" + ary[1]; return vv;
}
function convertQuotToHTML(OriStr) {
if (OriStr == null || OriStr == "") return OriStr;
OriStr = OriStr.replace(/&/gi, "&amp;");
return OriStr.replace(/\"/gi, "&quot;");
}

function convertToInnerHTML(OriStr) {
if (OriStr == null || OriStr == "") return OriStr;
result = OriStr.replace(/ /gi, "&nbsp;");
result = result.replace(/\"/gi, "&quot;");
result = result.replace(/\r/gi, "&#13;");
return result.replace(/\n/gi, "&#10;");
}

function convertToQueryString(OriStr) {
if (OriStr == null || OriStr == "") return OriStr;
var result = OriStr.replace(/&/gi, "%26");
return result.replace(/ /gi, "%20");
}
function getShiftColorA(txtColor, iShift) {//must be #xxxxxx format
if (txtColor.indexOf("#") != 0 || txtColor.length != 7) return txtColor; //can not judge
var iR = parseFloat(getShiftColorI(txtColor.substring(1, 3), 0)),
iG = parseFloat(getShiftColorI(txtColor.substring(3, 5), 0)),
iB = parseFloat(getShiftColorI(txtColor.substring(5, 7), 0));
if (iShift < 0) {
var im = iShift;
if (iR + iShift < 0) im = -iR;
if (iG + iShift < 0 && im < iShift) im = -iG;
if (iB + iShift < 0 && im < iShift) im = -iB;
return getShiftColor(txtColor, iShift, iShift, iShift);
} else {
var im = iShift;
if (iR + iShift > 255) im = 255 - iR;
if (iG + iShift > 255 && im > iShift) im = 255 - iG;
if (iB + iShift > 255 && im > iShift) im = 255 - iB;
return getShiftColor(txtColor, im, im, im);
}
}
function getShiftColor(txtColor, iShiftR, iShiftG, iShiftB) {
return ["#", getShiftColorOne(txtColor.substring(1, 3), iShiftR),
getShiftColorOne(txtColor.substring(3, 5), iShiftG), getShiftColorOne(txtColor.substring(5, 7), iShiftB)].join("");
}
function getShiftColorOne(txtColor, iShift) {
var iColor = getShiftColorI(txtColor, iShift), txt = iColor.toString(16);
if (txt.length < 2) txt = "0" + txt;
return txt;
}
function getShiftColorI(txtColor, iShift) {
var iColor = parseInt(txtColor, 16);
iShift = parseIntD(iShift, 0);
iColor = iColor + iShift;
if (iColor > 255) { iColor = 255; } else if (iColor < 0) { iColor = 0; }
return iColor;
}
//function cmnSaveProfile(Obj, sType, sValue, bRemove) {
// var tarPage = profileTarget;if (!C_Page_SaveUserProfile) return;
// if(!tarPage) tarPage=getTargetPage();
// if (!tarPage) tarPage = window.location.pathname;
// var p = [KW.PageName, KW.GridName, "ptyName", "ptyValue", sType], v = [tarPage, (Obj ? (Obj.id ? Obj.id : getName(Obj)) : ""), sType, sValue, sValue],s=[];
// if (bRemove) { p.push("Remove");v.push("Y"); }
// s.push(p[0],"=",encodeURIComponent(v[0]));
// for(var i=1;i<p.length;i++){s.push("&", p[i],"=",encodeURIComponent(v[i]));}
// var req = GJT.xmlHttpRequest();
// req.open("POST", C_Page_SaveUserProfile, true); //false ===> 同步 POST? GET? GET有資料量限制
// req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8"); //用於send(content) ， server端用request["變數名"] 接收
// req.send(s.join(""));
//}

function cmnLogout() { if (window.confirm(i18nm.ConfirmLogout.text)) window.location = C_Page_Logout; }
function alertA(sMsg) {
alert(sMsg);
}
function cmnPrintPage() {
window.print();
}
function cmnSwitchFloatType() {
var srcObj = GJT.eventSrc(), myTbl = getObjByTagNameBubble(srcObj, "TABLE");
if (srcObj.checked) { myTbl.style.position = "absolute"; } else { myTbl.style.position = ""; }
GJT.stopBubble();
}
function cmnGetWinObj(winName) {
//下午 12:02 2007/5/23 Paul, search IFrame before outer window
var MyWin;
if (window.frames == null) {
} else if (window.frames.length > 0) {//alert("window.frames.length=" + window.frames.length);
try {
MyWin = window.frames[winName];
} catch (e) { alert("Error cmnGetWinObj"); }
if (MyWin) return window.open("", winName); //Firefox has problem use window.frames[winName] if IFRAME destroied and created again
}
MyWin = window.open("", winName);
return MyWin;
}
//Below are functions for show dialog in place
function cmnHideSelfAuto() { cmnCloseSelfAuto(true); }
function cmnCloseSelfAuto(bHide) {//left a window can closed either be an independent window or a IFrame window
var opnr = self.opener;
GJT.stopBubble();
if (opnr) opnr.focus();
try { if (BWRT.FIREFOX == mBrowserType) self.close(); } catch (ex) { }
//check wether in IFrame
var par = self.parent;
if (par == self) {//is an independent window
if (bHide) { } else { self.close(); }
} else if (self.name == "") {
} else {//let parent window to close me
try {
if (bHide) {
if (par.dlgInPlaceCloseByWinName) return par.execScript("dlgInPlaceCloseByWinName('" + self.name + "',true)", "JavaScript");
} else {
if (par.dlgInPlaceCloseByWinName) return par.execScript("dlgInPlaceCloseByWinName('" + self.name + "')", "JavaScript");
}
} catch (e) {
}
//GJT.stopBubble();
}
}
function dlgInPlaceUpdateTitle(owin, titleTd) {
if (!owin || !titleTd || !titleTd.intvId) return;
if (owin.document.readyState != "complete") return;
window.clearInterval(!titleTd.intvId);
try {
titleTd.innerText = owin.document.title;
//revise width of dialog
var oDlg = getTable(getTable(titleTd).parentNode),
oTD = oDlg.rows[2].cells[1],
iFrm = oTD.children[0];
if (iFrm.offsetWidth < (oTD.offsetWidth + 5)) {
oDlg.style.width = toPx(oDlg.offsetWidth - (oTD.offsetWidth - iFrm.offsetWidth));
iFrm.style.width = "100%";
}
if (iFrm.offsetHeight < (oTD.offsetHeight + 5)) {
oDlg.style.height = toPx(oDlg.offsetHeight - (oTD.offsetHeight - iFrm.offsetHeight));
iFrm.style.height = "100%";
}
} catch (e) { }
}

function dlgInPlaceHideByParent(sWinName) { dlgInPlaceCloseByWinName(sWinName, true); }
function dlgInPlaceEnsureOnTop(oDlg) {
toZTop(oDlg);
}
function dlgInPlaceEnsureBorder(oDlg) {
var oTitle = oDlg.rows[1].cells[1].children[0];
try {
var w = oTitle.offsetWidth + 6;
if (oDlg.offsetWidth < w) oDlg.style.width = toPx(w);
} catch (e) { }
}

function dlgInPlaceCloseByWinName(sWinName, bHide) {
//NEVER CHANGE this function name, a lot of outer codes write hard this name
if (sWinName == "") return;
try {
var o = self.document.getElementById(cnstDlgNH + sWinName);
if (o) {
if (bHide) { hideIt(o); } else {
mtimeoutCloseDlgWin = window.setTimeout("dlgInPlaceCloseByTimOut('" + sWinName + "')", 200, "JavaScript");
return;
//clear document
var oIfrm = o.all[sWinName];
//Must clear IFrame before clear dialog table, or the script engine will throw an error message
//It seems cause the main window closed if the dialog IFrame try to close self by call this function
//Here try to use TimeOut to close dialog IFrame, this prevent codes executing in IFrame not complete before window object destoried
//下午 03:37 2007/6/5 After testing, it still happened the main window closed
if (oIfrm) killIt(oIfrm);
killIt(o);
//return true;
}
}
} catch (e) { }
}
function dlgInPlaceCloseByTimOut(sWinName) {
if (sWinName == "") return;
try {
var o = self.document.getElementById(cnstDlgNH + sWinName);
if (o) {
var oIfrm = null, oifs = o.getElementsByTagName("IFRAME");
if (oifs.length) oIfrm = oifs[0];
//Must clear IFrame before clear dialog table, or the script engine will throw an error message
try {
if (oIfrm) {
var oWin = window.frames[oIfrm.id];
if (oWin.DlgClearTimeout) { oWin.execScript("DlgClearTimeout()", "JavaScript"); } //clear timeout or self will be closed
killIt(oIfrm);
}
} catch (ex) { }
killIt(o);
}
} catch (e) { }
}
function dlgShowContents(myContent, width, height) {
var dlg = new DialogInBody("", null, width, height), o;
if (typeof myContent == "string") {
o = newEm("div");
o.innerText = myContent;
dlg.setClient(o);
}
return dlg;
}
function dlgInPlaceShow(sName, sURL, sMethod, aryN, aryV, MyOpener, sCaption, width, height, sPosition, sIFrameAttr, DoRefresh, bNoCloseBtn) {
var MyInrHtml = "", bdy = BDY(), newwin, MyForm, inputs, MyIdx = document.all.length, oDlg;
var sDlgNm = cnstDlgNH + sName;
if (!sMethod) sMethod = "POST";
var myTop = 60;
if (!width) width = "40%"; if (!height) height = toPx(GJT.getWindowHeight() - myTop);
var MyHTML = "<iframe src=\"AboutBlank.htm\" style=\"width:100%;Height:100%;border:0px solid;\" id=\"" + sName + "\" name=\"" + sName + "\" ";
if (sIFrameAttr) MyHTML += sIFrameAttr;
MyHTML += "></iframe>";
oDlg = document.body.children[sDlgNm];

if (!oDlg) {//if not exist in document, create it
var dg = new DialogInBody(sDlgNm, sCaption, width, height); dg.setClient(addE(MyHTML)); oDlg = dg.dlg;
//if (!sPosition) sPosition = "C";
if (sPosition.indexOf("R") > -1) {
cmnMoveObjTo(oDlg, (bdy.scrollLeft + (docOffsetWdt() - oDlg.offsetWidth)), myTop);
} else if (sPosition.indexOf("C") > -1) {
cmnMoveObjTo(oDlg, bdy.scrollLeft + ((docOffsetWdt() - oDlg.offsetWidth) / 2), bdy.scrollTop + ((docOffsetHgt() - oDlg.offsetHeight) / 2));
} else if (sPosition.indexOf("M") > -1) {//beside mouse
showBesideMouse(oDlg, 0, 0);
} else {
cmnMoveObjTo(oDlg, bdy.scrollLeft, myTop);
}
} else if (DoRefresh) {
showIt(oDlg);
} else {
//should be visible,
showIt(oDlg);
newwin = window.frames[sName];
if (newwin.focus) newwin.focus();
return newwin;
}
toZTop(oDlg);
//must use frames collection to get window object of new iframe
newwin = window.frames[sName];
if (aryN != null) { for (var i = 0; i < aryN.length; i++) { MyInrHtml += "<input type=\"hidden\" name=\"" + aryN[i] + "\"></INPUT>"; } }
//try use the new window to submit self,because when there are more than one IFrame with same name (even belong to different parent window)
//IE will submit to the first created IFrame, so it can not make sure form will submit to the correct IFrame object
//Here try to create form in the target IFrame then submit self
var tarBdy = bdy;
try {
if (newwin.document.readyState == "complete") {
if (newwin.document.body) tarBdy = newwin.document.body;
}
} catch (e) { }
MyForm = tarBdy.children["teForm4Submit"];
if (!MyForm) {
tarBdy.insertAdjacentHTML("BeforeEnd", "<form style=\"display:none\" name=\"form_" + sName + "\" id=\"form_" + sName + "\" action=\"" + sURL + "\" method=\"" + sMethod + "\" target=\"" + sName + "\">" + MyInrHtml + "</form>");
MyForm = tarBdy.children["form_" + sName];

} else {
MyForm.action = sURL; MyForm.innerHTML = MyInrHtml; MyForm.method = sMethod;
}
if (tarBdy == bdy) { MyForm.target = sName; } else { MyForm.target = ""; }
if (MyForm == null) { alert("form_" + sName + " not found"); return; }
try {
inputs = MyForm.getElementsByTagName("INPUT");
} catch (e) { MyForm = MyForm[0]; inputs = MyForm.getElementsByTagName("INPUT"); }
if (aryV != null) { for (var i = 0; i < aryN.length; i++) { inputs[i].value = aryV[i]; } }
try { MyForm.submit(); } catch (e) { }
if (tarBdy == bdy) {
if (MyForm.id != "teForm4Submit") { killIt(MyForm); } else { MyForm.innerHTML = ""; }
}
if (newwin) {
if (MyOpener) newwin.opener = MyOpener;
try { newwin.focus(); } catch (e) { }
mDlgWin = newwin;
if (oDlg.rows && oDlg.rows.length) {
var oTR = oDlg.rows[1].cells[1].children[0].rows[0], titleTD = oTR.cells[0];
titleTD.intvId = window.setInterval(function () { dlgInPlaceUpdateTitle(newwin, titleTD); }, 200, "JavaScript");
}
}
return newwin;
}
function docOffsetWdt() {
return document.documentElement.offsetWidth;
}
function docOffsetHgt() {
return document.documentElement.offsetHeight;
}
//Copy to clipboard: ref http://forum.moztw.org/viewtopic.php?p=131407
function teCopyFromUsrDlg() {
var clpData, evt = GJT.event(); //alert(evt.clipboardData);
if (GJT.browserType == BWRT.IE) clpData = window.clipboardData;
else clpData = evt.clipboardData;
if (!clpData) return;
var tblId = "teDlgCopyFromGrid";
var oTbl = document.getElementById(tblId); if (!oTbl) return;
var t = oTbl.getElementsByTagName("TEXTAREA")[0];
if (t && clpData) {
evt.preventDefault();
clpData.setData('text', t.copiedText);
}
killIt(oTbl);
}
function teCopyToClipboard(data) {
cmnEvtSetReturn(false); if (!data) return;
var dv, bdy = BDY(), isdfg = data.nodeName == "#document-fragment", isDom = (isdfg || data.tagName),doc=document;
if (isDom) {
dv = addE("<DIV></DIV>");
dv.appendChild(data);
try {
var range = document.createRange();
range.selectNode(dv);
window.getSelection().removeAllRanges();
window.getSelection().addRange(range);
dv.focus();
try {
if (document.execCommand('copy')) { bdy.removeChild(dv); delete dv; return; }
} catch (err) {
alert(err.Message);
}
window.getSelection().removeAllRanges();
bdy.removeChild(dv);
return alert("Failed to copy HTML objects");
} catch (ex) { }

try {
var rng = bdy.createControlRange(), chn = dv.children;
for (var i = 0; i < chn.length; i++) { rng.add(chn[i]); }
rng.execCommand("Copy");
bdy.removeChild(dv);
return;
} catch (ex) { }
} else { //text contents

try {
dv = addE("<textarea></textarea>");
dv.value = data;
//textarea 直接select,不需要range
dv.select();
try {
if (document.execCommand('copy')) { bdy.removeChild(dv); delete dv; return; }
} catch (err) { }
} catch (ex) { }
if (dv) bdy.removeChild(dv);
try {
window.clipboardData.clearData("Text");
window.clipboardData.setData("Text", data);
return;
} catch (e) { }

}
if (true) {
var tblId = "teDlgCopyFromGrid";
var oTbl = document.getElementById(tblId);
//if not exist in document, create it
if (!oTbl) {
var o = newEm("DIV"); o.innerHTML = "<textarea style=\"width:100%;height:360px;\"></textarea>";
var dg = new DialogInBody(tblId, i18nm.UseCopyMethodOfBrowserToCopyBelowData.text);
dg.setClient(o); oTbl = dg.dlg;
}
if (isDom) {
dg.setClient(dv);
dg.allowSelect = 1;
var range = document.createRange();
range.selectNode(dv);
window.getSelection().removeAllRanges();
window.getSelection().addRange(range);
dg.showMe();
return;
}
MenuShowDo(oTbl);
var t = oTbl.getElementsByTagName("TEXTAREA")[0];
if (t) {
if (t.offsetHeight < 60) t.style.height = "60px";
t.value = data;
t.oncopy = teCopyFromUsrDlg;
t.focus();
t.selectionStart = 0;
t.selectionEnd = data.length;
t.copiedText = data;
}
return;
}
var own = window.open("", "win4Copy", "width=600,height=300,location=0,menubar=0 "), doc = own.document;
var tmp = ["<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\"><html><head>", "<title>",
i18nm.UseCopyMethodOfBrowserToCopyBelowData.text, "</title>"];
for (var i = 0; i < 3; i++) {
var tag = i == 0 ? "LINK" : (i == 1 ? "STYLE" : "META"), ls = document.getElementsByTagName(tag);
for (var j = 0; j < ls.length; j++) {
if (i == 0 && ls[j].href) continue; //href casue Firefox failed to show document
tmp.push(ls[j].outerHTML);
}
}
tmp.push("</head><body oncopy=\"window.close();\">");
if (isDom) tmp.push(dv.outerHTML); else tmp.push("<textarea style=\"width:100%;height:100%\" >", data, "</textarea>");
tmp.push("</body></html>"); doc.write(tmp.join("")); doc.close();
own.focus();
if (own.getSelection) {
if (isDom) {
var s = own.getSelection();
var range = doc.createRange();
range.selectNode(doc.body);
s.addRange(range);
} else {
var tx = doc.body.children[0];
tx.focus();
tx.selectionStart = 0;
tx.selectionEnd = tx.value.length;
}
} else {
var range = own.document.body.createTextRange();
range.moveToElementText(own.document.body);
range.select();
}
}
function selWholeTbl() { var e = GJT.eventSrc(); selectElementContents(getTable(e)); }
function selectElementContents(el, tarTag) {
if (!el) {
el = GJT.eventSrc();
if (tarTag) el = getObjByTagNameBubble(el, tarTag);
}
var body = document.body, range, sel;
if (document.createRange && window.getSelection) {
range = document.createRange();
sel = window.getSelection();
sel.removeAllRanges();
try {
range.selectNodeContents(el);
sel.addRange(range);
} catch (e) {
range.selectNode(el);
sel.addRange(range);
}
} else if (body.createTextRange) {
range = body.createTextRange();
range.moveToElementText(el);
range.select();
}
}
// ***** Utility for table
function tbGetHeads(srcObj) { var oTbl = getTable(srcObj); if (oTbl.rows.length > 0) return oTbl.rows[0].cells; }
function tbGetHeadTD(srcObj) {
if (srcObj == null) return null;
var oTbl = getTable(srcObj);
if (srcObj.tagName == "COL") {
var cols = oTbl.getElementsByTagName("COL");
for (i = 0; i < cols.length; i++) { if (cols[i] == srcObj) return oTbl.rows[0].cells[i]; }
} else {
var MyTD = getTD(srcObj), MyCols = tbGetHeads(oTbl);
if (MyCols.length < MyTD.cellIndex + 1) return oTbl.rows[0].cells[MyTD.cellIndex];
return MyCols[MyTD.cellIndex];
}
}
function tbGetHeadNamesById(srcObj, strFieldIdList) {
var MyHeads = tbGetHeads(srcObj), saFieldId = strFieldIdList.split(","), strRes = [];
for (var i = 0; i < saFieldId.length; i++) {
var MyHead = MyHeads[saFieldId[i]]; if (MyHead != null) strRes[i] = getName(MyHead);
}
return strRes.join(",");
}
function tbGetHeadName(srcObj) { var MyHTD = tbGetHeadTD(srcObj); return getName(MyHTD); }
function tbGetHeadId(srcObj) {
var MyHTD = tbGetHeadTD(srcObj), MyId = MyHTD.id;
if (MyId == null || MyId == "") MyId = MyHTD.cellIndex;
return MyId;
}
function tbGetHeadCaption(srcObj) { var MyHTD = tbGetHeadTD(srcObj); if (MyHTD == null) return null; return teTdGetValue(MyHTD); }
function tbIsFieldsShowed(oTbl, strFieldNames, errMessage) {
var hds = tbGetHeads(oTbl), nmary = strFieldNames.split(","), msg = null, booAllShowed = true;
for (i = 0; i < nmary.length; i++) {
var MyHd = hds[nmary[i]];
if (MyHd == null) {
if (msg == null) { msg = nmary[i]; } else { msg += "," + nmary[i]; }
booAllShowed = false;
}
}
if (!booAllShowed && errMessage != null) alert(errMessage + "\n" + msg + "\n" + i18nm.FldsNotShowed.text);
return booAllShowed;
}

function tbSetRowColor(srcObj, rowB, rowE, RowStep, RowColor) {
var tbdy = getTBody(getTable(srcObj)); if (tbdy == null) return;
var rws = tbdy.rows, rl = rws.length, cr, st;
if (rowE <= rowB) rowE = rl - 1;
if (rowE >= rl) rowE = rl - 1;
for (var rr = rowB; rr <= rowE; rr++) {
if ((rr - rowB + 1) % RowStep == 0) cr = RowColor; else cr = "";
st = rws[rr].style;
if (st.backgroundColor != cr) {st.backgroundColor = cr;}
}
}
function tbRowMoveRows(oTbl, tarRowIndex, aTR) {
if (aTR == null) return; mbooMovingRC = true; var s = 0, r, rl = oTbl.rows.length;
if (tarRowIndex >= rl) return;
for (var i = 0; i < aTR.length; i++) {
r = aTR[i].rowIndex;
try {
oTbl.moveRow(r, tarRowIndex + s);
} catch (e) {
var opn = aTR[i].parentNode;
var tarTR = oTbl.rows[tarRowIndex + s];
if (tarTR.rowIndex > r) { if (tarTR.rowIndex < oTbl.rows.length - 1) tarTR = tarTR.nextSibling; else tarTR = null; }
if (tarTR) opn.insertBefore(aTR[i], tarTR); else opn.appendChild(aTR[i]);
}
if (r >= tarRowIndex) s += 1;
}
}
function getValueFromTD(oTD) {
var v = getAtr(oTD, "value", null);
if (!v) {
var chrn = oTD.children;
for (var i = 0; i < chrn.length; i++) {
v = chrn[i].checked;
if (v != undefined) return v;
v = chrn[i].value;
if (v != undefined) return v;
}
}
return v
}

function setOuterHTML(oriObj, newHTML) {
var idx = 0, par = oriObj.parentNode, chrn = par.children;
for (var i = 0; i < chrn.length; i++) { if (chrn[i] == oriObj) { idx = i; break; } }
oriObj.outerHTML = newHTML
return par.children[idx];
}
window.mobilecheck = function () {
var check = false;
(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
return check;
}
var mEditBox, mEditTD, mContentCopied, mResizing = false, mbooMovingRC = false, mbModifyAllSel = false; //mSel,
var mHintTextLenInfo; //used to hint characters count in a cell or a textbox,format: Array(Array(ColumnId,LimitedLength), Array(ColumnId,LimitedLength))
var mTimeoutIdForHintTestLen;
var mContentHTMLCopied;
var msBgClrHiLi = "HIGHLIGHT", msClrHiLi = "#FFFFFF"; msClrHiLi = "highlighttext";

var moValSelReceiver;
var C_AtrPfxKey = "karpx_", mintRecordIdCnt = 0;
var mevtValueSelectGet = null;
var mevtLayoutChanged = null;
var sUA = navigator.userAgent;
var mbooHintNotSaved = true, mIsMobileDev = sUA.indexOf("Mobile") > -1 || sUA.indexOf("Android") > -1 || sUA.indexOf("iPhone") > -1 || sUA.indexOf("iPod") > -1 || sUA.indexOf("iPad") > -1 || !!sUA.match(/AppleWebKit.*Mobile.*/);
//mIsMobileDev=true;
var mPageConfig = 0;
function teOnBodyResize() {
teRevFltPosition();
teResizeMx();
if (PROG.lyoDispatcher) {
PROG.lyoDispatcher.resizeLYO();
}
if (mevtLayoutChanged) eval(mevtLayoutChanged + "()");
}
function teBodyOnActivate() {
if (GJT.eventSrc().tagName == "BODY") {
}
}
function teBodySelectStart() {
if (GJT.isDraging) {
document.body.style.MozUserSelect = 'none';
return false;
// return cmnEvtSetReturn();//return false;
} else {
document.body.style.MozUserSelect = '';
}
}
function teResizeMx() {
if (PROG.lyoDispatcher) return;
var chn = PROG.children;
for (var i = 0; i < chn.length; i++) {
if (chn[i].resizeMx) chn[i].resizeMx();
}
}
function floatBarsHeight() {
var fps = PROG.floatPanels, t = 0;
if (!fps) return 0;
for (var i = 0; i < fps.length; i++) {
t+=fps[i].offsetHeight;
//t += getActHgt(fps[i]);
}
return t;
}
function teTopForDlg() {
var mt = floatBarsHeight();
if (!mt) mt = GJT.getComputedStyle(BDY()).marginTop;
return parseIntD(mt,0);
}
function teRevFltPosition() {
//避免設定body的margin 列印時會走鐘
var fh =floatBarsHeight(), b = BDY(), o = b.children[0];
if (!o || !fh) return;
if (o.className != "pnl4TopMargin") {
o = newEm("div");
b.insertBefore(o, b.children[0]);
o.className = "pnl4TopMargin";
}
o.style.height = toPx(fh - 0);
}
teIniBody();
function teHtm() { return document.getElementsByTagName("HTML")[0]; }
function teIniBody() {
if (document.readyState != "complete") return window.setTimeout("teIniBody();", 100);
var bdy = BDY(), htm = teHtm();
GJT.eventAddHandle(htm, "click", MenuHideChk);
GJT.eventAddHandle(bdy, "keyup", teBodyOnKeyup);
dph = mainEventDispatch;
//Chrome 非可鍵盤輸入的物件不會自己觸發鍵盤事件,只會從BODY觸發,
GJT.eventAddHandle(bdy, "keydown", dph); GJT.eventAddHandle(bdy, "keyup", dph); GJT.eventAddHandle(bdy, "keypress", dph);
if (mBrowserType == BWRT.FIREFOX) GJT.eventAddHandle(bdy, "contextmenu", dph);
}
function teBodyOnKeyup() {
var chrCode = GJT.eventKeyCode();
if (chrCode == 27) MenuHide();
}
function teStartProgram() {
if (document.readyState != "complete") return window.setTimeout("teStartProgram();", 50);
teStartProgramDo();
}
function teStartProgramDo() {
var odt = new Date(), bdy = BDY(), pageCfg, dph = mainEventDispatch;
//teHtm().ondrop = function (ev) { if (ev.preventDefault) ev.preventDefault(); };
//teHtm().ondragover = function (ev) { if (ev.preventDefault) ev.preventDefault(); };
//Chrome 不是可以使用鍵盤輸入的物件不會自己觸發鍵盤事件,只會從BODY觸發,
mPageConfig = getAtr(bdy, KW.PageConfig, mPageConfig);
var usrCpt = getAtr(bdy, KW.UserCaption, "");
bdy.onbeforeunload = teStopProgram, bdy.onunload = teEndProgram; //bdy.onclick = MenuHide;
bdy.onactivate = teBodyOnActivate; bdy.onresize = teOnBodyResize;
document.onselectstart = teBodySelectStart;
var lyScales = getAtr(bdy, "lyoscales"), tabctr, nch;
if (lyScales && lyScales.length > 0) {
try {
var map = JSON.parse(lyScales); lyScales = map;
if (hasBit(map.options, GJT.LayoutOperOptions.Disabled)) lyScales = null;//停用就清除
}
catch (ex) { }
}
var oPar = window.parent,
valSelFld = teValueFields(), chi = PROG.children, chiTab = new OpItems();
teCreateOpItems(document.body, chiTab, PROG);
for (var i = chiTab.length - 1; i >= 0; i--) {
var te = chiTab[i];
if (hasBit(te._dspOptions, GJT.DSO.ShowInFloatDialog)) {
//設定到Dialog物件
chiTab.remove(te);
var cn = new GridValueSelector(te, null, te.text, null,null,800);
te._myDialog = cn;
cn.showMe(true);//Hidden
}
}
if (PROG.bfrStartProgram) PROG.bfrStartProgram();
if (!hasBit(mPageConfig, PGC.NoToolbar)) {
var pnl = newEm("DIV"); pnl.className = "teTopPanel"; // addE("<div class='teTopPanel' />");
bdy.insertBefore(pnl, bdy.children[0]);
PROG.floatPanels = [pnl];
var st = pnl.style; st.top = "0px"; st.zIndex = 10000; st = bdy.style;
var itms = new OpItems(), sc = CMDE;
if (chiTab.length) sysCmdAdd(itms, [sc.mnuFile, sc.mnuEdit, sc.mnuView, sc.SpecialTool], true);
sysCmdAdd(itms, [sc.Start], true);
//sysCmdAdd(itms, c.ExtendSel);
sysCmd(sc.Start).onclick = tlStart;
var itmUsr = new OpItem("user", usrCpt);
itmUsr.onclick = cmnLogout;
itms.add(itmUsr);

var tl = new teToolbar(pnl, itms);
tl.onclick = SysToolbarClick;
if (chiTab.length > 1 && !lyScales) {
tabctr = new teTabsCtrl(pnl, chiTab, null, PROG, null);
tabctr.hintActive = lyScales;
PROG.tabCtrl = tabctr;
}
if (tabctr) { showItA(chiTab[0], false); showItA(chiTab[0], true); }
} else {
if (mainGrid) mainGrid.addToolBarButton(i18nm.tlOpenPage.text, tlStart);
}
floatHeaderAll(chiTab);
if (chiTab.length > 0) teSetPageUiByUsrSetting();
if (lyScales) {
var lyo = new layoutDispatcher(lyScales, document.body, chiTab, getAtr(bdy, "lyoscalesUsr"));
PROG.lyoDispatcher = lyo;
lyo.onScalesChanged = teLayoutScalesChanged;
}
teOnBodyResize();
if (tabctr) {
if (tabctr.splitMode != null) tabctr.switchSplitMode(1);
tabctr.hndSplit = progTabSplit; //later set to prevent save profile
if (PROG.activeItem) tabctr.setActiveItem(PROG.activeItem);
else tabctr.setActiveItem(chiTab[0]);
}
//teOnBodyResize();
if (PROG.aftStartProgram) PROG.aftStartProgram();
//if (navigator.geolocation) navigator.geolocation.getCurrentPosition(geoSuccessHandler);
}
function floatHeaderAll(cc) {
  for (var i = 0; i < cc.length; i++) {
    if (cc[i].floatHeader) cc[i].floatHeader(1);
    else if (cc[i].children) { floatHeaderAll(cc[i].children); }
  }
}
function geoSuccessHandler(position)
{
//alert(position);
}
function teLayoutScalesChanged(lyo) {
teSaveUserSetting(null, "lyoScales", lyo.mapText());
}
function getViewsOpRelas(tar, channel) {
var txtXml = teBpcSync("GetPageViewsRela", tar, null, [{ name: "Channel", value: channel}]);
if (!txtXml) return [];
else return vwXmlToRela(txtXml);
}
function saveTreeViewDesign(res, tar, channel) {
var param = [{ name: "tvst", value: res }, { name: "Channel", value: channel}];
teBpcSync("UpTreeViewDesign", tar, null, param);
}
function previewTreeViewDesign(rls) {
//teSetupForExpandRela(rls);
}
function saveViewRelaDesign(res, tar, channel) {
var txt = vwRelaToXml(res);
param = [{ name: "pgRela", value: txt }, { name: "Channel", value: channel}];
teBpcSync("UpPageViewsRela", tar, null, param);
}
function previewViewRelaDesign(rls) {
teSetupForExpandRela(rls);
}
function teSetupForExpandRela(rls) {
var chn = PROG.children.getAll();
if (!rls) { rls = PROG.relations; }
else {
chn = []; //收集兩端物件
for (var i = 0; i < rls.length; i++) {
if (!chn.contains(rls[i].from)) chn.push(rls[i].from);
if (!chn.contains(rls[i].to)) chn.push(rls[i].to);
}
}
if (!rls) return;
for (var i = 0; i < rls.length; i++) {
var r = rls[i];
r.subRela = null;
if (r.relaAssm) {
r.subRela = [];
var aa = r.relaAssm.split(",");
for (var h = 0; h < aa.length; h++) {
for (var k = 0; k < rls.length; k++) {
if (rls[k].name == aa[h] && !hasBit(rls[k].linkMode, GLC.Disabled)) {
r.subRela.push(rls[k]);
}
}
}
}
}
for (var h = 0; h < chn.length; h++) {
var m = chn[h];
delete m.syncRs; delete m.relaF; delete m.relaT; delete m.relaNR; delete m.relaAfS; delete m.relaFAdv; delete m.relaTAdv; delete m.relaFA;//expand after save
delete m.aftQRs;//查詢或更新資料之後展開
var abr = [m.ToolBar, m.StatusBar];
for (var i = 0; i < 2;i++){
if (abr[i]) { killThem(getAllByClass(abr[i], "Expand")); killIt(getEmByClass(abr[i], "ExpandAdv")); killThem(getAllByClass(abr[i], "ExpandRvs")); killIt(getEmByClass(abr[i], "ExpandRvsAdv")); killIt(getEmByClass(abr[i], "ExpandAll")); }
}
for (var i = 0; i < rls.length; i++) {
var r = rls[i], lm = r.linkMode;
if (hasBit(lm, GLC.Disabled)) continue;
if (r.from == m) {
if (hasBit(lm, GLC.KeepSync)) {//only for from side
if (!m.syncRs) m.syncRs = [];
m.syncRs.push(r);
}
if (hasBit(lm, GLC.DblClickToShow)) {//only for from side
if (!m.dblckcRs) m.dblckcRs = [];
m.dblckcRs.push(r);
}
if (hasBit(lm, GLC.AutoShowAfterSave)) {//only for from side
if (!m.relaAfS) m.relaAfS = [];
m.relaAfS.push(r);
}
if (!m.relaF) m.relaF = [];
m.relaF.push(r);
if (!hasBit(lm, GLC.ForAddNewRelativeRow) && !hasBit(lm, GLC.ForModifyRelative) && !(r.to.getQryParamtersUIO && r.to.getQryParamtersUIO())) {
if (!m.relaFAdv) m.relaFAdv = [];
m.relaFAdv.push(r);
}
if (!hasBit(lm, GLC.NoExpandAll)) {
if (!m.relaFA) m.relaFA = [];
m.relaFA.push(r);
}
if (hasBit(lm, GLC.ExpandAfterQuery)) {
if (!m.aftQRs) m.aftQRs = [];
m.aftQRs.push(r);
}
}
if (r.to == m) {
if (hasBit(lm, GLC.SetLinkForNewRow)) {
if (!m.relaNR) m.relaNR = [];
m.relaNR.push(r);
}
if (!hasBit(lm, GLC.OneWayLink) && !hasBit(lm, GLC.ForAddNewRelativeRow) && !hasBit(lm, GLC.ForModifyRelative)) {
if (!m.relaT) m.relaT = [];
m.relaT.push(r);
}
}
}
if (m.relaF) {
if (m.addToolBarButton) {
var cptn = i18nm.tlExpandRela.text, tip = i18nm.tlExpandRela.tip, ExBtn = 0, o, r;
for (var j = 0; j < m.relaF.length; j++) {
r =m.relaF[j];
if (!hasBit(r.linkMode, GLC.CaptionExclusive)) continue;
var cptn1 = r.text, tip1, cpto = PROG.getTextO(r.textName);
if (cpto) cptn1 = cpto.text ;
if (!cptn1) cptn1 = r.to.text;
ExBtn++;
if (cpto && cpto.tip) tip1 = cpto.tip; else tip1 = r.tip;
if (!tip1) {
tip1 = r.noteX;//不得已使用IT 備註資料時
if (tip1.indexOf("\n") >= 0) tip1 = tip1.substring(0, tip1.indexOf("\n"));//tip 只取一行，其餘的是作為設計人員自己的備註
}
if (!tip1) tip1 = tip + "(" + cptn1 + ")";
o = m.addToolBarButton(NIT("expQry" + j, cptn1, tip1)); o.className = "Expand";
o._surRela = r;
if (r.styleForButton) o.style.cssText = o.style.cssText + ";" + r.styleForButton;
}
if (ExBtn != m.relaF.length) { o = m.addToolBarButton(NIT("expQry", cptn, tip)); o.className = "Expand"; }
if (m.relaFAdv) { o = m.addToolBarButton(NIT("expQryAdv", " ")); o.className = "ExpandAdv"; }
if (m.relaFA && m.relaFA.length > 1) { o = m.addToolBarButton(NIT("expQryAll", i18nm.ExpandAll.text)); o.className = "ExpandAll";}
}
}
if (m.relaT) {
if (m.addToolBarButton) {
var cptn = i18nm.ExpandRelaRvs.text, tip = i18nm.ExpandRelaRvs.tip, ExBtn = 0, o, r;
for (var j = 0; j < m.relaT.length; j++) {
r = m.relaT[j];
if (!hasBit(r.linkMode, GLC.CaptionExclusive)) continue;
var cptn1 = r.textRev, tip1 = r.noteX, cpto = PROG.getTextO(r.textNameRev);
if (cpto) cptn1 = cpto.text;
if (!cptn1) cptn1 = r.from.text;
if (cpto && cpto.tip) tip1 = cpto.tip;
if (!tip1) tip1 = tip + "(" + cptn1 + ")";
ExBtn++;
if (tip1.indexOf("\n") >= 0) tip1 = tip1.substring(0, tip1.indexOf("\n"));
o = m.addToolBarButton(NIT("expQryRvs" + j, cptn1, tip1)); o.className = "ExpandRvs";
o._surRela = r;
if (r.styleForButton) o.style.cssText = o.style.cssText + ";" + r.styleForButton;
}
if (ExBtn != m.relaT.length) { o = m.addToolBarButton(NIT("expQryRvs", cptn, tip)); o.className = "ExpandRvs"; }
var o = m.addToolBarButton(NIT("expQryRvsAdv", " ")); o.className = "ExpandRvsAdv";
}
}
}
}
function teSetPageUiByUsrSetting() {
var txt, chn = PROG.children, nd = teBpcSync("GetPageAllSetting");
if (!nd) return;
txt = xGetAtr(nd, "pageLyo");
if (txt) GJT.chgPageLayout(txt);
txt = xGetAtr(nd, "vwsRela");
if (txt) { PROG.relations = vwXmlToRela(txt); PROG.relationsTxt = txt; }
teSetupForExpandRela();
txt = xGetAtr(nd, "usrSetting");
if (txt) {
var doc = GJT.xmlDocument();
txt = GJT.xmlc4s(txt);
doc.loadXML(txt);
try {
for (var i = 0; i < chn.length; i++) {
var c = chn[i], id = c.id, em = doc.getElementsByTagName(id)[0];
if (!em) continue;
var reclyo = xGetAtr(nd, "lyotxt" + id), qryPrmLyo = xGetAtr(nd, "qplyotxt" + id), sf = xGetAtr(em, "shwRecForm"), sm = xGetAtr(em, "recSplitMode"), fqd = xGetAtr(em, "flds4QDlg");
if (sf == "Y" && c.showRecordForm) c.showRecordForm(0, sm, reclyo);
if (fqd) c.flds4QDlg = fqd;
if (qryPrmLyo) c.rvsQryPrmLyo(qryPrmLyo);
}
} catch (ex) { }
}
}
function teSavePageUiUsrSetting() {
var txt = teBpcSync("getUserPageSetting");
if (!txt) return;
txt = GJT.xmlc4s(txt);
var doc = GJT.xmlDocument(), chn = PROG.children, idx = txt.indexOf("?>");
doc.loadXML(txt);
try {
for (var i = 0; i < chn.length; i++) {
var c = chn[i], id = c.id, em = doc.getElementsByTagName(id)[0], so = c._recForm, tb = m._recTabs;
if (!em) continue;
setAtr(em, "shwRecForm", (!so || isHidden(tb) ? "N" : "Y"));
setAtr(em, "recSplitMode", tb ? tb.splitMode : "");
}
} catch (ex) { }
}
function teStopProgram() {
if (!mbooHintNotSaved) return;
var a = PROG.children.getAll(), trs, tbc = PROG.tabCtrl, txt = "";
for (var i = 0; i < a.length; i++) {
var trs = (a[i].getTRsNeedSave) ? a[i].getTRsNeedSave(null,1) : null;
if (trs && trs.length) {
txt = txt + a[i].text + " : " + i18nm.ShwDataNotSavedAsk.text + "\n";
}
}
if (tbc) {
var s = tbc.splitMode, t = tbc.activeItem;
//teSaveUserSetting(null,["splitMode","activeItem"],[s,t.name], 0, 0);
}
if (txt) return txt;
}
function teEndProgram() {
var chrn = PROG.children;
for (var i = 0; i < chrn.length; i++) {
if (chrn[i].grid) delete chrn[i].grid;
}
}
function teHotQryPasteItems(tarObj, NoPaste) {
var sStr;
try { sStr = window.clipboardData.getData("Text"); } catch (ex) { } //Most browser do not suport window.clipboardData
if (sStr == null) return false;
if (tarObj == null) return alert("Please select target textbox before this action!");
var oChk = GJT.getChildById(getTable(tarObj), "chkhqCRS");
var booCRS = true;
if (oChk) booCRS = oChk.checked;
//i18nm.TooMuchItemsForQueryAsk.text
if (sStr.indexOf("\n") > -1 || sStr.indexOf(",") > -1) {
sStr = sStr.replace(/\n/gi, ",");
sStr = sStr.replace(new RegExp(String.fromCharCode(13), "gi"), "");
while (sStr.indexOf(",,") > -1) { sStr = sStr.replace(new RegExp(",,", "gi"), ","); }
// 12:43 2007/6/13 Paul:Do not right trim,
if (booCRS) {
while (sStr.indexOf(" ,") > -1) { sStr = sStr.replace(new RegExp(" ,", "gi"), ","); }
if (sStr.substring(sStr.length - 1, sStr.length) == " ") sStr = sStr.substring(0, sStr.length - 1);
}
if (sStr.substring(sStr.length - 1, sStr.length) == ",") sStr = sStr.substring(0, sStr.length - 1);
var sa = sStr.split(",");
if (sa.length > 10000) {
var newLimit = window.prompt(i18nm.TooMuchItemsForQueryAsk.text.replace("%1", sa.length).replace("%2", "10000"), 10000);
if (newLimit) { if (sa.length > newLimit) sa.length = newLimit; } else { return; }
sStr = sa.join(",");
}
window.clipboardData.clearData("Text");
window.clipboardData.setData("Text", sStr);
}
if (NoPaste) return true;
var txtrng = tarObj.createTextRange();
//*** Never call txtrng.execCommand("Paste"), it causes event onpaste fired
//txtrng.execCommand("Paste");
txtrng.text = sStr;
cmnEvtSetReturn(false);
return true;
}
var mObjAfterPaste = null;
function teHotQryAfterPaste() {
if (!mObjAfterPaste) return;
var sStr = mObjAfterPaste.value; //alert(sStr.indexOf("\n"));
if (sStr.indexOf("\n") > -1 || sStr.indexOf(",") > -1) {
var txtrng = document.selection.createRange();
sStr = sStr.replace(new RegExp("\n", "gi"), ",");
sStr = sStr.replace(new RegExp(String.fromCharCode(13), "gi"), "");
while (sStr.indexOf(",,") > -1) { sStr = sStr.replace(new RegExp(",,", "gi"), ","); }
while (sStr.indexOf(" ,") > -1) { sStr = sStr.replace(new RegExp(" ,", "gi"), ","); }
if (sStr.substring(sStr.length - 1, sStr.length) == ",") sStr = sStr.substring(0, sStr.length - 1);
var sa = sStr.split(",");
if (sa.length > 10000) {
alert("Too much items for query(" + sa.length + "), only first 10000 will be used");
sa.length = 10000;
sStr = sa.join(",");
}
mObjAfterPaste.value = sStr;
}
}
function teHotQryOnPaste() {
var tarObj = GJT.eventSrc(), clpData;
var evt = GJT.event(); GJT.stopBubble();
if (GJT.browserType == BWRT.IE) clpData = window.clipboardData;
else clpData = evt.clipboardData;
if (!clpData) {
if (teHotQryPasteItems(tarObj, true)) return true;
mObjAfterPaste = tarObj;
window.setTimeout("teHotQryAfterPaste();", 100); //Most of browsers do not suport clipboard, use timer
return;
}
var sStr = clpData.getData("Text"); if (sStr == null) return;
if (sStr.indexOf("\n") > -1 || sStr.indexOf(",") > -1) {
sStr = sStr.replace(new RegExp("\n", "gi"), ",");
sStr = sStr.replace(new RegExp(String.fromCharCode(13), "gi"), "");
while (sStr.indexOf(",,") > -1) { sStr = sStr.replace(new RegExp(",,", "gi"), ","); }
while (sStr.indexOf(" ,") > -1) { sStr = sStr.replace(new RegExp(" ,", "gi"), ","); }
if (sStr.substring(sStr.length - 1, sStr.length) == ",") sStr = sStr.substring(0, sStr.length - 1);
var sa = sStr.split(","), sn = [];
for (var i = 0, k = sa.length; i < k; i++) {
if (!sn.contains(sa[i])) sn.push(sa[i]);
}
sa = sn; sStr = sa.join(",");
if (sa.length > 10000) {
alert("Too much items for query(" + sa.length + "), only first 10000 will be used");
sa.length = 10000;
sStr = sa.join(",");
}
//just set back to clipboard is a better method, user can decide the past position
if (GJT.isFollowW3C) {
tarObj.value = sStr;
evt.preventDefault();
}
else if (GJT.browserType == BWRT.IE) {
tarObj.value = sStr;
evt.returnValue = false;
} else {
tarObj.value = sStr;
evt.preventDefault();
}
}
}
function teGetTable(obj) { var o = getTable(obj); if (o == null) return; while (o != null || getAtr(o, KW.ViewName) == null) { obj = o.parentNode; o = getTable(obj); } return o; }
function teGetTableByName(tnm) { var ats = teGetAllTables(); for (var i = 0; i < ats.length; i++) { if (tnm == ats[i].id) return ats[i]; } }
function teGetChildTable(container) {
var ats = teGetAllTables(container);
if (ats.length > 0) return ats[0];
}
function teGetAllTables(container) {
if (!container) container = document;
var ats = [], b = container.getElementsByTagName("TABLE");
for (var i = 0; i < b.length; i++) { if (getAtr(b[i], KW.ViewName, "") != "") ats[ats.length] = b[i]; }
return ats;
}
function teGetTreeViewEm(container) {
if (!container) container = document;
var ats = [], b = container.getElementsByTagName("DIV");
for (var i = 0; i < b.length; i++) { if (getAtr(b[i], "isTreeView")) ats.push(b[i]); }
return ats;
}
function teItemCreated(b,chiTab){for(var i=0;i<chiTab.length;i++){if (chiTab[i].id == getAtr(b,"id")) return 1;}}
function teCreateOpItems(c, chiTab, parent) {
var b = c.children;
for (var i = 0; i < b.length; i++) {
var te = null, dspoptn = Number(getAtr(b[i], "dspoptn", "0"));
if (getAtr(b[i], KW.ViewName, "") != "") {
if (teItemCreated(b[i], chiTab)) continue;
te = teCreateGrid(b[i]); te.parent = parent;
if (parent != PROG) PROG.children.remove(te);
chiTab.add(te);
}
else if (getAtr(b[i], "isTreeView", "")) {
if (teItemCreated(b[i], chiTab)) continue;
te = new opTreeView(b[i], 22, 20); te.parent = parent;
chiTab.add(te);
}
else {
var dst = getAtr(b[i], "dsptype", "");
if (dst == "tabstrip") {
te = new opTabStrip(b[i]); te.parent = parent; if (parent.children) parent.children.add(te);
chiTab.add(te);
} else if (dst == "frame") {
te = new opTabStrip(b[i], "frame", dspoptn); te.parent = parent; if(parent.children) parent.children.add(te);
chiTab.add(te);
} else if (dst == "listbox") {
te = new opListBox(b[i]); te.parent = parent;
chiTab.add(te);
}
else if (dst == "div") {
te = new opComponent(b[i]); te.parent = parent;
chiTab.add(te);
}
else if ((b[i].tagName == "IFRAME")) { //不可以直接判斷tag = DIV 就建立元件,因為一堆不同類型的物件的容器都是DIV
b[i].style.border = "0px"; b[i].style.width = "100%"; b[i].style.height = toPx(GJT.getWindowHeight() - 32);
te = new opComponent(b[i]);
te.parent = parent;
chiTab.add(te);
var tarSrc = getAtr(b[i], "tarSrc");
if (tarSrc) {
//延遲顯示
var tarO = b[i];
window.setTimeout(function () { tarO.src = tarSrc }, 1000);
}
}
else chiTab = teCreateOpItems(b[i], chiTab, parent);
}
if (te) {
te._dspOptions = dspoptn;
}
}
return chiTab;
}
function teCreateGrid(oTbl){
var objNm = getAtr(oTbl, KW.ObjectName);
var te = new GridEdit(oTbl, oTbl.rows.length > 0 ? TBM.standard : TBM.withStatusBar | TBM.statusBarOnTop | TBM.noButtonBar, null, msAjaxPageName),
cg = te.gridContainer, sg = cg.style, sc = te.container.style, sa = te.container.parentNode.style, se = oTbl.style;
te.hideColumnsUser(); sg.position = "relative";
sc.overflow = "visible"; sc.overflowX = "visible"; sc.overflowY = "visible";
sg.overflowX = "visible"; sg.overflowY = "visible";
if (!(te.opst && te.opst.rowscsp)) te.setRowColor(5);
oTbl.oriBgC = se.backgroundColor;
oTbl.oriC = se.color;
return te;
}
function cmnHintTxtLen(myText, lenLimit, refObj) {
var o = BDY().children["ohltbl"];
if (!myText) { return hideIt(o); }
var txtH = myText.substring(0, lenLimit);
if (!o) o = addE("<table ID='ohltbl' style='POSITION:;' border=1 cellspacing=0 cellpadding=0><tr><td nowrap BGCOLOR=#FFDDEE></td><td NOWRAP BGCOLOR='lightyellow'></td><td BGCOLOR='#FFFF00'></td><td BGCOLOR=#0099FF><input type=checkbox onclick=\"cmnSwitchFloatType()\" /></td></tr></table>");
var numMsg = "";
if (txtH.length > 0) numMsg += txtH.length;
o.rows[0].cells[1].innerText = txtH;
if (txtH != myText) {
o.rows[0].cells[2].innerText = myText.substring(lenLimit);
numMsg += "+" + teTdGetValue(o.rows[0].cells[2]).length;
numMsg += "=" + myText.length;
} else { o.rows[0].cells[2].innerText = ""; }
o.rows[0].cells[0].innerText = numMsg;
if (o.style.position == "absolute") showBeside(o, refObj, -refObj.offsetWidth + 60, refObj.offsetHeight);
showIt(o);
}
function teHintTextLenAutoSet() {
if (mHintTextLenInfo) {
if (mTimeoutIdForHintTestLen) window.clearTimeout(mTimeoutIdForHintTestLen);
mTimeoutIdForHintTestLen = window.setTimeout("teHintTextLenAuto()", 100);
}
}
function teHintTextLenDo(su, LenLimit) {
if (!su) return cmnHintTxtLen("");
var v;
if (su.tagName == "INPUT") v = su.value; else v = teTdGetValue(su.innerText);
return cmnHintTxtLen(v, LenLimit, su);
}
function tegMenuHide() { MenuHide(); }

function teIsInResizeArea(oTD, oTR) {

var MyPos, MyDim, ev = GJT.event();
if (oTR == null) { MyPos = evtOffsetY(ev); MyDim = oTD.offsetHeight; } else { MyPos = evtOffsetX(ev); MyDim = oTD.offsetWidth; }
res = ((MyDim - MyPos) > 0 && (MyDim - MyPos) < 5);
return res;
}
function teSelSetValue(MyVal, bKeepFormat, bInclHidden) {
var m = GJT.activeItem; if (!m) return;
if (m instanceof GridEdit) {
return m.setClipText(null, MyVal, true, true);
}
}
function teSelGetTbl() {
return;
if (mSel != null) return getTable(mSel[0]);
}

function teGetCOL(oTD) {
var oTbl = getTable(oTD), ci = oTD.cellIndex, MyCOLS = oTbl.getElementsByTagName("COL");

if (MyCOLS.length > ci) return MyCOLS[ci];
}
function teGetNextRowId(srcObj) {
var oTbl = getTable(srcObj), rws = oTbl.rows, maxId = getAtr(oTbl, KW.NextRowNo, 0);
if (maxId <= 0) {
for (var r = 1, k = rws.length; r < k; r++) {
if (rws[r].cells.length == 0) continue;
var i = parseInt(teTdGetValue(rws[r].cells[0]), 10);
if (!isNaN(i)) { if (maxId < i) maxId = i; }
}
maxId++;
setAtr(oTbl, KW.NextRowNo, maxId);
}
return parseInt(maxId, 10);
}
function teGetFldNamesById(oTR, idList, bRes) {
var oTbl = getTable(oTR), MyHeads = tbGetHeads(oTbl), aryItms;
var saId = idList.split(","), saRes = new Array(saId.length);
for (var i = 0; i < saId.length; i++) {
var MyHead = MyHeads[saId[i]];
if (MyHead != null) { saRes[i] = getName(MyHead); } else {
if (!aryItms) aryItms = teGetAllFlds(oTbl);
for (var j = 0; j < aryItms.length; j++) {
var nnm = GetItmNameByAry(aryItms[j]);
if (nnm == saId[i]) { saRes[i] = GetItmFieldNameByAry(aryItms[j]); break; }
}
}
if (bRes && !saRes[i]) saRes[i] = saId[i];
}
return saRes.join(",");
}
function teIsBodyActive() { if (document.activeElement != null) return document.activeElement.tagName == "BODY"; }
function teBeforePaste() { cmnEvtSetReturn(false); }
function teCmnGetAtr(atrNm, dftValue, tarWin) {
if (tarWin == null) tarWin = self;
var oCmn = tarWin.document.body.children[KW.CommonInfo];
if (oCmn == null) return dftValue;
return getAtr(oCmn, atrNm, dftValue);
}
function teCmnSetAtr(atrNm, Val, tarWin) {
if (tarWin == null) tarWin = self; setAtr(tarWin.document.body.children[KW.CommonInfo], atrNm, Val);
}
function teSetAsOld(oTR) { setAtr(oTR, KW.PtyNameRecordState, "1"); }
function teRowSetAsNewRow(oTR) { setAtr(oTR, KW.PtyNameRecordState, ""); }
function teRowIsNewRecord(oTR) { return (getAtr(oTR, KW.PtyNameRecordState, "") != "1") }
function teShowRows(srcObj) {
var oTbl = getTable(srcObj); if (oTbl == null || oTbl.rows.length < 1) return;
var oTD = oTbl.rows[0].cells[0], rl = oTbl.rows.length - teGetFstRowT(oTbl);
if (oTD.children.length > 0) { oTD.children[0].innerText = rl; } else { oTD.innerText = rl; }
oTD.title = rl + " records";
}

function teTrGetValueById(oTbl, sfId, oTR) {
if (oTR == null) return; if (oTbl == null) oTbl = getTable(oTR);
var hds = tbGetHeads(oTbl), hd = hds[sfId];
if (hd == null) return getAtr(oTR, teAtrFldNm(sfId));
var oTD = oTR.cells[hd.cellIndex]; if (oTD == null) return;
return teTdGetValue(oTD);
}
function teTrGetOriginalValueById(oTR, sfId, forN) {
if (oTR == null) return;
var oTbl = getTable(oTR), hds = tbGetHeads(oTbl), hd = hds[sfId], v;
if (hd == null) {
if (hasAtr(oTR, teAtrFldNm4OrigVal(sfId))) v = getAtr(oTR, teAtrFldNm4OrigVal(sfId)); else v = getAtr(oTR, teAtrFldNm(sfId));
} else {
var atNm = (forN ? KW.PtyOrigValueN : KW.PtyOrigValue), oTD = oTR.cells[hd.cellIndex]; if (oTD == null) return;
if (hasAtr(oTD, atNm)) v = getAtr(oTD, atNm); else v = teTdGetValue(oTD);
}
return v;
}

function teGetColAttribute(srcObj) { return teGetColAttributeDo(tbGetHeadTD(srcObj)); }
function teGetColAttributeDo(myHD) { if (myHD == null) return GIA.WriteDenied; var opAttr = getAtr(myHD, KW.opAttr); if (opAttr == null) opAttr = 0; return parseInt(opAttr); }
function teGetOpSettingValue(srcObj, Index, defaultValue) { return getAtr(getTable(srcObj), Index, defaultValue); }
function teGetFstColT(oTbl) { return parseInt(getAtr(oTbl, KW.FirstDataColumn, 1)); }
function teGetFstRowT(oTbl) { return parseInt(getAtr(oTbl, KW.FirstDataRow, 1)); }
function teTdGetValue(oTD, getHtml) {
if (getHtml) return teTdGetValueHTML(oTD);
if (!oTD) return;
var MyText = oTD.innerText;
if (MyText == " ") MyText = "";
else {
var ixt = MyText.lastIndexOf("\t");
if (ixt == MyText.length - 1) MyText = MyText.substring(0, ixt);
}
return MyText;
}
function teTdGetValueHTML(oTD) { var MyText = oTD.innerHTML; if (MyText == " ") MyText = ""; return MyText; }
function teAtrFldAry(oTbl) { var a = getAtr(oTbl, KW.attrFields); if (a == null) return; return a.split(","); }
function teIsAtrFld(oTbl, nm) { var b = teAtrFldAry(oTbl); if (b == null) return; for (var i = 0; i < b.length; i++) { if (b[i] == nm) return true; } }
function teAtrFldNm(nm) { return KW.attrFldPrefix + nm; }
function teAtrFldNm4OrigVal(nm) { return KW.attrFldPrefixOrig + nm; }
function atrFldsGetV(oTR, nm, dftV, sFldDlm) { var nma = nm.split(","), v = []; for (var i = 0; i < nma.length; i++) { v[i] = getAtr(oTR, KW.attrFldPrefix + nma[i], dftV); } return v.join(sFldDlm); }
function atrFldGetV(oTR, nm, dftV) { return getAtr(oTR, KW.attrFldPrefix + nm, dftV); }
function atrFldSetV(oTR, nm, v, bNoEvent, booSetByCode, isOriginal) {
var oTbl = getTable(oTR), ge = oTbl.GridEdit, itm = ge.fieldsAll[nm];if (!itm) itm = nm;
if (!bNoEvent && ge.bfrChangeValue) { if (ge.bfrChangeValue(ge, oTR, itm, v)) return; } //2016/8/31 原本事件通知參數是傳nm,但是nm常常是id,所以改成傳OpItem物件
if (isOriginal) setAtr(oTR, teAtrFldNm4OrigVal(nm), v);
if (!hasAtr(oTR, teAtrFldNm4OrigVal(nm))) setAtr(oTR, teAtrFldNm4OrigVal(nm), getAtr(oTR, teAtrFldNm(nm)));
setAtr(oTR, teAtrFldNm(nm), v);
if (!bNoEvent && ge.aftChangeValue) ge.aftChangeValue(ge, oTR, itm, v, booSetByCode);
if (!bNoEvent && ge.evtBroadcast) ge.evtBroadcast("aftChangeValue", [ge, oTR, itm, v, booSetByCode]);
}
function teGetAllFlds(oTbl) { return CreateItemsArrayFromString(getAtr(oTbl, KW.VariableItems, "")); }
function teGetOneFld(oTbl, fldId, aryItms) {
if (aryItms == null) aryItms = teGetAllFlds(oTbl);
for (var j = 0; j < aryItms.length; j++) { var n = GetItmNameByAry(aryItms[j]); if (n == fldId) return aryItms[j]; }
}
function teGenKeyVal(oTR, MyKeysIdx, aKeyNm, o, dataTypes) {
var sV = "", v;
for (var k = 0; k < MyKeysIdx.length; k++) {
if (k > 0) sV += KW.Dlm1; v = null;
if (o) {//如果o有設定該屬性即使是空字串也算數,因為值也有可能為空字串 (可能代表刪除)
v = getAtr(o, C_AtrPfxKey + aKeyNm[k]);
// if (v != null) {
// sV += v; continue;
// }
}
if (v == null) {
if (MyKeysIdx[k] < 0 || oTR.tagName != "TR") {
if (!o) { v = atrFldGetV(oTR, aKeyNm[k], ""); } else { v = atrFldGetV(oTR, aKeyNm[k]); if (v == null) { v = atrFldGetV(o, aKeyNm[k], ""); } }
} else { v = teTdGetValue(oTR.cells[MyKeysIdx[k]]); }
}
if (dataTypes[k] == GDT.DateTime) {
var nDt = new Date(Date.parse(v));
if (!isNaN(nDt)) v = nDt.toISO8601();
}
sV += v;
}
return sV;
}

function teTextBoxShowTextLen(srcObj) { if (srcObj.tagName != "INPUT" && srcObj.tagName != "TEXTAREA") return; srcObj.title = srcObj.value.length; }

function cmnShowPasteDlg(bInsRow, tarItem) {
var tblId = "teDlgPasteIntoGrid";
var oTbl = document.getElementById(tblId);
//if not exist in document, create it
if (!oTbl) {
var o = newEm("DIV"); o.innerHTML = "<textarea style=\"width:100%;height:360px;\" onpaste=\"tePasteToGridUsrDlg()\"></textarea>";
var dg = new DialogInBody(tblId, "Paste into below textbox");
dg.setClient(o); oTbl = dg.dlg;
}
MenuShowDo(oTbl);
oTbl.tarItem = tarItem;
oTbl.style.cursor = "default";
oTbl.InsRows = bInsRow;
var t = oTbl.getElementsByTagName("TEXTAREA");
if (t.length > 0) { if (t[0].offsetHeight < 60) t[0].style.height = "60px"; t[0].focus(); }
}
function tePasteToGridUsrDlg(ByTimer) {
var sStr, tblId = "teDlgPasteIntoGrid";
var oTbl = document.getElementById(tblId); if (!oTbl) return;
var tarItem = oTbl.tarItem;
if (ByTimer) {
var oTxt = oTbl.getElementsByTagName("TEXTAREA");
sStr = oTxt[0].value;
} else {
var evt = GJT.event(); //alert(evt.clipboardData);
if (GJT.browserType == BWRT.IE) clpData = window.clipboardData;
else clpData = evt.clipboardData;
if (!clpData) {
window.setTimeout("tePasteToGridUsrDlg(true)", 200); return;
}
sStr = clpData.getData("text"); if (sStr == null) return;
}
var bInsRow = oTbl.InsRows;
killIt(oTbl);
tarItem.setClipText(null, sStr, true, true, false, bInsRow);
MenuHide();
}

function hintQryBusyA(hintDone, oTbl) {
var ohn, p = BDY(), g; if (oTbl) { p = oTbl.parentElement; ge = oTbl.GridEdit;}
if (oTbl && ge) ge.hintQryBusy(hintDone);
if (ge) ohn = getChiHasAtr(ge.container, "PrmId");
if (p && !ohn) { p = p.parentElement; ohn = getChiHasAtr(p, "PrmId"); }
if (ohn) ohn.className = hintDone ? "QryLaunch" : "QryLaunchAnim";
}
function fgFieldsGetTarTbl(ge,fgn){
var opst = ge._opst4Imp;
if (!opst) { opst = getDvOpSetting(ge, ""); ge._opst4Imp = opst; }
var ftbls = opst.ftbls,tarTb=fgn._tarTb;
if(!tarTb){
for (var j = 0; j < ftbls.length; j++) {
if (fgn.ftbl == ftbls[j].id) {
tarTb = ftbls[j];
var nitms = new OpItems();
nitms.addByString(tarTb.fields);
tarTb.fldsItems = nitms;
fgn._tarTb=tarTb;
break;
}
}
}
return tarTb;
}
function teGetFgFieldsValDone(req, ge, dict, fgn, loosenLvl) {
if (req.readyState != 4) return;
if (req.status == 401 && PROG.onUnauthorized) return PROG.onUnauthorized();
if (req.status != 200) {

return alert('There was a problem with the request.');
}
var txt = req.responseText, b;
if (txt.indexOf("{") < 0) return alert(txt);
//eval("b=" + txt);
try { b = JSON.parse(txt); } catch (ex) { eval("b=" + txt); };
var f = b.fields, d = b.data, fa = f.split(","), amflds = fgn.mflds.split(","), idxK = [], aRfsflds = (fgn.rfsflds ? fgn.rfsflds.split(",") : []), idxSel = [], byPass = [];
var itmsAll = ge.fieldsAll, aNmSel = [], itmsByPass = new OpItems(), ianc = fgn.ImportAsNewColumns, ianr = fgn.ImportAsNewAttr, cixN = [];
var alwmv = fgn.AllowMultiValues;
if (!d) return;
if (ianc || ianr) {//自動建立虛擬欄位
var vfs = fgn.fgrfsflds.split(","), addCol = 0;
var tarTb = fgFieldsGetTarTbl(ge, fgn);
var nitms = tarTb.fldsItems;
aRfsflds = []; //r.fgrfsflds //getDvOpSetting(ge, "")
var nmsAddShw = "";
var bopCfg = ianr ? GIA.IsAttribute | GIA.OutPutDenied | GIA.Hidden : 0;
for (var i = 0; i < vfs.length; i++) {
var nm1 = fgn.nameprefixImpt + vfs[i], ntm = itmsAll[nm1];
aRfsflds.push(nm1);
if (!ntm) {
if (ge._clearOpsCache) ge._clearOpsCache();//條件式格式化快取需清除
addCol = 1;
ntm = nitms[vfs[i]].clone(nm1);
ntm.opConfig = ntm.opConfig | GIA.Virtual | GIA.SaveDenied | GIA.WriteDenied | bopCfg;
ntm.text = fgn.captionprefixImpt + ntm.text;
itmsAll.add(ntm);
if (nmsAddShw) nmsAddShw += ",";
nmsAddShw += nm1;
}
}
if (ianc && nmsAddShw) {
nmsAddShw = ge.getFields().getNames(",") + "," + nmsAddShw;
ge.arrangeColumns(nmsAddShw, 0);//do not save profile
}
}
var kl = amflds.length, sl = aRfsflds.length, slK = sl - 1;
if (loosenLvl != null) kl = kl - loosenLvl;
for (var h = 0; h < kl; h++) {
var myNm = ge.fieldNameA(amflds[h]);
for (var i = 0; i < fa.length; i++) {
if (fa[i] == myNm || ge.fieldNameA(fa[i]) == myNm) {
itmsByPass.add(itmsAll[myNm]);
idxK[h] = i; break;
}
}
}
for (var h = 0; h < sl; h++) {
var myNm = ge.fieldNameA(aRfsflds[h]);
for (var i = 0; i < fa.length; i++) {
if (fa[i] == myNm || ge.fieldNameA(fa[i]) == myNm) {
idxSel[h] = i; aNmSel[h] = myNm;
byPass[h] = itmsByPass[myNm] != null;
cixN[h] =myNm;
break;
}
}
}
var dd = d;
if (alwmv) {
//允許多重值 則需要先整理一次 依照key 相同的放在一起
var dmv = [];//multi values
var kmv = {};
for (var i = 0; i < d.length; i++) {
var d1 = d[i], kx = d1[idxK[0]];
for (var h = 1; h < kl; h++) {
kx += "\t" + d1[idxK[h]];
}
var dmv1 = kmv[kx];
if (!dmv1) {
dmv1 = [];
for (var j = 0; j < d1.length; j++) { dmv1[j] = d1[j]; }
kmv[kx] = dmv1;
dmv.push(dmv1);
dmv1.k4mv = kx;
} else {
for (var j = 0; j < d1.length; j++) { dmv1[j] += "\n" + d1[j]; }
}
}
dd = dmv;
}
for (var i = 0; i < dd.length; i++) {
var d1 = dd[i], kx;
if (alwmv) kx = d1.k4mv;
else {
kx = d1[idxK[0]];
for (var h = 1; h < kl; h++) {
kx += "\t" + d1[idxK[h]];
}
}
var oaTR = dict.item(kx);
dict.remove(kx);
if (oaTR == null) continue;
for (var h = 0; h < sl; h++) {
if (byPass[h]) continue;
//防止無窮遞迴,檢查值相同的就不設定

if (fgn.setAsOldRowIfIsKey && ge.fieldsKey.length == 1 && ge.fieldsKey[aNmSel[h]]) {//單一PK的才能這樣子做
for (var r = 0; r < oaTR.length; r++) {
if (ge.isNewRow(oaTR[r])) {
ge.setFieldValues(aNmSel[h], d1[idxSel[h]], [oaTR[r]], 0, 0, 1, 0, 1, 1, 1, h < slK);
teSetAsOld(oaTR[r]);
var amflds = fgn.mflds.split(",");
for (var c = 0; c < amflds.length; c++) {
//remove editlog
ge.editLogRemove(oaTR[r], amflds[c]);
}
ge.editLogRemove(oaTR[r], aNmSel[h]);
}
}
ge.refreshRows(oaTR);
}
else if (ianc) {
ge.setFieldValues(cixN[h], d1[idxSel[h]], oaTR, 1, 1, 0, 0, 1, 1, 0, h < slK);
}
else if (ianr) {
ge.setFieldValues(cixN[h], d1[idxSel[h]], oaTR, 1, 1, 0, 0, 1, 1, 0, h < slK);
}
else {
ge.setFieldValues(aNmSel[h], d1[idxSel[h]], oaTR, 0, 0, 0, 0, 1, 1, 1, h < slK); //只有最後一欄才需要檢查foreign refresh
if (fgn.frcedlog) {
for (var r = 0; r < oaTR.length; r++) {
ge.editLogAdd(oaTR[r], aNmSel[h], d1[idxSel[h]]);
}
}
}
}
}
var k = dict.keys();
if (k.length == 0) return;
var lnf = fgn.loosenfields, lnl = loosenLvl, noaTR = [];
if (lnl == null) lnl = 1; else lnl++;
if (!lnf || lnl > lnf) {
if (fgn.ClearIfNoMatch) {
for (var i = 0; i < k.length; i++) {
var trs = dict.item(k[i]);
noaTR = noaTR.concat(trs);
}
for (var h = 0; h < sl; h++) {
if (byPass[h]) continue;
ge.setFieldValues(aNmSel[h], "", noaTR, 0, 0, 0, 0, 1, 1, 1);
}
return;
}
if (fgn.noAlert4NoMatch) return;
var txtalm = fgn.alertText;
if (!txtalm) txtalm = "No match result for relative columns";
txtalm += "\n" + k.join("\n");
return alert(txtalm);
}
for (var i = 0; i < k.length; i++) {
var trs = dict.item(k[i]);
noaTR = noaTR.concat(trs);
}
ge.shwFgnDataDo(fgn, noaTR, lnl);
}
function teQueryByAjax(oTbl, aryP, aryV, qryURL, byUser, qryMode, tarObj, sync) {
var req = GJT.xmlHttpRequest(), ge = oTbl ? oTbl.GridEdit : null;
if (oTbl) hintQryBusyA(false, oTbl);
if (!qryURL) {
if (ge && ge.qryURL) qryURL = ge.qryURL;
else qryURL = msAjaxPageName;
}
if (oTbl) req.onreadystatechange = function () { teQueryByAjaxOncomplete(oTbl, req, qryMode, tarObj); };
return teQueryByAjaxAu(oTbl, aryP, aryV, qryURL, byUser, qryMode, req, sync);
}
function teQueryByAjaxAu(oTbl, aryP, aryV, qryURL, byUser, qryMode, req, sync) {
var tarPage, tarId, prm = ["FunctionName=Ajax_CallGenTable"];
for (var i = 0; i < aryP.length; i++) {
if (aryP[i] == "tarPage") {
if (!aryV[i]) aryV[i] = getTargetPage(oTbl);
tarPage = aryV[i];if (!tarPage) continue; ;
}
else if ("TableID" == aryP[i]) {
if (!aryV[i]) aryV[i] = getNameA(oTbl);
tarId = aryV[i];
}
prm.push("&", encodeURIComponent(aryP[i]), "=", encodeURIComponent(aryV[i]));
}
if (!tarId) {
tarId = getNameA(oTbl);
prm.push("&TableID=", encodeURIComponent(tarId));
}
if (!tarPage) {
tarPage = getTargetPage(oTbl);
if(!tarPage) tarPage = tarId;
prm.push("&tarPage=", encodeURIComponent(tarPage));
}
var sAppId = getAtr(oTbl, "appId");
if (sAppId) prm.push("&appId=", encodeURIComponent(sAppId));
prm.push("&", KW.PrmTimezoneOffset, "=", (new Date()).getTimezoneOffset());
if (byUser) prm.push("&", KW.ByInteractive, "=Y");
req.open("POST", qryURL, !sync); //false ===> 同步 POST? GET? GET有資料量限制
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8"); //用於send(content) ， server端用request["變數名"] 接收
req.send(prm.join(""));
if (sync) return req.responseText;
}
function refreshRowsByJson(oTbl, jsonObject, dict) {
var jo = jsonObject, ge = oTbl.GridEdit, itmsK = dict.keyItems, itmsA = ge.fieldsAll, tF = dict.tarFields,
tarFlds = tF.getNamesArray ? tF.getNamesArray() : tF.split(","), il = itmsK.length, fl = tarFlds.length, forRecForm = dict.forRecForm,otr=[];
for (var r = 0; r < jo.length; r++) {
var v = jo[r];
var vk = v[itmsK.item(0).name];
for (var i = 1; i < il; i++) {//比對key值
vk += "\t" + v[itmsK.item(i).name];
}
var tr = dict.item(vk);
if (!tr) continue;
otr.push(tr);
if (forRecForm) { ge.showRecordFormValues(tr, v); }
else tr._recjson = null;
for (var i = 0; i < fl; i++) {
if (!tarFlds[i]) continue;
var s = v[tarFlds[i]];
if (s == undefined) s = v[itmsA.item(tarFlds[i]).name];
//如果有異動的應該不能改,還是全部更新比較安全,否則會覆蓋到到舊資料
ge.setFieldValues(tarFlds[i], s, [tr], 1, 1, 1, 0, 1, 1, 1);
ge.editLogRemove(tr, tarFlds[i]);
}
}
if(otr.length) ge.hintAnnexAuto(otr);
}
function teHndUnauthorized() {//show login
var url = PROG.url4Authorization;
if (!url) return;
var dg = new DialogInBody("lgn", "Login", 700, 600); dg.setClient(addE("<iframe style='width:100%;Height:100%;border:0px solid;' src='" + url + "'></iframe>"))
showBesideMouse(dg.dlg);
}
function teQueryByAjaxOncomplete(oTbl, req, qryMode, tarObj) {
if (req.readyState != 4) return;
hintQryBusyA(true, oTbl);
if ((req.status == 401 && PROG.onUnauthorized)) return PROG.onUnauthorized();
if (req.status != 200) return alert('There was a problem with the request. \r\n' + req.statusText);
var oriGE = oTbl.GridEdit, txt = req.responseText, qryDoneNotify = oTbl.handleQueryDone, ftb, hasNoData, hasError, doQryDoneEvt = 1;
if (oriGE && oriGE.siblingGrids) {
var ggs = oriGE.siblingGrids;
//刪除舊的兄弟表格
for (var i = 0; i < ggs.length; i++) { if (ggs[i].close) ggs[i].close(); }
delete oriGE.siblingGrids;
}
if (!txt) {
hasNoData = 1;
var pgn = PROG.children;
for (var k = 0; k < pgn.length; k++) {
var opg = pgn[k];
if (opg instanceof opGrid) {
if (opg.grid && opg.grid.parentNode == oTbl.parentNode) opg.opExecute(CMDE.Close);
}
}
if (oriGE && oriGE.handleAfterQuery) oriGE.handleAfterQuery(oriGE, hasNoData); //1 means no data
return;
}
if (qryMode == "json-rows") {//更新資料列
var odr;
try { odr = JSON.parse(txt); } catch (ex) { odr = eval(txt); }
return refreshRowsByJson(oTbl, odr, tarObj);
//return refreshRowsByJson(oTbl, eval(txt.replace(/\r/g, "\\r").replace(/\n/g, "\\n")), tarObj);
}
var oRes = newEm("DIV"), nwTbl, oTBdy = getTBody(oTbl), kod = oTbl.keepOldData || oTbl.keepOldDataA, oTHD = getTHEAD(oTbl), isOK, fg = document.createDocumentFragment();
if (oriGE) { hideIt(oriGE.criterionButtons); ftb = oriGE._ftb; }
oRes.innerHTML = txt;
var nh = oRes.children, idxTar, idxNew, pn = oTbl.parentNode;
if (!pn) return;
var newTS = [], apd = [], oh = pn ? pn.children : [];
if (nh.length > 0) {
for (var i = 0; i < nh.length; i++) {
var ot = nh[i];
if (ot.tagName == "TABLE") newTS.push(ot);
if (hasAtr(ot, KW.ViewName) && !nwTbl) { nwTbl = ot; idxNew = i }
}
}
else { nwTbl = oRes; newTS.push(oRes); idxNew = 0; }
if (!nwTbl) {//沒有GridEdit就整個置換,有些輸出會客制化
var nxb = getChiHasAtr(pn, "xcust_dat_");
if (!nxb) { pn.appendChild(oRes); }
else { nxb.parentNode.replaceChild(oRes, nxb) }
setAtr(oRes, "xcust_dat_","Y"); nxb = oRes;
var atbs = getEM(nxb, "TABLE");
for (var i = 0; i < atbs.length; i++) {
var tt = atbs[i], rw0 = tt.rows[0];
if (rw0 && rw0.cells[0]) {
rw0.cells[0].onclick = function () { selectElementContents(null, "TABLE"); }; apd.push(tt);
}
}
newTS = []; nh = null; oh = []; //clear
}
if (nh && (newTS.length == 0 || !nwTbl || nwTbl.tagName != "TABLE")) {
//replace same tagName object
var oh = oTbl.parentNode.children;
for (var i = 0; i < nh.length; i++) {
for (var j = 0; j < oh.length; j++) {
if (oh[j] && nh[i] && oh[j].tagName == nh[i].tagName) {
if (oTbl != oh[j]) oh[j].parentNode.replaceChild(nh[i], oh[j]);
}
}
}
if (newTS.length == 0) return alert(oRes.innerText);
}
for (var i = 0; i < oh.length; i++) {
if (oh[i] == oTbl) { idxTar = i; break; }
}
for (var i = 0; i < newTS.length; i++) {
var nTI = newTS[i];
if (i != idxNew && nTI.tagName == "TABLE" && nTI.rows.length > 0 && nTI.rows[0].cells.length > 0) {
//nTI.rows[0].cells[0].onclick = selWholeTbl;
//nTI.rows[0].cells[0].style.cursor = "pointer";
}
if (false && oTbl.rows && oTbl.rows.length > 0 && !nwTbl) {
var dg = new DialogInBody("floatTbl", "");
dg.setClient(nTI);
var gg = new opGrid("xjuw", "", nTI);
gg.floatHeader(1);
}
else if (i == idxNew) {//replace old
var oTBdyN = getTBody(nwTbl), oTHDN = getTHEAD(nwTbl), chrnN;
if (oTBdyN) { chrnN = oTBdyN.children; isOK = true; }
if (!oTBdyN) {
if (nwTbl.innerText.length == 0) { hasNoData = 1; alert("No Data!"); }
else { hasError = 1; alert(nwTbl.innerText); }
}
else if (!oTBdy || !oTbl.rows || oTbl.rows.length == 0) { //oTBdy.children.length == 0 //為查詢的表格TBODY沒有TR
oTbl.parentNode.replaceChild(nwTbl, oTbl);
oTbl = nwTbl;
oTbl.handleQueryDone = qryDoneNotify;
if (oriGE) {
oriGE.init(oTbl); doQryDoneEvt = 0;//init 內部已經會執行QueryDoneNotify,後面不需要再執行一次
var txt = PROG.relationsTxt;
if (txt) {
PROG.relations = vwXmlToRela(txt);
teSetupForExpandRela();
}

} // oriGE.grid = oTbl; oTbl.GridEdit = oriGE; }
}
else if (kod) {
while (chrnN.length > 0) { oTBdy.appendChild(chrnN[0]); }
oRes.removeChild(nwTbl);
}
else {
var acol = oTbl.getElementsByTagName("COL"), aw = [];
for (var j = 0; j < acol.length; j++) {
aw.push(acol[j].widthByUser);
}
if (!getChiHasAtr(oTbl, "zz_criterion_row")) {//no query area
var csN = oTHDN.children[0].cells, flds = oriGE ? oriGE.fieldsAll : null;
var cs=oTHD.children[0];if (cs)cs=cs.cells;//如果原表格的標題列和新的依樣多欄就不要置換
if (!flds) { flds = new OpItems(); flds.addByString(getAtr(nwTbl, KW.VariableItems, "")); }
for (var j = 0; j < csN.length; j++) {
var itmH = flds[csN[j].id];
if (itmH) { csN[j].style.fontWeight = itmH.isWriteDenied() ? "" : "bold"; csN[j].opField = itmH; }
}
hideIt(oTHDN.children[1]);
if(!cs || cs.length !=csN.length) oTbl.replaceChild(oTHDN, oTHD);
}
oTbl.replaceChild(oTBdyN, oTBdy);
oRes.removeChild(nwTbl);
window.setTimeout(function () {
var acol = oTbl.getElementsByTagName("COL");
for (var j = 0; j < acol.length; j++) {
if (aw[j]) { oTbl.rows[0].cells[j].noWrap = true; acol[j].style.width = toPx(aw[j]); }
}
}, 100);
}
setAtr(oTbl, KW.PageNo, getAtr(nwTbl, KW.PageNo));
}
else if (i < idxNew) {//idxTar
var replaced = false;
for (var j = i; j < oh.length; j++) {
if (oh[j] == oTbl) break;
if (oh[j] == ftb) continue;
if (apd.contains(oh[j])) continue;
pn.replaceChild(newTS[i], oh[j]); apd.push(newTS[i]); replaced = true; break;
}
if (!replaced) { pn.insertBefore(newTS[i], oTbl); apd.push(newTS[i]); }
}
else {
var replaced = false;
for (var j = i; j < oh.length; j++) {
if (oh[j] == oTbl) continue;
if (apd.contains(oh[j])) continue;
if (oh[j] == ftb) continue;
pn.replaceChild(newTS[i], oh[j]); apd.push(newTS[i]); replaced = true; break;
}
if (!replaced) { pn.appendChild(newTS[i]); apd.push(newTS[i]); }
}
}
var okp = (oriGE && oriGE._recForm) ? oriGE._recForm : null;
while (oh.length > newTS.length + (idxNew == null ? 1 : 0) + (ftb ? 1 : 0)) { var oo = oh[oh.length - 1]; if (oo != okp) pn.removeChild(oo); }
if (oriGE) {
//if (oriGE._recForm) pn.appendChild(oriGE._recForm.uio);
if (doQryDoneEvt) oriGE.queryDone();
var oPgno = getChiHasAtr(oriGE.StatusBar, "z_lkrhpgno"), pgbk = getChiHasAtr(oriGE.StatusBar, "z_pginfobk"), pno = getAtr(nwTbl, KW.PageNo);
if (oPgno && !isNaN(parseInt(pno))) { oPgno.value = pno; showIt(pgbk); } else hideIt(pgbk);
if (oriGE.handleAfterQuery) oriGE.handleAfterQuery(oriGE, hasNoData, hasError);
}
if (qryDoneNotify) qryDoneNotify();
for (var i = 0; i < apd.length; i++) {
var nTI = apd[i]; if (!nTI) continue;
if (nTI.tagName == "TABLE" && nTI.rows.length > 0 && nTI.rows[0].cells.length > 0) {
var nm = nTI.id;
if (!nm) nm = oriGE ? oriGE.name + "xxrpt" : "";
if (!nm) nm = "jewsiu_";
if (i > 0) nm += i;
var gg = new opGrid(nm, "", nTI, qryMode == "genReport");
gg.floatHeader(1);
if (oriGE) {
if (!oriGE.siblingGrids) oriGE.siblingGrids = [];
oriGE.siblingGrids.push(gg);
}
}
}
for (var i = 0; i < PROG.children.length; i++) {
var opg = PROG.children[i], gg = opg ? opg.grid : 0;
if (gg && (!gg.parentNode || !gg.parentNode.parentNode)) opg.opExecute(CMDE.Close);
}
//hintQryBusyA(true, oTbl);
teRevFltPosition();
teShowRows(oTbl);
if (ftb && oriGE) { oriGE.floatHeader(ftb); }
}

function teDateSelDoneNotify(selector) {
var sr = selector, o = sr.tarObj, rcv = sr.receiver, nDt = sr.value; if (!o && !rcv) return true;
var v = nDt.getFullYear() + "/" + (nDt.getMonth() + 1) + "/" + nDt.getDate();
if (rcv) return rcv.receiveValue(v);
if (o.tagName == "INPUT") {
var oriv = o.value, idx = oriv.indexOf("~");
if (idx >= 0) { o.value = oriv.substring(0, idx + 1) + v; }
else if (oriv.indexOf(">=") == 0 || oriv.indexOf("<=") == 0) o.value = oriv.substring(0, 2) + v;
else if (oriv.indexOf(">") == 0 || oriv.indexOf("<") == 0) o.value = oriv.substring(0, 1) + v;
else o.value = v;
}
else if (o.tagName == "TD") {
teTdSetValue(o, v);
}
return true;
}
function tlValueSelectorGet(winName) {
var myV = getAtr(self.document.body, "ValueSelected"); if (myV == null) return;
var myVT = myV.split(KW.Dlm1), myVF = myVT[0].split(KW.Dlm2);
if (tlSetSelValSpec(myVT)) return;
if (mevtValueSelectGet != null) { var aryV = cmnSplit2(myV, KW.Dlm1, KW.Dlm2); if (eval(mevtValueSelectGet + "(aryV,winName)")) return; }
if (self[winName + "rcvr"]) self[winName + "rcvr"].receiveValue(myVF[0]);
return teSelSetValue(myVF[0], false, true);
}
function tlSetSelValSpec(av) {
var o = moValSelReceiver, apnd, nv = ""; if (GJT.event()) apnd = GJT.event().ctrlKey; if (!o) return false;
for (var i = 0; i < av.length; i++) { var av1 = av[i].split(KW.Dlm2); if (av1[0] != "") { if (nv != "") nv += ","; nv += av1[0]; } }
if (apnd && o.value != "") { nv = o.value + "," + nv; } o.value = nv; return true;
}
function tlOpenPage() { return tlStart(); }
function tlStart() {
return showPagesMenu();
return dlgInPlaceShow("MenuWin", C_Page_DialogStart, "POST", null, null, self, "Start page", "", "", "M", "SCROLLING=yes");
var o = cmnShowNewWindow("MenuWin", C_Page_DialogStart, "POST", null, null, "scrollbars=yes,resizable=yes,width=700,height=700", self, false);
//putWinBesideMouse(o);
}
function showPagesMenu() {
var o = document.getElementById("pgmenudv"); if (o) return showIt(o);
var req = GJT.xmlHttpRequest();
req.onreadystatechange = function () { showPagesMenuComplete(req); };
req.open("POST", C_Page_DialogStart + "?aa=" + Math.random(), true);
req.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
req.send();

}
function showPagesMenuComplete(req) {
if (req.readyState != 4 || req.status != 200) {
try {
if (req.status == 401 && PROG.onUnauthorized && req.readyState == 4) return PROG.onUnauthorized();
} catch (ex) { }
return;
}
var txt = req.responseText, txtL = txt.toLowerCase();
var idx = txtL.indexOf("<body"), idx2;
if (idx >= 0) {
idx = txtL.indexOf(">", idx + 3);
idx2 = txtL.indexOf("</body", idx + 2);
txt = txt.substring(idx + 1, idx2);
}
var o2 = newEm("DIV");
o2.id = "pgmenudv"; //o2.className = "PageIndex";
o2.innerHTML = txt;
var o3 = o2.getElementsByTagName("DIV")[0], btn = newEm("U"), bs = btn.style, o4 = o3.children[0];
btn.onclick = function () { hideIt(o2);}; // o2.outerHTML = "";
btn.innerText = i18nm.CloseThisDialog.text; bs.cursor = "pointer"; bs.color = "#ffbbbb"; bs.marginLeft = "16px"; bs.marginRight = "16px";
o4.insertBefore(btn, o4.children[0]);
BDY().appendChild(o2);
o2.style.overflow = "visible";
o2.style.position = "absolute";
cmnMoveObjTo(o2, 0, GJT.getComputedStyle(BDY()).marginTop);
o2.scrollIntoView(true);
window.setTimeout(function () { toZTop(o2) }, 400);
}
function someFunction(o) {
var URL = o.getAttribute("URL");
var x = document.getElementById("myCheck"), opnr = window.opener; //.getAttribute("checked");
if (x && x.checked) {
var Name = URL.toString();
var kkk = window.open(URL);
//if (opnr != null && opnr != self && (opnr.document && opnr.document.body)) window.close();
kkk.focus();
}
else {
try {
window.location = URL;
window.focus;
} catch (ex) { }
}
}
function tlColSet() {
var ts;
ts = NITAdd(ts, [["tlSelPreDefineCol", "Use a predfined columns", "Set columns of table to a predfined setting"],
["tlSaveColumns", "Save Columns of Table", "Save columns of table to a setting..."],
["tlDelPreDefineCol", "Delete predfined columns setting..."],
["tlDelPreDefineCol(true)", "Delete all predfined columns setting"]]);
ts.onclick = tlColSetGet;
SysShowMenu(ts);
}
function tlColSetGet() { }

function getFieldNamesList(oTbl) {
var c1 = teGetFstColT(oTbl), hds = tbGetHeads(oTbl); if (!hds || hds.length <= c1) return ""; var res = hds[c1].id, j = hds.length;
for (var i = c1 + 1; i < j; i++) { res += KW.dmlN + hds[i].id; }
return res;
}
function handleArngCols(selector) {
var s = selector, ge = s.tarObject, itmsSel = s.itemsSelected, nmList = itmsSel.getNames(KW.dmlN);
ge.arrangeColumns(nmList, true);
}
function selItems(name, text, itmsAll, itmsSel, width, height, handleDone, shwAllItems, freeRemove,shwFieldName) {
var slr = new ItemsSelector(name, text, itmsAll, itmsSel, width, height, null, shwAllItems, freeRemove, shwFieldName);
slr.handleForOK = handleDone;
var dg = slr.dlgCtrl;
dg.moveToLT();
window.setTimeout(function () { showBesideMouse(dg.dlg); dg.main.focus(); }, 50);
return slr;
}
function tlSetRowColorTBL(oTbl, redo, steps, color) {
if (oTbl == null) return;
var c0 = "#ececec", isteps = steps, clr, rwcClr = oTbl.rwcColor;
if (rwcClr != null) c0 = rwcClr;
if (isteps == null) isteps = oTbl.rwcSteps;
if (steps != null) { oTbl.rwcSteps = steps; if (steps) clr = c0; else clr = ""; }
else if (redo) { if (!oTbl.rwcColorLast) { return; } else { clr = c0; } }
else {//switch mode
if (oTbl.rwcColorLast) clr = ""; else clr = c0;
}
if (!isteps) isteps = 2;
if (color != null) { oTbl.rwcColor = color; clr = color; }
else if (oTbl.rwcColor == null) oTbl.rwcColor = c0;
oTbl.rwcColorLast = clr;
tbSetRowColor(oTbl, 0, -1, isteps, clr);
}
function teValueFields() {
return teCmnGetAtr(KW.ValueFields, "");
}
function tlSetSelValue(ValSource) {
var m = ValSource ? ValSource : GJT.activeItem; if (!m) return alert("No Active Item");
var vfs = teValueFields(), v; if (!vfs) return;
if (m instanceof GridEdit) {
v = m.getFieldsValues(vfs, null, KW.Dlm2);
if (!v) return;
}
//Here use KW.Dlm1 as the delimeter of records
return SendBackValueDo(v.join(KW.Dlm1));
}
function SendBackValueDo(MyValue, sHandle) {
var opnr = self.opener;
if (!opnr) opnr = self.parent;
if (!opnr) return;
try {
setAtr(opnr.document.body, "ValueSelected", MyValue);
var MyWinName = self.name; if (sHandle == null) sHandle = "tlValueSelectorGet";
opnr.focus(); //some program will focus other window when get value
opnr.execScript("try {" + sHandle + "(\"" + MyWinName + "\");} catch (e){;}", "JavaScript");
cmnHideSelfAuto();
return true;
} catch (e) {
alert("Err " + e);
}
}
function tlCancelSelValue() { if (self.opener) self.opener.focus(); cmnHideSelfAuto(); }

function tlFocusOpener() {
try { window.opener.focus(); } catch (ex) { }
}
function teLaunchHelp() {
hlpLaunchHelp();
}
function teShowHColCheckSW() { var oi = GJT.eventSrc().getElementsByTagName("INPUT"); if (oi && oi.length > 0) oi[0].checked = !oi[0].checked; }
function teShowHColSelAll(bSelIt) {
GJT.stopBubble();
var o = getTable(), oi = o.getElementsByTagName("INPUT");
for (var i = 0; i < oi.length; i++) { oi[i].checked = bSelIt; }
}
function teShowHColSelNone() { GJT.stopBubble(); teShowHColSelAll(false); }
function teShowHColOK() {
GJT.stopBubble();
var oTbl = teSelGetTbl(), o = getTable();
var oi = o.getElementsByTagName("INPUT"), ra = [], k = 0, alhs = tbGetHeads(oTbl);
for (var i = 0; i < oi.length; i++) {
if (oi[i].checked) {
ra[k] = getAtr(oi[i], "surid");
ra[k] = parseIntD(ra[k], alhs[ra[k]].cellIndex); k++;
}
}
teShowHColCancel();
tlHideShowCols(oTbl, ra, false);
}
function teShowHColCancel() {
GJT.stopBubble();
killIt(document.getElementById("iddlgHideColSel"));
}

function tlHideShowCols(oTbl, selcols, booHideCol, NoSaveProfile) {
if (oTbl == null) return; var AllCols = oTbl.getElementsByTagName("COL"); if (AllCols == null) return;
var AllHeads = tbGetHeads(oTbl), dsp = "", PtyToSet = "display", dspTD = "";
if (BWRT.IE == GJT.browserType) {
PtyToSet = "display";
if (booHideCol) { dsp = "none"; dspTD = "none"; }
} else {
PtyToSet = "visibility";
if (booHideCol) { dsp = "collapse"; dspTD = "none"; }
}
for (var i = 0; i < selcols.length; i++) {
//Note,if there is any rows display set to none,the IE will become very slow when hide a COL,any column can be invisible for user
var ci = selcols[i];
if ((teGetColAttributeDo(AllHeads[ci]) & GIA.Hidden) != GIA.Hidden) {
if (AllCols.length > ci) {
if (PtyToSet == "display") {
AllCols[ci].style.display = dsp;
} else if (PtyToSet == "visibility") {
showIt(AllCols[ci]); //FireFox must let display not none to make visibility be effected
AllCols[ci].style.visibility = dsp;
if (GJT.browserType != BWRT.FIREFOX) {//till now only FireFox support W3C visibility collapse specification,
//hide/Show all TD in col
var rws = oTbl.rows;
for (var j = 0; j < rws.length; j++) {
rws[j].cells[ci].style.display = dspTD;
}
}
}
}
}
}
var fh = [];
var AllCols = oTbl.getElementsByTagName("COL");
for (var i = 0; i < AllCols.length; i++) {
if (PtyToSet == "display") { if (AllCols[i].style.display == "none") fh[fh.length] = AllHeads[i].id; }
else if (PtyToSet == "visibility") { if (AllCols[i].style.visibility == "collapse") fh[fh.length] = AllHeads[i].id; }
}
if (NoSaveProfile) { } else { teSaveUserSetting(oTbl, "ColDspNone", fh.join(",")); }
if (mevtColumnsHiddenShowed) eval(mevtColumnsHiddenShowed + "(oTbl, selcols, booHideCol)");
}

function tlSetPrintOneTable(oTbl) {
var spc = oTbl == null || (oTbl instanceof GridEdit), h = "", m = null,oriH=[],rws,rL;
if (spc) {
if (oTbl instanceof GridEdit) m = oTbl; else m = GJT.activeItem;
while (m && !(m instanceof GridEdit)) {
m = m.activeItem;
}
if (!m) return alert("No active item selected!");
if (m.switchSelMode) m.switchSelMode(-1);//取消選取格
//必須設定高度,
oTbl=m.grid;rws=oTbl.rows;rL=rws.length;if(rL>2) rL = 2;
for(var r=0;r<rL;r++){
oriH[r]=rws[r].style.height;
rws[r].style.height = toPx(rws[r].offsetHeight);
}
if (m.gridContainer2) {h = m.gridContainer2.innerHTML;}
else if (m.gridContainer) {h = m.gridContainer.innerHTML;}
else if (m.tagName) h = m.outerHTML;
else return alert("No proper object selected!");
} else h = oTbl.outerHTML;
var newWin = window.open(""), ndoc = newWin.document;
var myh = ["<head><meta http-equiv=\"Content-Type\" content=\"text/html; CHARSET=UTF-8\">"];
myh.push("<link rel=\"stylesheet\" type=\"text/css\" href=\"sun_TableEditMain.css\" />");
myh.push("<style type=\"text/css\" >");
if (spc) {
var sth = m.styleSheet, nsth; //盡量讓新表格的style和原來的相同(有隱藏欄也要隱藏,靠邊方向也要相同)
if (!sth) { }
else if (sth.cssRules || sth.rules) {
var cssr = sth.cssRules || sth.rules;
for (var i = 0; i < cssr.length; i++) {
myh.push(cssr[i].cssText);
}
} else {
myh.push(sth.cssText);
}
}
myh.push("</style>");
myh.push("</head><body style=\"-webkit-print-color-adjust: exact;\">");
myh.push(h);
myh.push("</body>");
if (m && m.switchSelMode) m.switchSelMode(1);
ndoc.write(myh.join(""));
ndoc.title = self.document.title + " " + m.text;
var oT = ndoc.body.children[0];
setEvtHandleAll(oT, null);
for(var r=0;r<rL;r++){
rws[r].style.height = oriH[r];
}
return ndoc;
}
function teSetPrintElements(tarElements, hndlAfterPrint, ElmsToHide) {
//隱藏不印的物件規則:檢查每個要列印的物件,其sibling物件如果不在要列印的清單內,就設定為隱藏,然後再以同法將父階物件處理好,直到父階是body為止
var t = tarElements, dct = ElmsToHide;
if (!dct) dct = [];
else {
if (!(dct instanceof Array)) dct = [dct];
for (var i = 0; i < dct.length; i++) {
var oc = dct[i];
oc._oridsp4Prn = oc.style.display;
hideIt(oc);
}
}
if (!(t instanceof Array)) t = [t];
teSetPrintElements2(t, dct, BDY());
PROG._PrnElmAryHidden = dct;
PROG._hndlAftPrint = hndlAfterPrint;
GJT.stopBubble(); //避免立即觸發click
//GJT.eventAddHandle(BDY(), "click", tePrintElementsRestore);
GJT.eventAddHandle(teHtm(), "click", tePrintElementsRestore);
}
function teSetPrintElements2(t, dct, bdy) {
//隱藏不印的物件規則:檢查每個要列印的物件,其sibling物件如果不在要列印的清單內,就設定為隱藏,然後再以同法將父階物件處理好,直到父接是body為止
//hide objects not printed
var tp = [];
for (var i = 0; i < t.length; i++) {
var e = t[i], oc = e.previousSibling, p = e.parentNode;
while (oc) {
if (!t.contains(oc)) {
oc._oridsp4Prn = oc.style.display;
hideIt(oc);
dct.push(oc);
}
oc = oc.previousSibling;
}
oc = e.nextSibling;
while (oc) {
if (!t.contains(oc)) {
oc._oridsp4Prn = oc.style.display;
hideIt(oc);
dct.push(oc);
}
oc = oc.nextSibling;
}
if (p != bdy && !tp.contains(p)) tp.push(p);
}
if (tp.length > 0) teSetPrintElements2(tp, dct, bdy);
}
function tePrintElementsRestore() {
var dct = PROG._PrnElmAryHidden;
for (var i = 0; i < dct.length; i++) {
dct[i].style.display = dct[i]._oridsp4Prn;
}
GJT.eventRemoveHandle(teHtm(), "click", tePrintElementsRestore);
if (PROG._hndlAftPrint) PROG._hndlAftPrint();
teRevFltPosition();
}
function uiSetQryOrderItms(ge) {
MenuHide(); if (!ge) return;
var itms = ge.fieldsAll, oTbl = ge.grid;
var di2 = {}, di3 = {}, al = [];
for (var i = 0; i < itms.length; i++) {
var MyopAttr = itms[i].opConfig;
if (!hasBit(MyopAttr, GIA.Virtual) && !hasBit(MyopAttr, GIA.Hidden) && !hasBit(MyopAttr, GIA.SortDenied)) {
nnm = itms[i].name;
di2[nnm] = itms[i];
al.push(nnm);
}
}
if (al.length == 0) return;
var h = ["<div id='", KW.PopupMenu, "' class='DlgSort' style='width:200px;text-align:right;padding:3px;' onclick='chkSortAct()'><span style='text-align:right'>", i18nm.SortD.text, "</span><div style='height:240px;overflow-y:scroll;overflow-x:visible;'><table width='100%' cellspacing=2 cellpadding=0>"];
var sortby = getAtr(oTbl, KW.httpPrmSortBy);
if (sortby && sortby != "") {
var ass = sortby.split(KW.Dlm0);
for (var j = 0; j < ass.length; j++) {
var ass2 = ass[j].split(KW.Dlm1), a2 = di2[ass2[0]];
di3[ass2[0]] = ass2;
if (a2) {
h.push("<tr><td nowrap align=left><input type='checkbox' checked id='", a2.name, "'>", a2.text, "</td><td><input type='checkbox' title='", i18nm.SortD.text, "'", (ass2[1] != "0" ? " checked " : ""), "></td></tr>");
}
}
}
for (var j = 0; j < al.length; j++) {
var a2 = di2[al[j]];
if (a2 && !di3[al[j]]) {//已經放到前面了
h.push("<tr><td nowrap align=left><input type='checkbox' id='", a2.name, "'>", a2.text, "</td><td><input type='checkbox' title='", i18nm.SortD.text, "'></td></tr>");
}
}
h.push("</table></div><button style='width:20%' class='btnMoveTop' act='mt'> </button><button style='width:20%' act='mu' class='btnMoveUp'> </button><button style='width:20%' act='md' class='btnMoveDown'> </button><br /><button style='width:30%' act='OK'>", i18nm.OK.text, "</button><button style='width:30%' onclick='MenuHide()'>", i18nm.Cancel.text, "</button></div>");
var obj = addE(h.join(""));
obj.tarTbl = oTbl;
row4QrySort = null;
MenuShowDo(obj);
}
var row4QrySort;
function chkSortAct() {
GJT.stopBubble();
var a = GJT.eventSrc(), act = getAtr(a, "act"), ridx = 0;
if (act) {
var dv = getObjByTagNameBubble(a, "DIV"), tt = dv.getElementsByTagName("TABLE"), t = tt[0];
if (act == "OK") {
var res = "";
for (var r = 0; r < t.rows.length; r++) {
var inpt = t.rows[r].cells[0].children[0];
var inpt2 = t.rows[r].cells[1].children[0];
if (inpt && inpt.checked) {
if (res) res += KW.Dlm0;
res += inpt.id + KW.Dlm1 + (inpt2 && inpt2.checked ? "1" : "0");
}
}
var p = t.parentElement;
while (!p.tarTbl) { p = p.parentElement; if (!p) break; }
if(res=="")res="-";
if (p) setAtr(p.tarTbl, KW.httpPrmSortBy, res);
MenuHide();
return;
}
if (!row4QrySort) return;
if (act == "mb") ridx = t.rows.length - 1;
else if (act == "mt") ridx = 0;
else if (act == "mu") ridx = row4QrySort.rowIndex - 1;
else if (act == "md") ridx = row4QrySort.rowIndex + 1;
if (row4QrySort) tbRowMoveRows(t, ridx, new Array(row4QrySort));
return;
}
if (a.tagName == "TD" || a.tagName == "INPUT") {
//if(a.children.length>0 && a.children[0].tagName=="INPUT") {a.children[0].checked=!a.children[0].checked;}
var t = getTable(a);
for (var r = 0; r < t.rows.length; r++) {
t.rows[r].className = "";
}
row4QrySort = getTR(a);
row4QrySort.className = "Selected";
}
}
function pvtUsrMenu() {
var o = GJT.eventSrc(); if (!o) return;
var tarId = getAtr(o, "tarId"), rb = getAtr(o, "pvtrowlbl"), cb = getAtr(o, "pvtcollbl");
var itms;
if (rb) itms = [{ name: "chrl", text: i18nm.ChgRowLabelsSeq.text, tip: i18nm.ChgRowLabelsSeq.tip}];

if (cb) itms.push({ name: "chcl", text: i18nm.ChgColLabelsSeq.text, tip: i18nm.ChgColLabelsSeq.tip });
itms.tarId = tarId; itms.rb = rb; itms.cb = cb;
itms.onclick = pvtUsrMenu2;
itms.q3 = o;
SysShowMenu(itms);
}
function pvtUsrMenu2(itm, itms, c) {
var n = itm.name, tarId = itms.tarId, b, ls;
var q3 = itms.q3; q1 = q3.q1;
if (n == "chrl") { b = itms.rb; ls = q3.chrl; }
if (n == "chcl") { b = itms.cb; ls = q3.chcl; }
var fs = new OpItems(), sl;
fs.addByString(b);
sl = fs.clone();
if (ls) sl = fs.collect(ls);
var so = selItems("selFlds", itm.text, fs, sl, 600, 600, pvtUsrMenu3, 1);
so.tarId = tarId;
so.dlgCtrl.dlg.besideMouse = 1;
so.q3 = itms.q3;
so.sm = n;
so.setModal(true);
}
function pvtUsrMenu3(so) {
var itmsSel = so.itemsSelected, q1 = so.q3.q1, nms = itmsSel.getNames(",");
so.q3[so.sm] = nms;
//q1[so.sm] = nms;
q1.click();
}
function swBatchQry(src) {
var byBatch = src.checked, p = src.parentNode, itmsPrm = new OpItems(), tarId = getAtr(src, "tarId");
var oGrd = getChiHasAtr(p, KW.ViewName), f = [], ge, oaPrm = getAllByClass(p, "QryParam"); //C_VariableItems
if (!oGrd) {
itmsPrm.addByString(getAtr(src, KW.VariableItems));
var flds = [];
for (var i = 0; i < itmsPrm.length; i++) { var fld = itmsPrm.item(i); fld.opConfig = (GIA.Virtual | GIA.SaveDenied | GIA.RemoveDenied); flds.push(fld); }
var inio = { name: "btchQryPrm" + tarId, text: " ", dataRow: 1, dataCol: 1, viewName: tarId, tableName: "", opConfig: 0,
programPrivilege: PPVG.Insert | PPVG.ClipBoard | PPVG.RemoveRows | PPVG.Sort, dataPrivilege: 0, titleColor: "#bb9999", fields: flds
};
var ge = new GridEdit(inio, TBM.none, p, null), cntr = ge.container, rf = getEmByClass(p, "QryLaunch");
oGrd = ge.grid;
//p.insertBefore(cntr,rf);
addEm("<span></span>", null, oGrd.parentNode, "beforebegin").innerText = i18nm.InputBatchPrmAtBelowGrid.text;
//var oo = p.getElementsByTagName("INPUT");
for (var i = 0; i < itmsPrm.length; i++) {
var o2 = EmByTag(oaPrm[i], "INPUT");
if (!o2) o2 = EmByTag(oaPrm[i], "SELECT");
if (o2) ge.setFieldValue(itmsPrm.item(i).name, o2.value);
}
}
ge = oGrd.GridEdit;
ge.setVisible(byBatch);
showItA(oaPrm, !byBatch);
}

function doInqSQL(srcObj) {
if (getAtr(srcObj, "isNoneQry") == "Y") {
var tarId = getAtr(srcObj, "tarId"), p = PROG.children[tarId], tx = p ? p.text : "";
if (!window.confirm(i18nm.msgConfirmExecute.text + "\n" + tx)) return;
}
return doInqSQL0(srcObj, 0, null, 1);
}
function doInqSQL0(srcObj, callByGrid, reqContentType, byUser, _tarReportId, _tarFilterId, _rptType) {
var o = srcObj, prmId = getAtr(o, "PrmId"), DataId = getAtr(o, "DataId"), tarId = getAtr(o, "tarId");
if (!prmId || !DataId || !tarId) return;
var p = document.getElementById(prmId); if (!p) return;
var pData = document.getElementById(DataId); if (!pData) return; //byBatch
var byBatch = isChecked(getEmByClass(p, "byBatch")), tbs = pData.getElementsByTagName("TABLE"), oTbl;
if (tbs.length == 0) oTbl = pData.appendChild(newEm("TABLE"));
else {
oTbl = tbs[0];
for (var i = 1; i < tbs.length; i++) {
if (hasAtr(tbs[i], KW.ViewName)) { oTbl = tbs[i]; break; }
}
}
var ge = oTbl.GridEdit;
if (!callByGrid && ge) return ge.query(null, reqContentType, byUser);
if (byBatch) {
pData.tarRow = 0;
oTbl.handleQueryDone = function () { doInqSqlBatchHandle(p, pData, tarId, oTbl, reqContentType) };
oTbl.keepOldData = false;
return doInqSqlBatch(p, pData, tarId, oTbl);
}
var xp = [], xv = [];
//if (o.chrl){xp.push("rowlbls");xv.push(o.chrl);}
//if (o.chcl) { xp.push("collbls"); xv.push(o.chcl); }
if (o.pvtL) {
for (var i = 0; i < o.pvtL.length; i++) {
var q3 = o.pvtL[i];
if (q3.chrl) { xp.push("chrl" + i); xv.push(q3.chrl); }
if (q3.chcl) { xp.push("chcl" + i); xv.push(q3.chcl); }
}
}
if (_tarReportId) { xp.push(KW.ReportId); xv.push(_tarReportId); qryMode = "genReport"; }
if (_tarFilterId) { xp.push(KW.FilterId); xv.push(_tarFilterId); }
if (_rptType) { xp.push("rptType"); xv.push(_rptType); }
if (ge && ge.opst && ge.opst.f4lvlindent) { xp.push("grpField"); xv.push(ge.opst.f4lvlindent); }
if (ge){
var fldshw = ge.getFields(), tId=ge.id;
if (fldshw) {
var colsNow = fldshw.getNames(",");
if (oTbl.saveColumnsArrange) {
xp.push(KW.ColumnsList +tId); xv.push(colsNow);
} //save only if required
xp.push("colsUsing" + tId); xv.push(colsNow);
}
}
doInqSQLGo(p, pData, tarId, oTbl, reqContentType, byUser, xp, xv);
}
function doInqSqlBatchHandle(p, pData, tarId, oTbl, reqContentType) {
var qryVal = p.QryItemsVal, qIdx = p.qIdx;
qIdx++; p.qIdx = qIdx;
if (qIdx >= qryVal[0].length) {
oTbl.keepOldData = false;
return;
}
oTbl.keepOldData = true;
doInqSqlBatch(p, pData, tarId, oTbl, qryVal, reqContentType);
}
function doInqSqlBatch(p, pData, tarId, oTbl, qryVal, reqContentType) {
var prmTbl = getEmByClass(p, "DataEdit"); if (!prmTbl) return;
var ge = prmTbl.GridEdit, flds = ge.fieldsAll;
if (!qryVal) {//if qryVal not present,get from table
qryVal = [];
for (var i = 0, k = flds.length; i < k; i++) {
qryVal.push(ge.getFieldValues(flds.item(i).name));
}
p.QryItemsVal = qryVal;
p.qIdx = 0;
}
var qIdx = p.qIdx, allPrm = [];
for (var i = 0, k = flds.length; i < k; i++) {
allPrm.push(flds.item(i).name + KW.Dlm2 + qryVal[i][qIdx]);
}
if (!oTbl.name) oTbl.name = tarId;
var tarPage = getTargetPage(oTbl), aryP = [KW.QueryItems + tarId, "TableID", "tarPage"],
aryV = [allPrm.join(KW.Dlm1), tarId, tarPage], clsNmlst = ge.getFields().getNames(",");
if (clsNmlst) { aryP.push(KW.ColumnsList + getName(oTbl)); aryV.push(clsNmlst); }
var prw = getAtr(oTbl, KW.PageRows), pno = getAtr(oTbl, KW.PageNo);
if (prw) { aryP.push(KW.PageRows + tarId); aryV.push(prw); }
if (pno) { aryP.push(KW.PageNo + tarId); aryV.push(pno); }
if (reqContentType) {
aryP.push(KW.PrmResponseContentType); aryV.push(reqContentType);
aryP.push("FunctionName"); aryV.push("Ajax_CallGenTable");
if (oTbl.GridEdit && oTbl.GridEdit.qryURL) qryURL = oTbl.GridEdit.qryURL;
else qryURL = msAjaxPageName;
return cmnShowNewWindow("", qryURL, null, aryP, aryV);
}
return teQueryByAjax(oTbl, aryP, aryV, null, true);
}
function doInqSqlGetPrmVal(p, synName, synVal) {
var oo = p.getElementsByTagName("INPUT");
var allPrm = [], rv, opcf;
for (var i = 0; i < oo.length; i++) {
var oi = oo[i];
if (getAtr(oi, "aciType") != "Prm") continue;
if (oi.type == "radio") {
if (oi.checked) allPrm.push(getName(oi) + KW.Dlm2 + oi.value);
if (synName && synName == getName(oi)) oi.checked = oi.value == synVal;
} else if (oi.type == "checkbox") {
allPrm.push(getName(oi) + KW.Dlm2 + (oi.checked ? oi.value : ""));
if (synName && synName == getName(oi)) oi.checked = oi.value == synVal;
} else if (oi.type == "text" || oi.type == "hidden") {
rvsTimePickedDo(oi);
rv = (oi.realValue ? oi.realValue : oi.value);
opcf = parseInt(getAtr(oi, KW.opAttr), 10);
if (opcf && hasBit(opcf, GIA.NoNullForQuery) && rv == "") return alert(i18nm.QryItmCanNotBeNull.text + " : " + oi.parentElement.innerText);
allPrm.push(getName(oi) + KW.Dlm2 + rv);
if (synName && synName == getName(oi)) { oi.value = synVal; if (oi.realValue != null) oi.realValue = synVal; }
}
}
oo = p.getElementsByTagName("SELECT");
for (var i = 0; i < oo.length; i++) {
var oi = oo[i];
if (getAtr(oi, "aciType") != "Prm") continue;
allPrm.push(getName(oi) + KW.Dlm2 + oi.value);
if (synName && synName == getName(oi)) { oi.value = synVal; }
}
return allPrm;
}
function doInqSQLGo(p, pData, tarId, oTbl, reqContentType, byUser, xp, xv) {
//從srcObj往上找到第一個 aciType=DIV的物件是InqSQL單元
//在InqSQL單元內找尋所有aciType=Prm的物件,收集其值 & Id 組成查詢條件參數
var allPrm = doInqSqlGetPrmVal(p);
var tarPage = getTargetPage(oTbl), aryP = [KW.QueryItems + tarId, "TableID", "tarPage"],
aryV = [allPrm.join(KW.Dlm1), tarId, tarPage], clsNmlst = null;// getFieldNamesList(oTbl);
if (!oTbl.name) oTbl.name = tarId;
if (clsNmlst) { aryP.push(KW.ColumnsList + getName(oTbl)); aryV.push(clsNmlst); }
var prw = getAtr(oTbl, KW.PageRows), pno = getAtr(oTbl, KW.PageNo), qryURL;
if (prw) { aryP.push(KW.PageRows + tarId); aryV.push(prw); }
if (pno) { aryP.push(KW.PageNo + tarId); aryV.push(pno); }
if (xp && xv) {
for (var i = 0; i < xp.length; i++) {
aryP.push(xp[i]); aryV.push(xv[i]);
}
}
if (reqContentType) {
aryP.push(KW.PrmResponseContentType); aryV.push(reqContentType);
aryP.push("FunctionName"); aryV.push("Ajax_CallGenTable");
var sAppId = getAtr(oTbl, "appId");
if (sAppId) { aryP.push("appId"); aryV.push(sAppId); }
if (byUser) { aryP.push(KW.ByInteractive); aryV.push("Y"); }
if (oTbl.GridEdit && oTbl.GridEdit.qryURL) qryURL = oTbl.GridEdit.qryURL;
else qryURL = msAjaxPageName;
var ge = oTbl.GridEdit; if (ge) ge.hintQryBusy(false, true);
if (reqContentType == "text/HTML") return cmnOpenWindow(null, qryURL, null, aryP, aryV, " ", null, true);
return cmnShowNewWindow("", qryURL, null, aryP, aryV);
}
return teQueryByAjax(oTbl, aryP, aryV, null, byUser);
}

var mDtSelector = new DateSelector(); //in order to support MenuHide()
function geSelectDate(oriDate, tarObj, doneHandle, receiver) {
MenuHide(); GJT.stopBubble();
mDtSelector.setName(KW.PopupMenu);
mDtSelector.selDoneHandle = doneHandle;
mDtSelector.receiver = receiver;
mDtSelector.selectDate(oriDate, tarObj);
matchLoc(mDtSelector.dlg, tarObj,tarObj.offsetWidth);
makeSureInsideWindowDo(mDtSelector.dlg);
//showBeside(mDtSelector.dlg, tarObj);
}
//DateSelector Dialog
function DateSelector(name) {
if (DateSelector._initialized == undefined) {
var po = DateSelector.prototype;
po.createDlg = function (container) {
var nm = this.name, cc = newEm("DIV"), txtY = ["<table class=\"year\"><tr>"], xw = i18nm.weekDays;
for (var y = 0; y < 5; y++) { txtY.push("<td></td>"); } txtY.push("<td class=\"DlgCtrlClose\">x</td></tr></table>");
txtY.push("<table class=\"month\"><tr>");
for (var m = 0; m < 12; m++) { txtY.push("<td></td>"); } txtY.push("</tr></table>");
txtY.push("<table class=\"date\"><thead><tr>");
for (var i = 0; i < 7; i++) { eval("var tx=xw.d" + i + ".text;"); txtY.push("<td>" + tx + "</td>"); }
txtY.push("</tr></thead>");
for (var r = 0; r < 6; r++) {
txtY.push("<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
}
txtY.push("</table>");
cc.innerHTML = txtY.join(""); cc.className = "dlgDateSel";
if (nm) { cc.name = nm; cc.id = nm; }
if (!container) container = document.body;
container.appendChild(cc);
var evRef1 = this.evtHandle, geRef = this;
var er = function () { evRef1.call(geRef); };
setEvtHandleAll(cc, er);
return cc;
}
po.showDates = function (curDt) {
var dt = curDt, dg = this.dlg, oy = dg.children[0].rows[0].cells, om = dg.children[1].rows[0].cells, odr = dg.children[2].rows,
Y = dt.getFullYear(), M = dt.getMonth(), D = dt.getDate(), dt2 = new Date(Y, M, 1), WD = dt2.getDay(), SF = 1 - WD, yy = Y - 2, yc = 0, xw = i18nm.weekDays;
var dtT = new Date(), YT = dtT.getFullYear(), MT = dtT.getMonth(), DT = dtT.getDate();
this.year = Y; this.month = M; this.date = D;
while (yc < oy.length - 1) {
var td = oy[yc++];
td.innerText = yy; td.year = yy;
if (yy == Y) td.className = "curYear"; else td.className = "";
if (yy == YT) td.style.textDecoration = "underline"; else td.style.textDecoration = "";
yy++;
}
for (var m = 0; m < 12; m++) {
var td = om[m]; td.innerText = (m + 1); td.month = m;
if (m == M) td.className = "curMonth"; else td.className = "";
if (Y == YT && m == MT) td.style.textDecoration = "underline"; else td.style.textDecoration = "";
}
for (var r = 1; r < 7; r++) {
var tds = odr[r].cells;
for (var c = 0; c < 7; c++) {
var td = tds[c], bDt = new Date(Y, M, SF++);
if (bDt.getMonth() != M) {
td.className = "otherMonth";
}
else {
if (bDt.getFullYear() == Y && bDt.getMonth() == M && bDt.getDate() == D) td.className = "curDate"; else td.className = "";
if (bDt.getFullYear() == YT && bDt.getMonth() == MT && bDt.getDate() == DT) td.style.textDecoration = "underline"; else td.style.textDecoration = "";
}
td.innerText = bDt.getDate(); td.date = bDt;
}
}
toZTop(dg);
}
po.selectDate = function (oriDate, tarObj) {
if (!oriDate.getTime) oriDate = new Date(oriDate);
if (isNaN(oriDate)) oriDate = new Date();
var a = this, d = a.dlg; a.oriDate = oriDate;
a.tarObj = tarObj; // if (this.dlg) { alert(this.dlg.parentNode); }
if (!d || !d.parentNode) { a.dlg = a.createDlg(); }
a.showDates(oriDate); a.showDlg(); a.dlg.focus();
}
po.closeDlg = function () { if (this.dlg) this.dlg.outerHTML = ""; delete this.dlg; }
po.showDlg = function (hide) { if (this.dlg) this.dlg.style.display = (hide ? "none" : ""); }
po.setName = function (nm) { this.name = nm; if (this.dlg) this.dlg.id = nm; }
po.evtHandle = function () {
var ev = GJT.event(), s = GJT.eventSrc(), ty = ev.type;
GJT.stopBubble();
if (ty == "click") {
var nDt;
if (s.year != undefined) nDt = new Date(s.year, this.month, this.date);
else if (s.month != undefined) nDt = new Date(this.year, s.month, this.date);
else if (s.date != undefined) this.setValue(s.date);
if (nDt) this.showDates(nDt);
if (s.className == "DlgCtrlClose") this.showDlg(true);
}
else if (ty == "mouseover") s.style.backgroundColor = "#eeeeee";
else if (ty == "mouseout") s.style.backgroundColor = "";
else if (ty == "keydown" && ev.keyCode == 27) this.showDlg(true);
}
po.setValue = function (nDt) {
GJT.stopBubble();
this.value = nDt;
if (this.selDoneHandle) {
if (this.selDoneHandle(this)) this.showDlg(true); ;
}
}
DateSelector._initialized = true;
}
this.name = name;
}


function DialogReviseWH(dgo,maxIt, byDraging,forceDo) {
var dg = dgo.dlg, st = dg.style, cst = GJT.getComputedStyle(dg), m = dgo.main, stm = m.style, cstm = GJT.getComputedStyle(m),
w = dgo.width, h = dgo.height, c = (m.children.length > 0 ? m.children[0] : null), fbh = floatBarsHeight();
if (st.position == "static" && !forceDo) return; //刻意指定
if (maxIt) { fbh = 0; w = GJT.getWindowWidth() - 4; h = GJT.getWindowHeight() - fbh - 4; }
var oc = dg.children[0], bw = oc.offsetLeft;
try {
if (typeof w == "string") st.width = w; else st.width = toPx(w);
if (typeof h == "string") st.height = h; else st.height = toPx(h);
} catch (e) { }
if (dg.clientWidth > bw * 2 && dg.clientHeight > 28 + bw) {
stm.width = toPx(dg.clientWidth - bw * 2 + 1); stm.height = toPx(dg.clientHeight - m.offsetTop - bw);
}
if (m.children.length == 1) {
if (c.tagName == "DIV" || c.tagName == "IFRAME") {
stm.overflow = "hidden";
c.style.width = "100%"; c.style.height = "100%";if(!dgo.overflow) c.style.overflow = "auto";
}
else if (c.tagName == "IFRAME") {
c.style.width = "100%"; c.style.height = "100%";
stm.overflow = "visible";//IFRAME 時本身不要捲軸
}
}
if (maxIt) { showObjAt(dg, 0, fbh); }
else if (dg.besideMouse) { showBesideMouse(dg, -dg.offsetWidth / 2); dg.besideMouse = 0; }
if (dgo.handleResize) {
var iv = dgo.__intvr;
if (iv) window.clearTimeout(iv);
iv = window.setTimeout(function () { dgo.handleResize(dgo); }, 20);
dgo.__intvr = iv;
//window.setTimeout(function () { dgo.handleResize(dgo); }, 20);
}
if (!byDraging && dgo.handleResizeDone) {
var iv = dgo.__intvdr;
if (iv) window.clearTimeout(iv);
iv = window.setTimeout(function () { dgo.handleResizeDone(dgo); }, 20);
dgo.__intvdr = iv;
//window.setTimeout(function () { dgo.handleResizeDone(dgo); }, 20);
}
}
function DialogInBody(name, text, width, height, container) {
this.width = width; this.height = height;
this.handleClose = null; this.handleResize = null; this.handleScroll = null;
this.handleEvent = null; this.handleShowed = null; this.handleResizeDone = null;
this.allowSelect = 1; this.isSubDialog = 1; this.besideMouse = 1;
if (DialogInBody._initialized == undefined) {
var po = DialogInBody.prototype;
po.moveTo = function (left, top, width, height, forceDo) {
var m = this;
if(forceDo) teSetOverflow(m.getClient(), "auto"); //如果是強制調整位置及大小
if (forceDo && width) m.width = width;
if (forceDo && height) m.height = height;
cmnMoveObjTo(m.dlg, left, top, width ? width : m.width, height ? height : m.height, forceDo);
if (forceDo) DialogReviseWH(m, 0, 0, forceDo);
//if (m.handleResize) m.handleResize(m);
//if (m.handleResizeDone) m.handleResizeDone(m);
}
po.moveToLT = function () {
var ns = GJT.getComputedStyle(BDY()), mt = teTopForDlg(), mL = parseIntD(ns.marginLeft, 0);
this.moveTo(mL, mt);
}
po.moveToRB = function () {
var h = GJT.getWindowHeight(), w = GJT.getWindowWidth(),mt=h-this.dlg.offsetHeight-3,mL = w-this.dlg.offsetWidth-3;
this.moveTo(mL, mt);
}
po.moveToRT = function () {
var w = GJT.getWindowWidth(), mt = teTopForDlg(), mL = w - this.dlg.offsetWidth - 6;
this.moveTo(mL, mt);
}
po.moveToLB = function () {
var h = GJT.getWindowHeight(), w = GJT.getWindowWidth(), mt = h - this.dlg.offsetHeight - 6, mL = 0;
this.moveTo(mL, mt);
}
po.moveToMouse = function (forInit) {//forInit初始化時才作用
if (forInit && this.BeenBesideMouse) return;
showBesideMouse(this.dlg);
this.BeenBesideMouse = 1;
}
po.moveBesideAnother = function (refDlg, location) {
//移到指定的對話框的旁邊
var d0 = this.dlg, d1 = refDlg.dlg;
var sftL = 0;
if (location == "L") sftL = -(d0.offsetWidth + d1.offsetWidth);
showBeside(d0, d1, sftL);
}
po.setCustomMenus = function (itms) {
var m = this; m.customMenus = itms;
var o = getEmByClass(m.captionArea, "customMens");
if (!o) {
o = m.captionArea.appendChild(newEm("B"));
o.className = "customMenus";
o.onclick = function () { m.execCustomMenus.call(m); };
}
}
po.execCustomMenus = function () {
SysShowMenu(this.customMenus);
}
po.createDlg = function (cntr) {
var m = this;
if (m.dlg) throw "Dialog had been created!";
if (!cntr) cntr = BDY();
var h = ["<div class='teDialog' style='overflow:hidden' id='", m.name, "'><div class='caption'><b class='Close' style='float:right' ", i18htmTitle2(i18nm.CloseThisDialog),
" >x</b><b class='MinDlg' title='Shrink Dialog' style='font-weight:bold'>-</b>"];
if (mIsMobileDev) {
h.push("<b ism4='Y' title='Move Position'>M</b>");
h.push("<b iss4='Y' title='Resize Dialog'>Rs</b>");
}
h.push(m.text); h.push("</div><div class='Area' isArea='Y' onscroll='this.ctrl._hndScroll();'></div></div>"); //"<b class='btnMaxDlg'></b><b class='btnMinDlg'>-</b>"
var o = addE(h.join(""), cntr);
m.dlg = o; m.captionArea = getEmByClass(o, "caption");
m.container = o;//必須要有container才能夠被layout dispatcher控制排列
m.main = getChiHasAtr(o, "isArea");
o.controller = this;
if (o.addEventListener) o.addEventListener("click", function () { m._hndFocus.call(m); }, true);
m.main.ctrl = this;
if (m.width) o.style.width = toPx(m.width); if (m.height) o.style.height = toPx(m.height);
var evh = this.evtHandle, rf = this, er = function () { evh.call(rf); }; this.evh2 = er;
setEvtHandleAll(o, er);
//m.main.onscroll = er;
//GJT.eventAddHandle(m.main, "scroll", er);
//if (GJT.browserType == BWRT.IE) hideIt(getChiHasAtr(o, "isFx"));
}
po._hndFocus = function () {
var m = this;
if (m.handleFocus) m.handleFocus(m);
}
po._hndScroll = function () {
if (this.handleScroll) this.handleScroll(this, this.main);
}
po.setModal = function (isModal) {
var id = "gleu_$fos_znlh", bgo = document.getElementById(id), bdy = BDY(); ;
if (isModal) {
if (!bgo) bgo = addEm("<span class='BKPNL2' id='" + id + "' style='border:1px;width:100%;height:100%;background-color:#dddddd;left:0px;top:0px;opacity:0.5;filter:alpha(opacity=0.5);'></span>");
var s = bgo.style, w = bdy.scrollWidth, h = bdy.scrollHeight, w2 = GJT.getWindowWidth(), h2 = GJT.getWindowHeight();
if (w < w2) w = w2; if (h < h2) h = h2;
showObjAt(bgo, GJT.getWindowScrollLeft(), GJT.getWindowScrollTop(), GJT.getWindowWidth(), GJT.getWindowHeight());
showObjAt(bgo, 0, 0, w, h);
//s.width=toPx(w);s.height=toPx(h);
var dg = this.dlg, ino, tgs = ["INPUT", "TEXTAREA", "SELECT", "BUTTON"];
for (var i = 0; i < tgs.length; i++) {
ino = getEM(dg, tgs[i])[0]; if (ino) break;
}
showIt(bgo); toZTop(bgo); toZTop(dg);
if (ino)ino.focus();
}
else hideIt(bgo);
showItA(getEmByClass(this.captionArea, "MinDlg"), !isModal);
}
po.setClient = function (content) {
if (!this.main) return;
var o = this.dlg, m = this.main, chrn = m.children, c = content, orf = this;
while (chrn.length > 0) { m.removeChild(chrn[0]); }
if (typeof c == "string") {
var d = newEm("div"); d.innerHTML = c; c = d.children[0];
}
m.appendChild(c);
window.setTimeout(function () { DialogReviseWH(orf) }, 50);
}
po.getClient = function () { return this.main.children[0]; };
po.evtHandle = function () {
var ev = GJT.event(); if (!ev) return; var o = GJT.eventSrc(), ty = ev.type;
if (this.isSubDialog) GJT.stopBubble();
if (ty == "mousemove") {
var dg = this.dlg, cst = GJT.getComputedStyle(dg), bw = dg.children[0].offsetLeft, doResize = 0;
var ns = GJT.getComputedStyle(BDY()), mt = teTopForDlg(), mL = parseIntD(ns.marginLeft, 0);
if (GJT.isButtonDownLeft()) {
if (GJT.draging != this) return;
if (this.cx != undefined) {
var x = ev.clientX, y = ev.clientY, dx = x - this.cx, dy = y - this.cy,
cs = this.cursor, st = dg.style, m = this.main, dim = this.dim, sm = m.style,
l = dim[0], t = dim[1], w = dim[2], h = dim[3];
if (dx != 0) {
if (cs == "e-resize" || cs == "ne-resize" || cs == "se-resize") { if (w + dx > 10) this.width = w + dx; doResize = 1; }
else if (cs == "w-resize" || cs == "nw-resize" || cs == "sw-resize") { if (w - dx > 10) { st.left = toPx(l + dx); this.width = w - dx; doResize = 1; } }
else if (cs == "move") { if (l + dx < mL) dx = mL - l; st.left = toPx(l + dx); this.beenMoved = 1; }
}
if (dy != 0) {
if (cs == "s-resize" || cs == "se-resize" || cs == "sw-resize") {
if (h + dy > 10) { this.height = h + dy; doResize = 1; if (!this.width) this.width = this.dlg.offsetWidth; }
} else if (cs == "n-resize" || cs == "nw-resize" || cs == "ne-resize") {
if (t + dy < mt) dy = mt - t + 0;
if (h - dy > 10) { st.top = toPx(t + dy); this.height = h - dy; doResize = 1; if (!this.width) this.width = this.dlg.offsetWidth; }
} else if (cs == "move") {
if (t + dy < mt) dy = mt - t + 0; st.top = toPx(t + dy); this.beenMoved = 1;
}
}
if (doResize) { DialogReviseWH(this, 0, 1); this.userResized = true;}
}
}
else {
var st = o.style, x = evtOffsetX(ev), y = evtOffsetY(ev), w = o.offsetWidth, w2 = w / 2, h = o.offsetHeight, h2 = h / 2, k = 16;
if (o == dg) {
if (this.isEmbeded) { }
else if ((x <= bw && y <= k) || (y <= bw && x <= k)) st.cursor = "nw-resize";
else if ((x <= bw && y >= (h - k)) || (y >= (h - bw) && x <= k)) st.cursor = "sw-resize";
else if (x <= bw) st.cursor = "w-resize";
else if ((x >= (w - bw) && y <= k) || (x >= (w - k) && y <= bw)) st.cursor = "ne-resize";
else if ((x >= (w - bw) && y >= (h - k)) || (x >= (w - k) && y >= (h - bw))) st.cursor = "se-resize";
else if (x >= (w - bw)) st.cursor = "e-resize";
else if (y <= (bw)) st.cursor = "n-resize";
else if (y >= (h - bw)) st.cursor = "s-resize";
else if (y < 24) st.cursor = "move";
else st.cursor = "";
this.cursor = st.cursor;
}
else if (o.className == "caption" && !dg.IsFixed && x > 16) {
dg.style.cursor = "move"; this.cursor = "move";
}
else {
dg.style.cursor = ""; this.cursor = "";
}
}
}
else if (ty == "mousedown") {
var x = ev.clientX, y = ev.clientY, er = this.evh2, dg = this.dlg, m = this.main, chi = this.main.children[0], bdy = BDY(), htm = teHtm();
if (GJT.isButtonDownLeft() && (o == this.dlg || o.className == "caption")) {
//if (ev.offsetX < 16 && ev.offsetY < 16 && o.className == "caption"){return this.showCtrlItems();}
this.cx = x; this.cy = y;
addEVt4Drag(htm, er, 1);
this.dim = [dg.offsetLeft, dg.offsetTop, dg.offsetWidth, dg.offsetHeight];
GJT.isDraging = 1;
if (!GJT.draging) GJT.draging = this; //avoid bubble up
if (chi && chi.tagName == "IFRAME") {
var win = self.frames[chi.id];
if (win && 0) {
var bd2 = win.document.body;
addEVt4Drag(bd2, er);
}
else chi.style.display = "none";
}
}
}
else if (ty == "mouseup") {
var bdy = BDY(), htm = teHtm(), er = this.evh2, chi = this.main.children[0];
delete this.cx;
if (chi) chi.style.display = "";
rmvEvt4Drag(htm, er, 1);
GJT.isDraging = 0;
GJT.draging = null;
if (chi && chi.tagName == "IFRAME") {
var win = self.frames[chi.id];
if (win && 0) {
var bd2 = win.document.body;
rmvEvt4Drag(bd2, er);
}
else chi.style.display = "";
}
if (this.cursor && this.cursor.indexOf("resize")>0 && this.handleResizeDone) this.handleResizeDone(this);
}
else if (ty == "selectstart" && !this.allowSelect) { cmnEvtSetReturn(false); return false;}
else if (ty == "click") {
MenuHide();
if (ev.offsetX < 16 && ev.offsetY < 16 && o.className == "caption") { return this.showCtrlItems(); }
if (o.className == "Close") this.close();
else if (o.className == "caption" || o == this.dlg) toZTop(this.dlg);
else if (o.className == "FixLoc") this.FixLoc();
else if (getAtr(o, "issa") == "Y") selectElementContents(this.main);
else if (o.className == "MinDlg") {
this.minMe();
}
else if (getAtr(o, "ism4") == "Y") this.moveBD();
else if (getAtr(o, "iss4") == "Y") this.resizeBD();
}
else if (ty == "keydown" && GJT.eventKeyCode(ev) == 27) this.close();
else if (ty == "scroll") {//no use,
if (this.handleScroll) this.handleScroll();
}
else if (ty == "dblclick") {
if (o.className == "caption") this.maxMe();
}
if (this.handleEvent) this.handleEvent();
}
po.FixLoc = function () {
var dg = this.dlg, st = dg.style;
if (dg.IsFixed == undefined) { st.position = "fixed"; dg.IsFixed = 1; }
else { st.position = "absolute"; delete dg.IsFixed; }
}
po.showCtrlItems = function () {
var m = this,itms = new OpItems();
itms.onclick = m.CtrlItemsClick; itms.tar = m;
itms.add(newITM("minD", i18nm.MinizeDialog.text, i18nm.MinizeDialog.tip));
if (m.maxed) itms.add(newITM("RstD", i18nm.RestoreDialog.text, i18nm.RestoreDialog.tip));
else itms.add(newITM("maxD", i18nm.MaximizeDialog.text, i18nm.MaximizeDialog.tip));
itms.add(newITM("issa", i18nm.SelAll.text, i18nm.SelAll.tip));
itms.add(newITM("FixLoc", i18nm.FloatingThisDialog.text + (m.dlg.IsFixed ? " X" : ""), i18nm.FloatingThisDialog.tip));
itms.add(newITM("MoveLT","Move to Left Top", ""));
itms.add(newITM("autoSize","Auto Size", ""));
itms.add(NIT("-", "-"));
itms.add(newITM("ClsD", i18nm.CloseThisDialog.text, i18nm.CloseThisDialog.tip));
SysShowMenu(itms);
}
po.CtrlItemsClick = function (itm, itms, menuObj) {
var m = itms.tar, nm = itm.name;
if (nm == "minD") m.minMe();
if (nm == "maxD") m.maxMe();
if (nm == "RstD") m.maxMe();
if (nm == "ClsD") m.close();
if (nm == "FixLoc") m.FixLoc();
if (nm == "MoveLT") m.moveToLT();
if (nm == "issa") selectElementContents(m.main);
if (nm == "autoSize") m.fitSize();
}
po.toZTop = function () { var o = this.dlg; if (this.isEmbeded) toZTopC(o); else toZTop(o); }
po.maxMe = function () {
var m = this, dg = m.dlg,dgst=dg.style; if (m.mini) return;
if (m.maxed) { rmvAtr(dg, "maxed"); delete m.maxed; m.width = m._oriW; m.height = m._oriH; DialogReviseWH(m); dgst.left = m._oriL; dgst.top = m._oriT; }
else {
m._oriL = dgst.left; m._oriT = dgst.top;
if (!m._oriW) m._oriW = dg.offsetWidth;
if (!m._oriH) m._oriH = dg.offsetHeight;
m.maxed = 1; setAtr(dg, "maxed", "1"); showIt(m.main); DialogReviseWH(m, 1);
}
}
po.minMe = function (forceMin) {
var m = this, fm = forceMin;
var fps = PROG.floatPanels;
if (fps && fps[0]) {
var icon = m.icon;
if (!icon) {
icon = addE("<div class='DialogIcon' />", fps[0]);
icon.innerText = m.text;
icon.title = m.text;
m.icon = icon;
icon.onclick = function () { m.minMe.call(m); };
}
var dg = m.dlg, stx;
if (m.mini && !fm) {
delete m.mini;
showIt(dg); stx = "white"; m.toZTop();
}
else {
m.mini = 1;
hideIt(dg); stx = "";
}
icon.style.color = stx;
teOnBodyResize();
return true;
}
if (m.maxed && !fm) return;
if (m.mini && !fm) {
m.width = m._oriW;
m.height = m._oriH;
showIt(this.main);
delete m.mini;
} else {
if (!fm || m._oriW == null) m._oriW = m.width; // ? m.width : m.dlg.offsetWidth;
if(!fm || m._oriH == null) m._oriH = m.height ? m.height : m.dlg.offsetHeight;
var oc = getEmByClass(m.dlg, "caption");
m.height = oc ? oc.offsetHeight + 8 : 30;
hideIt(this.main);
m.mini = 1;
}
DialogReviseWH(this);
return true;
}
po.scrollToVisible = function (tar) {
if (!tar) tar = this.dlg;
//tar.parentElement.scrollTop = tar.offsetTop;
tar.scrollIntoView();
}
po.setCaption = function (text) {
var m = this, os = getEmByClass(m.dlg, "caption").childNodes; //childNodes
for (var i = 0; i < os.length; i++) {
if (os[i].nodeName == "#text") { os[i].nodeValue = text; break; }
}
m.text = text;
}
po.setVisible = function (visible) { return this.showMe(!visible, 1); }
po.showMe = function (hideMe, noRevWH) {
var m = this, s = !hideMe;
if (!s && m.icon) { return m.minMe(); }
if (noRevWH && m.mini) return; //最小化狀態不要變動
showItA(m.dlg, s);
//showItA(m.main.children[0], s);
if (s && !noRevWH) { DialogReviseWH(m); delete m.mini; }
if (m.handleShowed && s) m.handleShowed();
return true;
}
po.isDestroyed = function () {
if (!getObjByTagNameBubble(this.main,"BODY")) return true;//沒有父階了
}
po.isHidden = function () { return isHidden(this.dlg) || isHidden(this.main.children[0]); }
po.close = function (force) {
var m = this;
if (m.handleClose) { if (m.handleClose(m, force) && !force) return; } //let handler control close behave
var dg = m.dlg; m.setModal(false); dg.controller = null;
dg.parentNode.removeChild(dg); delete dg;
if (m.icon) { m.icon.parentNode.removeChild(m.icon); delete m.icon; teOnBodyResize(); }
}
po.glitter = function () {
//自動閃爍幾秒鐘 讓使用者容易發現本對話框,用timer & interval,改變整個背景顏色
var m = this, dg = m.dlg;
dg.style.animationName = "DialogGlitter";
dg.style.animationDuration = "0.5s";
dg.style.animationIterationCount = 10;
}
po.fitSize = function (forEnlarge, forInit) {//forEnlarge:如果當下的框框已經比需要的大就不縮小,forInit 只在使用者沒有手動調整過大小時才作用
var m = this, n = m.main; if (isHidden(m.dlg) || isHidden(n)) return;
if (forInit && m.userResized) return;
var ns = n.style, ds = m.dlg.style, ow = n.offsetWidth, oh = n.offsetHeight; ns.width = "auto"; ns.height = "auto";
window.setTimeout(function () {
var h = n.scrollHeight, w = n.scrollWidth, wwd = GJT.getWindowWidth() - 20, whg = GJT.getWindowHeight() - floatBarsHeight() - 80;
if (h > whg) h = whg;
if (w > wwd) w = wwd;
if (forEnlarge) {
if (h < oh) h = oh;
if (w < ow) w = ow;
}
ns.width = toPx(w); ns.height = toPx(h);
teSetOverflow(n, "auto");//為了IE 的-ms-overflow-x y 的問題
ds.width = ""; ds.height = "";
m.width = null; m.height = null;
if (m.handleResize) m.handleResize(m);
if (m.handleResizeDone) m.handleResizeDone(this);
if(!m.beenMoved) makeSureInsideWindow(m.dlg);
}, 100);
}
po.moveBD = function (c) {
var m = this, o = new teShaft(BDY(), null, m, 0, "Move"); showBesideMouse(o, 0, 0, true);
o.onclick = function (c) { m.moveDo(c); };
}
po.moveDo = function (c) {
var m = this;
if (c.indexOf("L") > -1) m.moveLR(-50);
if (c.indexOf("R") > -1) m.moveLR(50);
if (c.indexOf("U") > -1) m.moveUD(-50);
if (c.indexOf("D") > -1) m.moveUD(50);
}
po.moveLR = function (c) { var m = this, n = m.dlg, ns = n.style, l = n.offsetLeft; ns.left = toPx(l + c); }
po.moveUD = function (c) { var m = this, n = m.dlg, ns = n.style, l = n.offsetTop; ns.top = toPx(l + c); }
po.resizeBD = function () {
var m = this, o = new teShaft(BDY(), null, m, 0, "Resize"); showBesideMouse(o, 0, 0, true);
o.onclick = function (c) { m.resizeDo(c); };
}
po.resizeDo = function (c) {
var m = this;
if (c.indexOf("L") > -1) m.resizeW(-50);
if (c.indexOf("R") > -1) m.resizeW(50);
if (c.indexOf("U") > -1) m.resizeH(-50);
if (c.indexOf("D") > -1) m.resizeH(50);
}
po.resizeW = function (c) { var m = this, n = m.dlg, ns = n.style, l = n.offsetWidth; ns.width = toPx(l + c); DialogReviseWH(this); }
po.resizeH = function (c) { var m = this, n = m.dlg, ns = n.style, l = n.offsetHeight; ns.height = toPx(l + c); DialogReviseWH(this); }
po.embedInto = function (cntr) {//嵌入到指定的容器內
var m = this, n = m.dlg,nst=n.style, man = m.main;
if (cntr) m._lastCntr = cntr; //上一個嵌入的容器
else cntr = m._lastCntr;
if (!cntr) return;
if (!m._oriCntr) {
m._oriCntr = n.parentNode; m._oriNxSB = n.nextSibling;
m._oriCSS = n.style.cssText;
m._oriClassName = n.className;
m._oriPosition = n.style.position;
}
n.className = "";n._orbc =nst.backgroundColor;
nst.position = "static"; nst.backgroundColor = "white";
cntr.appendChild(n);
var st = man.style;
st.height = "auto";
hideIt(m.captionArea);
teSetOverflow(man, "visible");
m.isEmbeded = true;
}
po.embedEscape = function () {
var m = this, n = m.dlg,nst=n.style;
if (m._oriCntr) {
if (n.parentNode != m._oriCntr) m._oriCntr.appendChild(n);
delete m._oriCntr;
}
else return;
if (m._oriCSS) nst.cssText = m._oriCSS;
n.className = m._oriClassName;
nst.backgroundColor = n._orbc;
nst.position = m._oriPosition;
delete m._oriClassName; delete m._orbc; delete m._oriPosition;
showIt(m.captionArea);
m.isEmbeded = false;
}
po.setBorderColor = function (newColor) {
var m = this, n = m.dlg;
n.style.backgroundColor = newColor;
var ns = GJT.getComputedStyle(n);
var c = ns.backgroundColor;
if (c.indexOf("(") > 0) {
var cp = c.split("(")[1].split(")")[0].split(","), isDark = 1, cptst = m.captionArea.style;
for (var i = 0; i < cp.length; i++) {
cp[i] = parseInt(cp[i], 10);
if (cp[i] > 24) cp[i] -= 24; else cp[i] += 24;
if (cp[i] > 125) isDark = 0;
}
cptst.backgroundColor = "rgb(" + cp[0] + "," + cp[1] + "," + cp[2] + ")";
cptst.color = isDark ? "#ffffff" : "";
}
}
DialogInBody._initialized = true;
}
if (!text) text = " ";
this.name = name; this.text = text;
this.createDlg(container);
}


function Dialog4Qry(sur) {
if (Dialog4Qry._initialized == undefined) {
var po = Dialog4Qry.prototype;
po.createContents = function () {
var m = this, ot = newEm("div"), o = addChi(ot, "div"), ob = addChi(ot, "div"), g = m.ctrl, st = ob.style;
st.textAlign = "right"
m.valCtnr = o;
o.style.width = "100%";
var evRef = g.evtCriterionArea, er = function () { evRef.call(g); }, btn;
setEvtHandleAll(o, er);
btn = addChi(ob, "button"); btn.innerText = i18nm.ArrangeQryFields.text; btn.onclick = function () { m.ArrangeFields.call(m); };
m.btnArgnFlds = btn;
btn = addChi(ob, "button"); btn.innerText = i18nm.ClearCriterion.text; btn.onclick = function () { m.clear.call(m); };
btn = addChi(ob, "button"); btn.innerText = i18nm.OK.text; btn.onclick = function () { m.ok.call(m); }; //btn.style.float="right";
btn = addChi(ob, "button"); btn.innerText = i18nm.Cancel.text; btn.onclick = function () { m.close.call(m); };
m.rvsFlds(o);
st.marginBottom = "10px"; st.paddingRight = "3px"; st.marginTop = "10px";
return ot;
}
po.rvsFlds = function (o) {
if (!o) o = this.valCtnr;
o.innerHTML = "";
var m = this, c = m.ctrl, fa = c.fieldsAll; if (!fa) return;
fa = fa.collect(null, 0, GIA.QueryDenied, 1);
fa = fa.collect(null, 0, GIA.Virtual, 1);
m.fa = fa;
var qf = c.flds4QDlg, vaQ = c._lastQCT(); if (qf) fa = fa.collect(qf);
var tb = addChi(o, "table"), tr, td, o2, st, flds = new OpItems();
tb.style.width = "100%";
for (var i = 0; i < fa.length; i++) {
var itm = fa[i];
flds.add(itm);
var qryV = c._cvtQryVal(vaQ, itm.name);
if ((i % 2) == 0) tr = addChi(tb, "tr");
td = addChi(tr, "td"); td.innerText = itm.text + ":"; td.style.textAlign = "right";
td = addChi(tr, "td"); o2 = addChi(td, "input");
setAtr(o2, "tarFld", itm.name);o2._tarFld=itm;
o2.forQry = 1;
o2.value = qryV;
o2.onfocus = o.onfocus;
if (ValueCanChoose(itm)) {
setAtr(o2, KW.Choice, itm.choice); setAtr(o2, KW.ControllerId, itm.ctrlId); setAtr(o2, KW.opDataType, itm.dataType);
addValPickButton(o2);
}
if (i > 30) {
var txt = i18nm.msgFieldsExceed_N_ReviseIt.text;
txt = txt.replace("%1", (i + 1) + "").replace("%2", m.btnArgnFlds.innerText);
o.appendChild(document.createTextNode(txt));
break;
}
}
m.FieldsShw = flds;
}
po.ArrangeFields = function () {
var m = this, g = m.ctrl, fa = m.fa, qryfs = g.flds4QDlg;
var so = selItems("selFlds", i18nm.ArrangeQryFields.text, fa, m.FieldsShw.collect(), 600, 550, m.prcsSetFlds, 1); //name,text, itmsAll, itmsSel, width, height, handleDone, shwAllItems
so.tarObj = m;
dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
//so.setModal(true);
}
po.prcsSetFlds = function (selector) {
var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, g = m.ctrl;
fs = itmsSel.getNames(","); g.flds4QDlg = fs;
teSaveUserSetting(g.grid, "flds4QDlg", fs);
m.rvsFlds();
}
po.setHistQryVal = function (vaQ) {
var m = this, ns = getEM(m.valCtnr, "INPUT"), c = m.ctrl;
for (var i = 0; i < ns.length; i++) {
if (ns[i].type == "text") {
var itm = ns[i]._tarFld;
if (itm) ns[i].value = c._cvtQryVal(vaQ, itm.name);
}
}
}
po.getQryCriterion = function () {
return this.ctrl.getQryCriterion(this.valCtnr.getElementsByTagName("INPUT"));
}
po.clear = function () {
var ns = this.valCtnr.getElementsByTagName("INPUT");
for (var i = 0; i < ns.length; i++) {
if (ns[i].type == "text") ns[i].value = "";
}
}
po.ok = function () {
var m = this, ctrn = m.getQryCriterion();
if (m.baseCriteria) {//有預先帶入查詢條件,所以要把對話框的條件加入
var crnA = m.baseCriteria,fls=ctrn.filters;
for (var i = 0; i < fls.length; i++) {
crnA.filters.add(fls[i]);
}
m.ctrl.query(crnA, m.cntType);
}
else m.ctrl.queryByUser(ctrn);
m.close();
}
po.close = function () {
this.dlgCtrl.close();
delete this.dlgCtrl;
}
Dialog4Qry._initialized = true;
}
var m = this; m.ctrl = sur;
var dg = new DialogInBody("advQry", i18nm.Query.text + " " + sur.text);
m.dlgCtrl = dg;
dg.setClient(m.createContents());

} //end Dialog4Qry


function ItemsSelector(name, text, itemsAll, itemsSel, width, height, container, shwAllItems, freeRemove, shwFieldName) {
//name,text,width,height,container
//DialogInBody.call(this, name, text, width, height, container);
if (!text) text = "Items Selector";
this.handleForOK = null; this.handleForCancel = null;
this.bShwAllItems = shwAllItems;
this.bFreeRemove = freeRemove;
this.shwFieldName = shwFieldName;
if (ItemsSelector._initialized == undefined) {
var po = ItemsSelector.prototype;
po.createContents = function (container) {
var m = i18nm, t1 = "<li class='", t2 = "</li>", c = ["MoveToTop", "MoveUp", "MoveDown", "MoveToBottom",
"SelAll", "AddInto", "Remove", "OK", "Cancel"]; //, "SortA", "SortD", "SortNone"
for (var i = 0, k = c.length; i < k; i++) {
c[i] = t1 + c[i] + "' >" + eval("i18nm." + c[i] + ".text") + t2;
}
var h = ["<table class='ItemsSelector' width='100%' height='100%' cellpadding=\"0\"><tr ><td style=\"height:20px;\" nowrap><input type='checkbox' class='CheckNotSelOnly' />", i18nm.chkShowOnlyNotSelected.text, "<span id='hintCntAll'></span></td><td nowrap></td><td nowrap>", i18nm.SelectedItems.text, "<span id='hintCntSel'></span></td></tr>",
"<tr><td width='45%' nowrap><select isAllItems='Y' multiple='multiple'></select></td>",
"<td style=\"width:20px;\" class='CommandArea'>", "<ul>", c.join(""), "</ul>",
"</td><td width='45%' nowrap><select isSelectedItems='Y' multiple='multiple'></select></td></tr>",
"<tr ><td style=\"height:20px;\" nowrap colspan=3 forMsg='Y'> </td></table>"],
o = addEm(h.join(""), null, container), sels = o.getElementsByTagName("SELECT");
this.listBoxAll = sels[0]; this.listBoxSel = sels[1]; //this.buttonOK=getEmByClass(o,"OK");this.buttonCancel=getEmByClass(o,"Cancel");
this.contents = o; this.showList(); this.msgBar = getChiHasAtr(o, "forMsg", "Y");
var evh = this.evtHandle, rf = this, er = function () { evh.call(rf); }; this.evh2 = er;
setEvtHandleAll(o, er);
sels[0].onfocus = er; sels[1].onfocus = er;
return o;
}
po.showList = function () {
var o = this.contents, chk = getEmByClass(o, "CheckNotSelOnly"), c = chk.checked, hasTip, dck = GJT.newDictionary(), noH = !this.bShwAllItems, swn = this.shwFieldName;
if (c) {
var se = this.listBoxSel, chrn = se.children;
for (var i = 0, k = chrn.length; i < k; i++) {
var itm = chrn[i].surItem; dck.add(itm.name, itm);
}
}
for (var h = 0; h < 2; h++) {
var se = (h == 0 ? this.listBoxAll : this.listBoxSel), itms = (h == 0 ? this.itemsAll : this.itemsSelected), dict, chrn = se.children;
//if (GJT.browserType == BWRT.IE) se.style.display = "none";
dict = GJT.newDictionary();
for (var i = 0, k = se.length; i < k; i++) {
var opn = chrn[i], id = opn.surItem.name;
dict.add(id, opn);
}
while (se.hasChildNodes()) { se.removeChild(se.lastChild); }
for (var i = 0, k = itms.length; i < k; i++) {
var itm = itms.item(i), opn = dict.item(itm.name), oCfg = itm.opConfig; ;
if (h == 0 && c && dck.item(itm.name)) continue;
if (noH && hasBit(oCfg, GIA.Hidden)) continue;
if (noH && hasBit(oCfg, GIA.OutPutDenied)) continue;
if (!opn) { opn = newEm("option"); opn.id = itm.name; }
opn.innerText = itm.text + ((swn && itm.fieldName) ? " - " + itm.fieldName : ""); opn.value = itm.value; opn.surItem = itm;
if (!hasTip) hasTip = (itm.tip != null);
se.appendChild(opn);
}
var ohn = GJT.getChildById(this.contents, h == 0 ? "hintCntAll" : "hintCntSel");
this._hintCount(se);
//if (GJT.browserType == BWRT.IE) se.style.display = "";
}
showItA(o.rows[2], hasTip);
}
po._hintCount = function (se) {
var ohn = GJT.getChildById(this.contents, (se == this.listBoxAll) ? "hintCntAll" : "hintCntSel");
if (ohn) ohn.innerText = " (" + se.children.length + ")";
}
po.evtHandle = function () {
var ev = GJT.event(); if (!ev) return; var o = GJT.eventSrc(), ty = ev.type;
if (ty == "mousedown") {
if (o.tagName == "LI") borderDown(o);
}
else if (ty == "mouseup") {
if (o.tagName == "LI") borderUp(o);
}
else if (ty == "click") {
var cn = o.className, me = this;
if (cn && o.tagName == "LI") {
if (cn == "MoveToTop") me.MoveToTop();
else if (cn == "MoveToBottom") me.MoveToBottom();
else if (cn == "MoveUp") me.MoveUp();
else if (cn == "MoveDown") me.MoveDown();
else if (cn == "SelAll") me.SelAll();
else if (cn == "AddInto") me.AddInto();
else if (cn == "Remove") me.Remove();
else if (cn == "OK") me.OK();
else if (cn == "Cancel") me.Cancel();
}
else if (cn == "CheckNotSelOnly") this.showList();
}
else if (ty == "dblclick") {
if (o == this.listBoxAll) this.AddInto();
else if (o == this.listBoxSel) this.Remove();
}
else if (ty == "focus") {
if (this.listBoxAll == o || this.listBoxSel == o) this.curListBox = o;
}
}
po.OK = function () {
var ls = this.listBoxSel, chrn = ls.children, itms = this.itemsSelected;
if (!itms) { itms = new OpItems(); this.itemsSelected = itms; } else itms.clear();
for (var i = 0, k = chrn.length; i < k; i++) {
itms.add(chrn[i].surItem);
}
if (this.handleForOK && this.handleForOK(this)) return;
this.dlgCtrl.close();
}
po.Cancel = function () {
if (this.handleForCancel && this.handleForCancel(this)) return;
this.dlgCtrl.close();
}
po.MoveToTop = function () {
var ls = this.listBoxSel; this.MoveItems(ls, -ls.options.length);
}
po.MoveUp = function () { this.MoveItems(this.listBoxSel, -1); }
po.MoveDown = function () { this.MoveItems(this.listBoxSel, 1); }
po.MoveToBottom = function () {
var ls = this.listBoxSel; this.MoveItems(ls, ls.options.length);
}
po.SelAll = function () {
var ls = this.curListBox;
if (!ls) return;
var c = ls.children;
for (var i = 0; i < c.length; i++) {
c[i].selected = true;
}
}
po.AddInto = function () {
var l1 = this.listBoxAll, l2 = this.listBoxSel, n1 = l1.children, n2 = l2.children, k = n2.length, swn = this.shwFieldName;
for (var i = 0; i < n1.length; i++) {
if (!n1[i].selected) continue;
var itm = n1[i].surItem, added = false;
for (var j = 0; j < k; j++) {
if (n2[j].id == n1[i].id) {
added = true; n2[j].selected = true; break;
}
}
if (added) continue;
var nn = newEm("option");
nn.id = itm.name; nn.innerText = itm.text + ((swn && itm.fieldName) ? " - " + itm.fieldName : ""); nn.surItem = itm;
l2.appendChild(nn); nn.selected = true;
this.itemsSelected.add(itm);
}
this._hintCount(l2);
}
po.Remove = function () {
var m = this, l1 = m.listBoxSel, l2 = m.listBoxAll, n1 = l1.children, n2 = l2.children, k = n2.length, sg = m.msgBar;
if (sg) sg.innerText = "";
for (var i = n1.length - 1; i >= 0; i--) {
if (!n1[i].selected) continue;
var itm = n1[i].surItem, oCfg = itm.opConfig;
for (var j = 0; j < k; j++) {
if (n2[j].id == n1[i].id) {
n2[j].selected = true; break;
}
}
if (!m.bFreeRemove && hasBit(oCfg, GIA.RemoveDenied)) { if (sg) sg.innerText = "Remove Denied!"; continue; }
l1.removeChild(n1[i]);
this.itemsSelected.remove(itm.name);
}
this._hintCount(l1);
}
po.MoveItems = function (tarlistBox, steps) {
if (!steps) return;
//if (GJT.browserType == BWRT.IE) tarlistBox.style.display = "none";
var ls = tarlistBox, chrn = ls.children, opn, aa = [], L2 = chrn.length; if (chrn.length == 0) return;
for (var i = 0, k = chrn.length; i < k; i++) {
opn = chrn[i]; if (opn.selected) { aa.push([opn, i]); }
}
var k = aa.length, sft = 0;
if (steps < 0) {
for (var i = 0; i < k; i++) {
var ix = aa[i][1] + steps; if (ix < 0) ix = sft++; else ix += sft;
if (ix < aa[i][1]) ls.insertBefore(aa[i][0], chrn[ix]);
}
}
else {
for (var i = k - 1; i >= 0; i--) {
var ix = aa[i][1] + steps; if (ix > L2 - 1) ix = L2 - 1 + sft--; else ix += sft;
if (ix >= L2 - 1) ls.appendChild(aa[i][0]);
else ls.insertBefore(aa[i][0], chrn[ix + 1]);
}
}
//if (GJT.browserType == BWRT.IE) tarlistBox.style.display = "";
if (ls == this.listBoxSel) {
var itms = this.itemsSelected; itms.clear(), chrn = ls.children;
for (var i = 0, k = chrn.length; i < k; i++) {
itms.add(chrn[i].surItem);
}
}
}
po.setModal = function (isModal) {
this.dlgCtrl.setModal(isModal);
}
po.resizeList = function () {
//if (GJT.browserType != BWRT.IE)return;
var s1 = this.listBoxAll, s2 = this.listBoxSel, st1 = s1.style, st2 = s2.style;
st1.height = "100%"; st2.height = "100%"; var h = s1.parentNode.clientHeight;
var e1 = s1.parentNode.getBoundingClientRect(); h = parseInt(e1.bottom - e1.top, 10);
//showIt(s1);showIt(s2);
st1.height = toPx(h); st2.height = toPx(h);
//window.setTimeout(function () {st1.height = toPx(h);st2.height = toPx(h);}, 20);
}
ItemsSelector._initialized = true;
}
this.itemsAll = itemsAll; this.itemsSelected = itemsSel;
var dg = new DialogInBody(name, text, width, height, container);
this.dlgCtrl = dg;
this.allowSelect = 0; dg.isSubDialog = 0; dg.besideMouse = 1;
var evh = this.resizeList, rf = this, er = function () { evh.call(rf); };
dg.setClient(this.createContents(dg.main));
dg.handleResize = er;
}

function GridValueSelector(myGridEdit, aryTarFields, dlgTitle, handleOK, handleCancel, width, height) {
if (GridValueSelector._initialized == undefined) {
var po = GridValueSelector.prototype;
po.setModal = function (isModal) {
this.dlgCtrl.setModal(isModal);
}
po.showMe = function (hideMe,noRvsWH) {
this.dlgCtrl.showMe(hideMe, noRvsWH);
}
po.evt4GridDblClick = function(){
var ge = this.GridEdit, td=GJT.eventSrc();//如果選取的格子可編輯就直接return
if (ge._beginEdit(td, false, ""))return;
this.evtOK();
return 1;
}
po.evtOK = function (byPool,insInto,noClose) {
var ge = byPool ? this.gePool : this.GridEdit, res = [], tf = this.tarFields, oTbl = ge.grid, fa = ge.fieldsAll, fshw;
if (!tf || tf.length == 0) {
fshw = ge.getFields();
if (fshw) tf = [fshw[0]];
else tf = [fa[0]];
}
for (var i = 0; i < tf.length; i++) {
res[i] = ge.getFieldValues(tf[i].name ? tf[i].name : tf[i], byPool ? -1 : null);
}
if(!noClose)this.showMe(true);
if (this.handleOK) this.handleOK(this, res,insInto);
}
po.evtOKins=function(byPool){var ev = GJT.event();return this.evtOK(byPool,1,!(ev && ev.shiftKey));}
po.evtCancel = function () {
//檢查是否有位存檔的資料
var ge = this.GridEdit, txt="";
var trs = (ge.getTRsNeedSave) ? ge.getTRsNeedSave(null,1) : null;
if (trs && trs.length) {
txt = txt + ge.text + " : " + i18nm.ShwDataNotSavedAsk.text;
if (!window.confirm(txt)) return true;
}
this.showMe(true);
if (this.handleCancel) this.handleCancel(this);
return true; //cancel dialog destroy
}
po.addIntoPool = function (oriSelection, clearCurrentSelection) {
var m = this, ge = m.GridEdit, fk = ge.fieldsKey, v = oriSelection ? oriSelection : ge.getFieldValues(fk[0], ge.getSelectedTRs(), 1), geP = m.gePool;
if (!geP) return;
var crn = new OpQueryCriterion();
var s = new OpItemFilter(fk[0], v.join ? v.join(",") : v, GJT.compareModeEnum.In);
crn.filters.add(s);
crn.pageRows = 0; crn.pageNo = 1;
geP.grid.keepOldDataA = true && !clearCurrentSelection;
geP.query(crn);
}
po.removePool = function () {
var m = this, geP = m.gePool;
geP.removeRows();
}
po.showSelectionPool = function (extraUIO) {
var m = this, ge = m.GridEdit, cn = m.dlgCtrl;
var nctnr = newEm("div"), tfs = this.tarFields,xui;
var ge1 = teGenGridEdit(ge.id, TBM.withText);
m.gePool = ge1;
ge1.showCaption(1);
var btn = ge.addToolBarButton(i18nm.AddInto.text, function () { m.addIntoPool.call(m); });
btn = ge1.addToolBarButton(i18nm.Remove.text, function () { m.removePool.call(m); });
if (tfs) { btn = ge1.addToolBarButton(i18nm.OK.text, function () { m.evtOK.call(m, 1); }, 0); if (btn) btn.className = "OK"; }
ge1.programPrivilege = 0;
hideIt(ge1.grid.rows[1]);
nctnr.appendChild(ge.container);
nctnr.appendChild(ge1.container);
if (extraUIO) { ge1.addToolBarButton(extraUIO); }; // nctnr.appendChild(extraUIO); }
cn.setClient(nctnr);
var itmsN = new OpItems(); itmsN.add(ge); itmsN.add(ge1);
var lyScales = { mode: "V", scales: [{ rt: 3 }, { rt: 2}] };
var lyo = new layoutDispatcher(lyScales, nctnr, itmsN);
cn.lyoDispatcher = lyo;
//cn.handleResize = m.hndResize;
lyo.resizeLYO();
}
po.hndResize = function (dg) {
var m=this,ge=m.GridEdit,cn=ge.container,dm=dg.main;
if(dg.lyoDispatcher) dg.lyoDispatcher.resizeLYO();
if(dm.parentNode.parentNode !=BDY())return;//不是浮動的對話框
if (!ge._ftb) ge.floatHeader();
//ge.moveTo(cn.offsetLeft, cn.offsetTop, dm.offsetWidth - cn.offsetLeft, dm.offsetHeight);// window.setTimeout(function(){ },100);
}
po.hndResizeDone = function (dg) {
// if (!ge._ftb) ge.floatHeader(); ge.ReviseFTR0.call(ge); });
var m = this, ge = m.GridEdit, cn = m.dlgCtrl.main;// ge = m.GridEdit, cn = ge.container, dm = dg.main;
if (m.beenQueried) {
var ch = cn.offsetHeight, cw = cn.offsetWidth;
if (ch <80 || cw < 80) return;
ge.resizeTo(cw-1, ch-1);
}
// window.setTimeout(function(){ teSetOverflow(cn, "auto");},1000);//為了IE 的-ms-overflow-x y 的問題
}
po.aftQueryDone = function (evtType, prm) {
var m = this, ge = m.GridEdit, dg = m.dlgCtrl, cn = dg.main;
dg.fitSize(cn.offsetHeight < 120 || cn.offsetWidth < 400, 1);
m.beenQueried = 1;
// makeSureWdtHgtInWindow(dg.main, 1, 1, 36, 200);
}
po.moveToMouse = function (forInit) {
this.dlgCtrl.moveToMouse(forInit);
}
po.toZTop = function () { this.dlgCtrl.toZTop();}
GridValueSelector._initialized = true;
}
if (typeof myGridEdit == "string") {
myGridEdit = teGenGridEdit(myGridEdit, TBM.standard, null, null, null, getTargetPage(), getAppId());
if (!myGridEdit) return;
setAtr(myGridEdit.grid, "tarPage", getTargetPage());
}
if (!myGridEdit) return alert("failed to create Grid!");
var m = this, ge = myGridEdit, cn = ge.container, tfs = aryTarFields, tt = dlgTitle;
m.handleOK = handleOK;
m.handleCancel = handleCancel;
m.tarFields = tfs;
m.GridEdit = ge;//aftQueryDone ;
if (ge.evtListenerAdd) ge.evtListenerAdd("aftQueryDone", function (t, prm) { m.aftQueryDone.call(m, t, prm) });
if (tt == null) {
tt = ge.text; if (tt.length > 15) { tt = tt.substring(0, 15) + "..."; }
}
var evh = m.evtOK, evhD = m.evt4GridDblClick, er = function () { evh.call(m); }, spt = ge.specialTools; //.add({name:"testdd", text:"Test GridValue Selector", onclick:testdd});;
var evh2 = m.evtCancel, er2 = function () { return evh2.call(m); };
var evh3 = m.evtOKins, er3 = function () { return evh3.call(m); };
if (tfs) {
btn = ge.addToolBarButton(i18nm.CloseThisDialog.text, er2, 0); if (btn) btn.className = "Cancel";
btn = ge.addToolBarButton(i18nm.AddInto.text, er3, 0);this.btnInsert = btn;btn.className = "OK";
btn = ge.addToolBarButton(i18nm.OK.text, er, 0); if (btn) btn.className = "OK";

ge.cellDblClick = function () { evhD.call(m); };
}
var dg = new DialogInBody(ge.name, tt, width, height);
m.dlgCtrl = dg;
dg.isSubDialog = 0;
dg.handleClose = er2;
dg.setClient(cn);
dg.handleResize = function (s) { m.hndResize.call(m, s); };
dg.handleResizeDone = function (s) { m.hndResizeDone.call(m, s); };
m.showMe();
makeSureWdtHgtInWindow(dg.main, 1, 1, 20, 100);
}

function cmnSetCellsColorByValue(oTbl, iaCellIdx, colorSet, typeIdx, uncolor, PerRow) { //PerRow :set each row color independently
//colorSet: Dictionary item:[ColorLow, ColorHeight, HeightValue, ColorGreaterThanHeightValue, LowValue, ColorLessThanLowValue, ForeColorForMinusValue]
var dict = GJT.newDictionary(), aa, rws = oTbl.rows, r2 = rws.length, c2 = iaCellIdx.length, odt = new Date();
for (var r = 1; r < r2; r++) {
var cc = rws[r].cells, typ = "";
if (typeIdx) typ = teTdGetValue(cc[typeIdx]);
if (PerRow) {
var cSet = colorSet.item(typ);
if (!cSet) continue; // Never set default color
typ = typ + "_" + r;
colorSet.add(typ, cSet);
}
aa = dict.item(typ);
if (!aa) { aa = []; dict.add(typ, aa); aa.minValue = Math.pow(2, 31); aa.maxValue = -Math.pow(2, 31); }
for (var c = 0; c < c2; c++) {
var oTD = cc[iaCellIdx[c]], v = parseFloat(teTdGetValue(oTD));
if (uncolor) { setColor(oTD, "", ""); continue; }
if (!isNaN(v)) {
if (aa.minValue > v) aa.minValue = v;
if (aa.maxValue < v) aa.maxValue = v;
o2 = { td: oTD, val: v };
aa.push(o2);
}
}
}
//return alert(((new Date()).getTime() - odt.getTime())/1000);
if (uncolor) return;
var k = dict.keys();
for (var i = 0; i < k.length; i++) {
var cSet = colorSet.item(k[i]);
aa = dict.item(k[i]);
if (!cSet) continue; // Never set default color
var lv = null, hv = null, lvC = null, hvC = null, minusColor = null;
if (cSet.length > 3) { hv = cSet[2]; hvC = cSet[3]; if (hv != null && aa.maxValue > hv) aa.maxValue = hv; }
if (cSet.length > 5) { lv = cSet[4]; lvC = cSet[5]; if (lv != null && aa.minValue < lv) aa.minValue = lv; }
if (cSet.length > 6) minusColor = cSet[6];
var aRGB1 = parseRGB(cSet[0]), aRGB2 = parseRGB(cSet[1]), gre = parseFloat(aa.maxValue - aa.minValue), aRGBdiff;
if (gre == 0) aRGBdiff = [0, 0, 0]; else aRGBdiff = [parseFloat(aRGB2[0] - aRGB1[0]) / gre, parseFloat(aRGB2[1] - aRGB1[1]) / gre, parseFloat(aRGB2[2] - aRGB1[2]) / gre];
for (var j = 0, j2 = aa.length; j < j2; j++) {
var stp = aa.maxValue - aa[j].val, myRGB;
if (aa[j].val > aa.maxValue) myRGB = hvC;
else if (aa[j].val < aa.minValue) myRGB = lvC;
else myRGB = "#" + toHex2(aRGB2[0] - aRGBdiff[0] * stp) + toHex2(aRGB2[1] - aRGBdiff[1] * stp) + toHex2(aRGB2[2] - aRGBdiff[2] * stp);
aa[j].td.style.backgroundColor = myRGB;
if (minusColor && aa[j].val < 0) { setColor(aa[j].td, minusColor); aa[j].td.oriC = undefined; }
}
}
}
function toHex2(b) {
b = parseInt(b).toString(16);
if (b.length < 2) b = "0" + b;
return b;
}
function parseRGB(txtColor) {
return [parseInt(txtColor.substring(1, 3), 16),
parseInt(txtColor.substring(3, 5), 16),
parseInt(txtColor.substring(5, 7), 16)];
}
//------------ below are new function
function ValueCanChoose(itm, forNew, allFlds) {
var ctr, cho, cfg, dty, vcr;
if (!itm) return;
//if (itm._surItm) itm = itm._surItm;
if (itm instanceof OpItem) {
cfg = itm.opConfig; vcr = itm.vcri;
if (vcr){
var tfs=vcr.toflds,tflds;
if(allFlds) {
tflds=allFlds.collect(tfs);
itm = tflds[0];
cfg = itm.opConfig;
} else return 1;
}
if (hasBit(cfg, GIA.Virtual)) {
if (itm.dataType == GDT.Boolean) return 0;
} else if (hasBit(cfg, GIA.WithSubValues)) {
} else {
if (hasBit(cfg, GIA.Disabled)) return 0;
if (hasBit(cfg, GIA.WriteDenied)) return 0;
if (hasBit(cfg, GIA.ChangeDenied) && !forNew) return 0;
}
ctr = itm.ctrlId; cho = itm.choice;
} else { ctr = getAtr(itm, KW.ControllerId, ""), cho = getAtr(itm, KW.Choice, ""); }
if (ctr || cho || vcr) return true;
dty = itm.dataType;
if (dty == null && itm.getAttribute) dty = parseInt(getAtr(itm, KW.opDataType), 10);
if (dty == GDT.Boolean || dty == GDT.DateTime) return true;
}
function evhValuePickerOK(cn, res) {
if (!res || !res.length || !res[0]) return;
var msl = cn.GridEdit.multiSelect, v = res[0][0], va, il = res[0].length;
if (msl) {
va = [];
for (var i = 0; i < il; i++) { va.push(res[0][i]); }
v = va.join(",");
}
cn.receiver.receiveValue(v,res); return 1;
}
function evhValuePickerCancel(cn) {
cn.showMe(1); return 1;
}

function showValuePicker(tarObj, choice, ctrlId, primalVal, receiver, title, pickDate) {
var ctr = ctrlId, chc = choice, aIN, aIV, m = receiver, ThisId;
if (ctr) {
aIN = [KW.ControllerId, "Title"];
aIV = [ctr, title];
ThisId = ctr;
} else if (chc) {
chc = chc.replace(",*", "").replace("*,", "");
return pickValueInPlace(chc, true, m);
aIN = [KW.Choice, "Title"];
aIV = [chc, title];
ThisId = title;
} else if (pickDate) {
geSelectDate(primalVal, tarObj, teDateSelDoneNotify, m); return true;
} else return false;
var cc = PROG.vpks;
if (!cc) { cc = {}; PROG.vpks = cc; }
var cn = cc[ctr], dg = cn ? cn.dlgCtrl : null;
if (cn) {
try { cn.showMe(); } catch (ex) { cn = null; }
}
if (!cn) {
var tarNm = ctr, fldSel = [], idx = ctr.indexOf("|");
if (idx > 0) {
tarNm = ctr.substring(0, idx);
fldSel = ctr.substring(idx + 1).split(",");
}
var cn = new GridValueSelector(tarNm, fldSel, title ? title : "Select Value", evhValuePickerOK, evhValuePickerCancel,null,null); //, 800, 600
if (!cn.dlgCtrl) return alert("Failed to create value selector, please check setting.");
cc[ctr] = cn; dg = cn.dlgCtrl;
dg.moveToLT();
}
cn.receiver = receiver;
dg.moveToMouse();
return cn;
var winNm = "ValSelector" + self.name, owin;
//because the self may be just the selector itself,so use another not duplicate name
while (window.name == winNm) { winNm += "A"; }
owin = dlgInPlaceShow(winNm, C_Page_ValueSelector, "POST", aIN, aIV, self, title, "420px", "70%", "M", "", self[winNm] != ThisId);
owin.opener = self;
self[winNm] = ThisId;
self[winNm + "rcvr"] = m;
}
function pickValueInPlace(chc, NoSort, receiver) {
var v = parseChoiceA(chc, NoSort), ts;
//var v = (chc.indexOf(dmlMnu) > 0) ? chc.split(dmlMnu) : chc.split(","),ts;
//var v = arychoice,ts;
// if (!NoSort) v.sort();
// for (var i = 0; i < v.length; i++) {
// if (v[i].indexOf(dmlMnuItm) >= 0) v[i] = v[i].split(dmlMnuItm);
// else if (v[i].indexOf("\t") >= 0) {v[i] = v[i].split("\t");v[i][1] = v[i][0] + " " + v[i][1];}
// else if (v[i].indexOf("\\t") >= 0) { v[i] = v[i].split("\\t");v[i][1] = v[i][0] + " " + v[i][1];}
// else v[i] = [v[i], v[i]];
// }
tegMenuHide();
ts = NITAdd(ts, v);
ts.receiver = receiver;
SysShowMenu(ts, pickValueInplaceGet);
}
function parseChoiceA(chc, NoSort) {
var v = (chc.indexOf(dmlMnu) > 0) ? chc.split(dmlMnu) : ((chc.indexOf("\n") > 0) ? chc.split("\n") : chc.split(","));
if (!NoSort) v.sort();
for (var i = 0; i < v.length; i++) {
if (v[i].indexOf(dmlMnuItm) >= 0) v[i] = v[i].split(dmlMnuItm);
else if (v[i].indexOf("\t") >= 0) { v[i] = v[i].split("\t"); v[i][1] = v[i][0] + " " + v[i][1]; }
else if (v[i].indexOf("\\t") >= 0) { v[i] = v[i].split("\\t"); v[i][1] = v[i][0] + " " + v[i][1]; }
else v[i] = [v[i], v[i]];
}
return v;
}
function pickValueInplaceGet(itm, itms) {
//var obj = GJT.eventSrc(), tbl = getTable(obj); if (obj == null) return;
var rcvr = itms.receiver;
if (rcvr) return rcvr.receiveValue(itm.name);
}
function addValPickButton(tarObj) {
tarObj.insertAdjacentHTML("afterend", "<input type='button' onclick='valPickButtonClick()' tabindex='-1' style='width:24px;padding-left:4px;' value='...'/>");
var rs = tarObj.nextSibling;
rs.tarObject = tarObj;
return rs;
}
function getChoiceAuto(chc, itm) {
if (chc && chc.length < 25) {//內容很短時檢查是不是只有一項,如果只有一項就回server嘗試找內容
var v = parseChoiceA(chc, 1);
if (v.length == 1 && v[0][0] == v[0][1]) {
var xv = teBpcSync("getChoice", null, null, [{ name: "sur", value: v[0][0]}]);
if (xv != v[0][0]) {
itm.choice = xv;
chc = xv;
}
}
}
return chc;
}
function valPickButtonClick() {
var sr = GJT.eventSrc(), o = sr.tarObject;
if (!ValueCanChoose(o)) return;
var rcvr = new ValueReceiver(o), isDate = getAtr(o, KW.opDataType) == GDT.DateTime || o.dataType == GDT.DateTime,
primalVal = (o.value != undefined) ? o.value : "";
var chc = getAtr(o, KW.Choice, ""), ctr = getAtr(o, KW.ControllerId, ""), itm = o._surItm;
if (itm) { chc = itm.choice; ctr = itm.ctrlId; chc = getChoiceAuto(chc, itm); }
showValuePicker(o, chc, ctr, primalVal, rcvr, "", isDate);
}
function ValueReceiver(tarObj) {
this.tarObject = tarObj;
if (typeof ValueReceiver._initialized == "undefined") {
var po = ValueReceiver.prototype;
po.receiveValue = function (val) {
var o = this.tarObject;
if (o.forQry) {
var oldV = o.value;
if (!oldV) { }
else if (oldV.indexOf("~") == 0) val = val + oldV;
else if (oldV.indexOf("~") > 0) val = oldV.substring(0, oldV.indexOf("~") + 1) + val;
else if (oldV.indexOf(">=") == 0) val = ">=" + val;
else if (oldV.indexOf("<=") == 0) val = "<=" + val;
else if (oldV.indexOf(">") == 0) val = ">" + val;
else if (oldV.indexOf("<") == 0) val = "<" + val;
else if (oldV.indexOf("!") == 0) val = "!" + val;
else if (oldV.indexOf("=") == 0) val = "=" + val;
}
if (o.value != undefined) o.value = val;
else if (o.innerText != undefined) o.innerText = val;
if (o.onblur) { o.focus(); o.blur(); } //simulate validate
if(o.onchange) o.onchange();
return true;
}
ValueReceiver._initialized = true;
}
}
function teShaftT() {
if (typeof teShaftT.prototype._initialized == "undefined") {
var po = teShaftT.prototype;
po.init = function (oContainer, sClass, executer, mode, text, uio) {
var m = this, a;
m.executer = executer;
var evRef = m._evtHandle, er = function () { evRef.call(m); }; this.evh2 = er;
if (uio) { setEvtHandleAll(uio, er); m.uio = uio; return; }
var h = "<table class='Shaft'><tr><td colspan='2' style='height:16px;overflow:hidden;'></td><td class='C' style='height:16px;text-align:center;'></td></tr><tr><td class='LU'></td><td class='U'></td><td class='RU'></td></tr><tr><td class='L'></td><td></td><td class='R'></td></tr><tr><td class='LD'></td><td class='D'></td><td class='RD'></td></tr></table>",
o = addE(h, oContainer);
m.uio = o; m.style = o.style;
if (sClass != null) o.className = sClass;
setEvtHandleAll(o, er);
var rs = o.rows, c0 = rs[1].cells, c1 = rs[2].cells, c2 = rs[3].cells;
if (text) { rs[0].cells[0].title = text; rs[0].cells[0].innerText = text.substring(0, 5); }
if (!mode) return;
if (mode == 1 || mode == 4) hideIt([rs[1], rs[3]]); //rs[0]
if (mode == 2) hideIt([c0[0], c1[0], c2[0], c0[2], c1[2], c2[2]]);
if (mode == 3) hideIt([c0[1], c1[0], c1[2], c2[1]]);
if (mode == 4) {
c0[0].className = "MF"; c0[1].className = "ML";
hideIt(c1[1]); hideIt(rs[0]);
rs[2].insertBefore(c0[0], c1[0]); rs[2].appendChild(c0[0]);
}
}
po._evtHandle = function (ev) {
if (!ev) ev = GJT.event();
var su = GJT.eventSrc(ev), m = this, ty = ev.type, rm = su; // getTD(su);
if (!rm) return;
var csn = rm.className;
if (ty == "click") {
GJT.stopBubble();
if (GJT.isDraging) { GJT.isDraging = 0; return; }
if (!GJT.isDraging && csn == "C") m.uio.outerHTML = "";
if (m.onclick && m.onclick(csn, m)) return;
}
else if (ty == "mousedown") {
borderDown(rm);
var x = ev.clientX, y = ev.clientY, bdy = BDY(), htm = teHtm(), er = this.evh2, o = this.uio;
if (GJT.isButtonDownLeft()) {
this.cx = x; this.cy = y;
addEVt4Drag(htm, er, 1);
this.dim = [o.offsetLeft, o.offsetTop];
}
}
else if (ty == "mouseup") {
borderUp(rm);
var bdy = BDY(), htm = teHtm(), er = this.evh2;
delete this.cx;
rmvEvt4Drag(htm, er, 1);
}
else if (ty == "mousemove") {
if (GJT.isButtonDownLeft()) {
if (this.cx != undefined) {
var x = ev.clientX, y = ev.clientY, dx = x - this.cx, dy = y - this.cy, o = this.uio,
st = o.style, m = this.main, dim = this.dim, l = dim[0], t = dim[1];
var ns = GJT.getComputedStyle(BDY()), mt = teTopForDlg(), mL = parseIntD(ns.marginLeft, 0);
if (dx != 0) {
if (l + dx < mL) dx = mL - l; st.left = toPx(l + dx);
GJT.isDraging = 1;
}
if (dy != 0) {
if (t + dy < mt) dy = mt - t + 2; st.top = toPx(t + dy);
GJT.isDraging = 1;
}
}
}
}
}
po.setId = function (id) { this.uio.id = id; }
teShaftT.prototype._initialized = true;
}

}
teShaft.prototype = new teShaftT();
function teShaft(oContainer, sClass, executer, mode, text, uio) {
if (sClass == null) sClass = "Shaft";
this.init(oContainer, sClass, executer, mode, text, uio);
}
function addEVt4Drag(htm, er, lsn) {
if (lsn && htm.addEventListener) htm.addEventListener("mousemove", er, true);
GJT.eventAddHandle(htm, "mousemove", er); GJT.eventAddHandle(htm, "mouseup", er); GJT.eventAddHandle(htm, "selectstart", er);
}
function rmvEvt4Drag(htm, er, lsn) {
GJT.eventRemoveHandle(htm, "mousemove", er); GJT.eventRemoveHandle(htm, "mouseup", er); GJT.eventRemoveHandle(htm, "selectstart", er);
if (lsn && htm.removeEventListener) {
htm.removeEventListener("mousemove", er, true);
}
}
function teMotel() {
//this.hoverColor = "#eedd66";
this.imageSize = "20px";
if (typeof teMotel.prototype._initialized == "undefined") {
var po = teMotel.prototype;
po.init = function (oContainer, itms, sClass, handler, extUio) {
var m = this, xo = extUio;
m._Handler = handler;
m._items = itms; //.clone(); Never clone, external code may use property of itms to keep and get value after click
m.xo = xo;
if (xo) m.uio = xo;
else {
m.uio = addE("<DIV />", oContainer);
if (sClass != null) m.uio.className = sClass;
m.className = sClass;
}
m.createUIO();
var evRef = m._evtHandle, er = function () { evRef.call(m); };
setEvtHandleAll(m.uio, er);
m.style = m.uio.style;
m._evtH = er;
}
po.add = function (itm) {
var m = this;
m._items.add(itm);
m.createUIO();
}
po.contains = function (itm) { return !!(this._items.contains(itm)); }//取布林
po.remove = function (itm) {
var m = this;
m._items.remove(itm);
if(m.activeItem ==itm) m.activeItem=null;
m.createUIO();
}
po.replaceItem = function (newItm, oldItm) {
var m = this, ms = m._items;
if (ms.replaceItem(newItm, oldItm)) m.createUIO();
}
po.hideRoom = function (index, showIt) {
var m = this, itm = m._items[index]; if (!itm) return;
itm._hideRoom = !showIt;
m.refreshUI();
}
po.createUIO = function () {
var m = this;
var xo = m.xo, l = m.uio, ch = l.children, ms = m._items, on, xr = m.maxRowsPerColumn, cu = 0, sf = 0;
if (!xo) { while (ch.length > 0) { l.removeChild(ch[0]); } }
if (m.splitMode != null) {
if (ch.length == 0 || ch[0].className.indexOf("switch") < 0) {
on = newEm("DIV"); on.className = "switch0"; showItA(on, !m.hideswo);
if (ch.length == 0) l.appendChild(on); else l.insertBefore(on, ch[0]);
}
l.oncontextmenu = function () { m._evtH(); return false; };
sf = 1;
}
if (xo) {
ch = xo.children;
for (var i = 0; i < ms.length; i++) {
var itm = ms[i]; on = ch[i + sf]; if (!on) return;
on.lodger = itm;
}
return;
}
if (xr && xr > ms.length) xr = 0;
for (var i = 0; i < ms.length; i++) {
var itm = ms[i], tx = itm.text, sx = itm.styleText || ms.styleText;
if (xr && (cu % xr) == 0) {
m.uio.className = "";
if (i > 0) l.style.marginRight = "0px";
l = newEm("DIV"); l.className = m.className;
m.uio.appendChild(l);
}
if (sx) on = addE("<div style=\"" + sx + "\" />", l);
else on = newEm("DIV");
if (tx == "-") {
on.className = "HLine";
if (xr && ((cu % xr) == 0 || (cu % xr) == (xr - 1))) continue;
}
else if (tx == "|") on.className = "VLine";
else {
var c = on.appendChild(newEm("SPAN"));
if (itm.textHTML) on.innerHTML = itm.textHTML;
else {
c.innerText = tx;
if (itm.tip) { on.title = itm.tip; c.title = itm.tip; }
//itm.imageURL = "images/save.png";
if (itm.imageURL) {
var st = c.style;
st.backgroundImage = "URL(" + itm.imageURL + ")";
st.paddingLeft = m.imageSize;
} else if (itm.children) c.className = "more";
if (itm.className) c.className = itm.className;
else if (itm.checked) on.className = "checked";
}
cu++;
}
on.lodger = itm;
l.appendChild(on);
if (m.activeItem == itm) on.className = "Active";
}
}
po.refreshUI = function () { var m = this; m.showLodger(m.activeItem); } //m.createUIO();
po._prcsMyMenus = function (itm, itms) {
var m = itms._boss, ldgr = itms._ldgr;
if (itm.name == "shwLdgr") {
ldgr._hidden = !ldgr._hidden;
if (!ldgr._hidden) m.setActiveItem(ldgr);
m.showLodger(m.activeItem);
}
}
po._evtHandle = function (ev, tyN) {
if (!ev) ev = GJT.event();
var su = GJT.eventSrc(ev), m = this, itms = m._items, ty = tyN ? tyN : ev.type, rm = m._getRoom(su), hn = m._Handler, ldgr = m._getLodger(rm);
if (!rm && ty != "click") return;
if (ty == "click") {
if (su.className.indexOf("switch") == 0) {
return m.switchSplitMode();
}
//ldgr = m._getLodger(rm);
if (!ldgr) return;
if (ldgr._hidden) return m._evtHandle(null, "contextmenu");
GJT.lstX = ev.clientX; GJT.lstY = ev.clientY;
if (hn && hn.setActiveItem) hn.setActiveItem(ldgr);
if(!(m instanceof teMenus))m.setActiveItem(ldgr);
if (ldgr.onclick && ldgr.onclick(ldgr, itms, m)) return;
if (itms.onclick && itms.onclick(ldgr, itms, m)) return;
if (m.onclick && m.onclick(ldgr, itms, m)) return;
}
else if (ty == "dblclick") {
//ldgr = m._getLodger(rm);
if (!ldgr || ldgr._hidden) return;
if (ldgr.ondblclick && ldgr.ondblclick(ldgr, itms, m)) return;
if (itms.ondblclick && itms.ondblclick(ldgr, itms, m)) return;
if (m.ondblclick && m.ondblclick(ldgr, itms, m)) return;
}
else if (ty == "mouseover") {
//ldgr = m._getLodger(rm);
if (!ldgr || ldgr._hidden) return;
if (ldgr && ldgr.opConfig && hasBit(ldgr.opConfig, GIA.Disabled)) return;
if (m.onmouseover) m.onmouseover(ldgr, itms, m);
//setColor(rm, null, m.hoverColor);
if (ldgr.onmouseover) ldgr.onmouseover(ldgr, itms, m);
}
else if (ty == "mouseout") {
//ldgr = m._getLodger(rm);
if (!ldgr || ldgr._hidden) return;
if (ldgr && ldgr.opConfig && hasBit(ldgr.opConfig, GIA.Disabled)) return;
if (m.onmouseout) m.onmouseout(ldgr, itms, m);
restoreColor(rm);
if (ldgr.onmouseout) ldgr.onmouseout(ldgr, itms, m);
}
else if (ty == "mousedown") {
if (m.onmousedown) m.onmousedown();
if (m.className=="teTools")borderDown(rm);
}
else if (ty == "mouseup") {
if (m.onmouseup) m.onmouseup();
if (m.className == "teTools") borderUp(rm);
}
else if (ty == "contextmenu") {
if (!ldgr || m.splitMode == null) return;
var itms = [{ name: "shwLdgr", text: ldgr._hidden ? i18nm.ShowIt.text : i18nm.HideIt.text}];
itms.onclick = m._prcsMyMenus;
itms._ldgr = ldgr; itms._boss = m;
SysShowMenu(itms);
}
}
po.switchSplitMode = function (_newMode) {
var m = this; if (m.splitMode == null) throw "Not supported!";
var swo = m.uio.children[0];
if (_newMode != null) {
if (_newMode < 0) { hideIt(swo); _newMode = _newMode * -1 - 1; m.hideswo = 1; } else { showIt(swo); m.hideswo = 0; }
m.splitMode = _newMode;
} else m.splitMode = (1 + parseInt(m.splitMode, 10)) % 2;
swo.className = "switch" + m.splitMode;
m.showLodger(m.activeItem);
if (m.hndSplit) m.hndSplit(m);
}
po._getRoom = function (su) {
if (!su) return;
while (!su.lodger) { su = su.parentNode; if (!su) return; if (su == this.uio) return; }
return su;
}
po._getLodger = function (su) { var s = this._getRoom(su); if (s) return s.lodger; }
po.setActiveItem = function (itm) {
if (typeof itm == "number") itm = this._items[itm];
if (!itm) return;
var m = this, l = m.uio, ch = l.children, rs, hn = m._Handler;
if (itm == m.activeItem) return;
var isMyLodger = false;//檢查是不是房客,如果不是房客就不要變動標籤狀態
for (var i = m.hintActive ? 0 : 1; i < ch.length; i++) {
if (ch[i].lodger == itm) { isMyLodger = true; break; }
}
if (m.splitMode != null || m.hintActive) {
for (var i = m.hintActive ? 0 : 1; i < ch.length; i++) {
if (ch[i].lodger == itm)
{ ch[i].className = "Active"; rs = itm; m.activeItem = itm; }
else if (isMyLodger) ch[i].className = "";
}
} else rs = itm;
m.showLodger(rs);
if (rs && hn && hn.setActiveItem) hn.setActiveItem(rs);
return rs;
}
po.showLodger = function (itm) {
if (!itm) return;
var m = this, l = m.uio, ldg, ch = l.children, st, sm = m.splitMode, vis = (sm != null) ? ((sm == 0 || sm == 2) ? true : false) : true;
for (var i = 1; i < ch.length; i++) {
ldg = ch[i].lodger;
if (ldg == itm) showItA(itm, true && ldg && !ldg._hidden);
else if (ldg) showItA(ldg, vis && !ldg._hidden);
if (ldg && ldg._hideRoom)
{ hideIt(ch[i]); showItA(ldg, 0); } else { showItA(ch[i], 1); }
if (ldg && ldg._obj && ldg._obj.style) st = ldg._obj.style;
if (st) {
if (sm == 2) {
ldg.oriClear = st.clear; ldg.oriFloat = st.float;
//if (1 || i < ch.length - 1) st.float = "left"; else st.float = "none";
st.float = "left";
st.clear = "none";
}
else {
if (ldg.oriClear != null) st.clear = ldg.oriClear;
if (ldg.oriFloat != null) st.float = ldg.oriFloat;
}
}
}
if (itm.scrollToVisible) itm.scrollToVisible();
}
po.changeContainer = function (container) {
container.appendChild(this.uio);
}
po.visible = function () { return !isHidden(this.uio); }

teMotel.prototype._initialized = true;
}

} //End teMotel

function teTabsCtrl(oContainer, itms, sClass, handler, extUio, noSplit) {
var m = this;
if (!noSplit) m.splitMode = 0;
//m.hoverColor = "#88ff99";
if (sClass == null) sClass = "Tabs";
m.init(oContainer, itms, sClass, handler, extUio);
} //end teTabsCtrl
teTabsCtrl.prototype = new teMotel(); //prototype chaining

function teToolbar(oContainer, itms, sClass, handler) {
if (sClass == null) sClass = "teTools";
this.init(oContainer, itms, sClass, handler);
}
teToolbar.prototype = new teMotel();

function teMenus(oContainer, itms, handler, sClass) {
this.maxRowsPerColumn = 20;
this.init(oContainer, itms, sClass ? sClass : "teMenus", handler);
}
teMenus.prototype = new teMotel();

function teLodger(name, text, htmObj, clickHandle) {
if (typeof teLodger.prototype._initialized == "undefined") {
var po = teLodger.prototype;
po.setVisible = function (vis) {
if (vis) showIt(this._obj); else hideIt(this._obj);
}
po.visible = function () { return !isHidden(this._obj); }
teLodger.prototype._initialized = true;
}
this.name = name; this.text = text; this._obj = htmObj;
if (clickHandle) this.onclick = clickHandle;
}


function teRecordForm(itms, container, evHandler, layoutText, ge) {
if (typeof teRecordForm.prototype._initialized == "undefined") {
var po = teRecordForm.prototype;
po.changeLayout = function (layoutText, readOnly) {
var m = this, x = layoutText, fa = m._fieldsAll.clone(), itms = m.items, so = m.uio, w,
er = function () { m.evtHandle.call(m); }, rdo = readOnly;
itms = new OpItems(); m.items = itms; m.oriLayoutText = x; m.readOnly = rdo;
so.innerHTML = x;
if (so.children.length == 1) {
var sn = so.children[0];
so.removeChild(sn);
so.parentNode.replaceChild(sn, so);
so = sn; m.uio = sn;
m.style = so.style;
}
var g = m._ge, bc = g.grid ? GJT.getComputedStyle(g.grid.rows[0].cells[0]).backgroundColor : g.headerBC;
var chv = collEmHasAtr(so, "zqjvf"), chl = collEmHasAtr(so, "zqjlf");
for (var i = 0; i < chv.length; i++) {
var nm = getAtr(chv[i], "zqjvf"), ff = fa[nm], ptd = chv[i].parentNode;
if (nm && ff) {
itms.add(new teInput(ff, chv[i], 0, er));
if (ff._backcolor) ptd.style.backgroundColor = ff._backcolor;
if (ff._forecolor) ptd.style.color = ff._forecolor;
}
}
for (var i = 0; i < chl.length; i++) {
var nm = getAtr(chl[i], "zqjlf"), ptd = chl[i].parentNode, ff = fa[nm];
if (nm && ff) {
setEmTxt(chl[i], ff.text + ":");
chl[i].title = ff.tip;
if (ff._backcolorH) ptd.style.backgroundColor = ff._backcolorH;
else if (bc && !ptd.style.backgroundColor) ptd.style.backgroundColor = bc;
if (ff._forecolorH && !chl[i].style.color) chl[i].style.color = ff._forecolorH;
}
}
if (g) {
var mvct = getChiHasAtr(so, "zqjvf", "zqjmoveCtrl");
if (!mvct) {
mvct = newEm("div"); mvct.innerHTML = ["<div zqjvf='zqjmoveCtrl'><table class='Shaft'><tr><td class='MF'></td><td class='L'></td><td zqjvf='zqjposbar' class='positionTxt'></td><td class='R'></td><td class='ML'></td><td class='RSH'></td></tr></table></div>"].join("");
mvct = mvct.children[0];
so.appendChild(mvct);
}
mvct.className = "CtrlBar";
var swo = addE("<div class='SwitchMode' />", mvct);
swo.onclick = function () { m.switchViewMode.call(m, null, 1); };
var clo = addE("<div class='SwitchColumns' />", mvct);
clo.onclick = function () { m.switchColumns.call(m, null, 1); };
if (getAtr(g.grid, "supchglog") == "Y") {
var clo = addE("<div class='EditHistory' />", mvct);
clo.onclick = function () { m.ShowHistory.call(m, null, 1); };
}
if (hasBit(g.programPrivilege, PPVG.Save)) {
var clo = addE("<div class='SaveRec' />", mvct);
clo.onclick = function () { m.save.call(m); };
}
var sft = new teShaft(null, null, g, 0, null, mvct);
sft.onclick = PointerMoveClick;
m.positionBar = getChiHasAtr(mvct, "zqjvf", "zqjposbar");
m.moveBar = mvct;
if (g instanceof GridEdit) {
var o2 = getChiHasAtr(so, "zqjvf", "zqjQryBtn");
if (!o2) { o2 = mvct.appendChild(newEm("span")); setAtr(o2, "zqjvf", "zqjQryBtn"); o2.className = "QryLaunch"; o2.style.float = "left"; }
o2.onclick = function () { g.QueryByDlg(); };
o2.innerText = i18nm.Query.text;
}
}
var tc = lyGenTabsCtrls(so, 99, -2);
}
po.showPosition = function (curr, total) {
var o = this.positionBar;
if (o) {
o.innerText = curr ? (curr + "/" + total) : "";// getTable(o).style.visibility = total > 1 ? "" : "hidden";
}
}
po.showValues = function (json) {
var m = this, itms = m.items, fa = m._fieldsAll;
if (!itms) return;
for (var i = 0; i < itms.length; i++) {
var itm = itms[i], s = json ? json[itm.name] : "";
if (s == undefined || s == null) s = "";
itm.setValue(s);
}
}
po.showValue = function (name, val, isHTML) {
var itms = this.items; if (!itms) return;
var itm = itms[name];
if (itm) return itm.setValue(val, isHTML);
for (var i = 0; i < itms.length; i++) {
var itm = itms[i];
if (itm.name == name) { itm.setValue(val, isHTML); return; }
}
var m = this, fa = m._fieldsAll, fd = fa[name]; if (!fd) return;
//原本沒有的自動加入
var tio = newEm("span"), vo = newEm("span"), vo2, chn = m.uio.children, lto = chn[chn.length - 1];
var oT = getChiHasAtr(m.uio, "zqjtf"); if (oT) oT = getEM(oT, "TBODY")[0];
if (isHTML) vo2 = newEm("div"); else vo2 = newEm("input");
tio.innerText = fd.text + ":"; vo.appendChild(vo2);
setAtr(tio, "zqjlf", name); setAtr(vo, "zqjvf", name);
if (oT) {
var otdL = newEm("TD"), otdV = newEm("TD"), nTR = newEm("TR");
setAtr(otdL, "class", "Label"); setAtr(otdV, "class", "Value");
setAtr(tio, "class", "Label"); setAtr(vo, "class", "Value");
nTR.appendChild(otdL).appendChild(tio);
nTR.appendChild(otdV).appendChild(vo);
oT.appendChild(nTR);
} else {
var dp = newEm("div");
dp.style.float = "left"; lto.style.clear = "left";
dp.appendChild(tio); dp.appendChild(vo);
m.uio.insertBefore(dp, lto);
}
tio.className = "Label";
var itm = new teInput(fd, vo, 1);
itms.add(itm);
itm.setValue(val, isHTML);
}
po.showHTML = function (name, val) { return this.showValue(name, val, 1); }
po.getValue = function (name) { var itms = this.items, itm = itms ? itms[name] : null; if (itm) return itm.getValue(); }
po.setValue = function (name, val) {
var itms = this.items; //, itm = itms ? itms[name] : null; if (itm) itm.setValue(val);
for (var i = 0; i < itms.length; i++) {
var itm = itms[i];
if (itm.name == name) itm.setValue(val);
}
}
po.visible = function () { return !isHidden(this.uio); }
po.resetValue = function () {
var itms = this.items; if (!itms) return;
for (var i = 0; i < itms.length; i++) { itms[i].resetValue(); }
}
po.clearChange = function () {
var itms = this.items; if (!itms) return;
for (var i = 0; i < itms.length; i++) { itms[i].clearChange(); }
}
po.evtHandle = function (ev) {
if (!ev) ev = GJT.event();
var su = GJT.eventSrc(ev), m = this;
if (m.evHandler) {
var itms = m.items, nm = su.itemNm, itm = itms[nm]; if (!nm) return;
if (m.isMyO(su, itm)) return m.evHandler(ev.type, itm, m);
for (var i = 0; i < itms.length; i++) {
itm = itms[i];
if (itm.name == nm && m.isMyO(su, itm)) return m.evHandler(ev.type, itm, m);
}
}
}
po.isMyO = function (su, itm) {
if (!itm) return;
var uio = itm.uio, p = su; if (!uio) return;
while (p) {
if (p == uio) return 1;
p = p.parentNode;
}
}
po.saveUsrSetting = function () {
var m = this, s = (m.viewmode ? m.viewmode : "") + "_" + (m.columns ? m.columns : "");
var g = m._ge; if (g) teSaveUserSetting(g, "recformUSet", s, 0, 1);
}
po.setUsrSetting = function () {
var m = this, g = m._ge, s,cs;
if (!g) return;
s = teGetUserSetting(g, "recformUSet");
if (!s)return;
s = s.split("_");
if (s[0]) m.switchViewMode(s[0]);
cs =parseInt(s[1],10);
if (cs != 0 && !isNaN(cs)) m.switchColumns(cs);
}
po.ShowHistory = function () {
var g = this._ge; if (g.ShowChgHistory) return g.ShowChgHistory(0,1);
}
po.switchViewMode = function (viewMode, saveSet) {
var m = this, itms = m.items, vm = viewMode;
if (vm == null) {
vm = m.viewmode;
if (!vm) vm = 1; else vm = 0;
}
vm = parseInt(vm, 10);
m.viewmode = vm;
if (!itms) return;
for (var i = 0; i < itms.length; i++) {
itms[i].switchViewMode(vm);
}
if(saveSet) m.saveUsrSetting();
}
po.switchColumns = function (cols,saveSet) {//雙數標題在上面,單數則標題在左邊
//if (cols == "") return;
var m = this, cs = cols;
var dctL = {}, dctV = {}, oT = getChiHasAtr(m.uio, "zqjtf"); if (!oT) return;
if (cs == null) {
cs = m.columns; //如果未指定就是依序輪流切換
if (cs == null) cs = 2; //預設為一欄標題在左
else { cs++; if (cs > 6) cs = 0; } //到6之後再回到0, 0代表使用原來的設計(可能客製化設計過)
}
cs = parseInt(cs, 10);
if (isNaN(cs)) cs = 0;
m.columns = cs;
if(saveSet)m.saveUsrSetting();
if (cs == 0 && m.oriLayoutText) {
m.changeLayout(m.oriLayoutText, m.readOnly);
m.switchViewMode(m.viewmode);
if (m._ge) window.setTimeout(function () { m._ge.showRecordFormValues(null, null, 1); }, 100);
return;
}
var tot = (cs % 2) == 1, cl = parseInt((tot ? (cs / 2 + 1) : cs / 2), 10); //title on top
//如果有任一個TR的TD數量不一樣(除了最後一個TR)就表示有人工設計過,就不能自動排列了
//找出有"zqjtf"屬性的表格,收集其下所有TD,依照其下物件的"zqjtf"(欄位Id) 屬性值建立字典
//依照this.items順序重新排列
var tds = getEM(oT, "TD"), rx = 0, rxV = (tot ? 1 : 0), cx = 0, ix = 0, oTB = getTBODY(oT), trs = oTB.children, rL = trs.length;
for (var i = 0; i < tds.length; i++) {
var td = tds[i], o1 = getChiHasAtr(td, "zqjlf"), o2 = getChiHasAtr(td, "zqjvf");
if (o1) dctL[getAtr(o1, "zqjlf")] = td;
if (o2) dctV[getAtr(o2, "zqjvf")] = td;
}
//每個tr 依序加入
var itms = m.items, ge = m._ge, itmsSW = ge.getFields();
var itmsN = itms.collect(itmsSW.getNames(",")); //依照表格上使用者的順序優先
for (var i = 0; i < itms.length; i++) {
if (!itmsN[itms[i].name])
itmsN.add(itms[i]);
}
itms = itmsN;
var iL = itms.length;
while (ix < iL) {
while (trs.length <= rxV) { addChi(oTB, "TR"); } //加列
var cnt = 0;
while (cnt < cl && ix < iL) {
var myNm = itms[ix].name;
ix++;
var tr = trs[rx], trV = trs[rxV], td = dctL[myNm], tdV = dctV[myNm];
if (!td || !tdV) continue;
var cspan = parseInt(getAtr(tdV, "colspan"), 10);
if (cspan && cspan > 1) {
tdV.colSpan = 1;//所有td都不要colspan
}
cnt++;
tr.appendChild(td);
trV.appendChild(tdV);
//td.style.textAlign = (tot ? "left" : "right");
}
rx++; //下一列
if (tot) { rx++; rxV = rx + 1; } else rxV = rx;
}
while (trs.length > rxV) { var tr = trs[trs.length - 1]; tr.parentNode.removeChild(tr); }
}
po.save = function () {
var g=this._ge;if (g.saveData) return g.saveData(0,[g.mainTR()]);
}
teRecordForm.prototype._initialized = true;
}
var m = this, fa = itms, so = addE("<div />", container);
m.uio = so; m.style = so.style; m._fieldsAll = fa; m.evHandler = evHandler; m._ge = ge;
//so.onmousedown = function () {
// MenuHide();
//}
//GJT.eventAddHandle(so, "mousedown", MenuHide);
if (layoutText == null) return;
m.changeLayout(layoutText);
} //end teRecordForm

function teInput(itm, uio, readOnly, evHandle) {
if (typeof teInput.prototype._initialized == "undefined") {
var po = teInput.prototype;
po.setVisible = function (vis) {
if (vis) showIt(this.uio); else hideIt(this.uio);
//this._hidden=!vis;
}
po.visible = function () { return !isHidden(this.uio); }
po.getName = function () { return this.item.name; }
po.close = function () { this.uio.outerHTML = ""; delete this.uio; }
po.setValue = function (val, isHTML,keepOriVal) {
var m = this, ch = m.ch, vmap = teMapVal(m.item.valuesMapRvs, val), fnd = 0, isRd = 0;
if(!keepOriVal) m.oriV = val;
delete this.focused;
if (isHTML) {
var p = ch[0].parentNode, nn = getChiHasAtr(p, "ohtm");
if (!nn) { nn = p.appendChild(newEm("div")); setAtr(nn, "ohtm", "1"); }
nn.innerHTML = val;
return;
}
if (m._spn) m._spn.innerText = val;
for (i = 0; i < ch.length; i++) {
if (ch[i].type == "text") m.setInputVal(ch[i], val); //ch[i].value = val;
else if (ch[i].tagName == "TEXTAREA") m.setInputVal(ch[i], val); //ch[i].value = val;
else if (ch[i].type == "radio") { isRd = 1; if (ch[i].value == val || ch[i].value == vmap) { ch[i].checked = true; fnd = 1; } }
else if (ch[i].type == "checkbox") {
var v2 = ch[i].value, iv2 = parseInt(v2, 10);
if (v2 == val || v2 == vmap) { ch[i].checked = true; fnd = 1; }
else if (!isNaN(iv2)) {
//var iv
}
}
else if (ch[i].type == "hidden") ch[i].value = val;
else if (ch[i].tagName == "SELECT") {
var chn = ch[i].children, cc; fnd = 0;
for (var j = 0; j < chn.length; j++) {
cc = chn[j];
if (cc.value == val || cc.value == vmap) { cc.selected = true; fnd = 1; }
}
if (!fnd) {
var lch = chn[chn.length - 1], lp = lch.parentNode;
if (!getAtr(lch, "_uno")) {
lch = lp.appendChild(newEm(lch.tagName));
setAtr(lch, "_uno", "Y");
}
lch.value = vmap;
lch.innerText = vmap;
lch.selected = true;
}
}
}
if (vmap != "" && !fnd && isRd) {
var lch = ch[ch.length - 1], lp = lch.parentNode, nm = lch.name;
if (!getAtr(lch, "_uno")) {
lp = lp.parentNode.appendChild(newEm(lp.tagName));
lch = lp.appendChild(addEm("<input type='radio'/>")); // lch.type = "radio";
lch.disabled = true; lch.name = nm;
setAtr(lch, "_uno", "Y");
}
lch.value = vmap;
setEmTxt(lp, vmap);
}
}
po.getValue = function () {
var m = this, ch = m.ch;
for (i = 0; i < ch.length; i++) {
if (ch[i].type == "text") return ch[i].value;
else if (ch[i].tagName == "TEXTAREA") return ch[i].value;
else if (ch[i].type == "radio" && ch[i].checked) return ch[i].value;
else if (ch[i].type == "checkbox" && ch[i].checked) return ch[i].value;
else if (ch[i].type == "hidden") return ch[i].value;
else if (ch[i].tagName == "SELECT") return ch[i].value;
}
return m.oriV;
}
po.setInputVal = function (inpt, val) {
inpt.value = val; // return;
if (!this.rdo) return;
var oro = inpt.previousSibling, nb = inpt.nextSibling;
if (!oro || !oro._ir) {
oro = newEm("div");
oro._ir = 1;
//copyAttr(inpt, oro, ["type"]);
inpt.parentNode.insertBefore(oro, inpt);
//oro.style.display = "inline-block"; oro.style.width = "";
hideIt(inpt);
if (nb && (nb.tarObject == inpt || nb.type == "button" || nb.tagName == "BUTTON")) hideIt(nb);
}
oro.innerText = val;
}
po.setColor = function (myColor, BColor) {
var m = this, ch = m.ch, tarO;
for (i = 0; i < ch.length; i++) {
var t = ch[i].type, tg = ch[i].tagName;
if (t == "text") tarO = ch[i];
else if (tg == "TEXTAREA" || tg == "SELECT") tarO = ch[i];
if (tarO) break;
}
if (!tarO) tarO = ch[0].parentElement;
setColor(tarO, myColor, BColor);
}
po.isChanged = function (chkVal) {
var m = this;
if (m.focused || chkVal) {
var dt = m.item.dataType, vo = m.oriV, v = m.getValue();
if (GDT.String == dt) return vo != v;
if (GDT.DateTime == dt) {
vo = new Date(vo); v = new Date(v);
return (isNaN(v) && !isNaN(vo)) || (!isNaN(v) && isNaN(vo)) || (vo.getTime() != v.getTime());
}
vo = parseFloat(vo); v = parseFloat(v);
if (isNaN(vo) && isNaN(v)) return false;
return vo != v;
}
}
po.evtHandle = function () {
var ev = GJT.event(), s = GJT.eventSrc(), ty = ev.type;
if (ty == "focus" || ty == "change") this.focused = 1;
}
po.resetValue = function () { this.setValue(this.oriV, hasBit(m.item.opConfig, GIA.ValueIsOuterHTML)); }
po.clearChange = function () { this.oriV = this.getValue(); }
po.switchViewMode = function (viewMode) {
var m = this, vm = viewMode, ch = m.ch, spn = m._spn, cfg = m.item.opConfig;
m.viewmode = vm;
if (vm == 1) {
if (hasBit(cfg, GIA.WriteDenied) || hasBit(cfg, GIA.ValueIsOuterHTML)) { } //可編輯的欄位才需要處理
else if (!spn && ((ch[0].tagName == "INPUT" && ch[0].type == "text") || ch[0].tagName == "TEXTAREA")) {
spn = addChi(m.uio, "DIV"); m._spn = spn;
//var s = spn.style; s.overflowY = "visible"; s.overflowX = "visible"; s.borderBottom = "1px solid #e0e0e0"; s.minHeight = "16px";
}
else {
var kk = 0;
}
if (spn) {
spn.innerText = m.getValue();
showItA(spn, 1);
showItA(ch, 0);
}
} else if (spn) {
showItA(spn, 0);
showItA(ch, 1);
}
}
teInput.prototype._initialized = true;
}
var m = this, cfg = itm.opConfig, o = uio, er = evHandle, ch = getEM(o, "TEXTAREA"); //TEXTAREA優先檢查,有時會有BUTTON
if (!ch.length) ch = getEM(o, "INPUT");
if (!ch.length) ch = getEM(o, "SELECT");
if (!ch.length) ch = getEM(o, "DIV");
m.item = itm; m.ch = ch;
m.name = itm.name; m.text = itm.text; m.fieldName = itm.fieldName;
m.rdo = readOnly || hasBit(cfg, GIA.WriteDenied);
m.uio = uio;
var o2 = ch[0];
if (!o2) return;
var evRef1 = this.evtHandle;
var er2 = function () { evRef1.call(m); };
if (ValueCanChoose(itm, 1) && ((o2.tagName == "INPUT" && o2.type == "text") || o2.tagName == "TEXTAREA")) {
setAtr(o2, KW.Choice, itm.choice); setAtr(o2, KW.ControllerId, itm.ctrlId); setAtr(o2, KW.opDataType, itm.dataType);
o2._surItm = itm;
var btns = getEMT(o, "input", "button");
if (!btns.length) btns = getEM(o, "BUTTON");
if (!btns.length) addValPickButton(o2);
else {
btns[0].tarObject = o2
btns[0].onclick = valPickButtonClick;
btns[0].onfocus = er2;
}
}
m.style = o.style;
o.onclick = er; o2.onblur = er; o2.itemNm = itm.name; o.itemNm = itm.name; o2.onmousedown = MenuHide;
var cho = itm.choice, chv = cho ? parseChoiceA(cho, 1) : null, vnx;
for (var i = 0; i < ch.length; i++) {
ch[i].onblur = er; ch[i].itemNm = itm.name;
ch[i].onfocus = er2;
if (m.rdo) ch[i].disabled = true;
if (ch[i].tagName == "INPUT") {
if (ch[i].type == "text") m.setInputVal(ch[i], ""); // ch[i].value = "";
else if (ch[i].type == "radio" || ch[i].type == "checkbox") {
ch[i].checked = false;
ch[i].parentNode.itemNm = itm.name;
var v = ch[i].value, nx = ch[i].nextSibling; if (!nx) nx = ch[i].previousSibling; if (!nx) nx = ch[i].parentNode;
if(chv){
for (var j = 0; j < chv.length; j++) {
if (chv[j][0] == v) {
setEmTxt(nx, chv[j][1]);
}
}
}

}
}
else if (ch[i].tagName == "TEXTAREA") m.setInputVal(ch[i], ""); //ch[i].value = "";
else if (ch[i].tagName == "SELECT") {
while (ch[i].children.length > 0) { ch[i].removeChild(ch[i].children[0]); }
for (var j = 0; j < chv.length; j++) {
var opn = ch[i].appendChild(newEm("option"));
opn.value = chv[j][0];
opn.innerText = chv[j][1];
}
ch[i].onchange = er;
GJT.eventAddHandle(ch[i], "change", er2);
break; //set only first one
}
}
}
function teCreateSysToolMap() {
var c = CMDE, n = i18nm,
a = [c.mnuFile, n.tlFile, c.mnuEdit, n.mnuEdit, c.mnuView, n.tlView, c.AppendRow, n.AppendRow, c.ArrangeColumns, n.tlArrangeCol,
c.ClearRange, n.tlClearRange, c.Copy, n.tlCopy, c.CopyHTML, n.tlCopyHTML, c.CopyHTMLWithTitle, n.tlCopyHTMLWithTitle,
c.CopyWithTitle, n.tlCopyWithTitle, c.Delete, n.tlDelete, c.FillLR, n.tlFillLR, c.FillUD, n.tlFillUD, c.FillUDIncr, n.tlFillUDIncr,
c.HideColumns, n.tlHideCol, c.HideRows, n.tlHideRowsSel, c.InsertRow, n.tlInsertRow, c.Paste, n.tlPaste,
c.PasteInsert, n.tlPasteInsert, c.RefreshRows, n.RefreshDataRows, c.RemoveRows, n.tlRemoveRow, c.Save, n.tlSave, c.SaveWhole, n.SaveWhole, c.SetRowColor, n.tlSetRowColor,
c.ShowColumns, n.tlShowCol, c.ShowRows, n.tlShowRowsSel, c.SortA, n.SortA, c.SortD, n.SortD, c.SortN, n.SortNone, c.SwitchSelMode, n.tlSelectMode,
c.UndoPull, n.tlUndo, c.SpecialTool, n.tlOthers, c.SetPrintOneTable, n.tlSetPrintOneTable, c.Logout, n.Logout, c.Start, n.tlOpenPage,
c.ExtendSel, n.tlExtendSel, c.MoveCols, n.MoveColumns, c.MoveRows, n.MoveRows, c.BeginEdit, n.tlEdit, c.FloatHeader, n.tlFixRC, c.SelColumnsSet, n.tlSelPreDefineCol,
c.ShowProperties, n.mnuProperties, c.ShowRecordForm, n.mnuShowRecordForm, c.HideRecordForm, n.mnuHideRecordForm, c.SelectAll, n.SelAll, c.CreateReport, n.CreateReport,
c.ExportReport, { text: n.CreateReport.text + " ( " + n.Export.text + " )", tip: n.CreateReport.tip }, c.Query, n.Query, c.Export, n.Export,
c.ExportReportToWindow, { text: n.CreateReport.text + " ( " + n.OpenNewWindow.text + " )", tip: n.CreateReport.tip },
c.Personalizing, n.Personalizing, c.Developer, n.Developer, c.advQuery, n.tlQuery, c.expandQry, n.tlExpandRelaCurrent, c.expandQryRv, n.ExpandRelaRvs,
c.ShowMemoBox, n.ShowMemoBox, c.HideMemoBox, n.HideMemoBox, c.ShowNumMemoBox, n.ShowNumMemoBox, c.HideNumMemoBox, n.HideNumMemoBox, c.swToDocumentMode, n.swToDocumentMode,
c.swToSheetMode, n.swToSheetMode, c.ShowMemoSymbo, n.ShowMemoSymbo, c.QuickQuery, n.QuickQuery, c.QuickQueryExp, { text: n.QuickQuery.text + " ( " + n.Export.text + " )", tip: n.QuickQuery.tip },
c.expandQryWithChildren, n.ExpandRelaWithChildren, c.expandQryOnlyChildren, n.ExpandRelaOnlyChildren, c.Refresh, n.tlRefreshData, c.CloneRows, n.CloneRows, c.showRelatedItem, n.ShowRelatedItems,
c.RefreshAll, n.RefreshAll, c.ShowChgHistory, n.ShowChgLog, c.ExpandAll, n.ExpandAll, c.CheckinFile, n.CheckinFile, c.CheckoutFile, n.CheckoutFile, c.CheckFileCount, n.CheckFileCount,
c.ShowAnnexImg, n.ShowAnnexImg, c.ShowAnnexList, n.ShowAnnexList, c.ShowFlowCtrl, n.ShowFlowCtrl, c.ChgColumnWidth, n.ChgColumnWidth, c.ImportForeignInfo, n.ImportForeignInfo,
c.tlReviseRequest, n.tlReviseRequest, c.tlFreeNote, n.tlFreeNote, c.MoveUp, n.MoveUp, c.MoveDown, n.MoveDown, c.Upgrade, n.Upgrade, c.Downgrade, n.Downgrade, c.RmvDuplicateRows, n.RmvDuplicateRows, c.CopyDataRowURL, n.CopyDataRowURL];

var r = {}, cn;
for (var i = 0; i < a.length; i += 2) {
if (!a[i + 1]) continue;
r[a[i]] = a[i + 1];
a[i + 1].name = a[i] + "_"; cn = null;
if (a[i] == c.Save) cn = "Save";
if (a[i] == c.SaveWhole) cn = "SaveWhole";
if (a[i] == c.Export) cn = "Export";
if (a[i] == c.InsertRow) cn = "InsertRow";
if (a[i] == c.AppendRow) cn = "AppendRow";
if (a[i] == c.RemoveRows) cn = "RemoveRow";
if (a[i] == c.Delete) cn = "DeleteData";
if (a[i] == c.SortA) cn = "SortA";
if (a[i] == c.SortD) cn = "SortD";
if (a[i] == c.advQuery) cn = "Query";
if (cn) a[i + 1].className = cn;
}
return r;
}
function sysCmd(cmdCode, hasChildren) {//name, caption, description, dataType, opconfig, programPrivilege, dataPrivilege
var pm = PROG._sysTM;
if (!pm) { pm = teCreateSysToolMap(); PROG._sysTM = pm; }
var res = pm[cmdCode]; //new OpItem(name, i18nItem.text, i18nItem.tip, GDT.String);
if (hasChildren && !res.children) res.children = new OpItems();
return res;
}
function sysCmdAdd(tar, cmdCodes, hasChildren) {//name, caption, description, dataType, opconfig, programPrivilege, dataPrivilege
var p = PROG, m = cmdCodes;
if (m instanceof Array) {
for (var i = 0; i < m.length; i++) { tar.add(sysCmd(m[i], hasChildren)); }
} else return tar.add(sysCmd(m, hasChildren));
}
function NIT(name, text, tip, className, sIcon) {
var r = new OpItem(name, text, tip);
if (className != null) r.className = className;
if (sIcon != null) r.imageURL = sIcon;
return r;
}
function NITAdd(tar, name, text, tip, className, sIcon) {
var m = name;
if (!tar) tar = new OpItems();
if (m instanceof Array) {
for (var i = 0; i < m.length; i++) { tar.add(NIT(m[i][0], m[i][1], m[i][2], m[i][3], m[i][4])); }
} else tar.add(NIT(name, caption, tip, className, sIcon));
return tar;
}
function mnuHLine() { return new OpItem("hl" + Math.random(), "-", "", 0, GIA.Disabled); }
function mnuAddHline(tar) { tar.add(mnuHLine()); }

function ECNtoXML(xmlDocObj, criterion, node) {
var doc = xmlDocObj, nd = node, ec = criterion, re, nd2, nd3, flt, rqr, edl, itm;
if (!doc) doc = GJT.xmlDocument();
if (!nd) { nd = xEm(doc, "ECN"); doc.appendChild(nd); }
setAtr(nd, "action", ec.action);
setAtr(nd, "appId", ec.appId);
setAtr(nd, "pageId", ec.pageId);
if (!ec.tzos) ec.tzos = (new Date()).getTimezoneOffset();
setAtr(nd, "tzos", ec.tzos);
for (var i = 0; i < ec.length; i++) {
re = ec[i];
flt = re.filters; rqr = re.required; edl = re.editLog;
if (!flt || flt.length == 0) continue;
nd2 = nd.appendChild(xEm(doc, "ECN"));
setAtr(nd2, "action", ec.action);
setAtr(nd2, "tblNm", re.tableName);
setAtr(nd2, "tarId", re.tarId);
setAtr(nd2, "rowId", re.id);
if(re._clonedFrom)setAtr(nd2, "clonedFrom", re._clonedFrom);
if (re.isNew) setAtr(nd2, "isNew", "1");
for (var j = 0; j < flt.length; j++) {
itm = flt[j]; //OpItemFilter
nd3 = nd2.appendChild(xEm(doc, "flt"));
setAtr(nd3, "name", itm.name); setAtr(nd3, "fldname", value4XML(itm.fieldName));
setAtr(nd3, "value1", value4XML(itm.value1)); setAtr(nd3, "value2", value4XML(itm.value2));
setAtr(nd3, "cpsm", itm.ComparisonMode);
}
if (rqr) {
for (var j = 0; j < rqr.length; j++) {
itm = rqr[j]; //OpItemFilter
nd3 = nd2.appendChild(xEm(doc, "rqr"));
setAtr(nd3, "name", itm.name); setAtr(nd3, "value", value4XML(itm.value));
}
}
if (edl) {
for (var j = 0; j < edl.length; j++) {
itm = edl[j]; //OpItemFilter
nd3 = nd2.appendChild(xEm(doc, "edl"));
setAtr(nd3, "name", itm.name); setAtr(nd3, "value", value4XML(itm.value));
setAtr(nd3, "ov", value4XML(itm.originalValue));
setAtr(nd3, "ovSeri", value4XML(itm.originalValueSerialized));
}
}
if (re.subCriterion) ECNtoXML(doc, re.subCriterion, nd2);
}
return doc;
}
function value4XML(value) { return value == null ? KW.dbNull : value; } //KW.dbNull

function newRecForm(itms, container, name, evHnd, lyotxt, ge) {
var myF = new teRecordForm(itms, container, evHnd, lyotxt, ge);
if (!lyotxt) teBPCcmn(myF, "GetHtmlRecForm", name, null, null, false);
return myF;
}
function teSaveDataN(gridedit, criterion, syncSave) {
if (!criterion || criterion.length == 0) return alert(i18nm.NoDataMfd.text);
var g = gridedit, doc = ECNtoXML(null, criterion);
if (!doc) return;
var asynchronous = null; if (syncSave) asynchronous = false;
return teBPC(g, criterion, doc, null,null,asynchronous);
}
function teDeleteDataN(gridedit, criterion) {
if (!criterion || criterion.length == 0) return alert(i18nm.NoProperObjectsInSel.text);
var doc = ECNtoXML(null, criterion);
if (!doc) return;
return teBPC(gridedit, criterion, doc);
}
function teQryReportDefItems(ge, _cntType) {
ge.tarContentType = _cntType;
var to = { ontimeout: function () { alert("Timeout for get Reports Items"); }, value: 8000 };
return teBpcSync("qryRptDefItems", ge, null, null, to);
}
function teReportDefResp(itm, itms) {
var g = itms.tar4; return g.CreateReport(itm.name, g.tarContentType);
}
function teQryDefinedQryItems(ge) {
var to = { ontimeout: function () { alert("Timeout for get PreDefined criteria"); }, value: 8000 };
return teBpcSync("qryDefinedQryItems", ge, null, null, to);
}
function teQryDefinedRelatedItems(ge) {
var to = { ontimeout: function () { alert("Timeout for get PreDefined Related Items"); }, value: 8000 };
teBpcSync("qryDefinedRelaItems", ge, null, null, to);
}
function teQryBOR_F(ge,forT) {
//var to = { ontimeout: function () { alert("Timeout for get BO Relation (From) Items"); }, value: 8000 };
//return teBpcSync("qryBOR_F", ge, null, null, to);
var xp = ["Action", "subact", "tarid", "pgid"], vp = ["qryBOR", forT ? "T" : "F", ge.id, getTargetPage(ge)],o;
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1), o;
if (txt) {
o = JSON.parse(txt); //eval("o=" + txt);
} else o = {};
return o;
}
function teQryBOR_T(ge) {
return teQryBOR_F(ge, 1);
}
function teQryByDefFilters(ge) {
//ge.qckQryItms
}
function teQryDefReltedResp(itm, itms) {
var g = itms.tar4; return g.showRelatedItem(itm.name);
}

function teSaveUserSetting(tarObj, sType, sValue, bRemove, asynchronous) {
var act = bRemove ? "RemoveUsrSet" : "saveUsrSet", param = [];
if (!tarObj) tarObj = { id: "PAGE" }; //page level
if (sType instanceof Array) {
for (var i = 0; i < sType.length; i++) {
param.push({ name: sType[i], value: sValue[i] });
}
} else { param[0] = { name: sType, value: sValue} }
teBPCcmn(tarObj, act, null, param, null, asynchronous);
}
function teGetUserSetting(tarObj, sType) {
if (!tarObj) tarObj = { id: "PAGE" }; //page level
var txt = teBpcSync("getUserSetting", tarObj, null, sType);
if (sType instanceof Array) return txt;
return txt[0];
}
function tePersonalizing(tarObj, forDev) {
var pvg = tarObj.programPrivilege, itms = new OpItems(), n = i18nm;
if (forDev && hasBit(pvg, PPVG.AdminUser)) {
if (tarObj instanceof GridEdit) {
itms.add({ name: "RecFormEditor", text: "Record Form Layout Editor" });
itms.add({ name: "RecFormEditorAF", text: "Record Form Layout Editor (Add new Fields)" });
itms.add({ name: "RecFormEditorCO", text: "Record Form Layout Editor (Clear Old Design)" });
itms.add({ name: "DataViewEditor", text: "Data View Editor" });
itms.add({ name: "qryParamLyoEditor", text: "Query Parameters Layout Editor" });
itms.add({ name: "qryParamLyoEditorCO", text: "Query Parameters Layout Editor (Clear Old Design)" });
itms.add({ name: "pvtEdtrD", text: "Pivot Table Editor (Develop)" });
itms.add({ name: "pvtEdtrR", text: "Pivot Table Editor (Released)" });
itms.add({ name: "pvtEdtrP", text: "Pivot Table Editor (User Public)" });
itms.add({ name: "chartEdtrD", text: "Chart Designer (Develop)" });
itms.add({ name: "chartEdtrR", text: "Chart Designer (Released)" });
//itms.add({ name: "chartEdtrP", text: "Chart Designer (User Public)" });
itms.add({ name: "bgnChartsD", text: "Show Charts...(Dev)" });
//itms.add({ name: "teTestNGrid", text: "Test Grid Filling" });
} else if (tarObj instanceof opTreeView) {
itms.add({ name: "tvwDesigner", text: "TreeView Designer" });
}
itms.add(mnuHLine());
//itms.add({ name: "PageLayoutEditor", text: "Page Layout Editor" });
//itms.add({ name: "PageLayoutEditorAF", text: "Page Layout Editor (Add new Fields)" });
//itms.add({ name: "PageLayoutEditorCO", text: "Page Layout Editor (Clear Old Design)" });
itms.add({ name: "pglyoEdtrD", text: "Page Layout Design (Develop)" });
if (PROG.children.getAll().length > 1) {
itms.add(mnuHLine());
itms.add({ name: "ViewRelationDesign", text: "Master Detail Designer" });
}
itms.add(mnuHLine());
itms.add({ name: "saveUsrSettingToDefault", text: "Save Setting as System Default" });
itms.add({ name: "showKeyFields", text: "Show Key Fields" });
itms.add({ name: "showEditedFields", text: "Show Edited Fields" });
itms.add({ name: "showScreenSize", text: window.innerWidth + "x" + window.innerHeight + " - " + screen.width + "x" + screen.height });
itms.add({ name: "showAllFieldsInfo", text: "Show all fields information" });
itms.add({ name: "showAllFieldsInfoS", text: "Show all fields Simple info" });
itms.add({ name: "showShowedFieldsInfo", text: "Show showed fields info" });
itms.add({ name: "pushContext", text: "Push Context (Begin Simulating an user)" });
itms.add({ name: "pullContext", text: "Pull Context (Stop Simulating an user)" });
//
} else {
if (tarObj.hasSchemaFlds) {
itms.add({ name: "UseColumnsSetting", text: n.UseColumnsSetting.text, tip: n.UseColumnsSetting.tip });
itms.add({ name: "SaveColumnsSetting", text: n.SaveColumnsSetting.text, tip: n.SaveColumnsSetting.tip });
itms.add({ name: "DelColumnsSetting", text: n.DelColumnsSetting.text, tip: n.DelColumnsSetting.tip });
itms.add(mnuHLine());
itms.add({ name: "pvtEdtrU", text: n.DesignPivotTable.text, tip: n.DesignPivotTable.tip });
itms.add(mnuHLine());
itms.add({ name: "CreatePivotTable", text: n.CreatePivotTable.text, tip: n.CreatePivotTable.tip });
if (hasBit(tarObj._dspOptions, GJT.DSO.SupportChart)) {
itms.add({ name: "bgnChartsU", text: "Show Charts" });
}
itms.add(mnuHLine());
} else if (tarObj.fieldsAll && tarObj.fieldsAll.length > 2) {
itms.add({ name: "pvtEdtrU", text: n.DesignPivotTable.text, tip: n.DesignPivotTable.tip });
itms.add(mnuHLine());
itms.add({ name: "CreatePivotTable", text: n.CreatePivotTable.text, tip: n.CreatePivotTable.tip });
}
itms.add({ name: "resetUserSetting", text: n.ResetMyUsrSetting.text });
}
itms.tarObj = tarObj;
itms.onclick = tePersonalizing2;
SysShowMenuT(itms); //Firefox can't show menu immediately, event mouseup cause menu hide
}
function tePersonalizing2(itm, itms, c) {
var tar = itms.tarObj, nm = itm.name, asynchronous = null;
if ("UseColumnsSetting" == nm) asynchronous = false;
if ("resetUserSetting" == nm) { if (!window.confirm(i18nm.AlertRestoreToDefault.text)) return; }
if (nm == "UpHtmlRecForm") { }
else if ("SaveColumnsSetting" == nm) {
var nsl = tar.getFields().getNames(",");
var cpt = prompt(i18nm.PlsInputCaption.text, "Untitled");
if (!cpt) return;
teBPCcmn(tar, nm, null, [{ name: "caption", value: cpt }, { name: "columns", value: nsl}]);
}
else if ("UseColumnsSetting" == nm || "DelColumnsSetting" == nm) teColumnsSettingStep1(tar, nm);
else if ("RecFormEditor" == nm) teEditLayout(tar, 0, "Dev", 0, "RF");
else if ("RecFormEditorAF" == nm) teEditLayout(tar, 1, "Dev", 0, "RF");
else if ("RecFormEditorCO" == nm) teEditLayout(tar, 1, "Dev", 1, "RF");
else if ("PageLayoutEditor" == nm) teEditLayout(tar, 0, "Dev", 0, "PG");
else if ("PageLayoutEditorAF" == nm) teEditLayout(tar, 1, "Dev", 0, "PG");
else if ("PageLayoutEditorCO" == nm) teEditLayout(tar, 1, "Dev", 1, "PG");
else if ("qryParamLyoEditor" == nm) teEditLayout(tar, 1, "Dev", 0, "QP");
else if ("qryParamLyoEditorCO" == nm) teEditLayout(tar, 1, "Dev", 1, "QP");
else if ("ViewRelationDesign" == nm) teViewRelationDesign(tar, "Dev");
else if ("tvwDesigner" == nm) teTreeViewDesign(tar, "Dev");
else if ("DataViewEditor" == nm) teDataViewEditor(tar, "Dev");
else if (("pvtEdtrD" == nm || "pvtEdtrU" == nm || "pvtEdtrR" == nm || "pvtEdtrP" == nm) && tar.showPivotDesigner) tar.showPivotDesigner(nm.substring(7));
else if ("CreatePivotTable" == nm && tar.CreatePivotTable) tar.CreatePivotTable();
else if (("chartEdtrD" == nm || "chartEdtrU" == nm || "chartEdtrR" == nm || "chartEdtrP" == nm)) showChartDesigner(tar, nm.substring(9));
else if (("pglyoEdtrD" == nm || "pglyoEdtrR" == nm)) showLayoutDesigner(getTargetPage(), PROG.children, nm.substring(9));//page沒有獨立物件
else if ("bgnChartsD" == nm) teChartShow(tar,"D");
else if ("bgnChartsU" == nm) teChartShow(tar,"U");
else if ("showKeyFields" == nm) SysShowMenuT(tar.fieldsKey);
else if ("showEditedFields" == nm) SysShowMenuT(tar.mainTR()._editLog);
else if ("showAllFieldsInfo" == nm) teShowAllFieldsInfo(tar);
else if ("showAllFieldsInfoS" == nm) teShowAllFieldsInfoS(tar);
else if ("showShowedFieldsInfo" == nm) teShowAllFieldsInfoS(tar, true);
else if ("pushContext" == nm) tePushContext(0);
else if ("pullContext" == nm) tePushContext(1);
else if ("teTestNGrid" == nm) teTestNGrid();
else teBPCcmn(tar, nm);
}
function teShowAllFieldsInfo(tar){
var fa=tar.fieldsAll;if(!fa)return;
var dg = new DialogInBody("","Fields of " + tar.text);
var dv = newEm("div");
dg.setClient(dv);
var tbl = addE("<table class='DataEdit'><thead><td>Name</td><td>Fld Name</td><td>Caption</td><td>Description</td><td>Type</td><td>Len</td></thead><tbody></tbody></table>", dv);
var tbd=getEM(tbl,"TBODY")[0];
for (var i=0;i<fa.length;i++){
var t=fa[i], tr = addE("<tr><td></td><td></td><td></td><td style='white-space:pre-wrap;'></td><td></td><td></td></tr>",tbd);
var cs=tr.cells;
cs[0].innerText = t.name;
cs[1].innerText = t.fieldName;
cs[2].innerText = (((t.opConfig && (t.opConfig & GIA.IsKey) == GIA.IsKey)) ? "* " : "")+ t.text;
cs[3].innerText = t.tip;
var dtn = "String",dti=t.dataType;
if(GDT.Integer==dti)dtn="Int";
if(GDT.Real==dti)dtn="Real";
if(GDT.Boolean==dti)dtn="Bool";
if(GDT.DateTime==dti)dtn="DateTime";
if(GDT.Short==dti)dtn="Short";
cs[4].innerText = dtn;//String: 1, Integer: 2, Real: 3, Boolean: 4, DateTime: 5, Short: 12
cs[5].innerText = t.maxLength;
}
dg.showMe();
}
function teShowAllFieldsInfoS(tar, forShowed) {
var fa = forShowed ? tar.getFields() : tar.fieldsAll; if (!fa) return;

var dg = new DialogInBody("", "Fields of " + tar.text);
var dv = newEm("div"), ev = GJT.event(),fav = ev && ev.ctrlKey;
dg.setClient(dv);
var tbl = addE("<table class='DataEdit'>" + (fav ? "" : "<thead><td>Fld Name</td><td>Caption</td><td>id</td></thead>") + "<tbody></tbody></table>", dv);
var tbd = getEM(tbl, "TBODY")[0],ls;
for (var i = 0; i < fa.length; i++) {
var t = fa[i], tr = addE("<tr><td></td><td></td><td></td></tr>", tbd);
var cs = tr.cells,nm=t.name.replace("_", "");
cs[0].innerText = fav ? ( "\"" + t.fieldName + "\", " ) : t.fieldName;
cs[1].innerText = (fav ? "--" : "") + (((t.opConfig && (t.opConfig & GIA.IsKey) == GIA.IsKey)) ? "* " : "") + t.text;
cs[2].innerText = nm;
if (i == 0) ls = nm; else ls += " ," + nm;
}
if (forShowed) { addE("<span>"+ls+"</span>",dv); };
dg.showMe();
}
function tePushContext(pullBk) {
var p = pullBk, a = p ? window.confirm("Are you sure to pull back user context?") : window.prompt("Please input the user account for simulating. (ex:dom0030\G00001 or G00001)", ""); if (!a) return;
var b = (a + "").split("\\"), d = (b.length > 1 ? b[0] : ""), u = (b.length > 1 ? b[1] : b[0]);
var xp = ["Action", "user", "subact", "domain"], vp = ["pushContext", u, p ? "pull" : "", d];
var x = teQueryByAjax(null, xp, vp, null, 0, null, null, 1), o = eval("o=" + x);
if (!o) return;
if (o.err) alert(o.err); else { try { document.location = document.location; } catch (ex) { } }
}
function teQueryByExpandU(surGE, surTRs, surFlds, tarGE, tarFlds){//由surGE展開到tarGE (未經定義關聯)
var r= new opRela();
r.from=surGE;r.to=tarGE;
r.fromFields = surGE.fieldsAll.collect(surFlds);
var qryPrmT = tarGE.getQryParamters ? tarGE.getQryParamters() : null;
r.toFields = qryPrmT ? qryPrmT.collect(tarFlds) : tarGE.fieldsAll.collect(tarFlds);
return teExpandQryDo(r, 0, surTRs, null, 1);
}
function teQueryByRela(tarGE, surGE, surTRs) {//tarGE surGE 都需要檢查
var t = tarGE, s = surGE, rls = s.relaF;
if (rls) {
for (var i = 0; i < rls.length; i++) {
var r = rls[i];
if (r.to == t && r.from == s) teExpandQryDo(r);
}
}
rls = s.relaT;
if (rls) {
for (var i = 0; i < rls.length; i++) {
var r = rls[i]; if (r.to == s && r.from == t) teExpandQryDo(r,1);
}
}
}
function teExpandQryAdv(ge, rvs) { //advance expand
//show menu
var itms = new OpItems(), n = i18nm, ne = n.Export;
if (rvs) {
itms.add({ name: "expandQryRvsExport", text: n.ExpandRelaRvs.text + " ( " + ne.text + " )" });
itms.add({ name: "expandQryRvsAdv", text: n.AdvancedExpand.text + " ( " + n.ExpandRelaRvs.text + " )" });
itms.add({ name: "expandQryRvsAdvExport", text: n.AdvancedExpand.text + " ( " + n.ExpandRelaRvs.text + "-" + ne.text + " )" });
} else {
itms.add({ name: "expandQryExport", text: n.tlExpandRela.text + " ( " + ne.text + " )" });
itms.add({ name: "expandQryAdv", text: n.AdvancedExpand.text });
itms.add({ name: "expandQryAdvExport", text: n.AdvancedExpand.text + " ( " + ne.text + " )" });
}
itms.onclick = teExpandQryAdv2;
itms.surO = ge;
SysShowMenu(itms);
}
function teExpandQryAdv2(itm, itms) {
var m = itms.surO, nm = itm.name;
if (nm == "expandQryExport") return m.geExportDataStep1(teExpandQryAdv3);
if (nm == "expandQryRvsExport") return m.geExportDataStep1(teExpandQryAdv3R);
if (nm == "expandQryAdv") return teExpandQry(m, 0, null, 0, 1, null,1);
if (nm == "expandQryRvsAdv") return teExpandQry(m, 1, null, 0, 1, null, 1);
if (nm == "expandQryAdvExport") return m.geExportDataStep1(teExpandQryAdv4);
if (nm == "expandQryRvsAdvExport") return m.geExportDataStep1(teExpandQryAdv4R);
}
function teExpandQryAdv3(itmExportType, itms) {
teExpandQry(itms.tar, 0, null, 0, 1, itmExportType.name);
}
function teExpandQryAdv3R(itmExportType, itms) {
teExpandQry(itms.tar, 1, null, 0, 1, itmExportType.name);
}
function teExpandQryAdv4(itmExportType, itms) {
teExpandQry(itms.tar, 0, null, 0, 1, itmExportType.name, 1);
}
function teExpandQryAdv4R(itmExportType, itms) {
teExpandQry(itms.tar, 1, null, 0, 1, itmExportType.name, 1);
}
function teExpandQry(ge, rvs, nodeMode, expAll, forceShow, cntType, advanceMode) {
var itms = [], itms0 = rvs ? ge.relaT : ge.relaF;
if (!itms0 || !itms0.length) return;
//do not show hidden
for (var i = 0; i < itms0.length; i++) {
var r = itms0[i], lm = r.linkMode;
if (hasBit(lm, GLC.Disabled) || hasBit(lm, GLC.Hidden) || (expAll && hasBit(lm, GLC.NoExpandAll))) continue;
var itm = { name: r.name, text: r.text }, txo = PROG.getTextO(rvs ? r.textNameRev : r.textName);
if (txo) { itm.text = txo.text; itm.tip = txo.tip; }
itm._r = r;
itms.push(itm);
}
if (!itms.length) return;
else if (itms.length == 1) teExpandQryDo(itms[0]._r, rvs, null, nodeMode, forceShow, cntType, advanceMode);
else if (expAll) {
for (var i = 0; i < itms.length; i++) {
var r = itms[i]._r, lm = r.linkMode;
if (hasBit(lm, GLC.ForAddNewRelativeRow) || hasBit(lm, GLC.ForModifyRelative)) continue;
teExpandQryDo(r, rvs, null, nodeMode, forceShow, cntType);
}
} else {
for (var i = 0; i < itms.length; i++) {
if (!itms[i].text) {
itms[i].text = rvs ? itms[i].from.text : itms[i].to.text;
}
}
itms.onclick = teExpandQry2;
itms.rvs = rvs;
itms.nodeMode = nodeMode;
itms.tarCntType = cntType;
itms.advanceMode = advanceMode;
SysShowMenuT(itms);
}
}
function teExpandQry2(itm, itms) {
teExpandQryDo(itm._r, itms.rvs, null, itms.nodeMode, 1, itms.tarCntType, itms.advanceMode);
}
function teExpandQryDoAdvMode(tar, crn, cntType, advanceMode) {
// if (cntType) tar.query(crn, cntType); //匯出每次都須執行
// else { tar.query(crn); }
//詢問使用者額外條件
if (advanceMode == 1) return tar.QueryByDlg(crn, cntType);
}
function teExpandQryDo(rela, rvs, surTRs, nodeMode, forceShow, cntType, advanceMode) {
var r = rela, lm = r.linkMode, vQ;
var sur, surFlds, tar, tarFlds;
if (rvs) {
sur = r.to; surFlds = r.toFields; tar = r.from; tarFlds = r.fromFields;
} else {
sur = r.from; surFlds = r.fromFields; tar = r.to; tarFlds = r.toFields;
}
if (hasBit(lm, GLC.BypassHiddenObject) && !forceShow) { if (tar.container && isHidden(tar.container)) return; }
if (!rvs && hasBit(lm, GLC.AllMaster) && !surTRs) { //all rows in grid
surTRs = sur.getAllDataTRs();
}
if (!rvs && hasBit(lm, GLC.SingleMaster) && !surTRs && sur.mainTR) {
surTRs = [sur.mainTR()];
}
var fanr = hasBit(lm, GLC.ForAddNewRelativeRow), fmrv = hasBit(lm, GLC.ForModifyRelative);
if ((fanr || fmrv) && !rvs) {
if (!hasBit(lm, GLC.AllowNewMast)) {
if (!surTRs) surTRs = sur.getSelectedTRs(1);
if (!surTRs) return;
for (var i = 0; i < surTRs.length; i++) {
if (sur.isNewRow(surTRs[i])) {
alert(i18nm.MastNotSavedBeforeExpandDtl.text.replace("{1}", sur.text).replace("{2}", tar.text));
return;
}
}
}
}
vQ = sur.getFieldsValues(surFlds.getNames(","), surTRs, null, 1, 1, nodeMode);
if (!vQ) { delete tar["_lstqck"]; return; } //必須清除上次查詢條件,否則會造成關聯表不動作
//這裡檢查tar的上次連結展開的條件是否相同,相同就不再展開,因為有時會有detail-master的反向關聯設定,多個detail對到同一個master
var crn = new OpQueryCriterion(), qryPnd = hasBit(lm, GLC.PendingQuery), synPrm = hasBit(lm, GLC.SyncParameters) || qryPnd, tarChkQ = "_rxku" + tarFlds.getNames(","), fldCnt = surFlds.length,
e = GJT.compareModeEnum, prmO = tar.getQryParamtersUIO ? tar.getQryParamtersUIO() : null, rprm = tar.getQryParamters ? tar.getQryParamters() : null,
  un4ndp = hasBit(lm, GLC.ClearNoUsedParameters);
for (var i = 0; i < fldCnt; i++) {
//非文字的欄位如果是空字串需要排除
//展開關聯都是以一筆一筆為單位,不能清除空白
//if (tarFlds[i].dataType != GDT.String) {
// for (var j = vQ[i].length - 1; j >= 0; j--) {
// if (vQ[i][j] == "") vQ[i].splice(j, 1);
// }
//}
//目前設計無法處理欄位內容含有逗號的狀況,需要先置換成別的字元(用全形字，換 ,),Server端再換回去
if (tarFlds[i].dataType == GDT.String && rprm) {
for (var j =0; j< vQ[i].length; j++) {
if (vQ[i][j]) vQ[i][j] = vQ[i][j].replace(mRegMa, "，");
}
}
var vQL0 = vQ[i].join(","), s = new OpItemFilter(tarFlds[i], vQL0, e.In | e.ValueMustDoPairWithOthers);
crn.filters.add(s);
if (synPrm && prmO) doInqSqlGetPrmVal(prmO, tarFlds[i].name, vQL0);
tarChkQ += ("|" + vQL0);
}
if (r.filter) crn.filters.add(new OpItemFilter(tarFlds[0], r.filter, e.ValueIsNativeCommand));
if (rprm) {//對方是固定參數的物件
for (var i = 0; i < rprm.length; i++) {
if (crn.filters[rprm[i].name]) continue;
var s = new OpItemFilter(rprm[i], (un4ndp ? "" : rprm[i].value), e.In);
crn.filters.add(s);
if (un4ndp && synPrm && prmO) doInqSqlGetPrmVal(prmO, rprm[i].name, "");

}
}
if (hasBit(lm, GLC.NoPaging)) { crn.pageRows = 0; crn.pageNo = 1; }
if (hasBit(lm, GLC.RemoveRelativeRows)) {
if (tar.removeRows && tar.getAllDataRows) {
var rws = tar.getAllDataRows();
if (rws && rws.length > 0) {//remove all,if refused , abort it
tar.removeRows(rws);
rws = tar.getAllDataRows();
if (rws && rws.length > 0) return;
}
}
}
if (hasBit(lm, GLC.ActivateAftShowed)) {
var tdg = tar._myDialog;
if (tdg) {
tdg.showMe(); tdg.moveToMouse(1);
tdg.toZTop();
if (tdg.dlgCtrl.glitter) tdg.dlgCtrl.glitter();
}
if (tar.setActive) tar.setActive();
}
if ((fanr || fmrv) && !rvs) {
//正向展開才能插入新列,設定關聯值,否則用一般模式
var IgnorePvg = hasBit(lm, GLC.IgnorePrivilege), noEditLog = hasBit(lm, GLC.NoEditLog), noEvent = hasBit(lm, GLC.NoEvent);
var autoMatch = hasBit(lm, GLC.AutoSearchMatch), blankOnly = hasBit(lm, GLC.OverwriteBlankOnly);
var rl = vQ[0].length, rwsN;
if (fanr)
rwsN = tar.insertRows(rl, null, null, IgnorePvg);
else
rwsN = tar.getSelectedTRs(1);
if (fmrv && (autoMatch || blankOnly)) { //自動比對找出匹配的資料列,需要先找出目標物件的值
if (autoMatch && !fanr && r.subRela) { //新增資料列 無法匹配
//使用 r.subRela 來進行自動匹配檢查,關聯物件本身無法進行匹配,一定是另外一個
//透過匹配重新建立新的rwsN,同夥的關聯的from to 應該要相反才能使用
var rcks = r.subRela;
for (var i = 0; i < rcks.length; i++) {
var rk = rcks[i];
var surCK = rk.from; surFldsCK = rk.fromFields; tarCK = rk.to; tarFldsCK = rk.toFields;
if (tarCK != sur || surCK != tar) continue;
var vQCK = sur.getFieldsValues(tarFldsCK.getNames(","), surTRs, null, 1, 1, nodeMode);
var vQTCK = tar.getFieldsValues(surFldsCK.getNames(","), rwsN, null, 1, 1, nodeMode), rlSur = surTRs.length, rlTar = rwsN.length, fldCntCK = tarFldsCK.length;//資料列數量
var rwsNCK = [], rwsCK = {};
//先把tar 做成字典加快效率
for (var r = 0; r < rlTar; r++) {
var tarVK = "";
for (var i = 0; i < fldCntCK; i++) {
tarVK += "\t" + vQTCK[i][r]; //做出比對資料 強制用字串
}
rwsCK[tarVK] = rwsN[r];
}
for (var r = 0; r < rlSur; r++) {
var isSame = true, surVK = "";
for (var i = 0; i < fldCntCK; i++) {
surVK += "\t" + vQCK[i][r]; //做出比對資料 強制用字串
}
if (rwsCK[surVK]) { rwsNCK.push(rwsCK[surVK]); } //找到匹配的就加入.找不到的怎麼辦?
else rwsNCK.push(new VirtualTR());
}
rwsN = rwsNCK;
}
}
if (blankOnly) {
var vQT = tar.getFieldsValues(tarFlds.getNames(","), rwsN, null, 1, 1, nodeMode), rlT = vQT[0].length;
//逐筆比對 只覆寫空白的儲存格 則如果目標格有值就用舊值取代
for (var r = 0; r < rlT; r++) {
for (var i = 0; i < fldCnt; i++) { if (vQT[i][r] != "") vQ[i][r] = vQT[i][r]; }
}
}
}
for (var i = 0; i < fldCnt; i++) {
tar.setFieldValues(tarFlds[i].name, vQ[i], rwsN, noEditLog, noEvent, 0, 0, 0, true);
}
if (tar.evtBroadcast && fanr) tar.evtBroadcast("RelativeRowsInserted", [tar, rwsN, tarFlds]);
//
return;
}
if (synPrm && rprm) crn = null;
if (tar._isnnQ) return; //none query object
if (advanceMode) return teExpandQryDoAdvMode(tar, crn, cntType, advanceMode);
if (cntType) tar.query(crn, cntType);//匯出每次都須執行
if (qryPnd) return;
else if (forceShow || tar["_lstqck"] != tarChkQ) { tar.query(crn); tar["_lstqck"] = tarChkQ; } //保留本次查詢條件供下次比對
if (!rvs && r.subRela) {
for (var i = 0; i < r.subRela.length; i++) {
teExpandQryDo(r.subRela[i], rvs, surTRs, nodeMode, forceShow, cntType);
}
}
}
function doc2Xml(doc) {
if (doc.xml != undefined) return doc.xml;
return new XMLSerializer().serializeToString(doc);
}
function vwRelaToXml(res) {
var doc = GJT.xmlDocument();
var nd = doc.appendChild(xEm(doc, "div"));
for (var i = 0; i < res.length; i++) {
var ro = res[i], nd2 = nd.appendChild(xEm(doc, "rela")), nd3;
setAtr(nd2, "name", ro.name);
setAtr(nd2, "text", ro.text);
setAtr(nd2, "tip", ro.tip);
setAtr(nd2, "fromid", ro.from.id);
setAtr(nd2, "fromfields", ro.fromFields.getNames(","));
setAtr(nd2, "fromfieldsA", ro.fromFields.getNames(",", 0, 0, 0, 1));
setAtr(nd2, "toid", ro.to.id);
setAtr(nd2, "tofields", ro.toFields.getNames(","));
setAtr(nd2, "tofieldsA", ro.toFields.getNames(",", 0, 0, 0, 1));
setAtr(nd2, "fieldsanchor", ro.fieldsForAnchor.getNames(","));
setAtr(nd2, "styleforanchor", ro.styleForAnchor);
setAtr(nd2, "styleforbutton", ro.styleForButton);
setAtr(nd2, "linkmode", ro.linkMode);
setAtr(nd2, "filter", ro.filter);
setAtr(nd2, "relaAssm", ro.relaAssm);
setAtr(nd2, "noteX", ro.noteX);
setAtr(nd2, "textRev", ro.textRev);
setAtr(nd2, "textName", ro.textName);
setAtr(nd2, "textNameRev", ro.textNameRev);
}
return doc2Xml(doc); // new XMLSerializer().serializeToString(doc);
}
function vwXmlToRela(xml) {
var doc = GJT.xmlDocument(), pg = PROG, itms = pg.children.getAll();// pg.children;
doc.loadXML(xml);
var nd = doc.firstChild, res = [], chn = nd.childNodes;
for (var i = 0; i < chn.length; i++) {
var nd2 = chn[i];
var r = new opRela();
var fmId = nd2.getAttribute("fromid"), toId = nd2.getAttribute("toid"), fmfld = nd2.getAttribute("fromfields"), tofld = nd2.getAttribute("tofields"), fldanchor = nd2.getAttribute("fieldsanchor"), lm = nd2.getAttribute("linkmode");
var itmF = itms[fmId], itmT = itms[toId];
if (!itmF || !itmT) continue;
var fldsF = itmF.fieldsAll, fldsT = itmT.fieldsAll;
if (fldsF.length == 0 && itmF.fieldsPreDef) fldsF = itmF.fieldsPreDef;
var qryPrmT = itmT.getQryParamters ? itmT.getQryParamters() : null;
r.name = nd2.getAttribute("name"); r.text = nd2.getAttribute("text"); r.tip = nd2.getAttribute("tip");
r.from = itmF; r.to = itmT, r.linkMode = parseInt(lm, 10);
if (fmfld) r.fromFields = fldsF.collect(fmfld);
if (tofld) r.toFields = qryPrmT ? qryPrmT.collect(tofld) : fldsT.collect(tofld);
if (r.toFields.length != r.fromFields.length){
//嘗試使用名稱去找,但是需要逐一欄位找,以確保順序正確
var kk = 0;
}
if (fldanchor) r.fieldsForAnchor = fldsF.collect(fldanchor);
if (r.fromFields.length != fmfld.split(",").length) fldsF.collect(nd2.getAttribute("fromfieldsA"));
if (r.toFields.length != tofld.split(",").length) qryPrmT ? qryPrmT.collect(nd2.getAttribute("tofieldsA")) : fldsT.collect(nd2.getAttribute("tofieldsA"));
r.filter = nd2.getAttribute("filter"); r.relaAssm = nd2.getAttribute("relaAssm"); r.noteX = nd2.getAttribute("noteX"); r.textRev = nd2.getAttribute("textRev");r.textName = nd2.getAttribute("textName");r.textNameRev = nd2.getAttribute("textNameRev");
if (!r.filter) r.filter = ""; if (!r.relaAssm) r.relaAssm = ""; if (!r.noteX) r.noteX = ""; if (!r.textRev) r.textRev = ""; if (!r.textName) r.textName = "";if (!r.textNameRev) r.textNameRev = "";
r.styleForAnchor = nd2.getAttribute("styleforanchor");
r.styleForButton = nd2.getAttribute("styleforbutton");
res.push(r);
}
return res;
}

function getDvOpSetting(tar, channel) {
if(!tar || tar._isCreatedByJS)return {};
var txtXml = teBpcSync("GetDataViewDgn", tar, null, [{ name: "Channel", value: channel}]);
if (!txtXml) return {};
else return dvXmlToOpSet(txtXml);
}
function dvOpSetToXml(res) {
var doc = GJT.xmlDocument();
var nd = doc.appendChild(xEm(doc, "div")), fgns = res.fgns, fci = res.fci, fls = res.fls;
setAtr(nd, "f4jnr", noNullTxt(res.f4jnr));
setAtr(nd, "f4numdtl", noNullTxt(res.f4numdtl));
setAtr(nd, "f4numdtlsave", noNullTxt(res.f4numdtlsave));
setAtr(nd, "f4numdtltitle", noNullTxt(res.f4numdtltitle));
setAtr(nd, "f4memosave", noNullTxt(res.f4memosave));
setAtr(nd, "f4rshupdt", noNullTxt(res.f4rshupdt));
setAtr(nd, "rowscsp", noNullTxt(res.rowscsp));
setAtr(nd, "f4lvlindent", noNullTxt(res.f4lvlindent));
for (var i = 0; i < fgns.length; i++) {
var ro = fgns[i], nd2 = nd.appendChild(xEm(doc, "fgn")), nd3;
setAtr(nd2, "name", noNullTxt(ro.name));
setAtr(nd2, "caption", noNullTxt(ro.caption));
setAtr(nd2, "mflds", noNullTxt(ro.mflds));
setAtr(nd2, "ftbl", noNullTxt(ro.ftbl));
setAtr(nd2, "ftbltext", noNullTxt(ro.ftblText));
setAtr(nd2, "fgflds", noNullTxt(ro.fgflds));
setAtr(nd2, "rfsflds", noNullTxt(ro.rfsflds));
setAtr(nd2, "fgrfsflds", noNullTxt(ro.fgrfsflds));
setAtr(nd2, "fgfilter", noNullTxt(ro.filter));
setAtr(nd2, "fgalrtxt", noNullTxt(ro.alertText));
setAtr(nd2, "fgnotetxt", noNullTxt(ro.noteText));
if (ro.mfdenied) setAtr(nd2, "mfdenied", "Y");
if (ro.frcedlog) setAtr(nd2, "frcedlog", "Y");
if (ro.disabled) setAtr(nd2, "disabled", "Y");
if (ro.ClearIfNoMatch) setAtr(nd2, "clrnmtch", "Y");
if (ro.allowBlankVal) setAtr(nd2, "alwblnkval", "Y");
if (ro.setAsOldRowIfIsKey) setAtr(nd2, "soiik", "Y");
if (ro.noAlert4NoMatch) setAtr(nd2, "nalmnm", "Y");
if (ro.ImportAsNewColumns) setAtr(nd2, "impanc", "Y");
if (ro.AllowMultiValues) setAtr(nd2, "alwmv", "Y");
if (ro.AskUserSelColumns) setAtr(nd2, "ausc", "Y");
if (ro.ImportAsNewAttr) setAtr(nd2, "impanatr", "Y");
setAtr(nd2, "loosenfields", noNullTxt(ro.loosenfields));
setAtr(nd2, "npfxi", noNullTxt(ro.nameprefixImpt));
setAtr(nd2, "cpfxi", noNullTxt(ro.captionprefixImpt));
}
if (!fci) fci = [];
for (var i = 0; i < fci.length; i++) {
var ro = fci[i], nd2 = nd.appendChild(xEm(doc, "fci")), nd3;
setAtr(nd2, "name", ro.name);
if (ro.disabled) setAtr(nd2, "disabled", "Y");
setAtr(nd2, "formula", ro.formula);
setAtr(nd2, "fmtOpn", ro.fmtOpn);
setAtr(nd2, "tarf", ro.tarFld);
setAtr(nd2, "refstyle", ro.refstyle);
setAtr(nd2, "paramstyle", ro.paramstyle);
setAtr(nd2, "soundurl", ro.soundURL);
setAtr(nd2, "soundparam", ro.soundparam);
}
if (!fls) fls = [];
for (var i = 0; i < fls.length; i++) {
var ro = fls[i], nd2 = nd.appendChild(xEm(doc, "fls")), nd3;
setAtr(nd2, "name", ro.name);
if (ro.disabled) setAtr(nd2, "disabled", "Y");
setAtr(nd2, "formula", ro.formula);
setAtr(nd2, "fmtOpn", ro.fmtOpn);
setAtr(nd2, "tarf", ro.tarFld);
}
return doc2Xml(doc); // new XMLSerializer().serializeToString(doc);
}
function dvXmlToOpSet(xml, forOp) {
if (!xml) return {};
var doc = GJT.xmlDocument();
doc.loadXML(xml);
var nd = doc.firstChild, res = {}, chn = getEM(nd, "fgn"); res.fgns = []; res.ftbls = [];
res.f4jnr = nd.getAttribute("f4jnr");
res.f4numdtl = nd.getAttribute("f4numdtl");
res.f4numdtlsave = nd.getAttribute("f4numdtlsave");
res.f4numdtltitle = nd.getAttribute("f4numdtltitle");
res.f4memosave = nd.getAttribute("f4memosave");
res.f4rshupdt = nd.getAttribute("f4rshupdt");
res.rowscsp = nd.getAttribute("rowscsp");
res.f4lvlindent = nd.getAttribute("f4lvlindent");
for (var i = 0; i < chn.length; i++) {
var nd2 = chn[i], r = {};
r.disabled = nd2.getAttribute("disabled") == "Y";
if (forOp && r.disabled) continue;
r.name = nd2.getAttribute("name");
r.caption = nd2.getAttribute("caption");
r.mflds = nd2.getAttribute("mflds");
r.ftbl = nd2.getAttribute("ftbl");
r.ftblText = nd2.getAttribute("ftbltext");
r.fgflds = nd2.getAttribute("fgflds");
r.rfsflds = nd2.getAttribute("rfsflds");
r.fgrfsflds = nd2.getAttribute("fgrfsflds");
r.filter = nd2.getAttribute("fgfilter");
r.alertText = nd2.getAttribute("fgalrtxt");
r.noteText = nd2.getAttribute("fgnotetxt");
r.f4jnr = nd2.getAttribute("f4jnr");
r.mfdenied = nd2.getAttribute("mfdenied") == "Y";
r.frcedlog = nd2.getAttribute("frcedlog") == "Y";
r.ClearIfNoMatch = nd2.getAttribute("clrnmtch") == "Y";
r.allowBlankVal = nd2.getAttribute("alwblnkval") == "Y";
r.setAsOldRowIfIsKey = nd2.getAttribute("soiik") == "Y";
r.noAlert4NoMatch = nd2.getAttribute("nalmnm") == "Y";
r.ImportAsNewColumns = nd2.getAttribute("impanc") == "Y";
r.AllowMultiValues = nd2.getAttribute("alwmv") == "Y";
r.AskUserSelColumns = nd2.getAttribute("ausc") == "Y";
r.ImportAsNewAttr = nd2.getAttribute("impanatr") == "Y";
r.nameprefixImpt = nd2.getAttribute("npfxi");
r.captionprefixImpt = nd2.getAttribute("cpfxi");
r.loosenfields = nd2.getAttribute("loosenfields");
res.fgns.push(r);
}
chn = getEM(nd, "tbl");
for (var i = 0; i < chn.length; i++) {
var nd2 = chn[i], r = {};
r.id = nd2.getAttribute("id");
r.name = nd2.getAttribute("name");
r.text = r.name;
r.fields = nd2.getAttribute("fields");
res.ftbls.push(r);
}
chn = getEM(nd, "fci"); res.fci = [];
for (var i = 0; i < chn.length; i++) {
var nd2 = chn[i], r = {};
r.disabled = nd2.getAttribute("disabled") == "Y";
r.formula = nd2.getAttribute("formula");
if (forOp && (r.disabled || !r.formula)) continue; //ignore disabled
r.soundURL = nd2.getAttribute("soundurl");
r.soundparam = nd2.getAttribute("soundparam");
r.name = nd2.getAttribute("name");
r.fmtOpn = nd2.getAttribute("fmtOpn");
r.tarFld = nd2.getAttribute("tarf");
r.refstyle = nd2.getAttribute("refstyle");
r.paramstyle = nd2.getAttribute("paramstyle");
res.fci.push(r);
}
chn = getEM(nd, "fls"); res.fls = [];
for (var i = 0; i < chn.length; i++) {
var nd2 = chn[i], r = {};
r.disabled = nd2.getAttribute("disabled") == "Y";
r.formula = nd2.getAttribute("formula");
if (forOp && (r.disabled || !r.formula)) continue; //ignore disabled
r.name = nd2.getAttribute("name");
r.fmtOpn = nd2.getAttribute("fmtOpn");
r.tarFld = nd2.getAttribute("tarf");
res.fls.push(r);
}
return res;
}

function saveDataViewDesign(res, tar, channel) {
var txt = dvOpSetToXml(res);
param = [{ name: "dvDgn", value: txt }, { name: "Channel", value: channel}];
teBpcSync("UpDataViewDesign", tar, null, param);
}
function previewDataViewDesign(res, tar, channel) {
if (tar.setOps) tar.setOps(res);
}

function teEditLayout2(itm, itms, c) {
var x = "", s = itms; if (itm.name == "forMobile") x = "M";
teEditLayoutDo(s.tar, s.addFlds, s.channel + x, s.clearOld, s.lyoType, x);
}
function teEditLayoutDo(tar, addFlds, channel, clearOld, lyoType, userChannel) {
var param, et = lyoType, act, cpt;
if (channel) {
param = [{ name: "Channel", value: channel}];
if (clearOld) param.push({ name: "ClearOld", value: "Y" });
}
if (et == "PG") { act = "GetHtmlPageLayOut"; cpt = "Page layout editor"; }
else if (et == "RF") { act = "DownHtmlRecForm"; cpt = "Record Form Editor"; }
else if (et == "QP") { act = "DownQryParam"; cpt = "Query Parameters Layout Editor"; }

var txt = teBpcSync(act, tar, (addFlds ? "addFields" : null), param);
try {
var rfed = new LayoutEditor(txt, tar, cpt, _saveLayoutHnd, et);
rfed.previewHandle = _previewLayout;
rfed.channel = channel;
rfed.UserChannelId = userChannel;
rfed.dlgCtrl.moveToLT();
return rfed;
} catch (ex) { alert(ex + ", js not loaded yet, Plese try again later"); }
}
function teColumnsSettingStep1(tar, nm) {
var nd = teBpcSync("GetColumnsSetting", tar);
var itm = teXmlElementToOpItem(nd), itms = itm.children;
if (itms) {
itms.onclick = teColumnsSettingResp2; itms.tar4 = tar; itms.nm = nm;
SysShowMenuT(itms);
}
}
function teColumnsSettingResp2(itm, itms) {
var tar = itms.tar4, columns = itm.name, act = itms.nm;
if (act == "UseColumnsSetting") tar.arrangeColumns(columns, true);
if (act == "DelColumnsSetting") {
teBPCcmn(tar, act, null, [{ name: "caption", value: itm.text}]);
}
}
function teBpcSync(action, tarObj, action2, param, timeout) {
return teBPCcmn(tarObj, action, null, param, null, false, action2, timeout);
}
function teBPCcmn(refObj, action, tarId, param, pageId, asynchronous, action2, timeout) {
var doc = GJT.xmlDocument(), ma = param;
var nd = xEm(doc, "ECN"), nd2; doc.appendChild(nd);
setAtr(nd, "action", action);
if (action2) setAtr(nd, "action2", action2);
if (!pageId) pageId = getTargetPage(refObj);
if (pageId) setAtr(nd, "tarPage", pageId);
if (!tarId && refObj) tarId = refObj.id;
if (tarId) setAtr(nd, "tarId", tarId);
if (ma) {
if (!(ma instanceof Array)) ma = [ma];
for (var i = 0; i < ma.length; i++) {
nd2 = xEm(doc, "param");
if (ma[i].name) { setAtr(nd2, "name", ma[i].name); setAtr(nd2, "value", ma[i].value); }
else setAtr(nd2, "name", ma[i]);
nd.appendChild(nd2);
}
}
return teBPC(refObj, null, doc, null, null, asynchronous, timeout);
}
function teBPC(gridedit, criterion, doc, refObj, hndl, asynchronous, timeout) {
var g = gridedit, sXml = doc.xml, cr = criterion, cra = cr ? cr.action : null;
if (g && cra && g[cra]) return alert(cra + " in progress! Please wait a moment");
var req = GJT.xmlHttpRequest();
if (!sXml) sXml = doc2Xml(doc); // new XMLSerializer().serializeToString(doc);
if (sXml.indexOf(KW.dbNull) >= 0) sXml = sXml.replace(new RegExp(KW.dbNull, "gi"), "&#x07;"); //replace KW.dbNull to encoded or XML will parse failed
if (g && cra) g[cra] = "AA";
if (!hndl) hndl = function () { return teBPCDoneNotify(req, g, cr, doc, refObj); };
if (asynchronous == false) {
req.open("POST", msAjaxPageName, false); //同步
try {
if (timeout) {
if (timeout.ontimeout) req.ontimeout = timeout.ontimeout;
if (timeout.value) req.timeout = timeout.value;
else req.timeout = timeout;
}
} catch (ex) { }
req.send(sXml);
return hndl(req, g, cr, doc, refObj);
} else {
req.open("POST", msAjaxPageName);
req.onreadystatechange = hndl;
req.send(sXml);
}
}
function teBPCDoneNotify(req, gridedit, criterion, doc, refObj) {
if (req.readyState != 4) return;
var g = gridedit, ct = criterion;
if (g && ct && g[ct.action]) delete g[ct.action];
if (req.status != 200) {
if (req.status == 401 && PROG.onUnauthorized) return PROG.onUnauthorized();
return alert('There was a problem with the request.\r\n' + req.statusText + "\r\n" + req.responseText);
}
var txt = req.responseText, docRtn = GJT.xmlDocument();
if (!txt) return;
docRtn.loadXML(txt);
//compare each row of criterion
var nd = docRtn.firstChild;
if (!nd) {
//try replace illegal char
return alert("null returned");
}
var myAct = xGetAtr(nd, "action");
if (myAct == "qryRptDefItems") {
var itm = teXmlElementToOpItem(nd), itms = itm.children; return itm.children;
if (itms) {
itms.onclick = teReportDefResp; itms.tar4 = g;// g.rptItms = itms;
SysShowMenu(itms);
}
}
else if (myAct == "qryDefinedQryItems") {
var itm = teXmlElementToOpItem(nd); return itm.children;
}
else if (myAct == "qryDefinedRelaItems") {
var itm = teXmlElementToOpItem(nd), itms = itm.children;
if (itms) {
itms.onclick = teQryDefReltedResp; itms.tar4 = g; g.rldItems = itms;
SysShowMenu(itms);
}
}
else if (myAct == "resetUserSetting") {
try { document.location = document.location; } catch (ex) { }
return;
}
else if (myAct == "getUserSetting") {
var res = [];
for (var i = 0; i < nd.childNodes.length; i++) {
res.push(xGetAtr(nd.childNodes[i], "value"));
}
return res;
}
else if (myAct == "getUserPageSetting" || myAct == "DownHtmlRecForm" || myAct == "GetHtmlPageLayOut" || myAct == "GetPageViewsRela" || myAct == "getTreeViewDgn"
|| myAct == "GetDataViewDgn" || myAct == "DownQryParam" || myAct == "getChoice") {
var x = xGetAtr(nd, "val");
return x;
}
else if (myAct == "GetHtmlRecForm") {
var myF = refObj ? refObj : g, x = xGetAtr(nd, "val");
if (myF && myF.changeLayout) myF.changeLayout(x);
return x;
}
else if (myAct == "GetPageAllSetting") {
return nd;
}
else if (myAct == "getHist") {
return nd;
}
else if (myAct == "qryBOR_F" || myAct == "qryBOR_T") {
var itm = teXmlElementToOpItem(nd);
return itm.children;
}

teBPCDoneResp(nd, ct, g, doc, refObj);
return nd; //return node
}
function teXmlElementToOpItem(nd) {
var nm = xGetAtr(nd, "name"), txt = xGetAtr(nd, "text"), tip = xGetAtr(nd, "tip"), pvg = xGetAtr(nd, KW.ProgramPrivilege), opf = xGetAtr(nd, KW.ProgramPrivilege), nds = nd.childNodes;
var itm = new OpItem(nm, txt, tip, null, opf, pvg);
if (nds && nds.length) {
var chrn = new OpItems(); itm.children = chrn;
for (var i = 0; i < nds.length; i++) {
chrn.add(teXmlElementToOpItem(nds[i]));
}
}
return itm;
}
function teBPCDoneResp(nd, criterion, ge, doc, refObj) {
var trMap = criterion ? criterion.trMap : null, nds = nd.childNodes, fk = ge ? ge.fieldsKey : null, errItms, itm, trs, isSave, isDelete;
//if (!trMap) return;
for (var i = 0; i < nds.length; i++) {
var nd2 = nds[i], rwid = xGetAtr(nd2, "rowId"), tr = trMap ? trMap[rwid] : null, action = xGetAtr(nd2, "action"), ret = xGetAtr(nd2, "ret");
itm = null;
if (ret == null) continue;
else if (ret == "1") {
if (action == "save") {//clear editlog
isSave = true;
if (xGetAtr(nd2, "isNew") == "1") {
for (var j = 0; j < fk.length; j++) {
var fkv = xGetAtr(nd2, fk[j].name);
var fkvOld = ge.getFieldValue(fk[j].name,tr,1);
if (!fkvOld && fkv != "" && fkv != null) ge.setFieldValue(fk[j].name, fkv, tr, 1, 1, 1); //set original val
}
teSetAsOld(tr);
}
if (!trs) trs = []; trs.push(tr);
ge.editLogClear(tr, 1);
}
else if (action == "delete") {
isDelete = true;
tr.parentNode.removeChild(tr);
}
} else {
if (!errItms) errItms = [];
itm = { name: rwid, text: xGetAtr(nd2, "errMsg") };
itm.tr = tr;
errItms.push(itm);
}
var myMsg = xGetAtr(nd2, "resMsg"), myMsgH = xGetAtr(nd2, "resMsgH");
if (myMsg || myMsgH) {
if (!itm) itm = { name: rwid, text: "" };
if (myMsg) itm.text += myMsg;
if (myMsgH) itm.textHTML = myMsgH;
if (!errItms) errItms = [];
itm.tr = tr;
errItms.push(itm);
}
}
if (trs && ge && ge.opst && ge.opst.f4rshupdt) ge.refreshRows(trs, null, ge.opst.f4rshupdt);
if (errItms) {
errItms.styleText = "white-space:pre-wrap";
itm = { name: "", text: i18nm.CloseThisDialog.text };
errItms.push(itm);
var dg = new DialogInBody("BPCresult", action, 600, 400), mn = dg.main; // dg.setClient(addE(MyHTML));
itm.onclick = function () { dg.close(); }
itm.imageURL = "images/CloseDlg.png";
itm.styleText = "text-align:center;text-decoration:underline";
var n = new teMenus(mn, errItms, "ErrLst"); dg.setClient(n.uio);
n.onmouseover = bpcrspmov; n.onmouseout = bpcrspmou;
showInCenter(dg.dlg);
}
if (ge) {
if (isSave && ge.handleAfterSave) ge.handleAfterSave(ge, criterion);
if (isSave && ge.expand4AftSave) ge.expand4AftSave();
if (isDelete && ge.handleAfterDelete) ge.handleAfterDelete(ge, criterion);
if (isDelete) teShowRows(ge.grid);
}
}
function bpcrspmov(itm, itms, sur) { if (itm.tr) setColor(itm.tr, "#ffdd33"); }
function bpcrspmou(itm, itms, sur) { if (itm.tr) restoreColor(itm.tr); }
function ftCopyHeadRow(tbSource, tbNew, rowsCopy,cntr) {
var tN = tbNew, s = tbSource, r = s.rows[0], p0 = s.parentNode, p = p0, bdy = BDY(), dvN = tN;
//find proper container
try {
while (p != bdy) {
var st = GJT.getComputedStyle(p); if (!st) break;
var ow = st.overflow, owY = st.overflowY, st0 = p.style;
if ((ow == "scroll" || owY == "scroll" || (ow == "auto") || owY == "auto") && st0.height != "") break; //chrome different st.height !="" && st.height !="auto" &&
p = p.parentNode;
if (p == null) return;
}
}
catch (ex) {
//alert(ex.message);
return;
}
var rn = r ? r.cloneNode(true) : newEm("TR"), h, c = r ? r.cells : [], cN = rn.cells;
if (!tN) {
tN = newEm("TABLE");
if (!rowsCopy) {//copy all heads
var ch = s.getElementsByTagName("THEAD");
if (ch && ch.length > 0) tN.appendChild(ch[0].cloneNode(true));
}
else { h = tN.appendChild(newEm("THEAD")); h.appendChild(rn); }
dvN = newEm("DIV"); dvN.appendChild(tN);
dvN.style.overflow = "hidden"; // "visible";
if (p == p0) p.insertBefore(dvN, s); else p.appendChild(dvN);
tN.className = s.className;
}
else {
dvN = tN; tN = dvN.children[0];
var r0 = tN.rows[0];
if (r0) { var p2 = r0.parentNode; p2.replaceChild(rn, r0); } else { EmByTag(tN, "THEAD").appendChild(rn); }
}
for (var i = 0, rx = tN.rows.length; i < rx; i++) {
if (!s.rows || s.rows.length <= i) break;
var c = s.rows[i].cells, cN = tN.rows[i].cells;
for (var j = 0; j < c.length; j++) {
cN[j].srtd = c[j];
}
}
if (cntr) cntr.appendChild(dvN);
return dvN;
}
function ftSyncV(source, fan) {
if (!fan) return;
var s = source, p = s.parentNode, t = p ? p.scrollTop : null, f0 = fan, f = f0, pf = f0.parentNode, bdy = BDY(), isB; if (!p) return;
var spos = getOffsetO(s, pf), spos2 = getOffsetO(p, pf);
if ((pf == bdy && !t) || p.style.overflowY == "visible") { isB = 1; t = GJT.getWindowScrollTop() + floatBarsHeight(); }
else if (t == null) {
var p2 = p.parentNode;
while (p2 && p2 != bdy) {
if (p2.scrollTop > 0) {
t = p2.scrollTop;
p = p2;
break;
}
p2 = p2.parentNode;
}
} //多層容器
if (t <= spos[1]+5 && isB) return hideIt(f0);//顯示比率不同時,Chrome計算的t值會變化,因此需要多加一些
if (s.rows.length == 0) return hideIt(f0);
if (s.offsetTop > t) return hideIt(f0);
if (t <= s.rows[0].offsetHeight / 2) return hideIt(f0);
if (spos[1] + s.offsetHeight - f0.offsetHeight <= t) return hideIt(f0);
var ow = f0.style.width, nw = toPx(s.offsetWidth); nw = toPx(s.clientWidth);
f = f0.children[0]; if (!f.rows || f.rows.length == 0) return;
var c = s.rows[0].cells, cf = f.rows[0].cells, sc = GJT.getComputedStyle(c[0]), fs = f.style, ow = fs.width, nw = toPx(s.offsetWidth); //, bw = parseInt(sc.paddingLeft, 10) + parseInt(sc.paddingRight, 10)
//fs.tableLayout = s.style.tableLayout; //never set tableLayout to "fixed", it cause incorrect result
fs.width = nw;
var frw = f.rows, srw = s.rows;
for (var n = 0; n < frw.length; n++) {
if (!frw[n] || !srw[n]) continue;//if(n<frw.length-1)continue;
var c = srw[n].cells, cf = frw[n].cells, j2 = c.length - 1 + 10;
for (var i = 0, j = c.length; i < j; i++) {
var sc = GJT.getComputedStyle(c[i]), bw = parseInt(sc.paddingLeft, 10) + parseInt(sc.paddingRight, 10);
var df = cf[i], d = c[i], csf = df.style, ow = csf.width, nw = toPx(c[i].clientWidth - bw);//, nh = toPx(c[i].clientHeight - parseInt(sc.paddingBottom, 10) - parseInt(sc.paddingTop, 10));
//csf.display = GJT.getComputedStyle(d).display;
csf.textAlign = GJT.getComputedStyle(d).textAlign;// csf.height = nh;
if (ow != nw && i < j2) csf.width = nw;
}
cf[cf.length - 1].style.width = "";//最後一個不要設定
}
if (isB) {
showObjAt(f0, spos[0], t, null, null, 0);
f0.style.width = bdy.scrollWidth;
} else {
showIt(f0);
matchLoc(f0, p, 0, 0);
var f0st = f0.style;
f0st.zIndex = s.style.zIndex + 1;
f0st.width = toPx(p.clientWidth);
fs.position = "relative"; fs.left = toPx(-p.scrollLeft);
}
showItA(f0, p.offsetHeight - f0.offsetHeight > 32);//可見區太小不顯示
}
function teMapVal(mapDict, v) {
if (!mapDict || v == null) return v;
var nv = mapDict[v]; if (nv != null) return nv;
return v;
}
function pFloat(v) {
if (!v) return 0.0;
var v2 = parseFloat(teDeformatNum(v, GDT.Real)); if (isNaN(v2)) return 0.0;
return v2;
}
var mRegMa = new RegExp(",", "gi");
function teDeformatNum(v, dtpy) {
if (!v || dtpy == GDT.String || dtpy == GDT.DateTime || dtpy == GDT.Boolean) return v;
return teDeformatNumDo(v);
//v = v.toString().replace(mRegMa, "");
//if (!isNaN(parseFloat(v))) return v;
//var v1 = "";
//for (var i = 0; i < v.length; i++) {
//var cd = v.charCodeAt(i);
//if ((cd > 47 && cd < 58) || cd == 46) v1 += String.fromCharCode(cd);
//}
//if (v1 == "") return v;
//return v1;
}
function teDeformatNumDo(v) {
if (v == undefined) return v;
v = v.toString().replace(mRegMa, "");
var isPcnt = v.lastIndexOf("%") == v.length - 1 && v.length > 0;
if (isPcnt) {
if (!isNaN(parseFloat(v))) return (parseFloat(v) / 100).toString();
}
if (!isNaN(parseFloat(v))) return v;
var v1 = "";
for (var i = 0; i < v.length; i++) {
var cd = v.charCodeAt(i);
if ((cd > 47 && cd < 58) || cd == 46) v1 += String.fromCharCode(cd);
}
if (v1 == "") return v;
if (isPcnt) {
//百分比 去除之後再除以100
v1 = parseFloat(v1) / 100;
v1 = v1.toString();
}
return v1;
}
function teFormatNum(v, dtpy, fmt) {
if (!fmt || dtpy == GDT.String || dtpy == GDT.DateTime || dtpy == GDT.Boolean || ((!v && v!=0) || v.length==0)) return v;
if (fmt.indexOf("%") > 0) {
fmt = fmt.replace("{", "").replace("}", "").replace("%","");
fmt = fmt.substring(fmt.indexOf(":") + 1);
var idx = fmt.indexOf("."), fl=fmt.length;
if (idx < 0 || fl == idx + 1) return Math.round(parseFloat(v) * 100) + "%";
if (fl == idx + 2) return Math.round(parseFloat(v) * 1000) / 10.0 + "%";
if (fl == idx + 3) return Math.round(parseFloat(v) * 10000) / 100.0 + "%";
if (fl == idx + 4) return Math.round(parseFloat(v) * 100000) / 1000.0 + "%";
else return Math.round(parseFloat(v) * 1000000) / 10000.0 + "%";
}
return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function teMapVal4Qry(mapDict, v) {
if (!mapDict || v == null) return v;
if (v.indexOf(",")) {
var a = v.split(","), r = [];
for (var i = 0; i < a.length; i++) {
r.push(teMapVal(mapDict, a[i]));
}
return r.join(",");
} else return teMapVal(mapDict, v);
}
function teColsBestWidth() { }
function teGenGridEdit_(dvName, toolbarMode, container, qryURL, displayMode) {
var dv = addE("<div><div><table /></div></div>", container), oTbl = dv.children[0].children[0];
setAtr(oTbl, "name", dvName);
var m = new GridEdit(oTbl, toolbarMode, container, qryURL, displayMode);
teQueryByAjax(oTbl, ["Action"], ["genDataTbl"]);
return m;
}
function teGenGridEdit(dvName, toolbarMode, container, qryURL, displayMode, pageId, appId, inhrtPPvg, addQryString) {
var xp = ["Action", "TableID"], vp = ["genDataTbl", dvName];
if (pageId) { xp.push("tarPage"); vp.push(pageId); }
if (appId) { xp.push("appId"); vp.push(appId); }
if (inhrtPPvg) { xp.push("inhpppvg"); vp.push("Y"); }
if (addQryString) {
var qs = window.location.href;
var pp = qs.split("?")[1];
if (pp) {
var pp2 = pp.split("&");
for (var i = 0; i < pp2.length; i++) {
var pp3 = pp2[i].split("=");
if (pp3[0] && pp3[1] && pp3[0] != "appId" && pp3[0] != "tarPage") { xp.push(pp3[0]); vp.push(pp3[1]); }
}
}
}
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
var oRes = newEm("DIV"); oRes.innerHTML = txt;
var tbl = getChiHasAtr(oRes, KW.ViewName);
if (tbl) { var ge = new GridEdit(tbl, toolbarMode, container, qryURL, displayMode); return ge; }
tbl = getChiHasAtr(oRes, "isTreeView");
if (tbl) return new opTreeView(tbl, 24, 24);
else alert(oRes.innerText);
}
function teShowRelatedItem(objId,sur) {
var cc = PROG.risc;
if (!cc) { cc = {}; PROG.risc = cc; }
var cn = cc[objId], dg = cn ? cn.dlgCtrl : null;
if (cn) {
try { cn.showMe(0,1); } catch (ex) { cn = null; }
}
if (!cn) {
var cn = new GridValueSelector(objId, null, null, null, null, null, 500);
cc[objId] = cn; dg = cn.dlgCtrl;
//dg.moveToLT();
dg.moveToMouse();
}
var txt = PROG.relationsTxt;
if (txt) {
PROG.relations = vwXmlToRela(txt);
teSetupForExpandRela();
if(sur) teQueryByRela(cn.GridEdit, sur);
}
return cn;
}
function LoadScript(sFileUrl) {
var scrps = document.getElementsByTagName("SCRIPT"), MySrc = sFileUrl.toLowerCase(), idx = MySrc.indexOf("?"); //W3C DOM without document.scripts collection
if (idx > 0) MySrc = MySrc.substring(0, idx);
for (var i = 0; i < scrps.length; i++) { var thissrc = scrps[i].src.toLowerCase(); if (thissrc.indexOf(MySrc) >= 0) return true }
var oo = document.createElement("script");
document.body.appendChild(oo);
oo.src = sFileUrl;
return false;
}
function copyAttr(sur, tar, atrsPreserve) {
var atrs = sur.attributes, ps = atrsPreserve;
for (var i = 0; i < atrs.length; i++) {
var nm = atrs[i].name, v = atrs[i].nodeValue, brk = 0;
if (ps) {
if (ps == nm) continue;
for (var j = 0; j < ps.length; j++) {
if (ps[j] == nm) brk = 1;
}
}
if (brk) continue;
if (v != null && v != "") {
setAtr(tar, nm, v);
}
}
}
function tePutValCarrierMenu(itms, ge) {
var af = ge.fieldsAll, vc = ge.valCarriers, f; //m.fieldsAll, m.valCarriers
if (!af || !vc || !vc.length) return itms;
for (var i = 0; i < vc.length; i++) {
var v = vc[i];
if (!v.selfrom || !v.fromflds || !v.toflds) continue;
var ss = v.toflds.split(","), adi = 0;
for (var j = 0; j < ss.length; j++) {
f = af[ss[j]];
if (f && (!f.isWriteDenied() || hasBit(v.optns, 1))) adi = 1;
}
if (!v.uiagn) v.uiagn = v.toflds;
var gg = v.uiagn.split(",");
if (adi) {
if (itms) { itms.add(v) }; v.onclick = tePrcsValCarrier; v.surGrd = ge;
for (var j = 0; j < gg.length; j++) {
var uag = af[gg[j]];
if (uag) uag.vcri = v;
}
}
}
}
function tePrcsValCarrier(itm) {
var ge = itm.surGrd, s = itm, sf = s.selfrom, uig = s.uiagn, ff = s.fromflds, tf = s.toflds, opns = s.optns;
if (!ge) return;
var cc = ge.vcpks; if (!cc) { cc = {}; ge.vcpks = cc; }
var cn = cc[sf], dg = cn ? cn.dlgCtrl : null;
if (cn) {
try { cn.showMe(); } catch (ex) { cn = null; }
}
if (!cn) {
var cn = new GridValueSelector(sf, ff.split(","), itm.text, evhPrceValCarrierOK, evhValuePickerCancel, 800, 600);
cc[sf] = cn; dg = cn.dlgCtrl;if (!dg) return;
dg.moveToLT();
if(ge.evtAftValCarierCreated)ge.evtAftValCarierCreated(cn,ge);
}
cn.fromflds = ff; cn.toflds = tf; cn.surGrd = ge; cn.optns = opns;
showItA(cn.btnInsert,hasBit(ge.programPrivilege, PPVG.InsertRows));
return 1;
}
function evhPrceValCarrierOK(cn, res, insInto) {
//alert(cn.fromflds + "/" + res.join(","));
var ge = cn.surGrd, tf = cn.toflds.split(","),oaTR, opns = cn.optns, forceSet = hasBit(opns, 1), ul = res.length; if (!ul) return;
if(insInto){oaTR = ge.insertRows(res[0].length, null,1);}
for (var i = 0; i < tf.length; i++) {ge.setFieldValues(tf[i], res[i % ul], oaTR, 0, 0, 0, 0, 0, forceSet);}
return 1;
}
function evhPrceValCarrierCancel(cn) {
cn.showMe(1); return 1;
}
function lyQryPrmChg(sur, tar, atrPvs) {
var ns = sur.children;
for (var i = 0; i < ns.length; i++) {
var n = ns[i], lf = n.getAttribute("zqjlf"), t = null, nm = n.getAttribute("name");
if (lf) t = getChiHasAtr(tar, "zqjlf", lf);
if (!t && nm) t = getChiHasAtr(tar, "name", nm);
if (t) {
var fnd = [], of = t.nextSibling;
while (of) {
if (of.tarObj == t || of.tarObject == t) fnd.push(of); else break;
of = of.nextSibling;
}
lyReplaceNode(n, t, atrPvs);
var np = t.nextSibling;
for (var j = 0; j < fnd.length; j++) {
if (np) np.parentNode.insertBefore(fnd[j], np);
else t.parentNode.appendChild(fnd[j]);
}
}
else lyQryPrmChg(n, tar, atrPvs);
}
}
function lyReplaceNode(sur, tar, atrsPreserve) {
copyAttr(sur, tar, atrsPreserve);
sur.parentNode.replaceChild(tar, sur);
}
function lyGenTabsCtrls(so, lvl, splitmode) {
var res, sm = splitmode, tbos = collEmHasAtr(so, "tabcf", null, null, 1);
if (sm == null) sm = 1;
for (var h = 0; h < tbos.length; h++) {
var tbo = tbos[h], cnr = tbo.parentNode, coll = collEmHasAtr(tbo, "tablf", null, null, 1); if (!coll.length) return;
var itms = new OpItems();
for (var i = 0; i < coll.length; i++) {
var myId = getAtr(coll[i], "tablf"); o = getChiHasAtr(cnr, "tabvf", myId, 1);
if (o) {
itms.add(new teLodger(myId, teTdGetValue(coll[i]), o));
}
}
if (itms.length > 0) {
if (!res) res = [];
var tc = new teTabsCtrl(null, itms, "", null, tbo);
tc.setActiveItem(0);
tc.switchSplitMode(sm);
tbo._tabCtrl = tc;
res.push(tc);
}
}
if (lvl == null) lvl = 100;
else if (lvl > 0) {
var chn = so.children;
for (var i = 0; i < chn.length; i++) {
lyGenTabsCtrls(chn[i], lvl - 1, sm);
}
}
return res;
}
function lyTabCtrlGet(myId) {//get (auto create if has defined elements)
var o = document.getEmelentById(myId); if (!o) return;
var tc = o._tabCtrl;
if (typeof tc == "undefined") {
tc = lyGenTabsCtrls(o, 1, -2);
o._tabCtrl = null;
if (tc.length) o._tabCtrl = tc[0];
return o._tabCtrl;
} else return tc;
}
function lyTabCtrlChgSplitMode(myId, mode) {
var tc = lyTabCtrlGet(myId);
if (tc) tc.switchSplitMode(mode);
}
function _saveLayoutHnd(lyoTxt, lyoEditor, tarChannel) {//LayoutEditor
var action = "", param, yo = lyoEditor, ge = yo.tar, lyoType = yo.lyoType, channel = yo.channel, cpt;
if (tarChannel != null) channel = tarChannel;
param = [{ name: "lyoHtml", value: lyoTxt }, { name: "Channel", value: channel}];
if (lyoType == "RF") { action = "UpHtmlRecForm"; cpt = "Save record form design"; }
if (lyoType == "PG") { action = "UpHtmlPageLayout"; cpt = "Save page layout design"; }
if (lyoType == "QP") { action = "UpQryParamLayout"; cpt = "Save Query Parameters layout design"; }
if (action) {
try {
var x = teBpcSync(action, ge, null, param);
if (x) alert(cpt + " done!");
} catch (ex) { alert(ex); }
}
}
function _previewLayout(lyoTxt, lyoEditor) {
var yo = lyoEditor, ge = yo.tar, lyoType = yo.lyoType, fe = ge._recForm;
if (lyoType == "RF") {
if (fe) {
if (fe.tr) delete fe.tr;
fe.changeLayout(lyoTxt);
ge.showRecordFormValues();
}
}
if (lyoType == "PG") {
PROG.chgPageLayout(lyoTxt);
}
if (lyoType == "QP") {
//PROG.chgPageLayout(lyoTxt);
ge.rvsQryPrmLyo(lyoTxt);
}
}
function getExportContentTypeItems() {
var n = i18nm, itms = NITAdd(null, [["application/vnd.ms-excel-native", "Excel (Native)"], ["application/vnd.ms-excel-native-2003", "Excel 2003(Native)"], ["application/CSV-withTitle", n.CSVFileWithTitle.text, n.CSVFileWithTitle.tip]
, ["application/CSV", n.CSVFile.text, n.CSVFile.tip], ["application/Tab-withTitle", n.TabSepFileWithTitle.text, n.TabSepFileWithTitle.tip], ["application/Tab", n.TabSepFile.text, n.TabSepFile.tip]
, ["application/Tab-withTitle-txt", n.TabSepFileWithTitle.text + "(*.txt)", n.TabSepFileWithTitle.tip], ["application/Tab-txt", n.TabSepFile.text + "(*.txt)", n.TabSepFile.tip], ["application/vnd.ms-excel", "Excel (HTML)"]]);
return itms;
}
function NumberButtons(maxNum, ge, container) {
this.ge = ge;
if (NumberButtons._initialized == undefined) {
var po = NumberButtons.prototype;
po.createContents = function () {
var m = this, h = ["<div class='NumBtn' />"];
o = addEm(h.join(""), null, container);
var evRef1 = m.evtHandle, geRef = m;
var er = function () { evRef1.call(geRef); };
setEvtHandleAll(o, er);
return o;
}
po.showButtons = function (maxNum) {
var m = this, o = m.btnCntr, cs = o.children, x = maxNum + 1;
for (var c = 0; c <= maxNum; c++) {
if (!cs[c]) { o.appendChild(newEm("span")); cs[c].innerText = c; }
var st = cs[c].style; st.cursor = "default"; st.border = "1px solid";
if (m.bgColor) st.backgroundColor = m.bgColor;
showIt(cs[c]);
}
while (cs[x]) {
hideIt(cs[x]); x++;
}
}
po.evtHandle = function () {
var m = this, ev = GJT.event(), s = GJT.eventSrc(), ty = ev.type;
GJT.stopBubble();
if (ty == "click" && m.ge && m.ge._shwLvlTool) m.ge._shwLvlTool(teTdGetValue(s));
}
po.setVisible = function (vis) {
this.btnCntr.style.display = vis ? "" : "none";
}
po.evtResize = function (dgo) {
}
po.evtCloseDlg = function (dlg) { return true; } //disallow close
NumberButtons._initialized = true;
}
var o = this.createContents(container);
this.btnCntr = o;
if (!container) {
var m = this, dg = new DialogInBody("num", ge.text, 300, 100, container);
m.dlgCtrl = dg;
dg.handleClose = function () { return m.evtCloseDlg.call(m); }
dg.handleResize = function (dgo) { return m.evtResize.call(m, dgo); }
m.showButtons(maxNum);
dg.setClient(o);
dg.moveToLT();
showBesideMouse(dg.dlg);
}
}
var ls4dsgn = 0;//載入後嘗試錯誤的次數
function LoadScript4Designer() {
if (LoadScript("js/sunUtilLayoutEditor.js?v=" + getJSver())) return true;
ls4dsgn = 0;
}
function teDataViewEditor(tar, channel) {
if (!LoadScript4Designer()) return setTimeout(function () { teDataViewEditor(tar, channel); }, 1000);
try {
var d = new DataViewOpDesigner(tar, getDvOpSetting(tar, channel));
d.saveHandle = saveDataViewDesign;
d.previewHandle = previewDataViewDesign;
d.channel = channel;
d.UserChannelId = "";
d.dlgCtrl.moveToLT();
} catch (ex) {
alert(ex + ", js may not loaded yet, Plese try again later");
}
}
function teEditLayout(tar, addFlds, channel, clearOld, lyoType) {
if (!LoadScript4Designer()) return setTimeout(function () { teEditLayout(tar, addFlds, channel, clearOld, lyoType); }, 1000);
var itms = [{ name: "forPC", text: "For PC" }, { name: "forMobile", text: "For Mobile" }];
itms.tar = tar; itms.addFlds = addFlds; itms.channel = channel; itms.clearOld = clearOld; itms.lyoType = lyoType;
itms.onclick = teEditLayout2;
SysShowMenuT(itms); //Firefox can't show menu immediately, event mouseup cause menu hide
}
function teTreeViewDesign(tar, channel) {
if (!LoadScript4Designer()) return setTimeout(function () { teTreeViewDesign(tar, channel); }, 1000);
try {
var d = new TreeViewDesigner(tar, channel);
d.saveHandle = saveTreeViewDesign;
d.previewHandle = previewTreeViewDesign;
d.UserChannelId = "";
d.dlgCtrl.moveToLT();
} catch (ex) {
alert(ex + ", js may not loaded yet, Plese try again later");
}
}
function teViewRelationDesign(tar, channel) {
if (!LoadScript4Designer()) return setTimeout(function () { teViewRelationDesign(tar, channel); }, 1000);
try {
//必須將所有物件的關聯物件都產生出來 getViewsOpRelas指令才能建立出所有以設計的關聯資料
var obs = PROG.children.getAll();
for (var i = 0; i < obs.length; i++) {
if (obs[i].showRelatedItems) {
var cc = obs[i].showRelatedItems();
if (!cc) continue;
for (var j = 0; j < cc.length; j++) {
if (cc[j].dlgCtrl) cc[j].dlgCtrl.minMe(1);
else if (cc[j].minMe) cc[j].minMe(1);
}
}
}
var d = new ViewsRelationDesigner(tar, getViewsOpRelas(tar, channel), PROG.children.getAll()); //
d.saveHandle = saveViewRelaDesign;
d.previewHandle = previewViewRelaDesign;
d.channel = channel;
d.UserChannelId = "";
d.dlgCtrl.moveToLT();
} catch (ex) {
alert(ex + ", js may not loaded yet, Plese try again later");
}
}
function showChartDesigner(tar, channel) {
if (!LoadScript4Designer()) return setTimeout(function () { showChartDesigner(tar, channel) }, 1000);
try{
showChartDesignerDo(tar, channel);
} catch (ex) {
ls4dsgn++;
if (ls4dsgn > 4) return alert("Failed to load chart designer!\n" + ex);
return setTimeout(function () { showChartDesigner(tar, channel) }, 1000);
}
}
//function showChartDesigner4Pivot(tar, oriDesign, fields) {
// if (!LoadScript4Designer()) return setTimeout(function () { showChartDesigner4Pivot(tar, oriDesign) }, 1000);
// var ky = "chartEDPVT", dg = PROG[ky];
// showItD(dg);
// if (!dg || isHidden(dg)) {
// dg = new geChartDesigner();
// PROG[ky] = dg;
// showInCenter(dg, 100);
// }
// dg.setSource(tar, oriDesign, fields);
//}
function showLayoutDesigner(tarId, itms, channel) {
if (!LoadScript4Designer()) return setTimeout(function () { showLayoutDesigner(tarId, itms,channel) }, 1000);
try{
showLayoutDesignerDo(tarId, itms, channel);
} catch (ex) {
ls4dsgn++;
if (ls4dsgn > 2) return alert("Failed to load layout designer!\n" + ex);
return setTimeout(function () { showLayoutDesigner(tarId, itms,channel) }, 1000);
}
}
function showLayoutDesigner4json(dsgn, itms, channel, controller) {
if (!LoadScript4Designer()) return setTimeout(function () { showLayoutDesigner4json(dsgn, itms, channel, controller) }, 1000);
try{
showLayoutDesigner4jsonDo(dsgn, itms, channel, controller)
} catch (ex) {
ls4dsgn++;
if (ls4dsgn > 2) return alert("Failed to load layout designer!\n" + ex);
return setTimeout(function () { showLayoutDesigner4json(dsgn, itms, channel, controller) }, 1000);
}

}
//begin WorkCalendar 工作日曆,設定預設例假日,加入非例假日的日期,使用這兩者來計算
function WorkCalendar(name, bgnDate, endDate) {

if (WorkCalendar._initialized == undefined) {
var po = WorkCalendar.prototype;
po.setDatesRange = function (bgnDate, endDate) {//設定本行事曆的日期範圍,如果日期超過的話可能需要重新建立,或者丟出例外
this.beginDate = bgnDate.beginOfDate();
this.endDate = endDate.endOfDate();
this._setHolidaysDatesByDb();
}
po.setGeneralHolidaysDay = function (days) {//設定一星期的例假日是那些
var oh = this.generalHolidaysDay;//如果原本已經有設定了例假日規則了,那麼如果新規則和舊規則不同就可能需要更新
this.generalHolidaysDay = days;
}
po.setHolidaysDates = function (dates) {//使用陣列一次設定所有的假日日期(例假日 特定假日都包含)
//當記錄所有假日時,計算工期的方式比較簡單(Key法)
delete this.holidaysDates;
delete this._useGeneralHolidays;
var k = {}; //把日期換成getTime() 之後,當成key
if (dates && dates.length > 0) {
for (var i = 0; i < dates.length; i++) {
k[Date.parse(dates[i])] = true;
}
} else {//如果沒有任何假日清單,就自動把setGeneralHolidaysDay 設定的例假日全部加入
var b = this.beginDate.beginOfDate(), e = this.endDate, hdays = this.generalHolidaysDay, hl = hdays.length;
var tb = b.getTime(), te = e.getTime();
this._useGeneralHolidays = true;
while (tb < te) {
var wd = (new Date(tb)).getDay();
for (var d = 0; d < hl; d++) {
if (wd == hdays[d]) {
k[tb] = true;
break;
}
}
tb += 86400000;
}
}
this.holidaysDates = k;
}
po._setHolidaysDatesByDb = function () {//使用後台資料庫建立假日資料
delete this.holidaysDates; //先清除舊的,資料庫如果沒有紀錄,就需要用預設例假日規則
var xp = ["Action", "subact", "cldrNm", "bgnDate", "endDate"], vp = ["Misc", "getHolidays", this.name, this.beginDate.format("yyyy/MM/dd"), this.endDate.format("yyyy/MM/dd")]; //https://translate.google.com.tw/?hl=zh-TW&tab=wT#zh-CN/en/%E9%9B%9C%E9%A0%85
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1), o;
if (txt.indexOf("{") == 0) o = JSON.parse(txt); else { alert(txt); o = null; }
var dtMax = new Date(o.max), dtMin = new Date(o.min);
this.maxHoliday = dtMax.getTime(); this.minHoliday = dtMin.getTime();
this.setHolidaysDates(o.holidays);
this._chkDateRange(this.beginDate.getTime());
this._chkDateRange(this.endDate.getTime());
}
po.isNationalHoliday = function (dt) {
if (this.isTaiwan) {
var mn = dt.getMonth(), d = dt.getDate();
if (mn == 0 && d == 1)
return true; // 1/1 4/5 幾乎都是台灣的國定假日
if (mn == 3 && d == 5)
return true;
}
return false;
}
po.isHoliday = function (dt) {
var k = this.holidaysDates;
return k[dt.getTime()] == true;
}
po._chkDateRange = function (dtTime) {
var ti = dtTime, tiX = this.maxHoliday, tiN = this.minHoliday, k, hdays, hl;
if (tiX < ti || tiN > ti) {
k = this.holidaysDates;
hdays = this.generalHolidaysDay, hl = hdays.length;
}
while (tiX < ti) {//如果檢查的日期超過範圍,就只能把標準例假日加入
var dt = new Date(tiX);
if (this.isNationalHoliday(dt)) k[tiX] = true;
var wd = dt.getDay();
for (var d = 0; d < hl; d++) {
if (wd == hdays[d]) {
k[tiX] = true;
break;
}
}
this.maxHoliday = tiX;
tiX += 86400000;
}
while (tiN > ti) {//如果檢查的日期超過範圍,就只能把標準例假日加入
var dt = new Date(tiN);
if (this.isNationalHoliday(dt)) k[tiN] = true;
var wd = dt.getDay();
for (var d = 0; d < hl; d++) {
if (wd == hdays[d]) {
k[tiN] = true;
break;
}
}
this.minHoliday = tiN;
tiN -= 86400000;
}
}
po.getWorkDays = function (bgnDate, endDate) {//計算兩個日期之間有多少個工作天
var m = this, b = bgnDate.beginOfDate(), e = endDate.beginOfDate(), c = 0, k = this.holidaysDates;
b = b.getTime(); e = e.getTime();
if (b == e) return 0;
this._chkDateRange(b);this._chkDateRange(e);
if (b < e) {
while (b < e) {
if (k[b]) c--; //如果是假日就減一
b += 86400000;
c++;
}
}
else {
while (b > e) {
if (k[b]) c--; //如果是假日就減一
b -= 86400000;
c++;
}
}
return c;
}
po.getTargetDate = function (refDate, workDays) {//以參考日期和工作天數,跳開假日計算出新的日期
//因為行事曆只有日期沒有時分秒 (00:00:00) ,refDate 也必須修正成 0時 0分 0秒才能比較
var nwDate = refDate.beginOfDate(), d = workDays;
if (d == 0) return nwDate;
var ti = nwDate.getTime(), k = this.holidaysDates, useGeneral = !k; //如果沒有設定假日字典,就需要用預設例假日規則
this._chkDateRange(ti);
if (workDays > 0) {
this._chkDateRange(ti + 86400000 * d);
while (d > 0) {
if (useGeneral) {
} else {
while (k[ti]) { ti += 86400000; } //如果是假日 就再加一天
}
ti += 86400000;
d--;
}
} else {
this._chkDateRange(ti - 86400000 * d);
while (d < 0) {
while (k[ti]) {
ti -= 86400000; //如果是假日 就再加一天
}
ti -= 86400000;
d++;
}
}
nwDate.setTime(ti);
return nwDate;
}
po.showCalendar = function (refresh) {
var dg = this.dlg;
if (!dg) {
dg = new DialogInBody(this.name, "Calendar:" + this.name, null, 600);
dg.handleClose = function () { dg.showMe(1); return true; }
var c = newEm("div");
dg.setClient(c);
refresh = true;
this.dlg = dg;
}
if (!refresh) return dg.showMe(0);
var c = dg.main.children[0];
//取得最早日,移到週日
var b = this.beginDate, e = this.endDate, k = this.holidaysDates;
while (b.getDay() != 0) { b = new Date(b.getTime() - 86400000); }
while (e.getDay() != 6) { e = new Date(e.getTime() + 86400000); }
var lastMonth, lastMonth2, thisMonth, h = ["<table class=\"date\"><thead><tr style='background-color:#bbbbbb;'><td></td>"], bi = b.getTime(), ei = e.getTime(), i = 0, xw = i18nm.weekDays; ;
for (var i = 0; i < 7; i++) { eval("var tx=xw.d" + i + ".text;"); h.push("<td align='center'>" + tx + "</td>"); }
h.push("</tr></thead>");
var bgc = "aa";
while (bi <= ei) {
b = new Date(bi);
thisMonth = b.getMonth() + 1;
if ((i % 7) == 0) {
if (i > 0) h.push("</tr>");
h.push("<tr><td>");
if (thisMonth != lastMonth) {
h.push(b.getFullYear() + "/" + (b.getMonth() + 1));
lastMonth = thisMonth;
} // else h.push("W" + (b.getWeek()));
h.push("</td>");
}
if (thisMonth != lastMonth2) {
lastMonth2 = thisMonth;
if (bgc != "") bgc = ""; else bgc = "#cecece";
}
h.push("<td align='center' style='background-color:" + bgc);
if (k[bi]) { h.push(";color:red"); }
h.push("'>");
h.push(b.getDate());
h.push("</td>");
i++;
bi += 86400000;
}
h.push("</tr></table>");
c.innerHTML = h.join("");
dg.showMe(0);
}
WorkCalendar._initialized = true;
}
var m = this;
m.name = name;
m.isTaiwan = this.name == "INC" || this.name == "GTM";
m.setGeneralHolidaysDay([0, 6]);//預設是 周六 周日為例假日,例假日規則要優先設定之後 才設定日期範圍
var bgnDt = new Date();
bgnDt.setFullYear(bgnDt.getFullYear() - 1, bgnDt.getMonth(), bgnDt.getDate()); //往前回推一年當起始日
var endDt = new Date();
endDt.setFullYear(bgnDt.getFullYear() + 2, bgnDt.getMonth(), bgnDt.getDate()); //往後加兩年當截止日
this.setDatesRange(bgnDt, endDt);
}
//end WorkCalendar

function PivotData(pvtDat) {
//控制樞紐分析表資料的讀取
if (PivotData._initialized == undefined) {
var po = PivotData.prototype;
po.getFieldsForSTTL = function (LblName, forSttlField) {//forSttlField 是否用於選取小計欄位
// 依據標籤欄位回傳所有對應的可用資料欄位,先找出階層位置才能決定那些小計欄位及屬性欄位可用
//欄標籤可以讓所有屬性欄位都回傳,如果指定的標籤沒有小計則回傳空集合
var m=this, res = new OpItems(),p = m.pvd;
if (LblName) {
//先找出是欄標籤還是列標籤
var lbsR = m._labelsR, lbsC = m._labelsC,s;
//如果目標小計是屬於列標籤的,就只能傳回所在階層及更高階層的欄標籤集合
if (lbsR.contains(LblName)) {
s = lbsR;
//列標籤小計 讀取 有點複雜,還沒有實做出來,暫時不支援
} else if (lbsC.contains(LblName)) {
s = lbsC;
res.concat(m._fieldsR);//所有列標籤及屬性都可用
} else {
//總計欄位
var itms = (new OpItems()).concat(p.colsttls), ix = itms.getIndex(LblName);
if (ix < 0) {
itms = (new OpItems()).concat(p.rowsttls); ix = itms.getIndex(LblName);
if (ix > -1) {
res.add(itms[ix]); res.concat(p.pvtItems);
}
} else {
res.concat(m._fieldsR);//欄總計可以讀取所有列標籤及屬性
res.add(itms[ix]);
}
}
if (!s) return res;
//加入小計欄位
if (forSttlField) res.clear();//小計欄位是單獨被選取的
for (var i = 0; i < s.length; i++) {
if(!forSttlField) res.add(s[i]);//所有上層的標籤欄位都可以加入
//小計欄位只能夠是指定的該階層的小計
if (s[i].name == LblName) {
if (s[i].subttls) {
var ss = s[i].subttls;
for (var j = 0; j < ss.length; j++) {
res.add(ss[j]);
}
} else return new OpItems();//如果沒有小計設定 只能回傳空集合,因為無法讀取值
break;
}
}
if (forSttlField) return res;
if (s == lbsR) {
//列標籤的小計 需要包含樞紐欄位 及欄標籤欄位(才能區分出數列名稱)
res.concat(m._fieldsC);
res.concat(p.pvtItems);
}
} else {
//沒有指定標籤時所有總計都可以回傳
if(p.colsttls) res.concat(p.colsttls);
if (p.rowsttls) {
res.concat(p.rowsttls);
//如果有列總計 必須把樞紐計算欄位也加入
//一般會加入列小計或總計的情況多是樞紐計算欄位有很多個且有相關性或連續性
res.concat(p.pvtItems);
}
}
return res;
}
po._genCommonFields = function () {
//下面ss的元素成員順序不可以變動,程式以此順序邏輯設計
var m = this, p = m.pvd, ss = [p.rowLbls, p.colLbls, p.pvtItems], itms = new OpItems(), itmsL = new OpItems(), itmsLS = new OpItems(), itmsR, itmsC;
for (var i = 0; i < 3; i++) {
if (i < 3) itmsL.concat(ss[i]);
for (var j = 0; j < ss[i].length; j++) {
var s = ss[i][j];
for (var k = 0; k < s.cntPrePty; k++) {
itms.add(s.prePtys[k]);
}
itms.add(s);//標籤欄位放在中間
for (var k = 0; k < s.cntPty; k++) { itms.add(s.ptys[k]); }
//有subLabels 的標籤才能加入itmsLS
if (s.subttls) itmsLS.add(s);
}
if (i == 0) itmsR = itms.collect();//只有列標籤欄位
}
//var aa = [p.colLbls,p.rowLbls];
//itmsL.concat(aa[i]);
//itmsL.concat();
//欄總計和列總計的項目 也需要當成標籤欄位,因為這樣子才能夠決定那些欄位可以讀取資料
itmsLS.concat(p.colsttls);
itmsLS.concat(p.rowsttls);
m.fieldsAll = itms;
m.labels = itmsL;
m.labels4STTL = itmsLS;
m._labelsR = (new OpItems()).concat(p.rowLbls);
m._labelsC = (new OpItems()).concat(p.colLbls);
m._fieldsC = m._labelsC.collect();
m._fieldsR = itmsR;
m._labelsSTTLR = (new OpItems()).concat(p.rowsttls);
m._labelsSTTLC = (new OpItems()).concat(p.colsttls);
m._labelsPivot = (new OpItems()).concat(p.pvtItems);
}
po._pvtGenLblData = function (rrl, vtr, pre, lvl, tarLvl) {
var m = this;
if (tarLvl != null && lvl > tarLvl) return;
// if (!pre) pre = [];//弄一個空字串陣列
for (var i = 0; i < rrl.length; i++) {
var r = rrl[i], ptys = [r.name], subLbls = r.subLabels;
ptys = pre.concat(ptys);//使用concat產生一個新陣列才不會影響原來的r.ptys
if (lvl < tarLvl && subLbls && subLbls[0].subLabels) {//有下一層繼續往下,(樞紐計算欄位是在最下層,所以倒數第二層就必須加入vtr中
m._pvtGenLblData(subLbls, vtr, ptys, lvl + 1, tarLvl);
} else {
ptys.id = r.id;
ptys.sttls = r.subttls;
vtr.push(ptys);
}
}
}

po._pvtGenColData = function (rrl, vtr, pre) {
var m = this;
// if (!pre) pre = [];//弄一個空字串陣列
for (var i = 0; i < rrl.length; i++) {
var r = rrl[i], ptys = [r.name], subLbls = r.subLabels;
ptys = pre.concat(ptys);//使用concat產生一個新陣列才不會影響原來的r.ptys
if (subLbls && subLbls[0].subLabels) {//有下一層繼續往下,(樞紐計算欄位是在最下層,所以倒數第二層就必須加入vtr中
m._pvtGenColData(subLbls, vtr, ptys);
} else {
ptys.id = r.id;
ptys._surD = r;//記住對應的樞紐計算欄位群組
vtr.push(ptys);
}
}
}
po._pvtGenRowData = function (rrl, vtr, pre) {
var m = this;
if (!pre) pre = [];//弄一個空字串陣列
for (var i = 0; i < rrl.length; i++) {
var r = rrl[i], ptys = r.ptys, subLbls = r.subLabels;
ptys = pre.concat(ptys);//使用concat產生一個新陣列才不會影響原來的r.ptys
if (subLbls) {//有下一層繼續往下
m._pvtGenRowData(subLbls, vtr, ptys);
} else {
ptys.id = r.id;
vtr.push(ptys);
}
//小計總計資料(不管欄或列)不可以加入到一般的資料矩陣內,需要另外定義欄位
}
}
//po._pvtCollectIds = function (tarIx,lbls,res) {//帶入目標樞紐計算欄位的位置索引
// for (var i = 0; i < lbls.length; i++) {
// var lbl = lbls[i], subLbls = lbl.subLabels;
// if (subLbls && subLbls[0].subLabels) {
// res = m._pvtCollectIds(tarIx, res, subLbls);
// } else {
// if (!res) res = [];
// res.push(subLbls[tarIx].id);
// }
// }
// return res;
//}
/*樞紐分析表的getFieldValuesSTTL 處理邏輯:小計總計的讀取需要配合其所在的欄列標籤的階層位置才能決定回傳的資料筆數,概念上小計總計仍然以虛擬的矩陣型資料來操作
愈是下層的小/總計的筆數愈多, 由pvtFldName 決定出階層及回傳的筆數,pvtFldName 可以判斷出小計/總計欄位所在的階層,及資料的方向(縱向或橫向)
*/
po.getFieldValuesSTTL = function (LblName, tarFldName, tarSttlField) {
var m = this, itms = m.getFieldsForSTTL(LblName), f = tarFldName, ir = m._fieldsR.getIndex(f), ic = m._fieldsC.getIndex(f), icT, irT, p = m.pvd;
if (!itms.contains(f)) return; //throw new Error("Field " + f + " is invalid for target subtotal " + LblName);
//如果f是列標籤的欄位(或屬性) 可以直接輸出
var res = [], vts = [], tarLvl, isR, lbls, lblsC =p.resColLbls.Labels, lblsR = p.resRowLbls.Labels;//找出在第幾層
if (LblName) {
tarLvl = m._labelsC.getIndex(LblName);
if (tarLvl >= 0) { lbls = lblsC; }
else {
tarLvl = m._labelsR.getIndex(LblName);
if(tarLvl >= 0){isR = true; lbls = lblsR;}
}
if (tarLvl < 0) {
//檢查是否為總計欄位,欄總計 resColSTTLs
irT = m._labelsSTTLR.getIndex(LblName);
icT = m._labelsSTTLC.getIndex(LblName);
if (icT >= 0) {
//是欄標籤總計 總計資料沒有上一層,因此vts只會有一個
vts[0] = { sttls: p.resColSTTLs };//讓 後面讀取
} else if (irT>=0) {
isR = true; vts[0] = { sttls: p.resRowSTTLs };
}
// return res;//沒有符合的欄位
}
if(tarLvl >-1) m._pvtGenLblData(lbls, vts, [], 0, tarLvl);//收集出從上到目標階層組成的欄位的內容
} else {
//return res; //沒有標籤名稱無法決定
irT = m._labelsSTTLR.getIndex(f);
icT = m._labelsSTTLC.getIndex(f);
if (icT >= 0) vts[0] = { sttls: p.resColSTTLs };//讓 後面讀取
else if (irT >= 0) { isR = true; vts[0] = { sttls: p.resRowSTTLs }; }
else return res;
}
if (isR) {
//是列標籤的小計
//列標籤小計 讀取 有點複雜,還沒有實做出來,暫時不支援
//列小計總計的讀取依然要和一般的欄資料或欄小計相同 ,將之視為縱向矩陣型資料
//列小計總計提供的屬性欄位需要包含所有欄標籤的欄位
//檢查f是否為樞紐計算欄位
var ipv = m._labelsPivot.getIndex(f), cds = m._getColDatas(), idx;
var vtr = vts;
for (var h = 0; h < cds.length; h++) {
if (ipv >-1) idx = cds[h]._surD.subLabels[ipv].id;
for (var i = 0; i < vtr.length; i++) {
if (ir > -1) {
res.push(vtr[i][ir]);
} else if (ic > -1){
res.push(cds[h][ic]);
} else if (ipv > -1) {
//收集所有
var sttls = vtr[i].sttls, lstt = sttls.length;//列小計值集合 的key是樞紐計算欄的id
if (lstt == 1 && !tarSttlField) res.push(sttls[0].values[idx]);
else {
for (var j = 0; j < lstt; j++) {
if (sttls[j].name == tarSttlField || sttls[j].name == tarFldName) {
var v = sttls[j].values[idx];
res.push(v);
break;
}
}
}
}
}
}
} else {
var vtc = vts, vtt = m._rowsData, vttl = vtt.length;
for (var i = 0; i < vtc.length; i++) {
if (ir > -1) {
for (var j = 0; j < vttl; j++) {res.push(vtt[j][ir]);}
} else if(ic > -1) {
for (var j = 0; j < vttl; j++) { res.push(vtc[i][ic]); }
} else { //小計欄位
//先找到對應的sttl
var sttls = vtc[i].sttls;
if (sttls) {
for (var k = 0; k < sttls.length; k++) {
if (sttls[k].name == tarFldName || sttls[k].name == tarSttlField) {
var vls = sttls[k].values;
for (var j = 0; j < vttl; j++) {
res.push(vls[vtt[j].id]);
}
break;
}
}
}
}
}
}
return res;
//找出所在階層 來決定回傳的的資料筆數
//先找出
}
po._getColDatas = function () {
var m = this, res = m._coldts;
if (res) return res;
res = []; m._pvtGenColData(m.pvd.resColLbls.Labels, res, []);
m._coldts = res;
return res;
}
po._getStdDataArray = function () {
var m=this, vres = m._vtt; if (vres) return vres;
var pvt = m.pvd;
//為了效率,預先把樞紐表建立出一個資料陣列,欄列的小計及總計的資料不可包含進去,因為性質不同,小計總計資料的讀取需要另想做法
//小計總計(不管欄列)可能可以單獨定義欄位
vres = [];
//由resRowLabels依序處理,用recursive 處理
var rrl = pvt.resRowLbls.Labels, vtr = [], rwsttls = pvt.resRowSTTLs;
m._pvtGenRowData(rrl, vtr);//先收集列標籤產生的矩陣式陣列
m._rowsData = vtr;
//列總計項目不可以在這裡加入
//再將所有欄標籤資料與列標籤陣列合組
//var rcl = pvt.resColLbls.Labels, vtc = [];
//m._pvtGenColData(rcl, vtc, []);
var vtc = m._getColDatas();
//一般欄標籤是大分類(項目較少),列標籤分類會比較多,所以讓vtc在外圈(排序優先)
for (var i = 0; i < vtc.length; i++) {
var sur = vtc[i]._surD, subl = sur.subLabels;
for (var h = 0; h < vtr.length; h++) {
var rId = vtr[h].id;//, isttlR = vtr[h].isSTTL, vlsR = isttlR ? vtr[h].sur.values : null;
var nr = vtr[h].concat(vtc[i]), ix = nr.length; nr.id = rId, addIt=false;
//nr.isttlR = isttlR;//標記這是列小計
for (var j = 0; j < subl.length; j++) {
var vv = subl[j].values[rId];
if(vv != undefined){
nr[ix + j] = vv;
addIt=true; //如果在這一列上都沒有任何資料就不要加入,否則會加入很多空的 實際不存在的資料
}
}
//填入欄小計的值
if (addIt) vres.push(nr);
}
}
m._vtt = vres;
return vres;
}
po.getFieldValues = function (fldName, tarTRs, getRealV) {
var m = this, pvt = m.pvd, vres = m._getStdDataArray();
//找出指定的欄位的位置
var ix = -1, itms = m.fieldsAll;
for (var i = 0; i < itms.length; i++) {
if (itms[i].name == fldName) {
ix = i; break;
}
}
if (ix == -1) return;//找不到對應的欄位的位置
var res = [];
for (var r = 0, l=vres.length; r < l; r++) {
res.push(vres[r][ix]);
}
return res;
}
PivotData._initialized = true;
}
var m = this;
m.pvd = pvtDat;
m._genCommonFields();//收集標籤欄位
} //End PivotData

function PivotReportDialog(ge, itms, container) {// begin PivotReportDialog 樞紐分析報表UI對話框
if (PivotReportDialog._initialized == undefined) {
var po = PivotReportDialog.prototype;
po.createUI = function () {
var o = newEm("div"), b1 = "<button style='width:99%' ", b2 = "</button>", r1 = "<tr><td nowrap='nowrap' valign='top' style='height:24px;text-align:right;width:20%'>", r2 = "</td></tr>"
, h = ["<table nowrap='nowrap' style='width:100%;height:99%;'>"
, r1, b1, "act='create'>GO</button>"
, "</td><td valign='top'><select size='5' multiple class='pvtListbox' style='width:100%;min-height:100px;height:100%' ></select>", r2
, "<tr><td style='white-space:pre-wrap;height:24px;' class='pivotDesc' colspan='2'></td>", r2
, r1, "</td><td style='white-space:pre'>","<div>", "<input type='checkbox' name='autoGo' checked='checked' />", i18nm.AutoCreateReport.text, ", " ,i18nm.AutoCreateReport.tip ,"</div>", r2
, r1, "Output to:</td><td style='white-space:pre'>", "<input type='radio' name='tardsp' checked='checked' value='newW' />", i18nm.OpenNewWindow.text, " <input type='radio' name='tardsp' value='expt' />", i18nm.Export.text, r2
, r1, "Export Type:</td><td style='white-space:pre-wrap' is4ExpType='Y'>", r2
, "</table>"];
o.innerHTML = h.join("");
o = o.children[0];
o.rows[0].cells[0].style.height = "";
var c = getChiHasAtr(o, "is4ExpType", "Y"), itms = getExportContentTypeItems(), h = [];
for (var i = 0; i < itms.length; i++) {
var itm = itms[i];
if (i > 0) h.push("<br/>");
h.push("<div style='display:inline-block' ><input type='radio' name='expType' value='", itm.name, "'", (i == 0 ? " checked='checked'" : ""), " />", itm.text, "</div>");
}
c.innerHTML = h.join("");
return o;
}
po.evtHnd = function () {
var ev = GJT.event(); if (!ev) return;
var m = this, o = GJT.eventSrc(), ty = ev.type;
if (ty == "click") {
if (o.name == "tardsp") { showItA(getTR(o).nextSibling, o.value == "expt" && o.checked); }
var act = getAtr(o, "act");
if (act == "create") m.QueryGo();
if (o == m.listbox) {
var r = m.getParam();
m.pivotDescO.innerText = r && r.tip ? r.tip : "";
}
}
}
po.hndClose = function () {
var m = this;
m.sur.evtListenerRemove("bfrQuery", m.erh); //移除事件處理登記
delete m.sur._dlg4PvtRpt; //clear reference
delete m.sur; delete m.dg; delete m.cntr; delete m.erh;
}
po.QueryGo = function () {
var m = this, r = m.getParam();
m.sur.query(null,r.extType, true,r.rptId, null, r.rptType);
}
po.hndBfrQuery = function (evtType, prm) {
//reqContentType = prm[2]; _tarReportId = prm[4]; _tarFilterId = prm[5]; _rptType = prm[6];
var m = this, r = m.getParam();
if (!r.autoGo) return;
if (!r.rptId) { alert("No report item selected!"); return true; } //中斷查詢
prm[2] = r.extType; prm[4] = r.rptId; prm[6] = r.rptType;
}
po.getParam = function () {
var m = this, e = getEM(m.cntr, "input"), r = {};
for (var i = 0; i < e.length; i++) {
var nm = e[i].name;
if (nm == "autoGo" && e[i].checked) r.autoGo = true; //沒有指定自動產生報表,就依照原來的
if (nm == "tardsp" && e[i].checked) r.dspMode = e[i].value;
if (nm == "expType" && e[i].checked) r.extType = e[i].value;
}
var chn = m.listbox.children;
r.rptId = "";
for (var i = 0; i < chn.length; i++) {
if (chn[i].selected) {
if (r.rptId != "") r.rptId = r.rptId+",";
r.rptId = r.rptId + chn[i].sur.name;
r.rptType = "pvtUsr";
r.tip = chn[i].sur.tip;
//break;
}
}
if (r.dspMode == "newW") r.extType = "text/HTML";
return r;
}
PivotReportDialog._initialized = true;
}
var m = this, dg = new DialogInBody("PVR1", "Pivot Report: " + ge.text, null, null, container);
var o = m.createUI();
dg.setClient(o);
m.sur = ge;
m.cntr = o;
ge._dlg4PvtRpt = m;
var erh = function (evtType, Prm) { return m.hndBfrQuery.call(m, evtType, Prm); };
m.erh = erh;
ge.evtListenerAdd("bfrQuery", erh);

dg.handleClose = function () { m.hndClose.call(m); };
m.dg = dg;
var lb = getEmByClass(o, "pvtListbox");
m.listbox = lb;
m.pivotDescO = getEmByClass(o, "pivotDesc");
if (!itms) {
var xp = ["Action", "subact", "tarid"], vp = ["Misc", "getUserPivotItems", ge.id];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return alert("No Pivot report defnied");
try { itms = JSON.parse(txt); } catch (ex) { itms = eval(txt); };
if (itms.items) itms = itms.items;// 為了舊程式相容 檢查
}
for (var i = 0; i < itms.length; i++) {
var itm = itms[i], opn = newEm("option"),txt=itm.text;
opn.value = itm.name;
if (itm.sharedFrom) txt += " (" + itm.sharedFrom + ")";
opn.innerText = txt;
opn.title = itm.tip ? itm.tip : "";
lb.appendChild(opn);
opn.sur = itm;
opn.selected = i==0;
}
showInCenter(dg);
var evh = m.evtHnd, er = function () { evh.call(m); };
setEvtHandleAll(o, er);
window.setTimeout(function () { getEM(o, "input")[1].click(); }, 100);
} //end PivotReportDialog

function I18N_getTextO(key) {//用來攫取後台指定的key的符合使用者當下使用的語系的文字,需要使用同步呼叫方式
//自動快取
var p = PROG, d = p["I18NdictC"];
if (!d) { d = {};p["I18NdictC"] = d; }
var o = d[key]; if (o) return o;
var xv = teBpcSync("getInfo", null, "getI18N", [{ name: "sur", value: key}]);
}
function teShowAnchorInDlg(dlgName, caption, src, txt) {
if (!dlgName) dlgName = "_dlg4Anchor";
var dg = PROG[dlgName];
if (!dg) {
dg = new DlgShowAnchor(dlgName, caption, src, txt);
PROG[dlgName] = dg;
} else dg.setHref(src, txt);
return dg;
}
function DlgShowAnchor(dlgName, caption, src,txt) {//將指定的網址顯示成超連結物件 供使用者可以拖曳到其他應用程式
if (DlgShowAnchor._initialized == undefined) {
var po = DlgShowAnchor.prototype;
po.setHref = function (src, txt) {
var a = this.getCurAnchor();
a.innerText = txt; a.href = src; a.target = "win4anchor";
}
po.getCurAnchor = function () {
var os = getEM(this.cntrA, "input"), a;
for (var i = 0; i < os.length; i++) {
if (os[i].checked) {
a = os[i].nextSibling;
return a;
}
}
}
po.evtHnd = function (ev) {
}
po.execMenu = function (itm, itms) {
var n = itm.name; MenuHide();
if (n=="addAnchor") this.newAnchor();
if (n =="chgText") this.chgText();
}
po.newAnchor = function () {
this.cntrA.appendChild(newEmH("<div><input type='radio' checked='checked' name='myanch' /><a class='anchor' ></a></div>"));
this.dg.fitSize();
}
po.chgText = function () {
var a = this.getCurAnchor(),txt=a.innerText;
txt = window.prompt("Input new text for anchor",txt);
if(txt) a.innerText = txt;
}
po.showMe = function () {
this.dg.showMe();
}
po.close = function () {
this.dg.close();
}
DlgShowAnchor._initialized = true;
}
if(!caption) caption = "Anchors for drag to somewhere";
var m = this, dg = new DialogInBody(dlgName, caption);
dg.handleClose = function() { dg.showMe(1, 1); return true; };
var dv = newEm("div"), mg = addChi(dv, "a"), er = function (ev) { m.evtHnd.call(m, ev); };
dv.innerHTML = "<div class='dva'></div>";//<textarea style='width:95%;height:2em;min-width:480px;'></textarea>"
setEvtHandleAll(dv, er);
dg.setClient(dv);
m.dg = dg;
m.cntrA = getEmByClass(dv, "dva");
var itms = new OpItems();
itms.add({ name: "addAnchor", text: "Add new Anchor" });
itms.add({ name : "chgText", text: "Change Text"});
itms.onclick = function (itm, itms) {m.execMenu.call(m, itm, itms);}
dg.setCustomMenus(itms);
m.showMe();
m.newAnchor(); m.setHref(src, txt);
dg.fitSize();
}

function DlgShowImage(dlgName, caption, src) {
//顯示及調整image尺寸
if (DlgShowImage._initialized == undefined) {
var po = DlgShowImage.prototype;
po.setSrc = function (src) {
var m = this;m.imgLoaded = 0;
m.imgO.src = src;
if(m._cnvs) m._cnvs.src = src;
}
po.setResizeMode = function (md) {
var m = this, mgs = m.imgO.style;
if (md == "W") { mgs.width = "100%"; mgs.height = ""; }
if (md == "H") { mgs.width = ""; mgs.height = "100%"; }
if (md == "WH") { mgs.width = "100%"; mgs.height = "100%"; }
if (md == "O") { mgs.width = ""; mgs.height = ""; }
m.showMe();
}
po.setFixedDim = function (md) {
var m = this, mgs = m.imgO.style, nw,nh, res, msg, dft;
if (md == "W") { msg = "Input width for fix"; dft = m._fixW; if (!dft) dft = 800;}
else if (md == "H") { msg = "Input height for fix"; dft = m._fixH; if (!dft) dft = 600; }
else if (md == "WH") { msg = "Input width and height for fix (ex: 640 480)"; dft = m._fixWH; if (!dft) dft = "800 600"; }
res = window.prompt(msg, dft);
if (!res) return;
if (md == "W") { mgs.width = toPx(res); mgs.height = ""; m._fixW = res; }
if (md == "H") { mgs.width = ""; mgs.height = toPx(res); m._fixH = res; }
if (md == "WH") {
var ss = res.split(" ");
mgs.width = toPx(ss[0]);
if (ss.length > 1) mgs.height = toPx(ss[1]);
m._fixWH = res;
}
//m.showMe();
}
po.beginCutOut = function (stopCutOut) {
var m = this, dco = !stopCutOut, o=m.emco;
m.doCutOut = dco;
if (dco) {
var dft = m._coWH; if (!dft) dft = "800 600";
var res = window.prompt("Enter the width and height of the area you want to keep", dft);
if (!res) return;
m._coWH = res;
if (!o) {
o = newEmH("<div style=';position:absolute;left:0px;top:0px;cursor:move;border:1px dotted black;opacity:0.2;background-color:red' />");
var p=m.imgO.parentNode;
p.appendChild(o); p.style.position = "relative";
m.emco = o;
}
var q = [" ", ",", "x", "X"], ix = -1;
for (var i = 0; i < q.length; i++) {
ix = res.indexOf(q[i]);
if (ix > 0) {
var ss = res.split(q[i]);
o.style.width = toPx(parseInt(ss[0],10) - 2);
o.style.height = toPx(parseInt(ss[1]) - 2);
}
}
if (ix < 0) { o.style.width = toPx(parseInt(res, 10) - 2); o.style.height = o.style.width }
}
showItA(o,dco);
}
po.getDataURL = function (imgType) {
var m = this, emo = m.emco, img = m.imgO, width = img.width, height = img.height, canvas = document.createElement('canvas');

if (isHidden(emo)) {
//取使用者指定的區域
canvas.width = width;
canvas.height = height;
canvas.getContext('2d').drawImage(img, 0, 0, width, height);
} else {
width = emo.offsetWidth;
height = emo.offsetHeight;
canvas.width = width;
canvas.height = height;
canvas.getContext('2d').drawImage(img, emo.offsetLeft, emo.offsetTop, width, height, 0, 0, width, height);
}
var dat = canvas.toDataURL(imgType);
return dat;
}
po.evtResize = function () {
var m = this, mg = m.imgO, ow = mg.naturalWidth, oh = mg.naturalHeight;
var dg=m.dg, nw = mg.clientWidth, nh = mg.clientHeight;
dg.setCaption(m.oriCaption + " " + nw + " x " + nh + " / " + ow + " x " + oh +" px");
}
po.evtHnd = function (ev) {
if (!ev) ev = GJT.event();
var m = this, mg = m.imgO, mgs = mg.style, ty = ev.type, so = GJT.eventSrc(), cn = so.className;
if (so == mg && ty == "mousemove") {
m.drawMagnifier(ev); return;
}
if (so == m.emco) {
var x = ev.clientX, y = ev.clientY;
if (ty == "mousemove") {
if (GJT.isButtonDownLeft()) {
if (GJT.draging != m) return;
if (m.cx != undefined) {
var x = ev.clientX, y = ev.clientY, dx = x - m.cx, dy = y - m.cy, st = so.style;
var nx =m.dim[0] + dx, ny =m.dim[1] + dy;
if(nx<0)nx=0;if(ny<0) ny=0;
if(nx + so.offsetWidth > mg.clientWidth) nx =mg.clientWidth-so.offsetWidth;
if(ny + so.offsetHeight > mg.clientHeight) ny =mg.clientHeight-so.offsetHeight;
st.left = toPx(nx);
st.top = toPx(ny);
}
}
} else if (ty == "mousedown") {
if (GJT.isButtonDownLeft()) {
m.cx = x; m.cy = y;
GJT.isDraging = 1;
if (!GJT.draging) GJT.draging = m; //avoid bubble up
m.dim = [so.offsetLeft, so.offsetTop];
}
} else if (ty == "mouseup") {
delete m.cx; delete m.cy;
GJT.isDraging = 0;
GJT.draging = null;
}
}
}
po.execMenu = function (itm, itms) {
var m = this, n = itm.name;
if (n == "shwMagnifier") {
var ht = itm.checked;
m.showMagnifier(ht);
itm.checked = !ht;
return;
}
if (n.indexOf("auto") == 0) {
var md = n.substring(4);
m.setResizeMode(md);
}
if (n.indexOf("fix") == 0) {
var md = n.substring(3);
m.setFixedDim(md);
}
if (n.indexOf("scale") == 0) {
var md = n.substring(5);
m.setMagnifierScale(md);
}
m.beginCutOut(n != "cutout");
for (var i = 0; i < itms.length; i++) { itms[i].checked = false;}
itm.checked = true;
}
po.showMe = function () {
var m = this;
if (m.imgLoaded) {
m.dg.showMe();
if (!m._moved) {
m.dg.moveToMouse(); m._moved = true;
var mg = m.imgO, ow = mg.naturalWidth,oh=mg.naturalHeight, sw = screen.availWidth;
if (ow > sw / 2) {
window.setTimeout(function () {
m.dg.moveTo(null, null, sw / 2);
m.setResizeMode("W");
m.dg.fitSize();
}, 200);
}
}
return;
}
window.setTimeout(function () { m.showMe.call(m); }, 100);
}
po.setCutOutMode = function (allowed) {
var m = this, itms = m.custMenus;
if (allowed) {
if (itms.contains("cutout")) return;
itms.add({ name: "-", text: "-" });
itms.add({ name: "cutout", text: "Cut out" });
} else {
var ix = itms.getIndex("cutout");
if (ix < 0) return;
itms.remove(ix);
if (itms[ix - 1] && itms[ix - 1].name == "-") itms.remove(ix - 1);;
}
}
po.setMagnifierScale = function (s) {
var m = this, cnvs = m._cnvs;
s = parseFloat(s); m._mgs = s;
var ow = cnvs.naturalWidth, oh = cnvs.naturalHeight;
var st = cnvs.style; st.width = toPx(ow * s); st.height = toPx(oh * s);
}
po.showMagnifier = function (hideIt) {//顯示放大鏡
var m = this, gfd = m._gfd;
if (hideIt) return gfd.close();
if (!gfd) {
var w = m.dg.width, h = m.dg.height;
gfd = new DialogInBody(m.dg.name + "_gfd","",640,480);
var dv = newEm("div");
var cnvs = addChi(dv, "img");
cnvs.onload = function () { m.setMagnifierScale(m._mgs); };
gfd.setClient(dv);
gfd.handleClose = function (dg) { dg.showMe(1, 1); return true; };
m._cnvs = cnvs;
m._gfd = gfd;
cnvs.src = m.imgO.src;
var itms = new OpItems();
itms.add({ name: "scale1", text: "Scale 1x" });
itms.add({ name: "scale1.5", text: "Scale 1.5x" });
itms.add({ name: "scale2", text: "Scale 2x" });
itms.add({ name: "scale3", text: "Scale 3x" });
itms.onclick = function (itm, itms) { m.execMenu.call(m, itm, itms); };
gfd.setCustomMenus(itms);
showBesideMouse(gfd.dlg);
}
gfd.showMe();
}
po.drawMagnifier = function (ev) {
var m = this, gfd = m._gfd;
if (isHidden(gfd)) return;
if (ev.shiftKey) return;
var x = ev.clientX, y = ev.clientY, cnvs = m._cnvs, mg = m.imgO, ow = mg.naturalWidth, oh = mg.naturalHeight,p=cnvs.parentElement;
var gw = mg.clientWidth, gh = mg.clientHeight, rto = ow/gw;
var rt = mg.getBoundingClientRect(); s = m._mgs;
var x0 = (x - rt.left) * rto, y0 = (y - rt.top) * rto;
if (x0 < 0 || y0 < 0) return;
var tw0 = p.clientWidth, th0 = p.clientHeight;
p.style.overflow = "hidden";
cnvs.style.marginLeft = toPx(-x0 * s + tw0/2);
cnvs.style.marginTop = toPx(-y0 * s+ th0/2);
}
po.close = function () {
this.dg.close();
}
DlgShowImage._initialized = true;
}
if (caption == null) caption = "Image";
var m = this, dg = new DialogInBody(dlgName, caption);
m.oriCaption = caption;
dg.handleClose = function (dg) { dg.showMe(1, 1); return true; };
var dv = newEm("div"), mg = addChi(dv, "img"), er = function (ev) { m.evtHnd.call(m, ev); };
setEvtHandleAll(dv,er);
dg.setClient(dv);
dg.handleResize = function (sur) { m.evtResize.call(m, sur); };
mg.onload = function () { m.imgLoaded = 1; };
mg.src = src;
dv.style.backgroundColor = "#000010";
m.imgO = mg;
m.dg = dg;
m._mgs = 1;//放大鏡比例
var itms = new OpItems();
itms.add({ name: "autoW", text: "Auto Width" });
itms.add({ name: "autoH", text: "Auto Height" });
itms.add({ name: "autoWH", text: "Auto Width & Height" });
itms.add({ name: "autoO", text: "Original Size" });
itms.add({ name: "-", text: "-" });
itms.add({ name: "fixW", text: "Fixed Width" });
itms.add({ name: "fixH", text: "Fixed Height" });
itms.add({ name: "fixWH", text: "Fixed Width & Height" });
itms.add({ name: "shwMagnifier", text: "Show Magnifier" });
itms.onclick = function (itm, itms) { m.execMenu.call(m, itm, itms); };
dg.setCustomMenus(itms);
m.custMenus = itms;
m.showMe();
}
function teShowImgInDlgN(dlgName, caption, src) {
if (!dlgName) dlgName = "_dlg4ImageN";
var dg = PROG[dlgName];
if (!dg) {
dg = new DlgShowImage(dlgName, caption, src);
PROG[dlgName] = dg;
} else dg.setSrc(src);
dg.showMe();
return dg;
}
function teShowImgInDlg(imgO) {
return teShowImgInDlgN("_dlg4Image","Image", imgO.src);
//var dg = PROG._dlg4Image;
//if (!dg) {
// var wdt = imgO.naturalWidth, hgt = imgO.naturalHeight, wwd = GJT.getWindowWidth() - 20, whg = GJT.getWindowHeight() - 60;
// if (wdt > wwd) { hgt = wwd / wdt * hgt; wdt = wwd; }
// //else if (hgt > whg) { wdt = whg / hgt * wdt; hgt = whg; }//等比縮小
// dg = new DialogInBody("_dlg4Image", "Image", wdt, hgt);
// dg.handleClose = function () { dg.showMe(1, 1); return true; };
// PROG._dlg4Image = dg;
// var dv = newEm("div"), mg = newEm("img");
// dg.setClient(dv);
// dv.appendChild(mg); mg.style.width = "100%";
// dg.imgO = mg;
// dg.moveToLT();
//}
//dg.imgO.src = imgO.src;
//dg.showMe();
}

function teShowImgInDlg2(imgO) {
var dg = PROG._dlg4Image; if (!dg || isHidden(dg.dg)) return;
teShowImgInDlg(imgO);
}
function changeLanguage(lang) {
location.href = location.href.replace(new RegExp("uiLanguage=", "gi"), "") + "&uiLanguage=" + lang;
}
function testdd() {
//var ss = teGenGridEdit("ybdvBikeCheckClass1");
if (!testdd.ss) testdd.ss = new GridValueSelector("ybdvBikeCheckClass1", "Checker", "檢查員選擇", null, null, 800, 600); //ybdvUtranQry
testdd.ss.showMe();

}
function chkScroll() {
document.title = Math.random();
}

function collapsePageMenus(e) {
var o = getEmByClass(document.body, "pgidxBanner"), cn = e.className, cnn, dsp;
while (o) {
o = o.nextSibling;
if (!o || o.tagName != "TABLE") continue;
var tr2 = o.rows[1];
if (!tr2) continue;
if (dsp == null) { dsp = tr2.style.display; if (dsp == "") { dsp = "none"; cnn = "ExpandBtn"; } else { dsp = ""; cnn = "CollapseBtn"; } }
tr2.style.display = dsp;
}
if (cnn) e.className = cnn;
}
//Chart objects
//Chart filter 比較方式列舉,N開頭的都是沒有N開頭的+100,這樣子在實際比較時比較簡單(先算沒有N的比較結果,然後
//Greater大於, Smaller 小於, Equal等於, Like 頭前字相同, In List 在清單中 , In List Like 清單中但是頭前字相同即可, Between介於兩值之間, Between Exclude 介於兩值之間(不含兩值) , Not 反轉條件,取第一個字元組合
var teChartFilterCompareModeEnum = {NotDefnied:0, G: 1, GE: 2, S: 3, SE: 4, E:5, L: 6, IL: 7, ILL: 8, B:9, BX:10, NG: 101, NGE: 102, NS: 103, NSE: 104, NE:105, NL: 106, NIL: 107, NILL: 108, NB:109, NBX:110 }
function ChartsSettingUserSave(ge, res, channel, target, getXML) {
if (!channel) return alert("Channel not specified!");
var txt = JSON.stringify( res);
if (getXML) return txt;
// if (txt) txt = txt.replace(/</g, "%&lt;%").replace(/>/g, "%&gt;%"); //.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))
var xp = ["Action", "subact", "tarid", "dgnTxt", "channel"], vp = ["Misc", "saveChartUserDgn", ge.id, txt, channel];
if (target != null) { xp.push("target"); vp.push(target); }
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt || txt == "") alert(i18nm.SuccessToSave.text);
}
function ChartsSettingUserGet(ge, channel) {//讀取使用者對ge設計的圖表
var xp = ["Action", "subact", "tarid", "channel"], vp = ["Misc", "getChartUserDgn", ge.id, channel];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return [];
try {
var res = JSON.parse(txt);
return res;
} catch (ex) { return [];}
}


function LayoutSettingUserSave(tar, res, channel) {
if (!channel) return alert("Channel not specified!");
var txt;
if (typeof res == "string") txt = res;
else txt = JSON.stringify(res);
var xp = ["Action", "subact", "tarid", "dgnTxt", "channel"], vp = ["Misc", "saveLayoutUserDgn", tar, txt, channel];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt || txt == "") alert(i18nm.SuccessToSave.text);
}
function LayoutSettingUserGet(tar, channel) {
var xp = ["Action", "subact", "tarid", "channel"], vp = ["Misc", "getLayoutUserDgn", tar, channel];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return;
try {
var res = JSON.parse(txt);
return res;
} catch (ex) {}
}
function LayoutSettingForUserPlot(tar) {
var xp = ["Action", "subact", "tarid", "channel"], vp = ["Misc", "getLayoutItems", tar];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return;
try {
var res = JSON.parse(txt);
return res;
} catch (ex) {}
}

function ChartsSettingForUserPlot(ge) {
var xp = ["Action", "subact", "tarid"], vp = ["Misc", "getUserChartItems", ge.id];
var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
if (!txt) return [];
var cc = JSON.parse(txt);
//這裡得到的是多個不同組設計的集合,需要再整理成一維振烈
var res = [];
for (var i = 0; i < cc.length; i++) {
var chs = cc[i];
if (chs.charts) chs = chs.charts;
for (var j = 0; j < chs.length; j++) {
res.push(chs[j]);
}
}
return res;
}
function teChartDesignsToXml(res, doc, nd) {
var txt = JSON.stringify(res)
setAtr(nd, "json", txt);
return txt;
}
function teChartDesignsFromXml(nd) {
if (!nd) return [];
var txt = nd.getAttribute("json");
if (!txt) return [];
return JSON.parse(txt);
}
var urlPlotlyJS = "js/plotly-latest.min.js?v=1";
function startPlotly(cnt) {
if (!cnt) cnt = 1;
if (!LoadScript(urlPlotlyJS) && cnt < 20) { setTimeout(function () { startPlotly(cnt + 1); }, 1000); return false; }//只try 20次,避免URL不存在而無窮迴圈
return true;
}
function teChartShow(ge,channel,cnt,autoPlot)
{
if (!cnt) cnt = 1;
if (!LoadScript("js/sunUtilPlotChart.js?v=" + getJSver()) && cnt < 20) { return setTimeout(function () { teChartShow(ge, channel, cnt + 1, autoPlot); }, 1500); }
try { startChartForGE(ge, channel, null, autoPlot); }
catch (ex) {
// alert("Failed to load program for plot charts! Please try again a few seconds later.\n" + ex.message);
}
}
function addonFilterCreate(cntr, obj, parName) {
if (!cntr || !obj) return;
var o, o2, oc, dm = obj.dspmode, e = GJT.displayModeEnum, h, nm = obj.name, x = obj.text, tp = obj.tip, t, ndx;
if (x) ndx = document.createTextNode(x);

if (dm == e.CheckBox || dm == e.Radio) t = "INPUT";
else if (dm == e.ComboBox || dm == e.ListBox) t = "SELECT";
else if (dm == e.Div) t = "DIV";
else if (dm == e.Option) t = "OPTION";
else t = "DIV";

//如果子階是radio 就必須使用FORM,只有FORM才能讓radio 操作正常
var chrn = obj.children;
if (chrn && chrn[0].dspmode == e.Radio) t = "FORM";
o = newEm(t);
if (tp) o.title = tp;
cntr.appendChild(o);
if (dm == e.CheckBox || dm == e.Radio){
if (dm == e.CheckBox) o.type = "checkbox"; else o.type = "radio";
o.value = nm;
if (dm == e.Radio) o.name = parName;//Radio必須同名且在一個單獨的FORM內才能互斥 cmnSwitchInputChecked
o2 = newEm("font");
cntr.appendChild(o2);
o2.appendChild(o);
if (ndx) o2.appendChild(ndx);
o2.onclick = cmnSwitchInputChecked;
}
else if (dm == e.ComboBox || dm == e.ListBox){
o2 = newEm("div"); cntr.appendChild(o2);
if (ndx) o2.appendChild(ndx);
o2.appendChild(o);
if (dm == e.ListBox) o.multiple = true;
}
else {
if (ndx) o.appendChild(ndx);
o.value = nm;
}

if (chrn && !(dm == e.CheckBox || dm == e.Radio)) { // checkbox不能再有下一層
//建立所有下一層物件
for (var i = 0; i < chrn.length; i++) {
var o3 = addonFilterCreate(o, chrn[i], nm);
if (i == 0 && (dm == e.ComboBox || dm == e.ListBox || o3.type == "radio")) {
o3.selected = true; o3.checked = true;
}
}
}
return o;
}
//檢查grid 欄位,如果有整數欄位且有choice 且有multiline設定的,就設定多重值選項欄位
var mKey4FieldMultiFlag="Y";//代表Flag On 的字元, 空字串是Flag off
function FieldMultiFlagCtrlAdd(grd) {
var itms = grd.fieldsAll,dict,itmsNA,itmsChk;
for (var i = 0; i < itms.length; i++) {
var f = itms[i];
if (f.dataType != GDT.Integer || !f.choice) continue;
if (!dict) { dict = {}; itmsNA = new OpItems(); itmsChk = grd.getFields();}//集合物件 key:主欄位, value:flag欄位集合
var v = parseChoiceA(f.choice, 1), fn = f.name;
if (v[0][0].indexOf("0x") != 0) continue;//必須是hex格式才視為多重值選項
var itmsN = new OpItems(); dict[fn] = itmsN;
for (var j = 0; j < v.length; j++) {
var vv = v[j][0], vx = v[j][1].replace(vv, "");
var vfn ="_" + vv + "@|@" + fn; //javascript 的key (property name)不可以數字字元開頭, 以key取值時會找不到
//如果欄位已經存在就不可以新增,因為有可能設計者設定加入虛擬欄位
var itm=itms[vfn];
if (!itm){
itm = new OpItem(vfn, vx, vx, GDT.String, GIA.UpperCaseOnly | GIA.Virtual | GIA.SaveDenied | GIA.RemoveDenied, 0);
itms.add(itm);
}
itm.choice = mKey4FieldMultiFlag + ", ";
itmsN.add(itm);
if(!itmsChk[itm.name]) itmsNA.add(itm);
}
}
if (itmsNA && itmsNA.length > 0) {
grd.arrangeColumns(grd.getFields().getNames(",") + "," + itmsNA.getNames(","));
}
if (dict) var mntr = new FieldMultiFlagCtrl(grd, dict);
}
function FieldMultiFlagCtrl(grd, dictFldsMonitor) {//隨時在Flag變動時合組成單一值設定到來源欄位,資料查詢完成時將值拆解到各個flag欄位
if (typeof FieldMultiFlagCtrl._initialized == "undefined") {
var po = FieldMultiFlagCtrl.prototype;
po.splitFlag = function (prm) {
//拆開顯示flag
var g = this.grd, dc = this.dc, trs = g.getAllDataTRs();
for (var k in dc) {
var itmsN = dc[k], iL = itmsN.length, nfn=[],fv=[];
var av = g.getFieldValues(k, trs), rL=av.length;
var anv = [];
for (var i = 0; i < iL; i++) {
anv[i] = [];
nfn[i] = itmsN[i].name;
var ix = nfn[i].indexOf("@|@");
fv[i] = parseInt(nfn[i].substr(1, ix));
}
for (var r = 0; r < rL; r++) {
var tv = parseInt(av[r]);
for (var i = 0; i < iL; i++) {
if ((tv & fv[i]) == fv[i]) anv[i][r] = mKey4FieldMultiFlag;
else anv[i][r] = "";
}
}
//設定回去
for (var i = 0; i < iL; i++) {
g.setFieldValues(nfn[i], anv[i], trs, 1, 1); //po.setFieldValues = function (fldName, aVal, oaTR, bNoEditLog, bNoEvent
}
}
}
po.mergeFlag = function (prm) {
var itm = prm[2], fnf = itm.name, ix = fnf.indexOf("@|@");
if (ix < 0) return;//不是flag欄位
var g = this.grd, dc = this.dc, tr = prm[1], v = prm[3];
var fn = fnf.substr(ix + 3), nv, itmsN=dc[fn];
if (!itmsN) return;
nv =parseInt(g.getFieldValue(fn, tr));
if (isNaN(nv)) nv = 0;
for (var i = 0; i < itmsN.length; i++) {
var fnf = itmsN[i].name, ix = fnf.indexOf("@|@");
var gv = g.getFieldValue(fnf, tr, 1), mv = parseInt(fnf.substr(1, ix));
//收集來源欄位的所有flag欄位的值, OR 或 XOR 之後設定到來源欄位
if (gv == mKey4FieldMultiFlag) { nv = nv | mv; }//加入
else { nv = (nv | mv) ^ mv; } //移除
}
g.setFieldValue(fn, nv, tr);
}
po.gevtHnd = function (evtType, prm) {
var m = this;
if (evtType == "aftQueryDone") return m.splitFlag(prm);
if (evtType == "aftChangeValue") return m.mergeFlag(prm); // m.evtBroadcast("aftChangeValue", [m, tr, itm, value, isSetByCode]);
}
FieldMultiFlagCtrl._initialized = true;
}
var m = this;
m.grd = grd;
m.dc = dictFldsMonitor;
var eh = function (evtType, prm) { m.gevtHnd.call(m, evtType, prm); };
grd.evtListenerAdd("aftQueryDone", eh);
grd.evtListenerAdd("aftChangeValue", eh);
} //end FieldMultiFlagCtrl
/*新的NGrid設計要點,實作GridEdit物件有使用到的DOM TABLE 屬性及方法 (ex: .rows .cells ...),但是實際建立的DOM Element只建立少數用來呈現畫面的數量就好,這樣可以大量減少browser 耗用資源以及畫面反映的效率
只要實作必要的DOM TABLE 屬性及方法 就可以輕易在GridEdit內置換掉grid
*/
var mNGrd,mNGrdData;
function teTestNGrid() {
//測試了填寫TABLE 的TD的效率, 20x60=1200 個格子 ,Chrome 約花0.006秒, IE11花了約0.07秒
//看起來使用動態的填寫TD 內容來表現Grid資料的scroll 是可行的方式
var cc = 20, rr = 60;
var t1 = new Date();
if (!mNGrd) {
var hh = [];
for (var r = 0; r < rr; r++) {
hh.push("<tr>");
for (var i = 0; i < cc; i++) {
hh.push("<td></td>");
}
hh.push("</tr>");
}

mNGrd = newEm("table"); mNGrd.innerHTML = hh.join("");
BDY().appendChild(mNGrd);
}
for (var r = 0; r < rr; r++) {
var tr = mNGrd.rows[r];
for (var i = 0; i < cc; i++) {
var td = tr.cells[i];
td.innerText = Math.random();
}
}
var t2 = new Date();
alert((t2.getTime() - t1.getTime()) / 1000);
}
var roundDecimal = function (val, precision) {
return parseFloat(parseFloat(val.toFixed(precision +1)).toFixed(precision));
if (precision == 0) return Math.round(val);
return parseFloat(val.toFixed(precision));
//return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}