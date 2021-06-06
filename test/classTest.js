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

fs = require('fs');
path = require('path');

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
                    userId: '60ab7e75a2e3310990a6186d',
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
                    userId: '60ab7e75a2e3310990a6186d',
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
                    userId: '60ab7e75a2e3310990a6186d',
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
                url: address + "/classes/" + "60ab7e75a2e3310990a6186d",
            },
            // callback for when we get a response
            function (err, response, body) {
                parsedBody = JSON.parse(body);
                assert.equal(err, null, "Error isn't null: " + err)
                assert.equal(response.statusCode, 200,
                    "Response code isn't 200: " + response.statusCode);
                assert.equal(parsedBody.length, 2,
                    "Response lenght isn't 2: " + parsedBody.length);

                console.log(" ----- response for POST /class/classes/:id ---- ")
                console.log(" Classes: " + parsedBody.length);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // post
    }) // it

    // ....................................................
    // Get classes with wrong teacher id
    // ....................................................
    it("test GET /classes/:id with wrong teacher id", function (done) {
        request.get( // petition: GET
            {
                url: address + "/classes/" + "60ab7e75a2e3310990a6186e",
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
        ) // post
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
                assert.equal(parsedBody._id, createdClassId, "Not correct id: " + parsedBody._id);

                console.log(" ----- response for POST /class/:id ---- ")
                console.log(" Class name: " + parsedBody.name);
                console.log(" ------------------------------------------- ")

                //
                //
                //
                done()
            }
        ) // post
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
                assert.equal(response.statusCode, 404,
                    "Response code isn't 404: " + response.statusCode);

                console.log(" ----- response for POST /class/:id ---- ")
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

    // ....................................................
    // Get classes with nonexistent id
    // ....................................................
    /*   it("test GET /:id nonexistent", function (done) {
           request.get( // petition: GET
               {
                   url: address + "/" + "60ad12443da81f08360c1651",
               },
               // callback for when we get a response
               function (err, response, body) {
                   assert.equal(err, null, "Error isn't null: " + err)
                   assert.equal(response.statusCode, 404,
                       "Response code isn't 404: " + response.statusCode);
   
                   console.log(" ----- response for POST /class/:id ---- ")
                   console.log(JSON.parse(body).message);
                   console.log(" ------------------------------------------- ")
   
                   //
                   //
                   //
                   done()
               }
           ) // post
       }) // it*/


}) // describe