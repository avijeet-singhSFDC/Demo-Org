global class DE_KanbanFullCtrl {
  
    
    @RemoteAction
    global static Object[] getTasks(){
        Project_Task__c[] tasks = new Project_Task__c[]{};
        tasks = [Select Id, Name, Location__c From Project_Task__c Where Owner__c = :UserInfo.getUserId() AND Owner__c != null];
        
    return tasks;
    }
    
    @RemoteAction
    global static Object[] getEmployees(String locationId, String taskId){
        EmployeeWrapper[] employeeWrappers = new EmployeeWrapper[]{};
        DE_Employee__c[] employees = new DE_Employee__c[]{};
        DE_Project_Line_Item__c[] items = new DE_Project_Line_Item__c[]{};
        
        employees = [Select Id, Location__c, User__r.Name, User__r.Id, User__r.SmallPhotoURL From DE_Employee__c Where Location__c =: locationId];
        
        String[] employeeUserIds = new String[]{};
        for(DE_Employee__c emp: employees){
            employeeUserIds.add(emp.User__r.Id);
        }
        
        items = [Select Id, Name, Priority__c, Assigned__c, Start_Date__c, End_Date__c, Item_Image__c From DE_Project_Line_Item__c Where Assigned__c =:employeeUserIds And Task__c =: taskId];
        
        for(DE_Employee__c emp: employees){
            DE_Project_Line_Item__c[] tempItems = new DE_Project_Line_Item__c[]{};
            for(DE_Project_Line_Item__c item: items){
                if(emp.User__r.Id == item.Assigned__c)
                    tempItems.add(item);
            }
            employeeWrappers.add(new EmployeeWrapper(emp, tempItems));
        }
        
    return employeeWrappers;
    }
    
    @RemoteAction
    global static Object[] getLineItems(String taskId){
        DE_Project_Line_Item__c[] items = new DE_Project_Line_Item__c[]{};
        items = [Select Id, Name, Priority__c, Assigned__c, Start_Date__c, End_Date__c, Item_Image__c From DE_Project_Line_Item__c Where Task__c =:taskId And Assigned__c = null];
    return items;
    }
    
    @RemoteAction
    global static String updateLineItems(DE_Project_Line_Item__c[] lineItems){
        update lineItems;
        return 'success';
    }
    
    global class EmployeeWrapper {
        global DE_Employee__c employee {get;set;}
        global DE_Project_Line_Item__c[] items {get;set;}
        
        global EmployeeWrapper(DE_Employee__c e, DE_Project_Line_Item__c[] i){
      this.employee = e;
            this.items = i;
        }
    }
    
}