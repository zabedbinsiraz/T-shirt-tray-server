const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5555
require('dotenv').config()

const app = express()

// https://github.com/Porgramming-Hero-web-course/full-stack-client-zabedbinsiraz

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ruwh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const tShirtCollection = client.db("tShirtShop").collection("tShirts");
 


  app.get('/tShirts',(req,res) => {
    tShirtCollection.find()
    .toArray((err,shirts) => {
      res.send(shirts)
    })
  })

  app.get('/tShirt/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    tShirtCollection.find({_id:id})
    .toArray((err, shirt) =>{
      res.send(shirt[0])
    })
  })

  app.post('/addProduct',(req,res)=>{
    const newShirt = req.body;
    
    tShirtCollection.insertOne(newShirt)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })



  app.delete('/deleteProduct/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    console.log(id)
    tShirtCollection.deleteOne({_id:id})
    .then(result => {
         res.send(result.deletedCount > 0)
    })
  })
   
});

client.connect(err => {

  const orders = client.db("tShirtShop").collection("orders");

  app.get('/allOrders',(req,res) => {
    orders.find({})
    .toArray((err,documents) => {
     console.log(documents)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    
    orders.insertOne(newOrder)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  }) 

 

})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)