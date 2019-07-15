@isTest(SeeAllData=true)
public class Customer360ApexTestClass {
    // Grabs all Orders From an Account
    @isTest static void testgetRecentOrder() {
        Account currentPerson = [SELECT Id , Name  
                                 FROM Account 
                                 WHERE RecordTypeId = '0121U000000qE9vQAE' AND Id = '0011U000003iaWVQAY']; 
        Order[] testList = new Order[]{};
            testList = [SELECT Name, TotalAmount, EffectiveDate, Order_Image__c, BillToContactId FROM Order 
                        WHERE BillToContact.Name =: currentPerson.Name ORDER BY EffectiveDate DESC LIMIT 4];
        Order[] assertList = new Order[]{};
            assertList = Customer360Apex.getRecentOrder('0011U000003iaWVQAY');
        System.assertEquals(testList,assertList);
    }
    
    // Grabs all Orders From a Case
    @isTest static void testgetRecentOrderFromCase() {
        Case currentCase = [SELECT Id, AccountId, ContactId FROM Case WHERE Id = '5001U00000189JdQAI'];
        Order[] testList = new Order[]{};
            testList = [SELECT Name, TotalAmount, EffectiveDate, Order_Image__c, BillToContactId FROM Order 
                        WHERE BillToContactId =: currentCase.ContactId ORDER BY EffectiveDate DESC LIMIT 4];
        Order[] assertList = new Order[]{};
            assertList = Customer360Apex.getRecentOrderFromCase('5001U00000189JdQAI');
        System.assertEquals(testList,assertList);
    }
    
    // Grabs all Orders From a Contact
    @isTest static void testgetRecentOrderFromContact() {
        Order[] testList = new Order[]{};
            testList = [SELECT Name, TotalAmount, EffectiveDate, Order_Image__c, BillToContactId FROM Order 
                        WHERE BillToContactId = '0031U000002uM0XQAU' ORDER BY EffectiveDate DESC LIMIT 4];
        Order[] assertList = new Order[]{};
            assertList = Customer360Apex.getRecentOrderFromContact('0031U000002uM0XQAU');
        System.assertEquals(testList,assertList);
    }
    
    // Grabs Contact From a Contact
    @isTest static void testgetContactFromContact() {
        Contact testList = new Contact();
        testList = [SELECT Profile_Metric_1__c, Profile_Metric_2__c , Profile_Metric_3__c , Profile_Metric_4__c 
                    FROM Contact WHERE Id = '0031U000002uM0XQAU'];
        Contact assertList = new Contact();
        assertList = Customer360Apex.getContactFromContact('0031U000002uM0XQAU');
        System.assertEquals(testList,assertList);
    }
    
    
    // Grabs Contact From a Case
    @isTest static void testgetContactFromCase() {
        Contact testList = new Contact();
        testList = [SELECT Profile_Metric_1__c, Profile_Metric_2__c , Profile_Metric_3__c , Profile_Metric_4__c 
                    FROM Contact WHERE Id = '0031U000002uM0XQAU'];
        Contact assertList = new Contact();
        assertList = Customer360Apex.getContactFromCase('5001U00000189JdQAI');
        System.assertEquals(testList,assertList);
    }
    
    
    // Grabs Contact From a Person Account
    @isTest static void testgetContactFromPerson() {
        Account testList = new Account();
        testList = [SELECT Profile_Metric_1__pc, Profile_Metric_2__pc , Profile_Metric_3__pc , Profile_Metric_4__pc 
                    FROM Account WHERE RecordTypeId = '0121U000000qE9vQAE' AND Id = '0011U000003iaWVQAY'];
        Account assertList = new Account();
        assertList = Customer360Apex.getContactFromPerson('0011U000003iaWVQAY');
        System.assertEquals(testList,assertList);
    }    
    
    // Grabs Label By Contact Field API Name
    @isTest static void testgetLabel() {
        String assertList;
        assertList = Customer360Apex.getLabel('Profile_Metric_1__c');
        System.assertEquals('Profile Metric 1',assertList);
    }     
    
    // Grabs Most Viewed Records From Contact
    @isTest static void testgetMostViewedFromContact() {
        Most_Viewed_Interest__c[] testList = new Most_Viewed_Interest__c[]{};
            testList = [SELECT Title__c, Interest__c, Image__c FROM Most_Viewed_Interest__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        Most_Viewed_Interest__c[] assertList = new Most_Viewed_Interest__c[]{};
            assertList = Customer360Apex.getMostViewedFromContact('0031U000002uM0XQAU');
        System.assertEquals(testList,assertList);
    }       
    
    // Grabs Most Viewed Records From Case
    @isTest static void testgetMostViewedFromCase() {
        Most_Viewed_Interest__c[] testList = new Most_Viewed_Interest__c[]{};
            testList = [SELECT Title__c, Interest__c, Image__c FROM Most_Viewed_Interest__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        Most_Viewed_Interest__c[] assertList = new Most_Viewed_Interest__c[]{};
            assertList = Customer360Apex.getMostViewedFromCase('5001U00000189JdQAI');
        System.assertEquals(testList,assertList);
    }  
    
    // Grabs Most Viewed Records From A Person Account
    @isTest static void testgetMostViewedFromPerson() {
        Account currentPerson = [SELECT Id , Name  
                                 FROM Account 
                                 WHERE RecordTypeId = '0121U000000qE9vQAE' AND Id = '0011U000003iaWVQAY' 
                                 ORDER BY CreatedDate DESC LIMIT 4]; 
        Most_Viewed_Interest__c[] testList = new Most_Viewed_Interest__c[]{};
            testList = [SELECT Title__c, Interest__c, Image__c  FROM Most_Viewed_Interest__c WHERE Contact__r.Name =: currentPerson.Name ORDER BY CreatedDate DESC LIMIT 4];
        Most_Viewed_Interest__c[] assertList = new Most_Viewed_Interest__c[]{};
            assertList = Customer360Apex.getMostViewedFromPerson('0011U000003iaWVQAY');
        System.assertEquals(testList,assertList);
    } 
    
    
    // Grabs Most Viewed Records From Contact
    @isTest static void testgetWishlistFromContact() {
        Wishlist_Item__c[] testList = new Wishlist_Item__c[]{};
            testList = [SELECT Title__c, Date_Added__c, Price__c, Image__c  FROM Wishlist_Item__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        Wishlist_Item__c[] assertList = new Wishlist_Item__c[]{};
            assertList = Customer360Apex.getWishlistFromContact('0031U000002uM0XQAU');
        System.assertEquals(testList,assertList);
    }       
    
    // Grabs Most Viewed Records From Case
    @isTest static void testgetWishlistFromCase() {
        Wishlist_Item__c[] testList = new Wishlist_Item__c[]{};
            testList = [SELECT Title__c, Date_Added__c, Price__c, Image__c  FROM Wishlist_Item__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        Wishlist_Item__c[] assertList = new Wishlist_Item__c[]{};
            assertList = Customer360Apex.getWishlistFromCase('5001U00000189JdQAI');
        System.assertEquals(testList,assertList);
    }  
    
    // Grabs Most Viewed Records From A Person Account
    @isTest static void testgetWishlistFromPerson() {
        Account currentPerson = [SELECT Id , Name  
                                 FROM Account 
                                 WHERE RecordTypeId = '0121U000000qE9vQAE' AND Id = '0011U000003iaWVQAY' 
                                 ORDER BY CreatedDate DESC LIMIT 4]; 
        Wishlist_Item__c[] testList = new Wishlist_Item__c[]{};
            testList = [SELECT Title__c, Date_Added__c, Price__c, Image__c  FROM Wishlist_Item__c WHERE Contact__r.Name =: currentPerson.Name ORDER BY CreatedDate DESC LIMIT 4];
        Wishlist_Item__c[] assertList = new Wishlist_Item__c[]{};
            assertList = Customer360Apex.getWishlistFromPerson('0011U000003iaWVQAY');
        System.assertEquals(testList,assertList);
    } 
    
    // Grabs Most Viewed Records From Contact
    @isTest static void testgetBasketItemFromContact() {
        In_Basket_Item__c[] testList = new In_Basket_Item__c[]{};
            testList = [SELECT Title__c, Price__c, Image__c  FROM In_Basket_Item__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        In_Basket_Item__c[] assertList = new In_Basket_Item__c[]{};
            assertList = Customer360Apex.getBasketItemFromContact('0031U000002uM0XQAU');
        System.assertEquals(testList,assertList);
    }       
    
    // Grabs Most Viewed Records From Case
    @isTest static void testgetBasketItemFromCase() {
        In_Basket_Item__c[] testList = new In_Basket_Item__c[]{};
            testList = [SELECT Title__c, Price__c, Image__c  FROM In_Basket_Item__c WHERE Contact__c = '0031U000002uM0XQAU' ORDER BY CreatedDate DESC LIMIT 4];
        In_Basket_Item__c[] assertList = new In_Basket_Item__c[]{};
            assertList = Customer360Apex.getBasketItemFromCase('5001U00000189JdQAI');
        System.assertEquals(testList,assertList);
    }  
    
    // Grabs Most Viewed Records From A Person Account
    @isTest static void testgetBasketItemFromPerson() {
        Account currentPerson = [SELECT Id , Name  
                                 FROM Account 
                                 WHERE RecordTypeId = '0121U000000qE9vQAE' AND Id = '0011U000003iaWVQAY' 
                                 ORDER BY CreatedDate DESC LIMIT 4]; 
        In_Basket_Item__c[] testList = new In_Basket_Item__c[]{};
            testList = [SELECT Title__c, Price__c, Image__c  FROM In_Basket_Item__c WHERE Contact__r.Name =: currentPerson.Name ORDER BY CreatedDate DESC LIMIT 4];
        In_Basket_Item__c[] assertList = new In_Basket_Item__c[]{};
            assertList = Customer360Apex.getBasketItemFromPerson('0011U000003iaWVQAY');
        System.assertEquals(testList,assertList);
    }     
}