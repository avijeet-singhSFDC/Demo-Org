global class CPGProjectWrapper {
    
    global DE_Project__c project {get; set;}
    global List<DE_Project_Line_Item__c> itemList {get; set;}
    
    /* Constructor */
    global CPGProjectWrapper(DE_Project__c proj){
        this.project = proj;
        this.itemList = [SELECT Id,Name,Project_Checklist__c,Project__c,Project__r.end_date__c,Priority__c,Project_Checklist__r.Name, Assigned__c FROM DE_Project_Line_Item__c Where Project__c = :proj.Id AND Assigned__c = null];
    }
}