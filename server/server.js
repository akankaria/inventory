var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var globalDb;
var app = express();
var formidable = require('formidable')
var path = require('path')
var fs = require('fs');
var csvFileName = '';
var serverName = 'ec2-54-202-82-15.us-west-2.compute.amazonaws.com';

var url = 'mongodb://' + serverName + ':27017/inventory';
app.use(bodyParser())

// Connect to the mongoDB instance on which the database is hosted
MongoClient.connect(url, function(err, db) {

    assert.equal(null, err);
    //console.log("Connected correctly to server.");
    globalDb = db;
});

// Expose an POST endpoint which will upload the CSV file
app.post('/uploadCSVFile', function(req, res) {

    // Allow access from different domain
    res.header('Access-Control-Allow-Origin', "*");

    // File upload
    var form = new formidable.IncomingForm()
    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = "."
    form.parse(req, (err, fields, files) => {

        if (err)
            return res.status(500).json({
                error: err
            })

        fs.readFile(csvFileName, 'utf8', function(err, data) {

            if (err) {
                return console.log(err);
            }

            // Delete the collection - At a given time the DB will only contain data from one CSV file
            globalDb.collection('inventoryLog').remove({});
            var lines = JSON.stringify(data).split("\\n");
            for (var i = 1; i < lines.length; i++) {
                var json = getJson(lines[i]);
                try {
                    // insert the data in to database
                    globalDb.collection('inventoryLog').insertOne(JSON.parse(json));
                } catch (err) {
                    console.log(err)
                }
            }
        });

        // Upload successful
        res.status(200).json({
            uploaded: true
        })
    });

    // Create the uploaded file
    form.on('fileBegin', function(name, file) {
        const [fileName, fileExt] = file.name.split('.')
        file.path = path.join(".", `${fileName}_${new Date().getTime()}.${fileExt}`)
        csvFileName = file.path;
    });
});

// POST endpoint to direct Upload the CSV data
app.post('/uploadCSVData', function(req, res) {

    // Allow access
    res.header('Access-Control-Allow-Origin', "*");

    var csvData = req.body;
    var lines = JSON.stringify(csvData).split("\\n");
    for (var i = 1; i < lines.length; i++) {
        var json = getJson(lines[i]);

        try {
            globalDb.collection('inventoryLog').insertOne(JSON.parse(json));
        } catch (err) {
            console.log(err)
        }
    }

    res.send('Done');
})


// GET endpoint to perform search operation on the DB
app.get('/search', function(req, res) {

    // Allow access to different domain
    res.header('Access-Control-Allow-Origin', "*");

    var timestamp = parseInt(req.param('timestamp'));
    var outp;
    // mongo DB search query using nodeJS driver
    globalDb.collection('inventoryLog', function(err, collection) {
        collection.find({
            "object_type": req.param('type'),
            "object_id": req.param('id'),
            "timestamp": {
                $lt: parseInt(req.param('timestamp')) + 1
            }
        }, function(err, cursor) {

            cursor.sort({
                "timestamp": -1
            });

            cursor.toArray(function(err, items) {
                if (err || items.length == 0)
                    res.send({
                        "output": ""
                    });
                else
                    res.send({
                        "output": items[0].object_changes
                    });
            });

        });
    });
});

// Start the nodeJS server to accept connect requests from the webpage
var server = app.listen(80, serverName, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

// Function to convert one line of CSV into JSON as required by mongoDB
function getJson(line) {
    var fields = line.toString().split(",");

    // Handle comma in object_state column
    var tmp = fields[3];
    for (var j = 4; j < fields.length; j++) {
        tmp = tmp + "," + fields[j];
    }

    tmp = tmp.replace(/\\/g, "");
    tmp = tmp.replace(/"/g, "'");

    var json = '{' + '"object_id" : "' + fields[0] + '",' + '"object_type" : "' + fields[1] + '",' + '"timestamp" : ' + parseInt(fields[2]) + ',' +
        '"object_changes" : "' + tmp + '"}';

    return json;
}