// --------------------------------------------------------
// Emilia Rosa van der Heide
// Unit tests for AUCO server for /class
// classTest.js
// --------------------------------------------------------

// --------------------------------------------------------
// --------------------------------------------------------
var assert = require('chai').assert;
var expect = require('chai').expect;
const request = require('request');

// --------------------------------------------------------
// --------------------------------------------------------
const port = process.env.PORT || 8082;
const address = "http://localhost:" + port + '/class';

// --------------------------------------------------------
// main ()
// --------------------------------------------------------

describe("Test 2: Classes", function () {

	// ....................................................
	// Create class with incorrect form information
	// ....................................................
	it("test POST /create", function (done) {
		request.post( // petition: POST
			{
				url: address + "/create",
                form: true,
                formData: { // empty to create error 
                }
			},
			// callback for when we get a response
			function (err, response, body) {
				assert.equal(err, null, "Error isn't null: " + err)
				assert.equal(response.statusCode, 400,
					"Response code isn't 400: " + response.statusCode);

				console.log(" ----- response for POST /class/create ---- ")
				console.log(" Message: " + JSON.parse(body).message);
				console.log(" ------------------------------------------- ")

				//
				//
				//
				done()
			}
		) // post
	}) // it 
}) // describe