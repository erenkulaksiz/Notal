import React, { useEffect, useState } from 'react';
import { getAuth, onIdTokenChanged, onAuthStateChanged } from "firebase/auth";
import useAuth from '../hooks/auth';
import cookie from 'js-cookie';
import { Loading, Container, Text } from '@nextui-org/react';

import SyncIcon from '../../public/icons/sync.svg';

import styles from '../../styles/App.module.scss';

export default function AuthStateChanged({ children }) {
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(true);

    const auth = getAuth();

    useEffect(() => {

        /*const tokenCheck = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                cookie.remove("auth");
                setLoading(false);
            } else {
                const token = await user.getIdToken();
                setLoading(false);
                setUser(user);
                cookie.set("auth", token, { expires: 1 });
            }
        });*/

        const tokenChange = onIdTokenChanged(auth, async (user) => {
            if (!user) {
                setUser(null);
                cookie.remove("auth");
                setLoading(false);
            } else {
                const token = await user.getIdToken();
                setUser(user);
                cookie.set("auth", token, { expires: 1 });
                setLoading(false);
            }
        });

        return () => {
            tokenChange();
            //tokenCheck();
        }
        //eslint-disable-next-line
    }, []);

    if (loading) {
        return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column", }}>
            <Loading type="gradient" />
            <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
        </Container>
    }

    return children;
}