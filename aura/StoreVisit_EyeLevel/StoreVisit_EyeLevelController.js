({
	assignValue : function(cmp, evt, hlp) {
		let eyeLevel = cmp.get('v.eyeLevel');
        let error = cmp.find('errorMsg');
        if (eyeLevel == 'false') {
            $A.util.removeClass(error,'slds-hide');
        } else {
            $A.util.addClass(error,'slds-hide');
        }
	}
})