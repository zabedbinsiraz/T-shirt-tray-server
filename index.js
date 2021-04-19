const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 4444
require('dotenv').config()

const app = express()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ruwh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 
  const serviceCollection = client.db("Plumbing-Hero").collection("services");
 


  app.get('/services',(req,res) => {
    serviceCollection.find()
    .toArray((err,documents) => {
      res.send(documents)
    })
  })
  

  app.get('/service/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    serviceCollection.find({_id:id})
    .toArray((err, item) =>{
      res.send(item[0])
    })
  })
  

  app.post('/addService',(req,res)=>{
    const newService = req.body;
    
    serviceCollection.insertOne(newService)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      // res.send(result.insertedCount > 0)
      res.redirect('/')
    })
  })



  app.delete('/deleteService/:id',(req,res) => {
    const id = ObjectId(req.params.id)
    console.log(id)
    serviceCollection.deleteOne({_id:id})
    .then(result => {
         res.send(result.deletedCount > 0)
    })
  })
   
});

client.connect(err => {

  const orderCollection = client.db("Plumbing-Hero").collection("orders");

  app.get('/allOrders',(req,res) => {
    orderCollection.find({buyerEmail: req.query.email})
    .toArray((err,orders) => {
      //  console.log(orders)
       res.send(orders)
    })
  })
  app.get('/orders',(req,res) => {
    orderCollection.find()
    .toArray((err,allOrders) => {
      //  console.log(allOrders)
       res.send(allOrders)
    })
  })

  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  }) 
});

client.connect(err => {

  const reviewCollection = client.db("Plumbing-Hero").collection("reviews");

  app.get('/allReviews',(req,res) => {
    reviewCollection.find()
    .toArray((err,reviews) => {
      //  console.log(reviews)
       res.send(reviews)
    })
  })

  app.post('/addReview',(req,res)=>{
    const newReview = req.body;
    
    reviewCollection.insertOne(newReview)
    .then(result => {
      console.log('inserted one', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  }) 
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)