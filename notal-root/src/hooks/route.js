import { useRouter } from 'next/router';
import Head from 'next/head';
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
        const client = (typeof window === 'undefined') ? false : true;
        const router = client && useRouter();

        if (props.validate?.success || auth?.authUser) {
            client && router.replace("/home");
            return <div>
                <Head>
                    <title>Loading...</title>
                </Head>
                <div>
                    loading...
                </div>
            </div>
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
        //const auth = useAuth();
        const client = (typeof window === 'undefined') ? false : true;
        const router = client && useRouter();

        if (!props.validate?.success) {
            client && router.replace("/login");
            return <div>
                <Head>
                    <title>Loading...</title>
                </Head>
                <div>
                    loading...
                </div>
            </div>
        }

        return <Component {...props} />
    }
}