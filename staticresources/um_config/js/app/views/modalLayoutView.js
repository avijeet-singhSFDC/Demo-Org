define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalLayout.html",
        "bootstrap",
        "jquery.jqueryui"], function($, _, backbone, utils, tmpl){

    var ModalLayoutView = Backbone.View.extend({

        className: 'lContainer',

        initialize: function(args){
            this.model = args.model;
            this.availableTypes = [];
            this.allFields = [];
        },

        renderNew: function(){
            this.data = { Id: (new Date()).getTime().toString(),
                          apiName__c: "",
                          layout__c: "",
                          umSite_id__c: ""
            };
            this.render();
        },

        renderEdit: function(data){
            this.data = data;
            this.render();
        },

        render: function(){
            var self = this;
            umCustomSettingController.getKAStructure(function(data,result){
                self.undelegateEvents();
                self.resolveData(data);
                var template = _.template(tmpl);
                $('#appContext').append( template({
                    types : self.availableTypes
                }));
                $('#modalLayout').modal("show");
                $('#modalLayout').on('hidden',function(e){
                    $(e.currentTarget).empty().off().remove();
                    $('.lContainer').empty().off().remove();
                });
                $('#typesAvailable .liClickableKa').click(function(e){
                    $('.liClickableKa').removeClass("typeSelected");
                    $(e.currentTarget).addClass("typeSelected");
                    self.populateFields($(e.currentTarget).attr("data-id"));
                });

                $('#done').click(function(){ self.saveChanges() });

                _.each($('#typesAvailable .liClickableKa'),function(item){
                    if ( $(item).attr("data-id") == self.selectedType ){
                        $(item).addClass("typeSelected");
                        self.populateFields($(item).attr("data-id"));
                    }else{
                        $(item).removeClass("typeSelected");
                    }
                },this);
                self.delegateEvents();
            });
            return this;
        },

        resolveData: function(data){
            this.allFields = [];
            if ( typeof data == "string"){
                this.availableTypes = [];
            }else{
                this.selectedFields = this.getSelectedFieldsFromData();
                this.availableTypes = [];
                _.each(data,function(value,key){
                    this.availableTypes.push(key);
                    this.allFields.push({ apiName__c : key, fields : value });
                },this);
            }
            this.selectedType = this.data.apiName__c.length == 0 ? this.availableTypes[0].apiName__c : this.data.apiName__c;
        },

        getSelectedFieldsFromData: function(){
            var ret = this.data.layout__c.split(",");
            return ret.length > 0 ? ret : [];
        },

        populateFields: function(kApiName){
            var fields = (_.where(this.allFields, { apiName__c : kApiName }));
            var fieldsArray = fields[0].fields;
            var fieldsSelected = this.getSelectedFieldsFromData();
            if ( this.data.apiName__c == kApiName && fieldsSelected.length > 0){
                fieldsArray = _.filter(fieldsArray,function(f){
                    var ret = true;
                    for( var i=0;i<fieldsSelected.length;i++ ){
                        var fS = fieldsSelected[i];
                        if ( f == fS ){
                            ret = false;
                            break;
                        }
                    }
                    return ret;
                },this);
            }

            var lAvailable = $('#layoutAvailable'); lAvailable.empty().off();
            fieldsArray.sort();
            _.each(fieldsArray,function(f){
                lAvailable.append('<li data-id="'+f+'" class="liClickableKa">'+f+'</li>');
            },this);
            var lSelected = $('#layoutSelected'); lSelected.empty().off();
            if (kApiName == this.selectedType){
                _.each(fieldsSelected,function(f){
                    lSelected.append('<li data-id="'+f+'" class="liClickableKa">'+f+'</li>');
                },this);
            }
            $( "#layoutAvailable, #layoutSelected" ).sortable({connectWith: ".connectedSortable"}).disableSelection();$( "#layoutAvailable, #layoutSelected" ).sortable('destroy');$( "#layoutAvailable, #layoutSelected" ).sortable({connectWith: ".connectedSortable"}).disableSelection();
        },

        saveChanges: function(){
            itemsArray = [];
            _.each($('#layoutSelected li'),function(item){
                itemsArray.push($(item).attr("data-id"));
            },this);
            var layout = itemsArray.join(",");
            var apiName = $('.typeSelected').attr("data-id");
            if ( this.validateData(layout,apiName) == true ){
                this.data.layout__c = layout;
                this.data.apiName__c = apiName;

                var items = this.model.get("KAStructure");
                var isNew = true;
                for (var i=0;i<items.length;i++){
                    var item = items[i];
                    if ( item.Id == this.data.Id ){
                        isNew = false;
                        break;
                    }
                }
                if ( isNew == true ){
                    if ( typeof(this.model.get("KAStructure")) == 'string' ) this.model.set({ 'KAStructure' : [] });
                    (this.model.get("KAStructure")).push(this.data);
                }
                $('#modalLayout').modal("hide");
                Backbone.Events.trigger("reloadTab","kTab");
            }
        },

        validateData: function(layout,apiname){
            $("#modalLayoutError").hide();
            if ( layout.length == 0 ){
                $("#modalLayoutError").text("Select at least one field.").fadeIn();
                return false;
            }
            //check apiName that doesnt exist
            var structure = this.model.get("KAStructure");
            for (var i=0;i<structure.length;i++){
                var elm = structure[i];
                if ( elm.apiName__c == apiname && elm.Id != this.data.Id && elm.delete == undefined){
                    $("#modalLayoutError").text("The selected article type already exist.").fadeIn();
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
    return ModalLayoutView;
});