/**
* @author Salesforce.com
* @date 2016
*
* @description Utilities class used by the Field Sales REST endpoints. Contains methods to convert string parameters into
*              an Apex list, Apex decimal, and getting object field API names thorugh Apex Describe calls.
*/

public with sharing class csfs_RestUtils {

	public static List<String> paramAsList(String key) {
        return csfs_RestUtils.paramAsList(key, NULL);
    }

    public static List<String> paramAsList(String key, List<String> defaultValue) {
        List<String> retVal = defaultValue;
        if (RestContext.request.params.containsKey(key)) {
            String s = RestContext.request.params.get(key).trim();
            if ('' != s) {
                retVal = s.split(',');
            }
        }
        return retVal;
    }

	public static String getStringParamFromKey(String key) {
        if (RestContext.request != null) {
            if (RestContext.request.params.containsKey(key)) {
                String value = RestContext.request.params.get(key);
                return value;
            }
        }
        return null;
    }

	public static List<String> allFieldNames(String objectName){
        final List<String> returnValue = new List<String>();
        objectName = objectName.trim().toLowerCase();
        final Map<String, Schema.SObjectType> globalDescribe = Schema.getGlobalDescribe();
        if(globalDescribe != null && globalDescribe.containsKey(objectName)){
            final Schema.SObjectType objectToken = globalDescribe.get(objectName);
            if(objectToken != null){
                final Map<String,Schema.SObjectField> fieldNameToFieldIndex = objectToken.getDescribe().fields.getMap();
                if(fieldNameToFieldIndex != null && fieldNameToFieldIndex.size() > 0){
                    for(String fieldName : fieldNameToFieldIndex.keySet()){
                        returnValue.add(fieldNameToFieldIndex.get(fieldName).getDescribe().getName());
                    }
                }
            }
        }
        return returnValue;
    }


    public static List<String> requestedOrAllFields(String paramName, String objectName) {
        List<String> fields = csfs_RestUtils.paramAsList(paramName);
        if (fields == NULL || fields.size() <= 0) {
        	if (objectName.toLowerCase() == 'knowledgearticleversion') {
        		fields = new List<String>{'Title', 'Summary', 'toLabel(ArticleType)', 'LastPublishedDate'};
        	} else {
            	fields = csfs_RestUtils.allFieldNames(objectName);
        	}
        }
        return fields;
    }

    public static String getLanguage() {
        String lang = getStringParamFromKey('lang');
        if (lang != null) {
            return lang;
        } else {
            return UserInfo.getLanguage();
        }
    }
}