public with sharing class csfs_TranslationsController {
	public List<Translation> translations {get;set;}

	public csfs_TranslationsController() {
		translations = getTranslations();
	}

    public Void saveTranslation() {
        List<csfs_Translated_String__c> updatedTranslations = new List<csfs_Translated_String__c>();
        List<csfs_Translated_String__c> removedTranslations = new List<csfs_Translated_String__c>();

        for (Translation translation : translations) {
            if (!String.isEmpty(translation.translated)) {
                csfs_Translated_String__c ts = new csfs_Translated_String__c(
                    csfs_value__c = translation.translated,
                    csfs_Name_Key__c = translation.NativeId,
                    csfs_language__c = translation.Language,
                    name = translation.name
                );

                if (translation.TranslatedId != null) {
                    ts.id = translation.translatedId;
                }

                if (String.isEmpty(ts.csfs_Language__c)) {
                    ts.csfs_Language__c = csfs_RestUtils.getLanguage();
                }
                
                updatedTranslations.add(ts);
            } else if (translation.translatedid != null) {
                removedTranslations.add([select id from csfs_Translated_String__c where id = :translation.translatedid]);
            }
        }
        upsert(updatedTranslations);
        delete(removedTranslations);
    }

    public class Translation {
        public String Name {get;set;}
		public String Native {get;set;}
		public Id NativeId {get;set;}
        public String Language {get;set;}
        public String Translated {get;set;}
        public Id TranslatedId {get;set;}

        Translation(String name, String native, Id nativeId) {
        	this.Name = name;
        	this.Native = native;
        	this.NativeId = nativeId;
        }
    }

	private static List<Translation> getTranslations() {
        Map<Id, Translation> translations = new Map<Id, Translation>();
        List<csfs_Localizable_String__c> LoacalizableStrings = [select Id, Name, csfs_Value__c from csfs_Localizable_String__c order by Name];
        System.debug(csfs_RestUtils.getLanguage());
        
        for (csfs_Localizable_String__c ls : LoacalizableStrings) {
            translations.put(ls.Id, new Translation(ls.name, ls.csfs_value__c, ls.Id));
        }

        List<csfs_Translated_String__c> translatedStrings = [select  csfs_Name_Key__c, csfs_Language__c, csfs_Name_Key__r.name, csfs_Translated_String__c.csfs_Value__c from csfs_Translated_String__c where csfs_Name_Key__c in :LoacalizableStrings AND csfs_language__c = :csfs_RestUtils.getLanguage()];
        if (translatedStrings != null) {
            for (csfs_Translated_String__c ts : translatedStrings) {
                Translation translation = translations.get(ts.csfs_Name_Key__c);
                translation.Translated = ts.csfs_value__c;
                translation.Language = ts.csfs_Language__c;
                translation.TranslatedId = ts.Id;
            }            
        }
        return translations.values();
	}
}