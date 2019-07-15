define(["jquery",
        "underscore",
        "backbone",
        "Models/Community"], function($,_,Backbone,Community){


var Communities = Backbone.Collection.extend({
	model:Community,

	initialize: function(){
		this.fetch();
	},

	fetch: function(){
		if ( window.communityData != undefined ){
			_.each(window.communityData,function(item){
				var elm = new Community();
				elm.set(item);
				tList = _.filter(root.childs,function(el){
											return el.name==elm.get('dataCategory__c');},
											this);
				elm.set('topics', tList[0]);

				this.add(elm);
			},this);
		}
		window.communityData = undefined;
		//add extra fake community with -1 Id
		var elm = new Community();
		elm.initWithouZone([]);
		this.add(elm);
	},
	comparator : function(item) {
	  return  -(item.get('totalArticles'));//publicName
	}
});

return Communities;
});
