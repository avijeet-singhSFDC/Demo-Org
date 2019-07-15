/*
    Data available if contact us enabled (instance.contactData attribute)
    ------------------------------------
    umContactus_addCaseNumberEnabled__c
    umContactus_businessHourName__c
    umContactus_ctiConfiguration__c
    umContactus_enableCall__c
    umContactus_createContactAndAccount__c
    umContactus_enabled__c
    umContactus_liveAgentChatButtonId__c
    umContactus_liveAgentChatServerURL__c
    umContactus_liveAgentDeploymentId__c
    umContactus_liveAgentDeploymentURL__c
    umContactus_enableLiveAgent__c
    umContactus_phoneNumber__c
*/
define([
    'jquery',
    'underscore',
    'backbone'], function ($, _, Backbone) {

    var ContactusFooterView = Backbone.View.extend({
        events: {
            "click #phoneFlowLink"  : "phoneFlowLink",
            "click #chatFlowLink"   : "chatFlowLink",
            "click #requestFlowLink": "requestFlowLink"
        },
        initialize: function(){
            this.contactData = Um.modules.getModuleData("ContactUS");
            //binding listener to display footer
            Um.dispatcher.bind("launchContactFooter",this.launchFooter,this);
            Um.dispatcher.bind("restartLiveAgent",this.checkForLiveAgent,this);
        },
        launchFooter: function(){
            Um.dispatcher.trigger("isValidSession",{instance:this,method:"render"});
        },
        render: function(userLogged){
            var self = this;

            //If module disabled simply don't do a thing.
            if (!Um.modules.canAccess("ContactUS")) return;

            if(self.contactData==null) self.contactData = null;
                else self.contactData.userLogged = userLogged;

            setTimeout(function(){
                //Determining scenarios to display "Case" or "Mail" [if null means no button display]
                var requestText = undefined;

                if (Um.modules.data.ContactUS.umContactus_casesEnabled__c ){
                    if (Um.modules.data.Authentication){
                        requestText = "Case";
                    }else{
                        requestText = "Mail";
                    }
                }else{
                    requestText = null;
                }
                console.log(' render ContactusFooterView !');
                //Setting el and cleaning any possible content/events
                self.setElement($('#contactUsContainer'));
                self.$el.empty().off().hide(0);
                self.undelegateEvents();
                var t = _.template( $('#contactUsFooter_tpl').html() );
                self.$el.html( t({ data : self.contactData , userIsLogged : userLogged , button : requestText}) );
                self.$el.show();
                self.delegateEvents();
                self.adjustFooterButtons();

                self.solveLiveAgent();
                //  self.checkForLiveAgent();
            },350);
        },
        adjustFooterButtons: function(){
            var howManyButtons = 0;
            $.each( $('.cSupportLinks a') , function(index,item){
                if ( $(item).css("display") != "none" ){
                    howManyButtons++;
                }
            });
            howManyButtons = howManyButtons == 1 ? "100%" : howManyButtons == 2 ? "50%" : "33.3%";
            $('.cSupportLinks a').css("width" , howManyButtons );
            $('.cSupportLinks a:last').css({ "border-right" : "0px" });
        },
        phoneFlowLink: function(e){
            Um.dispatcher.trigger("startPhoneFlow");
            e.stopImmediatePropagation();
            return false;
        },
        chatFlowLink: function(e){
            //  this.checkForLiveAgent();
            Um.dispatcher.trigger("startChatFlow");
            e.stopImmediatePropagation();
            return false;
        },
        requestFlowLink: function(e){
            Um.dispatcher.trigger("startRequestFlow");
            e.stopImmediatePropagation();
            return false;
        },
        checkForLiveAgent: function(){
            if( this.contactData.umContactus_enableLiveAgent__c && this.validateLiveAgentData()){
                console.log(' just : add live agent ');
            /*
                //remove script if exists
                delete liveagent;
                liveAgentDeployment = false;
                window._laq = null;
            */
                //bind status elements
                var d = this.contactData;

                if (!window._laq) { window._laq = []; }
                window._laq.push(function(){
                    window.liveagent.showWhenOnline(d.umContactus_liveAgentChatButtonId__c, document.getElementById("chatFlowLink"));
                    window.liveagent.showWhenOffline(d.umContactus_liveAgentChatButtonId__c, document.getElementById("chatFlowLinkDisabled"));
                });

                //remove - add script
                $('#umLAScript').remove();
                var script = document.createElement('script');
                script.setAttribute('id', 'umLAScript');
                script.src = this.contactData.umContactus_liveAgentDeploymentURL__c;
                script.type = 'text/javascript';
                document.getElementsByTagName('head')[0].appendChild(script);
                this.initAgent();

            }
        },
        validateLiveAgentData: function(){
            var d = this.contactData;
            return d.umContactus_liveAgentChatButtonId__c != undefined && d.umContactus_liveAgentChatButtonId__c != "" &&
                    d.umContactus_liveAgentChatServerURL__c != undefined && d.umContactus_liveAgentChatServerURL__c != "" &&
                    d.umContactus_liveAgentDeploymentId__c != undefined && d.umContactus_liveAgentDeploymentId__c != "" &&
                    d.umContactus_liveAgentDeploymentURL__c != undefined && d.umContactus_liveAgentDeploymentURL__c != "" &&
                    d.organizationId__c != undefined && d.organizationId__c != "";
        },
        initAgent : function (){
            var self = this;
            if (typeof window.liveagent == "undefined"){
                setTimeout(function(p) {
                        self.initAgent();
                }, 500);
            }else{
                var d = this.contactData;
                liveagent.init(d.umContactus_liveAgentChatServerURL__c, d.umContactus_liveAgentDeploymentId__c, d.organizationId__c);
            }
        },

        solveLiveAgent : function(){

            var configData = Um.modules.getModuleData("ContactUS");

            $('<iframe></iframe>', {    id: 'myiframe',
                                        src : iframeSrcPath ,
                                        style : ' height: 0px; border: none; '
                                    }).bind('load', function(event) {

                if (!this.contentWindow) {
                    return;
                }
                var scripWidthSrc = document.createElement('script');
                scripWidthSrc.type ='text/javascript';
                scripWidthSrc.src = configData.umContactus_liveAgentDeploymentURL__c;
                this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthSrc);

                var scripWidthSrc2 = document.createElement('script');
                scripWidthSrc2.type ='text/javascript';
                scripWidthSrc2.src = resourcesPath+'/Utils/liveAgentIframe.js';
                this.contentWindow.document.getElementsByTagName('head')[0].appendChild(scripWidthSrc2);

            }).appendTo('#container-iframe');

            this.sendConfigData();

        },
        /*
            this method sends the configuration data to the iframe who queries liveAgent
            if the iframe is not loaded , we will test every 500 ms untils the iframe is ready
            and we can start the liveAgent logic
        */
        sendConfigData : function(){
            var self = this;

            if (    typeof window.frames['myiframe'] == "object" &&
                    typeof window.frames['myiframe'].initData == "function"){
                window.frames['myiframe'].initData(Um.modules.getModuleData("ContactUS"));
            }else{
                setTimeout( function() {
                    self.sendConfigData();
                }, 500 );
            }
        }
    });
    return ContactusFooterView;
});