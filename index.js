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

const token = process.env.mytoken

// Handles quick replies
function handleQuickReply(sender_psid, received_message) {
  let response;
  if(received_message.payload === 'Chef'){
	response = { "text": "Canon ! Merci de ton engagement pour ta troupe, comment puis-je aider ? 🤖",
			"quick_replies":[
			  {
				"content_type":"text",
				"title":"Mon camp scout 🏕",
				"payload":"Camp"
			  },
			  {
				"content_type":"text",
				"title":"CEP-Taux d'encadrement",
				"payload":"CEP"
			  },
			  {
				"content_type":"text",
				"title":"Envoie de 📸",
				"payload":"Photo chef"
			  },
			  {
				"content_type":"text",
				"title":"Nous 📞?",
				"payload":"Contact"
			  },
			  {
				"content_type":"text",
				"title":"Écris moi 📩",
				"payload":"ecris"
			  }
			]
	}
	callSendAPI(sender_psid, response);
  }
  if(received_message.payload === 'éclaireur'){
	response = { "text": "Enchanté ! Je suis ravi de parler avec toi, comment puis-je t’aider ? 🤖",
			"quick_replies":[
			  {
				"content_type":"text",
				"title":"Écris pour Woodcraft 📗📝",
				"payload":"woodcraft"
			  },
			  {
				"content_type":"text",
				"title":"Envoie des 📸",
				"payload":"Photo scout"
			  },
			  {
				"content_type":"text",
				"title":"Écris moi 📩",
				"payload":"ecris"
			  }
			]
	}
	callSendAPI(sender_psid, response);
  }
  if(received_message.payload === 'Autre'){
	response = { "text": "Enchanté ! Je suis ravi de parler avec toi, comment puis-je t’aider ? 💪",
				"quick_replies":[
			  {
				"content_type":"text",
				"title":"Envoie des 📸",
				"payload":"Photo autre"
			  },
			  {
				"content_type":"text",
				"title":"Écris moi 📩",
				"payload":"ecris"
			  }
			]
	}
	callSendAPI(sender_psid, response);
  }
  
  
    if(received_message.payload === 'Contact'){
	response = { "text": "Parfait, voici la ligne directe de l'ENE : 0183757140"}
	callSendAPI(sender_psid, response);
	response = {
    "attachment":{
		  "type":"image", 
		  "payload":{
			"url":"https://cuke7.github.io/mybot/image1.png", 
			"is_reusable":true
			}
		}
	}
	callSendAPI(sender_psid, response);
  }
  
  if(received_message.payload === 'ecris'){
	response = { "text": "Super ! Tape ton message ici et mon programmateur reviendra vers toi pour y répondre au mieux 😉 \u000A P.S : c’est un équipier sympa ! "}
	callSendAPI(sender_psid, response);
  }
  
  
    if(received_message.payload === 'Autre question'){
	response = { "text": "Une autre question ? \u000A \u23E9 Rappelle-moi juste qui tu es ⁉️",
				"quick_replies":[
			  {
				"content_type":"text",
				"title":"Un chef éclaireur 👨",
				"payload":"Chef"
			  },
			  {
				"content_type":"text",
				"title":"Un éclaireur 👦🏼",
				"payload":"éclaireur"
			  },
			  {
				"content_type":"text",
				"title":"Autre 😎",
				"payload":"Autre"
			  }
			]
	}
	callSendAPI(sender_psid, response);
  }
  
}


function handleMessage(sender_psid, received_message) {
	let response
	/* if(received_message.text==='Retour' || received_message.text==='retour'){
		let response = {
		"text": "Re-bonjour, \u000A Ti ta ti ti ! 🤖 Je suis Michel le chatbot de la Branche Éclaireurs SUF, merci de me contacter ! 🙌🏻 \u000A \u23E9 Rappelle-moi juste qui tu es ⁉️",
		"quick_replies":[
			  {
				"content_type":"text",
				"title":"Un chef éclaireur 👨",
				"payload":"Chef"
			  },
			  {
				"content_type":"text",
				"title":"Un éclaireur 👦🏼",
				"payload":"éclaireur"
			  },
			  {
				"content_type":"text",
				"title":"Autre 😎",
				"payload":"Autre"
			  }
			]
		}
		callSendAPI(sender_psid, response);
	} */
	callSendAPI(sender_psid, response = { "text": "","quick_replies":[{"content_type":"text","title":"Retour au menu\u21A9","payload":"Autre question"}]});
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  if(payload === 'GET_STARTED') {
		callSendAPIGetName(sender_psid);
	}
  }
  
  // Send the message to acknowledge the postback

function callSendAPIGetName(sender_psid) {
	request({
    "uri": "https://graph.facebook.com/v2.6/"+sender_psid,
    "qs": { "access_token": token,"fields": "first_name" },
    "method": "GET",
  }, (err, res, body) => {
    if (!err) {
		let bodyObj = JSON.parse(body);
        let name = bodyObj.first_name;
		let response = {
		"text": "Bonjour "+name+", \u000A Ti ta ti ti ! 🤖 Je suis Michel le chatbot de la Branche Éclaireurs SUF, merci de me contacter ! 🙌🏻 \u000A \u23E9 Avant de commencer, peux-tu me dire qui tu es ⁉️",
		"quick_replies":[
			  {
				"content_type":"text",
				"title":"Un chef éclaireur 👨",
				"payload":"Chef"
			  },
			  {
				"content_type":"text",
				"title":"Un éclaireur 👦🏼",
				"payload":"éclaireur"
			  },
			  {
				"content_type":"text",
				"title":"Autre 😎",
				"payload":"Autre"
			  }
			]
		}
		callSendAPI(sender_psid, response);
    } else {
      console.error("Unable to get name:" + err);
	  let response = {
		"text": "Bonjour, \u000A Ti ta ti ti ! 🤖 Je suis Michel le chatbot de la Branche Éclaireurs SUF, merci de me contacter ! 🙌🏻 \u000A \u23E9 Avant de commencer, peux-tu me dire qui tu es ⁉️",
		"quick_replies":[
			  {
				"content_type":"text",
				"title":"Un chef éclaireur 👨",
				"payload":"Chef"
			  },
			  {
				"content_type":"text",
				"title":"Un éclaireur 👦🏼",
				"payload":"éclaireur"
			  },
			  {
				"content_type":"text",
				"title":"Autre 😎",
				"payload":"Autre"
			  }
			]
		}
		callSendAPI(sender_psid, response);
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