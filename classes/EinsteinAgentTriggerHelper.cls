public class EinsteinAgentTriggerHelper {
	
    @future(callout=true)
    public static void createRecommendations(Id caseId){
        DateTime now = DateTime.now();
        String currentTime = removeMilliseconds(now);
        List<Einstein_Agent_Helper__c> helperConfig = [Select Id, Field__c, Comparator__c, Value__c, Confidence__c, Recommendation_Field__c, Recommendation_Value__c
                                                       From Einstein_Agent_Helper__c 
                                                       Where Active__c = true];
            
        List<Map<String,Object>> compositeRequest = new List<Map<String,Object>>();
        
        /*
        String caseIdsString = '';
        for(String caseId: caseIds){
            caseIdsString += '\'' + caseId.trim() + '\',';
        }
        caseIdsString = caseIdsString.Substring(0, caseIdsString.length()-1); 
        */
        
        String query = 'Select Id';
        
        //Query all fields for fields evaluated for rules
        Set<String> queryFields = new Set<String>();
        for(Einstein_Agent_Helper__c rule:helperConfig){
            queryFields.add(rule.Field__c);
        }
        for(String field:queryFields){
            query += ',' + field + ' ';
        }
        query += 'From Case ';
        query += 'Where Id =\'' + caseId + '\' ';
        query += 'Limit 1';
        
        List<SObject> results = Database.query(query);
        
        //Fetch first and only result removed bulking
        Case c = (Case)results[0];
        Integer referenceId = 1;
        
        for(Einstein_Agent_Helper__c rule: helperConfig){
            if( c.get(rule.Field__c) != null){
                //Get datatype for comparison
                String dataType = getType(c.get(rule.Field__c));
                Boolean validRule = evaluateRule(dataType, c, rule);
                
                if(validRule){
                    List<ActionValue> actionValues = new List<ActionValue>();
                    ActionValue actionValue = new ActionValue(rule.Recommendation_Field__c, rule.Recommendation_Value__c);
                    actionValues.add(actionValue);
                    
                    List<Action> actions = new List<Action>();
                    Action action = new Action(actionValues);
                    actions.add(action);
                    
                    CaseRecommendation caseRecommendation = new CaseRecommendation(c.Id, currentTime, Integer.valueOf(rule.Confidence__c), actions);
                    Map<String,String> recommendation = new Map<String,String>();
                    recommendation.put('RecommendationJson', JSON.serialize(caseRecommendation));

                    Map<String,Object> compositeRequestItem = new Map<String,Object>();
                    compositeRequestItem.put('url','/services/data/v43.0/sobjects/IncomingRecommendation');
                    compositeRequestItem.put('method', 'POST');
                    compositeRequestItem.put('body', recommendation);
                    compositeRequestItem.put('referenceId', 'IncomingRecommendation'+referenceId);
                    compositeRequest.add(compositeRequestItem);
                        
                    referenceId++;
                }
            }
        }
        
        if(compositeRequest.size() > 0){
            String sessionId = getSession();
            
            Map<String,Object> compositeRequestBody = new Map<String, Object>();
            compositeRequestBody.put('allOrNone',true);
            compositeRequestBody.put('compositeRequest', compositeRequest);
            
            Http http = new Http();
            HttpRequest req = new HttpRequest();
            req.setEndpoint(System.Url.getSalesforceBaseURL().toExternalForm() + '/services/data/v43.0/composite');
            req.setMethod('POST');
            req.setHeader('Authorization', 'Bearer ' + sessionId);
            req.setHeader('Content-Type', 'application/json');
            req.setHeader('Content-Length', '0');
            
            System.debug(JSON.serialize(compositeRequestBody));
            req.setBody(JSON.serialize(compositeRequestBody));
            
            HttpResponse res = http.send(req);
            System.debug(res.getBody());
        }
    }
    
    //Incoming Recommendations does not like milliseconds
    public static String removeMilliseconds(DateTime dt){
        /*String dtString = String.valueOf(dt);
        dtString = dtString.left(dtString.length()-5) + 'Z';*/
        String dtString = dt.year() + '-';
        dtString += dt.month() < 10 ? '0' + dt.month() + '-' : dt.month() + '-';
        dtString += dt.day() < 10 ? '0' + dt.day() + 'T' : dt.day() + 'T';
        dtString += dt.hour() < 10 ? '0' + dt.hour() + ':' : dt.hour() + ':'; 
        dtString += dt.minute() < 10 ? '0' + dt.minute() + ':' : dt.minute() + ':';
        dtString += dt.second() < 10 ? '0' + dt.second() + ':' : dt.second() + 'Z';
        return dtString;
    }
    
    public static Boolean evaluateRule(String dataType, Case c, Einstein_Agent_Helper__c rule){
        Boolean evaluation = false;
        System.debug('EVALUATING');
        
        //Gets messy since you cannot type dynamically. Move code up to cast before evaluation
        switch on rule.Comparator__c {
            when 'EQ' {
                System.debug('EQ');
                evaluation = c.get(rule.Field__c) == rule.Value__c;
            }
            when 'NOT_EQ' {
                System.debug('NOT EQ');
                evaluation = c.get(rule.Field__c) != rule.Value__c;
            } 
            when 'STARTS' {
                System.debug('STARTS');
                String caseStringValue = String.valueOf(c.get(rule.Field__c));
                String ruleStringValue = String.valueOf(rule.Value__c);
                evaluation = caseStringValue.startsWithIgnoreCase(ruleStringValue);
            }
            when 'ENDS' {
                System.debug('ENDS');
                String caseStringValue = String.valueOf(c.get(rule.Field__c));
                String ruleStringValue = String.valueOf(rule.Value__c);
                evaluation = caseStringValue.endsWithIgnoreCase(ruleStringValue);
            }
            when 'CONTAINS'{
                System.debug('CONTAINS');
                String caseStringValue = String.valueOf(c.get(rule.Field__c));
                String ruleStringValue = String.valueOf(rule.Value__c);
                evaluation = caseStringValue.containsIgnoreCase(ruleStringValue);
            }
            when 'LT' {
                System.debug('LT');
                switch on dataType {
                    //insure proper typing
                    when 'Integer' {
                        evaluation = Integer.valueOf(c.get(rule.Field__c)) < Integer.valueOf(rule.Value__c);
                    }
                    when 'Double' {
                        evaluation = Double.valueOf(c.get(rule.Field__c)) < Double.valueOf(rule.Value__c);
                    }
                    when 'Date' {
                        evaluation = Date.valueOf(c.get(rule.Field__c)) < Date.valueOf(rule.Value__c);
                    }
                    when 'DateTime' {
                        evaluation = DateTime.valueOf(c.get(rule.Field__c)) < DateTime.valueOf(rule.Value__c);
                    }
                }
            }
            when 'LTE' {
                System.debug('LTE');
                switch on dataType {
                    //insure proper typing
                    when 'Integer' {
                        evaluation = Integer.valueOf(c.get(rule.Field__c)) <= Integer.valueOf(rule.Value__c);
                    }
                    when 'Double' {
                        evaluation = Double.valueOf(c.get(rule.Field__c)) <= Double.valueOf(rule.Value__c);
                    }
                    when 'Date' {
                        evaluation = Date.valueOf(c.get(rule.Field__c)) <= Date.valueOf(rule.Value__c);
                    }
                    when 'DateTime' {
                        evaluation = DateTime.valueOf(c.get(rule.Field__c)) <= DateTime.valueOf(rule.Value__c);
                    }
                }
            }
            when 'GTE' {
                System.debug('GTE');
                switch on dataType {
                    //insure proper typing
                    when 'Integer' {
                        evaluation = Integer.valueOf(c.get(rule.Field__c)) >= Integer.valueOf(rule.Value__c);
                    }
                    when 'Double' {
                        evaluation = Double.valueOf(c.get(rule.Field__c)) >= Double.valueOf(rule.Value__c);
                    }
                    when 'Date' {
                        evaluation = Date.valueOf(c.get(rule.Field__c)) >= Date.valueOf(rule.Value__c);
                    }
                    when 'DateTime' {
                        evaluation = DateTime.valueOf(c.get(rule.Field__c)) >= DateTime.valueOf(rule.Value__c);
                    }
                }
            }
            when 'GT' {
                System.debug('GT');
                switch on dataType {
                    //insure proper typing
                    when 'Integer' {
                        evaluation = Integer.valueOf(c.get(rule.Field__c)) > Integer.valueOf(rule.Value__c);
                    }
                    when 'Double' {
                        evaluation = Double.valueOf(c.get(rule.Field__c)) > Double.valueOf(rule.Value__c);
                    }
                    when 'Date' {
                        evaluation = Date.valueOf(c.get(rule.Field__c)) > Date.valueOf(rule.Value__c);
                    }
                    when 'DateTime' {
                        evaluation = DateTime.valueOf(c.get(rule.Field__c)) > DateTime.valueOf(rule.Value__c);
                    }
                }
            }
        }
        
        System.debug(evaluation);
        return evaluation;
    }
    
    //Login with a integrated user to get valid session id through SOAP
    //Lightning session id is not valid. Needs to exist before requests can execute
    //Default user is of alias ehelp // salesforce1
    public static String getSession(){
        User restUser = [Select Username From User Where CommunityNickname = 'ehelp' Limit 1];
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://login.salesforce.com/services/Soap/c/43.0');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'text/xml;charset=UTF-8');
        request.setHeader('SOAPAction', '""');
        String reqBody = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:enterprise.soap.sforce.com">' +
                             '<soapenv:Header>'+
                             	'<urn:LoginScopeHeader></urn:LoginScopeHeader>'+
                             '</soapenv:Header>' + 
                         '<soapenv:Body>' + 
                             '<urn:login><urn:username>' + restUser.Username + '</urn:username>'+
                             '<urn:password>salesforce1</urn:password></urn:login>'+
                         '</soapenv:Body></soapenv:Envelope>';
        
        request.setBody(reqBody);
        
        Dom.XmlNode resultElmt = (new Http()).send(request).getBodyDocument().getRootElement();
        
        resultElmt = resultElmt.getChildElement('Body','http://schemas.xmlsoap.org/soap/envelope/')
                               .getChildElement('loginResponse','urn:enterprise.soap.sforce.com')
                               .getChildElement('result','urn:enterprise.soap.sforce.com');
        String sessionId = resultElmt.getChildElement('sessionId', 'urn:enterprise.soap.sforce.com').getText();
        System.debug(sessionId);
        return sessionId;
    }
    
    //Fetch type without schema
    public static string getType(Object o) {
        if(o==null) return '';
        if(o instanceof SObject)            return ((SObject)o).getSObjectType().getDescribe().getName()+''; 
        if(o instanceof Boolean)            return 'Boolean';
        if(o instanceof Id)                 return 'Id';
        if(o instanceof String)             return 'String';
        if(o instanceof Blob)               return 'Blob';
        if(o instanceof Date)               return 'Date';
        if(o instanceof Datetime)           return 'Datetime';
        if(o instanceof Time)               return 'Time';
        if(o instanceof String)             return 'String';
        if(o instanceof Integer)            return 'Integer';
        if(o instanceof Long)               return 'Long';
        if(o instanceof Decimal)            return 'Double';  // we can't distinguish between decimal and double
        if(o instanceof Double)             return 'Double';   // we can't distinguish between decimal and double
        if(o instanceof List<object>)       return 'List';
        return 'Object';                    // actually we can't detect maps and sets and maps
    }
    
    public class CaseRecommendation {
        public String definitionName;
        public String targetId;
        public String referenceDate;
        public Integer score;
        public List<Action> actions;
        
        public CaseRecommendation (String targetId, String referenceDate, Integer score, List<Action> actions){
            this.definitionName = 'Case.CaseDefinition';
            this.targetId = targetId;
            this.referenceDate = referenceDate;
            this.score = score;
            this.actions = actions;
        }
    }
    
    public class Action {
        public String actionType;
        public List<ActionValue> values;
        
        public Action(List<ActionValue> values){
            this.actionType = 'Update';
            this.values = values;
        }
    }
    
    public class ActionValue {
        public String fieldName;
        public String type;
        public String literalValue;
        
        public ActionValue(String fieldName, String literalValue){
            this.fieldName = 'Case.'+fieldName;
            this.type = 'Field';
            this.literalValue = literalValue;
        }
    }
}