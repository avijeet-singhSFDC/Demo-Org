@isTest
private class csfs_RestResourceStatTileTest {
		
	@isTest static void test_do_get() {

		List<csfs_Statistic_Tile__c> st = new List<csfs_Statistic_Tile__c>();

		st.add(new csfs_Statistic_Tile__c(
			Current_Value_Query__c = 'select sum(csfs_objectives_completed__c) from account',
			Name = 'Completed Activities',
			Sort_Order__c = 2.0,
			Target_Label__c = 'Ongoing',
			Target_Value_Query__c = 'select sum(csfs_objectives_Planned__c) from account',
			csfs_show_percentage__c = true
		));

		insert(st);

        List<csfs_RestResourceStatTile.StatisticsTile> results = csfs_RestResourceStatTile.doGet();
	}
	
}