const mongoose = require('mongoose')
const  UserType = require('../models/user-type')


// //setting up DB
// dbURL = 'mongodb://nedu10:chukwuemeka11@ds163156.mlab.com:63156/project-pos'  //locally installed mongodb

// mongoose.connect(dbURL, {useNewUrlParser: true})
// mongoose.connect(dbURL)
// mongoose.Promise = global.Promise;

// // mongoose.Promise = global.Promise;




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