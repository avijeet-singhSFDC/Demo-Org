public class DE_HighlightPanelConfigController {
    
    public static boolean orgHasStandardPanelDesigns{get;set;}
    
    public DE_HighlightPanelConfigController(){
        List<Panel_Design__c> standardPanelDesigns = [SELECT Id FROM Panel_Design__c WHERE isDefaultPanel__c = true];
        if(standardPanelDesigns.size() > 0){
            orgHasStandardPanelDesigns = true;
        }
    }
    
    public static SObject createPanelSObject(String sObjectApiName, String jSONSObject){
        Map<String, Object> fieldMap = (Map<String, Object>)JSON.deserializeUntyped(jSONSObject);
        Schema.SObjectType targetType = Schema.getGlobalDescribe().get(sObjectApiName);
        SObject newSobject = targetType.newSObject();
        Map<String, Schema.sObjectField> targetFields = targetType.getDescribe().fields.getMap();
        for (String key : fieldMap.keySet())
        {
            Object value = fieldMap.get(key);
            Schema.DisplayType valueType = targetFields.get(key).getDescribe().getType();
            if (value instanceof String && valueType != Schema.DisplayType.String)
            {
                String svalue = (String)value;
                if (valueType == Schema.DisplayType.Date)
                    newSobject.put(key, Date.valueOf(svalue));
                else if(valueType == Schema.DisplayType.DateTime)
                    newSobject.put(key, DateTime.valueOfGmt(svalue));
                else if (valueType == Schema.DisplayType.Percent || valueType == Schema.DisplayType.Currency)
                    newSobject.put(key, svalue == '' ? null : Decimal.valueOf(svalue));
                else if (valueType == Schema.DisplayType.Double)
                    newSobject.put(key, svalue == '' ? null : Double.valueOf(svalue));
                else if (valueType == Schema.DisplayType.Integer)
                    newSobject.put(key, Integer.valueOf(svalue));
                else if (valueType == Schema.DisplayType.Base64)
                    newSobject.put(key, Blob.valueOf(svalue));
                else
                    newSobject.put(key, svalue);
            }
            else
                newSobject.put(key, value);
        }
        return newSobject;
    }
    
    private static Map<String,String> getStaticResources(){
        List<String> staticResourceNames  = new List<String>();
        staticResourceNames.add('cast_hp_1_img');
        staticResourceNames.add('nps_hp_1_img');
        staticResourceNames.add('customer_pic_hp1');
        staticResourceNames.add('active_gold_hp1');
        Map<String,String> staticResourceUrls = new Map<String,String>();
        List<StaticResource> resourceList= [SELECT Name, NamespacePrefix, SystemModStamp FROM StaticResource WHERE Name IN :staticResourceNames];
        if(resourceList.size()>1){
            for(StaticResource resource : resourceList){
                String namespace = resource.NamespacePrefix;
                String url = '/resource/' + resource.SystemModStamp.getTime() + '/' + (namespace != null && namespace != '' ? namespace + '__' : '') + resource.Name;
                staticResourceUrls.put(resource.Name,url); 
            }
        }
        return staticResourceUrls;
    }
    
    public static void createStandardHighlightPanels(){
        Map<String,String> staticResourceUrls = getStaticResources();
        
        /** Insert Panels **/
        List<SObject> panelDesignsToInsert = new List<SObject>();
        
        //PanelDesign1
        String design1_JSON = '{"Background_Image_URL__c":"#ffffff","isDefaultPanel__c":true,"Panel_Design_Name__c":"Contact Highlight Panel 1","sObject_Name__c":"Contact","Canvas_Width__c":1680}';
        SObject panelDesign1 = createPanelSObject('Panel_Design__c',design1_JSON);
        panelDesignsToInsert.add(panelDesign1);
        
        insert panelDesignsToInsert;
        
        /** Insert Components **/
        List<SObject> panelDesignComponentsToInsert = new List<SObject>();
        
        //PanelDesign1 - Components
        String componentDesign1_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"MailingAddress","Height__c":21,"Icon_Name__c":"pin","Offset_X__c":59,"Offset_Y__c":427,"Static_Text__c":"Address","Text_Font_Size__c":14,"Width__c":182}';
        SObject panelDesignComponent1 = createPanelSObject('Panel_Design_Component__c',componentDesign1_JSON);
        panelDesignComponent1.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent1);       
        
        String componentDesign2_JSON = '{"Combo_Box_Type__c":"Static","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"Married","Height__c":20,"Icon_Name__c":"share_post","Offset_X__c":86,"Offset_Y__c":427,"Static_Text__c":"Marital Status","Width__c":166,"Text_Font_Size__c":14}';
        SObject panelDesignComponent2 = createPanelSObject('Panel_Design_Component__c',componentDesign2_JSON);
        panelDesignComponent2.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent2);  
        
        String componentDesign3_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Image","Height__c":100,"Offset_X__c":30,"Offset_Y__c":1364,"Width__c":100}';
        SObject panelDesignComponent3 = createPanelSObject('Panel_Design_Component__c',componentDesign3_JSON);
        panelDesignComponent3.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponent3.put('Image_URL__c',staticResourceUrls.get('nps_hp_1_img'));
        panelDesignComponentsToInsert.add(panelDesignComponent3);  
        
        String componentDesign4_JSON = '{"Component_Type__c":"Image","Height__c":70,"Offset_X__c":40,"Offset_Y__c":48,"Width__c":75}';
        SObject panelDesignComponent4 = createPanelSObject('Panel_Design_Component__c',componentDesign4_JSON);
        panelDesignComponent4.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponent4.put('Image_URL__c',staticResourceUrls.get('customer_pic_hp1'));
        panelDesignComponentsToInsert.add(panelDesignComponent4);  
        
        String componentDesign5_JSON = '{"Component_Type__c":"Image","Height__c":32,"Offset_X__c":94,"Offset_Y__c":201,"Width__c":132}';
        SObject panelDesignComponent5 = createPanelSObject('Panel_Design_Component__c',componentDesign5_JSON);
        panelDesignComponent5.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponent5.put('Image_URL__c',staticResourceUrls.get('active_gold_hp1'));
        panelDesignComponentsToInsert.add(panelDesignComponent5);  
       
        String componentDesign6_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"MobilePhone","Height__c":21,"Icon_Name__c":"call","Offset_X__c":5,"Offset_Y__c":427,"Static_Text__c":"Phone","Text_Font_Size__c":14,"Width__c":160}';
        SObject panelDesignComponent6 = createPanelSObject('Panel_Design_Component__c',componentDesign6_JSON);
        panelDesignComponent6.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent6);  
        
        String componentDesign7_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"Email","Height__c":21,"Icon_Name__c":"email","Offset_X__c":30,"Offset_Y__c":427,"Static_Text__c":"Email","Text_Font_Size__c":14,"Width__c":116}';
        SObject panelDesignComponent7 = createPanelSObject('Panel_Design_Component__c',componentDesign7_JSON);
        panelDesignComponent7.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent7);  
        
        String componentDesign8_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"MailingAddress","Height__c":21,"Icon_Name__c":"pin","Offset_X__c":60,"Offset_Y__c":884,"Static_Text__c":"Address","Text_Font_Size__c":14,"Width__c":182}';
        SObject panelDesignComponent8 = createPanelSObject('Panel_Design_Component__c',componentDesign8_JSON);
        panelDesignComponent8.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent8);  
        
        String componentDesign9_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Static Text","Height__c":19,"Offset_X__c":106,"Offset_Y__c":27,"Static_Text__c":"Customer for 4 years","Width__c":125}';
        SObject panelDesignComponent9 = createPanelSObject('Panel_Design_Component__c',componentDesign9_JSON);
        panelDesignComponent9.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent9);  
        
        String componentDesign10_JSON = '{"Combo_Box_Type__c":"Static","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"Married","Height__c":20,"Icon_Name__c":"share_post","Offset_X__c":88,"Offset_Y__c":884,"Static_Text__c":"Marital Status","Width__c":166,"Text_Font_Size__c":14}';
        SObject panelDesignComponent10 = createPanelSObject('Panel_Design_Component__c',componentDesign10_JSON);
        panelDesignComponent10.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent10);  
        
        String componentDesign11_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"Activity_Indicator__c","Height__c":21,"Icon_Name__c":"favorite","Offset_X__c":8,"Offset_Y__c":884,"Static_Text__c":"Activity Indicator","Text_Font_Size__c":14,"Width__c":160}';
        SObject panelDesignComponent11 = createPanelSObject('Panel_Design_Component__c',componentDesign11_JSON);
        panelDesignComponent11.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent11); 
        
        String componentDesign12_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Combo Box","Dynamic_Field_Name__c":"Email","Height__c":21,"Icon_Name__c":"email","Offset_X__c":34,"Offset_Y__c":884,"Static_Text__c":"Email","Text_Font_Size__c":14,"Width__c":116}';
        SObject panelDesignComponent12 = createPanelSObject('Panel_Design_Component__c',componentDesign12_JSON);
        panelDesignComponent12.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponentsToInsert.add(panelDesignComponent12); 
        
        String componentDesign13_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Image","Height__c":100,"Offset_X__c":30,"Offset_Y__c":1504,"Width__c":100}';
        SObject panelDesignComponent13 = createPanelSObject('Panel_Design_Component__c',componentDesign13_JSON);
        panelDesignComponent13.put('Panel_Design__c', panelDesign1.Id);
        panelDesignComponent13.put('Image_URL__c',staticResourceUrls.get('cast_hp_1_img'));
		panelDesignComponentsToInsert.add(panelDesignComponent13); 
        
        String componentDesign14_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Static Text","Offset_X__c":-1,"Offset_Y__c":1390,"Static_Text__c":"CSAT","Text_Font_Size__c":"18"}';
        SObject panelDesignComponent14 = createPanelSObject('Panel_Design_Component__c',componentDesign14_JSON);
        panelDesignComponent14.put('Panel_Design__c', panelDesign1.Id);
		panelDesignComponentsToInsert.add(panelDesignComponent14); 
        
        String componentDesign15_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Static Text","Offset_X__c":-1,"Offset_Y__c":1530,"Static_Text__c":"NPS","Text_Font_Size__c":"18"}';
        SObject panelDesignComponent15 = createPanelSObject('Panel_Design_Component__c',componentDesign15_JSON);
        panelDesignComponent15.put('Panel_Design__c', panelDesign1.Id);
		panelDesignComponentsToInsert.add(panelDesignComponent15); 
        
        String componentDesign16_JSON = '{"Combo_Box_Type__c":"Dynamic","Component_Type__c":"Dynamic Text","Offset_X__c":0,"Offset_Y__c":24,"Dynamic_Field_Name__c":"FirstName","Text_Font_Size__c":"24"}';
        SObject panelDesignComponent16 = createPanelSObject('Panel_Design_Component__c',componentDesign16_JSON);
        panelDesignComponent16.put('Panel_Design__c', panelDesign1.Id);
		panelDesignComponentsToInsert.add(panelDesignComponent16); 
        
        insert panelDesignComponentsToInsert;
        
        orgHasStandardPanelDesigns = true;
    }
}