const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cors = require('cors')({origin: true});
require('dotenv').config();

// admin.initializeApp({
// 	apiKey: process.env.FIREBASE_APIKEY,
//     authDomain: process.env.FIREBASE_AUTHDOMAIN,
//     projectId: process.env.FIREBASE_PROJECTID,
//     storageBucket: process.env.FIREBASE_STORAGEBUCKET ,
//     messagingSenderId: process.env.FIREBASE_MESSAGING,
//     appId: process.env.FIREBASE_APPID,
//     measurementId: process.env.FIREBASE_MEASUREMENTID 
// })

admin.initializeApp()

const getFromApi = async () => {
	const key = process.env.NATURAL_LANGUAGE_API_KEY
    const text = "吾輩は猫である。　名前はまだない。"
	const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`
	const options = {
		uri: url,
		header: { "Content-type": "application/json" },
		body: {
			"document": {
				"type": "PLAIN_TEXT",
				"language": "JA",
				"content": text
			}
		},
		json: true
	}
    const entitied = await axios.post(
		`https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`,
		{
			"document": {
				"type": "PLAIN_TEXT",
				"language": "JA",
				"content": text
			}
		})
	return entitied	
}

exports.api = functions.https.onRequest((req,res) => {
	getFromApi().then((response) => res.send(response));
});

// const client = new twitter({
	//   consumer_key: process.env.API_KEY,
	//   consumer_secret: process.env.API_SECRETKEY,
	//   access_token_key: process.env.ACCESS_TOKEN,
	//   access_token_secret: process.env.ACCESS_TOKEN_SECRET
	// });
	
	// const params = {
		//   id: 23424856
		// };

// exports.twitter = functions.region('asia-northeast1').https.onRequest(async(req, res) => {
// 		const te = await client.get('trends/place', params)
// 		res.header('Access-Control-Allow-Origin', "*"); 
// 		res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
//         res.send(te);
// })

// exports.entity = functions.region('asia-northeast1').https.onRequest((req, res) => {
// 	const key = process.env.NATURAL_LANGUAGE_API_KEY
// 	const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`

// 	const text = "吾輩はねこである。名前はまだない."
// 	header = { 'Content-type': "application/json" }
// 	body = {
// 		"bocument": {
// 			"type": "PLAIN_TEXT",
// 			"language": "JA",
// 			"content": text
// 		}
// 	}
// })


