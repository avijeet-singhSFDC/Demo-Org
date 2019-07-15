({
	init : function(cmp, evt, hlp) {
		let flow = cmp.find("storeVisit");
        let storeVisit = cmp.get('v.storeVisitId');
        let acctId = cmp.get('v.acctId');
        let inputVariables = [{name: "StoreVisitId", type: "String", value: storeVisit},
                              {name: 'acctId', type: "String", value: acctId}];
        flow.startFlow("Store_Visit", inputVariables);
	},
    goToStoreVisit : function(cmp,evt,hlp) {
        let storeVisit = cmp.get('v.storeVisitId');
        console.log(evt.getParam("status"));
        if(evt.getParam("status") === "FINISHED") {
            let urlEvent = $A.get("e.force:navigateToSObject");
            urlEvent.setParams({
               "recordId": storeVisit,
               "isredirect": "true"
            });
            urlEvent.fire();
        }
    }
})