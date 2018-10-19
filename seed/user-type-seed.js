const mongoose = require('mongoose')
const  UserType = require('../models/user-type')

//setting up DB
dbURL = 'mongodb://127.0.0.1:27017/shopping-cart'  //locally installed mongodb

mongoose.connect(dbURL, {useNewUrlParser: true})
mongoose.Promise = global.Promise;



const user_type = new UserType({
    name: 'user'
})


console.log('mmm')
user_type.save()
.then(res => {
    console.log(res)
})
.catch( err => {
    console.log(err)
})