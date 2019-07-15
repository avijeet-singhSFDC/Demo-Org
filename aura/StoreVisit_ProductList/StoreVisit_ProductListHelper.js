({
    closeModal : function(cmp, event) {
        var backdrop = cmp.find('backdrop');
        var modal = cmp.find('add-modal');
        
        $A.util.addClass(modal, 'slds-hide');
        $A.util.removeClass(backdrop, 'slds-backdrop_open');
    },
})