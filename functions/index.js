const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createUserInDatabase = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    admin.database().ref(userID + "/" + userID).set(userID);
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});
