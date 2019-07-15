define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/qandaTemplate.html",
        "app/views/modalCaView",
        "bootstrap"], function($, _, backbone, utils, tmpl, ModalCaView){

    var CaTabView = Backbone.View.extend({

        events:{
            "click #newZone" : "newZone"
        },

        initialize: function(args){
            this.setData(args);
        },

        setData: function(args){
            this.selectedSite = args.model;
            this.normalizeZones();
        },

        render: function(){
            this.undelegateEvents();
            var template = _.template(tmpl);
            if ( typeof(this.selectedSite.get("Zones")) != 'object' ) this.selectedSite.set({ Zones : [] });
            this.$el.append( template({ site : this.selectedSite }) );
            this.delegateEvents();
            var self = this;
            this.$el.find(".zoneTableViewEdit").click(function(e){
                e.stopImmediatePropagation();
                var id = $.trim($(e.currentTarget).attr("data-id"));
                var z = self.selectedSite.get("Zones");
                for (var i=0; i<z.length;i++){
                    if ( z[i].id == id ){
                        self.openModalZone(z[i]);
                        break;
                    }
                }
                return false;
            });
            this.$el.find(".zoneTableViewRemove").click(function(e){
                e.stopImmediatePropagation();
                //options.msg
                //options.instance
                //options.methodIfYes
                //options.methodIfNo
                //options.elementToRenderOver [with # if its id or . if its a class]
                //options.dataCallback [optional]
                utils.confirmDialog({
                    msg : "Are you sure?",
                    instance : self,
                    methodIfYes : "confirmedDeleteZone",
                    methodIfNo  : "cancelDeleteZone",
                    elementToRenderOver : e.currentTarget,
                    dataCallback : e
                });
                return false;
            });
            return this;
        },

        confirmedDeleteZone: function(e){
                var id = $.trim($(e.currentTarget).attr("data-id"));
                var z = this.selectedSite.get("Zones");
                for (var i=0; i<z.length;i++){
                    if ( z[i].id == id ){
                        z[i].delete = true;
                        break;
                    }
                }
                Backbone.Events.trigger("reloadTab","caTab");
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        },

        normalizeZones: function(){
            var z = typeof(this.selectedSite.get('Zones')) == 'string' ? [] : this.selectedSite.get('Zones');
            var normalized = [];
            _.each(z,function(item){
                var n = _.extend(this.defOpts(),item);
                normalized.push(n);
            },this);
            this.selectedSite.set({ Zones : normalized });
        },

        defOpts: function(){
            return {
                announcementsKaId__c: null,
                announcements__c: null,
                backgroundColor__c: null,
                backgroundImage__c: null,
                zoneDescription__c : null,
                iconImage__c : null,
                dataCategory__c: null,
                publicName__c: null,
                id: (new Date().getTime()).toString(),
                searchBannerLabel__c: null,
                totalArticles: null,
                totalQuestions: null,
                umSite_id__c: null,
                zone__c: null
            }
        },

        newZone: function(){
            var z = {
                announcements__c    : false,
                backgroundColor__c  : null,
                backgroundImage__c  : null,
                dataCategory__c     : null,
                id                  : (new Date().getTime()).toString(),
                publicName__c       : null,
                searchBannerLabel__c: null,
                umSite_id__c        : null,
                zone__c             : null,
                announcementsKaId__c: null
            };
            this.openModalZone(z);
        },

        openModalZone: function(target){
            var self=this;
            umCustomSettingController.getOrgZones(function(r){
                if ( self.modalZoneView != undefined ){
                    self.modalZoneView.off();
                    self.modalZoneView.cleanAll();
                }
                self.modalZoneView = new ModalCaView({zone:target,coms:r});
                self.modalZoneView.on("elementSaved",self.savedZone,self);
                self.$el.append(self.modalZoneView.render().el);
                $('#modalZone').modal('show');
                $('#modalZone').on('hidden',function(e){
                    $(e.currentTarget).empty().off().remove();
                });
            });
        },

        savedZone: function(elm){
            var exist = false;
            var z = this.selectedSite.get("Zones");
            for (var i=0; i<z.length;i++){
                var aux = z[i];
                if ( aux.id == elm.id ){
                    exist = true;
                    break;
                }
            }
            if (exist == false) this.selectedSite.get("Zones").push(elm);
            this.cleanAll();
            this.render();
        }
    });
    return CaTabView;
});