trigger csfs_VisitStoreTrigger on csfs_Visit__c (after insert, after update) {
   
   //Id visitId;
   Id accId;
   List <csfs_Visit__c> nextVisit = new List<csfs_Visit__c>();
   List <csfs_ProductOnHand__c> onHandProduct = new List<csfs_ProductOnHand__c>();
   List <csfs_Store_Product__c> product = new List<csfs_Store_Product__c>();
   List <csfs_Store_Objective__c> storeObjectives;
   List <csfs_Store_Objective__c> profileObjectives;
   List <csfs_Store_Objective__c> chainObjectives;
   List <csfs_Store_Objective__c> visitObjectives = new List<csfs_Store_Objective__c>();
   List <csfs_VisitObjective__c> csfsVisitObjectives = new List<csfs_VisitObjective__c>();
   Id thisVisit;
 
    
    
 
   if(trigger.isInsert)
   {   for (csfs_Visit__c visit:trigger.new)
        {   accId = visit.csfs_Account__c;
            thisVisit = visit.Id;
        }
        if (accId == null) {
            return;
        }
        //insert product on hand
        product = [Select Product__c from csfs_Store_Product__c where Store__c =:accId];
        List <csfs_ProductOnHand__c> upsertPoh = new List <csfs_ProductOnHand__c>();
        for(csfs_Store_Product__c sp:product)
        {   csfs_ProductOnHand__c poh = new csfs_ProductOnHand__c();
            poh.csfs_Product__c=sp.Product__c;
            poh.csfs_Visit__c=thisVisit;
            upsertPoh.add(poh);
        }
        upsert(upsertPoh);
        
        
        Account acc = [Select Next_Visit_Name__c, Next_Visit_Date__c from Account where id =:accId][0];
        nextVisit = [Select name, csfs_Visit__c.csfs_StartDate__c from csfs_Visit__c where (csfs_Account__c =:accId and csfs_Visit__c.csfs_CheckOutDate__c=null and csfs_Visit__c.csfs_StartDate__c > TODAY) ORDER BY csfs_StartDate__c ASC LIMIT 1 ];
        
        if(nextVisit.size()>0)
        {   //csfs_Visit__c myvisit = nextVisit.get[0];
            acc.Next_Visit_Date__c = nextVisit[0].csfs_StartDate__c;
            acc.Next_Visit_Name__c = nextVisit[0].name;
            update(acc);
        }
        
        System.debug('Hello Visit Insert Store Update###');
        Id storeprofileId;
        Id chainId;
        //Get Store Objectives
        storeObjectives = [Select name, Description__c from csfs_Store_Objective__c where Store__c =:accId AND isValid__c = true ORDER BY Priority__c ];
        //Get Profile Objectives
        storeprofileId = [Select ParentId from Account where id=:accId].ParentId;
        if(storeprofileId!=null)
        {   
            profileObjectives = [Select name, Description__c from csfs_Store_Objective__c where Store__c =:storeprofileId AND isValid__c = true ORDER BY Priority__c ];

            //Get Chain Objectives
            chainId = [Select ParentId from Account where id=:storeprofileId].ParentId;
            if(chainId!=null)
            {   
                chainObjectives = [Select name, Description__c from csfs_Store_Objective__c where Store__c =:chainId AND isValid__c = true ORDER BY Priority__c ];
            }
        }
        
        if(chainObjectives != null && chainObjectives.size()>0)
            visitObjectives.addAll(chainObjectives);
        if(profileObjectives != null && profileObjectives.size()>0)
            visitObjectives.addAll(profileObjectives);
        if(storeObjectives != null && storeObjectives.size()>0)
            visitObjectives.addAll(storeObjectives);
        if(visitObjectives != null && visitObjectives.size()>0)
        {
            Integer priority = 1;
            for(csfs_Store_Objective__c obj:visitObjectives)
            {   
                csfs_VisitObjective__c vObj = new csfs_VisitObjective__c();
                vObj.Store_Objective__c = obj.Id;
                vObj.csfs_Visit__c = thisVisit;
                vObj.csfs_description__c  = obj.Description__c;
                vObj.csfs_priority__c = priority;
                csfsVisitObjectives.add(vObj);
                priority++;
            }
            upsert(csfsVisitObjectives);
        }
   }
   
   if(trigger.isUpdate)
   {    
        for (csfs_Visit__c visit:trigger.new) {   
            accId = visit.csfs_Account__c;
        
            List <csfs_Visit__c> visitNotes = new List<csfs_Visit__c>([select id,csfs_Notes__c from csfs_Visit__c where (csfs_Visit__c.csfs_CheckOutDate__c!=null AND csfs_Visit__c.csfs_Account__c =:accId) order by csfs_Visit__c.csfs_CheckOutDate__c desc Limit 1]);
            
            List<Account> accounts = [Select Avg_Store_Visit_Rating__c,Avg_Time_at_store__c,Last_Visit_Notes__c from Account where id=:accId];
            if (accounts == null) {
                return;
            }
            Account acc = accounts[0];
            if(visitNotes.size()>0)
                acc.Last_Visit_Notes__c=visitNotes[0].csfs_Notes__c;
                
            //AggregateResult[] groupedResults = [select AVG(csfs_Visit__c.Time_of_Visit__c)aver,AVG(csfs_Visit__c.csfs_Rating__c)rate FROM csfs_Visit__c where csfs_Visit__c.csfs_Account__c =:accId ];    
             
            //Decimal avgTime = (Decimal) groupedResults[0].get('aver');
            //Decimal avgRate = (Decimal) groupedResults[0].get('rate');
            
            //if(avgRate!=null)
              //  acc.Avg_Store_Visit_Rating__c = avgRate;
            //if(avgTime!=null)
              //  acc.Avg_Time_at_store__c = avgTime;
                
            update(acc);    
        }
   }
}