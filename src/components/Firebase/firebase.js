import app from "firebase/app";

import "firebase/database";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAk1idJ7mRJZ2M5FzHzDueMX9kV0si6rGU",
  authDomain: "projectguilddb.firebaseapp.com",
  databaseURL: "https://projectguilddb.firebaseio.com",
  projectId: "projectguilddb",
  storageBucket: "projectguilddb.appspot.com",
  messagingSenderId: "827994628641",
  appId: "1:827994628641:web:0c7190e472367bc14e3960",
  measurementId: "G-NB51VTNC4W"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then(snapshot => {
            const dbUser = snapshot.val();
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");
}

export default Firebase;
