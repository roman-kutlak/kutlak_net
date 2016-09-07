/**
 * Created by roman on 03/09/2016.
 */

// https://github.com/mlouro/django-js-utils

var dutils = {};
dutils.conf = {};

dutils.urls = function () {

    function _get_path(name, kwargs, urls) {

        var path = urls[name] || false;

        if (!path) {
            throw('URL not found for view: ' + name);
        }

        var _path = path;

        var key;
        for (key in kwargs) {
            if (kwargs.hasOwnProperty(key)) {
                if (!path.match('<' + key + '>')) {
                    throw(key + ' does not exist in ' + _path);
                }
                path = path.replace('<' + key + '>', kwargs[key]);
            }
        }

        var re = new RegExp('<[a-zA-Z0-9-_]{1,}>', 'g');
        var missing_args = path.match(re);
        if (missing_args) {
            throw('Missing arguments (' + missing_args.join(", ") + ') for url ' + _path);
        }

        return path;

    }

    return {

        resolve: function (name, kwargs, urls) {
            if (!urls) {
                urls = dutils.conf.urls || {};
            }

            return _get_path(name, kwargs, urls);
        }

    };

}();


// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
