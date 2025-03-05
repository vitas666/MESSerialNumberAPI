function i18nTranForObj(obj, name) {
    obj.text(i18nTranValue(name));
}

function i18nTranValue(name) {
    return CommonI18n.MesSerialNumber[name].text;
}

function loading(type) {
    if (type) {
        $(".loading-overlay").removeClass("display-none");
        $(".loading-overlay").addClass("display-flex");
    } else {
        $(".loading-overlay").addClass("display-none");
        $(".loading-overlay").removeClass("display-flex");
    }
}