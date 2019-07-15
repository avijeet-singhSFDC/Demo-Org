trigger Case_EinsteinAgent on Case (after insert, after update) {
    /*
    List<Id> caseIds = new List<Id>();
    for(Case c: Trigger.new){
        caseIds.add(c.Id);
    }
    if(!caseIds.isEmpty()){
        EinsteinAgentTriggerHelper.createRecommendations(caseIds);
    }
    */
    
    //Cannot be bulked due to multiple http callouts. Turn off if bulk loading cases
    for(Case c: Trigger.new){
        EinsteinAgentTriggerHelper.createRecommendations(c.Id);
    }
}