define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalKaDcTemplate.html",
        "bootstrap",
        "jquery.jqueryui"], function($, _, backbone, utils, tmpl){

    var ModalKaDC = Backbone.View.extend({

        className: 'kadcContainer',

        initialize: function(args){
            this.model = args.model;
        },

        renderNew: function(){
            this.data = { Id: (new Date()).getTime().toString(),
                          dataCategoryGroup__c: "",
                          dataCategory__c: "",
                          umSite_id__c: "",
                          publicName__c: ""
            };
            this.render();
        },

        renderEdit: function(data){
            this.data = data;
            this.render();
        },

        render: function(){
            var self = this;
            this.undelegateEvents();
            var template = _.template(tmpl);
            $('#appContext').append( template({
                data : this.data
            }));
            this.delegateEvents();
            $('#modalKaDC').modal("show");
            $('#modalKaDC').on('hidden',function(e){
                $(e.currentTarget).empty().off().remove();
                $('.kadcContainer').empty().off().remove();
            });
            $('#done').click(function(){ self.saveChanges() });
            return this;
        },

        saveChanges: function(){
            var group = $.trim($('#dataCategoryGroup__c').val());
            group = group.indexOf("__c") == -1 ? group+"__c" : group;
            var dc = $.trim($('#dataCategory__c').val());
            dc = dc.indexOf("__c") == -1 ? dc+"__c" : dc;
            var a = {
                group : group,
                dc : dc
            };
            var self = this;
            umCustomSettingController.verifyDc(JSON.stringify(a),function(e,r){
                if (e.isSuccess == true){
                    self.saveChangesCallback();
                }else{
                    var errContainer = $('#err'); errContainer.hide();
                    errContainer.show().text("Data Category Group or your Data Category Api Name seems to be invalid.");
                }
            });
        },

        saveChangesCallback: function(){
            var group = $.trim($('#dataCategoryGroup__c').val());
            var dc = $.trim($('#dataCategory__c').val());
            var publicName = $.trim($('#publicName__c').val());
            if ( this.validateData(group,dc,publicName) == true ){
                this.data.dataCategoryGroup__c = group;
                this.data.dataCategory__c = dc;
                this.data.publicName__c = publicName;

                var items = this.model.get("KnowledgeBase");
                var isNew = true;
                for (var i=0;i<items.length;i++){
                    var item = items[i];
                    if ( item.Id == this.data.Id ){
                        isNew = false;
                        break;
                    }
                }
                if ( isNew == true ){
                    if ( typeof(this.model.get("KnowledgeBase")) == 'string' ) this.model.set({ 'KnowledgeBase' : [] });
                    (this.model.get("KnowledgeBase")).push(this.data);
                }
                $('#modalKaDC').modal("hide");
                Backbone.Events.trigger("reloadTab","kTab");
            }
        },

        validateData: function(group,dc,publicName){
            $("#err").hide();
            if ( group.length == 0 || dc.length == 0 || publicName.length == 0){
                $("#err").text("All fields are required.").fadeIn();
                return false;
            }
            //check apiName that doesnt exist
            var structure = this.model.get("KnowledgeBase");
            for (var i=0;i<structure.length;i++){
                var elm = structure[i];
                if ( elm.dataCategoryGroup__c == group && elm.dataCategory__c == dc
                        && elm.Id != this.data.Id && elm.delete == undefined){
                    $("#err").text("Data Category already exist.").fadeIn();
                    return false;
                }
            }
            return true;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
            Backbone.Events.off(null, null, this);
        }
    });
    return ModalKaDC;
});
