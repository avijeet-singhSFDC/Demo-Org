({
	assignValue : function(cmp, evt, hlp) {
        let damaged = cmp.get('v.damaged');
        let error = cmp.find('errorMsg');
        if (damaged == 'true') {
            $A.util.removeClass(error,'slds-hide');
        } else {
            $A.util.addClass(error,'slds-hide');
        }
	}
})