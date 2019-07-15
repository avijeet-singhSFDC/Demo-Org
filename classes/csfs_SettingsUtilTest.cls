@IsTest private class csfs_SettingsUtilTest {

    @IsTest(SeeAllData=true) static void testcsfs_SettingsUtilTest() {
        Test.setMock(HttpCalloutMock.class, new csfs_PageLayoutTestMockResponseGenerator());

        csfs_SettingsUtil controller = new csfs_SettingsUtil();

        csfs_SettingsUtil.getNameField('Account');
        List<csfs_RestResourcePageLayout.ObjectLayoutInfo> layouts = csfs_SettingsUtil.getAllLayouts();
        if (!layouts.isEmpty()) {
        	csfs_SettingsUtil.getFieldsFromLayout(layouts.get(0).layout, 'Account');
        }
	}
}