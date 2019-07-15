define([
    'jquery',
    'underscore',
    'backbone'], function ($, _, Backbone){

    var ContactMiniBar = Backbone.View.extend({
        events: {
            "click #emoIconButton" : "iconMenu",
            "click .geoLocContainer"  : "handleGeolocation",
            "change #route"        : "fileSelectionChange",
            "click #deletePic"     : "deleteFileSelected"
        },
        initialize: function(){
            //used to store local data for later persistence in cookie
            this.locationTMP = {};
            //emoIcon selected value
            var cookie = this.getCookie()!=null ? this.getCookie() : { emoIcon : "" };
            this.selectedVal = cookie.emoIcon.length > 0 ? cookie.emoIcon : null;
            this.fileSelected = null;


            Um.dispatcher.bind("CUcleanUpFile",this.cleanUpFile,this);
        },

        render: function(){
            var cookie = this.getCookie();
            this.selectedVal = cookie!=null && cookie.emoIcon.length > 0 ? cookie.emoIcon : null;
            this.undelegateEvents();
            this.template = _.template($('#contactUsMiniBar_tmpl').html());
            this.setElement("#miniBar");
            this.$el.hide().empty().off();
            this.$el.html(this.template({ cookie : cookie , file : this.fileSelected}));
            this.$el.fadeIn();
            this.delegateEvents();
            if(this.selectedVal!=null){
                var path = $('#selectedEmo').attr("data-src")+this.selectedVal;
                $('#selectedEmo').attr("src",path+".png");
            }

            if(this.fileDataurl != null && this.fileDataurl != '' ){
                $('#thumbPic').attr('src', this.fileDataurl);
            }

            /*
            if(this.fileSelected!=null){
                document.getElementById("thumbPic").src = this.fileSelected.target.result;
            }*/
        },
        handleCookie: function(){
            var tCookie = this.getCookie();
            if (tCookie!=null){
                var values = this.getValues();
                tCookie.lattitude   = values.lattitude;
                tCookie.longitude   = values.longitude;
                tCookie.emoIcon     = values.emoIcon;
                tCookie.address     = values.address;
                tCookie.subject     = values.subject;
                tCookie.description = values.description;
                tCookie.email       = values.email;
                tCookie.firstName   = values.firstName;
                tCookie.lastName    = values.lastName;
                var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
                var domain = "."+document.location.host;
                Um.cookies.setItem("contactFlow",JSON.stringify(tCookie),null,p,domain,null);
            }
        },
        getValues: function(){
            var c = this.getCookie();
            var lat_bkp = this.locationTMP.latitude;
            var long_bkp = this.locationTMP.longitude;
            var address_bkp = this.locationTMP.address;

                this.locationTMP.latitude = "";
                this.locationTMP.longitude = "";
                this.locationTMP.address = "";


            return{
                lattitude  : (lat_bkp!=undefined && lat_bkp!="")? lat_bkp : c.lattitude,
                longitude  : (long_bkp!=undefined && long_bkp!="")? long_bkp : c.longitude,
                address    : (address_bkp!=undefined && address_bkp!="")? address_bkp : c.address,
                emoIcon    : this.selectedVal != null ? this.selectedVal : c.emoIcon,
                subject    : c.subject,
                description: c.description,
                email      : c.email
            }
        },
        getCookie: function(){
            var tCookie = Um.cookies.getItem("contactFlow");
            tCookie = tCookie != null ? JSON.parse(tCookie) : tCookie;
            return tCookie;
        },
        saveCookieInfo: function(){
            this.handleCookie();
        },
        iconMenu: function(e){
            //Lets check if user already selected an emoicon and simply wants to remove it
            if(this.selectedVal!=null){
                var path = $('#selectedEmo').attr("data-src");
                $('#selectedEmo').attr("src",path+"happy-tiny-gray@2x.png");
                this.selectedVal = "";
                this.handleCookie();
                this.selectedVal = null;
                return;
            }

            var t = _.template($('#contactUsMiniBarIcons_tmpl').html());
            if ($('#emoMinibarIcons').length>0){
              $('.emoWr').fadeOut(400,function(){ $(this).empty().off().remove(); });
              return;
            }
            $('#miniBar').append( t(this.getTypes()) );
            $('#emoMinibarPointer').fadeOut(0).fadeIn(100);
            $('#emoMinibarIcons').fadeOut(0).fadeIn(100);

            var self = this;

            $('#emoMinibarIcons').find('li').click(function(e){
                e.stopImmediatePropagation();
                self.selectedVal = $(this).attr("data-value");
                var path = $('#selectedEmo').attr("data-src")+self.selectedVal;
                $('#selectedEmo').attr("src",path+".png");//with dark border
                $('.emoWr').fadeOut(400,function(){ $(this).empty().off().remove(); });
                self.handleCookie();
            });

            window.addEventListener("orientationchange", _.once(function() {
                $('#emoMinibarIcons').empty().off().remove();
                $('#emoMinibarPointer').empty().off().remove();
                self.iconMenu(e);
            }), false);
        },
        refresh: function(){
            this.render();
        },
        getTypes: function(){
            return { types : Um.modules.getModuleData('Case').caseEmoIcons.split(";") };
        },
        //geolocation
        removeGeolocation : function (){
            var tCookie = this.getCookie();
            if (tCookie!=null){
                var values = this.getValues();
                tCookie.lattitude   = "";
                tCookie.longitude   = "";
                tCookie.address     = "";
                var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
                var domain = "."+document.location.host;
                Um.cookies.setItem("contactFlow",JSON.stringify(tCookie),null,p,domain,null);
            }
        },
        handleGeolocation: function(){
            var c = this.getCookie();
            if (c.lattitude.toString().length>0){
                this.locationTMP.latitude = "";
                this.locationTMP.longitude = "";
                this.locationTMP.address = "";
                this.removeGeolocation();
                this.handleCookie();
                this.refresh();
                return;
            }

            var self = this;
            if (navigator.geolocation){
                var callback = function (position){
                    self.locationTMP.latitude = position.coords.latitude;
                    self.locationTMP.longitude = position.coords.longitude;
                    self.displayAndSaveLocation();
                };
                var errorHnd = function (err){
                    if (err.code == 1) {
                        self.alertMsg("Access denied.");
                    }else if (err.code == 2) {
                        self.alertMsg("Position unavailable.");
                    }
                };
                navigator.geolocation.getCurrentPosition(callback, errorHnd);
            }else{
                this.alertMsg("Your device does not support geo localization");
            }
        },
        alertMsg: function(text){
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(text);
            iframe.parentNode.removeChild(iframe);
        },
        displayAndSaveLocation: function(){
            $('#geoLocPlace').text("");
            var self = this;
            $.ajax({
                url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+this.locationTMP.latitude+","+this.locationTMP.longitude+"&sensor=false"
            }).done(function (data){
                var tmpAdress = '';
                if (data.results.length > 2){
                    _.each(data.results , function (i,e){
                        if (_.contains(i.types,"locality")&&_.contains(i.types,"political")){
                            tmpAdress= i.formatted_address ;
                        }
                    });
                    if (tmpAdress == '')
                        tmpAdress = data.results[data.results.length-2].formatted_address;
                }else
                    tmpAdress = data.results[0].formatted_address;

                self.locationTMP.address = tmpAdress;
                self.handleCookie();
                self.refresh();
            });
        },
        fileSelectionChange: function(e){

            var self = this;
            var file = e.target.files[0];
            this.fileSelected = e;
            // CANVAS RESIZING
            canvasResize(file, {
                width: 1024,
                height: 768,
                crop: false,
                quality: 95,
                rotate: 0,
                callback: function(data, width, height) {

                    // SHOW AS AN IMAGE
                    // =================================================
                    var img = new Image();
                    img.onload = function() {

                        $(this).css({
                            'margin': '10px auto',
                            'width': width,
                            'height': height
                        }).appendTo('#area div');

                    };
                    $(img).attr('src', data);
                    self.fileDataurl = data;
                    // /SHOW AS AN IMAGE
                    // =================================================

                    self.refresh();
                    //thumbnail view
                    $('#thumbPic').attr('src', data);

                    // IMAGE UPLOADING
                    // =================================================

                    // Create a new formdata
                    var fd = new FormData();
                    // Add file data
                    var f = canvasResize('dataURLtoBlob', data);
                    f.name = file.name;
                    fd.append($('#area input').attr('name'), f);

                    //As we are reusing some code from pkb, instead of adapting file uploading due to time constraints will save
                    //this tmp variable to use for uploadings.
                    Um.tmpFileArray = [];
                    Um.tmpFileArray.push( f);//document.getElementById("route").files;



                }

            });


            /*
            var oFReader = new FileReader();
            var rFilter = /^image\/(?:bmp|cis\-cod|gif|ief|jpeg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i;
            if (document.getElementById("route").files.length === 0){
                return;
            }
            var oFile = document.getElementById("route").files[0];
            if (!rFilter.test(oFile.type)) { this.alertMsg("You must select a valid image file!"); return; }
            var fileSize = (oFile.size / (1024*1024)).toFixed(2);
            if (fileSize >= 5){ this.alertMsg("File cannot exceed 5 MB"); return }

            var self = this;
            oFReader.onloadend = function(oFREvent){
              //document.getElementById("thumbPic").src = oFREvent.target.result;
              self.fileSelected = oFREvent;
              self.refresh();
            };
            oFReader.readAsDataURL(oFile);
            //As we are reusing some code from pkb, instead of adapting file uploading due to time constraints will save
            //this tmp variable to use for uploadings.
            Um.tmpFileArray = document.getElementById("route").files;*/
        },
        deleteFileSelected: function(){
            this.cleanUpFile();
            this.refresh();
        },
        cleanUpFile : function (){
            this.fileSelected = null;
            Um.tmpFileArray = null;
            this.fileDataurl = null;
        }
    });
    return ContactMiniBar;
});
