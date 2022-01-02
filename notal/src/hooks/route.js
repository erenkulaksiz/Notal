import { useRouter } from 'next/router';
import React from 'react';
import useAuth from './auth';

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
            return <h1>loading...</h1>
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
            return <h1>loading...</h1>
        }
        return <Component auth={auth} {...props} />
    }
}