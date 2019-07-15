global class CPGEmployeeWrapper {
	
    global User user {get; set;}
    global List<DE_Project_Line_Item__c> itemList {get; set;}

    global CPGEmployeeWrapper(User uId) {
        this.user = uId;
        System.debug(this.user);
        
        this.itemList = [SELECT Id,Name,Project_Checklist__c,Project__c,Project__r.end_Date__c,Project__r.name,Priority__c, Assigned__c FROM DE_Project_Line_Item__c Where Assigned__c = :uId.Id];
        System.debug(itemList);
    }
}