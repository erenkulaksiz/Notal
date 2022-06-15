import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { getStorage, ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Router from "next/router";

import { server } from "../config";
import Log from "@utils/logger"

const fetchWithAuth = async ({ ...rest }, { token, action }) => {
    return await fetch(`${server}/api/workspace/${action}`, {
        'Content-Type': 'application/json',
        method: "POST",
        headers: { 'Authorization': `Bearer ${token || ""}` },
        body: JSON.stringify({ ...rest }),
    }).then(response => response.json()).catch(error => { return { error, success: false } });
}

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
    login: {
        loginWithGoogle: async () => {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            return signInWithPopup(auth, provider)
                .then(async (result) => {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    const { user } = result;

                    window.gtag("event", "login", { login: "type:google/" + user.email });

                    Router.replace(Router.asPath);

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

                    window.gtag("event", "login", { login: "type:github/" + user.email });

                    Router.replace(Router.asPath);

                    return { user, token }
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.email;
                    const credential = GithubAuthProvider.credentialFromError(error);

                    Log.debug("github login error");

                    return { error: { errorMessage, errorCode } }
                });
        },
        loginWithPassword: async ({ email, password }) => {
            const auth = getAuth();
            return signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredential) => {
                    // Signed in 
                    const user = userCredential.user;

                    window.gtag('event', "login", { login: "type:password/" + user.email });

                    return { user }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    return { error: { errorCode, errorMessage } }
                });
        },
    },
    user: {
        logout: async () => {
            const auth = getAuth();
            auth.signOut();
        },
        getIdToken: async () => {
            const res = await getAuth().currentUser.getIdToken();

            return { res };
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
            //const auth = getAuth();
            //const db = getDatabase();

            //await push(ref(db, "paacodes"), { valid: true, createDate: Date.now(), expireDate: Date.now() })

            if (username.length > 20) {
                return { error: { errorCode: "auth/username-too-long" } }
            } else if (username.length < 3) {
                return { error: { errorCode: "auth/username-too-short" } }
            } else if ((/\s/).test(username)) {
                // check for spaces in username
                return { error: { errorCode: "auth/username-contains-space" } }
            }

            return null
        },
        uploadAvatar: async ({ avatar }) => {
            const auth = getAuth();
            const storage = getStorage();
            const storageRef = stRef(storage, `avatars/${auth?.currentUser?.uid}`);

            return await uploadBytes(storageRef, avatar).then((snapshot) => {
                Log.debug(snapshot);

                return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    Log.debug('File available at', downloadURL);

                    const avatarRes = await fetch(`${server}/api/editProfile`, {
                        'Content-Type': 'application/json',
                        method: "POST",
                        body: JSON.stringify({ avatar: downloadURL, type: "avatar", uid: auth?.currentUser?.uid }),
                    }).then(response => response.json());
                    Log.debug("avatar res: ", avatarRes);

                    return { success: true, url: downloadURL }
                });
            }).catch(error => {
                return { success: false, error }
            });
        },
    },
    workspace: {
        createWorkspace: async ({ title, desc, starred, workspaceVisible, thumbnail }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                uid: auth?.currentUser?.uid,
                title,
                desc,
                starred,
                workspaceVisible,
                thumbnail,
            }, {
                token,
                action: "createworkspace"
            });

            if (data?.success) {
                return { ...data }
            } else {
                return { success: false, error: data?.error }
            }
        },
        uploadThumbnailTemp: async ({ thumbnail }) => {
            // temporarily uploads thumbnail for later use.
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();
            const storage = getStorage();
            const storageRef = stRef(storage, `thumbnails/temp/workspace_${auth.currentUser.uid}`);

            return await uploadBytes(storageRef, thumbnail).then((snapshot) => {
                Log.debug(snapshot);

                return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    return { success: true, url: downloadURL }
                });
            }).catch(error => {
                return { success: false, error }
            });
        },
        removeWorkspace: async ({ id }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                id,
                uid: auth?.currentUser?.uid,
            }, {
                token,
                action: "removeworkspace",
            });

            if (data?.success) {
                return { success: true }
            } else {
                return { success: false, error: data?.error }
            }
        },
        editWorkspace: async ({ id, title, desc, workspaceVisible, thumbnail }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                id,
                uid: auth?.currentUser?.uid,
                title,
                desc,
                workspaceVisible,
                thumbnail,
            }, {
                token,
                action: "editworkspace",
            });

            if (data?.success) {
                return { success: true }
            } else {
                return { success: false, error: data?.error }
            }
        },
        starWorkspace: async ({ id }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                id,
                uid: auth?.currentUser?.uid
            }, {
                token,
                action: "starworkspace"
            });

            if (data?.success) {
                return { success: true }
            } else {
                return { success: false, error: data?.error }
            }
        },
        addUser: async ({ id, username }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                id,
                username,
                uid: auth?.currentUser?.uid
            }, {
                token,
                action: "adduser"
            });

            if (data?.success) {
                return { success: true }
            } else {
                return { success: false, error: data?.error }
            }
        },
        removeUser: async ({ id, userId }) => {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            const data = await fetchWithAuth({
                id,
                userId,
                uid: auth?.currentUser?.uid
            }, {
                token,
                action: "removeuser"
            });

            if (data?.success) {
                return { success: true }
            } else {
                return { success: false, error: data?.error }
            }
        },
        field: {
            addField: async ({ title, id, sortBy, owner }) => {
                // id: workspaceId
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    title,
                    id,
                    uid: auth?.currentUser?.uid,
                    sortBy,
                    owner
                }, {
                    token,
                    action: "addfield"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
            removeField: async ({ id, workspaceId }) => {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    id,
                    uid: auth?.currentUser?.uid,
                    workspaceId
                }, {
                    token,
                    action: "removefield"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
            editField: async ({ workspaceId, field }) => {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    uid: auth?.currentUser?.uid,
                    workspaceId,
                    field: {
                        _id: field._id,
                        title: field.title,
                        sortBy: field.sortBy,
                        collapsed: field.collapsed,
                    },
                }, {
                    token,
                    action: "editfield"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
        },
        card: {
            addCard: async ({ id, workspaceId, title, desc, color, tags, image }) => {
                // id field id
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    id,
                    uid: auth?.currentUser?.uid,
                    workspaceId,
                    title,
                    desc,
                    color,
                    tags,
                    image
                }, {
                    token,
                    action: "addcard",
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
            removeCard: async ({ id, workspaceId, fieldId }) => {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    id,
                    uid: auth?.currentUser?.uid,
                    workspaceId,
                    fieldId
                }, {
                    token,
                    action: "removecard"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
            editCard: async ({ id, workspaceId, fieldId, title, desc, color, tags }) => {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    id,
                    uid: auth?.currentUser?.uid,
                    workspaceId,
                    title,
                    desc,
                    color,
                    tags,
                    fieldId
                }, {
                    token,
                    action: "editcard"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            },
            uploadCardImageTemp: async ({ image }) => {
                // temporarily uploads image for later use.
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();
                const storage = getStorage();
                const storageRef = stRef(storage, `cardImages/temp/user_${auth.currentUser.uid}`);

                return await uploadBytes(storageRef, image).then((snapshot) => {
                    Log.debug(snapshot);

                    return getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                        return { success: true, url: downloadURL }
                    });
                }).catch(error => {
                    return { success: false, error }
                });
            },
            reOrder: async ({ id, destination, source, workspaceId }) => {
                const auth = getAuth();
                const token = await auth.currentUser.getIdToken();

                const data = await fetchWithAuth({
                    id,
                    uid: auth?.currentUser?.uid,
                    workspaceId,
                    destination,
                    source
                }, {
                    token,
                    action: "reordercard"
                });

                if (data?.success) {
                    return { success: true }
                } else {
                    return { success: false, error: data?.error }
                }
            }
        }
    },
};

export default AuthService;