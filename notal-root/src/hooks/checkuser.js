import Router from 'next/router'
import useAuth from './auth';
import { Loading, Container, Text } from '@nextui-org/react';
import { useState } from 'react';
import Head from 'next/head';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export function withCheckuser(Component) {
    return function WithCheckuser(props) {
        const auth = useAuth();
        const client = (typeof window === 'undefined') ? false : true;
        const [loading, setLoading] = useState(false);

        auth.users.getIdToken(async (token) => {
            setLoading(true);
            await Cookies.set("auth", token.res, { expires: 1 });
            setLoading(false);
            client && Router.replace(Router.asPath);
        })

        if (loading) {
            return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
                <Head>
                    <title>Loading...</title>
                </Head>
                <Loading type="gradient" />
                <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
            </Container>
        }

        return <Component {...props} />
    }
}