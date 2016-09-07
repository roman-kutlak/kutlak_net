

$(function () {
    $('#translate-button').on('click', function (e) {
        console.log('translating...');
        e.preventDefault(); // preventing default click action
        form_data = $('#translation-form').serialize('formula-area');
        var simplifications = []
        $('#applied-simplification-list li').each(function () {
            simplifications.push($(this).data('applied-simplification-name'));
        });
        if (simplifications.length > 0) {
            form_data += '&simplifications=';
            for (i = 0; i < simplifications.length; ++i) {
                form_data += simplifications[i] + '|';
            }
        }
        console.log(form_data);
        var endpoint = location.protocol + '//' + location.hostname + ':' + location.port;
        $.ajax({
            url: endpoint + '/snappy/translate/',
            type: 'post',
            data: form_data,
            success: function (response) {
                console.log('response received');
                console.log(response.text);
                $('#translation').text(response.text);
                var $translation = $('#translation-container');
                if (response.status === "success") {
                    $translation.removeClass('default-border');
                    $translation.removeClass('error-border');
                    $translation.removeClass('success-border');
                    $translation.addClass('success-border');
                } else if (response.status === "error") {
                    $translation.removeClass('default-border');
                    $translation.removeClass('error-border');
                    $translation.removeClass('success-border');
                    $translation.addClass('error-border');
                } else {
                    $translation.removeClass('default-border');
                    $translation.removeClass('error-border');
                    $translation.removeClass('success-border');
                    $translation.addClass('default-border');
                }
                if (response.messages) {
                    var placeholder = $('#messages');
                    var data = $.parseJSON(response.messages);
                    for (var i = 0; i < data.length; ++i) {
                        var msg = $('<div class="message alert"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a></div>');
                        msg.append(data[i][1]);
                        msg.addClass('alert-' + data[i][0]);
                        placeholder.append(msg);
                    }
                }
            }, error: function (request, textStatus, errorThrown) {
                console.log('ajax failed');
                $('#translation').text(request.text)
            }
        });
    });
});

// enable popovers (for help)
$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
});

$("#toggle-simplifications").click(function () {
    // show/hide simplifications
    $button = $(this);
    //getting the next element
    $content = $("#simplifications");
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of the button based on visibility of content div
        $button.html(function () {
            //change text based on condition
            var show = 'Show Simplifications <span class="glyphicon glyphicon-menu-down"></span>'
            var hide = 'Hide Simplifications <span class="glyphicon glyphicon-menu-up"></span>'
            return $content.is(":visible") ? hide : show;
        });
    });
});

// enable sorting simplifications
$(function () {
    $("#applied-simplification-list").sortable();
    $("#applied-simplification-list").disableSelection();
});

function updateAppliedSimplificationCount() {
    var placeholder = $('#num-applied-simplifications');
    var numItems = $('#applied-simplification-list li').length;
    if (numItems > 0) {
        placeholder.text('No. of applied simplifications: ' + numItems);
        placeholder.removeClass('text-muted');
        placeholder.addClass('text-info');
    } else {
        placeholder.text('No simplifications applied');
        placeholder.addClass('text-muted');
        placeholder.removeClass('text-info');
    }
}

// enable removing simplifications
$(function () {
    $('.remove-simplification-btn').click(function () {
        var simplId = $(this).data('applied-simplification-btn-id');
        $('[data-applied-simplification-id="' + simplId + '"]').remove();
        updateAppliedSimplificationCount();
    });
});

// enable adding simplifications
$(function () {
    $('.add-simplification-btn').click(function () {
        // get the highest ID and increment the counter
        var simplificationList = $('#applied-simplification-list');
        var maxId = simplificationList.data('max-simplification-id');
        simplificationList.data('max-simplification-id', maxId + 1);
        // get the simplification name
        var name = $(this).data('simplification-name');
        // create a new element
        var item = $('\
        <li class="simplification-list-item" data-applied-simplification-name="' + name + '" data-applied-simplification-id="' + maxId + '">\
          <div>\
            <button class="btn btn-success btn-sm simplification-btn remove-simplification-btn" data-applied-simplification-btn-id="' + maxId + '">\
              Remove <span class="glyphicon glyphicon-minus-sign"></span>\
            </button>\
            <div id="simplification-fn-qm" class="simplification-div">\
              <span class="glyphicon glyphicon-move"></span>\
              <span class="simplification-name">' + name + '</span>\
            </div>\
          </div>\
        </li>\
        ');
        // connect the signal
        item.find('.remove-simplification-btn').click(function () {
            var simplId = $(this).data('applied-simplification-btn-id');
            $('[data-applied-simplification-id="' + simplId + '"]').remove();
            updateAppliedSimplificationCount();
        });
        // append to the end of the list
        simplificationList.append(item);
        updateAppliedSimplificationCount();
    });

});
