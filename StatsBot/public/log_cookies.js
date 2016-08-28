$(document).ready(function () {
    // page load: load cookie text, input
    if (getCookieValue('StatsBot_Region') == '') {
        $('#region').val('Region');
        $('.region-panel #select_region').text('Region');
    }
    else {
        $('#region').val(getCookieValue('StatsBot_Region'));
        $('.region-panel #select_region').text(getCookieValue('StatsBot_Region'));
    }
});

function getCookieValue(cookie) {
    var b = document.cookie.match('(^|;)\\s*' + cookie + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function setCookieRegion(c_name, c_value) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 10 * 365);
    var c_value = escape(c_value) + ((expireDate == null) ? "" : ";expires=" + expireDate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}