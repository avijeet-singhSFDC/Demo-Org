global class PrototypeTaskWizardCtrl {
    
    public String locationId {get;set;}
    
    public PrototypeTaskWizardCtrl(){
        locationId = ApexPages.currentPage().getParameters().get('id');
        //project = [Select Id, Brand__c From DE_Project__c  Where Id = :projectId];
    }
    
    public PrototypeTaskWizardCtrl(ApexPages.StandardController controller){
        locationId = ApexPages.currentPage().getParameters().get('id');
    }
    
    @RemoteAction
    global static DE_Location__c[] getBrands(){
        DE_Location__c[] allBrands = new DE_Location__c[]{};
            allBrands = [Select Id, Name, Parent_Location__c, RecordType.Name From DE_Location__c Where RecordType.Name = 'Brand'];
        
        return allBrands;
    }
    
    @RemoteAction
    global static DE_Location__c[] getLocations(String brandId){
        DE_Location__c[] allLocations = new DE_Location__c[]{};
            allLocations = [Select Id, Name, Parent_Location__c, RecordType.Name From DE_Location__c Where Brand__c =: brandId OR Id = :brandId Order By Name ASC];
        
        return allLocations;
    }
    
    @RemoteAction
    global static String getTaskTemplates(){
        DE_Task_Template__c[] allTemplates = new DE_Task_Template__c[]{};
            allTemplates = [Select Id, Name From DE_Task_Template__c];
        
        return JSON.serialize(allTemplates);
    }
    
    @RemoteAction
    global static String setTaskTemplate(String templateId){
        //All queries
        DE_Task_Template__c selectedTemplate = [Select Id, Name, Days_Out_Assigned__c, Days_Out_Due__c From DE_Task_Template__c Where Id = :templateId];
        DE_Checklist_Template__c[] checklists = new DE_Checklist_Template__c[]{};
            checklists = [Select Id, Name From DE_Checklist_Template__c Where Task_Template__c = :selectedTemplate.Id Order By Days_Out_Assigned__c ASC];
        
        //Array of checklist template ids
        String[] checklistIds = new String[]{};
            for(DE_Checklist_Template__c cl: checklists){
                checklistIds.add(cl.Id);
            }
        
        //Query all line items
        DE_Line_Item_Template__c[] checklistLineItems = new DE_Line_Item_Template__c[]{};
            checklistLineItems = [Select Id, Name, Checklist_Template__c, Days_Out_Assigned__c, Days_Out_Due__c, Item_Image__c  From DE_Line_Item_Template__c Where Checklist_Template__c = :checklistIds];
        
        //Create checklist/line item map
        Map<Id,Id> checklistLineItemMap = new Map<Id,Id>();
        
        for(DE_Line_Item_Template__c cli: checklistLineItems){
            checklistLineItemMap.put(cli.Id, cli.Checklist_Template__c);
        }
        
        //Init checklist wrapper
        ChecklistMap[] checklistMapArray = new ChecklistMap[]{};
            
            for(DE_Checklist_Template__c cl: checklists){
                ChecklistMap thisChecklistMap = new ChecklistMap();
                thisChecklistMap.checklist = cl;
                
                for(DE_Line_Item_Template__c cli: checklistLineItems){
                    if(cl.Id == cli.Checklist_Template__c){
                        thisChecklistMap.checklistLineItems.add(cli);
                    }
                }
                
                checklistMapArray.add(thisChecklistMap);
            }
        
        TaskMap thisTaskMap = new TaskMap();
        thisTaskMap.task = selectedTemplate;
        thisTaskMap.checklists = checklistMapArray;
        
        return JSON.serialize(thisTaskMap);
    }
    
    @RemoteAction
    global static DE_Project__c insertProject(String projectName, String locationId, String startDate, String endDate){
        DE_Project__c project = new DE_Project__c();
        project.Name = projectName;
        project.Brand__c = locationId;
        project.Start_Date__c  = Date.valueOf(startDate);
        project.End_Date__c  = Date.valueOf(endDate);
        
        insert project;
        
        return project;
    }
    
    @RemoteAction
    global static Project_Task__c[] insertTasks(String projectId, DE_Location__c[] locations, DE_Task_Template__c taskTemplate){
        Project_Task__c[] tasks = new Project_Task__c[]{};
            
        Date taskStartDate = Date.today().addDays(Integer.valueOf(taskTemplate.Days_Out_Assigned__c));
        Date taskEndDate = Date.today().addDays(Integer.valueOf(taskTemplate.Days_Out_Due__c));
        
        for(DE_Location__c location: locations) {
            Project_Task__c projectTask = new Project_Task__c();
            projectTask.Name = taskTemplate.Name + ' - ' + location.Name;
            projectTask.Project__c = projectId;
            projectTask.Location__c = location.Id;
            projectTask.Start_Date__c = taskStartDate;
            projectTask.End_Date__c = taskEndDate;
            tasks.add(projectTask);
        }
        
        
        if(tasks.size() > 0){
            try {
                insert tasks;
                return tasks;
            }
            catch(Exception e){
                System.debug(e);
                return null;
            }
        }
        else {
            return null;
        }
    }
    
    @RemoteAction
    public static DE_Project_Checklist__c[] insertChecklists(String projectId, Project_Task__c[] tasks, DE_Checklist_Template__c[] checklists){        
        
        DE_Project_Checklist__c[] insertedChecklists = new DE_Project_Checklist__c[]{};
            
            for(Project_Task__c task: tasks){
                for(DE_Checklist_Template__c checklist: checklists){
                    DE_Project_Checklist__c newChecklist = new DE_Project_Checklist__c();
                    newChecklist.Name = checklist.Name;
                    newChecklist.Project__c = projectId;
                    newChecklist.Project_Task__c = task.Id;
                    newChecklist.Temp_Id__c = checklist.Id;
                    insertedChecklists.add(newChecklist);
                }
            }
        
        if(insertedChecklists.size() > 0){
            try {
                insert insertedChecklists;
                return insertedChecklists;
            }
            catch(Exception e){
                System.debug(e);
                return null;
            }
        }
        else {
            return null;
        }
        
    }
    
    
    @RemoteAction
    public static DE_Project_Line_Item__c[] insertLineItems(String projectId, DE_Project_Checklist__c[] checklists, DE_Line_Item_Template__c[] items){
        
        
        DE_Project_Line_Item__c[] insertedLineItems = new DE_Project_Line_Item__c[]{};
            
            for(DE_Project_Checklist__c checklist: checklists){
                for(DE_Line_Item_Template__c item: items){
                    System.debug(item);
                    
                    Date startDate = Date.today().addDays(Integer.valueOf(item.Days_Out_Assigned__c));
                    Date endDate = Date.today().addDays(Integer.valueOf(item.Days_Out_Due__c));
                    
                    if(checklist.Temp_ID__c == item.Checklist_Template__c){
                        DE_Project_Line_Item__c newLineItem = new DE_Project_Line_Item__c();
                        newLineItem.Name = item.Name;
                        newLineItem.Start_Date__c = startDate;
                        newLineItem.End_Date__c = endDate;
                        newLineItem.Project__c = projectId;
                        newLineItem.Project_Checklist__c = checklist.Id;
                        newLineItem.Task__c = checklist.Project_Task__c;
            newLineItem.Item_Image__c = item.Item_Image__c;
                        System.debug(newLineItem);
                        
                        insertedLineItems.add(newLineItem);
                    }
                }
            }
        
        if(insertedLineItems.size() > 0){
            try {
                insert insertedLineItems;
                return insertedLineItems;
            }
            catch(Exception e){
                System.debug(e);
                return null;
            }
        }
        else {
            return null;
        }
    }
    
    global class TaskMap {
        global DE_Task_Template__c task {get;set;}
        global ChecklistMap[] checklists {get;set;}
        
        global TaskMap(){
            checklists = new ChecklistMap[]{};
        }
    }
    
    global class ChecklistMap {
        global DE_Checklist_Template__c checklist {get;set;}
        global DE_Line_Item_Template__c[] checklistLineItems {get;set;}
        
        global ChecklistMap(){
            checklistLineItems = new DE_Line_Item_Template__c[]{};
                }
    }
}