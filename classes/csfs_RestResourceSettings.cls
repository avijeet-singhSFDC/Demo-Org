/**
* @author Salesforce.com
* @date 2016
*
* @description REST endpoint (/settings) that returns the application settings to the mobile app
*/
@RestResource(urlMapping='/*/settings')
global with sharing class csfs_RestResourceSettings {
    
    public static final String MASTER_RECORD_TYPE_ID = '012000000000000AAA';
    
    private static List<String> objectsToDescribe = new List<String>(csfs_Field_Sales_Supported_Objects__c.getAll().keySet());
    
	static List<Schema.DescribeSObjectResult> objectDescribes;
    static Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
    static Map<String, Schema.DescribeSObjectResult> objectDescribeMap = new Map<String, Schema.DescribeSObjectResult>();
    static Map<String, Map<Id,Schema.RecordTypeInfo>> objectRecordTypes = new Map<String, Map<Id,Schema.RecordTypeInfo>>();
    static Map<String, String> nameFieldsMap = new Map<String, String>();
    static Map<String, List<String>> searchableFieldsMap = new Map<String, List<String>>();
    
    static {
        objectDescribes = new List<Schema.DescribeSObjectResult>();
        for (String o : objectsToDescribe) {
            try {
                objectDescribes.addAll(Schema.describeSObjects(new List<String>{o}));
            } catch (Exception e) {
                system.debug(e);
            }
        }

        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();
        
        for (Schema.DescribeSObjectResult dr : objectDescribes) {
            
            Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(dr.getName()).getDescribe();
            
            Boolean getRecordTypes = true;
            
            if (objectDescribe.isAccessible() == false) {
                getRecordTypes = false;
            }
            
            if (dr.getRecordTypeInfos().size() > 0 && getRecordTypes) {
                Map<Id,Schema.RecordTypeInfo> rtMap;
                for (Schema.RecordTypeInfo rti : dr.getRecordTypeInfos()) {
                    
                    if (rti.isAvailable() || rti.isMaster()) {
                        if (rtMap == null) { rtMap = new Map<Id,Schema.RecordTypeInfo>(); }
                        rtMap.put(rti.getRecordTypeId(), rti);
                    }
                    
                }
                
                if (rtMap != null) {
                    if (!(rtMap.values().size() == 1 && rtMap.values()[0].getRecordTypeId() == MASTER_RECORD_TYPE_ID)) {
                        objectRecordTypes.put(dr.getName(), rtMap);
                    }
                }
            }
            
            objectDescribeMap.put(dr.getName(), dr);
        }
    }
    
    
    @HttpGet
    global static ApplicationSettings doGet() {
        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();
        ApplicationSettings appSettings = new ApplicationSettings();
        appSettings.Id = String.valueOf(settings.Id);
        
        Integer orgFiscalMonth = [SELECT FiscalYearStartMonth FROM Organization].FiscalYearStartMonth;
        appSettings.FiscalYearStartMonth = orgFiscalMonth;
        
        appSettings.ObjectInfo = new Map<String,ObjectInfo>();
        
        for (String objectName : objectsToDescribe) {
            
            try {
                appSettings.ObjectInfo.put(objectName,
                                           new ObjectInfo(Schema.getGlobalDescribe().get(objectName).getDescribe(),
                                                          objectDescribeMap.get(objectName).getLabel(),
                                                          objectDescribeMap.get(objectName).getLabelPlural(),
                                                          getFieldsForObject(objectName),
                                                          getRecordTypesForObject(objectName)));
            } catch (Exception e) {
                system.debug(e);
            }
        }
        
        appSettings.ThemeInfo = new Map<String,String>();
        appSettings.GeneralInfo = new Map<String,String>();
        
        Schema.DescribeSObjectResult dr = csfs_Field_Sales_Settings__c.SObjectType.getDescribe();
        
        for(String f : dr.fields.getMap().keyset()) {
            if(f.containsIgnoreCase('THEME_') && settings.get(f)!=null)
                appSettings.ThemeInfo.put(String.valueOf(dr.fields.getMap().get(f)),String.valueOf(settings.get(f)));
			if(f.containsIgnoreCase('GENERAL_') && settings.get(f)!=null)
            	appSettings.GeneralInfo.put(String.valueOf(dr.fields.getMap().get(f)),String.valueOf(settings.get(f)));
        }
        
        appSettings.GeneralInfo.put('csfs_Data_Sync_Option__c',String.valueOf(settings.csfs_Data_Sync_Option__c));
        appSettings.GeneralInfo.put('csfs_Account_Sync_Option__c',String.valueOf(settings.csfs_Account_Sync_Option__c));
        appSettings.GeneralInfo.put('LogoImageId',getImageId('Field Sales - In-App Icon'));
        appSettings.GeneralInfo.put('BackgroundImageId',getImageId('Field Sales - App Background'));
        appSettings.GeneralInfo.put('DefaultProductImageId',getImageId('Field Sales - Default Product Image'));
        
        appSettings.LocalizedStrings = getLabelStringInfo();

        return appSettings;
    }
    
    //private static List<sObject> getStatisticsData() {
    //    List<sObject> foo = Database.query('Select sum(goal_attainment__c) from account');
    //    return foo;
    //}
    
    private static String getImageId(String imageName) {
        List<csfs_App_Images__c> images = [SELECT Id FROM csfs_App_Images__c WHERE Type__c = :imageName limit 1];
        if (images.isEmpty() == false) {
	        return images[0].Id;
        } else {
            return null;
        }
    }
    
    private static List<Map<String,String>> getFieldsForObject(String objectName) {
        if (objectDescribeMap.get(objectName) != null) {
            List<Map<String,String>> fieldList = new List<Map<String,String>>();
            
            Schema.DescribeSObjectResult dr = objectDescribeMap.get(objectName);
            Boolean searchable = dr.isSearchable();
            
            for (String s : dr.fields.getMap().keyset()) {
                Schema.DescribeFieldResult dfr = dr.fields.getMap().get(s).getDescribe();
                
                if(dfr.isAccessible() && !csfs_SettingsUtil.globalFieldsToHide.contains(dfr.getName())) {
                    Map<String,String> fieldInfo;
                    fieldInfo = new Map<String,String>();
                    fieldInfo.put('Name', dfr.getName());
                    fieldInfo.put('Type', String.valueOf(dfr.getType()));
                    fieldInfo.put('Updateable', String.valueOf(dfr.isUpdateable()));
                    fieldInfo.put('Createable', String.valueOf(dfr.isCreateable()));
                    fieldInfo.put('Sortable', String.valueOf(dfr.isSortable()));
                    if(String.valueOf(dfr.getType()) == 'REFERENCE') {
                        fieldInfo.put('RelationshipName', dfr.getRelationshipName());
                        String relatedObjectName = dfr.getReferenceTo()[0].getDescribe().getName();
                        fieldInfo.put('ReferenceTo', relatedObjectName);
                        fieldInfo.put('RelationshipField', csfs_SettingsUtil.getNameField(relatedObjectName));
                    }
                    
                    String defaultValue;
                    if (dfr.getDefaultValue() == null) {
                        defaultValue = String.valueOf(dfr.getDefaultValueFormula());
                    } else {
                        defaultValue = String.valueOf(dfr.getDefaultValue());
                    }
                    
                    if (objectName == 'ContentDocument' && dfr.getName() == 'ParentId') {
                        fieldList.add(fieldInfo);
                    } else {
                        fieldList.add(fieldInfo);
                    }
                    
                    if (searchable) {
                        if (dfr.getType() == Schema.DisplayType.String ||
                            dfr.getType() == Schema.DisplayType.TextArea) {
                                if (searchableFieldsMap.get(dr.getName()) == null) {
                                    searchableFieldsMap.put(dr.getName(), new List<String>());
                                }
                                searchableFieldsMap.get(dr.getName()).add(dfr.getName());
                            }
                    }
                }
            }
            return fieldList;
        }
        return NULL;
    }
    
    private static Map<String,RecordTypeInfo> getRecordTypesForObject(String objectName) {
        if (objectRecordTypes.get(objectName) != null) {
            Map<String,RecordTypeInfo> recordTypes = new Map<String,RecordTypeInfo>();
            for(Schema.RecordTypeInfo rt : objectRecordTypes.get(objectName).values()) {
                Boolean available = false;
                if (rt.getRecordTypeId() != MASTER_RECORD_TYPE_ID && rt.isAvailable()) {
                    available = true;
                }
                recordTypes.put(String.valueOf(rt.getRecordTypeId()),new RecordTypeInfo(rt.getName(), String.valueOf(rt.getRecordTypeId()), available));
            }
            return recordTypes;
        }
        return NULL;
    }
    
    private static Map<String,String> getLabelStringInfo() {
        Map<String,String> translations = new Map<String,String>();
        List<csfs_Localizable_String__c> LoacalizableStrings = [select Id, Name, csfs_Value__c from csfs_Localizable_String__c];
        for (csfs_Localizable_String__c ls : LoacalizableStrings) {
            translations.put(ls.name, ls.csfs_value__c);
        }

        List<csfs_Translated_String__c> translatedStrings = [select  csfs_Name_Key__c, csfs_Name_Key__r.name, csfs_Translated_String__c.csfs_Value__c from csfs_Translated_String__c where csfs_Name_Key__c in :LoacalizableStrings AND csfs_language__c = :UserInfo.getLanguage()];
        for (csfs_Translated_String__c ts : translatedStrings) {
            translations.put(ts.csfs_Name_Key__r.name, ts.csfs_value__c);
        }
        return translations;
    }
    
    global class ApplicationSettings {
        Map<String,String> ThemeInfo;
        Map<String,String> GeneralInfo;
        String Id;
        Integer FiscalYearStartMonth;
        Map<String,ObjectInfo> ObjectInfo;
        Map<String,String> LocalizedStrings;
    }
    
    global class ObjectInfo {
        String Label;
        String LabelPlural;
        Boolean Accessible;
        Boolean Createable;
        Boolean Updateable;
        Boolean Deletable;
        String NameField;
        Boolean Searchable;
        List<String> SearchableFields;
        public List<Map<String,String>> FieldInfo;
        public Map<String,RecordTypeInfo> RecordTypeInfo;
        public ObjectInfo(String label, List<Map<String,String>> fieldLayouts) {
            this.Label = label;
            this.FieldInfo = fieldLayouts;
        }
        public ObjectInfo(Schema.DescribeSObjectResult d, String label, String pluralLabel, List<Map<String,String>> fieldLayouts, Map<String,RecordTypeInfo> recordTypeLayouts) {
            this.Accessible = d.isAccessible();
            this.Createable = d.isCreateable();
            this.Updateable = d.isUpdateable();
            this.Deletable = d.isDeletable();
            this.Label = label;
            this.LabelPlural = pluralLabel;
            this.FieldInfo = fieldLayouts;
            this.RecordTypeInfo = recordTypeLayouts != null && recordTypeLayouts.size() > 0 ? recordTypeLayouts : null;
            this.NameField = csfs_SettingsUtil.getNameField(d.getName());
            this.Searchable = d.isSearchable();
            this.SearchableFields = searchableFieldsMap.get(d.getName());
        }
    }
    
    global class RecordTypeInfo {
        String Label;
        String Id;
        Boolean IsAvailable;
        public RecordTypeInfo(String label, String rtID, Boolean isAvailable) {
            this.Label = label;
            this.Id = rtID;
            this.IsAvailable = isAvailable;
        }
        public RecordTypeInfo(String label, List<Map<String,String>> fieldLayouts, String rtID) {
            this.Label = label;
            this.Id = rtID;
        }
    }
}