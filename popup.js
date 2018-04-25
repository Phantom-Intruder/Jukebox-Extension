document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('settingsButton').addEventListener('click', onSettingsButtonClick);
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('notificationButton').addEventListener('click', onNotificationButtonClicked);
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('goToWebsiteButton').addEventListener('click', onWebsiteButtonClicked);
});

chrome.notifications.onButtonClicked.addListener(buttonClicked);

function onSettingsButtonClick(){
	window.open('settings.html', '_blank');
}

function onNotificationButtonClicked(){
  var otherWindows = chrome.extension.getBackgroundPage();
  otherWindows.NotificationButtonClicked();
}

function onWebsiteButtonClicked(){
	window.open('http://jukebox.dev.volume.lk/', '_blank');
}
