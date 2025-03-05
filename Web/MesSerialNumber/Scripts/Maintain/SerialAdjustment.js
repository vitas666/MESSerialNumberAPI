$(function () {
    var searchSerialUrl = generateActionUrl('Maintain', 'SearchSerialNo');
    var updateSerialUrl = generateActionUrl('Maintain', 'UpdateSerialNo');

    //TODO
    $("#Search").on('click', function () {
        let adjDiv = $("#AdjustmentDiv");
        adjDiv.removeClass("display-block");
        adjDiv.addClass("table-none");
        $("#PartNo").val("");
        $("#isValid").prop("checked", false);
        if ($("#SerialNo").val() == "") {
            $.createDialog({
                dialogType: $.samDialogType.yes,
                dialogTitle: CommonI18n.MesSerialNumber.Result.text,
                dialogContent: CommonI18n.MesSerialNumber.SerialNoCantEmpty.text,
                showContentIcon: false,
                okCaption: CommonI18n.common.OK.text,
            });
            adjDiv.removeClass("display-block");
            adjDiv.addClass("table-none");
        } else {
            loading(true);
            $("#SerialNo").attr("disabled", true);
            $.ajax({
                url: searchSerialUrl,
                type: 'POST',
                data: {
                    SerialNo: $("#SerialNo").val()
                },
                success: function (response) {
                    loading(false);
                    $("#SearchSerialNo").text($("#SerialNo").val());
                    adjDiv.addClass("display-block");
                    adjDiv.removeClass("table-none");
                    $("#SerialNo").attr("disabled", false);
                    if (response.SerialNo != null) {
                        $("#PartNo").val(response.PartNo);
                        let ctrlCode = response.CtrlCode & 1 == 1;
                        if (ctrlCode) $("#isValid").prop("checked", true);
                    }
                }
            });
        }
    });

    var checkboxValue = 0;

    $("#Save").on('click', function () {
        loading(true);
        $.ajax({
            url: updateSerialUrl,
            type: 'POST',
            data: {
                SerialNo: $("#SerialNo").val(),
                PartNo: $("#PartNo").val(),
                CtrlCode: checkboxValue,
                CheckCode: 1,
            },
            success: function (response) {
                loading(false);
                let message = "";
                if (response.IncorrectData.length > 0) {
                    message = response.IncorrectData[0].Message;
                }
                if (response.InsertFailed.length > 0) {
                    message = response.InsertFailed[0].Message;
                }
                if (response.UpdateFailed.length > 0) {
                    message = response.UpdateFailed[0].Message;
                }
                if (response.UpdateSuccess.length > 0) {
                    message = response.UpdateSuccess[0].Message;
                }
                if (response.InsertSuccess.length > 0) {
                    message = response.InsertSuccess[0].Message;
                }
                if (message != "") {
                    $.createDialog({
                        dialogType: $.samDialogType.yes,
                        dialogTitle: CommonI18n.MesSerialNumber.Result.text,
                        dialogContent: message,
                        showContentIcon: false,
                        okCaption: CommonI18n.common.OK.text,
                    });
                }
            }
        });
    });

    $('#isValid').change(function () {
        checkboxValue = $(this).prop('checked') ? 1 : 0;
    });

    i18nTranForObj($("#SerialNoLabel"), "SerialNo");
    i18nTranForObj($("#SearchSerialNoLabel"), "SerialNo");
    i18nTranForObj($("#PartNoLabel"), "PartNo");
    i18nTranForObj($("#QualifiedLabel"), "Qualified");
    i18nTranForObj($("#Search"), "Search");
    i18nTranForObj($("#Save"), "Save");
})