trigger setSellOutPrediction on csfs_Promotion__c (after insert, after update) {
  if(system.isFuture()) return;

if(ed_insights.CheckRecursive.runOnce()) {
  // Name of the custom setting
  String CONFIG_NAME = 'Promotion';

 

  List<Map<String, String>> fieldsList = new List<Map<String, String>>();

  for (sObject sObj: Trigger.new) {
    Map<String, Schema.SObjectField> objectFields =
      Schema.getGlobalDescribe().get('csfs_Promotion__c').getDescribe().fields.getMap();
    Map<String, String> fieldValues = new Map<String, String>();

    for (Schema.SObjectField field: objectFields.values()) {
      if (!field.getDescribe().getType().name().endsWithIgnoreCase('textarea')) {
        String fieldApiName = field.getDescribe().getName();
        fieldValues.put(fieldApiName, String.valueOf(sObj.get(fieldApiName)));
      }
    }

    // log field values
    System.debug(fieldValues);
    fieldsList.add(fieldValues);
  }

  // make setPrediction call
   ed_insights.TriggerHandler.insertUpdateHandleForFieldValues(CONFIG_NAME, JSON.serialize(fieldsList));
    }
}