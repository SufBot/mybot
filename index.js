'use strict'
// I added change
const express = require('express')
	const bodyParser = require('body-parser')
	const app = express()
	const request = require('request')
	const token = process.env.mytoken
	app.set('port', (process.env.PORT || 5000))

	// Process application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({
			extended: false
		}))

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
			body.entry.forEach(function (entry) {

				// Gets the body of the webhook event
				let webhook_event = entry.messaging[0];
				console.log('RECEIVED'+webhook_event.message);

				// Get the sender PSID
				let sender_psid = webhook_event.sender.id;
				console.log('Sender PSID: ' + sender_psid);

				// Check if the event is a message or postback and
				// pass the event to the appropriate handler function
				if (webhook_event.message) {
					if (webhook_event.message.quick_reply) {
						handleQuickReply(sender_psid, webhook_event.message.quick_reply);
					} else {
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

//-----------------------------------------------------------------------------------------------------------
//----------------------------------------Handles quick replies----------------------------------------------
//-----------------------------------------------------------------------------------------------------------
function handleQuickReply(sender_psid, received_message) {
	let response;

	//-------------------------------3 possibilitées au début ---------------------------------

	if (received_message.payload === 'Chef') {
		response = {
			"text": "Canon ! Merci de ton engagement pour ta troupe, comment puis-je aider ? 🤖",
			"quick_replies": [{
					"content_type": "text",
					"title": "Mon camp scout 🏕",
					"payload": "camp"
				}, {
					"content_type": "text",
					"title": "CEP - Encadrement ⁉️",
					"payload": "CEP"
				}, {
					"content_type": "text",
					"title": "Envoie de 📸",
					"payload": "photo chef"
				}, {
					"content_type": "text",
					"title": "Nous 📞?",
					"payload": "contact"
				}, {
					"content_type": "text",
					"title": "Écris moi 📩",
					"payload": "ecris"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'éclaireur') {
		response = {
			"text": "Enchanté ! Je suis ravi de parler avec toi, comment puis-je t’aider ? 🤖",
			"quick_replies": [{
					"content_type": "text",
					"title": "Woodcraft 📝",
					"payload": "woodcraft"
				}, {
					"content_type": "text",
					"title": "Envoie des 📸",
					"payload": "photo scout"
				}, {
					"content_type": "text",
					"title": "Écris moi 📩",
					"payload": "ecris"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'Autre') {
		response = {
			"text": "Enchanté ! Je suis ravi de parler avec toi, comment puis-je t’aider ? 💪",
			"quick_replies": [{
					"content_type": "text",
					"title": "Envoie des 📸",
					"payload": "photo autre"
				}, {
					"content_type": "text",
					"title": "Écris moi 📩",
					"payload": "ecris"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	//-----------------------------------------Sous menus généraux ---------------------------------------//


	if (received_message.payload === 'CEP') {
		response = {
			"text": "Maîtrise formée, Maîtrise au taquet ! 💪"
		}
		callSendAPI(sender_psid, response);
		response = {
			"attachment": {
				"type": "image",
				"payload": {
					"url": "https://cuke7.github.io/mybot/image2.png",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
		response = {
			"text": "Sinon, il reste sûrement une place dans notre prochain CEP : https://goo.gl/kwXVfq",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'photo chef') {
		response = {
			"text": "Hum ! Je suis super friand des dernières photos d’activité ! Tu peux facilement les déposer juste ici : https://goo.gl/kFCpKA\u000A\u000ASélectionne tes plus belles photos en uniforme impeccable ou tenue de camp \u2728 !",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'photo scout' || received_message.payload === 'photo autre') {
		response = {
			"text": "Sélectionne tes plus belles photos d’activité en uniforme impeccable ou tenue de camp \u2728 !\u000A\u23E9 C’est simple, écris nous un mail à cette adresse mail : woodcraft@scouts-unitaires.org",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'contact') {
		response = {
			"text": "Parfait, voici la ligne directe de l'ENE : 0183757140"
		}
		callSendAPI(sender_psid, response);
		response = {
			"attachment": {
				"type": "image",
				"payload": {
					"url": "https://cuke7.github.io/mybot/image1.png",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'ecris') {
		response = {
			"text": "Super ! Écris ta question ou ton message, on sera hyper contents d'y répondre ! 😉",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'woodcraft') {
		response = {
			"text": "⏩ Défi Ascalon, photo de construction, blague, ton avis sur la progression…!\u000ARaconte nous tes aventures de pat’ en écrivant à woodcraft@scouts-unitaires.org et ton article sera publié dans un prochain numéro ! 📗",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	//---------------------------------------Sous menu camp-------------------------------------------


	if (received_message.payload === 'camp') {
		response = {
			"text": "Un camp, c’est la vie ! 🏕 Peux-tu préciser ta recherche :",
			"quick_replies": [{
					"content_type": "text",
					"title": "Assurance 🚙",
					"payload": "assurance"
				}, {
					"content_type": "text",
					"title": "Le feu 🔥",
					"payload": "feu"
				}, {
					"content_type": "text",
					"title": "Le raid 🐾",
					"payload": "raid"
				}, {
					"content_type": "text",
					"title": "Bibliothèque",
					"payload": "bibliothèque"
				}, {
					"content_type": "text",
					"title": "Autre  📩",
					"payload": "ecris 2"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'assurance') {
		response = {
			"text": "\u2728 La chance, on a une nouvelle assurance auto SUF ! \u2728\u000ACette assurance : \u000A🔵 Passe de 25 à 15 €/jour* et si aucun sinistre n’est déclaré d’ici la fin du camp, tu passes même à 10 €/jour !\u000A🔵 Permet d’éviter de faire fonctionner le contrat d’assurance du propriétaire du véhicule et de lui faire perdre éventuellement le bonus en cas d’accident responsable ou non.\u000A🔵 Est prévue pour s’appliquer aux activités SUF (#basdecaisse…)\u000A⏩ Comment marche-t-elle ?\u000A1. Souscris à l’assurance via l’onglet « Admin » de ton unité ou depuis ton DDC au plus tard la veille de l’utilisation du véhicule ;\u000A2. Plus de chèque, le paiement se fait par décompte directement dans Céphée à la fin du camp ;\u000A3. La franchise est de 500 €.\u000A----------\u000A(*) Journée calendaire de 0 h à minuit. Pour une période, n’omets pas le premier et le dernier jour (ex : du 28/07 au 03/08 = 7 jours).",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'feu') {
		response = {
			"text": "Allumez le feu ! Allumez le feu ! 🎤",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
		response = {
			"attachment": {
				"type": "file",
				"payload": {
					"url": "https://cuke7.github.io/mybot/Feu_Fiche_pratique.pdf",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'raid') {
		response = {
			"text": "🛤 “Le raid construit des hommes de caractère, capable de se tirer d’affaires en toutes circonstances. Et d’en entraîner d’autres dans leur sillage.” Michel Menu ⛰\u000A",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
		response = {
			"attachment": {
				"type": "file",
				"payload": {
					"url": "https://cuke7.github.io/mybot/Raid_Fiche_pratique.pdf",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}
	if (received_message.payload === 'bibliothèque') {
		response = {
			"text": "Retrouve un condensé de document pour ta mission de chef ! (Texte, progression, activité, ...).\u000Ahttps://goo.gl/gkhuqR",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (received_message.payload === 'ecris 2') {
		response = {
			"text": "Tu n’as pas trouvé ton bonheur ! Écris ta question ou ton message, on sera hyper contents d'y répondre ! 😉",
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	//-------------------------------------Retour au menu----------------------------------//


	if (received_message.payload === 'Autre question') {
		response = {
			"text": "Une autre question ?\u000A\u23E9 Rappelle-moi juste qui tu es ⁉️",
			"quick_replies": [{
					"content_type": "text",
					"title": "Un chef éclaireur 👨",
					"payload": "Chef"
				}, {
					"content_type": "text",
					"title": "Un éclaireur 👦🏼",
					"payload": "éclaireur"
				}, {
					"content_type": "text",
					"title": "Autre 😎",
					"payload": "Autre"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

}

function handleMessage(sender_psid, received_message) {
	let response;
	
	if(received_message.text === "test"){
		response = {
			"text": "Une autre question ?\u000A\u23E9 Rappelle-moi juste qui tu es ⁉️",
			"quick_replies": [{
					"content_type": "text",
					"title": "Un chef éclaireur 👨",
					"payload": "Chef",
				}, {
					"content_type": "text",
					"title": "Un éclaireur 👦🏼",
					"payload": "éclaireur"
				}, {
					"content_type": "text",
					"title": "Autre 😎",
					"payload": "Autre"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}
}

//----------------------------------------------------------------------------------------------------------
// ------------------------------------Handles messaging_postbacks events-----------------------------------
//----------------------------------------------------------------------------------------------------------
function handlePostback(sender_psid, received_postback) {
	let response;

	// Get the payload for the postback
	let payload = received_postback.payload;

	if (payload === 'retour') {
		response = {
			"text": "Une autre question ?\u000A\u23E9 Rappelle-moi juste qui tu es ⁉️",
			"quick_replies": [{
					"content_type": "text",
					"title": "Un chef éclaireur 👨",
					"payload": "Chef"
				}, {
					"content_type": "text",
					"title": "Un éclaireur 👦🏼",
					"payload": "éclaireur"
				}, {
					"content_type": "text",
					"title": "Autre 😎",
					"payload": "Autre"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'message du moment') {
		response = {
			"attachment": {
				"type": "image",
				"payload": {
					"url": "https://cuke7.github.io/mybot/image3.png",
					"is_reusable": true
				}
			},
			"quick_replies": [{
					"content_type": "text",
					"title": "Retour au menu 🔙",
					"payload": "Autre question"
				}
			]
		}
		callSendAPI(sender_psid, response);
	}

	if (payload === 'GET_STARTED') {
		callSendAPIGetName(sender_psid);
	}
}

// Send the message to acknowledge the postback

function callSendAPIGetName(sender_psid) {
	request({
		"uri": "https://graph.facebook.com/v2.6/" + sender_psid,
		"qs": {
			"access_token": token,
			"fields": "first_name"
		},
		"method": "GET",
	}, (err, res, body) => {
		let name;
		if (!err) {
			let bodyObj = JSON.parse(body);
			name = bodyObj.first_name;
		} else {
			console.error("Unable to get name:" + err);
			name = " ";
		}

		let response = {
			"text": "Bonjour " + name + " !\u000AJe suis Louis 🤖 de la Branche Éclaireurs SUF, merci de me contacter !\u000A\u000A🙌🏻  Je suis là pour répondre à tes questions !\u000A\u000A\u23E9 Avant de commencer, peux-tu me dire qui tu es ⁉️",
			"quick_replies": [{
					"content_type": "text",
					"title": "Un chef éclaireur 👨",
					"payload": "Chef"
				}, {
					"content_type": "text",
					"title": "Un éclaireur 👦🏼",
					"payload": "éclaireur"
				}, {
					"content_type": "text",
					"title": "Autre 😎",
					"payload": "Autre"
				}
			]
		}
		callSendAPI(sender_psid, response);
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
		"qs": {
			"access_token": token
		},
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
app.listen(app.get('port'), function () {
	console.log('running on port', app.get('port'))
})
