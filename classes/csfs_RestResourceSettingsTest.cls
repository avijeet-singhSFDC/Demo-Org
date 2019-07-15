@isTest
private class csfs_RestResourceSettingsTest {
        
    @IsTest(SeeAllData=true) public static void testcsfs_RestResourceSettings() {
        csfs_RestResourceSettings.ApplicationSettings results = csfs_RestResourceSettings.doGet();
    }   

}