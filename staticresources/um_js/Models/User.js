define(["jquery",
        "underscore",
        "backbone"], function($,_,Backbone){


var User = Backbone.Model.extend({

    initialize: function(data) {
        this.attributes = data.userDetails;
    },

    validSession : function(){
        return (this.attributes.Id != "");
    }



});

return User;
});