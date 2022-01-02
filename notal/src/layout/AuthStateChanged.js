import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import useAuth from '../hooks/auth';

export default function AuthStateChanged({ children }) {

    const { setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        //eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>loading</h1>
    }

    return children;
}