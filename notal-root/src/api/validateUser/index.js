const admin = require("firebase-admin");
const googleService = JSON.parse(process.env.NEXT_PUBLIC_GOOGLE_SERVICE);
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(googleService),
        //databaseURL: firebaseConfig.databaseURL
    });
}

/**
 * Validate user with Google API and recieved UID.
 */

const ValidateUser = ({ token, uid }) => {
    return await admin.auth().verifyIdToken(token).then(async (decodedToken) => {
        if (decodedToken.user_id == uid) return true
        return false
    })
}

module.exports = {
    ValidateUser
}