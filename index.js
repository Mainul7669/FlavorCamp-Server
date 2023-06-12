const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config()
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)

//middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khwex9e.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // ========================================================================
        // database collection
        const classCollection = client.db("campDb").collection("class")
        const instuctorCollection = client.db("campDb").collection("instuctor")
        const cartCollection = client.db("campDb").collection("carts");
        const userCollection = client.db("campDb").collection("users");

        const paymentCollection = client.db("campDb").collection("payments");



        // -------------------------

        // -----------------
        // for class

        app.get('/class', async (req, res) => {
            const result = await classCollection.find().toArray()
            res.send(result)
        })


        app.post('/class', async (req, res) => {
            const newClass = req.body
            const result = await classCollection.insertOne(newClass)
            res.send(result)

        })

        app.patch('/class/approved/:id', async (req, res) => {

            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    statusbar: 'approved'
                }
            }
            const result = await classCollection.updateOne(filter, updateDoc)
            res.send(result)

        })


        app.patch('/class/deny/:id', async (req, res) => {

            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    statusbar: 'deny'
                }
            }
            const result = await classCollection.updateOne(filter, updateDoc)
            res.send(result)

        })



        // for instuctor


        app.get('/instuctor', async (req, res) => {
            const result = await instuctorCollection.find().toArray()
            res.send(result)
        })

        // for user / student

        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query)
            console.log('existingUser:', existingUser);
            if (existingUser) {
                return res.send({ message: 'User Already Exist' })
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })



