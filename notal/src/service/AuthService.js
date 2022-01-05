import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, GithubAuthProvider } from "firebase/auth";
import { get, getDatabase, ref, set, child, orderByChild, query, limitToFirst, equalTo, orderByKey, startAt, update } from "firebase/database";
import { getStorage, ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * AuthService for Notal
 *
 * @loginWithGoogle // Auth via Google Services
 * @loginWithPassword // Auth via email and password
 * @sendPasswordResetLink // Send a password reset link to email
 * @createUser // Create an user with specified email and password
 * @logout // Logout from auth services
 * @uploadAvatar // change or upload an avatar for specified UID
 */
const AuthService = {
    loginWithGoogle: async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const dbRef = ref(getDatabase());
        const db = getDatabase();
        return signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const { user } = result;

                get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                    if (!snapshot.exists()) {
                        set(ref(db, `users/${user.uid}`), {
                            fullname: user?.displayName,
                            avatar: user?.photoURL,
                            username: null,
                            email: user?.email,
                        });
                    }
                }).catch(err => console.log("error with get in signinwithpopup: ", err));

                return { user, token }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                return { error: { errorCode, errorMessage } }
            });
    },
    loginWithGithub: async () => {
        const auth = getAuth();
        const provider = new GithubAuthProvider();

        return signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                console.log("github user: ", user);

                return { user, token }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GithubAuthProvider.credentialFromError(error);

                return { error: { errorMessage, errorCode } }
            });
    },
    loginWithPassword: async ({ email, password }) => {
        const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;

                /*
                let fullname = "";

                await get(child(dbRef, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        fullname = snapshot.val().fullname;
                    }
                });
                */

                return { user }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                return { error: { errorCode, errorMessage } }
            });
    },
    sendPasswordResetLink: async ({ email }) => {
        const auth = getAuth();
        return await sendPasswordResetEmail(auth, email)
            .then(() => {
                return { success: true }
            })
            .catch(error => {
                return { error }
            })
    },
    createUser: async ({ email, password, fullname, username }) => {
        const auth = getAuth();
        const db = getDatabase();
        //const dbRef = ref(getDatabase());

        // check if this username exist already
        return await get(query(ref(db, "users"), orderByChild("username"), equalTo(username))).then((snapshot) => {
            if (snapshot.exists()) {
                console.log("val: ", snapshot.val());
                return { error: { errorCode: "auth/username-already-in-use", errorMessage: "This username is already taken." } }
            } else {
                console.log("user doesnt exist, creating");
                return createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userCredential) => {
                        // on register, save fullname to real time database
                        const user = userCredential.user;
                        await set(ref(db, `users/${user.uid}`), {
                            fullname,
                            avatar: "https://imgyukle.com/f/2022/01/03/oxgaeS.jpg", // default avatar #TODO: make normal avatar
                            username,
                            email,
                        });
                        return { user }
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        return { error: { errorCode, errorMessage } }
                    });
            }
        });
    },
    uploadAvatar: async ({ avatar, uid }) => {
        const storage = getStorage();
        const storageRef = stRef(storage, `avatars/${uid}`);
        const db = getDatabase();

        return await uploadBytes(storageRef, avatar).then((snapshot) => {
            console.log(snapshot);

            return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);

                await update(ref(db, `users/${uid}`), {
                    avatar: downloadURL,
                });

                return { success: true, url: downloadURL }
            });
        }).catch(error => {
            return { success: false, error }
        });
    },
    logout: async () => {
        const auth = getAuth();
        auth.signOut();
    }
};

export default AuthService;