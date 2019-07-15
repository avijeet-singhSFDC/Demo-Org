public class ArticleFeedbackCtrl {
    
    public class ArticleLikeWrap{
        @AuraEnabled
        public Integer likeCountW;
        @AuraEnabled
        public Integer unLikeCountW;
        @AuraEnabled
        public String isLikedW;
    }
	
    @AuraEnabled
    public static void upsertFavArticles(Id recordId, String title, String reasonAttr, String unlineDescAttr, Boolean isLikedAttr){
        Id userId = userInfo.getUserId();
        
        Article_Feedback__c  artFeed = new Article_Feedback__c();
        artFeed.Feedback_Status__c = 'New';
        
        artFeed.Feedback_Description__c = unlineDescAttr;
        system.debug('isLikedAttr'+isLikedAttr);
        artFeed.Like__c = isLikedAttr;
        artFeed.Unlike_Reason__c = reasonAttr;
		
        String baseUrl = System.URL.getSalesforceBaseUrl().toExternalForm();
        String networkId = Network.getNetworkId();
        if(networkId != null){
            Network ntw = [select id, Name, UrlPathPrefix from Network where id =: networkId];
            artFeed.Community_Name__c = ntw.Name;
			artFeed.Feedback_Source__c = 'Communities';
            
            artFeed.Article_Link__c = baseUrl+'/'+ntw.UrlPathPrefix+'/s/article/'+recordId;
        }else{
            artFeed.Feedback_Source__c = 'Internal';
            
            artFeed.Article_Link__c = baseUrl+'/'+recordId;
        }        
        
        //Article artId = [select id From Article where id=: recordId];
        artFeed.Article_ID__c = recordId;
        String objName = findObjectNameFromRecordIdPrefix(recordId);
        artFeed.Article_Type__c = objName;
        
        /*String baseUrl = System.URL.getSalesforceBaseUrl().toExternalForm();
        String urlvalue=Apexpages.currentPage().getUrl();
		artFeed.Article_Link__c = baseUrl+'/'+urlvalue;*/
        
        String query = 'select id, Title, VersionNumber, ArticleNumber from '+objName+' where Id = \''+recordId+'\'';
        List<sObject> sObjList = Database.query(query);
        if(sObjList != null && sObjList.size() > 0){
            sObject sObj = sObjList[0];
            artFeed.Article_Title__c = (String)sObj.get('Title');
            artFeed.Article_Version__c = (Decimal)sObj.get('VersionNumber');
            artFeed.Article_Number__c = (String)sObj.get('ArticleNumber');
        }
        
		upsert artFeed;
    }
    
    public static String findObjectNameFromRecordIdPrefix(String recordIdOrPrefix){
        String objectName = '';
        try{
            //Get prefix from record ID
            //This assumes that you have passed at least 3 characters
            String myIdPrefix = String.valueOf(recordIdOrPrefix).substring(0,3);
             
            //Get schema information
            Map<String, Schema.SObjectType> gd =  Schema.getGlobalDescribe(); 
             
            //Loop through all the sObject types returned by Schema
            for(Schema.SObjectType stype : gd.values()){
                Schema.DescribeSObjectResult r = stype.getDescribe();
                String prefix = r.getKeyPrefix();
                //System.debug('Prefix is ' + prefix);
                 
                //Check if the prefix matches with requested prefix
                if(prefix!=null && prefix.equals(myIdPrefix)){
                    objectName = r.getName();
                    //System.debug('Object Name! ' + objectName);
                    break;
                }
            }
        }catch(Exception e){
            System.debug(e);
        }
        return objectName;
    }
    
}