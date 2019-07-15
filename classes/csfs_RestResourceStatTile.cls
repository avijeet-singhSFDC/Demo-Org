/**
* @author Salesforce.com
* @date 2016
*
* @description REST endpoint (/statTile) that returns a stat tiles
*/

@RestResource(urlMapping='/*/statTile')
global with sharing class csfs_RestResourceStatTile {

	@HttpGet
	global static List<StatisticsTile> doGet() {
		List<csfs_Statistic_Tile__c> statTiles = [SELECT name, Sort_Order__c, Current_Value_Query__c, Detail_URL__c, Target_Value_Query__c, Target_Label__c, csfs_Type__c, csfs_Show_Percentage__c from csfs_Statistic_Tile__c];
        List<StatisticsTile> statTileResults = new List<StatisticsTile>();

        for (csfs_Statistic_Tile__c tile : statTiles) {
	        StatisticsTile statTile = new StatisticsTile();
            statTile.Id = tile.Id;
            statTile.Name = tile.Name;
            statTile.Type = tile.csfs_Type__c;
            statTile.DetailURL = String.valueOf(tile.Detail_URL__c);
            statTile.TargetLabel = String.valueOf(tile.Target_Label__c);
            statTile.SortOrder = Integer.valueOf(tile.Sort_Order__c.round(System.RoundingMode.UNNECESSARY));
            statTile.ShowPercentage = tile.csfs_Show_Percentage__c;
            if (tile.Current_Value_Query__c != null) {
                statTile.CurrentQuantity = getQuantity(tile.Current_Value_Query__c);
            }
            if (tile.Target_Value_Query__c != null) {
                statTile.TotalQuantity = getQuantity(tile.Target_Value_Query__c);
            }
            statTileResults.add(statTile);
        }
		return statTileResults;
	}

    private static String getQuantity(String value) {
        if ( String.isBlank(value) ) return '0';
        if (value.toLowerCase().startsWith('select ')) {
            String userId = UserInfo.getUserId(); // Expose userId to potential usage in dynamic queries
            String returnValue = String.valueOf(Database.query(value)[0].get('expr0'));
            if ( String.isBlank(returnValue) ) return '0';
            return returnValue;
        } else {
            return value;
        }
    }
    
    global class StatisticsTile {
        String Id;
        String Name;
        String TotalQuantity;
        String CurrentQuantity;
        Integer SortOrder;
        String DetailURL;
        String TargetLabel;
        Boolean ShowPercentage;
        String Type;
    }
}