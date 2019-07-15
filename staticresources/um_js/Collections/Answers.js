define(["jquery",
        "underscore",
        "backbone",
        "Models/Answer"], function($,_,Backbone,Answer){


var Answers = Backbone.Collection.extend({
	model:Answer

});

return Answers;
});