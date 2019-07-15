({
	assignValue : function(cmp, event, helper) {
		let replace = cmp.get('v.prodReplace');
        let error = cmp.find('errorMsg');
        if (replace == 'true') {
            $A.util.removeClass(error,'slds-hide');
        } else {
            $A.util.addClass(error,'slds-hide');
        }
	}
})