define(["jquery",
        "underscore",
        "backbone",
        "Collections/Cases",
        "Views/CaseView",
        "Views/ListSelectionView"], function($,_,Backbone,Cases,CaseView,listSelection){

var ProfileCListView = Backbone.View.extend({

	el: ".profileCasesListView",

	initialize: function(){

		this.community = this.options.community;
		this.authorId = this.options.profileId;
        this.canUseCases = Um.modules.canAccess('ContactUS');
		this.selOption = '';
		this.filterValues = [];
		this.setEvents();
		this.listOptions = _.extend(Um.modules.sortingFor('Case'),{AllCases:"All"});
		this.listSelection = new listSelection({ listOptions : this.listOptions ,
	 												selOption : this.selOption
	 							});
	},

	setEvents: function(){

		if (this.canUseCases){
			this.bind("getCases",this.getCasesCallback,this);
			this.bind("sendCasesCol",this.getCasesReady,this);
			this.bind("sendFullCasesCol",this.getFullCasesReady,this);
		}
		Um.dispatcher.bind("updateProfileListFilter",this.applySelection,this);
	},

	events: {
		"click .topLeftBarArrowWrapper" 		: "backButtonClick",
		"click #b_loadMore"  		: "loadMore",
		"click #b_allCases"			: "printAllCases",
        "click #b_askFooterBtn"     : "startAskFlow"
	},

    startAskFlow : function (){

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
	render: function(){
		this.$el.empty().off();
		this.undelegateEvents();
		this.template = _.template($('#profileCasesListsPage_tpl').html());

		Backbone.Events.trigger("doTransition",this.$el);

		this.$el.html(this.template());
 		this.listSelection.setElement(this.$el.find('#b_caseListFilters'));

		this.delegateEvents();

		this.listSelection.render();
		this.$el.find('#b_selFilterText').html('All');

		if (this.canUseCases){
			this.cases = new Cases([]);
		}

		this.printAllCases();

		//add Ask Footer Section
        if (Um.modules.canAccess('Questions')){
            askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
            this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
        }

        //Triger footer
        //Um.dispatcher.trigger("launchContactFooter");

		return this;
	},

	/** filter methods **/

	applySelection : function (newStatus){


        //validate status string  _.contains(this.listOptions,newStatus)
        if ( _.contains(_.keys(this.listOptions), newStatus) ){

        	 this.selOption = newStatus;

			if (this.cases == undefined){
				this.cases = new Cases([]);
			}

			this.cases.filterBy = this.selOption;
			this.cases.offset = 0;
			this.printAllCases();
        }


   },



	backButtonClick: function(){
		window.history.back();
	},

	loadMore: function(){
		this.printAllCases();
	},

	/* Cases methods */

	getCasesCallback: function(){
		var cases = new Cases([]);
		//this.community.get('id')
		cases.fetchAllCases('-1',this.authorId, this,"sendCasesCol");
	},

	getCasesReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new CaseView({ model : item }) );
		},this);
		this.trigger("sendProfileCasesViews",ret);
	},

	getFullCasesReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new CaseView({ model : item}) );
		},this);
		var container = $('<div/>');
		_.each(ret,function(item){
			container.append(item.renderCaseSmall().el);
		},this);
		container = $(container).find("li");
		this.$el.find('#b_loadMore').hide();
		var cont = this.$el.find('#b_listOfElements');
		$(container).hide();
		$(cont).empty().off();
		$(cont).append(container);

		if (collection.hasMore)
			this.$el.find('#b_loadMore').show();

		//display total
		this.$el.find('#b_selFilterTotal').html('('+collection.filterByTotal+')');


		$(container).fadeIn();
	},

	printAllCases: function(){
		//this.community.get('id')
		this.cases.fetchAllCases('-1',this.authorId,this,"sendFullCasesCol");
	}


});
return ProfileCListView;
});
