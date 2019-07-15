global with sharing class DE_TaskGanttChart_CT {
    
    public DE_TaskGanttChart_CT(ApexPages.StandardController controller) {}
    
    @RemoteAction 
    global static Project_Task__c[] getTasks(){
        return [SELECT Project__c, Location__c, Start_Date__c, End_Date__c, Id, Name, 
                Project__r.Start_Date__c, Project__r.End_Date__c, Project__r.Name
                    FROM Project_Task__c];
    }
    
    @RemoteAction
    global static Object[] getTaskLineItems(String projectId){
        TaskWrapper[] wrappedTasks = new TaskWrapper[]{};
        
        Project_Task__c[] tasks = new Project_Task__c[]{};
        tasks = [Select Id, Name, Start_Date__c, End_Date__c 
                 From Project_Task__c 
                 Where Project__c = :projectId 
                 Order By Start_Date__c];
        
        DE_Project_Line_Item__c[] lineItems = new DE_Project_Line_Item__c[]{};     
        lineItems = [SELECT Project__c, Assigned__C, Start_Date__c, End_Date__c, Id, Name, 
                            Project__r.Start_Date__c, Project__r.End_Date__c, Project__r.Name, Priority__c, 
                            Assigned__r.Name, Project_CheckList__c, Progress__c, Project_Checklist__r.Project_Task__c
                     FROM DE_Project_Line_Item__c 
                     WHERE project__c =: projectId
                     Order By Start_Date__c];
        
        for(Project_Task__c t: tasks){
            DE_Project_Line_Item__c[] tempLineItems = new DE_Project_Line_Item__c[]{};
        
            for(DE_Project_Line_Item__c li: lineItems){
                if(t.Id == li.Project_Checklist__r.Project_Task__c)
                    tempLineItems.add(li);
            }
            wrappedTasks.add(new TaskWrapper(t,tempLineItems));
        }
        
        
        return wrappedTasks;
    }
    
    @RemoteAction
    global static Object[] getTasksByLocation(String locationId){
        TaskWrapper[] wrappedTasks = new TaskWrapper[]{};
        
        Project_Task__c[] tasks = new Project_Task__c[]{};
        tasks = [Select Id, Name, Start_Date__c, End_Date__c 
                 From Project_Task__c 
                 Where Location__c = :locationId 
                 Order By Start_Date__c];
        
        List<String> taskIds = new List<String>();
            
        for(Project_Task__c pt: tasks){
            taskIds.add(pt.Id);
        }
        
        DE_Project_Line_Item__c[] lineItems = new DE_Project_Line_Item__c[]{};     
        lineItems = [SELECT Project__c, Assigned__C, Start_Date__c, End_Date__c, Id, Name, 
                            Project__r.Start_Date__c, Project__r.End_Date__c, Project__r.Name, Priority__c, 
                            Assigned__r.Name, Project_CheckList__c, Progress__c, Project_Checklist__r.Project_Task__c
                     FROM DE_Project_Line_Item__c 
                     WHERE task__c = :taskIds
                     Order By Start_Date__c];
        
        for(Project_Task__c t: tasks){
            DE_Project_Line_Item__c[] tempLineItems = new DE_Project_Line_Item__c[]{};
        
            for(DE_Project_Line_Item__c li: lineItems){
                if(t.Id == li.Project_Checklist__r.Project_Task__c)
                    tempLineItems.add(li);
            }
            wrappedTasks.add(new TaskWrapper(t,tempLineItems));
        }
        
        
        return wrappedTasks;
    }
    
    
    global class TaskWrapper {
        global Project_Task__c task {get;set;}
        global DE_Project_Line_Item__c[] lineItems {get;set;}
    
        global TaskWrapper(Project_Task__c t, DE_Project_Line_Item__c[] li){
            this.task = t;
            this.lineItems = li;
        }
        
    }
}