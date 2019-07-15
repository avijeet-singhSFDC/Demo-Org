trigger csfs_StorePromotionTrigger on csfs_Store_Promotion__c (after insert) {

    if(csfs_CheckRecursiveTrigger.runOnce()) {

        for(csfs_Store_Promotion__c sp:trigger.new)
        {   
            Id storePromoId = sp.id;
            Id AccountId = sp.csfs_Store__c;
            Id promotionId = sp.csfs_promotion__c;
            List <Account> storeAcc = new List<Account>();
            List <Account> profileStore = new List<Account>();
            Account account = [select id, RecordType.Name, parentid from Account where id = :AccountId];

            System.debug('=====================');
            System.debug(sp);
            System.debug('ACCT ID = ' + AccountId);
            System.debug(account);

            if(account.RecordType.Name == 'Retail Chain') {
                List <Account> chainProfiles = [select id from Account where parentid = :AccountId and RecordType.Name = 'Retail Profile'];
                storeAcc = [select id from Account where parentid in :chainProfiles and RecordType.Name = 'Retail Store'];
            } else if(account.RecordType.Name == 'Retail Profile') {
                storeAcc = [Select id from Account where parentid = :AccountId and RecordType.Name = 'Retail Store' ];
            }

            List<csfs_Store_Promotion__c> storePromotions = new List <csfs_Store_Promotion__c>();
            for (Account acct : storeAcc) {
                csfs_Store_Promotion__c storePromo = new csfs_Store_Promotion__c();
                            storePromo.csfs_Store__c = acct.id;
                            storePromo.csfs_promotion__c = promotionId;
                            storePromotions.add(storePromo);
            }
            upsert(storePromotions);
        }
    }
}