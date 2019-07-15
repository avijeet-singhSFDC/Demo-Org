global class CPGKanbanCtrl {
    
    public List<DE_Project__c> projectList {get; set;}
    public List<CPGProjectWrapper> projectWrapperList {get; set;}
    public List<DE_Project_Line_Item__c> itemList {get; set;}
    public List<CPGEmployeeWrapper> empList {get; set;}
    
    public CPGKanbanCtrl() {
        
        String projectId = ApexPages.currentPage().getParameters().get('id');
        
        // Instantiate and build the Project wrapper list
        projectWrapperList = new List<CPGProjectWrapper>();
        buildProjectList([SELECT Brand__c,End_Date__c,Id,Name,OwnerId,Project_Description__c,Start_Date__c FROM DE_Project__c Where Id = :projectId]);
        
        // Instantiate and build the Employee wrapper list       
        empList = new List<CPGEmployeeWrapper>();
        buildEmployeeList([SELECT Id,Name FROM User WHERE Name = 'Dan Gilbert' Or Name = 'Erik Lue' Or Name = 'Colin Berta' ORDER BY Name ASC NULLS LAST]);
    }
    
    
    public CPGKanbanCtrl(ApexPages.StandardController controller) {
        
        Project_Task__c task = (Project_Task__c)controller.getRecord();
        task = [Select Id, Name, Owner__c, Location__c, Project__c From Project_Task__c Where Id = :task.Id];
        
        
        // Instantiate and build the Project wrapper list
        projectWrapperList = new List<CPGProjectWrapper>();
        buildProjectList([SELECT Brand__c,End_Date__c,Id,Name,OwnerId,Project_Description__c,Start_Date__c FROM DE_Project__c Where Id = :task.Project__c]);
        
        // Instantiate and build the Employee wrapper list       
        empList = new List<CPGEmployeeWrapper>();
        
        DE_Employee__c[] employees = [Select User__c, User__r.FirstName, User__r.LastName, Role__c, Location__c From DE_Employee__c Where Location__c = :task.Location__c];
        for(DE_Employee__c e: employees){
            User emp = new User();
            emp.Id = e.User__c;
            emp.FirstName = e.User__r.FirstName;
            emp.LastName = e.User__r.LastName;
            
            empList.add(new CPGEmployeeWrapper(emp));
        }
        
        //buildEmployeeList([SELECT Id, Name FROM User WHERE Name = 'Dan Gilbert' Or Name = 'Erik Lue' Or Name = 'Colin Berta' ORDER BY Name ASC NULLS LAST]);
    }
    
    /* This function builds the project list out of the project wrapper class */
    public void buildProjectList(List<DE_Project__c> pList) {
        
        if(pList != null) {
            for(DE_Project__c p : pList){
                projectWrapperList.add(new CPGProjectWrapper(p));
            }
        }
    }
    
    /* This function builds each of the employee lists out of the employee wrapper class */
    public void buildEmployeeList(List<User> employeeList){
        
        if(employeeList != null){
            for(User u : employeeList){
                empList.add(new CPGEmployeeWrapper(u));
            }
        }
    }
    
    /* This function has 3 parameters: employeeId (userId), itemId[], and a priority value[]. 
       It creates a temporary Project Line Item array by iterating through the itemList argument,
       then upserts the entire array to update the Assigned and priority fields */
    
    @RemoteAction
    public static void updateTaskPriority(String empId, String[] itemList, String[] priorityList){
        
        List<DE_Project_Line_Item__c> tempItemList = new List<DE_Project_Line_Item__c>();
        
        /* If one of the task items is dragged from an employee column back 
           to the project column, the assigned__c field will be null. We're
           setting the priority to 0 when this happens. */
        
        if(empId != null){
            for(Integer i = 0; i < itemList.size(); i++){
                tempItemList.add(new DE_Project_Line_Item__c(Id = itemList[i], Priority__c = Integer.valueOf(priorityList[i]), Assigned__c = empId));
            }
        } else {
            for(Integer i = 0; i < itemList.size(); i++){
                tempItemList.add(new DE_Project_Line_Item__c(Id = itemList[i], Priority__c = 0, Assigned__c = empId));
            }
        }
        
        upsert tempItemList;
    }
    
}