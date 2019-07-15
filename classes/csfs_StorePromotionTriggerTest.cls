@isTest
private class csfs_StorePromotionTriggerTest {

    @isTest static void test_insert_Store_Promotion() {
        Account store = csfs_TestUtils.createAccount();
        csfs_Promotion__c promotion = csfs_TestUtils.createPromotion();
        csfs_Store_Promotion__c sp = csfs_TestUtils.createStorePromotion(promotion, store);
        
        Account child = csfs_TestUtils.newAccount();
        child.name = 'Store';
        child.ParentId = store.Id;

        insert(child);

        sp.csfs_opted_in__c = false;
        upsert(sp);
    //storeAcc = [Select name, parentid from Account where parentid =:profileId and recordtypeid in (Select Id From RecordType where sobjecttype = 'Account' and name in('Store'))];


    }

    
}