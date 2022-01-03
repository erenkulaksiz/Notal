import { createContext, useContext, useState } from "react";
import AuthService from "../service/AuthService";

const authContext = createContext();

export default function useAuth() {
    return useContext(authContext);
}

export function AuthProvider(props) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const loginWithGoogle = async () => {
        const { error, user } = await AuthService.loginWithGoogle();
        setUser(user ?? null);
        setError(error?.code ?? "");
    };

    const loginWithPassword = async ({ email, password }) => {
        const { error, user } = await AuthService.loginWithPassword({ email, password });
        setUser(user ?? null);
        setError(error ?? "");
        return { authError: error || null }
    };

    const createUser = async ({ email, password, fullname }) => {
        const { error, user } = await AuthService.createUser({ email, password, fullname });
        setUser(user ?? null);
        setError(error ?? "");
        return { authError: error ?? null, authUser: user ?? null }
    }

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    }

    const value = { authUser: user, authError: error, loginWithGoogle, loginWithPassword, logout, setUser, createUser };

    return <authContext.Provider value={value} {...props} />
}