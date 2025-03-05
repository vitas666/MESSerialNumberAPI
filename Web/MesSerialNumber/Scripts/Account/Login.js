/// <reference path="~/Views/Shared/_Layout.cshtml" />
/// <reference path="~/Scripts/Shared/CommonI18n.js" />
$(function () {
    CommonI18n.common.WebLogin.Title = CommonI18n.MesSerialNumber.Title;
    msAjaxPageName = URL + "/Account/GridEditRetrieve";
    $.renderUI({
        jQFormI18n: CommonI18n.common.WebLogin,
        callback1: function () {
            $('#account').focus();
            $('#domain').addClass('ui-corner-all');

            if ($.browser.msie) {
                if ($.browser.version < 8) {
                    $('#Account').addClass('inline-block-ie6-2nd');
                    $('#Password').addClass('inline-block-ie6-2nd');
                    $('#Domain').addClass('inline-block-ie6-2nd');
                }

                if ($.browser.version < 9) {
                    if ($('div.banner-login-container').length > 0) {
                        $('div.banner-login-container').css({
                            backgroundColor: '#004F97'
                        });

                        $('div.banner-login').css({
                            backgroundColor: '#004F97'
                        });
                    } else {
                        $('div.banner - small').css({
                            backgroundColor: '#004F97'
                        });
                    }
                }
            }
        }
    });

    $.setAnimationOn(
        $('#Login'),
        'login-button ui-corner-all',
        'login-button-hover ui-corner-all',
        'login-button ui-corner-all'
    );

    $('#languageCodeContainer > span').click(function () {
        var expiresAt = new Date();

        expiresAt.setDate(new Date().getDate() + 365);

        var options = {
            //domain: '*.mydomain.com',
            //path: '/somedir',
            expiresAt: expiresAt,
            secure: false
        };

        $.cookie('languageCode', $(this).attr('language-code'), options);

        window.location.reload();
    });

    $('#form').submit(function (e) {
        e.preventDefault();

        var data = {
            domain: $('#domain').val(),
            account: $('#account').val(),
            password: $('#password').val(),
            //rememberMe: $('#rememberMe').attr('checked') ? true : false
            rememberMe: false
        };

        $.ajaxCall($.defaultSettings.defaultAuthURL, data, null, function (msg) {
            $('#loginResult').text('');

            if (msg.ErrorCode && msg.ErrorCode == -3) {
                $('#loginResult').text(CommonI18n.common.WebLogin.LoginFailed.text);
                $('#Password').focus();
            } else {
                if ((msg.ProgramPrivilege & PPVG.Execute) == PPVG.Execute) {
                    //window.location.href = $.defaultSettings.defaultMainActionURL;
                    var indexOfQM = window.location.href.indexOf("?");
                    var queryString = "";

                    if (indexOfQM >= 0) {
                        queryString = window.location.href.substring(indexOfQM);
                    }

                    window.location.href = $.defaultSettings.defaultMainActionURL + queryString;
                } else {
                    $('#loginResult').text(CommonI18n.common.WebLogin.URNotAuthorized.text);
                }
            }
        }, function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText) {
                var responseText = JSON.parse(jqXHR.responseText);

                if (responseText && responseText.ErrorCode && responseText.ErrorCode == -3) {
                    $('#loginResult').text(CommonI18n.common.WebLogin.LoginFailed.text);
                    $('#Password').focus();
                }
            }
        }, null);
    });
});