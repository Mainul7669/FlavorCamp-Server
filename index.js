const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zyio3kh.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
  
      const toysCollection = client.db("toysDB").collection("toys");
      const MyToysCollection = client.db("toysDB").collection("MyToys");
  
      // For Category Section
      app.get("/toys", async (req, res) => {
        const cursor = toysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
  
      app.get("/toys/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await toysCollection.findOne(query);
        res.send(result);
      });



      // For My Toys

    app.get("/MyToys", async (req, res) => {
        const cursor = MyToysCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
  
      app.get("/MyToys/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await MyToysCollection.findOne(query);
        res.send(result);
      });
  
          // to get user email
          app.get("/MyToys/:email", async (req, res) => {
            console.log(req.params.email);
            const toys = await MyToysCollection.find({
              sellerEmail: req.params.email,
            }).toArray();
            res.send(toys);
          });
  
      app.post("/MyToys", async (req, res) => {
        const newToy = req.body;
        console.log(newToy);
        const result = await MyToysCollection.insertOne(newToy);
        res.send(result);
      });
  
  
      app.put("/MyToys/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        console.log(body);
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            quantity: body.quantity,
            price: body.price,
            description: body.description,
          },
        };