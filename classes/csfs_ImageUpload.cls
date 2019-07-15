public with sharing class csfs_ImageUpload {

    public Id recId
    {    get;set;    }
    
    public csfs_ImageUpload(ApexPages.StandardController ctlr)
    {   
       recId = ctlr.getRecord().Id;     
    }
    
    public string fileName 
    {    get;set;    }
    
    public Blob fileBody 
    {    get;set;    }
  
    public PageReference UploadFile()
    {
        PageReference pr;
        if(fileBody != null && fileName != null)
        {
          Attachment myAttachment  = new Attachment();
          myAttachment.Body = fileBody;
          myAttachment.Name = fileName;
          myAttachment.ParentId = recId;
          insert myAttachment;
          if(myAttachment.Id!=null)
          { 
            csfs_Promotion__c sp = [Select id from csfs_Promotion__c where id =:recId ];
            sp.ImageId__c = myAttachment.Id;
            upsert(sp);
          }
           pr = new PageReference('/' + recId);
           pr.setRedirect(true);
           return pr;
        }
        return null;
    }    

}