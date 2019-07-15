trigger PanelDesignComponentTrigger on Panel_Design_Component__c (before insert, before update) {

    for(Panel_Design_Component__c panelDesignComponent : Trigger.New){
        if(panelDesignComponent.Offset_X__c == null){
            panelDesignComponent.Offset_X__c = 0;
        }
       if(panelDesignComponent.Offset_Y__c == null){
            panelDesignComponent.Offset_Y__c = 0;
        }
    }
}