
function addConfirm(selector = '.need-confirm') {
    let elements = document.querySelectorAll(selector);
    let currentTarget = null, dialog, yesBtn, noBtn;

    elements.forEach(el => {
        if (el.dataset.confirmBound === 'true') {
            return;
        }
        el.dataset.confirmBound = 'true';
        el.addEventListener('click', function (e) {

            if (e.target.dataset.confirmBound === 'false') {
                return;
            }
            e.target.dataset.confirmBound = 'true';
            // Intercept click
            e.preventDefault();
            e.stopPropagation();

            // Set current target for confirm dialog
            currentTarget = el;


            openDialog();
            
        }, true); // capture = true
    });
    
    function openDialog() {
        // *****************************************
        // you might need to adapt this to the dialogs
        // you are using. This is just an example. 
        // ******************************************

        dialog = document.getElementById('confirm');
        dialog.showModal();
        yesBtn = dialog.querySelector('#cyes');
        noBtn = dialog.querySelector('#cno');
        yesBtn.onclick = yes;
        noBtn.onclick = no;
    }

    function yes() {
        yesBtn.onclick = noBtn.onclick = null;
        if (!currentTarget)
            return;

        // Temporarily unbind interceptor to avoid recursion
        currentTarget.dataset.confirmBound = 'false';

        // Redispatch original click
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        currentTarget.dispatchEvent(event);

        // Rebind after dispatch
        currentTarget.dataset.confirmBound = 'true';
        dialog.close();
        currentTarget = null;
    }
    ;

    function no() {
        yesBtn.onclick = noBtn.onclick = null;
        dialog.close();
        currentTarget = null;
    }
    ;
}
