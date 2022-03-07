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

exports.saveList = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    const listID = data.listID;
    return admin.database().ref(userID + "/" + listID)
        .set({list: data.list, name: data.name, ol: data.ol}).then(() => {
          console.log("List saved by " + userID + ": " + listID);
        });
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});

exports.makeList = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    let listID;
    if (data.listID == null) {
      listID = makeID(6);
    } else {
      listID = data.listID;
    }
    return admin.database().ref(userID + "/" + listID)
        .set({list: data.list, name: data.name, ol: data.ol}).then(() => {
          console.log("List created by " + userID + ": " + listID);
        });
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});

exports.deleteList = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    const listID = data.listID;

    return admin.database().ref(userID + "/" + listID).remove().then(() => {
      console.log("List deleted by " + userID + ": " + listID);
    });
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});

exports.updateName = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    return admin.database().ref(userID + "/name").set(data.name).then(() => {
      console.log(userID + " name updated to " + data.name);
    });
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});

const makeID = (length) => {
  let result = "";
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = c.length;
  for ( let i = 0; i < length; i++ ) {
    result += c.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
