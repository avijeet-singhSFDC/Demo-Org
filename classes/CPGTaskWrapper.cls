global class CPGTaskWrapper {
    
    global Project_Task__c task {get; set;}
    global List<DE_Project_Checklist__c> checkList {get; set;} 
    
    global CPGTaskWrapper() {
        
    }
    
    global CPGTaskWrapper(Project_Task__c t) {
        this.task = t;
    }
    
    global CPGTaskWrapper(Project_Task__c t, List<DE_Project_Checklist__c> cList) {
        this.task = t;
        this.checkList = cList;
    }

}