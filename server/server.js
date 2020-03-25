const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./models/product')
const One = require('./models/one')
const New = require('./models/new')
app.use(express.json())
mongoose.connect('mongodb+srv://worrada:020542@cluster0-eeqkc.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
// สร้าง database schema
const Cat = mongoose.model('Cat', { name: String })

// สร้าง instance จาก model
const kitty = new Cat({ name: 'JavaScript' })

// save ลง database (return เป็น Promise)
kitty.save().then(() => console.log('meow'))
const products = [{
   
  }]
  
  app.get('/bisect', async (req, res) => {
    const products = await Product.findOne({ id: Math.floor(Math.random() * 2 + 1) })
    res.json(products)
  })
  app.get('/false', async (req, res) => {
    const products = await Product.findOne({ id: Math.floor(Math.random() * 2 + 1) })
    res.json(products)
  })
  app.get('/onepoint', async (req, res) => {
    const onep = await One.findOne({ id: Math.floor(Math.random() * 2 + 1) })
    res.json(onep)
  })
  app.get('/newton', async (req, res) => {
    const newr = await New.findOne({ id: Math.floor(Math.random() * 2 + 1) })
    res.json(newr)
  })

  app.get('/products/:id', (req, res) => {
    const { id } = req.params
    const result = products.find(product => product.id === id)
    res.json(result)
  })
  
  app.post('/bisect', async (req, res) => {
    const payload = req.body
    const product = new Product(payload)
    await product.save()
    res.status(201).end()
  })
  app.post('/onepoint', async (req, res) => {
    const payload = req.body
    const onep = new One(payload)
    await onep.save()
    res.status(201).end()
  })
  app.post('/newton', async (req, res) => {
    const payload = req.body
    const newr = new New(payload)
    await newr.save()
    res.status(201).end()
  })
  
  app.put('/products/:id', (req, res) => {
    const { id } = req.params
    res.json({ id })
  })
  
  app.delete('/products/:id', (req, res) => {
    const { id } = req.params
    res.json({ id })
  })
  
  app.listen(9000, () => {
    console.log('Application is running on port 9000')
  })