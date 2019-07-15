define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "app/models/site",
        "text!app/templates/siteTemplate.html",
        "app/views/generalTabView",
        "text!app/templates/moduleTemplate.html",
        "text!app/templates/contactTemplate.html",
        "app/views/caTabView",
        "app/views/kaTabView",
        "app/views/moderatorView",
        "bootstrap"], function($, _, backbone, utils,Site,siteTemplate,GeneralTabView,mtmpl,contmpl,CaTabView,KaTabView,ModeratorView){

    var siteView = Backbone.View.extend({

        el: '#appContext',

        initialize: function(args){
            this.selectedSite = args != undefined && args.m != undefined ? args.m : new Site();
            Backbone.Events.bind("reloadTab",this.reloadTab,this);
            this.render();
        },

        events: {
            "click #generalTabLink" : "generalTab",
            "click #caTabLink" : "caTab",
            "click #modulesLink" : "mTab",
            "click #knowledgeTab" : "kTab",
            "click #contactTab" : "contactTab",
            "click #backToHome" : "backToList",
            "click #moderatorTab" : "moderatorTab",
            "click #saveAll" : "saveAllData",
            "change #umChatterAnswers_enabled__c"    : "changeQA",
            "change #umSite_authenticated__c"    : "changeAuth"
        },

        render: function(){
            this.$el.empty().off();
            this.undelegateEvents();
            var template = _.template( siteTemplate);
            this.$el.html( template() );
            this.delegateEvents();
            this.mTab();
            return this;
        },

        ctiKeyPressed: function(event){
            // Allow: backspace, delete, tab, escape, and enter
            if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
                // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }else{
                // Ensure that it is a number and stop the keypress
                if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )){
                    event.preventDefault();
                }
            }
        },

        ctiClicked: function(e){
            btnId = $(e.currentTarget).attr('id');
            valToAdd = '';
            switch(btnId){
                case 'cti_pause': valToAdd ='[P]';
                    break;
                case 'cti_wait' : valToAdd ='[W]';
                    break;
                case 'cti_caseNumber' : valToAdd ='[CN]';
                    break;
                default:;
            }
            origValue = $('#umContactus_ctiConfiguration__c').val().trim();
            $('#umContactus_ctiConfiguration__c').val(origValue+valToAdd);
        },

        generalTab: function(){
            this.collectData();
            if ( this.generalTabView != undefined ) this.generalTabView.cleanAll();
            this.generalTab = new GeneralTabView({ model : this.selectedSite });
            this.$el.find('#general').empty().off().append(this.generalTab.render().el);
        },

        caTab: function(){
            this.collectData();
            if ( this.caTabView != undefined ){
                this.caTabView.cleanAll();
                this.caTabView.setData({ model : this.selectedSite });
            }else{
                this.caTabView = new CaTabView({ model : this.selectedSite });
            }
            this.$el.find("#qanda").empty().off().append(this.caTabView.render().el);
        },

        mTab: function(){
            this.collectData();
            var template = _.template(mtmpl);
            this.$el.find('#modules').empty().off().append(template({ site : this.selectedSite.attributes}));
        },

        kTab: function(){
            this.collectData();
            if ( this.kaTabView == undefined ) this.kaTabView = new KaTabView({ model : this.selectedSite });
            else{
                this.kaTabView.cleanAll();
                this.kaTabView.setData({ model : this.selectedSite });
            }
            this.$el.find('#knowledge').empty().off().append(this.kaTabView.render().el);
        },

        contactTab: function(){
            var self = this;
            this.collectData();
            var template = _.template(contmpl);
            this.$el.find("#contact").empty().off().append(template({ s : this.selectedSite.attributes }));
            this.$el.find('#contact #umContactus_ctiConfiguration__c').keypress(function(e){
                self.ctiKeyPressed(e);
            });
            this.$el.find('#contact #ctiContainer :input').click(function(e){
                self.ctiClicked(e);
            });
        },

        moderatorTab: function(){
            this.collectData();
            if ( this.moderatorView != undefined ){
                this.moderatorView.cleanAll();
                this.moderatorView.setData({ model : this.selectedSite });
            }else{
                this.moderatorView = new ModeratorView({ model : this.selectedSite });
            }
            this.$el.find('#moderator').empty().off().append(this.moderatorView.render().el);
        },

        backToList: function(){
            Backbone.Events.trigger("backToList");
        },

        cleanAll: function(){

        },

        reloadTab: function(tabToCall){
            if ( typeof this[tabToCall] == 'function' ){
                this.collectData();
                this[tabToCall]();
            }
        },

        collectData: function(){
            //Module Tab
            var val = $('#umKnowledgeBase_enabled__c').prop('checked');
            if ( val != undefined ) this.selectedSite.set({ umKnowledgeBase_enabled__c : val });
            val = $('#umChatterAnswers_enabled__c').prop('checked');
            if ( val != undefined ) this.selectedSite.set({ umChatterAnswers_enabled__c : val });
            val = $('#umSite_casesEnabled__c').prop('checked');
            if ( val != undefined ) this.selectedSite.set({ umSite_casesEnabled__c : val });
            val = $('#umSite_authenticated__c').prop('checked');
            if ( val != undefined ) this.selectedSite.set({ umSite_authenticated__c : val });
            val = $('#umContactus_enabled__c').prop('checked');
            if ( val != undefined ) this.selectedSite.set({ umContactus_enabled__c : val });
            //General Tab
            val = $('#signUpProfile__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ signUpProfile__c : "" });
                else this.selectedSite.set({ signUpProfile__c : val });
            }
            val = $('#umSite_apiName__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_apiName__c : "" });
                else this.selectedSite.set({ umSite_apiName__c : val });
            }
            val = $('#umSite_staticResource__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_staticResource__c : "" });
                else this.selectedSite.set({ umSite_staticResource__c : val });
            }
            val = $('#umSite_backgroundColor__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_backgroundColor__c : "" });
                else this.selectedSite.set({ umSite_backgroundColor__c : val });
            }
            val = $('#umSite_backgroundImage__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_backgroundImage__c : "" });
                else this.selectedSite.set({ umSite_backgroundImage__c : val });
            }
            val = $('#umSite_iconImage__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_iconImage__c : "" });
                else this.selectedSite.set({ umSite_iconImage__c : val });
            }
            val = $('#umSite_announcements__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umSite_announcements__c : val });
            }
            val = $('#umSite_announcementsKaId__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_announcementsKaId__c : "" });
                else this.selectedSite.set({ umSite_announcementsKaId__c : val });
            }
            val = $('#umSite_welcomeMessage__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_welcomeMessage__c : "" });
                else this.selectedSite.set({ umSite_welcomeMessage__c : val });
            }
            val = $('#umSite_searchBannerLabel__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umSite_searchBannerLabel__c : "" });
                else this.selectedSite.set({ umSite_searchBannerLabel__c : val });
            }
            //General tab data collecting EOF<<<
            //Chatter Answers tab (collections like zones will be autopopulated while user adds zones)
            val = $('#umChatterAnswers_zoneLabelPlural__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umChatterAnswers_zoneLabelPlural__c : "" });
                else this.selectedSite.set({ umChatterAnswers_zoneLabelPlural__c : val });
            }
            val = $('#umChatterAnswers_zoneLabelSingular__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umChatterAnswers_zoneLabelSingular__c : "" });
                else this.selectedSite.set({ umChatterAnswers_zoneLabelSingular__c : val });
            }
            val = $('#umChatterAnswers_dataCategoryGroup__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umChatterAnswers_dataCategoryGroup__c : "" });
                else this.selectedSite.set({ umChatterAnswers_dataCategoryGroup__c : val });
            }
            val = $('#umChatterAnswers_richTextEnabled__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umChatterAnswers_richTextEnabled__c : val });
            }
            //Chatter Answers tab data collecting EOF<<<
            //Contact us
            val = $('#umContactus_createContactAndAccount__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umContactus_createContactAndAccount__c : val });
            }
            val = $('#umContactus_enableCall__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umContactus_enableCall__c : val });
            }
            val = $('#umContactus_phoneNumber__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_phoneNumber__c : "" });
                else this.selectedSite.set({ umContactus_phoneNumber__c : val });
            }
            val = $('#umContactus_businessHourName__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_businessHourName__c : "" });
                else this.selectedSite.set({ umContactus_businessHourName__c : val });
            }
            val = $('#umContactus_addCaseNumberEnabled__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umContactus_addCaseNumberEnabled__c : val });
            }
            val = $('#umContactus_ctiConfiguration__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_ctiConfiguration__c : "" });
                else this.selectedSite.set({ umContactus_ctiConfiguration__c : val });
            }
            val = $('#umContactus_enableLiveAgent__c').prop("checked");
            if (val != undefined){
                this.selectedSite.set({ umContactus_enableLiveAgent__c : val });
            }
            val = $('#umContactus_liveAgentChatButtonId__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_liveAgentChatButtonId__c : "" });
                else this.selectedSite.set({ umContactus_liveAgentChatButtonId__c : val });
            }
            val = $('#umContactus_liveAgentDeploymentId__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_liveAgentDeploymentId__c : "" });
                else this.selectedSite.set({ umContactus_liveAgentDeploymentId__c : val });
            }
            val = $('#umContactus_liveAgentDeploymentURL__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_liveAgentDeploymentURL__c : "" });
                else this.selectedSite.set({ umContactus_liveAgentDeploymentURL__c : val });
            }
            val = $('#umContactus_liveAgentChatServerURL__c').val();
            if (val != undefined){
                val = $.trim(val);
                if ( val.length < 1 ) this.selectedSite.set({ umContactus_liveAgentChatServerURL__c : "" });
                else this.selectedSite.set({ umContactus_liveAgentChatServerURL__c : val });
            }
            //Contact us data collecting EOF<<<
        },

        saveAllData: function(){
            //prepare site to save
            this.collectData();
            var dataChecked = this.checkData();
            if ( dataChecked != true ){
                $('#errContainerSiteMsj').text(dataChecked);
                $('#errContainerSite').fadeIn();
                return;
            }
            this.selectedSite.bind("saveSuccess",_.once(function(model){
                window.appOnSave = undefined;
                $('#fixedOverlay').empty().off().remove();
                $('#fixedLoader').empty().off().remove();
                Backbone.Events.trigger("backToList");
            }),this);
            this.selectedSite.bind("error",_.once(function(msj){
                window.appOnSave = undefined;
                $('#fixedOverlay').empty().off().remove();
                $('#fixedLoader').empty().off().remove();
                $('#errContainerSiteMsj').text(msj);
                $('#errContainerSite').fadeIn();
            }),this);
            this.selectedSite.save();
        },

        checkData: function(){
            if ( this.selectedSite.get('umSite_announcements__c') == true && this.selectedSite.get('umSite_announcementsKaId__c').length < 1 ){
                return this.errorMessages().announcementError;
            }
            if ( this.selectedSite.get("umSite_iconImage__c").length < 1 )
                    return this.errorMessages().iconError;
            if ( this.selectedSite.get("umChatterAnswers_enabled__c") === true &&
                    this.selectedSite.get("umChatterAnswers_dataCategoryGroup__c").length < 1 )
                        return this.errorMessages().caEnabledError;
            if ( this.selectedSite.get("umChatterAnswers_enabled__c") === true &&
                    ( this.selectedSite.get("umChatterAnswers_zoneLabelSingular__c").length < 1 ||
                      this.selectedSite.get("umChatterAnswers_zoneLabelPlural__c").length < 1 ) )
                        return this.errorMessages().caEnabledErrorZones;
            if ( this.selectedSite.get("umSite_backgroundColor__c").length < 1 &&
                 this.selectedSite.get("umSite_backgroundImage__c").length < 1 )
                        return this.errorMessages().errorLogos;

            var zones = this.selectedSite.get("Zones");
            if ( typeof(zones) != "string" ){
                for (var i=0; i<zones.length;i++){
                    var z = zones[i];
                    if ( z.backgroundImage__c.length < 1 && z.backgroundColor__c.length < 1 ){
                        return this.errorMessages().errorLogosZone;
                    }
                    if ( z.iconImage__c.length < 1 ){
                        return this.errorMessages().iconError;
                    }
                }
            }
            return true;
        },

        errorMessages: function(){
            return {
                caEnabledError : "If Chatter Answers is enabled a data category group must be provided.",
                caEnabledErrorZones : "If Chatter Answers is enabled zone singular and plural values must be provided.",
                errorLogos : "A HEX color or background image path must be provided. Verify General tab.",
                errorLogosZone: "A HEX color or background image path must be provided. Verify your Zones.",
                iconError: "Icon image must be provided for each Site and each Zone",
                announcementError: "If announcements is enabled an article number must be provided."
            }
        },

        changeQA : function(e){
            console.log('change on QA');
            if ($(e.currentTarget).is(':checked')) {
                 $('#umSite_authenticated__c').attr("disabled", true);
                 $('#umSite_authenticated__c').prop('checked', true);
            }else{
                 $('#umSite_authenticated__c').removeAttr("disabled");
            }
            /*disabling Q&A > enables Authorization to be edited
             enabling Q&A , enables auth withou edit
             */
        },

        changeAuth : function(e){
            /*
                disabling auth > disables q&a
            */
            if (!$(e.currentTarget).is(':checked')) {
                 $('#umChatterAnswers_enabled__c').attr("disabled", true);
                 $('#umChatterAnswers_enabled__c').prop('checked', false);
            }else{
                 $('#umChatterAnswers_enabled__c').removeAttr("disabled");
            }

        }
    });
    return siteView;
});
