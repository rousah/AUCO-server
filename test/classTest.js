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
let createdClassId;
let createdReportId;


fs = require('fs');
path = require('path');

// --------------------------------------------------------
// --------------------------------------------------------
const port = process.env.PORT || 8081;
const address = "http://localhost:" + port + '/class';

// --------------------------------------------------------
// main ()
// --------------------------------------------------------

describe("Test 2: Classes", function () {

    // ....................................................
    // Create class with incorrect form information
    // ....................................................
    it("test POST /create incorrect form information", function (done) {
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

    // ....................................................
    // Create class with incorrect xlxs file
    // ....................................................
    it("test POST /create incorrect xlxs file", function (done) {
        request.post( // petition: POST
            {
                url: address + "/create",
                form: true,
                formData: {
                    withFile: 'true',
                    selectedFile: 'not a file',
                    userId: '60eab616bb6dc87704ebd52f',
                    classname: 'clase test',
                    year: '2º'
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

    // ....................................................
    // Create class correctly with xlxs file
    // ....................................................
    /*   it("test POST /create with xlxs file", function (done) {
           request.post( // petition: POST
               {
                   url: address + "/create",
                   form: true,
                   formData: {
                       withFile: 'true',
                       selectedFile: fs.createReadStream(path.join(__dirname, 'studentstest.xlsx')),
                       userId: '60ab7e75a2e3310990a6186d',
                       classname: 'clase test',
                       year: '2º'
                   }
               },
               // callback for when we get a response
               function (err, response, body) {
                   assert.equal(err, null, "Error isn't null: " + err)
                   assert.equal(response.statusCode, 200,
                       "Response code isn't 200: " + response.statusCode);
   
                   console.log(" ----- response for POST /class/create ---- ")
                   console.log(" Class id: " + JSON.parse(body).newClass);
                   console.log(" ------------------------------------------- ")
   
                   //
                   //
                   //
                   done()
               }
           ) // post
       }).timeout(10000); // it, timeout because this call takes very long and if we don't do this we get timeout error after 2s 
   */
    // ....................................................
    // Create class correctly without xlxs file and without students
    // ....................................................
    it("test POST /create without xlxs file and without students", function (done) {
        request.post( // petition: POST
            {
                url: address + "/create",
                form: true,
                formData: {
                    withFile: 'false',
                    selectedFile: fs.createReadStream(path.join(__dirname, 'studentstest.xlsx')),
                    userId: '60eab616bb6dc87704ebd52f',
                    classname: 'clase test',
                    year: '2º'
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

    // ....................................................
    // Create class correctly without xlxs file but with students
    // ....................................................
    it("test POST /create without xlxs file but with students", function (done) {
        const students = [
            { name: "maria", surname: "valverde" },
            { name: "juanjo", surname: "del valle" }
        ]

        request.post( // petition: POST
            {
                url: address + "/create",
                form: true,
                formData: {
                    withFile: 'false',
                    students: JSON.stringify(students),
                    userId: '60eab616bb6dc87704ebd52f',
                    classname: 'clase test',
                    year: '2º'
                }
            },
            // callback for when we get a response
            function (err, response, body) {
                let parsedBody = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);

                console.log(" ----- response for POST /class/create ---- ")
                console.log(" New class id: " + parsedBody.newClass);
                console.log(" ------------------------------------------- ")

                createdClassId = parsedBody.newClass;
                //
                //
                //
                done()
            }
        ) // post
    }) // it

    // ....................................................
    // Get classes with teacher id
    // ....................................................
    it("test GET /classes/:id with teacher id", function (done) {
        request.get( // petition: GET
            {
                url: address + "/classes/" + "60eab616bb6dc87704ebd52f",
            },
            // callback for when we get a response
            function (err, response, body) {
                parsedBody = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);
                assert.equal(parsedBody.length, 1,
                    "Response length isn't 1: " + parsedBody.length);

                console.log(" ----- response for POST /class/classes/:id ---- ")
                console.log(" Classes: " + parsedBody.length);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // get
    }) // it

    // ....................................................
    // Get classes with nonexisting teacher id
    // ....................................................
    it("test GET /classes/:id with nonexisting teacher id", function (done) {
        request.get( // petition: GET
            {
                url: address + "/classes/" + "60eab616bb6dc87704ebd52fe",
            },
            // callback for when we get a response
            function (err, response, body) {
                parsedBody = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 400,
                    "Response code isn't 400: " + response.statusCode);

                console.log(" ----- response for POST /class/classes/:id ---- ")
                console.log(" Message: " + parsedBody.message);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // get
    }) // it

    // ....................................................
    // Get class with id
    // ....................................................
    it("test GET /:id", function (done) {
        request.get( // petition: GET
            {
                url: address + "/" + createdClassId,
            },
            // callback for when we get a response
            function (err, response, body) {
                parsedBody = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);
                assert.equal(parsedBody.myClass._id, createdClassId, "Not correct id: " + parsedBody._id);

                console.log(" ----- response for POST /class/:id ---- ")
                console.log(" Class name: " + parsedBody.name);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // get
    }) // it

    // ....................................................
    // Get class with incorrect id
    // ....................................................
    it("test GET /:id incorrect", function (done) {
        request.get( // petition: GET
            {
                url: address + "/" + "12345",
            },
            // callback for when we get a response
            function (err, response, body) {
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 400,
                    "Response code isn't 400: " + response.statusCode);

                console.log(" ----- response for POST /class/:id ---- ")
                console.log(JSON.parse(body).message);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // get
    }) // it

    // ....................................................
    // Create report with wrong body
    // ....................................................
    it("test POST /:id/create-report wrong body", function (done) {
        request.post( // petition: POST
            {
                url: address + "/" + createdClassId + '/create-report',
                json: true,
                body: {}
            },
            // callback for when we get a response
            function (err, response, body) {
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 400,
                    "Response code isn't 400: " + response.statusCode);

                console.log(" ----- response for POST /class/:id/create-report wrong body ---- ")
                console.log(body.message);
                console.log(" --------------------------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // post
    }) // it

    // ....................................................
    // Create report correctly
    // ....................................................
   it("test POST /:id/create-report", function (done) {
           request.post( // petition: POST
               {
                   url: address + "/" + createdClassId + '/create-report',
                   json: true,
                   body: {
                       id_student: '60ad12443da81f08360c165b',
                       name: 'Stefano Gallardo Pedroza',
                       incident: true,
                       details: 'details'
                   }
               },
               // callback for when we get a response
               function (err, response, body) {
                   assert.equal(err, null, "Error isn't null: " + err)
                   assert.equal(response.statusCode, 200,
                       "Response code isn't 200: " + response.statusCode);
   
                   console.log(" ----- response for POST /class/:id/create-report ---- ")
                   console.log("Report id created: " + body.reportId);
                   console.log(" ----------------------------------------------------- ")
                   createdReportId = body.reportId;
   
                   //
                   //
                   //
                   done()
               }
           ) // post
       }) // it
   
       // ....................................................
       // Delete report created
       // ....................................................
       it("test DELETE /delete-report/:id", function (done) {
           request.delete( // petition: DELETE
               {
                   url: address + "/delete-report/" + createdReportId,
               },
               // callback for when we get a response
               function (err, response, body) {
                   assert.equal(err, null, "Error isn't null: " + err)
                   assert.equal(response.statusCode, 200,
                       "Response code isn't 200: " + response.statusCode);
   
                   console.log(" ----- response for DELETE /class/delete-report/:id ---- ")
                   console.log(JSON.parse(body).message);
                   console.log(" ------------------------------------------- ")
   
                   //
                   //
                   //
                   done()
               }
           ) // post
       }) // it 
   
       // ....................................................
       // Delete class from id
       // ....................................................
       it("test DELETE /:id", function (done) {
           request.delete( // petition: DELETE
               {
                   url: address + "/delete/" + createdClassId,
               },
               // callback for when we get a response
               function (err, response, body) {
                   assert.equal(err, null, "Error isn't null: " + err)
                   assert.equal(response.statusCode, 200,
                       "Response code isn't 200: " + response.statusCode);
   
                   console.log(" ----- response for DELETE /class/delete/:id ---- ")
                   console.log(JSON.parse(body).message);
                   console.log(" ------------------------------------------- ")
   
                   //
                   //
                   //
                   done()
               }
           ) // post
       }) // it 

}) // describe