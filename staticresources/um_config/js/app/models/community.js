define(["jquery", "underscore","backbone"], function($, _, backbone) {

    var community = Backbone.Model.extend({
        defaults : {
            "publicName__c"           : "",
            "communityDCApiName__c"   : "",
            "communityDCLabel__c"     : "",
            "communityId__c"          : "",
            "iconPath__c"             : "",
            "staticResourceName__c"   : "",
            "siteName__c"             : "",
            "Id"                      : "",
            "knowledgeArticle__c"     : "",
            "backgroundImagePath__c"  : ""
        },
        validate : function(obj){
        },
        initialize : function(){
            this.bind('error',function(model,error){ this.view.error(error); });
            this.bind('saveSuccess',function(model,error){ this.view.saveSuccess(); });
            this.bind('deleteSuccess',function(model,error){ this.view.deleteSuccess(); });
        },
        save : function(attrs){

            var callBack = function(results,event,instance,attrs){
                if ( results.Status != "Failed" ){
                    instance.set( _.extend(attrs,{ lastSaved : ((new Date).getTime()) , Id : results.Id }) );
                    instance.trigger("saveSuccess",this);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Community already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    instance.trigger('error',this,msj);
                }
            };

            var instance = this;

            if ( attrs.Id != undefined && attrs.Id == "" ) attrs.Id = undefined;
            window.cam_ConfigController.postPutCommunity( JSON.stringify(attrs) , function(results,event){
                callBack(results,event,instance,attrs);
            } );
        },
        delete : function(){
            var callBack = function(results,event,instance){
                if ( results.Status != "Failed" ){
                    instance.trigger("deleteSuccess",this);
                }else{
                    instance.trigger("error",this,results.Msg);
                }
            };

            var instance = this;

            var dataToServer = { Id : this.get("Id") };

            window.cam_ConfigController.deleteCommunity( JSON.stringify(dataToServer) , function(results,event){
                callBack(results,event,instance);
            });
        }
    });
    return community;
});