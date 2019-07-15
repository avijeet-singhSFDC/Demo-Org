define([
    'jquery',
    'underscore',
    'backbone',
    'Views/contactModule/contactUsMinibar',
    'Views/contactModule/contactUsDeflection'], function ($, _, Backbone,ContactUsMinibar,ContactUsDeflection){

    var ContactFlowView = Backbone.View.extend({
        el: '.contactUsView',
        events: {
            "click .topLeftCancelIconWrapper"    : "cancelContact",
            "click #b_submitAction" : "submitAction",
            "focusout .pHolder"     : "checkFields"
        },
        initialize: function(){
            this.contactData = Um.modules.getModuleData("ContactUS");
            Um.dispatcher.trigger("isValidSession",{instance:this,method:"resolveLoggedUser"});
            this.bindDispatcherListeners();
            this.contactUsMinibar = new ContactUsMinibar();
            this.contactUsDeflection = new ContactUsDeflection();
        },
        bindDispatcherListeners: function(){
            Um.dispatcher.bind("renderPhoneFlow",this.renderPhoneFlow,this);
            Um.dispatcher.bind("renderChatFlow",this.renderChatFlow,this);
            Um.dispatcher.bind("renderRequestFlow",this.renderRequestFlow,this);
            Um.dispatcher.bind("contactFlowFinalStepDo",this.contactFlowFinalStepDo,this);
        },
        resolveLoggedUser: function(isLogged){
            if(this.contactData==null) this.contactData=null;
            else this.contactData.loggedUser = isLogged;
        },
        renderPhoneFlow: function(){
            Um.dispatcher.trigger("navigate",{ trigger : false, replace : false, route : 'app/contact'});
            this.handleCookie("phone");
            this.render();
        },
        renderChatFlow: function(){
            Um.dispatcher.trigger("navigate",{ trigger : false, replace : false, route : 'app/contact'});
            this.handleCookie("chat");
            this.render();
        },
        renderRequestFlow: function(){
            Um.dispatcher.trigger("navigate",{ trigger : false, replace : false, route : 'app/contact'});
            this.handleCookie("request");
            this.render();
        },
        contactFlowFinalStepDo: function(){
            var d = this.getCookie();
            if (d != null ){
                d.file = this.contactUsMinibar.fileSelected;
                d.userLogged = this.contactData.loggedUser;
                this.contactUsDeflection.processDeflection(d);
            }else{
                this.renderRequestFlow();
            }

        },
        render: function(){



            //Determining scenarios to display "Case" or "Mail" [if null means no button display]
            var titleLabel = 'Ask a Question';

            var cookie = this.getCookie();
            if (cookie.type == "request"){
                if (Um.modules.data.ContactUS.umContactus_casesEnabled__c && Um.modules.data.Authentication)
                    titleLabel = "New Case";
                else if( Um.modules.data.ContactUS.umContactus_casesEnabled__c && !Um.modules.data.Authentication )
                    titleLabel = "New Mail";
            }

            this.undelegateEvents();
            this.template = _.template($('#contactUs_tmpl').html());
            Backbone.Events.trigger("doTransition",this.$el);
            this.$el.html(this.template({
                                title : titleLabel,
                                ctype : cookie.type ,
                                subject : _.escape(cookie.subject) ,
                                description : _.escape(cookie.description) ,
                                firstName : _.escape(cookie.firstName) ,
                                lastName : _.escape(cookie.lastName) ,
                                email : cookie.email ,
                                userLogged : this.contactData.loggedUser,
                                displayNameFields : this.contactData.umContactus_createContactAndAccount__c }));

            this.delegateEvents();
            this.contactUsMinibar.refresh();
        },
        cancelContact: function(){
            this.removeCookie().redirectHome();
            return false;
        },
        removeCookie: function(){
            var domain = "."+document.location.host;
            var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
            Um.cookies.removeItem("contactFlow",p,domain);
            return this;
        },
        redirectHome: function(){
            Um.dispatcher.trigger("navigate",{ trigger : true, replace : true, route : 'app/home'});
        },
        handleCookie: function(t){
            var tCookie = this.getCookie();
            if(tCookie===null){
                tCookie = {
                    type : t,
                    description: "",
                    subject: "",
                    lattitude: "",
                    longitude: "",
                    emoIcon: "",
                    address: "",
                    email: "",
                    firstName: "",
                    lastName: ""
                };
            }else{
                tCookie.type = t!=undefined?t:tCookie.type;
            }
            tCookie.subject = $('#b_subject').length > 0  ? $.trim($('#b_subject').val()) : tCookie.subject;
            tCookie.description = $('#descriptionDiv').length > 0  ? $.trim($('#descriptionDiv').text()) : tCookie.description;
            if(!this.contactData.loggedUser){
                tCookie.email = $('#b_emailField').length > 0 ? $.trim($('#b_emailField').val()) : tCookie.email;

                if (this.contactData.umContactus_createContactAndAccount__c){
                    tCookie.firstName = $('#b_firstName').length > 0  ? $.trim($('#b_firstName').val()) : tCookie.firstName;
                    tCookie.lastName = $('#b_lastName').length > 0  ? $.trim($('#b_lastName').val()) : tCookie.lastName;

                    //encode
                    tCookie.firstName = encodeURIComponent(decodeURIComponent(tCookie.firstName));
                    tCookie.lastName = encodeURIComponent(decodeURIComponent(tCookie.lastName));
                }

            }else{
                tCookie.email = "";
            }
            //encode
            tCookie.subject = encodeURIComponent(decodeURIComponent(tCookie.subject));
            tCookie.description = encodeURIComponent(decodeURIComponent(tCookie.description));

            var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
            var domain = "."+document.location.host;
            Um.cookies.setItem("contactFlow",JSON.stringify(tCookie),null,p,domain,null);
        },
        getCookie: function(){
            var tCookie = Um.cookies.getItem("contactFlow");
            tCookie = tCookie != null ? JSON.parse(tCookie) : tCookie;
            if (tCookie != null){

                if (tCookie.subject != undefined)
                    tCookie.subject = decodeURIComponent(tCookie.subject);

                if (tCookie.description != undefined)
                    tCookie.description = decodeURIComponent(tCookie.description);

                if (this.contactData.umContactus_createContactAndAccount__c){

                    if (tCookie.firstName != undefined)
                        tCookie.firstName = decodeURIComponent(tCookie.firstName);

                    if (tCookie.lastName != undefined)
                        tCookie.lastName = decodeURIComponent(tCookie.lastName);
                    }
                }

            return tCookie;
        },

        submitAction: function(){
            if (!this.validate()){
                this.alertMsg("All fields are required, please verify your information.");
                return;
            }
            this.saveCookieInfo();
            Um.dispatcher.trigger("navigate",{ trigger : true, replace : false, route : 'app/contact/finalStep'});
        },
        saveCookieInfo: function(){
            this.contactUsMinibar.saveCookieInfo();
            this.handleCookie();
        },


        checkFields : function(e){
            if ( $.trim($(e.currentTarget).text()).length == 0 ) {
                $(e.currentTarget).html('');
            }
        },

        validate: function(){
            var ret =     $.trim($('#b_subject').val()).length>=2 && $.trim($('#b_subject').val()).length<=  255
                      &&   $.trim($('#descriptionDiv').text()).length <= 31999;
            if (!this.contactData.loggedUser){
                var t = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                ret = ret  && t.test($.trim($('#b_emailField').val()));

                if (this.contactData.umContactus_createContactAndAccount__c){
                    ret = ret && $.trim($('#b_firstName').val()).length > 0 && $.trim($('#b_lastName').val()).length > 0
                }

            }
            return ret;
        },
        alertMsg: function(text){
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(text);
            iframe.parentNode.removeChild(iframe);
        }
    });
    return ContactFlowView;
});