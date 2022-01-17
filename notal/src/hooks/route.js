import { useRouter } from 'next/router';
import React from 'react';
import useAuth from './auth';

import styles from '../../styles/App.module.scss';
import SyncIcon from '../../public/icons/sync.svg';
import useTheme from './theme';

export function withCheckUser(Component) {
    return function WithCheckUser(props) {
        //const auth = useAuth();
        const router = useRouter();

        if (props.validate.success == true && !props.validate.data.paac) {
            router.replace("/paac");
            return <div className={styles.container} data-theme={theme.UITheme}>
                <div className={styles.loadingContainer}>
                    <SyncIcon height={24} width={24} className={styles.loadingIconAuth} style={{ marginTop: 24 }} />
                    <span>Loading</span>
                </div>
            </div>
        } else {
            if (props.validate?.success == true && !props.validate?.data.username) {
                router.replace("/");
            }
        }

        return <Component {...props} />
    }
}

/**
 * Checks if user logined, returns to home if logined.
 *
 * @return {React.Component} with auth and ...props
 */
export function withPublic(Component) {
    return function WithPublic(props) {
        const auth = useAuth();
        const router = useRouter();
        const theme = useTheme();

        if (auth.authUser) {
            router.replace("/");
            return <div className={styles.container} data-theme={theme.UITheme}>
                <div className={styles.loadingContainer}>
                    <SyncIcon height={24} width={24} className={styles.loadingIconAuth} style={{ marginTop: 24 }} />
                    <span>Loading</span>
                </div>
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
        const theme = useTheme();

        if (!auth.authUser) {
            router.replace("/login");
            return <div className={styles.container} data-theme={theme.UITheme}>
                <div className={styles.loadingContainer}>
                    <SyncIcon height={24} width={24} className={styles.loadingIconAuth} style={{ marginTop: 24 }} />
                    <span>Loading</span>
                </div>
            </div>
        }
        return <Component auth={auth} {...props} />
    }
}