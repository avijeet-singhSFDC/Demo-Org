define(["jquery",
        "underscore",
        "backbone",
        "Views/HomeArticlesList"], function($,_,Backbone,articleList){

var HomePageView = Backbone.View.extend({

	el: ".homePageView",

	initialize: function(){

		this.modules = this.options.available;
		this.homeData = this.options.homeData;
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.canUseProfile = Um.modules.canAccess('Profile');


        this.bind("communityClickedForSearch", this.communityClickedForSearch);

		this.setDispatcherEvents();
		Um.dispatcher.trigger("getCurrentUser",{ instance : this, method : 'currentUser' });

	},

	currentUser: function (model){
		this.user = model;
	},

	setDispatcherEvents: function(){
		Um.dispatcher.bind("sendCommunitiesCollectionViews",this.renderCommunities,this);
		Um.dispatcher.bind("getCommunitiesPublicName",function(){ Um.dispatcher.trigger("sendCommunitiesPublicName",this.homeData.Communities_Public_Name__c) },this);
	},

	events: {
		"click .topLeftBarButtonWrapper" 	: "sideBarIconClick",
		"click #b_seeAll"			: "seeAll",
		"click #b_searchWithText"	: "selectZoneAndSearch",
		"click #b_askFooterBtn"		: "startAskFlow",
		"click #sUpLink"			: "sUp",
		"click #sInLink"			: "sIn"
	},

	render: function(){
		if (this.canUseKB || this.canUseQuestions){
			this.renderFull();
		}else{
			this.renderContact();
		}
        return this;
	},


	renderContact: function(){
		this.undelegateEvents();
		this.template = _.template($('#homePageOnlyContact_tpl').html());
		var content = $('<div/>').append(this.template({
                brandingImagePath__c        : this.homeData.urlForStaticResources+"/"+this.homeData.brandingImagePath__c,
                siteWelcomeMessage__c       : this.homeData.siteWelcomeMessage__c,
                Communities_Public_Name__c  : this.homeData.Communities_Public_Name__c,
                searchBannerLabel__c        : this.homeData.searchBannerLabel__c,
				sideBarOn 					: this.canUseProfile
            }));
		//Setting background image and color
		if (this.homeData.umSite_backgroundColor__c != 'null'){
			$(content).find('#b_backgroundImagePath__c').css({
			"background-color"	: this.homeData.umSite_backgroundColor__c
			});
		}
		$(content).find('#b_backgroundImagePath__c').css({
			"backgroundImage"	: "url('"+this.homeData.urlForStaticResources+"/"+this.homeData.backgroundImagePath__c+"')",
		});


		this.$el.empty().off();
		Backbone.Events.trigger("doTransition",this.$el);
		this.$el.html(content);
		this.delegateEvents();

		//Triger footer
		//Um.dispatcher.trigger("launchContactFooter");
        return this;
	},



	renderFull: function(){

		this.undelegateEvents();
		this.template = _.template($('#homePage_tpl').html());
		var content = $('<div/>').append(this.template({
                brandingImagePath__c        : this.homeData.urlForStaticResources+"/"+this.homeData.brandingImagePath__c,
                siteWelcomeMessage__c       : this.homeData.siteWelcomeMessage__c,
                Communities_Public_Name__c  : this.homeData.Communities_Public_Name__c,
                searchBannerLabel__c        : this.homeData.searchBannerLabel__c,
				justPKB 					: (this.canUseKB && ! this.canUseQuestions)
            }));
		//Setting background image and color
		if (this.homeData.umSite_backgroundColor__c != 'null'){
			$(content).find('#b_backgroundImagePath__c').css({
			"background-color"	: this.homeData.umSite_backgroundColor__c
			});
		}
		$(content).find('#b_backgroundImagePath__c').css({
			"backgroundImage"	: "url('"+this.homeData.urlForStaticResources+"/"+this.homeData.backgroundImagePath__c+"')",
		});


		this.$el.empty().off();
		Backbone.Events.trigger("doTransition",this.$el);
		this.$el.html(content);
		this.delegateEvents();

		Um.dispatcher.trigger("getCommunitiesCollectionViews");

		if (this.canUseQuestions){
			//add Ask Footer Section
			askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
			$(content).find('#b_askOrSearchContainer').html(askSectionTPL());

		}
		if (this.canUseKB ) {
			if (this.homeData.umSite_announcements__c == "true")
				this.resolveAnnouncement();

	        if (!this.canUseQuestions  ){
	        	this.articleList = new articleList();
			}

		}

		//Triger footer
		Um.dispatcher.trigger("launchContactFooter");
        return this;
	},


	renderCommunities: function(items){
		this.$el.find('#b_seeAllZones').hide();
		var MAX_ITEMS = 5;
		var count = 1;
		_.each(items,function(item){
			if ( count <= MAX_ITEMS ) this.$el.find("#communitiesContainer").append( item.render().el );
			count++;
			item.on("communityClicked",this.communityClicked,this);
		},this);
		//display ViewAll if there are more than MAX zones
		if (_.size(items)> MAX_ITEMS)
			this.$el.find('#b_seeAllZones').show();

		//Printing communities quantity
		var elm = this.$el.find('#b_communitiesNumber');
		if (items.length >1){
			val = items.length +' '+ this.homeData.Communities_Public_Plural_Name__c;
		}else{
			val = items.length +' '+ this.homeData.Communities_Public_Name__c;
		}

		elm.text(val);
	},

	resolveAnnouncement : function (){
		var ArticleView = require('Views/ArticleView');
		articleView = new ArticleView();
		articleView.renderAnnouncement({
					idCommunity : -1,
			 		articleNumber : this.homeData.knowledgeArticle__c,
			        container : this.$el.find("#b_siteAnnouncementContainer")



			    });
	},


	getCurrentSiteData: function(){
		var ret;
		if (window.siteData != undefined){
			ret = window.siteData;
		}
		window.siteData = undefined;
		return ret;
	},

	sideBarIconClick: function (){
		Um.dispatcher.trigger("sideBarIconClick");
	},

	seeAll: function(){
		if (this.canUseQuestions ){
			Um.dispatcher.trigger("navigate",{
				route 	: "app/zoneSelection",
				trigger : true,
				replace	: false
			});
		}else{
			Um.dispatcher.trigger("navigate",{
				route 	: "app/zoneLongerList/-1",
				trigger : true,
				replace	: false
			});

		}

	},

	communityClicked: function(community){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/zone/"+community.get('id'),
			trigger : true,
			replace	: false
		});
	},

	selectZoneAndSearch: function(){


        if (!this.canUseQuestions  ){
			 Um.dispatcher.trigger("navigate",{
	            route     : "app/search/-1",
	            trigger : true,
	            replace    : true
	        });
		}else{
			Um.dispatcher.trigger("navigate",{
				route 	: "app/zoneSelection",
				trigger : true,
				replace	: false
			});
	        Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClickedForSearch");
		}



	},

	communityClickedForSearch : function (communityId){
		 Um.dispatcher.trigger("navigate",{
            route     : "app/search/"+communityId.get('id'),
            trigger : true,
            replace    : true
        });
	},


	startAskFlow : function (){

		Um.dispatcher.trigger("navigate",{
					route 	: "app/zoneSelection",
					trigger : true,
					replace	: false
				});
	        Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClickedToAsk");
	},

	communityClickedToAsk : function (communityId){
		 Um.dispatcher.trigger("navigate",{
            route     : "app/newQuestion/"+communityId.get('id'),
            trigger : true,
            replace    : true
        });
	},

	sUp: function(e){
		Um.dispatcher.trigger("loginLaunch","signup");
		e.stopImmediatePropagation();
		return false;
	},

	sIn: function(e){
		Um.dispatcher.trigger("loginLaunch","login");
		e.stopImmediatePropagation();
		return false;
	}
});
return HomePageView;
});
