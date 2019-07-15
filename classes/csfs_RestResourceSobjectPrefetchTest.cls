@isTest
private class csfs_RestResourceSobjectPrefetchTest {

    @testSetup static void setupData() {
        csfs_Field_Sales_Settings__c settings = new csfs_Field_Sales_Settings__c();
        settings.csfs_Data_Sync_Option__c = 'MyRecords';
        settings.csfs_Account_Sync_Option__c = 'StoreRecords';
        insert settings;
    }

    @isTest static void testPrefetch_Task() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/task';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(0, items.size());

        csfs_TestUtils.createTask();

        req = new RestRequest();
        res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/task';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(1, items.size());
    }

    @isTest static void testPrefetch_StorePromotions() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = salesforceHost + 'services/apexrest/v36.0/prefetch/csfs_Store_Promotion__c';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(0, items.size());

        csfs_TestUtils.createStorePromotion();

        req = new RestRequest();
        res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/csfs_Store_Promotion__c';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(1, items.size());
    }

    @isTest static void testPrefetch_Visit() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/csfs_visit__c';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(0, items.size());

        Account a = csfs_TestUtils.createAccount();
        csfs_TestUtils.createVisit(csfs_TestUtils.createContact(a.Id).Id);

        req = new RestRequest();
        res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/csfs_visit__c';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(1, items.size());
    }

    @isTest static void testPrefetch_Account() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/account';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(0, items.size());

        Account a = csfs_TestUtils.createAccount();

        req = new RestRequest();
        res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/account';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(1, items.size());
    }

    @isTest static void testPrefetch_Contact() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/contact';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(0, items.size());

        Account a = csfs_TestUtils.createAccount();
        csfs_TestUtils.createContact(a.Id);

        req = new RestRequest();
        res = new RestResponse();

        req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/contact';
        req.httpMethod = 'GET';
        RestContext.request = req;
        RestContext.response = res;

        items = csfs_RestResourceSobjectPrefetch.doGet();
        system.assertEquals(1, items.size());
    }
    
    @isTest static void testPrefetch_Objects() {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        String[] objectNames = new String[]{'csfs_visitobjective__c','csfs_notification__c','Product2'};
        for (string objectName : objectNames) {
         
            req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/' + objectName;
            req.httpMethod = 'GET';
            RestContext.request = req;
            RestContext.response = res;
    
            List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
            system.assertEquals(0, items.size());

        }
        
        csfs_TestUtils.createVisitObjective();
        csfs_TestUtils.createNotification();
        csfs_TestUtils.createProduct();
        
        for (string objectName : objectNames) {
            req = new RestRequest();
            res = new RestResponse();
    
            req.requestURI = salesforceHost + '/services/apexrest/v36.0/prefetch/' + objectName;
            req.httpMethod = 'GET';
            RestContext.request = req;
            RestContext.response = res;
    
            List<sObject> items = csfs_RestResourceSobjectPrefetch.doGet();
            system.assertEquals(1, items.size());
        }
    }
}