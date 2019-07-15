define(["jquery",
        "underscore",
        "backbone",
        "Views/filtersItem",
        "Views/filtersSortItem"], function($,_,Backbone,fItemView,filterSortItem){

var filtersView = Backbone.View.extend({

	el : "#b_filtersSection",

    localdata : {},

    initialize : function() {
		this.open = false;
		this.selection = {
			sort 	: '' ,
			topics :  ''
		};

		this.communityId = -1;
		if (this.options.topics != undefined){
			topics = this.options.topics;

		}else{
			topics = this.options.comm.get('topics');
			if (this.options.comm != undefined){
				this.community = this.options.comm;
				this.communityId = this.community.get('id');
			}
		}

      this.localdata = topics;

      if ( Um.modules.canAccess("Questions") ){
      	var a = {
      		childs: [],
      		depth: -1,
      		label: "Filter By",
      		name: "Filter By",
      		rootPath: ""
      	};
      	a.childs.push(this.localdata);
      	this.localdata = a;
      }

      this.fMenuItemViews = [];
      for ( var i=0; i<this.localdata.childs.length; i++ ){
  		var mItemView = new fItemView( { model : this.localdata.childs[i], parent : this } );
  		this.fMenuItemViews.push(mItemView);
  	  }
      this.render();
    },

    resolveSelectedValue: function(args){
    	var data = null;
    	if (args.filterBy != undefined && args.filterBy.length > 0){
    		var v = args.filterBy.replace("#","").split(":");
    		data = v[v.length-1];
    	}
    	var nodeData = { dataCategory : data };
    	var response = null;
    	for ( var i=0; i<this.fMenuItemViews.length;i++ ){
    		response = this.fMenuItemViews[i].checkAndMark(nodeData);
    		if (response != undefined && response != null && response != false) break;
    	}
    	if ( response != null && response != false ) response.$el.find('div:first').trigger('click');
    },

    render: function(){

       var template = _.template($('#filterItemRoot_tpl').html());
       //top level category when no value has been selected
       data = _.extend({},this.localdata ) ;

      if (  this.localdata.label != undefined &&
            window.rootRelations[this.localdata.label ] != undefined ) {
          rootLabel = window.rootRelations[this.localdata.label ];
          data = _.extend(data,{label :rootLabel } ) ;
      }
      this.$el.find('#b_categoriesOptions').append(template(data));

      for ( var i=0; i<this.fMenuItemViews.length;i++){
    		this.$el.find('#b_categoriesOptions').append(this.fMenuItemViews[i].render().el);
	  }
    },

    cleanup : function (){
      this.undelegateEvents();
      $(this.el).empty();
    },

	buildSortBy : function (buildFor){

		this.$el.find('#b_sortOptions').empty().off();

		if (buildFor =='a'){
			optionList = Um.modules.sortingFor('KB');
			if (optionList.indexOf(this.sortBy) == -1 )
				this.sortBy = 'sortBy_LAST_PUBLISHED';
		}else{
			optionList = Um.modules.sortingFor('Questions');
			if (optionList.indexOf(this.sortBy) == -1 )
				this.sortBy = 'sortBy_POPULARITY';
		}

		for ( var i=0; i<optionList.length;i++){
			fItem = new filterSortItem({ apiName:optionList[i],
									label:um_LANG.get(optionList[i]),
									sel : (this.sortBy == optionList[i]) ,
									selection : this.selection.sort,
									notifyTo : 'updateSort',
									onlyOne : true
									});
    		this.$el.find('#b_sortOptions').append(fItem.render().el);
		}
		this.undelegateEvents();
		this.delegateEvents();

	},

	show : function (args){

		Um.dispatcher.trigger("closeFilters");
		if (args.sortBy != undefined)
			this.sortBy = args.sortBy;
		this.buildSortBy(args.currentList);
		this.$el.show();
		this.resolveSelectedValue(args);
		this.open = true;
		if ($('#b_categoriesOptions').find(".checkMark").length>0){
			var label = $.trim($('#b_categoriesOptions').find(".checkMark span").text());
		  	var value = $('#b_filterTitle').text();
	        value = (value.split(":")[0])+": "+label;
	        $('#b_filterTitle').text(value);
	  	}else{
	  		var value = $('#b_filterTitle').text();
	        value = (value.split(":")[0])+": all";
	        $('#b_filterTitle').text(value);
	  	}
	},

	close : function (reload){
		this.open = false;
		this.$el.hide();
		if (reload){
			this.trigger('reloadLists');
			this.trigger('closedFiltersMenu');
		}
		$('#b_filters').removeClass("filtersIconOpen");
	}
});
return filtersView;
});
