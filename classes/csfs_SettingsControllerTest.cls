@isTest private class csfs_SettingsControllerTest {
    
    @IsTest(SeeAllData=true) public static void test_Initialize_csfs_SettingsController() {
	    csfs_SettingsController controller = new csfs_SettingsController();

	    controller.backgroundImageData = Blob.valueOf('test blob');
	    controller.backgroundFileName = 'testfilename';
	    controller.backgroundImage = new csfs_App_Images__c();
	    controller.uploadAppBackground();

        RestRequest req = new RestRequest();
        RestResponse res = new RestResponse();

        req.requestURI = 'https://salesforce.com/';
        req.httpMethod = 'GET';

        RestContext.request = req;
        RestContext.response = res;
        RestContext.request.addParameter('imageName', 'Field Sales - App Background');

	    controller.deleteImage();
        controller.save();
    }    
}