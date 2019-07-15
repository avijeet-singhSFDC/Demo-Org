define(["jquery", "underscore","backbone"], function($, _, backbone) {

    var camka = Backbone.Model.extend({
        validate : function(obj){
        },
        initialize : function(){
            this.bind('error',function(model,error){ this.view.error(error); });
            this.bind('saveSuccess',function(model){ this.view.saveSuccess(); });
            this.bind('deleteSuccess',function(model){ this.view.deleteSuccess(); });
        },
        save : function(attrs){
            
            var callBack = function(results,event,instance,attrs){
                if ( results.Status != "Failed" ){
                    instance.set( _.extend(attrs,{ lastSaved : ((new Date).getTime()) , Id : results.Id }) );
                    instance.trigger("saveSuccess",this);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Knowledge Article already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Please select a Knowledge Article and at least one field for it." : msj; 
                    msj = (results.Msg.indexOf("STRING_TOO_LONG") != -1) ? "To many fields selected, remove some of them." : msj;
                    instance.trigger('error',this,msj);
                }
            };

            var instance = this;
            
            window.cam_ConfigController.postPutKnowledgeArticle( JSON.stringify(attrs) , function(results,event){
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
            
            var dataToServer = { apiName__c : this.get("apiName__c"),
            					 layout__c  : this.get("layout__c"),
            					 Id         : this.get("Id") };

            window.cam_ConfigController.deleteKnowledgeArticle( JSON.stringify(dataToServer) , function(results,event){
                callBack(results,event,instance);
            });
        }
    });
    return camka;
});