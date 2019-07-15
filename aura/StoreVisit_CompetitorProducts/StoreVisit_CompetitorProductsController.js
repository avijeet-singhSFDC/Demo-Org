({
    doInit: function(cmp,evt,hlp) {

    },
    AddCompetitorProduct : function(cmp, event, helper) {
        console.log('Store Visit ID: ' + cmp.get('v.storeVisit'));
        console.log('Quantity: ' + cmp.get('v.quantity'));
        console.log('Price: ' + cmp.get('v.price'));
        console.log('Competitor: ' + cmp.get('v.competitor'));
        let attach = cmp.get('c.assignCompProduct');
        attach.setParams({
            storeVisitId: cmp.get('v.storeVisit'),
            qty: cmp.get('v.quantity'),
            price: cmp.get('v.price'),
            comp: cmp.get('v.competitor')
        });
        attach.setCallback(this,function(response){
            console.log('Response is: ' + response.getReturnValue());
            var name = response.getState();
            if (name === "SUCCESS") {
            	cmp.set("v.products",response.getReturnValue());
            }
        });
        $A.enqueueAction(attach);
    },
    auditFields : function(cmp, event, helper) {
		let error = cmp.find('errorMsg');
        $A.util.removeClass(error,'slds-hide');
	},
    handleError : function(cmp,evt,hlp) {
        console.log('error');
        debugger;
    }
})