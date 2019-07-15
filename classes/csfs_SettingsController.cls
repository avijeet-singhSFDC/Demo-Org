/**
* @author Salesforce.com
* @date 2016
*
* @description Controller for the csfs_settings page. Allows the user to
*              enter/save/modify any of the custom settings used
                             by the Field Service application.
*/
public with sharing class csfs_SettingsController {

    //public List<LanguageSettingsRow> languageSettingsList {get;set;}
    public List<SelectOption> languageOptions {get;set;}
    public List<SelectOption> dataSyncOptions {get;set;}
    public List<SelectOption> accountSyncOptions {get;set;}
    public String selectedDataSyncOption {get;set;}
    public String selectedAccountSyncOption {get;set;}

    public transient Blob backgroundImageData {get;set;}
    public String backgroundFileName {get;set;}
    public csfs_App_Images__c backgroundImage {get;set;}
    public String appBackgroundType { get { return 'Field Sales - App Background'; }}

    public transient Blob logoImageData {get;set;}
    public String logoFileName {get;set;}
    public csfs_App_Images__c logoImage {get;set;}
    public String logoType { get { return 'Field Sales - In-App Icon'; }}

    public transient Blob defaultProductImageData {get;set;}
    public String defaultProductImageFileName {get;set;}
    public csfs_App_Images__c defaultProductImage {get;set;}
    public String defaultProductImageType { get { return 'Field Sales - Default Product Image'; }}

    public List<ApplicationSetting> themeColorList {get;set;}
    public List<ApplicationSetting> generalSettingList {get;set;}
    
    /*******************************************************************************************************
    * @description Default constructor. Initializes the class by grabbing the current custom
    *              setting values used by the application.
    */
    public csfs_SettingsController() {
        //languageSettingsList = new List<LanguageSettingsRow>();
        //getLanguages();
        //getLanguageOptions();
        populateSelectOptions();
        getImages();
        getApplicationSettings();
    }

    //private void getLanguageOptions() {
    //    languageOptions = new List<SelectOption>();
        
    //    Schema.DescribeFieldResult fieldResult = User.LanguageLocaleKey.getDescribe();
    //    List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        
    //    for(Schema.PicklistEntry f : ple) {
    //        languageOptions.add(new SelectOption(f.getValue(), f.getLabel()));
    //    }
    //}

    private void populateSelectOptions() {
        dataSyncOptions = new List<SelectOption>();
        dataSyncOptions.add(new SelectOption('MyRecords', 'Only my records'));
        dataSyncOptions.add(new SelectOption('AllRecords', 'All records'));

        accountSyncOptions = new List<SelectOption>();
        accountSyncOptions.add(new SelectOption('StoreRecords', 'Only Stores'));
        accountSyncOptions.add(new SelectOption('AllRecords', 'All records'));
    }

    public void uploadAppBackground() {
        uploadImage(appBackgroundType, backgroundImageData, backgroundFileName);
    }

    public void uploadLogo() {
        uploadImage(logoType, logoImageData, logoFileName);
    }

    public void uploadDefaultProductImage() {
        uploadImage(defaultProductImageType, defaultProductImageData, defaultProductImageFileName);
    }

    public void uploadImage(String recordType, Blob imageData, String fileName) {
        if (fileName == null) {
            return;
        }
		csfs_App_Images__c appImage;
		List<csfs_App_Images__c> images = [SELECT Id FROM csfs_App_Images__c WHERE Type__c = :recordType];
        if (images.isEmpty() == true) {
			appImage = new csfs_App_Images__c();
        } else if (images.size() > 1) {
            appImage = images[0];
            delete images;
        } else {
            appImage = images[0];
        }
        
        appImage.body__c = EncodingUtil.base64Encode(imageData);
        appImage.name = fileName;
        appImage.Type__c = recordType;
        upsert appImage;
        
        getImages();
    }
    
    private void getImages() {
        backgroundFileName = null;
        logoFileName = null;

        List<csfs_App_Images__c> images = [SELECT Id, Name, Type__c, body__c FROM csfs_App_Images__c];

        for (csfs_App_Images__c image : images) {
            if (image.Type__c == appBackgroundType) {
                backgroundImage = image;
            } else if (image.Type__c == logoType) {
                logoImage = image;
            } else if (image.Type__c == defaultProductImageType) {
                defaultProductImage = image;
            }
        }
    }

    public PageReference deleteImage() {
        String toDelete = Apexpages.currentPage().getParameters().get('imageName');
		List<csfs_App_Images__c> images = [SELECT Id FROM csfs_App_Images__c where Type__c = :toDelete];
		delete images;
        getImages();
		PageReference pr = Page.csfs_settings;
        pr.setRedirect(true);
        return pr;    
    }

    
	/*******************************************************************************************************
    * @description Saves the data entered on the page and does a hard refresh (setRedirect(true);)
    * @return PageReference for the same page, but with a hard refresh.
    */
    public PageReference save() {
        Savepoint sp;
        try {
            sp = Database.setSavepoint();
            //cleanUpLanguages();
            //insertLanguges();
            upsert updateApplicationSettings();
            PageReference pr = Page.csfs_settings;
            pr.setRedirect(true);
            return pr;
        } catch(Exception e) {
            Database.rollback(sp);
            ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,e.getMessage()));
            return null;
        }
    }

	/******************
    *  Language settings
    */
    //public void addLangugeRow() {
    //    if (languageSettingsList.isEmpty() || (!languageSettingsList.isEmpty() && languageSettingsList[languageSettingsList.size()-1].name != null)) {
    //        languageSettingsList.add(new LanguageSettingsRow(new csfs_Field_Sales_Language_Settings__c()));
    //    }

    //    calculateLanguageIndexes();
    //}

    //public void deleteLanguageRow() {
    //    String toDelete = Apexpages.currentPage().getParameters().get('languageRowIndex');

    //    if (!String.isBlank(toDelete)) {
    //        Integer index = Integer.valueOf(toDelete);
    //        languageSettingsList.remove(index);
    //    }

    //    calculateLanguageIndexes();
    //}

    //private void getLanguages() {
    //    List<csfs_Field_Sales_Language_Settings__c> lsList = [SELECT Name
    //                                              FROM csfs_Field_Sales_Language_Settings__c
    //                                              ORDER BY Name];
    //    for (csfs_Field_Sales_Language_Settings__c ls : lsList) {
    //        languageSettingsList.add(new LanguageSettingsRow(ls));
    //    }

    //    calculateLanguageIndexes();
    //}

    //private void cleanUpLanguages() {
    //    List<csfs_Field_Sales_Language_Settings__c> lsList = [SELECT Name
    //                                              FROM csfs_Field_Sales_Language_Settings__c
    //                                              ORDER BY Name];

    //    delete lsList;
    //}

    //private void insertLanguges() {
    //    List<csfs_Field_Sales_Language_Settings__c> toInsert = new List<csfs_Field_Sales_Language_Settings__c>();

    //    for (LanguageSettingsRow r : languageSettingsList) {
    //        if (!String.isBlank(r.name)) {
    //            csfs_Field_Sales_Language_Settings__c ls = r.record;
    //            ls.Name = r.name;
    //            ls.Id = null;
    //            toInsert.add(ls);
    //        }
    //    }

    //    insert toInsert;
    //}

    //private void calculateLanguageIndexes() {
    //    for (Integer i = 0; i < languageSettingsList.size(); i++) {
    //        languageSettingsList[i].index = i;
    //    }
    //}

    //public class LanguageSettingsRow {
    //    public csfs_Field_Sales_Language_Settings__c record {get;set;}
    //    public String name {get;set;}
    //    public Integer index {get;set;}

    //    public LanguageSettingsRow(csfs_Field_Sales_Language_Settings__c r) {
    //        this.record = r;
    //        this.name = r.Name;
    //    }
    //}

    /******************
    *  END Language settings
    */

	/******************
    *  Supported Objects settings
    */

    // public void addSupportedObjectRow() {
    //     if (supportedObjectList.isEmpty() || (!supportedObjectList.isEmpty() && supportedObjectList[supportedObjectList.size()-1].name != null)) {
    //         supportedObjectList.add(new SupportedObjectRow(new csfs_Field_Sales_Supported_Objects__c()));
    //     }

    //     calculateSupportedObjectIndexes();
    // }

    // public void deleteSupportedObjectRow() {
    //     String toDelete = Apexpages.currentPage().getParameters().get('supportedObjectRowIndex');

    //     if (!String.isBlank(toDelete)) {
    //         Integer index = Integer.valueOf(toDelete);
    //         supportedObjectList.remove(index);
    //     }

    //     calculateSupportedObjectIndexes();
    // }

    // private void getSupportedObjects() {
    //     List<csfs_Field_Sales_Supported_Objects__c> lsList = [SELECT Name
    //                                               FROM csfs_Field_Sales_Supported_Objects__c
    //                                               ORDER BY Name];
    //     for (csfs_Field_Sales_Supported_Objects__c ls : lsList) {
    //         supportedObjectList.add(new SupportedObjectRow(ls));
    //     }

    //     calculateSupportedObjectIndexes();
    // }

    // private void cleanUpSupportedObjects() {
    //     List<csfs_Field_Sales_Supported_Objects__c> lsList = [SELECT Name
    //                                               FROM csfs_Field_Sales_Supported_Objects__c
    //                                               ORDER BY Name];

    //     delete lsList;
    // }

    // private void insertSupportedObjects() {
    //     List<csfs_Field_Sales_Supported_Objects__c> toInsert = new List<csfs_Field_Sales_Supported_Objects__c>();

    //     for (SupportedObjectRow r : supportedObjectList) {
    //         if (!String.isBlank(r.name)) {
    //             csfs_Field_Sales_Supported_Objects__c ls = r.record;
    //             ls.Name = r.name;
    //             ls.Id = null;
    //             toInsert.add(ls);
    //         }
    //     }

    //     insert toInsert;
    // }

    // private void calculateSupportedObjectIndexes() {
    //     for (Integer i = 0; i < supportedObjectList.size(); i++) {
    //         supportedObjectList[i].index = i;
    //     }
    // }

    //     public class SupportedObjectRow {
    //     public csfs_Field_Sales_Supported_Objects__c record {get;set;}
    //     public String name {get;set;}
    //     public Integer index {get;set;}

    //     public SupportedObjectRow(csfs_Field_Sales_Supported_Objects__c r) {
    //         this.record = r;
    //         this.name = r.Name;
    //     }
    // }

	/******************
    *  END Supported Objects settings
    */
    
	/******************
    *  Application Settings
    */

    public class ApplicationSetting {
        public String title {get;set;}
        public Object name {get;set;}
        public String value {get;set;}
        public String helpText {get;set;}
        public String fieldType {get;set;}
        
        public ApplicationSetting(String title, String name, String value, String helpText, String fieldType) {
            this.title = title;
            this.name = name;
            this.value = value;
            this.helpText = helpText;
            this.fieldType = fieldType;
        }
    }

    private void getApplicationSettings() {
        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();
        List<ApplicationSetting> colorList = new List<ApplicationSetting>();
        List<ApplicationSetting> settingList = new List<ApplicationSetting>();

        Schema.DescribeSObjectResult dr = csfs_Field_Sales_Settings__c.SObjectType.getDescribe();
        
        for(String f : dr.fields.getMap().keyset()) {
            if(f.containsIgnoreCase('THEME_') && settings.get(f)!=null)
                colorList.add(new ApplicationSetting(
                    dr.fields.getMap().get(f).getDescribe().getLabel(), 
                    dr.fields.getMap().get(f).getDescribe().getName(), 
                    String.valueOf(settings.get(f)), 
                    dr.fields.getMap().get(f).getDescribe().getInlineHelpText(), 
                    String.valueOf(dr.fields.getMap().get(f).getDescribe().getType()) 
                ));
            if(f.containsIgnoreCase('GENERAL_') && settings.get(f)!=null)
                settingList.add(new ApplicationSetting(
                    dr.fields.getMap().get(f).getDescribe().getLabel(), 
                    dr.fields.getMap().get(f).getDescribe().getName(), 
                    String.valueOf(settings.get(f)), 
                    dr.fields.getMap().get(f).getDescribe().getInlineHelpText(), 
                    String.valueOf(dr.fields.getMap().get(f).getDescribe().getType()) 
                ));
                
        }
        themeColorList = colorList;
        generalSettingList = settingList;
        
        selectedDataSyncOption = String.valueOf(settings.csfs_Data_Sync_Option__c);
        selectedAccountSyncOption = String.valueOf(settings.csfs_Account_Sync_Option__c);
    }

    private csfs_Field_Sales_Settings__c updateApplicationSettings() {
        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();

        for (ApplicationSetting color : themeColorList) {
            settings.put(String.valueOf(color.name),color.value);
        }
        for (ApplicationSetting generalSetting : generalSettingList) {
            if (generalSetting.fieldType == 'BOOLEAN') {
                settings.put(String.valueOf(generalSetting.name),Boolean.valueOf(generalSetting.value));
            } else if (generalSetting.fieldType == 'DOUBLE') {
                settings.put(String.valueOf(generalSetting.name),Integer.valueOf(generalSetting.value));
            } else {
                settings.put(String.valueOf(generalSetting.name),generalSetting.value);
            }
        }
        
        settings.csfs_Data_Sync_Option__c = selectedDataSyncOption;
        settings.csfs_Account_Sync_Option__c = selectedAccountSyncOption;
        return settings;
    }

	/******************
    *  END Application Settings
    */
}