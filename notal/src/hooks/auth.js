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

    const loginWithGoogle = async () => {
        const { error, user } = await AuthService.loginWithGoogle();
        console.log("user (loginwithgoogle auth.js)", user);
        setUser(user ?? null);
        setError(error?.code ?? "");
    };

    const loginWithGithub = async () => {
        const { error, user } = await AuthService.loginWithGithub();
        console.log("loginWithGithub User: ", user);
        console.log("loginWithGithub Error: ", error);
        setUser(user ?? null);
        setError(error?.code ?? null);
        return { authError: error ?? null, authUser: user ?? null }
    }

    const loginWithPassword = async ({ email, password }) => {
        const { error, user } = await AuthService.loginWithPassword({ email, password });
        setUser(user ?? null);
        setError(error ?? "");
        return { authError: error ?? null }
    };

    const createUser = async ({ email, password, fullname, username }) => {
        const { error, user } = await AuthService.createUser({ email, password, fullname, username }); // dont forget to put username here next time
        setUser(user ?? null);
        setError(error ?? "");
        return { authError: error ?? null, authUser: user ?? null }
    }

    const updateUser = async ({ uid, fullname, username }) => {
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
    }

    const editUser = async ({ uid, fullname, username }) => {
        const data = await fetch(`${server}/api/editProfile`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ uid, fullname, username }),
        }).then(response => response.json());

        if (data.success) {
            return { success: true }
        } else {
            return { success: false, error: data }
        }
    }

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    }

    const value = { authUser: user, authError: error, loginWithGoogle, loginWithPassword, loginWithGithub, editUser, updateUser, logout, setUser, createUser };

    return <authContext.Provider value={value} {...props} />
}