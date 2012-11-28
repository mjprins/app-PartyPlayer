/*
 * Party Guest Demo
 */
$(document).ready(function(){

    partyplayer.init('guest');
    userName.init();
});

var userID;

partyplayer.joinUser = function(name){
	partyplayer.sendMessage({ns:"main", cmd:"join", params:{name:name,thumbnail:"empty"}});
    log(name + " is joining...");
};


partyplayer.addItem = function(item){
 	partyplayer.sendMessage({ns:"main", cmd:"addItem", params:{userId:userID,item:item}});
	log("adding Item");
};



partyplayer.main = {};
partyplayer.main.onwelcome = function(param, ref) {
    userID = param.userID;
    log('onwelcome invoked! userID = '+userID); 
    //@TODO
    //mainMenu.init();
};

partyplayer.main.onupdatePlayer = function(param, ref) {
    log('onupdatePlayer Invoked!');
    //** If param.userId not in [userTable]
    //->@TODO: User admininstartion
    //log("param.userAlias + Joined the party"); 
};

partyplayer.main.onremovePlayer = function(param, ref) {
    log('onremovePlayer Invoked!');
    //->@TODO collection should be updated, as user is removed
};

partyplayer.main.onupdateItem = function (param, ref) {
    log ('onUpdateItem Invoked; my userID='+userID)
	if (param.userID != userID){
		log (param.userID +" added \""+param.item.artist +" - "+param.item.title + "\" to the collection");
		//@TODO: client logic 
	}
};




var userName = {
	/*
	 *@startuml ../docs/figures/guest_add_to_host.png
	 * partyGuest->partyHost: userName
	 * partyHost->partyGuest: userId
	 * partyHost->partyGuest: collection
	 * @enduml
	 */	
	name: '',
	btnClick:function(event){
		var name = $('#aliasText').val();
		userName.name = name;
		//send userName to host
		partyplayer.joinUser(name);
	    
	    partyplayer.shareItem = (function(item){
            log(name + ' has joined the party');
	        ///channel.send(JSON.stringify({join: name}));
	        //return: userId
	    }());

		$('#aliasDiv').fadeOut(200, function(){
			$('#aliasDiv').remove();
			//after choosing an alias init mainMenu
			mainMenu.init();
		});
	},
	init:function(){
		$('#guestApp').append('<div id="aliasDiv"><p>Alias:</p><input type="text" id="aliasText" value="<default Webinos ID>"/><button type="button" id="aliasButton">Alias</button></div>');
		$('#aliasButton').bind("click", userName.btnClick);
	}		
};

var mainMenu = {
	/*
	 * homeScreen will contain the following options:
	 * 		- "partyCollection" -(See what is already in the collection before you decide to do anything)
	 * 		- "Vote" -(See the current funnel and vote media items up and down)
	 * 		- partycollection and vote don't need their own buttons... mainMenu can be the current collection
	 * 		- "Share files with collection" -(Select files through the file API and add them to the partyCollection)
	 */
	addFiles: function(event){
		$('#homeMenu').fadeOut(200, function(){
			$('#homeMenu').remove();
			//init nextScreen
			addFiles.init();
		});
	},
	init:function(){
		//welcome message
		$('#guestApp').append('<p id="welcome">You are known as: '+userName.name+'</p>');
		//add Menu
		$('#guestApp').append('<ul id="homeMenu"></ul>');
		var homeMenuItems = '<li class="homeMenuItem"><button class="menuBtn">Collection</button></li>';
		homeMenuItems += '<li class="homeMenuItem"><button class="menuBtn">Vote</button></li>';
		homeMenuItems += '<li class="homeMenuItem" id="addFiles"><button class="menuBtn">Share</button></li>';
		$('#homeMenu').append(homeMenuItems);
		//addEvents
		$('#addFiles').bind("click", mainMenu.addFiles);
	}
};

var addFiles ={
	addList:[],
	appendToDom:function(tempList){
		//if there are no items in the list add a <ul> item and share buttton
		if(!$('#list').children().length){
			var newGuestList = '<ul id="guestAddList"><li>Media to Share:</li></ul>'; 
			$('#list').append(newGuestList);
			var newButtons = '<div id="share"><p class="title">Share With Party</p><button id="share" class="menuBtn">Share</button></div>';
			$('#guestApp').append(newButtons);
			$('#share').bind("click", shareFiles.init);	
		}
		var htmlList = '';
		for(var i=0; i<tempList.length; i++){
			var f = tempList[i];
			console.log("templist"+JSON.stringify(tempList[i]));
			htmlList+= '<li class="item">';
			htmlList+= '<strong>artist: </strong>'+f.Artist+' ';
			htmlList+= '<strong>title: </strong>'+f.Title+' ';
			htmlList+= '<strong>album: </strong>'+f.Album+' ';
			htmlList+= '<strong>name: </strong>'+f.filename+' '
			htmlList+= '</li>';
			//add item to permanent list
			addFiles.addList.push(f);
		}
		$('#guestAddList').append(htmlList);
		
		//Change title to "Add more files"
		$('#inputDiv .title').text("Add more files");
	},
	parseFile: function(file, callback){
		console.log("parsefile"+file.name);
	    if(localStorage[file.name]) return callback(JSON.parse(localStorage[file.name]));
	    
	}, 
	fileSelect:function(event) {
		console.log("fileselect"+event.target.files);
		var files = event.target.files;
	    var tempList=[];
		//parse ID3 tags and store in temporary list
		for(var i=0; i<files.length; i++){
			var name = files[i].name;
			console.log("name "+name);
			/*
			*does not work in firefox... test with chrome 
			*TODO find better ID3v2 parser
			*/
			addFiles.parseFile(files[i],function(tags){      		       		
				console.log(tags);
				tags.filename = files[i].name;
				console.log(tags.filename);
	       		tags.version = 1;
	       		tempList.push(tags);
			});
		}
		
		//add temporary list to DOM
		addFiles.appendToDom(tempList);
	},
	init:function(){
		//add input field to DOM
		$('#guestApp').append('<div id="inputDiv"><p class="title">Select Files</p><input type="file" accept="audio/*" id="files" name="" multiple /></div><output id="list"></output>');
		//bind fileSelect function to change
		$('#files').change(addFiles.fileSelect);
	}
};


var shareFiles={
	/*
	 *@startuml ../docs/figures/share_files.png
	 * partyGuest->partyHost: {userId, {artist, title, album, filename, filetype, etc..}}
	 * @enduml
	 */	
	share:function(item){
		partyplayer.shareItem = function(item){
			channel.send(JSON.stringify(
				{"ns":"main","cmd":"addItem","args":{"userID":alias.userName,"item":item}}
			));
			//example syntax: 
			//{"type":"collection","cmd":"addItem","args":{"userID":1,"item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":" "}}}
			//{"type":"collection","cmd":"addItem","args":{"userID":"anton","item":{"version":1,"filename":"michael jackson - bad.mp3","title":"Bad","artist":"Michael Jackson","mediatype":"audio","mimetype":"audio/mp3","screenshot":"base64/???","screenshotURI":"http://youtube.com/screenshot.png","duration":"00:03:55","contentType":"onDemand","contentSrc":"file","URI":"","src":" "}}}


		};
	},
	init:function(){
		var shareLength = addFiles.addList.length;
		for(var i=0; i<shareLength; i++){
			shareFiles.share(addFiles.addList[i]);
		}
		//clear addList;
		addFiles.addList=[];
		//clear from DOM
		$('#guestAddList').remove();
		$('#share').remove();
		//added message
		var addMessage='<div id="added">Shared '+shareLength+' Files with Party Collection</div>';
		$('#guestApp').append(addMessage);
		$('#added').fadeOut(4000, function(){
			$('#added').remove();
		});
	}	
}

