trigger SteelBrickDemoBefore on SBQQ__Quote__c (before update, before insert) {
    /*
     *
     * INSERT
     *
    */
    if(trigger.isInsert){
    
      

      
      for(SBQQ__Quote__c quote : trigger.new){
      List<SBQQ__QuoteProcess__c> qp = new List<SBQQ__QuoteProcess__c>();
             qp =  [SELECT Id FROM SBQQ__QuoteProcess__c WHERE Name LIKE : quote.Alpine_or_NTO__c LIMIT 1];
                         if(qp.size() == 1){
                      quote.SBQQ__QuoteProcessId__c = qp.get(0).Id;
            }

      
            quote.Print_Notes__c = (quote.SBQQ__Notes__c != null);

        }
    }
   
    /*
     *
     * UPDATE
     *
    */
    else if(trigger.isupdate){
        for(SBQQ__Quote__c quote : trigger.new){
            quote.Print_Notes__c = (quote.SBQQ__Notes__c != null);
        }
    }
}