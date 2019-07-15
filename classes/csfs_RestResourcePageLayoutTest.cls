@isTest
private class csfs_RestResourcePageLayoutTest {
    
    @IsTest public static void testcsfs_RestResourcePageLayoutTest() {
        //csfs_RestResourcePageLayout controller = new csfs_RestResourcePageLayout();
        Test.setMock(HttpCalloutMock.class, new csfs_PageLayoutTestMockResponseGenerator());

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = 'https://salesforce.com/';
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;
        List<csfs_RestResourcePageLayout.ObjectLayoutInfo> oli = csfs_RestResourcePageLayout.doGet();

        RestContext.request.requestURI = 'https://salesforce.com/Account';
        RestContext.request.addParameter('objectType', 'Account');
        RestContext.request.addParameter('recordTypeId', '012000000000000');
        oli = csfs_RestResourcePageLayout.doGet();
    }
}