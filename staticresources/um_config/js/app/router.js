define(["jquery", "underscore","backbone","app/views/appView"], function($, _, backbone,appView) {
        var router = backbone.Router.extend({
            routes: {
                "*actions"     :    "index"
            },
            initialize: function(options){
                this.app = new appView(options);
            },
            index: function(){
                //this.navigate("/index", {trigger: false, replace: true});
            }
        });
        return router;
    }
);