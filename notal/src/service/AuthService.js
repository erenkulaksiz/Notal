import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { get, getDatabase, ref, set, child, orderByChild, query, limitToFirst, equalTo, orderByKey, startAt, update, push } from "firebase/database";
import { getStorage, ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";

import { server } from "../config";

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
        return signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const { user } = result;

                return { user, token }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);

                return { error: { errorCode, errorMessage } }
            });
    },
    loginWithGithub: async () => {
        const auth = getAuth();
        const provider = new GithubAuthProvider();
        return signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;

                return { user, token }
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GithubAuthProvider.credentialFromError(error);

                console.log("github login error");

                return { error: { errorMessage, errorCode } }
            });
    },
    loginWithPassword: async ({ email, password }) => {
        const auth = getAuth();
        return signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;

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
    createUser: async ({ email, password, fullname, username, paac }) => {
        const auth = getAuth();
        const db = getDatabase();

        //await push(ref(db, "paacodes"), { valid: true, createDate: Date.now(), expireDate: Date.now() })

        if (username.length > 20) {
            return { error: { errorCode: "auth/username-too-long" } }
        } else if (username.length < 3) {
            return { error: { errorCode: "auth/username-too-short" } }
        } else if ((/\s/).test(username)) {
            // check for spaces in username
            return { error: { errorCode: "auth/username-contains-space" } }
        }

        return await get(query(ref(db, "paacodes"), orderByChild("code"), equalTo(paac), limitToFirst(1))).then(async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()[Object.keys(snapshot.val())[0]];

                return await get(query(ref(db, "users"), orderByChild("username"), equalTo(username))).then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log("val: ", snapshot.val());
                        return { error: { errorCode: "auth/username-already-in-use", errorMessage: "This username is already taken." } }
                    } else {
                        if (data.valid) {
                            console.log("user doesnt exist, creating");
                            return createUserWithEmailAndPassword(auth, email, password)
                                .then(async (userCredential) => {
                                    // on register, save fullname to real time database
                                    const user = userCredential.user;
                                    await set(ref(db, `users/${user.uid}`), {
                                        fullname,
                                        username,
                                        email,
                                        createdAt: Date.now(),
                                        updatedAt: Date.now(),
                                        paac: data.code,
                                    });
                                    return { user }
                                })
                                .catch((error) => {
                                    const errorCode = error.code;
                                    const errorMessage = error.message;
                                    return { error: { errorCode, errorMessage } }
                                });
                        } else {
                            return { error: { errorCode: "paac/invalid-code" } }
                        }
                    }
                });
            } else {
                return { error: { errorCode: "paac/invalid-code" } }
            }
        })
    },
    uploadAvatar: async ({ avatar, uid }) => {
        const storage = getStorage();
        const storageRef = stRef(storage, `avatars/${uid}`);
        const auth = getAuth();

        return await uploadBytes(storageRef, avatar).then((snapshot) => {
            console.log(snapshot);

            return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                console.log('File available at', downloadURL);

                const avatarRes = await fetch(`${server}/api/editProfile`, {
                    'Content-Type': 'application/json',
                    method: "POST",
                    body: JSON.stringify({ avatar: downloadURL, type: "avatar", uid: auth?.currentUser?.uid }),
                }).then(response => response.json());
                console.log("avatar res: ", avatarRes);

                return { success: true, url: downloadURL }
            });
        }).catch(error => {
            return { success: false, error }
        });
    },
    createWorkspace: async ({ title, desc, starred }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ uid: auth?.currentUser?.uid, title, desc, starred, action: "CREATE" }),
        }).then(response => response.json());

        if (data?.success) {
            return { ...data }
        } else {
            return { error: data?.error }
        }
    },
    removeWorkspace: async ({ id }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "DELETE", uid: auth?.currentUser?.uid }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    editWorkspace: async ({ id, title, desc }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "EDIT", uid: auth?.currentUser?.uid, title, desc }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    getIdToken: async () => {
        const res = await getAuth().currentUser.getIdToken();

        return { res };
    },
    starWorkspace: async ({ id }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "STAR", uid: auth?.currentUser?.uid }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    addField: async ({ title, id, filterBy }) => {
        // id: workspaceId
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ title, id, action: "ADDFIELD", uid: auth?.currentUser?.uid, filterBy }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    removeField: async ({ id, workspaceId }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "REMOVEFIELD", uid: auth?.currentUser?.uid, workspaceId }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    addCard: async ({ id, workspaceId, title, desc, color }) => {
        // id field id
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "ADDCARD", uid: auth?.currentUser?.uid, workspaceId, title, desc, color }),
        }).then(response => response.json());

        console.log("add card to field res: ", data);

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    removeCard: async ({ id, workspaceId, fieldId }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "REMOVECARD", uid: auth?.currentUser?.uid, workspaceId, fieldId }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    editField: async ({ id, workspaceId, title }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "EDITFIELD", uid: auth?.currentUser?.uid, workspaceId, title }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    editCard: async ({ id, workspaceId, fieldId, title, desc, color }) => {
        const auth = getAuth();

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id, action: "EDITCARD", uid: auth?.currentUser?.uid, workspaceId, title, desc, color, fieldId }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    cardSwap: async ({ cardId, fieldId, swapType, workspaceId, toFieldId, toCardId }) => {
        const auth = getAuth(); // { cardId, fieldId, swapType, workspaceId: _workspace.id, toFieldId, toCardId }

        const data = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ cardId, action: "CARDSWAP", swapType, uid: auth?.currentUser?.uid, workspaceId, fieldId, toFieldId, toCardId }),
        }).then(response => response.json());

        if (data?.success) {
            return { success: true }
        } else {
            return { error: data?.error }
        }
    },
    logout: async () => {
        const auth = getAuth();
        auth.signOut();
    }
};

export default AuthService;