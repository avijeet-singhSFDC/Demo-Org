({
	
 
 	doInit : function(component, event, helper) {
        // Get a reference to the function defined in the Apex controller
		var getFieldLabels = component.get("c.getFieldLabels");
        getFieldLabels.setParams({
            "objName": component.get("v.obj")
        });
        
        if (component.get("v.showHeader")==false) {
            component.set("v.headerStyle","display:none;");
        }
        
        var fieldLabels = '';
        
        // Get a reference to the function defined in the Apex controller
        var getObjectData = component.get("c.getObjectData");
        
        getObjectData.setParams({
            "objid": component.get("v.recordId"),
            "objName": component.get("v.obj"),
            "predictionField": component.get("v.field"),
            "factorFields": component.get("v.factors"),
            "factorFieldsField": component.get("v.factorsField")
        });
        
        // Register the callback function
        getObjectData.setCallback(this, function(response) {
            var resp = response.getReturnValue();
            if (resp==null) {
                component.set("v.predictionName","Bad Query - Check Fields");
                return;
            }
            var data = JSON.parse(resp);
            
            var formattedScore = "N/A";
            var score = "N/A";
            if (data.hasOwnProperty(component.get("v.field"))) {
            	score = data[component.get("v.field")];
                score = Math.floor(score*100);
                formattedScore = component.get("v.showAsPercentage")?score+"%":score;
        	}
                                  
            component.set("v.score", formattedScore);
            if (score<=component.get("v.redZoneThreshold")) {
                component.set("v.circlecolor","goodnum");
            } else {
                component.set("v.circlecolor","badnum");
            }
            
            //helper.drawCanvas(component.find('scoreCanvas').getElement(),score);
           
            component.set("v.factor_conf1", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
            component.set("v.factor_conf2", "https://www.dropbox.com/s/buq92zivq2xlt84/2green.png?raw=1");
            component.set("v.factor_conf3", "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
            component.set("v.factor_conf4", "https://www.dropbox.com/s/16qgs3k03fwbeji/1green.png?raw=1");
            component.set("v.factor_conf5", "https://www.dropbox.com/s/904nmmscy4h7v3a/1red.png?raw=1");
            
            var factorFields = component.get("v.factors");
            var factorFieldsField = component.get("v.factorsField");
            if (factorFieldsField!=null && factorFieldsField!="" && data.hasOwnProperty(factorFieldsField)) {
                factorFields = data[factorFieldsField];
            }

            var factors = factorFields.split(",");
                       
            
            if (factors.length>0) {
            	var cnt;
                
                for (cnt=0;cnt<5;cnt++) {
                    var factor = factors[cnt];
                    var fieldLabel = fieldLabels[factor];
                    var fieldName = fieldLabel + " is";
                    
                    var factorValue = data.hasOwnProperty(factor)?data[factor]:"<Blank>";
                    
                    component.set("v.factor_name"+(cnt+1), fieldName);
                    component.set("v.factor_value"+(cnt+1), factorValue);
                    
                    var factor_conf = component.get("v.factor_conf" + (cnt+1));
                    
                    if(factor_conf.includes('green')){
                        component.set("v.factor_shown_red"+(cnt+1), "display:none;");
                        component.set("v.factor_shown_green"+(cnt+1), "display:inline;");
                    }
                    else{
                        component.set("v.factor_shown_red"+(cnt+1), "display:inline;");
                        component.set("v.factor_shown_green"+(cnt+1), "display:none;");
                    }
                }
            }
        });
        
        
        getFieldLabels.setCallback(this, function(response) {
            var resp = response.getReturnValue();
            fieldLabels = JSON.parse(resp);
        	
            // Invoke the service
            $A.enqueueAction(getObjectData);
        });
                                   
        $A.enqueueAction(getFieldLabels);
    },
       
    scriptLoaded : function (component, event, helper){
        
    }
})