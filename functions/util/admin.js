const admin = require('firebase-admin');

admin.initializeApp(); // normally we would pass en argument, but our project already knows what up

const db = admin.firestore();

module.exports = { admin, db }