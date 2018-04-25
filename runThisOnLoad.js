var EMAIL_VAR = "email_volume";

chrome.storage.local.get(EMAIL_VAR, function(items){
	email = items.email_volume;
	if (email == null){
		//TODO: Access local storage and get email
		setTimeout(function() {
			email = localStorage.getItem("Jukebox.User")
			chrome.storage.local.set({ "email_volume": email }, function(){
				alert("Registered as " + email + ".");
			});
		}, 3000);
	}
});
