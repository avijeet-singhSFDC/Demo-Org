@isTest
private class csfs_TranslationsControllerTest {
	
	@isTest(SeeAllData=true) static void test_csfs_TranslationsController() {
		csfs_TranslationsController controller = new csfs_TranslationsController();
		controller.saveTranslation();

		System.assertNotEquals(controller.translations,null);
	}
}