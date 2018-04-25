$( document ).ready(function() {
    chrome.storage.local.get("email_volume", function(items){
    		email = items.email_volume;
    		if (email == null){
    				var theDiv  = document.getElementById('emailContainer');
            theDiv.innerHTML += "";
    				theDiv.innerHTML += "<h6>You need to enter your Volume email for the extension to work (volume.co.uk address)<h6>";
    		}else{
            var theDiv  = document.getElementById('emailContainer');
            theDiv.innerHTML += "";
            theDiv.innerHTML += "<h6>You have registered your email as "+ email + "</h6>"
    		}
	});
  chrome.storage.local.get("notif_bool", function(items){
    notificationAllowed = items.notif_bool;
    if (notificationAllowed){
      $('#notif-checkbox').prop('checked', true);
    }else{
      $('#notif-checkbox').prop('checked', false);
    }
  });
  $('#notif-checkbox').change(
      function(){
          if ($(this).is(':checked')) {
            chrome.storage.local.set({ "notif_bool": true }, function(){
            });
          }else{
            chrome.storage.local.set({ "notif_bool": false }, function(){
            });
          }
      })
});

;
