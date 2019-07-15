({
    init: function(component, event, helper){
    	helper.getSettings(component, event, helper);
	},
    navClick : function(component, event, helper) {
        var source = event.getSource();
        var label = source.get("v.label");
        component.set("v.ScreenChoice",label)
    },
    IndustryChange  : function(component, event, helper) {
        component.set("v.MenuOpenClose",'open');
        component.set("v.CompetedTotal",0);
        component.set("v.CompetedTotalPercent",0);
    },
    toNextPage : function(component, event, helper) {
        var currentpage = component.get("v.ScreenChoice");
        if(currentpage == 'Home'){
            component.set("v.ScreenChoice",'Brand');
            component.set("v.ComponentTitle", "Getting to know your brand");
            component.set("v.BrandCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Brand'){
            component.set("v.ScreenChoice",'Personas');
            component.set("v.ComponentTitle", "Getting to know your PERSONAS");
            component.set("v.PersonaCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Personas'){
            component.set("v.ScreenChoice",'Solutions');
            component.set("v.ComponentTitle", "Getting to know your solutions");
            component.set("v.SolutionsCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Solutions'){
            component.set("v.ScreenChoice",'Partners');
          	component.set("v.ComponentTitle", "Getting to know your partners");
            component.set("v.PartnersCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Partners'){
            component.set("v.ScreenChoice",'Features');
          	component.set("v.ComponentTitle", "Getting to know your Customizations");
            component.set("v.FeaturesCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }  
        else if(currentpage == 'Features'){
            component.set("v.ScreenChoice",'Resources');
          	component.set("v.ComponentTitle", "Getting to know your resources");
            component.set("v.ResourcesCompleted",1);
            helper.calculateWelcome(component, event, helper);
        } 
        else if(currentpage == 'Resources'){
            component.set("v.ScreenChoice",'Setup');
          	component.set("v.ComponentTitle", "Getting to know your Setup Steps");
            component.set("v.SetupCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }  
    },
    toPreviousPage : function(component, event, helper) {
    	var currentpage = component.get("v.ScreenChoice");
        if(currentpage == 'Brand'){
            component.set("v.ScreenChoice",'Home');
            component.set("v.ComponentTitle", "Getting to know your IDO");
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Personas'){
            component.set("v.ScreenChoice",'Brand');
            component.set("v.ComponentTitle", "Getting to know your brand");
            component.set("v.BrandCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Solutions'){
            component.set("v.ScreenChoice",'Personas');
          	component.set("v.ComponentTitle", "Getting to know your personas");
            component.set("v.PersonaCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Partners'){
            component.set("v.ScreenChoice",'Solutions');
          	component.set("v.ComponentTitle", "Getting to know your solutions");
            component.set("v.SolutionsCompleted",1);
            helper.calculateWelcome(component, event, helper);
        }else if(currentpage == 'Features'){
            component.set("v.ScreenChoice",'Partners');
          	component.set("v.ComponentTitle", "Getting to know your partners");
            component.set("v.PartnersCompleted",1);
            helper.calculateWelcome(component, event, helper);
        } 
        else if(currentpage == 'Resources'){
            component.set("v.ScreenChoice",'Features');
          	component.set("v.ComponentTitle", "Getting to know your Customizations");
            component.set("v.FeaturesCompleted",1);
            helper.calculateWelcome(component, event, helper);
        } 
        else if(currentpage == 'Setup'){
            component.set("v.ScreenChoice",'Resources');
          	component.set("v.ComponentTitle", "Getting to know your Resources");
            helper.calculateWelcome(component, event, helper);
        } 
    },
    OpenMenu : function(component, event, helper) {
        component.set("v.MenuOpenClose",'open');
    },
    toHome : function(component, event, helper) {
        component.set("v.ComponentTitle", "GETTING TO KNOW THE RCG IDO");
        component.set("v.ScreenChoice",'Home');
        component.set("v.Industry",'');
        component.set("v.MenuOpenClose",'close');
        component.set("v.CompetedTotal",0);
        component.set("v.CompetedTotalPercent",0);
        component.set("v.BrandCompleted",0);
        component.set("v.PersonaCompleted",0);
        component.set("v.SolutionsCompleted",0);
        component.set("v.ResourcesCompleted",0);
        component.set("v.PartnersCompleted",0);
        component.set("v.SetupCompleted",0);
        component.set("v.FeaturesCompleted",0);
    },
    
})