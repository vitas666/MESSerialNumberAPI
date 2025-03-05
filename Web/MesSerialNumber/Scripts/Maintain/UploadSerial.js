$(function () {
    var uploadCsvUrl = generateActionUrl('Maintain', 'UploadCsv');

    $("#Upload").on("click", function () {
        let formData = new FormData();
        formData.append("CsvFile", $('#CsvFile').prop('files')[0]);

        $(".insert-fail-table .css-tr:not(:first)").remove();
        $(".update-fail-table .css-tr:not(:first)").remove();
        $(".exception-fail-table .css-tr:not(:first)").remove();
        loading(true);

        $.ajax({
            url: uploadCsvUrl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                loading(false);
                // TODO API 回傳訊息塞入Table
                addTr(response.InsertFailed, "insert-fail-table");
                addTr(response.UpdateFailed, "update-fail-table");
                addTr(response.IncorrectData, "exception-fail-table");

                $("#InsertSuccessCount").text(response.InsertSuccess.length);
                $("#UpdateSuccessCount").text(response.UpdateSuccess.length);
                $("#InsertFailedCount").text(response.InsertFailed.length);
                $("#UpdateFailedCount").text(response.UpdateFailed.length);
                $("#IncorrectDataCount").text(response.IncorrectData.length);
            }
        });
    });

    $(".toggle-button").on('click', function () {
        let type = $(this).data("type");
        let table = $("." + type + "-fail-table");
        let icon = $("#" + type + "-toggle-icon");
        if (table.hasClass("display-none")) {
            table.addClass("display-table");
            table.removeClass("display-none");
            icon.addClass("bi-caret-up-fill");
            icon.removeClass("bi-caret-down-fill");
        } else {
            table.removeClass("display-table");
            table.addClass("display-none");
            icon.removeClass("bi-caret-up-fill");
            icon.addClass("bi-caret-down-fill");
        }
    });

    i18nTranForObj($(".SerialNo"), "SerialNo");
    i18nTranForObj($(".PartNo"), "PartNo");
    i18nTranForObj($(".Reason"), "Reason");
    i18nTranForObj($("#Upload"), "Upload");
    i18nTranForObj($("#Save"), "Save");
    i18nTranForObj($("#Save"), "Save");
    i18nTranForObj($("#UploadCsvLabel"), "UploadCsv");
    $("#InsertSuccess").html(i18nTranValue("InsertSuccess") + "  <span id='InsertSuccessCount'></span>  " + i18nTranValue("Entries"));
    $("#UpdateSuccess").html(i18nTranValue("UpdateSuccess") + "  <span id='UpdateSuccessCount'></span>  " + i18nTranValue("Entries"));
    $("#InsertFailed").html(i18nTranValue("InsertFailed") + "  <span id='InsertFailedCount'></span>  " + i18nTranValue("Entries"));
    $("#UpdateFailed").html(i18nTranValue("UpdateFailed") + "  <span id='UpdateFailedCount'></span>  " + i18nTranValue("Entries"));
    $("#IncorrectData").html(i18nTranValue("IncorrectData") + "  <span id='IncorrectDataCount'></span>  " + i18nTranValue("Entries"));

    function addTr(data, className) {
        $.each(data, function (k, v) {
            var newTr = "<div class='css-tr'>";
            newTr += "<div class='css-td'>" + v.SerialNo + "</div>";
            newTr += "<div class='css-td'>" + v.PartNo + "</div>";
            newTr += "<div class='css-td'>" + v.Message + "</div>";
            newTr += "</div>";
            $(newTr).insertAfter("." + className + " .css-tr:last");
        });
    }
})