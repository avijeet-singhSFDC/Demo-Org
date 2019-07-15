define(["jquery",
        "underscore",
        "backbone",
        "Utils/cam_Utils"], function($,_,Backbone,utilsObj){

var SideMenuView = Backbone.View.extend({

	el: ".sideMenuView",

    utils: new utilsObj,

	initialize: function(args){
		this.setDispatcherEvents();

		this.cookieName = 'UM_KAV';
		this.canUseProfile = Um.modules.canAccess('Profile');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.canUseKB = Um.modules.canAccess('KB');
		if (this.canUseProfile){
			this.getCurrentSession();
		}
	},

	setDispatcherEvents: function(){
		//Um.dispatcher.bind("currentSessionDetails",this.buildFromSession,this);
		Um.dispatcher.bind("sendSideMenuCommunityListDetails",this.renderCommunities,this);
		Um.dispatcher.bind("communityClickedForSidebar",this.updateHistoryTrack,this);
		Um.dispatcher.bind("kavClickedForSidebar",this.updateKAVHistoryTrack,this);
		Um.dispatcher.bind("sideBarIconClick",this.toggleView,this);
	},

	events: {
		"click #b_homePageLink" : "redirectToHomePage",
		"click #b_userSection"	: "sessionAction",
		"click #b_logoutLink"	: "logoutAndRedirect",
		"click #b_loginLink"	: "login",
		"click .topLeftBarButtonWrapperExpanded": "toggleView",
		"click .pkavSidebar"	: "articleDetail"
	},

	getCurrentSession : function (){
			Um.dispatcher.trigger("getCurrentUser",{
		        instance : this,
		        method : "storeSessionData"
		    });
	},

	storeSessionData : function (data){
		if (this.currentSession == undefined && typeof data == "object"){
			this.currentSession = data;
			//if (this.currentSession.validSession())
			if (this.canUseQuestions)
				this.cookieName = this.currentSession.get('COOKIE_NAVIGATION');
		}
	},



	articleDetail : function (e){
 		this.toggleView();
		routeTo = "app/article/-1/"+$(e.currentTarget).data().for+"/";

		Um.dispatcher.trigger("navigate",{
            route 	: routeTo,
            trigger : true,
            replace : false
        });

	},

	render: function(){
		this.template = _.template($('#sideMenu_tpl').html());
		this.undelegateEvents();
		this.$el.empty().off();
		this.$el.append(this.template());
		this.delegateEvents();
		if (this.canUseQuestions ){
			this.buildHistoricalQA();
		}else{
			if (this.canUseKB )
				this.buildHistoricalKAV();
		}

		this.renderUserSection();
		this.handleRecentlyViewedLabel();

		Backbone.Events.trigger("doTransitionSide",this.$el);
		return this;
	},


	toggleView : function (){
		if ( $('.sideMenuView').hasClass("sideMenuClosed") ){
			$('#b_appLayer').addClass('sideMenuOpenBody');
			//$('.tActive').attr('style','transform:translate3d('+($('.sideMenuView').width())+'px, 0px, 0px)!important');
			//$('<div class="overlay" style="transform:translate3d('+($('.sideMenuView').width())+'px, 0px, 0px)!important"></div>').appendTo('body');
			$('.tActiveBlocked').removeClass('tActiveBlocked');
			$('.tActive').addClass('tActiveBlocked');
			this.render();
		}else{
			this.closingView();
		}
	},

	closingView: function(){
		$('.sideMenuView').addClass("sideMenuClosed");
		window.setTimeout(function(){$('#b_appLayer').removeClass('sideMenuOpenBody')},800);
		$('.tActiveBlocked').attr('style', function(i, style){
			return '';
		});
		$('.overlay').empty().off().remove();
	},


	redirectToHomePage : function (e){
		this.toggleView();
		Um.dispatcher.trigger("navigate",{
			route 	: "app/home",
			trigger : true,
			replace	: false
		});
	},

	logoutAndRedirect : function (e){
		if (this.currentSession != undefined && this.currentSession.get('Id') != ""){
			Um.dispatcher.trigger("logout");
		}
		return false;
	},

	login: function(e){
		Um.dispatcher.trigger("loginLaunch","login");
		e.stopImmediatePropagation();
		return false;
	},

	sessionAction: function (e){
		if (this.currentSession != undefined && this.currentSession.get('Id') != ""){
			Um.dispatcher.trigger("navigate",{
	            route   : "app/profile/"+this.currentSession.get('Id')+"/",
	            trigger : true,
	            replace : false
	        });
		}else{
			Um.dispatcher.trigger("loginLaunch","login");
		}
		this.closingView();
	},

	renderUserSection : function(){
		if (this.canUseProfile){
			if (this.currentSession != undefined && this.currentSession.get('Id') != ""){
				userSection = _.template($('#sideLogged_tpl').html());
			}else{
				this.$el.find('#b_logoutLink').remove();
				userSection = _.template($('#sideNonLogged_tpl').html());
			}
			//render Section
			this.$el.find('#b_sideMenu #b_userSection').html(userSection(this.currentSession.toJSON()));
		}else{
			//remove Section
			this.$el.find('#b_userSection').remove();
			this.$el.find('#b_logoutLink').remove();
		}


	},

	buildHistoricalQA : function(){

		var c = Um.cookies.getItem(this.cookieName);
		//cookieData = this.utils.readCookie(this.cookieName);
		if (c  != null ) {
			//fake cookie dataa
			var cookieData = JSON.parse(c);//
			idArray = new Object();
			_.each(cookieData,function(item){
				idArray[item.id] = null;
			},this);

			Um.dispatcher.trigger("getSideMenuCommunitiesViews",idArray);
		}
	},

	renderCommunities : function (data){
		this.$el.find("#b_visitedHistory").empty();
		_.each(data,function(item){
			if (item != null){
				this.$el.find("#b_visitedHistory").append( item.renderAsSideBarItem().el );
				item.on("communityClicked",this.communityClicked,this);
			}
		},this);
		this.handleRecentlyViewedLabel();
	},


	//populate KAV history
	buildHistoricalKAV : function(){
		this.cookieName = 'UM_KAV';
		var cookieData = Um.cookies.getItem(this.cookieName);
		kavTpl = _.template($('#kavSideBar_tpl').html());//
		if (cookieData  != null ) {
			kavList = JSON.parse(cookieData);
			var self = this;
			_.each(kavList, function (i,e){
				i.title =  decodeURIComponent(i.title);
				self.$el.find("#b_visitedHistory").append( kavTpl(i) );
			});
			this.handleRecentlyViewedLabel();
		}

	},

	handleRecentlyViewedLabel : function(){

		if (this.$el.find("#b_visitedHistory li").size() > 0 ){
			this.$el.find("#b_recentlyViewed").show();
		}else{
			this.$el.find("#b_recentlyViewed").hide()
		}
	},

	/* add history mark */

	updateHistoryTrack : function (comModel){
		var MAX_HISTORY_ITEMS = 3;
		var communityId = comModel.get("id");

		var c = Um.cookies.getItem(this.cookieName);
        var value = '';

 		var data ;
        if ( c !== null ){
            var tmpData = _.toArray(JSON.parse(c));

			data =  new Array();
			_.each(tmpData,function(item,e){
				if (item.id!=communityId) data.push(item);
			});

        }
        else
            data = new Array();

		data.push({id: communityId});

        if (_.size(data) > MAX_HISTORY_ITEMS)
				data = _.rest(data,1);


		var path = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
        var domain = "."+document.location.host;
        Um.cookies.setItem(this.cookieName,JSON.stringify(data),null,path,domain,null);
	},


	updateKAVHistoryTrack : function (kavModel){
		var MAX_HISTORY_ITEMS = 3;

		var c = Um.cookies.getItem("UM_KAV");
        var data ;
        if ( c !== null )
            data = _.toArray(JSON.parse(c));
        else
            data = new Array();
        //add
        skip = false;
        _.each(data, function (item,e){
            if (item.id ==kavModel.get('KnowledgeArticleId')) skip = true;
        });
        if (skip) return;

		var tmpTitle = encodeURIComponent(_.escape(kavModel.get('Title')));
		data.push({id: kavModel.get('KnowledgeArticleId') , title : tmpTitle });

		if (_.size(data) > MAX_HISTORY_ITEMS)
				data = _.rest(data,1);

        var path = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
        var domain = "."+document.location.host;
        var dataStr = JSON.stringify(data);
        Um.cookies.setItem("UM_KAV",dataStr,null,path,domain,null);

	},


	communityClicked : function (community){
		this.toggleView();
		Um.dispatcher.trigger("navigate",{
				route 	: "app/zone/"+community.get('id'),
				trigger : true,
				replace	: false
		});
	}
});
return SideMenuView;
});
