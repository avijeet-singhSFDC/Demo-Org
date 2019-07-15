trigger AssignTask on Project_Task__c (before insert) {

    Project_Task__c[] tasksToUpdate = new Project_Task__c[]{};
        
    DE_Employee__c[] allEmployees = new DE_Employee__c[]{};
    allEmployees = [Select User__c, Location__c, Role__c From DE_Employee__c];
    
        
    for(Project_Task__c task: Trigger.New){
        for(DE_Employee__c employee: allEmployees){
            if(task.Location__c == employee.Location__c && employee.Role__c == 'Manager'){
                task.Owner__c = employee.User__c;
            }
        }
    }
}