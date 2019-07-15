
var YoutubeVideo = function () {
    
    var youtube_element = {},
        video = {},
        aspectratio = 1,
        fullscreen = false,
        DEFAULT_WIDTH = 720,
        DEFAULT_HEIGHT = 405;
        
    function init(param) {
        console.log(param);
        fullscreen = param.fullscreen;
		youtube_element = document.getElementById('youtube-videoplayer' + param.id);
        if( fullscreen )
        	adjustVideoSize();
    };
    
    function adjustImgSizeOnWinResize(){
        adjustVideoSize();
    };
    
    function adjustVideoSize(){
        if( !fullscreen ) return;
       var width =  getDocWidth(),
           	  height = getDocHeight();
        
        var aspect_width =  width / DEFAULT_WIDTH;
        var aspect_height = height / DEFAULT_HEIGHT; 
        
        if( aspect_height > aspect_width){
            youtube_element.style.height = (DEFAULT_HEIGHT * aspect_height) + 'px';
        	youtube_element.style.width =  (DEFAULT_WIDTH * aspect_height)+ 'px';
        }else{
            youtube_element.style.height = (DEFAULT_HEIGHT * aspect_width) + 'px';
        	youtube_element.style.width =  (DEFAULT_WIDTH * aspect_width)+ 'px';
        }
        youtube_element.style.top = '50%';
        youtube_element.style.marginTop = - (parseInt(youtube_element.style.height)/2)  + 'px';
        youtube_element.style.left = '50%';
        youtube_element.style.marginLeft = - (parseInt(youtube_element.style.width)/2)  + 'px'; 
    };
    
    function getDocHeight() {
        var D = document;
        return Math.max(
            //D.body.scrollHeight, D.documentElement.scrollHeight,
            //D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    };
    
    function getDocWidth() {
        var D = document;
        return Math.max(
            //D.body.scrollWidth, D.documentElement.scrollWidth,
            //D.body.offsetWidth, D.documentElement.offsetWidth,
            D.body.clientWidth, D.documentElement.clientWidth
        );
    };
    
    return {
        init: init,
        adjustImgSizeOnWinResize: adjustImgSizeOnWinResize
    };
};