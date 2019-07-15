define(["jquery", "underscore","backbone"], function($, _, backbone) {

	var cammoderator = Backbone.Model.extend({
        defaults : {
            userId__c : ''            
        },
        validate : function(obj){
        },
        initialize : function(options){
            this.bind('error',function(model,error){ this.view.error(error); });
            this.bind('saveSuccess',function(model){ this.view.saveSuccess(); });
            this.bind('deleteSuccess',function(model){ this.view.deleteSuccess(); });            
        },
        save : function(attrs){
            
            var callBack = function(results,event,instance,attrs){
                if ( results.Status != "Failed" ){
                    instance.set( _.extend(attrs,{ lastSaved : ((new Date).getTime()) }) );
                    instance.trigger("saveSuccess",this);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1 || results.Msg.indexOf("FIELD_INTEGRITY_EXCEPTION, There is already an item") != -1) ? "Agent already exists." : msj;
                    instance.trigger('error',this,msj);
                }
            };

            var instance = this;
            
            window.cam_ConfigController.postPutModerator( JSON.stringify(attrs) , function(results,event){
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
            
            var dataToServer = { userId__c : this.get("userId__c") };

            window.cam_ConfigController.deleteModerator( JSON.stringify(dataToServer) , function(results,event){
                callBack(results,event,instance);
            });
        }
    })
    return cammoderator;
})