define(["jquery", "underscore","backbone","app/router"], function($, _, backbone, router) {
        var d = new Date();
        var callBack = function(result,event){
        	var r = new router(result);
        	backbone.history.start();
        };

        XMLHttpRequest.prototype.origOpen = XMLHttpRequest.prototype.open;
		    var camLoader = function(method, url, async, user, password) {
           var valImg = window.baseUrlFragment != undefined ? '<img src="'+baseUrlFragment+'/camimgs/mainloader.gif">' : 'Loading';
			     this.addEventListener("readystatechange", function() {
           		if ( this.readyState == 1 ){
           			if ( ($("body").find("#camloaderoverlay")).length == 0 && ($("body").find("#camloadergif")).length == 0){
           				if ( window.appOnSave == undefined ) $('<div id="camloaderoverlay"></div><div id="camloadergif">'+valImg+'</div>').appendTo("body");
           			}
           		}
				  if ( this.readyState == 4 ){
					 $("body").find("#camloaderoverlay").remove();
					 $("body").find("#camloadergif").remove();
				  }
    		}, false);
    		this.origOpen (method, url, async, user, password);
		    };
		    XMLHttpRequest.prototype.open = camLoader;
        cam_ConfigController = umCustomSettingController;
        umCustomSettingController.getAllSitesSetup(callBack);
});