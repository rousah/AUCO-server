// --------------------------------------------------------
// Emilia Rosa van der Heide
// Unit tests for AUCO server for /student
// studentTests.js
// --------------------------------------------------------

// --------------------------------------------------------
// --------------------------------------------------------
var assert = require('chai').assert;
const request = require('request');
let createdClassId;
let createdReportId;


fs = require('fs');
path = require('path');

// --------------------------------------------------------
// --------------------------------------------------------
const port = process.env.PORT || 8081;
const address = "http://localhost:" + port + '/student';

// --------------------------------------------------------
// main ()
// --------------------------------------------------------

describe("Test 4: Students", function () {

    let studentid = "60c260d7c0cd6a2fe662729e"
    // ....................................................
    // Get student with student id
    // ....................................................
    it("test GET /:id ", function (done) {
        request.get( // petition: GET
            {
                url: address + "/" + studentid,
            },
            // callback for when we get a response
            function (err, response, body) {
                let student = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);
                assert.equal(student._id, studentid, "Id isn't correct: " + student._id)

                console.log(" ----- response for GET /student/:id ---- ")
                console.log(" Student id: " + student._id);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // post
    }) // it 

    // ....................................................
    // Get student gamification info with student id
    // ....................................................
    it("test GET /gamification/:id ", function (done) {
        request.get( // petition: GET
            {
                url: address + "/gamification/" + studentid,
            },
            // callback for when we get a response
            function (err, response, body) {
                let student = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);
                assert.equal(student.id_student, studentid, "Id isn't correct: " + student.id_student);

                console.log(" ----- response for GET /student/gamification/:id ---- ")
                console.log(" Student id of gamification: " + student.id_student);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // post
    }) // it 

}) // describe