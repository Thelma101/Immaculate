const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphandlebars = require('express-handlebars')
const path = require('path')
require('dotenv').config()
const taskmodel = require('./model/taskmodel')
const PORT = process.env.PORT || 3000

const url = process.env.MONGODB_URI
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(`Error connecting to MongoDB: ${err}`)
})

// app engine
app.engine('hbs', exphandlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}))

// view engine
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('index')
}) 
app.post('/', async (req, res) => {
    console.log(req.body)
    res.redirect('/')
})
app.listen(PORT, () => {
    console.log(`Application server is running on port ${PORT}`)
})