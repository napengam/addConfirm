function addConfirm(other = null) {
    //
    // any clickable objects cb inside document instrumented 
    // with dummy class 'need-confirm' or other class if given
    //
    var cb;
    if (other === null) {
        cb = document.querySelectorAll('.need-confirm');
    } else {
        cb = document.querySelectorAll('.need-confirm,' + other);
    }
    cb.forEach(elem => {
        // 
        // as we don't know if the element has allready any
        // event listeners we clone the element, to get rid of them.
        // We keep a referenc to the original element and make this one
        // disapear and replace the origin with the clone  instead.
        // 
        let clone = elem.cloneNode(true);
        clone.elemOnclick = elem.onclick;
        elem.onclick = '';
        clone.clonedFromOrigin = elem;
        clone.clonedFromOriginParent = elem.parentNode;
        elem.replaceWith(clone);
        clone.clonedFromOrigin.style.display = 'none';
        // 
        // we now apply the confirm dialog to the clone
        //
        clone.removeEventListener('click', confirmIfClicked);
        clone.addEventListener('click', confirmIfClicked);
        // *****************************************
        // while we loose all eventListeners when cloning
        // the node, we can delegate events to the original
        // node using the function below
        // ******************************************
        delegateOtherEvents(clone);
    });

    function confirmIfClicked(e) {


        // stop any further procesing

        e.stopPropagation();
        e.preventDefault();

        // *****************************************
        // open dialog and call it with the current 
        // value of 'this' that will point here 
        // to the clone of the original node 
        // ******************************************

        callYourDialog.call(this);


    }
    function callYourDialog() {
        // *****************************************
        // As an example:
        // open simple dialog provided by the calling
        // page.
        // You probably have to adapt this function to
        // work with the dialog of your choice
        // The value of this should point to the clone
        // of the original element, else yes() or no() can't
        // find the event target. 
        // ******************************************

        let diag = document.getElementById('confirm');
        diag.querySelector('#cyes').onclick = yes.bind(this);
        diag.querySelector('#cno').onclick = no.bind(this);
        diag.showModal();

        function yes() { // YES
            diag.close();
            //*****
            // press this button again
            // we clicked on a clone so redirect the click to the
            // original element to execute any event listeners now.
            //*****
            let fireOnThis = this.clonedFromOrigin;
            fireOnThis.onclick = this.elemOnclick;
            //*****
            // give original node  back to parent
            //*****
            this.clonedFromOriginParent.appendChild(fireOnThis);
            // *****************************************
            // stop clone from asking have original node
            // handle the onclick event
            // ******************************************
            this.removeEventListener('click', confirmIfClicked);
            fireEvent(fireOnThis, 'click');
            // *****************************************
            // enable clone again for event 'onclick'
            // ******************************************
            this.addEventListener('click', confirmIfClicked);
        }
        function no() {
            diag.close();

        }
    }

    function delegateOtherEvents(clone) {
        // *****************************************
        // all events in the array are delegated to the
        // original node.  
        // ******************************************
        ['mouseover', 'mouseout'].forEach((evt) => {
            clone.addEventListener(evt, () => {
                fireEvent(clone.clonedFromOrigin, evt);
            }, true);
        });

    }
    function fireEvent(fireOnThis, eventType) {
        fireOnThis.dispatchEvent(new MouseEvent(eventType, window.event));
}
}
