const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express()
app.use(cors())
app.use(bodyParser.json())
const prot = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send(`<h2>Hello Node</h2>`)
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhub4.mongodb.net/${process.env.DB_PASS_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const eventCollection = client.db("volunteer").collection("events");

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log('add new event', newEvent)
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })


    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.delete('/deleteEvent/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        eventCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(documents.value))
    })
});



app.listen(prot)