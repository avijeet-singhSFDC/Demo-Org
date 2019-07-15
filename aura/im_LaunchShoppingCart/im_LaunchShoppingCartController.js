({
	doInit : function(cmp, evt, hlp) {
		let rec = cmp.get('v.recordId');
        console.log(rec);
        let cont = cmp.get('c.getContName');
        cont.setParams({objId : rec});
        cont.setCallback(this,function(res){
            console.log(res.getReturnValue());
            cmp.set('v.contName',res.getReturnValue());
        });
        $A.enqueueAction(cont);
        let usr = cmp.get('c.getUser');
        usr.setCallback(this,function(res){
            cmp.set('v.userName',res.getReturnValue());
        });
        $A.enqueueAction(usr);
	},
    toggleModal : function(cmp, evt, hlp) {
        let modal = cmp.find('modal');
        let backdrop = cmp.find('backdrop');
        $A.util.toggleClass(modal, 'slds-fade-in-open');
        $A.util.toggleClass(backdrop, 'slds-backdrop_open');
    },
})