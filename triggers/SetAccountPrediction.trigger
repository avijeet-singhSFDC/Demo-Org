trigger SetAccountPrediction on Account (after insert, after update) {
  if(system.isFuture()) return;

if(ed_insights.CheckRecursive.runOnce()) {
  // Name of the custom setting
  String CONFIG_NAME = 'Account';

  List<Map<String, String>> fieldsList = new List<Map<String, String>>();

  for (sObject sObj: Trigger.new) {
    Map<String, Schema.SObjectField> objectFields =
      Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap();
    Map<String, String> fieldValues = new Map<String, String>();

    for (Schema.SObjectField field: objectFields.values()) {
      if (!field.getDescribe().getType().name().endsWithIgnoreCase('textarea')) {
        String fieldApiName = field.getDescribe().getName();
        fieldValues.put(fieldApiName, String.valueOf(sObj.get(fieldApiName)));
      }
    }

    // log field values
    /*System.debug(fieldValues);*/
    fieldsList.add(fieldValues);
  }

  // make setPrediction call
   ed_insights.TriggerHandler.insertUpdateHandleForFieldValues(CONFIG_NAME, JSON.serialize(fieldsList));
    }
}