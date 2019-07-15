global class DE_PanelDesignController {
    
    @AuraEnabled
    global static Map<String,Object> initHighlightPanel(Id recordId,String panelDesignId){
        Map<String,Object> initDataSet = new Map<String,Object>();
        try{
            Panel_Design__c panelDesign = getPanelDesign(recordId);
            if(panelDesign!=null){
                initDataSet.put('PANEL_DESIGN_RECORD',panelDesign);
                initDataSet.put('IS_EDIT_PAGE',true);
                initDataSet.put('PANEL_DESIGN_ID',recordId);
                initDataSet.put('SOBJECT_LIST',getSobjects(recordId));
                initDataSet.put('PANEL_COMPONENT_TYPES',getPanelComponentTypes());
                initDataSet.put('SELECTED_SOBJECT_FIELDS',getAllFields(panelDesign.sObject_Name__c));
                initDataSet.put('VALID_RECORD_PAGE',true);
            }else{
                initDataSet.put('IS_EDIT_PAGE',false);
                panelDesign = getPanelDesign(panelDesignId);
                initDataSet.put('PANEL_DESIGN_RECORD',panelDesign);
                initDataSet.put('PANEL_DESIGN_ID',panelDesignId);
                initDataSet.put('SOBJECT_LIST',new List<CustomSelectOption>());
                initDataSet.put('PANEL_COMPONENT_TYPES',new List<CustomSelectOption>());
                initDataSet.put('SELECTED_SOBJECT_FIELDS',new List<CustomSelectOption>());
                initDataSet.put('VALID_RECORD_PAGE',isPanelDesignForCurrentRecordPage(panelDesign.sObject_Name__c,recordId));
            }
            List<Panel_Design_Component__c> panelComponents = getPanelComponents((String)initDataSet.get('PANEL_DESIGN_ID'));
            if(!((Boolean)initDataSet.get('IS_EDIT_PAGE')) && ((Boolean)initDataSet.get('VALID_RECORD_PAGE'))){
                panelComponents = getViewPanelRecordDetail(panelDesign,panelComponents,recordId);
            }
            initDataSet.put('PANEL_COMPONENTS',panelComponents);
            initDataSet.put('FONT_SIZES',getFontSizes());
            if(!((Boolean)initDataSet.get('VALID_RECORD_PAGE'))){
                initDataSet.put('ERROR','This Highlight panel template is configured to work with '+panelDesign.sObject_Name__c+' object. Please go to <a href="/'+panelDesign.Id+'"> Panel Design </a> to update Object or select another template.');
            }else{
                initDataSet.put('ERROR','');
            }
        }catch(QueryException e){
            initDataSet.put('ERROR','Please verify if you are using correct highlight panel tempelate in page layout. Go to Edit Page and select correct highlight panel template.');
            initDataSet.put('VALID_RECORD_PAGE',false);
            System.debug('Error - '+e.getCause()+' '+e.getLineNumber()+' '+e.getMessage());
        }catch(Exception e){
            initDataSet.put('ERROR','There is a error while loading Highlight Panel. <br/> '+e.getCause()+'<br/>Please contact a developer for the issue');
            initDataSet.put('VALID_RECORD_PAGE',false);
            System.debug('Error - '+e.getCause()+' '+e.getLineNumber()+' '+e.getMessage());
        }
        return initDataSet;
    }
    
    global static List<CustomSelectOption> getFontSizes(){
        List<CustomSelectOption> options = new List<CustomSelectOption>();
        options.add(new CustomSelectOption('8','8',false));
        options.add(new CustomSelectOption('9','9',false));
        options.add(new CustomSelectOption('10','10',false));
        options.add(new CustomSelectOption('11','11',false));
        options.add(new CustomSelectOption('12','12',false));
        options.add(new CustomSelectOption('14','14',false));
        options.add(new CustomSelectOption('16','16',false));
        options.add(new CustomSelectOption('18','18',false));
        options.add(new CustomSelectOption('20','20',false));
        options.add(new CustomSelectOption('22','22',false));
        options.add(new CustomSelectOption('24','24',false));
        options.add(new CustomSelectOption('26','26',false));
        options.add(new CustomSelectOption('28','28',false));
        options.add(new CustomSelectOption('36','36',false));
        return options;
    }
    
    global static List<Panel_Design_Component__c> getPanelComponents(String panelDesignId){
        return [SELECT Id,Name,OffsetTotal__c,Offset_x__c,Component_Type__c,Icon_Name__c,Image_URL__c,Static_Text__c,Text_Font_Size__c,
                Dynamic_Field_Name__c,Offset_y__c,Width__c,Height__c,Combo_Box_Type__c FROM Panel_Design_Component__c WHERE Panel_Design__c = :panelDesignId ORDER BY OffsetTotal__c ASC];
    }
    
    global static List<Panel_Design_Component__c> getViewPanelRecordDetail(Panel_Design__c panelDesign, List<Panel_Design_Component__c> panelDesignComponents,String recordId){
        System.debug(panelDesignComponents);
        String parameters = 'Id';
        for(Panel_Design_Component__c panelDesignComponent : panelDesignComponents){
            if((panelDesignComponent.Component_Type__c == 'Dynamic Text' || panelDesignComponent.Component_Type__c == 'Combo Box') &&
               panelDesignComponent.Dynamic_Field_Name__c!=null && panelDesignComponent.Dynamic_Field_Name__c!='' 
               && !parameters.contains(panelDesignComponent.Dynamic_Field_Name__c) && panelDesignComponent.Combo_Box_Type__c != 'Static'){
                   parameters+= ','+panelDesignComponent.Dynamic_Field_Name__c;
               }
        }
        if(parameters == 'Id'){
            return panelDesignComponents;
        }
        String query = 'SELECT '+parameters+' FROM '+panelDesign.sObject_Name__c+' WHERE Id = \''+recordId+'\' LIMIT 1';
        sObject viewPanelRecord = Database.query(query);
        for(Panel_Design_Component__c panelDesignComponent : panelDesignComponents){
            if((panelDesignComponent.Component_Type__c == 'Dynamic Text' || panelDesignComponent.Component_Type__c == 'Combo Box') &&
               panelDesignComponent.Dynamic_Field_Name__c!=null && panelDesignComponent.Dynamic_Field_Name__c!='' 
               && panelDesignComponent.Combo_Box_Type__c != 'Static'){
                   Schema.DisplayType fieldType = Schema.getGlobalDescribe().get(panelDesign.sObject_Name__c).getDescribe().fields.getMap().get(panelDesignComponent.Dynamic_Field_Name__c).getDescribe().getType();
                   if(fieldType == Schema.DisplayType.DATE){
                       Date fieldDateValue = (Date)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldDateValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           Datetime dt = DateTime.newInstance(fieldDateValue.year(),fieldDateValue.month(), fieldDateValue.day());
                           panelDesignComponent.Dynamic_Field_Name__c = dt.format('MM/dd/YYYY');
                       }
                   }else if(fieldType == Schema.DisplayType.DATETIME){
                       DateTime fieldDateTimeValue = (DateTime)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldDateTimeValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           panelDesignComponent.Dynamic_Field_Name__c = fieldDateTimeValue.format('MM/dd/YYYY hh:mm a');
                       }
                   }else if(fieldType == Schema.DisplayType.CURRENCY){
                       Decimal fieldDecimalValue = (Decimal)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldDecimalValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           panelDesignComponent.Dynamic_Field_Name__c = getCurrencySymbolFromIso(UserInfo.getDefaultCurrency())+fieldDecimalValue;
                       }
                   }else if(fieldType == Schema.DisplayType.PERCENT){
                       Decimal fieldPercentageValue = (Decimal)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldPercentageValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           panelDesignComponent.Dynamic_Field_Name__c = fieldPercentageValue+'%';
                       }
                   }else if(fieldType == Schema.DisplayType.EMAIL){
                       String fieldEmailValue = (String)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldEmailValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           panelDesignComponent.Dynamic_Field_Name__c = '<a href="mailto:'+fieldEmailValue+'">'+fieldEmailValue+'</a>';
                       }
                   }else if(fieldType == Schema.DisplayType.URL){
                       String fieldUrlValue = (String)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldUrlValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           String link = '';
                           if(!fieldUrlValue.toLowerCase().startsWith('http')){
                               link = 'http://'+fieldUrlValue;
                           }
                           panelDesignComponent.Dynamic_Field_Name__c = '<a href="'+link+'" target="_blank">'+fieldUrlValue+'</a>';
                       }
                   }else if(fieldType == Schema.DisplayType.PHONE){
                       String fieldPhoneValue = (String)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldPhoneValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           panelDesignComponent.Dynamic_Field_Name__c = '<a href="tel:'+fieldPhoneValue+'" target="_blank">'+fieldPhoneValue+'</a>';
                       }
                   }else if(fieldType == Schema.DisplayType.REFERENCE){
                       Id fieldIdValue = (Id)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldIdValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';
                       }else{
                           String sObjName = fieldIdValue.getSObjectType().getDescribe().getName();
                           sObject record = Database.query('SELECT Id, Name FROM '+sObjName+' WHERE Id = :fieldIdValue');
                           panelDesignComponent.Dynamic_Field_Name__c = '<a href="/'+fieldIdValue+'" target="_blank">'+record.get('Name')+'</a>';
                       }
                   }else if(fieldType == Schema.DisplayType.ADDRESS){
                       System.Address fieldAddressValue = (System.Address)viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c);
                       if(fieldAddressValue == null){
                           panelDesignComponent.Dynamic_Field_Name__c = '';   
                       }else{
                           String street = fieldAddressValue.getStreet() == null ? '':fieldAddressValue.getStreet();
                           String state = fieldAddressValue.getState() == null ? '':', '+fieldAddressValue.getState();
                           String city = fieldAddressValue.getCity() == null ? '':', '+fieldAddressValue.getCity();
                           String country = fieldAddressValue.getCountry() == null ? '':', '+fieldAddressValue.getCountry();
                           String zipcode = fieldAddressValue.getPostalCode() == null ? '':+' '+fieldAddressValue.getPostalCode();
                           String completeAddress = street+city+state+zipcode+country;
                           String googleSearchUrl = 'https://www.google.com/maps/place/'+EncodingUtil.urlDecode(completeAddress,'UTF-8');
                           panelDesignComponent.Dynamic_Field_Name__c = '<a href="'+googleSearchUrl+'" target="_blank">'+completeAddress+'</a>';
                       }
                   }
                   else{
                       panelDesignComponent.Dynamic_Field_Name__c = String.valueOf(viewPanelRecord.get(panelDesignComponent.Dynamic_Field_Name__c));
                   }
               }
        }
        return panelDesignComponents;
    }
    
    global static String getCurrencySymbolFromIso(String Iso) {
        String currencySymbol = 
            ('USD' == Iso ? '$' : 
             ('CAD' == Iso ? '$' : 
              ('EUR' == Iso ? '€' : 
               ('GBP' == Iso ? '£' : 
                ('JPY' == Iso ? '¥' : 
                 ('KRW' == Iso ? '₩' : 
                  ('CNY' == Iso ? '元' : 
                   Iso)))))));
        return currencySymbol;
    }
    
    
    @AuraEnabled
    global static List<CustomSelectOption> getAllFields(String objectName){
        List<CustomSelectOption> options = new List<CustomSelectOption>();
        if(objectName!=null && objectName!= ''){
            Map <String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();
            for(Schema.SObjectField field : fieldMap.values()) {
                schema.describefieldresult dfield =  field.getDescribe();
                options.add(new CustomSelectOption(dfield.getName(),dfield.getLabel(),false,dfield.getType()));
            }
            options.sort();
        }
        return options;
    }
    
    global static Panel_Design__c getPanelDesign(Id recordId){
        if(recordId.getSObjectType().getDescribe().getName() == 'Panel_Design__c'){
            return [SELECT Id,Name,Canvas_Width__c,isDefaultPanel__c,sObject_Name__c,Background_Image_URL__c,Panel_Design_Name__c FROM Panel_Design__c WHERE Id = :recordId];
        }else{
            return null;
        }
    }
    
    global static Boolean isPanelDesignForCurrentRecordPage(String panelDesignObjectName, Id recordId){
        return panelDesignObjectName == recordId.getSObjectType().getDescribe().getName();
    }
    
    global static List<CustomSelectOption> getSobjects(String recordId){
        Panel_Design__c panelDesign = [SELECT sObject_Name__c FROM Panel_Design__c WHERE Id = :recordId];
        List<CustomSelectOption> options = new List<CustomSelectOption>();
        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        for(Schema.SObjectType thisObj : gd.values()) {
            Schema.DescribeSObjectResult result =  thisObj.getDescribe();
            options.add(new CustomSelectOption(result.getName(),result.getLabel(),result.getName() == panelDesign.sObject_Name__c));
        }
        options.sort();
        return options;
    }
    
    global static List<CustomSelectOption> getPanelComponentTypes(){
        List<CustomSelectOption> options = new List<CustomSelectOption>();
        Schema.DescribeFieldResult fieldResult = Panel_Design_Component__c.Component_Type__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry f : ple){
            options.add(new CustomSelectOption(f.getValue(),f.getLabel(),false));
        }       
        options.sort();
        return options;
    }
    
    @AuraEnabled
    global static void saveChanges(Panel_Design__c panelDesign, List<Panel_Design_Component__c> panelDesignComponents,String width){
        panelDesign.Canvas_Width__c = Integer.valueOf(width);
        upsert panelDesign;
        String listType = 'List<Panel_Design_Component__c>';
        List<SObject> castRecords = (List<SObject>)Type.forName(listType).newInstance();
        castRecords.addAll(panelDesignComponents);
        upsert castRecords;
    }
    
    @AuraEnabled
    global static String getPanelBackgroundImageURL(Id contentDocumentId){
        ContentVersion cVersion = [SELECT Id,Title FROM ContentVersion WHERE ContentDocumentId = :contentDocumentId];
        return '/sfc/servlet.shepherd/version/download/'+cVersion.Id;
    }
    
    @AuraEnabled
    global static Boolean deleteElement(Id elementId){
        try{
            delete [SELECT Id FROM Panel_Design_Component__c WHERE Id = :elementId];
            return true;
        }catch(Exception e){
            return false;
        }
    }
    
    @AuraEnabled
    global static Panel_Design_Component__c createNewElement(Id panelDesignId,Decimal position_top,Decimal position_left){
        Panel_Design_Component__c newPanelDesignComponent = 
            new Panel_Design_Component__c(Text_Font_Size__c	= 14,Combo_Box_Type__c= 'Dynamic', Panel_Design__c = panelDesignId,Offset_X__c = position_top, Offset_Y__c = position_left,Component_Type__c = 'Static Text');
        System.debug(newPanelDesignComponent);
        insert newPanelDesignComponent;
        
        return newPanelDesignComponent;
    }
    
    @AuraEnabled
    public static boolean deleteHighlightPanel(Id highlightPanelId){
        try{
            delete [SELECT Id FROM Panel_Design_Component__c WHERE Panel_Design__c = :highlightPanelId];
            delete [SELECT Id FROM Panel_Design__c WHERE Id = :highlightPanelId];
            return true;
        }catch(Exception e){
            return false;
        }
    }
    
    @AuraEnabled
    global static Id clonePanelDesign(Id panelDesignId,String panelDesignName){
        Panel_Design__c panelDesign = [SELECT Id,Canvas_Width__c,Name,sObject_Name__c,Background_Image_URL__c,isDefaultPanel__c,
                                       (SELECT Component_Type__c, Dynamic_Field_Name__c ,Height__c,Icon_Name__c ,Image_URL__c ,Offset_X__c ,
                                        Offset_Y__c ,Combo_Box_Type__c,Panel_Design__c ,Name ,Static_Text__c ,Text_Font_Size__c ,Width__c 
                                        FROM Panel_Design_Components__r) FROM Panel_Design__c WHERE Id = :panelDesignId];
        Panel_Design__c clonedPanelDesign = new Panel_Design__c(sObject_Name__c = panelDesign.sObject_Name__c, 
                                                                Background_Image_URL__c = panelDesign.Background_Image_URL__c, 
                                                                isDefaultPanel__c = false,
                                                                Canvas_Width__c = panelDesign.Canvas_Width__c,
                                                                Panel_Design_Name__c = panelDesignName);
        insert clonedPanelDesign;
        List<Panel_Design_Component__c> clonedPanelDesignComponents = new List<Panel_Design_Component__c>();
        for(Panel_Design_Component__c pDC : panelDesign.Panel_Design_Components__r){
            Panel_Design_Component__c clonedPanelDesignComponent = 
                new Panel_Design_Component__c(Component_Type__c = pDC.Component_Type__c,Dynamic_Field_Name__c = pDC.Dynamic_Field_Name__c,
                                              Height__c = pDC.Height__c, Icon_Name__c = pDC.Icon_Name__c, Image_URL__c = pDC.Image_URL__c,
                                              Offset_X__c = pDC.Offset_X__c, Offset_Y__c = pDC.Offset_Y__c, Panel_Design__c = clonedPanelDesign.Id,
                                              Static_Text__c = pDC.Static_Text__c, Text_Font_Size__c = pDC.Text_Font_Size__c,
                                              Width__c = pDC.Width__c, Combo_Box_Type__c = pDC.Combo_Box_Type__c);
            clonedPanelDesignComponents.add(clonedPanelDesignComponent);
        }
        insert clonedPanelDesignComponents;
        return clonedPanelDesign.Id;
    }
    
    global class CustomSelectOption implements Comparable{
        @AuraEnabled
        global String value{get;set;}
        @AuraEnabled
        global String label{get;set;}
        @AuraEnabled
        global Boolean isSelected{get;set;}
        @AuraEnabled
        global String fieldType{get;set;}
        
        global CustomSelectOption(String value,String label,Boolean isSelected,Schema.DisplayType fieldType){
            this.value = value;
            this.label = label;
            this.isSelected = isSelected;
            this.fieldType = String.valueOf(fieldType);
        }
        
        global CustomSelectOption(String value,String label,Boolean isSelected){
            this.value = value;
            this.label = label;
            this.isSelected = isSelected;
        }
        
        global Integer compareTo(Object compareTo){
            CustomSelectOption compareToGoal = (CustomSelectOption)compareTo;
            return label.toUpperCase().compareTo(compareToGoal.label.toUpperCase());
        }
        
    }  
    
}