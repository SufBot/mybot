'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()


let lundi = Array([5]);
let mardi = Array([5]);
let mercredi = Array([5]);
let jeudi = Array([5]);
let vendredi = Array([5]);
lundi[0] = "Start:8h00 | End:10h00 | Dynamique du véhicule | EA- (AMPHI A )";
lundi[1] = "Start:10h15 | End:12h00 | Analyse et commande des systèmes non linéaires | EA- (AMPHI A )";
mardi[0] = "Start:8h00 | End:9h00 | Processus aléatoire et théorie de l'information | EB-PB51 (AMPHI H )";
mardi[1] = "Start:10h15 | End:12h00 | Systèmes à dérivées non entières | EA- (AMPHI B )";
mardi[2] = "Start:14h00 | End:16h00 | Optimisation | EA- (AMPHI A )";
mardi[3] = "Start:16h15 | End:18h00 | Planification de trajectoire | EA- (AMPHI A )";
mercredi[0] = "Start:8h50 | End:10h00 | Synthèse de commandes robustes par optimisation | EB-PB51 (AMPHI H )";
mercredi[1] = "Start:14h00 | End:16h00 | Identification des systèmes dynamiques | EA-S115/S116 (TD11)";
mercredi[2] = "Start:16h15 | End:18h00 | Modélisation par Bond Graph | EA-S115/S116 (TD11)";
jeudi[0] = "Start:8h00 | End:10h00 | Identification des systèmes dynamiques | EB-PB51 (AMPHI H )";
jeudi[1] = "Start:14h00 | End:16h00 | Anglais | ";
vendredi[0] = "Start:8h00 | End:10h00 | Commande Automatique De Vol | EA- (AMPHI E )";
vendredi[1] = "Start:10h15 | End:12h00 | Planification de trajectoire | EA- (AMPHI E )";
vendredi[2] = "Start:14h00 | End:16h00 | Systèmes à évènements discrets | EA- (AMPHI A )";
vendredi[3] = "Start:16h15 | End:18h00 | Systèmes à évènements discrets | EA- (AMPHI A )";

let reminder ="Empty"





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
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
		
		if (event.message && event.message.text.includes("remind me to") || event.message.text.includes("Remind me to")) {		
		    let text = event.message.text
			reminder=text
			sendTextMessage(sender, "Ok, message saved !" )
	    }
		
		if (event.message && event.message.text.includes("reminder") ||event.message.text.includes("Reminder")) {		
		    let text = event.message.text
			sendTextMessage(sender, reminder )
	    }
		
		
		
	    if (event.message && event.message.text.includes("lundi") || event.message.text.includes("Lundi")) {
		    let text = event.message.text
		    sendTextMessage(sender, lundi[0])
			sendTextMessage(sender, lundi[1])
			sendTextMessage(sender, lundi[2])
			sendTextMessage(sender, lundi[3])
			sendTextMessage(sender, lundi[4])
	    }
		
		if (event.message && event.message.text && event.message.text.includes("mardi") || event.message.text.includes("Mardi")) {
		    let text = event.message.text
		    sendTextMessage(sender, mardi[0])
			sendTextMessage(sender, mardi[1])
			sendTextMessage(sender, mardi[2])
			sendTextMessage(sender, mardi[3])
			sendTextMessage(sender, mardi[4])
	    }
		
		if (event.message && event.message.text && event.message.text.includes("mercredi") || event.message.text.includes("Mercredi")) {
		    let text = event.message.text
		    sendTextMessage(sender, mercredi[0])
			sendTextMessage(sender, mercredi[1])
			sendTextMessage(sender, mercredi[2])
			sendTextMessage(sender, mercredi[3])
			sendTextMessage(sender, mercredi[4])
	    }
		
		if (event.message && event.message.text && event.message.text.includes("jeudi") || event.message.text.includes("Jeudi")) {
		    let text = event.message.text
		    sendTextMessage(sender, jeudi[0])
			sendTextMessage(sender, jeudi[1])
			sendTextMessage(sender, jeudi[2])
			sendTextMessage(sender, jeudi[3])
			sendTextMessage(sender, jeudi[4])
	    }
		
		if (event.message && event.message.text && event.message.text.includes("vendredi") || event.message.text.includes("Vendredi")) {
		    let text = event.message.text
		    sendTextMessage(sender, vendredi[0])
			sendTextMessage(sender, vendredi[1])
			sendTextMessage(sender, vendredi[2])
			sendTextMessage(sender, vendredi[3])
			sendTextMessage(sender, vendredi[4])
	    }
    }
    res.sendStatus(200)
})

const token = "EAAHWuH5WhBkBAGZCeWlQL7pcWSeTPK2DhZBcIkJcIVTITauhUBH6I7rYUsfFoZCEqMhMYTZBKcZAy2iII2apfvQv2TY6sBKkOAML1TCpNy5m6MBw77iItxhWNZBA1FyRT3OpE7gCs5V9EUZC7IWJTJOuyIZB2MoUNISHFlJWvmqLMgZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}