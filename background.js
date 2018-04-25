console.log('started');
var currentRatedTrack = "";

//////////////////////////////////CONSTANTS////////////////////////////////////////////////////////////////////////////

var OFFICE_ID_VAR = "office_id";
var EMAIL_VAR = "email_volume";
var NOTIF_BOOL_VAR = "notif_bool";
var ACTIVE_STATE = "active";
var SETTINGS_PAGE = 'settings.html';
var WINDOW_PAGE	= "http://jukebox.dev.volume.lk/";
var VOLUME_JUKEBOX_UNIQUE_ID = 'com_jukebox_volume';
var FEEDBACK_LIKE_SONG_TEXT = 'I like this song';
var FEEDBACK_DISLIKE_SONG_TEXT = 'I don\'t like this song';
var FEEDBACK_LIKE_SONG_ICON = 'icons/like-hover.png';
var FEEDBACK_DISLIKE_SONG_ICON = 'icons/dislike-hover.png'
var FEEDBACK_LIKE_SONG_NUMBER = 1;
var FEEDBACK_DISLIKE_SONG_NUMBER = 0;
var REGISTER_MESSAGE = "You cannot rate tracks until you sign into the Jukebox website. If you have already signed in, please wait until you get automatically registered";
var GET_CURRENT_TRACK_URL = "http://api.jukebox.dev.volume.lk/api/Info?officeId=";
var USER_GET_OFFICE_URI = "http://api.jukebox.dev.volume.lk/api/user?email=";
var POST_CURRENT_TRACK_URL =  "http://api.jukebox.dev.volume.lk/api/CurrentTrack";
var USER_POST_URL = "http://api.jukebox.dev.volume.lk/api/user";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getOfficeId();
setInterval(checkActiveTimer, 420000);
setInterval(showNotification, 240000);
chrome.notifications.onButtonClicked.addListener(buttonClicked);
var currentResponse;

function getOfficeId(){
	console.log("ss");
	chrome.storage.local.get(EMAIL_VAR, function(items){
		email = items.email_volume;
		if (email == null){
			//newWindow = window.open(WINDOW_PAGE,VOLUME_JUKEBOX_UNIQUE_ID);
			//alert(REGISTER_MESSAGE);
		}else {

			var userOfficeGet = {
				"async": true,
				"crossDomain": true,
				"url": USER_GET_OFFICE_URI + email,
				"method": "GET",
				"headers": {
					"cache-control": "no-cache",
					"postman-token": "755d74ac-e760-5a21-4cfa-40eff83a7a09"
				}
			}

			$.ajax(userOfficeGet).done(function (response) {
				chrome.storage.local.set({ "office_id": response }, function(){

				});
			});
		}
});
}

function showNotification(){
	chrome.storage.local.get(OFFICE_ID_VAR, function(items2){

		if (items2.office_id == null || items2.office_id === -1){
				getOfficeId();
		}
		//TODO: change to CurrentTrack?items.office_id
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": GET_CURRENT_TRACK_URL+items2.office_id,
			"method": "GET",
			"headers": {
				"cache-control": "no-cache",
				"postman-token": "8dc44942-14e9-b803-d032-3ab94b1c5f59"
			}
		}
		$.ajax(settings).done(function (response) {
			var notificationAllowed = true;
			chrome.storage.local.get(NOTIF_BOOL_VAR, function(items){
				notificationAllowed = items.notif_bool;
				if (notificationAllowed){
					if (typeof response !== 'undefined'){
						if (response.Name  !== currentRatedTrack){
							chrome.idle.queryState(300, function(newState) {
								if (newState === ACTIVE_STATE){


									currentResponse = response;

									var artists = response.Artist ;
									var imageLocation = response.AlbumArtUrl;

									var options = {
										type: "basic",
										title: response.Name,
										message: artists,
										iconUrl: imageLocation,
										buttons : [
											{title: FEEDBACK_LIKE_SONG_TEXT, iconUrl: FEEDBACK_LIKE_SONG_ICON},
											{title: FEEDBACK_DISLIKE_SONG_TEXT, iconUrl: FEEDBACK_DISLIKE_SONG_ICON},
										]
									};

									chrome.notifications.create(options, function popupDone(){
										//Do something after showing popup
									});
								}
							});
						}
					}}
				});
			});


	});
}

	function buttonClicked(notificationId, buttonIndex){
		//console.log(buttonIndex);
		console.log("Sent");

		var emailAddr =  "";
		chrome.storage.local.get(EMAIL_VAR, function(items){
			emailAddr = items.email_volume;
			if (emailAddr == null){
				newWindow = window.open(WINDOW_PAGE,VOLUME_JUKEBOX_UNIQUE_ID);
				alert(REGISTER_MESSAGE);
			}else{
				currentRatedTrack = currentResponse.TrackSpotifyID;
				if (buttonIndex === 1){
					var settings = {
						"async": true,
						"crossDomain": true,
						"url": POST_CURRENT_TRACK_URL,
						"method": "POST",
						"headers": {
							"content-type": "application/json",
							"authorization": "key= AAAAloXiH-g:APA91bEJCbPmuF9AmQOeIQ1YOVDENqVmaFrTRamkSf2H6aV1HXGQuP5vqAjzk9AtT3t_JNQN3oeJ8YLrhFsiNwFK42Xa10KDQkQnMRU_TMaJ4U21gjfxlumpKZ6inckci6eVmY2yQuqT",
							"cache-control": "no-cache",
							"postman-token": "37bc1994-43ec-01aa-2f4a-48202ca2fd04"
						},
						"processData": false,
						"data": "{\n  \"trackId\": \""+currentResponse.TrackSpotifyID+"\",\n\t\"email\": \""+emailAddr+"\",\n  \"feedback\": "+FEEDBACK_DISLIKE_SONG_NUMBER+",\n  \"category\": -1\n}\n\n"
					}

					$.ajax(settings).done(function (response) {
						console.log("Sent negative");
					});
				}else{
					var settings = {
						"async": true,
						"crossDomain": true,
						"url": POST_CURRENT_TRACK_URL,
						"method": "POST",
						"headers": {
							"content-type": "application/json",
							"authorization": "key= AAAAloXiH-g:APA91bEJCbPmuF9AmQOeIQ1YOVDENqVmaFrTRamkSf2H6aV1HXGQuP5vqAjzk9AtT3t_JNQN3oeJ8YLrhFsiNwFK42Xa10KDQkQnMRU_TMaJ4U21gjfxlumpKZ6inckci6eVmY2yQuqT",
							"cache-control": "no-cache",
							"postman-token": "37bc1994-43ec-01aa-2f4a-48202ca2fd04"
						},
						"processData": false,
						"data": "{\n  \"trackId\": \""+currentResponse.TrackSpotifyID+"\",\n\t\"email\": \""+emailAddr+"\",\n  \"feedback\": "+FEEDBACK_LIKE_SONG_NUMBER+",\n  \"category\": -1\n}\n\n"
					}

					$.ajax(settings).done(function (response) {
						console.log("Sent positive");
					});
				}}
			});
			chrome.notifications.clear(notificationId, function (wasCleared) {
			});
		}

		function checkActiveTimer(){
			chrome.idle.queryState(300, function(newState) {
				if (newState === ACTIVE_STATE){
					sendActive(1);
				}else{
					sendActive(0);
				}
			});
		}

		function sendActive(state){
			var email =  "";
			chrome.storage.local.get(EMAIL_VAR, function(items){
				email = items.email_volume;
				if (email == null){
					//newWindow = window.open(WINDOW_PAGE,VOLUME_JUKEBOX_UNIQUE_ID);
				}else{
					var settings = {
						"async": true,
						"crossDomain": true,
						"url": USER_POST_URL,
						"method": "POST",
						"headers": {
							"content-type": "application/json",
							"cache-control": "no-cache",
							"postman-token": "7657043e-5770-c3fb-4acd-1d1b8b3047de"
						},
						"processData": false,
						"data": "{\n\t\"email\": \""+email+"\",\n\t\"status\": "+state+"\n}"
					}
					console.log(settings);
					$.ajax(settings).done(function (response) {
						console.log(response);
					});}
				});

			}

			function NotificationButtonClicked(){
				chrome.storage.local.get(OFFICE_ID_VAR, function(items2){
					if (items2.office_id == null  || items2.office_id === -1){
						chrome.storage.local.get(EMAIL_VAR, function(items){
							email = items.email_volume;
							console.log(email);
							if (items.email_volume == null){
								newWindow = window.open(WINDOW_PAGE,VOLUME_JUKEBOX_UNIQUE_ID);
								alert(REGISTER_MESSAGE);
							}else {
								var userOfficeGet = {
									"async": true,
									"crossDomain": true,
									"url": USER_GET_OFFICE_URI + email,
									"method": "GET",
									"headers": {
										"cache-control": "no-cache",
										"postman-token": "755d74ac-e760-5a21-4cfa-40eff83a7a09"
									}
								}

								$.ajax(userOfficeGet).done(function (response) {
									console.log(response);
									chrome.storage.local.set({ "office_id": response }, function(){

									});
								});
							}
					});
				}
			  var settings = {
					"async": true,
					"crossDomain": true,
					"url": GET_CURRENT_TRACK_URL+items2.office_id,
					"method": "GET",
					"headers": {
						"cache-control": "no-cache",
						"postman-token": "8dc44942-14e9-b803-d032-3ab94b1c5f59"
					}
				}

				$.ajax(settings).done(function (response) {
							if (typeof response !== 'undefined'){
								currentResponse = response;
								var artists = response.Artist;
									var imageLocation = response.AlbumArtUrl;

									var options = {
										type: "basic",
										title: response.Name,
										message: artists,
										iconUrl: imageLocation,
										buttons : [
											{title: FEEDBACK_LIKE_SONG_TEXT, iconUrl: FEEDBACK_LIKE_SONG_ICON},
											{title: FEEDBACK_DISLIKE_SONG_TEXT, iconUrl: FEEDBACK_DISLIKE_SONG_ICON},
										]
									};

									chrome.notifications.create(options, function popupDone(){
										//Do something after showing popup
									});
								}

					});
			});}
