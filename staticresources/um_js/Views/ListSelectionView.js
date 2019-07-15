define(["jquery",
        "underscore",
        "backbone"], function($,_,Backbone){

var listSelectionView = Backbone.View.extend({

	itemTpl : _.template($('#profileFiltersItem_tpl').html()),

	template : _.template($('#profileFilterContainer_tpl').html()),

	initialize: function(){

		this.listOptions = this.options.listOptions;
		this.selOption	= this.options.selOption;
		this.container		= this.options.container;
		this.setEvents();
	},

	setEvents: function(){
	},

	events: {
	},

	render: function(){
		this.$el.empty().off();
		this.$el.html( this.template());

		//add items

		//this.listOptions = _.sortBy(this.listOptions);
		var self = this;
		_.each(this.listOptions , function (e,i){

			node = self.itemTpl({ id: i,
							label:e,
							sel : (self.selOption == i )});
			self.$el.find('#b_FilterContainer').append(node);
			self.$el.find('.listSelectionItem:last').click(function(e){
               self.itemClick(e);
            });
		});

		self.$el.find('#b_selFilter').click(function(e){
			if (self.$el.find('#b_FilterContainer:visible').size() > 0 )
				self.hideOptions(e);
			else
               self.displayOptions(e);
        });

		return this;
	},

	itemClick : function (e){
		e.stopImmediatePropagation();
		if ( this.selOption == $(e.currentTarget).attr('id') ){
			this.hideOptions();
		}else{
			this.selOption  = $(e.currentTarget).attr('id');
			Um.dispatcher.trigger('updateProfileListFilter',$(e.currentTarget).attr('id'));
			this.$el.find('#b_selFilterText').html($(e.currentTarget).html());
			this.$el.find('#b_selFilterTotal').html('');
			this.hideOptions();
		}
	},

	hideOptions : function (){
		this.$el.find('.filterDropUp').removeClass('filterDropUp').addClass('filterDropDown');
		this.$el.find('#b_FilterContainer').hide();
	},

	displayOptions : function(){
		this.$el.find('.filterDropDown').removeClass('filterDropDown').addClass('filterDropUp');
		this.$el.find('#b_FilterContainer').show();
	}

});
return listSelectionView;
});
