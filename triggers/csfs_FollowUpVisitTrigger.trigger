trigger csfs_FollowUpVisitTrigger on csfs_Visit__c (after insert, after update) {
    List <csfs_ProductOnHand__c> poh = new List<csfs_ProductOnHand__c>();
    List <csfs_VisitObjective__c> visitObjective = new List<csfs_VisitObjective__c>();
    List <csfs_ProductOnHand__c> newPoH = new List<csfs_ProductOnHand__c>();
    List <csfs_VisitObjective__c> newVisitObjective = new List<csfs_VisitObjective__c>();
    List <csfs_Visit__c> oldVisit = new List<csfs_Visit__c>();
    List <csfs_Visit__c> newVisit = new List<csfs_Visit__c>();
    
    
    for (csfs_Visit__c visit:trigger.new)
    {   //check 
        if(visit.csfs_CheckOutDate__c!=null)
        {   //clone visit
            csfs_Visit__c current = [SELECT ID,Follow_Up_Visit_Start_Date__c,Follow_Up_Visit_End_Date__c,csfs_Account__c,Name FROM csfs_Visit__c WHERE Id = : visit.Id];
            csfs_Visit__c followUp = current.clone(false,true);
            followUp.csfs_StartDate__c = current.Follow_Up_Visit_Start_Date__c;
            followUp.csfs_EndDate__c = current.Follow_Up_Visit_End_Date__c;
            followUp.csfs_Account__c = current.csfs_Account__c;
            insert followUp;
            //move related items to ne visit from prev. visit
            poh = [select id,csfs_Visit__c,csfs_Product__c from csfs_ProductOnHand__c where csfs_Visit__c  =: visit.id];
            for(csfs_ProductOnHand__c onHandProduct:poh)
            {   csfs_ProductOnHand__c followupPOH = onHandProduct.clone(false,true);
                followupPOH.csfs_Visit__c = followUp.id;
                followupPOH.csfs_Product__c = onHandProduct.csfs_Product__c;
                newPoH.add(followupPOH);
            }
            insert(newPoH);
            visitObjective = [select id,csfs_Visit__c from csfs_VisitObjective__c where csfs_Visit__c  =: visit.id];
            for(csfs_VisitObjective__c vo:visitObjective)
            {   csfs_VisitObjective__c newVO = vo.clone(false,true);
                newVO.csfs_Visit__c=followUp.id;
                newVisitObjective.add(newVO);
            }
            insert(newVisitObjective);
        }
        
        
    }
    

}