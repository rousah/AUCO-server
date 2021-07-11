// --------------------------------------------------------
// Emilia Rosa van der Heide
// Unit tests for AUCO server for /questionnaire
// questionnaireTests.js
// --------------------------------------------------------

// --------------------------------------------------------
// --------------------------------------------------------
var assert = require('chai').assert;
var expect = require('chai').expect;
const request = require('request');

// --------------------------------------------------------
// --------------------------------------------------------
const port = process.env.PORT || 8081;
const address = "http://localhost:" + port + '/questionnaire';

// --------------------------------------------------------
// main ()
// --------------------------------------------------------

describe("Test 3: Questionnaires", function () {

	// ....................................................
	// Create questionnaires
	// ....................................................
	it("test POST /create", function (done) {
		request.post( // petition: POST
			{
				url: address + "/create",
			},
			// callback for when we get a response
			function (err, response, body) {
				assert.equal(err, null, "Error isn't null: " + err)
				assert.equal(response.statusCode, 200,
					"Response code isn't 200: " + response.statusCode);

				console.log(" ----- response for POST /questionnaire/create ---- ")
				console.log(" Response: " + JSON.parse(body).message);
				console.log(" -------------------------------------------------- ")

				//
				//
				//
				done()
			}
		) // post
	}) // it
}) // describe