define(["jquery",
        "underscore",
        "backbone",
        "Views/SearchResultsView",
        "Utils/cam_Utils","jQCookie"], function($,_,Backbone, searchResultsView,utilsObj){

var SearchView = Backbone.View.extend({

	el: ".searchPageView",

    utils: new utilsObj,

	template: _.template($('#searchPage_tpl').html()),

	initialize: function(){

		this.community = this.options.community;
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');

		if (this.options.searchStr != undefined)
			this.searchStr = _.unescape(this.options.searchStr);
		this.storeData = [];
		this.defaultResultTab = this.options.selTab;
		this.setDispatcherEvents();
		this.render();
		/* while there is no search string display popularItems*/
		if (this.isValidString(this.searchStr)){
			var resultsView = new searchResultsView({ 	community : this.community ,
														searchStr : this.searchStr ,
														selTab : this.defaultResultTab
													});
		}
		this.getCurrentSession();
	},

	setDispatcherEvents: function(){
		Um.dispatcher.bind("currentSessionDetails",this.buildFromSession,this);
	},

	events: {
		"click .topLeftCancelIconWrapper"	: "cancelSearch",
		"click #b_searchAction"			: "searchAction",
		"click #b_communityDetail"		: "selectZone",
		"keyup #b_searchInput"			: "checkSearch",
        "focusin #b_searchInput" 		: "hideSearchHistory",
        "focusout #b_searchInput" 		: "showSearchHistory",
		"click .prevSearchItem"			: "populateSearch"
	},

	render: function(){
		this.undelegateEvents();
		Backbone.Events.trigger("doTransition",this.$el);

		var displayArrowIcon = (Um.modules.getSingleCommunity() == null);
		this.$el.html(this.template({
			community: this.community.get('publicName'),
			communitySearchLabel : this.community.get('searchBannerLabel__c'),
			canUseQuestions : this.canUseQuestions,
			showCommunitySelector : displayArrowIcon }));

		$('#b_searchInput').val(this.searchStr );
		this.delegateEvents();

		$("form#searchForm").bind("keypress", function (e) {
			if ( e.keyCode == 13 ) return false;
		});
		this.enableSearchBtn();
        return this;
	},


	getCurrentSession : function (){
			Um.dispatcher.trigger("getCurrentUser",{
		        instance : this,
		        method : "showPreviousSearches"
		    });
	},

	isValidString : function (qStr){

		qStr = $('#b_searchInput').val();
		if (qStr == undefined) return false;
		qStr = $.trim(qStr);

		return (qStr.length >= 3 && qStr.length <= 250);
	},

    enableSearchBtn : function(){

        if ( this.isValidString() )
            this.$el.find('#b_searchAction').removeClass('disabled');
        else
            this.$el.find('#b_searchAction').addClass('disabled');
    },


	/** PreviousSearches **/

	hideSearchHistory : function(e){
		if (this.searchStr == undefined ||  this.searchStr == '')
			this.$el.find('#b_searchBody').hide();

		this.enableSearchBtn();
	},

	showSearchHistory : function(e){
		if ( (this.searchStr == undefined || this.searchStr != ''))
			this.$el.find('#b_searchBody').show();

		this.enableSearchBtn();
	},

	showPreviousSearches: function(data){
		if (typeof data != "object") return;
		this.currentSession = data;

		this.cookieName = data.get('COOKIE_SEARCH')+'_'+this.community.get('id');


		var c = Um.cookies.getItem(this.cookieName);
        var data ;
        if ( c !== null ){
            this.storeData = _.toArray(JSON.parse(c));

    		//only display previous searches if there is no search string
			if ( !this.isValidString() && _.size(this.storeData) > 0 ){
				previousTPL = _.template($('#searchPreviousView_tpl').html());
				this.$el.find('#b_searchBody').html(previousTPL());
				var container = this.$el.find('#b_previusItemsList').empty().off();
				resultItem = _.template($("#searchPreviousItems_tpl").html());

				_.each(this.storeData, function (token,e){
					if (token != undefined)	 {
						domElem = container.append(resultItem());
						token = decodeURIComponent(token);
						$(domElem).find('.prevSearchItem:last').text(_.unescape(token));

					}
				});

			}
        }
        else
            this.storeData = new Array();

        if (this.isValidString())
			this.updateHistoryTrack(this.searchStr);


	},

	updateHistoryTrack : function (qstr){

		MAX_HISTORY_ITEMS = 5;
		qstr = encodeURIComponent(qstr);
		//check if this string is not already in the array
		if (_.indexOf(this.storeData, qstr ) == -1 ){
			this.storeData.push(qstr);
			if (_.size(this.storeData) > MAX_HISTORY_ITEMS)
				this.storeData = _.rest(this.storeData,1);
		}
		//store cookie
		//convert array to object
		objectDAta = _.object(_.range(MAX_HISTORY_ITEMS), this.storeData) ;
		//$.cookie(this.cookieName, JSON.stringify(objectDAta));

        var path = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
        var domain = "."+document.location.host;
        var dataStr = JSON.stringify(objectDAta);
        Um.cookies.setItem(this.cookieName,dataStr,null,path,domain,null);

	},

	populateSearch : function (e){
        e.preventDefault();
        e.stopPropagation();
        $('#b_searchInput').val($(e.currentTarget).text());
        $('#b_searchInput').focus();
	},

	cancelSearch: function (){
		window.history.back();
	},

	selectZone: function (){
		if (Um.modules.getSingleCommunity() == null){
			Um.dispatcher.trigger("navigate",{
				route 	: "app/zoneSelection",
				trigger : true,
				replace	: false
			});

	        Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClicked");
		}

	},

	checkSearch:  function(e){
		e.stopImmediatePropagation();

		this.enableSearchBtn();

		if ( e.keyCode == 32 || e.keyCode == 8 ) return;
		if ( e.keyCode == 13 ){ this.searchAction(e); return; }

	},

	searchAction: function (){

		if (this.$el.find('#b_searchAction').hasClass('disabled')) return;

		if (this.validateSearch()){
			str = $.trim($('#b_searchInput').val());
			this.updateHistoryTrack(str);
			cId = -1;
			defaultTab = 'a';
			if (this.community != undefined){
				cId =this.community.get('id');
				defaultTab = 'q';
			}
			Um.dispatcher.trigger("navigate",{
				route 	: "app/search/"+cId+"/"+defaultTab+"/"+_.escape(str),
				trigger : true,
				replace	: true
			});

		}else{

		}
	},

	validateSearch: function (){
		ok = true;
		if (!this.isValidString()){
			msg = 'The search string length is invalid';
			ok = false;
		}
		/*
		//check length
		qStrLength = $.trim($('#b_searchInput').val()).length;
		if (qStrLength > 250){
			msg = 'Maximun length is 250 chars';
			ok = false;
		}

		*/
		if (!ok){
			alert(msg);
			Um.dispatcher.trigger("errorPromt",msg);
		}

		return ok;
	},

    communityClicked : function (communityId){

        Um.dispatcher.trigger("navigate",{
            route     : "app/search/"+communityId.get('id'),
            trigger : true,
            replace    : true
        });

    }
});
return SearchView;
});
