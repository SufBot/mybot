'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const request = require('request')


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'myToken') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})


app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
	body.entry.forEach(function(entry) {

	  // Gets the body of the webhook event
	  let webhook_event = entry.messaging[0];
	  console.log(webhook_event);


	  // Get the sender PSID
	  let sender_psid = webhook_event.sender.id;
	  console.log('Sender PSID: ' + sender_psid);

	  // Check if the event is a message or postback and
	  // pass the event to the appropriate handler function
	  if (webhook_event.message) {
		handleMessage(sender_psid, webhook_event.message);        
	  } else if (webhook_event.postback) {
		handlePostback(sender_psid, webhook_event.postback);
	  }
	  
	});

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

const token = "EAACxWwMMMN4BAOC4nQ3QyAL5ZBQVXoBgVbPozukZCJ1V6SZCPZAzklAdyRIxJ6iCInZCLuPw7pYPq7R84qfZC2TSBGzF0phxmDdzQJYygUCa5hFW1QlMhAqH1ZAbAcHb2gojTbR8b1EJFysvpVRZBIhAUiWjT1e6xE4Vxs5mXT8XGwZDZD"

// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}



// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})