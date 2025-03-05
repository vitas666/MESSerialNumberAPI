///<reference path="sunUtilTableEdit.js" />
function LayoutEditor(src,tar, caption, saveHandle, lyoType) {
var m = this; m.tar = tar; m._se = []; m.rcs = []; m.undoH = [];
this.saveHandle = saveHandle;m.lyoType = lyoType;
this.previewHandle =null;
this.UserChannelId = null;//正式版的代號
this.allowMultiRootNode = 0;
this.autoPreview = 0;
if (LayoutEditor._initialized == undefined) {
var po = LayoutEditor.prototype;
po.createContents = function (src) {
	var m = this, o = addEm("<div onscroll='this.ctrl._hintSel();' />"), h = ["<div class=\"GridToolBar\" style=\"vertical-align:middle;height:26px;\">"];
	var t1 = "<span class='", t2 = "</span>", c = ["Action"]; //"Position",
	for (var i = 0, k = c.length; i < k; i++) {
		h.push(t1 + c[i] + "' act='" + c[i] + "'>" + c[i] + t2);
	} //<textarea title='modify style here, press Enter to make effect' type='text' style='width:320px;' isStyle='Y' rows='1' ></textarea><button>V</button>
	h.push("<div ElmList='Y' style=\"float:left;cursor:pointer;\" ></div><i isSts='Y'></i></div><div class=\"LayoutEditorCanvas\" onscroll='chkScroll()' style='clear:both;'>");
	o.innerHTML = h.join("");
	m.container = o;
	o.ctrl = m;
	m._tbr = o.children[0];
	m._cnvs = o.children[1];
	//m._styInpt = getChiHasAtr(m._tbr, "isStyle");
	//m._styInpt.disabled = true;
	//m._styInpt.nextSibling.onclick = function () { m._swSIH.call(m); };
	m._Sts = getChiHasAtr(m._tbr, "isSts");
	var nx = newEm("div"), nxn;
	if (src) {
		nx.innerHTML = src;
		nxn = nx.childNodes;
		for (var i = 0; i < nxn.length; i++) {
			nx = nxn[i];
			if (nx.tagName) nx = lyeReviseCtn(nx);
			m._cnvs.appendChild(nx);
		}
	}
	else m._cnvs.appendChild(nx);
	var evhT = m.evtHandleTbr, erT = function () { evhT.call(m); }; m.evh2T = erT;
	var evh = m.evtHandle, er = function () { evh.call(m); }; m.evh2 = er;
	setEvtHandleAll(m._tbr, erT); setEvtHandleAll(m._cnvs, er);
	var cnx = function () { var ev = !GJT.event(), o = GJT.eventSrc(); if (!ev.ctrlKey) { m._actions(); return false; } };
	m._cnvs.oncontextmenu = cnx;
	m._tbr.oncontextmenu = cnx;
	var r = o.appendChild(newEm("div")), s = r.style;
	m.rc4Drag = r; s.backgroundColor = "#33cc33"; cmnMoveObjTo(r, 0, 0, 10, 10);
	r.title = "拖曳本方塊可以移動物件到其他容器內";
	setEvtHandleAll(r, er);
	return o;
}
po._getrc = function (idx, autoAdd) {
    var m = this, rc = m.rcs[idx];
    if (!rc && autoAdd) {
        var o = m.container, rc = []; //
        for (var i = 0; i < 4; i++) {
            var r = o.appendChild(newEm("div")), s = r.style;
            rc[i] = r; cmnMoveObjTo(r, 0, 0, 6, 6); toZTop(r);
            if (idx == 0) s.backgroundColor = "#ff0000";
            else if (idx < 0) s.backgroundColor = "#6666ff";
            else s.backgroundColor = "#333333";
        }
        if(idx > -1) m.rcs[idx] = rc;
    }
    return rc;
}
//po._swSIH = function () {
//	var m = this, o = m._styInpt;
//	if (o.rows == 4) o.rows = 1; else o.rows = 4;
//}

po.clearSel = function () {
    var co = this._se;
    while (co.length > 0) {
        co.pop();
    }
}
po._sel = function (o, append) {
    var m = this; if (!append) m.clearSel();
    var co = m._se, ix = co.length, eml = getChiHasAtr(m._tbr, "ElmList"), ch = eml.children, rpl;
    //check if old selected
    for (i = 0; i < co.length; i++) {
        var oo = co[i];
        if (oo == o) { co.splice(i, 1); i--; rpl = 1; break; }
        while (oo && (oo != m.container)) {
            if (oo == o) { co.splice(i, 1); i--; break; }
            else oo = oo.parentNode;
        }
        var oo = o; //check if ancestor(of new) selected
        while (oo && (oo != m.container)) {
            if (oo == co[i]) { rpl = 1; break; }
            else oo = oo.parentNode;
        }
    }
    if (!rpl && o) co.push(o);
    for (i = 0; i < ch.length; i++) {
        if (ch[i].rpo == o) ch[i].style.borderColor = "#ff0000";
        else ch[i].style.borderColor = "";
    }
    m.activeObj = co[0];
    //m._styInpt.value = co[0] ? getAtr(co[0], "style") : "";
    //m._styInpt.disabled = co.length <= 0;
    m._hintSel();
    var dga = m.dlgAttr, dgc = m.dlgColor, dgst = m.dlgStyle,dgStRm = m.dlgStyleRmvr;
    if (dga && !append) dga.setActive(co[0]);
    if (dgc && !append) dgc.setActive(co[0]);
    if (dgst && !append) dgst.setActive(co[0]);
	if (dgStRm && !append) dgStRm.copyStyle(co[0]);
	//copyStyle
}
po._hintSel = function () {
	var m = this, co = m._se, rc = m._getrc(0, 1), cv = m._cnvs;
	m.shwSts(co.length + " selected");
	for (var i = 0; i < co.length; i++) {
		var o = co[i], rc = m._getrc(i, 1);
		showIt(rc[0]); showIt(rc[1]); showIt(rc[2]); showIt(rc[3]); //must show before calculate offset
		var p = rc[0].parentNode.parentNode.parentNode;
		var w = o.offsetWidth, h = o.offsetHeight, rl = p.getBoundingClientRect();
		matchLoc(rc[0], o, -6, -6, 0, rl);
		matchLoc(rc[1], o, w, -6, 0, rl);
		matchLoc(rc[2], o, w, h, 0, rl);
		matchLoc(rc[3], o, -6, h, 0, rl);
		if (i == 0) { showIt(m.rc4Drag); matchLoc(m.rc4Drag, o, (w -10)/2, -10, 0, rl); }
	}
	var j = co.length; rc = m._getrc(j);
	while (rc) {
		hideIt(rc[0]); hideIt(rc[1]); hideIt(rc[2]); hideIt(rc[3]);
		j++;
		rc = m._getrc(j);
	}
}
po.copySel = function (cut) {
	var m = this, co = m._se, nn = [],sd=m.dlgPasteStyle;
	if (co.length == 0) return;
	nn = co.concat(nn);
	if (cut) { m._cutted = nn; m._copied = null; }
	else { m._copied = nn; m._cutted = null; }
	if (sd && !isHidden(sd.cntr)) sd.copyStyle(nn[0]);
}

po.pasteCutted = function () {
	var m = this, a = m.activeObj, nc = m._copied, nu = m._cutted; if (!a || (!nc && !nu)) return;
	var tg = a.tagName.toUpperCase();
	//if (tg == "INPUT" || tg == "TR" || tg == "IMG" || tg == "TBODY" || tg == "THEAD" || tg == "TFOOT" || tg == "TABLE") return m.shwSts("Can not paste into " + tg + " object");;
	m.pushUndo();
	var clone = (nc != null), nn = nc || nu;
	try {
		for (var i = 0; i < nn.length; i++) {
			var n = nn[i];
			if (!emIsInsertable(tg, n.tagName)) { m.shwSts("Can not paste " + n.tagName + " into " + tg + " object"); continue; }
			if (clone) n = n.cloneNode(true);
			a.appendChild(lyeGetSafeO(n));
		}
		if (!clone) m._cutted = null;
	} catch (ex) {
		alert(ex);
	}
}
po._hintOver = function (o, vis) {
    return;
    var m = this, rc = m.rcM, pos = getOffsetO(o, rc[0].parentNode), w = o.offsetWidth, h = o.offsetHeight;
    showBeside(rc[0], o, -6 - w, -6);
    showBeside(rc[1], o, 0, -6);
    showBeside(rc[2], o, 0, h);
    showBeside(rc[3], o, -6 - w, h);
    showItA(rc[0], vis); showItA(rc[1], vis); showItA(rc[2], vis); showItA(rc[3], vis);
}
po.pushUndo = function () {
    var m = this, co = m.undoH, txt = m._cnvs.innerHTML, cl = co.length;
    if (cl > 0 && co[cl - 1] == txt) return;
    if (cl > 10) co.shift();
    co.push(txt);
}
po.pullUndo = function () {
    var m = this, co = m.undoH;
    if (co.length == 0) return;
    m._cnvs.innerHTML = co[co.length - 1];
    co.pop();
    m.clearSel();
    m._hintSel();
}
po.evtHandleTbr = function () {//event toolbar
	var ev = GJT.event(); if (!ev) return; var o = GJT.eventSrc(), ty = ev.type;

	if (ty == "mousedown") {
		if (getAtr(o, "act")) borderDown(o);
	}
	else if (ty == "mouseup") {
		if (getAtr(o, "act")) borderUp(o);
	}
	else if (ty == "click") {
		if (o.rpo) {
			this._cnvs.focus();
			return this._sel(o.rpo, ev.ctrlKey);
		}
		var cn = getAtr(o, "act"), m = this, p = o.parentElement;
		if (cn) {
			//if (cn == "Set Style:") this._setAStyle();
			//if (cn == "Position") this._LocTools();
			if (cn == "Action") this._actions();
			else if (cn == "Save") this._save();
		}
		else {
		}
	}
	else if (ty == "keypress") {
		//var chrCode = GJT.eventKeyCode(ev);
		//if (chrCode == 13 && o == this._styInpt) { this._setAStyle(); cmnEvtSetReturn(false); }
	}
	else if (ty == "selectstart") GJT.stopBubble();
}
po._save = function (tarChannel) {
    var m = this, txt = m._cnvs.innerHTML;
    if (m.saveHandle) m.saveHandle(txt, m,tarChannel);
   }
po.swAutoPvw = function () { this.autoPreview = !this.autoPreview; }
po.autoPvw = function () {
	if (!this.autoPreview) return;
	this._preview();
}
po._preview=function(){
    var m = this, txt = m._cnvs.innerHTML;
    if (m.previewHandle) m.previewHandle(txt, m);
}
po._actions = function () {
	var m = this, a = m.activeObj, co = m._se, isTDs = 1, cl = co.length;
	var itms = new OpItems();
	itms.onclick = m.actionsClick; itms.tar = m;
	var evO = GJT.eventSrc();
	if (m.undoH.length > 0) itms.add(newITM("pushUndo", "Undo"));
	if (cl == 0) {
		m.shwSts("No elements selected!"); // alert("No elements selected!");
		itms.add(newITM("insNewEm", "Insert new Element"));
	}
	else if (!a.parentNode) { }//選取物已經不存在
	else {
		itms.add(newITM("Position", "Position..."));
		var tgn = a.tagName, p = a.parentNode, pgn = p.tagName;
		itms.add(newITM("copySel", "Copy Selection"));
		itms.add(newITM("cutSel", "Cut Selection"));
		if (m._copied || m._cutted) {
			itms.add(newITM("pasteCutted", "Paste"));
			//itms.add(newITM("pasteStyleDlg", "Paste Style"));
		}
		for (var i = 0; i < cl; i++) {
			var o = co[i];
			tgn = o.tagName;
			if (tgn != "TD") isTDs = 0;
		}
		if (isTDs) {
			if (cl > 1) itms.add(newITM("mgrTD", "Merge Cells"));
			itms.add(newITM("swapTDU", "Swap Cells Up"));
			itms.add(newITM("swapTDD", "Swap Cells down"));
		}
		var b = a.previousSibling; if (!b || b.tagName != "BR") b = a.nextSibling;
		if (b && b.tagName == "BR") itms.add(newITM("delBR", "Delete BR (Break Return)"));
		//itms.add(newITM("selPrev", "Select Previous Sibling"));
		//itms.add(newITM("selNext", "Select Next Sibling"));
		//itms.add(newITM("selChild", "Select Child"));
		//itms.add(newITM("selAncestor", "Select Ancestor"));
		//itms.add(newITM("selElmByTag", "Select Elements By Tag Name"));
		//if (co.length > 1) itms.add(newITM("swapLoc", "Swap Location", "Swap location of selected first two objects"));
		//if (evO || a) {
		//var itm = itms.add(newITM("selInner", "Select inner objects"));
		//itm.sur = evO ? evO : a;
		//}
		itms.add(newITM("insNewEm", "Insert New Element ..."));
		itms.add(newITM("bgnSelect", "Select ..."));
		itms.add(newITM("bgnStyles", "Styles ..."));
		//itms.add(newITM("modStyle", "Modify Styles text"));
		itms.add(newITM("modAttr", "Attributes ..."));
		itms.add(newITM("modColor", "Colors & Borders ..."));
		//itms.add(newITM("clearStyle", "Clear Style"));
		if (a) {
			if (getAtr(a, "tabcf") || getAtr(a, "tablf")) itms.add(newITM("addTab", "Add New Tab Item", "Add new Tab Item"));
			else if (!lyeGetSafeO(a, 1)) itms.add(newITM("addTabCtrl", "Add New Tab Control", "Add new Tab Controll"));

			itms.add(mnuHLine());
			itms.add(newITM("delEm", "Delete Element"));
		}
		if (m.previewHandle) {
			itms.add(newITM("Preview", "Preview Design"));
			itms.add(newITM("swAutoPvw", m.autoPreview ? "Manual Preview" : "Auto Preview"));
		}
	}
	if (m.saveHandle) itms.add(newITM("Save", "Save Design"));
	if (m.UserChannelId != null) itms.add(newITM("ReleaseToUser", "Release Design to Users"));
	itms.add(newITM("selInvisible", "Select Invisible"));
	SysShowMenu(itms);
}
po.actionsClick = function (itm, itms, menuObj) {
    var m = itms.tar, nm = itm.name;
    if (nm == "pushUndo") return m.pullUndo();
    if (nm == "insTR" || nm == "addTR") m.insTR(nm == "addTR");
    if (nm == "mgrTD") m._mgrTD();
    if (nm == "copySel") m.copySel();
    if (nm == "cutSel") m.copySel(1);
    if (nm == "pasteCutted") m.pasteCutted();
    if (nm == "pasteStyleDlg") m.pasteStyleDlg();
    if (nm == "insBR") m.insBR();
    if (nm == "delBR") m.insBR(1);
    if (nm == "selNext") m.selNext();
    if (nm == "selPrev") m.selPrev();
    if (nm == "selChild") m.selChild();
    if (nm == "selElmByTag") m.selElmByTag();
	if (nm == "selAncestor") m.selChild(1);
    if (nm == "swapLoc" && !m.swapLoc()) return;
    if (nm == "selInner") m.selInner(itm.sur);
    if (nm == "insNewEm") m.insEm0();
    if (nm == "delEm") m.delEm();
    if (nm == "modAttr") m.modAttr();
    if (nm == "modColor") m.modColor();
    if (nm == "modStyle") m.modStyle();
    if (nm == "Save") m._save();
    if (nm == "Preview") m._preview();
    if (nm == "swAutoPvw") m.swAutoPvw();
    if (nm == "Position") m._LocTools();
    if (nm == "ReleaseToUser") {
		if (window.confirm("You are going to release current design to all users! It will effect all users of this system.\nPlease confirm this!")) m._save(m.UserChannelId);
	}
    if (nm == "swapTDU") m.moveLocV(-1,1);
	if (nm == "swapTDD") m.moveLocV(1,1);
	if (nm == "addTab") m.addTab();
	if (nm == "addTabCtrl") m.addTabCtrl();
	if (nm == "bgnStyles") m.bgnStyles();
	if (nm == "bgnSelect") m.bgnSelect();
	if (nm == "styleRmvr") m.styleRmvr();
	if (nm == "selInvisible") m.selInvisible();
    m._hintSel();
}
po.bgnSelect = function(){
	var m = this, itms = new OpItems();;
	itms.add(newITM("selElmByTag", "Select Elements By Tag Name"));
	itms.add(newITM("selChild", "Select Child"));
	itms.add(newITM("selAncestor", "Select Ancestor"));
	itms.add(newITM("selInner", "Select inner objects"));
	itms.add(newITM("selPrev", "Select Previous Sibling"));
	itms.add(newITM("selNext", "Select Next Sibling"));

    itms.tar = m;
    itms.onclick = m.actionsClick;
    SysShowMenu(itms);
}
po.bgnStyles = function(){
	var m = this, itms = new OpItems();;
    itms.add(newITM("pasteStyleDlg", "Style Paster"));
    itms.add(newITM("modStyle", "Style Editor"));
	itms.add(newITM("styleRmvr", "Style Remover"));
    itms.tar = m;
    itms.onclick = m.actionsClick;
    SysShowMenu(itms);
}
po.modStyle = function () {
	var m = this,d=m.dlgStyle;
	if (!d || isHidden(d.container)) {
		var d = new StyleEditor(m);
		m.dlgStyle = d;
		d.ctrl = m;
		d.dlgCtrl.moveToLT();
		d.setActive(m._se[0]);
		showBesideMouse(d.dlgCtrl.dlg);
	}
	toZTop(d.dlgCtrl.dlg);
}
po.styleRmvr=function(){
	var m = this, d=m.dlgStyleRmvr;
	if (!d || isHidden(d.container)) {
		d = new StylePaster(m,null,1);
		m.dlgStyleRmvr = d;
		d.ctrl = m;
		showBesideMouse(d.dlgCtrl.dlg);
		//d.dlgCtrl.moveToLT();
	}
	d.copyStyle(m.activeObj);
	toZTop(d.dlgCtrl.dlg);
}
po.pasteStyleDlg = function() {
	var m = this, nn = m._copied || m._cutted;
	if (!nn) return alert("You have to copy an element (copy selection) before launch Style Paster!");
	var d=m.dlgPasteStyle;
	if (!d || isHidden(d.container)) {
		d = new StylePaster(m);
		m.dlgPasteStyle = d;
		d.ctrl = m;
		showBesideMouse(d.dlgCtrl.dlg);
		//d.dlgCtrl.moveToLT();
	}
	d.copyStyle(nn[0]);
	toZTop(d.dlgCtrl.dlg);
}
po.pasteStyle = function(xa,removeStyle) {
	var m = this,co=m._se,rmv=removeStyle;
	m.pushUndo();
	for(var i=0;i<co.length;i++){
		var sx=getAtr(co[i],"style"),isSO;
		if (sx && sx.cssText) { sx = sx.cssText; isSO = 1; }
		if(!sx) {
			if(!rmv) {
			if(isSO) co[i].style.cssText = xa.join(";"); else setAtr(co[i],"style", xa.join(";"));
			}
			continue;
		}
		sx=sx.split(";");
		for(var k=0;k<xa.length;k++){
			var fnd=0,idx=xa[k].indexOf(":");
			if(idx<0)continue;
			var nm=GJT.trim(xa[k].substring(0,idx));
			for(var j=0;j<sx.length;j++){
				var ids=sx[j].indexOf(":");
				if(ids<0)continue;
				var nm2=GJT.trim(sx[j].substring(0,ids));
				if(nm2 == nm){if(rmv) sx[j]=""; else {sx[j] = xa[k];fnd=1;} continue;}
			}
			if(!fnd && !rmv)sx.push(xa[k]);
		}
		if(isSO)co[i].style.cssText = sx.join(";");
		else setAtr(co[i],"style",sx.join(";"));
	}
	m._hintSel();
}
po.setStyle = function (txt, effAll) {
	var m = this, co = [m.activeObj];
	if (effAll) co = m._se;
	m.pushUndo();
	for (var i = 0; i < co.length; i++) {
		if (!co[i]) continue;
		setAtr(co[i], "style", txt);
	}
	m._hintSel();
	m.autoPvw();
}
po.modAttr = function () {
    var m = this,d=m.dlgAttr;
    if (!d || isHidden(d.container)) {
        var d =new AttributeEditor(m);
        m.dlgAttr = d;
        d.dlgCtrl.moveToLT();
        d.ctrl = m;
        d.setActive(m._se[0]);
        d.setSelection(m._se);
        showBesideMouse(d.dlgCtrl.dlg);
    }
    toZTop(d.dlgCtrl.dlg);
}
po.modColor = function () {
    var m = this, d=m.dlgColor;
    if (!d || isHidden(d.container)) {
        d= new ColorEditor(m); //, m.dlgCtrl.main
        m.dlgColor = d;
        d.dlgCtrl.moveToLT();
        d.ctrl = m;
        d.setActive(m._se[0]);
        d.setSelection(m._se);
        showBesideMouse(d.dlgCtrl.dlg);
    }
    toZTop(d.dlgCtrl.dlg);
}
po.clearStyle=function(){
    var m = this, co = m._se, cl = co.length;
	for (var i = 0; i < cl; i++) {
		rmvAtr(co[i], "style");
	}
}
po.delEm = function () {
    var m = this, a = m.activeObj; if (!a) return;
    var co = m._se, cl = co.length;
    if (!window.confirm("You are deleting " + cl + " object" + (cl > 1 ? "s" : "") + "! \r\nPlease make sure that is what you want.")) return;
	m.pushUndo();
    for (var i = 0; i < cl; i++) {
        var t2 = lyeGetSafeO(co[i]);
        t2.parentNode.removeChild(t2);
    }
    m.clearSel();
}
po.selElmByTag=function(){
	var m = this, a = m.activeObj; if (!a) return;
    var tg = "input,td,span,button,textarea,img,other".split(","), itms = new OpItems();
    for (var i = 0; i < tg.length; i++) {
        itms.add(newITM(tg[i], tg[i]));
    }
    itms.tar = this;
    itms.onclick = this.selElmByTag2;
    SysShowMenu(itms);
}
po.selElmByTag2 = function(itm,itms){
	var m = itms.tar, a = m.activeObj, t1 = itm.name.toUpperCase();if(!a)return;
	if(t1=="OTHER")t1=window.prompt("Please input tag name for selecting",m.lstSelTag);
	if(!t1)return;else t1=t1.toUpperCase();
	m.lstSelTag = t1;
	var ns=a.getElementsByTagName(t1),co=m._se;;
	m._sel(ns[0]);
	for (i = 1; i < ns.length; i++) {
		co.push(ns[i]);
	}
	 m._hintSel();
}
po.selChild = function(selPar){
	var m = this, a = m.activeObj; if (!a) return;
	var chn = a.children, itms =[];
	if(selPar){
		chn=[];
		var p = a.parentNode;
		while (p && p != m._cnvs){
			chn.push(p);
			p=p.parentNode;
		}
	}
	for(var i=0; i<chn.length; i++) {
		//if (isHidden(chn[i]))continue;
		var ds = chn[i].outerHTML.replace(chn[i].innerHTML,"...");
		var tx =chn[i].tagName + (chn[i].className ? "." +  chn[i].className : "");
		var itm=newITM(chn[i].tagName, tx, ds );
		itm.src = chn[i];
		itms.push(itm);
	}
	itms.tar = m;
	itms.onclick = m.selChild2;
	SysShowMenu(itms);
}
po.selChild2 = function(itm, itms){
	var lyo=itms.tar,ch = itm.src;
	lyo._getelms(ch);
	lyo._sel(ch);
}
po.addTab = function () {
	var m = this, a = m.activeObj; if (!a) return;
	m.pushUndo();
	if (getAtr(a, "tablf")) a = a.parentNode;
	var chn = a.children, myId = getAtr(a, "tabcf"), nId = "qtb" + Math.random(); if (!myId) return alert("No id in selected");
	var tb = a.appendChild(newEm("div")); tb.innerText = "Tab " + chn.length;
	setAtr(tb, "tablf", nId);
	var c = a.parentNode.appendChild(newEm("div"));
	setAtr(c, "tabvf", nId); setAtr(c, "style", "border:1px solid;height:60px;clear:both;");
}
po.addTabCtrl = function(){
	if(!window.confirm("This action will add a new Tab Control object inside active object. Please confirm this.")) return;
	var m = this, a = m.activeObj, nId = "tbc" + Math.random(); if (!a || lyeGetSafeO(a, 1)) return alert("Not a valid container fo tab control");
	m.pushUndo();
	var tb= a.appendChild(newEm("div"));
	setAtr(tb,"tabcf",nId);setAtr(tb,"class","Tabs");
	m._sel(tb); m.addTab();
}
po.selInner = function (o) {
    var m = this;
    if (!o) o = m.activeObj; if (!o) return m.shwSts("No boject selected");
    if (o.rpo) o = o.rpo; else o = m.activeObj;
    var chrn = o.children;

    for (var i = 0; i < chrn.length; i++) {
        m._sel(chrn[i], i > 0);
    }
}
po._mgrTD = function () {
    var a = this.activeObj; if (!a) return;
    var m = this, co = m._se, csi = new OpItems(), rsi = new OpItems();
    for (var i = 0; i < co.length; i++) {
        var o = co[i];
        if (o.tagName != "TD") return alert("Not TD selected!");
        var r = "_" + getTR(o).rowIndex, c = "_" + o.cellIndex;
        if (!rsi[r]) rsi.add({ name: r });
        if (!csi[c]) csi.add({ name: c });
    }
    m.pushUndo();
    for (var i = 0; i < co.length; i++) {
        var o = co[i];
        if (o != a) {
            var chn = o.children;
            while (chn.length > 0) {
                a.appendChild(chn[0]);
            }
            o.outerHTML = "";
        }
    }
    a.rowSpan = rsi.length;
    a.colSpan = csi.length;
    m._sel(a);
}
po.selNext = function () {
    var a = this.activeObj; if (!a) return;
    var o = a.nextSibling;
    if (o) { this._getelms(o); this._sel(o); }
}
po.selPrev = function () {
    var a = this.activeObj; if (!a) return;
    var o = a.previousSibling;
    if (o) { this._getelms(o); this._sel(o); }
}
po.selInvisible = function () {
	var m = this; m.clearSel();
	m.selInvisible2(m._cnvs);
}
po.selInvisible2 = function (par) {
	var m = this, chn = par.children;
	for (var i = 0; i < chn.length; i++) {
		var n = chn[i];
		if (n.tagName == "BR") continue;
		if (isHidden(n) || n.offsetWidth < 3) m._sel(n, 1);
		else m.selInvisible2(n);
	}
}
po.shwSts = function(msg){this._Sts.innerText = msg;}
po.swapLoc = function (o1, o2) {
    var m = this, co = m._se;
    if (!o1) o1 = co[0]; if (!o2) o2 = co[1];
    var oh1 = leyGetChoiceO(o1, 1), oh2 = leyGetChoiceO(o2, 1)
    if (oh1 || oh2) return m.shwSts("Choice Items disallow swapping");
    o1 = lyeGetSafeO(o1); o2 = lyeGetSafeO(o2);
    if (!o1 || !o2 || o1.tagName != o2.tagName) return m.shwSts("Please select two elements with same tag name");
	m.pushUndo();
    var p1 = o1.parentNode, p2 = o2.parentNode, r1 = o2.nextSibling, r2 = o1.nextSibling;
    if (r1) p2.insertBefore(o1, r1); else p2.appendChild(o1);
    if (r2) p1.insertBefore(o2, r2); else p1.appendChild(o2);
    return 1;
}
po.insBR = function (del) {
    var m = this, co = m._se;
	m.pushUndo();
    for (var i = 0; i < co.length; i++) {
        var o = co[i], p = o.parentNode, b;
        if (del) {
            b = o.previousSibling; if (!b || b.tagName != "BR") b = o.nextSibling;
            if (b && b.tagName == "BR") b.outerHTML = "";
        }
        else {
            if (!emIsInsertable(p.tagName,"BR")) continue;
            e = newEm("BR");
            p.insertBefore(e, o);
        }
    }
}
po.IsSameParent = function (co, alrm) {
    if (!co) co = this._se;
    var a = co[0]; if (!a) return;
    var p = a.parentNode;
    for (var i = 0; i < co.length; i++) {
        if (p != co[i].parentNode) {
            if (alrm) alert("Some selection is not under same parent node");
            return;
        }
    }
    return 1;
}
po._cmpTR = function (o1, o2) {
    if (o1.rowIndex < o2.rowIndex) return -1;
    else if (o1.rowIndex > o2.rowIndex) return 1;
    return 0;
}
po.sortTRs = function (co, rvs) {
    co = co.concat([]); //clone
    co.sort(this._cmpTR);
    if (rvs) co.reverse();
    return co;
}
po._sortRU = function (o1, o2) {
    if (o1.surIdx < o2.surIdx) return -1;
    else if (o1.surIdx > o2.surIdx) return 1;
    return 0;
}
po.sortedSel = function (rvs) {
    var m = this, co = m._se, nn = [];
    if (!m.IsSameParent(co, 1)) return;
    co = co.concat(nn);
    for (var i = 0; i < co.length; i++) {
        var o = co[i], p = o.parentNode, chrn = p.children, nl = chrn.length;
        o.surIdx = 0;
        for (var j = 0; j < nl; j++) {
            if (chrn[j] == o) { o.surIdx = j; break; }
        }
    }
    co.sort(m._sortRU);
    if (rvs) co.reverse();
    return co;
}
po.moveLocV = function (stp,swp) {
    var m = this, co = m._se; if (!co.length) return;
    var osw = [], tg1 = co[0].tagName, isTR;
    co = m.sortTRs(co);
    for (var i = 0; i < co.length; i++) {
        var o = co[i], ro, rtd, tg = o.tagName;
        if (tg != "TR" && tg != "TD" || tg1 != tg) return m.shwSts("Only TR TD (all must be same) are allowed to move up/down");
        var tr = getTR(o), td = (tg == "TD") ? o : null;
        ro = (stp && stp < 0) ? tr.previousSibling : tr.nextSibling;
        if (!ro) continue;
        if (td) {
            rtd = ro.cells[td.cellIndex];
            //if (!rtd) continue;
            osw.push([td, rtd, ro]);
        } else {
            osw.push([tr, ro]);isTR=1;
        }
    }
    m.pushUndo();
    for (var i = 0; i < osw.length; i++) {
        if(isTR || swp) m.swapLoc(osw[i][0], osw[i][1]);
		else{
			var ro=osw[i][2];
			if (osw[i][1]) ro.insertBefore(osw[i][0],osw[i][1]);
			else ro.appendChild(osw[i][0]);
		}
    }
    m._hintSel();
}
po.moveLocH = function (stp) {
	var m = this, co = m.sortedSel(stp > 0); if (!co) return;
	m.pushUndo();
    for (var i = 0; i < co.length; i++) {
        var o = co[i], p = o.parentNode;
        if (stp > 0) {
            ro = o.nextSibling;
            if (!ro) break;
            ro = ro.nextSibling;
            if (ro) p.insertBefore(o, ro);
            else p.appendChild(o);
        }
        if (stp < 0) {
            ro = o.previousSibling;
            if (!ro) break;
            p.insertBefore(o, ro);
        }
    }
    m._hintSel();
}
po.insEm0 = function () {
    var tg = "bb,Insert Before Begin,ab,Insert After Begin,be,Insert Before End,ae,Append After End".split(","), itms = new OpItems();
    for (var i = 0; i < tg.length; i+=2) {itms.add(newITM(tg[i], tg[i+1]));}
    itms.tar = this;
    itms.onclick = this.insEm01;
    SysShowMenu(itms);
}
po.insEm01 = function (itm, itms) {
    itms.tar.insEm(itm.name);
}
po.insEm = function (insMode) {
    var tg = "div,tr,td,span,table,br,form,button,hr,canvas,textarea,input,img,Other".split(","), itms = new OpItems();
    for (var i = 0; i < tg.length; i++) {
        itms.add(newITM(tg[i], tg[i]));
    }
    itms.tar = this; itms.insMode = insMode;
    itms.onclick = this.insElem2;
    SysShowMenu(itms);
}
po.insElem2 = function (itm, itms) {
	var m = itms.tar, a = m.activeObj, insMode = itms.insMode, t1 = itm.name.toUpperCase(), nE, amr = m.allowMultiRootNode;
	if (!a) {
		if (insMode == "bb" || insMode == "ae") return m.shwSts("Object must be inserted inside canvas!");
		a = m._cnvs;
	}
	if (!amr) {
		if (a == m._cnvs && a.children.length) a = m._cnvs.children[0];
		if (a.parentNode == m._cnvs && (insMode == "bb" || insMode == "ae")) return m.shwSts("Only one root element allowed!");
	}
	var t2 = a.tagName.toUpperCase(), nE, p = a.parentNode, ro, safeO = lyeGetSafeO(a, 1);
	if (t1.indexOf("OTHER") == 0) {
		t1 = window.prompt("Please input tag name for insert", m.lastTagNm + "") + "";
		if (!t1) return;
		t1 = t1.toUpperCase();
		m.lastTagNm = t1;
	}
	if (t1 == "TR" && (t2 == "TR" || t2 == "TD")) return m.insTR(insMode.indexOf("a") == 0);
	if (insMode == "ab" || insMode == "be") {//inside object
		if ((safeO && isInputTag(t1)) || (isInputTag(t2) && t2 != "SELECT")
        || (t1 == "TD" && t2 != "TR") || (t1 == "TR" && !isTrParentTag(t2)) || (t1 == "OPTION" && t2 != "SELECT") || (t2 == "TABLE" && !isTblChildTag(t1)) ||
         (isTrParentTag(t2) && t1 != "TR")) return m.shwSts("Selected object disallow to insert specified object");
	} else if (insMode == "bb" || insMode == "ae") {//outside object
		if ((safeO && isInputTag(t1) && safeO != a) || (t2 == "TD" && t1 != "TD") || (t2 == "TR" && t1 != "TR") || (isTblChildTag(t2) && !isTblChildTag(t1)) ||
        (t2 != "TD" && (isTblChildTag(t1) || t1 == "TR"))) return m.shwSts("Selected object disallow to insert specified object type");
	} else return alert("Invalid mode " + insMode);
	m.pushUndo();
	nE = newEm(t1);
	if (t1 == "TABLE") {
		var n1 = nE.appendChild(newEm("tbody"));
		if (!m.lastRxC) m.lastRxC = "2 x 4";
		var rxc = window.prompt("Please input rows x columns for insert", m.lastRxC) + "";
		if (rxc) m.lastRxC = rxc; else return;
		var rca = rxc.split("x"), htmx = "";
		for (var i = 0; i < parseInt(rca[0], 10); i++) {
			htmx += "<tr style='height:60px;'>";
			for (var j = 0; j < parseInt(rca[1], 10); j++) {htmx += "<td style='width:100px;'></td>";}
			htmx += "</tr>";
		}
		n1.innerHTML = htmx;
		setAtr(nE, "border", "1");// setAtr(nE, "style", "width:100%;height:60px;");
	}
	else if (t1 == "IMG") setAtr(nE, "alt", "IMG");
	else if (t1 == "CANVAS") { }
	else if (t1 == "DIV" || t1 == "SPAN" || t1 == "BUTTON" || t1 == "FORM") nE.innerText = "new " + t1;
	ro = a;
	if (insMode == "ae") ro = a.nextSibling;
	if (insMode == "ab") { p = a; ro = a.children[0]; }
	if (insMode == "be") { p = a; ro = null; }
	if (ro) p.insertBefore(nE, ro); else p.appendChild(nE);
	m._sel(nE);
}
po.insTR = function (addIt) {
    var m = this, a = m.activeObj, tgn = a.tagName, oTr, refTR;
	m.pushUndo();
    if (tgn == "TR") oTr = a;
    else if (tgn = "TD") oTr = getTR(a);
    else oTr = a.rows[a.rows.length];
    if (addIt) refTR = oTr.nextSibling; else refTR = oTr;
    var nr = oTr.cloneNode(true), cc = nr.cells;
    for (var i = 0; i < cc.length; i++) { cc[i].innerText = ""; } //clear td contents
    nr.style.height = "40px";
    if (refTR) oTr.parentNode.insertBefore(nr, refTR);
    else oTr.parentNode.appendChild(nr);
    m._sel(nr);
}
//po._setAStyle = function () {
//    var m = this, a = m.activeObj, co = m._se, stx = m._styInpt.value;
//    if (m._styInpt.disabled) return;
//    m.pushUndo();
//    for (var i = 0; i < co.length; i++) {
//        if (co[i]) setAtr(co[i], "style", stx);
//    }
//    //if (a) setAtr(a, "style", stx);
//    m._hintSel();
//}
po._LocTools = function () {
    var m = this,d=m.dlgLoc;
	if (!d || isHidden(d.uio)){
		d = new teShaft(m.container, null, m, 0, "Position"); //sft.style.backgroundColor= "#eeffee";
		d.onclick = m._LocClick;
		d.lye = m;
		d.uio.style.backgroundColor = "#ffeecc";
		showBesideMouse(d.uio, 0, 0, true);
	}
	toZTop(d.uio);
}
po._LocClick = function (act, tar) {
    if (act == "L") { tar.lye.moveLocH(-1); }
    else if (act == "R") { tar.lye.moveLocH(1); }
    else if (act == "U") { tar.lye.moveLocV(-1); }
    else if (act == "D") { tar.lye.moveLocV(1); }
}
po._getelms = function (o) {
	var m = this, p = o, h = [], eml = getChiHasAtr(m._tbr, "ElmList");
	eml.innerText = "";
	if ("#text" == o.nodeName) return;
	while (p && p != m._cnvs) {
		var txt = p.tagName, tip = "", e = newEm("div"), s = e.style;
		if (p.className) txt += "." + p.className;
		s.margin = "0px"; s.border = "1px solid"; s.float = "left"; s.height = "24px";
		e.innerText = txt; e.title = p.outerHTML.replace(p.innerHTML, ""); // e.cursor = "pointer";
		eml.appendChild(e);
		e.rpo = p;
		p = p.parentNode;
		if (p == document) break;
	}
}
po.actTab = function (o,shwAll) {
	var m = this, nId = getAtr(o, "tablf"), p = o.parentNode, p2 = p.parentNode; if (!nId) return;
	var chn=collEmHasAtr(p, "tablf", null, null,1);
	for(var i=0;i<chn.length;i++) {
		var o2=chn[i], vis= shwAll || (o2 == o), nid=getAtr(o2, "tablf");
		showItA(getChiHasAtr(p2, "tabvf", nid,1), vis);
	}
}
po.chgParent = function (newP, forHint) {
	var m = this, o = newP, co = m._se;
	if (o == m.rc4Drag || !co.length) return;
	for (var i = 0; i < co.length; i++) {
		if (co[i] == o) return;
		var rc = m._getrc(i, 1);
		if (rc[0] == o || rc[1] == o || rc[2] == o || rc[3] == o) return;
		if (!emIsInsertable(o, co[i])) return;
	}
	var t1 = newP.tagName;
	//if (isInputTag(t1) || t1 == "SELECT" || t1 == "TR" || isTblChildTag(t1)) return;
	var rc = m._getrc(i, 1), p = rc[0].parentNode.parentNode.parentNode, w = o.offsetWidth, rl = p.getBoundingClientRect();
	if (forHint) { showIt(m.rc4Drag); matchLoc(m.rc4Drag, o, (w - 10) / 2, -10, 0, rl); return; }
	else {
		m.pushUndo();
		for (var i = 0; i < co.length; i++) {
			o.appendChild(lyeGetSafeO(co[i]));
		}
		m._hintSel();
	}
}
po.evtHandle = function () {
	var ev = GJT.event(); if (!ev) return;
	var o = GJT.eventSrc(), ty = ev.type, m = this;
	if (ty == "mouseover") {//m.rc4Drag
		if (m.dg4ChgPar != undefined) m.chgParent(o, 1);
	}
	else if (ty == "mousedown") {
		if (o != m.rc4Drag || !GJT.isButtonDownLeft()) return;
		m.dg4ChgPar = 1;
	}
	else if (ty == "mouseup") {
		if (m.dg4ChgPar) m.chgParent(o);
		delete m.dg4ChgPar;
	}
	else if (ty == "selectstart" && m.dg4ChgPar) { cmnEvtSetReturn(false); }
	else if (ty == "click") {
		MenuHide();
		if (m.rc4Drag == o) return;
		this._getelms(o);
		this._sel(o, ev.ctrlKey);
		this.actTab(o);
	}
	else if (ty == "selectstart" && o.tagName != "INPUT") cmnEvtSetReturn(false);
	else if (ty == "keydown") {
		GJT.stopBubble();
		var key = GJT.eventKeyCode(ev);
		if (key == 37) { if (ev.shiftKey) m.moveLocH(-1); else m.selPrev(); }
		if (key == 39) { if (ev.shiftKey) m.moveLocH(1); else m.selNext(); }
		if (key == 38) { if (ev.shiftKey) m.moveLocV(-1); }
		if (key == 40) { if (ev.shiftKey) m.moveLocV(1); }
	}
	else if (ty == "dblclick") this.actTab(o, 1);
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
po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
po.evtDlgResize = function (dlg) {
	this._hintSel();
}
LayoutEditor._initialized = true;
}
var text = tar ? tar.text : "";
if (!caption) caption = "Layout Editor ";
var dg = new DialogInBody("lyoer" + tar ? tar.name : "", caption + (text ? " (" + text + ")" : ""), null, null);
m.dlgCtrl = dg;
dg.handleClose = function () { return m.evtCloseDlg.call(m); }
dg.handleResize = function () { return m.evtDlgResize.call(m); }
dg.setClient(m.createContents(src));

} //end LayoutEditor

function emIsInsertable(parTag, chiTag) {
	var t = parTag, g = chiTag;
	if (t.tagName) t = t.tagName;
	if (g.tagName) g = g.tagName;
	t = t.toUpperCase(), g = g.toUpperCase();
	if (t == "TABLE") return (g == "TOBDY" || g == "THEAD" || g == "CAPTION" || g == "TFOOT");
    else if (t == "TBODY") return (g == "TR");
    else if (t == "THEAD") return (g == "TR");
    else if (t == "TR") return (g == "TD");
    else if (t == "SELECT") return (g == "OPTION");
    else if (t == "UL") return (g == "LI");
    else if (t == "BR" || t == "INPUT" || t == "TEXTAREA") return 0;
    else return (g != "TD" && g != "TR" && g != "TBODY" && g != "THEAD" && g != "CAPTION" && g != "TFOOT");
}
function isTblChildTag(t1) { return (t1 == "TBODY" || t1 == "TFOOT" || t1 == "THEAD" || t1 == "CAPTION"); }
function isTrParentTag(t1) { return (t1 == "TBODY" || t1 == "TFOOT" || t1 == "THEAD"); }
function isInputTag(t1) { return (t1 == "INPUT" || t1 == "SELECT" || t1 == "TEXTAREA"); }

function StyleEditor(src, container) {
	if (StyleEditor._initialized == undefined) {
		var po = StyleEditor.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<textarea style='width:95%;height:80%;' title='Ctrl + Enter key to make effect'></textarea><br /><button>Set</button><button>Clear</button><input type='checkbox' title='effect all selection'> All ",
			"<br /><button sxst='font-weight:bold'>Bold</button><button sxst='font-style:italic'>Italic</button><button sxst='text-decoration:line-through'>Strike</button>",
			"<button sxst='padding-left:20px'>L.Padding</button><button sxst='outline:#00FF00 dotted 2px;outline-offset:5px;'>OutLine</button>"]; //
			o.innerHTML = h.join("");
			m.container = o;
			var t = getEM(o, "textarea");
			m._InHtmlV = t[0];
			b = getEM(o, "button");
			b[0].onclick = function () { m.setStyle.call(m); }
			b[1].onclick = function () { m.clearStyle.call(m); }
			m.btnSet = b[0];
			m.chkAll = getEM(o, "input")[0];
			var er = function () { m.evtHandle.call(m); };
			setEvtHandleAll(o, er);
			return o;
		}
		po.setTarget = function (o) {
			var m = this; m.target = o;
			m.setActive(o);
		}
		po.setActive = function (o) {
			var m = this;
			var txt = getAtr(o, "style");
			if (!txt) txt = "";
			else txt = txt.replace(new RegExp("; ", "gi"), ";").replace(new RegExp(";", "gi"), ";\n");
			m._InHtmlV.value = txt;
		}
		po.clearStyle = function() {
			this._InHtmlV.value = "";this.setStyle();
		}
		po.setStyle = function () {
			var m = this, txt = m._InHtmlV.value;
			txt = txt.replace(new RegExp("\r", "gi"), "").replace(new RegExp("\n", "gi"), "");
			if (m.target) { return setAtr(m.target, "style", txt); }
			if (m.ctrl) m.ctrl.setStyle(txt, m.chkAll.checked);
		}
		po.evtHandle = function () {
			var m = this, ev = GJT.event(); if (!ev) return; var o = GJT.eventSrc(), ty = ev.type;
			if (ty == "keydown") {
				var kcode = GJT.eventKeyCode(ev);
				if (kcode == 13 && ev.ctrlKey) {
					m.setStyle(); cmnEvtSetReturn(false);
				}
			}
			if (ty == "click") {
				var s = getAtr(o, "sxst");
				if (s) {
					var txt = m._InHtmlV.value;
					if (txt.indexOf(s) < 0) {
						txt += s + ";\r\n";
						m._InHtmlV.value = txt;
					}
				}
			}
		}
		po.evtDlgResize = function (dlg) {
			var m = this, o = m._InHtmlV, st=o.style,p=o.parentNode;
			st.width = toPx(p.clientWidth - 10);
			st.height = toPx(p.clientHeight - m.btnSet.offsetHeight * 2 - 10);
		}
		StyleEditor._initialized = true;
	}
	var m = this, dg = new DialogInBody("lyoSE", "Styles", 360, 200, container);
	m.dlgCtrl = dg;
	dg.setClient(m.createContents());
	dg.handleResize = function () { return m.evtDlgResize.call(m); }

}

function StylePaster(src, container, asRmvr) {
	this.asRmvr = asRmvr;
	if (StylePaster._initialized == undefined) {
		var po = StylePaster.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<div></div><button>Select All</button><button>Select None</button><button>Paste</button>"]; //
			o.innerHTML = h.join("");
			m.cntr =  getEM(o, "div")[0];
			var b = getEM(o, "button");
			b[0].onclick = function () { m.checkAll.call(m); }
			b[1].onclick = function () { m.checkNone.call(m); }
			b[2].onclick = function () { m.paste.call(m); }
			if(m.asRmvr)b[2].innerText = "Remove";
			return o;
		}
		po.checkAll = function(chkIt){
			var ns= getEM(m.cntr,"input");

			for(var i=0;i <ns.length;i++){
				ns[i].checked=chkIt;
			}
		}
		po.checkNone = function(){this.checkAll(0);}
		po.paste = function() {
			var m = this, ns = getEM(m.cntr, "input"), x=[];
			for(var i=0;i <ns.length;i++){
				if(ns[i].checked) x.push(ns[i].value);
			}
			if(x.length && m.ctrl) {
				m.ctrl.pasteStyle(x, m.asRmvr);
			}
		}
		po.copyStyle = function (o) {
			var m = this,txt=getAtr(o,"style"),c=m.cntr;
			c.innerHTML="";
			if(!txt)return;
			if(txt.cssText) txt= txt.cssText;
			var xa=txt.split(";");
			for(var i=0;i <xa.length;i++){
				var n = newEm("div"), n2=n.appendChild(newEmH("<input type='checkbox' />")),n3=n.appendChild(newEm("span"));
				xa[i]=GJT.trim(xa[i]);
				if(xa[i]=="") continue;
				n2.value = xa[i]; n3.innerText = xa[i];
				c.appendChild(n);
			}
		}
		StylePaster._initialized = true;
	}
	var m = this, dg = new DialogInBody("lyoSR", (m.asRmvr ?  "Style Remover" : "Style Paster"), null, null, container);
	m.ctrl=src;
	m.dlgCtrl = dg;
	dg.setClient(m.createContents());
}


function AttributeEditor(src,container) {
var m = this;
if (AttributeEditor._initialized == undefined) {
var po = AttributeEditor.prototype;
po.createContents = function () {
    var m = this, o = newEm("div"), h = ["<table><tr><td align='right' width='90px' nowrap title='Select a attribute for modify'>Sel Attr</td><td><select style='width:99%'></select></td></tr>"
    ,"<tr><td align='right' width='90px' nowrap>Attr Name:</td><td><input  type='text' style='width:99%' /></td></tr>"
    ,"<tr><td align='right' width='90px' nowrap>Attr Value:</td><td><input type='text' style='width:99%' /></td></tr>"
    ,"<tr><td colspan='2' nowrap='nowrap'><button>Set Attribute</button><button>Remove Attribute</button><button>Add Attribute</button></td></tr>"
    ,"<tr><td><button title='Click to set inner HTML of active object'>Set Inner HTML</button></td><td><textarea style='width:95%' title='input text here, then click left button to set inner HTML to selected object' rows='5'></textarea></td></tr>"
    //,"<tr><td><button title='Click to set inner text of active object'>Set inner text</button></td><td><textarea style='width:95%' title='input text here, then click left button to set inner text to selected object' rows='3'></textarea></td></tr>"
	,"<tr><td align='right' width='90px' nowrap title='Select a text node for modify'>Text Node</td><td><select style='width:99%'></select></td></tr>"
	,"<tr><td align='right' width='90px' nowrap>Text</td><td><input type='text' style='width:99%' ></input></td></tr>"
	,"<tr><td colspan='2' nowrap='nowrap'><button>Modify</button><button>Remove</button><button>Insert</button><button>Append</button></td></tr>"
	,"</table>"];
    o.innerHTML = h.join("");
	o = o.children[0];
	setAtr(o,"width","100%");
    m.container = o;
    var b = getEM(o, "input"),t=getEM(o,"textarea");
    m._AtrN = b[0]; m._AtrV = b[1];m._txtV=b[2]; m._InHtmlV = t[0];// m._InTextV = t[1];
    b = getEM(o, "button");
    b[0].onclick = function () { m.setAtr.call(m); }
    b[1].onclick = function () { m.removeAttr.call(m); }
    b[2].onclick = function () { m.addAtr.call(m); }
    //b[3].onclick = function () { m.setInText.call(m); }
    b[3].onclick = function () { m.setInHtml.call(m); }

	b[4].onclick = function () { m.modTxt.call(m); }
	b[5].onclick = function () { m.rmvTxt.call(m); }
	b[6].onclick = function () { m.insTxt.call(m); }
	b[7].onclick = function () { m.addTxt.call(m); }
    m.setBtn = b[0]; m.rmvBtn = b[1];m.inHtmBtn = b[3];//m.inTxtBtn = b[3];
    b = getEM(o, "select");
    m._slt = b[0];
    b[0].onchange = function () { m.showAttr.call(m); }
	m._slxn = b[1];
	b[1].onchange = function () { m.shwNx.call(m); }
    return o;
}
po.setActive = function (o) {
    var m = this, rdo = 0, chg=m.actO != o; m.actO = o;
	if(chg){m.listAttr(1);m.listTxN(0);}
    m._InHtmlV.value = o.innerHTML;
    //m._InTextV.value = o.innerText;
    rdo = lyeHasSysElement(o);
    m._InHtmlV.readOnly = rdo != null;
    //m._InTextV.readOnly = rdo != null;
    //m.inTxtBtn.disabled = rdo != null;
    m.inHtmBtn.disabled = rdo != null;
}
po.setSelection = function (coll) {
    this._se = coll;
}
po.listTxN = function(actN){
    var m = this, o = m.actO, s = m._slxn,chn=s.children,idx;
    while (chn.length > 0) { s.removeChild(chn[0]); }
    if (!o) return;
	if(typeof actN == "number") idx=actN;
    var atrs = o.childNodes;
    for (var i = 0; i < atrs.length; i++) {
        var c=atrs[i];if(c.nodeName !="#text") continue;
		var n = newEm("option");
        n.innerText = c.nodeValue;
        n.value = c.nodeValue;
		n._xn = c;
		if(chn.length == idx) n.selected = true;
		if(n == actN) n.selected = true;
        s.appendChild(n);
    }
    m.shwNx();
}
po.getTxN=function(){
    var m = this, s = m._slxn, chn = s.children;
    for (var i = 0; i < chn.length; i++) {
        if (!chn[i].selected) continue;
        return chn[i]._xn;
    }
}
po.modTxt=function(){
	var n = this.getTxN();
	if(n) {n.nodeValue = this._txtV.value;this.shwNx();}
}
po.rmvTxt=function(){
	var n = this.getTxN();
	if (n) { n.parentNode.removeChild(n);this.listTxN(0);}
}
po.insTxt=function(append){
	var m = this, o = m.actO,txt=this._txtV.value;if(!o || txt=="")return;
	var n= document.createTextNode(txt);
	if(append) {o.appendChild(n);m.listTxN(n);}
	else {
		var itms=[],chrn=o.childNodes;
		for(var i=0;i<chrn.length;i++){
			var cpt =chrn[i].nodeValue;
			if(!cpt)cpt =chrn[i].innerText;
			var itm=newITM("",cpt.substring(0,30));
			itm.ref = chrn[i];
			itms.push(itm);
		}
		itms.n = n;itms
		itms.onclick=function(itm,itms){m.prcsAddTxt.call(m,itm,itms);}
		SysShowMenu(itms);
	}
}
po.addTxt=function(){this.insTxt(1);}
po.prcsAddTxt=function(itm,itms){
	var n=itms.n,r=itm.ref;
	r.parentNode.insertBefore(n,r);
	this.listTxN(n);
}
po.shwNx=function(){
    var n = this.getTxN();
    this._txtV.value = n ? n.nodeValue : "";
}

po.listAttr = function (shwFst) {
    var m = this, o = m.actO, s = m._slt;
    while (s.children.length > 0) { s.removeChild(s.children[0]); }
    if (!o) return;
    var atrs = o.attributes;if(!atrs)return;
    for (var i = 0; i < atrs.length; i++) {
        var n = newEm("option");
        n.innerText = atrs[i].name;
        n.value = atrs[i].name;
        s.appendChild(n);
        if (i == 0) n.selected = true;
    }
    if(shwFst)m.showAttr();
}
po.showAttr = function () {
    var m = this, o = m.actO, atrs = o.attributes, s = m._slt, chn = s.children, nm;
    m._AtrN.value = "";
    m._AtrV.value = "";
    for (var i = 0; i < chn.length; i++) {
        if (chn[i].selected) {
            nm = chn[i].innerText;
            m._AtrN.value = nm;
			var vv = o.getAttribute(nm);
            if (vv != null) m._AtrV.value = vv;
            nm = nm.toLowerCase();
            var dsb = (nm == "name" || nm == "id" || nm == "type" || nm == "zqjlf" || nm == "zqjtf" || nm == "zqjvf" || nm == "zqjcf");
            m._AtrN.disabled = dsb || (nm=="tabcf" || nm=="tabvf" || nm=="tablf");
            m._AtrV.disabled = dsb;
            m.setBtn.disabled = dsb;
            m.rmvBtn.disabled = dsb;
            return;
        }
    }
}
po.setAtr = function (rmv) {
	var m = this, o = m.actO, n = m._AtrN.value, v = m._AtrV.value;
	if (o && n) {
		if (m.ctrl && m.ctrl.pushUndo) m.ctrl.pushUndo();
		if (rmv) o.removeAttribute(n);
		else o.setAttribute(n, v);
		m.listAttr();
	}
}
po.removeAttr = function () { this.setAtr(1); }
po.addAtr = function () {
    var m = this;
    m._AtrN.value = ""; m._AtrV.value = "";
    m._AtrN.disabled = 0;
    m._AtrV.disabled = 0;
    m.setBtn.disabled = 0;
    m.rmvBtn.disabled = 0;
}
po.setInText = function (setHtml) {
    var m = this, o = m.actO, txt = setHtml ? m._InHtmlV.value : m._InTextV.value;
    if (lyeHasSysElement(o)) return alert("Object controlled by program disallow this action!");
    if (m.ctrl) m.ctrl.pushUndo();
    if (setHtml) {
        o.innerHTML = txt;
        //m._InTextV.value = o.innerText;
    } else {
        o.innerText = txt;
        m._InHtmlV.value = o.innerHTML;
    }
}
po.setInHtml = function () { return this.setInText(1); }
AttributeEditor._initialized = true;
}
var dg = new DialogInBody("lyoAE", "Attributes", null, null, container);
m.dlgCtrl = dg;
dg.setClient(m.createContents());
}

var i18nText_ColorEditor_en = { ColorAndBorder: "Color & Border", SelBdrStyle: "Please select a border style" , SelColor:"Please select a color", BackColor:"Set Back Color", TextColor:"Set Text Color",
	BorderWdt: "Border-Width", BdrRadius: "Radius", BdrStyle: "Border Style", Top: "Top", Bottom: "Bottom", Left: "Left", Right: "Right", All: "All Border"
};
var i18nText_ColorEditor_zh_TW = { ColorAndBorder: "色彩與框線", SelBdrStyle: "請選擇一種框線樣式", SelColor: "請選擇一種色彩", BackColor: "背景色", TextColor: "文字色",
	BorderWdt: "框線寬度", BdrRadius: "圓角", BdrStyle: "框線樣式", Top: "上", Bottom: "下", Left: "左", Right: "右", All: "全部", LT: "左上", RT: "右上", LB: "左下", RB: "右下"
};


function ColorEditor(src, container) {
    this.handleAfterSetColor = null;
if (ColorEditor._initialized == undefined) {
var po = ColorEditor.prototype;
po.getCells = function (tb) {//把表格的td放入陣列
	return tbGetCells(tb);
}
po.createContents = function () {
	var m = this;
	var dk = "<div style='display:inline-block'>", t1 = "<table cellspacing='1' cellpadding='0' width='100%'>", t2 = "</table>", r1 = "<tr>", r2 = "</tr>";
	var k1 = "<td align='left' valign='top' width='20%'></td>", k2 = r1 + k1 + r2, k3 = k2 + k2;
	var b1 = "<button style='width:100%", b2 = "</button>";
	var o = newEm("div"); o.innerHTML = t1 + k3 + t2; o = o.children[0]; //以1x2空表格為基礎
	o.style.width = "480px";
	o.style.marginRight = "17px";// o.style.marginBottom = "10px";
	var c = m.getCells(o); //第一層表格3格
	c[0][0].innerHTML = t1 + r1 + k1.replace("20%", "55%") + k1 + k1 + r2 + t2;
	k2 = r1 + k1 + k1 + r2; //左邊格50%寬
	c[1][0].innerHTML = t1 + k2 + k2 + k2 + t2;
	var d = m.getCells(c[0][0].children[0]);
	d.cellSpacing = "2px";
	lyeCreateColorTbl(d[0][0]); //左上角是色盤
	m.pal = lyeCreateColorTblSub(d[0][1]); //中上角是副色盤
	m.bdrPal = lyeCreateBorderPal(d[0][2]); //右上角是框線樣式
	var d = m.getCells(c[1][0].children[0]); //各個選項物件
	m.optionArea = c[1][0].children[0];
	var h = "<span rgb='transparent'>Transparent</span> | <span rgb='initial'>initial</span> | <span rgb='inherit'>inherit</span>";
	d[0][0].innerHTML = h; //系統預設

	getTR(d[1][0]).style.backgroundColor = "#e0e0e0";
	//getTR(d[2][0]).style.backgroundColor = "#e0e0e0";
	var h = i18nm.BorderWdt.text + ":<br/>", k4 = dk + "<input name='bdrw' type='radio' class='bdrwC' value='__px' />__px </div>", ls = [0, 1, 2, 3, 4, 5];
	for (var i = 0; i < ls.length; i++) { h += k4.replace(/__/g, ls[i] + ""); }
	h += dk + "<input name='bdrw' type='radio' class='bdrwC'  value='ud' /><input BdrW='Y' type='text' class='bdrwC' value='6px' style='width:30px;' /></div>";
	d[1][0].innerHTML = h; //線寬選項

	var h = i18nm.BdrRadius.text + ":<br/>", k4 = dk + "<input name='bdrr' type='radio' class='bdrrC' value='__px' />__px </div>", ls = [0, 3, 5, 7, 9, 11];
	for (var i = 0; i < ls.length; i++) { h += k4.replace(/__/g, ls[i] + ""); }
	h += dk + "<input name='bdrr' type='radio' class='bdrrC' value='ud' /><input bdrr='Y' type='text' value='13px' class='bdrrC' style='width:30px;' /></div>";
	d[2][0].innerHTML = h; //圓角選項

	d[0][1].innerHTML = ["<button tar='BG'>", i18nm.BackColor.text, b2, "<button tar='FR'>", i18nm.TextColor.text, b2
	, "<span title='set to all selected elements'> <input type='checkbox' />All</span>"].join(""); // 左下是設定顏色的按鈕
	k3 = r1 + k1 + k1 + k1 + r2;
	var bTb = t1 + k3 + k3 + k3 + t2; //以3x3空表格為基礎
	d[1][1].innerHTML = bTb; //中下是框線按鈕
	var cB = m.getCells(d[1][1].children[0]);
	cB[0][1].innerHTML = b1 + "' tar='T'>" + i18nm.Top.text + b2;
	cB[1][0].innerHTML = b1 + "' tar='L'>" + i18nm.Left.text + b2;
	cB[1][1].innerHTML = b1 + "' tar='LTRB'>" + i18nm.All.text + b2; // +"<button style='width:50%;border-radius:9px;' tarr='4'>" + i18nm.All.text + b2;
	cB[1][2].innerHTML = b1 + "' tar='R'>" + i18nm.Right.text + b2;
	cB[2][1].innerHTML = b1 + "' tar='B' title='Bottom border'>" + i18nm.Bottom.text + b2;
	d[2][1].innerHTML = "<div>This is a sample</div>";
	m.ownSample = d[2][1].children[0];
	//	d[2][1].innerHTML = bTb; //右下是圓角按鈕
	//	var cR = m.getCells(d[2][1].children[0]);
	cB[0][0].innerHTML = b1 + ";border-top-left-radius:9px;' tarr='LT'>" + i18nm.LT.text + b2;
	cB[0][2].innerHTML = b1 + ";border-top-right-radius:9px;' tarr='RT'>" + i18nm.RT.text + b2;
	//cR[1][1].innerHTML = b1 + ";border-radius:9px;' tarr='4'>" + i18nm.All.text + "</button>";
	cB[2][0].innerHTML = b1 + ";border-bottom-left-radius:9px;' tarr='LB'>" + i18nm.LB.text + b2;
	cB[2][2].innerHTML = b1 + ";border-bottom-right-radius:9px;' tarr='RB'>" + i18nm.RB.text + b2;

	var er = function () { m.evtHandle.call(m); }
	setEvtHandleAll(o, er);
	m.container = o;
	m.chkSA = getEM(d[0][1], "input")[0];
    //加入 確定 取消 預設按鈕
	var btns = o.appendChild(newEmH(["<div style='display;none'><button act4CO='ok'>", i18nm.OK.text,"</button><button act4CO='default'>Default</button><button act4CO='cancel'>",i18nm.Cancel.text,"</button></div>"].join("")));
	m.okBtns = btns;//預測是隱藏
	return o;
}

po.setActive = function (o) {
	this.actO = o;
	if (this.ownSample) this.ownSample.style.cssText = o.style.cssText;
}
po.setSelection = function (coll) {
	this._se = coll;
	this.chkSA.disabled = coll == null;
}
po.getColor=function(){
	var m=this, a=m.actO; if(!a)return;
	var rgb=a.style.backgroundColor,rgbT=a.style.color,o =m.pkB;
	setColor(o,null,rgb,1);
	setAtr(o,"rgb",rgb);
	o =m.pkT;
	setColor(o,null,rgbT,1);
	setAtr(o,"rgb",rgbT);
}
po.evtHandle = function () {
    var ev = GJT.event(); if (!ev) return; var o = GJT.eventSrc(), ty = ev.type, m=this;
    if (ty == "click") {
        if (getAtr(o, "r")) {
            yeShowPal(this.pal, getAtr(o, "r"), getAtr(o, "g"), getAtr(o, "b"));
			if(this.SubC)this.setSubC(this.SubC);
        }
        if (getAtr(o, "rgb")) this.setSubC(o);
        else if (getAtr(o, "tar")) this.setColor(getAtr(o, "tar"));
        else if (getAtr(o, "bdr")) this.selBdr(o);
        else if (getAtr(o, "gc")) this.getColor(o);
        else if (getAtr(o, "tarr")) this.setRadius(getAtr(o, "tarr"));
        var rr = getAtr(o, "act4CO");
        if (rr == "cancel") {
        } else if (rr == "ok") {
            if (m.handleAfterSetColor) m.handleAfterSetColor(m.actO, cc, m.ctrl);//m.ctrl 是o物件所屬的控制物件
        } else if (rr == "default") {
            if (m.handleAfterSetColor) m.handleAfterSetColor(m.actO, "", m.ctrl);//空字串代表預設
        }
        if (rr) m.dlgCtrl.showMe(1);
    }
    else if (ty == "dblclick") {
        var lsm = this.lastMode;
        if (getAtr(o, "rgb") && lsm) this.setColor(lsm);
        //else if (getAtr(o, "r")) { this.setColor(lsm, o); }
        else if (o.tagName == "TD" && getEM(o, "button").length > 0) {
            var p = o.parentNode;
            if (o.rowIndex == 0) p.appendChild(o);
            else p.insertBefore(o, p.children[0]);
        }
    }
    else if (ty == "mouseover") {
        if (xGetAtr(o, "bdr")) setColor(o, null, "#eedd00");
        if (xGetAtr(o, "rgb") && o.tagName=="SPAN") setColor(o, null, "#eedd00");
    }
    else if (ty == "mouseout") {
        if (xGetAtr(o, "bdr")) restoreColor(o);
        if (xGetAtr(o, "rgb") && o.tagName == "SPAN") restoreColor(o);
    }
}
po.setMainC = function(o) {
    var m = this;
    if (m.MainC) m.MainC.style.border = "";
    o.style.border="1px dotted #000000";
    m.MainC = o;
}
po.setSubC = function (o) {
    var m = this, osc = m.SubC;
    if (osc) {
        //osc.style.border = "1px none #000000";
        //osc.style.marginLeft = "";
        //osc.style.marginRight = "";
    }
    m.SubC = o, cc = getAtr(o,"rgb");//.style.backgroundColor;
    var p2 = getEM(m.bdrPal, "TD");
    for (var i = 0; i < p2.length; i++) {
        p2[i].style.borderColor = cc;
    }
	showIt(m.pntrC);
	window.setTimeout(function(){showBeside(m.pntrC, o);},100);
}
po.selBdr = function (o) {
    var m = this;
    if (m.MainBdr) { m.MainBdr.oriBgC = ""; restoreColor(m.MainBdr); }
    setColor(o, null, "#aadd44");
    o.oriBgC = "#aadd44";
    m.MainBdr = o;
}
po.setRadius = function (mode) {
	var m = this, setAll = m.chkSA.checked;
	var co = [m.actO, m.ownSample], rdi = m.getRadius();
	if (setAll) co = this._se;
	if (m.ctrl && m.ctrl.pushUndo) m.ctrl.pushUndo();
	for (var i = 0; i < co.length; i++) {
		if (!co[i]) continue;
		var s = co[i].style;//, rr = s.borderRadius;
		if (mode == "4") { s.borderRadius = rdi; } // [rdi, rdi, rdi, rdi].join(" "); 
		else {
			//var ra = rr.split(" ");
			//for (var j = ra.length; j < 4; j++) { ra[j] = ra[0]; }
			if (mode == "LT") s.borderTopLeftRadius = rdi;// ra[0] = rdi;
			if (mode == "RT") s.borderTopRightRadius = rdi;// ra[1] = rdi;
			if (mode == "LB") s.borderBottomLeftRadius = rdi; // ra[3] = rdi;
			if (mode == "RB") s.borderBottomRightRadius = rdi;// ra[2] = rdi;
			//s.borderRadius = ra.join(" ");
		}
	}
	if (m.ctrl && m.ctrl.autoPvw) m.ctrl.autoPvw();
}
po.getBdrW = function () {
	var e = getAllByClass(this.container, "bdrwC");
	for (var i = 0; i < e.length; i++) {
		if (e[i].checked) {
			if (e[i].value == "ud") return e[i + 1].value;//最後一個radio 緊接著一個textbox
			else return e[i].value;
		}
	}
}
po.getRadius = function () {
	var e = getAllByClass(this.container, "bdrrC");
	for (var i = 0; i < e.length; i++) {
		if (e[i].checked) {
			if (e[i].value == "ud") return e[i + 1].value; //最後一個radio 緊接著一個textbox
			else return e[i].value;
		}
	}
}
po.selectColor = function (tarO, oriColor, tarCtrl) {//User透過UI選取顏色 tarO 目標物件 ,oriColor原來的顏色 , tarCtrl 目標物件的控制器
    //隱藏不需要的物件,只顯示色盤 及 確定 取消
    var m = this;
    m.setActive(tarO);
    hideIt(m.bdrPal.parentElement); hideIt(m.optionArea);
    //var btns = o.appendChild(newEmH(["<div style='display;none'><button act='OK'>", i18nm.text, "</button><button act='default'>Default</button><button act='cancel'>", i18nm.Cancel, "</button></div>"].join("")));
    showIt(m.okBtns) ;//預測是隱藏

}
po.setColor = function (mode, sur) {
	var m = this, setAll = m.chkSA.checked;
	if (!m.SubC || !mode) return alert(i18nm.SelColor.text);
	if (m.ctrl && m.ctrl.pushUndo) m.ctrl.pushUndo();
	var cc = getAtr(m.SubC, "rgb"); // m.SubC.style.backgroundColor; //("rgb");
	//if (sur) cc = sur.style.backgroundColor;
	var co = [m.actO, m.ownSample];
	if (setAll) co = this._se;
	for (var i = 0; i < co.length; i++) {
		var o = co[i], st = o.style;
		if (mode == "BG") st.backgroundColor = cc;
		else if (mode == "FR") st.color = cc;
		else {
			if (!m.MainBdr) return alert(i18nm.SelBdrStyle.text);
			var bdrw = m.getBdrW(), bdrT = m.MainBdr.style.borderStyle;
			if (bdrT == "inherit") { bdrw = "inherit"; bdrT = "inherit"; cc = "inherit"; }
			if (mode.indexOf("L") > -1) {
				st.borderLeftColor = cc;
				st.borderLeftStyle = bdrT;
				st.borderLeftWidth = bdrw;
			}
			if (mode.indexOf("R") > -1) {
				st.borderRightColor = cc;
				st.borderRightStyle = bdrT;
				st.borderRightWidth = bdrw;
			}
			if (mode.indexOf("T") > -1) {
				st.borderTopColor = cc;
				st.borderTopStyle = bdrT;
				st.borderTopWidth = bdrw;
			}
			if (mode.indexOf("B") > -1) {
				st.borderBottomColor = cc;
				st.borderBottomStyle = bdrT;
				st.borderBottomWidth = bdrw;
			}
		}
	}
	if (m.handleAfterSetColor) m.handleAfterSetColor(m.actO, cc, m.ctrl);//m.ctrl 是o物件所屬的控制物件
	if (m.ctrl && m.ctrl.autoPvw) m.ctrl.autoPvw();
	m.lastMode = mode;
}
ColorEditor._initialized = true;
}
var m = this, dg = new DialogInBody("lyoCE", i18nm.ColorAndBorder.text, null, null, container), rp = newEm("div"), st = rp.style;
m.dlgCtrl = dg;
dg.setClient(m.createContents());
st.width="6px";st.height="16px";st.backgroundColor="red";
hideIt(rp);
m.pntrC = rp;
dg.main.appendChild(rp);
}


function lyeHasSysElement(o) {
    return (getChiHasAtr(o, "zqjlf") || getChiHasAtr(o, "zqjvf") || getChiHasAtr(o, "zqjcf") || lyeGetSafeO(o,1));
}
function lyeGetSafeO(o, exact) {
    var p = o;
    while (p && !getAtr(p, "zqjlf") && !getAtr(p, "zqjvf")) {
        p = p.parentNode;
    }
    if (p) return p;
    if (!exact) return o;
}
function leyGetChoiceO(o, exact) {
    var p = o;
    while (p && !getAtr(p, "zqjcf")) {
        p = p.parentNode;
    }
    if (p) return p;
    if (!exact) return o;
}



function lyeCreateColorTbl(container) {
    var o = container;
    var tb = o.appendChild(newEm("TABLE"));
    tb.setAttribute("style", "width:100%;height:100%;cursor:default;");
    tb.setAttribute("cellspacing", "1");
    tb.setAttribute("border", "0");
    t = tb.appendChild(newEm("TBODY"));
    for (var r = 0; r < 256; r += 37) {
        var tr = t.appendChild(newEm("TR"));
        tr.style.height = "16px";
        for (var g = 0; g < 256; g += 37) {
			//if (g>255)g=255;
            var td = tr.appendChild(newEm("TD")),rgb="rgb(" + r + "," + g + ",0)";
            td.style.backgroundColor = rgb;
            td.style.width = "16px";
            td.setAttribute("r", r);
            td.setAttribute("g", g);
            td.setAttribute("b", "0");
            td.setAttribute("rgb", rgb);
        }
    }
    for (var r = 0; r < 256; r += 37) {
        var tr = t.appendChild(newEm("TR"));
        tr.style.height = "16px";
        for (var b = 0; b < 256; b += 37) {
            var td = tr.appendChild(newEm("TD")), rgb ="rgb(" + r + ",0," + b + ")";
            td.style.backgroundColor = rgb;
            td.style.width = "16px";
            td.setAttribute("r", r);
            td.setAttribute("g", "0");
            td.setAttribute("b", b);
            td.setAttribute("rgb", rgb);
        }
    }
    for (var g = 0; g < 256; g += 37) {
        var tr = t.appendChild(newEm("TR"));
        tr.style.height = "16px";
        for (var b = 0; b < 256; b += 37) {
            var td = tr.appendChild(newEm("TD")), rgb="rgb(0," + g + "," + b + ")";
            td.style.backgroundColor = rgb;
            td.style.width = "16px";
            td.setAttribute("r", "0");
            td.setAttribute("g", g);
            td.setAttribute("b", b);
            td.setAttribute("rgb", rgb);
        }
    }
    return tb;
}
function lyeCreateColorTblSub(container) {
    var o = container;
    var tb = o.appendChild(newEm("TABLE"));
    tb.setAttribute("style", "width:100%;height:100%;cursor:default;");
    tb.setAttribute("cellspacing", "1");
	tb.style.backgroundColor = "#ffffff";
    t = tb.appendChild(newEm("TBODY"));
    for (var r = 0; r < 21; r ++) {
        var tr = t.appendChild(newEm("TR"));
        tr.style.height = "16px";
        var td = tr.appendChild(newEm("TD"));
    }
    yeShowPal(tb, 0, 0, 0);
    return tb;
}
function yeShowPal(pal, r, g, b) {//$grayLevel = $R * 0.299 + $G * 0.587 + $B * 0.114;
    var r = parseInt(r, 10), g = parseInt(g, 10), b = parseInt(b, 10);
    var u = pal.rows.length, n = (u-1) / 2;
	var stpR = r/n, stpG = g/n, stpB = b/n;
	var stpR2 = (255-r)/n, stpG2 = (255-g)/n, stpB2 = (255-b)/n;
    for (var i = 0; i < u; i++) {
        var nr = r + stpR * (i-n), ng = g + stpG * (i-n), nb = b + stpB * (i-n);
		if (i== n) {nr=r;ng=g;nb=b;}
		else if (i > n){nr = r + stpR2 * (i-n), ng = g + stpG2 * (i-n), nb = b + stpB2 * (i-n);}
		nr=parseInt(nr,10);ng=parseInt(ng,10);nb=parseInt(nb,10);
        if (nr < 0) nr = 0; else if (nr > 255) nr = 255;
        if (ng < 0) ng = 0; else if (ng > 255) ng = 255;
        if (nb < 0) nb = 0; else if (nb > 255) nb = 255;
        var rgb = "rgb(" + nr + "," + ng + "," + nb + ")", td = pal.rows[i].cells[0];
        td.style.backgroundColor = rgb;
        td.setAttribute("rgb",rgb);
        td.title = rgb;
		//td.innerText = "  ";
    }
}
function yeShowPalOld(pal, r, g, b) {//$grayLevel = $R * 0.299 + $G * 0.587 + $B * 0.114;
    var r = parseInt(r, 10), g = parseInt(g, 10), b = parseInt(b, 10);
    var u = pal.rows.length, stp = Math.ceil(256 / u)+1, stp2 = Math.ceil(stp / 2);
    var sr = r - stp2, sg = g - stp2, sb = b - stp2;
    for (var i = 0; i < u; i++) {
        var nr = sr + stp * i, ng = sg + stp * i, nb = sb + stp * i;
        if (nr < 0) nr = 0; else if (nr > 255) nr = 255;
        if (ng < 0) ng = 0; else if (ng > 255) ng = 255;
        if (nb < 0) nb = 0; else if (nb > 255) nb = 255;
        var rgb = "rgb(" + nr + "," + ng + "," + nb + ")", td = pal.rows[i].cells[0];
        td.style.backgroundColor = rgb;
        td.setAttribute("rgb",rgb);
        //td.innerText = rgb;
    }
}
function lyeCreateBorderPal(cntr) {
    var o = cntr;
    var tb = newEm("TABLE");
    tb.setAttribute("style", "width:100%;height:100%;cursor:default;");
    tb.setAttribute("cellspacing", "1");
    t = tb.appendChild(newEm("TBODY"));
    var tp = [
    "outset: Defines a 3D  outset border. The effect depends on the border-color value",
    "inset: Defines a 3D inset border. The effect depends on the border-color value",
    "ridge: Defines a 3D ridged border. The effect depends on the border-color value",
    "groove: Defines a 3D grooved border. The effect depends on the border-color value",
    "double: Defines two borders. The width of the two borders are the same as the border-width value",
    "solid: Defines a solid border",
    "dashed: Defines a dashed border",
    "dotted: Defines a dotted border",
    "none: Defines no border",
	"inherit: Inherit"
    ];
    var tr = t.appendChild(newEm("TR"));
    var td = tr.appendChild(newEm("TD")); td.innerText = i18nm.BdrStyle.text;
    for (var r = 0; r < tp.length; r++) {
        var tr = t.appendChild(newEm("TR"));
        tr.style.height = "24px";
        var td = tr.appendChild(newEm("TD")), nn = tp[r].split(":"), st=td.style;
        td.title = nn[1];
        td.setAttribute("bdr", "Y");
        td.setAttribute("style", "text-align:center;");
        td.innerText = nn[0];
        st.borderStyle = nn[0];
        st.borderWidth = "3px";
    }
    if (o.children.length == 0) o.appendChild(tb); else o.insertBefore(tb, o.children[0]);
    return tb;
}
function lyeReviseCtn(o){
    var orv = getAtr(o, "oriVal");if(!orv) return o;
    var b=newEm("div");b.innerHTML = orv;b=b.children[0];
    //check if obj in o not exist in b, then put the object into b
    var tabco = collEmHasAtr(o, "tabcf", null, null, 1); //one level only
    var pgco = collEmHasAtr(o, "xctnr4", null, null, 1);
    if (tabco.length > 0) {
    	for (var i = 0; i < tabco.length; i++) {
    		var tc = tabco[i], myId = getAtr(tc, "tabcf"), tcb = getChiHasAtr(b, "tabcf", myId);
    		if (!tcb) b.appendChild(tc);
    		var chn = tc.children;
    		for (var j = 0; j < chn.length; j++) {
    			var ch = chn[j], id2 = getAtr(ch, "tablf"); if (!id2) continue;
    			if (tcb) {
    				var b2 = getChiHasAtr(tcb, "tablf", id2);
    				if (!b2) { tcb.appendChild(ch); j--; }
    			}
    			var co = getChiHasAtr(o, "tabvf", id2), cob = getChiHasAtr(b, "tabvf", id2);
    			if (!cob) b.appendChild(co); else lyeReviseCtn1(co, cob, lyeRvGetTbd(cob));
    		}
    	}
    }
    else if (pgco.length > 0) {
    	//page layout
    	for (var i = 0; i < pgco.length; i++) {
    		var tc = pgco[i], myId = getAtr(tc, "xctnr4");
    		if (!getChiHasAtr(b, "xctnr4", myId)) b.appendChild(tc);
		}
    }
    else lyeReviseCtn1(o, b, lyeRvGetTbd(b));
    return b;
}
function lyeRvGetTbd(b){
	var tbl=b.getElementsByTagName("tbody")[0];
	if(!tbl)tbl=b.getElementsByTagName("table")[0];
	if(!tbl)return;
	var rws=tbl.rows,mxc=0;
	for(var i=0;i < rws.length;i++) {h=rws[i].children.length;
		if(mxc <h) mxc=h;
	}
	tbl._mxc=mxc;
	return tbl;
}
function lyeRvApnd(b,ch,tbl,lbl){
	if(tbl){
		var ntr=tbl.ntr;
		if(!ntr){ntr = tbl.rows[0].parentNode.appendChild(newEm("tr"));tbl.ntr =ntr;}
		var td=ntr.appendChild(newEm("td"));
		if(lbl)td.style.textAlign="right";
		td.appendChild(ch);
		if(ntr.children.length >= tbl._mxc) delete tbl.ntr;
	}
	else b.appendChild(ch);
}
function lyeReviseCtn1(o, b,tbl) {
    var chn = o.children;
    for(var i=0;i < chn.length;i++) {
        var ch=chn[i],lf=ch.getAttribute("zqjlf"), vf=ch.getAttribute("zqjvf"), cf=ch.getAttribute("zqjcf");
        if(lf) {
            var b2=lyeGetON(b,"zqjlf",lf);
            if (!b2) {lyeRvApnd(b,ch,tbl,1);i--;}
        } else if (vf){
            var b2=lyeGetON(b,"zqjvf",vf);
            if (!b2) {lyeRvApnd(b,ch,tbl);i--;}
            else {
                //revise choice
                lyeReviseCtn1(ch, b2);
            }
        } else if (cf){
            var b2=lyeGetON(b,"zqjcf",cf);
            if (!b2) {b.appendChild(ch);i--;}
        }
        else lyeReviseCtn1(ch, b,tbl);
    }
}
function lyeGetON(b,atrNm,atrV){
    var chn=b.children, nl=chn.length;
    for(var i=0;i<nl;i++) {
        var ch=chn[i],v=ch.getAttribute(atrNm);
        if(v == atrV) return ch;
        var b2 = lyeGetON(ch,atrNm,atrV);
        if (b2) return b2;
    }
}

function ViewsRelationDesigner(src, opRelas, itmsView, container) {
	this.opRelas = opRelas;
	if (ViewsRelationDesigner._initialized == undefined) {
		var po = ViewsRelationDesigner.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<table style='width:99%;'><tr><td><button title='add a new relation for views'>New Rela</button><br><button title='delete current relation'>Del Rela</button></td><td>Relations<br><select style='width:100%'></select></td></tr>"
			, "<tr><td><button style='width:18px;'>上移</button><button style='width:18px;'>下移</button></td><td>Name:<input type='text' isName='Y' /></td></tr>"
			, "<tr><td align='right'>Caption:</td><td><input type='text' isText='Y' style='width:98%' /></td></tr>"
			, "<tr><td align='right'>Caption (Reverse):</td><td><input type='text' isTextRev='Y' style='width:98%' /></td></tr>"
			, "<tr><td align='right'>Tip:</td><td><input type='text' isTip='Y' style='width:98%' /></td></tr>"
			, "<tr><td align='right'>Note</td><td><textarea isNote='Y' style='width:98%;min-height:36px;' ></textarea></td></tr>"
			, "<tr><td align='right' title='文字物件名稱,用於多語系自動轉換文字'>Text Obj Name:</td><td><input type='text' isTextName='Y' style='width:98%' /></td></tr>"
			, "<tr><td align='right' title='文字物件名稱,用於多語系自動轉換反向展開的文字'>Text Obj Name Rev:</td><td><input type='text' isTextNameRev='Y' style='width:98%' /></td></tr>"
			, "<tr><td><button>From</button></td><td isF='Y'></td></tr>"
			, "<tr><td><button>From Fields</button></td><td isFF='Y'></td></tr>"
			, "<tr><td><button>To</button></td><td isT='Y'></td></tr>"
			, "<tr><td><button>To Fields</button></td><td isTF='Y'></td></tr>"
            , "<tr><td><button>Fields make Anchor</button></td><td isFA='Y'></td></tr>"
            , "<tr><td align='right'>Style of Anchor:</td><td><input type='text' isFASTL='Y' /></td></tr>"
			, "<tr><td align='right'>Filter:</td><td><input type='text' isFilter='Y' /></td></tr>"
			, "<tr><td align='right' title='設定一起作用的其他關連設定,輸入關聯名稱,以逗號隔開'>同夥的關聯設定</td><td><input type='text' isRelaAssm='Y' /></td></tr>"
            , "<tr><td align='right'>Style of Button:</td><td><input type='text' isBTNSTL='Y' /></td></tr>"
			, "<tr><td colspan='2' isOptn='Y'>Options:</td></tr>"
			, "<tr><td><button>Copy Rela</button></td><td></td></tr>"
			, "<tr><td><button>Save</button></td><td><button>Preview</button><button title='Release design to user'>Release</button></td></tr>"
			, "</table>"]; //
			o.innerHTML = h.join("");
			o = o.children[0];
			m.cntr = o;
			var evh = m.evtHnd, er = function () { evh.call(m); };
			setEvtHandleAll(o, er);
			var b = getEM(o, "button"), s = getEM(o, "select"), s1 = s[0], itms = m.itms;
			s1.onchange = function () { m.setActiveRela.call(m); };
			m.nameO = getChiHasAtr(o, "isName", "Y"); m.textO = getChiHasAtr(o, "isText", "Y"); m.textRevO = getChiHasAtr(o, "isTextRev", "Y"); m.textNameO = getChiHasAtr(o, "isTextName", "Y");
			m.filterO = getChiHasAtr(o, "isFilter", "Y"); m.relaAssmO = getChiHasAtr(o, "isRelaAssm", "Y");m.noteO = getChiHasAtr(o, "isNote", "Y");m.textNameRevO = getChiHasAtr(o, "isTextNameRev", "Y");
			m.nameO.onchange = er; m.textO.onchange = er; m.textRevO.onchange = er; m.textNameO.onchange = er;m.textNameRevO.onchange = er;m.noteO.onchange = er; m.filterO.onchange = er; m.relaAssmO.onchange = er;
			m.FO = getChiHasAtr(o, "isF", "Y"); m.TO = getChiHasAtr(o, "isT", "Y");
			m.FFO = getChiHasAtr(o, "isFF", "Y"); m.TFO = getChiHasAtr(o, "isTF", "Y");
			m.FAO = getChiHasAtr(o, "isFA", "Y");
			m.FASTLO = getChiHasAtr(o, "isFASTL", "Y"); m.FASTLO.onchange = er;
			m.BTNSTLO = getChiHasAtr(o, "isBTNSTL", "Y"); m.BTNSTLO.onchange = er;
            m.tipO=getChiHasAtr(o, "isTip", "Y");m.tipO.onchange = er;
			var tdOptn = getChiHasAtr(o, "isOptn", "Y"), opn = [[GLC.Disabled, "Disable"], [GLC.Hidden, "Hidden"], [GLC.KeepSync, "Keep Sync", "Refresh detail view immediately when Master (From Side) change row"]
			,[GLC.OneWayLink, "One way expand", "Allow expand one way (To side) only"], [GLC.SingleMaster, "Single Master", "Only expand one Master (From Side) row one time"]
			, [GLC.SetLinkForNewRow, "Set Link For New Row", "Auto set link value when insert new row into TO side object"]
			, [GLC.IgnoreLinkFail, "Ignore Link Fail of New Row", "新資料關聯建立失敗時不中斷"]
			, [GLC.LoosenLink, "Loosen Link", "Allow no link for TO side object"], [GLC.DblClickToShow, "Dbl Click To Show", "Allow user show detail by double click master grid."]
			, [GLC.ActivateAftShowed, "Activate After Showed", "Activate After Showed"], [GLC.SyncParameters, "更新參數值", "把From端的條件顯示到To端的查詢參數區內"]
			, [GLC.NoPaging, "展開時不分頁", "展開關聯資料時不使用分頁模式,直接顯示所有資料"], [GLC.BypassHiddenObject, "隱藏的物件不展開", "展開關聯資料時如果目標物件是隱藏的就不展開"]
            , [GLC.CaptionExclusive, "單獨顯示按鈕", "單獨按鈕直接顯示設定的標題(Caption)"], [GLC.ForAddNewRelativeRow, "用於新增關聯紀錄", "展開時只會自動新增關聯的新資料列,設定關聯值,不會查詢關聯物件的關聯資料"]
            , [GLC.ForModifyRelative, "用於修改關聯物件的資料", "展開時只會修改關聯物件的選取資料列,設定關聯值,不會查詢關聯物件的關聯資料"]
            , [GLC.AutoSearchMatch, "自動找尋匹配的資料", "修改關聯物件的資料時,自動從關聯物件被選取的資料內使用關聯欄位值比對找尋匹配的資料"]
            , [GLC.OverwriteBlankOnly, "只覆寫空白的資料", "修改關聯物件的資料時,只覆寫空白的資料"]
            , [GLC.AllMaster, "All Master", "Expand All Master (From Side) rows one time"], [GLC.AutoShowAfterSave, "Auto Show After Save", "存檔後自動顯示"]
            , [GLC.RemoveRelativeRows, "清除關聯的舊資料", "展開前先將目標物件畫面上的舊資料清除"]
            , [GLC.NoExpandAll , "只能獨立執行", "不可與其他關聯設定一起執行"]
            , [GLC.AllowNewMast, "允許主檔(From端)未存檔時展開明細(To端)"]
            , [GLC.IgnorePrivilege, "忽略權限限制,可強制執行"]
            , [GLC.NoEditLog, "不產生異動旗標"]
            , [GLC.NoEvent, "不觸發異動事件"], [GLC.PendingQuery, "由使用者手動查詢", "只傳遞參數不要自動執行查詢,而是由使用者自己執行查詢"]
            , [GLC.ClearNoUsedParameters, "以空值傳送沒有用到的參數", "傳遞參數時將本方沒有的參數以空值傳送"]
            , [GLC.ExpandAfterQuery, "資料更新/查詢後自動展開關聯"]
			]; //GLC.Independent,"Independent", GLC.LinkSub, "LinkSub", GLC.External,"External", [GLC.LoosenLink, "LoosenLink"],
			for (var i = 0; i < opn.length; i++) {
				//if (i > 0) tdOptn.appendChild(newEm("br"));
				var n = tdOptn.appendChild(newEmH("<div><input type='checkbox' value='" + opn[i][0] + "' /></div>"));
				n.appendChild(document.createTextNode(opn[i][1]));
				if (opn[i][2]) n.title = opn[i][2];
				n.style.display = "inline-block"; n.style.marginRight = "10px";
			}
			m.selRela = s1;
			m.cntrOPN = tdOptn;
			if (m.opRelas) {
				for (var i = 0; i < m.opRelas.length; i++) {
					m.addRela(m.opRelas[i]);
				}
			}
			for (var i = 0; i < b.length-2; i++) { b[i].style.width = (i==2 || i==3) ? "50%" : "100%"; }
			b[0].onclick = function () { m.addRela.call(m); }
			b[1].onclick = function () { m.delRela.call(m); }
			b[2].onclick = function () { m.moveRela.call(m,-1); }
			b[3].onclick = function () { m.moveRela.call(m,1); }
			b[4].onclick = function () { m.setFTable.call(m); }
			b[5].onclick = function () { m.setFromFields.call(m); }
			b[6].onclick = function () { m.setTo.call(m); }
			b[7].onclick = function () { m.setToFields.call(m); }
			b[8].onclick = function () { m.setFieldsForAnchor.call(m); }
			b[9].onclick = function () { m.copyRela.call(m); }
			b[10].onclick = function () { m.saveDesign.call(m); }
			b[11].onclick = function () { m.previewDesign.call(m); }
			b[12].onclick = function () { m.releaseDesign.call(m); }
			return o;
		}
		po.setActiveRela = function (){
			var m=this, s=m.selRela,chn=s.children;
			m.actRela = null;m.actRelaN = null;
			for(var i = 0;i < chn.length;i++){
				if(chn[i].selected){
					m.actRela = chn[i].sur;
					m.actRelaN =chn[i];
				}
			}
			m.showRelaInfo();
		}
		po.rvsTextInSEL = function (r, rO) { rO.innerText = r.name +"(" + r.text + ")"; }
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, r = m.actRela, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "change") {
				if (!r) return alert("Please add relation before any action!");
				if (o == m.nameO && r) {
					r.name = o.value;
					//m.actRelaN.innerText = r.name;
				}
				else if (o == m.textO && r) { r.text = o.value; m.rvsTextInSEL(r, m.actRelaN); } // m.actRelaN.innerText = r.text;
				else if (o == m.tipO && r) { r.tip = o.value; }
				else if (o == m.textRevO && r) r.textRev = o.value;
				else if (o == m.textNameO && r) { r.textName = o.value; }
				else if (o == m.textNameRevO && r) { r.textNameRev = o.value; }
				else if (o == m.noteO && r) r.noteX = o.value;
				else if (o == m.filterO && r) r.filter = o.value;
				else if (o == m.relaAssmO && r) r.relaAssm = o.value;
				else if (o == m.FASTLO && r) r.styleForAnchor = o.value;
				else if (o == m.BTNSTLO && r) r.styleForButton = o.value;
			}
			else if (ty == "click" && o.type == "checkbox") {
				if (!r) return alert("Please add relation before any action!");
				var v = o.value, lm = r.linkMode;
				if (o.checked) lm = lm | v;
				else lm = (lm | v) ^ v;
				r.linkMode = lm;
			}
		}
		po.showRelaInfo = function (myRela) {
			var m = this, r = myRela, ns = getEM(m.cntrOPN, "input"), lm = 0;
			if (!r) r = m.actRela;
			if (r) {
			  m.nameO.value = r.name; m.textO.value = r.text; m.noteO.value = r.noteX ? r.noteX : "";
              m.tipO.value=r.tip ? r.tip : "";
              m.textRevO.value = r.textRev ? r.textRev : "";
              m.textNameO.value = r.textName ? r.textName : "";
              m.textNameRevO.value = r.textNameRev ? r.textNameRev : "";
			  m.FO.innerText = r.from ? r.from.text : "";
			  m.TO.innerText = r.to ? r.to.text : "";
			  m.FFO.innerText = r.fromFields ? r.fromFields.getNames(",", 0, 0, 1) : "";
			  m.TFO.innerText = r.toFields ? r.toFields.getNames(",", 0, 0, 1) : "";
			  m.FAO.innerText = r.fieldsForAnchor ? r.fieldsForAnchor.getNames(",", 0, 0, 1) : "";
			  m.FASTLO.value = r.styleForAnchor ? r.styleForAnchor : "";
			  m.BTNSTLO.value = r.styleForButton ? r.styleForButton : "";
			  m.filterO.value = (r.filter ? r.filter : "");
			  m.relaAssmO.value = (r.relaAssm ? r.relaAssm : "");
			  lm = r.linkMode;
			}
			else {
				m.nameO.value = ""; m.textO.value = ""; m.noteO.value = ""; m.textRevO.value = "";m.textNameO.value = "";m.textNameRevO.value = "";
				m.FO.innerText = ""; m.TO.innerText = "";
				m.FFO.innerText = ""; m.TFO.innerText = ""; m.FAO.innerText = ""; m.FASTLO.value = ""; m.BTNSTLO.value = "";
				m.filterO.value = ""; m.relaAssmO.value = "";
                m.tipO.value="";
				lm = 0;
			}
			for (var i = 0; i < ns.length; i++) {
				ns[i].checked = ((ns[i].value & lm) == ns[i].value);
			}
		}
		po.addRela = function(myRela){
			var m=this, s=m.selRela, ro = myRela;
			if(!ro) ro = new opRela();
			var o=s.appendChild(newEm("option"));
			o.sur = ro;
			//o.innerText = ro.text;
			m.rvsTextInSEL(ro, o);
			o.selected = true;
			m.setActiveRela();
			//m.showRelaInfo(ro);
			//o.selected
		}
		po.copyRela = function () {
			var m = this, r = m.actRela; if (!r) return;
			m.addRela(); var nr = m.actRela;
			nr.name = r.name + "?";
			nr.text = r.text + "?";
			nr.tip = r.tip + "?";
			nr.from = r.from;
			nr.to = r.to;
			nr.fromFields = r.fromFields.clone();
			nr.toFields = r.toFields.clone();
			nr.fieldsForAnchor = r.fieldsForAnchor.clone();
			nr.styleForAnchor = r.styleForAnchor;
			nr.styleForButton = r.styleForButton;
			nr.filter = r.filter;
			nr.relaAssm = r.relaAssm;
			nr.linkMode = r.linkMode;
			m.actRelaN.innerText = nr.text;
			m.showRelaInfo(nr);
		}
		po.delRela=function(){
			var m=this, ro = m.actRelaN;
			if (!ro)return;
			if(!window.confirm("This will delete current relation. Please confirm this")) return;
			var s=m.selRela,chn=s.children;
			ro.parentNode.removeChild(ro);
			if (chn.length > 0) {
				chn[0].selected = true;
			}
			this.setActiveRela();
		}
		po.moveRela = function (step) {
			var m = this, ro = m.actRelaN;
			if (!ro) return;
			if (step < 0) {
				var pb = ro.previousSibling;
				if (!pb) return;
				ro.parentNode.insertBefore(ro, pb);
			}
			else {
				var pb = ro.nextSibling;
				if (!pb) return;
				ro.parentNode.insertBefore(pb,ro);
			}
		}
		po.setFTable = function(setTo){
			var m=this,itms=m.itms;
			itms.tar = m; itms.setTo = setTo;
			//itms.onclick = m.prcsSetO;
			SysShowMenu(itms, m.prcsSetO);
		}
		po.setTo = function(){return this.setFTable(1);}
		po.prcsSetO = function (itm, itms){
			var m=itms.tar,r=m.actRela;
			if(!r){m.addRela();r=m.actRela;}
			if (itms.setTo)  r.to = itm; else r.from = itm;
			m.showRelaInfo();
		}
		po.setFromFields = function (setTo) {
			var m = this, r = m.actRela, itm = setTo ==1 ? r.to : r.from;
			if (!itm) return alert("Please set from/to side object before set link fields!");
			var itms = setTo == 1 && itm.getQryParamters ? itm.getQryParamters() : null, flds = setTo == 1 ? r.toFields : (setTo == 2 ? r.fieldsForAnchor : r.fromFields);
			if (!itms) itms = itm.fieldsAll;
			if (!itms) return alert("Select item has not any fields defined!");
			var so = selItems("selFlds", "Select link fields", itms, flds, null, null, m.prcsSetFlds, 1, 1,1); //name,text, itmsAll, itmsSel, width, height, handleDone, shwAllItems
			so.tarObj = m; so.setTo = setTo;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.setToFields = function () { this.setFromFields(1); }
		po.setFieldsForAnchor = function () { this.setFromFields(2); }
		po.prcsSetFlds = function (selector){
			var so=selector, m=so.tarObj,r=m.actRela,itmsSel =so.itemsSelected;
			if (so.setTo==1) {
			    r.toFields = itmsSel;
			} else if (so.setTo == 2) {
			    r.fieldsForAnchor = itmsSel;
			} else {
				r.fromFields = itmsSel;
			}
			m.showRelaInfo();
		}
		po.saveDesign = function (channel) {
			var m = this, res = m.collDesign(); if (!res) return;
			if (channel == null) channel = m.channel;
			if (m.saveHandle) m.saveHandle(res, m.ctrl, channel);
		}
		po.collDesign = function () {
			var m = this, s = m.selRela, chn = s.children, res=[];
			for (var i = 0; i < chn.length; i++) {
				var r = chn[i].sur;
				if ((!r.from || !r.to) && !r.relaAssm) return alert("Both side object of relation must be specified!");
				if (!r.toFields || !r.fromFields) return alert("Relation fields not set correctly!");
				if (r.toFields.length != r.fromFields.length) return alert("Both From fields and To fields must have same count!");
				//if (!res) res = [];
				res.push(chn[i].sur);
			}
			return res;
		}
		po.releaseDesign = function(){
			if (window.confirm("You are going to release current design to users. This will effect all users. Plese confirm this."))
				this.saveDesign(this.UserChannelId);
		}
		po.previewDesign = function () {
			var m = this, res = m.collDesign(); if (!res) return;
			if (m.previewHandle) m.previewHandle(res, m.ctrl);
		}
		po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
		ViewsRelationDesigner._initialized = true;
	}
	var m = this, dg = new DialogInBody("VRDNR", "Relations Designer", 450, null, container);
	m.relas = GJT.xmlDocument();
	m.itms=itmsView.clone();
	m.ctrl=src;
	dg.handleClose = function () { return m.evtCloseDlg.call(m); }
	m.dlgCtrl = dg;
	dg.setClient(m.createContents());
}

function TreeViewDesigner(src, channel, container) {
    this.useXmlDoc = 1;
	if (TreeViewDesigner._initialized == undefined) {
		var po = TreeViewDesigner.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<table width='100%' cellpadding='0' cellspacing='2'>"];
			if (m.fieldsO) h.push("<tr bgcolor='#dddddd'><td title='Click below button to setup fields for each properties'>Object Fields</td><td></td></tr>"
			, "<tr><td><button mth='oidf'>Object Id</button></td><td></td></tr>"
			, "<tr><td><button mth='otxtf'>Object Node Text</button></td><td></td></tr>"
			, "<tr><td><button mth='otipf'>Object Node Tip</button></td><td></td></tr>"
			, "<tr><td><button mth='otf'>Object Catalog</button></td><td></td></tr>"
			, "<tr><td><button mth='opidf'>Parent Object Id</button></td><td></td></tr>"
			, "<tr><td><button mth='optyf'>Object Properties</button></td><td></td></tr>"
			, "<tr><td><button mth='osortf'>Object Sort By</button></td><td></td></tr>"
			, "<tr><td><button mth='osortfd'>Object Sort Desc</button></td><td></td></tr>"
            , "<tr><td><button mth='oseqip'>Object Sequence in Parent</button></td><td></td></tr>"
			, "<tr><td>Object Filter (Effect All)</td><td><input type='text' value='' otfta='Y' style='width:99%'/></td></tr>"
			, "<tr><td>Default Object Filter</td><td><input type='text' value='' otft='Y' style='width:99%'/></td></tr>"
			, "<tr><td><input type='checkbox' chkExpTD='Y' checked='checked' />Expand Down</td><td><input type='checkbox' chkExpDT='Y' />Expand Up</td></tr>"
			);
			if (m.fieldsR) h.push("<tr bgcolor='#dddddd'><td title='Click below button to setup fields for each properties'>Relation Fields</td><td></td></tr>"
			, "<tr><td><button mthR='ridf'>Relation Id</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtxtf'>Relation Text</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtxtff'>Node Text From</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtipff'>Node Tip From</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtxttf'>Node Text To</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtiptf'>Node Tip To</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtf'>Relation Catalog</button></td><td></td></tr>"
			, "<tr><td><button mthR='rfidf'>Relation From Id</button></td><td></td></tr>"
			, "<tr><td><button mthR='rtidf'>Relation To Id</button></td><td></td></tr>"
			, "<tr><td><button mthR='rptyf'>Relation Properties</button></td><td></td></tr>"
			, "<tr><td><button mthR='rsortf'>Object Sort By</button></td><td></td></tr>"
			, "<tr><td><button mthR='rsortfd'>Object Sort Desc</button></td><td></td></tr>"
			, "<tr><td>Relation Filter (Effect All)</td><td><input type='text' rtfta='Y' value='' style='width:99%'/></td></tr>"
			, "<tr><td>Default Relation Filter</td><td><input type='text' rtft='Y' value='' style='width:99%'/></td></tr>"
			, "<tr><td><input type='checkbox' chkExpF='Y' checked='checked' />Expand Forward<br/><input type='checkbox' chkExpB='Y' />Expand Backward</td><td></td></tr>"
			);
			if (m.fieldsO || m.fieldsR) {
				h.push("<tr><td>Delimiter for fields</td><td><input type='text' dlmf='Y' value=' ' style='width:100px'/></td></tr>");
				h.push("<tr><td colspan='2'><input type='checkbox' chkigrt='Y' checked='checked' />Ignore Repeat Text");
				h.push(" <input type='checkbox' chkaenp='Y' checked='checked' />Allow Edit Node");
				h.push(" <input type='checkbox' chkacnp='Y' checked='checked' />Allow Change Parent");
				h.push(" <input type='checkbox' chkamns='Y' checked='checked' />Allow Move Node</td><td></td></tr>");
				h.push("<tr><td colspan='2'><button act='save'>Save</button><button title='Release design to user' act='release'>Release</button></td></tr>");
			}
			else h.push("<tr><td colspan='2'>No Views for object/relation defined</td></tr>");
			h.push("</table>");
			o.innerHTML = h.join("");
			o = o.children[0];
			m.cntr = o;
			m.fltO = getChiHasAtr(o, "otft");
			m.fltR = getChiHasAtr(o, "rtft");
			m.fltOA = getChiHasAtr(o, "otfta");
			m.fltRA = getChiHasAtr(o, "rtfta");
			m.dlmrO = getChiHasAtr(o, "dlmf");
			var evh = m.evtHnd, er = function () { evh.call(m); };
			setEvtHandleAll(o, er);
			return o;
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "click") {
				var mth = xGetAtr(o, "mth");
				if (mth) return m.setFields(mth,0,o.innerText);
				var mth = xGetAtr(o, "mthR");
				if (mth) return m.setFields(mth, 1, o.innerText);
				var act = xGetAtr(o, "act");
				if (act == "save") m.saveDesign();
				if (act == "preview") m.previewDesign();
				if (act == "release") m.releaseDesign();
			}
		}
		po.setFields = function (mth, forRela, cptn) {
			var m = this;
			var itms = m.fieldsO, flds = m[mth];
			if (forRela) itms = m.fieldsR;
			if (!itms) return alert("Selected item has not any fields defined!");
			if (!flds) {
				var f = xGetAtr(m.resO, mth);
				if (f) flds = itms.collect(f); else flds = new OpItems();
			}
			var so = selItems("selFlds", "Select " + cptn + " fields", itms, flds, null, 600, m.prcsSetFlds, 1, 1,1); //name,text, itmsAll, itmsSel, width, height, handleDone, shwAllItems
			so.tarObj = m; so.mth = mth;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
			showInCenter(dg);
		}
		po.prcsSetFlds = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected;
			m[so.mth] = itmsSel;
			m.showSel(so.mth, itmsSel);
		}
		po.saveDesign = function (channel) {
			var m = this, res = m.collDesign(); if (!res) return;
			if (!m.vlidateDgn(res) && m.UserChannelId == channel) return;
			if (channel == null) channel = m.channel;
			if (m.saveHandle) m.saveHandle(res, m.ctrl, channel);
		}
		po.vlidateDgn = function () {
			var res = this.resO, fsOid = xGetAtr(res, "oidf"), sfPid = xGetAtr(res, "opidf"), sfRFid = xGetAtr(res, "rfidf"), sfRTid = xGetAtr(res, "rtidf"), er = 0;
			//if ((fsOid && !sfPid) || (!fsOid && sfPid)) er = 1;
			if ((sfRFid && !sfRTid) || (!sfRFid && sfRTid)) er = 1;
			if ((fsOid && sfPid) && (fsOid.split(",").length != sfPid.split(",").length)) er = 1;
			if ((sfRFid && sfRTid) && (sfRFid.split(",").length != sfRTid.split(",").length)) er = 1;
			if ((fsOid && sfRFid) && (fsOid.split(",").length != sfRFid.split(",").length)) er = 1;
			if (er) {
				alert("Invalid design! Please note that fields count of object id, parent id must be same. Fields count of relation from id and to id also must be same as object id if specified!");
				return;
			}
			return 1;
		}
		po.collDesign = function () {
			var m = this, res = m.resO, es = m.getMths(), ns = m.getChks(),operOptn=0;
			for (var i = 0; i < es.length; i++) {
				var mth = es[i];
				var flds = m[mth]; if (!flds) continue;
				setAtr(res, mth, flds.getNames(","));
			}
			for (var i = 0; i < ns.length; i++) {
			    var ck = ns[i][1], v = "N"; if (ck && ck.checked) { v = "Y"; operOptn = operOptn | ns[i][2];}
				setAtr(res, ns[i][0], v);
			}
			setAtr(res, "operOptn", operOptn);
			if (m.useXmlDoc) {
				if (m.fltO) setAtr(res, "otft", m.fltO.value);
				if (m.fltR) setAtr(res, "rtft", m.fltR.value);
				if (m.fltOA) setAtr(res, "otfta", m.fltOA.value);
				if (m.fltRA) setAtr(res, "rtfta", m.fltRA.value);
				if (m.dlmrO) setAtr(res, "dlmf", m.dlmrO.value);
				var doc = res.ownerDocument, x = doc.xml;
				if (!x) x = new XMLSerializer().serializeToString(doc);
				return x;
			} else {
				if (m.fltO) setAtr(res, "otft", GJT.encodeAttr(m.fltO.value));
				if (m.fltR) setAtr(res, "rtft", GJT.encodeAttr(m.fltR.value));
				if (m.fltOA) setAtr(res, "otfta", GJT.encodeAttr(m.fltOA.value));
				if (m.fltRA) setAtr(res, "rtfta", GJT.encodeAttr(m.fltRA.value));
				if (m.dlmrO) setAtr(res, "dlmf", GJT.encodeAttr(m.dlmrO.value));
				return res.outerHTML;
			}
		}
		po.releaseDesign = function () {
			if (window.confirm("You are going to release current design to users. This will effect all users. Plese confirm this."))
			this.saveDesign(this.UserChannelId);
		}
		po.previewDesign = function () {
			var m = this, res = m.collDesign(); if (!res) return;
			if (!m.vlidateDgn(res)) return;
			if (m.previewHandle) m.previewHandle(res, m.ctrl);
		}
		po.genFlds = function (txt) {
			if (!txt) return;
			var b = txt.split(","), res = new OpItems();
			for (var i = 0; i < b.length; i++) {
				res.add(new OpItem(b[i], b[i]));
			}
			return res;
		}
		po.getMths = function () {
			var m = this, rs = [], b = getEM(m.cntr, "button");
			for (var i = 0; i < b.length; i++) {
				var a = xGetAtr(b[i], "mth");
				if (!a) a = xGetAtr(b[i], "mthR");
				if (a) rs.push(a);
			}
			return rs;
		}
		po.getChks = function () {
		    var m = this, n=GJT.TreeViewOperOptionsEnum, a = ["chkExpTD", "chkExpDT", "chkExpF", "chkExpB", "chkigrt", "chkaenp", "chkacnp", "chkamns"],
                b = [n.ExpandDown, n.ExpandUp, n.ExpandForward, n.ExpandBackward, n.IgnoreRepeat,n.AllowEditNodeProperty,n.AllowChangeParent,n.AllowMoveNode], rs = [];
			for (var i = 0; i < a.length; i++) {rs.push([a[i], getChiHasAtr(m.cntr, a[i]),b[i]]);}
			return rs;
		}
		po.showSel = function (mth, flds, resO) {
			var m = this, rs = [], b = getEM(m.cntr, "button");
			var txt = flds ? flds.getNames(",") : "";
			for (var i = 0; i < b.length; i++) {
				var a = xGetAtr(b[i], "mth");
				if (!a) a = xGetAtr(b[i], "mthR");
				if (!a) continue;
				if (resO) { txt = xGetAtr(resO, a); if (!txt) txt = ""; }
				if (a == mth || resO) b[i].parentNode.nextSibling.innerText = txt;
			}
		}
		po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
		TreeViewDesigner._initialized = true;
	}
	//get old design
	var m = this,o , txtXml = teBpcSync("getTreeViewDgn", src, null, [{ name: "Channel", value: channel}]);
	m.channel = channel;
	if (m.useXmlDoc) {
		var doc = GJT.xmlDocument();
		doc.loadXML(txtXml);
		o = doc.firstChild;
	} else {
		o = newEm("div");
		o.innerHTML = txtXml; o = o.children[0];
	}
	m.fieldsO = m.genFlds(xGetAtr(o, "afobj"));
	m.fieldsR = m.genFlds(xGetAtr(o, "afrela"));
	rmvAtr(o, "afobj");rmvAtr(o, "afrela");
	m.resO = o;

	var dg = new DialogInBody("TVDNR", "TreeView Designer - " + src.text, null, null, container);
	m.ctrl = src;
	dg.handleClose = function () { return m.evtCloseDlg.call(m); }
	m.dlgCtrl = dg;
	dg.setClient(m.createContents());
	showInCenter(dg.dlg);
	m.showSel(0, "", o);
	var ns = m.getChks();
	for (var i = 0; i < ns.length; i++) {
		var ck = ns[i][1], v = xGetAtr(o, ns[i][0], "");
		if (ck) ck.checked = (v == "Y");
	}
	if (m.useXmlDoc) {
		if (m.fltO) m.fltO.value = xGetAtr(o, "otft", "");
		if (m.fltR) m.fltR.value = xGetAtr(o, "rtft", "");
		if (m.fltOA) m.fltOA.value = xGetAtr(o, "otfta", "");
		if (m.fltRA) m.fltRA.value = xGetAtr(o, "rtfta", "");
		if (m.dlmrO) m.dlmrO.value = xGetAtr(o, "dlmf", "");
	}
	else {
		if (m.fltO) m.fltO.value = GJT.decodeAttr(xGetAtr(o, "otft", ""));
		if (m.fltR) m.fltR.value = GJT.decodeAttr(xGetAtr(o, "rtft", ""));
		if (m.fltOA) m.fltOA.value = GJT.decodeAttr(xGetAtr(o, "otfta", ""));
		if (m.fltRA) m.fltRA.value = GJT.decodeAttr(xGetAtr(o, "rtfta", ""));
		if (m.dlmrO) m.dlmrO.value = GJT.decodeAttr(xGetAtr(o, "dlmf", ""));
	}
}

function DataViewOpDesigner(grdEdit, opSetting, container) {
	if (DataViewOpDesigner._initialized == undefined) {
		var po = DataViewOpDesigner.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<table><tr><td><button title='add a new foreign fields set' act='addFgn'>New FFS</button>"
			, "<br><button title='delete current foreign fields set' act='delFgn'>Del FFS</button></td><td>Foreign fields set<br><select style='width:100%'></select></td></tr>"
			, "<tr><td align='right'>Name:<input type='text' isName='Y' /></td><td>Caption:<input type='text' isCaption='Y' /></td></tr>"
			, "<tr><td><button act='selMF'>Key Fields (Master)</button></td><td isF='Y'></td></tr>"
			, "<tr><td><button act='selFtU'>Fields to update</button></td><td isFUDP='Y'></td></tr>"
			, "<tr><td><button act='selFT'>Foreign View</button></td><td><input type='text' style='width:120px' isFT='Y' /><span isFTtxt='Y' ></span></td></tr>"
			, "<tr><td><button act='selFGF''>Foreign key Fields</button></td><td isFGF='Y'></td></tr>"
			, "<tr><td><button act='selFtR'>Foreign Fields to retrieve</button></td><td isFRtv='Y'></td></tr>"
			, "<tr><td><input type='checkbox' is4disabled='Y' />Disable</td><td><input type='checkbox' is4alwblnk='Y' checked='checked' />Allow Blank Value</td></tr>"
			, "<tr><td colspan='2'><input type='checkbox' is4mfdenied='Y' />Master Fields Write Denied. <input type='checkbox' is4frcedlog='Y' />Force Edit Log</td></tr>"
			, "<tr><td colspan='2'><input type='checkbox' is4clrnomtch='Y' />Clear data if no match. <input type='checkbox' is4soiik='Y' />Set as old data row if is P.key.<input type='checkbox' is4noalrm='Y' />No Alert for no match</td></tr>"
			, "<tr style='display:;'><td colspan='2'><input type='checkbox' is4inscols='Y' />Import as new Columns. <input type='checkbox' is4newattr='Y' />Import as new Attributes. "
            , "<input type='checkbox' is4AskUsrCol='Y' />Ask user to select columns. <input type='checkbox' is4AlwMV='Y' />Allow multi values<br/>Column Name prefix:<input type='text' is4nmpfxncol='Y' value='' style='width:100px;' />  Caption prefix:<input type='text' is4cptpfxncol='Y' value='' style='width:100px;' /></td></tr>"
			, "<tr><td title='tail fields count allowed ignored if no match found'>Loosen fields count if no match</td><td><input type='text' loosenfields='Y'  value='0' /></td></tr>"
			, "<tr><td align='right'>Filter:</td><td title='filter for user'><input type='text' is4filter='Y' style='width:99%' /></td></tr>"
			, "<tr><td align='right' colspan='2' title='If no match data found, this text will be alerted to user'>Alert Text:<textarea type='text' is4AlertTxt='Y' style='width:85%' ></textarea></td></tr>"
			, "<tr><td align='right' colspan='2' title='keep some note text for this design'>Note:<textarea type='text' is4NoteTxt='Y' style='width:85%' ></textarea></td></tr>"
			, "<tr><td colspan='2'><hr /></td></tr>"
			, "<tr><td><button act='selF4NR'>Fields for judge as new record</button></td><td isf4nr='Y'></td></tr>"
			, "<tr><td><button act='selF4MemoSave'>Field save cells memo</button></td><td isf4memosave='Y'></td></tr>"
			, "<tr><td><button act='selF4NumDtl'>Fields support number detail</button></td><td isf4dtl='Y'></td></tr>"
			, "<tr><td><button act='selF4NumDtlSave'>Field save number detail</button></td><td isf4dtlsave='Y'></td></tr>"
			, "<tr><td><button act='selF4NumDtlTitle'>Fields as row title for number detail</button></td><td isf4dtltitle='Y'></td></tr>"
			, "<tr><td><button act='selF4UpdateRsh'>Fields Refresh After update</button></td><td isf4rshupdt='Y'></td></tr>"
			, "<tr><td title='rows for color seperator'>rows for color separator</td><td><input type='text' rowscsp='Y'  value='5' /></td></tr>"
			, "<tr><td><button act='editCF'>設定格式化條件</button></td><td></td></tr>" //editFL
			, "<tr><td><button act='editFL'>設定公式</button></td><td></td></tr>"
			, "<tr><td><button act='selF4LvlIndent' title='標示資料列所屬階層的欄位'>階層欄位</button></td><td isf4lvlidnt='Y'></td></tr>"
			, "<tr><td>每一階層縮排量(px)</td><td><input type='text' value='20' name='txtLvlIdnt' /></td></tr>"
			, "<tr><td colspan='2' nowrap='nowrap'><button act='save'>Save</button><button act='pvw'>Preview</button><button act='release' title='Release design to user'>Release</button><button act='close'>Close</button></td></tr>"
			, "</table>"]; //
			o.innerHTML = h.join("");
			o = o.children[0];
			return o;
		}
		po.setActiveFgn = function () {
			var m = this, s = m.selRela, chn = s.children;
			m.actRela = null; m.actRelaN = null;
			for (var i = 0; i < chn.length; i++) {
				if (chn[i].selected) {
					m.actRela = chn[i].sur;
					m.actRelaN = chn[i];
				}
			}
			m.showFgnInfo();
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, r = m.actRela, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "change") {
				if (!r) return alert("Please add relation before any action!");
				if (o == m.nameO && r) {
					r.name = o.value;
					m.actRelaN.innerText = r.name;
				}
				if (o == m.txtfgFilter && r) r.filter = o.value;
				else if (o == m.txtAlert && r) r.alertText = o.value;
				else if (o == m.txtnmpfx && r) r.nameprefixImpt = o.value;
				else if (o == m.txtcptpfx && r) r.captionprefixImpt = o.value;
				else if (o == m.textO && r) r.caption = o.value;
				else if (o == m.txtNote && r) r.noteText = o.value;
			}
			else if (ty == "click") {
				var ac = xGetAtr(o, "act");
				if (!ac) {
					if (getAtr(o, "is4mfdenied") == "Y") r.mfdenied = o.checked;
					else if (getAtr(o, "is4frcedlog") == "Y") r.frcedlog = o.checked;
					else if (getAtr(o, "is4disabled") == "Y") r.disabled = o.checked;
					else if (getAtr(o, "is4clrnomtch") == "Y") r.ClearIfNoMatch = o.checked;
					else if (getAtr(o, "is4alwblnk") == "Y") r.allowBlankVal = o.checked;
					else if (getAtr(o, "is4soiik") == "Y") r.setAsOldRowIfIsKey = o.checked;
					else if (getAtr(o, "is4noalrm") == "Y") r.noAlert4NoMatch = o.checked;
					else if (getAtr(o, "is4inscols") == "Y") r.ImportAsNewColumns = o.checked;
					else if (getAtr(o, "is4AlwMV") == "Y") r.AllowMultiValues = o.checked;
					else if (getAtr(o, "is4AskUsrCol") == "Y") r.AskUserSelColumns = o.checked;
					else if (getAtr(o, "is4newattr") == "Y") r.ImportAsNewAttr = o.checked;
					return;
				}
				if (ac == "selFT") return m.selFT();
				if (ac == "addFgn") return m.addRela();
				if (ac == "delFgn") return m.delRela();
				if (ac == "selF4NR") return m.selF4NR();
				if (ac == "selF4NumDtl") return m.selF4NumDtl();
				if (ac == "selF4NumDtlSave") return m.selF4NumDtlSave();
				if (ac == "selF4MemoSave") return m.selF4MemoSave();
				if (ac == "selF4NumDtlTitle") return m.selF4NumDtlTitle();
				if (ac == "selF4UpdateRsh") return m.selF4UpdateRsh();
				if (ac == "selF4LvlIndent") return m.selF4LvlIndent();
				if (ac == "save") return m.saveDesign();
				if (ac == "pvw") return m.previewDesign();
				if (ac == "release") return m.releaseDesign();
				if (ac == "editCF") return m.editCF();
				if (ac == "editFL") return m.editFL();
				if (ac == "close") return m.dlgCtrl.close();
				if (!r) return alert("Please add relation before any action!");
				if (ac == "selMF") m.selMF(1);
				if (ac == "selFtU") m.selMF(0);
				if (ac == "selFGF") m.selFGF(1);
				if (ac == "selFtR") m.selFGF(0);
			}
			else if (ty == "keyup") {
				if (o == m.nameO && r) {
					r.name = o.value;
					m.actRelaN.innerText = r.name;
				}
				else if (o == m.chklsq) r.loosenfields = o.value;
				else if (o == m.inprcsp) m.ops.rowscsp = o.value;
			}
			else if (ty == "change") {
				if (o == m.chklsq) r.loosenfields = o.value;
				if (o == m.inprcsp) m.ops.rowscsp = o.value;
				if (o == m.txtnmpfx) r.nameprefixImpt = o.value;
				if (o == m.txtcptpfx) r.captionprefixImpt = o.value;
			}
		}
		po.selFGF = function (forKey) {
			var m = this, itms, r = m.actRela, flds;
			for (var i = 0; i < m.ftbls.length; i++) {
				var t = m.ftbls[i];
				if (r.ftbl == t.id || r.ftbl == t.name) {
					itms = new OpItems();
					itms.addByString(t.fields);
//					continue;
//					var fs = t.fields.split(",");
//					for (var j = 0; j < fs.length; j++) {
//						itms.add({ name: fs[j], text: fs[j] });
//					}
				}
			}
			if (forKey && r.fgflds) flds = itms.collect(r.fgflds)
			if (!forKey && r.fgrfsflds) flds = itms.collect(r.fgrfsflds);
			if (flds == null) flds = new OpItems();
			var so = selItems("selFlds", "Select fields" + (forKey ? " (Key)" : ""), itms, flds, null, 600, m.prcsSetFGFlds, 1, 1,1);
			so.tarObj = m; so.forKey = forKey;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsSetFGFlds = function (selector) {
			var so = selector, m = so.tarObj, r = m.actRela, itmsSel = so.itemsSelected, forKey = so.forKey;
			if (forKey) r.fgflds = itmsSel.getNames(",",0,0,0,1);
			else r.fgrfsflds = itmsSel.getNames(",", 0, 0, 0, 1);
			m.showFgnInfo();
		}
		po.selF4NR = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4jnr ? itms.collect(m.ops.f4jnr) : new OpItems();
			var so = selItems("selFlds", "Select field for judge new record", itms, flds, null, 600, m.prcsselF4NR, 1, 1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4NR = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4jnr = ns;
			m.F4JNRO.innerText = ns;
		}
		po.selF4UpdateRsh = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4rshupdt ? itms.collect(m.ops.f4rshupdt) : new OpItems();
			var so = selItems("selFlds", "Select fields for refresh after update", itms, flds, null, 600, m.prcsselF4UpdateRsh, 1, 1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4UpdateRsh = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4rshupdt = ns;
			m.F4RSHUPDT.innerText = ns;
		}

		po.selF4NumDtl = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4numdtl ? itms.collect(m.ops.f4numdtl) : new OpItems();
			var so = selItems("selFlds", "Select fields support number detail", itms, flds, null, 600, m.prcsselF4NumDtl, 1, 1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4NumDtl = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4numdtl = ns;
			m.F4NDTLO.innerText = ns;
		}
		po.selF4NumDtlSave = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4numdtlsave ? itms.collect(m.ops.f4numdtlsave) : new OpItems();
			var so = selItems("selFlds", "Select field whick saves number detail", itms, flds, null, 600, m.prcsselF4NumDtlSave, 1, 1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4NumDtlSave = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4numdtlsave = ns;
			m.F4NDTLSAVEO.innerText = ns;
		}
		po.selF4LvlIndent = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4lvlindent ? itms.collect(m.ops.f4lvlindent) : new OpItems();
			var so = selItems("selFlds", "Select field represent level of row data", itms, flds, null, 600, m.prcsselF4LvlIndent, 1,1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4LvlIndent = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4lvlindent = ns.split(",")[0];
			m.F4LVLINDENTO.innerText = ns;
		}
		po.selF4NumDtlTitle = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4numdtltitle ? itms.collect(m.ops.f4numdtltitle) : new OpItems();
			var so = selItems("selFlds", "Select fields as title for number detail", itms, flds, null, 600, m.prcsselF4NumDtlTitle, 1, 1,1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4NumDtlTitle = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4numdtltitle = ns;
			m.F4NDTLTITLEO.innerText = ns;
		}
		po.selF4MemoSave = function () {
			var m = this, itms = m.tar.fieldsAll, flds;
			flds = m.ops.f4memosave ? itms.collect(m.ops.f4memosave) : new OpItems();
			var so = selItems("selFlds", "Select field whick saves memo text data", itms, flds, null, 600, m.prcsselF4MemoSave, 1, 1);
			so.tarObj = m;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsselF4MemoSave = function (selector) {
			var so = selector, m = so.tarObj, itmsSel = so.itemsSelected, ns=itmsSel.getNames(",", 0, 0, 0, 1);
			m.ops.f4memosave = ns;
			m.F4MEMOSAVEO.innerText = ns;
		}
		po.selMF = function (forKey) {
			var m = this, itms = m.tar.fieldsAll, r = m.actRela, flds;
			if (forKey) flds = r.mflds ? itms.collect(r.mflds) : new OpItems();
			else flds = r.rfsflds ? itms.collect(r.rfsflds) : new OpItems();
			var so = selItems("selFlds", "Select fields" + (forKey ? " (Key)" : ""), itms, flds, null, 600, m.prcsSetMFlds, 1, 1);
			so.tarObj = m; so.forKey = forKey;
			dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
			so.setModal(true);
		}
		po.prcsSetMFlds = function (selector) {
			var so = selector, m = so.tarObj, r = m.actRela, itmsSel = so.itemsSelected, forKey = so.forKey ,ns=itmsSel.getNames(",", 0, 0, 0, 1);
			if (forKey) r.mflds = ns;
			else r.rfsflds = ns;
			m.showFgnInfo();
		}
		po.selFT = function () {
			var m = this, itms = m.ftbls;
			itms._cftb = m;
			itms.onclick = m.prcsSelFT;
			SysShowMenu(itms);
		}
		po.prcsSelFT = function (itm, itms) {
			var m = itms._cftb, r = m.actRela;
			if (!r) { m.addRela(); r = m.actRela; }
			if (itm.id) r.ftbl = itm.id;
			else r.ftbl = itm.name;
			r.ftblText = itm.name;
			m.showFgnInfo(r);
		}
		po.showFgnInfo = function (myRela) {
			var m = this, r = myRela;
			if (!r) r = m.actRela;
			if (r) {
				m.nameO.value = r.name; // alert(m.FTO.innerText);
				m.textO.value = lySX(r.caption); // alert(m.FTO.innerText);
				m.FTO.innerHTML = lySX(r.ftbl);
				m.FTtxtO.innerText = lySX(r.ftblText);
				m.MastFO.innerText = lySX(r.mflds);
				m.FGFO.innerText = lySX(r.fgflds);
				m.FtRO.innerText = lySX(r.fgrfsflds);
				m.FtUO.innerText = lySX(r.rfsflds);
				m.chkmfdnd.checked = r.mfdenied;
				m.chkfrcedlog.checked = r.frcedlog;
				m.chkdsb.checked = r.disabled;
				m.chkalwbnk.checked = r.allowBlankVal;
				m.chkcrnm.checked = r.ClearIfNoMatch;
				m.chksoiik.checked = r.setAsOldRowIfIsKey;
				m.chknoalm.checked = r.noAlert4NoMatch;
				m.chkimpasn.checked = r.ImportAsNewColumns;
				m.chkalwmv.checked = r.AllowMultiValues;
				m.chkimpasatr.checked = r.ImportAsNewAttr;
				m.chkausc.checked = r.AskUserSelColumns;
				m.chklsq.value = r.loosenfields;
				m.txtnmpfx.value = r.nameprefixImpt;
				m.txtcptpfx.value = r.captionprefixImpt;
				m.txtfgFilter.value = lySX(r.filter);
				m.txtAlert.value = lySX(r.alertText);
				m.txtNote.value = lySX(r.noteText);
			}
			else {
				m.nameO.value = "";
				m.textO.value = "";
				m.FTO.innerHTML = "";
				m.FTtxtO.innerText = "";
				m.MastFO.innerText = "";
				m.FGFO.innerText = "";
				m.FtRO.innerText = "";
				m.FtUO.innerText = "";
				m.chkmfdnd.checked = false;
				m.chkfrcedlog.checked = false;
				m.chkdsb.checked = false;
				m.chkalwbnk.checked = false;
				m.chkcrnm.checked = false;
				m.chksoiik.checked = false;
				m.chknoalm.checked = false;
				m.chkimpasn.checked = false;
				m.chkalwmv.checked = false;
				m.chkimpasatr.checked = false;
				m.chkausc.checked = false;
				m.chklsq.value = 0;
				m.txtfgFilter.value = "";
				m.txtAlert.value = "";
				m.txtnmpfx.value = "";
				m.txtcptpfx.value = "";
				m.txtNote.value = "";
			}
		}
		po.addRela = function (myRela) {
			var m = this, s = m.selRela, ro = myRela;
			if (!ro) {
				ro = {}; ro.name = "?"; ro.text = "??"; ro.caption = "??"; ro.loosenfields = 0; ro.allowBlankVal = 1; ro.ClearIfNoMatch = 1;
				ro.setAsOldRowIfIsKey = 0; ro.filter = ""; ro.noAlert4NoMatch = 0; ro.ImportAsNewColumns = 0; ro.AskUserSelColumns = 0; ro.nameprefixImpt = ""; ro.captionprefixImpt = "";
			}
			var o = s.appendChild(newEm("option"));
			m.fgns.push(ro);
			o.sur = ro;
			o.innerText = ro.name;
			o.selected = true;
			m.setActiveFgn();
		}
		po.delRela = function () {
			var m = this, ro = m.actRelaN;
			if (!ro) return;
			if (!window.confirm("This will delete current relation. Please confirm this")) return;
			var s = m.selRela, chn = s.children;
			ro.parentNode.removeChild(ro);
			for (var i = 0; i < m.fgns.length; i++) {
				if (m.fgns[i] == ro.sur) {m.fgns.splice(i, 1); break;}
			}
			if (chn.length > 0) {
				chn[0].selected = true;
			}
			this.setActiveFgn();
		}
		po.editCF = function () {
			var m = this;
			if (!m.ops.fci) m.ops.fci = [];
			var dg = new ConditionFormatEditor(m.tar, m.ops.fci);
		}
		po.editFL = function () {
			var m = this;
			if (!m.ops.fls) m.ops.fls = [];
			var dg = new FormulaEditor(m.tar, m.ops.fls);
		}
		po.saveDesign = function (channel) {
			var m = this, res = m.collDesign();// if (!res) return;
			if (channel == null) channel = m.channel;
			if (m.saveHandle) m.saveHandle(m.ops, m.tar, channel);
		}
		po.collDesign = function () {
			var m = this, chn = m.fgns, res;
			for (var i = 0; i < chn.length; i++) {
				var r = chn[i];
				if (!r.mflds) return alert("Key Fields for master must be specified!");
				if (!r.rfsflds && !r.ImportAsNewColumns && !r.ImportAsNewAttr) return alert("Fields for update in master must be specified!");
				if (!r.ftbl) return alert("Foreign table not set correctly!");
				if (!r.fgflds || !r.fgrfsflds) return alert("Foreign key fields and foreign fields must be showed!");
				if (!res) res = [];
				res.push(r);
			}
			return res;
		}
		po.releaseDesign = function () {
			if (window.confirm("You are going to release current design to users. This will effect all users. Plese confirm this."))
				this.saveDesign(this.UserChannelId);
		}
		po.previewDesign = function () {
			var m = this, res = m.collDesign();
			if (m.previewHandle) m.previewHandle(m.ops, m.tar);
		}
		po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
		DataViewOpDesigner._initialized = true;
	}
	var ops = opSetting;
	if (!ops.ftbls || ops.ftbls.length == 0) {
		//return alert("There is no foreign tables defnied for this view! \n Please register foreign tables for this view by ACC.");
	}
	var m = this, dg = new DialogInBody("DVD1", "DataView Designer - " + grdEdit.text, null, null, container);
	m.tar = grdEdit;
	m.ops = ops; //res.fgns=[]; res.ftbls
	m.fgns = ops.fgns;m.ftbls = ops.ftbls;
	dg.handleClose = function () { return m.evtCloseDlg.call(m); }
	m.dlgCtrl = dg;
	var o = m.createContents();
	dg.setClient(o);
	m.cntr = o;
	var evh = m.evtHnd, er = function () { evh.call(m); };
	setEvtHandleAll(o, er);
	var b = getEM(o, "button"), s = getEM(o, "select"), s1 = s[0], itms = m.itms;
	s1.onchange = function () { m.setActiveFgn.call(m); };
	m.nameO = getChiHasAtr(o, "isName", "Y");
	m.nameO.onchange = er;
	m.textO = getChiHasAtr(o, "isCaption", "Y");
	m.textO.onchange = er;
	m.FTO = getChiHasAtr(o, "isFT", "Y");
	hideIt(m.FTO);
	m.FTtxtO = getChiHasAtr(o, "isFTtxt", "Y");
	m.MastFO = getChiHasAtr(o, "isF", "Y");
	m.FGFO = getChiHasAtr(o, "isFGF", "Y");
	m.FtRO = getChiHasAtr(o, "isFRtv", "Y");
	m.FtUO = getChiHasAtr(o, "isFUDP", "Y");
	m.F4JNRO = getChiHasAtr(o, "isf4nr", "Y");
	m.F4RSHUPDT = getChiHasAtr(o, "isf4rshupdt", "Y");
	m.F4NDTLO = getChiHasAtr(o, "isf4dtl", "Y");
	m.F4NDTLSAVEO = getChiHasAtr(o, "isf4dtlsave", "Y");
	m.F4NDTLTITLEO = getChiHasAtr(o, "isf4dtltitle", "Y");
	m.F4MEMOSAVEO = getChiHasAtr(o, "isf4memosave", "Y");
	m.F4LVLINDENTO = getChiHasAtr(o, "isf4lvlidnt", "Y");
	m.chkmfdnd = getChiHasAtr(o, "is4mfdenied", "Y");
	m.chkfrcedlog = getChiHasAtr(o, "is4frcedlog", "Y");
	m.chkdsb = getChiHasAtr(o, "is4disabled", "Y");
	m.chkalwbnk = getChiHasAtr(o, "is4alwblnk", "Y");
	m.chkcrnm = getChiHasAtr(o, "is4clrnomtch", "Y");
	m.chksoiik = getChiHasAtr(o, "is4soiik", "Y");
	m.chknoalm = getChiHasAtr(o, "is4noalrm", "Y");
	m.chkimpasn = getChiHasAtr(o, "is4inscols", "Y");
	m.chkalwmv = getChiHasAtr(o, "is4AlwMV", "Y");
	m.chkimpasatr = getChiHasAtr(o, "is4newattr", "Y");
	m.chkausc = getChiHasAtr(o, "is4AskUsrCol", "Y");
	m.txtnmpfx = getChiHasAtr(o, "is4nmpfxncol", "Y");
	m.txtcptpfx = getChiHasAtr(o, "is4cptpfxncol", "Y");
	m.chklsq = getChiHasAtr(o, "loosenfields", "Y");
	m.inprcsp = getChiHasAtr(o, "rowscsp", "Y");
	m.txtfgFilter = getChiHasAtr(o, "is4filter", "Y");
	m.txtfgFilter.onchange = er;
	m.txtAlert = getChiHasAtr(o, "is4AlertTxt", "Y");
	m.txtAlert.onchange = er;
	m.txtnmpfx.onchange = er;
	m.txtcptpfx.onchange = er;
	m.selRela = s1;
	m.txtNote = getChiHasAtr(o, "is4NoteTxt", "Y");
	m.txtNote.onchange = er;
	for (var i = 0; i < b.length - 4; i++) { b[i].style.width = "100%"; }

	if (opSetting) {
		var fgns = opSetting.fgns;
		if (fgns) {
			var s = m.selRela;
			for (var i = 0; i < fgns.length; i++) {
				var r=fgns[i], opn = s.appendChild(newEm("option"));
				opn.sur = r;
				opn.innerText = r.name;
				if (i == 0) opn.selected = true;
			}
			m.setActiveFgn(fgns[0]);
		}
	}
	if (ops.f4jnr) m.F4JNRO.innerText = lySX(ops.f4jnr);
	if (ops.f4numdtl) m.F4NDTLO.innerText = lySX(ops.f4numdtl);
	if (ops.f4numdtlsave) m.F4NDTLSAVEO.innerText = lySX(ops.f4numdtlsave);
	if (ops.f4numdtltitle) m.F4NDTLTITLEO.innerText = lySX(ops.f4numdtltitle);
	if (ops.f4memosave) m.F4MEMOSAVEO.innerText = lySX(ops.f4memosave);
	if (ops.f4rshupdt) m.F4RSHUPDT.innerText = lySX(ops.f4rshupdt);
	if (ops.rowscsp) m.inprcsp.value = lySX(ops.rowscsp);
	if (ops.f4lvlindent) m.F4LVLINDENTO.innerText = lySX(ops.f4lvlindent);
}


function NumDetailEditorOld(ge, container, wdt, hgt) {
	this.ge = ge; //m.opst
	if (!ge.opst || !ge.opst.f4numdtl) return;
	if (NumDetailEditorOld._initialized == undefined) {
		var po = NumDetailEditorOld.prototype;
		po.createContents = function () {
			var m = this, n = i18nm, ops = m.ge.opst, fa = m.ge.fieldsAll, itms = fa.collect(ops.f4numdtl), o = newEm("div"), h = ["<table cellspacing='2' cellpadding='0' border='0'>"
	, "<tr><td colspan='20'><input type='checkbox' is4AutoSumBack='Y' />Auto Sum Back<br/>"
	, "<input type='checkbox' is4Lock='Y' />Lock<br/>"
	, "<button act='SumBack'>加回</button><button act='SumBackAll'>Sum Back All</button>"
	, "<button act='insRow'>", n.InsertRow.text, "</button>"
	, "<button act='addRow'>", n.AddRow.text, "</button>"
	, "</td></tr>"
	, "<tr><td><textarea type='text' name='memotxt'></textarea></td><td><input type='text' name='numval' /></td></tr>"
	];
			m.flds = itms;
			m.opst = ops;
			o.innerHTML = h.join("") + "</table>";
			o = o.children[0];
			m.inpN = getChiHasAtr(o, "name", "memotxt");
			m.inpN.parentNode.removeChild(m.inpN);
			m.inpV = getChiHasAtr(o, "name", "numval");
			m.inpV.parentNode.removeChild(m.inpV);
			//m.inpN.style.borderWidth = "0px";
			//m.inpV.style.borderWidth = "0px";
			m.inpN.onfocus = function () { selectText(m.inpN); }
			m.inpV.onfocus = function () { selectText(m.inpV); }
			m.inpN.style.overflow = "visible";
			var p = o.getElementsByTagName("TBODY")[0];
			if (!p) p = o;
			for (var i = 0; i < itms.length; i++) {
				var tr = p.appendChild(newEm("tr")), td = tr.appendChild(newEm("td"));
				td.innerText = itms[i].text;
				setAtr(tr, 'tarF', itms[i].name);
				if ((i % 2) == 0) setColor(td, null, "#eeeeee");
			}
			return o;
		}
		po.showDtl = function (oaTR) {
			var m = this, ge = m.ge, itms = m.flds, rws = m.cntr.rows, fv = ge.opst.f4numdtl, ft = ge.opst.f4numdtltitle;
			if (!oaTR || (m.cTRs && m.locked)) return;
			if (fv) fv = fv.split(",")[0];
			for (var j = 0; j < oaTR.length; j++) {
				var v = ge.getFieldValueR(fv, oaTR[j]), ti = ge.getFieldsValuesR(ft, [oaTR[j]], "\r\n"), doc, nd, tr = rws[1];
				doc = GJT.xmlDocument();
				if (v) { doc.loadXML(v); nd = doc.firstChild; } else nd = doc.appendChild(doc.createElement("d"));
				while (tr.cells.length < j + 2) {
					tr.appendChild(newEm("td"));
				}
				if (ti) tr.cells[j + 1].innerText = ti; showIt(tr.cells[j + 1]);
				for (var i = 0; i < itms.length; i++) {
					var tr = rws[i + 2], td, tarF = getAtr(tr, "tarF"), cs = tr.children, nd2 = doc.getElementsByTagName(tarF)[0];
					while (cs.length < j + 2) {
						tr.appendChild(newEm("td"));
					}
					td = cs[j + 1];
					if (!nd2) nd2 = nd.appendChild(doc.createElement(tarF));
					td.innerHTML = "<table style='table-layout:fixed' class='DataEdit' border='1' cellspacing='0' cellpadding='0' ><tbody><tr><td title='name' isN='Y' width='150px' height='20px'></td><td title='number' isV='Y' width='100px'></td></tr></tbody></table>";
					var tbl = td.children[0], tbd = tbl.children[0];
					for (var k = 0; k < nd2.childNodes.length; k++) {
						if (k > 0) { tbd.appendChild(newEm("tr")).innerHTML = "<td width='50%' isN='Y'></td><td width='50%' isV='Y'></td>"; }
						var nd3 = nd2.childNodes[k], tr2 = tbd.children[k];
						tr2.children[0].innerText = xGetAtr(nd3, "x");
						tr2.children[1].innerText = xGetAtr(nd3, "v");
					}
					showIt(td);
				}
			}
			m.cTRs = oaTR;
			for (var i = -1; i < itms.length; i++) {
				cs = rws[i + 2].cells;
				for (var k = oaTR.length + 1; k < cs.length; k++) { hideIt(cs[k]); }
			}
		}
		po.showInp = function (td) {
			var m = this, pN = m.inpN, pV = m.inpV;
			m.rvsVal();
			if (!td) { hideIt([pN, pV]); return; }
			var p = td.parentNode, tdN = getChiHasAtr(p, "isN", "Y"), tdV = getChiHasAtr(p, "isV", "Y");
			teCopyFont(tdN, [pN, pV]);
			pN.value = tdN.innerText;
			pV.value = tdV.innerText;
			pN.sur = tdN; pV.sur = tdV;
			showIt([pN, pV]);
			m.rvsInpLoc();
			if (td == tdN) pN.focus();
			else if (td == tdV) pV.focus();
			m.actTR = getTR(tdN);
		}
		po.rvsVal = function () {
			var m = this, pN = m.inpN, pV = m.inpV, tdN0 = pN.sur, tdV0 = pV.sur;
			if (tdN0) { tdN0.innerText = pN.value; tdV0.innerText = pV.value; }
		}
		po.rvsInpLoc = function () {
			var m = this, pN = m.inpN, pV = m.inpV, tdN = pN.sur, tdV = pV.sur; if (!tdN) return;
			matchLoc(pN, tdN, 1, 1, 0, 0, 1, 4, 4); matchLoc(pV, tdV, 1, 1, 0, 0, 1, 4, 4);
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "click") {
				if (getAtr(o, "is4Lock")) m.locked = o.checked;
				else if (getAtr(o, "is4AutoSumBack")) m.autoSum = o.checked;
				else if (getAtr(o, "isN") || getAtr(o, "isV")) m.showInp(o);
				else if (o != m.inpN && o != m.inpV) m.showInp(null);
				var ac = xGetAtr(o, "act");
				if (ac == "SumBack") return m.SumBack();
				if (ac == "SumBackAll") return m.SumBack(1);
				if (ac == "insRow") return m.insRow(1);
				if (ac == "addRow") return m.insRow();
			}
			else if (ty == "keydown") {
				if (o == m.inpN) return; //|| o == m.inpV
				var key = GJT.eventKeyCode(ev);
				if (key == 38) m.chgCell(1);
				if (key == 40) m.chgCell();
			}
			else if (ty == "keypress") {
				var chrCode = GJT.eventKeyCode(ev);
				if (chrCode == 13) {
					m.rvsVal(); m.rvsInpLoc();
					if (o == m.inpV || ev.ctrlKey) m.chgCell(0);
				} else if (o == m.inpV) {
					if (chrCode > 31) {
						if (cmnIsCharTypeCorrect(String.fromCharCode(chrCode), GDT.Real) == false) { cmnEvtSetReturn(0, ev); } //GJT.stopBubble();
					}
				}
			}
		}
		po.chgCell = function (up) {
			var m = this, cn = m.cntr, tr = m.actTR; if (!tr) return;
			var trN = up ? tr.previousSibling : tr.nextSibling;
			if (!trN) {
				var p = getTable(tr).parentNode, idx = p.cellIndex;
				var ptr = getTR(p), ptr2 = up ? ptr.previousSibling : ptr.nextSibling;
				if (!ptr2) return;
				var tbl = ptr2.cells[idx].children[0];
				trN = up ? tbl.rows[tbl.rows.length - 1] : tbl.rows[0];
				trN.cells[0].click();
			}
		}
		po.insRow = function (insBfr) {
			var m = this, tr = m.actTR; if (!tr) return;
			var p = tr.parentNode, trN = tr.cloneNode(true);
			for (var i = 0; i < trN.cells.length; i++) {
				trN.cells[i].innerText = "";
			}
			if (insBfr) p.insertBefore(trN, tr);
			else p.appendChild(trN);
		}
		po.SumBack = function (sumAll) {
		}
		po.hndScroll = function (a, b) {
			this.rvsInpLoc();
		}
		po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
		NumDetailEditorOld._initialized = true;
	}

	var m = this, dg = new DialogInBody("NUMDTL", "Number Detail: " + ge.text, wdt, hgt, container);
	m.dlgCtrl = dg;
	dg.handleClose = function () { return m.evtCloseDlg.call(m); }
	dg.handleScroll = function (a, b) { m.hndScroll.call(m, a, b); }
	var o = m.createContents(), o2 = BDY(); //.rows[0].cells[0];//dg.main
	dg.setClient(o);
	m.cntr = o; //.children[0];
	hideIt([m.inpN, m.inpV]);
	o2.appendChild(m.inpN); o2.appendChild(m.inpV);
	var evh = m.evtHnd, er = function () { evh.call(m); };
	setEvtHandleAll(o, er);
	setEvtHandleAll(m.inpN, er); setEvtHandleAll(m.inpV, er);
} //end NumDetailEditorOld

// 樞紐分析表設計器
function pvtGetAggrItems(isSubTTL) {
	var itms = PROG._PivotAggrFunctions;
	if (!itms) {
	itms = new OpItems();
	itms.add(newITM("sum", "Sum"));
	itms.add(newITM("avg", "Average"));
	itms.add(newITM("count", "Count"));
	itms.add(newITM("max", "Max"));
	itms.add(newITM("min", "Min"));
	itms.add(newITM("first", "First"));
	itms.add(newITM("firstnonull", "First Not Null"));
	itms.add(newITM("last", "Last"));
	itms.add(newITM("lastnonull", "Last not null"));
	itms.add(newITM("sumdistinct", "Sum Distinct"));
	itms.add(newITM("avgwithnull", "Average include null"));
	itms.add(newITM("diff", "Difference"));
	PROG._PivotAggrFunctions = itms;
	}
	if (!isSubTTL) { itms = itms.clone(); itms.remove("diff"); }
	return itms;
}

// Pivot for user ...
function PivotsSettingSetCmn(r, nd) {//設定共通的屬性名/值
	if (r.item) {
		var itm = r.item;
		if (itm.name) setAtr(nd, "name", itm.name);
		if (itm.fieldName) setAtr(nd, "name", itm.fieldName);
		if (itm.text) setAtr(nd, "text", itm.text);
		if (itm.tip) setAtr(nd, "tip", itm.tip);
		if (itm.fieldName) setAtr(nd, "fldName", itm.fieldName);
	}
	if (r.name && (!itm || !itm.fieldName)) setAtr(nd, "name", r.name);
	if (r.text) setAtr(nd, "text", r.text);
	if(r.tip) setAtr(nd, "tip", r.tip);
	if (r.cssText) setAtr(nd, "style", r.cssText);
	if (r.cssTextCon) setAtr(nd, "contentstyle", r.cssTextCon);
	if (r.cssTextHL) setAtr(nd, "hlvlstyle", r.cssTextHL);
	if (r.cssTextLL) setAtr(nd, "llvlstyle", r.cssTextLL);
	if (r.TextFormat) setAtr(nd, "format", r.TextFormat);
	if (r.TextFormatIdx) setAtr(nd, "format_idx", r.TextFormatIdx);
	if (r.TextFormatOther) {
		if (r.TextFormatIdx == "_") setAtr(nd, "format", r.TextFormatOther); //如果是自訂格式
		setAtr(nd, "formatother", r.TextFormatOther);
	}
	if (r.PermanentValues) setAtr(nd, "permanentvalues", r.PermanentValues);
	if (r.ValuesSequence) setAtr(nd, "valuessequence", r.ValuesSequence);
	if (r.sortMode) setAtr(nd, "sortmode", r.sortMode);
	if (r.textEng) setAtr(nd, "text-en", r.textEng);
	if (r.tipEng) setAtr(nd, "tip-en", r.tipEng);
	if (r.aggrFunc) setAtr(nd, "mode", r.aggrFunc.name);//匯總函數名稱
	if (r.delimiter) setAtr(nd, "delimiter", r.delimiter);
	if (r.surItem) setAtr(nd, "surItm", r.surItem.name);
	if (r.disabled) setAtr(nd, "disabled", "Y");
	if (r.highValue4css) setAtr(nd, "hlvlvalue", r.highValue4css);
	if (r.lowValue4css) setAtr(nd, "llvlvalue", r.lowValue4css);
	if (r.options) setAtr(nd, "options", r.options);
}
function PivotsSettingGetCmn(r, nd, fa) {//設定共通的屬性名/值
	var nm = getAtr(nd, "name"), txt = getAtr(nd, "text"), tip = getAtr(nd, "tip"), fldNm = getAtr(nd, "fldName");
	var itm = fa[nm];
	var txtEn = getAtr(nd, "text-en"), tipEn = getAtr(nd, "tip-en");
	var sty = getAtr(nd, "style"), styCon = getAtr(nd, "contentstyle"), fmt = getAtr(nd, "format"), fmtOth = getAtr(nd, "formatother"), pmtVal = getAtr(nd, "permanentvalues");
	var valSeq = getAtr(nd, "valuessequence"), sortM = getAtr(nd, "sortmode"), aggrFunc = getAtr(nd, "mode");
	var dlmr = getAtr(nd, "delimiter"), surItm = getAtr(nd, "surItm"), disabled = getAtr(nd, "disabled"), styhl = getAtr(nd, "hlvlstyle"), styll = getAtr(nd, "llvlstyle");
	var hgv4css = getAtr(nd, "hlvlvalue"), lowv4css = getAtr(nd, "llvlvalue"), optns= getAtr(nd, "options");
	r.TextFormatIdx = getAtr(nd, "format_idx");
	if (fmtOth) r.TextFormatOther = fmtOth;
	if (r.TextFormatIdx) r.TextFormat = r.TextFormatIdx;
	if(nm) r.name = nm;
	if (itm) r.item = itm;
	if (txt) r.text = txt;
	if (tip) r.tip = tip;
	if (txtEn) r.textEng = txtEn;
	if (tipEn) r.tipEng = tipEn;
	if (disabled == "Y") r.disabled = true;
	if (sty) r.cssText = sty;
	if (styCon) r.cssTextCon = styCon;
	if (styhl) r.cssTextHL = styhl;
	if (styll) r.cssTextLL = styll;
	if (fmt) r.TextFormat = fmt;

	if (pmtVal) r.PermanentValues = pmtVal;
	if (valSeq) r.ValuesSequence = valSeq;
	if (sortM) r.sortMode = sortM;
	if (aggrFunc) r.aggrFunc = pvtGetAggrItems(1)[aggrFunc];
	if (dlmr) r.delimiter = dlmr;
	if (surItm) r.surItem = fa[surItm];
	if (hgv4css) r.highValue4css = hgv4css;
	if (lowv4css) r.lowValue4css = lowv4css;
	if (optns) r.options = optns;
}
function PivotsSettingUserGet(ge, channel) {//讀取使用者對ge設計的樞紐分析表格
	var xp = ["Action", "subact", "tarid", "channel"], vp = ["Misc", "getPivotUserDgn", ge.id, channel];
	var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
	if (!txt) return [];
	var doc = GJT.xmlDocument(),fa = ge.fieldsAll;
	doc.loadXML(txt);
	var nd = doc.firstChild;if (!nd) return [];
	var res = [], chn = nd.childNodes;
	for (var i = 0; i < chn.length; i++) {
		var nd2 = chn[i];
		var r = {};
		r.labels = [[], [], [], [], [], []];//依序是列標籤 ,欄標籤,樞紐欄位,列總計,欄總計
		PivotsSettingGetCmn(r, nd2, fa);
		r.mergeRow = nd2.getAttribute("mergerow") == "Y";
		r.mergeCol = nd2.getAttribute("mergecol") == "Y";
		r.disabled = nd2.getAttribute("disabled") == "Y";
		var sharedFrom = nd2.getAttribute("sharedFrom");
		if (sharedFrom) r.sharedFrom = sharedFrom;
		res.push(r);
		var chn2 = nd2.childNodes;
		for (var h = 0; h < chn2.length; h++) {
			var nd3 = chn2[h], ndNm = nd3.nodeName;
			var idx = ndNm == "rowlabel" ? 0 : (ndNm == "collabel" ? 1 : 2)
			//這裡需要檢查tag name,決定是哪一類的label,因為程式裡的順序是 rowlabel ,collable ,pivotcol
			if (ndNm == "subttl") {//合計項目
				var lbl4 = {};
				PivotsSettingGetCmn(lbl4, nd3, fa);
				r.labels[5].push(lbl4);
				//如果有下一層就是指定的特定欄位
				var chn3 = nd3.childNodes;
				for (var j = 0; j < chn3.length; j++) {
					if (ndNm4 == "col") {
						var nd4 = chn3[j], ndNm4 = nd4.nodeName;
						var lbl5 = {};
						PivotsSettingGetCmn(lbl5, nd4, fa);
						if (!lbl4.ptyFlds) lbl4.ptyFlds = [];
						lbl4.ptyFlds.push(lbl5);
					}
				}
				continue;
			} else if (ndNm == "charts") {
			    r.charts = teChartDesignsFromXml(nd3);
            }
			var lbl = r.labels[idx]; //這裡必須使用陣列,因為 PivotTableDesigner.addPvt 使用了陣列
			PivotsSettingGetCmn(lbl, nd3, fa);
			var chn3 = nd3.childNodes;
			for (var j = 0; j < chn3.length; j++) {
				//需要檢查tag name
				var nd4 = chn3[j], ndNm4 = nd4.nodeName;
				var lbl4 = {};
				PivotsSettingGetCmn(lbl4, nd4, fa);
				if (ndNm4 == "col") {
					lbl.push(lbl4);
					var chn4 = nd4.childNodes;
					for (var k = 0; k < chn4.length; k++) {
						var nd5 = chn4[k],nmNm5=nd5.nodeName;
						var lbl5 = {};
						PivotsSettingGetCmn(lbl5, nd5, fa);
						if (nmNm5 == "subttl") {
							if (!lbl4.subttls) lbl4.subttls = [];
							lbl4.subttls.push(lbl5);
							var chn5 = nd5.childNodes;
							for (var q = 0; q < chn5.length; q++) {
								if (!lbl5.ptyFlds) lbl5.ptyFlds = [];
								var nd6 = chn5[q];
								var lbl6 = {};
								PivotsSettingGetCmn(lbl6, nd6, fa);
								lbl5.ptyFlds.push(lbl6);
							}

						} else if (nmNm5 == "rowproperty") {
							if (!lbl4.ptyFlds) lbl4.ptyFlds = [];
							var chn5 = nd5.childNodes;
							for (var q = 0; q < chn5.length; q++) {
								var nd6 = chn5[q];
								var lbl6 = {};
								PivotsSettingGetCmn(lbl6, nd6, fa);
								lbl4.ptyFlds.push(lbl6);
							}
						}
					}
				} else if (ndNm4 == "subttl") {//row column合計項目 另外放
					var idxsttl = idx == 0 ? 3 : 4;
					var chn4 = nd4.childNodes;
					var lbl5 = {};
					PivotsSettingGetCmn(lbl5, nd4, fa);
					r.labels[idxsttl].push(lbl5);
					for (var k = 0; k < chn4.length; k++) {
						var nd5 = chn4[k], nmNm5 = nd5.nodeName;
						if (nmNm5 == "col") {
							//PivotsSettingGetCmn(lbl5, nd5, fa);
							var lbl6 = {};
							PivotsSettingGetCmn(lbl6, nd5, fa);
							if (!lbl5.ptyFlds) lbl5.ptyFlds = [];
							lbl5.ptyFlds.push(lbl6);
						}
					}
				}
			}
		}
	}
	return res;
}
function PivotsSettingUserSave(ge, res, channel, target, getXML) {
	var doc = GJT.xmlDocument();
	var nd = doc.appendChild(xEm(doc, "root"));
	for (var i = 0; i < res.length; i++) {
		var r = res[i];
		if (!r.labels || r.labels.length < 3) continue;//格式不正確,缺少某些項目
		var nd2 = nd.appendChild(xEm(doc, "outputpivot")), nd3;
		PivotsSettingSetCmn(r, nd2);
		setAtr(nd2, "mergerow", (r.mergeRow ? "Y" : "N"));
		setAtr(nd2, "mergecol", (r.mergeCol ? "Y" : "N"));
		setAtr(nd2, "disabled", (r.disabled ? "Y" : "N"));
		if (r.sharedFrom) setAtr(nd2, "sharedFrom", r.sharedFrom);
		for (var h = 0; h < 3; h++) {
			var tag = h== 0 ? "rowlabel" : ( h== 1 ? "collabel" : "pivotcol");
			nd3 = nd2.appendChild(xEm(doc, tag));
			var r2 = r.labels[h];
			for (var j = 0; j < r2.length; j++) {
				var rw = r2[j], nd4 = nd3.appendChild(xEm(doc, "col"));
				PivotsSettingSetCmn(rw, nd4);
				var r3 = rw.subttls;
				if (r3 && r3.length > 0) {//小計項目//subttl
					for (var k = 0; k < r3.length; k++) {
						var rx = r3[k], nd5 = nd4.appendChild(xEm(doc, "subttl"));
						PivotsSettingSetCmn(rx, nd5);
						var r4 = rx.ptyFlds;
						if (r4 && r4.length > 0) {//小計的資料來源欄位
							for (var q = 0; q < r4.length; q++) {
								var rx = r4[q], nd6 = nd5.appendChild(xEm(doc, "col"));
								PivotsSettingSetCmn(rx, nd6);
							}
						}
					}
				}
				r3 = rw.ptyFlds;
				if (r3 && r3.length > 0) {//列標籤
					var nd5 = nd4.appendChild(xEm(doc, "rowproperty"));
					for (var k = 0; k < r3.length; k++) {
						var rx = r3[k], nd6 = nd5.appendChild(xEm(doc, "col"));
						PivotsSettingSetCmn(rx, nd6);
					}
				}
			}
			if (h == 2) continue;
			var idxsttl = h == 0 ? 3 : 4;
			//合計項目
			var r3 = r.labels[idxsttl]; ;
			if (r3 && r3.length > 0) {//小計項目//subttl
				for (var k = 0; k < r3.length; k++) {
					var rx = r3[k];
					var nd4 = nd3.appendChild(xEm(doc, "subttl"));
					PivotsSettingSetCmn(rx, nd4);
					if (rx.ptyFlds) {
						for (var q = 0; q < rx.ptyFlds.length; q++) {
							var nd5 = nd4.appendChild(xEm(doc, "col"));
							PivotsSettingSetCmn(rx.ptyFlds[q], nd5);
						}
					}
				}
			}
		}
		var r2 = r.labels[5]; //欄列合計
		for (var j = 0; j < r2.length; j++) {
			var rw = r2[j], nd4 = nd2.appendChild(xEm(doc, "subttl"));
			PivotsSettingSetCmn(rw, nd4);
			if (rw.ptyFlds) {
				for (var q = 0; q < rw.ptyFlds.length; q++) {
					var nd5 = nd4.appendChild(xEm(doc, "col"));
					PivotsSettingSetCmn(rw.ptyFlds[q], nd5);
				}
			}
		}
		if (r.charts) {
            var ndC = nd2.appendChild(xEm(doc, "charts"));
            teChartDesignsToXml(r.charts, doc, ndC);
        }
	}
	var txt = doc2Xml(doc); // new XMLSerializer().serializeToString(doc);
	if (getXML) return txt;
	if (txt) txt = txt.replace(/</g, "%&lt;%").replace(/>/g, "%&gt;%"); //.replace(/\r/g, "\\r").replace(/\n/g, "\\n"))
	var xp = ["Action", "subact", "tarid", "dgnTxt", "channel"], vp = ["Misc", "savePivotUserDgn", ge.id, txt, channel];
	if (target != null) { xp.push("target"); vp.push(target); }
	var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
	if (!txt || txt == "") alert(i18nm.SuccessToSave.text);
}
function Pivot_LabelSetting(isForVal) {
	if (Pivot_LabelSetting._initialized == undefined) {
		var po = Pivot_LabelSetting.prototype;
		po.setLabel = function (lbl, isRowLabel, ctrlr) {
			var m = this, o = m.cntr; m._lbl = lbl; m._ctrlr = ctrlr;
			var surItm = lbl.surItem ? lbl.surItem : lbl.item;
			if (!surItm) surItm = lbl.aggrFunc;
			m.dg.setCaption((m.isForVal ? "Value Column Setting:" : "Label Setting :") + (surItm ? surItm.text : "") + (lbl.aggrFunc ? ("(" + lbl.aggrFunc.text + ")") : ""));
			var g = getEmByClass, x = lySX;
			g(o, "pvtLabelCapt").value = x(lbl.text);
			g(o, "pvtLabelDesc").value = x(lbl.tip);
			g(o, "pvtLabelCapt_Eng").value = x(lbl.textEng);
			g(o, "pvtLabelDesc_Eng").value = x(lbl.tipEng);
			g(o, "pvtTextFormatOther").value = x(lbl.TextFormatOther);
			g(o, "chkDisabled").checked = lbl.disabled;
			if (m.isForVal) { //值欄位沒有排序
				g(o, "pvtDelimiter").value = x(lbl.delimiter);
				g(o, "txtHV4css").value = x(lbl.highValue4css);
				g(o, "txtLV4css").value = x(lbl.lowValue4css);
				showItA(getTR(g(o, "opns4Diff")), lbl.aggrFunc.name == "diff");
				this.showOptions(lbl.options);
			} else {
				g(o, "pvtPermanentValues").value = x(lbl.PermanentValues);
				g(o, "pvtValuesSequence").value = x(lbl.ValuesSequence);
				var rdo = getEMT(o, "input", "radio");
				for (var i = 0; i < rdo.length; i++) {
					rdo[i].checked = rdo[i].value == lbl.sortMode;
				}
			}
			var sl = g(o, "pvtTextFormat"), dt = surItm.dataType, chn = sl.children;
			if (lbl.aggrFunc && lbl.ptyFlds && lbl.ptyFlds[0] && lbl.ptyFlds[0].item) dt = lbl.ptyFlds[0].item.dataType;
			if (dt != sl.dataType) {
			    sl.dataType = dt; var vis = true;
				//clear old items
				while (chn.length > 0) { sl.removeChild(chn[0]); }
				var txx = null, txv = null;
				if (dt == GDT.DateTime) {
					txv = ["", "yyyy/MM/dd", "MM/dd", "M/d", "M/d hh:mm:ss", "_"];
					txx = ["None", "yyyy/MM/dd", "MM/dd", "M/d", "M/d hh:mm:ss", "Other"];
				}
				else {
					txv = ["", "{0:#,###}", "{0:#,###.0}", "{0:#,###.##}", "_"];
					txx = ["None", "{0:#,###}", "{0:#,###.0}", "{0:#,###.##}", "Other"];
				}
				if (txv) {
					for (var i = 0; i < txv.length; i++) {
						addE("<option value='" + txv[i] + "'" + (lbl.TextFormatIdx == txv[i] ? " selected" : "") + ">" + txx[i] + "</option>", sl);
					}
				} else {
					//vis = false; //let all value support format
				}
				showItA(g(o, "pvtTextFormatOther"), vis);
				showItA(sl, vis);
			}
			for (var i = 0; i < chn.length; i++) {
				var y = chn[i].value == lbl.TextFormat; chn[i].selected = y;
			}
			m.cbSample.style.cssText = m._lbl.cssText;
			m.cbSampleCon.style.cssText = m._lbl.cssTextCon;
			if (m.cbSampleHL) {
			    m.cbSampleHL.style.cssText = m._lbl.cssTextHL;
			    m.cbSampleLL.style.cssText = m._lbl.cssTextLL;
			}
			m.dg.toZTop();
		}
		po.evtHnd = function () {
			var m = this, ev = GJT.event(), lbl = m._lbl; if (!ev || !lbl) return;
			var o = GJT.eventSrc(), ty = ev.type;
			if (ty == "change") {
				var cn = o.className;
				if (cn == "pvtLabelCapt") lbl.text = o.value;
				else if (cn == "pvtLabelDesc") lbl.tip = o.value;
				else if (cn == "pvtLabelCapt_Eng") lbl.textEng = o.value;
				else if (cn == "pvtLabelDesc_Eng") lbl.tipEng = o.value;
				else if (cn == "pvtAggrFunc") lbl.aggrFunc = o.value;
				else if (cn == "pvtLabelSort") lbl.sortMode = o.value;
				else if (cn == "pvtPermanentValues") lbl.PermanentValues = o.value;
				else if (cn == "pvtValuesSequence") lbl.ValuesSequence = o.value;
				else if (cn == "pvtTextFormat") { lbl.TextFormat = o.value; lbl.TextFormatIdx = o.value; }
				else if (cn == "pvtTextFormatOther") lbl.TextFormatOther = o.value;
				else if (cn == "pvtDelimiter") lbl.delimiter = o.value;
				else if (cn == "txtHV4css") lbl.highValue4css = o.value;
				else if (cn == "txtLV4css") lbl.lowValue4css = o.value;
				else return;
				if (m._ctrlr) m._ctrlr.showList();
			} else if (ty == "click") {
				var cn = o.className;
				if (cn == "pvtCnBSample") {
					m.setCnB(m.cbSample);
				} else if (cn == "pvtCnBSample2") {
					m.setCnB(m.cbSampleCon);
				} else if (cn == "pvtCnBSampleHL") {
					m.setCnB(m.cbSampleHL);
				} else if (cn == "pvtCnBSampleLL") {
					m.setCnB(m.cbSampleLL);
				} else if (cn == "chkDisabled") {
					lbl.disabled = o.checked;
					if (m._ctrlr) m._ctrlr.showList();
				} else if (o.parentElement.className == "opns4Diff") {
				    lbl.options = this.getDiffOptions(o.parentElement);
				}
			}
		}
		po.getDiffOptions = function (o) {
		    var inpts = getEM(o, "INPUT"), res = "";
		    for (var i = 0; i < inpts.length; i++) {
		        if (inpts[i].checked) { if (res != "") res += ","; res += inpts[i].value; }
		    }
		    return res;
		}
		po.showOptions = function (optns) {
		    var inpts = getEM(getEmByClass(this.cntr, "opns4Diff"), "INPUT");
		    for (var i = 0; i < inpts.length; i++) {
		        inpts[i].checked = optns && optns.indexOf(inpts[i].value) > -1;
		    }
        }
		po.setCnB = function (tar) {
			var m = this, d = PROG._dlgColor, dg;
			if (!d) {
				d = new ColorEditor(m); //, m.dlgCtrl.main
				PROG._dlgColor = d;
				dg = d.dlgCtrl;
				dg.handleClose = function (dg, force) { dg.showMe(1); return true; };
				dg.moveToMouse();
			}
			d.ctrl = m;
			d.setActive(tar);
			d.setSelection(null);
			dg = d.dlgCtrl;
			dg.showMe();
			//toZTop(dg.dlg);
		}
		po.autoPvw = function () {
			var m = this;
			m._lbl.cssText = m.cbSample.style.cssText;
			m._lbl.cssTextCon = m.cbSampleCon.style.cssText;
			if (m.cbSampleHL) {
			    m._lbl.cssTextHL = m.cbSampleHL.style.cssText;
			    m._lbl.cssTextLL = m.cbSampleLL.style.cssText;
			}
		}
		Pivot_LabelSetting._initialized = true;
	}
	var m = this, n =i18nm, dg = new DialogInBody("", "Label Setting"), kr = "<tr>", k1 = "<td style='white=space:nowrap;text-align:right'>",k2=":</td><td>", re = "</td></tr>";
	var h = ["<table cellborder='0' cellpadding='0' style='width:100%;'>"
		, kr, k1, n.Caption.text + k2 + "<input type='text' class='pvtLabelCapt' style='width:98%'/>", re
		, kr, k1, n.Caption.text+"(Eng)",k2,"<input type='text' class='pvtLabelCapt_Eng' style='width:98%'/>", re
		, kr, k1, n.Description.text, k2, "<input type='text' class='pvtLabelDesc' style='width:98%'/>", re
		, kr, k1, n.Description.text + "(Eng)", k2, "<input type='text' class='pvtLabelDesc_Eng' style='width:98%'/>"
		, kr, k1, n.Disable.text, k2, "<input type='checkbox' class='chkDisabled'/>", n.Disable.text
		, re];
	if (isForVal) {
		h.push(kr, k1, n.Delimiter.text, k2, "<input class='pvtDelimiter' style='width:30%;min-width:30px;'>", re);
	} else {
		h.push(kr, k1, i18nm.tlSetQryOrderBy.text, ":</td><td style='white-space:pre'><input type='radio' name='roSort' class='pvtLabelSort' value='a'/>", n.SortA.text
		, " <input type='radio' name='roSort' class='pvtLabelSort' value='d'/>", n.SortD.text
		, " <input type='radio' name='roSort' class='pvtLabelSort' value=''/>", n.SortNone.text, re
		);
	}
	h.push(kr, k1, n.TextFormat.text, k2, "<select class='pvtTextFormat' ></select>", re);
	h.push(kr, k1, n.TextFormat.text + " (Other)", k2, "<input type='text' class='pvtTextFormatOther' value='' ></input>", re);
	h.push(kr, k1, n.ColorAndBorder.text + " (" + n.Caption.text + ")", k2, "<div class='pvtCnBSample' >This is a sample, click me.</div>", re);
	h.push(kr, k1, n.ColorAndBorder.text + " (" + n.Content.text + ")", k2, "<div class='pvtCnBSample2' >This is a sample, click me.</div>", re);
	if (isForVal) {
	    h.push(kr, k1, "High Level Value", k2, "<input type='textbox' class='txtHV4css' />", re);
	    h.push(kr, k1, n.ColorAndBorder.text + " (High Level)", k2, "<div class='pvtCnBSampleHL' >This is a sample, click me.</div>", re);
	    h.push(kr, k1, "Low Level Value", k2, "<input type='textbox' class='txtLV4css' />", re);
	    h.push(kr, k1, n.ColorAndBorder.text + " (Low Level)", k2, "<div class='pvtCnBSampleLL' >This is a sample, click me.</div>", re);
	    h.push(kr, k1, "Diff Calculate", k2, "<form name ='' class='opns4Diff' >",
        "<input type='radio' name='calmode' value='substract' />Substract ", 
        "<input type='radio' name='calmode' value='add' />Add <input type='radio' name='calmode' value='multiple' />Multiple ",
        "<input type='radio' name='calmode' value='division' />Division",
        "<br/><input type='checkbox' value='usezeroforlackitem' />Use Zero instead of Lack Item",
        "<br/><input type='checkbox' value='reversecalseq' />Reverse Calculate Sequence",
        "<br/><input type='checkbox' value='uselateritem' />Use Later Items to Calculate",
        "<br/><input type='checkbox' value='usesibling' />Use Sibling Item to Calculate",
        "</form>", re);
	} else {
		h.push(kr, k1, "Permanent Values:</td><td><textarea type='text' class='pvtPermanentValues' style='width:97%;min-heigt:60px;'></textarea>", re);
		h.push(kr, k1, "Values Sequence:</td><td><textarea type='text' class='pvtValuesSequence' style='width:97%;min-heigt:60px;'></textarea>", re);
	}
	h.push("</table>");
	var o = addE(h.join(""));
	dg.setClient(o);
	m.cntr = o;
	m.cbSample = getEmByClass(o, "pvtCnBSample");
	m.cbSampleCon = getEmByClass(o, "pvtCnBSample2");
	m.cbSampleHL = getEmByClass(o, "pvtCnBSampleHL");
	m.cbSampleLL = getEmByClass(o, "pvtCnBSampleLL");
	m.dg = dg;
	dg.handleClose = function (dg, force) { dg.showMe(1); return true; };
	m.isForVal = isForVal;
	var er = function () { m.evtHnd.call(m); };
	setEvtHandleAll(o, er);
	o.onchange = er;
} //end Pivot_LabelSetting

var PivotLabelOptionEnum = { repeatLabel: 0x1, mergeLabel: 0x2, addPageBreak:0x4, addBlankRow: 0x8};
function PivotUI_Labels(cntrLbl, cntrList, txtO, isPivotItems) {
	if (PivotUI_Labels._initialized == undefined) {
		var po = PivotUI_Labels.prototype;
		po.setLabels = function (lbls) {
			this.labels = lbls;this.showList();
		}
		po.showList = function () {
			var m = this, ol = m.listbox, lbls = m.labels;
			ol.innerText = "";
			if (!lbls) return;
			for (var i = 0; i < lbls.length; i++) {
				var d = addEm("<div class='PivotLabel' />", null, ol), lbl = lbls[i];
				var itm = lbl.item, agr = lbl.aggrFunc, txt = lbl.text;
				if (itm) {//如果有指定欄位
					txt = (txt && txt != itm.text) ? (txt + "(" + itm.text + ")") : itm.text;
				}
				if (agr) txt = txt ? (txt + "(" + agr.text + ")") : agr.text;
				if (lbl.disabled) { d.style.textDecoration = "line-through"; d.style.color = "grey"; }
				d.innerText = txt;
				d.lbl = lbl;
				if (lbl.ptyFlds && lbl.ptyFlds.length) {
					var d2 = addEm("<div />", null, d);
					var ptyFldsO = new PivotUI_Labels(null, d2, null, 0);
					ptyFldsO.isPtyFields = true;
					ptyFldsO.setLabels(lbl.ptyFlds);
					d2.className = "PivotLabelPty";
				}
				if (lbl.subttls && lbl.subttls.length) {
					var d2 = addEm("<div />", null, d);
					var sublblsO = new PivotUI_Labels(null, d2, null, 1);
					sublblsO.hndSelField = m.hndSelField;//subttl 需要可以選取次層的欄位
					sublblsO.setLabels(lbl.subttls);
					sublblsO.isForSubTTL = 1;
				}
				if (lbl.fldMembers && lbl.fldMembers.length) {
					var d2 = addEm("<div />", null, d);
					var fldMembersO = new PivotUI_Labels(null, d2, null, 1);
					fldMembersO.setLabels(lbl.fldMembers);
				}

			}
			m.setActLbl(m.actLbl);
			showItA([m.btnUp,m.btnDown], lbls.length > 1);// showItA(m.btnDown, lbls.length > 1);
		}
		po.addProperty = function (itm) {//對作用中的項目加入屬性欄
			var m = this, nm = itm.name, lbl = m.actLbl;
			if (!lbl) return;
			if (itm == lbl.item) return; //和本身相同的不能加入
			var ptyFs = lbl.ptyFlds;
			if (!ptyFs) { ptyFs = []; lbl.ptyFlds = ptyFs; }
			for (var i = 0; i < ptyFs.length; i++) {
				if (ptyFs[i].item == itm) return;
			}
			var n = {}; n.item = itm;
			lbl.ptyFlds.push(n);
		}
		po.addLabel = function (item, showIt) {
			var m = this, n = {}, lbs = m.labels;
			n.item = item; n.text = item.text; n.tip = item.tip;
			if (!m.isPivotItems) {//除了樞紐欄位之外,其餘的不可以重複
				for (var i = 0; i < lbs.length; i++) {
					if (lbs[i].item == item) return;
				}
			}
			lbs.push(n);
			if (m.isPivotItems) {
				//立即設定彙總函數 預設用sum
				n.aggrFunc = pvtGetAggrItems()["sum"];
			}
			if (showIt) m.showList();
		}
		po.removeLabel = function (lbl, showIt) {
			var m = this, lbs = m.labels;
			for (var i = 0; i < lbs.length; i++) {
				if (lbs[i] != lbl) continue;
				if(!window.confirm(i18nm.CfmDelete.text)) continue;
				this.labels.splice(i, 1);
				if (showIt) this.showList();
			}
		}
		po.shwMenu = function () {
			var m = this, itms = new OpItems();
			if (!m.actLbl) return;
			if (m.labels.length > 1) {
				itms.add(newITM("mv-1000", i18nm.MoveToTop.text));
				itms.add(newITM("mv-1", i18nm.MoveUp.text));
				itms.add(newITM("mv1", i18nm.MoveDown.text));
				itms.add(newITM("mv1000", i18nm.MoveToBottom.text));
				itms.add(mnuHLine());
			}
			itms.add(newITM("rmvLbl", i18nm.Remove.text));
			if (m.isPivotItems) {
				itms.add(mnuHLine());
				itms.add(newITM("valFldSetting", i18nm.ValueFieldSetting.text + "..."));
				itms.add(newITM("chgAggrFunc", i18nm.Change.text + " " + i18nm.SumFunction.text + "..."));
			} else if (!m.isPtyFields) { //屬性欄項目不可以有小計
				itms.add(mnuHLine());
				itms.add(newITM("addSubTTL", i18nm.AddInto.text + " " + i18nm.SubTTLItem.text + "..."));
				itms.add(newITM("pvtFldSetting", i18nm.PivotLableSetting.text + "..."));
			}
			if (m.hndSelField) {
				itms.add(mnuHLine());
				if (m.isForSubTTL) {
					itms.add(newITM("addFieldSTTL", i18nm.Add.text + "..."));
				} else itms.add(newITM("chgField", i18nm.ChangeField.text));
			}
			//itms.add(newITM("addSubTTL", i18nm.SubTTLItem.text + "..."));
			//itms.add(newITM("AppearanceFmt", i18nm.AppearanceFormat.text + "..."));
			itms.onclick = function (a, b) { m.shwMenu2.call(m, a, b); };
			SysShowMenu(itms);
		}
		po.shwMenu2 = function (itm, itms) {
			var m = this, nm = itm.name, lbs = m.labels, lbl = m.actLbl;
			if (nm == "rmvLbl") return m.removeLabel(lbl, 1);
			if (nm == "addSubTTL") return m.addSubTTL();
			if (nm == "valFldSetting") return m.valFldSetting(lbl);
			if (nm == "pvtFldSetting") return m.pvtFldSetting(lbl);
			if (nm == "AppearanceFmt") return m.AppearanceFmt(lbl);
			if (nm == "chgAggrFunc") return m.chgAggrFunc(lbl);
			if (nm == "chgField") return m.chgField(lbl);
			if (nm == "addFieldSTTL") return m.addFieldSTTL(lbl);
			var stp = parseInt(nm.substring(2), 10);
			if (isNaN(stp)) return;
			m.moveLbl(stp);
		}
		po.AppearanceFmt = function (lbl) {
			var m = this; //標題外觀(背景顏色,文字顏色,框線,字體大小...), 內容(資料格)外觀
		}
		po.pvtFldSetting = function (lbl) {
			var m = this; //自訂名稱,自訂說明,排序,預設值清單(定序及固定出現),
			var dg = PROG._pivotLblStDg;
			if (!dg) { dg = new Pivot_LabelSetting(); PROG._pivotLblStDg = dg; dg.dg.moveToMouse();}
			else dg.dg.showMe(0, 1);
			dg.setLabel(m.actLbl,m.isRowLabel,m);
		}
		po.valFldSetting = function (lbl) {
			var m = this; //自訂名稱,自訂說明,計算方式
			var dg = PROG._pivotValStDg;
			if (!dg) { dg = new Pivot_LabelSetting(1); PROG._pivotValStDg = dg; dg.dg.moveToMouse();}
			else dg.dg.showMe(0, 1);
			dg.setLabel(m.actLbl, 0, m);
		}
		po.chgAggrFunc = function () {
			var m = this;
			m.selMode_STTL(function (a, b) { m.selMode_STTL_A.call(m, a, b,1); });
		}
		po.addSubTTL = function () {
			var m = this;
			m.selMode_STTL(function (a, b) { m.selMode_STTL_A.call(m, a, b); });
		}
		po.selMode_STTL = function (hnd) {
		    var m = this, itms = pvtGetAggrItems(m.isPivotItems==2);
			itms.onclick = hnd;
			SysShowMenu(itms);
		}
		po.selMode_STTL_A = function (itm, itms, chg) {
			var m = this, lbl = m.actLbl;
			if (chg) { //變更函數
				lbl.aggrFunc = itm; m.showList(); return;
			}
			if (!lbl.subttls) lbl.subttls = [];
			var n = {}; n.aggrFunc = itm; n.surItem = lbl.item;
			lbl.subttls.push(n);
			m.showList();
		}
		po.addSubTTLU = function () {
			var m = this;
			m.selMode_STTL(function (a, b) { m.addSubTTLU2.call(m, a, b); });
		}
		po.addSubTTLU2 = function (itm, itms, chg) {
			var m = this;
			var lbl = {}; lbl.aggrFunc = itm;
			m.labels.push(lbl);
			m.showList();
		}
		po.moveLbl = function (step) {
			var m = this, lbs = m.labels, lbl = m.actLbl;
			for (var i = 0; i < lbs.length; i++) {
				if (lbs[i] != lbl) continue;
				var idx = i + step;
				if (idx < 0) idx = 0;
				if (idx >= lbs.length) idx = lbs.length - 1;
				lbs.splice(i, 1);
				lbs.splice(idx, 0, lbl);
				this.showList();
				return;
			}
		}
		po.addFieldSTTL = function () {
			var m = this, a = m.actLbl; if (!a) return;
			m.hndSelField(m,1);
		}
		po.chgField = function () {
			var m = this, a = m.actLbl; if (!a) return;
			m.hndSelField(m);
		}
		po.setField = function (itm, addIt) {
			var m = this, a = m.actLbl; if (!a) return;
			if (addIt) {
				if (m.isForSubTTL) {
					m.addProperty(itm);
				}
			} else {
				a.item = itm;
			}
			m.showList();
		}
		po.setActLbl = function (lbl) {
			var m = this, l = m.listbox, lbs = m.labels, fnd = 0;
			for (var i = 0; i < lbs.length; i++) {
				if (lbs[i] == lbl) { fnd = 1; break; }
			}
			if (!fnd) return;//不是本集合內的項目
			m.actLbl = lbl;
			for (var i = 0; i < lbs.length; i++) {
				var c = l.children[i], t = lbs[i] == lbl; if (t) m.actLblO = c;
				c.style.border = t ? "1px dashed red" : "";
			}
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, o = GJT.eventSrc(), ty = ev.type;
			if (!o.lbl) return;
			if (ty == "click") {
				m.setActLbl(o.lbl);
				if (ev.offsetX > o.offsetWidth - 20) m.shwMenu();
			} else if (ty == "contextmenu") m.shwMenu();
			else if (ty == "dblclick") {
				if (m.isPivotItems) {
					m.valFldSetting(o.lbl);
				} else if (!m.isPtyFields) { //屬性欄項目不可以有小計
					m.pvtFldSetting(o.lbl);
				}
			}
		}
		PivotUI_Labels._initialized = 1;
	}
	var m = this;
	if(txtO) m.text = txtO.text;
	m.isPivotItems = isPivotItems;
	m.isForSubTTL = isPivotItems >= 2;
	if (cntrLbl) {
		cntrLbl.className = "DesignerLabel";
		cntrLbl.innerText = m.text;
		var bhm = "<button style='float:right;display:none;' />", b = addEm(bhm, null, cntrLbl);
		b.innerText = i18nm.MoveUp.text;
		b.onclick = function () { m.moveLbl.call(m, -1); };
		m.btnUp = b;
		var b = addEm(bhm, null, cntrLbl);
		b.innerText = i18nm.MoveDown.text;
		b.onclick = function () { m.moveLbl.call(m, 1); };
		m.btnDown = b;
		if (m.isForSubTTL) {
			var b = addEm(bhm, null, cntrLbl);
			b.innerText = i18nm.AddInto.text;
			b.onclick = function () { m.addSubTTLU.call(m); };
			showIt(b);
		}
	}
	cntrList.innerHTML = "<div style='width:100%;border:1px;overflow:auto;' />";
	m.listbox = cntrList.children[0];
	this.labels = [];
	var er = function () { m.evtHnd.call(m); };
	setEvtHandleAll(m.listbox, er);
	m.listbox.oncontextmenu = function () { er(); return false; };
}

function PivotTableDesigner(ge, channel, container) {
	var fields = ge.fieldsAll;
	fields = fields.collect(null, 0, GIA.Virtual, 1);  //function (names, opConfigIncl, opConfigExcl, exclHidden)
	if (!fields || fields.length < 3) {
	    return alert("Fields of this object is too few to create pivot report. Please try to do query once to build a table before design pivot report.");
	}
	if (PivotTableDesigner._initialized == undefined) {
		var po = PivotTableDesigner.prototype;
		po.createContents = function () {
			var o = newEm("div"), b1 = "<button style='width:50%' ", b2 = "</button>", kr = "<tr><td nowrap='nowrap' style='max-height:24px;text-align:right;width:25%'>", kh = "<tr><td width='33%' valign='top'></td><td width='33%' valign='top'></td><td valign='top'></td></tr>"
	, h = ["<table nowrap='nowrap' style='width:100%;height:99%;min-height:520px;'><tr><td valign='top' width='25%'>", b1, "title='add a new pivot setting' act='addPvt'>", i18nm.Add.text, b2
	, b1, "act='save'>", i18nm.Save.text, "</button><br/>", b1, "act='moveup'>", i18nm.MoveUp.text, b2, b1, "act='movedown'>", i18nm.MoveDown.text, b2, "<br/>", b1, "title='Other functions' act='otherFunc'>...", b2
	, "</td><td valign='top'><select size='5' style='width:100%'></select></td></tr>"
	, kr, "Caption:</td><td><input type='text' isCaption='Y' style='width:99%' /></td></tr>"
	, kr,"Description:</td><td><textarea type='text' style='min-height:45px;width:99%' isDesc='Y' ></textarea></td></tr>"
	, "<tr><td colspan='2'><input type='checkbox' is4mgrrow='Y' />Merge Rows &nbsp;<input type='checkbox' is4mgrcol='Y' />Merge Columns  <input type='checkbox' is4disable='Y' />", i18nm.Disable.text, "</td></tr>"
	, "<tr style='height:70%;'><td colspan='2'><table width='100%' style='height:100%;max-height:400px;' isSubDlg='Y' border='0' cellspacing='1'>", kh, kh, kh, kh, kh, kh
	, "</table></td></tr>"
    , "<tr style='display:none;height:30%'><td colspan='2'><textarea type='text' style='min-height:45px;width:99%;height:100%' isXML='Y' ></textarea></td></tr>"
	, "</table>"];
			o.innerHTML = h.join("");
			o = o.children[0];
			return o;
		}
		po.showAllItems = function () {
			var m = this, o = m.subdlgO, t = o.rows[0].cells[0], tl = o.rows[1].cells[0], fa = m.fields;
			t.innerText = i18nm.SelectItemsForReport.text;
			var b = addEm("<button style='float:right;' />", null, t);
			b.innerText = i18nm.AddInto.text;
			b.onclick = function () { m.addLabelByMenu.call(m); };
			tl.innerHTML = "<select style='width:100%;min-height:90px;max-height:200px;height:100%;overflow:auto;'  multiple='multiple' />";
			m.fieldsList = tl.children[0];
			var l2 = tl.children[0];
			for (var i = 0; i < fa.length; i++) {
				var nn = newEm("option"), itm = fa[i];
				nn.id = itm.name; nn.innerText = itm.text; nn.surItem = itm;
				l2.appendChild(nn); //nn.selected = true;
			}
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, r = m.actPvt, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "change") {
				if (o == m.textO && r) {
					r.text = o.value;
					m.actPvtN.innerText = r.text;
				}
			}
			else if (ty == "click") {
				MenuHide();
				if (o == m.chkmgrrow) r.mergeRow = o.checked;
				if (o == m.chkmgrcol) r.mergeCol = o.checked;
				if (o == m.chkdisable) r.disabled = o.checked;
				var ac = xGetAtr(o, "act");
				if (ac == "addPvt") return m.addPvt();
				if (ac == "delPvt") return m.delPvt();
				if (ac == "otherFunc") return m.otherFunc();
				if (ac == "save") return PivotsSettingUserSave(m.tar, m.pvtSet, m.channel);
				if (ac == "moveup") return m.movePvt(-1);
				if (ac == "movedown") return m.movePvt(1);
			}
			else if (ty == "keyup") {
				if (o == m.textO && r) r.text = o.value;
				if (o == m.descO && r) r.tip = o.value;
			}
			else if (ty == "contextmenu") {
				if (o == m.fieldsList) m.addLabelByMenu();
			}
			else if (ty == "dblclick") {//雙擊加入可能會造成誤動作,不提供
			}
		}
		po.otherFunc = function () {
			var m = this, n = i18nm, itms = new OpItems();
			if (m.actPvt) {
				itms.add(newITM("mv-1000", n.MoveToTop.text));
				itms.add(newITM("mv-1", n.MoveUp.text));
				itms.add(newITM("mv1", n.MoveDown.text));
				itms.add(newITM("mv1000", n.MoveToBottom.text));
				itms.add(mnuHLine());
				itms.add(newITM("copyPvt", n.CloneRows.text));
				itms.add(newITM("delPvt", n.DeleteData.text));
				if (m.channel == "D") {//設計模式才有發布的功能
					itms.add(newITM("releasePvt", "Release to users", "Release selected pivot design to all users"));
				} else if (m.channel == "U") {//使用者自設模式才有分享功能
					itms.add(newITM("sharePvtPub", n.ShareToPublic.text, n.ShareToPublic.tip));
					itms.add(newITM("sharePvtOth", n.ShareToOthers.text, n.ShareToOthers.tip));
				}
				itms.add(newITM("getXML", "Get XML"));
				//itms.add(newITM("chartDsgn", "Chart Design"));
			}
			itms.add(newITM("refresh", n.tlRefreshData.text));
			itms.onclick = function (a, b) { m.otherFunc2.call(m, a, b); };
			SysShowMenu(itms);
		}
		po.otherFunc2 = function (itm, itms) {
			var m = this, nm = itm.name;
			if (nm == "copyPvt") return m.copyPvt();
			if (nm == "delPvt") return m.delPvt();
			if (nm == "releasePvt") return m.releasePvt("Release design to users", "0");
			if (nm == "sharePvtPub") return m.releasePvt(i18nm.ShareToPublic.text, "0");
			if (nm == "sharePvtOth") return m.releasePvt(i18nm.ShareToOthers.text);
			if (nm == "refresh") return m.refresh();
			//if (nm == "chartDsgn") return m.chartDsgn();
			if (nm == "getXML") {
			    var txt = PivotsSettingUserSave(m.tar, m.pvtSet, m.channel, null, 1);
			    var ox = getChiHasAtr(m.cntr, "isXML", "Y");
			    ox.value = txt;
			    showIt(getTR(ox));
			}
			var stp = parseInt(nm.substring(2), 10);
			if (isNaN(stp)) return;
			m.movePvt(stp);
		}
		po.releasePvt = function (actionText, target) {
			var m = this, a = m.actPvt;
			if (!a) return alert("No item selected!");
			if (!actionText) actionText = "";
			if (target == null) return m.releasePvtSelTar(actionText);
			if (!window.confirm(i18nm.msgConfirmExecute.text + "\n\"" + a.text + "\" " + actionText + "\n!!!!分享前記得存檔,系統只會以存檔過的內容進行分享!!!\n!!! Please save design before sharing to others !!!")) return;
			PivotsSettingUserSave(m.tar, [a], m.channel, target);
		}
		po.releasePvtSelTar = function (actionText) {
			var m = this; m._actionText = actionText;
			sysObjSelectorShow(function (selector, res) { m.releasePvtSelTarOK.call(m, selector, res); }, m.lastRcvr, i18nm.ShareToOthers.text, "65662");
		}
		po.releasePvtSelTarOK = function (selector, res) {
			var target = []; if (!res[0]) return;
			for (var i = 0; i < res[0].length; i++) {
				if (res[0][i] != "") target.push(res[0][i]);
			}
			if (target.length < 1) return;
			this.releasePvt(this._actionText, target.join(","));
		}
		//po.chartDsgn = function () {
		//    var m = this, r = m.actPvt;
		//    if (!r) return alert("No item selected!");
		//    if (!r.charts) r.charts = [];
		//    var fields = new OpItems();
		//    // 欄列標籤 以及計算欄位,只有計算欄位可以當成資料數列,其餘的只能作為坐標軸標籤或者是圖例的文字
		//    //因此需要傳入的欄位項目可能需要針對樞紐的欄列標籤欄位設定屬性讓使用者無法選入到資料數列
        //    //欄或列的小計項目也是可以做為資料數列來源,因此需要分開逐一
		//    var dx = [2, 3, 4, 0, 1];//前三個是可以做為資料數列的來源,後兩個的小計也可以
		//    for (var i = 0; i < dx.length; i++) {
		//        var r2 = r.labels[dx[i]];
		//        for (var j = 0; j < r2.length; j++) {
		//            var o = r2[j], itm = o.item, itmN=null;//OpItem(name, caption, description, dataType, opconfig, programPrivilege, dataPrivilege)
		//            if (itm) {
        //                //有可能欄位或聚合函數名稱在不同樞紐區塊內相同,所以尾巴
		//                itmN = new OpItem(itm.name + "@" + dx[i], itm.text, itm.tip, itm.dataType);
		//                itmN.fieldName = itm.fieldName;
		//            } else {
		//                var agr = o.aggrFunc;
		//                if (!agr) continue;
		//                var nName = agr.name, nText = o.text ? o.text : agr.text;
		//                if (o.ptyFlds) {
		//                    for (var k = 0; k < o.ptyFlds.length; k++) {
		//                        nName += "_" + o.ptyFlds[k].name;
		//                    }
        //                }
		//                nName += "@" + dx[i];
		//                //聚合函數名稱 + 成員欄位名稱 當成item name
		//                itmN = new OpItem(nName, nText);
		//            }
		//            if (!itmN) continue;
		//            fields.add(itmN);
		//        }
        //    }
		//    showChartDesigner4Pivot(m, r.charts, fields);//(tar, oriDesign, fields) 
        //}
		po.movePvt = function (stp) {
			var m = this, s = m.list, fs = m.pvtSet, a = m.actPvt, idx = -1; if (!a) return;
			for (var i = 0; i < fs.length; i++) {
				if (fs[i] == a) { idx = i; break; }
			}
			var nidx = idx + stp, iL = fs.length - 1;
			if (nidx < 0) nidx = 0; else if (nidx > iL) nidx = iL;
			if (nidx == idx) return;
			var n = s.children[idx];
			//往前 往後的處理方式不同,索引值須調整
			//先移動陣列,再重建listbox
			fs.splice(idx, 1);
			if (nidx < iL) {
				if (nidx > idx) {
					s.insertBefore(n, s.children[nidx + 1]);
					//nidx--; //往下移 nidx需要減一
				} else s.insertBefore(n, s.children[nidx]);
				fs.splice(nidx, 0, a);
			} else {
				s.appendChild(n);
				fs.push(a);
			}
			n.scrollIntoView();
		}
		po.refresh = function () {
			var m = this, s = m.list, pvtSet = PivotsSettingUserGet(m.tar, m.channel);
			if (!pvtSet) pvtSet = [];
			m.pvtSet = pvtSet;
			m.nidx = 0;
			while (s.children.length > 0) { s.removeChild(s.children[0]); }
			for (var i = 0; i < pvtSet.length; i++) {
				m.putPvtToList(pvtSet[i]);
			}
			m.setActivePvt();
		}
		po.putPvtToList = function (p) {
			var m = this, s = m.list;
			for (var i = 0; i < s.children.length; i++) {
				s.children[i].selected = false;
			}
			var o = s.appendChild(newEm("option"));
			o.innerText = p.text;// p.name;
			m.nidx = m.nidx + 1;
			o.selected = true;
			o.sur = p;
		}
		po.addPvt = function () {
			var m = this, s = m.list, fs = m.pvtSet;
			var p = {};
			p.name = "p" + (new Date()).getTime();// "untitled" + m.nidx;
			p.text = "untitled" + m.nidx;
			m.putPvtToList(p);
			p.labels = [[], [], [], [], [], []];
			fs.push(p);
			window.setTimeout(function () { m.setActivePvt(); }, 100); //使用timeout是因為如果立即呼叫 IE會變成select 物件的每個option都是selected
			return p;
		}
		po.delPvt = function () {
			var m = this, s = m.list, a = m.actPvt, n = m.actPvtN, ps = m.pvtSet;
			if (!a) return;
			if (!window.confirm("Please make sure you are deleting this setting " + a.text)) return;
			n.parentNode.removeChild(n);
			for (var i = 0; i < ps.length; i++) {
				if (ps[i] == a) { ps.splice(i, 1); break; }
			}
			m.setActivePvt();
		}
		po.copyPvt = function () {
			var m = this, s = m.list, a = m.actPvt; if (!a) return;
			var na = JSON.parse(JSON.stringify(a));
			na.name = "p" + (new Date()).getTime(); // a.name + " copied" + m.nidx;
			na.text = a.text + " Copied " + m.nidx;
			delete na.sharedFrom; //清除分享
			if (a.tip) na.tip = a.tip + " Copied " + m.nidx;
			m.pvtSet.push(na);
			m.putPvtToList(na);
			window.setTimeout(function () { m.setActivePvt(); }, 100);
			return na;
		}
		po.addLabel = function (tar, addPty) {
			var m = this, r = m.actPvt;
			if (!r) return alert("No pivot setting selected!");
			var l = m.fieldsList, ch = l.children, t = r.labels[tar], lbls2 = m.uiLbls[2].labels;
			for (var i = 0; i < ch.length; i++) {
				var c = ch[i]; if (!c.selected) continue;
				if (addPty) m.uiLbls[tar].addProperty(c.surItem);
				else {
					var addIt = tar <= 2;
					if (!addIt) {//小計及合計的項目必須存在於值欄位清單內才能加入
						for (var j = 0; j < lbls2.length; j++) {
							if (lbls2[j].item == c.surItem) addIt = true;
						}
					}
					if (addIt) m.uiLbls[tar].addLabel(c.surItem);
				}
			}
			m.uiLbls[tar].showList(t);
		}
		po.addLabelByMenu = function () {
			var m = this, itms = new OpItems();
			for (var i = 0; i < 3; i++) { //只有前三個可以直接加入欄位
				var itm = itms.add(newITM("add_" + i, i18nm.AddInto.text + " " + m.uiLbls[i].text));
				itm.idx = i;
				if (m.uiLbls[i].isRowLabel && m.uiLbls[i].actLbl) {
					var itm = itms.add(newITM("addPty_" + i, i18nm.AddInto.text + " " + i18nm.PropertyColumn.text + " > " + m.uiLbls[i].actLbl.item.text + "@" + m.uiLbls[i].text));
					itm.idx = i;
				}
			}
			itms.onclick = function (a, b) { m.addLabelByMenu2.call(m, a, b); };
			SysShowMenu(itms);
		}
		po.addLabelByMenu2 = function (itm, itms) {
			this.addLabel(itm.idx, itm.name.indexOf("addPty_") == 0);
			this.dftLabelMode = itm.idx;
		}
		po.evtCloseDlg = function () { return cfmCloseDlg(); }
		po.setActivePvt = function () {
			var m = this, s = m.list, chn = s.children;
			m.actPvt = null; m.actPvtN = null;
			for (var i = 0; i < chn.length; i++) {
				if (chn[i].selected == true) {
					m.actPvt = chn[i].sur;
					m.actPvtN = chn[i];
					break;
				}
			}
			if (!m.actPvt && chn.length > 0) { chn[0].selected = true; m.actPvt = chn[0].sur; m.actPvtN = chn[0]; }
			m.showPvtInfo();
		}
		po.shwList = function () {
			var m = this, s = m.list, n = s.childNodes, fs = m.pvtSet;
			while (n.length > 0) { s.removeChild(n[0]); }
			for (var i = 0; i < fs.length; i++) {
				var nd = fs[i], o = s.appendChild(newEm("option"));
				o.sur = nd;
				o.innerText = nd.name + " " + nd.text;
			}
		}
		po.showPvtInfo = function () {
			var m = this, a = m.actPvt;
			if (!a) {
				m.textO.value = "";
				m.descO.value = "";
				m.chkmgrrow.checked = false;
				m.chkdisable.checked = "";
				for (var i = 0; i < m.uiLbls.length; i++) {
					m.uiLbls[i].setLabels([]);
				}
				return;
			}
			m.textO.value = lySX(a.text);
			m.descO.value = lySX(a.tip);
			m.chkmgrrow.checked = a.mergeRow;
			m.chkmgrcol.checked = a.mergeCol;
			m.chkdisable.checked = a.disabled;
			for (var i = 0; i < m.uiLbls.length; i++) {
				m.uiLbls[i].setLabels(a.labels[i]);
			}
		}
		po.selField = function (caller, addIt) {
			var m = this;
			var itms = m.fields.collect(null, 0, GIA.Virtual, 1);
			itms.onclick = function (a, b) { m.selField2.call(m, a, b); };
			itms.caller = caller;
			itms.addIt = addIt;
			SysShowMenu(itms);
		}
		po.selField2 = function (itm, itms) {
			var c = itms.caller;
			if (c) c.setField(itm, itms.addIt);
		}
		PivotTableDesigner._initialized = true;
	}
	var m = this, dg = new DialogInBody("PVD1", "Pivot Table Designer " + "(" + channel + ") " + ge.text, null, null, container);
	m.tar = ge;
	m.fields = fields;
	m.hndSelField = function (caller, addIt) { m.selField.call(m, caller, addIt); };
	dg.handleClose = function () { dg.showMe(1); return true; } // return m.evtCloseDlg.call(m); 
	m.dlgCtrl = dg;
	var o = m.createContents();
	dg.setClient(o);
	m.cntr = o;
	m.channel = channel;
	o.parentElement.style.width = "593px";
	var evh = m.evtHnd, er = function () { evh.call(m); };
	setEvtHandleAll(o, er);
	o.oncontextmenu = function () { m.evtHnd.call(m); return false; };
	var s = getEM(o, "select"), s1 = s[0], itms = m.itms;
	s1.onchange = function () { m.setActivePvt.call(m); };
	//m.nameO = getChiHasAtr(o, "isName", "Y"); m.nameO.onchange = er;
	m.textO = getChiHasAtr(o, "isCaption", "Y"); m.textO.onchange = er;
	m.descO = getChiHasAtr(o, "isDesc", "Y"); m.descO.onchange = er;
	m.chkmgrrow = getChiHasAtr(o, "is4mgrrow", "Y");
	m.chkmgrcol = getChiHasAtr(o, "is4mgrcol", "Y");
	m.chkdisable = getChiHasAtr(o, "is4disable", "Y");
	m.chkfshwsttl = getChiHasAtr(o, "is4fshwsttl", "Y");
	m.list = s1;
	var ost = getChiHasAtr(o, "isSubDlg", "Y")
	m.subdlgO = ost;
	s1.onchange = function () { m.setActivePvt.call(m); };
	//讀取ge的樞紐分析表設計
	m.showAllItems();
	var ccs = tbGetCells(ost);
	m.uiLbls = [new PivotUI_Labels(ccs[2][0], ccs[3][0], i18nm.PvtRowLabel)
	, new PivotUI_Labels(ccs[0][1], ccs[1][1], i18nm.PvtColLabel)
	, new PivotUI_Labels(ccs[2][1], ccs[3][1], i18nm.FieldsCalculate, 1)
	, new PivotUI_Labels(ccs[4][0], ccs[5][0], i18nm.TotalRow, 2)
	, new PivotUI_Labels(ccs[0][2], ccs[1][2], i18nm.TotalColumn, 2)
	, new PivotUI_Labels(ccs[4][2], ccs[5][2], i18nm.TotalBoth, 3)
	]; //m.listbox
	for (var i = 0; i < m.uiLbls.length; i++) {
		var st = m.uiLbls[i].listbox.style;
		st.height = "100%"; st.minHeight = "90px"; st.maxHeight = i == 1 ? "200px" : "250px";
		m.uiLbls[i].hndSelField = m.hndSelField;
		if(i>3) st.minHeight = "30px"; 
	}
	m.uiLbls[0].isRowLabel = true; //列標籤可以設定屬性欄位
	m.refresh();
//	var pvtSet = PivotsSettingUserGet(ge, channel);
//	if (!pvtSet) pvtSet = [];
//	m.pvtSet = pvtSet;
//	m.nidx = 0;

//	for (var i=0;i<pvtSet.length;i++){
//		m.putPvtToList(pvtSet[i]);
//	}
//	m.setActivePvt();
} //end PivotTableDesigner

function ConditionFormatEditor(ge, fcitms, container) {

if (ConditionFormatEditor._initialized == undefined) {
	var po = ConditionFormatEditor.prototype;
	po.createContents = function () {
		var m = this, o = newEm("div"), h = ["<table style='width:100%'><tr><td nowrap><button act='addCFI'>新增</button>"
			, "<button act='delCFI'>刪除</button>條件式:<select isSelCFI='Y' style='minwidth:100px;'></select><button act='movU'>上移</button><button act='movD'>下移</button><button act='copyC'>複製條件</button><button act='copyN'>複製所有條件</button><button act='pasteN'>貼上所有條件</button><button act='pasteStyle'>貼上格式</button></td></tr>"
			, "<tr><td nowrap>名稱:<input type='text' isName='Y' style='border:1px solid;width:360px;' /><span isHF='Y' /></td></tr>"
			, "<tr><td nowrap><button act='selF'>選取欄位</button><button act='addLAG' title='比較前面的資料列'>前N列</button><button act='addLEAD' title='比較後面的資料列'>後N列</button><button act='addPrmSym' title='插入參數化樣式的運算式符號'>參數符號</button></td></tr>"
			, "<tr><td nowrap valign='top'>評估用運算式:<br/><textarea isFormula='Y' style='border:1px solid;width:99%;height:100px;'></textarea></td></tr>"
			, "<tr><td nowrap valign='top'>參數化樣式:<br/><textarea isStyTxt='Y' style='width:99%;height:100px;'></textarea></td></tr>"
			, "<tr><td nowrap><input type='checkbox' is4disabled='Y' />停用 <input type='checkbox' is4PrmSty='Y' />使用參數化樣式 <input type='checkbox' is4keepSty='Y' />評估為假時不清除樣式 <input type='checkbox' is4AddSty='Y' />樣式使用附加方式</td></tr>"
			, "<tr><td nowrap><input type='checkbox' is4IntvChg='Y' title='當內容會以間隔式出現時,則運算結果改變時才會切換格式化方式' />間隔式格式化 <input type='checkbox' is4EvalAllR='Y' title='評估時需要表內所有列都運算' />所有列都需一起評估"
			, "<input type='checkbox' is4Sound='Y' title='當運算結果為真時立即撥放音效' />撥放音效</tr>"
			, "<tr><td nowrap><button act='selTF'>格式化的欄位</button><span nowrap isTF='Y' /></tr>"
			, "<tr style='display:none'><td nowrap>音效檔URL:<input type='text' isSndURL='Y' style='border:1px solid;width:460px;' /></td></tr>"
			, "<tr style='display:none'><td nowrap>播音物件HTML<br/><textarea title='播音器物件的HTML屬性字串' isSndParam='Y' style='border:1px solid;width:99%;height:60px;'></textarea></td></tr>"
			, "<tr><td nowrap><button act='setStyleTxt' style='width:10%'>設定樣式</button><input type='text' title='style text' isSetStyle='Y' style='border:1px solid;width:89%;height:100%'></input></td></tr>"
			, "<tr><td nowrap><button act='setCnB'>設定色彩框線</button><button act='modStyle'>修改Style</button><button act='close'>Close</button><div isSamp='Y'>這是樣本 This is a sample</div></td></tr>"
			, "</table>"];
		o.innerHTML = h.join("");
		o = o.children[0];
		return o;
	}
	po.setActiveCFI = function () {
		var m = this, s = m.selCFI, chn = s.children;
		m.collDsn();
		m.actCFI = null; m.actCFIN = null;
		for (var i = 0; i < chn.length; i++) {
			if (chn[i].selected) {
				m.actCFI = chn[i].sur;
				m.actCFIN = chn[i];
			}
		}
		m.showCFIInfo();
	}
	po.movU = function (step) {
		var m = this, r = m.actCFI, o = m.actCFIN, o1, o2, a = m.cfs, p = o.parentNode;
		if (!r || a.length < 2) return;
		if (step > 0) { o1 = o; o2 = o.previousSibling; } //previousSibling; if (!b || b.tagName != "BR") b = a.nextSibling;
		else { o1 = o.nextSibling; o2 = o; }
		if (!o1 || !o2) return;
		p.insertBefore(o1, o2);
		for (var i = 0, chn = p.children; i < a.length; i++) {
			a[i] = chn[i].sur;
		}
	}
	po.addCFI = function () {
		var m = this, s = m.selCFI, ro = { name: "??", fmtOpn: 0, tarFld: "", refstyle: "", paramstyle:"", soundURL: "", formula:""};
		var o = s.appendChild(newEm("option"));
		m.cfs.push(ro);
		o.sur = ro;
		o.innerText = ro.name;
		o.selected = true;
		m.setActiveCFI();
	}
	po.delCFI = function () {
		var m = this, ro = m.actCFIN;
		if (!ro) return;
		if (!window.confirm("即將刪除所選的設定,請確認")) return;
		var s = m.selCFI, chn = s.children, kx = 0;
		ro.parentNode.removeChild(ro);
		for (var i = 0; i < m.cfs.length; i++) {
			if (m.cfs[i] == ro.sur) { m.cfs.splice(i, 1); kx = i; break; }
		}
		if (chn.length > 0) chn[(chn[kx] ? kx :0 )].selected = true;
		this.setActiveCFI();
	}
	po.copyCFI = function (copyAll) {
		var m = this, ro = m.actCFI, a = m.cfs, b = []; if (!a || !a.length) return;
		if (copyAll) {
			for (var i = 0; i < a.length; i++) { b.push(a[i]); }
		} else {
			if (!ro) return; b.push(ro);
		}
		ConditionFormatEditor.copiedCFI = b;
	}
	po.pasteCFI = function () {
		var m = this, a = ConditionFormatEditor.copiedCFI; if (!a || !a.length) return alert("No copied Items!");
		if (!window.confirm("確定要貼上格式化條件? (" + a.length + "項)")) return;
		for (var i = 0; i < a.length; i++) {
			m.addCFI();
			var ro = m.actCFI, b = a[i];
			ro.name = b.name + " Copied";
			ro.fmtOpn = b.fmtOpn; ro.tarFld = b.tarFld; ro.refstyle = b.refstyle; ro.paramstyle = b.paramstyle;
			ro.formula = b.formula; ro.soundURL = b.soundURL; ro.soundparam = b.soundparam;
			m.actCFIN.innerText = ro.name;
			m.showCFIInfo(ro);
		}
	}
	po.pasteStyle = function () {
		var m = this, ro = m.actCFI, b = ConditionFormatEditor.copiedCFI;
		if (!ro || !b) return alert("No item selected!");
		if (!window.confirm("確定要貼上格式?")) return;
		ro.refstyle = b[0].refstyle;
		m.showCFIInfo();
	}
	po.setStyleTxt = function () {//m.SetStyTxtO
		var m = this, f = m.actCFI; if (!f) return;
		f.refstyle = m.SetStyTxtO.value;
		setAtr(m.sampleO, "style", f.refstyle);
	}
	po.showCFIInfo = function (cfi) {
		var m = this, o = m.cntr, f = cfi, e = GJT.CondFmtOptnEnum;
		if (!f) f = m.actCFI; if (!f) return;
		var opn = f.fmtOpn, fml = f.formula, fo = m.formulaO;
		m.chkPrmSty.checked = (opn & e.useParamStyle) == e.useParamStyle;
		m.keepStyO.checked = (opn & e.keepStyleIfFalse) == e.keepStyleIfFalse;
		m.AddStyO.checked = (opn & e.appendStyle) == e.appendStyle;
		m.chkIntvTypeO.checked = (opn & e.forIntervalChange) == e.forIntervalChange;
		m.chkEvalAllO.checked = (opn & e.mustEvalAllRows) == e.mustEvalAllRows;
		m.chkPSound.checked = (opn & e.playSound) == e.playSound;
		m.nameO.value = lySX(f.name);
		m.disabledO.checked = f.disabled;
		m.TFO.innerText = lySX(f.tarFld);
		m.SndURLO.value = lySX(f.soundURL);
		m.SndParamO.value = lySX(f.soundparam);
		m.StyTxtO.value = lySX(f.paramstyle);
		setAtr(m.sampleO, "style", f.refstyle);
		m.SetStyTxtO.value = f.refstyle;
		fo.value = fml ? fml : "";
	}
	po.collDsn = function () {
		var m = this, o = m.cntr, f = m.actCFI, e = GJT.CondFmtOptnEnum;
		if (!f) return;
		var opn = 0;
		f.name = m.nameO.value;
		if (m.chkPrmSty.checked) opn = (opn | e.useParamStyle);
		if (m.keepStyO.checked) opn = (opn | e.keepStyleIfFalse);
		if (m.AddStyO.checked) opn = (opn | e.appendStyle);
		if (m.chkIntvTypeO.checked) opn = (opn | e.forIntervalChange);
		if (m.chkEvalAllO.checked) opn = (opn | e.mustEvalAllRows);
		if (m.chkPSound.checked) opn = (opn | e.playSound);
		f.fmtOpn = opn;
		f.disabled = m.disabledO.checked;
		f.refstyle = getAtr(m.sampleO, "style");
		f.paramstyle = m.StyTxtO.value;
		f.formula = m.formulaO.value;
		f.soundURL = m.SndURLO.value;
		f.soundparam = m.SndParamO.value;
	}
	po.selTF = function (forKey) {
		var m = this, itms = m.tar.fieldsAll, r = m.actCFI, flds = new OpItems();
		if (!r) return alert("未建立項目!");
		if (forKey && r.tarFld) flds = itms.collect(r.tarFld);
		var so = selItems("selFlds", "選取欄位" + (forKey ? "(格式化目標)" : ""), itms, flds, null, 600, m.prcsSetFlds, 1, 1);
		so.tarObj = m; so.forKey = forKey;
		so.setModal(true);
	}
	po.prcsSetFlds = function (selector) {
		var so = selector, m = so.tarObj, r = m.actCFI, itmsSel = so.itemsSelected, forKey = so.forKey, ns = itmsSel.getNames(",", 0, 0, 0, 1);
		if (forKey) { r.tarFld = ns; m.TFO.innerText = ns; }
		else {
			if (!ns) return;
			var q = (itmsSel[0].dataType == GDT.String) ? "\"" : "";
			ns = q + "[%" + ns.replace(new RegExp(",", "gi"), "%]" + q + "," + q + "[%") + "%]" + q;
			m.insFormula(ns);
		}
	}
	po.insFormula = function (ns,xo) {
		if(!xo) xo = this.actTxtO;
		if (xo.selectionStart != null) {
			var txt = xo.value, i1 = xo.selectionStart, i2 = xo.selectionEnd;
			xo.value = txt.substring(0, i1) + ns + txt.substring(i2); ;
		} else {
			getChiHasAtr(m.cntr, "isHF", "Y").innerText = ns;
		}
	}
	po.modStyle = function () {
		var m = this, d = m.dlgStyle;
		if (!d || isHidden(d.container)) {
			var d = new StyleEditor(m);
			m.dlgStyle = d;
			//d.ctrl = m;
			d.dlgCtrl.moveToLT();
			d.setTarget(m.sampleO);
		}
		toZTop(d.dlgCtrl.dlg);
		showBesideMouse(d.dlgCtrl.dlg);
	}
	po.setCnB = function () {
		var m = this, d = m.dlgColor;
		if (!d || isHidden(d.container)) {
			d = new ColorEditor(m); //, m.dlgCtrl.main
			m.dlgColor = d;
			d.dlgCtrl.moveToLT();
			d.ctrl = m;
			d.setActive(m.sampleO);
			d.setSelection(null);
		}
		toZTop(d.dlgCtrl.dlg);
		showBesideMouse(d.dlgCtrl.dlg);
	}
	po.evtHnd = function () {
		var ev = GJT.event(); if (!ev) return;
		var m = this, r = m.actCFI, o = GJT.eventSrc(), ty = ev.type;
		if (ty == "change") {
			if (o == m.nameO && r) {
				r.name = o.value;
				m.actCFIN.innerText = r.name;
			}
		}
		else if (ty == "click") {
			var ac = xGetAtr(o, "act");
			if (ac == "addCFI") return m.addCFI();
			if (ac == "delCFI") return m.delCFI();
			if (ac == "selFT") return m.selCFI();
			if (ac == "selTF") m.selTF(1);
			if (ac == "selF") m.selTF(0);
			if (ac == "setCnB") m.setCnB();
			if (ac == "close") { m.collDsn(); m.dlgCtrl.close(); }
			if (ac == "addLAG") m.insFormula("LAG(欄位,1)");
			if (ac == "addLEAD") m.insFormula("LAG(欄位,-1)");
			if (ac == "modStyle") m.modStyle();
			if (ac == "addPrmSym") m.insFormula("{% 這裡寫JS公式,用法同評估用運算式 %}", m.StyTxtO);
			if (ac == "movU") m.movU(1);
			if (ac == "movD") m.movU(-1);
			if (ac == "copyC") m.copyCFI();
			if (ac == "copyN") m.copyCFI(-1);
			if (ac == "pasteN") m.pasteCFI();
			if (ac == "pasteStyle") m.pasteStyle();
			if (ac == "setStyleTxt") m.setStyleTxt();
		}
		else if (ty == "keyup") {
			if (o == m.nameO && r) {
				r.name = o.value;
				m.actCFIN.innerText = r.name;
			}
		}
		else if (ty == "focus") {
			if (o == m.StyTxtO || o == m.formulaO) m.actTxtO = o;
		}
		else if (ty == "keypress") {
			if (GJT.eventKeyCode(ev) == 13 && o == m.SetStyTxtO) m.setStyleTxt();
		}
	}
	ConditionFormatEditor._initialized = true;
}
var m = this, dg = new DialogInBody("CFM", "條件式格式化 " + ge.text, null, null, container);
m.cfs = fcitms;
var o = m.createContents();
var evh = m.evtHnd, er = function () { evh.call(m); }, se = getChiHasAtr(o, "isSelCFI", "Y");
se.onchange = function () { m.setActiveCFI.call(m); };
setEvtHandleAll(o, er);
dg.setClient(o);
m.cntr = o; m.dlgCtrl = dg; m.tar = ge;
m.selCFI = getChiHasAtr(o, "isSelCFI", "Y");
m.nameO = getChiHasAtr(o, "isName", "Y");
m.nameO.onchange = er;
m.sampleO = getChiHasAtr(o, "isSamp", "Y");
m.disabledO = getChiHasAtr(o, "is4disabled", "Y");
m.formulaO = getChiHasAtr(o, "isFormula", "Y");
m.TFO = getChiHasAtr(o, "isTF", "Y");
m.StyTxtO = getChiHasAtr(o, "isStyTxt", "Y");
m.StyTxtO.onfocus = er;m.formulaO.onfocus = er;
m.actTxtO = m.formulaO;
m.keepStyO = getChiHasAtr(o, "is4keepSty", "Y");
m.AddStyO = getChiHasAtr(o, "is4AddSty", "Y");
m.chkPrmSty = getChiHasAtr(o, "is4PrmSty", "Y");
m.chkIntvTypeO = getChiHasAtr(o, "is4IntvChg", "Y");
m.chkEvalAllO = getChiHasAtr(o, "is4EvalAllR", "Y");
m.chkPSound = getChiHasAtr(o, "is4Sound", "Y");
m.SndURLO = getChiHasAtr(o, "isSndURL", "Y");
m.SndParamO = getChiHasAtr(o, "isSndParam", "Y");
m.SetStyTxtO = getChiHasAtr(o, "isSetStyle", "Y");
for (var i = 0; i < fcitms.length; i++) {
	var r = fcitms[i], opn = se.appendChild(newEm("option"));
	opn.sur = r;
	opn.innerText = r.name;
	if (i == 0) opn.selected = true;
}
m.setActiveCFI();
dg.moveToLT();
showBesideMouse(dg.dlg);
} //end ConditionFormatEditor


function FormulaEditor(ge, flis, container) {

	if (FormulaEditor._initialized == undefined) {
		var po = FormulaEditor.prototype;
		po.createContents = function () {
			var m = this, o = newEm("div"), h = ["<table><tr><td nowrap><button act='addFLI'>新增</button>"
		, "<button act='delFLI'>刪除</button>公式組:<select isSelFLI='Y' style='minwidth:100px;'></select><button act='movU'>上移</button><button act='movD'>下移</button><button act='copyC'>複製公式</button><button act='copyN'>複製所有公式</button><button act='pasteN'>貼上所有公式</button></td></tr>"
		, "<tr><td nowrap>名稱:<input type='text' isName='Y' style='border:1px solid;width:360px;' /><span isHF='Y' /></td></tr>"
		, "<tr><td nowrap><button act='selF'>插入欄位參數</button><button act='addLAG' title='比較前面的資料列'>前N列</button><button act='addLEAD' title='比較後面的資料列'>後N列</button></td></tr>"
		, "<tr><td nowrap valign='top'>運算式:<textarea isFormula='Y' style='width:500px;height:140px;'></textarea></td></tr>"
		, "<tr><td nowrap><input type='checkbox' is4disabled='Y' />停用 <input type='checkbox' is4evae='Y' />只有修改後才運算 <input type='checkbox' is4noalrt='Y' />忽略運算錯誤情況 <input type='checkbox' is4sidlg='Y' />使用小視窗顯示結果</td></tr>"
		, "<tr><td nowrap><input type='checkbox' is4ovblnk='Y' title='計算結果只覆蓋空白資料,有內容的不更動' />只覆蓋空白格 <input type='checkbox' is4ovnewr='Y' title='計算結果只覆蓋未存過檔的紀錄資料,舊紀錄的不更動' />只覆蓋新資料</td></tr>"
		, "<tr><td nowrap><input type='checkbox' is4edlog='Y' title='計算的結果要產生異動紀錄' />產生異動紀錄 <input type='checkbox' is4raiseEvt='Y' title='計算的結果要觸發更動事件'/>觸發更動事件 <input type='checkbox' is4InsOnly='Y' />新插入列後計算</td></tr>"
		, "<tr><td nowrap><button act='selTF'>顯示結果的欄位</button><span nowrap isTF='Y' /></tr>"
		, "<tr><td nowrap><button act='close'>Close</button></td></tr>"
		, "</table>"];
			o.innerHTML = h.join("");
			o = o.children[0];
			return o;
		}
		po.setActiveFLI = function () {
			var m = this, s = m.selFLI, chn = s.children;
			m.collDsn();
			m.actFLI = null; m.actFLIN = null;
			for (var i = 0; i < chn.length; i++) {
				if (chn[i].selected) {
					m.actFLI = chn[i].sur;
					m.actFLIN = chn[i];
				}
			}
			m.showFLIInfo();
		}
		po.movU = function (step) {
			var m = this, r = m.actFLI, o = m.actFLIN, o1, o2, a = m.fls, p = o.parentNode;
			if (!r || a.length < 2) return;
			if (step > 0) { o1 = o; o2 = o.previousSibling; } //previousSibling; if (!b || b.tagName != "BR") b = a.nextSibling;
			else { o1 = o.nextSibling; o2 = o; }
			if (!o1 || !o2) return;
			p.insertBefore(o1, o2);
			for (var i = 0, chn = p.children; i < a.length; i++) {
				a[i] = chn[i].sur;
			}
		}
		po.addFLI = function () {
			var m = this, s = m.selFLI, ro = { name: "??", fmtOpn: 0, tarFld: "", formula: "" };
			var o = s.appendChild(newEm("option"));
			m.fls.push(ro);
			o.sur = ro;
			o.innerText = ro.name;
			o.selected = true;
			m.setActiveFLI();
		}
		po.delFLI = function () {
			var m = this, ro = m.actFLIN;
			if (!ro) return;
			if (!window.confirm("即將刪除所選的設定,請確認")) return;
			var s = m.selFLI, chn = s.children, kx = 0;
			s.removeChild(ro);
			for (var i = 0; i < m.fls.length; i++) {
				if (m.fls[i] == ro.sur) { m.fls.splice(i, 1); kx = i; break; }
			}
			if (chn.length > 0) chn[(chn[kx] ? kx : 0)].selected = true;
			this.setActiveFLI();
		}
		po.copyFLI = function (copyAll) {
			var m = this, ro = m.actFLI, a = m.fls, b = []; if (!a || !a.length) return;
			if (copyAll) {
				for (var i = 0; i < a.length; i++) { b.push(a[i]); }
			} else {
				if (!ro) return; b.push(ro);
			}
			FormulaEditor.copiedFLI = b;
		}
		po.pasteFLI = function () {
			var m = this, a = FormulaEditor.copiedFLI; if (!a || !a.length) return alert("No copied Items!");
			if (!window.confirm("確定要貼上公式? (" + a.length + "項)")) return;
			for (var i = 0; i < a.length; i++) {
				m.addFLI();
				var ro = m.actFLI, b = a[i];
				ro.name = b.name + " Copied";
				ro.fmtOpn = b.fmtOpn; ro.tarFld = b.tarFld;
				ro.formula = b.formula;
				m.actFLIN.innerText = ro.name;
				m.showFLIInfo(ro);
			}
		}
		po.showFLIInfo = function (fli) {
			var m = this, o = m.cntr, f = fli, e = GJT.geFormulaOptnEnum;
			if (!f) f = m.actFLI; if (!f) return;
			var opn = f.fmtOpn, fml = f.formula, fo = m.formulaO;
			m.evaeO.checked = (opn & e.EvalOnly4Changed) == e.EvalOnly4Changed;
			m.sidlgO.checked = (opn & e.ShowResultInDlg) == e.ShowResultInDlg;
			m.noalrtO.checked = (opn & e.NoAlert) == e.NoAlert;
			m.ovblnkO.checked = (opn & e.OverwriteBlankOnly) == e.OverwriteBlankOnly;
			m.ovnewrO.checked = (opn & e.OverwriteNewRecOnly) == e.OverwriteNewRecOnly;
			m.edlogO.checked = (opn & e.EditLog) == e.EditLog;
			m.raiseEvtO.checked = (opn & e.RaiseEvent) == e.RaiseEvent;
			m.insRowEvalO.checked = (opn & e.EvalAfterInsertRows) == e.EvalAfterInsertRows;
			m.nameO.value = lySX(f.name);
			m.disabledO.checked = f.disabled;
			m.TFO.innerText = lySX(f.tarFld);
			fo.value = fml ? fml : "";
		}
		po.collDsn = function () {
			var m = this, o = m.cntr, f = m.actFLI, e = GJT.geFormulaOptnEnum;
			if (!f) return;
			var opn = 0;
			f.name = m.nameO.value;
			if (m.evaeO.checked) opn = (opn | e.EvalOnly4Changed);
			if (m.sidlgO.checked) opn = (opn | e.ShowResultInDlg);
			if (m.noalrtO.checked) opn = (opn | e.NoAlert);
			if (m.ovblnkO.checked) opn = (opn | e.OverwriteBlankOnly);
			if (m.ovnewrO.checked) opn = (opn | e.OverwriteNewRecOnly);
			if (m.edlogO.checked) opn = (opn | e.EditLog);
			if (m.raiseEvtO.checked) opn = (opn | e.RaiseEvent);
			if (m.insRowEvalO.checked) opn = (opn | e.EvalAfterInsertRows);
			f.fmtOpn = opn;
			f.disabled = m.disabledO.checked;
			f.formula = m.formulaO.value;
			//if (!f.tarFld) alert("Target Field for formula result not specified!");
		}
		po.selTF = function (forKey) {
			var m = this, itms = m.tar.fieldsAll, r = m.actFLI, flds = new OpItems();
			if (!r) return alert("未建立項目!");
			if (forKey && r.tarFld) flds = itms.collect(r.tarFld);
			var so = selItems("selFlds", "選取欄位" + (forKey ? "(運算式內)" : ""), itms, flds, null, 600, m.prcsSetFlds, 1, 1);
			so.tarObj = m; so.forKey = forKey;
			so.setModal(true);
		}
		po.prcsSetFlds = function (selector) {
			var so = selector, m = so.tarObj, r = m.actFLI, itmsSel = so.itemsSelected, forKey = so.forKey, ns = itmsSel.getNames(",", 0, 0, 0, 1);
			if (forKey) { ns = ns.split(",")[0]; r.tarFld = ns; m.TFO.innerText = ns; }
			else {
				if (!ns) return;
				ns = "[%" + ns.replace(new RegExp(",", "gi"), "%],[%") + "%]";
				m.insFormula(ns);
			}
		}
		po.insFormula = function (ns, xo) {
			if (!xo) xo = this.actTxtO;
			if (xo.selectionStart != null) {
				var txt = xo.value, i1 = xo.selectionStart, i2 = xo.selectionEnd;
				xo.value = txt.substring(0, i1) + ns + txt.substring(i2); ;
			} else {
				getChiHasAtr(m.cntr, "isHF", "Y").innerText = ns;
			}
		}
		po.evtHnd = function () {
			var ev = GJT.event(); if (!ev) return;
			var m = this, r = m.actFLI, o = GJT.eventSrc(), ty = ev.type;
			if (ty == "change") {
				if (o == m.nameO && r) {
					r.name = o.value;
					m.actFLIN.innerText = r.name;
				}
			}
			else if (ty == "click") {
				var ac = xGetAtr(o, "act");
				if (ac == "addFLI") return m.addFLI();
				if (ac == "delFLI") return m.delFLI();
				if (ac == "selFT") return m.selFLI();
				if (ac == "selTF") m.selTF(1);
				if (ac == "selF") m.selTF(0);
				if (ac == "close") { m.collDsn(); m.dlgCtrl.close(); }
				if (ac == "addLAG") m.insFormula("LAG(欄位,1)");
				if (ac == "addLEAD") m.insFormula("LAG(欄位,-1)");
				if (ac == "movU") m.movU(1);
				if (ac == "movD") m.movU(-1);
				if (ac == "copyC") m.copyFLI();
				if (ac == "copyN") m.copyFLI(-1);
				if (ac == "pasteN") m.pasteFLI();
			}
			else if (ty == "keyup") {
				if (o == m.nameO && r) {
					r.name = o.value;
					m.actFLIN.innerText = r.name;
				}
			}
		}
		FormulaEditor._initialized = true;
	}
	var m = this, dg = new DialogInBody("CFL", "公式設計" + ge.text, null, null, container);
	m.fls = flis;
	var o = m.createContents();
	var evh = m.evtHnd, er = function () { evh.call(m); }, se = getChiHasAtr(o, "isSelFLI", "Y");
	se.onchange = function () { m.setActiveFLI.call(m); };
	setEvtHandleAll(o, er);
	dg.setClient(o);
	m.cntr = o; m.dlgCtrl = dg; m.tar = ge;
	m.selFLI = getChiHasAtr(o, "isSelFLI", "Y");
	m.nameO = getChiHasAtr(o, "isName", "Y");
	m.nameO.onchange = er;
	m.disabledO = getChiHasAtr(o, "is4disabled", "Y");
	m.formulaO = getChiHasAtr(o, "isFormula", "Y");
	m.TFO = getChiHasAtr(o, "isTF", "Y");
	m.actTxtO = m.formulaO;
	m.sidlgO = getChiHasAtr(o, "is4sidlg", "Y");
	m.noalrtO = getChiHasAtr(o, "is4noalrt", "Y");
	m.evaeO = getChiHasAtr(o, "is4evae", "Y");
	m.ovblnkO = getChiHasAtr(o, "is4ovblnk", "Y");
	m.ovnewrO = getChiHasAtr(o, "is4ovnewr", "Y");
	m.edlogO = getChiHasAtr(o, "is4edlog", "Y");
	m.raiseEvtO = getChiHasAtr(o, "is4raiseEvt", "Y");
	m.insRowEvalO = getChiHasAtr(o, "is4InsOnly", "Y");
	for (var i = 0; i < flis.length; i++) {
		var r = flis[i], opn = se.appendChild(newEm("option"));
		opn.sur = r;
		opn.innerText = r.name;
		if (i == 0) opn.selected = true;
	}
	m.setActiveFLI();
	dg.moveToLT();
	showBesideMouse(dg.dlg);
} //end FormulaEditor

/*
關於plot chart的一些想法: 網路上一堆chart的 framework各個個的特點,如果希望我們運用這些不同的framework時可以盡量發揮其功能的話,
提供給一般使用者用的Chart Disgner就需要能夠適應不同的frame的特點及用法
因此如果Chart  Designer上可以動態的由某一個物件的屬性自動變化UI選項的,並且產生的設計資料的屬性及屬性值和Plot Chart使用的Framework完全相同的話,
我方的plot chart 的程式碼會簡化很多,也能夠完全發揮framework的功能
因此可以使用查詢JSON物件具有的屬性來決定Chart Designer該出現甚麼,另一種做法是使用OpItem OpItems的方式建立出固定格式的集合
*/
function teChartSchema() {
    return plotlyChartSchema();//使用plotly 的framework,將來如果改用其他framework 可以變更
}
function teChartSchemaLayout() {
    return plotlyChartLayoutSchema();//使用plotly 的framework,將來如果改用其他framework 可以變更
}

function cschmAtr(name, text, tip) {//建立一個schema attribuete
    if (!text) text = name;//.substring(0,1).toUpperCase() + name.substring(1);
    var res = { name: name, text: text };
    if(tip) res.tip =tip;
    return res;
}
function cschmAtr0(name, tip) {//建立一個schema attribuete
    var res = { name: name, text: name };
    if (tip) res.tip = tip;
    return res;
}
//建立整數屬性
function cschmAtrI(name, text, tip) { var res = cschmAtr(name, text, tip); res.dataType = GDT.Integer; return res; }
function cschmAtrI0(name, tip) { var res = cschmAtr(name, name, tip); res.dataType = GDT.Integer; return res;}
function cschmAtrC(name, text, choice, tip) { var res = cschmAtr(name, text, tip); res.choice = choice; return res; }
function cschmAtrC0(name, choice, tip) { var res = cschmAtr(name, name, tip); res.choice = choice; return res; }
function cschmAtrB(name, text, tip) { var res = cschmAtr(name, text, tip); res.choice = "true,false"; res.dataType = GDT.Boolean; return res; }
function cschmAtrB0(name, tip) { var res = cschmAtr(name, name, tip); res.choice = "true,false"; res.dataType = GDT.Boolean; return res; }
function cschmAtrTip(name, text, tip) { var res = cschmAtr(name, text, tip); return res; }
function cschmAtrR(name, text, tip) { var res = cschmAtr(name, text, tip); res.dataType = GDT.Real; return res; }
function cschmAtrR0(name, tip) { var res = cschmAtr(name, name, tip); res.dataType = GDT.Real; return res; }
function cschmAtrCE(name, text, choice, tip) { var res = cschmAtr(name, text, tip); res.choice = choice; res._editable = true; return res; }//With choice but editable
function cschmAtrCE0(name, choice, tip) { return cschmAtrCE(name,name,choice,tip);}
function cschmAtr2(name, text, attrs, tip) {//建立一個schema attribuete
    var res = cschmAtr(name, text, tip);
    if(attrs) res.attributes = attrs;
    return res;
}
function plotlyChartLayoutSchema() {
    var attrs = [plotlyAttr_Title(), cschmAtrC("barmode", "bar mode", "stack,group")].concat(plotlyAttrs_WH()).concat([plotlyAttr_Margin(), cschmAtrB("autosize")
        , cschmAtr("paper_bgcolor"), cschmAtr("plot_bgcolor"), cschmAtrB("showlegend"), plotlyAttr_Legend()
        , cschmAtrC("dragmode", "dragmode", "zoom,pan,select,asso,orbit,turntable")
        , plotlyAttr_Calendar()
        , plotlyAttr_HoverMode(), cschmAtr2("xaxis", "xaxis", plotlyAttrs_Axis0()), cschmAtr2("yaxis", "yaxis", plotlyAttrs_Axis0())
        , cschmAtr2("yaxis2", "yaxis2", plotlyAttrs_Axis0())
        , cschmAtr2("yaxis3", "yaxis3", plotlyAttrs_Axis0())
    ]);
     var res = cschmAtr2("layout", "Chart Layout", attrs);
    return res;
}
function plotlyAttr_Font() { return cschmAtr("font", "", plotlyAttrs_Font()); }
function plotlyAttr_Title() { return cschmAtr("title"); }
function plotlyAttr_TitleFont() { return cschmAtr2("titlefont", "title font", plotlyAttrs_Font());}
function plotlyAttr_Margin() {
    return cschmAtr2("margin", "Margin", [
        cschmAtrI0("l", "left"), cschmAtrI0("t", "top"), cschmAtrI0("r", "right"), cschmAtrI0("b", "bottom")
        , cschmAtrI("pad"), cschmAtrB("autoexpand")]
    )
}
function plotlyAttr_HoverMode() { return cschmAtrC("hovermode", "", "x,y,closest"); }
function plotlyAttr_Calendar() { return cschmAtrC("calendar", "", "gregorian,chinese,coptic,discworld,ethiopian,hebrew,islamic,julian,mayan,nanakshahi,nepali,persian,jalali,taiwan,thai,ummalqura"); }
//connectgaps (boolean) Determines whether or not gaps (i.e. {nan} or missing values) in the provided data arrays are connected.

function plotlyAttrs_Font() { return [cschmAtr("family"), cschmAtrR("size"), cschmAtr("color")]; }
function plotlyAttrs_WH() { return [cschmAtrI("width"), cschmAtrI("height")]; }
function plotlyAttrs_Axis0() {
    return [ cschmAtrB("visible"), cschmAtrI("color"), cschmAtr("title"), plotlyAttr_TitleFont(),cschmAtrC("type", "", "-,linear,log,date,category")
, cschmAtrC("autorange", "", "true,false,reversed"), cschmAtrC("rangemode", "", "normal,tozero,nonnegative"), cschmAtr0("range", "Axis range, must be array"), cschmAtrB("fixedrange"), cschmAtrC0("scaleanchor", "y,y2,y3,x,x2,x3"), cschmAtrR("scaleratio")
, cschmAtrC0("constrain", "range,domain"), cschmAtrC0("constraintoward", "left,center,right,top,middle,bottom")
, cschmAtrC0("tickmode", "auto,linear,array"), cschmAtrI0("nticks", "integer greater than or equal to 0"), cschmAtr0("tick0", "number or categorical coordinate string"), cschmAtr0("dtick", "number or categorical coordinate string")
, cschmAtr0("tickvals", "data array,Sets the values at which ticks on this axis appear. Only has an effect if `tickmode` is set to array"), cschmAtr0("ticktext", "data array,Sets the text displayed at the ticks position via `tickvals`. Only has an effect if `tickmode` is set to array")
, cschmAtrC0("ticks", "outside,inside"), cschmAtrC0("mirror", "true,ticks,false,all,allticks"), cschmAtrI("ticklen"), cschmAtrI("tickwidth"), cschmAtr("tickcolor"), cschmAtrB("showticklabels")
//spike...ignored
, cschmAtrB("showspikes"), cschmAtr("spikecolor"), cschmAtrI("spikethickness"), cschmAtrCE0("spikedash", "solid,dot,dash,longdash,dashdot")
, cschmAtrCE0("spikemode", "toaxis,across,marker,toaxis+across,across+marker,toaxis+across+marker"), cschmAtrC0("spikesnap", "data,cursor")
, cschmAtr2("tickfont", null, plotlyAttrs_Font()), cschmAtrI("tickangle"), cschmAtrB("autotick")
, cschmAtr("tickprefix"), cschmAtrC0("showtickprefix", "all,first,last,none"), cschmAtr("ticksuffix"), cschmAtrC0("showticksuffix", "all,first,last,none")
, cschmAtrC0("showexponent", "all,first,last,none"), cschmAtrC0("exponentformat", "none,e,E,power,SI,B"), cschmAtrB("separatethousands")
, cschmAtrB("showline"), cschmAtr("linecolor"), cschmAtrR("linewidth"), cschmAtrB("showgrid"), cschmAtr("gridcolor"), cschmAtrR("gridwidth")
, cschmAtrB("zeroline"), cschmAtr("zerolinecolor"), cschmAtrR("zerolinewidth"), cschmAtrC("anchor", "", "free,y,x,y2,y3,x2,x3"), cschmAtrC("side", "", "top,bottom,left,right"), cschmAtrC("overlaying", "", "y,y2,y3,x,x2,x3")
, cschmAtrC0("layer", "above traces,below traces"), plotlyAttr_Domain(), cschmAtrR("position"), cschmAtrC0("categoryorder", "trace,category ascending,category descending,array"), cschmAtr0("categoryarray", "Must be array [,,,]")
, plotlyAttr_Calendar()
]
}
//plotly.js 的chart schema
function plotlyChartSchema() {
    var res = [];
    res.ptyDataName = "name";//資料數列名稱的屬性名
    res.ptyDataX = "x"; res.ptyNameDataY = "y"; res.ptyNameDataZ = "z";
    res.ptyChartType = "type";
    res.push(
         //scatter 散佈圖
        cschmAtr2("scatter","Scatter 散佈圖", plotlyAttrs_Scatter())
         //box 散佈圖
        , cschmAtr2("box", "box 箱型圖", plotlyAttrs_Box())
        , cschmAtr2("bar", "Bar 直條圖", plotlyAttrs_Base0().concat(plotlyAttrs_Bar()))
        ,cschmAtr2("pie", "Pie 甜甜圈", plotlyAttrs_Pie())
        , cschmAtr2("area", "Area區塊圖", plotlyAttrs_Scatter())
        , cschmAtr2("scatter3d","3D Scatter 散佈圖", plotlyAttrs_Scatter())
   )
    for (var i = 0; i < res.length; i++) {
        res[res[i].name] = res[i];//建立索引
    }
    return res;
}
function plotlyAttrs_Area() {
    return plotlyAttrs_Scatter();//area 和scatter 相同
}
function plotlyAttrs_Box() {
    return plotlyAttrs_Scatter().concat(
        [cschmAtrR0("whiskerwidth", "(number between or equal to 0 and 1)")
        ,cschmAtrC0("boxpoints", "all,outliers,suspectedoutliers,false") 
        ,cschmAtrC0("boxmean", "true,sd,false") 
        , cschmAtrR0("jitter", "(number between or equal to 0 and 1)")
        , cschmAtrR0("pointpos", "(number between or equal to -2 and 2)")
        , cschmAtrC0("orientation", "v,h")
        ]
        );//area 和scatter 相同
}
function plotlyAttrs_Pie() {
    return plotlyAttrs_Base0().concat([
     cschmAtrR0("hole", "內圈比率(0~1)") //Sets the fraction of the radius to cut out of the pie. Use this to make a donut chart.
    , cschmAtrB0("sort", "排序")
    , cschmAtrC0("textinfo", "none,label,text,percent,label+text,label+percent,text+percent,text+text+percent")
    , cschmAtrC0("textposition", "none,inside,outside,auto") 
    , cschmAtrC0("direction", "clockwise,counterclockwise", "方向")
    , cschmAtrR0("rotation", "旋轉度數(-360~360)")
    , cschmAtr0("pull", "外圈比率(0~1), 可用array指定各片拉開")
    , plotlyAttr_Pie_Marker()
    ,cschmAtr0("scalegroup")
    , cschmAtr2("textfont", null, plotlyAttrs_Font())
    , cschmAtr2("insidetextfont", null, plotlyAttrs_Font())
    , cschmAtr2("outsidetextfont", null, plotlyAttrs_Font())
    , plotlyAttr_Domain()
    ]).concat(plotlyAttrs_BaseE());
}
function plotlyAttr_Pie_Marker() {
    return cschmAtr2("marker", null, [cschmAtr0("colors", "color array")
, plotlyAttr_LineCW()
    ], "記號");
}
function plotlyAttr_Domain() {
    return cschmAtr2("domain", null, [cschmAtr0("x", "must be empty or an array or arrays of array. ex: [0, 0.5] or [ [0, 0.5], [0.5, 0.8], [0.8,1]]"), cschmAtr0("y", "must be empty or an array or arrays of array. ex: [0, 0.5] or [ [0, 0.5], [0.5, 0.8], [0.8,1]]")]);
}
function plotlyAttr_Legend() {
    return cschmAtr2("legend", null, [cschmAtrR0("x", "-2~3"), cschmAtrC0("xanchor", "auto,left,center,right")
    , cschmAtrR0("y", "-2~3") , cschmAtrC0("yanchor", "auto,top,middle,bottom")
    , cschmAtrC0("traceorder", "normal,reversed,grouped,reversed+grouped")
    , plotlyAttr_Font()
    ,cschmAtr0("bgcolor")
    ,cschmAtr0("bordercolor")
    , cschmAtrI0("borderwidth")
    , cschmAtrC0("orientation", "v\t縱向,h\t橫向", "方向") //tracegroupgap (number greater than or equal to 0) 
    , cschmAtrR0("tracegroupgap", "number greater than or equal to 0,Sets the amount of vertical space (in px) between legend groups.")
    ]
);
}
function plotlyAttr_Annotations() {
    return cschmAtr2("annotations", null, [cschmAtrB("visible")
    , cschmAtrR0("x", "number or categorical coordinate string"), cschmAtrR0("y"), cschmAtrR0("z"), cschmAtrR0("ax"), cschmAtrR0("ay")
    , cschmAtrC0("xanchor", "auto,left,center,right"), cschmAtrR0("xshift")
    , cschmAtrC0("yanchor", "auto,top,middle,bottom"), cschmAtrR0("yshift")
    , cschmAtr0("text"), cschmAtrR0("xangle")
    , cschmAtrR0("width"), cschmAtrR0("height"), cschmAtrR0("opacity")
    , plotlyAttr_Font()
    , cschmAtrC0("align", "left,center,right"), cschmAtrC0("valign", "top,middle,bottom")
    , cschmAtrB("showarrow")
    , cschmAtrR0("arrowhead"), cschmAtrR0("startarrowhead"), cschmAtrC0("arrowside", "none,end,start,end+start")
    , cschmAtrR0("arrowsize"), cschmAtrR0("startarrowsize"), cschmAtrR0("arrowwidth"), cschmAtrR0("standoff"), cschmAtrR0("startstandoff")
    ]
);
}
function plotlyAttrs_Bar() {
    return [cschmAtrC0("orientation", "v\t縱向,h\t橫向", "方向")
        , cschmAtr0("base", "Base"), cschmAtr0("offset", "偏移量"), cschmAtr0("width", "寬度")
        , plotlyAttr_Bar_Marker(), plotlyAttr_TextPosition_Bar()].concat(plotlyAttrs_BaseE());
}
function plotlyAttrs_Scatter() {
    return plotlyAttrs_Base0().concat( [
    cschmAtrC0("mode", "lines,markers,text,lines+markers,lines+text,markers+text,lines+markers+text,none", "數列模式")
    , cschmAtrC0("orientation", "v\t縱向,h\t橫向(X Y軸互換)", "方向")
    , cschmAtr2("line", null, plotlyAttrs_LineCW().concat(plotlyAttrs_LineSSDS()), "線條格式")
    , cschmAtrC0("fill", "none,tozeroy,tozerox,tonexty,tonextx,toself,tonext", "填滿模式")
    , cschmAtr0("fillcolor", "填滿色彩")
    , plotlyAttr_Scatter_Marker()
    , cschmAtrC("hoveron", "hoveron", "points,fills,points+fills")
    , cschmAtrB("connectgaps")
    , plotlyAttr_TextPosition_Scatter()
    , cschmAtrC0("yaxis", "y2,y3", "歸屬的Y軸")
    //, cschmAtrR0("r", "Data array. For polar chart only.Sets the radial coordinates.") 還用不到
    //, cschmAtrR0("t", "Data array. For polar chart only.Sets the angular coordinates.")
    ]).concat(plotlyAttrs_BaseE());
}
function plotlyAttrs_Base0() {
    return [cschmAtrC0("visible", " true,false,legendonly", "可見")
    , cschmAtrB0("showlegend", "顯示圖例")
    , cschmAtr0("legendgroup", "歸屬的圖例群組名")
    , cschmAtrI0("opacity", "不透明度(0~1)")
    ];
}
function plotlyAttrs_BaseE() { //放到最後面的通用屬性
    return [cschmAtrCE("hoverinfo", null, " x,y,z,x+y,x+y+z,text,name,all,none,skip", "hover Info")

    ];
}
function plotlyAttr_Bar_Marker() {
    return cschmAtr2("marker", null, [
        plotlyAttr_Bar_Marker_Line()
    ].concat(plotlyAttrs_Bar_Marker_ColorAttr())
    .concat([cschmAtrB("showscale"), plotlyAttr_Marker_ColorBar()]) // ColorBar不要支援
    );
}
function plotlyAttr_Bar_Marker_Line() {//bar的 marker 的line 屬性
    return cschmAtr2("line", null, [cschmAtrR("width")]
    .concat(plotlyAttrs_Bar_Marker_ColorAttr())
    , "線條格式");
}
function plotlyAttrs_Bar_Marker_ColorAttr() {//bar的 marker 的line 屬性
    return [cschmAtr("color") //
        , cschmAtrB("cauto"), cschmAtrR("cmax"), cschmAtrR("cmin"), cschmAtrB("autocolorscale"), cschmAtrB("reversescale"), cschmAtrR("colorscale")
        ];
}
function plotlyAttr_Marker_ColorBar() {//bar的 marker 的line 屬性
    return cschmAtr2("colorbar", "", [
cschmAtrC("thicknessmode","","fraction,pixels") 
,cschmAtrR("thickness","","Sets the thickness of the color bar This measure excludes the size of the padding, ticks and labels.")
,cschmAtrC0("lenmode","fraction,pixels","Determines whether this color bar's length (i.e. the measure in the color variation direction) is set in units of plot 'fraction' or in 'pixels'. Use `len` to set the value.") 
,cschmAtrI0("len", "Sets the length of the color bar This measure excludes the padding of both ends. That is, the color bar length is this length minus the padding on both ends.")
,cschmAtrR0("x", "number between or equal to -2 and 3, sets the x position of the color bar (in plot fraction)") 
,cschmAtrC0("xanchor", "left,center,right", "Sets this color bar's horizontal position anchor. This anchor binds the `x` position to the 'left', 'center' or 'right' of the color bar.") 
,cschmAtrR0("xpad", "(number greater than or equal to 0) Sets the amount of padding (in px) along the x direction")
,cschmAtrR0("y", "(number between or equal to -2 and 3), Sets the y position of the color bar (in plot fraction).")
,cschmAtrC0("yanchor", "top,middle,bottom" , "Sets this color bar's vertical position anchor This anchor binds the `y` position to the 'top', 'middle' or 'bottom' of the color bar.")
, cschmAtrR0("ypad", "number greater than or equal to 0, Sets the amount of padding (in px) along the y direction.")
, cschmAtr0("outlinecolor", "Sets the axis line color.")
, cschmAtrR0("outlinewidth", "(number greater than or equal to 0) Sets the width (in px) of the axis line.")
,cschmAtr0("bordercolor", "Sets the axis line color.")
, cschmAtrR0("borderwidth", "(number greater than or equal to 0) Sets the width (in px) or the border enclosing this color bar.")
, cschmAtr0("bgcolor", "Sets the color of padded area.")
,cschmAtrC0("tickmode","auto,linear,array" ,"Sets the tick mode for this axis. If 'auto', the number of ticks is set via `nticks`. If 'linear', the placement of the ticks is determined by a starting position `tick0` and a tick step `dtick` ('linear' is the default value if `tick0` and `dtick` are provided). If 'array', the placement of the ticks is set via `tickvals` and the tick text is `ticktext`. ('array' is the default value if `tickvals` is provided).")
, cschmAtrR0("nticks", "(integer greater than or equal to 0) Specifies the maximum number of ticks for the particular axis. The actual number of ticks will be chosen automatically to be less than or equal to `nticks`. Has an effect only if `tickmode` is set to 'auto' ")
    ]
    );
}
function plotlyAttr_LineCW() {
    return cschmAtr2("line", null, plotlyAttrs_LineCW(), "線條格式");
}
function plotlyAttrs_LineCW() {
    return [cschmAtrI0("width", "線寬"), cschmAtr0("color", "顏色")];
}
function plotlyAttrs_LineSSDS() {
    return [cschmAtrC0("shape", "linear,spline,hv,vh,hvh,vhv", "形式")
        , cschmAtrR0("smoothing", "平滑度(0~1.3)")
        , cschmAtrC0("dash", "solid,dot,dash,longdash,dashdot,longdashdot", "虛線形式")
        , cschmAtrB0("simplify", "簡化線條")
    ];
}
function plotlyAttr_TextPosition_Scatter() {
    return cschmAtrC("textposition", "textposition","top left,top center,top right,middle left,middle center,middle right,bottom left,bottom center,bottom right");
}
function plotlyAttr_TextPosition_Bar() {
    return cschmAtrC("textposition", "textposition","inside,outside,auto,none");
}
function plotlyAttr_Marker() {
    return cschmAtr2("marker", null, plotlyAttrs_Marker_Base(), "記號");
}
function plotlyAttr_Scatter_Marker() {
    return cschmAtr2("marker", null, plotlyAttrs_Marker_Scatter(), "記號");
}

function plotlyAttrs_Marker_Base() {
    return [
    cschmAtr0("color", "顏色"), cschmAtr0("size", "大小(px)")
    , cschmAtrR0("opacity", "不透明度(0~1)")
    ];
}
function plotlyAttr_Gradient() { return cschmAtr2("gradient", null, [cschmAtrC0("type", "radial,horizontal", "漸層方式"), cschmAtr0("color", "顏色")]); }
function plotlyAttrs_Marker_Scatter() {
    return [plotlyAttr_Marker_Symbol()
    , cschmAtrR0("opacity", "不透明度(0~1)")
    , cschmAtr0("size", "大小(px)")
    ,cschmAtrR("maxdisplayed")
    ,cschmAtrR("sizeref")
    ,cschmAtrR("sizemin")
    , cschmAtrC0("sizemode", "diameter,area")
    , cschmAtrB("showscale")
    , plotlyAttr_Marker_ColorBar()
    , cschmAtr0("color", "顏色")
    , cschmAtr("colorscale")
    , plotlyAttr_Gradient()
    ];
}
function plotlyAttr_Marker_Symbol() {
    //return cschmAtrC0("symbol"
    //    , "0\tcircle,1\tsquare,2\tdiamond,3\tcross,4\tx,5\ttriangle-up,6\ttriangle-down,7\ttriangle-left,8\ttriangle-right,9\ttriangle-ne,10\ttriangle-se,11\ttriangle-sw,12\ttriangle-nw,13\tpentagon,14\thexagon,15\thexagon2,16\toctagon,17\tstar,18\thexagram,19\tstar-triangle-up,20\tstar-triangle-down,21\tstar-square,22\tstar-diamond,23\tdiamond-tall,24\tdiamond-wide,25\thourglass,26\tbowtie,27\tcircle-cross,28\tcircle-x,29\tsquare-cross,30\tsquare-x,31\tdiamond-cross,32\tdiamond-x,33\tcross-thin,34\tx-thin,35\tasterisk,36\thash,37\ty-up,38\ty-down,39\ty-left,40\ty-right,41\tline-ew,42\tline-ns,43\tline-ne,44\tline-nw"
    //    , "記號型式"
    //)
    return cschmAtrC0("symbol"
        , "circle,square,diamond,cross,x,triangle-up,triangle-down,triangle-left,triangle-right,triangle-ne,triangle-se,triangle-sw,triangle-nw,pentagon,hexagon,hexagon2,octagon,star,hexagram,star-triangle-up,star-triangle-down,star-square,star-diamond,diamond-tall,diamond-wide,hourglass,bowtie,circle-cross,circle-x,square-cross,square-x,diamond-cross,diamond-x,cross-thin,x-thin,asterisk,hash,y-up,y-down,y-left,y-right,line-ew,line-ns,line-ne,line-nw"
        , "記號型式"
    )
}
function showChartDesignerDo(tar, channel) {
    var ky = "chartEDlg" + channel, dg = PROG[ky], oriDesign;
    showItD(dg);
    if (!dg || isHidden(dg)) {
        dg = new geChartDesigner();
        PROG[ky] = dg;
        dg.dlg.moveToRT();
    }
    var kd = "_chartsDesign" + channel;
    if (!tar[kd]) tar[kd] = ChartsSettingUserGet(tar, channel);
    if (!tar[kd]) tar[kd] = {};
    dg.setSource(tar, tar[kd], null, channel);
}
function dlgChartSetAttribute(obj, container) {
    if (dlgChartSetAttribute._initialized == undefined) {
        var po = dlgChartSetAttribute.prototype;
        po.setSource = function (schm, dataSeri) {
            var m = this, schmLst = m.schm, newUI = !schmLst || schmLst.name != schm.name;
            //只有圖表類型有改變時才需要重新建立UI物件
            m.schm = schm;
            if (newUI) m._createUI(schm, m._cntr);
            m._dispatchAttr(m._cntr, dataSeri);
            window.setTimeout(function () { m._reviseInputWdt(m._cntr); }, 50);
        }
        po.setHelpPage = function (url) {
            //注意 這裡物件需要放在m._cntr之外,因為m._cntr 所有的子物件都需要對應到屬性
            var m = this, c = m._cntr.children[0], o = getEmByClass(c, "HelpPage");
            if (!o) { o = newEmH("<a target='helpPage' class='HelpPage' style='margin-left:5px'>help page</a>"); c.insertBefore(o, c.children[0]); }
            o.href =url;
        }
        po._createUI = function (schm, c) {
            c.innerHTML = "";//clear content
            if (!schm) return;
            //每個單獨物件產生一層DIV
            var c0 = c.appendChild(newEm("div"));
            c0._schm = schm;//記住這個容器的schema物件
            if (schm.text) { c0.innerText = schm.text; c0.appendChild(newEm("br")) }//有標題就顯示標題
            c0.className = "attrsObjU";
            c0.onclick=m._evtHnd;
            var sn = schm.name, atrs = schm.attributes;
            var isMarker = sn == "marker"; //plotly.js 對於marker 值的設定有特殊組合規則,無法使用通用的規則套用,只好hard code
            if (atrs) {
                for (var i = 0; i < atrs.length; i++) {
                    var a = atrs[i], n = a.name, x = a.text, cho = a.choice, tp = a.tip, natrs = a.attributes;
                    //每一個屬性用一個div
                    var c1 = c0.appendChild(newEm("div")); c1.className = "attrItem"; //使用className判別 c1.style.display = "inline-block"; 
                    if (tp) c1.title = tp;
                    if (natrs) {
                        this._createUI(a, c1);
                    } else {
                        var c2 = c1.appendChild(newEm("span"));
                        c2.innerText = x + ":";
                        c2 = c1.appendChild(newEm("input")); c2.type = "text";
                        c2.onchange = m._evtHnd; c2.onkeypress = m._evtHnd;
                        c2._attrNm = n;
                        c2._schm = a;
                        if (cho) {
                            setAtr(c2, KW.Choice, cho + ",");
                            addValPickButton(c2);//如果有選項就設定選單按鈕
                            c2.readOnly = !a._editable;
                            c2.onblur = m._evtHnd; //當input 物件是readonly時,使用程式設定value時不會觸發 change 或input事件(兩者只對使用者使用鍵盤輸入有反應),所以需要使用onblur, 
                        }
                        if (isMarker && n=="symbol") {//有額外的選項,下面的input value 順序必須是100 ,200,後面程式碼已假設如此了
                            var c3 = c1.appendChild(newEmH("<span><span class='attrItemOption'><input type='checkbox' value='-open' />-open</span><span class='attrItemOption'><input type='checkbox' value='-dot' />-dot</span></span>"));
                            c3.onclick = m._evtHnd;
                        }
                        if (n.indexOf("color") >= 0 && (!a.dataType || a.dataType == GDT.String)) {
                            var b = c1.appendChild(newEm("button"));
                            b._4SetColor = true;//標記為了設定顏色
                            b.innerText = "...";
                            b.onclick = m._evtHnd;
                            b._tar = c2;
                        }
                    }
                }
            }
        }
        po._reviseInputWdt = function (c) {
            //找出子階物件如果有input (type=text) 才處理
            var chrn = c.children, wdt =0, io;
            for (var i = 0; i < chrn.length; i++) {
                var o = chrn[i];
                if (o.tagName == "INPUT" && o.type == "text") {io=o;}
                else if (o.children.length > 0) { this._reviseInputWdt(o); }
                else wdt += o.offsetWidth;
            }
            if (io) {
                var w =c.clientWidth - wdt - 8;
                if(w > 16 ) io.style.width = w + "px";
            }
        }
        //把屬性物件和UI物件配對,在evtHnd 事件處理程序會用到
        po._dispatchAttr = function (c, dataSeri) {
            var ds = dataSeri;
            var c0 = c.children[0], schm = c0._schm;
            var sn = schm.name, atrs = schm.attributes;
            var isMarker = sn == "marker";
            if (atrs) {
                var chn = c0.children,j=0;
                for (var i = 0; i < atrs.length; i++) {
                    var a = atrs[i], n = a.name, natrs = a.attributes;
                    //從j開始找出class name 是 attrItem的物件 c2._attrNm
                    var c1 = chn[j];
                    while (c1.className != "attrItem") {
                        j++;
                        c1 = chn[j];
                    }
                    if (!c1) break;
                    if (natrs) {
                        if (!ds[n]) ds[n] = {};//不存在時就自動建一個
                        this._dispatchAttr(c1, ds[n]);
                    } else {
                        //找出第一個INPUT tag
                        c2 = getEM(c1, "input")[0];
                        if (c2 && c2._attrNm == n) {
                            c2._attrObj = null;//先清除才不會觸發前一屬性物件值被變更
                            var v = ds[n];
                            if (isMarker && n =="symbol") {
                                //找出所有的checkbox;//數值大的在前
                                var chks = getEMT(c1, "input", "checkbox");
                                chks[0].checked = v && v.indexOf("-open") >0;
                                chks[1].checked = v && v.indexOf("-dot") >0;
                            }
                            c2.value = v != null ? v : "";
                            c2._attrObj = ds;
                            if (n.indexOf("color") >= 0 && (!a.dataType || a.dataType == GDT.String)) {
                                //c2.style.borderColor = v ? v : "";
                                c2.style.backgroundColor = v ? v : "";
                            } else {
                                c2.style.backgroundColor = (v != null) ? "#ffffaa" : "";
                            }
                        }
                    }
                    j++;
                }
            }
        }
        po.evtHnd = function () {
            var m = this, ev = GJT.event(), o = GJT.eventSrc(), ty = ev.type;
            if (ty == "change" || ty == "blur" || (ty == "keypress" && ev.keyCode == 13)) {
                m._getAttrValue(o, o._attrNm == "symbol");
            } else if (ty == "click" && o.type=="checkbox") {
                m._getAttrValue(getEM(o.parentElement.parentElement.parentElement, "input")[0], true);
            } else if (ty == "click") {
                if (o.className == "attrsObjU" && (ev.offsetY < 20 && (o.offsetWidth - ev.offsetX) < 20)) { o.style.height = "20px"; o.className = "attrsObjD"; o.style.overflow = "hidden"; GJT.stopBubble(); }
                else if (o.className == "attrsObjD" && (ev.offsetY < 20 && (o.offsetWidth - ev.offsetX) < 20)) { o.style.height = ""; o.className = "attrsObjU"; o.style.overflow = "" ; GJT.stopBubble();}
                else if (o._4SetColor) m.setColor(o._tar);
            }
        }
        po._getAttrValue = function (o, addOption) {
            var m=this, a = o._attrObj,cr;
            if (a && o._attrNm) {
                var v = o.value, schm = o._schm;
                if (addOption && v) {
                    var chks = getEMT(o.parentElement, "input", "checkbox");
                    v = v.replace(chks[0].value, "");
                    v = v.replace(chks[1].value, "");
                    v += chks[0].checked ? chks[0].value : "";
                    v += chks[1].checked ? chks[1].value : "";
                    o.value = v;
                }
                //如果本層所有屬性都清空了,就把本層主屬性物件移除
                if (v == "") {
                    delete a[o._attrNm];//使用null 屬性仍然會存在,造成JSON.stringify()時仍然有該屬性,故必須移除該屬性
                    cr = "";
                    //檢查同層的所有屬性,如果都已經移除了,就把上一層屬性從上上層物件上移除
                } else {
                    cr = "#ffffaa";
                    if (v == "true") v = true;
                    else if (v == "false") v = false;
                    else if (o._schm && m.isNumber(o._schm.dataType)) v = parseFloat(v);
                    a[o._attrNm] = v; //設定屬性值
                    //如果上層屬性物件不存在就自動新增
                }
                o.style.backgroundColor = cr;
                if (m.hndValueChanged) m.hndValueChanged(o._attrNm, v);// hndAttributeChanged
            }
        }
        po.setColor = function (tar) {
            var m = this, d = PROG._dlgColorOnly, dg;
            if (!d) {
                d = new ColorEditor(m); //, m.dlgCtrl.main
                PROG._dlgColorOnly = d;
                dg = d.dlgCtrl;
                dg.handleClose = function (dg, force) { dg.showMe(1); return true; };
                dg.moveToMouse();
            }
            d.ctrl = m;
            d.setActive(tar);
            //d.setSelection(null);
            dg = d.dlgCtrl;
            d.selectColor(tar, tar.value);
            dg.showMe(); dg.toZTop();
            d.handleAfterSetColor = function (tarUIO, colorText) {
                m.hndAftSetColor.call(m, tarUIO, colorText);
            }
        }
        po.hndAftSetColor = function (tarUIO, colorText) {
            var o=tarUIO, a = o._attrObj;
            o.value = colorText;
            //a[o._attrNm] = colorText;
            this._getAttrValue(o);
            o.style.borderColor = colorText;
        }
        po.isNumber = function (dt) { return dt && (dt == GDT.Integer || dt == GDT.Real || dt == GDT.Short); }
        po.setCaption = function (text) {
            if (this.dlg) this.dlg.setCaption(text);
    }
        dlgChartSetAttribute._initialized = true;
    }
    var c = container;
    var m = this;
    m._evtHnd = function () { m.evtHnd.call(m); }//先產生一個物件,避免每個引用者各自產生一個
    m._evSetColor = function (tar) { m.setColor.call(m, tar) };
    //如果沒有指定container,就自動產生一個dialog
    if (!c) {
        var dg = new DialogInBody("chartAttrr", "Chart Designer", 280,560);
        c = newEm("div");// m.createContents();
        dg.setClient(c);
        m.dlg = dg;
        dg.handleClose = function () { m.dlg.showMe(1); return true; }
        dg.handleResizeDone = function (dg) { m._reviseInputWdt(m._cntr); }
    } else {
        c = c.appendChild(newEm("div"));
    }
    c.className = "ChartAttrDlg";
    m._cntr = c;
}

/*
圖表設計器,搭配資料來源設計圖表定義資料
以樞紐分析表而言,只有計算欄位以及小計總計項目才能夠當成圖表的資料數列的來源,其餘的只能當成數列標籤
這個物件類別應該也可以拿來產生
單一圖表需有的屬性:座標軸X,Y, Y2(副坐標軸)
    標題,圖例,資料數列集合
一組圖表設計可以包含多個不同圖表及不同資料數列,但是欄位schema都應該是同一個(例如一套樞紐分析表設計或者一張資料表格)
現今圖表功能幾乎都支援同一個圖表內有多種形式的資料數列表現,例如同時間有折線和直條甚至散佈點在一個圖表內,因此概念上一張圖表可以設計多個資料數列設定
每個資料數列設定 單獨指定資料來源欄位以及使用的座標軸(plotly支援多組座標軸,每個資料數列設定只能隸屬於指定的座標軸)
*/
function geChartDesigner(container) {
    if (geChartDesigner._initialized == undefined) {
        var po = geChartDesigner.prototype;
        po.createContents = function () {
            var m = this, o = m._cntr, c, i18 = i18nm, clo = GJT.ChartLYOptionsEnum, coe = GJT.ChartOperOptionEnum, doe = GJT.ChartDataSeriesOperOptionEnum, foe = GJT.ChartDataSeriesFilterOperOptionEnum;
            //container之下如果已有其他物件就再獨立創一個容器
            if (o.children.length > 0) c = addChi(o, "div"); else c = o;
            c.className = "ChartDesign";
            //左區塊 欄位選擇清單
            var h = ["<div style='width:100%'><div style='height: auto;margin-bottom:3px;'><input type='checkbox' class='AutoPreview'/>"
            , "Auto <button act='preview'>Preview</button>"
            , "<button act='save' style='float:right;'>Save</button><button act='release' style='float:right;'>Release</button></div>"
            , "<div>"
            , "<button act='tools''>功能...</button>"
            , "<button title='新增一個圖表設定 (add a new chart)' act='addChrt'>", i18.Add.text, "</button>"
			//, "<button title='刪除所選的圖表設計 (delete current chart design)' act='delChrt'>", i18.DeleteData.text, "</button>"
            //, "<button title='複製所選的圖表設計' act='copyChrt'>", "複製", "</button>"
            , "<button title='上移所選的圖表設計 (move current chart design up)' act='movU'>", i18.MoveUp.text, "</button>"
            , "<button title='下移所選的圖表設計 (move current chart design down)' act='movD'>", i18.MoveDown.text, "</button>"
            , "</div>"
            , "<div><select class='ChartList' style='width:100%' size='3'></select></div>"
			, "<div>圖表名稱:<input type='text' isName='Y' style='min-width:50%'  /><button style='float:right;' act='setLYOattr'>擺置設定</button></div>"
            , "<div>圖表標題:<input type='text' isText='Y' style='min-width:50%' /></div>" //<button style='float:right;' act='toJSON'>To JSON</button><button style='float:right;' act='toJSONa'>To JSON (All)</button><button style='float:right;' act='fromJSON'>From JSON</button>
			//, "<div style='display:none;margin-right:20px;' class='JSONarea'><textarea style='width:100%;min-height:60px;' class='jsontextarea'></textarea></div>" //<button act='fromJSON'>From JSON</button><button act='toJSON'>To JSON</button>
			, "<div class='ChartOptions'>"
            , "<span><input type='checkbox' value='", coe.Disabled, "' />停用</span>"
            , "<span><input type='checkbox' value='", coe.AutoPlotAfterQuery, "' />查詢後自動繪製</span>"
            , "<span><input type='checkbox' value='", coe.AutoPlotAfterEdit, "' />修改後立即自動繪製</span>"
            , "<span><input type='checkbox' value='", coe.PlotWholeTable, "' />繪製整張表的資料</span>"
            , "<br/>"
            , "<span><input type='radio' name='shwloc' value='0' />單獨顯示</span>"
            , "<span><input type='radio' name='shwloc' value='", coe.BesideTableR, "' />放在表右</span>"
            , "<span><input type='radio' name='shwloc' value='", coe.BesideTableB, "' />放在表下</span>"
            , "<span><input type='radio' name='shwloc' value='", coe.BesideTableT, "' />放在表上</span>"
            , "<span><input type='radio' name='shwloc' value='", coe.BesideTableL, "' />放在表左</span>"
            , "<br/><span><input type='radio' name='arrangeDir' value='", coe.VerticalArrange, "' />垂直排列</span>"
            , "<span><input type='radio' name='arrangeDir' value='", coe.HorizontalArrange, "' />水平排列</span>"
            //, "</span>"
            , "</div>"
            , "<span title='與資料表並排所佔的空間比例(大於零的任何實數)'>畫面空間占比:<input type='text' class='occupyRate' value='1' style='max-width:60px;' /></span>"
            , "<span class='SubGridSelect' title='如果存在有副表格,可以指定使用副表格繪製圖表'>使用副表格為資料來源:<select class='SubGridList'><option value=''>不使用</option></select></span>"
            , "<div style='margin-top:5px;'>資料數列 格式設定</div>"
            , "<div class='SeriesOp'>"
            , "<button title='新增一個資料數列設定' act='addSeri'>", i18.Add.text, "</button>"
			, "<button title='刪除所選的資料數列設定' act='delSeri'>", i18.DeleteData.text, "</button>"
            , "<button title='複製所選的資料數列設定' act='copySeri'>", "複製", "</button>"
            , "<button style='float:right;' title='上移所選的資料數列設定 (move current series design up)' act='movdsU'>", i18.MoveUp.text, "</button>"
            , "<button style='float:right;' title='下移所選的資料數列設定 (move current series design down)' act='movdsD'>", i18.MoveDown.text, "</button>"
            , "<select class='DataSeriesList' style='width:100%' size='3'></select>"
			, "<div>數列名稱:<input type='text' isNameDS='Y' /><button style='float:right;' act='setDSattr'>設定格式</button></div>"
			, "<div class='DataSeriesOptions'>" //資料數列選項
            , "<span><input type='checkbox' value='", doe.Disabled, "' />停用</span>"
            , "<span><input type='checkbox' value='", doe.HoriDataSeries, "' />橫向數列</span>"
            //, "<span><input type='checkbox' value='", doe.ShowDataPointLabel, "' />顯示數列點標籤</span>"
            , "<span><input type='checkbox' value='", doe.OneColumnXvsOneColumnY, "' title='數列資料一個X軸欄位對應一個Y軸欄位' />X-Y欄位一對一</span>"
            , "<span><input type='checkbox' value='", doe.OneColumnZvsOneColumnY, "' title='數列資料一個Y軸欄位對應一個Z軸欄位' />Y-Z欄位一對一</span>"
            , "<span><input type='checkbox' value='", doe.OneColumnLblvsOneColumnY, "' title='數列資料一個Y軸欄位對應一個標籤欄位' />Y-標籤欄位一對一</span>"
            , "<span class='chkSTTLDS'><input type='checkbox' value='", doe.ForSubTotalData, "' title='指定這個資料數列的資料來自於樞紐分析的小計或總計資料' />這是小計資料</span>"
            , "</div>"
            , "<div class='ChartType'><button act='selCT'>圖表類型</button>:<span class='ChartType'><span class='ChartTypeX'></span></span></div>"
            //Y軸資料數據是主要資料數據可以多個欄位且不執行欄位合併
			, "<div class='selLabel'><button act='selDSS'>小計標籤欄</button><span class='dsSTTLL'></span><button act='selDSA'>小計欄</button><span class='dsSTTLA'></span></div>"
			, "<div><button act='selDSY'>Y軸資料(主)</button><span class='dsAxisY'></span>"
			, "<button act='selDSX'>X軸資料</button><span class='dsAxisX'></span><button act='inpDlmrX'>連接字</button>"
			, "<button act='selDSZ'>Z軸資料</button><span class='dsAxisZ'></span><button act='inpDlmrZ'>連接字</button>"
            , "</div>"
			, "<div><button act='selDSL'>圖例資料</button><span class='dsLegend'></span><button act='inpDlmrL'>連接字</button>"
			, "<button act='selDST'>點標籤</button><span class='dsLabel'></span><button act='inpDlmrT'>連接字</button></div>"
            , "<div style='margin-top:5px;'>資料過濾設定</div>"
            , "<div class='dsFilterOp' >"
                , "<button title='新增一個過濾設定' act='addFilter'>", i18.Add.text, "</button>"
			    , "<button title='刪除所選過濾設定' act='delFilter'>", i18.DeleteData.text, "</button>"
                , "<button title='複製所選的過濾設定' act='copyFilter'>", "複製", "</button>"
                , "<button style='float:right;' title='上移所選的過濾設定 (move current filter design up)' act='movfltU'>", i18.MoveUp.text, "</button>"
                , "<button style='float:right;' title='下移所選的過濾設定 (move current filter design down)' act='movfltD'>", i18.MoveDown.text, "</button>"
                , "<select class='FilterList' style='width:100%' size='2'></select>"
			    , "<div>名稱:<input type='text' isNameF='Y' /></div>"
			    , "<div class='FilterOptions'>" //過濾設定選項
                    , "<span><input type='checkbox' value='", foe.Disabled, "' />停用</span>"
                //, "<span><input type='checkbox' value='", foe.HoriDataSeries, "' />水平(橫向)取數據</span>"
                , "</div>"
                , "<div><button act='selFF'>過濾欄位</button>:<span class='FilterField'></span></div>"
                , "<div>過濾方式:<select class='filterMode' ></select></div>" // <span><input type='checkbox' class='ReverseFilter' value='", GJT.compareModeEnum.Reverse, "' />反轉條件</span>
                , "<div>比較值1:<textarea class='filterValue1' style='width:98%'></textarea></div><div>比較值2:<input type='text' class='filterValue2' /></div>" //
            , "</div>" //End filter op
            , "</div>"
            , "<button act='close'>Close</button>"
			, "</div>"];
            //, "<button act='release' title='Release design to user'>Release</button>"
            c.innerHTML = h.join("");
            var evh = m.evtHnd, er = function () { evh.call(m); };
            setEvtHandleAll(c, er);
            m.nameO = getChiHasAtr(c, "isName", "Y"); m.textO = getChiHasAtr(c, "isText", "Y");
            m.nameO.onchange = er; m.textO.onchange = er;
            m.occupyRateO = getEmByClass(c, "occupyRate");
            m.occupyRateO.onchange = er;
            m.nameDSO = getChiHasAtr(c, "isNameDS", "Y"); m.nameDSO.onchange = er;
            m.nameFO = getChiHasAtr(c, "isNameF", "Y"); m.nameFO.onchange = er;
            showItA(getChiHasAtr(c, "act", "close"), m.dg);//有對話框才需要關閉
            var s0 = getEmByClass(c, "ChartList"), s1 = getEmByClass(c, "DataSeriesList"), s2 = getEmByClass(c, "FilterList");
            s0.onchange = function () { m.setActiveChart.call(m); };
            m.cListO = s0;
            s1.onchange = function () { m.setActiveSeries.call(m); };
            m.sListO = s1;
            s2.onchange = function () { m.setActiveFilter.call(m); };
            m.fListO = s2;
            m.SubGridSelectO = getEmByClass(c, "SubGridSelect");
            m.SubGridListO = getEmByClass(c, "SubGridList");
            m.SubGridListO.onchange = function () { m.setTarGrid.call(m); };

            m.dsSTTLLO = getEmByClass(c, "dsSTTLL");
            m.dsSTTLLAO = getEmByClass(c, "dsSTTLA");
            m.dsAxisXO = getEmByClass(c, "dsAxisX");
            m.dsAxisYO = getEmByClass(c, "dsAxisY");
            m.dsAxisZO = getEmByClass(c, "dsAxisZ");
            m.dsLegendO = getEmByClass(c, "dsLegend");
            m.dsLabelO = getEmByClass(c, "dsLabel");
            m.ChartTypeO = getEmByClass(c, "ChartTypeX");
            m.saveO = getChiHasAtr(c, "act", "save");
            m.ChartOptionsO = getEmByClass(c, "ChartOptions");
            m.DataSeriesOptionsO = getEmByClass(c, "DataSeriesOptions");
            m.FilterOptionsO = getEmByClass(c, "FilterOptions");
            m.FilterFieldO = getEmByClass(c, "FilterField");
            m.filterModeO = getEmByClass(c, "filterMode");
            m.filterModeO.onchange = er;
            m.filterValue1O = getEmByClass(c, "filterValue1");
            m.filterValue1O.onchange = er;
            m.filterValue2O = getEmByClass(c, "filterValue2");
            m.filterValue2O.onchange = er;
            m.AutoPreviewO = getEmByClass(c, "AutoPreview");
            m.jsontextareaO = getEmByClass(c, "jsontextarea");
            //m.ReverseFilterO = getEmByClass(c, "ReverseFilter");
        }
        po.addChart = function (myChart) {
            var m = this, s = m.cListO, r = myChart, chrts = m.dsgn;
            if (!r) {
                r = {};
                //r.DSY = ""; r.DSX = ""; r.DSZ = "";//ChartOperOptionEnum
                r.operOptions = 0;
                r.occupyRate = 1;
                //r.chartType = m.chartTypes()[0].name;
                //預設使用一個資料數列格式設定
                m.addDataSeries(r);
            }
            var mx = chrts.length;
            for (var i = 0; i < chrts.length; i++) {
                var x = parseInt(chrts[i].name.replace("chart ", ""), 10);
                if (!isNaN(x) && x >= mx) mx = x + 1;
            }
            r.name = "chart " + mx;
            r.text = r.name;
            var o = s.appendChild(newEm("option"));
            chrts.push(r);
            o.sur = r;
            o.innerText = r.name;
            o.selected = true;
            m.setActiveChart();
        }
        po.delChart = function () {
            var m = this, ro = m.actChartN;
            if (!ro) return;
            if (!window.confirm("即將刪除所選的設定,請確認")) return;
            var s = m.cListO, chn = s.children, kx = 0;
            s.removeChild(ro);
            for (var i = 0; i < m.dsgn.length; i++) {
                if (m.dsgn[i] == ro.sur) { m.dsgn.splice(i, 1); kx = i; break; }
            }
            if (chn.length > 0) chn[(chn[kx] ? kx : 0)].selected = true;
            this.setActiveChart();
        }
        po.copyChart = function () {
            var m = this, r = m.actChart;
            var nr = JSON.parse(JSON.stringify(r));
            m.addChart(nr);
        }
        po.setTarGrid = function () {
            var m = this, chn = m.SubGridListO.children;
            for (var i = 0; i < chn.length; i++) {
                if (chn[i].selected) {
                    if(m.actChart) m.actChart.tarGrid = chn[i].value;
                }
            }
        }
        po.setActiveChart = function () {
            var m = this, s = m.cListO, chn = s.children;
            m.actChart = null; m.actChartN = null;
            for (var i = 0; i < chn.length; i++) {
                if (chn[i].selected) {
                    m.actChart = chn[i].sur;
                    m.actChartN = chn[i];
                }
            }
            m.showChartInfo(m.actChart);
        }
        po.showChartInfo = function (myChart) {
            var m = this, r = myChart, itms = m.fields, opnE = GJT.ChartOperOptionEnum;
            if (!r) r = m.actChart;
            m.nameO.value = r ? r.name : "";
            m.textO.value = r ? lySX(r.text) : "";
            m.occupyRateO.value = r ? lySX(r.occupyRate) : "";
            m.setOptionsUI(r ? r.operOptions :0, m.ChartOptionsO);
            m.showSeriesToList(r);
            m.setLYOattrAuto();
            chn = m.SubGridListO.children;
            for (var i = 0; i < chn.length; i++) {
                if (i==0 || (r && r.tarGrid == chn[i].value)) chn[i].selected = true;//預設第一個
            }
        }
        //新增資料數列格式物件, r圖表設定物件,允許任意多個數列格式,製作圖表時依序套用
        po.addDataSeries = function (r,ds) {
            var m = this, sL = m.sListO; if (!r) r = m.actChart;
            if (!ds) ds = {};
            var dss =r.dataSchms;
            if (!dss) { dss = []; r.dataSchms = dss; }
            var mx = dss.length;
            for (var i = 0; i < dss.length; i++) {
                var x = parseInt(dss[i].dsName.replace("series ", ""), 10);
                if (!isNaN(x) && x >= mx) mx = x + 1;
            }
            ds.dsName = "series " + mx;
            if (ds.operOptions == undefined) ds.operOptions = 0;
            if(!ds.chartType) ds.chartType = m.chartTypes()[0].name;//預設使用第一個
            dss.push(ds);
            var o = sL.appendChild(newEm("option"));
            o.sur = ds;
            o.innerText = ds.dsName;
            o.selected = true;
            m.setActiveSeries();
        }
        po.delDataSeries = function (r) {
            var m = this, so = m.actSeriesN;
            if (!so) return;
            if (!r) r = m.actChart;
            var s = m.sListO, chn = s.children, kx = 0, dss = r.dataSchms;
            if (dss.length < 2) return alert("資料數列設定最少需要一筆!");
            if (!window.confirm("即將刪除所選的設定,請確認")) return;
            s.removeChild(so);
            for (var i = 0; i < dss.length; i++) {
                if (dss[i] == so.sur) { dss.splice(i, 1); kx = i; break; }
            }
            if (chn.length > 0) chn[(chn[kx] ? kx : 0)].selected = true;
            this.setActiveSeries();
        }
        po.copyDataSeries = function () {
            var m = this, r = m.actChart, ds = m.actSeries;
            var dsn = JSON.parse(JSON.stringify(ds));
            m.addDataSeries(r, dsn);
        }
        po.setActiveSeries = function () {
            var m = this, s = m.sListO, chn = s.children, ds;
            m.actSeries = null;
            for (var i = 0; i < chn.length; i++) {
                if (chn[i].selected) {
                    ds=chn[i].sur;
                    m.actSeries = ds;
                    m.actSeriesN = chn[i];
                }
            }
            m.showSeriesInfo();
        }
        po.showSeriesInfo = function () {
            var m = this, ds = m.actSeries, r = m.actChart, itms = m.fields, itms2 = itms, itms3=itms, sblg = m._sur.siblingGrids, issttl;
            if (!r) return;
            if (r.tarGrid && sblg) {//如果有指定來源副表格
                var ix = Number(r.tarGrid), g = sblg[ix];
                if (g && g.fieldsAll) {
                    itms = g.fieldsAll; itms2 = itms;
                    issttl = hasBit(ds.operOptions, GJT.ChartDataSeriesOperOptionEnum.ForSubTotalData);
                    if (issttl) {//需要隨不同的目標小計欄位而改變可用欄位
                        itms2 = g.labels4STTL;
                        var itm = ds.DSS ? itms2.collect(ds.DSS)[0] : null;
                        itms = g.getFieldsForSTTL(itm ? itm.name : null);
                        itms3 = g.getFieldsForSTTL(itm ? itm.name : null, 1);
                    }
                }
            }
            showItA(getEmByClass(m.DataSeriesOptionsO,"chkSTTLDS"), sblg);
            showItA(getEmByClass(m._cntr, "selLabel"), issttl);
            if (ds) {
                m.nameDSO.value = ds.dsName;
                m.setOptionsUI(ds.operOptions, m.DataSeriesOptionsO);
                m.dsSTTLLO.innerText = ds.DSS ? lySX(itms2.collect(ds.DSS).getNames(",", 0, 0, 1)) : "";
                m.dsSTTLLAO.innerText = ds.DSA ? lySX(itms3.collect(ds.DSA).getNames(",", 0, 0, 1)) : "";
                m.dsAxisXO.innerText = ds.DSX ? lySX(itms.collect(ds.DSX).getNames(",", 0, 0, 1)) : "";
                m.dsAxisYO.innerHTML = ds.DSY ? lySX(itms.collect(ds.DSY).getNames(",", 0, 0, 1)) : "";
                m.dsAxisZO.innerText = ds.DSZ ? lySX(itms.collect(ds.DSZ).getNames(",", 0, 0, 1)) : "";
                m.dsLegendO.innerText = ds.DSL ? lySX(itms.collect(ds.DSL).getNames(",", 0, 0, 1)) : "";
                m.dsLabelO.innerText = ds.DST ? lySX(itms.collect(ds.DST).getNames(",", 0, 0, 1)) : "";

                m.ChartTypeO.innerText = ds.chartType ? m.chartTypes()[ds.chartType].text : "";
                m.ChartTypeO.className = ds.chartType;
                m.setDSattrAuto();
                m.previewAuto();

            } else {
                m.nameDSO.innerText = "";
                m.setOptionsUI(0, m.DataSeriesOptionsO);//清除選項UI表現
                m.dsSTTLLO.innerText = "";
                m.dsSTTLLAO.innerText = "";
                m.dsAxisXO.innerText = "";
                m.dsAxisYO.innerHTML = "";
                m.dsAxisZO.innerText = "";
                m.dsLegendO.innerText = "";
                m.dsLabelO.innerText = "";
                m.ChartTypeO.innerText = "";
                m.ChartTypeO.className = "";
            }
            var rr = [m.dsAxisXO, m.dsAxisZO, m.dsLegendO, m.dsLabelO];//Y軸不支援合併欄位
            for (var i = 0; i < rr.length; i++) {
                var n = rr[i];
                var n2 = n.nextSibling;//設定連接字串的按鈕
                if(n2) showItA(n2,n.innerText.indexOf(",")>-1);
            }
            m.showFiltersToList();
        }
        po.showSeriesToList = function (r) {
            var m = this, s = m.sListO;
            if (!r) r = m.actChart;
            while (s.children.length > 0) { s.removeChild(s.children[0]); }
            if (r) {
                var ds = r.dataSchms;
                if (ds) {
                    for (var i = 0; i < ds.length; i++) {
                        var o = s.appendChild(newEm("OPTION"));
                        o.innerText = ds[i].dsName;
                        o.sur = ds[i];
                        if (i == 0) o.selected = true;
                }
            }
            }
            m.setActiveSeries();
        }
        po.addFilter = function (ds,fr) {
            var m = this, sL = m.fListO; if (!ds) ds = m.actSeries;
            if (!fr) fr = {};
            var frs =ds.filters;
            if (!frs) { frs = []; ds.filters = frs; }
            var mx = frs.length;
            for (var i = 0; i < frs.length; i++) {
                var x = parseInt(frs[i].fltName.replace("filter ", ""), 10);
                if (!isNaN(x) && x >= mx) mx = x + 1;
            }
            fr.fltName = "filter " + mx;
            fr.operOptions = 0;
            fr.filterMode = GJT.compareModeEnum.NotDefined;
            frs.push(fr);
            var o = sL.appendChild(newEm("option"));
            o.sur = fr;
            o.innerText = fr.fltName;
            o.selected = true;
            m.setActiveFilter();
        }
        po.delFilter = function (ds) {
            var m = this, fo = m.actFilterN;
            if (!fo) return;
            if (!ds) ds = m.actSeries;
            var s = m.fListO, chn = s.children, kx = 0, frs = ds.filters;
            if (!window.confirm("即將刪除所選的設定,請確認")) return;
            s.removeChild(fo);
            for (var i = 0; i < frs.length; i++) {
                if (frs[i] == fo.sur) { frs.splice(i, 1); kx = i; break; }
            }
            if (chn.length > 0) chn[(chn[kx] ? kx : 0)].selected = true;
            this.setActiveFilter();
        }
        po.copyFilter = function () {
            var m = this, ds = m.actSeries, fr = m.actFilter;
            var frn = JSON.parse(JSON.stringify(fr));
            m.addFilter(ds, frn);
        }
         po.setActiveFilter = function () {
            var m = this, s = m.fListO, chn = s.children, ds;
            m.actFilter = null;m.actFilterN = null;
            for (var i = 0; i < chn.length; i++) {
                if(chn[i].selected) {
                    ds=chn[i].sur;
                    m.actFilter = ds;
                    m.actFilterN = chn[i];
                }
            }
            m.showFilterInfo();
        }
         po.showFilterInfo = function () {
             var m = this, fr = m.actFilter, itms = m.fields, fmo = m.filterModeO, e = teChartFilterCompareModeEnum;
            if(fr) {
                m.nameFO.value = fr.fltName;
                m.setOptionsUI(fr.operOptions, m.FilterOptionsO);
                m.FilterFieldO.innerText = fr.field ? lySX(itms.collect(fr.field).getNames(",", 0, 0, 1)) : "";
                if (fmo.children.length == 0) {//故意把建立UI項目寫在這裡比較容易維護
                    var fms = ["在清單內", e.IL, "在清單內(開頭相同)", e.ILL
                        , "大於", e.G, "大於或等於", e.GE
                        , "小於", e.S, "小於或等於", e.SE
                        , "等於", e.E, "介於", e.B, "介於(不含)", e.BX, "開頭相同",e.L
                        , "不在清單內", e.NIL, "不在清單內(開頭相同)", e.NILL
                        //, "不大於", e.NG, "不大於且不等於", e.NGE
                        //, "不小於", e.NS, "不小於且不等於", e.NSE
                        , "不等於", e.NE, "不介於", e.NB, "不介於(不含)", e.NBX
                        , "未定", e.NotDefnied
                    ];
                    for (var i = 0; i < fms.length; i+=2) {
                        var o = newEm("OPTION");
                        o.innerText = fms[i];
                        o.value = fms[i + 1];
                        fmo.appendChild(o);
                    }
                }
                var fmd = parseInt(fr.filterMode, 10);
                for (var i = 0; i < fmo.children.length; i++) {
                    var o = fmo.children[i];
                    if (o.value == fmd) o.selected = true;
                    if(!fr.filterMode && o.value == e.NotDefnied) o.selected = true;
                }
                m.filterValue1O.value = fr.value1 != null ? fr.value1 : "";
                m.filterValue2O.value = fr.value2 != null ? fr.value2 : "";
            } else {
                m.nameFO.innerText = "";
                m.setOptionsUI(0, m.FilterOptionsO);//清除選項UI表現
                m.FilterFieldO.innerText = "";
                fmo.value = e.NotDefnied;
                m.filterValue1O.value = "";
                m.filterValue2O.value = "";
                //m.ReverseFilterO.checked = false;
            }
        }
        po.showFiltersToList = function (ds) {
            var m = this, s = m.fListO;
            if (!ds) ds = m.actSeries;
            while (s.children.length > 0) {
                s.removeChild(s.children[0]);
            }
            if (ds) {
                var fr = ds.filters;
                if (fr) {
                    for (var i = 0; i < fr.length; i++) {
                        var o = s.appendChild(newEm("OPTION"));
                        o.innerText = fr[i].fltName;
                        o.sur = fr[i];
                        if (i == 0) o.selected = true;
                    }
                }
            }
            m.setActiveFilter();
        }
        po.setLYOattr = function () {
            var m = this, r = m.actChart;
            if (!r) return alert("Add a chart before this action!");
            var d = m.dlgLYOAttr;
            if (!d) { d = new dlgChartSetAttribute();
                m.dlgLYOAttr = d;
                //if (d.dlg) d.dlg.moveToMouse();
                var refDlg = m.dlgCtSAttr ?m.dlgCtSAttr.dlg : null;
                if (!refDlg || isHidden(refDlg)) refDlg = m.dlg;
                if (refDlg && d.dlg) d.dlg.moveBesideAnother(refDlg,"L");

                d.hndValueChanged = function (atrNm, atrVal) { m.hndAttributeChanged.call(m, atrNm, atrVal);};
            }
            if (d.dlg) { d.dlg.showMe(); d.setCaption(r.name + " _ Layout"); }
            if (!r.layout) r.layout = {};
            var schm = m.layoutSchema();
            d.setSource(schm, r.layout);
            d.setHelpPage("https://plot.ly/javascript/reference/#layout");
        }
        po.setLYOattrAuto = function () {
            var m = this;
            var d = m.dlgLYOAttr;
            if (!d) return;
            if (!d.dlg || !isHidden(d.dlg)) m.setLYOattr();
        }
        //顯示圖表設定物件的屬性對話框, r是目標圖表設定物件
        po.setDSattr = function () {
            var m = this, r = m.actChart, ds = m.actSeries;
            if (!ds) return alert("Add a data series before this action!");
            var d = m.dlgCtSAttr;
            if (!d) { d = new dlgChartSetAttribute();
                m.dlgCtSAttr = d;
                //if (d.dlg) d.dlg.moveToMouse();
                var refDlg = m.dlgLYOAttr ? m.dlgLYOAttr.dlg : null;
                if (!refDlg || isHidden(refDlg)) refDlg = m.dlg;
                if (refDlg && d.dlg) d.dlg.moveBesideAnother(refDlg, "L");
                d.hndValueChanged = function (atrNm, atrVal) { m.hndAttributeChanged.call(m, atrNm, atrVal); };
            }
            if (d.dlg) { d.dlg.showMe(); d.setCaption(r.name + " - " + ds.dsName); }
            var schm=m.chartTypes()[ds.chartType];
            d.setSource(schm, ds);
            d.setHelpPage("https://plot.ly/javascript/reference/#" +ds.chartType);
        }
        po.setDSattrAuto = function () {
            var m = this;
            var d = m.dlgCtSAttr;
            if (!d) return;
            if (!d.dlg || !isHidden(d.dlg)) m.setDSattr();
        }
        //依照指定值設定UI物件
        po.setOptionsUI = function (optn, c) {
            var inps = getEM(c, "INPUT");
            for (var i = 0; i < inps.length; i++) {
                var v = parseInt(inps[i].value, 10); if (isNaN(v)) continue;
                inps[i].checked = ((optn & v) == v);
            }
        }
        po.getOptionsByUI = function (c) {
            var optn = 0, inps = getEM(c, "INPUT");
            for (var i = 0; i < inps.length; i++) {
                var v = parseInt(inps[i].value, 10); if (isNaN(v)) continue;
                if (inps[i].checked) optn = optn | v;
            }
            return optn;
        }
        po.evtHnd = function () {
            var ev = GJT.event(); if (!ev) return;
            var m = this, r = m.actChart, o = GJT.eventSrc(), ty = ev.type;
            if (ty == "change") {
                if (!r) return alert("Please add chart before any action!");
                if (o == m.nameO) {
                    r.name = o.value;
                    m.actChartN.innerText = r.name;
                }
                if (o == m.nameDSO) {
                    m.actSeriesN.innerText = o.value;
                    m.actSeries.dsName = o.value;
                }
                if (o == m.nameFO) {
                    m.actFilterN.innerText = o.value;
                    m.actFilter.fltName = o.value;
                }
                if (o == m.filterModeO) {
                    if(m.actFilter) m.actFilter.filterMode = o.value;
                }
                if (o == m.textO) r.text = o.value;
                if (o == m.occupyRateO) r.occupyRate = o.value;
                if (o == m.cListO) m.setActiveChart();
                if (o == m.filterValue1O) { if (m.actFilter) m.actFilter.value1 = o.value; }
                if (o == m.filterValue2O) { if (m.actFilter) m.actFilter.value2 = o.value; }
            }
            else if (ty == "click") {
                var ac = xGetAtr(o, "act");
                if (!ac) {
                    //if (o == m.ReverseFilterO) {
                    //    var fr = m.actFilter; if (!fr) return;
                    //    var fmd = parseInt(fr.filterMode, 10), fv = parseInt(o.value, 10);
                    //    fmd = fmd | fv;
                    //    if (!o.checked) fmd = fmd ^ fv;
                    //    fr.filterMode = fmd;
                    //}
                    if (o.tagName == "INPUT") {
                        var p = o.parentElement;
                        while (p) {//
                            if (p == m.DataSeriesOptionsO && m.actSeries) {
                                var opn = m.getOptionsByUI(m.DataSeriesOptionsO);m.actSeries.operOptions = opn; m.previewAuto();
                                showItA(getEmByClass(m._cntr, "selLabel"), hasBit(opn, GJT.ChartDataSeriesOperOptionEnum.ForSubTotalData));
                            } else if (p == m.ChartOptionsO && m.actChart) { m.actChart.operOptions = m.getOptionsByUI(m.ChartOptionsO); }
                            else if (p == m.FilterOptionsO && m.actFilter) { m.actFilter.operOptions = m.getOptionsByUI(m.FilterOptionsO); m.previewAuto(); }
                            p = p.parentElement;
                        }
                    }
                    return;
                }
                if (ac == "addChrt") return m.addChart();
                if (ac == "tools") return m._tools();
                if (!r) return alert("Please add a chart design before any action!");
                if (ac == "movU") m.movU(1);
                if (ac == "movD") m.movU(-1);
                if (ac == "delChrt") return m.delChart();
                if (ac == "copyChrt") return m.copyChart();
                if (ac == "selDSX") return m.selDS(1);
                if (ac == "selDSY") return m.selDS(2);
                if (ac == "selDSZ") return m.selDS(3);
                if (ac == "selDSL") return m.selDS(4);
                if (ac == "selDST") return m.selDS(5);
                if (ac == "selDSS") return m.selDS(6);
                if (ac == "selDSA") return m.selDS(7);
                if (ac == "selFF") return m.selDS(10);
                if (ac == "selCT") return m.selCT(0);
                if (ac == "addSeri") { m.addDataSeries(); }
                if (ac == "delSeri") { m.delDataSeries(); }
                if (ac == "copySeri") { m.copyDataSeries(); }
                if (ac == "movdsU") m.movdsU(1);
                if (ac == "movdsD") m.movdsU(-1);
                if (ac == "setDSattr") m.setDSattr();
                if (ac == "setLYOattr") m.setLYOattr();
                if (ac == "addFilter") { m.addFilter(); }
                if (ac == "delFilter") { m.delFilter(); }
                if (ac == "copyFilter") { m.copyFilter(); }
                if (ac == "movfltU") m.movfltU(1);
                if (ac == "movfltD") m.movfltU(-1);
                if (ac == "save") m.save();
                if (ac == "release") m.release();
                if (ac == "fromJSON") { m.opJSON(0); }
                if (ac == "toJSON") { m.opJSON(1); }
                if (ac == "toJSONa") { m.opJSON(1,1); }
                if (ac == "preview") { m.preview(); }
                if (ac.indexOf("inpDlmr")==0){ m.inpDlmr(ac.substring(7)); }
                if (ac == "close") { }
            }
            else if (ty == "keyup") {
                if (o == m.nameO && r) {
                    r.name = o.value;
                    m.actChartN.innerText = r.name;
                }
            }
        }
        po.setSource = function (surObj, oriDesign, sourceFields, channel) {//設定可供設計圖表的參數條件,資料欄位,已經存在的設計資料
            var m = this, s = m.cListO, odn = oriDesign;
            m.channel = channel;
            showItA(m.saveO, m.channel);
            showItA(getChiHasAtr(m._cntr, "act", "release"), m.channel == "D");
            if (!sourceFields && surObj.fieldsAll) sourceFields = surObj.fieldsAll;
            m.fields = sourceFields;
            m._sur = surObj;
            var sibgs = surObj.siblingGrids,sgl =m.SubGridListO;
            showItA(m.SubGridSelectO, sibgs);
            showItA(sgl, sibgs);
            while (sgl.children.length > 1) { sgl.removeChild(sgl.children[1]); }
            if (sibgs) {
                for (var i = 0; i < sibgs.length; i++) {
                    var o = sgl.appendChild(newEm("option"));
                    o.innerText = i + 1 + ""; o.value = i + "";
                }
            }
            if (m.dlg) m.dlg.setCaption("Chart Design " + channel + " " + surObj.text);
            var dso = odn;
            //圖表設計仍然還是不可以直接用Array紀錄,應該另外用一個屬性紀錄比較有功能擴充的彈性
            if (odn instanceof Array) dso = { charts: odn };
            var chts = dso.charts;
            if (!chts) { chts = []; dso.charts = chts; }
            m.dso = dso;
            m.dsgn = chts;
            if (!odn) return alert("No Design object (must be array)");
            while (s.children.length > 0) { s.removeChild(s.children[0]); }
            for (var i = 0; i < chts.length; i++) {
                var r = chts[i];
                var o = s.appendChild(newEm("option"));
                o.sur = r;
                o.innerText = r.name;
                o.selected = i == 0;
            }
            m.setActiveChart();
        }
        po.hndpvwResized = function (dg) {
            var m = this;
            try {
                var r = m.actChart;
                if (r && r.layout && (r.layout.width && r.layout.height)) return;//如果有設定高 寬就不要resize
                if (Plotly != undefined && m.divPreview._teplotter) Plotly.Plots.resize(m.divPreview);//因為tePlotChartGo這個function 會在帶入的container內自動再建立一個container
                //tePlotChartGo(m._sur, [m.actChart], m.divPreview, 1);
            } catch (ex) {
                document.title = Math.random();
            }
        }
        po.inpDlmr = function (axisID) {
            var ds = this.actSeries, ky = "colDlmr" + axisID;
            var v = ds[ky]; if (v == undefined) v = "|";
            var nv = window.prompt("Input delimiter for column", v);
            if (nv == null) return;
            ds[ky] = nv;
        }
        po.selCT = function () {
            var m = this, cts = m.chartTypes(), ds = m.actSeries;
            if (!ds) return alert("Select a active Data series design before this action!");
            //使用popup選單
            cts.tarObj = ds;
            cts.onclick = m.prcsSelCT;
            cts.ctrl = m;
            SysShowMenu(cts);
        }
        po.prcsSelCT = function (itm, itms) {
            var ds = itms.tarObj;
            ds.chartType = itm.name;
            itms.ctrl.showSeriesInfo();
        }
        po.dsfGet = function (ds, md) {
            if (md == 1) return ds.DSX;
            if (md == 2) return ds.DSY;
            if (md == 3) return ds.DSZ;
            if (md == 4) return ds.DSL;
            if (md == 5) return ds.DST;
            if (md == 6) return ds.DSS;
            if (md == 7) return ds.DSA;
            if (md == 10) return ds.field;
        }
        po.dsfSet = function (ds, md , dsf) {
            if (md == 1) ds.DSX = dsf;
            if (md == 2) ds.DSY = dsf;
            if (md == 3) ds.DSZ = dsf;
            if (md == 4) ds.DSL = dsf;
            if (md == 5) ds.DST = dsf;
            if (md == 6) ds.DSS = dsf;
            if (md == 7) ds.DSA = dsf;
            if (md == 10) ds.field = dsf;
        }
        po.selDS = function (md) {
            var m = this, itms = m.fields, ds = m.actSeries, flds, txt, dsf, r = m.actChart,sblg = m._sur.siblingGrids;
            if (r.tarGrid && sblg) {//如果有指定來源副表格
                var ix = Number(r.tarGrid), g=sblg[ix];
                if (g && g.fieldsAll) {
                    itms = g.fieldsAll;
                    if (g.getFieldsForSTTL && ds && hasBit(ds.operOptions, GJT.ChartDataSeriesOperOptionEnum.ForSubTotalData)) {
                        if (md == 6) itms = g.labels4STTL;
                        else if (md==7) itms = g.getFieldsForSTTL(ds.DSS, 1);
                        else itms = g.getFieldsForSTTL(ds.DSS);
                    }
                }
            }
            if (md > 9) ds = m.actFilter;//Filter
            if(!ds) return alert("Select a data series item before this action!");
            dsf = m.dsfGet(ds, md);
            if (dsf) flds = itms.collect(dsf); else flds = new OpItems();
            var so = selItems("selFlds", "Select fields", itms, flds, null, 600, m.prcsSelDS, 1, 1);
            so.tarObj = m; so.selMode = md;
            dg = so.dlgCtrl.dlg; dg.besideMouse = 1;
            so.setModal(true);
        }
        po.prcsSelDS = function (selector) {
            var so = selector, m = so.tarObj, ds = m.actSeries, flds = so.itemsSelected, md = so.selMode, dsf;
            if (md > 9) ds = m.actFilter;//Filter
            dsf = flds.getNames(",");
            if ((md > 9 || md == 6) && flds.length > 1) { alert("Only first one field will be used!"); dsf = flds[0].name; }
            m.dsfSet(ds, md, dsf);
            if (md > 9) m.showFilterInfo();
            else m.showSeriesInfo();
        }
        po.movfltU = function (step) {
            var m = this, ds = m.actSeries, o = m.actFilterN, o1, o2, a = ds.filters, p = o ? o.parentNode : null;
            if (!ds || a.length < 2 || !p) return;
            if (step > 0) { o1 = o; o2 = o.previousSibling; }
            else { o1 = o.nextSibling; o2 = o; }
            if (!o1 || !o2) return;
            p.insertBefore(o1, o2);
            for (var i = 0, chn = p.children; i < a.length; i++) {
                a[i] = chn[i].sur;
            }
        }
        po.movdsU = function (step) {
            var m = this, r = m.actChart, o = m.actSeriesN, o1, o2, a = r.dataSchms, p = o ? o.parentNode : null;
            if (!r || a.length < 2 || !p) return;
            if (step > 0) { o1 = o; o2 = o.previousSibling; }
            else { o1 = o.nextSibling; o2 = o; }
            if (!o1 || !o2) return;
            p.insertBefore(o1, o2);
            for (var i = 0, chn = p.children; i < a.length; i++) {
                a[i] = chn[i].sur;
            }
        }
        po.movU = function (step) {
            var m = this, r = m.actChart, o = m.actChartN, o1, o2, a = m.dsgn, p = o ? o.parentNode : null;
            if (!r || a.length < 2 || !p) return;
            if (step > 0) { o1 = o; o2 = o.previousSibling; } //previousSibling; if (!b || b.tagName != "BR") b = a.nextSibling;
            else { o1 = o.nextSibling; o2 = o; }
            if (!o1 || !o2) return;
            p.insertBefore(o1, o2);
            for (var i = 0, chn = p.children; i < a.length; i++) {
                a[i] = chn[i].sur;
            }
        }
        po.hndAttributeChanged = function (atrName, atrNewVa) {this.previewAuto();}
        po.previewAuto = function () {
            var m = this;
            if (!m.AutoPreviewO || !m.AutoPreviewO.checked) return;
            if (!isHidden(m.dlgpvw)) m.preview();
        }
        po.preview = function () {
            var m = this;
            if (!LoadScript("js/sunUtilPlotChart.js?v=" + getJSver())) { return setTimeout(function () { m.preview.call(m); }, 1000); }
            try {
                var k = GridEditChartDialog.prototype;
                if (!startPlotly() || Plotly == undefined) return setTimeout(function () { m.preview.call(m); }, 1000);
            }
            catch (ex) {
                return alert("Failed to load program! Please try again later");
            }
            var dg = m.dlgpvw;
            if (!dg || dg.isDestroyed()) {
                dg = new DialogInBody("chartPreview", "Chart preview", 640, 500);
                m.dlgpvw = dg;
                var dv = newEm("div");
                m.divPreview = dv;
                dg.setClient(dv);
                dg.handleResizeDone = function (dg) { m.hndpvwResized.call(m, dg); };
                dg.overflow = "hidden";
                window.setTimeout(function () { dg.moveToLB() },100);
            }
            var r=m.minifyJSON(m.actChart);
            if (r && r.layout && (r.layout.width && r.layout.height)) dg.overflow = "";
            else dg.overflow = "hidden";
            dg.showMe();
            tePlotChartGo(m._sur, r, m.divPreview, 1);
        }
        po.opJSON = function (toJSON, forAll) {
            var m = this, r = m.actChart, dg = m.dlgjson;
            if (!dg || dg.isDestroyed()) {
                dg = new DialogInBody("jsontxt", "JSON of charts", 400, 600);
                m.dlgjson = dg;
                dg.overflow = "hidden";
                var dv = newEm("div"); dv.innerHTML = "<textarea style='width:99%;height:99%;'></textarea>";
                dg.setClient(dv);
                showInCenter(dg);
            }
            if (toJSON) {
                if (!r) return alert("No chart selected!");
                var txo = getEM(dg.getClient(), "textarea")[0];
                var tar = forAll ? m.dsgn : r;
                 txo.value = JSON.stringify(m.minifyJSON(tar));
            } else if (dg) {
                var txo = getEM(dg.getClient(), "textarea")[0];
                var tx = txo.value;
                if (!tx) return alert("Please paste JSON text into the text box prompted, then do this action again.");
                if (!window.confirm("You are going to add charts by JSON text. New charts design will be added!")) return;
                try{
                    var nc = JSON.parse(tx);
                    if (!(nc instanceof Array)) nc = [nc];
                    for (var i = 0; i < nc.length;i++){
                        m.addChart(nc[i]);
                    }
                } catch (ex) { alert(ex.message);}
            }
        }
        po._tools = function () {
            var m = this, itms = new OpItems();
            itms.add(NIT("addChrt", "新增一個圖表設計 Add new chart"));
            itms.add(NIT("copyChrt", "複製 所選的圖表設計 Copy chart"));
            itms.add(NIT("delChrt", "刪除 所選的圖表設計 Delete chart"));
            itms.add(NIT("layoutdesign", "多圖表排列設計 Charts layout design"));
            itms.add(NIT("-", "-"));
            itms.add(NIT("toJSON", "產生JSON字串(單一圖表設計)"));
            itms.add(NIT("toJSONa", "產生JSON字串(所有圖表設計)"));
            itms.add(NIT("fromJSON", "以JSON字串轉成圖表設計"));
            itms.add(NIT("-", "-"));
            itms.add(NIT("release", "發佈所有圖表設計Release"));
            itms.onclick = m._tools2;
            itms.ctrl = m;
            SysShowMenu(itms);

        }
        po._tools2 = function (itm, itms) {
            MenuHide();
            var m = itms.ctrl, nm = itm.name;
            if (nm == "addChrt") m.addChart();
            if (nm == "delChrt") m.delChart();
            if (nm == "copyChrt") return m.copyChart();
            if (nm == "layoutdesign") return m.layoutDesign();
            if (nm == "fromJSON") return m.opJSON(0);
            if (nm == "toJSON") return m.opJSON(1);
            if (nm == "toJSONa") return m.opJSON(1, 1);
            if (nm == "release") m.release();

        }
        po.layoutDesign = function () {
            var m = this, dso = m.dso, map = dso.layout, coe = GJT.ChartOperOptionEnum;
            if (!map) { map = {}; dso.layout = map }
            var itms = new OpItems();
            //加入grid & charts
            for (var i = 0; i < m.dsgn.length; i++) {
                var c = m.dsgn[i];
                //停用的不要加入
                if (!hasBit(c.operOptions, coe.Disabled)) itms.add(c);
            }
            if (itms.length==0) return alert("No chart is set to show by layout design!");
            itms.add(m._sur);
            showLayoutDesignerDo(m._sur, itms, "D");
        }
        po.save = function (channel) {
            var m = this, res = [];
            for (var i = 0; i < m.dsgn.length; i++) {
                res[i] = m.minifyJSON(m.dsgn[i]);
            }
            var dso = JSON.parse(JSON.stringify(m.dso));//置換charts
            dso.charts = res;
            if (!channel) channel = m.channel;
            ChartsSettingUserSave(m._sur, dso, channel);
        }
        po.release = function () {
            if (!window.confirm("This action is going to release your design to user. Plese confirm this.")) return;
            this.save("R");
        }
        po.minifyJSON = function (attrO) {
            //plotly 某些屬性物件不存在 與 存在但是沒有任何設定的 意義不同 (如trace.colorbar == undefined 與trace.colorbar={} 結果不同, trace.colorbar == undefined不會顯示Color Bar,但是trace.colorbar={}卻會顯示預設模式的Color Bar出來 )
            //所以這裡自動清除不具任何屬性key的物件,用來存檔以及preview
            //先clone一個來處理才不會影響原來的物件
            var newO = JSON.parse(JSON.stringify(attrO));
            return this._minifyJSON_do(newO);
        }
        po._minifyJSON_do = function (obj) {
            //使用recursive 檢查下一層物件是否沒有任何屬性了
            var m = this, ks=[];
            for (var prop in obj) {
                if(obj.hasOwnProperty(prop)){
                    var chi = obj[prop];
                    if (typeof chi == "string") {
                        if (chi == "") ks.push(prop);
                    }
                    else if (Number(chi) == chi) { }//數字
                    else if (!this._hasProperty(chi)) {
                        //如果這個子層屬性已經沒有自己的屬性了就刪除掉
                        ks.push(prop); //先收集,不要在這裡刪除,可能會影響列舉程序 for (var prop in obj)
                    } else {
                        //如果有就處理之
                        this._minifyJSON_do(chi);
                        //再檢查一次
                        if (!this._hasProperty(chi)) ks.push(prop);
                    }
                }
            }
            if (ks.length > 0) {
                for (var i = 0; i < ks.length; i++) { delete obj[ks[i]];}
            }
            return obj;
        }
        po._hasProperty = function (obj) {
            var i=0;
            for (var prop in obj) {
                if(obj.hasOwnProperty(prop)){
                    return true;
                }
            }
            return false;
        }
        po.evtDlgResize = function (dg) {

        }
        po.chartTypes = function () {//要支援什麼圖形在這裡設定
            //這裡的chart type 名稱刻意和plotly.js 的相同,方便轉換
            var m = this, cts = m._cts;
            if (!cts) { cts = teChartSchema(); m._cts = cts; }
            return cts;
        }
        po.layoutSchema = function()
        {
            var m = this, cts = m._lys;
            if (!cts) { cts = plotlyChartLayoutSchema(); m._lys = cts; }
            return cts;
        }
        geChartDesigner._initialized = true;
    }
    var m = this;
    //如果沒有指定container,就自動產生一個dialog
    if (!container) {
        var dg = new DialogInBody("chartDgnr", "Chart Designer", 340);
        container = newEm("div");// m.createContents();
        dg.setClient(container);
        m.dlg = dg;
        //dg.handleResize = function (s) { return m.evtDlgResize.call(m,s); }
        dg.handleClose = function () { m.dlg.showMe(1); return true; }
    }
    m._cntr = container;
    m.createContents();
}//end geChartDesigner

function showLayoutDesignerDo(tarId, itms, channel) { //對具體物件(page)或其他container類型物件進行layout設計
    if (typeof tarId != "string") tarId = tarId.id;
    var ky = "lyoEDlg_" + tarId +"_" + channel, dg = PROG[ky];
    //showItD(dg);
    if (!tarId) return alert("invalid target for layout design.");
    if (!dg) {
        var dgn = LayoutSettingUserGet(tarId, channel);
        dg = new ObjectsLayoutDesigner(tarId, itms, dgn, channel);
        PROG[ky] = dg;
        dg.dlg.moveToRT();
    } else dg.dlg.showMe();
}
function showLayoutDesigner4jsonDo(dsgn, itms, channel, controller) { //附屬於其他設計(例如圖表設計)的layout,用於得到JSON 物件
    var ky = "lyoEDlgJ" + channel, dg = PROG[ky];
    showItD(dg);
    if (!dg || isHidden(dg)) {
        dg = new ObjectsLayoutDesigner();
        PROG[ky] = dg;
        dg.dlg.moveToRT();
    }
    dg.setSource(null, itms, dsgn, channel);
}
//用來設計畫面上的多個物件的排列方式
function ObjectsLayoutDesigner(tarId, itms, dgn, channel, container) {
    if (ObjectsLayoutDesigner._initialized == undefined) {
        var po = ObjectsLayoutDesigner.prototype;
        ObjectsLayoutDesigner._initialized = true;
        po.createContents = function () {
            var m = this, o = m._cntr, c, i18 = i18nm, coe = GJT.LayoutOperOptions;
            //container之下如果已有其他物件就再獨立創一個容器
            if (o.children.length > 0) c = addChi(o, "div"); else c = o;
            c.className = "LayoutDesign";
            var h = ["<div style='width:100%;height:100%'>"
            , "<div class='btnArea' style='height: auto;margin-bottom:0px;overflow:visible;'>" //<input type='checkbox' class='AutoPreview'/>Auto
            , "<button act='addRH'>加房(水平)</button><button act='addRV'>加房(垂直)</button><button act='_tools'>功能...</button><button act='save'>存檔</button><button act='release'>Release</button>" //<button act='toJSON' style='float:right;'>JSON</button>
            , "<span style='display:inline-block''>間隙寬度(px):<input type='text' style='width:30px;' class='inputGap' /></span>"
            , "<span style='display:inline-block'>版本:<input type='text' style='width:60px;' class='inputVer' /></span>"
            , "<span class='OptionsArea'>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkNoSplitBar' value='", coe.Disabled, "' />停用</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkNoSplitBar' value='", coe.NoSplitBar, "' />不允許調整區塊比率</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkNoSplitButton' value='", coe.NoSplitButton, "' />不顯示調整按鈕</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkNoBorder' value='", coe.NoBorder, "' />不顯示區塊邊框</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkAbsoluteSize' value='", coe.AbsoluteHeight, "' />使用絕對高度方式</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkAbsoluteSize' value='", coe.AbsoluteWidth, "' />使用絕對寬度方式</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkAbsoluteSize' value='", coe.AutoSizeContainer, "' />自動調整容器大小</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkAbsoluteSize' value='", coe.AutoScrollBar, "' />自動顯示容器捲軸</span>"
            , "<span style='display:inline-block'><input type='checkbox' class='chkAbsoluteSize' value='", coe.AutoExtendSize, "' />自動延伸高寬</span>" //當排列後有多餘的空間時自動調整最後一間的尺寸
            ,"</span>"
            , "</div>"
            , "<div class='dspArea'>"
            , "</div>"
			, "</div>"];
            c.innerHTML = h.join("");
            var evh = m.evtHnd, er = function () { evh.call(m); };
            setEvtHandleAll(c, er);
            c.onselectstart = function () { return false; };
            c.oncontextmenu =function(){ m._tools(); GJT.stopBubble(); return false;};
            m.dspAreaO = getEmByClass(c, "dspArea");
            m.btnAreaO = getEmByClass(c, "btnArea");
            m.opnAreaO = getEmByClass(c, "OptionsArea");
            m.inputGapO = getEmByClass(c, "inputGap");
            m.inputGapO.onchange = er;
            m.inputVerO = getEmByClass(c, "inputVer");
            m.inputVerO.onchange = er;
            m.saveO = getChiHasAtr(c, "act", "save");
            m.releaseO = getChiHasAtr(c, "act", "release");
        }
        po._setSource = function (sur, surItms, map, channel) {
            //var hii = !sur || !channel;
            var m = this, cntr = m._cntr, c0 = m.dspAreaO, cnt = 0;
            showItA([m.btnAreaO, c0],  sur || channel);
            if (!channel) return alert("No Design channel!");
            if (!map) map = {mode: "V", scales: [] };//第一層一定要有scales,預設是縱向
            else if (!map.scales) map.scales = [];
            if (!map.scales[0]) map.scales[0] = { rt: 1 };//至少要有一個房間
            m.inputGapO.value = map.gap != null ? map.gap : "";
            m.inputVerO.value = map.ver != null ? map.ver : "";
            if (isNaN(Number(map.options))) map.options = 0;
            m.channel = channel;
            showItA([m.saveO,m.releaseO], sur);
            m._sur = sur;
            m._surItms = surItms;
            if (m.dlg) m.dlg.setCaption("Layout Design " + channel + " " + (sur && sur.text ? sur.text : ""));
            m.lyodsgn = map;
            while (c0.children.length > 0) { c0.removeChild(c0.children[0]); }
            m.setOptionsUI(map.options, m.opnAreaO);
            var itms = new OpItems(); m._itms = itms;
            //先依照map 設定建造出所有房間, 入住的實際客人 (surItms) 先等候,等到layout設計好了再對號入房
            var cnt = m.createCustAgents(map, itms, c0);
            var lyo = new layoutDispatcher(map, c0, itms, null, 1);
            m._lyo = lyo;
            lyo.clearRooms();
            lyo.resizeLYO();
            m._setActRoom(map.scales[0]);
            lyo.showCustRegInfo();
        }
        po.setOptionsUI = function(optn, c){
            var inps = getEM(c, "INPUT");
            for (var i = 0; i < inps.length; i++) {
                var v = parseInt(inps[i].value, 10); if (isNaN(v)) continue;
                inps[i].checked = ((optn & v) == v);
            }
        }
        po.getOptionsByUI = function (c) {
            var optn = 0, inps = getEM(c, "INPUT");
            for (var i = 0; i < inps.length; i++) {
                var v = parseInt(inps[i].value, 10); if (isNaN(v)) continue;
                if (inps[i].checked) optn = optn | v;
            }
            return optn;
        }
        po.createCustAgents = function (map, itms, c0) {
            var m=this, cnt = m.createCustAgentsDo(map, itms, 0, c0);
            var mm = map.scales;
            for (var i = cnt; i < m._surItms.length;i++) {//不足的補上
                var itm = m.createCustAgent(m._surItms[i]);
                itms.add(itm);
                cnt++;
            }
            return cnt;
        }
        po.createCustAgentsDo = function (map, itms, cnt, c0) {
            var m = this, mm = map.scales, surItms = m._surItms;
            if (mm) {
                for (var i = 0; i < mm.length; i++) {
                    cnt = m.createCustAgentsDo(mm[i], itms, cnt, c0);
                }
            } else {
                var itm = itms[cnt], surItm = surItms[cnt];
                if (!itm) {
                    itm = m.createCustAgent(surItm);
                    itms.add(itm);//先設定id name 才能加入
                } else if (surItm) {
                    itm.id = surItm.id;
                    itm.name = surItm.name;
                    itm.text = surItm.text;
                }
                if (!map.rt) map.rt = 1;
                cnt++;
            }
            return cnt
        }
        po.createCustAgent = function (surItm) {//建立房客代理
            var m = this, c0 = m.dspAreaO;
            var c = c0.appendChild(newEm("DIV"));
            var itm = new opComponent(c);
            c.title = m._itms.length;
            c.roomNo = m._itms.length;
            if (surItm) {
                itm.id = surItm.id;
                itm.name = surItm.name;
                itm.text = surItm.text;
            }// else itm.id = "";
            return itm;
        }
        po.toJSON = function () {
            var m = this, dg = m.dlgjson;
            if (!dg || dg.isDestroyed()) {
                dg = new DialogInBody("jsontxt", "JSON of Layout", 400, 600);
                m.dlgjson = dg;
                dg.overflow = "hidden";
                var dv = newEm("div"); dv.innerHTML = "<textarea style='width:99%;height:99%;'></textarea>";
                dg.setClient(dv);
                showInCenter(dg);
            }
            var txo = getEM(dg.getClient(), "textarea")[0];
            //var tar = m.lyodsgn;
            txo.value = m._lyo.mapText();// JSON.stringify(tar);
        }
        po.evtHnd = function () {
            var ev = GJT.event(); if (!ev) return;
            var m = this, o = GJT.eventSrc(), ty = ev.type;
            if (ty == "change" || (ty == "keypress" && GJT.eventKeyCode(ev) == 13)) {
                if (o == m.inputGapO) {
                    var n = Number(o.value);
                    if (isNaN(n)) delete m.lyodsgn.gap; else m.lyodsgn.gap = n;
                    if(m._lyo) m._lyo.setGap(n);
                }
                if (o == m.inputVerO) {
                    m.lyodsgn.ver = o.value;
                }
            } else if (ty == "click") {
                var act = getAtr(o, "act");
                if (act == "addRH") m.prcsRoom(1);
                else if (act == "addRV") m.prcsRoom(2);
                else if (act == "rmvR") m.prcsRoom(3);
                else if (act == "save") m.save();
                else if (act == "release") m.save(1);
                else if (act == "toJSON") m.toJSON();
                else if (act == "_tools") m._tools();
                else {
                    var p=o;
                    while (p){
                        if (p == m.opnAreaO) { m.lyodsgn.options = m.getOptionsByUI(m.opnAreaO); m._lyo.resizeLYO(); return; }
                        p = p.parentElement;
                    }
                    var r = m._lyo.getRoom(o);
                    if (r) m._setActRoom(r);
                }
            } else if (ty == "mousemove") {
                if (GJT.isButtonDownLeft()) { //如果還沒有開始drag 就進入drag模式
                    if (!m.isDraging && !GJT.isDraging) {
                        var r = m._lyo.getRoom(o);
                        if (r) {
                            m._setActRoom(r);
                            m.isDraging = true;
                            m._cntr.style.cursor="move";
                        }
                    }
                }
            } else if (ty == "mouseup") {
                if (m.isDraging) {
                    delete m.isDraging;
                    m._cntr.style.cursor = "";
                    var lyo=m._lyo, r = lyo.getRoom(o);
                    if (r && r != m.actRoom) {
                        m._lyo.moveCustomerTo(m.actRoom, r, ev.shiftKey);//shift key按住 移動房間
                    }
                }
            }// else if (ty == "contextmenu") { m._tools(); GJT.stopBubble(); return false;}
        }
        po._tools = function () { //處理房客房間登記相關工作
            //使用滑鼠右鍵選單 讓設計者選擇房客,第一項是自動依照順序登記房間
            var m=this, itms = new OpItems();
            itms.add(NIT("movCustP", "移動房客-往前"));
            itms.add(NIT("movCustN", "移動房客-往後"));
            itms.add(NIT("-", "-"));
            itms.add(NIT("movCnRP", "移動房間及房客-往前"));
            itms.add(NIT("movCnRN", "移動房間及房客-往後"));
            if (m.actRoom && m._lyo.getCustomer(m.actRoom)) itms.add(NIT("setStyleText", "設定房間的style text"));
            //itms.add(NIT("regCust", "登錄房客(單一客人)"));
            //itms.add(NIT("regCustAll", "登錄所有房客"));
            //itms.add(NIT("-", "-"));
            //itms.add(NIT("setRoomMinW", "設定房間最小寬度"));
            //itms.add(NIT("setRoomMinH", "設定房間最小高度"));
            itms.add(NIT("-", "-"));
            itms.add(NIT("addRT", "新增房間(最上層)"));
            itms.add(NIT("rmvR", "刪除房間"));
            itms.add(NIT("-", "-"));
            itms.add(NIT("toJSON", "產生JSON字串"));
            if (m._sur) {
                itms.add(NIT("-", "-"));
                itms.add(NIT("save", "存檔"));
                itms.add(NIT("release", "發佈設計Release"));
            }
            itms.onclick = m._tools2;
            itms.ctrl = m;
            SysShowMenu(itms);

        }
        po._tools2 = function (itm, itms) {
            var m = itms.ctrl, lyo = m._lyo, act = itm.name;
            if (act == "regCust") m.regCust();
            if (act == "regCustAll") m.regCustAll();
            if (act == "rmvCust") m.rmvCust();
            if (act == "movCustP") m.moveCust( -1);
            if (act == "movCustN") m.moveCust(1);
            if (act == "movCnRP") m.moveCust(-1,1);//同時移動房間
            if (act == "movCnRN") m.moveCust(1,1);
            if (act == "toJSON") m.toJSON();
            if (act == "rmvR") m.prcsRoom(3);
            if (act == "addRT") m.addTopRoom();
            if (act == "save") m.save();
            if (act == "release") m.save(1);
            if (act == "setStyleText") m.setStyleText();
            //if (act == "setRoomMinW") m.setRoomMinWH();
            //if (act == "setRoomMinH") m.setRoomMinWH(1);
        }
        po.setStyleText = function () {
            var r = this.actRoom, stx = r.styleText; if (!stx) stx = "";
            var x = window.prompt("輸入要設定的style text", stx);
            if (x == null) return;
            r.styleText =x;
        }
        //po.setRoomMinWH = function (setH) {
        //    var m = this, lyo = m._lyo, r = m.actRoom;
        //    var v = setH ? r.minHeight : r.minWidth;
        //    if (!v) v = "";
        //    var nv = window.prompt("請輸入最小" + (setH ? "高度" : "寬度") + ",空白表示不設定",v);
        //    if (nv == null) return;//使用者取消動作
        //    nv = parseFloat(nv);
        //    if (setH) { if (isNaN(nv)) delete r.minHeight; else r.minHeight = nv; }
        //    else { if (isNaN(nv)) delete r.minWidth; else r.minWidth = nv; }
        //    lyo.resizeLYO();
        //}
        po.moveCust = function (step,withRoom) {
            var m = this, lyo = m._lyo,r=m.actRoom,c=lyo.getCustomer(r);
            lyo.moveCustumer(r, step, withRoom);
            var r = lyo.getRoom(c);
            if (r) m._setActRoom(r);
        }
        po.rmvCust = function () {
            var lyo = this._lyo;
            lyo.rmvCustId(this.actRoom);
        }
        po.regCustAll = function () {
            var lyo = this._lyo;
            lyo.regCustIdAll(this._surItms);
        }
        po.regCust = function () {
            var m = this, surs = m._surItms;
            //防止動到原物件,另外建立一個
            var itms = new OpItems();
            for (var i = 0; i < surs.length; i++) {
                itms.add(surs[i]);
            }
            itms.onclick = m.prscRegCust;
            itms.ctrl = m;
            SysShowMenu(itms);
        }
        po.prscRegCust = function (itm, itms) {
            var m = itms.ctrl, r = m.actRoom;
            m.regCustDo(m, r, itm);
        }
        po.regCustDo = function (m, r, itm) {
            //必須確定客人沒有在其他房間登記
            var lyo = m._lyo, c = lyo.getCustomer(r), r1 = lyo.getRoom(itm);
            
            try {
                lyo.regCustId(r, itm);
            } catch (ex) {return alert(ex.message); }
            //var txt = itm.text; if (!txt) txt = itm.name; if (!txt) txt = itm.id;
            //if (c && c.container) c.container.innerText = txt;
        }
        po.save = function (release) {
            if (release && !window.confirm("You are going to release design to user. Please confirm this action.")) return;
            var m = this, lyo = m._lyo;
            var txt = lyo.mapText();
            LayoutSettingUserSave(m._sur, txt, (release ? "R" : m.channel));
        }
        po.addTopRoom=function(){
            var m = this, lyo = m._lyo, itms = m._itms;
            var nc = lyo.addRoom();//回傳自動建立的暫時房客
            itms.add(nc);
            var nr = lyo.getRoom(nc);
            m._setActRoom(nr);
        }
        po.prcsRoom = function (prscMode) {
            var m = this, r = m.actRoom, lyo = m._lyo, t = prscMode, itms = m._itms;
            if (!r) return alert("Failed to find parent room!"); //找不到上層房間 就不可處理
            if (t == 3) { //刪除房間
                var c = lyo.getCustomer(r);
                if (c && !window.confirm("You are going to delete active room ! Please confirm this action.")) return;
                var c = lyo.removeRoom(r);
                if (c) {
                    itms.remove(c);
                    c = c.container;
                    c.parentElement.removeChild(c);
                }
                delete m.actRoom;
                return;
            }
            var dr = t == 1 ? "H" : "V";
            //加房間: 所在的樓層如果只有一個房間時,允許依照指定的方向新增房間
            var nc = lyo.addRoom(null, r, dr);//回傳自動建立的暫時房客
            itms.add(nc);
            var nr = lyo.getRoom(nc);
            m._setActRoom(nr);
        }
        po._setActRoom = function (r) {
            var m = this;
            m.actRoom = r;
            m.showActRoomInfo();
        }
        po.showActRoomInfo = function () {
            var m = this, r = m.actRoom, lyo = m._lyo, c0 = m.dspAreaO;
            for (var i = 0; i < c0.children.length; i++) {
                var c = c0.children[i];
                //只有客人的顏色需要改變
                if (lyo.getRoom(c)) c.style.backgroundColor = "";
            }
            if (!r) return;
            var c = lyo.getCustomer(r);
            if (c && c.container) c.container.style.backgroundColor = "#efef77";
        }
        po.evtDlgResize = function (s) {
            //調整畫面
            var m = this;
            // window.setTimeout(function () {
            try {
                var o = m.dspAreaO, st = o.style, bo = m.btnAreaO, p = o.parentElement;
                st.width = toPx(p.clientWidth - 5); st.height = toPx(p.clientHeight - bo.offsetHeight - 5);
                st.overflowX = "hidden"; st.overflowY = "hidden";
                m._lyo.resizeLYO();
            } catch (ex) { }
           // }, 200);
        }
    }
    var m = this;
    //如果沒有指定container,就自動產生一個dialog
    if (!container) {
        var dg = new DialogInBody("lyoDgnr", "Layout Design", 800,600);
        container = newEm("div");
        dg.setClient(container);
        m.dlg = dg;
        dg.handleResize = function (s) { return m.evtDlgResize.call(m,s); }
        dg.handleClose = function () { m.dlg.showMe(1); return true; }
    }
    m._cntr = container;
    m.createContents();
    m._setSource(tarId, itms, dgn, channel);
}
//End LayoutDesigner

function getSelectionHtml() {
	var html = "";
	if (typeof window.getSelection != "undefined") {
		var sel = window.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			html = container.innerHTML;
		}
	} else if (typeof document.selection != "undefined") {
		if (document.selection.type == "Text") {
			html = document.selection.createRange().htmlText;
		}
	}
	alert(html);
}

function replaceSelectionWithHtml(html) {
	var range, html;
	if (window.getSelection && window.getSelection().getRangeAt) {
		range = window.getSelection().getRangeAt(0);
		range.deleteContents();
		var div = document.createElement("div");
		div.innerHTML = html;
		var frag = document.createDocumentFragment(), child;
		while ((child = div.firstChild)) {
			frag.appendChild(child);
		}
		range.insertNode(frag);
	} else if (document.selection && document.selection.createRange) {
		range = document.selection.createRange();
		html = (node.nodeType == 3) ? node.data : node.outerHTML;
		range.pasteHTML(html);
	}
}
