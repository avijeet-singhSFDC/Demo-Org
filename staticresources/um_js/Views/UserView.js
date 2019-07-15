define([
    'jquery',
    'underscore',
    'backbone',
    'Models/User'
    ], function($, _, Backbone, UserModel ){

    var UserView = Backbone.View.extend({

        initialize: function() {
        if (this.options.userDetails != undefined)
           this.model = new UserModel(this.options);
            this.setDispatcherEvents();
        },

        setDispatcherEvents: function(){
            Um.dispatcher.bind("getCurrentUser",this.returnCurrentUser,this);
            Um.dispatcher.bind("setCurrentUser",this.setCurrentUser,this);
            Um.dispatcher.bind("isValidSession",this.isValidSession,this);

        },

        setCurrentUser : function (obj){
            if (obj.Name != undefined)
               obj.Name = _.escape(_.unescape(obj.Name));

            this.model.set(obj);
        },

        returnCurrentUser : function (obj){
            if (typeof obj == 'object'){
                obj.instance[''+obj.method+''](this.model);
            }

            return;
        },

        validSession : function(){
            return (this.model.attributes.Id != "");
        },

        isValidSession : function (obj){
            if (typeof obj == 'object'){
                valid  = (this.model.attributes.Id != "");
                obj.instance[''+obj.method+''](valid);
            }

            return;
        },

        promtLogin : function (caller){
            if (confirm("You need to sign in to do that.\n Click Ok to login.")){
                this.goLogin(caller);
            }else{

            }
        },

        goLogin : function (caller){
        },

        renderProfileSection : function(){

        }

    });

    return UserView;
});