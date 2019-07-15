global class CPGChecklistWrapper {

    global DE_Project_Checklist__c checklist {get; set;}
    global List<DE_Project_Line_Item__c> lineItemList {get; set;}
    
    global CPGChecklistWrapper() {
        
    }
    
    global CPGChecklistWrapper(DE_Project_Checklist__c pc) {
        this.checklist = pc;
    }
    
    global CPGChecklistWrapper(DE_Project_Checklist__c pc, List<DE_Project_Line_Item__c> pli) {
        this.checklist = pc;
        this.lineItemList = pli;
    }
}