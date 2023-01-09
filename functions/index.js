const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const twitter = require('twitter');
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const { response } = require('express');
const cors = require('cors')({origin: true});
require('dotenv').config();
const fs = require('fs');

admin.initializeApp();
const db = admin.firestore();

// exports.returnOgp = functions.https.onRequest((req, res) => {
// 	const [, , bodyid] = req.path.split('/')
// 	return db.collection('threads').doc(bodyid).get().then((snap) => {
// 		if (!snap) {
// 			res.status(404).end('404 Not Found')
// 			return
// 		}
// 		const item = snap ? snap.data() : {}
// 		const itemBody  =  item.body || ""
// 		const html = createHtml(itemBody, bodyid)
// 		res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
// 		res.status(200).end(html)
// 		return
// 	})
// })

// const createHtml = (description, bodyid) => {
// 	const SITEURL = "https://onlytext.net"
// 	const PAGEURL = `${SITEURL}/body/${bodyid}`
// 	return `<!DOCTYPE html>
//   <html>
// 	<head>
// 	  <meta charset="utf-8">
// 	  <meta name="viewport" content="width=device-width,initial-scale=1.0">
// 	  <title>${description}</title>
// 	  <meta name="twitter:site" content="${SITEURL}">
//       <meta property="twitter:description" content="${description}$ />
//       <meta property="twitter:title" content="onlytext"/>
//       <meta property="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/onepage-9981b.appspot.com/o/ogp-image%2Ftwitter-card.png?alt=media&token=cdedf797-1cb0-4de1-b28d-53ba3b6b8364" />
//       <meta property="twitter:url" content="${PAGEURL}"/>
//       <meta name="twitter:card" content="summary"/>
// 	</head>
// 	<body>
// 	  <script type="text/javascript">window.location="/";</script>
// 	</body>
//   </html>
//   `
// }

exports.returnHtmlWithOGP = functions.https.onRequest((req, res) => {
	// Optional
	res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
	// Access URL '/user/{userId}'
	const userAgent = req.headers['user-agent'].toLowerCase()
	const path = req.params[0].split('/')
	const [, , bodyid] = req.path.split('/')
	const domain = 'https://onlytext.net'
	let indexHTML = fs.readFileSync('./hosting/index.html').toString()

  
	db.collection('threads').doc(bodyid).get()
		.then((snapshot) => {
		  const thread = snapshot.data()
		  let body = thread.body
		  indexHTML
			.replace(/\<title>.*<\/title>/g, '<title>' + body + '</title>')
			.replace(/<\s*meta name="description" content="[^>]*>/g, '<meta name="description" content="' + body + '" />')
			.replace(/<\s*meta property="og:title" content="[^>]*>/g, '<meta property="og:title" content="' + body + '" />')
			.replace(/<\s*meta property="og:url" content="[^>]*>/g, '<meta property="og:url" content="' + domain + '" />')
			.replace(/<\s*meta property="og:description" content="[^>]*>/g, '<meta property="og:description" content="' + body + '" />')
			.replace(/<\s*meta name="twitter:card" content="[^>]*>/g, '<meta name="twitter:card" content="summary_large_image" />')
		  res.status(200).send(indexHTML)
		})
		.catch(err => {
		  res.status(404).send(indexHTML)
		})
})



// exports.setAdminClaim = functions
//     .firestore
// 	.document('/users/{userId}')
// 	.onCreate(async (snap, context) => {
// 		try {
//             admin.auth().setCustomUserClaims(context.params.userId,  { createdByAdmin: true })
// 		} catch(error) {
// 			console.log(error)
// 		}
// })


					 

// exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
//     .onCreate((snap, context) => {

//       const original = snap.data().original;

//       functions.logger.log('Uppercasing', context.params.documentId, original);

//       const uppercase = original.toUpperCase();
//       return snap.ref.set({uppercase}, {merge: true});
// });

// exports.makeTrends = functions.firestore.document('threads/{threadsId}')
//     .onCreate((snap, context) => {
// 		const key = process.env.NATURAL_LANGUAGE_API_KEY
// 		const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`
// 		const body = snap.data().body
// 		const threadId = snap.data().id
// 		functions.logger.log(key, url, body,threadId);
// 		axios.post(url, {
// 			"document": {
// 				"type": "PLAIN_TEXT",
// 				"language": "JA",
//  			    "content": body
// 			}
// 		})
// 		.then((res) => {
// 			const p = res.data.entities.map((i) => (i.name))
// 			const all = []
// 			functions.logger.log(p);
// 			p.forEach((trend) => {
// 				const obj = {
// 					name: trend,
// 					threadId: threadId,
// 					created:  admin.firestore.FieldValue.serverTimestamp()
// 				}
// 				const promise = admin.firestore().collection('trends').add(obj)
// 				all.push(promise)				
// 			})
// 			return Promise.all(all)
// 		})
// 	})

// const getEntity = async (text) => {
// 	const key = process.env.NATURAL_LANGUAGE_API_KEY
// 	const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`
// 	const entitied = await axios.post(url,{
// 									"document": {
// 										"type": "PLAIN_TEXT",
// 										"language": "JA",
// 										"content": text
// 								    },
// 									"encodingType":"UTF8"
// 							    },
// 								{
// 									headers: { "Content-type": "application/json" }
// 								}
// 								);
// 	return entitied
// }

// const getFromApi = async () => {
// 	const key = process.env.NATURAL_LANGUAGE_API_KEY
//     const text = "吾輩は猫である。　名前はまだない。"
// 	const url = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`
// 	const options = {
// 		uri: url,
// 		header: { "Content-type": "application/json" },
// 		body: {
// 			"document": {
// 				"type": "PLAIN_TEXT",
			// 	"language": "JA",
			// 	"content": text
			// }
// 		},
// 		json: true
// 	}
//     const entitied = await axios.post(
// 		`https://language.googleapis.com/v1/documents:analyzeEntities?key=${key}`,
// 		{
// 			"document": {
// 				"type": "PLAIN_TEXT",
// 				"language": "JA",
// 				"content": text
// 			}
// 		})
// 	return entitied	
// }

// exports.api = functions.https.onRequest(async (req,res) => {
// 	const response = await getEntity("吾輩は猫である。名前はまだない。");
// 	res.header('Access-Control-Allow-Origin', "*");
// 	res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
// 	res.send(response)
// });

//

// const client = new twitter({
// 	  consumer_key: process.env.TWITTER_API_KEY,　　
// 	  consumer_secret: process.env.TWITTER_API_SECRETKEY,
// 	  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
// 	  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
// });
	
// const params = {
// 	  id: 23424856
// };

// exports.getTwitter = functions.https.onCall(async (data, context) => {
// 	const trends = await client.get('trends/place', params)
// 	return { trends } 
// })

// exports.getRanking = functions.https.onCall(async (data, context) => {
// 	const client = await google.auth.getClient({
//        keyFile: './key.json',
//        scopes: 'https://www.googleapis.com/auth/analytics.readonly'
//     })

// 	const analyticsreporting = google.analyticsreporting({
// 		version: 'v4',
// 		auth: client
// 	})

// 	const res = await analyticsreporting.reports.batchGet({
// 		requestBody: {
// 		  reportRequests: [
// 			{
// 			  viewId: process.env.VIEW_ID,  // メモしたGoogle Analyticsの ビューIDを入力
// 			  dateRanges: [ // 過去30日を集計対象とする
// 				{
// 				  startDate: '30daysAgo',
// 				  endDate: '1daysAgo'
// 				}
// 			  ],
// 			  dimensions: [ // ページパスをディメンションにする
// 				{
// 				  name: 'ga:pagePath'
// 				}
// 			  ],
// 			  metrics: [ // 利用する指標
// 				{
// 				  expression: 'ga:pageviews'  // ページビューを指標として利用
// 				}
// 			  ],
// 			  orderBys: { // ソート順
// 				fieldName: 'ga:pageviews', // ページビューでソート
// 				sortOrder: 'DESCENDING'  // 降順でソートする設定
// 			  },
// 			  pageSize: 3 // レスポンス件数を3件に
// 			}
// 		  ]
// 		}
// 	})

// 	return { res }
// })




// exports.twitter = functions.region('asia-northeast1').https.onRequest(async(req, res) => {
// 		const te = await client.get('trends/place', params)
// 		res.header('Access-Control-Allow-Origin', "*"); 
// 		res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
//         res.send(te);
// })


