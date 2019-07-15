({
    loadPreviousProducts : function(cmp, event, helper) {
        let sv = cmp.get('v.storeVisitId');
        console.log('storeVisit*************', sv);
        var action = cmp.get("c.addPastProducts");
        action.setParams({ storeVisitId : sv });
        action.setCallback(this, function(response) {
            var name = response.getState();
            if (name === "SUCCESS") {
                console.log('First Success: ',response.getReturnValue());
                cmp.set("v.records",response.getReturnValue())
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
    },
    EditProductDialog : function(component, event, helper) {
  		var whichOne = event.currentTarget.id;
        console.log('id selected: ' + whichOne);
        component.set('v.SelectedProductId',whichOne);

        var cmpTarget = component.find('EditProductModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },
    CloseDialog: function(component, event, helper) {
        var cmpTarget = component.find('EditProductModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-closed');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_closed');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_open');
    },
    handleProductSaved: function(component, event, helper) {
        let sv = component.get('v.storeVisitId');
        var action = component.get("c.getProducts2");
        action.setParams({ storeVisitId : sv });
        action.setCallback(this, function(response) {
            var name = response.getState();
            if (name === "SUCCESS") {
                component.set("v.records",response.getReturnValue())
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
        
        var cmpTarget = component.find('EditProductModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-closed');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_closed');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_open');
    },
    searchAdd : function(cmp, event) {

        var records = cmp.get('v.records');
        records = JSON.parse(JSON.stringify(records));
        console.log('searchAdd records: ',records);
        var action = cmp.get('c.searchProducts');
        
        action.setParams({ pId : cmp.get("v.newRecord") });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state) {
                console.log('action.getReturnValue: ',response.getReturnValue());

                console.log('searchAdd pre-push records: ',records);
                records.push(response.getReturnValue());

                console.log('searchAdd post-push records: ',records);
                
                cmp.set("v.records",records);
                console.log('searchAdd after-set records: ',records);
                
                var backdrop = cmp.find('backdrop');
                var modal = cmp.find('modal');
                
                $A.util.addClass(modal, 'slds-hide');
                $A.util.removeClass(backdrop, 'slds-backdrop_open');
                
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
        
    },
    addProduct : function(cmp, event, helper) {
        console.log("search")
		let r = cmp.get('v.newProductPresent')
        //console.log("productPresent: ",JSON.stringify(newProductPresent))   
        
        var records = cmp.get('v.records');
        records = JSON.parse(JSON.stringify(records));
        console.log('records: ',records);
        //let r = cmp.get("v.newRecord");
        
        var action = cmp.get('c.newProduct');
        
        console.log("r: ",r);
        var myBlankLookup = cmp.find("lookup2").get("v.selectedRecord");
        let storeVisitId = cmp.get('v.storeVisitId');

        action.setParams({"name": r.Name__c, "quantity": r.Quantity__c, "notes": r.Notes__c, "price": r.Price__c, "location": r.Location_Aisle__c, "name2": myBlankLookup.Id, "storeVisit": storeVisitId});
        
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            
            if (state) {
                console.log('action.getReturnValue: ',response.getReturnValue());

                console.log('searchAdd pre-push records: ',records);
                records.push(response.getReturnValue());

                console.log('searchAdd post-push records: ',records);
                
                cmp.set("v.records",records);
                console.log('searchAdd after-set records: ',records);
                
                helper.closeModal(cmp, event)
                
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
        
        var backdrop = cmp.find('overlay');
        var modal = cmp.find('add-modal');
        
        $A.util.addClass(modal, 'slds-hide');
        $A.util.removeClass(backdrop, 'slds-backdrop_open');
    },
    
    addOpen : function(cmp, event) {
        
        var backdrop = cmp.find('overlay');
        var modal = cmp.find('add-modal');
        
        $A.util.removeClass(modal, 'slds-hide');
        $A.util.addClass(backdrop, 'slds-backdrop_open');
    },
    
    addClose : function(cmp, event) {
        
        var backdrop = cmp.find('overlay');
        var modal = cmp.find('add-modal');
        
        $A.util.addClass(modal, 'slds-hide');
        $A.util.removeClass(backdrop, 'slds-backdrop_open');
    },
    
        open : function(cmp, event) {
        
        var backdrop = cmp.find('backdrop');
        var modal = cmp.find('modal');
        
        $A.util.removeClass(modal, 'slds-hide');
        $A.util.addClass(backdrop, 'slds-backdrop_open');
    },
    
    close : function(cmp, event) {
        
        var backdrop = cmp.find('overlay');
        var modal = cmp.find('modal');
        
        $A.util.addClass(modal, 'slds-hide');
        $A.util.removeClass(backdrop, 'slds-backdrop_open');
    },
    
    append : function(cmp, event) {
        
        var location = cmp.find("locationid").get("v.value");
        console.log(cmp.get("v.location"));
        //var test = cmp.find("location");
        console.log(location);
       	//console.log(location.get("v.value"));
        /*var name = 
        var quantity = 
        cmp.set("v.records",records);
        cmp.get("")
         $A.createComponent(
            "aura:html",
            { tag: "td",
                body: 'value',
                HTMLAttributes:{"id": "Temp","class": "class name here"}
            },
            function(newCmp, status, errorMessage){
                var container = cmp.find('root');
                console.log("WE ARE IN FUNCTION, before if");
                if (cmp.isValid() && container.isValid() && status === 'SUCCESS') {
                    var body = container.get("v.body");
                    body.push(newCmp);
                    container.set("v.body", body);
                }
            }
         )*/
         }
})