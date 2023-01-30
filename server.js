const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1:27017/signuploginDB', { useNewUrlParser: true }, () => { console.log("Database is now connected") });

const userSchema = mongoose.Schema({
    name: String,
    phone: Number,
    email: { type: String, index: true, unique: true },
    address: String,
    password: String
})
const user = mongoose.model('users', userSchema);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/v1/login', (req, res) => {
    
    user.findOne({ email: req.body.email }, function (err, result) {
        console.log(result);
        if (err) {
            console.log(err)
            res.status(400).send("Wrong credentials");

        } else if (result != null) {
            if (result.password == req.body.password) {
                res.status(200).send("ok");
            } else {
                res.status(400).send("Wrong credentials");
            }
        }
        else {
            res.status(400).send("Wrong credentials");
        }
    })


})

app.post('/api/v1/signup', (req, res) => {
    console.log("signup requested");
    const { name, phone, email, address, password } = req.body;
    const newUser = new user({
        name: name,
        phone: phone,
        email: email,
        address: address,
        password: password
    })
    newUser.save(function (err, result) {
        if (!err) {
            res.status(201).json(result);
        } else if (err.code == 11000) {
            console.log("Duplicate")
            res.status(409).send("Same email");
        } else {
            res.sendStatus(500);
        }
    })


})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})