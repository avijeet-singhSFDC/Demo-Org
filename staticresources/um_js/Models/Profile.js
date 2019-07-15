define(["jquery",
        "underscore",
        "backbone"], function($,_,Backbone){


var Profile = Backbone.Model.extend({

    tidy: function() {

		var localName = _.escape(_.unescape(this.get('Name')));
		this.set('Name',localName);

        return this;
    
    },

	fetch: function(comId,uId ){
		req =Um.modules.modelFor('Profile');
        self = this;
		req.operationType = 'getUserProfileDetail';
        req.operationData = _.extend(req.operationData,
		                        {   communityId : comId,
					                userId :uId
		                		});

		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                Um.dispatcher.trigger("FATAL_ERROR",r.message);
			}else{
				 console.log(r.responseBody);
				 self.set(r.responseBody);
                 self.trigger('modelFetched');  
			}
		}, true, this);
    }




});

return Profile;
});