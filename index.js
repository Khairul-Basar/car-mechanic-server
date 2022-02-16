const express = require('express')
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb');
// const {ObjectId} = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.BD_PASS}@cluster0.wv6nl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async() => {
    try{
        await client.connect()
        const database = await client.db('car-mechanic')
        const mechanicCollection = await database.collection('services')

        app.get('/services',async(req,res)=>{
            const cursor = await mechanicCollection.find({})
            const services = await cursor.toArray()
            res.json(services)
        })

        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await mechanicCollection.findOne(query)
            res.send(service)
        })

        app.post('/services',async(req,res)=>{
            const service = req.body
            const result = await mechanicCollection.insertOne(service)
            res.send(result)
        })

        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id
            const filter = {_id: ObjectId(id)}
            const result = await mechanicCollection.deleteOne(filter)
            res.send(result)
        })

    }finally{

    }
}

run().catch(console.dir)


app.get('/',async(req,res)=>{
    res.json("hello Server")
})
app.listen(port, ()=>{
    console.log("Server start in Port",port)
})