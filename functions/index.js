const functions = require("firebase-functions");
const app = require("express")();
const FBAuth = require("./util/fbAuth");
const { db } = require("./util/admin");
const {
  getAllPosts,
  postOnePost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost,
} = require("./handlers/posts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

// Posts routes
app.get("/posts", getAllPosts); //getting  all posts from database
app.post("/post", FBAuth, postOnePost); //posting new post
app.get("/post/:postId", getPost);
app.post("/post/:postId/comment", FBAuth, commentOnPost);
app.get("/post/:postId/like", FBAuth, likePost);
app.get("/post/:postId/unlike", FBAuth, unlikePost);
app.delete("/post/:postId", FBAuth, deletePost);

// Users routes
app.post("/signup", signup); //  Signup route
app.post("/login", login); // Login route
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

// one of the best practices is to add api/<sth> when you're describing api
// thats why we add the line below
// Here you can also change the region
exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        // eslint-disable-next-line promise/always-return
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            postId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        // dont need to return enything because its a db trigger not an endpoint
        return;
      });
  });

// When somebody unlikes the post, we dont want to send the notification that he liked it...
exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/posts/${snapshot.data().postId}`)
      .get()
      .then((doc) => {
        // eslint-disable-next-line promise/always-return
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            postId: doc.id,
          });
        }
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.error(err);
        // dont need to return enything because its a db trigger not an endpoint
        return;
      });
  });
