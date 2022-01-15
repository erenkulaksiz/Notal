import { createContext, useContext, useState } from "react";
import AuthService from "../service/AuthService";

const authContext = createContext();

import { server } from '../config';

export default function useAuth() {
    return useContext(authContext);
}

export function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(null);

    const login = {
        google: async () => {
            const { error, user } = await AuthService.loginWithGoogle();
            console.log("user (loginwithgoogle auth.js)", user);
            setUser(user ?? null);
            setError(error?.code ?? "");
        },
        password: async ({ email, password }) => {
            const { error, user } = await AuthService.loginWithPassword({ email, password });
            setUser(user ?? null);
            setError(error ?? "");
            return { authError: error ?? null }
        },
        github: async () => {
            const { error, user } = await AuthService.loginWithGithub();
            console.log("loginWithGithub User: ", user);
            console.log("loginWithGithub Error: ", error);
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
        editUser: async ({ uid, fullname, username, bio, profileVisible }) => {
            const data = await fetch(`${server}/api/editProfile`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ uid, fullname, username, bio, profileVisible }),
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
            addField: async ({ id, title }) => {
                const res = AuthService.addField({ id, title });
                return res;
            },
            removeField: async ({ id, workspaceId }) => {
                const res = AuthService.removeField({ id, workspaceId });
                return res;
            },
            editField: async ({ id, workspaceId, title }) => {
                const res = AuthService.editField({ id, title, workspaceId });
                return res;
            },
            editCard: async ({ id, workspaceId, fieldId, title, desc, color }) => {
                const res = AuthService.editCard({ id, workspaceId, fieldId, title, desc, color });
                return res;
            },
            addCard: async ({ id, workspaceId, title, desc, color }) => {
                // id as field id
                const res = AuthService.addCard({ id, workspaceId, title, desc, color });
                return res;
            },
            removeCard: async ({ id, workspaceId, fieldId }) => {
                const res = AuthService.removeCard({ id, workspaceId, fieldId });
                return res;
            }
        }
    }

    const value = { authUser: user, authError: error, setUser, login, users, workspace, theme, setTheme };

    return <authContext.Provider value={value} {...props} />
}