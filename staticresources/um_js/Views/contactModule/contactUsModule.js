define([
    'jquery',
    'underscore',
    'backbone',
    'Views/contactModule/contactUsFooterView',
    'Views/contactModule/contactUsFlowView'], function ($, _, Backbone,ContactUsFooterView,ContactUsFlowView) {

    var ContactUsModule = Backbone.View.extend({
        initialize: function(){
            this.contactData = Um.modules.getModuleData("ContactUS");
            Um.dispatcher.trigger("isValidSession",{instance:this,method:"resolveLoggedUser"});
            this.contactUsFooterView = new ContactUsFooterView();
            this.contactUsFlowView = new ContactUsFlowView();
            this.bindDispatcherListeners();
        },
        bindDispatcherListeners: function(){
            Um.dispatcher.bind("startPhoneFlow",this.phoneFlow,this);
            Um.dispatcher.bind("startChatFlow",this.chatFlow,this);
            Um.dispatcher.bind("startRequestFlow",this.requestFlow,this);
            Um.dispatcher.bind("contactFlow",this.contactFlow,this);
            Um.dispatcher.bind("contactFlowFinalStep",this.contactFlowFinalStep,this);
        },
        resolveLoggedUser: function(userLogged){
            if(this.contactData==null) return;
            this.contactData.userLogged = userLogged;
        },
        phoneFlow: function(){
            if(!this.checkAccess()){
                if ( window.location.hash == "#app/contact" || window.location.hash == "#app/contact/finalStep"){
                    Um.dispatcher.trigger("navigate",{ route: "app/home", trigger : true, replace : false });
                }
            }else{
                Um.dispatcher.trigger("renderPhoneFlow");
            }
        },
        chatFlow: function(){
            if(!this.checkAccess()){
                if ( window.location.hash == "#app/contact" || window.location.hash == "#app/contact/finalStep"){
                    Um.dispatcher.trigger("navigate",{ route: "app/home", trigger : true, replace : false });
                }
            }else{
                //need to restart live agent
                //   Um.dispatcher.trigger("restartLiveAgent");
                Um.dispatcher.trigger("renderChatFlow");
            }
        },
        requestFlow: function(){
            if(!this.checkAccess()){
                if ( window.location.hash == "#app/contact" || window.location.hash == "#app/contact/finalStep"){
                    Um.dispatcher.trigger("navigate",{ route: "app/home", trigger : true, replace : false });
                }
            }else{
                Um.dispatcher.trigger("renderRequestFlow");
            }
        },
        contactFlow: function(){
            if(!this.checkAccess()){
                if ( window.location.hash == "#app/contact" || window.location.hash == "#app/contact/finalStep"){
                    Um.dispatcher.trigger("navigate",{ route: "app/home", trigger : true, replace : false });
                }
                return;
            }
            var tCookie = Um.cookies.getItem("contactFlow");
            tCookie = tCookie != null ? JSON.parse(tCookie) : tCookie;
            if(tCookie != null){
                if(tCookie.type === "phone") this.phoneFlow();
                if(tCookie.type === "chat") this.chatFlow();
                if(tCookie.type === "request") this.requestFlow();
            }else{
                //If here and cookies doesn't exists (means user deleted cookies or cookie expired and user tried to
                //continue using app url for contact flow) we simply load the only 100% flow that if contact us is enabled will exist
                this.requestFlow();
            }
        },
        contactFlowFinalStep: function(){
            if(!this.checkAccess()){
                Um.dispatcher.trigger("navigate",{ route: "app/home", trigger : true, replace : false });
            }else{
                Um.dispatcher.trigger("contactFlowFinalStepDo");
            }
        },
        checkAccess: function(){
            //Check if contact us is enabled
            if(this.contactData==null) return false;
            //Check if app is authenticated
            if (!Um.modules.data.Authentication) return true;
            if (Um.modules.data.Authentication && !this.contactData.userLogged){
                if (confirm("You need to be logged to perform this action, go to login page?")){
                    Um.dispatcher.trigger("navigate",{ trigger : false, replace : true, route : 'app/contact'});
                    Um.dispatcher.trigger("loginLaunch","login");
                    return false;
                }else{
                    return false;
                }
            }else{
                return true;
            }
            return false;
        }
    });
    return ContactUsModule;
});
