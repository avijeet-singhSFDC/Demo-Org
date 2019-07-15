public class GoogleURLShorten {
    @InvocableMethod(label='Google URL Shortener ' description='Google URL Shortener  Example for Process Builder')
    public static void urlShorten(List<Id> lead) {
        List<Lead> leads =[Select Id , Website from Lead where id in :lead ];
        System.enqueueJob(new RestApiCall(lead));
    }
    public class RestApiCall implements System.Queueable, Database.AllowsCallouts {
        List<Id> lead = new List<Id>() ; 
        public RestApiCall(List<Id> ids){
            lead = ids ;
        }
        public void execute(System.QueueableContext ctx) {
            List<Lead> leads =[Select Id , Website from Lead where id in :lead ];
            for (Lead l : leads)    {
                JSONGenerator gen = JSON.createGenerator(true);
                gen.writeStartObject();
                gen.writeStringField('longUrl', leads[0].Website);
                gen.writeEndObject();
                String body = gen.getAsString();
                Http http = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint('https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyA92CvBDCUji91-8YjxV3UtcYlqSSWFd8E');
                request.setHeader('Content-Type', 'application/json;charset=UTF-8');
                request.setMethod('POST');
                request.setBody(body);
                HttpResponse response = http.send(request);
                if (response.getStatusCode() == 200) {
                    Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                    System.debug('');
                    String url =  (String)results.get('id');
                    leads[0].Website = url ; 
                    update leads[0] ;
                }
                update leads[0];
            }
            
        }
    }
}