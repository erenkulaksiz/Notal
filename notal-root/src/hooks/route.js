import { useRouter } from 'next/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';

import { isClient } from '@utils';
import { Loading } from '@components';
import useAuth from './auth';

const LoadingPage = <div className="w-full h-full justify-center items-center flex flex-col">
    <Head>
        <title>Loading...</title>
    </Head>
    <Loading size="xl" />
</div>

/**
 * Checks if user logined, returns to home if logined.
 *
 * @return {React.Component} with auth and ...props
 */
export function withPublic(Component) {
    return function WithPublic(props) {
        const auth = useAuth();
        const router = isClient && useRouter();

        if (props.validate?.success || auth?.authUser || Cookies.get("auth")) {
            isClient && router.replace("/home");
            return LoadingPage;
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
        const router = isClient && useRouter();

        if (props.validate.success || Cookies.get("auth")) {
            return <Component {...props} />
        } else {
            if (auth.authLoading) {
                return LoadingPage;
            } else {
                if (!auth.authUser) {
                    isClient && router.replace("/");
                    return LoadingPage;
                }
            }
        }

        return <Component {...props} />
    }
}