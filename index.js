'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PAGE_ACESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;


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


app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
		sendTextMessage(sender, "Hello")
    }
	res.send('Sucessfull')
    res.sendStatus(200)
})

const token = "EAACxWwMMMN4BAOC4nQ3QyAL5ZBQVXoBgVbPozukZCJ1V6SZCPZAzklAdyRIxJ6iCInZCLuPw7pYPq7R84qfZC2TSBGzF0phxmDdzQJYygUCa5hFW1QlMhAqH1ZAbAcHb2gojTbR8b1EJFysvpVRZBIhAUiWjT1e6xE4Vxs5mXT8XGwZDZD"

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



// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})