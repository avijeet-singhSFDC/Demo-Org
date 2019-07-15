define([
    'jquery',
    'underscore',
    'backbone'
    ], function($, _, Backbone ){

    var fMenuItem = Backbone.View.extend({

  template: _.template($('#template-filterItem').html()),

        tagName : 'article',

        initialize: function() {
            this.parent = this.options.parent;
            this.childs = [];
            if ( this.model.childs == undefined ) this.model.childs = [];
            if ( this.model.childs.length > 0 ){
                for ( var i=0; i<this.model.childs.length;i++ ){
                    var mItemView = new fMenuItem( { model : this.model.childs[i], parent : this.parent } );
                    this.childs.push(mItemView);
                }
            }
            this.viewState = 'collapsed';
            this.selected = false;
            if ( this.model.name == undefined ) this.model.name = "NoFilter";
        },

        render: function(){
            this.$el.empty().off();
            this.$el.html(this.template( _.extend(this.model,{ viewState : this.viewState, selected : this.selected }) ));
            var self = this;
            this.$el.find('div:first').click(function(e){
                self.itemclick(e);
            });
            var childsContainer = this.$el.find('.childs');
            for ( var i=0; i<this.childs.length;i++ ){
                childsContainer.append( this.childs[i].render().el );
            }
            return this;
        },

        checkAndMark: function(nodeData){
            if (nodeData == undefined) return this;
            if ( nodeData.dataCategory == undefined && this.model.name == "NoFilter" ) return this;
            if ( this.model.name == nodeData.dataCategory){
                this.viewState = 'expanded';
                this.render();
                return this;
            }else{
                if ( this.childs.length > 0 ){
                    for ( var i=0; i<this.childs.length; i++ ){
                        var ret = this.childs[i].checkAndMark(nodeData);
                        if ( ret != false ){
                            this.viewState = 'expanded';
                            this.render();
                            return ret;
                        }
                    }
                }else{
                    return false;
                }
            }
            return false;
        },

        itemclick: function(e){
            this.viewState = this.viewState == 'collapsed' ? 'expanded' : 'collapsed';
            var reselectedItem = this.$el.find("div:first").hasClass("checkMark");
            this.render();

            //Define if its a check or uncheck
            if ( reselectedItem ){
                //it's an uncheck
                $('#b_categoriesOptions').find('.checkMark').removeClass('checkMark');
                Um.dispatcher.trigger('updateFilter',"");
                this.updateFilterTitle();
            }else{
                $('#b_categoriesOptions').find('.checkMark').removeClass('checkMark');
                this.$el.find('div:first').addClass('checkMark');
                Um.dispatcher.trigger('updateFilter',this.model.rootPath);
                this.updateFilterTitle(this.model.label);
            }
        },

        updateFilterTitle: function(label){
            var value = $('#b_filterTitle').text();
            label = label === undefined ? "all" : label;
            value = (value.split(":")[0])+": "+label;
            $('#b_filterTitle').text(value);
        }

    });

    return fMenuItem;
});
