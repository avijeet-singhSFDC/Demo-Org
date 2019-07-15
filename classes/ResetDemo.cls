public class ResetDemo {
    @AuraEnabled
    public static String resetDemoMethod() {
        // Delete Cameron's work orders?
		// Need to create 4 Work Orders
		// Existing process uses the "Get Candidates" QA to populate time and person - figure out the scheduling
		// Mark one of the Appointments as Dispatch
        try {
            // We'll need the maps to properly link the Work Order
            Map<String,Id> accountMap = createAccountMap();
            Map<String,Id> wtMap = createWorkTypeMap();
            
            // Set<Id> ids = (new Map<Id, Lead>([SELECT Id FROM Lead])).keySet();
            
            // Get Cameron
            User cameronTechnician = [SELECT Id FROM User WHERE Alias = 'Cameron' LIMIT 1]; // 0051I000001NAoSQAW 
            // Need to get the ServiceResource for CameronTech
            ServiceResource camSR = [SELECT Id FROM ServiceResource WHERE RelatedRecordId = :cameronTechnician.Id]; // 0Hn1I000000Pqm6SAC
            
            // The following line doesn't work, our set is full or AR Ids, instead of SA Ids
            // Set<Id> saIds = (new Map<Id, AssignedResource>([SELECT ServiceAppointmentId FROM AssignedResource WHERE ServiceResourceId = :camSR.Id])).keySet();
            // We'll need to query and then loop to get the SA Ids
            List<AssignedResource> camAr = [SELECT ServiceAppointment.ParentRecordId FROM AssignedResource WHERE ServiceResourceId = :camSR.Id];
            Set<Id> woIds = new Set<Id>();
            for(AssignedResource ar : camAr){
                woIds.add(ar.ServiceAppointment.ParentRecordId);
            }
            System.debug('woIds size: '+woIds.size());
            
            // Delete Cameron's Work Orders
            List<WorkOrder> ordersToDelete = [SELECT Id FROM WorkOrder WHERE Id IN :woIds];
            System.debug('ordersToDelete size: '+ordersToDelete.size());
            delete ordersToDelete;
            
            
            
            // So Let Us Create! https://www.youtube.com/watch?v=xTkbylut2AE
            // Create 1st WO
            List<WorkOrder> demoOrders = new List<WorkOrder>();
            //WorkOrder NTO STORE - PRESIDIO
            WorkOrder ntoPresidio = initWorkOrder(accountMap.get('NTO Store - Presidio'),wtMap.get('Beverage Delivery'),
                                                  'Tyree Zilnicki', '*San Francisco',
                                                  'Beverage Delivery - Customer Order Fulfillment', 
                                                  'Products Required will outline inventory items to be delivered');
            demoOrders.add(ntoPresidio);
            // WorkOrder RONDEL SF SOUTH
            WorkOrder rondelSfSouth = initWorkOrder(accountMap.get('Rondel Store - San Francisco South'),wtMap.get('Cooler Maintenance'),
                                                  'Crystal Barton', '*San Francisco',
                                                  'Rondel Store SF South - Cooler Maintenance', 
                                                  'Regular scheduled maintenance on store cooler');
            demoOrders.add(rondelSfSouth);
            // WorkOrder FARE UNION
            WorkOrder fareUnion = initWorkOrder(accountMap.get('Fare Merchants - Union Sq'),wtMap.get('Beverage Delivery'),
                                                  'Cuc Varden', '*San Francisco',
                                                  'Beverage Delivery - Customer Order Fulfillment', 
                                                  'Products Required will outline inventory items to be delivered');
            demoOrders.add(fareUnion);
            // WorkOrder RONDEL SF EAST
            WorkOrder rondelSfEast = initWorkOrder(accountMap.get('Rondel Store - San Francisco East'),wtMap.get('Beverage Delivery'),
                                                  'Mao Child', '*San Francisco',
                                                  'Beverage Delivery - Customer Order Fulfillment', 
                                                  'Products Required will outline inventory items to be delivered');
            demoOrders.add(rondelSfEast);
            // TIME TO INSERT THESE WORK ORDERS
            insert demoOrders;
            
            
            // Now its time to create some child objects
            List<ServiceAppointment> demoAppointments = new List<ServiceAppointment>();
            // NTO Presidio
            ServiceAppointment sa1 = initServiceAppointment(ntoPresidio,9);
            sa1.Status = 'Dispatched';
            demoAppointments.add(sa1);
            // Rondel South
            ServiceAppointment sa2 = initServiceAppointment(rondelSfSouth,11);
            demoAppointments.add(sa2);
            // Fare Union
            ServiceAppointment sa3 = initServiceAppointment(fareUnion,13);
            demoAppointments.add(sa3);
            // Rondel East
            ServiceAppointment sa4 = initServiceAppointment(rondelSfEast,14);
            demoAppointments.add(sa4);
            // TIME TO INSERT THESE SERVICE APPOINTMENTS
            insert demoAppointments;
            
            
            // Need to create Assigned Resource records for each damn appointment
            List<AssignedResource> arList = new List<AssignedResource>();
            AssignedResource ar1 = initAssignedResource(sa1,camSR);
            arList.add(ar1);
            AssignedResource ar2 = initAssignedResource(sa2,camSR);
            arList.add(ar2);
            AssignedResource ar3 = initAssignedResource(sa3,camSR);
            arList.add(ar3);
            AssignedResource ar4 = initAssignedResource(sa4,camSR);
            arList.add(ar4);
            // TIME TO INSERT THESE ASSIGNED RESOURCES
            insert arList;
            
            //Insert failed. First exception on row 0; first error: FIELD_CUSTOM_VALIDATION_EXCEPTION, Service can not be scheduled where primary territory member is not defined: []
            
            
            return 'Success';
        } catch (exception e) {
            return e.getMessage();
        }
    }
    
    private static Map<String,Id> createAccountMap() {
        // Get Accounts for our reference
        String retailRT = Schema.Sobjecttype.Account.getRecordTypeInfosByName().get('Retail Store').getRecordTypeId();
        List<Account> demoAccounts = [SELECT Id,Name FROM Account WHERE RecordTypeId = :retailRT];
        // Put Account Names+IDs into a Map to reduce SOQL queries
        Map<String,Id> accountMap = new Map<String,Id>();
        for(Account a : demoAccounts){
            accountMap.put(a.Name,a.Id);
        }
        return accountMap;
    }
    private static Map<String,Id> createWorkTypeMap() {
        // Get Work Types for our reference
        List<WorkType> wtList = [SELECT Id,Name FROM WorkType];
        Map<String,Id> wtMap = new Map<String,Id>();
        for(WorkType wt : wtList){
            wtMap.put(wt.Name,wt.Id);
        }
        return wtMap;
    }
    
    private static WorkOrder initWorkOrder(String aId, String wtId, String contactName, String territoryName, String subj, String descr){
        WorkOrder wo = new WorkOrder();
        wo.AccountId = aId;
        wo.WorkTypeId = wtId;
        wo.ContactId = [SELECT Id FROM Contact WHERE Name = :contactName LIMIT 1].Id;
        wo.ServiceTerritoryId = [SELECT Id FROM ServiceTerritory WHERE Name = :territoryName LIMIT 1].Id;
        wo.Subject = subj;
        wo.Description = descr;
        return wo;
    }
    private static ServiceAppointment initServiceAppointment(WorkOrder wo, Integer hour){
        ServiceAppointment sa = new ServiceAppointment();
        sa.ParentRecordId = wo.Id;
        Datetime n = Datetime.now();
        sa.SchedStartTime = Datetime.newInstance(n.year(), n.month(), n.day(), hour, 0, 0);
        sa.SchedEndTime = sa.SchedStartTime.addHours(1);
        sa.EarliestStartTime = sa.SchedStartTime.addHours(-1);
        return sa;
    }
    private static AssignedResource initAssignedResource(ServiceAppointment sa, ServiceResource sr){
        AssignedResource ar = new AssignedResource();
        ar.ServiceAppointmentId = sa.Id;
        ar.ServiceResourceId = sr.Id;
        return ar;
    }
    
}