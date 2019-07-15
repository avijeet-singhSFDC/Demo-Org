define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalZoneTemplate.html",
        "bootstrap"], function($, _, backbone, utils, tmpl){

    var ModalCaView = Backbone.View.extend({

        events: {
            "click #done" : "saveData"
        },

        initialize: function(args){
            this.zone = args.zone;
            this.coms = args.coms;
        },

        render: function(){
            var self = this;
            var template = _.template(tmpl);
            this.$el.append( template({ z : this.zone, coms: this.coms }) );
            return this;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        },

        saveData: function(){
                this.validate();
        },

        saveDataCallback: function(){
            this.zone.announcements__c = $('#announcements__c').prop("checked");
            this.zone.announcementsKaId__c = $.trim($('#announcementsKaId__c').val());
            this.zone.backgroundColor__c = $.trim($('#backgroundColor__c').val()).length > 0 ? $.trim($('#backgroundColor__c').val()) : "";
            this.zone.backgroundImage__c = $.trim($('#backgroundImage__c').val()).length > 0 ? $.trim($('#backgroundImage__c').val()) : "";
            this.zone.dataCategory__c = $.trim($('#dataCategory__c').val());
            this.zone.publicName__c = $.trim($('#publicName__c').val());
            this.zone.searchBannerLabel__c = $.trim($('#searchBannerLabel__c').val());
            this.zone.zone__c = $('#zoneSelect').val();
            this.zone.iconImage__c = $.trim($('#iconImage__c').val());
            this.zone.zoneDescription__c = "";//$.trim($('#zoneDescription__c').val()); #863
            $('#modalZone').modal('hide');
            this.trigger('elementSaved',this.zone);
        },

        validate: function(){
            //First of all let's validate the data category selected for this zone
            var group, dc;
            dc = $.trim($('#dataCategory__c').val());
            dc = dc.indexOf("__c") == -1 ? dc+"__c" : dc;
            group = $.trim($('#umChatterAnswers_dataCategoryGroup__c').val());
            group = group.indexOf("__c") == -1 ? group+"__c" : group;
            var a = {
                group : group,
                dc : dc
            };
            var self = this;
            umCustomSettingController.verifyDc(JSON.stringify(a),function(e,r){
                if (e.isSuccess == true){
                    self.validateCallback();
                }else{
                    var errContainer = self.$el.find('#err'); errContainer.hide();
                    errContainer.show().text("Either your Chatter Answers Data Category Group or your Zone Data Category seems to be invalid.");
                }
            });
        },

        validateCallback: function(){
            var errContainer = this.$el.find('#err'); errContainer.hide();
            var anouncements = $('#announcements__c').prop("checked");
            var articlenumber = $.trim($('#announcementsKaId__c').val());
            if ( anouncements == true && articlenumber.length < 1 ){
                errContainer.show().text("If announcements is enabled an article number must be provided.");
                return false;
            }
            var bColor = $.trim($('#backgroundColor__c').val());
            var bImage = $.trim($('#backgroundImage__c').val());
            if ( bColor.length < 1 && bImage < 1){
                errContainer.show().text("Background color or background image must be provided.");
                return false;
            }
            var dc = $.trim($('#dataCategory__c').val());
            var pn = $.trim($('#publicName__c').val());
            var sbl = $.trim($('#searchBannerLabel__c').val());
            if (dc.length < 1 || pn.length < 1 || sbl.length < 1){
                errContainer.show().text("A data category, public name and search banner label must be provided.");
                return false;
            }
            var z = $('#zoneSelect').val();
            if (z.length != 18){
                errContainer.show().text("No zone selected, mobile zone cannot be created without a zone related.");
                return false;
            }
            this.saveDataCallback();
        }
    });
    return ModalCaView;
});
