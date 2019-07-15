define(["jquery",
        "underscore",
        "backbone",
        "text!app/templates/knowledgeTemplate.html",
        "app/views/modalLayoutView",
        "app/views/modalKaDc",
        "bootstrap"],
        function($, _, backbone, tmpl, ModalLayoutView, ModalKaDC){
    var KaTabView = Backbone.View.extend({

        events: {
            "click #newKa" : "newKa",
            "click #newKaDc" : "newKaDc"
        },

        initialize: function(args){
            this.setData(args);
            this.modalLayoutView = new ModalLayoutView({ model : this.model });
            this.modalKaDC = new ModalKaDC({ model : this.model });
        },

        setData: function(args){
            this.model = args.model;
        },

        render: function(){
            var template = _.template(tmpl);
            var self = this;
            this.undelegateEvents();
            this.$el.empty().off().append(template({
                layouts : typeof this.model.get("KAStructure") == "string" ? [] : this.model.get("KAStructure"),
                kaStructure : typeof this.model.get("KnowledgeBase") == "string" ? [] : this.model.get("KnowledgeBase")}));
            this.delegateEvents();
            this.$el.find('.kaKnowledgeEdit').click(function(e){
                self.editKa($(e.currentTarget).attr("data-id"));
                return false;
            });
            this.$el.find('.kaKnowledgeRemove').click(function(e){
                self.removeKa($(e.currentTarget).attr("data-id"));
                return false;
            });
            this.$el.find('.kaDCKnowledgeEdit').click(function(e){
                self.editKaDC($(e.currentTarget).attr("data-id"));
                return false;
            });
            this.$el.find('.kaDCKnowledgeRemove').click(function(e){
                self.removeKaDC($(e.currentTarget).attr("data-id"));
                return false;
            });
            return this;
        },

        newKa: function(){
            this.modalLayoutView.renderNew();
        },

        newKaDc: function(){
            this.modalKaDC.renderNew();
        },

        editKa: function(id){
            for ( var i=0; i<this.model.get("KAStructure").length;i++ ){
                var elm = this.model.get("KAStructure")[i];
                if ( elm.Id == id ){
                    this.modalLayoutView.renderEdit(elm);
                    break;
                }
            }
        },

        removeKa: function(id){
            for ( var i=0; i<this.model.get("KAStructure").length;i++ ){
                var elm = this.model.get("KAStructure")[i];
                if ( elm.Id == id ){
                    elm.delete = true;
                    this.render();
                    break;
                }
            }
        },

        editKaDC: function(id){
            for ( var i=0; i<this.model.get("KnowledgeBase").length;i++ ){
                var elm = this.model.get("KnowledgeBase")[i];
                if ( elm.Id == id ){
                    this.modalKaDC.renderEdit(elm);
                    break;
                }
            }
        },

        removeKaDC: function(id){
            for ( var i=0; i<this.model.get("KnowledgeBase").length;i++ ){
                var elm = this.model.get("KnowledgeBase")[i];
                if ( elm.Id == id ){
                    elm.delete = true;
                    this.render();
                    break;
                }
            }
        },

        cleanAll: function(){
            this.$el.empty().off();
            if ( this.modalView != undefined ) this.modalView.cleanAll();
        }
    });
    return KaTabView;
});