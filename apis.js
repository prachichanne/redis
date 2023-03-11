const express = require("express");
const bodyParser = require("body-parser")
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./creds.json');
const axios = require('axios');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://loginuser-68d6a-default-rtdb.firebaseio.com'

});

const db = admin.firestore();
// var redis = require("redis");

// const session = require('express-session');
// const connectRedis = require('connect-redis');

// const RedisStore = connectRedis(session)

// New app using express module
const app = express();

const request = require('request');
const XLSX = require('xlsx');
var jsonParser = bodyParser.json()
app.use(cors());

app.use(bodyParser.urlencoded({
	extended: true
}));




//create client
// const client = redis.createClient({
// 	socket: {
// 		host: '127.0.0.1',
// 		port: '6379'
// 	}

// });

// client.connect();

// client.on("connect", function () {
// 	console.log("Redis Connection Successful!!");
// });

const uid = (() => (id = 1, () => id++))();

app.use(express.static('public'));

// app.get("/", function(req, res) {
// res.sendFile(__dirname + "/index.html");
// });


app.post("/postApi", jsonParser, function (req, res) {

	var url = req.body.data_url;



	request.get({ url, encoding: null }, (error, response, body) => {
		if (error) {
			console.error(error);
			return;
		}
		const workbook = XLSX.read(body, { type: 'buffer' });
		console.log(url)
		//var firstsheetName = workbook.SheetNames[0];
		//const worksheet = workbook.Sheets[firstsheetName];
		//var range = XLSX.utils.decode_range(worksheet['!ref']);
		//var sheetData = XLSX.utils.sheet_to_json(worksheet, { range: 1 });

		//var sheetData = XLSX.utils.sheet_to_row_object_array(worksheet, { range: 1 });

		//const totalRows = sheetData.length;
		//console.log(range);

		 const collectionRef = db.collection('myDatabase');

		 var result = {}
		workbook.SheetNames.forEach(function (sheetName) {

			

			var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
			if (roa.length > 0) {
				result[sheetName] = roa

			}
			

		})
		collectionRef.add(result);



		// sheetData.forEach((doc) => {
		// 	collectionRef.add(doc);
		// });

		// for (let i = 0; i < 5; i++) {

		// 	//let key = uid();
		// 	var col_obj = sheetData[i];


		// 	//key-url
		// 	// client.hSet('integrate', key, JSON.stringify(Object.values(col_obj)), (err, reply) => {
		// 	// 	if (err) {
		// 	// 		console.error(err);
		// 	// 	} else {
		// 	// 		console.log("reply"); // Output: OK
		// 	// 	}
		// 	// });
		// 	// console.log(Object.values(col_obj));
		// 	console.log(JSON.stringify(col_obj));

		// }



		//console.log(col_obj);




		// var num2 = Number(req.body.num2);

		//var result = num1 + num2 ;

		//console.log("url is " + JSON.stringify(url))

		res.send(url)
		//res.status(200).send(url);

	});
});


	app.delete('/deleteApi', jsonParser, function (req, res) {

		const collectionRef = db.collection('myDatabase');

		collectionRef.get().then((snapshot) => {
			const batch = db.batch();
			snapshot.docs.forEach((doc) => {
				batch.delete(doc.ref);
			});
			return batch.commit();
		}).then(() => {
			console.log('All documents deleted successfully.');
		}).catch((error) => {
			console.error('Error deleting documents:', error);
		});

	})

	app.listen(5600, function () {
		console.log("server is running on port 5600");
	})
