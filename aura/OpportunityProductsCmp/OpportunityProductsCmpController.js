({
	doInit : function(component, event, helper) {
        var vlstProd = [];
        vlstProd = component.get('v.lstOppProducts');
        console.log('::vlstProd.length::'+vlstProd.length);
        if(vlstProd.length === 0){
        	helper.queryProducts(component, event);
        }else{
            component.set('v.lstOppProducts',vlstProd);
        }
	},
    productSearch :  function(component, event, helper) {
       helper.queryProducts(component, event);
    },
    selectedProducts : function(component,event){
        var vSelectedProducts = component.get("v.lstOppProducts");
        var vRecordId = component.get('v.recordId');
        var vOppProducts = [];
        for(var i=0; i < vSelectedProducts.length; i++){
            if(vSelectedProducts[i].bSelect == true){
                vOppProducts.push(vSelectedProducts[i]);
            }
        }
        console.log('new list:'+vOppProducts);
        if(vOppProducts.length > 0){
            //console.log('new list:'+select[0].flag);
            component.set("v.selectedProducts",vOppProducts);
            console.log('selected products');
            var evt = $A.get("e.force:navigateToComponent");
            evt.setParams({
                componentDef : "c:SelectedProductsCmp",
                componentAttributes: {
                    'selectedProducts' : vOppProducts,
                    'recordId' : vRecordId
                }
            });
            evt.fire();
        }else{
            console.log('no record::');
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'sticky',
                message: 'Please select a record.',
                type: 'info',
            });
            toastEvent.fire();
            
        }
    },
    cancel: function(component,event){
        var urlEvent = $A.get("e.force:navigateToURL");
        var urlId =  component.get('v.recordId');
        urlEvent.setParams({
            "url": "/"+urlId
        });
        urlEvent.fire();   
    }
})