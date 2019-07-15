define([
    'jquery',
    'underscore',
    'backbone',
    'Utils/fileUpload',
    'Views/DeflectionView'], function ($, _, Backbone,FileUpload,DeflectionView) {
    var ContactUsReflection = Backbone.View.extend({
        el: '.contactDView',

        initialize: function(){
            this.fileUpload = new FileUpload();
            this.contactData = Um.modules.getModuleData("ContactUS");
            this.canUseKB = Um.modules.canAccess('KB');
            this.canUseQuestions = Um.modules.canAccess('Questions');


            Um.dispatcher.bind("CUDeflectionCallback",this.handleDeflectionCallback,this);
        },

        events: {
            "click .topLeftBarArrowWrapper"       : "backPressed",
            "click #b_submitAction"     : "submitCase",
            "click #b_cancelRequest"    : "cancelRequest",
            "click #b_submitActionLink" : "submitCase",
            "click #b_seeAllCasesBtn"   : "redirectToProfile",
            "click #b_goHomeFooterBtn"  : "redirectHome",
            "click #b_myRequestSuccess" : "redirectToCaseDetail"
        },

        removeCookie: function(){
            var domain = "."+document.location.host;
            var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
            Um.cookies.removeItem("contactFlow",p,domain);
            return this;
        },
        getCookie: function(){
            var tCookie = Um.cookies.getItem("contactFlow");
            tCookie = tCookie != null ? JSON.parse(tCookie) : tCookie;
            return tCookie;
        },
        processDeflection: function(data){
            this.data = data;
            if ( !this.canUseKB && !this.canUseQuestions ){
                this.submitCase();
            }else{
                //lets validate the info received is good enough to do the deflection and continue with the contact flow
                if (this.validateData(data) ){
                    //this.getDeflectionResults(data);

                    if (this.deflectionView != undefined){
                                this.deflectionView.cleanUp();
                    }
                    this.deflectionView = new DeflectionView({   community : '-1' ,
                                                    searchStr : data.subject,
                                                    deflectionCallBack : 'CUDeflectionCallback',
                                                    data : data
                    });
                    //fetch deflection to skip if there are no results.
                    this.deflectionView.fetchResults();

                }else{
                    Um.dispatcher.trigger("navigate",{ trigger : true, replace : false, route : 'app/contact'});
                }
            }

        },

        handleDeflectionCallback : function (size,data){

            if ((size== 0)){
                    this.submitCase();
            }else{
                this.undelegateEvents();
                var t = _.template($('#contactUsDeflection_tmpl').html());
                Backbone.Events.trigger("doTransition",this.$el);

                this.data.subject = _.escape(this.data.subject);
                this.data.description = _.escape(this.data.description);

                this.$el.html(t({ data : this.data }));
                this.delegateEvents();

                //set element and populate deflection results
                this.deflectionView.setElement(this.$el.find("#b_similarIssues"));
                this.deflectionView.getResultItems();
                this.delegateEvents();
            }

        },

        //pre -> data.xxx [values] != undefined || null (empty values allowed)
        validateData: function(data){
            var ret = data.type != undefined &&
                      data.subject.length >= 2 ;
            if (!data.userLogged ){
                if( data.email.length<1 ) ret = false;
                //validate names
                if (this.contactData.umContactus_createContactAndAccount__c ){
                    if( data.firstName.length<1 || data.lastName.length <1 ) ret = false;
                }
            }
            return ret;
        },

        backPressed: function(){
            window.history.back(1);
        },

        submitCase: function(){
            var req = Um.modules.modelFor('ContactUS');
            var self = this;
            req.origin = this.data.type;
            req.operationType = 'processContactUs';
            req.operationData.subject = this.data.subject;
            req.operationData.description = this.data.description;
            //just check if email exists (propper validation of email field is done during the contact flow)
            if(this.data.email!=undefined&&this.data.email.length>0)
                req.operationData.email = this.data.email;

            if (this.data.firstName != undefined && this.data.firstName.length > 0)
                req.operationData.firstName = this.data.firstName;

            if (this.data.lastName != undefined && this.data.lastName.length > 0)
                req.operationData.lastName = this.data.lastName;

            if(this.data.lattitude.toString().length>0 && this.data.longitude.toString().length>0){
                req.operationData.latitude = this.data.lattitude;
                req.operationData.longitude = this.data.longitude;
            }
            if(this.data.emoIcon.length>0)
                req.operationData.emoIcon = this.data.emoIcon;

            umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
                if(!r.isSuccess){
                    self.alertMsg("An internal error ocurred while trying to process your request. Please try again in few minutes");
                }else{
                    self.processFlow(r.responseBody,r.session);
                }
            }, true, this);
        },

        cancelRequest: function(){
            this.removeCookie();
            Um.dispatcher.trigger("navigate",{ trigger : true, replace : false, route : 'app/home'});
        },
        removeCookie: function(){
            var domain = "."+document.location.host;
            var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
            Um.cookies.removeItem("contactFlow",p,domain);

            //delete pic
            Um.dispatcher.trigger("CUcleanUpFile");

            return this;
        },
        alertMsg: function(text){
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(text);
            iframe.parentNode.removeChild(iframe);
        },
        processFlow: function(response,session){
            if(this.data.file!=null&&this.data.file!=undefined&&typeof(this.data.file)==='object'){
                //we have a file to upload
                this.fileUpload.prepareFileUploads(Um.tmpFileArray,response.caseId,this,response);
            }else{
                this.success(response,session);
            }
        },
        success: function(response, session){
            if(this.data.type=="request"){
                this.loggedId = (session != undefined && session.Id != "") ? session.Id : '';
                this.caseId = response.caseId;
                var successsTemplate = _.template($('#caseCreateSuccessPage_tpl').html());

                Backbone.Events.trigger("doTransition",this.$el);
                this.$el.html(successsTemplate({    data : this.data ,
                                                    profileId : this.loggedId ,
                                                    accessSelfData : Um.modules.data.Authentication }));
                this.delegateEvents();

                //render finalStep
                //this.alertMsg("Your request has been submited!");
                this.removeCookie();
            }
            if(this.data.type=="phone"){
                this.initPhone();
                this.removeCookie();
            }
            if(this.data.type=="chat"){
                this.initChat(response);
                this.removeCookie();
            }

        },
        failure: function(){
            this.alertMsg("An internal error ocurred while trying to process your request image. Please try again in few minutes");
        },
        initPhone: function(){
            var self = this;
            umProxy.getPhoneCallAvailable( function(data){
                if ( data.available == "true" ){
                  numberToCall = data.number;
                  ctiString = Um.modules.getModuleData("ContactUS").umContactus_ctiConfiguration__c;
                  if (typeof pkb2_ctiCONSTANTS == 'object' )
                      numberToCall = pkb2_ctiCONSTANTS.get(numberToCall,ctiString,caseNumber);
                  self.cancelRequest();
                  window.location="tel:"+numberToCall+"";
                }else{
                    self.alertMsg("You are outside business hours but your request has been submited.");
                    self.cancelRequest();
                }
            });
        },
        initChat: function(response){
            var t = _.template($('#template-contactUs-launchLiveAgentChat').html());
            $('body').append(t());
            var self = this;
            $("#chatFlowLink").bind("click", function (e) {
                var d = Um.modules.getModuleData("ContactUS");
                window.liveagent.startChatWithWindow(d.umContactus_liveAgentChatButtonId__c,'_self');
            });
            $("#liveagent_button_offline").bind("click", function (e) {
                console.log("offline!");
            });
            Um.dispatcher.trigger("restartLiveAgent");
            this.initChatLoop(response);
        },
        initChatLoop: function(response){
            //need to run this asynchronous as we are deleting/adding the script again
            //(needed due to salesforce liveAgent component particularities)
            var self = this;
            if (typeof window.liveagent == "undefined"){
                setTimeout(function(p) {
                        self.initChatLoop(response);
                }, 500);
                return;
            }
            var d = Um.modules.getModuleData("ContactUS");
            window.liveagent.addCustomDetail('Case Id', response.caseId).map('Case', 'Id', false,true,false);
            window.liveagent.addCustomDetail('Case Number', response.caseNumber).map('Case', 'Number', false, true,false);
            window.liveagent.addCustomDetail('Case', response.caseId).saveToTranscript('Case');
            // Overrides the display name of the visitor in the agent console when enaged in a chat
            var n = Um.modules.data.session.Name.length<1 ? this.data.email : Um.modules.data.session.Name;
            liveagent.setName(n);
            self.startAutoJoinFeature();
        },
        startAutoJoinFeature: function(){
          //Auto join chat functionality
          var a = window.setInterval(function(){
              if ( $('#chatFlowLink').css("display") != "none" ){
                  clearInterval(a);
                  $('#chatFlowLink').trigger("click");
              }
              if ( $('#chatFlowLinkDisabled').css("display") != "none" ){
                  clearInterval(a);
              }
          },100);
        },


        redirectToProfile : function(e){
            Um.dispatcher.trigger("navigate",{
                route   : "app/profileCases/"+this.loggedId+"/",
                trigger : true,
                replace : false
            });
        },


        redirectHome : function(e){
            Um.dispatcher.trigger("navigate",{
                    route   : "app/home",
                    trigger : true,
                    replace : false
            });
        },

        redirectToCaseDetail  : function(e){
            Um.dispatcher.trigger("navigate",{
                    route   : "app/case/"+this.caseId+"/",
                    trigger : true,
                    replace : false
            });
        }
    });
    return ContactUsReflection;
});