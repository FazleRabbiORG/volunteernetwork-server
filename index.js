const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectID;

const app = express();
// skejfkf

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const user = process.env.USER;
const userPassword = process.env.USER_PASSWORD;
const dbName = process.env.DB_NAME;

// console.log(user, userPassword, dbName);

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://fazlerabbi:fazlerabbi@cluster0.x4mku.mongodb.net/vulenteer-network?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     console.log('err',err)
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
// //   client.close();
// });

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${user}:${userPassword}@cluster0.x4mku.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);
// const client = new MongoClient(uri, { useUnifiedTopology: true}, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect((err) => {
//   console.log("err", err);
//   console.log("dont connected");
  const eventCollection = client.db(dbName).collection("events");
  const RegisteredEventCollection = client
    .db(dbName)
    .collection("registeredEvent");

  console.log("db connected");

  app.post("/addEvent", (req, res) => {
    console.log("addEvent");
    const event = req.body;
    console.log(event);
    eventCollection.insertOne(event).then((result) => {
      console.log("result");
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addRegisteredEvent", (req, res) => {
    const registeredEvent = req.body;
    console.log(registeredEvent);
    RegisteredEventCollection.insertOne(registeredEvent).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  // app.post('/adminAddEvent', (req, res) => {
  //     const registeredEvent = req.body;
  //     // console.log(registeredEvent);
  //     RegisteredEventCollection.insertOne(registeredEvent)
  //     .then(result => {
  //         res.send(result.insertedCount > 0)
  //     })
  // })

  app.get("/", (req, res) => {
    res.send("Hello World.");
  });

  app.get("/events", (req, res) => {
    eventCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/registeredEvent", (req, res) => {
    RegisteredEventCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    RegisteredEventCollection.deleteOne({ _id: ObjectId(req.params.id) }).then(
      (result) => {
        console.log(result);
        res.send(result.deletedCount > 0);
      }
    );
  });

//   console.log("done");
});

app.listen(process.env.PORT || 5000);
