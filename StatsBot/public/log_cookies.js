$(document).ready(function () {
    // page load: load cookie text, input
    if (getCookieValue('StatsBot_Region') == '') { // get cookie
        $('#region').val(''); //  Client does not see this value. Set to '' so it is considered empty by 'required' validator (whereas any text is considered valid). 
        $('.region-panel #select_region').text('Region'); // Client sees this and think they have not set region.
    }
    else {
        $('#region').val(getCookieValue('StatsBot_Region')); // Returning Clients get their region automatically filled.
        $('.region-panel #select_region').text(getCookieValue('StatsBot_Region')); // Client sees this and think they have set region (which is set).
    }
});

function getCookieValue(cookie) { // Outsourced quick-search cookie string
    var b = document.cookie.match('(^|;)\\s*' + cookie + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function setCookieRegion(c_name, c_value) { // set cookie
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 10 * 365); // set cookie expire 10 years from now (hopefully this website can survive for 10 years!)
    var c_value = escape(c_value) + ((expireDate == null) ? "" : ";expires=" + expireDate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}