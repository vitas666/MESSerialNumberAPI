///<reference path="sunUtilTableEdit.js" />
function MemoEditor(ge, container) {
  this.ge = ge;
  if (MemoEditor._initialized == undefined) {
    var po = MemoEditor.prototype;
    po.createContents = function () {
      var m = this, h = ["<textarea name='memotxt' style='width:95%;height:95%;overflow:visible;'></textarea>"];
      m.opst = ge.opst;
      o = addEm(h.join(""));
      m.txtbox = o;
      o.onblur = function () { m.collxml.call(m); };
      return o;
    }
    po.showDtl = function (fld, tr) {
      this.collxml();
      var m = this, ge = m.ge, ops = ge.opst, fv = ops.f4memosave, txt = "", tarF, x;
      if (fld && tr) {
        tarF = fld.name;
        x = ge.getFieldValueR(fv, tr);
        if (x) {
          var dc = GJT.xmlDocument(), ndt, nd, nd2;
          dc.loadXML(x); ndt = dc.firstChild, nd = ndt.getElementsByTagName("md")[0];
          if (nd) {
            nd2 = nd.getElementsByTagName(tarF)[0];
            if (nd2) txt = lySX(xGetAtr(nd2, "t"));
          }
        }
      }
      m.fld = fld; m.tr = tr;
      m.txtbox.value = txt;
      m.oriVal = txt;
    }
    po.collxml = function () {
      var m = this, ge = m.ge, ops = ge.opst, fv = ops.f4memosave, txt = m.txtbox.value, tarF, x; // if (txt) alert(txt);
      var fld = m.fld, tr = m.tr;
      if (!fld || !tr) return;
      if (m.oriVal == txt) return;
      tarF = fld.name;
      x = ge.getFieldValueR(fv, tr);
      var dc = GJT.xmlDocument(), ndt, nd, nd2;
      if (x) { dc.loadXML(x); ndt = dc.firstChild; } else ndt = dc.appendChild(dc.createElement("d"));
      nd = ndt.getElementsByTagName("md")[0]; //加一層與其他功能共用欄位
      if (!nd) nd = ndt.appendChild(dc.createElement("md"));
      nd2 = nd.getElementsByTagName(tarF)[0];
      if (txt) {
        if (!nd2) nd2 = nd.appendChild(dc.createElement(tarF));
        nd2.setAttribute("t", txt);
      } else if (nd2) {
        nd.removeChild(nd2);
      }
      if (nd.childNodes.length == 0) ndt.removeChild(nd);
      if (ndt.childNodes.length == 0) x = "";
      else x = doc2Xml(dc);
      x = x.replace(reg13, "&#13;").replace(reg10, "&#10;");
      ge.setFieldValue(fv, x, tr);
      ge.showMemoSym([tr]);
    }
    po.evtResize = function (dgo) {
      var od = dgo.main;
      matchLoc(this.txtbox, od, 0, 0, 0, null, 1, 5, 5);
    }
    //po.evtCloseDlg = function (dlg) { return cfmCloseDlg(); }
    po.evtCloseDlg = function (dlg) {
      if (cfmCloseDlg()) return true;
      dlg.showMe(1); // this.cTRs = []; //clear
      return true;
    }
    MemoEditor._initialized = true;
  }
  var m = this, dg = new DialogInBody("memoedit", "Memo: " + ge.text, 300, 400, container);
  m.dlgCtrl = dg;
  dg.handleClose = function (dlg) { return m.evtCloseDlg.call(m, dlg); }
  dg.handleResize = function (dgo) { return m.evtResize.call(m, dgo); }
  var o = m.createContents();
  dg.setClient(o);
}

function progTabSplit(tabCtrl) {
  //if(!tabCtrl.nosave) teSaveUserSetting(null, "pgSplitMode", tabCtrl.splitMode);
}

function NumDetailEditor(ge, maxCols, container, wdt, hgt) {
  if (!ge.opst || !ge.opst.f4numdtl) return;
  if (!maxCols) maxCols = 3;
  this.ge = ge; this.maxcol = maxCols;
  if (NumDetailEditor._initialized == undefined) {
    var po = NumDetailEditor.prototype;
    po.createContents = function () {
      var m = this, n = i18nm, ops = m.ge.opst, fa = m.ge.fieldsAll, itms = fa.collect(ops.f4numdtl), pvg = PPVG.MultiSelect | PPVG.InsertRows | PPVG.RemoveRows | PPVG.Insert,
      edf = [{ name: "fld", text: "Fields", dataType: GDT.String, opConfig: GIA.WriteDenied }];
      for (var i = 0; i < m.maxcol; i++) {
        edf.push({ name: "t" + i, text: "T" + i, dataType: GDT.String, opConfig: GIA.SaveDenied });
        edf.push({ name: "n" + i, text: "N" + i, dataType: GDT.Real, opConfig: GIA.SaveDenied });
      }
      m.flds = itms; m.opst = ops;
      var gei = { text: "", dataCol: 1, dataRow: 1, fields: edf, programPrivilege: pvg, viewName: "", columnsShow: [edf[0].name, "t0", "n0"] };
      var gd = new GridEdit(gei, TBM.withText), to = gd.grid;
      gd.addToolBarButton("<span act='SumBack'>" + i18nm.SumBack.text + "</span><span act='SumBackAll'>" + i18nm.SumBackAll.text + "</span>"); //<input type='checkbox' is4AutoSumBack='Y' />Auto Sum Back<br/>"
      gd.addToolBarButton("<input type='checkbox' is4AutoSumBack='Y' checked='checked' />" + i18nm.AutoSum.text + "<input type='checkbox' is4Lock='Y' />" + i18nm.Lock.text); //<input type='checkbox' is4AutoSumBack='Y' />Auto Sum Back<br/>"
      gd.aftToolbarClick = function () { m.evtToolbar.call(m); };
      gd.insertRows(itms.length - 1, null, 1);
      gd.lockColumns = 1; m.autoSum = 1;
      gd.sel(null);
      for (var i = 0; i < itms.length; i++) {
        var tr = to.rows[i + 1];
        tr.cells[1].innerText = itms[i].text;
        tr.tarF = itms[i];
      }
      gd.bfrInsertRows = function (refTRs, doAppend, ge) { m.bfrInsRows.call(m, refTRs, doAppend, ge); }
      gd.aftInsertRows = function (res, doAppend, ge) { m.aftInsRows.call(m, res, doAppend, ge); };
      gd.aftChangeValue = function (ge, tr, itm, value, isSetByCode) { m.aftChgValue.call(m, ge, tr, itm, value, isSetByCode); };
      gd.handleAfterRemoveRows = function (ge, rws) { m.aftRemoveRows.call(m, ge, rws); };
      m.edG = gd;
      return gd.container;
    }
    po.bfrInsRows = function (refTRs, doAppend, ge) {
      this.curFld = refTRs[0].tarF;
    }
    po.aftChgValue = function (ge, tr, itm, value, isSetByCode) {
      this.collxml(itm);
      if (this.autoSum) this.SumBack(0, tr);
    }
    po.aftInsRows = function (res, doAppend, ge) {
      var itm = this.curFld; if (!itm) return;
      var txt = itm.text;
      for (var i = 0; i < res.length; i++) {
        res[i].tarF = itm;
        res[i].cells[1].innerText = txt;
      }
    }
    po.aftRemoveRows = function (ge, rws) {
      if (this.autoSum && m.cTRs) this.SumBack(1);
    }
    po.showDtl = function (oaTR) {
      var m = this, ge = m.ge, G0 = m.edG, gfa = G0.fieldsAll, itms = m.flds, ops = ge.opst, fv = ops.f4numdtlsave, ft = ops.f4numdtltitle;
      if (!oaTR || (m.cTRs && m.locked)) return;
      if (fv) fv = fv.split(",")[0];
      var il = oaTR.length, nl = [gfa[0].name], l2 = itms.length, v = [], ti = [], doc = [], mxr = 0, rl = [];
      for (var j = 0; j < oaTR.length; j++) {
        var dc = GJT.xmlDocument(), ndt, nd, y = gfa["t" + j], z = gfa["n" + j];
        nl.push(y.name, z.name);
        v[j] = ge.getFieldValueR(fv, oaTR[j]); ti[j] = ge.getFieldsValues(ft, [oaTR[j]], "\r\n")[0];
        y.text = "Note\r\n(" + lySX(ti[j]) + ")"; z.text = "Amount\r\n(" + lySX(ti[j]) + ")";
        doc[j] = dc;
        if (v[j]) { dc.loadXML(v[j]); ndt = dc.firstChild; } else ndt = dc.appendChild(dc.createElement("d"));
        nd = ndt.getElementsByTagName("nd")[0];
        if (!nd) nd = ndt.appendChild(dc.createElement("nd"));
        for (var i = 0; i < l2; i++) {
          var tarF = itms[i].name, nd2 = nd.getElementsByTagName(tarF)[0], n2 = 1;
          if (nd2) { n2 = nd2.childNodes.length; if (n2 == 0) n2 = 1; }
          if (!rl[i]) rl[i] = n2;
          else if (rl[i] < n2) rl[i] = n2;
        }
      }
      for (var i = 0; i < l2; i++) { mxr += rl[i]; }
      G0.removeRowsAll();
      G0.resetNextRowNo();
      G0.arrangeColumns(nl[0], 0);
      G0.arrangeColumns(nl.join(KW.dmlN), 0);
      G0.insertRows(mxr, null, 1);
      G0.sel(null);
      var tbl = G0.grid, rws = tbl.rows, rb = G0.rowBeginData(), cb = G0.colBeginData();
      for (var j = 0; j < oaTR.length; j++) {
        var dc = doc[j], rh = rb, c1 = cb + j * 2 + 1, c2 = c1 + 1, ndt = dc.firstChild, nd = ndt.getElementsByTagName("nd")[0];
        for (var i = 0; i < l2; i++) {
          var tarF = itms[i].name, nd2 = nd.getElementsByTagName(tarF)[0];
          for (var k = 0; k < rl[i]; k++) {
            var tr2 = rws[rh], nd3 = nd2 ? nd2.childNodes[k] : 0;
            if (j == 0) tr2.cells[cb].innerText = itms[i].text;
            tr2.tarF = itms[i];
            tr2.children[c1].innerText = nd3 ? lySX(xGetAtr(nd3, "x")) : "";
            tr2.children[c2].innerText = nd3 ? lySX(xGetAtr(nd3, "v")) : "";
            rh++;
          }
        }
      }
      m.cTRs = oaTR;
    }
    po.evtToolbar = function () {
      var ev = GJT.event(); if (!ev) return;
      var m = this, o = GJT.eventSrc(), ty = ev.type;
      if (ty == "click") {
        if (getAtr(o, "is4Lock")) m.locked = o.checked;
        else if (getAtr(o, "is4AutoSumBack")) m.autoSum = o.checked;
        var ac = xGetAtr(o, "act");
        if (ac == "SumBack") return m.SumBack(0);
        if (ac == "SumBackAll") return m.SumBack(1);
      }
      else if (ty == "mousedown") {
        if (xGetAtr(o, "act")) borderDown(o);
      }
      else if (ty == "mouseup") {
        if (xGetAtr(o, "act")) borderUp(o);
      }
    }

    po.SumBack = function (sumAll, refTR) {
      var m = this, ge = m.ge, G0 = m.edG, ops = ge.opst, trs = G0.getAllDataRows(), r2 = trs.length, ctrs = m.cTRs, fv = ops.f4numdtlsave, itmsChk, trsSel, itmsSet = new OpItems();
      if (!ctrs) {
        return;
      }
      if (fv) fv = fv.split(",")[0];
      itmsChk = G0.getSelectedFields();
      if (sumAll || (itmsChk && itmsChk.length == 1 && itmsChk["fld"])) itmsChk = G0.fieldsAll.clone();
      if (sumAll) trsSel = G0.getAllDataRows();
      else if (refTR) trsSel = [refTR];
      else trsSel = G0._strsau();
      for (var i = 0, r3 = trsSel.length; i < r3; i++) {
        var itm = trsSel[i].tarF;
        if (!itmsSet[itm.name]) itmsSet.add(itm);
      }
      for (var j = 0; j < ctrs.length; j++) {
        var tfn = "t" + j, nfn = "n" + j;
        if (!itmsChk[tfn] && !itmsChk[nfn]) continue;
        var t = G0.getFieldValuesR(tfn, trs), n = G0.getFieldValuesR(nfn, trs), noData = 1, v = [], cnt, dict = GJT.newDictionary();
        for (var i = 0; i < r2; i++) {
          var myNm = trs[i].tarF.name, idx = 0, nvft = parseFloat(n[i]);
          if (!itmsSet[myNm]) continue;
          if (!isNaN(nvft)) noData = 0; else continue;
          if (!dict.exists(myNm)) {
            idx = v.length;
            dict.add(myNm, idx);
            v[idx] = nvft;
          } else {
            idx = dict[myNm];
            v[idx] += nvft;
          }
        }
        if (noData) continue;
        var kys = dict.keys();
        for (var i = 0; i < kys.length; i++) {
          idx = dict[kys[i]];
          ge.setFieldValue(kys[i], v[idx], ctrs[j]);
        }
      }
    }
    po.collxml = function (itm) {
      var m = this, ge = m.ge, G0 = m.edG, ops = ge.opst, trs = G0.getAllDataRows(), r2 = trs.length, ctrs = m.cTRs, fv = ops.f4numdtlsave;
      if (fv) fv = fv.split(",")[0];
      for (var j = 0; j < ctrs.length; j++) {
        var tfn = "t" + j, nfn = "n" + j;
        if (itm.name != tfn && itm.name != nfn) continue;
        var dc = GJT.xmlDocument(), ndt, nd, t = G0.getFieldValuesR(tfn, trs), n = G0.getFieldValuesR(nfn, trs), xm = ge.getFieldValueR(fv, ctrs[j]), noData = 1;
        if (xm) { dc.loadXML(xm); ndt = dc.firstChild; } else ndt = dc.appendChild(dc.createElement("d"));
        nd = ndt.getElementsByTagName("nd")[0]; //加一層與一般備註共用欄位
        if (!nd) nd = ndt.appendChild(dc.createElement("nd"));
        else {
          while (nd.childNodes[0]) { nd.removeChild(nd.childNodes[0]); }
        }
        for (var i = 0; i < r2; i++) {
          if (t[i] || n[i]) noData = 0; else continue;
          var tarF = trs[i].tarF.name, nd2 = nd.getElementsByTagName(tarF)[0];
          if (!nd2) nd2 = nd.appendChild(dc.createElement(tarF));
          var nd3 = nd2.appendChild(dc.createElement("n"));
          if (t[i]) nd3.setAttribute("x", t[i]);
          if (n[i]) nd3.setAttribute("v", n[i]);
        }
        var txt = noData ? "" : doc2Xml(dc);
        txt = txt.replace(reg13, "&#13;").replace(reg10, "&#10;");
        ge.setFieldValue(fv, txt, ctrs[j]);
        ge.showMemoSym([ctrs[j]]);
      }

    }
    po.evtCloseDlg = function (dlg) {
      if (cfmCloseDlg()) return true;
      dlg.showMe(1); this.cTRs = []; //clear
      return true;
      //PROG.children.remove(this.edG);
    }
    NumDetailEditor._initialized = true;
  }

  var m = this, dg = new DialogInBody("NUMDTL", "Number Detail: " + ge.text, wdt, hgt, container);
  m.dlgCtrl = dg;
  dg.handleClose = function (dlg) { return m.evtCloseDlg.call(m, dlg); }
  dg.isSubDialog = 0;
  var o = m.createContents();
  dg.setClient(o);
  m.cntr = o; //.children[0];
} //end NumDetailEditor

function tePlaySound(playerID, url, param) {
  var d = playerID, p = param, g = PROG, s, o;
  if (!d) d = "_";
  if (!g._sndps) g._sndps = {};
  s = g._sndps;
  o = s[d];
  if (!o) {
    var o = newEm("div");
    o.innerHTML = param;
    //o.style.display = "none";
    BDY().appendChild(o);
    o = o.children[0];
    s[d] = o;
  }
  if (o.tagName == "AUDIO") {
    o.play(); //o.pause()
  }
  //if(o.played)o.played.start();
}
function fkCheckinout(tar, cntr, td, cko, cls) {
  var p = cko ? "dlgchkoutF" : "dlgchkinF";
  var m = tar, bkr = m, ih, dg = m[p], bs;
  if (cls) { if (dg) { dg.dg.close(1); }; return; }
  if (dg) ih = isHidden(dg.dg);
  else {
    if (bkr instanceof GridEdit) bkr = new fcioBrokerGE(m);
    dg = cko ? new DlgFileCheckout(bkr, cntr) : new DlgFileCheckin(bkr, cntr);
    if (!cko && tar.maxFilesOT) dg.maxFilesOT = tar.maxFilesOT;
    if (!dg.createDlg()) return;
    m[p] = dg;
    bs = 1;
  }
  dg.showDlg(); dg.setTarget(td);
  if (bs && dg.dg) {
    dg.dg.fitSize(); ih = 1;
  }
  if (ih && dg.dg) showBesideMouse(dg.dg.dlg);
  return dg;
}
function fkCheckin(tar, cntr, td) { return fkCheckinout(tar, cntr, td, 0, 0); }
function fkCheckout(tar, cntr, td) { return fkCheckinout(tar, cntr, td, 1, 0); }
function fkCloseCheckinout(tar, cko) { return fkCheckinout(tar, null, null, cko, 1); }
function fcioBrokerGE(ge) { //file chieck in out broker
  this.ge = ge; this.fk = ge.fieldsKey.getNames(",");
  this.headerBC = ge.grid ? GJT.getComputedStyle(ge.grid.rows[0].cells[0]).backgroundColor : null;
  if (fcioBrokerGE._initialized == undefined) {
    var po = fcioBrokerGE.prototype;
    po.getPageId = function () { return getTargetPage(this.ge); }
    po.getId = function () { return this.ge.id; } //必要方法
    po.getCaption = function () { return this.ge.text; }
    po.mainTR = function () { return this.ge.mainTR(); } //必要方法
    po.getTextUIKF = function (tr) { if (!tr) tr = this.ge.mainTR(); return this.ge.getTextUIKF(getTR(tr), 5); } //代表該row的可識別文字 例如 車種名稱
    po.getDataForm = function (getDlg) { return this.ge.getDataForm(getDlg); }

    po.getKey = function (tr) { if (!tr) tr = this.ge.mainTR(); return this.ge.getFieldValue(this.fk, getTR(tr)); } //必要方法
    po.getFieldsAll = function () { return this.ge.fieldsAll; }
    po.hintAnnexIcon = function (otr, shwImg, forceShow) { this.ge.hintAnnexIcon(otr, shwImg, forceShow); }
    po.refreshDataForm = function (td) { return this.ge.refreshRows([this.mainTR()], null, null, 1, 0, 1); }
    fcioBrokerGE._initialized = 1;
  }
} //end fcioBrokerGE

function htmlFileCheckinOptn() {
  var fcio = GJT.FileCheckinOptionEnum, nm = i18nm, i = nm.IsPrivate, l = nm.LockWrite, a = nm.AllowPublicWrite, c = nm.CheckoutToPDF, h = nm.CheckoutToHTML, d = nm.LockDelete, em = nm.SendMailToFileOwnerWhenCheckedOut;
  var s1 = "<span title='", s2 = "'>", s3 = "</span>";
  return "<div id='chkOptns'><input type='checkbox' value='" + fcio.IsPrivate + "' />" + s1 + i.tip + s2 + i.text + s3 +
  " <input type='checkbox' value='" + fcio.LockWrite + "' />" + s1 + l.tip + s2 + l.text + s3 +
  " <input type='checkbox' value='" + fcio.AllowPublicWrite + "' />" + s1 + a.tip + s2 + a.text + s3 +
  " <input type='checkbox' value='" + fcio.LockDelete + "'/>" + s1 + d.tip + s2 + d.text + s3 +
  " <input type='checkbox' value='" + fcio.SendMailToFileOwnerWhenCheckedOut + "'/>" + s1 + em.tip + s2 + em.text + s3 +
  //"<br/><input type='checkbox' value='" + fcio.CheckoutToPDF + "' />"+s1+c.tip+s2+c.text+s3 +
  //"<br/><input type='checkbox' value='" + fcio.CheckoutToHTML + "' />"+s1+h.tip+s2+h.text+s3+
  "</div>";
}
function DlgLinkAttachment(sur, cntr) {//連結其他紀錄的附件，甚至其他表格的任何紀錄的附件
  if (DlgLinkAttachment._initialized == undefined) {
    var po = DlgLinkAttachment.prototype;
    po.createDlg = function () {
      var m = this, dg = m.dg, om = m._cntr, b1 = "<button class='", b2 = "</button>",
      x = ["<div class='LinkAttachment'><div>", GJT.encodeHTML(i18nm.LinkAttachmentHint.text), "</div>",
      "<div class='SelectionHint' ></div>",
      b1, "OK' ", b2, b1, "Cancel'", b2, "/div>"];
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("", 480, 210);
          dg.handleClose = function () { return dg.showMe(1); }
          dg.besideMouse = 1;
          m.dg = dg;
        }
        dg.setCaption(i18nm.LinkAttachment.text);
        dg.showMe();
        showBesideMouse(dg.dlg);
        om = dg.main; m._cntr = om;
      }
      om.innerHTML = x.join("");
      m.okO = getEmByClass(om, "OK");
      m.okO.innerText = i18nm.OK.text;
      m.okO.onclick = function () { m.evtOK.call(m); }
      m.cancelO = getEmByClass(om, "Cancel");
      m.cancelO.innerText = i18nm.Cancel.text;
      m.cancelO.onclick = function () { m.evtCancel.call(m); }
      m.SelectionHintO = getEmByClass(om, "SelectionHint");
    }
    po.close = function () {
      if (this.dg) this.dg.showMe(1);
      //取消所有事件接收登記
      var gs = PROG.children;
      for (var i = 0; i < gs.length; i++) {
        if (gs[i].evtListenerRemove) { gs[i].evtListenerRemove("aftChangeSelection", this.evh4GE); }
      }
    }
    po.evtOK = function () {
      var m = this;
      if (!m.surId || !m.rowsIdList) return alert("No rows selected!");
      m._chkinCtrl.LinkAttachmentDo(m.surId, m.rowsIdList);
      m.close();
    }
    po.evtCancel = function () {
      this.close();
    }
    po.show = function (ge) {
      if (this.dg) this.dg.showMe();
      //清除原來的選擇
      //delete this.surId; delete m.rowsIdList;
      //向所有表格登記事件接收
      var gs = PROG.children;
      for (var i = 0; i < gs.length; i++) {
        if (gs[i].evtListenerAdd) { gs[i].evtListenerAdd("aftChangeSelection", this.evh4GE); }
        if (ge == gs[i] && !this.surId) this.evh4Grid("aftChangeSelection", [ge]);
      }
    }
    po.evh4Grid = function (evtType, sur) {
      if ("aftChangeSelection" != evtType) return;
      //get grid id & selected key values
      var s = sur[0], k = s.fieldsKey[0];
      if (!k) return alert(i18nm.NoKeyFlds.text);
      var hx = s.getTextUIKF(s.getSelectedTRs(), 5);
      if (hx.length > 100) hx = hx.substring(0, 100) + "...";
      hx = s.getCaption() + "\n" + hx;
      var o = m.SelectionHintO; o.innerText = hx;
      o.style.color = o.style.color == "rgb(185, 0, 0)" ? "rgb(0 , 185, 0)" : "rgb(185, 0, 0)";
      this.surId = s.id;
      var v = s.getFieldValues(k.name, null, 1);
      this.rowsIdList = v.join(",");
    }
    DlgLinkAttachment._initialized = true;
  }
  var m = this;
  m._chkinCtrl = sur; m._cntr = cntr;
  m.createDlg();
  m.evh4GE = function (evtType, sur) { m.evh4Grid.call(m, evtType, sur); }
}
function DlgFileCheckin(ge, cntr) {
  this.ge = ge; this._cntr = cntr;
  this.maxFilesOT = 1;//max files one time //單次允許的上傳檔案個數
  if (DlgFileCheckin._initialized == undefined) {
    var po = DlgFileCheckin.prototype;
    po.createDlg = function () {
      var m = this, dg = m.dg, ge = m.ge, om = m._cntr;
      var xp = ["Action", "tarid", "subact"], vp = ["checkinFile", ge.getId(), "getLimitation"];
      var o, res = teQueryByAjax(null, xp, vp, null, 0, null, null, 1); if (!res) return;
      try { o = eval(res); if (!o) return; } catch (ex2) { return alert(res); }
      var sil = o.sil, fts = o.ft; // parseInt(teQueryByAjax(null, xp, vp, null, 0, null, null, 1),);
      if (isNaN(sil)) return; //找不到大小限制就表示無權checkin
      m.sil = sil;
      if (fts) m.fts = ("." + fts.replace(/;/gi, ";.")).split(";");
      var itms = ge.getFieldsAll ? ge.getFieldsAll() : null, ifmNm = "xf" + Math.random(),
      x = ["<div><form method='POST' class='CheckinForm' action='", msAjaxPageName,
      "' enctype='multipart/form-data' accept-charset='utf-8' target='", ifmNm, "' style='width:99%;' ><div id='txtHint' class='objectText'></div><div style='width:100%'>"], n = [];
      if (itms) {
        for (var i = 0; i < itms.length; i++) {
          var itm = itms[i], dpv = itm.dataPrivilege;
          if ((itm.isSaveDenied() && !itm.isVirtual()) || itm.isHidden4User()) continue;
          if (hasBit(dpv, DPVG.CheckIn)) n.push(itm);
        }
        if (n.length > 0) {
          x.push("<div>", i18nm.CheckinLinkTo.text);
          x.push("<select name='fldid'>");
          x.push("<option value='0'>", GJT.encodeAttr(i18nm.CheckinNoLink.text), "</option>");
          for (var i = 0; i < n.length; i++) { x.push("<option value='", GJT.encodeAttr(n[i].name) + "'>", GJT.encodeAttr(n[i].text), "</option>"); }
          x.push("</select></div>");
        }
      }
      x.push("<div id='selFilesList'>");
      for (var i = 1; i <= m.maxFilesOT; i++) {
        x.push("<div><input type='file' multiple='multiple' class='fileI' name='file", i, "' style='width:99%;margin:4px;'/>");
        x.push("<input type='button' class='btnSelFileName' value='", i18nm.NewNameOfCheckedIn.text, "' title='", i18nm.NewNameOfCheckedIn.tip, "'></input>");
        x.push("<input type='text' name='fileNameN", i, "' class='fileName4CheckIn' style='width:70%;margin:4px;'/></div>");
      }
      x.push("</div>");
      x.push("<div id='dropFilesList' class='dropFilesList' style='display:none;' ></div>");

      var siX = sil / 1024; if (siX > 2048) siX = siX / 1024 + " MB"; else siX = siX + " KB";
      x.push("<div>Max file size:", siX, ", File type:", (fts ? fts : "any"), "<br/>", htmlFileCheckinOptn());
      x.push(" <span title='", i18nm.UploadFilePath.tip, "'><input type='checkbox' name='chkUploadFilePath' id='chkUploadFilePath' value='Y' />", i18nm.UploadFilePath.text, "</span>");
      x.push(" <span title='", i18nm.UploadURL.tip, "'><input type='checkbox' name='chkUploadURL' id='chkUploadURL' value='Y' />", i18nm.UploadURL.text, "</span>");
      x.push("<br/> <span title='", i18nm.KeepOldVersion.tip, "'><input type='checkbox' name='chkKeepOld' id='chkKeepOld' value='Y' />", i18nm.KeepOldVersion.text, "</span>");
      x.push("</div>");
      //x.push("<div style='display:;'><span title='" + i18nm.UploadURL.tip + "'><input type='checkbox' name='chkUploadURL' id='chkUploadURL' value='Y' />" + i18nm.UploadURL.text + "</span></div>");
      x.push("<div style='display:;'>");
      //x.push(i18nm.Caption.text + " (" + i18nm.Caption.tip + ")<br/><input type='text' name='urlCaption' class='urlCaption' style='width:100%;' /><br/>");
      x.push(i18nm.TargetURL.text, " (", i18nm.TargetURL.tip, ")<br/><input type='text' name='tarURL' class='tarURL' style='width:100%;' disabled='disabled' />");
      x.push("</div>");
      x.push("<div style='padding:3px;'>", i18nm.NoteText.text); //, "<input type='button' class='getUrlTitle' value='URL Title'/>" 不要支援由網址自動取得title,這涉及到CORS 的安全性顧慮
      x.push("<div style='position:relative'><span name='hintDragDrop' style='position:absolute;padding-left:3px;padding-top:2px;color:grey;'>", (GJT.isFollowW3C ? i18nText(i18nm.HintDragDropToUpload) : ""), "</span><textarea name='noteText' style='width:100%;min-height:60px;' />", "</textarea></div></div>");
      x.push("<div style='text-align:center' id='upBySelect'><input class='submit' type='submit' value='", GJT.encodeAttr(i18nm.Upload.text), "'/><input class='reset' type='reset'/>");
      x.push("<br/><input class='linkattachment' id='linkattachment' style='display:;' type='button' value='", GJT.encodeAttr(i18nm.LinkAttachment.text), "' title='", GJT.encodeAttr(i18nm.LinkAttachment.tip), "' '/>");
      x.push("<input class='unlinkattachment' id='unlinkattachment' style='display:;' type='button' value='", GJT.encodeAttr(i18nm.UnlinkAttachment.text), "' title='", GJT.encodeAttr(i18nm.UnlinkAttachment.tip), "' '/>");
      x.push("</div>");
      x.push("<div style='text-align:center;display:none;' id='upByDrop'><input class='submit' type='button' value='", GJT.encodeAttr(i18nm.Upload.text), "'/>");
      x.push("<input class='reset' type='button' value='", GJT.encodeAttr(i18nm.Cancel.text), "'/>");
      x.push("</div></div>");
      x.push("<input type='hidden' name='tarid' value='", GJT.encodeAttr(ge.getId()), "'/>");
      x.push("<input type='hidden' name='kv' /><input type='hidden' name='inOptn' />");
      x.push("<input type='hidden' name='Action' value='checkinFile'/>");
      x.push("<input type='hidden' name='filePath' value=''/>");
      x.push("</form><iframe name='", ifmNm, "' id='", ifmNm, "' style='display:none'/></div>");
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("", 520, 460);
          dg.handleClose = function () {
            return dg.showMe(1);
          }
          m.dg = dg;
        }
        dg.setCaption(i18nm.CheckinFile.text + (ge.getCaption ? ("->" + ge.getCaption()) : ""));
        //dg.main.innerHTML = x.join("");
        dg.showMe();
        om = dg.main; m._cntr = om;
      }
      om.innerHTML = x.join("");
      om.ondragover = function (ev) { m.evtSysDragOver.call(m, ev) };
      om.ondrop = function (ev) { GJT.stopBubble(); return m.evtSysDrop.call(m, ev); }
      var ofm = getEM(om, "FORM")[0];
      var fos = getEMT(ofm, "INPUT", "file"), evo = function (ev) { GJT.stopBubble(); };
      for (var i = 0; i < fos.length; i++) {
        fos[i].ondragover = evo;
        fos[i].ondrop = evo;
      }
      m._ofm = ofm; m._fos = fos;
      m.kvO = GJT.getChildById(om, "kv");
      m.tarIdO = GJT.getChildById(om, "tarid");
      m.hintO = GJT.getChildById(om, "txtHint");
      m.dvOptns = GJT.getChildById(om, "chkOptns");
      m.optnO = GJT.getChildById(om, "inOptn");
      m.OnlyURLO = GJT.getChildById(om, "chkUploadURL");
      m.KeepOldO = GJT.getChildById(om, "chkKeepOld");
      m.txtURLO = GJT.getChildById(om, "tarURL");
      m.txtNote = GJT.getChildById(om, "noteText");
      m.hintDragDropO = GJT.getChildById(om, "hintDragDrop");
      //m.txtURLO.onchange = function () { m.evtURLChg.call(m); };
      m.OnlyURLO.onclick = function () { m.showURLbox.call(m); };
      m.OnlyPathO = GJT.getChildById(om, "chkUploadFilePath");
      m.OnlyPathO.onclick = m.OnlyURLO.onclick
      m.linkattachmentO = GJT.getChildById(om, "linkattachment");
      m.linkattachmentO.onclick = function () { m.LinkAttachment.call(m); };
      m.unlinkattachmentO = GJT.getChildById(om, "unlinkattachment");
      m.unlinkattachmentO.onclick = function () { m.UnlinkAttachment.call(m); };
      m.hintO.onclick = function () { m.UploadDone.call(m); };
      ofm.onsubmit = function () { return m.onsubmit.call(m); };
      m.upBySelectO = GJT.getChildById(om, "upBySelect");
      m.upByDropO = GJT.getChildById(om, "upByDrop");
      getEmByClass(m.upByDropO, "submit").onclick = function () { return m.checkinByDropDo.call(m); };
      getEmByClass(m.upByDropO, "reset").onclick = function () { return m.chgUploadMode.call(m, 0); };
      m.selFilesListO = GJT.getChildById(om, "selFilesList");
      m.dropFilesListO = GJT.getChildById(om, "dropFilesList");
      var oaBtnFnm = getAllByClass(om, "btnSelFileName");
      for (var i = 0; i < oaBtnFnm.length; i++) {
        var erf = function () { m.selFileName.call(m); };
        oaBtnFnm[i].onclick = erf;
      }
      m.txtNote.onpaste = function (ev) {
        m.evtOnPasteImg.call(m, ev)
      };
      m.txtNote.onclick = function () { m.txtNote.style.opacity = 1; hideIt(m.hintDragDropO); };
      m.txtNote.onkeydown = m.txtNote.onclick;
      m.hintDragDropO.onclick = function () { hideIt(m.hintDragDropO); m.txtNote.focus(); };
      if (dg) dg.fitSize();
      return 1;
    }
    po.showDlg = function () { if (this.dg) this.dg.showMe(); }
    po.setTarget = function (td) {
      var m = this, kv = m.ge.getKey(), hx = m.ge.getTextUIKF(td, 5);
      if (isNaN(parseInt(kv, 10))) hx = i18nm.CheckinLackIntKeyValue.text;
      m.kvO.value = kv;
      m.hintO.innerText = hx ? hx : "Selected";
      m._xtd_ = td;
      var fos = getAllByClass(m._cntr, "fileName4CheckIn"), fos2 = getAllByClass(m._cntr, "fileI"); //fileName4CheckIn fileI
      for (var i = 0; i < fos.length; i++) {
        fos[i].value = ""; fos2[i].value = "";
      }
    }
    po.showURLbox = function (o) {
      var m = this, o = o ? o : GJT.eventSrc(), vs = m.OnlyURLO.checked, vs2 = vs || m.OnlyPathO.checked, t = m._cntr;// getTBody(m.txtURLO);
      disableItA(m.txtURLO, !(vs || m.OnlyPathO.checked));
      disableItA(getEMT(t, "INPUT", "file"), vs);
      disableItA(getAllByClass(m._cntr, "btnSelFileName"), vs2);
      disableItA(getAllByClass(m._cntr, "fileName4CheckIn"), vs2);
      disableItA(m.KeepOldO, vs2);
      if (vs2) m.KeepOldO.checked = false;
      if (o.checked) {
        if (o == m.OnlyPathO) m.OnlyURLO.checked = false;
        if (o == m.OnlyURLO) m.OnlyPathO.checked = false;
      }
    }
    po.selFileName = function () {
      var m = this, o = GJT.eventSrc(), po = o.parentElement, ofn = getEmByClass(po, "fileName4CheckIn"), ofi = getEmByClass(po, "fileI");
      var tarId = m.tarIdO.value, kv = m.kvO.value, fnDft = ofi.value, idx = fnDft.lastIndexOf("\\");
      //取得本物件已經checkin的檔案名稱清單,供使用者選擇覆蓋
      if (idx >= 0) fnDft = fnDft.substring(idx + 1);
      var xp = ["Action", "subact", "tarid", "kv", KW.PrmTimezoneOffset], vp = ["checkoutFile", "getList", tarId, kv, (new Date()).getTimezoneOffset()];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (!txt) { ofn.value = fnDft; return; }
      var o = eval("o=" + txt);
      if (!(o instanceof Array)) { ofn.value = fnDft; return; }
      //建立選單
      var itms = new OpItems();
      itms.add(NIT(fnDft, fnDft));
      for (var i = 0; i < o.length; i++) {
        if (fnDft != o[i].name) itms.add(NIT(o[i].name, o[i].name));
      }
      itms.onclick = function (a, b) { m.selFileName2.call(m, a, b); }
      itms.tarOfn = ofn;
      SysShowMenu(itms);
    }
    po.selFileName2 = function (itm, itms) {
      itms.tarOfn.value = itm.name;
    }
    po.LinkAttachment = function () {
      //啟動一個小對話框，回應使用者選取的目標
      var m = this, dg = m._dlg4LinkAt;// DlgLinkAttachment
      if (!dg) { dg = new DlgLinkAttachment(m); m._dlg4LinkAt = dg; }
      dg.show(m.ge.ge);
    }
    po.UnlinkAttachment = function () {
      //取消連結是全部都取消,不需要選取
      if (!window.confirm(i18nm.msgConfirmExecute.text + "\n" + i18nm.UnlinkAttachment.tip)) return;
      var m = this, tarId = m.tarIdO.value, kv = m.kvO.value;
      var xp = ["Action", "subact", "tarid", "kv", KW.PrmTimezoneOffset], vp = ["checkinFile", "unlinkAttachment", tarId, kv, (new Date()).getTimezoneOffset()];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      m.UploadDone();
    }
    po.LinkAttachmentDo = function (tarIdSur, rowsIdSur) {
      //這裡要使用另一個subaction
      if (!rowsIdSur || !tarIdSur) return alert("Source id or source rows id not specified!");
      var m = this, tarId = m.tarIdO.value, kv = m.kvO.value;
      var xp = ["Action", "subact", "tarid", "kv", "tarIdSur", "rowsIdSur", KW.PrmTimezoneOffset], vp = ["checkinFile", "linkAttachment", tarId, kv, tarIdSur, rowsIdSur, (new Date()).getTimezoneOffset()];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      m.UploadDone();
    }
    //browser js 無法跨網域, CORS 也只限於被request端頁面上需要設定,即使是JSONP 技術也是server端決定,因此無法由browser端js主動跨域取資訊
    po.chgUploadMode = function (isDropMode) {
      var m = this, idm = isDropMode;
      showItA(m.upBySelectO, !idm);
      showItA(m.upByDropO, idm);
      showItA(m.selFilesListO, !idm);
      showItA(m.dropFilesListO, idm);
      m._isDropMode = idm;
      if (!idm) {
        delete m._tarFiles;
        //清除dropped file data hidden input
        m.addInput4DropUpload();//remove input
      } else {
        var fos = m._fos;
        for (var i = 0; i < fos.length; i++) { fos[i].value = ""; }
      }
    }
    po.addInput4DropUpload = function (fs) {
      var m = this, ofm = m._ofm;
      var hd = "xFileData", hf = "xFileName", cnt = 0;
      if (fs) {
        m._cntLoad = 0;//紀錄已載入的個數
        for (var i = 0; i < fs.length; i++) {
          var file = fs[i], idd = hd + cnt, idfn = hf + cnt;
          var oi = GJT.getChildById(ofm, idd), ofn = GJT.getChildById(ofm, idfn);
          if (!oi) {
            oi = addChi(ofm, "INPUT");
            oi.type = "hidden";
            oi.name = idd;
            ofn = addChi(ofm, "INPUT");
            ofn.type = "hidden";
            ofn.name = idfn;
          }
          if (m.dlgImage) {
            //這裡處理貼上圖片的上傳
            var fnn = window.prompt("Input file name for pasted image", m.imgFileName);
            if (!fnn) fnn = m.imgFileName;
            var dat = m.dlgImage.getDataURL(m.imgType);
            var ix = dat.indexOf(";base64,");
            if (ix > 0) { dat = dat.substring(ix + 8); }
            oi.value = dat;
            ofn.value = fnn + "." + m.imgFileType;
            m.dlgImage.close();
            ofm.submit();
            return 1;
          }
          var rdr = new FileReader();
          rdr._oi = oi;
          rdr.onload = function (file) {
            var rd = file.target, dat = rd.result;
            var ix = dat.indexOf(";base64,");
            if (ix > 0) { dat = dat.substring(ix + 8); }
            rd._oi.value = dat;
            m._cntLoad = m._cntLoad + 1;
            if (m._cntLoad == m._cntTarget) ofm.submit();
          }
          rdr.readAsDataURL(file);
          ofn.value = file.name;
          cnt++;
          m._cntTarget = cnt;
        }
        return cnt;
      } else { //delete input
        var i = 0, od, of;
        while (od || i == 0) {
          od = GJT.getChildById(ofm, hd + i); of = GJT.getChildById(ofm, hd + i);
          if (oi) { ofm.removeChild(oi); ofm.removeChild(of); }
          i++;
        }
      }
    }
    po.evtOnPasteImg = function (event) {
      // use event.originalEvent.clipboard for newer chrome versions
      var m = this, items = (event.clipboardData || event.originalEvent.clipboardData).items;
      var blob = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === 0) {
          blob = items[i].getAsFile();
          m.imgType = items[i].type;
        }
      }
      // load image if there is a pasted image
      if (blob !== null) {
        var dtf = {}, df = {}; dtf.files = [df];//只為了顯示檔案資訊
        var dt = new Date();
        var fnn = dt.format("yyyy/MM/dd HH:mm:ss"); df.type = blob.type;
        fnn = fnn.replace(new RegExp("/", "gi"), "").replace(new RegExp(":", "gi"), "").replace(new RegExp(" ", "gi"), "");
        var ix = df.type.indexOf("/");
        m.imgFileName = fnn; m.imgFileType = ix > 0 ? df.type.substring(ix + 1) : df.type;
        df.name = fnn + "." + m.imgFileType; df.size = blob.size;
        m.checkinByDOP(dtf);
        var reader = new FileReader();
        reader.onload = function (event) {
          m.dlgImage = teShowImgInDlgN("xxShwImg", "Image Pasted", event.target.result);
          m.dlgImage.showMe();
          m.dlgImage.setCutOutMode(1);
          var mnus = m.dlgImage.custMenus, itm1 = mnus["doUpload"];
          if (!itm1) {
            itm1 = { name: "doUpload", text: i18nm.Upload.text };
            mnus.add(itm1);
          }
          itm1.onclick = function () { return m.checkinByDropDo.call(m); };
          m.checkinByPaste();
        };
        reader.readAsDataURL(blob);
      }
    }
    po.checkinByPaste = function () {
      this.chgUploadMode(1);
    }
    po.checkinByDropDo = function () {
      //逐一上傳
      //把Form所有的INPUT 的值都設定到header
      var m = this, res = m.check4submit(m._tarFiles);
      if (res == false) return false;
      //決定採用Base64編碼文字 + hidden input ,以標準的FORhttps://stackoverflow.com/teamsM submit的方式上傳
      var cnt = m.addInput4DropUpload(m._tarFiles);
    }
    po.checkinByDrop = function (dataTransfer) {
      return this.checkinByDOP(dataTransfer);
    }
    po.checkinByDOP = function (dataTransfer) {
      var m = this, dtf = dataTransfer, tx = "", xio = m.maxFilesOT;
      hideIt(m.hintDragDropO);
      if (!m.kvO.value) return alert(i18nm.CheckinLackIntKeyValue.text);
      if (dtf.files && dtf.files.length > 0) {
        //return false;
        if (window.XMLHttpRequest && window.File && window.FileReader && window.FileList && window.Blob) {
          // Great success! All the File APIs are supported.
        } else {
          return alert('The File APIs are not fully supported in this browser.');
        }
        //drag file 應該不會再有其他格式
        m.txtURLO.value = ""; m.OnlyURLO.checked = false;
        //顯示出檔案名稱讓使用者看,然後按上傳鈕執行上傳
        var fi = dtf.files.length, tarFs = [];
        for (var i = 0; i < fi; i++) {
          var fo = dtf.files[i];//, ty = fo.type;
          tarFs.push(fo);
          if (tx) tx += "\n";
          tx += fo.name + " (" + fo.size + " bytes) (" + fo.type + ")";
        }
        m._tarFiles = tarFs;
        m.dropFilesListO.innerText = tx;
        m.chgUploadMode(1);
        m.OnlyURLO.checked = false; m.OnlyPathO.checked = false; m.showURLbox();
      }
      else {
        var isURL = 0, dsx0 = "", dsx = "";
        if (!dtf.types) return;
        for (var i = 0; i < dtf.types.length; i++) {
          var ty = dtf.types[i], ty0 = ty.toLowerCase(), da;
          try { da = dtf.getData(ty); }
          catch (ex) { continue; }
          tx += ty + ">>" + da + "\n";
          if (ty0.indexOf("url") == 0 || ty0.indexOf("text/uri-list") == 0) {
            m.txtURLO.value = da;
            isURL = true;
          } else if (ty0.indexOf("text/html") == 0) {
            var oh = newEmH(da); dsx = oh.innerText;//從HTML中取出標題文字
            oh.innerHTML = "";
          } else if (ty0.indexOf("text/plain") == 0 || ty0.indexOf("text") == 0) {
            dsx0 = da;
          } else {

          }
        }
        if (isURL) m.OnlyURLO.checked = true;
        m.showURLbox();
        m.txtNote.value = (dsx ? dsx : dsx0);// + "\n" + tx;
        if (isURL && (dsx || dsx0) == m.txtURLO.value) m.txtNote.value = "";
      }
      return true;
    }
    po.evtSysDragOver = function (ev) {
      if (!ev) ev = GJT.event();
      cmnEvtSetReturn();
      var dtf = ev.dataTransfer, xx = "";
      if (!dtf.types) return;
      for (var i = 0; i < dtf.types.length; i++) {
        var ty = dtf.types[i];
        xx += i + " " + ty + "\n";
      }
      //document.title = xx;
    }
    po.evtSysDrop = function (ev) {
      if (!ev) ev = GJT.event();
      //cmnEvtSetReturn(); GJT.stopBubble();
      delete this.dlgImage;//清除貼上的圖片視窗參照
      if (this.checkinByDOP(ev.dataTransfer) == true) { GJT.stopBubble(); return cmnEvtSetReturn(); }
    }
    po.onsubmit = function () {
      var res = this.check4submit();
      if (res == false) return false;
    }
    po.check4submit = function (tarFiles) {
      var m = this, om = m._cntr, ofm = m._ofm, of = getEM(om, "IFRAME")[0], fs = m._fos, fc = 0, kopn = getEMT(m.dvOptns, "INPUT", "checkbox"), kon = 0;
      for (var i = 0; i < kopn.length; i++) {
        if (kopn[i].checked) kon = kon | kopn[i].value;
      }
      m.optnO.value = kon;
      of.onload = function () { return m.UploadDone.call(m); };
      var pathOnly = m.OnlyPathO.checked, onlyURL = m.OnlyURLO.checked, myURL = GJT.trim(m.txtURLO.value);
      if (onlyURL && myURL == "") return false; //讓網址允許沒有http, 因為有可能上傳ftp 路徑 或是網路芳鄰路徑讓使用者直接由client端下載
      var fpt = GJT.getChildById(om, "filePath"); if (fpt) fpt.value = "";
      if (tarFiles) {
        fs = [{}]; fs[0].files = tarFiles;
      }
      for (var i = 0; i < fs.length; i++) {
        var fss = fs[i].files;
        if (!fss && fs[i].value != "") {
          fss = [{ name: fs[i].value }];
        }
        if (!fss) continue;
        if (pathOnly) {
          fc++;
          var fo = fs[i], fvv = fs[i].value;
          if (!fvv) continue;
          if (fvv.indexOf("\\\\") < 0) {//只有IE會傳回完整目錄名稱,其餘的只有檔名
            fvv = "";
            for (var j = 0; j < fss.length; j++) {
              var fn = fss[j].name;
              if (fvv != "") fvv += "|";
              fvv += fn;
            }
          } else {
            fvv = fvv.replace(new RegExp(", ", "gi"), "|"); //檔名不能使用|字元,所以用來區隔多檔案時的清單,可防止檔名內含有逗號
          }
          if (fpt.value) fpt.value = fpt.value + "|";
          fpt.value = fpt.value + fvv;
          continue;
        } else if (onlyURL) {
          fc++; continue;
        }
        for (var j = 0; j < fss.length; j++) {
          var fo = fss[j], fn = fss[j].name, ismh = 0;
          if (fo.size != null && fo.size > m.sil && !pathOnly) { alert(i18nm.FileSizeExceedN.text.replace(/\{0\}/, fn).replace(/\{1\}/, m.sil)); return false; }
          fc++;
          if (!m.fts) continue;
          for (var k = 0; k < m.fts.length; k++) {
            var pn = new RegExp(m.fts[k].replace("*", ""), "i");
            if (pn.test(fn)) ismh = 1;
          }
          if (!ismh) { alert(i18nm.FileTypeNotInList.text.replace(/\{0\}/, fn).replace(/\{1\}/, m.fts)); return false; }
        }
      }
      if (fc == 0) return false;
      //如果只上傳檔案路徑就需要檢查檔名是不是有含根目錄記號,沒有的話m.txtURLO 內容必須要指定目錄全名
      if (pathOnly) {
        var fv = fpt.value;
        if (fv == "" && myURL == "") return false; //沒有選定檔案且網址框也沒有輸入就無法繼續
        if (fv.indexOf("\\\\") != 0 && myURL.indexOf("\\\\") != 0) { //如果指定的檔案全稱前兩個字元不是\\ 且網址框也沒有輸入合格的目錄名稱就不允許上傳,磁碟代號或是沒有主機名稱的檔名不可以只上傳檔名,server端會無法開啟
          alert(i18nm.NoPathPleaseInputPath.text); return false;
        }
      }
      for (var i = 0; i < fs.length; i++) {
        if (pathOnly || onlyURL) fs[i].value = ""; //只上傳檔案路徑,檔案資料本身不上傳,把檔案路徑另外寫到input,清空file tag,以免檔案資料被上傳
      }
    }

    po.UploadDone = function () {
      var m = this, cnr = m._cntr, of = getEM(cnr, "IFRAME")[0].contentDocument, ge = m.ge, dgo = ge.ge ? ge.ge.dlgchkoutF : ge.dlgchkoutF;
      if (dgo && !isHidden(dgo.dg) && dgo.kvO.value == m.kvO.value) {
        dgo.setTarget(m.kvO.value, m.hintO.innerText);
      }
      m.chgUploadMode(0);
      if (ge.hintAnnexIcon) { ge.hintAnnexIcon(0, 2, 1); }
      var tx = of ? of.body.textContent : null;
      if (tx) {
        var ho = GJT.getChildById(cnr, "dvHintD");
        if (!ho) {
          ho = cnr.appendChild(newEmH("<div style='color:red;background-color:white;font-size:3em;' />"));
        }
        matchLoc(ho, m.txtNote, 0, 0, 0, 0, 1);
        ho.innerText = tx;
        showIt(ho);
        window.setTimeout(function () { hideIt(ho); }, 3000);
      }
      //if (of && of.body.innerText) alert(of.body.innerText);
    }
    DlgFileCheckin._initialized = 1;
  }
} //end DlgFileCheckin

function DlgFileCheckoutDtl() {
  if (DlgFileCheckoutDtl._initialized == undefined) {
    var po = DlgFileCheckoutDtl.prototype;
    po.createDlg = function () {
      var m = this, x = ["<div><table class='CheckinForm' style='width:100%'>",
      "<tr><td><div id='txtHint' class='objectText'></div></td></tr>",
      "<tr><td id='ckoctn'></td></tr>",
      "<tr><td align='center'><input type='hidden' name='uid' class='uid' /><button class='SaveAtr'>", i18nm.Save.text, "</button></td></tr></table></div>"];
      var dg = m.dg;
      if (!dg) {
        dg = dlgShowContents("");
        dg.handleClose = function () { return dg.showMe.call(dg, 1); }
        m.dg = dg;
      }
      dg.setCaption(i18nm.EditAttribute.text);
      dg.main.innerHTML = x.join("");
      dg.showMe();
      var om = dg.main;
      m.hintO = GJT.getChildById(om, "txtHint");
      m.ckoctnO = GJT.getChildById(om, "ckoctn");
      x = ["<table style='width:100%;'><tr><td style='width:90px;' align='right'>", i18nm.tlFile.text, ":</td><td valign='top'><div class='file'></div></td></tr><tr><td align='right'>",
      i18nm.NoteText.text, ":</td><td><textarea class='NoteEdit' style='width:99%;height:100px'></textarea></td></tr>",
      "<tr><td colspan='2' class='AttrEdit'>", htmlFileCheckinOptn(), "</td><tr>",
      "<tr><td align='right'>", i18nm.CheckinLinkTo.text, ":</td><td class='lnkfld'></td></tr>",
      "<tr><td align='right'>", i18nm.ModifiedDt.text, ":</td><td class='mdfdt'></td></tr>", "<tr><td align='right'>", i18nm.CreatedDt.text, ":</td><td class='crtdt'></td></tr>", "</table>"];
      m.ckoctnO.innerHTML = x.join("");
      m.uidO = getEmByClass(om, "uid");
      m.fileO = getEmByClass(om, "file");
      m.noteO = getEmByClass(om, "NoteEdit");
      m.lnkfldO = getEmByClass(om, "lnkfld");
      m.mdfdtO = getEmByClass(om, "mdfdt");
      m.crtdtO = getEmByClass(om, "crtdt");
      m.attrO = getEmByClass(om, "AttrEdit");
      m.saveO = getEmByClass(om, "SaveAtr");
      m.saveO.onclick = function () { m.saveAtr.call(m); }
    }
    po.showDlg = function () { this.dg.showMe(); }
    po.setTarget = function (tarId, uid, HintText) {
      var m = this, o, xp = ["Action", "subact", "tarid", "uid", KW.PrmTimezoneOffset], vp = ["checkoutFile", "getDtl", tarId, uid, (new Date()).getTimezoneOffset()], i4of = m._forOldFiles;
      if (i4of) { xp.push("i4of"); vp.push("Y"); }
      m._tarId = tarId; m._uid = uid; m._HintText = HintText;
      m.hintO.innerText = HintText ? HintText : "Selected";
      m.saveO.disabled = -1;
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (!txt) { return; };
      var o = eval("o=" + txt), fco = GJT.FileCheckinOptionEnum;
      if (o.err) { return alert(o.err); }
      o = o[0]; //first One only
      var dsb = !o.isowner || i4of;
      m.uidO.value = o.uid;
      m.fileO.innerText = o.name;
      m.noteO.value = o.ntx; m.noteO.readOnly = dsb;
      m.lnkfldO.innerText = (o.fld ? o.fld : "");
      m.mdfdtO.innerText = o.mdfdt + " " + o.mdfr;
      m.crtdtO.innerText = o.crtdt + " " + o.ownr;
      var opn = o.opn, ena = getEM(m.attrO, "input");
      for (var i = 0; i < ena.length; i++) {
        var en = ena[i];
        en.checked = hasBit(opn, en.value);
        en.disabled = dsb;
      }
      m.saveO.disabled = dsb;
      m.dg.fitSize();
    }
    po.saveAtr = function () {
      var m = this, opn = 0, e = getEM(m.attrO, "input");
      for (var i = 0; i < e.length; i++) { if (e[i].checked) opn = opn | e[i].value; }
      var xp = ["Action", "tarid", "uid", "optn", "ntx", "subact"], vp = ["checkinFile", m._tarId, m._uid, opn, m.noteO.value, "saveAttr"]; //m.noteO.value GJT.encodeAttr(m.noteO.value)
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      m.setTarget(m._tarId, m._uid, m._HintText);
      if (txt) alert(txt);
    }
    DlgFileCheckoutDtl._initialized = 1;
  }
  this.createDlg();
} //DlgFileCheckoutDtl

function DlgFileCheckout(ge, cntr) {
  this.ge = ge; this._cntr = cntr;
  if (DlgFileCheckout._initialized == undefined) {
    var po = DlgFileCheckout.prototype;
    po.createDlg = function () {
      var m = this, ge = m.ge, dg = m.dg, om = m._cntr, i4of = m._forOldFiles;
      var ifmNm = "xfo" + Math.random(),
      x = ["<div><form method='POST' class='CheckinForm' action='", msAjaxPageName,
      "' enctype='multipart/form-data' accept-charset='utf-8' target='", ifmNm, "' style='width:99%;' ><div id='txtHint' class='objectText'></div>",
      "<table style='width:100%'><tr><td id='ckoctn'></td></tr>",
      i4of ? "" : "<tr><td class='actionBar'><div class='delFile' style='cursor:pointer;'>" + i18nm.DeleteData.text + "</div> <div class='moveUp' style='cursor:pointer;'>" + i18nm.MoveUp.text + "</div> <div class='moveDown' style='cursor:pointer;'>" + i18nm.MoveDown.text + "</div></td></tr>",
      "</table><input type='hidden' name='tarid' value='", GJT.encodeAttr(ge.getId()), "'/><input type='hidden' name='kv' /><input type='hidden' name='Action' value='checkoutFile'/>",
      i4of ? "<input type='hidden' name='i4of' value='Y'/>" : "",
      "</form><iframe name='", ifmNm, "' id='", ifmNm, "' style='display:none'/></div>"];
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("");
          dg.handleClose = function () { return dg.showMe(1); }
          m.dg = dg;
        }
        dg.setCaption(i18nm.CheckoutFile.text + "->" + ge.getCaption() + (i4of ? (" (" + i18nm.OldVersions.text + ")") : ""));
        om = dg.main;
        m._cntr = om;
        dg.showMe();
      }
      om.innerHTML = x.join("");
      var ofm = getEM(om, "FORM")[0];
      m.kvO = GJT.getChildById(om, "kv");
      m.hintO = GJT.getChildById(om, "txtHint");
      //m.hintO.onclick = function () { m.UploadDone.call(m); };
      ofm.onsubmit = function () { m.onsubmit.call(m); };
      if (!i4of) {
        getEmByClass(ofm, "delFile").onclick = function () { m.delFile.call(m); }
        getEmByClass(ofm, "moveUp").onclick = function () { m.move.call(m, -1); }
        getEmByClass(ofm, "moveDown").onclick = function () { m.move.call(m, 1); }
      }
      m.ckoctnO = GJT.getChildById(om, "ckoctn");
      m.fmO = ofm;
      return 1;
    }
    po.showDlg = function () { if (this.dg) this.dg.showMe(); }
    po.setTarget = function (td) {
      var m = this, kv = m.ge.getKey(td), hx = m.ge.getTextUIKF(td), i4of = m._forOldFiles;
      if (isNaN(parseInt(kv, 10))) hx = i18nm.CheckinLackIntKeyValue.text;
      m.kvO.value = kv;
      m._tartdO = td;
      hx = hx ? hx : "Selected";
      m.hintO.innerText = hx;
      //if (isNaN(parseInt(kv, 10))) return alert(i18nm.CheckinLackIntKeyValue.text);
      var ge = m.ge, o, xp = ["Action", "subact", "tarid", "kv", KW.PrmTimezoneOffset], vp = ["checkoutFile", "getList", ge.getId(), kv, (new Date()).getTimezoneOffset()];
      if (i4of) { xp.push("i4of"); vp.push("Y"); xp.push("taruid"); vp.push(m._taruid); } //只顯示舊檔案
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (!txt) { m.ckoctnO.innerText = i18nm.CheckoutNoFile.text; return; };
      var o = eval("o=" + txt), s1 = "</td><td style='white-space:pre-wrap;'>", s2 = s1 + s1;
      if (!(o instanceof Array)) { m.ckoctnO.innerHTML = o.err; return; }
      txt = ["<table class='DataEdit'><tr class='title'><td>", s1, i18nm.tlFile.text, s1, s2, i18nm.Edition.text, s1, i18nm.NoteText.text, s1, i18nm.CheckinLinkTo.text, s1, "</td></tr>"];
      for (var i = 0; i < o.length; i++) {
        txt.push("<tr class='filelist'><td><input type='radio' name='uid' value='" + o[i].uid + "' " + (i == 0 ? "checked='checked'" : "") + (o[i].canDel ? " canDel='1' " : "") + "/></td><td valign='top' class='filename'>");
        txt.push("<div>");
        txt.push(GJT.encodeAttr(o[i].name));
        txt.push("</div>");
        txt.push(s1);
        if (o[i].fsize) {
          var fsiz = o[i].fsize;
          if (fsiz < 1024) { fsiz = fsiz + " Bytes"; }
          if (fsiz < 10485760) { fsiz = (fsiz / 1024).toFixed(1) + " KB"; }
          else { fsiz = (fsiz / 1048576).toFixed(2) + " MB"; }
          txt.push("<span style='white-space:nowrap'>" + fsiz + "</span>");
        }
        if (o[i].isurl) {
          txt.push(s1);
          txt.push("<a href='" + o[i].name + "' target='cko" + ge.getId() + "' >");
          txt.push(GJT.encodeAttr(i18nm.tlOpenPage.text));
          txt.push("</a>");
          txt.push(s1);
        }
        else {
          txt.push("</td><td class='Download'>");
          txt.push(GJT.encodeAttr(i18nm.Download.text));
          txt.push(s1);
          var vid = o[i].verId;
          if (vid != null) txt.push(vid);
          if (o[i].isMainVer && parseInt(vid, 10) > 0) {
            txt.push("<span class='OldVersion' title='" + GJT.encodeAttr(i18nm.OldVersions.tip) + "'>");
            txt.push(GJT.encodeAttr(i18nm.OldVersions.text));
            txt.push("...</span>");
          }
        }
        txt.push(s1);
        if (o[i].ntx) txt.push(GJT.encodeAttr(o[i].ntx));
        txt.push(s1);
        if (o[i].fld) txt.push(GJT.encodeAttr(o[i].fld));
        txt.push("</td><td class='ChgAttr'>...");
        txt.push("</td></tr>");
      }
      txt.push("</table>");
      m.ckoctnO.innerHTML = txt.join("");
      m.ckoctnO.onclick = function () { return m.checkIt.call(m); }
      m.ckoctnO.ondblclick = function () { return m.checkdc.call(m); }
      if (m.dg) m.dg.fitSize();
    }
    po.onsubmit = function () {
      var m = this, of = getEM(m._cntr, "IFRAME")[0];
    }
    po.checkIt = function () {
      var s = GJT.eventSrc(), o = getTR(s); if (!o) return;
      var o = getEMT(o, "input", "radio"), cn = s.className;
      if (o.length > 0) o = o[0];
      if (cn == "ChgAttr") this.editAtr(o.value);
      if (cn == "filename" || cn == "Download") o.checked = true;
      if (cn == "Download") return this.fmO.submit();
      if (cn == "OldVersion") return this.showOldVers(o.value);
    }
    po.showOldVers = function (uid) {
      var m = this, dg2 = m._dg4of, ih, bs;
      if (dg2) ih = isHidden(dg2.dg);
      if (!dg2) {
        dg2 = new DlgFileCheckout(m.ge); //m._forOldFiles
        dg2._forOldFiles = 1;
        dg2.createDlg();
        m._dg4of = dg2;
        bs = 1;
      }
      dg2._taruid = uid;
      dg2.showDlg();
      dg2.setTarget(m._tartdO);
      if (bs && dg2.dg) { dg2.dg.fitSize(); ih = 1; }
      if (ih) showBesideMouse(dg2.dg.dlg);
      dg2.dg.toZTop();
      GJT.stopBubble();
    }
    po.checkdc = function () {
      var s = GJT.eventSrc(), o = getTR(s); if (!o) return;
      if (s.className == "filename") return this.fmO.submit();
    }
    po.editAtr = function (uid) {
      var dg = PROG._dgFCKO, bs;
      if (!dg) {
        dg = new DlgFileCheckoutDtl();
        PROG._dgFCKO = dg; bs = 1;
      }
      dg._forOldFiles = this._forOldFiles;
      dg.setTarget(this.ge.getId(), uid, this.hintO.innerText);
      dg.showDlg(); if (bs) showBesideMouse(dg.dg.dlg);
      dg.dg.toZTop();
    }
    po.delFile = function () {
      var m = this, e = getEMT(m.fmO, "input", "radio"), uid, tr, ntr;
      for (var i = 0; i < e.length; i++) {
        var b = e[i]; if (b.checked) { uid = b.value; tr = getTR(b); if (!getAtr(b, "canDel")) return alert("Delete denied!"); }
      }
      if (!uid) return;
      if (!window.confirm(i18nm.CfmDelete.text + "\n" + getEmByClass(tr, "filename").innerText)) return;
      var xp = ["Action", "tarid", "uid", "subact"], vp = ["checkinFile", m.ge.getId(), uid, "delFile"];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (txt) alert(txt);
      else {
        ntr = tr.nextSibling; if (!ntr) ntr = tr.previousSibling;
        if (tr) tr.parentNode.removeChild(tr); if (m.ge.hintAnnexIcon) { m.ge.hintAnnexIcon(0, 2, 1); }
        if (ntr) { e = getEMT(ntr, "input", "radio")[0]; if (e) e.checked = true; }
      }
    }
    po.move = function (stp) {
      var m = this, e = getEMT(m.fmO, "input", "radio"), uid, tr, p;
      for (var i = 0; i < e.length; i++) { var b = e[i]; if (b.checked) { uid = b.value; tr = getTR(b); } } if (!uid) return;
      var p = tr.parentNode, pr = tr.previousSibling, nr = tr.nextSibling;
      if (getEMT(pr, "input", "radio")[0]) pr == null;
      if (stp > 0 && !nr) return;
      if (stp < 0 && (!pr || !pr.previousSibling)) return; //第一列不能動
      var xp = ["Action", "tarid", "uid", "subact", "dir"], vp = ["checkinFile", m.ge.getId(), uid, "move", stp > 0 ? "down" : "up"];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (txt) return alert(txt);
      if (stp > 0) p.insertBefore(nr, tr);
      else if (stp < 0) p.insertBefore(tr, pr);
    }
    DlgFileCheckout._initialized = 1;
  }
} //end DlgFileCheckout

function teShowFlowCtrl(tar, cntr) {
  return wfShowDlg(tar, cntr);
}
//Flow Control codes

function wfShowDlg(tar, cntr) {
  //如何顯示流程? obj id
  //已經建立了Flow物件的資料 就
  //使用JSON格式,一次可以多個物件,每個物件一個代表物件
  //反過來,不顯示獨立的視窗或對話框,直接把流程控制的介面物件顯示在原來的表格上,這樣可以簡化UI設計,提高使用者方便性
  //依據個物件的狀態顯示當前流程的階段,以及使用者可以操作的對應功能物件(例如 送審,同意,不同意,沒意見,退回...)
  var m = tar, bkr = m, ih;
  var dg = m.dgfwc, bs;
  //if (dg) ih = isHidden(dg.dg);
  if (!dg) {
    if (bkr instanceof GridEdit) bkr = new wfBrokerGE(m);
    if (!bkr.getPageId || !bkr.getRowKeysAll || !bkr.mainTR || !bkr.getId) return alert("Method getPageId getRowKeysAll mainTR getId are not implemented!");
    dg = new DlgFlowCtrl(bkr, cntr); m.dgfwc = dg; dg.createDlg();
    bs = 1;
  }
  dg.showDlg(); dg.setTarget();
  if (dg.dg) {
    if (bs) {
      if (!dg.fitsized) { dg.dg.fitSize() }; ih = 1;
    }
    if (ih) showBesideMouse(dg.dg.dlg);
    if (!bs) dg.dg.showMe();
  }
  makeSureInsideWindow(dg.dg.dlg);
  return dg;
}
function wfActionCaption(at) {
  var a = GJT.WorkflowActionTypeEnum, n = i18nm;
  if (at == a.Promote || at == "Promote") return n.Promote.text;
  if (at == a.Approve || at == "Approve") return n.Approve.text;
  if (at == a.Demote || at == "Demote") return n.Demote.text;
  if (at == a.Disapprove || at == "Disapprove") return n.Disapprove.text;
  if (at == a.Ignore || at == "Ignore") return n.Ignore.text;
  if (at == a.Reject || at == "Reject") return n.Reject.text;
  if (at == a.Recant || at == "Recant") return n.Recant.text;
  if (at == a.CloseFlow || at == "CloseFlow") return n.CloseFlow.text;
  if (at == a.StartFlow || at == "StartFlow") return n.StartFlow.text;
  if (at == a.ChangeStatus || at == "ChangeStatus") return n.ChangeStatus.text;
  if (at == a.InviteSigner || at == "InviteSigner") return n.InviteSigner.text;
  if (at == a.DisinviteSigner || at == "DisinviteSigner") return n.DisinviteSigner.text;
  if (at == a.DeleteToDo || at == "DeleteToDo") return n.NotMyBusiness.text;
  if (at == "Batch") return n.Batch.text + " (" + n.Batch.tip + ")";
  return at;
}
function wfActionName(at) {
  var a = GJT.WorkflowActionTypeEnum, n = i18nm;
  if (at == a.Promote) return "Promote";
  if (at == a.Approve) return "Approve";
  if (at == a.Demote) return "Demote";
  if (at == a.Disapprove) return "Disapprove";
  if (at == a.Ignore) return "Ignore";
  if (at == a.Reject) return "Reject";
  if (at == a.Recant) return "Recant";
  if (at == a.DeleteToDo) return "DeleteToDo";
  if (at == a.CloseFlow) return "CloseFlow";
  return at;
}
function wfBrokerGE(ge) {
  this.ge = ge;
  this.hasRelatedtems = ge.hasRelatedtems;
  if (wfBrokerGE._initialized == undefined) {
    var po = wfBrokerGE.prototype;
    po.getPageId = function () { return getTargetPage(this.ge); } //必要方法
    po.getId = function () { return this.ge.id; }; //必要方法
    po.getCaption = function () { return this.ge.text; }
    po.mainTR = function () { return this.ge.mainTR(); } //必要方法
    po.getTextUIKF = function (tr) { return this.ge.getTextUIKF(tr, 5); } //代表該row的可識別文字 例如 車種名稱
    po.getDataForm = function (getDlg) { return this.ge.getDataForm(getDlg); }

    po.addStatusColumn = function () {
      var ge = this.ge;
      if (ge.fieldsAll["stateId"]) ge._wfstsfldnm = "stateId";
      else {
        ge.addField(_WFzxSts, i18nm.FlowStatus.text, "", GDT.String, GIA.WriteDenied | GIA.Virtual, 1, 1, 0);
        ge._wfstsfldnm = _WFzxSts;
      }
    }
    po.getStatusTD = function (tr) {
      if (!ge._wfstsfldnm) this.addStatusColumn();
      return tr.cells[this.ge.getCellIndex(ge._wfstsfldnm)];
    }
    po.getRowKeysAll = function (trs) {//必要方法
      var ge = this.ge, fk = ge.fieldsKey.getNames(","); if (!fk) return;
      if (!trs) trs = ge.getAllDataRows(1);
      var kv = ge.getFieldValuesR(fk, trs);
      if (!kv || !kv.length) return {};
      return { values: kv, rows: trs };
    }
    po.getSelectedTRs = function () {
      return this.ge.getSelectedTRs();
    }
    po.evtListenerAdd = function (evtType, eh) {
      return this.ge.evtListenerAdd(evtType, eh);
    }
    po.syncState = function (tr, stateTxt) { var ix = this.ge.getCellIndex("stateId"); if (ix > -1) { tr.cells[ix].innerText = stateTxt; } }
    po.aftStateChanged = function (trs) { if (this.ge.aftStateChanged) return this.ge.aftStateChanged(this.ge, trs); }
    po.opExecute = function (a, b) { return this.ge.opExecute(a, b); }
    po.evtBroadcast = function (evtType, prm) {//轉發事件給GE
      if (this.ge.evtBroadcast) return this.ge.evtBroadcast(evtType, prm);
    }
    po.removeRows = function (rows) {
      if (this.ge.removeRows) return this.ge.removeRows(rows);
    }
    po.showRelatedItems = function () { return this.ge.showRelatedItems(); }
    wfBrokerGE._initialized = 1;
  }
} //end wfBrokerGE
function DlgFlowCtrl(ge, cntr) {
  this.ge = ge; this.pgid = ge.getPageId(); this._cntr = cntr;
  this.invitationText = "";
  if (DlgFlowCtrl._initialized == undefined) {
    var po = DlgFlowCtrl.prototype;
    po.createDlg = function () {
      var m = this, ge = m.ge, dg = m.dg, om = m._cntr;
      var x = ["<div>",
      !om ? "" : "<div class='wfCaption' align='center'></div>",
      "<table class='WF0' border='0' cellspacing='0' cellpadding='0'>",
      "<tr><td id='ckoctn' valign='top'></td></tr>",
      "<tr><td class='nxStageArea' valign='top'></td></tr>",
      "<tr class='BTNBAR'><td align='center' valign='top'>",
      ge.opExecute ? "<table class='Shaft' cellspacing='0' cellpadding='0' style='display:inline;background-color:inherit'><tr><td class='L'></td><td class='R'></td></td></tr></table>" : "",
      "<span class='chk' style='cursor:default;display:none;' onclick='cmnSwitchInputChecked();'><input type='checkbox' id='lockShwItem'/>", i18nm.Lock.text, "</span>",
      "<span class='chk' style='cursor:default;display:none;' onclick='cmnSwitchInputChecked();'><input type='checkbox' id='syncShwHist' checked='checked'/>", i18nm.SyncShow.text, "</span>",
      "<span class='chkSyncDtl' style='cursor:default;display:;' onclick='cmnSwitchInputChecked();'><input type='checkbox' id='syncShwDtl' />", i18nm.Detail.text, "</span>",
      "<span class='tabCntr'></span>",
      "<button id='btnShwHist'>", i18nm.ShowFlowHistory.text, "</button>",
      "<button id='btnShwTmpl'/>", i18nm.Workflow.text, "</button>",
      "<button class='Refresh'>" + i18nm.tlRefreshData.text + "</button>",
      "<button id='btnInviteSigner'>" + i18nm.InviteSigner.text + "</button>",
      "<button id='btnDisinviteSigner'>" + i18nm.DisinviteSigner.text + "</button>",
      "<button id='btnNextStage'>" + i18nm.SetupNextStage.text + "</button>",
      "<button id='btnNotMyBus' title='", i18nm.NotMyBusiness.tip, "'>" + i18nm.NotMyBusiness.text + "</button>",
      "</td></tr></table>",
      "<div class='wfData' style='overflow:auto;cursor:default;display:none;border-top:2px solid #888888'></div>",
      "</div>"];
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("", "40%");
          dg.handleClose = function () { return m.evtClose.call(m); }; //function () { dg.showMe(1); return true; }
          dg.handleResize = function (dgo) { m.evtResize.call(m, dgo); };
          dg.handleShowed = function () { return m.evtShowed.call(m); };
          m.dg = dg;
        }
        m.setCaption();
        dg.showMe();
        om = dg.main;
        m._cntr = om;
        dg.handleEvent = function () { m.evtHandle.call(m); };
        om.style.hieght = "auto";
      }
      else om.onclick = function () { m.evtHandle.call(m); };
      om.innerHTML = x.join("");
      m.cptnO = getEmByClass(om, "wfCaption");
      m.rshO = getEmByClass(om, "Refresh");
      m.rshO.onclick = function () { m.refreshMain.call(m); };
      m.ckoctnO = GJT.getChildById(om, "ckoctn");
      m.datactnO = getEmByClass(om, "wfData");
      m.nxStageAreaO = getEmByClass(om, "nxStageArea");
      m.tabCntrO = getEmByClass(om, "tabCntr");
      m.shaftO = getEmByClass(om, "Shaft");
      m.lockShwItemO = GJT.getChildById(om, "lockShwItem");
      m.syncShwHistO = GJT.getChildById(om, "syncShwHist");
      m.syncShwDtlO = GJT.getChildById(om, "syncShwDtl");
      showItA(getEmByClass(om, "chkSyncDtl"), m.ge.showRelatedItems);
      m.shwHistO = GJT.getChildById(om, "btnShwHist");
      m.shwHistO.onclick = function () { m.showHist.call(m); };
      GJT.getChildById(om, "btnNextStage").onclick = function () { m.showNextStageInfo.call(m); }
      var bn = GJT.getChildById(om, "btnShwTmpl");
      bn.onclick = function () { m.showTmpl.call(m); };
      m.shwTmplO = bn;
      var csh = getEmByClass(om, "Shaft");
      if (csh) {
        var sft = new teShaft(null, null, ge, 0, null, csh);
        sft.onclick = function (sMode, ShaftObj) { PointerMoveClick(sMode, ShaftObj); m.showSigning(); }
      }
      bn = GJT.getChildById(om, "btnInviteSigner"); hideIt(bn);
      m.inviteSignerO = bn;
      bn.onclick = function () { m.InviteSigner.call(m); };
      bn = GJT.getChildById(om, "btnDisinviteSigner"); hideIt(bn);
      m.disinviteSignerO = bn;
      bn.onclick = function () { m.DisinviteSigner.call(m); };

      bn = GJT.getChildById(om, "btnNotMyBus"); hideIt(bn);
      m.deleteMyToDoO = bn;
      bn.onclick = function () { m.deleteMyToDo.call(m); };

      m.showDetailForm();
    }
    po.showDetailForm = function (forceShow) {
      var m = this, ge = m.ge; if (!forceShow && !m.syncShwDtlO.checked) return;
      var dtform = ge.getDataForm ? ge.getDataForm(1) : null;
      if (!dtform) return;
      m.syncShwHistO.checked = true;
      var addPnl = !m._dataPannel;
      //hideIt(m.syncShwHistO);
      if (addPnl) m.addDataPanel(dtform);
      var dpnl = m._dataPannel;
      if (!dpnl.contains(dtform)) m.addDataPanel(dtform);
      if (ge.hasRelatedtems) {
        var cc = ge.showRelatedItems();
        var rls = PROG.relations;
        for (var i = 0; i < cc.length; i++) {
          //if (!addPnl) continue;
          var oge = cc[i].GridEdit;
          if (dpnl.contains(cc[i])) continue;
          if (oge && rls) {
            // 如果關聯的欄位是PK欄位才以表單顯示,因為一定只有一筆資料
            var shwByForm = false;
            for (var j = 0; j < rls.length; j++) {
              var fl = rls[j];
              if (fl.from == ge.ge && fl.to == oge) {
                if (oge.fieldsKey && (fl.toFields.getNames(",") == oge.fieldsKey.getNames(","))) shwByForm = true;
              }
            }
            var dtform = (shwByForm && oge.getDataForm) ? oge.getDataForm(1) : null;
            shwByForm = shwByForm && dtform;
            if (shwByForm) {
              m.addDataPanel(dtform);
              if (cc[i].dlgCtrl) cc[i].dlgCtrl.minMe(1);
            }
            else m.addDataPanel(cc[i]);
          } else m.addDataPanel(cc[i]);
        }
      }
      if (addPnl) { m.dg.fitSize(); window.setTimeout(function () { m.dg.moveToRT(); DialogReviseWH(m.dg); }, 500) }
    }
    po.addDataPanel = function (obj) {
      var m = this, dp = m._dataPannel, dao = m.datactnO;
      if (!dp) { dp = new teDataPanel(dao, m.tabCntrO); m._dataPannel = dp; }
      //if (!dao.style.minHeight) dao.style.minHeight = "100px";
      dp.add(obj); showIt(dao);
    }
    po.setCaption = function (xCpt, dg) {
      var m = this, ge = m.ge, c = (ge.getCaption ? ge.getCaption() : "");
      if (!dg) c = i18nm.Workflow.text + ": " + c;
      if (m._lstTR && ge.getTextUIKF) c += ge.getTextUIKF(m._lstTR);
      if (xCpt) c += xCpt;
      if (!dg) dg = m.dg;
      if (dg) dg.setCaption(c);
      else if (m.cptnO) m.cptnO.innerText = c;
    }
    po.showDlg = function () { if (this.dg) { this.dg.showMe(0, 1); } }
    po.setTarget = function (kvo, trs) {
      var m = this, ge = m.ge;
      if (ge.addStatusColumn) ge.addStatusColumn();
      if (!kvo) kvo = ge.getRowKeysAll(trs);
      if (!kvo || !kvo.rows) return;
      var o = m.doRequest("getState", kvo.values.join(","));
      m.showInfo(kvo.values, kvo.rows, o);
      delete m.invitedSigner;
    }
    po.refreshMain = function () {
      var m = this, ge = m.ge, kvo = {};
      kvo.values = [m._lstTR._xkvz];
      kvo.rows = [m._lstTR];
      return m.setTarget(kvo);
    }
    po.InviteSigner = function () {
      var m = this;
      sysObjSelectorShow(function (selector, res) { m.inviteSignerOK.call(m, selector, res); }, m.invitedSigner, i18nm.InviteSigner.text, "65662");
    }
    po.DisinviteSigner = function () {
      var m = this, ge = m.ge, tr = m._lstTR, wfd = m._wfd;
      var msg = i18nm.DisinviteSigner.text + "!\n" + i18nm.msgConfirmExecute.text;
      if (!window.confirm(msg)) return;
      var o = m.doRequest("DisinviteSigner", tr._xkvz, ["flowid", "stageid", "signers", "cmnt"], [wfd.id, wfd.csid, "", ""]);
      if (o && o.err) return alert(o.err);
      m.showInfo([tr._xkvz], [tr], o);
    }
    po.inviteSignerOK = function (selector, res) {
      var m = this, ge = m.ge, tr = m._lstTR, wfd = m._wfd, usrs = res[0].join(",");
      m.invitedSigner = usrs;
      if (!window.confirm(i18nm.InviteSignerConfirm.text + "\n" + res[1].join("\n"))) return;
      var scmnt = window.prompt(i18nm.InviteReason.text, m.invitationText);
      if (scmnt == null) return;
      m.invitationText = scmnt;
      var o = m.doRequest("InviteSigner", tr._xkvz, ["flowid", "stageid", "signers", "cmnt"], [wfd.id, wfd.csid, usrs, scmnt]);
      if (o && o.err) return alert(o.err);
      m.showInfo([tr._xkvz], [tr], o);
    }
    po.addStartButton = function (tdSt, kv, tr, restart, bh) {
      var m = this, btn = addE("<button />", tdSt);
      btn.innerText = restart ? i18nm.RestartFlow.text : i18nm.StartFlow.text;
      btn._rowid = kv;
      btn.tarTR = tr;
      btn.onclick = function () { m.startFlow.call(m); }
      if (bh) { btn.innerText = btn.innerText + " (" + i18nm.Batch.text + ")"; btn.bh = bh; btn.className = "Batch"; }
      return btn;
    }
    po.showInfo = function (kv, trs, o) {
      if (o.err) return alert(o.err);
      if (o.warnmsg) alert(o.warnmsg);
      var m = this, ge = m.ge;
      var mtr = ge.mainTR(); // ixSt = (ge.getStatusCellIndex ? ge.getStatusCellIndex() : -1)
      for (var i = 0; i < kv.length; i++) {
        var wfd = o[kv[i]], tdSt, btn; // = trs[i].children[ixSt]
        if (ge.getStatusTD) tdSt = ge.getStatusTD(trs[i]);
        trs[i]._zwfdx = wfd; trs[i]._xkvz = kv[i];
        if (mtr == trs[i]) m.showFlowInfoSigning(mtr);
        if (ge.syncState && wfd) ge.syncState(trs[i], wfd.sts);
        if (!tdSt) continue;
        if (!wfd) {
          tdSt.innerText = "";
          if (!kv[i]) continue;
          m.addStartButton(tdSt, kv[i], trs[i]);
        }
        else tdSt.innerText = wfd.sts;
      }
      if (!m.fitsized && m.dg) { m.fitsized = 1; m.dg.fitSize(); }
      m.hideBatch();
    }
    po.addTR4Signing = function (tb0) {
      var tr = tb0.insertRow(tb0.rows.length);
      var td0 = tr.appendChild(newEm("td"));
      td0.className = "action"; td0.noWrap = true;
      tr = tb0.insertRow(tb0.rows.length);
      td0 = tr.appendChild(newEm("td")); td0.noWrap = true;
    }
    po.showFlowInfoSigning = function (myTR) {
      var m = this, ge = m.ge, dv = m.ckoctnO, SP = GJT.WorkflowPrivilegeEnum, wfd = myTR._zwfdx, c = m.nxStageAreaO;
      c.innerText = "";//清除下一關內容;
      dv.innerText = ""; dv.className = "WF";
      m._lstTR = myTR;
      m.evtBroadcast("bfrShowFlowInfo", [m, myTR, wfd]);
      if (!wfd || wfd.closed) {
        if (m.syncShwHistO.checked) m.showHist(1);
        var cls = (wfd && wfd.closed);
        m.setCaption(cls ? " (" + i18nm.FlowIsClosed.text + ")" : "");
        delete m._wfd;
        if (cls) { if (!wfd.restart) return; }
        var kv = ge.getRowKeysAll([myTR]);
        if (kv.values[0]) {
          myTR._xkvz = kv.values[0];
          m.addStartButton(dv, myTR._xkvz, myTR, cls);
          if (ge.getSelectedTRs) m.addStartButton(dv, myTR._xkvz, myTR, cls, 1);
        }
        hideIt([m.inviteSignerO, m.shwTmplO, m.shwHistO, m.disinviteSignerO]);
        return;
      }
      var stgs = wfd.stgs;
      m._wfd = wfd;
      if (!stgs) return;
      showIt([m.inviteSignerO, m.shwTmplO, m.shwHistO]);
      var tb0 = addE("<table class='signing' border='0' />", dv), cc = 0, bhtm = "<button class='", trTmpl = "<tr><td class='action'></td></tr><tr><td></td></tr>", dvT = "<span />";
      var signHnd = function () { m.prcsSign.call(m); }
      var hasInvitation = 0;
      for (var i = 0; i < stgs.length; i++) {
        var stg = stgs[i];
        if (wfd.csid != stg.id) continue; //not current stage
        m.setCaption(" (" + stg.txt + ") " + (wfd.ver ? wfd.ver : ""));
        var dv2 = dv;
        var pvg = stg.pvg, nsgnd = stg.notsigned, sgnd = stg.signed, pomsup = (pvg & SP.PromoteSuper) == SP.PromoteSuper;
        if (sgnd) {
          for (var j = 0; j < sgnd.length; j++) {
            var sg = sgnd[j], dv4, dv5, pvg1 = sg.pvg;
            //if (!sg.txt) continue; //非簽核不顯示
            //addE(trTmpl, tb0);
            m.addTR4Signing(tb0);
            var td0 = tb0.rows[cc].cells[0], td1 = tb0.rows[cc + 1].cells[0]; cc += 2;
            //if ((cc % 2) == 0) tr.className = "even";
            var dt = (new Date()).fromISO8601(sg.dt).format("yyyy/MM/dd HH:mm:ss");
            if (sg.txt) addE(dvT, td0).innerText = sg.txt; //i18nm.Opinion.text +
            var e = addE(dvT, td0); e.innerText = wfActionCaption(sg.act); e.className = wfActionName(sg.act) + "C";
            addE(dvT, td0).innerText = dt + " " + sg.signer;
            if ((pvg1 & SP.Recant) == SP.Recant) {
              addE(bhtm + "Recant' />", td0).innerText = i18nm.Recant.text;
              td0.onclick = signHnd;
              td0.signatureId = sg.id; td0.flowId = wfd.id; td0.stageId = stg.id;
            }
            if (sg.comment) addE("<div class='opinionLock' />", td1).innerText = sg.comment;
            else td1.parentNode.removeChild(td1);
          }
        }
        if (!nsgnd || pomsup) {
          //沒有需要簽核的,並且有stage promote demote等權限時,就顯示按鈕
          //addE(trTmpl, tb0);
          m.addTR4Signing(tb0);
          var shwTxt = 0, td0 = tb0.rows[cc].cells[0], td1 = tb0.rows[cc + 1].cells[0]; cc += 2;
          td0.onclick = signHnd;
          td0.flowId = wfd.id; td0.stageId = stg.id; td0.signatureId = 0;
          if ((pvg & SP.Promote) == SP.Promote || pomsup) {
            if (wfd.nxstg) {
              addE(bhtm + "Promote' />", td0).innerText = i18nm.Promote.text;
              shwTxt = 1;
            }
          }
          if ((pvg & SP.Demote) == SP.Demote) {
            if (wfd.prestg) {
              addE(bhtm + "Demote' />", td0).innerText = i18nm.Demote.text;
              shwTxt = 1;
            }
          }
          if (shwTxt) {
            if (ge.getSelectedTRs) {
              var en = addE(bhtm + "Batch' />", td0);
              en.innerText = i18nm.Batch.text; en.title = i18nm.Batch.tip;
              hideIt(en);
            }
            addE("<textarea class='opinion' />", td1); td1.className = "opinionC";
          }
        }
        if (!nsgnd) continue;

        for (var j = 0; j < nsgnd.length; j++) {
          var sgn = nsgnd[j], pvg1 = sgn.pvg, xt0, scmnt;
          if (sgn.act == GJT.WorkflowActionTypeEnum.InviteSigner) hasInvitation = 1;
          //addE(trTmpl, tb0);
          m.addTR4Signing(tb0);
          var td0 = tb0.rows[cc].cells[0], td1 = tb0.rows[cc + 1].cells[0]; cc += 2;
          //if ((cc % 2) == 0) tr.className = "even";
          td0.onclick = signHnd;
          td0.signatureId = sgn.id; td0.flowId = wfd.id; td0.stageId = stg.id;
          addE("<span />", td0).innerText = i18nm.Opinion.text + "(" + sgn.txt + "):";
          if (!sgn.comment) sgn.comment = "";
          if (pvg1) {
            scmnt = sgn.comment;
            if (wfd.lstRefStg) {
              var rsg = wfd.lstRefStg, sgndR = rsg.signed;
              if (sgndR) {
                for (var k = 0; k < sgndR.length; k++) {
                  var sg = sgndR[k];
                  if (sg.id == sgn.id)
                    scmnt = sg.comment;
                }
              }
            }
            addE("<textarea class='opinion' />", td1).value = scmnt; td1.className = "opinionC";
            var xt = td1.children[0]; xt.sgn = sgn;
            xt.onchange = function () { this.sgn.comment = this.value; }; if (!xt0) xt0 = xt;
          } else addE("<div class='opinionDisabled' />", td1).innerText = sgn.comment;
          if ((pvg1 & SP.Approve) == SP.Approve) {
            addE(bhtm + "Approve' />", td0).innerText = i18nm.Approve.text;
          }
          if ((pvg1 & SP.Disapprove) == SP.Disapprove) {
            addE(bhtm + "Disapprove' />", td0).innerText = i18nm.Disapprove.text;
          }
          if ((pvg1 & SP.Ignore) == SP.Ignore) {
            addE(bhtm + "Ignore' />", td0).innerText = i18nm.Ignore.text;
          }
          if ((pvg1 & SP.Reject) == SP.Reject) {
            addE(bhtm + "Reject' />", td0).innerText = i18nm.Reject.text;
          }
          if ((pvg1 & SP.Approve) == SP.Approve) {
            addE(bhtm + "DeleteToDo' />", td0).innerText = i18nm.NotMyBusiness.text;
          }
          if (xt0) xt0.focus();
          if (ge.getSelectedTRs) {
            var en = addE(bhtm + "Batch' />", td0);
            en.innerText = i18nm.Batch.text;
            en.title = i18nm.Batch.tip;
          }
        }
      }
      showItA(m.disinviteSignerO, hasInvitation);
      m.hideBatch();
      if (m.syncShwHistO.checked) m.showHist(1);
    }
    po.showFlowInfoSigned = function (wfd, cntr) {
      var dv = cntr, SP = GJT.WorkflowPrivilegeEnum;
      dv.className = "WFH";
      dv.innerHTML = "";
      if (!wfd) return;
      var stgs = wfd.stgs;
      dv.closed = wfd.closed;
      if (!stgs) return;
      for (var i = 0; i < stgs.length; i++) {
        var stg = stgs[i], sgnd = stg.signed;
        if (!sgnd) continue;
        if (i > 0) addE("<div class='downArrow' />", dv); //flow arrow
        var dv2 = addE("<div class='stage' />", dv), dv3;
        if (stg.txt) { dv3 = addE("<div class='name' />", dv2); dv3.innerText = stg.txt; }
        dv3 = addE("<table><tbody></tbody></table>", dv2);
        dv3 = dv3.children[0]; //TBODY
        for (var j = 0; j < sgnd.length; j++) {
          var sg = sgnd[j], dv4, dv5;
          var dt = (new Date()).fromISO8601(sg.dt).format("yyyy/MM/dd HH:mm:ss");
          dv4 = newEm("tr"); dv4.className = "list"; // addE("<tr class='list'></tr>", dv3);
          dv3.appendChild(dv4);
          dv5 = newEm("td"); dv4.appendChild(dv5); dv5.innerText = dt;
          dv5 = newEm("td"); dv4.appendChild(dv5); dv5.innerText = sg.signer;
          dv5 = newEm("td"); dv4.appendChild(dv5); if (sg.txt) dv5.innerText = sg.txt;
          dv5 = newEm("td"); dv4.appendChild(dv5); dv5.innerText = wfActionCaption(sg.act); dv5.className = wfActionName(sg.act) + "C";
          dv5 = newEm("td"); dv4.appendChild(dv5); dv5.className = "opinion"; if (sg.comment) dv5.innerText = sg.comment;
        }
      }
      if (wfd.othrs) {
        for (var i = 0; i < wfd.othrs.length; i++) {
          var dvo = addE("<div style='margin-top:6px;border-top:2px solid #55dd55;padding-left:12px;' />", dv);
          this.showFlowInfoSigned(wfd.othrs[i], dvo);
        }
      }
    }
    po.getHist = function (kv, tr) {
      return this.doRequest("getState", kv, ["getDtl"], ["Y"]);
    }
    po.showHist = function (nc) {
      var m = this, dg = m.dgHist, tr = m._lstTR, bs;
      if (!dg && !nc) {
        dg = dlgShowContents("", "500px", "250px");
        dg.handleClose = function () { return dg.showMe(1); }
        m.dgHist = dg;
        dg.main.innerHTML = "<div />";
        bs = 1;
      }
      if (dg && tr && (!nc || !dg.isHidden())) {
        var wfd = m.getHist(tr._xkvz, tr);
        if (wfd.err) return alert(wfd.err);
        wfd = wfd[tr._xkvz];
        m.showFlowInfoSigned(wfd, dg.main.children[0]);
        m.setCaption("", dg);
        dg.showMe(0, 1);
        if (bs) {
          dg.fitSize();
          showBesideMouse(dg.dlg);
        }
      }
    }
    po.getTemplateInfo = function () {
      var m = this, tr = m._lstTR, wfd = m._wfd, o;
      if (!tr || !wfd) return;
      o = m.doRequest("getTemplate", tr._xkvz, ["flowid"], [wfd.id]);
      if (o.err) return alert(o.err);
      return o;
    }
    po.showTmpl = function () {
      var m = this, dg = m.dgTmpl, tr = m._lstTR, bs, wfd = m._wfd, o = m.getTemplateInfo();
      if (!o) return;
      if (!dg) {
        dg = dlgShowContents("", "450px", "500px");
        dg.handleClose = function () { return dg.showMe(1); }
        m.dgTmpl = dg; dg.main.innerHTML = "<div />";
        bs = 1;
      }
      if (dg) {
        m.showTemplateDo(o, dg.main.children[0], wfd.csid);
        dg.setCaption(o.txt);
        dg.showMe(0, 1);
        if (bs) {
          dg.fitSize();
          showBesideMouse(dg.dlg);
        }
      }
    }
    po.showTemplateDo = function (o, cntr, csid) {
      var dv = cntr, stgs = o.stgs;
      dv.innerHTML = ""; dv.className = "WFH";
      if (!stgs) return;
      for (var i = 0; i < stgs.length; i++) {
        var stg = stgs[i], sgnd = stg.sgnrs;
        if (i > 0) addE("<div class='downArrow' />", dv); //flow arrow
        var dv2 = addE("<div class='stage' />", dv), dv3;
        if (stg.txt) {
          dv3 = addE("<div class='name' />", dv2); dv3.innerText = (i + 1) + "." + stg.txt;
          if (csid == stg.id) { dv3.style.color = "#bb0000"; }
        }
        if (!sgnd) continue;
        dv3 = addE("<div />", dv2);
        for (var j = 0; j < sgnd.length; j++) {
          var sg = sgnd[j], dv4, dv5;
          dv4 = addE("<div class='signature' />", dv3);
          dv4.innerText = (sgnd.length > 1 ? ((j + 1) + ".") : "") + sg.txt;
          var vfrs = sg.vfrs;
          if (!vfrs) continue;
          for (var k = 0; k < vfrs.length; k++) {
            dv4 = addE("<div class='signer' />", dv3);
            dv4.innerText = vfrs[k].txt;
          }
        }
      }
    }
    po.showNextStageInfo = function () {
      var m = this, c = m.nxStageAreaO, wfd = m._wfd, o = m.getTemplateInfo();
      //把下一階段的簽核人員顯示出來讓使用者可以勾選
      c.innerText = "";
      var e = addE("<div />", c);
      for (var i = 0; i < o.stgs.length; i++) {
        //先找到下一關
        var sg = o.stgs[i];
        if (sg.id == "" + wfd.nxstg) {//wfd.nxstg 是數字
          e = addE("<div class='nxStage' />", c);
          e.innerText = i18nm.SetupNextStage.text + ":" + sg.txt;
          if (sg.sgnrs) {//簽名設定
            var e2 = addE("<div class='WFH' />", e);
            for (var j = 0; j < sg.sgnrs.length; j++) {
              var sgnr = sg.sgnrs[j], vfrs = sgnr.vfrs, e3 = addE("<div class='signature' id='" + sgnr.id + "' />", e2);
              e3.innerText = sgnr.txt;
              if (vfrs) {
                e3 = addE("<div />", e3); //多一層讓人名in-line排列
                for (var k = 0; k < vfrs.length; k++) {
                  var vf = sgnr.vfrs[k], e4 = addE("<div class='signer' style='cursor:default;display: inline-block;margin-right:8px;' />", e3);
                  e4.innerText = vf.txt;
                  if (vfrs.length > 1 && (sgnr.alwsgnrs || sgnr.alwselsgnrs)) {//有設定限制允許的簽核人員人數時或者允許自行選擇特定對象 就依需要提供選項
                    var sl = parseInt(sgnr.alwsgnrs, 10);
                    var e5 = addEm("<input name='chksgnrsel" + sgnr.id + "' type='" + (sl == 1 ? "radio" : "checkbox") + "' />", null, e4, "afterbegin");
                    e5.value = vf.id + "@" + sgnr.id;
                    e4.onclick = cmnSwitchInputChecked;
                  }
                }
              }
            }
          }

        }
      }
      m.dg.fitSize(1);
    }
    po.getAssignedSigner = function () {
      var m = this, nx = getEM(m.nxStageAreaO, "INPUT"), res;
      if (!nx || !nx.length) return;
      for (var i = 0; i < nx.length; i++) {
        if (nx[i].checked) res = (res ? res + "," : "") + nx[i].value;
      }
      return res;
    }
    po.startFlow = function () {
      var m = this, ge = m.ge, btn = GJT.eventSrc(), bh = btn.bh, mtr = btn.tarTR, kv = [btn._rowid], trs = [mtr];
      var msg = btn.innerText + "!\n" + i18nm.msgConfirmExecute.text;
      if (!window.confirm(msg)) return;
      if (ge.bfrStateChanged) { if (ge.bfrStateChanged(trs)) return; }
      if (bh) {
        var t = ge.getSelectedTRs();
        for (var i = 0; i < t.length; i++) {
          if (t[i] == mtr || t[i]._zwfdx || !t[i]._xkvz) continue;
          kv.push(t[i]._xkvz); trs.push(t[i]);
        }
      }
      for (var i = 0; i < kv.length; i++) {
        var o = m.doRequest("startFlow", kv[i]);
        m.showInfo([kv[i]], [trs[i]], o);
      }
      if (ge.aftStateChanged) ge.aftStateChanged(trs);
    }
    po.deleteMyToDo = function () {

    }
    po.prcsBatch = function (stageId, sgnId, comment) {
      var m = this, a = ["Promote", ""], itms = [];
      var W = GJT.WorkflowPrivilegeEnum, WA = GJT.WorkflowActionTypeEnum;
      var p = [W.Promote, W.Demote, W.Approve, W.Disapprove, W.Ignore, W.Reject, W.Recant, W.Approve], b = [];
      var t = [WA.Promote, WA.Demote, WA.Approve, WA.Disapprove, WA.Ignore, WA.Reject, WA.Recant, WA.DeleteToDo];
      var trs = m.ge.getSelectedTRs(), trn = [];
      //分析選取的資料共同具有的相同權限
      for (var i = 0; i < trs.length; i++) {
        var wfd = trs[i]._zwfdx;
        if (!wfd) continue;
        var stg = wfd.stgs[0], nsgnd = stg.notsigned; //當前階段
        if (stg.id != stageId) continue; //無簽或不同階段
        var pvg = stg.pvg, adi = 0;
        if (sgnId == 0) {//Promote Demote
          if ((!nsgnd && (pvg & W.Promote) == W.Promote) || (pvg & W.PromoteSuper) == W.PromoteSuper) {
            b[W.Promote] = 1; adi = 1;
          }
          if (!nsgnd && wfd.prestg && ((pvg & W.Demote) == W.Demote)) {
            b[W.Demote] = 1; adi = 1;
          }
        } else {
          for (var j = 0; j < nsgnd.length; j++) {//檢查有無同stage 同簽項
            var pvg1 = nsgnd[j].pvg;
            if (nsgnd[j].id == sgnId) { //有同簽項,有權
              for (var k = 0; k < p.length; k++) {
                if (p[k] == W.Recant) continue;
                if ((pvg1 & p[k]) == p[k]) { b[p[k]] = 1; adi = 1; }
              }
            }
          }
        }
        if (adi) trn.push(trs[i]);
      }
      if (trn.length == 0) return;
      var itms = [];
      //建立選單
      for (var k = 0; k < p.length; k++) {
        if (b[p[k]]) {
          itms.push({ name: wfActionName(t[k]), actiontype: t[k], text: wfActionCaption(t[k]), powertype: p[k], scmnt: comment });
        }
      }
      itms.onclick = function (ldgr, itms, s) { m.prcsBatchDo.call(m, ldgr, itms, s); };
      itms.scmnt = comment;
      itms.stgid = stageId; itms.sgnid = sgnId;
      itms.trs = trn;
      SysShowMenu(itms);
    }
    po.prcsBatchDo = function (ldgr, itms, s) {
      var cmnt = ldgr.scmnt, act = ldgr.actiontype, pwt = ldgr.powertype;
      var stageId = itms.stgid, sgnId = itms.sgnid, scmnt = itms.scmnt, trs = itms.trs;
      var W = GJT.WorkflowPrivilegeEnum, WA = GJT.WorkflowActionTypeEnum;
      MenuHide();
      var msg = wfActionCaption(act) + " (" + (i18nm.Batch.tip ? i18nm.Batch.tip : i18nm.Batch.text) + ")!\n" + i18nm.msgConfirmExecute.text;
      if (!window.confirm(msg)) return 0;
      for (var i = 0; i < trs.length; i++) {
        var wfd = trs[i]._zwfdx;
        var stg = wfd.stgs[0], nsgnd = stg.notsigned, adi = 0;
        var pvg = stg.pvg;
        if (act == WA.Promote) {//Promote Demote
          if ((!nsgnd && (pvg & W.Promote) == W.Promote) || (pvg & W.PromoteSuper) == W.PromoteSuper) adi = 1;
        } else if (act == WA.Demote) {
          if ((pvg & W.Demote) == W.Demote) adi = 1;
        } else if (nsgnd) {
          for (var j = 0; j < nsgnd.length; j++) {//檢查有無同stage 同簽項
            var pvg1 = nsgnd[j].pvg;
            if (nsgnd[j].id == sgnId) { //有同簽項,有權
              if ((pvg1 & pwt) == pwt) adi = 1;
            }
          }
        }
        if (adi) { if (this.prcsSignDo(ldgr.name, wfd.id, stageId, sgnId, scmnt, [trs[i]._xkvz], [trs[i]], 1) == 0) break; }
      }
      if (ge.aftStateChanged) ge.aftStateChanged(trs);
    }
    po.prcsSign = function () {
      var m = this, ge = m.ge, btn = GJT.eventSrc(), csn = btn.className; if (!csn) return;
      var p = btn.parentNode, ox = getEmByClass(p.parentNode.nextSibling, "opinion");
      var scmnt = ox ? ox.value : "", tr = m._lstTR;
      if (!p.flowId) return; // alert("SignatureId not found in " + p.tagName + " " + p.innerText);
      if (csn == "Batch") return m.prcsBatch(p.stageId, p.signatureId, scmnt);
      m.prcsSignDo(csn, p.flowId, p.stageId, p.signatureId, scmnt, [tr._xkvz], [tr]);
      if (ge.aftStateChanged) ge.aftStateChanged([tr]);
    }
    po.prcsSignDo = function (action, flowId, stageId, signatureId, comment, kv, trs, noMsg) {///td0.signatureId = nsgnd[j].id; td0.flowId = wfd.id;
      var m = this;
      if (action == GJT.WorkflowActionTypeEnum.Disapprove || action == "Disapprove") {
        if (!comment) {
          alert(i18nm.msgNoCommentForDisapprove.text);
          return 0;
        }
      }
      var msg = wfActionCaption(action) + "!\n" + i18nm.msgConfirmExecute.text;
      if (!noMsg) { if (!window.confirm(msg)) return 0; }
      if (signatureId == null) signatureId = 0;
      var xp = ["flowid", "stageid", "sgnrid", "cmnt"], xv = [flowId, stageId, signatureId, comment];
      if (action == GJT.WorkflowActionTypeEnum.Promote || action == "Promote") {
        var asgr = m.getAssignedSigner();
        if (asgr) { xp.push("asssgnrs"); xv.push(asgr); }
      }
      var o = m.doRequest(action, kv.join(","), xp, xv);
      m.showInfo(kv, trs, o);
      if (action == "DeleteToDo" && !o.err) {
        //remove rows
        if (m.ge.removeRows) m.ge.removeRows(trs);
      }
    }
    po.evtHandle = function () {
      var m = this, ev = GJT.event(); if (!ev) return;
      var o = GJT.eventSrc(), ty = ev.type;
      if (ty == "click") {
        MenuHide();
        var ow = m.syncShwDtlO;
        if (o == ow || o == ow.parentNode) {
          m.showDetailForm();
          showItA([m.datactnO, m.tabCntrO], ow.checked);
          m.shaftO.style.display = ow.checked ? "none" : "inline";
        }
        m.showSigning();
      }
    }
    po.evtShowed = function () {
      var dp = m._dataPannel;
      if (dp) dp.rejoin();
    }
    po.evtClose = function () {
      var m = this, dp = m._dataPannel;
      if (dp) dp.disperse();
      m.dg.showMe(1);
      return true;
    }
    po.evtResize = function (dgo) {
      var m = this, tb = getEmByClass(m._cntr, "WF0"), dp = m._dataPannel;
      if (dgo != m.dg) return;
      //調整DataPanel大小
      var h = tb.offsetHeight, h0 = dgo.main.offsetHeight, nh = h0 - h - 3;
      if (nh > 0) m.datactnO.style.maxHeight = toPx(nh);
      if (dp) dp.resize();
    }
    po.showSigning = function () {
      var m = this, ge = m.ge, mtr = ge.mainTR();
      if (m.lockShwItemO.checked) return;
      if (m._lstTR != mtr) {
        GJT.stopBubble();
        m.showFlowInfoSigning(mtr);
        m.showDetailForm();
      }
    }
    po.prcsGridEvt = function (evtType, prm) {
      if (evtType == "aftMainRowChanged") {//[otr, ntr, grid]
        if (this.syncShwHistO.checked) this.showSigning();
      }
      if (evtType == "aftChangeSelection") this.hideBatch();
    }
    po.hideBatch = function () {
      var m = this, bns = getAllByClass(m.ckoctnO, "Batch"), nts = 0;
      if (!bns || !m.ge.getSelectedTRs) return;
      var trs = m.ge.getSelectedTRs();
      for (var i = 0; i < trs.length; i++) {
        var wfd = trs[i]._zwfdx;
        if (!wfd || !m._wfd || wfd.csid != m._wfd.csid || wfd.tyid != m._wfd.tyid) {
          if (!(!m._wfd && !wfd)) continue;
        }
        nts++;
      }
      showItA(bns, nts > 1);
    }
    po.doRequest = function (subact, kv, xp2, vp2) {
      var m = this, ge = m.ge;
      var xp = ["Action", "subact", "tarid", "kv", "pgid"], vp = ["FlowCtrl", subact, ge.getId(), kv, this.pgid];
      if (xp2) { xp = xp.concat(xp2); vp = vp.concat(vp2); }
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1), o;
      if (txt) {
        //o = JSON.parse(txt);
        //o = eval("o=" + txt);//目前使用JSON.parse會發生無效字元的錯誤
        try { o = JSON.parse(txt); } catch (ex) { alert(ex.message); o = eval("o=" + txt); }
      } else o = {};
      return o;
    }
    po.close = function (force) {
      this.dg.close(force);
    }
    po.evtBroadcast = function (evtType, prm) {//轉發事件給GE
      if (this.ge.evtBroadcast) return this.ge.evtBroadcast(evtType, prm);
    }
    po.appendUIO = function (uiO) {//允許加入額外自訂的UI物件
      var m = this, om = m.datactnO;
      om.appendChild(uiO);
    }
    DlgFlowCtrl._initialized = 1;
  }
  var m = this;
  if (ge.evtListenerAdd) {
    var eh = function (evtType, Prm) { m.prcsGridEvt.call(m, evtType, Prm); };
    ge.evtListenerAdd("aftMainRowChanged", eh);
    ge.evtListenerAdd("aftChangeSelection", eh);
  }
} //end DlgFlowCtrl
//End Flow Control codes

function UserSelectorShow(evtHndOK, oriSelection) {
  return sysObjSelectorShow(evtHndOK, oriSelection, "User Selector", "65662");
}
function sysObjSelectorShow(evtHndOK, oriSelection, dlgCaption, dvId, extraUIO) {//共用性的人員或腳色群組選取介面,
  var dgId = "_dlgUsrSel_" + dvId, dg = PROG[dgId]; //myGridEdit, aryTarFields, dlgTitle, handleOK, handleCancel, width, height
  if (!dg) {
    dg = new GridValueSelector(dvId, ["itmId", "itmCaption"], dlgCaption, null, null, 700, 600); PROG[dgId] = dg;
    dg.showSelectionPool(extraUIO);
    dg.dlgCtrl.moveToMouse();
    dg.GridEdit.showCaption(1);
  }
  dg.handleOK = evtHndOK;
  if (oriSelection) { dg.addIntoPool(oriSelection, 1); }
  dg.showMe(); return dg;
}

function dsphRooms(itms, cntr) {
  var lyoRate = { mode: "H", scales: [{ rt: 3, mode: "V", scales: [{ rt: 2 }, { rt: 3 }] }, { rt: 3 }, { rt: 3 }] };
  return new layoutDispatcher(lyoRate, cntr, itms);
}

//?JSON.stringify(lyoRate)
function layoutDispatcher(map, floor, itms, mapOfUser, autoAssignRoom) {
  this.onScalesChanged = null;
  if (layoutDispatcher._initialized == undefined) {
    var po = layoutDispatcher.prototype;
    /*房間如果有指定最小高度 或/及最小寬度的時候,如何進行排列?
    因為子孫層的房間的minHeight minWidth設定必須回饋到上層的房間來調整空間及計算需要的總空間
    */
    po.cacheOptions = function () {
      var m = this, coe = GJT.LayoutOperOptions, opn = m.map.options;
      m.noSplitButton = (opn & coe.NoSplitButton) == coe.NoSplitButton;
      m.noSplitBar = (opn & coe.NoSplitBar) == coe.NoSplitBar;
      m.noBorder = (opn & coe.NoBorder) == coe.NoBorder;
      m.absoluteWidth = (opn & coe.AbsoluteWidth) == coe.AbsoluteWidth;
      m.absoluteHeight = (opn & coe.AbsoluteHeight) == coe.AbsoluteHeight;
      m.autoSizeCntr = (opn & coe.AutoSizeContainer) == coe.AutoSizeContainer;
      m.autoScrollBar = (opn & coe.AutoScrollBar) == coe.AutoScrollBar;
      m.autoExtendSize = (opn & coe.AutoExtendSize) == coe.AutoExtendSize;
    }
    //因為resizeLYO當下 clientWidth可能因為原本有捲軸變小,但是照此排列之後,卻會讓捲軸隱藏了,這時候會造成出現原本捲軸位置的空白,必須在一段時間之後clientWidth才會自動修正
    //所以設定一段時間後重新檢查
    po._rvshw = function () {//_rvshw2
      var m = this, cn = m.floor, isB = (cn == document.body), doRvs = 0;
      var w = cn.clientWidth, h = cn.clientHeight;
      if (isB) { h = GJT.getWindowHeight(); w = GJT.getWindowWidth(); }
      if (!m.absoluteWidth) {//絕對尺寸的不檢查
        if (m._ow < w - 10 || w < m._ow - 10) {
          doRvs = true;
        }
      }
      if (!m.absoluteHeight) {//絕對尺寸的不檢查
        if (m._oh < h - 10) {
          doRvs = true;
        }
      }
      if (doRvs) m.resizeLYO();
    }
    po._autoRvise = function () {//自動修正因為捲軸消失或出現造成誤差
      return;
      var m = this, iv = m.__intvr;
      if (iv) window.clearTimeout(iv);
      iv = window.setTimeout(m._rvshw2, 300);
      m.__intvr = iv;
    }
    po.resizeLYO = function (forceDo) {
      var m = this, mp = m.map, itms = m.itms, cn = m.floor, cnst = cn.style, iL = itms.length, isB = (cn == document.body), ns = GJT.getComputedStyle(cn);
      m.cacheOptions();
      if (m.absoluteWidth || m.absoluteHeight) {//絕對尺寸時才需要這樣子調整
        if (m.autoScrollBar) {
          if (cn._oriovfX == undefined) { cn._oriovfX = cnst.overflowX; cn._oriovfY = cnst.overflowY; }
          cnst.overflowX = "auto"; cnst.overflowY = "auto";
        } else if (cn._oriovfX != undefined) { cnst.overflowX = cn._oriovfX; cnst.overflowY = cn._oriovfY; }
      }
      var x = m.marginLeft, y = m.marginTop, w = cn.clientWidth, h = cn.clientHeight;
      //下面減2 是為了避免出現捲軸,因為splitButton會往下或往右偏移1px
      if (isB) { y = floatBarsHeight() + m.marginTop; h = GJT.getWindowHeight(); w = GJT.getWindowWidth(); }
      m._ow = w; m._oh = h;
      //測試經驗得知高寬需要再減去2px才不會造成捲軸跑出來
      w = w - x - m.marginRight - 2; h = h - y - m.marginBottom - 2;
      if (w <= 0 || h <= 0) return;
      var rx = m._roomToMax;
      var idx = m.ly(mp, itms, 0, x, y, w, h, rx != null && m.maxMode == "c", forceDo);//如果有最大化的就需要隱藏其他的
      if (idx < iL) {
        var mm = mp.scales, k = 0;
        k = mm[mm.length - 1].rt;
        for (var i = idx; i < iL; i++) { mm.push({ mode: mp.mode, rt: k }); }
        m.resizeLYO(forceDo);
      }
      if (m.absoluteWidth) {//絕對尺寸時才需要這樣子調整
        //絕對不可改變style.height style.width(會造成clientWHeight clientWidth變成0,只能使用minHeight minWidth來延伸高寬
        if (m.autoSizeCntr) {
          //這裡需要找出最大高度(用scrollWidth?)
          cnst.minWidth = toPx(cn.scrollWidth + 2);
        } else { cnst.minWidth = ""; }
      }
      if (m.absoluteHeight) {//絕對尺寸時才需要這樣子調整
        //絕對不可改變style.height style.width(會造成clientWHeight clientWidth變成0,只能使用minHeight minWidth來延伸高寬
        if (m.autoSizeCntr) {
          //取得最大高寬
          cnst.minHeight = toPx(cn.scrollHeight + 2);
        } else { cnst.minHeight = ""; }
      }
      m.onceArranged = true;//物件啟動後曾經排列過
      m._autoRvise();
      if (!rx) return;
      //有指定最大化就需要處理
      var x2 = x, y2 = y, w2 = w, h2 = h, itm = m.getCustomer(rx), sbtn = m._splitBtn;
      var p = m.getParentRoom(rx), md = p.mode;
      if (m.maxMode == "a") {
        x2 = p.x; y2 = p.y; w2 = p.w; h2 = p.h;
        var gp = p.gap; if (gp == undefined) gp = m.gap;
        if (p != mp) {//不是最上層 需要另外加偏移(間隙)
          if (md == "H") { y2 += gp; h2 -= gp; } else { x2 += gp; w2 -= gp; }
        }
      }

      var gx = 0, gy = 0, gp0 = m.gap, x3 = x2, y3 = y2;
      //if (md == "H") { gx = gp0; x3 = x2 - 1; y3 = y2 + h2 / 2 - sbtn.offsetHeight / 2; } else { gy = gp0; x3 = x2 + w2 / 2 -sbtn.offsetWidth/2; y3 = y2 -1; }
      if (itm) {
        var cn = itm.container
        showItA(cn, 1);//必須先顯示
        if (itm.moveTo) itm.moveTo(x2 + gx, y2 + gy, w2 - gx, h2 - gy, 1);
        else { cmnMoveObjTo(cn, x2 + gx, y2 + gy, w2 - gx, h2 - gy, 1); }
        rx.ox2 = x2; rx.oy2 = y2; rx.ow2 = w2; rx.oh2 = h2;//記住原來的位置及高寬,計算後如果差異在很小的範圍就不要執行moveTo
      } else {
        m.ly(rx, itms, 0, x2 + gx, y2 + gy, w2 - gx, h2 - gy, 0, forceDo);
      }
      var d = 18;
      cmnMoveObjTo(sbtn, x + w - d - 4, y, d, d);
      sbtn.className = "lyoTurnBtn";
      showItA(sbtn, 1);
    }
    po.ly = function (mp, itms, idx, x, y, w, h, hideIt, forceDo) {
      var m = this, md = mp.mode, mm = mp.scales, u = mm.length, u2 = u - 1, k = 0, rtn = [], gp0 = mp.gap;
      if (gp0 == null || isNaN(Number(gp0))) gp0 = m.gap;
      hideIt = hideIt || w <= 0 || h <= 0;
      var hideSpliterBtn = gp0 < 2 || hideIt;
      if (u == 1 && mm[0].rt <= 0) mm[0].rt = 1; //只有一個成員 要占滿
      for (var i = 0; i < u; i++) { if (mm[i].rt == null) mm[i].rt = 1; k += mm[i].rt; }//先算出所有比率的總和,畫面分割是以比率動態計算的
      var x1 = x, y1 = y, w1 = w, h1 = h, k1 = 0, k2 = 0, hsm = 0, wsm = 0;
      //先算出所有房間的標準位置及尺寸 及因為隱藏而改變的實際位置及高寬
      var xi2 = [], yi2 = [], wi2 = [], hi2 = [];
      for (var i = 0; i < u; i++) {
        k2 += mm[i].rt;//累計當下的比率合計
        var gx = 0, gy = 0;
        if (i > 0) {
          if (md == "H") gx = gp0; else gy = gp0;//依據方向決定該扣減的間隙
        }

        if (md == "H") {
          if (m.absoluteWidth) {
            x1 = x + k1; w1 = k2 - k1; //不可以在這裡化為整數,因為會在畫面調整大小時造成累計誤差 使得大小位置不斷的有微小變化
            if (i == u2 && m.autoExtendSize && k2 < w) w1 = w - k1;
            rtn[i] = mm[i].rt;//不變
          } else {
            x1 = x + w * k1 / k; w1 = w * (k2 - k1) / k; //不可以在這裡化為整數,因為會在畫面調整大小時造成累計誤差 使得大小位置不斷的有微小變化
            if (i == u2) w1 = w - wsm;
            if (x1 > (x + w - gx)) x1 = x + w - gx;//最後一間的前邊界位置必須小於總寬度
            rtn[i] = w1;
          }
        } else {
          if (m.absoluteHeight) {
            y1 = y + k1; h1 = (k2 - k1);
            if (i == u2 && m.autoExtendSize && k2 < h) h1 = h - k1;
            rtn[i] = mm[i].rt;//不變
          } else {
            y1 = y + h * k1 / k; h1 = h * (k2 - k1) / k;
            if (i == u2) h1 = h - hsm;
            if (y1 > (y + h - gy)) y1 = y + h - gy;//最後一間的前邊界位置必須小於總寬度
            rtn[i] = h1;
          }
        }

        mm[i].x = x1; mm[i].y = y1; mm[i].w = w1; mm[i].h = h1;//左列是標準位置及高寬
        var x2 = x1, y2 = y1, w2 = w1, h2 = h1;//隱藏的房間空間會讓出來給隔壁房間使用
        //這裡依據隔壁房間的隱藏設定決定實際的大小
        //依照使用者點擊的按鈕決定擴張的方向
        //先檢查前面的房間有沒有允許其後面的房間擴張過去
        for (var j = i - 1; j >= 0; j--) {
          if (mm[j].hidden && mm[j].shiftD < 0) {
            x2 = mm[j].x; y2 = mm[j].y;
            if (md == "H") { w2 += mm[j].w; } else { h2 += mm[j].h; }
          } else break;
        }
        //再檢查後面的房間有沒有允許其前面的房間擴張過去
        for (var j = i + 1; j < u; j++) {
          if (mm[j].hidden && mm[j].shiftD > 0) {
            if (md == "H") { w2 += mm[j].w; } else { h2 += mm[j].h; }
            if (j == u2) { if (md == "H") { w2 -= gx; } else { h2 -= gy; } } //最後一間房間必須保留間隙(通道)
          } else break;
        }
        //如果共超過一個房間且最後一間是隱藏或是看不到,就必須限制所佔的空間不能直到邊界,必須保留一個間隙空間出來以提供調整房間大小及位置
        if (u2 > 0 && (mm[u2].hidden || mm[u2].rt <= gp0)) {
          if (md == "H") {
            if (x2 + w2 + gp0 > x + w) {
              w2 = x + w - x2 - gp0;
            }
          } else {
            if (y2 + h2 + gp0 > y + h) {
              h2 = y + h - y2 - gp0;
            }
          }
        }
        xi2[i] = x2; yi2[i] = y2; wi2[i] = w2; hi2[i] = h2;
        k1 = k2;
        hsm += h1; wsm += w1;//計算累計的高 及 寬,最後一間房間只能用樓層總高寬扣除累計高寬,因為比率計算會有累計差異
      }
      for (var i = 0; i < u; i++) {
        //k2 += mm[i].rt;//累計當下的比率合計
        var gx = 0, gy = 0;
        if (i > 0) {
          if (md == "H") gx = gp0; else gy = gp0;//依據方向決定該扣減的間隙
        }
        var x2 = xi2[i], y2 = yi2[i], w2 = wi2[i], h2 = hi2[i];
        if (idx < itms.length && i > 0) {//create splitter symbol
          var aa = null, bb = null, sp = m.getSplitBtns(mm[i]);
          if (sp) { aa = sp.A; bb = sp.B; }
          else {
            //這裡需要紀錄該物件要隱藏的是哪個房間(mmX) ,以及
            aa = addEm("<div />", null, m.floor); aa.mmX = mm[i - 1]; aa.shiftD = -1;
            bb = addEm("<div />", null, m.floor); bb.mmX = mm[i]; bb.shiftD = 1;
            aa.onclick = m._evtMxi; bb.onclick = m._evtMxi;
            aa.oncontextmenu = m._CntxMnu; bb.oncontextmenu = m._CntxMnu;
            m._spls.push({ "mmA": mm[i], "A": aa, "B": bb });
          }
          //當設定隱藏時,aa控制前一房間的顯示/隱藏, 前一個房間如果隱藏就把aa按鈕放在前一房間上(左)邊,但是如果上上個房間也是隱藏時 就把按鈕隱藏
          //bb控制後一房間的顯示/隱藏, 後一個房間如果隱藏就把bb按鈕放在前一房間上(左)邊,但是如果上上個房間也是隱藏時 就把按鈕隱藏
          var fct = 1, barw = 50, btnft = 0.025;
          //if (mm[i].hidden && i == u2) fct = 1;
          if (md == "H") {
            if (barw > (h2 / 2 + 2)) barw = h2 / 2 - 2;
            var y3 = y2 + mm[i].h / 2 - barw;
            aa.className = "lyoSplitBtnL";
            bb.className = "lyoSplitBtnR";
            cmnMoveObjTo(aa, x2 - btnft, y3, gp0 + 2.0 * btnft, barw);
            if (mm[i - 1].hidden) aa.className = "lyoSplitBtnR";
            if (mm[i].hidden) {
              bb.className = "lyoSplitBtnL";
              var k = i;
              while (k < u && mm[k].hidden) { fct++; k++; } //計算後面有幾間隱藏
              if (k < u) cmnMoveObjTo(bb, xi2[k] - btnft, y3 + (barw + 3) * fct, gp0 + 2, barw);
              else cmnMoveObjTo(bb, xi2[u2] + wi2[u2] - btnft, y3 + (barw + 3) * (fct - 1), gp0 + 2, barw); //cmnMoveObjTo(bb, x3 + (barw + 3) * (fct - 1), yi2[u2] + hi2[u2] - gy, barw, gp0 + 2);
            } else {
              cmnMoveObjTo(bb, x2 - btnft, y3 + barw + 3, gp0 + 2.0 * btnft, barw);
            }
          } else {
            if (barw > (w2 / 2 + 2)) barw = w2 / 2 - 2;
            var x3 = x2 + mm[i].w / 2 - barw;
            aa.className = "lyoSplitBtnU";
            bb.className = "lyoSplitBtnD";
            cmnMoveObjTo(aa, x3, y2 - btnft, barw, gp0 + 2 * btnft); //aa管前一個,所以如果前面隱藏就放到最前面,按鈕要往前一個點
            if (mm[i - 1].hidden) aa.className = "lyoSplitBtnD";
            //bb管自己的顯示/隱藏 當自己是隱藏時把bb放到下邊,否則就在自己的上邊
            if (mm[i].hidden) {
              //往下找到第一個沒有隱藏的房客的上邊,往右偏移
              bb.className = "lyoSplitBtnU";
              var k = i;
              while (k < u && mm[k].hidden) { fct++; k++; } //計算後面有幾間隱藏
              if (k < u) cmnMoveObjTo(bb, x3 + (barw + 3) * fct, yi2[k] - btnft, barw, gp0 + 2 * btnft);
              else cmnMoveObjTo(bb, x3 + (barw + 3) * (fct - 1), yi2[u2] + hi2[u2] - btnft, barw, gp0 + 2 * btnft);
            }
            else {
              cmnMoveObjTo(bb, x3 + barw + 3, y2 - btnft, barw, gp0 + 2 * btnft);
            }
          }
          var itmA = m.getCustomer(mm[i - 1]), itmB = m.getCustomer(mm[i]);
          if (itmA) aa.title = (mm[i - 1].hidden ? "Show " : "Hide ") + (itmA.text ? itmA.text : itmA.name);
          else aa.title = (mm[i - 1].hidden ? "Show" : "Hide ")
          if (itmB) bb.title = (mm[i].hidden ? "Show " : "Hide ") + (itmB.text ? itmB.text : itmB.name);
          else bb.title = (mm[i].hidden ? "Show " : "Hide ")
          aa.title = i + "a " + aa.title; bb.title = i + "b " + bb.title;
          aa.style.backgroundColor = mm[i - 1].hidden ? "#ccff88" : "";
          bb.style.backgroundColor = mm[i].hidden ? "#ccff88" : "";
          showItA(aa, !hideIt && !m.noSplitButton && !hideSpliterBtn && !mm[i].hidden);//自己房間是隱藏時 aa就必須隱藏,因為沒有隱藏別人的必要了
          showItA(bb, !hideIt && i > 0 && !m.noSplitButton && !hideSpliterBtn); //下一個房間不是隱藏的或者是最後一間 或者本身沒有隱藏 時才能顯示 && (i == u2 || !mm[i + 1].hidden || !mm[i].hidden)
          //如果本身是隱藏的但是下一個沒有隱藏,就可以把bb隱藏,因為下一個會顯示同作用的aa
          if (mm[i].hidden && (i < u2 && !mm[i + 1].hidden)) showItA(bb, 0);
          if (i == 1 && mm[i - 1].hidden && !mm[i].hidden) showItA(bb, false);
          //toZBottom(aa); toZBottom(bb); //需要放到最下層才不會影響對話框的顯示
          toZTopC(aa); toZTopC(bb);//需要放到最上層圖形才完整
        }
        if (mm[i].scales) {
          var hideIt2 = mm[i].hidden || hideIt;
          if (!hideIt2 && m._roomToMax) {//最大化的房客在這個樓層內
            var p = m.getParentRoom(m._roomToMax);
            hideIt2 = p == mm[i];
          }
          idx = m.ly(mm[i], itms, idx, x2 + gx, y2 + gy, w2 - gx, h2 - gy, hideIt2, forceDo);
        } else if (mm[i] == m._roomToMax) {//最大化的那一個不處理,最後再處理
          idx++;
        } else if (idx < itms.length) {
          var itm = m.getCustomer(mm[i]);//如果從房間找房客可以找到就以此為準
          if (!itm) { itm = itms[idx]; }
          var cn = itm.container, csx = mm[i].styleText;
          if (!cn) cn = m.cntrs[idx];
          if (!cn) { cn = addEm("<div class='lyoRoom' />", null, m.floor); m.cntrs[idx] = cn; }
          //加框線會影響dimension的計算,這裡不應該使用,要顯示出隔間間隙 改用設定背景顏色的方式影響最小,而且可以讓不同房間使用不同顏色,預設用白色
          //使用styleText屬性比較有彈性,如果有設定styleText 就不要再設定框線方面
          if (!csx) {
            if (cn._lyoOriBdr == undefined) cn._lyoOriBdr = cn.style.border;
            if (cn._lyoOriBdr == "") {//房客如果有自己的主張就不要設定
              cn.style.border = m.noBorder ? "" : "1px solid #cdcdcd";
            }
          } else {
            if (cn._lyoStyleText != csx) {
              //經過觀察 style的項目如果在cssText中重複出現時,browser會以後面出現的為準,為了不影響原本cn的設定,需要加在前面
              cn.style.cssText = csx + ";" + cn.style.cssText;
              cn._lyoStyleText = csx;
            }
          }
          //移動量太小不要重排,避免resize觸發太頻繁
          //在搬移之前就要先顯示,否則使用cn 的clientWidth clientHeight等屬性會變成0
          var isVis = h2 > gp0 * 2 && w2 > gp0 * 2 && !mm[i].hidden && !hideIt;
          var oriVis = !isHidden(cn), mustMove = isVis && !oriVis; //原本隱藏 現在顯示 則強迫resize,因為隱藏時不resize
          showItA(cn, isVis);//設定隱藏或者高度/寬度不足兩個間隙寬時 就隱藏房客
          if (!isVis || (!forceDo && m.onceArranged && Math.abs(mm[i].ox2 - x2) < 3 && Math.abs(mm[i].oy2 - y2) < 3 && Math.abs(mm[i].ow2 - w2) < 3 && Math.abs(mm[i].oh2 - h2) < 3)) { }
          else {
            if (itm.moveTo) { itm.moveTo(x2 + gx, y2 + gy, w2 - gx, h2 - gy, 1); m.cntrs[idx] = cn; }
            else { cmnMoveObjTo(cn, x2 + gx, y2 + gy, w2 - gx, h2 - gy, 1); }
            mm[i].ox2 = x2; mm[i].oy2 = y2; mm[i].ow2 = w2; mm[i].oh2 = h2;//記住原來的位置及高寬,計算後如果差異在很小的範圍就不要執行moveTo
          }
          showItA(cn, isVis);//預防其他程式改變
          //cn.style.overflow = "auto"; cn.style.overflowX = "auto"; cn.style.overflowY = "auto"; //核心程式不要擅自改變style,會造成外部應用控制困難
          idx++;
        }
        else {
          //這裡不能夠清除當下沒有用到的,後續程式或外部程式會假設還沒用到的房間稍後會用到
          //idx++; mm.splice(i, i + 1); u--;
        }
      }
      for (var i = 0; i < u; i++) { mm[i].rt = rtn[i]; }
      return idx;
    }
    po.setGap = function (gap) { this.gap = isNaN(gap) ? 5 : gap; this.onceArranged = false; this.resizeLYO(); }
    //拖曳間隔物件來調整大小,有時候多個split bar 重疊在一起 需要依據滑鼠移動的方向判斷應該移動哪一個
    po._inGap = function (mp, x, y, res) {
      var m = this, md = mp.mode, mm = mp.scales;
      if (!mm || mm.length == 0 || m.noSplitBar) return;
      var cn = m.floor, u = mm.length, bi = mm[0].scales ? 0 : 1;//如果第一個房間還有隔間的話就要從第一個檢查起
      var sx = cn.scrollLeft + x, sy = cn.scrollTop + y, gp = mp.gap;
      if (gp == undefined) gp = m.gap;
      for (var i = bi; i < u; i++) {//第一個不用檢查,不會顯示該間隙
        var r = mm[i], o = null;
        if (md == "H") {
          if (sx >= (r.x - 0.5) && sx <= (r.x + gp + 0.5) && sy >= r.y && sy <= (r.y + r.h)) o = {};
        } else {
          if (sy >= (r.y - 0.5) && sy <= (r.y + gp + 0.5) && sx >= r.x && sx <= (r.x + r.w)) o = {};
        }
        if (o) {
          o.idx = i; o.mm = mm; o.cmm = mm[i]; o.mode = md;
          if (!res) res = [];
          res.push(o);
        }
        if (r.scales) {
          res = m._inGap(r, x, y, res);
        }
      }
      return res;
    }
    po.getCustomer = function (room) {//嘗試以房間找出房客, 由於map 最後需要被呼叫mapText,如果map物件本身紀錄無法stringify的物件將會發生 "不支援數值引數中的循環參照"的錯誤,因此只能另外用別的物件來記錄參照
      var m = this, rms = m.collectRooms();
      for (var i = 0; i < rms.length; i++) {
        if (rms[i] == room) return m.itms[i];
      }
    }
    po.getCustomerByName = function (name) {//嘗試以房間找出房客, 由於map 最後需要被呼叫mapText,如果map物件本身紀錄無法stringify的物件將會發生 "不支援數值引數中的循環參照"的錯誤,因此只能另外用別的物件來記錄參照
      var m = this, itms = m.itms;
      for (var i = 0; i < itms.length; i++) {
        if (itms[i].id == name || itms[i].name == name) return m.itms[i];
      }
    }
    po.moveCustumer = function (tarCust, step, moveRoom) {//moveRoom:連同房間一起移動
      var m = this, r = tarCust, r1 = m.getCustomer(r), itms = m.itms;
      if (r1) { r = tarCust; tarCust = r1; }//傳入的是房間物件
      var i1 = m.getRoomIndex(r);
      i1 += step;
      if (!itms[i1]) return;
      m.moveCustomerTo(tarCust, itms[i1], moveRoom);
    }
    po.moveCustomerTo = function (tarCust, refCust, moveRoom) {//把指定的客人的房間換到另一位客人的前面或後面,依據原來的相關位置決定放置的前後,如果tarCust原本位置是在refCust的後面 就搬到前面,反之則到後面
      var m = this, i1 = -1, i2 = -1, r1 = m.getCustomer(tarCust), r2 = m.getCustomer(refCust);
      if (r1) tarCust = r1;//傳入的是房間物件
      if (r2) refCust = r2;//傳入的是房間物件
      var itms = m.itms, rms = m.collectRooms();
      //檢查誰在前面
      for (var i = 0; i < itms.length; i++) {
        if (itms[i] == tarCust) i1 = i;
        if (itms[i] == refCust) i2 = i;
      }
      if (i1 == i2) return;//同一個房客不處理
      if (i1 < 0 || i2 < 0) return alert("Customer not found");
      //移動房間時只能夠在同一層樓內移動,如果指定的參考房客位於不同的樓層就必須找出參考房客的樓層
      if (moveRoom) {//要求連同房間一起搬移,修正 i2
        var diffLvl = 0, tarR, refR, tarPR, refPR, siblingR;//siblingR與tarR同樓層的那間房
        tarR = m.getRoom(tarCust); refR = m.getRoom(refCust); siblingR = refR;
        tarPR = m.getParentRoom(tarR); refPR = m.getParentRoom(refR);
        while (tarPR != refPR && refPR) {//不同樓層 必須找到同樓層
          diffLvl = 1;//不同樓層
          siblingR = refPR;
          refPR = m.getParentRoom(refPR);
        }
        if (!refPR) return;//參考樓層比目標房間的樓層高,無法移動
        if (diffLvl) {//不同樓層才需要修正i2 及refR
          var rms = m.collectRooms(siblingR);
          //由前往後移動,所以找最後一間房做為參考房間
          if (i1 < i2) refR = rms[rms.length - 1]; else refR = rms[0];
          i2 = m.getRoomIndex(refR);
        }
        var scs = tarPR.scales;
        //一定要分兩個迴圈處理,否則會陷入無窮迴圈
        for (var j = 0; j < scs.length; j++) {
          if (scs[j] == tarR) { scs.splice(j, 1); break; }
        }
        for (var j = 0; j < scs.length; j++) {
          if (scs[j] == siblingR) { scs.splice(j + (i1 < i2 ? 1 : 0), 0, tarR); break; }
        }
        m.clearSplitButtons();
      }
      itms.remove(tarCust);
      if (i1 < i2) { //由前往後移動
        if (i2 == itms.length) itms.add(tarCust);
        else itms.insert(tarCust, i2);
      } else {
        itms.insert(tarCust, i2);
      }
      m.updateCustIdList();
      m.resizeLYO(1);
    }
    po.collectRooms = function (r, res) {//依照房間順序收集所有房間
      if (!res) res = []; if (!r) r = this.map;
      var mm = r.scales;
      if (mm) {
        for (var i = 0; i < mm.length; i++) {
          res = this.collectRooms(mm[i], res);
        }
      } else res.push(r);
      return res;
    }
    po.getRoom = function (cust) {//從房客找出房間
      var m = this, rms = m.collectRooms(), itms = m.itms;
      for (var i = 0; i < itms.length; i++) {
        var c = itms[i];
        if (c == cust || c.container == cust.container || c.container == cust || c == cust.container) return rms[i];
      }
    }
    po.getRoomIndex = function (room) {
      var m = this, rms = m.collectRooms();
      for (var i = 0; i < rms.length; i++) {
        if (rms[i] == room) return i;
      }
      return -1;
    }
    po.getParentRoom = function (room) {
      return this._getParentRoomDo(this.map, room);
    }
    po._getParentRoomDo = function (map, room) {
      var mm = map.scales, res = null;
      if (mm) {
        for (var i = 0; i < mm.length; i++) {
          if (mm[i] == room) return map;
          if (mm[i].scales) {
            res = this._getParentRoomDo(mm[i], room);
            if (res) return res;
          }
        }
      }
      return res;
    }
    po.addRoom = function (nc, r, dr) {
      var m = this, itms = m.itms;
      if (!r) r = m.map.scales[0];//沒有指定參考房間,就使用第一間
      var p = m.getParentRoom(r), mm = p.scales, nr, or, oc = m.getCustomer(r);
      if (!dr) dr = p.mode;
      if (!nc) {
        var c = m.floor.appendChild(newEm("DIV"));
        nc = new opComponent(c);
      }
      if (mm.length == 1) p.mode = dr;//允許改方向 因為原本只有一間房
      if (p.mode == dr) {
        //同方向時只要往後加一間房就可以了
        or = r;
        nr = { rt: mm[mm.length - 1].rt }; // .rt會隨著操作改變所以需要和第一間一樣
        mm.push(nr);
      } else {
        //方向不同 必須在原來的房間做隔間
        or = { rt: r.rt }; nr = { rt: r.rt };
        r.mode = dr;
        r.scales = [or, nr];
      }
      var ix = m.getRoomIndex(nr);
      if (ix < itms.length) itms.insert(nc, ix);
      else itms.add(nc);
      m.updateCustIdList();
      this.resizeLYO();
      return nc;
    }
    po.clearRooms = function () {
      //清除後面沒有用到的空房間
      var m = this, itms = m.itms, rms = m.collectRooms();
      for (var i = rms.length - 1; i >= itms.length; i--) {
        m.removeRoom(rms[i]);
      }
      m._clearBlankScales();
    }
    po._clearBlankScales = function (map) {
      if (!map) map = this.map;
      var scs = map.scales;
      if (scs) {
        for (var i = 0; i < scs.length; i++) {
          this._clearBlankScales(scs[i]);
        }
        if (scs.length == 0) delete map.scales;
        if (scs.length == 1 && map != this.map) {
          //當底下全部只有一個房間時就升級
          var rms = this.collectRooms(map);
          if (rms.length <= 1) delete map.scales;
        }
      }
    }
    po.getSplitBtns = function (room) {
      var m = this, _sp = m._spls; if (!_sp) { _sp = []; m._spls = _sp; }
      for (var j = 0; j < _sp.length; j++) {
        if (_sp[j].mmA == room) return _sp[j];
      }
    }
    po.clearSplitButtons = function () {
      var _sp = this._spls;
      //把所有splitter button 清除,畫面重排時會自動重建
      if (!_sp) return;
      for (var j = 0; j < _sp.length; j++) {
        var aa = _sp[j].A, bb = _sp[j].B, peo = aa.parentElement;
        peo.removeChild(aa);
        peo.removeChild(bb);
      }
      _sp.splice(0, _sp.length);
    }
    po.removeRoom = function (r) {
      //移除房間 r 回傳客人物件
      var m = this, p = m.getParentRoom(r), mm = p.scales, itms = m.itms;
      //剩下最後一間時 不可移除 否則屋就垮了
      if (mm.length == 1 && p == m.map) return alert("Can not remove last one room!");
      var ix = m.getRoomIndex(r);
      for (var i = 0; i < mm.length; i++) {
        if (mm[i] == r) {
          var cust = itms[ix];
          itms.remove(ix);//必須先移除否則畫面重排時會又建立出來
          mm.splice(i, 1);
          m.clearSplitButtons();
          //如果只剩下一個房間,就必須提升層級,直接以上一層當成房間
          if (mm.length == 1) {
            var rms = this.collectRooms(mm[0]);
            if (rms.length <= 1) delete p.scales;
          }
          m.updateCustIdList();
          m.resizeLYO();
          return cust;
        }
      }
    }
    //把原來的房間(oldRoom)隔成兩間,舊房客住第一間,newRoom住第二間
    po.splitRoom = function (oldRoom, itms, newItm, refItem, nRoom, newMode, putbefore) {
      oldRoom.mode = newMode;
      var m = this, rm1 = { rt: oldRoom.rt }, rm2 = nRoom;
      if (putbefore) {
        oldRoom.scales = [rm2, rm1];
      } else {
        oldRoom.scales = [rm1, rm2];
      }
      var ix = m.getRoomIndex(rm2);
      if (ix < itms.length) itms.insert(newItm, ix);
      else itms.add(newItm);
      this.updateCustIdList();
    }
    po.updateCustIdList = function () {//依照房間配置更新客人名單(順序)
      var nml = this.itms.getIdList(",");
      this.map.custSeq = nml;
    }
    po.genCustSeq = function (autoAssignRoom) {//建立一組依照客人名單順序產生的集合
      var m = this, nml = m.map.custSeq, itmsOri = m.itmsOri, aar = autoAssignRoom, itmsChk = itmsOri.clone();
      var itms = new OpItems();
      if (nml) {//nml = itmsOri.getIdList(",");//(sDelimiter, opConfigIncl, opConfigExcl, getText, getFldName,getId)
        //這裡不可以用collect,必須逐一加入,找不到的就新建一個空的item以確保物件數量和原來設定的相同
        var anm = nml.split(",")
        for (var i = 0; i < anm.length; i++) {//為了維持原先的順序,必須要找出哪些是有登記房間的客人,將之從itmsChk移除
          var itm = itmsOri[anm[i]];
          if (itm) itmsChk.remove(itm);
        }
        for (var i = 0; i < anm.length; i++) {
          var itm = itmsOri[anm[i]];
          if (itm) itms.add(itm);
          else if (aar && !anm[i] && itmsChk.length > 0) { //原先有登記房客的需保留
            itms.add(itmsChk[0]);
            itmsChk.remove(0);
          }
          else {
            var c = m.floor.appendChild(newEm("DIV"));
            itm = new opComponent(c);
            itm.name = anm[i];
            itm.text = anm[i];
            itms.add(itm);
            c.title = itms.length;
          }
        }
        if (itmsChk.length > 0) {
          for (var i = 0; i < itmsChk.length; i++) {
            var mm = m.map.scales;
            itms.add(itmsChk[i]);
            mm.push({ rt: mm[mm.length - 1].rt });//複製最後一間房
          }
          m.itms = itms;
          m.updateCustIdList();
        }
      } else {//沒有指定時就clone 集合
        for (var i = 0; i < itmsOri.length; i++) {
          itms.add(itmsOri[i]);
        }
      }
      m.itms = itms;
    }
    po.showCustRegInfo = function () {
      var m = this, mm = m.collectRooms(), custs = m.itms;
      for (var i = 0; i < mm.length; i++) {
        var cust = custs[i];
        if (!cust) continue;
        var cu = m.getCustomer(mm[i]);
        if (cu) {
          var c = cu.container; if (!c) c = cu.cntr;
          var t = cust.text; if (!t) t = cust.name; if (!t) t = cust.id
          if (t && c && c.children.length == 0) c.innerText = t;
        }
      }
    }
    po.mapText = function () {
      try {
        //需要移除掉runtime暫時的屬性
        var o = JSON.parse(JSON.stringify(this.map));
        this.delAttr(o);
        //清除沒有元素的sacles
        return JSON.stringify(o);
      } catch (ex) { return ""; }
    }
    po.delAttr = function (o) {
      //如果layout是使用絕對尺寸方式進行排列,就不能夠清除 x y w h
      //if (!this.absoluteHeight) {
      delete o.x; delete o.y; delete o.w; delete o.h;
      //}
      delete o.ox2; delete o.oy2; delete o.ow2; delete o.oh2;
      if (o.scales) {
        for (var i = 0; i < o.scales.length; i++) {
          this.delAttr(o.scales[i]);
        }
      }
    }
    po.evtHandle = function () {
      var ev = GJT.event(); if (!ev) return;
      var m = this, o = GJT.eventSrc(), ty = ev.type;
      if (ty == "mousemove") {
        if (GJT.isButtonDownLeft()) {
          if (m.curmap) m.draging(ev);
        } else {
          if (o == m.bar) return;
          var st = teHtm().style, r; m.curmap = null, csr = "";
          //document.title = o.tagName +"-" + o.offsetWidth + "-" + o.offsetHeight + "-" + evtOffsetX(ev) + "," + evtOffsetY(ev);
          if (o == m.floor || o.tagName == "HTML") r = m._inGap(m.map, evtOffsetX(ev), evtOffsetY(ev));
          if (r) {
            var r0 = r[0];
            m.curmap = r0;
            m.curmaps = r;//所有符合的物件
            if (r0.mode == "H") csr = "w-resize"; else csr = "s-resize";
          }
          m.cursor = csr;
          if (csr != "") m.showbar(0, 0);
          else hideIt(m.bar);
        }
      }
      else if (ty == "mousedown") {
        if (GJT.isLeftButton()) {
          m.beginDrag(ev);
        }
      }
      else if (ty == "mouseup") {
        if (GJT.isLeftButton()) m.endDrag(ev);
      }
      else if (ty == "selectstart" && m.curmap) { cmnEvtSetReturn(false); }
    }
    po.beginDrag = function (ev) {
      var m = this, mpx = m.curmap; if (!mpx) return;
      m.xB = ev.clientX; m.yB = ev.clientY; GJT.isDraging = 1;
      var ms = mpx.cmm, w, h;
      m.showbar(0, 0);
    }
    po.showbar = function (sx, sy) {
      var m = this, mpx = m.curmap, bar = m.bar; if (!mpx) return;
      if (!bar) { bar = addEm("<div class='splitBar' style='background-color:highlight' >", bar, m.floor); m.bar = bar; bar.oncontextmenu = m._CntxMnu };
      bar.style.cursor = m.cursor;
      var ms = mpx.cmm, w, h, p = m.getParentRoom(mpx), g = m.gap;
      if (p && p.gap != null) g = p.gap;
      if (mpx.mode == "H") { w = g; h = ms.h; sy = 0; } else { w = ms.w; h = g; sx = 0; }
      cmnMoveObjTo(bar, ms.x + sx, ms.y + sy, w, h);
      showIt(bar);
      toZBottom(bar);
    }
    po.draging = function (ev, endDrag) {
      var m = this, mpx = m.curmap; if (!mpx) return;
      var x = ev.clientX, y = ev.clientY;
      //依據滑鼠移動方向決定用哪一個
      if (m.curmaps.length > 1) {
        var sx = x - m.xB, sy = y - m.yB;
        if (sx > 0 && mpx.mode == "H") mpx = m.curmaps[m.curmaps.length - 1];
        else if (sy > 0 && mpx.mode == "V") mpx = m.curmaps[m.curmaps.length - 1];
      }
      var mm = mpx.mm, ix = mpx.idx, ix1 = ix + 1, ix2 = ix - 1, gp = m.gap, sh;
      var sx = x - m.xB, sy = y - m.yB;//需要先算出移動量 再檢查移動量有沒有超出合理範圍
      GJT.stopBubble(ev);
      if (mpx.mode == "H") sh = sx; else sh = sy;

      if (mm[ix].rt - sh < 0) sh = mm[ix].rt //最小只能到本身變成0寬度
      if (ix > 0 && (mm[ix2].rt + sh < 0)) sh = -mm[ix2].rt;//最大只能到前一個房間變成0寬度
      if (mpx.mode == "H") sx = sh; else sy = sh;
      if (endDrag) {
        hideIt(m.bar);
        //操作的樓層的方向是絕對尺寸時不要改變
        if (!((m.absoluteWidth && mpx.mode == "H") || (m.absoluteHeight && mpx.mode == "V"))) {
          //絕對尺寸操作時 不要更改自身的大小
          mm[ix].rt -= sh;
          if (mm[ix].rt < 0) mm[ix].rt = 0;
        }
        if (ix > 0) {
          mm[ix2].rt += sh;
          if (mm[ix2].rt < 0) mm[ix2].rt = 0;
        }
        m.resizeLYO(); GJT.isDraging = 0;
        if (m.onScalesChanged) m.onScalesChanged(m);
      } else this.showbar(sx, sy);
    }
    po.endDrag = function (ev) { this.draging(ev, 1); }
    po.replaceItm = function (newItm, oldItm) {
      var fnd = 0, itms = this.itms;
      var cn = oldItm.container, ox, oy, ow, oh;
      if (cn) { ox = cn.offsetLeft; oy = cn.offsetTop; ow = cn.offsetWidth; oh = cn.offsetHeight; }
      for (var i = 0; i < itms.length; i++) {
        if (itms[i] == oldItm) { itms.insert(newItm, i); itms.remove(oldItm); fnd = true; }
      }
      if (fnd) {
        //if (cn && ow && oh && newItm.moveTo) { newItm.moveTo(fromPx(ox), fromPx(oy), fromPx(ow), fromPx(oh),1); }
        //else
        this.resizeLYO(1);
      }
      return fnd;
    }
    po.addItem = function (newItm) {
      if (!newItm) return;
      this.itms.add(newItm);
      this.resizeLYO();
    }
    //insertItem是個複雜的設計,作用是把一個新房客放到參考房客的旁邊(location上下左右邊), 並且當指定的那邊如果已經有其他房客時,可以依據指定的排列方向(direction 垂直水平)和其他房客分配位置
    //規則:先找到參考房客的房間之後以參考房間的位置及排列方向(上下排列 或 左右排列)為基準:
    //如果新房客要放置的位置是在參考房間的上下邊時:如果參考房間排列方式是上下邊時,則檢查指定的位置(上下邊)有沒有房間,沒有的話就新增一個讓新房客直接入住
    //指定的位置有房間(roomA)的話就再檢查該房間有沒有隔間,沒有隔間的話就以新房客指定的排列方式進行隔間讓原房客入住第一間新房客住第二間
    //如果roomA已經有隔間的話:檢查隔間方式,如果和新房客要求的隔間方式相同就直接在最後面加一個新隔間,如果隔間方式不同就在原來的最後一個房間以指定的隔間方式隔成兩房 原房客住第一間新房客第二間
    //左右邊排列的邏輯和上下邊相同
    po.insertItem = function (newItm, refItem, localtion, direction, occupyRate) {
      var m = this;
      var fnr = m._insertItemDo(m.map, m.itms, newItm, refItem, localtion, direction, occupyRate);
    }
    po._insertItemDo = function (mp, itms, newItm, refItem, localtion, direction, occupyRate) {
      var m = this, md = mp.mode, mm = mp.scales, u = mm.length;
      var loc = localtion, dir2 = direction, rt2 = occupyRate, tarRoom;
      for (var i = 0; i < u; i++) {
        var refRoom = mm[i];
        if (refRoom.scales) {
          m._insertItemDo(refRoom, itms, newItm, refItem, loc, dir2, rt2);
        } else {
          var itm = this.getCustomer(refRoom);
          if (refItem == itm || refItem.container == itm.container || refItem == itm.container || refItem.container == itm) {
            //找到參考物件的位置之後,依照指定的位置新增房間
            var nRoom = { rt: rt2 * refRoom.rt };//排列之後rt會改變成實際的pixels,因此這裡需要乘上參考房間的rt
            var requiredDir = (loc == "L" || loc == "R") ? "H" : "V"; //放置位置如果是在左右邊 則需要的排列方式是H 否則為V
            var putbefore = loc == "L" || loc == "T";//左邊 及上邊是放在參考房間的前面
            var currentDir = md;
            if (requiredDir == currentDir) {
              //需要的排列方式與參考房間的排列方式相同時,依據相對位置加房間
              if (putbefore) {
                //如果新房客要求的排列方式和refItem所在的排列方式不同,且前面已經有房間了,就用該房間進行新隔間
                if (dir2 != currentDir && i > 0) {
                  var oldroom = mm[i - 1], scls = oldroom.scales;
                  //如果隔壁房間已經有隔間了就直接加一個隔間
                  if (scls) {
                    nRoom.rt = rt2 * scls[scls.length - 1].rt; //比率需要依照新鄰居計算
                    oldroom.scales.push(nRoom);
                  } else {
                    oldroom.mode = dir2;
                    nRoom.rt = rt2 * oldroom.rt;//拆分新隔間 要以原房客大小計算比率
                    var nRoom0 = { rt: oldroom.rt }
                    oldroom.scales = [nRoom0, nRoom];
                  }
                } else {
                  mm.splice(i, 0, nRoom);//前面加一個房間
                }
              } else {
                //如果新房客要求的排列方式和refItem所在的排列方式不同,且refItem後面已經有房間了,就用同一排的最後一間房間進行新隔間
                if (dir2 != currentDir && i < u - 1) {
                  var oldroom = mm[u - 1], scls = oldroom.scales;
                  //如果隔壁房間已經有隔間了就直接加一個隔間
                  if (scls) {
                    nRoom.rt = rt2 * scls[scls.length - 1].rt; //比率需要依照新鄰居計算
                    oldroom.scales.push(nRoom);
                  } else {
                    oldroom.mode = dir2;
                    nRoom.rt = rt2 * oldroom.rt;//拆分新隔間 要以原房客大小計算比率
                    var nRoom0 = { rt: oldroom.rt }
                    oldroom.scales = [nRoom0, nRoom];
                  }
                } else {
                  mm.push(nRoom);
                }
              }
              var ix = m.getRoomIndex(nRoom);
              if (ix < itms.length) itms.insert(newItm, ix);
              else itms.add(newItm);
            } else {
              //需要的排列方式與參考房間的排列方式不同時 只能在參考房間內進行新隔間
              m.splitRoom(refRoom, itms, newItm, refItem, nRoom, requiredDir, putbefore);
            }
            m.resizeLYO(); //這裡不要重排,有外部呼叫者呼叫重排,因為有可能外部連續加入多的房客
            break;
          }
        }
      }
    }
    po.itemExist = function (obj, chkContainer) {
      var m = this, o = obj, ck = chkContainer, itms = m.itms;
      if (ck && (o instanceof opComponent)) o = o.container;
      for (var i = 0; i < itms.length; i++) {
        var c = itms[i]; if (ck && (c instanceof opComponent)) c = c.container;
        if (c == o) return true;
      }
    }
    po.setMargin = function (l, t, r, b) {
      var m = this; m.marginLeft = l; m.marginTop = t; m.marginRight = r; m.marginBottom = b;
    }
    po.turnsMax = function () {
      var m = this, r = m._roomToMax, mm = m.collectRooms(), ix = 0;
      for (var i = 0; i < mm.length; i++) {
        if (mm[i] == r) { ix = i + 1; break; }
      }
      if (ix >= mm.length) ix = 0;
      m._maxByRoom(mm[ix]);
    }
    po.evtChg = function () {
      var aa = GJT.eventSrc(), m = this, ev = GJT.event();
      if (aa.mmX) {
        //如果已是最大化設定就進行輪流最大化
        if (m._roomToMax) { if (ev.altKey) { delete m._roomToMax; return m.resizeLYO(); } else return m.turnsMax(); }
        if (ev.ctrlKey) return m._evtCntxMnu3(aa, "c");
        aa.mmX.hidden = !aa.mmX.hidden; aa.mmX.shiftD = aa.mmX.hidden ? aa.shiftD : 0;
        m.resizeLYO();
      } // if (m.onScalesChanged) m.onScalesChanged(m);//do not save setting
    }
    //給SplitButton用的右鍵選單
    po.evtCntxMnu = function () {
      var aa = GJT.eventSrc(), m = this, r = aa.mmX;
      var itms = new OpItems();
      if (!r) { r = m.curmap.cmm; aa = null; }
      if (!r) return;
      //itms.add(NIT("maxta", "Maxmize to Area")); //不要這一項 用處不大
      if (m._roomToMax) itms.add(NIT("rstr", "Restore arrangement"));
      else if (r) itms.add(NIT("maxtc", "Maxmize to Container"));
      if (r) {
        var p = m.getParentRoom(r), md = p ? p.mode : "";
        if (m.absoluteWidth && md == "H") itms.add(NIT("setRoomSize", "Set Room Width"));
        if (m.absoluteHeight && md == "V") itms.add(NIT("setRoomSize", "Set Room Height"));
      }
      if (m._roomToMax) {
        //切換房客 m.maxMode
        var cus = new OpItems(), mms;
        if (m.maxMode == "c") mms = m.collectRooms(); else mms = m.collectRooms(p);
        for (var i = 0; i < mms.length; i++) {
          var r2 = mms[i], cu = m.getCustomer(r2);
          if (r2 == m._roomToMax || !cu) continue;//當下的 或沒房客的不列出
          var itm = new OpItem("swx_" + cu.name, "Switch to " + cu.text);
          itm._surRoom = r2;
          itms.add(itm);
        }
      }
      itms.add(NIT("swspbtn", (m.noSplitButton ? "Show" : "Hide") + " Split Button"));
      itms.onclick = m._evtCntxMnu2;
      itms.ctrl = m;
      itms.aa = aa;
      itms._surRoom = r;
      SysShowMenu(itms);
      return false;
    }
    po._evtCntxMnu2 = function (itm, itms) {
      var m = itms.ctrl, nm = itm.name, aa = itms.aa, md;
      if (nm.indexOf("maxt") == 0) {
        md = nm.substring(4);
        if (!aa) m._maxByRoom(itms._surRoom, md);
        else m._evtCntxMnu3(aa, md);
      } else if ("rstr" == nm) { if (m._roomToMax) { delete m._roomToMax; return m.resizeLYO(); } }
      else if ("setRoomSize" == nm) {
        var s = window.prompt("Please input size for selected room", aa.mmX.rt);
        if (s != null) {
          s = parseFloat(s);
          aa.mmX.rt = s;
          m.resizeLYO();
        }
      }
      if (nm.indexOf("swx_") == 0) m._maxByRoom(itm._surRoom);
      if (nm.indexOf("swspbtn") == 0) { m.map.options = m.map.options ^ GJT.LayoutOperOptions.NoSplitButton; m.resizeLYO(); }
    }
    po._maxByRoom = function (r, md) {
      var m = this, sp = m.getSplitBtns(r), aa;
      if (md == null) md = m.maxMode;
      //如果找不到split button一定是第一間房
      if (!sp) {
        var p = m.getParentRoom(r); if (!p) p = r;
        sp = m.getSplitBtns(p.scales[1]);
        if (sp) aa = sp.B;
      }
      else aa = sp.A;
      if (sp) m._evtCntxMnu3(aa, md);
    }
    po._evtCntxMnu3 = function (aa, md) {
      var m = this, tarR, r = aa.mmX;
      var p = m.getParentRoom(r), mm = p.scales;
      for (var i = 0; i < mm.length; i++) {
        //最大化時,按鈕圖像的作用和一般的click相反,click時是把按鈕連結的room 隱藏起來,讓上一個room extend
        //所以這裡需要依照aa的shiftD 判斷要最大化的的room是哪一個
        if (mm[i] == r) {
          if (aa.shiftD < 0) { tarR = mm[i + 1]; } //最大化下一間房
          else { tarR = mm[i - 1]; }
        }
      }
      if (tarR) {
        m._roomToMax = tarR;
        m.maxMode = md;
        m._splitBtn = aa;
        m.resizeLYO();
        showIt(aa);
        toZTopC(aa);
      }
    }
    layoutDispatcher._initialized = 1;
  }
  var m = this, er = function () { m.evtHandle.call(m); }, htm = teHtm(), fo = floor;
  if (typeof map == "string") map = eval("o=" + map);
  if (mapOfUser && typeof mapOfUser == "string") mapOfUser = eval("o=" + mapOfUser);
  if (mapOfUser && mapOfUser.ver == map.ver && mapOfUser.mode) map = mapOfUser;
  //map如果有指定gap 就使用指定的,否則用預設值
  m.map = map; m.floor = fo; m.gap = map.gap == null ? 5.1 : map.gap, m.cntrs = [];
  GJT.eventAddHandle(htm, "mousemove,mouseup,selectstart,mousedown", er, 1);
  //使用一組客人名單順序來決定入住房間的順序
  m.itmsOri = itms;
  m.genCustSeq(autoAssignRoom);
  m._evtMxi = function () { m.evtChg.call(m); };
  m._CntxMnu = function () { return m.evtCntxMnu.call(m); };
  m._rvshw2 = function () { return m._rvshw.call(m); };
  m.setMargin(0, 0, 0, 0);
  if (fo != BDY()) fo.style.position = "relative";
  m.cacheOptions();
} //end layoutDispatcher

// 天/兩小時 天/六小時 週/天 月/3天 月/週 三個月/月 六個月/月 一年/季 一年/半年
var GanttScale = {
  hour2: 0, hour6: 1, day1: 2, day3: 3, day7: 4, month1_3: 5, month1_6: 6, quarter: 7, halfYear: 8
, onePercent: 100, oneTenth: 101, one: 102, ten: 103, hundred: 104, thousand: 105, tenThousand: 106
};
//begin GanttBarLinker
function GanttBarLinker(barF, barT) {
  if (GanttBarLinker._initialized == undefined) {
    var po = GanttBarLinker.prototype;
    po.drawLines = function (canvas, linkMode, color, camLen, visible) {
      var m = this, bf = m.barF, bt = m.barT, rf = bf.getBoundingClientRect(), rt = bt.getBoundingClientRect();
      var rc = canvas.getBoundingClientRect();
      //var fhh=rf.height/2+1,thh=rt.height/2+1;
      var fhh = (rf.height - 1) / 2, thh = (rt.height - 1) / 2;
      var x1 = rf.right - rc.left, x2 = rt.left - rc.left, y1 = rf.top + fhh - rc.top, y2 = rt.top + thh - rc.top;
      var x1c = x1 + camLen, x2c = x2 - camLen;
      if (y1 > y2) { fhh = -fhh; thh = -thh; }
      if (x1 + camLen > x2 - camLen) {
        points = [[x1, y1].join(","), [x1c, y1].join(","), [x1c, y1 + fhh].join(","), [x2c, y2 - thh].join(","), [x2c, y2].join(","), [x2, y2].join(",")
        , [x2 - 5, y2 - 2].join(","), [x2 - 5, y2 + 2].join(","), [x2, y2].join(","), [x2 - 4, y2 - 1].join(","), [x2 - 4, y2 + 1].join(","), [x2, y2].join(",")];
      } else {
        points = [[x1, y1].join(","), [x1c, y1].join(","), [x2c, y2].join(","), [x2, y2].join(",")
        , [x2 - 5, y2 - 2].join(","), [x2 - 5, y2 + 2].join(","), [x2, y2].join(",")];
      }
      //使用polyline
      var pl = m.line;
      if (!pl) { pl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline'); canvas.appendChild(pl); m.line = pl; pl.setAttribute("stroke-width", 1); pl.setAttribute("fill", "none"); }
      pl.setAttribute("points", points.join(" "));
      pl.setAttribute("stroke", color);
      //pl.setAttribute("stroke-dasharray", "5,2,1,2"); //畫虛線 stroke-linecap 端點
      pl.style.display = visible ? "" : "none";
    }
    po.destroy = function () {//清除所有的線段物件
      var m = this;
      m.line.parentNode.removeChild(m.line);
    }
    GanttBarLinker._initialized = true;
  }
  var m = this; m.barF = barF; m.barT = barT;
  //m.drawLines(canvas,color);
} //end GanttBarLinker

//begin GanttBarLinkers
function GanttBarLinkers(canvas, linkMode, color) {
  if (GanttBarLinkers._initialized == undefined) {
    var po = GanttBarLinkers.prototype;
    po.clear = function () {
      var m = this; for (var i = 0; i < m.length; i++) { m[i].destroy(); }//清除舊的
      m.splice(0, m.length);
    }
    po.addLinker = function (barF, barT) {
      var m = this, lo = new GanttBarLinker(barF, barT);
      lo.drawLines(m.canvas, m.linkMode, m.color, m.camLen, m.visible)
      this.push(lo);
    }
    po.drawLinkers = function () {
      var m = this, iL = m.length, vis = m.visible;
      for (var i = 0; i < iL; i++) { m[i].drawLines(m.canvas, m.linkMode, m.color, m.camLen, vis); }
    }
    po.setVisible = function (vis) {
      this.visible = vis;
      this.drawLinkers();
    }
    GanttBarLinkers._initialized = true;
  }
  var m = this;
  m.canvas = canvas; m.linkMode = linkMode; m.color = color;
  m.camLen = 8;//連線的水平線基段 長度(bar尾端劃出一小段水平線再開始連到其他bar
  m.visible = true;
}
GanttBarLinkers.prototype = [];
//end GanttBarLinkers

// **** begin gantt builder
function TableGanttBuilder(name, text, ge, canvasColumn) {
  //需有幾個重要數字屬性:每一個基本刻度的pixels,每個pixel代表的毫秒數
  if (TableGanttBuilder._initialized == undefined) {
    var po = TableGanttBuilder.prototype;
    po.scaleIncrease = function (incr) { this.scaleChangedByUser = true; return this.scaleChange(this.scale + incr); }
    po.scaleChange = function (val) {
      var m = this, s = m.scale;
      if (s == val) return;
      s = val;
      if (m.numberFields) {
        if (s < GanttScale.onePercent) s = GanttScale.onePercent;
        if (s > GanttScale.tenThousand) s = GanttScale.tenThousand;
      } else {
        if (s < GanttScale.hour2) s = GanttScale.hour2;
        if (s > GanttScale.halfYear) s = GanttScale.halfYear;
      }
      m.scale = s;
      m.drawGantt();
    }
    po.pixelsPerUnit = function (s) {//每一個最小刻度使用的pixels數,用來計算畫bar的寬度 預設25點
      var v = 25;
      if (s == GanttScale.hour2) v = 30;
      else if (s == GanttScale.hour6) v = 30;
      else if (s == GanttScale.day1) v = 25;
      else if (s == GanttScale.day3) v = 25;
      else if (s == GanttScale.day7) v = 25;
      else if (s == GanttScale.month1_3) v = 25;
      else if (s == GanttScale.month1_6) v = 25;
      else if (s == GanttScale.quarter) v = 30;
      else if (s == GanttScale.halfYear) v = 40;

      else if (s == GanttScale.onePercent) v = 30;
      else if (s == GanttScale.oneTenth) v = 20;
      else if (s == GanttScale.one) v = 10;
      else if (s == GanttScale.ten) v = 15;
      else if (s == GanttScale.hundred) v = 20;
      else if (s == GanttScale.thousand) v = 50;
      else if (s == GanttScale.tenThousand) v = 80;

      v += m.unitWdtAdjValue;
      if (v < 2) v == 2;
      return v;
    }
    po.msecPerUnit = function (s) {//每一單位刻度代表的毫秒數 用來 換算出畫面上每一個pixel代表多少毫秒
      if (s == GanttScale.hour2) return 7200000; //3600秒 * 1000 * 2
      else if (s == GanttScale.hour6) return 21600000;
      else if (s == GanttScale.day1) return 86400000;
      else if (s == GanttScale.day3) return 259200000;
      else if (s == GanttScale.day7) return 604800000;//604800000 是七天的毫秒數
      else if (s == GanttScale.month1_3) return 2628000000;//月份雖然天數長度不一,但是以月為基本刻度查看時,一天的誤差只有一個或兩個pixels視覺上看不出來,使用30.4166666天 (365/12)就可以了
      else if (s == GanttScale.month1_6) return 2628000000;
      else if (s == GanttScale.quarter) return 7862400000; //用91.25天
      else if (s == GanttScale.halfYear) return 15724800000; //用182.5天

      else if (s == GanttScale.onePercent) return 0.01;
      else if (s == GanttScale.oneTenth) return 0.1;
      else if (s == GanttScale.one) return 1.0;
      else if (s == GanttScale.ten) return 10.0;
      else if (s == GanttScale.hundred) return 100.0;
      else if (s == GanttScale.thousand) return 1000.0;
      else if (s == GanttScale.tenThousand) return 10000;
    }
    po.msecPerPixel = function (s) {
      return this.msecPerUnit(s) / this.pixelsPerUnit(s);
    }
    po.getBeginValByScale = function (ti, s) {
      if (ti >= 0) return 0;//如果所有數值都大於0 就使用0
      var v;
      if (s == GanttScale.onePercent) v = parseInt(ti * 100) / 100;
      else if (s == GanttScale.oneTenth) v = parseInt(ti * 10) / 10;
      else if (s == GanttScale.one) v = parseInt(ti, 10);
      else if (s == GanttScale.ten) v = parseInt(ti / 10) * 10;
      else if (s == GanttScale.hundred) v = parseInt(ti / 100) * 100;
      else if (s == GanttScale.thousand) v = parseInt(ti / 1000) * 1000;
      else if (s == GanttScale.tenThousand) v = parseInt(ti / 10000) * 10000;
      return v - this.msecPerUnit(s);
    }
    po.getEndValByScale = function (ti, s) {
      var v;
      if (s == GanttScale.onePercent) v = parseInt(ti * 100) / 100;
      else if (s == GanttScale.oneTenth) v = parseInt(ti * 10) / 10;
      else if (s == GanttScale.one) v = parseInt(ti, 10);
      else if (s == GanttScale.ten) v = parseInt(ti / 10) * 10;
      else if (s == GanttScale.hundred) v = parseInt(ti / 100) * 100;
      else if (s == GanttScale.thousand) v = parseInt(ti / 1000) * 1000;
      else if (s == GanttScale.tenThousand) v = parseInt(ti / 10000) * 10000;
      return v + this.msecPerUnit(s);
    }
    po.getBeginTimeByScale = function (ti, s) {
      var dt = new Date(ti).beginOfDate();
      if (s == GanttScale.day1 || s == GanttScale.day7) { //倒推回到週一那一天的開始,小時的都是從00:00:00
        while (dt.getDay() != 0) {
          dt = new Date(dt.getTime() - 86400000);
        }
      } else if (s == GanttScale.day3) {//回到該月的第一天
        dt.setDate(1);//當月第一天
      } else if (s == GanttScale.month1_3) {//回到當季的第一天
        dt.setDate(1);//當月第一天
        var mnth = dt.getMonth();
        while (mnth != 0 && mnth != 3 && mnth != 6 && mnth != 9) {//各季的第一個月
          mnth--;
        }
        dt.setMonth(mnth);
      } else if (s == GanttScale.month1_6) {
        dt.setDate(1);//當月第一天
        var mnth = dt.getMonth();
        while (mnth != 0 && mnth != 6) {
          mnth--;
        }
        dt.setMonth(mnth);
      } else if (s == GanttScale.quarter || s == GanttScale.halfYear) {
        //該年的1/1
        dt.setMonth(0); dt.setDate(1);
      }
      return dt.getTime();
    }
    po.getEndTimeByScale = function (ti, s) {
      var dt = new Date(ti).endOfDate();
      if (s == GanttScale.day1 || s == GanttScale.day7) { //前進到週日那一天的最後1毫秒,小時的都是從23:59:59.999
        while (dt.getDay() != 6) {
          dt = new Date(dt.getTime() + 86400000);
        }
      } else if (s == GanttScale.day3) {//前進到該月的最後一天
        dt.setMonth(dt.getMonth() + 1);//先到下個月的第一天,然後倒退一毫秒
        dt.setDate(1); dt = new Date(dt.beginOfDate().getTime() - 1);
      } else if (s == GanttScale.month1_3) {//前進到當季的最後一天
        var mnth = dt.getMonth();
        while (mnth != 2 && mnth != 5 && mnth != 8 && mnth != 11) {
          mnth++;
        }
        dt.setMonth(mnth + 1); dt.setDate(1);
      } else if (s == GanttScale.month1_6) {//前進到當半年的最後一天
        var mnth = dt.getMonth();
        while (mnth != 5 && mnth != 11) {
          mnth++;
        }
        dt.setMonth(mnth + 1); dt.setDate(1);
      } else if (s == GanttScale.quarter || s == GanttScale.halfYear) {
        //該年的1/1
        dt.setMonth(12); dt.setDate(1);
        dt = new Date(dt.beginOfDate().getTime() - 1);
      }
      return dt.getTime();
    }
    po.matchBackPanel = function () {
      var m = this, p = m.backPanel, pst = p.style, c = m.titleContainer, c0 = c.children[0];//title div
      matchLoc(p, c0, 0, 0, 1);
      var rg = m.ge.grid.getBoundingClientRect(), rt = p.getBoundingClientRect();
      var h = rg.bottom - rt.top;
      pst.height = toPx(h);
      pst.zIndex = 0;
    }
    po.reviseBarLinkers = function () {
      var m = this, lnkrs = m.barLinkersPre;
      if (lnkrs) lnkrs.drawLinkers();
      toZTopC(m.canvas);
    }
    po.drawBarLinker = function (trs) {//return;
      var TkF = this.fldTaskTypeId, preTkF = this.fldPreiousTask, PjF = this.fldProjectId, vTk, vTkPre, vPj, hasProjId;
      if (!TkF || !preTkF) return;
      var m = this, ge = m.ge, c = m.titleContainer, fc = m.fldCanvas, cvns = m.canvas;
      var lnkrs = m.barLinkersPre; //Previous Tasks前工程關聯
      toZTopC(m.canvas);
      var idxC = ge.getCellIndex(fc), forAll = !trs, vTk, vTkPre, rwsBar;
      var dctPre = m.trDictPre; //建立TR 字典by vTk
      if (!dctPre) forAll = true; //如果找不到TR字典,乾脆整個重建比較簡單,
      if (forAll) trs = ge.getAllDataRows();
      var rL = trs.length;
      vTk = ge.getFieldsValues([TkF, preTkF, PjF], trs, null, 1, 0, 1);
      vTkPre = vTk[1]; vPj = vTk[2]; vTk = vTk[0]; hasProjId = !(!vPj); //轉布林可能運算較快
      if (!vTkPre || !vTk) return;
      if (hasProjId) {//加入專案id 做正確區分
        for (var r = 0; r < rL; r++) {
          vTk[r] = vTk[r] + "@" + vPj[r]; //TR vs TaskTypeId
        }
      }
      if (!lnkrs) { lnkrs = new GanttBarLinkers(cvns, 0, "rgb(10,10,240)"); m.barLinkersPre = lnkrs; };
      if (forAll) {
        lnkrs.clear();
        dctPre = {}; m.trDictPre = dctPre;
        for (var r = 0; r < rL; r++) {
          dctPre[vTk[r]] = trs[r]; //TR vs TaskTypeId
        }
      }
      for (var r = 0; r < rL; r++) {
        if (!vTkPre[r]) continue;
        var v2 = vTkPre[r].split(",");
        var trT = trs[r];
        for (var j = 0; j < v2.length; j++) {
          if (hasProjId) v2[j] = v2[j] + "@" + vPj[r];
          var trF = dctPre[v2[j]];
          if (!trF) { continue; } //字典裡找不到,可能是新增的,暫時不處理
          var barT = trT.cells[idxC].children[0].children[0].children[0];
          var barF = trF.cells[idxC].children[0].children[0].children[0];
          if (isHidden(barF) || isHidden(barT)) continue;
          if (forAll) lnkrs.addLinker(barF, barT);
          else {//檢查是否已經存在,如果已存在 就不建立新的,只更新位置
          }
        }
      }
    }
    po.drawTitle = function (wdt, ttlwdt) {//劃出日期標題
      var m = this, c = m.titleContainer, xT = m.maxDateT, nT = m.minDateT, dv, ge = m.ge, gc = ge.gridContainer, ggd = ge.grid;
      c.style.verticalAlign = "top";//必須靠上再轉列印時才能上下對齊
      var kh = "<div class='cell' style='display:inline-block;overflow:hidden;width:";
      var c0 = getEM(c, "div")[0];//title原本就會有span 所以不可以用children[0]判斷
      if (!c0) { c.innerHTML = "<div class='ganttTitle' style='overflow:hidden;overflow-y:hidden;overflow-x:hidden;'><div class='row0'></div><div class='row0'></div><div class='row'></div></div>"; c0 = c.children[0]; }
      var cpnl = gc;
      cpnl.style.position = "relative";//relative 的container 才能夠正確的顯示背板
      var bkPanel = m.backPanel, bkPanelA;
      if (!bkPanel) { bkPanel = addE("<div class='ganttBackPanel' style='position:absolute;white-space:nowrap;overflow:hidden' ><div style='height:100%;'></div></div>", cpnl); m.backPanel = bkPanel; }
      bkPanelA = bkPanel.children[0];
      setActWdt(bkPanelA, ttlwdt);
      var useSVG = false;
      var ti = nT, h0 = [], h1 = [], h2 = [], hpnl = [], s = m.scale, msecPU = m.msecPerUnit(s), pxPU = m.pixelsPerUnit(s), pxPU1 = pxPU - 1, msecPPx = m.msecPerPixel(s), dt2;
      var hHoliday = [];
      var cldr = m.calendar;//如果有行事曆,就要劃出假日
      var w0ttl = 0, w1ttl = 0;
      while (ti < xT) {
        var dt = new Date(ti), x0 = null, x1 = null, x2 = null, w0 = null, w1 = null;
        if (s == GanttScale.hour2) {
          x2 = dt.getHours();
          if (x2 == 0) { x1 = m.dayNames[dt.getDay()] + ", " + dt.format("yyyy/MM/dd"); w1 = pxPU * 12; }
        } else if (s == GanttScale.hour6) {
          x2 = dt.getHours();
          if (x2 == 0) { x1 = m.dayNames[dt.getDay()] + ", " + dt.format("yyyy/MM/dd"); w1 = pxPU * 4; }
        } else if (s == GanttScale.day1) {
          x2 = dt.getDay(); w1 = pxPU; x1 = dt.getDate();
          if (x2 == 0) {
            w0 = pxPU * 7; dt2 = new Date(ti + 604799999);//7天減1毫秒
            x0 = dt.format("MM/dd") + "~" + dt2.format("MM/dd") + " '" + dt.getFullYear();
          }
          if (cldr) {
            if (cldr.isHoliday(dt)) {
              hHoliday.push("<div class='holidayArea' style='left:" + toPx((ti - nT) / msecPPx) + ";width:" + toPx(pxPU - (x2 == 6 ? 1 : 0)) + "'></div>");
            }
          }
          x2 = m.dayNames[x2];
        } else if (s == GanttScale.day3) {
          x2 = dt.getDate();
          if (cldr) {
            for (var i = 0; i < 3; i++) {
              var dt4 = new Date(ti + 86400000 * i);
              if (cldr.isHoliday(dt4)) {
                hHoliday.push("<div class='holidayArea' style='left:" + toPx((dt4.getTime() - nT) / msecPPx) + ";width:" + toPx(86400000 / msecPPx) + "'></div>");
              }
            }
          }
        } else if (s == GanttScale.day7) {
          x2 = dt.getDate();
          if (cldr) {
            for (var i = 0; i < 7; i++) {
              var dt4 = new Date(ti + 86400000 * i);
              if (cldr.isHoliday(dt4)) {
                hHoliday.push("<div class='holidayArea' style='left:" + toPx((dt4.getTime() - nT) / msecPPx) + ";width:" + toPx(86400000 / msecPPx) + "'></div>");
              }
            }
          }
        }
        else if (s == GanttScale.month1_3) {
          x2 = dt.getMonth(); //由於月季是使用平均天數遞增,所以會有落在月底的情況,如果是落在下旬,月份就要加1
          if (dt.getDate() > 15) x2++;
          if (x2 == 0 || x2 == 3 || x2 == 6 || x2 == 9) {
            x1 = dt.getFullYear() + " Q" + (x2 / 3 + 1); w1 = pxPU * 3;
          }
          x2 += 1;
        } else if (s == GanttScale.month1_6) {
          x2 = dt.getMonth();
          if (dt.getDate() > 15) x2++;
          if (x2 == 0 || x2 == 5) {
            x1 = dt.getFullYear() + (x2 == 0 ? " First " : " Second"); w1 = pxPU * 6;
          }
          x2 += 1;
        } else if (s == GanttScale.quarter) {
          var mnth = dt.getMonth();
          if (dt.getDate() > 15) mnth++;
          x2 = "Q" + (mnth / 3 + 1);
          if (mnth == 0) {
            x1 = dt.getFullYear();
            w1 = pxPU * 4;
          }
        } else if (s == GanttScale.halfYear) {
          var mnth = dt.getMonth();
          if (dt.getDate() > 15) mnth++;
          x2 = mnth + 1;
          if (mnth == 0) {
            x1 = dt.getFullYear();
            w1 = pxPU * 2;
          }
        }
        else {
          x2 = Math.round(ti / msecPU) / (1 / msecPU);
          if ((Math.round(ti / msecPU) % 10) == 0) {
            var nv = ti + msecPU * 10;
            if (nv > xT) { nv = xT; w1 = (nv - ti) / msecPPx; }
            else w1 = pxPU * 10;
            nv = Math.round(nv / msecPU) / (1 / msecPU);
            x1 = x2 + "~" + nv + "-";
          }
        }
        if (x0 != null) h0.push(kh + toPx(w0 - 1) + "'>" + x0 + "</div>");
        if (x1 != null) h1.push(kh + toPx(w1 - 1) + "'>" + x1 + "</div>");
        h2.push(kh + toPx(pxPU - 1) + "'>" + x2 + "</div>");
        if (x0 != null) {
          hpnl.push(kh + toPx(w0 - 1) + "'></div>");
        } else if (x1 != null && w1 != pxPU) {
          hpnl.push(kh + toPx(w1 - 1) + "'></div>");
        }
        ti += msecPU;
      }
      if (s == GanttScale.day3 || s == GanttScale.day7) {
        var ti = nT;
        while (ti < xT) {
          var dt = new Date(ti);
          var dt2 = new Date(ti);
          dt2.setMonth(dt.getMonth() + 1);//下個月
          dt2.setDate(1);
          var drwVline = true;
          if (dt2.getTime() > xT) { drwVline = false; }//超出範圍就不需要畫線了dt2 = new Date(xT); //超出範圍 修正到範圍底
          var thisWdt = (dt2.getTime() - dt.getTime()) / msecPPx;

          h1.push(kh + toPx(thisWdt - 1) + "'>" + dt.format("yyyy/MM") + "</div>");
          if (drwVline) hpnl.push(kh + toPx(thisWdt - 1) + "'></div>");
          ti = dt2.getTime();
        }
      }

      var cns = c0.children, td = cns[0];
      td.innerHTML = h0.join(""); showItA(td, h0.length > 0); td.style.width = toPx(ttlwdt);
      td = cns[1];
      td.innerHTML = h1.join(""); showItA(td, h1.length > 0); td.style.width = toPx(ttlwdt);
      td = cns[2];
      td.innerHTML = h2.join(""); showItA(td, h2.length > 0); td.style.width = toPx(ttlwdt);
      var cnvs = m.canvas;
      if (!cnvs) hHoliday.push("<svg style='position:absolute;width:100%;height:100%;left:0px;top:0px;border:0px none white'></svg>");
      else { bkPanelA.removeChild(cnvs); }//需要先移走避免被消滅
      bkPanelA.innerHTML = hpnl.join("") + hHoliday.join(""); showItA(bkPanel, hpnl.length > 0);
      if (!cnvs) { cnvs = getEM(bkPanelA, "svg")[0]; m.canvas = cnvs; }
      else { bkPanelA.appendChild(cnvs); }
      setActWdt(cnvs, ttlwdt);
      //cnvs.zIndex=1000;
      toZTopC(cnvs);
      //window.setTimeout(function(){bkPanelA.appendChild(cnvs);},5000);
      var kst = bkPanel.style;
      kst.width = toPx(wdt);
      //kst.height = toPx(ge.grid.offsetHeight-2);
      setActHgt(bkPanelA, toCssHgt(ge.grid) - 2);
      c0.style.width = toPx(wdt);
      ge.grid.style.zIndex = 100;
      ge.grid.style.position = "absolute";
      kst.zIndex = 0;

      m.rvsFloatTitle(1);
      if (!m.intv4Match) {
        m.intv4Match = window.setInterval(function () { m.matchBackPanel.call(m); }, 1500);
      }
      m.matchBackPanel();
      //window.setTimeout(function(){m.matchBackPanel.call(m);},30);
    }
    po.drawGanttNum = function (trs, fullDraw, idxC, vPty) {
      var m = this, ge = m.ge, flds = m.numberFields;
      var v = ge.getFieldsValues(flds, trs, null, 1, 0, 1);
      var minDt = 0, maxDt = -9999999999999.0, iL = trs.length, barC = v.length;
      for (var h = 0; h < barC; h++) {
        for (var i = 0; i < iL; i++) {
          if (v[h][i] == "") continue;
          v[h][i] = parseFloat(v[h][i]);
          var dt = v[h][i];
          if (minDt > dt) minDt = dt;
          if (maxDt < dt) maxDt = dt;
        }
      }
      if (fullDraw) {
        if (!this.scaleChangedByUser) {//auto scale m.scaleChange
          var cvv = Math.abs(maxDt), s;
          if (cvv <= 0.1) s = GanttScale.onePercent;
          else if (cvv <= 1) s = GanttScale.oneTenth;
          else if (cvv <= 10) s = GanttScale.one;
          else if (cvv <= 100) s = GanttScale.ten;
          else if (cvv <= 1000) s = GanttScale.hundred;
          else if (cvv <= 10000) s = GanttScale.thousand;
          else s = GanttScale.tenThousand;
          m.scale = s;
        }
        minDt = m.getBeginValByScale(minDt, m.scale), maxDt = m.getEndValByScale(maxDt, m.scale);
        m.minDateT = minDt; m.maxDateT = maxDt;
      } else {
        minDt = m.minDateT; maxDt = m.maxDateT;
      }
      var msecPU = m.msecPerUnit(m.scale), pxPU = m.pixelsPerUnit(m.scale), msecPX = msecPU / pxPU;
      var ttlwdt = (maxDt - minDt) / msecPX, colWdt = ttlwdt, mxColWDt = GJT.getWindowWidth() * 3 / 5;
      m.totalWidthPx = ttlwdt;
      var td, vpwu = m.viewPortWidthUser, shwTxt = m.displayText && vPty, cnP = m.classBarPlan;
      if (vpwu && vpwu > mxColWDt) mxColWDt = vpwu; //如果使用者有設定寬度,新寬度超過使用者設定的要以使用者設定
      if (colWdt > mxColWDt) colWdt = mxColWDt;
      m.viewPortWidth = colWdt;
      m.showCtrlBox(); m.rvsScrollRatio(colWdt);
      for (var i = 0; i < iL; i++) {
        td = trs[i].cells[idxC];
        td.style.position = "relative";
        var dvp;
        if (td.children.length == 0) {
          td.style.borderBottom = "1px none white";
          dvp = addE("<div style='overflow:hidden;' />", td);
          td = addE("<div style='overflow:visible;' />", dvp); //需要使用兩層,第一層是為了設定scrollLeft 來整齊對應bar位置
        } else { dvp = td.children[0]; td = dvp.children[0]; }
        setActWdt(dvp, colWdt);
        setActWdt(td, ttlwdt);
        var chn = td.children, mrgn, wdt, bar0, bar1;
        while (chn.length < barC) { td.appendChild(newEm("div")); };
        for (var h = 0; h < barC; h++) {
          var vt = v[h][i];
          if (vt >= 0) {
            mrgn = (-minDt) / msecPX; //以0為對齊基準,如果所有數值都大於零則minDt會為0,否則會是負值
            wdt = vt / msecPX;
          } else {
            mrgn = (vt - minDt) / msecPX;
            wdt = -vt / msecPX;
          }
          var bar0 = chn[h];
          bar0.style.marginLeft = toPx(mrgn);
          bar0.style.width = toPx(wdt);
          bar0.className = cnP;
          bar0.title = (vPty ? vPty[0][i] + " " : "") + vt;
          showIt(bar0);
          bar0.innerText = shwTxt ? vPty[0][i] : "";
        }
      }
      if (fullDraw) m.drawTitle(colWdt, ttlwdt);
      m.chgViewPortWidth(0);
    }
    po.drawGantt = function (trs) {
      var m = this, fc = m.fldCanvas, ge = m.ge, idxC = -1, vPty, ptyF = m.propertiesFields;
      ge.addField(fc, "", "", GDT.String, GIA.Virtual | GIA.SaveDenied | GIA.WriteDenied, 1, 1);
      idxC = ge.getCellIndex(fc);
      if (idxC <= 0) return;
      var fullDraw = false, minTi, maxTi;
      if (!trs) { trs = ge.getAllDataRows(); fullDraw = true; }
      if (ptyF) vPty = ge.getFieldsValues(ptyF, trs, null, 1, 0, 1);
      m.titleContainer = ge.grid.rows[0].cells[idxC];
      if (m.numberFields) return m.drawGanttNum(trs, fullDraw, idxC, vPty);

      var flds = [m.fldPlanStart, m.fldPlanFinish, m.fldActualStart, m.fldActualFinish], xds = m.showExtraBar ? m.extraDates : null, xdx, hideExtBar = true;
      if (xds) {
        xdx = [];
        for (var i = 0; i < xds.length; i++) {
          flds.push(xds[i][0], xds[i][1]);
          xdx[4 + i * 2] = xds[i][2];//先把項目文字快取到對應的陣列
          hideExtBar = false;
        }
      }
      var v = ge.getFieldsValues(flds, trs, null, 1, 0, 1), barC = 2 + (xds ? xds.length : 0), noExtra = barC == 2 || hideExtBar, xu = barC * 2;

      var cnP = m.classBarPlan, cnA = m.classBarActual, cnAD = m.classBarActualDoing;
      var vSP = v[0], vFP = v[1], vSA = v[2], vFA = v[3], minDt = new Date(864000000000000), maxDt = new Date(-864000000000000), iL = trs.length;
      //先取得所有列日期資料,找出最大日期和最小日期,用以決定日期範圍,如果可以找出日期空隙的話就可以讓日期空隙不在畫面上顯示
      var tiBgnWork = m.workTimeStart;//上班時間
      var tiEndWork = m.workTimeEnd;//下班時間
      for (var h = 0; h < v.length; h++) {
        if (!v[h]) continue;
        if (noExtra && h > 3) continue;
        for (var i = 0; i < iL; i++) {
          if (!v[h][i])
          { v[h][i] = Date.parse(v[h][i]); continue; }
          var dt = new Date(v[h][i]);
          if (isNaN(dt)) { v[h][i] = dt; continue; }
          if (dt.getHours() == 0) { dt = new Date(dt.getTime() + ((h % 2) == 0 ? tiBgnWork : tiEndWork)); }//如果是零時 開始日加上上班時間 完成日加上下班時間
          v[h][i] = dt;
          if (minDt.getTime() > dt.getTime()) minDt = dt;
          if (maxDt.getTime() < dt.getTime()) maxDt = dt;
        }
      }
      if (fullDraw) {
        minTi = m.getBeginTimeByScale(minDt.getTime(), m.scale), maxTi = m.getEndTimeByScale(maxDt.getTime(), m.scale);
        m.minDateT = minTi; m.maxDateT = maxTi;
      } else {
        minTi = m.minDateT; maxTi = m.maxDateT;
      }
      var msecPU = m.msecPerUnit(m.scale), pxPU = m.pixelsPerUnit(m.scale), msecPX = msecPU / pxPU;
      var ttlwdt = (maxTi - minTi) / msecPX, colWdt = ttlwdt, mxColWDt = GJT.getWindowWidth() * 3 / 5;
      m.totalWidthPx = ttlwdt;
      var td, vpwu = m.viewPortWidthUser, shwTxt = m.displayText && vPty;
      if (vpwu && vpwu > mxColWDt) mxColWDt = vpwu;//如果使用者有設定寬度,新寬度超過使用者設定的要以使用者設定
      if (colWdt > mxColWDt) colWdt = mxColWDt;
      m.viewPortWidth = colWdt;
      m.showCtrlBox(); m.rvsScrollRatio(colWdt);

      for (var i = 0; i < iL; i++) {
        td = trs[i].cells[idxC];
        td.style.backgroundColor = "transparent";
        td.style.position = "relative";
        var dvp;
        if (td.children.length == 0) {
          td.style.borderBottom = "1px none white";
          dvp = addE("<div style='overflow:hidden;' />", td);
          td = addE("<div style='overflow:visible;' />", dvp);//需要使用兩層,第一層是為了設定scrollLeft 來整齊對應bar位置
        } else { dvp = td.children[0]; td = dvp.children[0]; }
        setActWdt(dvp, colWdt);
        setActWdt(td, ttlwdt);
        var chn = td.children, mrgn, wdt, bar0, bar1;
        while (chn.length < barC) { td.appendChild(newEm("div")); };
        if (hideExtBar) { for (var hx = barC; hx < chn.length; hx++) { hideIt(chn[hx]); } }
        bar0 = chn[0]; bar1 = chn[1];
        if (!vSP || !vFP || (isNaN(vSP[i]) && isNaN(vFP[i]))) hideIt(bar0); //開始日 完成日都空的無法畫
        else {
          if (isNaN(vSP[i])) vSP[i] = new Date();//如果計畫開始日空白,就以當下時間當成開始日
          else if (isNaN(vFP[i])) vFP[i] = new Date();
          wdt = (vFP[i].getTime() - vSP[i].getTime()) / msecPX;
          mrgn = (vSP[i].getTime() - minTi) / msecPX;
          if (wdt < 1) wdt = 1;
          bar0.style.marginLeft = toPx(mrgn);
          bar0.style.width = toPx(wdt);
          bar0.className = cnP;
          bar0.title = (vPty ? (vPty[0][i] + " " + (vPty[1] ? vPty[1][i] : " ")) : "") + vSP[i].format("yyyy/MM/dd hh:mm:ss") + " - " + vFP[i].format("yyyy/MM/dd hh:mm:ss");
          showIt(bar0);
          bar0.innerText = shwTxt ? vPty[0][i] : "";
        }
        if (!vSA || !vFA || (isNaN(vSA[i]) && isNaN(vFA[i]))) hideIt(chn[1]);
        else {
          var isNotDone = 0;
          if (isNaN(vSA[i])) vSA[i] = new Date();//如果實際開始日空白,就以當下時間當成開始日
          else if (isNaN(vFA[i])) { vFA[i] = new Date(); isNotDone = true; }
          wdt = (vFA[i].getTime() - vSA[i].getTime()) / msecPX;
          mrgn = (vSA[i].getTime() - minTi) / msecPX;
          bar1.style.marginLeft = toPx(mrgn);
          if (wdt < 1) wdt = 1;//最少顯示1個pixel
          bar1.style.width = toPx(wdt);
          bar1.className = isNotDone ? cnAD : cnA;
          bar1.title = (vPty ? vPty[0][i] + " " : "") + vSA[i].format("yyyy/MM/dd hh:mm:ss") + " - " + vFA[i].format("yyyy/MM/dd hh:mm:ss");
          showIt(bar1);
        }
        if (noExtra) continue;
        for (var j = 4; j < xu; j += 2) {
          var bar3 = chn[j / 2], vS = v[j], vF = v[j + 1];
          if (!m.showExtraBar || !vS || !vF || !vS[i] || !vF[i]) hideIt(bar3); //開始日 完成日任一為空的不畫
          else {
            wdt = (vF[i].getTime() - vS[i].getTime()) / msecPX;
            mrgn = (vS[i].getTime() - minTi) / msecPX;
            if (wdt < 1) wdt = 1;
            bar3.style.marginLeft = toPx(mrgn);
            bar3.style.width = toPx(wdt);
            bar3.className = "ganttBarOther";
            bar3.title = (vPty ? vPty[0][i] + " " : "") + vS[i].format("yyyy/MM/dd hh:mm:ss") + " - " + vF[i].format("yyyy/MM/dd hh:mm:ss") + " " + xdx[j];
            showIt(bar3);
          }
        }
      }
      if (fullDraw) m.drawTitle(colWdt, ttlwdt);
      if (fullDraw) m.drawBarLinker(); else m.reviseBarLinkers();
      m.chgViewPortWidth(0);
    }
    po.setCalendar = function (calendar) {
      this.calendar = calendar;
      //不可以呼叫 this.drawGantt();
    }
    po.evtAftQuery = function (evtType, Prm) {
      var m = this;
      if ("aftQueryDone" == evtType) return m.drawGantt();
      else if ("aftChangeValue" == evtType) {
        var itm = Prm[2], nm = itm.name ? itm.name : itm;
        if (itm.fieldName) nm = itm.fieldName;
        if (nm == m.fldPlanStart || nm == m.fldPlanFinish || nm == m.fldActualStart || nm == m.fldActualFinish)
          return m.drawGantt([Prm[1]]);
        if (nm == m.fldPreiousTask)
          return m.drawBarLinker();

      } else if ("aftSort" == evtType || "aftInsertRows" == evtType || "aftRemoveRows" == evtType || "aftDelete" == evtType || "aftMoveRows" == evtType) {
        m.reviseBarLinkers();
      }
    }
    po.setDateFields = function (fldPlanStart, fldPlanFinish, fldActualStart, fldActualFinish, fldWorkDays) {
      var m = this;
      m.fldPlanStart = fldPlanStart; m.fldPlanFinish = fldPlanFinish; //計畫日期欄位
      m.fldActualStart = fldActualStart; m.fldActualFinish = fldActualFinish; //實際日期欄位
      m.fldWorkDays = fldWorkDays; //工作天數欄位
    }
    po.setNumberFields = function (fieldNames) {
      if (!fieldNames instanceof Array) fieldNames = [fieldNames];
      this.numberFields = fieldNames;
      this.scale = GanttScale.oneTenth;
    }
    po.addExtraDateFields = function (fldStart, fldFinish, text) {
      var m = this, c = m.extraDates;
      if (!c) { c = []; m.extraDates = c; }
      c.push([fldStart, fldFinish, text]);
    }
    po.setPropertiesFields = function (ptyFields) {
      if (!ptyFields instanceof Array) ptyFields = [ptyFields];
      this.propertiesFields = ptyFields; //希望呈現在bar上面的內容欄位,可以多個
    }
    po.setPreviousTaskIdsField = function (fldNameMain, fldNamePre, fldNameProj) {
      this.fldTaskTypeId = fldNameMain;
      this.fldPreiousTask = fldNamePre;
      this.fldProjectId = fldNameProj
    }
    po.chgViewPortWidth = function (ty, incr) {//把所有gantt bar欄位內的第一層DIV 的scrollLeft設定成和控制的scrollbar的scrollLeft一樣
      var m = this, sbr = m.scrollBar; if (!sbr) return;
      var sbL = sbr.scrollLeft, rws = ge.grid.rows, c = ge.getCellIndex(m.fldCanvas), rL = rws.length, bknl, stdWdt;
      sbL = sbL * m.scrollRatio;
      if (c < 0) return;
      bknl = m.backPanel;
      if (ty == 1) sbr.style.visibility = "hidden";
      else sbr.style.visibility = "visible";
      if (ty == 3) {
        if (m.viewPortWidthUser == null) m.viewPortWidthUser = m.viewPortWidth;
        stdWdt = m.viewPortWidthUser + incr;
        if (stdWdt < 3) stdWdt = 3;//最小3px
        m.viewPortWidthUser = stdWdt;
        m.rvsScrollRatio(stdWdt);
      }
      if (bknl) {
        var dv = bknl;
        if (ty == 0) dv.scrollLeft = sbL;
        else if (ty == 1) {//最大化
          dv.oriWdt = dv.style.width;
          setActWdt(dv, m.totalWidthPx);
        } else if (ty == 2) {//還原寬度
          dv.style.width = dv.oriWdt;
        } else if (ty == 3) {
          setActWdt(dv, stdWdt);
        }
      }
      for (var r = 0; r < rL; r++) {
        var td = rws[r].cells[c];
        var dv = td.children[0];
        if (!dv) continue;
        if (ty == 0) dv.scrollLeft = sbL;
        else if (ty == 1) {//最大化
          dv.oriWdt = dv.style.width;
          setActWdt(dv, m.totalWidthPx);
        } else if (ty == 2) {//還原寬度
          dv.style.width = dv.oriWdt;
        } else if (ty == 3) {
          setActWdt(dv, stdWdt);
        }
      }

      if (ty == 1) sbr.scrollLeft = 0;
      m.rvsFloatTitle();
    }
    po.rvsFloatTitle = function (forceRvs) {
      var m = this, ge = m.ge, dv = getEmByClass(m.titleContainer, "ganttTitle");
      var fb = ge._ftb;
      if (!fb) return;
      var dv2 = getEmByClass(fb, "ganttTitle");
      if (!dv2) ge.floatHeader(fb);
      else if (forceRvs) ge.floatHeader(fb);
      dv2 = getEmByClass(fb, "ganttTitle");
      if (!dv2) return;
      dv2.style.width = dv.style.width;
      dv2.scrollLeft = dv.scrollLeft;
    }
    po.getDragMode = function (x, o, ev) {
      if (!this.allowDragBar || !this.allowDragBarUser) return 0;
      if (o.className != "ganttBarPlan") return 0;
      //如果O 所屬的表格不同 或是 cellIndex不同,表示是其他甘特圖物件的事件
      var td = getTD(o), tb = getTable(td);
      if (td.cellIndex != this.titleContainer.cellIndex || tb != this.ge.grid) return 0;
      var x = evtOffsetX(ev);
      var w = o.offsetWidth;
      if (x < 10 && w > 20) return 2;
      else if (x > w - 10 && w > 30) return 3;
      else return 1;
    }
    po.setDateByDrag = function (o, dm, x) {
      //找出o所屬的TR
      var m = this, ge = m.ge, tr = getTR(o), s = m.scale;
      if (m.numberFields) return;
      var v = ge.getFieldsValues([m.fldPlanStart, m.fldPlanFinish, m.fldWorkDays], [tr], null, 1, 0, 1);//m.fldWorkDays
      if (dm == 1) {//工期不變,改變計畫完成日
        var nv = new Date(v[1][0]);
        if (isNaN(nv)) return;
        nv = new Date(nv.getTime() + x);
        if (s == GanttScale.hour2 || s == GanttScale.hour6) nv = nv.format("yyyy/MM/dd hh:mm:ss"); else nv = nv.format("yyyy/MM/dd");
        ge.setFieldValue(m.fldPlanFinish, nv, tr);
        //po.setFieldValue = function (fldName, val, tarRow, bNoEditLog, bNoEvent, isPrimalVal, isHTML, isSetByCode)
      }
      else if (dm == 2) {
        var nv = new Date(v[0][0]), wds;
        if (isNaN(nv)) return;
        nv = new Date(nv.getTime() + x);
        //計算新的工期
        if (m.calendar && m.fldWorkDays) {
          wds = m.calendar.getWorkDays(nv, new Date(v[1][0]));
          ge.setFieldValue(m.fldWorkDays, wds, tr, 1, 1);
        }
        if (s == GanttScale.hour2 || s == GanttScale.hour6) nv = nv.format("yyyy/MM/dd hh:mm:ss"); else nv = nv.format("yyyy/MM/dd");
        ge.setFieldValue(m.fldPlanStart, nv, tr, 0, 1);
      }
      else if (dm == 3) {
        var nv = new Date(v[1][0]);
        if (isNaN(nv)) return;
        nv = new Date(nv.getTime() + x);
        if (m.calendar && m.fldWorkDays) {
          wds = m.calendar.getWorkDays(new Date(v[0][0]), nv);
          ge.setFieldValue(m.fldWorkDays, wds, tr, 1, 1);
        }
        if (s == GanttScale.hour2 || s == GanttScale.hour6) nv = nv.format("yyyy/MM/dd hh:mm:ss"); else nv = nv.format("yyyy/MM/dd");
        ge.setFieldValue(m.fldPlanFinish, nv, tr, 0, 1);
      }
    }
    po.evtForDragBar = function () {
      var ev = GJT.event(); if (!ev) return;
      var m = this, o = GJT.eventSrc(), ty = ev.type;
      if (ty == "mousedown") {
        var dm = m.getDragMode(x, o, ev); if (!dm) return;
        if (!GJT.isLeftButton()) return;
        m.xB = ev.clientX; m.yB = ev.clientY; GJT.isDraging = 1;
        m.barDraging = o, m.dragMode = dm;
      } else if (ty == "mousemove") {
        if (GJT.isButtonDownLeft()) {
          //draging
          var dm = m.dragMode; if (!dm) return;
          var x = ev.clientX - m.xB, dbr = m.barHintDrag, bd = m.barDraging;
          if (Math.abs(x) > 1) {
            if (!dbr) { dbr = addE("<div class='ganttBarHintDrag'></div>"); m.barHintDrag = dbr; };
            setActHgt(dbr, bd.offsetHeight);
            showIt(dbr);
            var uw = m.pixelsPerUnit(), bdw = bd.offsetWidth;
            x = parseInt(x / uw, 10) * uw;
            if (dm == 1) {//move
              setActWdt(dbr, bdw);
              matchLoc(dbr, m.barDraging, x, 0);
            } else if (dm == 3) {
              if ((bdw + x) < uw) return;
              setActWdt(dbr, bdw + x);
              matchLoc(dbr, m.barDraging, 0, 0);
            } else if (dm == 2) {
              if ((bdw - x) < uw) return;
              setActWdt(dbr, bdw - x);
              matchLoc(dbr, m.barDraging, x, 0);
            }
          } else {
            hideIt(dbr);
          }
        } else {
          var dm = m.getDragMode(x, o, ev);//if(!dm)return;
          var csc = "";
          if (dm == 2) csc = "w-resize";
          else if (dm == 3) csc = "e-resize";
          else if (dm == 1) csc = "move";
          o.style.cursor = csc;
        }
      } else if (ty == "mouseup") {
        var dm = m.dragMode;
        if (m.xB == null || dm == null) return;
        if (m.barDraging) GJT.isDraging = 0;
        hideIt(m.barHintDrag);
        var uw = m.pixelsPerUnit();
        var x = parseInt((ev.clientX - m.xB) / uw, 10) * m.msecPerUnit(m.scale);
        m.setDateByDrag(m.barDraging, dm, x);
        delete m.xB; delete m.yB; delete m.barDraging; delete m.dragMode;
      } else if (ty == "selectstart") {
        if (GJT.isDraging) cmnEvtSetReturn(false);
      }
    }
    po.evtHnd0 = function () {
      var ev = GJT.event(); if (!ev) return;
      var m = this, o = GJT.eventSrc(), ty = ev.type;
      if (ty == "scroll") {
        if (o == m.scrollBar) m.chgViewPortWidth(0);
      } else if (ty == "click") {
        var cn = o.className;
        if (cn == "WidthSW" || cn == "WidthAdj") {
          var md = getAtr(o, "mode");
          if (md == "0") m.switchMaximized();
          else if (md == "1") m.viewPortWidthIncrease(20);
          else if (md == "2") m.viewPortWidthIncrease(-20);
        }
        else if (cn == "ZoomIn") m.scaleIncrease(-1);
        else if (cn == "ZoomOut") m.scaleIncrease(1);
        else if (cn == "UWidthAdjP") m.unitWidthIncrease(1);
        else if (cn == "UWidthAdjM") m.unitWidthIncrease(-1);
        else if (cn == "FontAdjP") m.fontSizeIncrease(8);
        else if (cn == "FontAdjM") m.fontSizeIncrease(-8);
        else if (cn == "swLinesDsp") { m.switchLinesDsp(); o.innerText = m.displayLinker ? "Line off" : "Line on" }
        else if (cn == "swTextDsp") { m.switchTextDsp(); o.innerText = m.displayText ? "Text off" : "Text on" }
        else if (cn == "printPre") m.printPrepare();
        else if (cn == "printPreA") m.printPrepare(1);
        else if (cn == "dragBarSW") { m.allowDragBarUser = !m.allowDragBarUser; MenuHide(); }
        else if (cn == "extraBarSW") { m.showExtraBar = !m.showExtraBar; MenuHide(); m.drawGantt(); }
      }
    }
    po.printPrepare = function (whl) {
      var m = this, ge = m.ge, r = ge.rowBeginData() - 1; if (r == 0) return;
      var tr = ge.grid.rows[r], oriDsp = tr.style.display, isMax = m.isMaximized;
      hideIt(tr);//hide qry area
      if (whl && !isMax) { m.switchMaximized(); }
      m.matchBackPanel();
      m.reviseBarLinkers();
      var ndoc = tlSetPrintOneTable(ge), nbdy = ndoc.body;
      var ngd = nbdy.children[0], nbkn = nbdy.children[1], idxC = m.titleContainer.cellIndex;
      window.setTimeout(function () { matchLoc(nbkn, ngd.rows[0].cells[idxC].children[0], 0, 0, 1); }, 50);
      tr.style.display = oriDsp;
      if (whl) {
        if (isMax) m.chgViewPortWidth(2);
      }
      if (whl && !isMax) { m.switchMaximized(); }
      m.matchBackPanel();
      m.reviseBarLinkers();
    }
    po.switchLinesDsp = function () {
      var m = this, lnkrs = m.barLinkersPre;
      m.displayLinker = !m.displayLinker;
      var vis = m.displayLinker;
      if (lnkrs) lnkrs.setVisible(vis);//.drawLinkers();
      else m.drawGantt();
    }
    po.switchTextDsp = function () {
      this.displayText = !this.displayText;
      this.drawGantt();
    }
    po.unitWidthIncrease = function (incr) {
      var m = this;
      m.unitWdtAdjValue = m.unitWdtAdjValue + incr;
      m.drawGantt();
    }
    po.fontSizeIncrease = function (incr) {
      var m = this, oriRt = m.fontRatio, dv = getEmByClass(m.titleContainer, "ganttTitle");
      if (!oriRt) { oriRt = parseFloat(GJT.getComputedStyle(dv).fontSize, 10) / parseFloat(GJT.getComputedStyle(BDY()).fontSize, 10) * 100; }
      oriRt += incr;
      if (oriRt < 2) oriRt = 2;
      m.fontRatio = oriRt;
      dv.style.fontSize = oriRt + "%";
    }
    po.switchMaximized = function () {
      var m = this; m.isMaximized = !m.isMaximized;
      m.chgViewPortWidth(m.isMaximized ? 1 : 2);
    }
    po.viewPortWidthIncrease = function (incr) {
      this.chgViewPortWidth(3, incr);
    }
    po.evtHnd = function () {
      var ev = GJT.event(); if (!ev) return;
      var m = this, o = GJT.eventSrc(), ty = ev.type;
      if (ty == "scroll") {
        if (o == ge.gridContainer) {
          m.cntr.scrollTop = ge.gridContainer.scrollTop;
        } else if (o == m.cntr) {
          ge.gridContainer.scrollTop = m.cntr.scrollTop;
          window.setTimeout(function () { m.cntr.scrollTop = ge.gridContainer.scrollTop; }, 100);
        }
      }
    }
    po.opSet = function () {//秀出功能表
      MenuHide();
      var m = this, kk = "<div style='display:inline-block;width:50%;' class=", h = ["<div class='ganttMenu'>"
      , "<div width='100%'>" + kk + "'ZoomIn' title='Zoom In' ></div>"
      , "" + kk + "'ZoomOut'title='Zoom Out' ></div></div>"
      , "<div class='WidthAdjB'>" + kk + "'WidthAdj' mode='1' title='Enlarge chart area Width'>|&lt; &gt;|</div>" // ||<- ->|| //▕←□→▏
      , kk + "'WidthAdj' mode='2' title='Reduce chart area Width'>&gt;| |&lt;</div></div>" // ||<- ->|| //▕←□→▏
      , "<div width='100%' class='UWidthAdj'>" + kk + "'UWidthAdjP' title='enlarge scale width of a time unit'>|&lt; &gt;|</div>"// |<- ->| //▕← →▏
      , kk + "'UWidthAdjM' title='reduce scale width of a time unit'>&gt;| |&lt;</div></div>"// ->| |<- //→▏▕←
      , "<div width='100%'>" + kk + "'FontAdjP' title='reduce scale width of font of title'></div>"
      , kk + "'FontAdjM' title='reduce scale width of font of title'></div></div>"
      , "<div width='100%'>" + kk + "'swLinesDsp' title='Switch link lines Display'>" + (m.displayLinker ? "Line off" : "Line on") + "</div>"
      , kk + "'swTextDsp' title='Switch bar text display'>" + (m.displayText ? "Text off" : "Text on") + "</div></div>"
      , "<div class='WidthSW' mode='0' title='Maxmize/Restore chart area Width'>||&lt; &gt;||</div>" // ||<- ->|| //▕←□→▏
      , "<div width='100%'>" + kk + "'printPre' title='Prepare to print'>Print</div>" + kk + "'printPreA' title='Prepare to print all chart'>Print All</div></div>"
      , "<div class='dragBarSW' title='Enable/Disable draging bar to change schedule'>" + (m.allowDragBarUser ? "Disable" : "Enable") + " draging bar</div>"
      , (m.extraDates ? ("<div class='extraBarSW' title='Enable/Disable extra bar to be showed'>" + (m.showExtraBar ? "Hide" : "Show") + " extra bar</div>") : "")
      , "</div>"];
      var c = addE(h.join(""));
      c.id = KW.PopupMenu;
      setEvtHandleAll(c, function () { m.evt2(); GJT.stopBubble(); });
      MenuShowDo(c);
    }
    po.rvsScrollRatio = function (colWdt) {
      var m = this;
      m.scrollRatio = colWdt / m.scrollBar.clientWidth;
      setActWdt(m.scrollBar.children[0], m.totalWidthPx / m.scrollRatio);
    }
    po.showCtrlBox = function () {
      var m = this; if (m.scrollBar) return;
      var c = addE("<div class='ganttCtrlBox'><div class='gntSetting'></div><div class='GEGNTBAR' style='overflow-x:auto;overflow-y:hidden;height:20px;width:240px;display:inline-block;' ><div style='height:5px;' /></div></div>");
      c.title = "setting for " + m.text;
      var d = getEmByClass(c, "GEGNTBAR");
      setEvtHandleAll(d, m.evt2);
      d.onscroll = m.evt2;
      m.scrollBar = d;
      d = getEmByClass(c, "gntSetting");
      d.onclick = function () { m.opSet.call(m); };
      var ge = m.ge, cnr = (isHidden(ge.StatusBar)) ? ge.ToolBar : ge.StatusBar;
      cnr.appendChild(c);
    }
    po.setAllowDragBar = function (allow) {//設定是否允許使用者拖曳bar來調整日期
      var m = this, er = m.er4DBR;
      m.allowDragBar = allow;
      m.allowDragBarUser = allow;
      if (allow) {
        if (er) return;
        er = function () { m.evtForDragBar.call(m); }; m.er4DBR = er;
        GJT.eventAddHandle(teHtm(), "mousemove,mousedown,mouseup,selectstart", er, 1);
      } else if (er) {
        GJT.eventRemoveHandle(teHtm(), "mousemove,mousedown,mouseup,selectstart", er, 1);
      }
    }
    TableGanttBuilder._initialized == true;
  }
  var m = this; m.ge = ge; m.name = name; m.text = text;
  m.scrollLeft = 0;
  m.classBarPlan = "ganttBarPlan";
  m.classBarActual = "ganttBarActual";
  m.classBarActualDoing = "ganttBarActualDoing";
  m.pixelsPerHour = 10; //每一小時的寬度
  m.pixelsPerDay = 10; //每一天的寬度
  m.pixelsPerWeek = 60; //每一周的寬度
  m.scale = GanttScale.day1;//預設使用一天為最小刻度單位
  m.workTimeStart = 28800000;//08:00:00 預設上班開始時間
  m.workTimeEnd = 63000000;//17:30:00 預設下班時間
  m.isMaximized = 0; m.setAllowDragBar(1);
  m.unitWdtAdjValue = 0;
  m.displayLinker = true; m.displayText = false;
  m.showExtraBar = false;//如果有設定額外的bar,預設不顯示,由使用者自己決定是否顯示
  m.dayNames = ["日", "一", "二", "三", "四", "五", "六"];
  var erh = function (evtType, Prm) { m.evtAftQuery.call(m, evtType, Prm); };
  ge.evtListenerAdd("aftQueryDone,aftChangeValue,aftSort,aftInsertRows,aftRemoveRows,aftDelete,aftMoveRows", erh);
  try {//多語系
    var wdn = i18nm.weekDays;
    m.dayNames = [wdn.d0.text, wdn.d1.text, wdn.d2.text, wdn.d3.text, wdn.d4.text, wdn.d5.text, wdn.d6.text];
  } catch (ex) {
  }
  //年 月的天數不固定,無法用固定寬度畫出
  m.fldCanvas = canvasColumn; //畫甘特圖的欄位,如果沒有指定,
  if (!this.fldCanvas) {//沒有指定甘特圖欄位就表示要使用分隔式的獨立圖表
    var cn = newEm("div"), st = cn.style;
    st.backgroundColor = "white"; st.overflow = "auto";
    ge.addGridNeighbor(cn);
    m.cntr = cn;
    m.tbl = addE("<table cellspacing='0' border='0'><thead><tr><td></td></tr></thead><tbody></tbody></table>", cn);
    m.tbl.className = ge.grid.className;
    m.tbl.style.tableLayout = "fixed";
    var er = function () { m.evtHnd.call(m); }
    GJT.eventAddHandle(cn, "mousemove,mouseup,selectstart,mousedown,scroll", er);
    GJT.eventAddHandle(ge.gridContainer, "mousemove,mouseup,selectstart,mousedown,scroll", er);
  } else {
    var er = function () { m.evtHnd0.call(m); };
    m.evt2 = er;
  }
}
// **** end gantt builder

//**** begin GEMDMerger GridEdit Master Detail Merger 合併主從表格成為單一可維護資料的表格
//本class的目的,提供master - detail 表格在同一個gridedit上同時維護的介面,主要概念是在master查詢資料之後,立即收集所有pk值當成detail查詢依據(detail表的foreign fields)
function GEMDMerger(mainGE, detailGE, titleFields, valueField, fkFieldsD, fkFieldsM) { //mainGE 主表格, detailGE 從表格, fkFieldsD 從表格對主表格的foreign key fields, titleFields 從表格要顯示在主表格上的欄位標題
  if (GEMDMerger._initialized == undefined) {
    var po = GEMDMerger.prototype;
    po.aftQryM = function (evtType, Prm) {
      var g = this.MGE;
      if ("aftQueryDone" == evtType) return this.combineMD1(); //aftQueryDone,aftChangeValue
      if ("aftChangeValue" == evtType) return this.aftChangeValM(Prm);
      if ("BeforeSave" == evtType) return this.prcsSaveDataM(Prm);
    }
    po.aftQryD = function (evtType, Prm) {
      var g = this.DGE;
      if ("aftQueryDone" == evtType) return this.combineMD2();
    }
    po.combineMD1 = function () {
      //收集所有Mast的PKV
      var m = this, mg = m.MGE, dg = m.DGE, tarR = m.tarRela; //, vpk = mg.getFieldValues(mpkf, -1, 1);
      //轉查詢detail,先檢查有沒有mast detail之間的關聯設定,如果有就直接使用關聯設定展開,如果沒有的話,就使用 MGE的PKF 和this.fkfD 動態設定一個關聯,再用關聯展開,這樣子應用上比較有彈性
      if (!tarR) {
        var rls = mg.relaF;
        if (rls && (!m.fkfD)) {//沒有設定連結的外部欄位時,嘗試從現有的關聯設定找
          for (var i = 0; i < rls.length; i++) {
            if (rls[i].to == dg && !hasBit(rls[i].linkMode, GLC.Disabled)) { tarR = rls[i]; m.fkfD = tarR.toFields.getNames(","); m.fkfM = tarR.fromFields.getNames(","); }
          }
        }
        if (!tarR) {
          tarR = new opRela(); tarR.linkMode = 0; tarR.from = mg; tarR.to = dg;
          if (!m.fkfM) m.fkfM = mg.fieldsKey.getNames(","); //沒有指定mast的關聯欄位時就用PK
          tarR.fromFields = mg.fieldsAll.collect(m.fkfM);
          tarR.toFields = dg.fieldsAll.collect(m.fkfD);
        }
        m.tarRela = tarR;
        if (!m.fkfD) return alert("Foreign link fields not specified!");
      }
      if (!m.fkfD) return;
      var surTRs = mg.getAllDataRows();
      if (surTRs.length == 0) {
        var dgId = dg.id + "_"; //清除所有以此開頭的欄位
        var itmsA = mg.fieldsAll, oriL = itmsA.length, itmsShw = mg.getFields(), oriNms = itmsShw.getNames(",");
        for (var i = 0; i < itmsA.length; i++) {
          var itm = itmsA[i];
          if (itm.name.indexOf(dgId) == 0) { itmsShw.remove(itm.name); itmsA.remove(i); i--; }
        }
        var newNms = itmsShw.getNames(",");
        if (newNms != oriNms) { mg.arrangeColumns(newNms, 0); }
      }
      teExpandQryDo(tarR, 0, surTRs);//這裡一定要觸發查詢才能清除快取關聯查詢的條件,否則關聯查詢不會動作
    }
    po.combineMD2 = function () {//進行合併
      //先找出Mast 連結欄位的值,再收集detail的 對應連結欄位 + PK + 標題 + 編輯項目 的欄位值 + "," + m.tfD + "," + m.vfD fldNames, tarTRs, fieldDelimiter, bSeparateField, getRealV,
      var m = this, mg = m.MGE, dg = m.DGE, trsM = mg.getAllDataRows(), trsD = dg.getAllDataRows();
      var dkf = dg.fieldsKey.getNames(",");
      var vkM = mg.getFieldsValuesR(m.fkfM, trsM, null, 1), vkD = dg.getFieldsValuesR(dkf, trsD, null, 1), vfkD = dg.getFieldsValuesR(m.fkfD, trsD, null, 1), vtD = dg.getFieldsValuesR(m.tfD, trsD, null, 1), vvD = dg.getFieldsValuesR(m.vfD, trsD, null, 1);
      var dictMkVsDK = {}; //紀錄主索引和明細索引對應(依照vfkD值)
      //建立主表列索引
      var xR = {}, iL = trsM.length, jL = vkM.length, dlmr = ",", dgId = dg.id + "_";
      for (var i = 0; i < iL; i++) {
        var myK = vkM[0][i];
        for (var j = 1; j < jL; j++) { myK += dlmr + vkM[j][i]; }
        xR[myK] = i;
      }
      //整理出標題欄位:
      var iL = trsD.length, jL = vfkD.length, tL = vtD.length, vL = vvD.length, kL = vkD.length;
      var itmsH = new OpItems(), tarDType = GDT.String, opcfg = GIA.Virtual | GIA.SaveDenied | GIA.QueryDenied;
      if (vvD.length == 1) { var itm = dg.fieldsAll.collect(m.vfD)[0], tarDType = itm.dataType; opcfg = opcfg | itm.opConfig; } //如果值欄位只有一欄,新虛擬欄位資料型態就要和值欄位相同
      for (var i = 0; i < iL; i++) {
        var myFKD = vfkD[0][i];
        for (var j = 1; j < jL; j++) { myFKD += dlmr + vfkD[j][i]; } //detail key
        var myTitle = vtD[0][i];
        for (var j = 1; j < tL; j++) { myTitle += m.dlmrTitle + vtD[j][i]; } //detail title key
        var myKD = vkD[0][i];
        for (var j = 1; j < kL; j++) { myKD += m.dlmrTitle + vkD[j][i]; } //detail PK

        var itmNm = dgId + myTitle;
        var itmH = itmsH[itmNm];
        if (!itmH) { myTitle = m.headPrefix + myTitle + m.headSuffix; itmH = itmsH.add(new OpItem(itmNm, myTitle, m.headTip, tarDType, opcfg)); itmH.vv0 = []; itmH.vk0 = []; itmH.vTRD = []; };
        var myVal = vvD[0][i];
        for (var j = 1; j < vL; j++) { myVal += m.dlmrValue + vvD[j][i]; };
        var rx = xR[myFKD]; //取得主列位置索引,記住顯示值和PK值
        if (rx != null) { itmH.vv0[rx] = myVal; itmH.vk0[rx] = myFKD; itmH.vTRD[rx] = trsD[i]; } //記住對應的detail TR,供
      }
      //消除已經不存在的欄位:先把fieldsAll 檢查一次,
      var itmsA = mg.fieldsAll, oriL = itmsA.length, itmsShw = mg.getFields(), oriNms = itmsShw.getNames(",");
      for (var i = 0; i < itmsA.length; i++) {
        var itm = itmsA[i];
        if (itm.name.indexOf(dgId) == 0 && !itmsH[itm.name]) { itmsShw.remove(itm.name); itmsA.remove(i); i--; }
      }
      for (var i = 0; i < itmsH.length; i++) {
        var itm = itmsH[i];
        if (!itmsShw[itm.name]) itmsShw.add(itmsH[i]);
        if (!itmsA[itm.name]) itmsA.add(itmsH[i]);
      }
      var newNms = itmsShw.getNames(",");
      if (newNms != oriNms) { mg.arrangeColumns(newNms, 0); }
      //設定值
      for (var i = 0; i < itmsH.length; i++) {
        var itm = itmsH[i], nm = itm.name, cix = mg.getCellIndex(nm), vTRD = itm.vTRD;
        mg.setFieldValuesQ(itm.name, itm.vv0, trsM);
        //把Mast 的TR對應的detail的TR設定到TD的屬性上
        for (var j = 0; j < trsM.length; j++) {
          var tdM = trsM[j].cells[cix]; delete tdM._dtlTR; //先清除
          if (vTRD[j] != null) tdM._dtlTR = vTRD[j];
        }
      }
    }
    po.aftChangeValM = function (Prm) {//[ge, oTR, itm, v, booSetByCode]
      //Prm格式 [ge, oTR, itm, v, booSetByCode]
      var m = this, mg = m.MGE, dg = m.DGE, ge = Prm[0], oTR = Prm[1], itm = Prm[2], v = Prm[3];
      if (ge != mg) return;
      if (itm.name.indexOf(dg.id + "_") < 0) return;
      //找出detail對應的資料列及欄位,設定值
      var cix = mg.getCellIndex(itm.name);
      if (cix < 0) return;
      var trD = oTR.cells[cix]._dtlTR;
      if (!trD) return;
      dg.setFieldValue(m.vfD, v, trD);
    }
    po.prcsSaveDataM = function (Prm) {//"BeforeSave", [m, oaTR, criterion]);
      var m = this, mg = Prm[0], oaTR = Prm[1];
      if (mg != this.MGE) return;
      //找出對應的detail TR 進行存檔
      var dg = m.DGE, itmsShw = mg.getFields(), tarTR = [], trK = {}, hasLogM = 0;
      for (var i = 0; i < itmsShw.length; i++) {
        var nm = itmsShw[i].name;
        if (nm.indexOf(dg.id + "_") < 0) continue;
        var cix = mg.getCellIndex(nm);
        for (var j = 0; j < oaTR.length; j++) {
          if (mg.editLogExist(oaTR[j])) hasLogM = true;
          var trD = oaTR[j].cells[cix]._dtlTR;
          if (!trD) continue;
          if (!dg.editLogExist(trD)) continue;//detail沒有異動
          var ri = trD.rowIndex;
          if (trK[ri] == null) { tarTR.push(trD); trK[ri] = trD; } //檢查有無重複
        }
      }
      if (tarTR.length) dg.saveData(0, tarTR, 0, 1);
      if (!hasLogM) return true; //如果都沒有異動紀錄,就回傳true取消mast的存檔動作
    }
    GEMDMerger._initialized = true;
  }
  var m = this;
  m.MGE = mainGE; m.DGE = detailGE;
  var erM = function (evtType, Prm) { return m.aftQryM.call(m, evtType, Prm); };
  var erD = function (evtType, Prm) { return m.aftQryD.call(m, evtType, Prm); };
  m.MGE.evtListenerAdd("aftQueryDone,aftChangeValue,AfterSave,BeforeSave", erM);
  m.DGE.evtListenerAdd("aftQueryDone,aftChangeValue", erD);
  m.tfD = titleFields; m.vfD = valueField; m.fkfD = fkFieldsD; m.fkfM = fkFieldsM;
  m.dlmrTitle = "//"; //Title欄位多個時的分隔字元
  m.dlmrValue = ",";
  m.headPrefix = "";
  m.headSuffix = "";
  m.headTip = null;
}
//**** end GEMDMerger

//begin DataPanel
//用於將一群原本分散在不同對話框內的內容 集中到一個container內,自動使用TabStrip分頁,關閉時要自動把所有內容自動放回到原來的對話框內
//加入Panel時記住原來的parent以及原來的nextSibling,放回時就可以放到正確的位置上,如果原來的parent的parent已經變成null,就表示原來的容器消滅了
function teDataPanel(container, tabContainer) {
  if (teDataPanel._initialized == undefined) {
    var po = teDataPanel.prototype;
    po.add = function (itm) {
      var m = this, tbc = m._tbc, cntr = m._cntr, cntrT = m._cntrT, setAct;
      if (itm.dlgCtrl) itm = itm.dlgCtrl;
      if (!tbc) {
        tbc = new teTabsCtrl(cntrT, new OpItems(), null, this, null);
        m._tbc = tbc; setAct = 1;
      }
      if (itm.embedInto) {
        itm.embedInto(cntr);
      }
      tbc.add(itm);
      if (setAct) tbc.setActiveItem(itm);
    }
    po.contains = function (itm) {
      var m = this, tbc = m._tbc;
      if (itm.dlgCtrl) itm = itm.dlgCtrl;
      return tbc.contains(itm);
    }
    po.addCompent = function (name, text, uio) {
      var c = new opComponent(uio);
      c.name = name; c.text = text;
      this.add(c);
    }
    po.rejoin = function (disperse) {
      var m = this, cntr = m._cntr, tbc = m._tbc; if (!tbc) return;
      for (var i = 0; i < tbc._items.length; i++) {
        var itm = tbc._items[i];
        if (itm.embedInto) itm.embedInto(m._cntr);
        if (itm.showMe) itm.showMe();
      }
      tbc.refreshUI();
      return true;
    }
    po.disperse = function () {
      var m = this, cntr = m._cntr, tbc = m._tbc; if (!tbc) return;
      for (var i = tbc._items.length - 1; i >= 0; i--) {
        var itm = tbc._items[i];
        tbc.remove(itm);
        if (itm.embedEscape) itm.embedEscape();
      }
      return true;
    }
    po.switchSplitMode = function () { this._tbc.switchSplitMode(); };
    po.remove = function (itm) {
      var m = this, tbc = m._tbc; if (!tbc) return;
      return tbc.remove(itm);
    }
    po.resize = function () { }
    po.hideRoom = function (itm, showIt) { this._tbc.hideRoom(itm, showIt); }
    teDataPanel._initialized = true;
  }
  this._cntr = container;
  this._cntrT = tabContainer; if (!this._cntrT) this._cntrT = this._cntr;
}
//end DataPanel

//Data Revise Request
function teShowRevReqCtrl(tar, cntr, td, cls) {
  var m = tar, bkr = m, ih, p = "dlgRevReq", dg = m[p], bs;
  if (cls) { if (dg) { dg.dg.close(1); }; return; }
  if (dg) ih = isHidden(dg.dg);
  else {
    if (bkr instanceof GridEdit) bkr = new fcioBrokerGE(m);
    dg = new DlgReviseRequest(bkr, cntr);
    if (!dg.createDlg()) return;
    m[p] = dg;
    bs = 1;
  }
  dg.showDlg(); dg.setTarget(td);
  if (bs && dg.dg) {
    dg.dg.fitSize(); ih = 1;
  }
  if (ih) showBesideMouse(dg.dg.dlg);
  return dg;
}
function DlgReviseRequest(ge, cntr) {
  this.ge = ge; this._cntr = cntr; this.headerBC = ge.headerBC;
  this._vtr = {};//virtual tr
  if (DlgReviseRequest._initialized == undefined) {
    var po = DlgReviseRequest.prototype;
    po.createDlg = function () {
      var m = this, ge = m.ge, dg = m.dg, om = m._cntr, fa = ge.getFieldsAll();
      var ifmNm = "xrrq" + Math.random(), x = ["<div class='ReviseRequest'><div id='txtHint' class='objectText'></div>",
      "<div class='reqHistory'><div>", i18nm.Reason4Change.text, "</div><textarea style='clear:left;' class='reason4Chg' size='14'></textarea></div>",
      "<div class='actBar'>",
      "<input type='button' class='selFlow' value='", i18nm.Workflow.text, "' />", ": <span class='currPolicy'></span> <span class='currState' ></span></div>",
      "",
      "<div class='dataTabs'><input type='button' class='SaveReq' value='", i18nm.Save.text, "'/></div>",
      "<div class='dspArea'><div class='dataArea' ></div><div class='fileArea' ></div><div class='fileCOArea' ></div><div class='flowArea'></div></div>",
      "</div>"];
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("");
          dg.handleClose = function () { return dg.showMe(1); }
          dg.handleResize = function (dgo) { return m.hndResized.call(m, dgo); }
          m.dg = dg;
          dg.setBorderColor("#900010");
        }
        dg.setCaption(i18nm.tlReviseRequest.text + "->" + ge.getCaption());
        om = dg.main;
        m._cntr = om;
        dg.showMe();
      }
      om.innerHTML = x.join("");
      m.hintO = GJT.getChildById(om, "txtHint"); //so = newRecForm(fa, BDY(), getNameA(m.grid), m.prcsRecFormEv, lyotxt, m);
      m.actBarO = getEmByClass(om, "actBar");
      m.reqHistoryO = getEmByClass(om, "reqHistory");
      m.dspAreaO = getEmByClass(om, "dspArea");
      m.dataAreaO = getEmByClass(om, "dataArea");
      m.reason4ChgO = getEmByClass(om, "reason4Chg");
      m.fileAreaO = getEmByClass(om, "fileArea");
      m.fileCOAreaO = getEmByClass(om, "fileCOArea");
      m.flowAreaO = getEmByClass(om, "flowArea");
      var evh = function () { m.evtHnd.call(m) };
      GJT.eventAddHandle([m.reqHistoryO, m.actBarO, getEmByClass(om, "dataTabs")], "click,mouseup,mousedown", evh);
      //GJT.eventAddHandle(, "click,mouseup,mousedown", evh);
      var so = newRecForm(fa, m.dataAreaO, ge.getId(), function (evType, itm, f) { m.prcsRecFormEv.call(m, evType, itm, f); }, null, m); //teRecordForm
      m._dataForm = so;
      hideIt(so.moveBar); //控制列不需要
      m.addDataPanel("rec", i18nm.Data.text, m.dataAreaO);
      m.addDataPanel("file", i18nm.CheckinFile.text, m.fileAreaO);
      m.addDataPanel("fileCO", i18nm.CheckoutFile.text, m.fileCOAreaO);
      m.addDataPanel("flow", i18nm.ShowFlowCtrl.text, m.flowAreaO);
      m._dataPannel._tbc.uio.style.overflowY = "hidden";
      m._dataPannel._tbc.switchSplitMode();
      return 1;
    }
    po.prcsRecFormEv = function (evType, itm, f) {
      if (f != this._dataForm) return;
      if (evType == "blur" || evType == "change") { // || evType == "click"
        if (itm.isChanged()) { itm.setColor(null, "#ffccbb"); this._needSave = 1; }
        else itm.setColor(null, "");
      }
    }
    po.showDlg = function () { if (this.dg) this.dg.showMe(); }
    po.setTarget = function (td) {
      var m = this, ge = m.ge;
      if (m.askSave()) return;
      var kv = m.ge.getKey(td), hx = ge.getTextUIKF(td);
      if (isNaN(parseInt(kv, 10))) hx = i18nm.LackKeyValueForAction.text;
      m._kv = kv;
      m._tartdO = td;
      hx = hx ? hx : "Selected";
      m.hintO.innerText = hx;
      m.showValues();
      if (isNaN(parseInt(kv, 10))) return alert(i18nm.LackKeyValueForAction.text);
      m.refreshOpInfo();
      //展現UI
      // if (!(o instanceof Array)) { m.ckoctnO.innerHTML = o.err; return; }
      // txt = ["<table class='DataEdit'><tr class='title'><td>", s1, i18nm.tlFile.text, s2, i18nm.Edition.text, s1, i18nm.NoteText.text, s1, i18nm.CheckinLinkTo.text, s1, "</td></tr>"];
      // txt.push("</table>");
      //if (m.dg && !m._sizeFitted) { m.dg.fitSize(); m._sizeFitted = 1; }
    }
    po.refreshOpInfo = function () {
      var m = this, xp = ["Action", "subact", "tarid", "kv", KW.PrmTimezoneOffset], vp = ["ReviseRequest", "getOpInfo", m.ge.getId(), m._kv, (new Date()).getTimezoneOffset()];
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (!txt) return;
      var o = eval("o=" + txt);
      m._opInfo = o;
      var hs = o.history;
      for (var i = 0; i < hs.length; i++) {
        if (hs[i].uid == o.activeuid) m.showValuesOfRev(hs[i]);
      }
      m.adjButtons();
    }
    po.showValuesOfRev = function (hist) {
      var m = this, dc = GJT.xmlDocument(), t = m._dataForm, itms = t.items, revContent = hist.revContents, revReason = hist.revReason;
      m.reason4ChgO.value = revReason;
      for (var i = 0; i < itms.length; i++) {
        itms[i].resetValue();
        itms[i].setColor(null, "");
      }
      dc.loadXML(revContent);
      var nd = dc.firstChild, nds = nd.childNodes;
      for (var i = 0; i < nds.length; i++) {
        var nm = getAtr(nds[i], "name"), v = getAtr(nds[i], "val"), itm = itms[nm];
        itm.setValue(v, hasBit(itm.item.opConfig, GIA.ValueIsOuterHTML), 1);
        if (itm.isChanged(1)) itm.setColor(null, "#ffccbb");
      }
    }
    po.showValues = function (td) {
      var m = this, ge = m.ge, fa = ge.getFieldsAll();
      var s = ge.getDataForm(), t = m._dataForm, itms = s.items;
      ge.refreshDataForm(td);
      //copy value from s to t
      for (var i = 0; i < itms.length; i++) {
        var f = itms[i], itm = fa[f.name];
        t.showValue(f.name, f.oriV, hasBit(itm.opConfig, GIA.ValueIsOuterHTML));
        t.items[f.name].setColor(null, "");//重置背景色
      }
      t.clearChange();//set original value to current value
      window.setTimeout(function () { showItA(ge.getDataForm(1), 0); }, 1000);
    }
    po.adjButtons = function () {
      var m = this, op = m._opInfo, aro = m.dspAreaO, a = m._cntr, b = getEmByClass(a, "SaveReq"), f = getEmByClass(a, "selFlow"), al = [aro, b, f], dp = m._dataPannel,
      haid = op.activeuid;
      if (!op.registerId) { m.hintO.innerText = op; showItA(al, 0); return alert(op); }
      showItA(al, 1);
      //showItA([c, d], haid);
      showItA(f, op.policies.length > 1); //hide policy select btn if only one policy
      if (!op.activePolicyId) {//set default policy to first one
        op.activePolicyId = op.policies[0].id;
        op.activePolicyText = op.policies[0].text;
      }
      getEmByClass(a, "currPolicy").innerText = op.activePolicyText;
      if (haid) {
        fkCheckin(m, m.fileAreaO);
        fkCheckout(m, m.fileCOAreaO);
        wfShowDlg(m, m.flowAreaO);
      }
      dp.hideRoom("file", haid); dp.hideRoom("fileCO", haid); dp.hideRoom("flow", haid);
      f.disabled = op.activeStateId ? true : false;
      if (op.activeStateId) //showItA(f, 0); //已展開的不可再改流程
        getEmByClass(a, "currState").innerText = i18nm.State.text + " : " + op.activeStateText;
    }
    po.getRevised = function () {
      var m = this, itms = m._dataForm.items, nd, nd2, doc = GJT.xmlDocument();
      nd = doc.appendChild(xEm(doc, "root"));
      for (var i = 0; i < itms.length; i++) {
        var itm = itms[i];
        if (!itm.isChanged(1)) continue;
        nd2 = nd.appendChild(xEm(doc, "nv"))
        setAtr(nd2, "name", itm.name);
        setAtr(nd2, "val", itm.getValue());
      }
      return doc;
    }
    po.saveReq = function () {
      var m = this, doc = m.getRevised(), op = m._opInfo, auid = op.activeuid, ge = m.ge;
      var x = doc2Xml(doc), myReason = m.reason4ChgO.value;
      var xp = ["Action", "subact", "tarid", "kv", KW.PrmTimezoneOffset, "revContent", "policyId", "pageId", "reason4Chg"],
      vp = ["ReviseRequest", "saveReq", ge.getId(), m._kv, (new Date()).getTimezoneOffset(), x, op.activePolicyId, ge.getPageId(), myReason];
      if (auid) { xp.push("atvuid"); vp.push(auid); }
      var txt = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (txt) alert(txt); else { alert("Save done"); m._needSave = 0; }
      m.refreshOpInfo();
    }
    po.CheckInFile = function () { }
    po.FlowCtrl = function () { }
    po.selFlow = function () {
      var m = this, op = m._opInfo, pl = op.policies, itms = new OpItems();
      for (var i = 0; i < pl.length; i++) {
        var p = pl[i];
        itms.add(NIT(p.id, p.text, p.tip));
      }
      itms.onclick = function (a, b) { m.selFlow2.call(m, a, b); }
      SysShowMenu(itms);
    }
    po.selFlow2 = function (itm, itms) {
      var m = this, op = m._opInfo;
      op.activePolicyId = itm.name;
      op.activePolicyText = itm.text;
      getEmByClass(m._cntr, "currPolicy").innerText = op.activePolicyText;
    }
    po.hndResized = function () {//change height of display Area
      var m = this, c = m._cntr, d = m.dspAreaO, xo = m.reason4ChgO, xop = xo.parentElement;
      var rc = c.getBoundingClientRect(), rd = d.getBoundingClientRect();
      var h = rd.top - rc.top;
      d.style.height = toPx(c.clientHeight - h - 2);
      rc = xop.getBoundingClientRect();
      rd = xo.getBoundingClientRect();
      xo.style.width = toPx(xop.clientWidth - (rd.left - rc.left) - 24);
    }
    po.evtHnd = function () {
      var s = GJT.eventSrc(), ty = GJT.event().type;
      MenuHide();
      if (ty != "click") return;
      var m = this, cn = s.className;
      if (cn == "SaveReq") m.saveReq();
      if (cn == "CheckInFile") m.CheckInFile();
      if (cn == "FlowCtrl") m.FlowCtrl();
      if (cn == "selFlow" && !s.disabled) m.selFlow();
    }
    po.addDataPanel = function (name, text, uio) {
      var m = this, c = m._cntr, dp = m._dataPannel, dao = m.dspAreaO;
      if (!dp) { dp = new teDataPanel(dao, getEmByClass(c, "dataTabs")); m._dataPannel = dp; }
      dp.addCompent(name, text, uio); showIt(dao);
    }
    po.askSave = function () {
      var m = this;
      if (m._needSave) {
        if (!window.confirm(i18nm.ShwDataNotSavedAsk.text)) return 1;
      }
    }

    //File Check in outBroker interface
    po.getPageId = function () { return this.ge.getPageId(); }
    po.getId = function () { return this._opInfo.registerId; } //必要方法
    po.getCaption = function () { return i18nm.tlReviseRequest.text + "-" + this.ge.getCaption(); }
    po.mainTR = function () { var m = this; return m._vtr; } //必要方法
    po.getTextUIKF = function (tr) { return i18nm.tlReviseRequest.text; } //代表該row的可識別文字 例如 車種名稱
    po.getDataForm = function (getDlg) { return this.ge.getDataForm(getDlg); }

    po.getKey = function (tr) { if (this._opInfo) return this._opInfo.activeuid; } //必要方法
    po.getFieldsAll = function () { return this.ge.getFieldsAll(); }
    po.hintAnnexIcon = function (otr, shwImg, forceShow) { fkCheckout(this, this.fileCOAreaO); } //this.ge.hintAnnexIcon(otr, shwImg, forceShow);
    po.refreshDataForm = function (td) { } //更新附件anchor return this.ge.refreshRows([this.mainTR()], null, null, 1, 0, 1);

    po.getRowKeysAll = function (trs) {
      var m = this;
      if (m._opInfo) return { values: [m._opInfo.activeuid], rows: [m._vtr] };
    }
    po.syncState = function (tr, stateTxt) { getEmByClass(this._cntr, "currState").innerText = i18nm.State.text + " : " + stateTxt; }
    po.bfrStateChanged = function (trs) { return this.askSave(); }
    po.aftStateChanged = function (trs) { }
    DlgReviseRequest._initialized = 1;
  }
}
function teShowFreeNoteDlg(tar, cntr, td, cls) {
  var m = tar, bkr = m, ih, p = "_dg4memo", dg = m[p], bs;
  if (cls) { if (dg) { dg.dg.close(1); }; return; }
  if (dg) ih = isHidden(dg.dg);
  else {
    //if (bkr instanceof GridEdit) bkr = new fcioBrokerGE(m); //不要轉換,需要多個GridEdit的method
    dg = new DlgShowFreeNote(bkr, cntr);
    if (!dg.createDlg()) return;
    m[p] = dg;
    bs = 1;
  }
  dg.showDlg(); dg.setTarget(td);
  if (bs && dg.dg) {
    dg.dg.fitSize(); ih = 1;
  }
  if (ih) showBesideMouse(dg.dg.dlg);
  return dg;
}
function DlgShowFreeNote(ge, cntr) {//讓備忘錄具有回覆,建議,討論緒的功能
  this.ge = ge; this._cntr = cntr;
  if (DlgShowFreeNote._initialized == undefined) {
    DlgShowFreeNote._initialized = 1;
    var po = DlgShowFreeNote.prototype;
    po.createDlg = function () {
      var m = this, ge = m.ge, dg = m.dg, om = m._cntr;
      var ifmNm = "xrrq" + Math.random(), x = ["<div class='FreeNote'><div id='txtHint' class='objectText'></div>",
      "<div class='NoteData'/></div>"];
      if (!om) {
        if (!dg) {
          dg = dlgShowContents("");
          dg.handleClose = function () { return dg.showMe(1); }
          dg.handleResize = function (dgo) { return m.hndResized.call(m, dgo); }
          m.dg = dg;
          dg.setBorderColor("#907010");
          dg.isSubDialog = 0;
        }
        dg.setCaption(i18nm.tlFreeNote.text + "->" + (ge.getCaption ? ge.getCaption() : ge.text));
        om = dg.main;
        m._cntr = om;
        dg.showMe();
      }
      om.innerHTML = x.join("");
      m.hintO = GJT.getChildById(om, "txtHint");
      m.NoteDataO = getEmByClass(om, "NoteData");
      //以ge.id向後台請求一個FreeNote的物件(不同ge可能儲存note的表格不同)
      var xp = ["Action", "subact", "tarid", KW.PrmTimezoneOffset, "pageId"],
      vp = ["Misc", "getFreeNoteObjInfo", ge.getId(), (new Date()).getTimezoneOffset(), ge.getPageId()];
      var ngInfo = teQueryByAjax(null, xp, vp, null, 0, null, null, 1);
      if (!ngInfo) { m.hintO.innerHTML = "Free Note Table not defined!"; return; }
      var ngo = eval("o=" + ngInfo);
      m.tblId = ngo.tblId;
      var nge = teGenGridEdit(ngo.noteObjId, TBM.withIcon | TBM.withText, m.NoteDataO);//使用NoteDataO為container 建立GridEdit
      m.noteGE = nge;
      nge.handleAfterQuery = function () { m.fitSize.call(m); }
      m.chkSyncO = nge.addToolBarButton("<font onclick='cmnSwitchInputChecked()' style='cursor:default'><input type='checkbox' />" + i18nm.SyncShow.text + "</font>").children[0];
      var btn = nge.addToolBarButton(i18nm.tlRefreshData.text);
      btn.onclick = function () { m.setTarget.call(m); };
      var evh = function () { m.evtHnd.call(m) };
      GJT.eventAddHandle(m._cntr, "click,mouseup,mousedown", evh);
      var evtGE = function (evtType, prm) { m.geEvt.call(m, evtType, prm) };
      ge.evtListenerAdd("aftMainRowChanged", evtGE);
      var evtNGE = function (evtType, prm) { m.ngeEvt.call(m, evtType, prm) };
      nge.evtListenerAdd("aftChangeValue", evtNGE);
      m.setTarget();//第一個
      return 1;
    }
    po.showDlg = function () {
      if (this.dg) this.dg.showMe();
    }
    po.evtHnd = function () {
    }
    po.hndResized = function () {
    }
    po.setTarget = function (tr) {
      var m = this;
      if (!tr) tr = m.ge.mainTR();
      tr = getTR(tr);
      var myCaption = ge.getTextUIKF(tr, 3);
      m.hintO.innerText = myCaption;
      m.tarTR = tr;
      m.showNotes();
    }
    po.fitSize = function () {
      this.dg.fitSize(1);
    }
    po.showNotes = function () {
      var m = this, ge = m.ge, nge = m.noteGE, e = GJT.compareModeEnum;
      var myRowId = ge.getKey(m.tarTR);
      var crn = new OpQueryCriterion();
      var s = new OpItemFilter(nge.fieldsAll["tblId"], m.tblId, e.Equal, null);
      crn.filters.add(s);
      s = new OpItemFilter(nge.fieldsAll["rowId"], myRowId, e.Equal, null);
      crn.filters.add(s);
      nge.query(crn);
    }
    po.geEvt = function (evtType, prm) {
      var m = this, ge = m.ge;
      if ("aftMainRowChanged" == evtType && m.chkSyncO.checked) {
        //如果指定同步顯示備忘錄資料時,自動call setTarget
        m.setTarget(ge.mainTR());
      }
    }
    po.ngeEvt = function (evtType, prm) {
      var m = this, ge = m.ge, nge = m.noteGE;
      if ("aftChangeValue" == evtType) {//只當使用者有輸入備註時才加入關聯的rowId
        //檢查rowId,如果沒有rowId就設定 //prm:[m, tr, itm, value]
        if (prm[0] == nge && !nge.getFieldValueR("rowId", prm[1])) {
          var myRowId = ge.getKey(m.tarTR);
          nge.setFieldValue("rowId", myRowId, prm[1]);
          nge.setFieldValue("tblId", m.tblId, prm[1]);
        }
      }
    }
  }
}