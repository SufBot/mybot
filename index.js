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
		// console.log("Entry: "+entry);
		// if(entry.payload){
			// console.log("payload !!");
		// }

	  // Gets the body of the webhook event
	  let webhook_event = entry.messaging[0];
	  console.log(webhook_event);


	  // Get the sender PSID
	  let sender_psid = webhook_event.sender.id;
	  console.log('Sender PSID: ' + sender_psid);

	  // Check if the event is a message or postback and
	  // pass the event to the appropriate handler function
	  if (webhook_event.message) {
		  if (webhook_event.message.quick_reply){
			handleQuickReply(sender_psid, webhook_event.message.quick_reply);
		  }else{
			handleMessage(sender_psid, webhook_event.message);
			}
	  }
	  if (webhook_event.postback) {
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

function handleQuickReply(sender_psid, received_message) {
  let response;
  if(received_message.payload === 'Taux'){
	response = { "text": "Se former c'est important !" }
	callSendAPI(sender_psid, response);
  }
  if(received_message.payload === 'Autre'){
	response = { "text": "N'hésite pas à poser ta question." }
	callSendAPI(sender_psid, response);
  }
}


function handleMessage(sender_psid, received_message) {
  let response;
  
/*   // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    } */
   if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "C'est la bonne photo ?",
            "subtitle": "Appuie pour répondre :",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Oui !",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "Non !",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Merci !" }
	callSendAPI(sender_psid, response);
  } else if (payload === 'no') {
    response = { "text": "Oups, essaie encore..." }
	callSendAPI(sender_psid, response);
  }
  if(payload === 'GET_STARTED') {
	  callSendAPIGetName(sender_psid);
  }
  if(payload === 'CEP'){
	response ={
    "text": "A quel sujet ?",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Taux d'encadrement",
        "payload":"Taux"
      },
      {
        "content_type":"text",
        "title":"Autre",
        "payload":"Autre"
      }
    ]
  }
  callSendAPI(sender_psid, response);
  }
  
  if(payload ==='Feu'){
	response = { "text": "Le feu n'est pas une poubelle ;)" }
	callSendAPI(sender_psid, response);
  }
  
  
  
  
  if(payload ==='Qui'){
	response = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_element_style": "compact",
        "elements": [
          {
            "title": "Titre 1",
            "subtitle": "Sous titre 1",
            "image_url": "http://www.lamallesuf.com/Files/27900/Img/20/LOGO-AVENTURE.jpg",          
            "buttons": [
              {
                "title": "View",
                "type": "web_url",
                "url": "https://fr.wikipedia.org/wiki/Scouts_unitaires_de_France",
                "messenger_extensions": true,
                "webview_height_ratio": "full",          
              }
            ]
          },
          {
            "title": "Titre 2",
            "subtitle": "Sous titre 2",
            "default_action": {
              "type": "web_url",
              "url": "https://fr.wikipedia.org/wiki/Scouts_unitaires_de_France",
              "messenger_extensions": true,
              "webview_height_ratio": "tall"
            }
          }
        ]
      }
    }
  }
	callSendAPI(sender_psid, response);
  }
  
  // Send the message to acknowledge the postback
}

function callSendAPIGetName(sender_psid) {
	request({
    "uri": "https://graph.facebook.com/v2.6/"+sender_psid,
    "qs": { "access_token": token,"fields": "first_name" },
    "method": "GET",
  }, (err, res, body) => {
    if (!err) {
		let bodyObj = JSON.parse(body);
        let name = bodyObj.first_name;
		let response = { "text":"Bonjour "+name };
		callSendAPI(sender_psid, response);
    } else {
      console.error("Unable to get name:" + err);
    }
  }); 
}


function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
	"messaging_type": "RESPONSE",
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": token },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}



// Spin up the server
 app.listen(app.get('port'), function() {
	 console.log('running on port', app.get('port'))
 })