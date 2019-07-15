define(["jquery",
        "underscore",
        "backbone",
        "Collections/Questions",
        "Views/QuestionView",
        "Views/CaseView",
        "Models/Case",
        "Views/ListSelectionView"], function($,_,Backbone,Questions,QuestionView,CaseView, CaseModel,listSelection){

var ProfileQListView = Backbone.View.extend({

	el: ".profileQuestionsListView",

	initialize: function(){
		this.profileIsMine = false;
		this.community = this.options.community;
		this.authorId = this.options.profileId;
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.typeOf = 'public';
		this.filterValues = [];

        this.getCurrentSession();
		this.setEvents();

	},

	setEvents: function(){

        Um.dispatcher.bind("currentSessionDetails",this.buildFromSession,this);

		if (this.canUseQuestions){
			this.bind("getQuestions",this.getQuestionsCallback,this);
			this.bind("sendQuestionsCol",this.getQuestionsReady,this);
			this.bind("sendFullQuestionsCol",this.getFullQuestionsReady,this);
		}

		Um.dispatcher.bind("updateProfileListFilter",this.applySelection,this);
	},

	events: {
		"click .topLeftBarArrowWrapper" 		: "backButtonClick",
		"click #b_loadMore"  		: "loadMore",
		"click #b_allQuestions"		: "printAllQuestions",
        "click #b_askFooterBtn"     : "startAskFlow"

	},

	render: function(){
		this.$el.empty().off();
		this.undelegateEvents();
		this.template = _.template($('#profileQuestionsListsPage_tpl').html());

		Backbone.Events.trigger("doTransition",this.$el);

		this.$el.html(this.template({profileIsMine : this.profileIsMine  }));


		if (this.listSelection != undefined){
			this.listSelection.setElement(this.$el.find('#b_questionListFilters'));
			this.listSelection.render();
			this.$el.find('#b_selFilterText').html('Public');
		}

		this.delegateEvents();
		if (this.canUseQuestions){
			this.questions = new Questions([]);
		}

		this.printAllQuestions();

		//add Ask Footer Section
        if (Um.modules.canAccess('Questions')){
            askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
            this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
        }

        //Triger footer
        //Um.dispatcher.trigger("launchContactFooter");

		return this;
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
        	this.profileIsMine = (this.currentSession.get('Id') == this.authorId);

	        if (this.profileIsMine) {

	        	this.listSelection = new listSelection({ 	listOptions : {'public' : 'public', 'private' : 'private'} ,
												selOption : this.selOption
										});
	        }
        }
    },


	/** filter methods **/

	applySelection : function (newStatus){

	 	if ( _.contains( {'public' : 'public', 'private' : 'private' , 'All':"All"},newStatus)){

	        this.typeOf = newStatus;

			if (this.questions == undefined){
				this.questions = new Questions([]);
			}

			this.questions.sortBy = this.sortBy;
			this.questions.offset = 0;
			this.printAllQuestions();
	 	}

   },

	backButtonClick: function(){
		window.history.back();
	},

	loadMore: function(){
		this.printAllQuestions();
	},

	/**
		  Questions methods
	**/
	getQuestionsCallback: function(){
		var questions = new Questions([]);
		if (typeof this.community == 'object')
		questions.fetchAllUserQuestions(this.community.get('id'),this.authorId , this.typeOf,this,"sendQuestionsCol");
	},

	getQuestionsReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new QuestionView({ model : item}) );
		},this);
		this.trigger("sendProfileQuestionsViews",ret);
	},

	getFullQuestionsReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			if (this.typeOf =='public')
				ret.push( new QuestionView({ model : item }) );
			else{
				caseModel = new CaseModel();
				caseModel.set(item.attributes);
				ret.push( new CaseView({ model : caseModel }) );
			}
		},this);
		var container = $('<div/>');
		_.each(ret,function(item){
			container.append(item.renderSmall(true).el);
		},this);
		container = $(container).find("li");
		this.$el.find('#b_loadMore').hide();
		$(container).hide();
		var cont = this.$el.find('#b_listOfElements');
		$(cont).empty().off();
		$(cont).append($(container));

		if (collection.hasMore)
			this.$el.find('#b_loadMore').show();

		//display total
		this.$el.find('#b_selFilterTotal').html('('+collection.filterByTotal+')');

		$(container).fadeIn();
	},

    startAskFlow : function (){
        console.log('Start Ask Flow');

        Um.dispatcher.trigger("navigate",{
                    route   : "app/zoneSelection",
                    trigger : true,
                    replace : false
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

	printAllQuestions: function(){
		if (typeof this.community == 'object')
		this.questions.fetchAllUserQuestions(this.community.get('id'),this.authorId, this.typeOf, this,"sendFullQuestionsCol");
	}

});
return ProfileQListView;
});
