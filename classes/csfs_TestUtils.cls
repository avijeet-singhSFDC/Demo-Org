/**
* @author Salesforce.com
* @date 2016
*
* @description Utility class for unit tests
*/
public with sharing class csfs_TestUtils {

    public static Task newTask() {
        Task t = new Task();
        t.Priority = 'Low';
        t.Type = 'Call';
        t.Status = 'In Progress';
        return t;
    }

    public static Task createTask() {
        Task t = newTask();
        insert t;
        return t;
    }

    public static Account newAccount() {
        Account a = new Account();
        a.Name = 'Test Account';
        a.Type = 'Retail Store';
        a.OwnerId = UserInfo.getUserId();
        a.RecordTypeId = [select Id from RecordType where Name = 'Retail Store' and SobjectType = 'Account'][0].Id;
        return a;
    }

    public static Account createAccount() {
        Account a = newAccount();
        insert a;
        return a;
    }

    public static Contact newContact(String accountId) {
        Contact c = new Contact();
        c.FirstName = 'Test';
        c.LastName = 'Contact';
        c.AccountId = accountId;
        return c;
    }

    public static Contact createContact(String accountId) {
        Contact c = newContact(accountId);
        insert c;
        return c;
    }

    public static Contact createContact() {
        Account account = createAccount();
        return createContact(account.Id);
    }

    public static Product2 newProduct() {
        Product2 p = new Product2(Name = 'Test Product', Family = 'Test Family');
        return p;
    }

    public static Product2 createProduct() {
        Product2 p = newProduct();
        insert p;
        return p;
    }

    public static csfs_Promotion__c newPromotion() {
        csfs_Promotion__c p = new csfs_Promotion__c();
        p.Name = 'Test Promotion';
        p.csfs_Active__c = true;
        p.csfs_EndDate__c = System.today() + 1;
        return p;
    }

    public static csfs_Promotion__c createPromotion() {
        csfs_Promotion__c p = newPromotion();
        insert p;
        return p;
    }

    public static csfs_Visit__c newVisit(String contactId) {
        csfs_Visit__c v = new csfs_Visit__c();
        v.Name = 'Test Visit';
        v.csfs_Contact__c = contactId;
        v.csfs_StartDate__c = System.today();
        v.csfs_EndDate__c = System.today().addDays(1);
        v.csfs_Account__c = createAccount().Id;
        return v;
    }

    public static csfs_Visit__c createVisit(String contactId) {
        csfs_Visit__c v = newVisit(contactId);
        insert v;
        return v;
    }

    public static csfs_Visit__c createVisit() {
        Contact contact = createContact();
        return createVisit(contact.id);
    }   

    //public static csfs_ProductOnHand__c createProductOnHand() {
 //       csfs_ProductOnHand__c p = new csfs_ProductOnHand__c();
 //       insert p;
 //       return p;
 //   }

    public static csfs_VisitObjective__c createVisitObjective() {
        csfs_VisitObjective__c vo = new csfs_VisitObjective__c();
        vo.csfs_Visit__c = createVisit().id;
        insert vo;
        return vo;
    }

    //public static csfs_QuarterlyStoreSales__c createQuarterlyStoreSales() {
 //       csfs_QuarterlyStoreSales__c qss = new csfs_QuarterlyStoreSales__c();
 //       insert qss;
 //       return qss;
 //   }

    public static csfs_Notification__c createNotification() {
        csfs_Notification__c n = new csfs_Notification__c();
        n.Name = 'Test Notification';
        insert n;
        return n;
    }

    public static csfs_Store_Promotion__c newStorePromotion(csfs_Promotion__c promotion, Account store) {
        csfs_Store_Promotion__c sp = new csfs_Store_Promotion__c();
        sp.csfs_promotion__c = promotion.Id;
        sp.csfs_Store__c = store.Id;
        return sp;
    }
    
    public static csfs_Store_Promotion__c createStorePromotion(csfs_Promotion__c promotion, Account store) {
        csfs_Store_Promotion__c sp = newStorePromotion(promotion, store);
        insert sp;
        return sp;
    }

    public static csfs_Store_Promotion__c createStorePromotion() {
        csfs_Promotion__c promotion = createPromotion();
        Account store = createAccount();
        return createStorePromotion(promotion, store);
    }

    //public static Store_Product_Promotions__c createStoreProductPromotion() {
 //       Store_Product_Promotions__c spp = new Store_Product_Promotions__c();
 //       spp.Name = 'Test Store Product Promotion';
 //       insert spp;
 //       return spp;
 //   }

}