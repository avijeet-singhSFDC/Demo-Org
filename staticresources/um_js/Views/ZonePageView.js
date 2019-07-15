define(["jquery",
        "underscore",
        "backbone",
        "Views/LongerListView"], function($,_,Backbone,LongerListView){

var ZonePageView = Backbone.View.extend({

	el: ".zonePageView",

	initialize: function(){
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.community = this.options.community;//this.options.comm;
		this.longerListView = new LongerListView(this.options);//{  comm : this.community});
		this.setDispatcherEvents();
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.isSingleCommunity = (Um.modules.getSingleCommunity()!= null);
		this.render();
	},

	setDispatcherEvents: function(){
		this.longerListView.bind("sendQuestions",this.questionsReady,this);
		this.longerListView.bind("sendArticles",this.articlesReady,this);
	},

	events: {
		"click .topLeftBarButtonWrapper" 	: "sideBarIconClick",
		"click #b_seemoreArticles"	: "seeMoreLinkEvent",
		"click #b_seemoreQuestions"	: "seeMoreLinkEvent",
		"click #b_searchWithText"	: "goToSearch",
		"click #b_linkToNotif"		: "goToNotifications",
		"click #b_askFooterBtn"		: "startAskFlow"
	},

	render: function(){
		this.template = _.template($('#zonePage_tpl').html());
		var container = $('<div/>').append(this.template({
			isSingleCommunity : this.isSingleCommunity,
			zoneTitle : this.community.get("publicName"),
			iconImage__c  : this.community.get("iconPath"),
			searchLabel : this.community.get("searchBannerLabel__c"),
			canUseKB : this.canUseKB,
			canUseQuestions : this.canUseQuestions
		}));
		//Setting background image
		if (this.canUseQuestions){

			$(container).find('#b_backgroundImagePath__c').css({
				"backgroundImage"	: "url('"+this.community.get('urlForStaticResources')+"/"+this.community.get('backgroundImagePath__c')+"')"
			});
			if (this.community.get('backgroundColor__c') != 'null'){
				$(container).find('#b_backgroundImagePath__c').css({
					"background-color"	: this.community.get('backgroundColor__c')
				});
			}
			//brandingImagePath__c
		}

		//add Ask Footer Section
		if (this.canUseQuestions){
			askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
			$(container).find('#b_askOrSearchContainer').html(askSectionTPL());
		}

		Backbone.Events.trigger("doTransition",this.$el);
		this.$el.html(container);
		this.delegateEvents();


		if (Um.modules.canAccess('KB')){
			this.resolveArticles();
			if (this.community.get('announcements__c') == "true")
				this.resolveAnnouncement();
		}

		if (this.canUseQuestions)
			this.resolveQuestions();

		//Triger footer
		//Um.dispatcher.trigger("launchContactFooter");
		return this;
	},

	sideBarIconClick: function (){
		Um.dispatcher.trigger("sideBarIconClick");
	},

	goToSearch: function(){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/search/"+this.community.get('id'),
			trigger : true,
			replace	: false
		});
	},

	goToNotifications : function(){
		alert('display notifications page');
	},

	resolveQuestions: function(){
		this.longerListView.bind("sendQuestionsViews",_.once(this.questionsReady),this);
		this.longerListView.trigger("getQuestions");
	},

	resolveArticles: function(){
		this.longerListView.bind("sendArticlesViews",_.once(this.articlesReady),this);
		this.longerListView.trigger("getArticles");
	},

	questionsReady: function(collectionViews){
		var container = this.$el.find('#b_listOfQuestions').empty().off();
		this.$el.find('#b_listOfQuestions').hide();
		var count = 0;
		_.each(collectionViews,function(item){
			if (count < 3) container.append(item.renderSmall().el);
			count++;
		},this);
		this.$el.find('#b_listOfQuestions').fadeIn();
	},

	articlesReady: function(collectionViews){
		var container = this.$el.find('#b_listOfArticles').empty().off();
		this.$el.find('#b_listOfArticles').hide();
		var count = 0;
		//sort by likes
 		collectionViews = _.sortBy(collectionViews, function(item){ return -item.model.get('Likes'); });

		_.each(collectionViews,function(item){
			if (count < 3) container.append(item.renderSmall().el);
			count++;
		},this);
		this.$el.find('#b_listOfArticles').fadeIn();
	},

	resolveAnnouncement : function (){
		var ArticleView = require('Views/ArticleView');
		articleView = new ArticleView();
		articleView.renderAnnouncement({
			 		idCommunity : this.community.get('id'),
			 		articleNumber : this.community.get('knowledgeArticle__c'),
			        container : this.$el.find("#b_announcementContainer")
			    });
	},


	seeMoreLinkEvent: function(e){
		listFor = 'a';
		if ($(e.currentTarget).data().for == 'questions')
			listFor = 'q';

		Um.dispatcher.trigger("navigate",{
			route 	: "app/zoneLongerList/"+this.community.get('id')+'/'+listFor,
			trigger : true,
			replace	: false
		});
	},

    seeMoreLink: function(){
        this.longerListView.render();
    },

	startAskFlow : function (){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/newQuestion/"+this.community.get('id'),
			trigger : true,
			replace	: false
		});
	},
	destroyView: function(){
		this.$el.empty().off();
		if (this.longerListView != undefined) this.longerListView.off();
	}
});
return ZonePageView;
});
