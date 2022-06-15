import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../service/AuthService";
import { getAuth, onIdTokenChanged, onAuthStateChanged } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const authContext = createContext();

import { CheckIcon, InfoIcon, SendIcon } from "@icons";

import { server } from '../config';
import useNotalUI from "./notalui";

export default function useAuth() {
    return useContext(authContext);
}

export function AuthProvider(props) {
    const auth = getAuth();
    const router = useRouter();
    const NotalUI = useNotalUI();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const tokenCheck = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                Cookies.remove("auth");
            } else {
                setUser(user);
                if (!Cookies.get("auth")) {
                    NotalUI.Toast.show({
                        desc: `Logged in as ${user.email}`,
                        icon: <InfoIcon size={24} fill="currentColor" />,
                        className: "dark:bg-green-600 bg-green-500 text-white",
                        duration: 4500,
                        timeEnabled: true,
                        closeable: true,
                    });
                    setTimeout(() => router.replace(router.asPath), 1000);
                }
                const token = await user.getIdToken();
                Cookies.set("auth", token, { expires: 365 });
            }
        });

        const tokenChange = onIdTokenChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                Cookies.remove("auth");
                setLoading(false);
            } else {
                const token = await user.getIdToken();
                setUser(user);
                Cookies.set("auth", token, { expires: 365 });
                setLoading(false);
            }
        });

        return () => {
            tokenChange();
            tokenCheck();
        }
        //eslint-disable-next-line
    }, []);

    const login = {
        google: async () => {
            const { error, user } = await AuthService.login.loginWithGoogle();
            //Log.debug("user (loginwithgoogle auth.js)", user);
            setUser(user ?? null);
            setError(error?.code ?? "");

            return { authError: error ?? null, authUser: user ?? null }
        },
        password: async ({ email, password }) => {
            const { error, user } = await AuthService.login.loginWithPassword({ email, password });
            setUser(user ?? null);
            setError(error ?? "");
            return { authError: error ?? null }
        },
        github: async () => {
            const { error, user } = await AuthService.login.loginWithGithub();
            //Log.debug("loginWithGithub User: ", user);
            //Log.debug("loginWithGithub Error: ", error);
            setUser(user ?? null);
            setError(error?.code ?? null);
            return { authError: error ?? null, authUser: user ?? null }
        }
    }

    const users = {
        createUser: async ({ email, password, fullname, username, paac }) => {
            const { error, user } = await AuthService.user.createUser({ email, password, fullname, username, paac });
            //check paac
            setUser(user ?? null);
            setError(error ?? "");
            return { authError: error ?? null, authUser: user ?? null }
        },
        updateUser: async ({ uid, fullname, username }) => {
            const data = await fetch(`${server}/api/reg`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ uid, fullname, username }),
            }).then(response => response.json());

            if (data.success) {
                return { success: true }
            } else {
                return { error: data }
            }
        },
        editUser: async ({ uid, fullname, username, bio, profileVisible, links }) => {
            const data = await fetch(`${server}/api/editProfile`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ uid, fullname, username, bio, profileVisible, links }),
            }).then(response => response.json());

            if (data.success) {
                return { success: true }
            } else {
                return { success: false, error: data }
            }
        },
        uploadAvatar: async ({ avatar }) => {
            const res = await AuthService.user.uploadAvatar({ avatar });
            return res;
        },
        logout: async () => {
            await AuthService.user.logout();
            Cookies.remove("auth");
            setUser(null);
            router.replace(router.asPath);

            await NotalUI.Toast.show({
                desc: "Logged out successfully.",
                icon: <CheckIcon size={24} fill="currentColor" />,
                className: "dark:bg-green-600 bg-green-500 text-white",
                time: 4500,
            });
        },
        getIdToken: async () => {
            try {
                const res = await AuthService.user.getIdToken();
                return res;
            } catch (error) {
                //Log.debug("error with authService.getIdToken", error);
                return { success: false, errorMessage: error }
            }
        },
        validate: async () => {

        },
    }

    const workspace = {
        createWorkspace: async ({ title, desc, starred, workspaceVisible, thumbnail }) => {
            return await AuthService.workspace.createWorkspace({ title, desc, starred, workspaceVisible, thumbnail });
        },
        uploadThumbnailTemp: async ({ thumbnail }) => {
            return await AuthService.workspace.uploadThumbnailTemp({ thumbnail });
        },
        deleteWorkspace: async ({ id }) => {
            return await AuthService.workspace.removeWorkspace({ id });
        },
        starWorkspace: async ({ id }) => {
            return await AuthService.workspace.starWorkspace({ id });
        },
        editWorkspace: async ({ id, title, desc, workspaceVisible, thumbnail }) => {
            return await AuthService.workspace.editWorkspace({ id, title, desc, workspaceVisible, thumbnail });
        },
        addUser: async ({ id, username }) => {
            return await AuthService.workspace.addUser({ id, username });
        },
        removeUser: async ({ id, userId }) => {
            return await AuthService.workspace.removeUser({ id, userId });
        },
        field: {
            addField: async ({ id, title, sortBy }) => {
                // id: workspaceId
                return await AuthService.workspace.field.addField({ id, title, sortBy });
            },
            removeField: async ({ id, workspaceId }) => {
                return await AuthService.workspace.field.removeField({ id, workspaceId });
            },
            editField: async ({ workspaceId, field }) => {
                return await AuthService.workspace.field.editField({ field, workspaceId });
            },
            editCard: async ({ id, workspaceId, fieldId, title, desc, color, tags }) => {
                return await AuthService.workspace.card.editCard({ id, workspaceId, fieldId, title, desc, color, tags });
            },
            addCard: async ({ id, workspaceId, title, desc, color, tags, image }) => {
                // id as field id
                return await AuthService.workspace.card.addCard({ id, workspaceId, title, desc, color, tags, image });
            },
            removeCard: async ({ id, workspaceId, fieldId }) => {
                return await AuthService.workspace.card.removeCard({ id, workspaceId, fieldId });
            },
            uploadCardImageTemp: async ({ image }) => {
                return await AuthService.workspace.card.uploadCardImageTemp({ image });
            },
            cardReOrder: async ({ id, destination, source, workspaceId }) => {
                return await AuthService.workspace.card.reOrder({ id, destination, source, workspaceId });
            }
            /*
            cardSwap: async ({ cardId, fieldId, swapType, workspaceId, toFieldId, toCardId }) => {
                return await AuthService.cardSwap({ cardId, fieldId, swapType, workspaceId, toFieldId, toCardId });
            }
            */
        }
    }

    const value = { authUser: user, authError: error, setUser, login, users, workspace, authLoading: loading };

    return <authContext.Provider value={value} {...props} />
}