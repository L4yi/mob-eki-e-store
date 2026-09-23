import admin from 'firebase-admin';

let isFirebaseInitialized = false;

export function getFirebaseAdmin() {
  if (isFirebaseInitialized) {
    return { admin, db: admin.firestore(), auth: admin.auth(), available: true };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      isFirebaseInitialized = true;
      console.log(' [Firebase Admin] Connected successfully to Cloud Firestore & Auth.');
      return { admin, db: admin.firestore(), auth: admin.auth(), available: true };
    } catch (err) {
      console.warn('⚠️ [Firebase Admin] Failed to initialize Firebase Admin with provided credentials:', err);
    }
  } else {
    console.log('ℹ️ [Firebase Admin] No Firebase service credentials in .env. Running on built-in persistent storage.');
  }

  return { admin: null, db: null, auth: null, available: false };
}
