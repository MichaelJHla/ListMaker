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
    console.log(data.collaborators);
    if (data.collaborators == undefined) {
      return admin.database().ref(userID + "/" + listID)
          .set({list: data.list,
            name: data.name,
            ol: data.ol}).then(() => {
            console.log("List saved by " + userID + ": " + listID);
          });
    } else {
      return admin.database().ref(userID + "/" + listID)
          .set({list: data.list,
            name: data.name,
            ol: data.ol,
            collaborators: data.collaborators}).then(() => {
            console.log("List saved by " + userID + ": " + listID);
          });
    }
  } else {
    throw new functions.https.HttpsError("unauthenticated");
  }
});

exports.saveCollaborativeList = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    const listID = data.listID;
    return admin.database().ref(data.userID + "/" + listID)
        .set({list: data.list,
          name: data.name,
          ol: data.ol,
          collaborators: data.collaborators}).then(() => {
          console.log("Collab list owned by " +
            data.userID + " saved by " + userID + ": " + listID);
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

exports.newCollaborator = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    const listID = data.listID;
    const newUser = data.newUser;
    return admin.auth().getUserByEmail(newUser).then((userRecord) => {
      const uRec = userRecord.toJSON();
      admin.database().ref(uRec.uid + "/collaborativeLists/" + listID)
          .set(userID);
      console.log("Passed check for user with " + uRec.email);
      return admin.database().ref(userID + "/" + listID +
      "/collaborators/" + uRec.uid).set(uRec.email);
    }).catch((error) => {
      console.log(error);
      throw new functions.https.HttpsError("failed-precondition");
    });
  }
});

exports.removeCollaborator = functions.https.onCall((data, context) => {
  if (context.auth) {
    const userID = context.auth.uid;
    const listID = data.listID;
    const removeUser = data.removeUser;
    console.log(data.removeUser);
    return admin.auth().getUserByEmail(removeUser).then((userRecord) => {
      const uRec = userRecord.toJSON();
      admin.database().ref(uRec.uid + "/collaborativeLists/" + listID).remove();
      console.log("Passed check for user with " + uRec.email);
      console.log("Pre-removal");
      return admin.database().ref(userID + "/" + listID +
      "/collaborators/" + uRec.uid).remove().then(() => {
        console.log("Remove collaborator " + removeUser + " from " +
        userID + "/" + listID);
      });
    }).catch((error) => {
      console.log(error);
      throw new functions.https.HttpsError("failed-precondition");
    });
  }
});

exports.updateEmailInDatabase = functions.https.onCall((data, context) => {
  if (context.auth) {
    const email = context.auth.token.email;
    const uid = context.auth.uid;
    console.log(email);
    admin.database().ref().once("value", (snapshot) => {
      const data = snapshot.val();
      for (const userID in data) {
        if (Object.prototype.hasOwnProperty.call(data, userID)) {
          for (const listID in data[userID]) {
            if (Object.prototype.hasOwnProperty.call(data[userID], listID)) {
              for (const collaborator in
                data[userID][listID]["collaborators"]) {
                if (Object.prototype.hasOwnProperty
                    .call(data[userID][listID]["collaborators"],
                        collaborator)) {
                  if (collaborator === uid) {
                    admin.database().ref(userID + "/" + listID +
                    "/collaborators/" + collaborator).set(email);
                  }
                }
              }
            }
          }
        }
      }
    });
  }
});

exports.removeUserFromDatabase = functions.auth.user().onDelete((user) => {
  console.log(user.uid + " deleted their account: " + user.email);
  admin.database().ref(user.uid).remove();
  admin.database().ref().once("value", (snapshot) => {
    const data = snapshot.val();
    for (const userID in data) {
      if (Object.prototype.hasOwnProperty.call(data, userID)) {
        for (const listID in data[userID]) {
          if (Object.prototype.hasOwnProperty.call(data[userID], listID)) {
            for (const collaborator in
              data[userID][listID]["collaborators"]) {
              if (Object.prototype.hasOwnProperty
                  .call(data[userID][listID]["collaborators"],
                      collaborator)) {
                if (collaborator === user.uid) {
                  admin.database().ref(userID + "/" + listID +
                  "/collaborators/" + collaborator).remove();
                }
              }
            }
          }
        }
      }
    }
  });
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
