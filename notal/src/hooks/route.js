import { useRouter } from 'next/router';
import React from 'react';
import useAuth from './auth';

import styles from '../../styles/App.module.scss';
import SyncIcon from '../../public/icons/sync.svg';

/**
 * Checks if user logined, returns to home if logined.
 *
 * @return {React.Component} with auth and ...props
 */
export function withPublic(Component) {
    return function WithPublic(props) {
        const auth = useAuth();
        const router = useRouter();

        if (auth.authUser) {
            router.replace("/");
            return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <SyncIcon height={24} width={24} fill={"#000"} className={styles.loadingIconAuth} />
            </div>
        }
        return <Component auth={auth} {...props} />
    }
}

/**
 * If no auth, return to login page
 *
 * @return {React.Component} with auth and ...props
 */
export function withAuth(Component) {
    return function WithAuth(props) {
        const auth = useAuth();
        const router = useRouter();

        if (!auth.authUser) {
            router.replace("/login");
            return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                <SyncIcon height={24} width={24} fill={"#000"} className={styles.loadingIconAuth} />
            </div>
        }
        return <Component auth={auth} {...props} />
    }
}