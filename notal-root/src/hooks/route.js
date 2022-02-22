import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import useAuth from './auth';

const Loading = <div>
    <Head>
        <title>Loading...</title>
    </Head>
    <div>
        loading...
    </div>
</div>

/**
 * Checks if user logined, returns to home if logined.
 *
 * @return {React.Component} with auth and ...props
 */
export function withPublic(Component) {
    return function WithPublic(props) {
        const auth = useAuth();
        const client = (typeof window === 'undefined') ? false : true;
        const router = client && useRouter();

        if (props.validate?.success || auth?.authUser) {
            client && router.replace("/home");
            return Loading;
        }
        return <Component {...props} />
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
        const client = (typeof window === 'undefined') ? false : true;
        const router = client && useRouter();

        if (props.validate.success) {
            return <Component {...props} />
        } else {
            if (auth.authLoading) {
                return Loading;
            } else {
                if (!auth.authUser) {
                    client && router.replace("/");
                    return Loading;
                }
            }
        }

        return <Component {...props} />
    }
}