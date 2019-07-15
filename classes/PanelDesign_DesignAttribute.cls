global class PanelDesign_DesignAttribute extends VisualEditor.DynamicPickList {

    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultDataRow = new VisualEditor.DataRow('None','None');
        return defaultDataRow;
    }
    
    global override VisualEditor.DynamicPickListRows getValues(){
        VisualEditor.DataRow defaultDataRow = getDefaultValue();
        List<Panel_Design__c> panelDesigns = [SELECT Id,sObject_Name__c,Panel_Design_Name__c FROM Panel_Design__c];
        VisualEditor.DynamicPickListRows dynamicPickListRows = new VisualEditor.DynamicPickListRows();
        dynamicPickListRows.addRow(defaultDataRow);
        for(Panel_Design__c panelDesign : panelDesigns){
            String label = panelDesign.Panel_Design_Name__c;
            if(panelDesign.sObject_Name__c!=null && panelDesign.sObject_Name__c!='')
                label+= ' - '+panelDesign.sObject_Name__c;
            dynamicPickListRows.addRow(new VisualEditor.DataRow(label,String.valueOf(panelDesign.Id)));
        }
        return dynamicPickListRows;
    }
}