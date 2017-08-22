'use strict';
var counter = 1;
function SnooChat() {
	this.checkSetup();

	this.messageList = document.getElementById('messages');
	this.messageForm = document.getElementById('message-form');
	this.messageInput = document.getElementById('message-input');
	this.submitButton = document.getElementById('submit');
	this.username = document.getElementById('username');
	this.channel = document.getElementById('Channel');
	this.onlineCount = document.getElementById('numOnline');
	this.submitButton.addEventListener('click', this.saveMessage.bind(this));
	this.initFirebase();
	this.signIn();
}

SnooChat.prototype.initFirebase = function() {

	// TODO(DEVELOPER): Initialize Firebase.
	// Shortcuts to Firebase SDK features.
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();
	// Initiates Firebase auth and listen to auth state changes.
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
	var counterHTML = this.onlineCount;

	var myConnectionsRef = firebase.database().ref('all/connections');

	var connectedRef = this.database.ref('.info/connected');
	connectedRef.on('value', function(snap) {
	  if (snap.val() === true) {
	    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
	    var con = myConnectionsRef.push();

	    // When I disconnect, remove this device
	    con.onDisconnect().remove();
	    // Add this device to my connections list
	    // this value could contain info about the device or a timestamp too
	    con.set(true);
	  }
	});
	myConnectionsRef.on('child_added', function(snapshot){
		console.log(snapshot.val());
		myConnectionsRef.once("value").then(function(snapshot){
			console.log(snapshot.numChildren());
			counterHTML.innerHTML = snapshot.numChildren();
		})
	}.bind(this));
};

// Signs-in Friendly Chat.
SnooChat.prototype.signIn = function() {
  // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
  //console.error("clicked");
  // Sign in Firebase using popup auth and Google as the identity provider.\
	this.auth.signInAnonymously().catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});
};

// Template for messages.
SnooChat.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// A loading image URL.
SnooChat.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
SnooChat.prototype.displayMessage = function(key, name, text, time) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = SnooChat.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
		div.className +=  ' child'+counter;
		counter++;
    this.messageList.appendChild(div);
  }
	var newDate = new Date(time);
  div.querySelector('.name').textContent = name + " " + newDate.getHours()+":"+newDate.getMinutes();

	var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  }
  // Show the card fading-in.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

SnooChat.prototype.saveMessage = function(e) {
	e.preventDefault();
	// Check that the user entered a message and is signed in.
	if (this.messageInput.value && this.checkSignedInWithMessage()) {
    var currentUser = this.auth.currentUser;

    var UTCstring = (new Date()).toUTCString();
    // Add a new message entry to the Firebase Database.
    this.messagesRef.push({
      name: this.username.innerHTML,
      text: this.messageInput.value,
			utcTime: UTCstring
    }).then(function() {
      // Clear message text field and SEND button state.
      SnooChat.resetMaterialTextfield(this.messageInput);
      //this.toggleButton();
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

SnooChat.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

SnooChat.prototype.loadMessages = function() {
	console.log(this.channel.innerHTML);
	this.messagesRef = this.database.ref(this.channel.innerHTML);
	this.messagesRef.off();
  // Loads the last 25 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.utcTime);
  }.bind(this);
  this.messagesRef.limitToLast(25).on('child_added', setMessage);
  this.messagesRef.limitToLast(25).on('child_changed', setMessage);
}

SnooChat.prototype.onAuthStateChanged = function(user) {
	if (user) {
		console.log("Logged In");
		this.loadMessages();
	} else {
		console.log("Logged out");
	}
};


// Checks that the Firebase SDK has been correctly setup and configured.
SnooChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

SnooChat.prototype.checkSignedInWithMessage = function() {
	if (this.auth.currentUser) {
    return true;
  } else {
		return false;
	}
}


window.onload = function() {
  window.snooChat = new SnooChat();
};
