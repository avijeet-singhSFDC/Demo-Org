define(["jquery",
        "underscore",
        "backbone",
        "Collections/Communities",
        "Views/CommunityView"], function($,_,Backbone,Communities,CommunityView){

var CommunitySelectionPageView = Backbone.View.extend({

	el: ".zoneSelectionView",

	events:{
		"click .topLeftBarArrowWrapper" : "navigateBack"
	},

	initialize: function(args){
        //Getting all Communities
		this.communities = new Communities();
		//Building communities views collection(array)
		this.communitiesViews = this.buildCommunitiesViews(this.communities.models);
		this.setDispatcherEvents();
		//Subscribers Array to notificate clicked elements
		this.subscribers = [];
	},

	setDispatcherEvents: function(){
		//central dispatcher bindings
		Um.dispatcher.bind("getCommunitiesCollectionViews",this.returnCommunitiesCollectionViews,this);
		Um.dispatcher.bind("getSideMenuCommunitiesViews",this.returnSideMenuCommunityListDetails,this);
		Um.dispatcher.bind("sendCommunitiesPublicName",this.renderDataComplete,this);
		Um.dispatcher.bind("getSingleCommunity",this.returnSingleCommunity,this);
		Um.dispatcher.bind("getCommunityModel",this.returnCommunityModel,this);
		//add subscriber
		Um.dispatcher.bind("listenCommunityClick",this.addSubscriber,this);
	},

	buildCommunitiesViews: function(collection){
		var ret = [];
		rejectPKB = Um.modules.canAccess('Questions');
		_.each(collection,function(itemModel){
			if (rejectPKB && (itemModel.get('id') != "-1") )
				ret.push( new  CommunityView({model: itemModel}) );
		},this);
		return ret;
	},

	returnCommunitiesCollectionViews: function(){
		Um.dispatcher.trigger("sendCommunitiesCollectionViews",this.buildCommunitiesViews(this.communities.models));
	},

	returnSideMenuCommunityListDetails: function(idList){
		if (Um.modules.getSingleCommunity() == null){
			_.each(this.communities.models,function(itemModel){
				if ((typeof idList[itemModel.id]) !=  'undefined')
				idList[itemModel.id] = new  CommunityView({model: itemModel});
			},this);
		}
		Um.dispatcher.trigger("sendSideMenuCommunityListDetails",idList);
	},

	returnSingleCommunity: function(obj){
		idCommunity = (typeof obj != 'object') ? obj : obj.idCommunity;
		var ret = undefined;
		_.each(this.communities.models,function(itemModel){
			if ( idCommunity == itemModel.get("id") ) ret = itemModel;
		},this);
		if (typeof obj != 'object'){
			Um.dispatcher.trigger("sendSingleCommunity",ret);
		}else{
			fullRet = _.extend({community : ret}, obj.opDetails);
			obj.instance[''+obj.method+''](fullRet);
		}


	},

	render: function(){
		this.undelegateEvents();
		Um.dispatcher.trigger("getCommunitiesPublicName");
	},

	renderDataComplete: function(communitiesPublicName){
		this.template = _.template($('#zoneSelectionPage_tpl').html());
		var content = $('<div/>').append(this.template());
		_.each(this.communitiesViews,function(item){
			item.off();
			item.on("communityClicked",this.communityClicked,this);
			$(content).find("#communitiesContainer").append( item.render().el );
		},this);
		//Printing message
		var elm = $(content).find('#b_zoneTitle');
		var val = elm.text();

		if (communitiesPublicName.match(/^[aeiou]/)){
			val = val.replace("YYY",'an');
		}else{
			val = val.replace("YYY",'a');
		};

		val = val.replace("XXXXX",communitiesPublicName);

		elm.text(val);
		Backbone.Events.trigger("doTransition",this.$el);
		this.$el.html(content);
		this.delegateEvents();
	},

	communityClicked: function(community){
		if ( this.subscribers.length > 0 ){
			_.each(this.subscribers,function(obj){
				obj.instance[''+obj.method+''](community);
			},this);
			//remove subscribers
			this.subscribers = [];
		}else{
			Um.dispatcher.trigger("navigate",{
				route 	: "app/zone/"+community.get('id'),
				trigger : true,
				replace	: false
			});
		}
	},

	navigateBack: function(){
		window.history.back();
	},

	addSubscriber: function(item, callTo){
		this.subscribers.push({instance: item, method : callTo});
	}

});
return CommunitySelectionPageView;
});
