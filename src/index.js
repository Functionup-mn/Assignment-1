const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const route = require('./Routes/route')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://mnadeem:h1QaS5NNUx2zm2tM@cluster0.v4od3qa.mongodb.net/Assignment",
{useNewUrlParser: true})

.then(() => console.log('MongoDB is Connected'))
.catch((error)=> console.log(error.message))

app.use('/',route)  

// app.use('/', (req, res)=>{
//     res.send("Welcome to the server home page")
// })

app.use( (req ,res) => {
    res.status(404).send({status : false , message :`Page Not Found , Given URL ${req.url} is incorrect for this application.`})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
