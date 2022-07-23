import * as firebaseAdmin from "firebase-admin";

export const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL:
    "https://planties-286f1-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export const db = admin.database();
export const auth = admin.auth();
