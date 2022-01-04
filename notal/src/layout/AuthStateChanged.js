import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import useAuth from '../hooks/auth';
import cookie from 'js-cookie';

import SyncIcon from '../../public/icons/sync.svg';

import styles from '../../styles/App.module.scss';

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
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <SyncIcon height={24} width={24} fill={"#000"} className={styles.loadingIconAuth} />
        </div>
    }

    return children;
}