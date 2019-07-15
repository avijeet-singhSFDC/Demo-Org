define(["jquery",
        "underscore",
        "backbone",
        "Models/Community"], function($,_,Backbone,Community){

var CommunityView = Backbone.View.extend({

	model: Community,
	tagName: "li",
	events: {
		"click" : "communityClicked"
	},

	initialize: function(args){
		this.model = args.model;
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
	},

	render: function(){
		this.template = _.template($('#community_tpl').html()),
		this.$el.html(this.template({
			backgroundImagePath__c 	: this.model.get("iconPath"),
			publicName__c			: this.model.get("publicName"),
			totalArticles			: this.model.get("totalArticles"),
			totalQuestions			: this.model.get("totalQuestions"),
			zoneDescription 		: this.model.get("zoneDescription"),
			canUseKB : this.canUseKB,
			canUseQuestions : this.canUseQuestions
		}));
		this.undelegateEvents(); this.delegateEvents();
        return this;
	},

	renderAsSideBarItem: function(){
		this.template = _.template($("#communitySideBar_tpl").html()),
		this.$el.html(this.template(this.model.toJSON()));
		this.undelegateEvents(); this.delegateEvents();
        return this;
	},

	communityClicked: function(e){
		this.trigger("communityClicked",this.model);
		Um.dispatcher.trigger("communityClickedForSidebar",this.model);
	}

});
return CommunityView;
});
