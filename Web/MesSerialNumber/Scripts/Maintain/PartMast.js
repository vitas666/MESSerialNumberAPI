$(function () {
    msAjaxPageName = $.defaultSettings.defaultGridEditRetrieveURL;
    var PartMastGrid = new GridEdit($('#PartMastGrid table.DataEdit')[0], TBM.standard, $('#PartMastGrid')[0], $.defaultSettings.defaultGridEditRetrieveURL, "overflow:auto");
    var PartCodingGrid = new GridEdit($('#PartCodingGrid table.DataEdit')[0], TBM.standard, $('#PartCodingGrid')[0], $.defaultSettings.defaultGridEditRetrieveURL, "overflow:auto");

    var date = new Date();
    var dateTime = date.getFullYear() + "/" + (date.getMonth() + 1).toString().padStart(2, "0") + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    var IsYaN = { 0: CommonI18n.MesSerialNumber.IsYaN[0].text, 1: CommonI18n.MesSerialNumber.IsYaN[1].text };
    var ErrorMsg = "";
    var PartCodingNotEmptyError = false, PartNoNotEmptyError = false, SerialTypeNotEmptyError = false,
        PartNoNotExistArr = [], PartNoNotRepeatArr = [], PartCodingNotExistArr = [], PartCodingNotRepeatArr = [], PartNoHaveDataArr = [], PartCodingRepeatVaildArr = [];

    var GetLasnNoUrl = generateActionUrl('Maintain', 'GetLast');
    var GetLasnDescUrl = generateActionUrl('Maintain', 'GetLastDesc');
    var CheckPartNoUrl = generateActionUrl('Maintain', 'CheckPartNo');
    var CheckPartCodingUrl = generateActionUrl('Maintain', 'CheckPartCoding');
    var GetPartDescUrl = generateActionUrl('Maintain', 'GetPartDesc');
    var CheckPartNoRepeatUrl = generateActionUrl('Maintain', 'CheckPartNoRepeat');
    var CheckCodingVaildUrl = generateActionUrl('Maintain', 'CheckCodingVaild');

    alert = function () { };

    $("#PartMastGrid table.DataEdit").click(function (e) {
        var r = new opRela();
        r.from = PartMastGrid;
        r.to = PartCodingGrid;
        r.fromFields = PartMastGrid.fieldsAll.collect('PartID');
        r.toFields = PartCodingGrid.fieldsAll.collect('PartID');
        teExpandQryDo(r, 0, 0, 0, 1);

        let PartMastID = PartMastGrid._selection.getDataTRs()[0].cells[1].textContent;
        $("#PartCodingGrid table.DataEdit")[0].rows[1].cells[PartCodingGrid.getCellIndex("PartID")].childNodes[0].value = PartMastID;
        if (PartMastID !== "") PartCodingGrid.queryByUser();
    });
    PartMastGrid.handleBeforeSave = function (m, criterion) {
        repeatKey = [];
        let failArray = [];

        for (var i = 0; i < criterion.length; i++) {
            if (!CheckData(criterion[i])) {
                failArray[i] = criterion[i].editLog;
                PartMastGrid.editLogClear(criterion[i].tr);
                continue;
            }

            repeatKey[i] = criterion[i].data["PartNo"].value;
            PartMastGrid.editLogAdd(criterion[i].tr, "ModifyDate", dateTime);
            if (criterion[i].isNew == true) {
                PartMastGrid.editLogAdd(criterion[i].tr, "CreatedDate", dateTime);
                $.ajaxCall(GetLasnNoUrl, { value: "TBKEY_PartMast@MES" }, null,
                    function (response) {
                        PartMastGrid.editLogAdd(criterion[i].tr, "PartID", response);
                    }, null, null, false);
                $.ajaxCall(GetLasnDescUrl, { value: "SiteID" }, null,
                    function (response) {
                        PartMastGrid.editLogAdd(criterion[i].tr, "FactID", response);
                    }, null, null, false);
                $.ajaxCall(GetPartDescUrl, { PartNo: repeatKey[i] }, null,
                    function (response) {
                        PartMastGrid.editLogAdd(criterion[i].tr, "PartDesc", response);
                    }, null, null, false);
            }
        }

        CheckErrorMsg();
        if (ErrorMsg != "") {
            $.createDialog({
                dialogType: $.samDialogType.yes,
                dialogTitle: CommonI18n.MesSerialNumber.Result.text,
                dialogContent: ErrorMsg,
                showContentIcon: false,
                okCaption: CommonI18n.common.OK.text,
            });
        }
        var saveCriterion = GJT.eventSrc().className == "Save" ? PartMastGrid._selection.getDataTRs() : PartMastGrid.getAllDataTRs();
        teSaveDataN(PartMastGrid, PartMastGrid.getEditCriterion(saveCriterion, null), false);

        for (var i = 0; i < criterion.length; i++) {
            if (failArray[i]) {
                for (var j = 0; j < failArray[i].length; j++) {
                    PartMastGrid.editLogAdd(criterion[i].tr, failArray[i][j].fieldName, failArray[i][j].value);
                }
                criterion[i].tr.children[0].style = "background-color: rgb(210, 105, 30);";
            }
        }
        return true;
    }
    PartMastGrid.handleAfterSave = function (m, criterion) {
        if (ErrorMsg == "") PartMastGrid.queryByUser();
    }
    PartMastGrid.aftChangeValue = function (m, criterion) {
        const validFields = ["IsAutoPass", "IsFromMESSN", "IsFromInspection", "IsFromEP", "IsAllowCoding"];
        if (validFields.includes(m.aftChangeValue.arguments[2].fieldName)) {
            PartMastGrid.editLogAdd(criterion, "CtrlCode", findKey(IsYaN, criterion.cells[PartMastGrid.getCellIndex("IsAutoPass")].textContent) * 1 +
                                                       findKey(IsYaN, criterion.cells[PartMastGrid.getCellIndex("IsFromMESSN")].textContent) * 128 +
                                                       findKey(IsYaN, criterion.cells[PartMastGrid.getCellIndex("IsFromInspection")].textContent) * 256 +
                                                       findKey(IsYaN, criterion.cells[PartMastGrid.getCellIndex("IsFromEP")].textContent) * 512 +
                                                       findKey(IsYaN, criterion.cells[PartMastGrid.getCellIndex("IsAllowCoding")].textContent) * 1024);
        }
    }
    PartCodingGrid.handleBeforeSave = function (m, criterion) {
        repeatKey = [];
        let PartMastID = PartMastGrid._selection.getDataTRs()[0].cells[1].textContent;

        if (PartMastID !== null && PartMastID !== undefined && PartMastID !== "") {
            let failArray = [];
            for (var i = 0; i < criterion.length; i++) {
                if (!CheckDataForDetl(criterion[i])) {
                    failArray[i] = criterion[i].editLog;
                    PartCodingGrid.editLogClear(criterion[i].tr);
                    continue;
                }

                repeatKey[i] = criterion[i].data["CodingRule"].value;

                if (criterion[i].isNew == true) {
                    PartCodingGrid.editLogAdd(criterion[i].tr, "PartID", PartMastID);
                    PartCodingGrid.editLogAdd(criterion[i].tr, "CtrlCode", 1);
                    PartCodingGrid.editLogAdd(criterion[i].tr, "CreatedDate", dateTime);
                    $.ajaxCall(GetLasnNoUrl, { value: "TBKEY_PartCoding@MES" }, null,
                        function (response) {
                            PartCodingGrid.editLogAdd(criterion[i].tr, "PartCodingID", response);
                        }, null, null, false);
                }
                PartCodingGrid.editLogAdd(criterion[i].tr, "ModifyDate", dateTime);

            }

            CheckErrorMsg();
            if (ErrorMsg != "") {
                $.createDialog({
                    dialogType: $.samDialogType.yes,
                    dialogTitle: CommonI18n.MesSerialNumber.Result.text,
                    dialogContent: ErrorMsg,
                    showContentIcon: false,
                    okCaption: CommonI18n.common.OK.text,
                });
            }

            var saveCriterion = GJT.eventSrc().className == "Save" ? PartCodingGrid._selection.getDataTRs() : PartCodingGrid.getAllDataTRs();
            teSaveDataN(PartCodingGrid, PartCodingGrid.getEditCriterion(saveCriterion, null), false);

            for (var i = 0; i < criterion.length; i++) {
                if (failArray[i]) {
                    for (var j = 0; j < failArray[i].length; j++) {
                        PartCodingGrid.editLogAdd(criterion[i].tr, failArray[i][j].fieldName, failArray[i][j].value);
                    }
                    criterion[i].tr.children[0].style = "background-color: rgb(210, 105, 30);";
                }
            }
        } else {
            $.createDialog({
                dialogType: $.samDialogType.yes,
                dialogTitle: CommonI18n.MesSerialNumber.Result.text,
                dialogContent: CommonI18n.MesSerialNumber.SelectPartNoFirstAddCodingRule.text,
                showContentIcon: false,
                okCaption: CommonI18n.common.OK.text,
            });
        }
        return true;
    }

    function findKey(dataArray, value) {
        return Object.keys(dataArray).find(k =>dataArray[k] == value);
    }

    function CheckDefult() {
        ErrorMsg = "";
        PartNoHaveDataArr = []
        PartNoNotExistArr = [];
        PartNoNotEmptyError = false;
        PartNoNotRepeatArr = [];
        SerialTypeNotEmptyError = false;
        PartCodingNotExistArr = [];
        PartCodingNotEmptyError = false;
        PartCodingNotRepeatArr = [];
        PartCodingRepeatVaildArr = [];
    }

    function CheckData(criterion) {
        CheckDefult();
        var result = true;
        if (criterion.data["IsAllowCoding"].value == 1) {
            $.ajaxCall(CheckCodingVaildUrl, { PartID: criterion.data["PartID"].value }, null,
                function (response) {
                    if (response.length > 0) {
                        PartCodingRepeatVaildArr = response;
                        result = false;
                    }
                }, null, null, false);
        }

        if (criterion.isNew == true) {
            if (criterion.data["PartNo"].value == "") {
                PartNoNotEmptyError = true;
                result = false;
            }

            if ((repeatKey.indexOf(criterion.data["PartNo"].value) > -1)) {
                PartNoNotRepeatArr.push(criterion.data["PartNo"].value);
                result = false;
            }

            if (criterion.data["SerialType"].value == "") {
                SerialTypeNotEmptyError = true;
                result = false;
            }

            $.ajaxCall(CheckPartNoUrl, { PartNo: criterion.data["PartNo"].value }, null,
                function (response) {
                    if (response == "FAIL") {
                        PartNoNotExistArr.push(criterion.data["PartNo"].value);
                        result = false;
                    }
                }, null, null, false);

            $.ajaxCall(CheckPartNoRepeatUrl, { PartNo: criterion.data["PartNo"].value }, null,
                function (response) {
                    if (response == "FAIL") {
                        PartNoHaveDataArr.push(criterion.data["PartNo"].value);
                        result = false;
                    }
                }, null, null, false);
        }
        return result;
    }

    function CheckDataForDetl(criterion) {
        CheckDefult();
        var result = true;
        if (criterion.isNew == true) {
            if (criterion.data["CodingRule"].value == "") {
                PartCodingNotEmptyError = true;
                result = false;
            }

            if ((repeatKey.indexOf(criterion.data["CodingRule"].value) > -1)) {
                PartCodingNotRepeatArr.push(criterion.data["CodingRule"].value);
                result = false;
            }

            $.ajaxCall(CheckPartCodingUrl, { CodingRule: criterion.data["CodingRule"].value }, null,
                function (response) {
                    if (response == "FAIL") {
                        PartCodingNotExistArr.push(criterion.data["CodingRule"].value);
                        result = false;
                    }
                }, null, null, false);
        }
        return result;
    }

    function CheckErrorMsg() {
        if (PartNoNotEmptyError) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartNoCantEmpty.text + "<br>";
        }
        if (PartNoNotExistArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartNoNotExist.text + PartNoNotExistArr.join(', ') + "<br>";
        }
        if (PartNoNotRepeatArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.AddRepeatKey.text + PartNoNotRepeatArr.join(', ') + "<br>";
        }
        if (PartNoHaveDataArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartNoExistPartMast.text + PartNoHaveDataArr.join(', ') + "<br>";
        }
        if (PartCodingRepeatVaildArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartCodingRepeatVaild.text + PartCodingRepeatVaildArr.join(', ') + "<br>";
        }
        if (SerialTypeNotEmptyError) {
            ErrorMsg += CommonI18n.MesSerialNumber.SerialTypeCantEmpty.text + "<br>";
        }
        
        if (PartCodingNotEmptyError) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartCodingCantEmpty.text + "<br>";
        }
        if (PartCodingNotExistArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.PartCodingExist.text + PartCodingNotExistArr.join(', ') + "<br>";
        }
        if (PartCodingNotRepeatArr.length > 0) {
            ErrorMsg += CommonI18n.MesSerialNumber.AddRepeatKey.text + PartCodingNotRepeatArr.join(', ') + "<br>";
        }
    }
});