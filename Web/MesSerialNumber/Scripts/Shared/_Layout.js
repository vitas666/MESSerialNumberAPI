/// <reference path="~/Views/Shared/_Layout.cshtml" />
/// <reference path="~/Scripts/Shared/CommonI18n.js" />
$(function () {
    $.renderUI({
        jQFormI18n: CommonI18n.common.WebLayout,
        callback1: function () {
        }
    });

    $('#menu div.menu-self').hover(function () {
        var level = $(this).attr('level');

        switch (level) {
            case '1':
                $("img.menu-icon", this).animate({ width: '44px' }, 100);
                break;
            case '2':
                $("img.menu-icon", this).animate({ width: '36px' }, 100);
                break;
            case '3':
                $("img.menu-icon", this).animate({ width: '28px' }, 100);
                break;
        }
    }, function () {
        var level = $(this).attr('level');

        switch (level) {
            case '1':
                $("img.menu-icon", this).animate({ width: '36px' }, 100);
                break;
            case '2':
                $("img.menu-icon", this).animate({ width: '28px' }, 100);
                break;
            case '3':
                $("img.menu-icon", this).animate({ width: '20px' }, 100);
                break;
        }
    });

    $('#menu div.menu-self').click(function () {
        $(this).parent().children('div.menu-child').toggle();
    });

    $('#menu div.menu-self[href]').click(function () {
        if ($('#showInNewTabCheckbox').is(':checked')) {
            window.open($(this).attr('href'), '_blank');
        } else {
            window.location.href = $(this).attr('href');
        }
    });

    $('#ShowMenu').click(function () {
        $(this).hide();
        $('#HideMenu').fadeIn('fast');
        $('#menu').fadeIn('fast');
        $('#menu').trigger($.Event('menuresize'));
    });

    $('#HideMenu').click(function () {
        $(this).hide();
        $('#ShowMenu').fadeIn();
        $('#menu').hide();
        $('#menu').trigger($.Event('menuresize'));
    });

    $.makeViewBodyToFitAvailableWidth();

    $(window).resize(function () {
        $.makeViewBodyToFitAvailableWidth();
    });

    $('#menu').on('menuresize', function () {
        $.makeViewBodyToFitAvailableWidth();
    });

});

