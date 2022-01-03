import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import useAuth from '../hooks/auth';
import cookie from 'js-cookie';

export default function AuthStateChanged({ children }) {
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                const token = await user.getIdToken();
                cookie.set("auth", token, { expires: 1 });
            } else {
                cookie.remove("auth");
            }
        });
        //eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>loading</h1>
    }

    return children;
}