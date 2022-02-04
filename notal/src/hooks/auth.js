import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../service/AuthService";

const authContext = createContext();

import { server } from '../config';

export default function useAuth() {
    return useContext(authContext);
}

export function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // #TODO: cache setUser

    /*useEffect(() => {
        console.log("userAuthProvider:", user);
    }, [user]);*/

    const login = {
        google: async () => {
            const { error, user } = await AuthService.loginWithGoogle();
            //console.log("user (loginwithgoogle auth.js)", user);
            setUser(user ?? null);
            setError(error?.code ?? "");

            return { authError: error ?? null, authUser: user ?? null }
        },
        password: async ({ email, password }) => {
            const { error, user } = await AuthService.loginWithPassword({ email, password });
            setUser(user ?? null);
            setError(error ?? "");
            return { authError: error ?? null }
        },
        github: async () => {
            const { error, user } = await AuthService.loginWithGithub();
            //console.log("loginWithGithub User: ", user);
            //console.log("loginWithGithub Error: ", error);
            setUser(user ?? null);
            setError(error?.code ?? null);
            return { authError: error ?? null, authUser: user ?? null }
        }
    }

    const users = {
        createUser: async ({ email, password, fullname, username, paac }) => {
            const { error, user } = await AuthService.createUser({ email, password, fullname, username, paac });
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
        uploadAvatar: async ({ avatar, uid }) => {
            const res = await AuthService.uploadAvatar({ avatar, uid });
            return res;
        },
        logout: async () => {
            await AuthService.logout();
            setUser(null);
        },
        getIdToken: async () => {
            try {
                const res = await AuthService.getIdToken();
                return res;
            } catch (error) {
                //console.log("error with authService.getIdToken", error);
                return { success: false, errorMessage: error }
            }
        }
    }

    const workspace = {
        createWorkspace: async ({ title, desc, starred }) => {
            const res = await AuthService.createWorkspace({ title, desc, starred });
            return res;
        },
        deleteWorkspace: async ({ id }) => {
            const res = await AuthService.removeWorkspace({ id });
            return res;
        },
        starWorkspace: async ({ id }) => {
            const res = await AuthService.starWorkspace({ id });
            return res;
        },
        editWorkspace: async ({ id, title, desc }) => {
            const res = await AuthService.editWorkspace({ id, title, desc });
            return res;
        },
        field: {
            addField: async ({ id, title, filterBy }) => {
                // id: workspaceId
                return await AuthService.addField({ id, title, filterBy });
            },
            removeField: async ({ id, workspaceId }) => {
                return await AuthService.removeField({ id, workspaceId });
            },
            editField: async ({ id, workspaceId, title }) => {
                return await AuthService.editField({ id, title, workspaceId });
            },
            editCard: async ({ id, workspaceId, fieldId, title, desc, color }) => {
                return await AuthService.editCard({ id, workspaceId, fieldId, title, desc, color });
            },
            addCard: async ({ id, workspaceId, title, desc, color }) => {
                // id as field id
                return await AuthService.addCard({ id, workspaceId, title, desc, color });
            },
            removeCard: async ({ id, workspaceId, fieldId }) => {
                return await AuthService.removeCard({ id, workspaceId, fieldId });
            },
            cardSwap: async ({ cardId, fieldId, swapType, workspaceId, toFieldId, toCardId }) => {
                return await AuthService.cardSwap({ cardId, fieldId, swapType, workspaceId, toFieldId, toCardId });
            }
        }
    }

    const value = { authUser: user, authError: error, setUser, login, users, workspace, };

    return <authContext.Provider value={value} {...props} />
}