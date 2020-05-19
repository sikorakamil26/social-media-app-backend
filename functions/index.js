const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./util/fbAuth');
const { getAllPosts, postOnePost } = require('./handlers/posts');
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');

// Posts routes
app.get('/posts', getAllPosts) //getting  all posts from database
app.post("/post", FBAuth, postOnePost) //posting new post

// Users routes
app.post('/signup', signup)//  Signup route
app.post('/login', login) // Login route
app.post('/user/image',FBAuth , uploadImage)
app.post('/user', FBAuth, addUserDetails)

// one of the best practices is to add api/<sth> when you're describing api
// thats why we add the line below
// Here you can also change the region
exports.api = functions.region('europe-west1').https.onRequest(app);