// --------------------------------------------------------
// Emilia Rosa van der Heide
// Unit tests for AUCO server
// authTests.js
// --------------------------------------------------------

// --------------------------------------------------------
// --------------------------------------------------------
var assert = require('chai').assert;
const request = require('request');

// --------------------------------------------------------
// --------------------------------------------------------
const port = process.env.PORT || 8082;
const address = "http://localhost:" + port + '/user';

// --------------------------------------------------------
// main ()
// --------------------------------------------------------

describe("Test 1: Authentication", function () {

	// ....................................................
	// Register already existing teacher
	// ....................................................
	it("test POST /register", function (done) {
		request.post( // petition: POST
			{
				url: address + "/register",
				body: {
					'name': 'nametest', // required
					'surname': 'surnametest', // required
					// institution optional
					'email': 'test', // required, already exists
					'password': 'testingserver123' // required, min 8
				},
				json: true
			},
			// callback for when we get a response, should return 409 status because e-mail duplication
			function (err, response, body) {
				assert.equal(err, null, "Error isn't null: " + err);
				assert.equal(response.statusCode, 409,
					"Response code isn't 409: " + response.statusCode)

				console.log(" ------- response for POST /user/register ------ ")
				console.log(" Message: " + body.message);
				console.log(" ----------------------------------------------- ")

				//
				//
				//
				done()
			}
		) // post
	}) // it 

	// ....................................................
	// Register non-existing teacher
	// ....................................................
	it("test POST /register", function (done) {
		request.post( // petition: POST
			{
				url: address + "/register",
				body: {
					'name': 'nametest', // required
					'surname': 'surnametest', // required
					// institution optional
					'email': 'unittestuser@test.com', // required
					'password': 'testingserver123' // required, min 8
				},
				json: true
			},
			// callback for when we get a response
			function (err, response, body) {
				assert.equal(err, null, "Error isn't null: " + err)
				assert.equal(response.statusCode, 200,
					"Response code isn't 200: " + response.statusCode)

				console.log(" ----- response for POST /user/register ---- ")
				console.log(body)
				console.log(" ------------------------------------------- ")

				var user = body.userDetails
				assert.equal(user.name, "nametest")

				//
				//
				//
				done()
			}
		) // post
	}) // it 
}) // describe