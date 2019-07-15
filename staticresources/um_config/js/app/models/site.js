define(["jquery",
        "underscore",
        "backbone"], function($, _, backbone) {

    var site = Backbone.Model.extend({

        defaults : function(){
            return {
                Business_Hours_Name__c: "",
                CTI_configuration__c: "",
                Contact_Us_Available__c: true,
                KAStructure: [],
                KnowledgeBase: [],
                Live_Agent_ChatButtonId__c: "",
                Live_Agent_Chat_Server_URL__c: "",
                Live_Agent_Deployment_Id__c: "",
                Live_Agent_Deployment_URL__c: "",
                Maximum_attachment_upload_per_case__c: "",
                Moderators: [],
                Phone_Number__c: "",
                Zones: [],
                backgroundImagePath__c: "",
                brandingImagePath__c: "",
                id: (new Date()).getTime(),
                knowledgeArticle__c: "",
                searchBannerLabel__c: "",
                siteWelcomeMessage__c: "",
                umChatterAnswers_dataCategoryGroup__c: "",
                umChatterAnswers_enabled__c: true,
                umChatterAnswers_richTextEnabled__c: false,
                umChatterAnswers_zoneLabelPlural__c: "",
                umChatterAnswers_zoneLabelSingular__c: "",
                umContactus_addCaseNumberEnabled__c: true,
                umContactus_createContactAndAccount__c: true,
                umContactus_ctiConfiguration__c: "",
                umContactus_enableCall__c: true,
                umContactus_enableLiveAgent__c: false,
                umContactus_enabled__c: true,
                umContactus_phoneNumber__c: "",
                umKnowledgeBase_enabled__c: true,
                umSite_announcements__c: false,
                umSite_apiName__c: "",
                umSite_backgroundColor__c: "",
                umSite_backgroundImage__c: "",
                umSite_guestProfileId__c: "",
                umSite_iconImage__c: "",
                umSite_searchBannerLabel__c: "",
                umSite_staticResource__c: "",
                umSite_welcomeMessage__c: "",
                umSite_authenticated__c : false,
                umSite_casesEnabled__c : true,                
                signUpProfile__c : ""                
            };
        },

        save : function(){
            $('body').append('<div id="fixedOverlay"></div>');
            $('body').append('<div id="fixedLoader"></div></div>');
            $('#fixedLoader').text("Saving site");
            window.appOnSave = true;
            var self = this;
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    self.set({ umSite_guestProfileId__c : results.umSite_guestProfileId__c, id : results.id });
                    self.deleteKnowledge();
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the General Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            window.umCustomSettingController.postPutSite( JSON.stringify(this.attributes) , function(results,event){
                callBack(results,event);
            });
        },

        deleteKnowledge: function(){
            $('#fixedLoader').text("Saving knowledge info");
            var self = this;
            if (typeof(this.get("KAStructure"))=="string"){this.deleteKnowledgeBase();return;};
            var kastructure = this.get("KAStructure");
            var elmsToSave = [];
            var elmsToDelete = [];

            for (var i=0;i<kastructure.length;i++){
                var item = kastructure[i];
                //18 cuz sf id keys(others used here are less than 18 cuz are dummy id's for not yet persisted entities)
                if (item.delete != undefined && item.Id.length < 18) continue;
                if (item.delete == undefined){
                    elmsToSave.push(item);
                    item.umSite_id__c = this.get('id');
                }
                if (item.delete != undefined && item.Id.length == 18) elmsToDelete.push(item);
            }

            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    iterator++;
                    if(hasMore(elmsToDelete)==true) window.umCustomSettingController.deleteKnowledgeArticle(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
                    else self.saveKnowledge(elmsToSave);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Knowledge Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToDelete.length > 0) window.umCustomSettingController.deleteKnowledgeArticle(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
            else this.saveKnowledge(elmsToSave);
        },

        saveKnowledge: function(elmsToSave){
            var self = this;
            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    elmsToSave[iterator].Id = results.id;
                    iterator++;
                    if(hasMore(elmsToSave)==true) window.umCustomSettingController.postPutKnowledgeArticle(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
                    else{
                        self.deleteKnowledgeBase();
                    }
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Knowledge Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToSave.length > 0) window.umCustomSettingController.postPutKnowledgeArticle(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
            else this.deleteKnowledgeBase();
        },

        deleteKnowledgeBase: function(){
            var self = this;
            if (typeof(this.get("KnowledgeBase"))=="string"){this.deleteModerators();return;};
            var kastructure = this.get("KnowledgeBase");
            var elmsToSave = [];
            var elmsToDelete = [];

            for (var i=0;i<kastructure.length;i++){
                var item = kastructure[i];
                //18 cuz sf id keys(others used here are less than 18 cuz are dummy id's for not yet persisted entities)
                if (item.delete != undefined && item.Id.length < 18) continue;
                if (item.delete == undefined){
                    elmsToSave.push(item);
                    item.umSite_id__c = this.get('id');
                }
                if (item.delete != undefined && item.Id.length == 18) elmsToDelete.push(item);
            }

            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    iterator++;
                    if(hasMore(elmsToDelete)==true) window.umCustomSettingController.deleteKnowledgeBaseDataCategory(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
                    else self.saveKnowledgeBase(elmsToSave);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Knowledge Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToDelete.length > 0) window.umCustomSettingController.deleteKnowledgeBaseDataCategory(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
            else this.saveKnowledgeBase(elmsToSave);
        },

        saveKnowledgeBase: function(elmsToSave){
            var self = this;
            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    elmsToSave[iterator].Id = results.id;
                    iterator++;
                    if(hasMore(elmsToSave)==true) window.umCustomSettingController.postPutKnowledgeBaseDataCategory(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
                    else{
                        self.deleteModerators();
                    }
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Knowledge Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToSave.length > 0) window.umCustomSettingController.postPutKnowledgeBaseDataCategory(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
            else this.deleteModerators();
        },

        deleteModerators: function(){
            $('#fixedLoader').text("Saving moderators info");
            var self = this;
            if (typeof(this.get("Moderators"))=="string"){this.deleteZones();return;};
            var kastructure = this.get("Moderators");
            var elmsToSave = [];
            var elmsToDelete = [];

            for (var i=0;i<kastructure.length;i++){
                var item = kastructure[i];
                //18 cuz sf id keys(others used here are less than 18 cuz are dummy id's for not yet persisted entities)
                if (item.delete != undefined && item.Id.length < 18) continue;
                if (item.delete == undefined){
                    elmsToSave.push(item);
                    item.umSite_id__c = this.get("id");
                }
                if (item.delete != undefined && item.Id.length == 18) elmsToDelete.push(item);
            }

            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    iterator++;
                    if(hasMore(elmsToDelete)==true) window.umCustomSettingController.deleteModerator(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
                    else self.saveModerators(elmsToSave);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Moderators Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToDelete.length > 0) window.umCustomSettingController.deleteModerator(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
            else this.saveModerators(elmsToSave);
        },

        saveModerators: function(elmsToSave){
            var self = this;
            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    elmsToSave[iterator].Id = results.id;
                    iterator++;
                    if(hasMore(elmsToSave)==true) window.umCustomSettingController.postPutModerator(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
                    else{
                        self.deleteZones();
                    }
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while processing the Moderators Tab information. ";
                    self.trigger('error',msj);
                }
            };
            if (elmsToSave.length > 0) window.umCustomSettingController.postPutModerator(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
            else this.deleteZones();
        },

        deleteZones: function(){
            $('#fixedLoader').text("Saving zones");
            var self = this;
            if (typeof(this.get("Zones"))=="string"){this.trigger("saveSuccess",this);return;};
            var kastructure = this.get("Zones");
            var elmsToSave = [];
            var elmsToDelete = [];

            for (var i=0;i<kastructure.length;i++){
                var item = kastructure[i];
                //18 cuz sf id keys(others used here are less than 18 cuz are dummy id's for not yet persisted entities)
                if (item.delete != undefined && item.id.length < 18) continue;
                if (item.delete == undefined){
                    elmsToSave.push(item);
                    item.umSite_id__c = this.get('id');
                }
                if (item.delete != undefined && item.id.length == 18) elmsToDelete.push(item);
            }

            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    iterator++;
                    if(hasMore(elmsToDelete)==true) window.umCustomSettingController.deleteZone(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
                    else self.saveZones(elmsToSave);
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while trying to save the Chatter Answers Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToDelete.length > 0) window.umCustomSettingController.deleteZone(JSON.stringify(elmsToDelete[iterator]),function(results,event){ callBack(results,event);});
            else this.saveZones(elmsToSave);
        },

        saveZones: function(elmsToSave){
            var self = this;
            var iterator = 0;
            var hasMore = function(arr){return iterator<arr.length;};
            var callBack = function(results,event){
                if ( results.Status != "Failed" ){
                    elmsToSave[iterator].id = results.id;
                    iterator++;
                    if(hasMore(elmsToSave)==true) window.umCustomSettingController.postPutZone(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
                    else{
                        self.trigger("saveSuccess",self);
                    }
                }else{
                    var msj = (results.Msg.indexOf("REQUIRED_FIELD_MISSING") != -1) ? "Required Fields missing." : results.Msg;
                    msj = (results.Msg.indexOf("DUPLICATE_VALUE") != -1) ? "Site Api Name already exists." : msj;
                    msj = (results.Msg.indexOf("Received Invalid Options") != -1) ? "Required Fields missing." : msj;
                    var disc = "An error ocurred while trying to save the Chatter Answers Tab information. ";
                    self.trigger('error',disc+msj);
                }
            };
            if (elmsToSave.length > 0) window.umCustomSettingController.postPutZone(JSON.stringify(elmsToSave[iterator]),function(results,event){ callBack(results,event);});
            else this.trigger("saveSuccess",this);
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

            window.cam_ConfigController.deleteSite( JSON.stringify(dataToServer) , function(results,event){
                callBack(results,event,instance);
            });
        }
    });
    return site;
});