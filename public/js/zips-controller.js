(function () {
    'use strict';

    var $form = $('form#zips-form');

    $form.ajaxForm({
        beforeSubmit: function () {

        },

        success: function (data, status) {
            if (status === 'success' && data === 'ok') {
                alert('The Zip Codes were updated successfully.');
                window.location.replace('/staff/staffHomePage');
            }
        },

        error: function (xhr) {
            if(xhr.responseText !== 'Error')
            {
                alert(xhr.responseText);
            }
            else
            {
                window.location.replace('/staff/updateZipCodes/failure/failure');
            }
        }
    });

})();
