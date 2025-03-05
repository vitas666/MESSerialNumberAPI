/// <reference path="Shared/CommonI18n.js" />
$.browser = {};
$.browser.mozilla = /firefox/.test(navigator.userAgent.toLowerCase());
$.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
$.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
$.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());

$.defaultSettings = {
    defaultAuthURL: URL + 'Account/Auth',
    defaultMainActionURL: URL + 'Account/Main',
    defaultAjaxLoaderImageURL: URL + 'Content/ajax-loader.gif',
    defaultCloseImageURL: URL + 'Content/CloseDlg.png',
    defaultDetailImageURL: URL + 'Content/detail-icon.png',
    defaultGridEditRetrieveURL: URL + '/Account/GridEditRetrieve'
};

/**
*將[{Key:'key1',Value:'value1'},{Key:'key2',Value:'value2'}]轉成{'key1':'value1','key2':'value2'}
*/
$.toDictionary = function (obj) {
    if (obj != null) {
        var dictionary = {};

        $.each(obj, function (key, value) {
            dictionary[value.Key] = value.Value;
        });

        return dictionary;
    }
};

$.generateHashSet = function () {
    var HashSet = function () {
        var set = {};
        this.add = function (key, obj) {
            set[key] = obj ? obj : true;
        };
        this.get = function (key) {
            return set.hasOwnProperty(key) ? set[key] : false;
        };
        this.remove = function (key) {
            delete set[key];
        };
        this.clear = function () {
            set = {};
        };
        this.contains = function (key) {
            return set.hasOwnProperty(key);
        };
        this.isEmpty = function () {
            return $.isEmptyObject(set);
        };
        this.toArray = function () {
            var ary = new Array();
            $.each(set, function (name) { ary.push(name); });
            return ary.sort();
        };
    };
    return new HashSet();
}

/**
*檢查內容格式
*/
$.checkRegExp = function (str, type) {
    if (type == 0) // 都是英文字母
    {
        var regExp = /^[a-zA-Z]*$/;
        if (regExp.test(str))
            return true;
        else
            return false;
    } else if (type == 1) // 都是數字
    {
        var regExp = /^[0-9]*$/;
        if (regExp.test(str))
            return true;
        else
            return false;
    } else if (type == 2) // 發票號碼
    {
        var regExp = /[A-Z][A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/;
        if (regExp.test(str))
            return true;
        else
            return false;
    }
}

/**
*將caption設到DOM元素裡
*/
$.fillCaption = function (obj) {
    if (obj != null) {
        $.each(obj, function (key, value) {
            var jQueryObject = $('#' + key);

            if (jQueryObject.length > 0) {
                var tagName = jQueryObject.get(0).tagName;

                if (tagName == 'BUTTON') {
                    jQueryObject.button("option", "label", value.text);
                } else {
                    try {
                        jQueryObject.text(value.text);
                    } catch (e) {
                    }

                    try {
                        jQueryObject.val(value.text);
                    } catch (e) {
                    }
                }
            }
        });
    }
};

/**
*deprecated
*/
$.fillFieldCaption = function (obj) {
    $.each(obj, function (key, value) {
        $('#___' + (key.split('.').join('\\.'))).text(value.caption);
    });
};

$.firstCharToUpper = function (source) {
    if (source.length == 1) {
        return source.toUpperCase();
    }

    return source.substring(0, 1).toUpperCase() + source.substring(1);
};

$.firstCharToLower = function (source) {
    if (source.length == 1) {
        return source.toLowerCase();
    }

    return source.substring(0, 1).toLowerCase() + source.substring(1);
};

/**
*typePrefixes:[]
*/
$.renderUI = function (options) {
    var defaultOptions = {
        jQFormI18n: null,
        autoSetPageTitle: true,
        callback1: null
    };

    $.extend(defaultOptions, options);

    if (defaultOptions.jQFormI18n) {
        $.fillCaption(defaultOptions.jQFormI18n);

        if (defaultOptions.autoSetPageTitle && defaultOptions.jQFormI18n.Title) {
            document.title = defaultOptions.jQFormI18n.Title.text;
        }
    }

    if (defaultOptions.callback1) {
        defaultOptions.callback1.apply({}, []);
    }
};

/**
*將$.ajax()再封裝成更簡便的方法
*/
$.ajaxCall = function (url, data, beforeSend, success, error, complete, async, options) {
    var defaultOptions = {
        loadingDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.LoadingDialogTitle ? CommonI18n.common.LoadingDialogTitle.text : ''),
        confirmDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDataManipulationErrorTitle ? CommonI18n.common.ConfirmDialogDataManipulationErrorTitle.text : ''),
        confirmDialogOk: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogYes ? CommonI18n.common.ConfirmDialogYes.text : '')
    };

    $.extend(defaultOptions, options);

    return $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        url: url,
        data: data,
        dataType: "json",
        async: async,
        processData: true,
        beforeSend: function (jqXHR, settings) {
            if (beforeSend) {
                beforeSend.apply({}, [jqXHR, settings]);
            }

            if ($('#loading').length == 0) {
                $(document.body).append("<div id=\"loading\"><img src=\"" + $.defaultSettings.defaultAjaxLoaderImageURL + "\"/></div>");
                $('#loading').dialog({
                    autoOpen: false,
                    modal: true,
                    title: defaultOptions.loadingDialogTitle,
                    width: 270,
                    height: 100
                });
            }

            if (options) {
                $("#loading").dialog("option", "closeOnEscape", !(options.closeOnEscape === false));
                $("#loading").on("dialogopen", options.loadingOpen);
            }

            $('.ui-dialog-titlebar-close').append("<img src=\"" + $.defaultSettings.defaultCloseImageURL + "\"/></div>");
            $('#loading').dialog('open');
        },
        success: function (data, textStatus, jqXHR) {
            //if the session time out
            if (data && data.ErrorCode && data.ErrorCode == -1) {
                window.location.reload();
                return;
            }

            //if exception
            if (data.ExceptionList && data.ExceptionList.length > 0) {
                var dbConcurrency = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDbConcurrencyText ? CommonI18n.common.ConfirmDialogDbConcurrencyText.text : '');
                var exception = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogExceptionText ? CommonI18n.common.ConfirmDialogExceptionText.text : '');
                var temp = [];
                var confirmDialogText = '';

                $.each(data.ExceptionList, function (index, value) {
                    switch (value.ErrorCode) {
                        case -2:
                            temp.push($.stringFormat('({0})', value.DataKey));
                            break;
                        default:
                            confirmDialogText += $.stringFormat(exception, value.DataKey);
                            break;
                    }
                });

                if (temp.length > 0) {
                    confirmDialogText += $.stringFormat(dbConcurrency, '[' + temp.join(',') + ']');
                }

                if ($('#confirmDialog').length == 0) {
                    $(document.body).append("<div id=\"confirmDialog\"></div>");
                    $('#confirmDialog').dialog({
                        autoOpen: false,
                        modal: true,
                        dialogClass: 'confirm-dialog'
                    });
                }

                var buttons = {};

                buttons[defaultOptions.confirmDialogOk] = function () {
                    $(this).dialog('close');
                };

                $('#confirmDialog').dialog('option', 'title', defaultOptions.confirmDialogTitle);
                $('#confirmDialog').text(confirmDialogText);
                $('#confirmDialog').dialog('option', 'buttons', buttons);
                $('#confirmDialog').dialog('open');
            }

            if (success) {
                success.apply({}, [data, textStatus, jqXHR]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //Session Timeout
            if (jqXHR.status == 401) {
                //$.showReLoginDialog();
                window.location.reload();
                return;
            }

            if (error) {
                error.apply({}, [jqXHR, textStatus, errorThrown]);
            } else {
                alert(jqXHR.responseText);
            }
        },
        complete: function (jqXHR, textStatus) {
            if (complete) {
                complete.apply({}, [jqXHR, textStatus]);
            }

            $('#loading').dialog('close');
            $('.ui-dialog-titlebar-close img').remove();
        }
    });
};
/**
* (非同步)使用JSON格式進行資料傳輸
*/
$.ajaxCallJSON = function (url, data, beforeSend, success, error, complete, options) {
    var defaultOptions = {
        cache: true, // 預設值為 true
        type: "POST",
        dataType: "json",
        async: true,
        loadingDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.LoadingDialogTitle ? CommonI18n.common.LoadingDialogTitle.text : ''),
        confirmDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDataManipulationErrorTitle ? CommonI18n.common.ConfirmDialogDataManipulationErrorTitle.text : ''),
        confirmDialogOk: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogYes ? CommonI18n.common.ConfirmDialogYes.text : '')
    };

    $.extend(defaultOptions, options);

    return $.ajax({
        async: defaultOptions.async,
        type: defaultOptions.type,
        contentType: "application/json; charset=UTF-8",
        url: url,
        data: JSON.stringify(data),
        dataType: defaultOptions.dataType,
        cache: defaultOptions.cache,
        processData: false,
        beforeSend: function (jqXHR, settings) {
            if (beforeSend) {
                beforeSend.apply({}, [jqXHR, settings]);
            }

            if ($('#loading').length == 0) {
                $(document.body).append("<div id=\"loading\"><img src=\"" + $.defaultSettings.defaultAjaxLoaderImageURL + "\"/></div>");
                $('#loading').dialog({
                    autoOpen: false,
                    modal: true,
                    title: defaultOptions.loadingDialogTitle,
                    width: 270,
                    height: 100
                });
            }

            if (options) {
                $("#loading").dialog("option", "closeOnEscape", !(options.closeOnEscape === false));
                $("#loading").on("dialogopen", options.loadingOpen);
            }

            $('#loading').dialog('open');
        },
        success: function (data, textStatus, jqXHR) {
            //if the session time out
            if (data && data.ErrorCode && data.ErrorCode == -1) {
                window.location.reload();
                return;
            }

            //if exception
            if (data.ExceptionList && data.ExceptionList.length > 0) {
                var dbConcurrency = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDbConcurrencyText ? CommonI18n.common.ConfirmDialogDbConcurrencyText.text : '');
                var exception = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogExceptionText ? CommonI18n.common.ConfirmDialogExceptionText.text : '');
                var temp = [];
                var confirmDialogText = '';

                $.each(data.ExceptionList, function (index, value) {
                    switch (value.ErrorCode) {
                        case -2:
                            temp.push($.stringFormat('({0})', value.DataKey));
                            break;
                        default:
                            confirmDialogText += $.stringFormat(exception, value.DataKey);
                            break;
                    }
                });

                if (temp.length > 0) {
                    confirmDialogText += $.stringFormat(dbConcurrency, '[' + temp.join(',') + ']');
                }

                if ($('#confirmDialog').length == 0) {
                    $(document.body).append("<div id=\"confirmDialog\"></div>");
                    $('#confirmDialog').dialog({
                        autoOpen: false,
                        modal: true,
                        dialogClass: 'confirm-dialog'
                    });
                }

                var buttons = {};

                buttons[defaultOptions.confirmDialogOk] = function () {
                    $(this).dialog('close');
                };

                $('#confirmDialog').dialog('option', 'title', defaultOptions.confirmDialogTitle);
                $('#confirmDialog').text(confirmDialogText);
                $('#confirmDialog').dialog('option', 'buttons', buttons);
                $('#confirmDialog').dialog('open');
            }

            if (success) {
                success.apply({}, [data, textStatus, jqXHR]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //Session Timeout
            if (jqXHR.status == 401) {
                $.showReLoginDialog();
                return;
            }

            if (error) {
                error.apply({}, [jqXHR, textStatus, errorThrown]);
            } else {
                alert(jqXHR.responseText);
            }
        },
        complete: function (jqXHR, textStatus) {
            if (complete) {
                complete.apply({}, [jqXHR, textStatus]);
            }

            $('#loading').dialog('close');
        }
    });
};

/**
*將$.ajaxSubmit()再封裝成更簡便的方法
*/
$.ajaxSubmitForm = function (formId, beforeSubmit, success, error, complete, options) {
    var defaultOptions = {
        loadingDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.LoadingDialogTitle ? CommonI18n.common.LoadingDialogTitle.text : ''),
        confirmDialogTitle: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDataManipulationErrorTitle ? CommonI18n.common.ConfirmDialogDataManipulationErrorTitle.text : ''),
        confirmDialogOk: (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogYes ? CommonI18n.common.ConfirmDialogYes.text : '')
    };

    $.extend(defaultOptions, options);

    $('#' + formId).ajaxSubmit({
        iframe: false,
        dataType: "json",
        beforeSubmit: function (arr, $form, options) {
            if (beforeSubmit) {
                beforeSubmit.apply({}, [arr, $form, options]);
            }

            if ($('#loading').length == 0) {
                $(document.body).append("<div id=\"loading\"><img src=\"" + $.defaultSettings.defaultAjaxLoaderImageURL + "\"/></div>");
                $('#loading').dialog({
                    autoOpen: false,
                    modal: true,
                    title: defaultOptions.loadingDialogTitle,
                    width: 270,
                    height: 100
                });
            }

            $('#loading').dialog('open');
        },
        success: function (data, textStatus, jqXHR) {
            //if the session time out
            if (data && data.ErrorCode && data.ErrorCode == -1) {
                window.location.reload();
                return;
            }

            //if exception
            if (data.ExceptionList && data.ExceptionList.length > 0) {
                var dbConcurrency = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogDbConcurrencyText ? CommonI18n.common.ConfirmDialogDbConcurrencyText.text : '');
                var exception = (CommonI18n && CommonI18n.common && CommonI18n.common.ConfirmDialogExceptionText ? CommonI18n.common.ConfirmDialogExceptionText.text : '');
                var temp = [];
                var confirmDialogText = '';

                $.each(data.ExceptionList, function (index, value) {
                    switch (value.ErrorCode) {
                        case -2:
                            temp.push($.stringFormat('({0})', value.DataKey));
                            break;
                        default:
                            confirmDialogText += $.stringFormat(exception, value.DataKey);
                            break;
                    }
                });

                if (temp.length > 0) {
                    confirmDialogText += $.stringFormat(dbConcurrency, '[' + temp.join(',') + ']');
                }

                if ($('#confirmDialog').length == 0) {
                    $(document.body).append("<div id=\"confirmDialog\"></div>");
                    $('#confirmDialog').dialog({
                        autoOpen: false,
                        modal: true,
                        dialogClass: 'confirm-dialog'
                    });
                }

                var buttons = {};

                buttons[defaultOptions.confirmDialogOk] = function () {
                    $(this).dialog('close');
                };

                $('#confirmDialog').dialog('option', 'title', defaultOptions.confirmDialogTitle);
                $('#confirmDialog').text(confirmDialogText);
                $('#confirmDialog').dialog('option', 'buttons', buttons);
                $('#confirmDialog').dialog('open');
            }

            if (success) {
                success.apply({}, [data, textStatus, jqXHR]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            //Session Timeout
            if (jqXHR.status == 401) {
                $.showReLoginDialog();
                return;
            }

            if (error) {
                error.apply({}, [jqXHR, textStatus, errorThrown]);
            } else {
                alert(jqXHR.responseText);
            }
        },
        complete: function (jqXHR, textStatus) {
            if (complete) {
                complete.apply({}, [jqXHR, textStatus]);
            }

            $('#loading').dialog('close');
        }
    });
};

/**
*用於將jElement置中於其父元素, 常用於自訂按鈕
*/
$.center = function (jElement, horizontal, vertical) {
    if (horizontal) {
        jElement.css({
            //position: 'absolute',
            //marginLeft: (parseFloat(jElement.parent().css('width')) - parseFloat(jElement.css('width'))) / 2
            marginLeft: (jElement.parent().outerWidth() - jElement.outerWidth()) / 2
        });
    }

    if (vertical) {
        jElement.css({
            //position: 'absolute',
            //marginTop: (parseFloat(jElement.parent().css('height')) - parseFloat(jElement.css('height'))) / 2
            marginTop: (jElement.parent().outerHeight() - jElement.outerHeight()) / 2
        });
    }
}

/**
*用於將jElement設上mouseenter, mouseleave, mousedown, mouseup所對應的css class, 常用於自訂按鈕
*/
$.setAnimationOn = function (jElement, defaultClass, hoverClass, mousedownClass) {
    jElement.mouseenter(function () {
        $(this).removeClass(defaultClass);
        $(this).addClass(hoverClass);
    });

    jElement.mouseleave(function () {
        $(this).removeClass(hoverClass + ' ' + mousedownClass);
        $(this).addClass(defaultClass);
    });

    jElement.mousedown(function () {
        $(this).removeClass(hoverClass);
        $(this).addClass(mousedownClass);
    });

    jElement.mouseup(function () {
        $(this).removeClass(mousedownClass);
        $(this).addClass(hoverClass);
    });
};

/**
*用於將jElement上的mouseenter, mouseleave, mousedown, mouseup事件取消
*/
$.setAnimationOff = function (jElement) {
    jElement.unbind('mouseenter');
    jElement.unbind('mouseleave');
    jElement.unbind('mousedown');
    jElement.unbind('mouseup');
};

/**
*用於將jElement設上mouseenter, mouseleave, mousedown, mouseup所對應的css class, 常用於自訂按鈕
*/
jQuery._setAnimationOn = function (options) {
    var defaultOptions = {
        on: null,
        defaultClass: null,
        hoverClass: null,
        mousedownClass: null
    };

    $.extend(defaultOptions, options);

    var on = $(defaultOptions.on);

    $.removeAnimationOn({
        on: defaultOptions.on,
        defaultClass: defaultOptions.defaultClass
    });

    on.bind('mouseenter', function () {
        $(this).removeClass(defaultOptions.defaultClass);
        $(this).addClass(defaultOptions.hoverClass);
    });

    on.bind('mouseleave', function () {
        $(this).removeClass(defaultOptions.hoverClass + ' ' + defaultOptions.mousedownClass);
        $(this).addClass(defaultOptions.defaultClass);
    });

    on.bind('mousedown', function () {
        $(this).removeClass(defaultOptions.hoverClass);
        $(this).addClass(defaultOptions.mousedownClass);
    });

    on.bind('mouseup', function () {
        $(this).removeClass(defaultOptions.mousedownClass);
        $(this).addClass(defaultOptions.hoverClass);
    });
};

/**
*用於將jElement上的mouseenter, mouseleave, mousedown, mouseup事件取消
*/
jQuery.removeAnimationOn = function (options) {
    var defaultOptions = {
        on: null,
        defaultClass: null
    };

    $.extend(defaultOptions, options);

    var on = $(defaultOptions.on);

    on.unbind('mouseenter');
    on.unbind('mouseleave');
    on.unbind('mousedown');
    on.unbind('mouseup');
    on.removeClass();
    on.addClass(defaultOptions.defaultClass);
};

/**
*等同C#的String.Format()
*/
$.stringFormat = function () {
    var s = arguments[0];

    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }

    return s;
};
/**
*補零
*/
$.paddingLeft = function (str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return $.paddingLeft("0" + str, lenght);
};

$.paddingRight = function (str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return $.paddingRight(str + "0", lenght);
};

$.paddingLeftNotZero = function (str, lenght, str2) {
    if (str.length >= lenght)
        return str;
    else
        return $.paddingLeftNotZero(str2 + str, lenght, str2);
};

$.paddingRightNotZero = function (str, lenght, str2) {
    if (str.length >= lenght)
        return str;
    else
        return $.paddingRightNotZero(str2 + str, lenght, str2);
};

/**
*設定focus
*/
jQuery.fn.setfocus = function () {
    return this.each(function () {
        var dom = this;
        setTimeout(function () {
            try { dom.focus(); } catch (e) { }
        }, 0);
    });
};
/**
*取得最大.最小值
*/
Array.max = function (array) {
    return Math.max.apply(Math, array);
};
Array.min = function (array) {
    return Math.min.apply(Math, array);
};

/**
*取得目前時間&格式化
*/
$.getTime = function () {
    var d = new Date();
    var time = d.format("yyyy/MM/dd hh:mm:ss");

    return time;
};

/*
設定dialog自動關閉
*/
jQuery.fn.setDialogTimeout = function (time, callback) {
    time = time || 2000;
    return this.each(function () {
        var dom = $(this);
        setTimeout(function () {
            try {
                if (callback) { callback.apply({}); }
                dom.dialog('close');
            } catch (e) { }
        }, time);
    });
}

/*
* 設定input text 為 readonly
*/
jQuery.fn.setReadonly = function (readonly, value, focus) {
    return this.each(function () {
        var dom = $(this);
        if (readonly) {
            dom.prop("readonly", true).css("background-color", "#EBEBE4");
        } else {
            dom.prop("readonly", false).css("background-color", "#FFFF93");
        }
        if (value) {
            dom.val("");
        }
        if (focus) {
            dom.setfocus();
        }
    });
}

/*
將相同的欄位進行 rowspan，可以設定顏色切換-http://ppt.cc/iAR2
$('td[dt="c1"]').rowspan();
*/
jQuery.fn.rowspan = function (color1, color2) {
    color1 = color1 || '';
    color2 = color2 || '';
    var col = [color1, color2];
    var i = 0;
    var pText = '';
    var sObj; //預計進行RowSpan物件
    var rcnt = 0; //計算rowspan的數字
    var tlen = this.length;
    var spancnt = 0; //計算有幾個做了span
    return this.each(function () {
        i++; //i = i + 1;
        rcnt++; //rcnt = rcnt + 1;
        //與前項不同
        if (pText != $(this).text()) {
            if (i != 1) {
                //不是剛開始，進行rowspan
                sObj.attr('rowspan', rcnt - 1);
                rcnt = 1;
            }
            //設定要rowspan的物件
            sObj = $(this);
            pText = $(this).text();
            sObj.css('background-color', col[spancnt % 2]);
            spancnt++;
        }
        else {
            $(this).hide();
        }

        if (i == tlen) {
            sObj.attr('rowspan', rcnt + 1);
            //sObj.attr('rowspan', rcnt);
        }
    });
}

$.makeViewBodyToFitAvailableWidth = function () {
    $('#viewBody').css({
        width: $(window).width() - ($('#menu').css('display') != 'none' ? $('#menu').width() : 0) - 50 + 'px'
    });
};

GridEdit.prototype.showSaveConfirmDialog = function (options) {
    var gridEdit = this;
    var defaultOptions = {
        saveURL: null,
        gridEditCriterion: null,
        beforeSend: null,
        success: null
    };

    $.extend(defaultOptions, options);

    if (defaultOptions.gridEditCriterion.length > 0) {
        if ($('#confirmDialog').length == 0) {
            $(document.body).append("<div id=\"confirmDialog\"></div>");
            $('#confirmDialog').dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'confirm-dialog'
            });
        }

        var buttons = {};

        buttons[CommonI18n.common.ConfirmDialogYes.text] = function () {
            $(this).dialog('close');

            var gridEditData = gridEdit.convertCriterionDataItemsToPocoArray(defaultOptions.gridEditCriterion);

            if (defaultOptions.beforeSend) {
                defaultOptions.beforeSend.apply({}, [gridEditData]);
            }

            $.ajaxCall(defaultOptions.saveURL, {
                data: gridEdit.makeGridEditDataAsJsonFormat(defaultOptions.gridEditCriterion, gridEditData),
                dataCount: defaultOptions.gridEditCriterion.length
            }, null, function (data, textStatus, jqXHR) {
                if (!data.Exception) {
                    $.each(defaultOptions.gridEditCriterion, function (index, value) {
                        $.each(value.data.items, function (index2, value2) {
                            value2.originalValue = (data.GridEditData[index][value2.fieldName] != null ? data.GridEditData[index][value2.fieldName] : '');
                        });

                        value.cudStatus = data.GridEditCudStatus[index];
                        value.recordState = data.GridEditRecordState[index];
                    });

                    gridEdit.saveDoneNotify(defaultOptions.gridEditCriterion);

                    if (defaultOptions.success) {
                        defaultOptions.success.apply({}, [data, textStatus, jqXHR]);
                    }
                } else if (data.Exception.Message) {
                    if ($('#confirmDialog2').length == 0) {
                        $(document.body).append("<div id=\"confirmDialog2\"></div>");
                        $('#confirmDialog2').dialog({
                            autoOpen: false,
                            modal: true,
                            dialogClass: 'confirm-dialog'
                        });
                    }

                    var buttons = {};
                    buttons[CommonI18n.common.ConfirmDialogYes.text] = function () {
                        $(this).dialog('close');
                    };
                    $('#confirmDialog2').dialog('option', 'title', CommonI18n.common.ConfirmDialogSaveTitle.text);
                    $('#confirmDialog2').text(data.Exception.Message);
                    $('#confirmDialog2').dialog('option', 'buttons', buttons);
                    $('#confirmDialog2').dialog('open');
                }
            }, null, null, null);
        };

        buttons[CommonI18n.common.ConfirmDialogNo.text] = function () {
            $(this).dialog('close');
        };

        $('#confirmDialog').dialog('option', 'title', CommonI18n.common.ConfirmDialogSaveTitle.text);
        $('#confirmDialog').text(CommonI18n.common.ConfirmDialogSaveText.text);
        $('#confirmDialog').dialog('option', 'buttons', buttons);
        $('#confirmDialog').dialog('open');
    }
};

GridEdit.prototype.showDeleteConfirmDialog = function (options) {
    var gridEdit = this;
    var defaultOptions = {
        deleteURL: null,
        gridEditCriterion: null,
        beforeSend: null,
        success: null
    };

    $.extend(defaultOptions, options);

    if (defaultOptions.gridEditCriterion.length > 0) {
        var gridEditData = gridEdit.convertCriterionDataItemsToPocoArray(defaultOptions.gridEditCriterion);

        if (defaultOptions.beforeSend) {
            defaultOptions.beforeSend.apply({}, [gridEditData]);
        }

        $.ajaxCall(defaultOptions.deleteURL, {
            data: gridEdit.makeGridEditDataAsJsonFormat(defaultOptions.gridEditCriterion, gridEditData),
            dataCount: defaultOptions.gridEditCriterion.length
        }, null, function (data, textStatus, jqXHR) {
            $.each(defaultOptions.gridEditCriterion, function (index, value) {
                value.cudStatus = data.GridEditCudStatus[index];
            });

            gridEdit.deleteDoneNotify(defaultOptions.gridEditCriterion);

            if (defaultOptions.success) {
                defaultOptions.success.apply({}, [data, textStatus, jqXHR]);
            }
        }, null, null, null);
    }
};

GridEdit.prototype.convertCriterionDataItemsToPocoArray = function (criterion) {
    var gridEditData = [];

    $.each(criterion, function (index, value) {
        var poco = {};

        poco.___recordState = ((value.recordState && value.recordState == '1') ? value.recordState : null);

        $.each(value.data.items, function (index2, value2) {
            poco[value2.fieldName] = {};
            poco[value2.fieldName].originalValue = value2.originalValue;
            poco[value2.fieldName].currentValue = value2.value;
        });

        gridEditData.push(poco);
    });

    return gridEditData;
};

GridEdit.prototype.makeGridEditDataAsJsonFormat = function (criterion, gridEditData) {
    $.each(criterion, function (index, value) {
        var poco = gridEditData[index];

        $.each(value.data.items, function (index2, value2) {
            poco[value2.fieldName].originalValue = JSON.stringify(poco[value2.fieldName].originalValue);
            poco[value2.fieldName].currentValue = JSON.stringify(poco[value2.fieldName].currentValue);
        });
    });

    return gridEditData;
};

GridEdit.prototype.fitToContainer = function () {
    $(this.gridContainer).css({
        overflow: 'auto',
        width: ($(document.body).width() - $('#menu')[0].offsetWidth - 15) + 'px',
        height: ($(window).height() - 130) + 'px'
    });
};

GridEdit.prototype.fitToContainer_80 = function () {
    $(this.gridContainer).css({
        overflow: 'auto',
        width: ($(document.body).width() - $('#menu')[0].offsetWidth - 15 - 5) + 'px',
        height: (($(window).height() - $('#Title').height() - 130) * 0.8) + 'px'
    });
};

GridEdit.prototype.fitToContainer_90_noWidth = function () {
    $(this.gridContainer).css({
        overflow: 'auto',
        // width: ($(document.body).width() - $('#menu')[0].offsetWidth - 15 - 5) + 'px',
        height: (($(window).height() - $('#Title').height() - 130) * 0.9) + 'px'
    });
};

GridEdit.prototype.fitToContainer_noWidth = function () {
    $(this.gridContainer).css({
        overflow: 'auto',
        height: (($(window).height() - $('#Title').height()) * 0.8) + 'px'
    });
};

GridEdit.prototype.fitToContainer_half = function () {
    $(this.gridContainer).css({
        overflow: 'auto',
        height: (($(window).height() - $('#Title').height() - 190) * 0.5) + 'px'
    });
};

$.newGUID = function () {
    var s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

$.createBlockDiv = function (options) {
    var defaultOptions = {
        newInstance: false
    };

    $.extend(defaultOptions, options);

    var blockDivId = 'samBlockDiv';
    var createNew = false;

    if (defaultOptions.newInstance) {
        blockDivId = $.newGUID();
        createNew = true;
    } else {
        if ($('#' + blockDivId).length == 0) {
            createNew = true;
        }
    }

    if (createNew) {
        $(document.body).append("<div id=\"" + blockDivId + "\" class=\"block-div opacity-3\"></div>");
    }

    var height = $(window).height();

    if ($(document.body).height() >= height) {
        height = $(document.body).height();
    }

    //var zIndex = Math.floor(new Date().getTime() / 1000);
    //var zIndex = zIndex4Top();

    $('#' + blockDivId).css({
        height: height + 'px',
        zIndex: zIndex4Top()
    });

    return $('#' + blockDivId);
};

$.samDialogType = {
    yes: 1,
    yesNo: 2
};

$.createDialog = function (options) {
    var defaultOptions = {
        dialogType: $.samDialogType.yesNo,
        dialogTitle: '',
        dialogContent: '',
        dialogContentId: null,
        dialogWidth: null,
        showContentIcon: true,
        showButtons: true,
        okCaption: null,
        noCaption: null,
        onClosingClicked: null,
        onCloseClicked: null,
        onOkClicked: null,
        onNoClicked: null
    };

    $.extend(defaultOptions, options);

    var blockDiv = $.createBlockDiv({
        newInstance: true
    });

    blockDiv.show();
    //$(document.body).css('overflow', 'hidden');

    var html = "";
    var samDialogId = $.newGUID();
    var samDialogTitleId = $.newGUID();
    var samDialogCloseId = $.newGUID();
    var samDialogContentIconId = $.newGUID();
    var samDialogContentId = $.newGUID();
    var samDialogContent = $.newGUID();
    var samDialogFooterId = $.newGUID();
    var samDialogOkId = $.newGUID();
    var samDialogNoId = $.newGUID();

    html += "<div id=\"" + samDialogId + "\" class=\"dialog-container ui-corner-all box-shadow\" draggable=\"true\" style=\"overflow: auto;\">";
    html += "<div class=\"dialog-title-container\" style=\"background:#dddddd;\">";
    html += "<div id=\"" + samDialogTitleId + "\" class=\"dialog-title-caption\"></div>";
    html += "<div id=\"" + samDialogCloseId + "\" class=\"dialog-close-default opacity-5\"><img src=\"" + $.defaultSettings.defaultCloseImageURL + "\"/></div>";
    html += "</div>";
    html += "<div class=\"dialog-content-container\">";
    html += "<div id=\"" + samDialogContentIconId + "\" class=\"dialog-content-icon\"></div>";
    html += "<div id=\"" + samDialogContentId + "\">";
    html += "<div id=\"" + samDialogContent + "\">";
    html += "</div>";
    html += "</div>";
    html += "<div id=\"" + samDialogFooterId + "\" class=\"dialog-footer\">";
    html += "<div class=\"dialog-button-container\">";
    html += "<input id=\"" + samDialogOkId + "\" type=\"button\" class=\"dialog-ok-default\" value=\"" + defaultOptions.okCaption + "\"/>";
    html += "<input id=\"" + samDialogNoId + "\" type=\"button\" class=\"dialog-no-default\" value=\"" + defaultOptions.noCaption + "\"/>";
    html += "</div>";
    html += "</div>";
    html += "</div>";

    $(document.body).append(html);

    if (defaultOptions.dialogWidth) {
        $('#' + samDialogId).css("width", defaultOptions.dialogWidth);
    }

    $('#' + samDialogTitleId).text(defaultOptions.dialogTitle);
    document.getElementById(samDialogContent).innerHTML = defaultOptions.dialogContent;

    if (document.getElementById(samDialogContent).scrollHeight > 400) {
        document.getElementById(samDialogContent).style.height = "80vh";
        document.getElementById(samDialogContent).style.overflow = "scroll";
    }

    $._setAnimationOn({
        on: $('#' + samDialogCloseId),
        defaultClass: 'dialog-close-default ui-corner-all opacity-5',
        hoverClass: 'dialog-close-default ui-corner-all',
        mousedownClass: 'dialog-close-default ui-corner-all opacity-5'
    });

    $._setAnimationOn({
        on: $('#' + samDialogOkId),
        defaultClass: 'dialog-ok-default ui-corner-all',
        hoverClass: 'dialog-ok-hover ui-corner-all',
        mousedownClass: 'dialog-ok-mousedown ui-corner-all'
    });

    $._setAnimationOn({
        on: $('#' + samDialogNoId),
        defaultClass: 'dialog-no-default ui-corner-all',
        hoverClass: 'dialog-no-hover ui-corner-all',
        mousedownClass: 'dialog-no-mousedown ui-corner-all'
    });

    $('#' + samDialogContentId).append($('#' + defaultOptions.dialogContentId));
    $('#' + defaultOptions.dialogContentId).show();

    if (defaultOptions.showContentIcon) {
        $('#' + samDialogContentIconId).show();
    } else {
        $('#' + samDialogContentIconId).hide();
    }

    if (defaultOptions.showButtons) {
        $('#' + samDialogFooterId).show();
        $('#' + samDialogFooterId + ' input[type=button]').hide();

        switch (defaultOptions.dialogType) {
            case $.samDialogType.yes:
                $('#' + samDialogOkId).show();

                break;
            case $.samDialogType.yesNo:
                $('#' + samDialogOkId).show();
                $('#' + samDialogNoId).show();

                break;
        }
    } else {
        $('#' + samDialogFooterId).hide();
    }

    $('#' + samDialogId).show();
    $('#' + samDialogId).css({
        top: (($(window).height() - $('#' + samDialogId).height()) / 2) + 'px',
        left: (($(window).width() - $('#' + samDialogId).width()) / 2) + 'px',
        //zIndex: zIndex + 1
        //zIndex: parseInt(blockDiv.css('z-index')) + 1
        //zIndex: parseInt(blockDiv[0].style.zIndex) + 1
        zIndex: zIndex4Top()
    });

    var keyCode27Handler = function (e) {
        if (e.keyCode == 27) {
            closeDialog();
        }
    };

    var closeDialog = function () {
        $(window).unbind('keyup', keyCode27Handler);

        blockDiv.remove();

        $('#' + defaultOptions.dialogContentId).hide();
        $(document.body).append($('#' + defaultOptions.dialogContentId));
        $('#' + samDialogId).remove();

        //$(document.body).css('overflow', 'visible');
    };

    $('#' + samDialogCloseId).bind('click', function () {
        if (defaultOptions.onClosingClicked) {
            defaultOptions.onClosingClicked.apply({}, [closeDialog]);
            return;
        }

        closeDialog();

        if (defaultOptions.onCloseClicked) {
            defaultOptions.onCloseClicked.apply({}, []);
        }
    });

    $('#' + samDialogOkId).bind('click', function () {
        closeDialog();

        if (defaultOptions.onOkClicked) {
            defaultOptions.onOkClicked.apply({}, []);
        }
    });

    $('#' + samDialogNoId).bind('click', function () {
        closeDialog();

        if (defaultOptions.onNoClicked) {
            defaultOptions.onNoClicked.apply({}, []);
        }
    });

    $(window).bind('keyup', keyCode27Handler);

    var target = null;
    var originalClientX = null;
    var originalClientY = null;

    $("#" + samDialogId).on('dragstart', function (e) {
        //一定要呼叫setData("Text", ""), 才會驅動drag
        e.originalEvent.dataTransfer.setData("Text", "");
        target = e.target;
        originalClientX = e.originalEvent.clientX;
        originalClientY = e.originalEvent.clientY;
    });

    $(window).off('dragover');
    $(window).on('dragover', function (e) {
        e.preventDefault();

        var offsetX = e.originalEvent.clientX - originalClientX;
        var offsetY = e.originalEvent.clientY - originalClientY;
        var left = $(target).offset().left;
        var top = $(target).offset().top;

        $(target).css({
            left: (left + offsetX) + "px",
            top: (top + offsetY) + "px"
        });

        originalClientX = e.originalEvent.clientX;
        originalClientY = e.originalEvent.clientY;
    });

    //return $('#' + samDialogId);
    return {
        _instance: $('#' + samDialogId),
        close: closeDialog
    };
};

PROG.onUnauthorized = $.showReLoginDialog = function () {
    var reLoginDialogId = "reLoginDialog";
    var reLoginFormId = "reLoginForm";
    var reLoginAccountId = "reLoginAccount";
    var reLoginPasswordId = "reLoginPassword";
    var reLoginDomainId = "reLoginDomain";
    var reLoginId = "reLogin";
    var reLoginResultId = "reLoginResult";
    var $reLoginDialog = $("#" + reLoginDialogId);
    var reLoginDialog = null;

    if ($reLoginDialog.length == 0) {
        $reLoginDialog = $(document.createElement("DIV"));

        $reLoginDialog.attr("id", reLoginDialogId);
        $reLoginDialog.addClass("reLoginContainer");

        var $reLoginImage = $(document.createElement("DIV"));

        $reLoginImage.addClass("relogin-image");
        $reLoginDialog.append($reLoginImage);

        var $reLoginForm = $(document.createElement("FORM"));

        $reLoginForm.attr("id", reLoginFormId);
        $reLoginForm.attr("method", "post");

        var $div1 = $(document.createElement("DIV"));
        var $account = $(document.createElement("DIV"));

        $account.addClass("relogin-account");
        $account.text(CommonI18n.common.WebLogin.Account.text);
        $div1.append($account);

        var $accountInput = $(document.createElement("INPUT"));

        $accountInput.attr("id", reLoginAccountId);
        $accountInput.attr("type", "text");
        $accountInput.addClass("relogin-account-input ui-corner-all");
        $div1.append($accountInput);
        $reLoginForm.append($div1);

        var $div2 = $(document.createElement("DIV"));
        var $password = $(document.createElement("DIV"));

        $password.addClass("relogin-password");
        $password.text(CommonI18n.common.WebLogin.Password.text);
        $div2.append($password);

        var $passwordInput = $(document.createElement("INPUT"));

        $passwordInput.attr("id", reLoginPasswordId);
        $passwordInput.attr("type", "password");
        $passwordInput.addClass("relogin-password-input ui-corner-all");
        $div2.append($passwordInput);
        $reLoginForm.append($div2);

        var $div3 = $(document.createElement("DIV"));
        var $domain = $(document.createElement("DIV"));

        $domain.addClass("relogin-domain");
        $domain.text(CommonI18n.common.WebLogin.Domain.text);
        $div3.append($domain);

        var $domainSelect = $("#" + reLoginDomainId);

        $domainSelect.addClass("relogin-domain-select ui-corner-all");
        $domainSelect.show();
        $div3.append($domainSelect);
        $reLoginForm.append($div3);

        var $div4 = $(document.createElement("DIV"));
        var $login = $(document.createElement("INPUT"));

        $login.attr("id", reLoginId);
        $login.attr("type", "submit");
        $login.val(CommonI18n.common.WebLogin.Login.text);
        $div4.append($login);
        $reLoginForm.append($div4);

        var $div5 = $(document.createElement("DIV"));

        $div5.attr("id", reLoginResultId);
        $div5.addClass("relogin-result");
        $reLoginForm.append($div5);
        $reLoginDialog.append($reLoginForm);
        $(document.body).append($reLoginDialog);

        $._setAnimationOn({
            on: $('#' + reLoginId),
            defaultClass: 'relogin-submit ui-corner-all',
            hoverClass: 'relogin-submit-hover ui-corner-all',
            mousedownClass: 'relogin-submit ui-corner-all'
        });
    }

    reLoginDialog = $.createDialog({
        dialogTitle: CommonI18n.common.WebLogin.reLoginTitle.text,
        dialogContentId: reLoginDialogId,
        dialogWidth: "460px",
        showContentIcon: false,
        showButtons: false
    });

    $('#' + reLoginAccountId).val(null);
    $('#' + reLoginPasswordId).val(null);
    $('#' + reLoginDomainId).val(null);
    $('#' + reLoginResultId).text("");
    $('#' + reLoginAccountId).focus();

    $('#' + reLoginFormId).off("submit");
    $('#' + reLoginFormId).on("submit", {
        _reLoginDialog: reLoginDialog
    }, function (e) {
        e.preventDefault();

        var data = {
            domain: $('#' + reLoginDomainId).val(),
            account: $('#' + reLoginAccountId).val(),
            password: $('#' + reLoginPasswordId).val(),
            rememberMe: false
        };

        $.ajaxCall($.defaultSettings.defaultAuthURL, data, null, function (msg) {
            $('#' + reLoginResultId).text('');

            if (msg.ErrorCode && msg.ErrorCode == -3) {
                $('#' + reLoginResultId).text(CommonI18n.common.WebLogin.LoginFailed.text);
                $('#' + reLoginPasswordId).focus();
            } else {
                if ((msg.ProgramPrivilege & PPVG.Execute) == PPVG.Execute) {
                    e.data._reLoginDialog.close();
                } else {
                    $('#' + reLoginResultId).text(CommonI18n.common.WebLogin.URNotAuthorized.text);
                }
            }
        }, function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText) {
                var responseText = JSON.parse(jqXHR.responseText);

                if (responseText && responseText.ErrorCode && responseText.ErrorCode == -3) {
                    $('#' + reLoginResultId).text(CommonI18n.common.WebLogin.LoginFailed.text);
                    $('#' + reLoginPasswordId).focus();
                }
            }
        }, null);
    });
};