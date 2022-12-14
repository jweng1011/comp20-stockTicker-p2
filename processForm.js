const express = require("express");
const bodyParser = require("body-parser");
var path = require('path');
var __dirname = path.resolve();

const mongodb = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://jenniferw:Wsnx1c9J0sKO6sO3@equities.smk0n2x.mongodb.net/?retryWrites=true&w=majority";

var app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.post('/process', (req, res) => {
    var query = req.body.query;
    var queryType = req.body.queryType;
    const queryObj = {[queryType]: query};
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(uri, {useUnifiedTopology: true}, (err, db) => {
        if (err) {
            throw err;
        }
        var dbo = db.db("equities");
        dbo.collection("equities").find(queryObj).toArray((err, result) => {
            if (err) throw err;
            res.send(parseData(result));
            db.close();
        });
    })
})

function parseData(dataArr) {
    var pdata = "";
    if (dataArr.length === 0) {
        pdata = "<p>No documents found!</p>";
        return pdata;
    } 
    dataArr.forEach((obj) => {
        console.log(obj);
        var company = obj.Company;
        var ticker = obj.Ticker;
        pdata += "<p>" 
        pdata += company;
        pdata += " ";
        pdata += ticker;
        pdata += "</p>";
    })
    return pdata;
}

app.listen(port);