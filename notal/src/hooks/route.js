import { useRouter } from 'next/router';
import React from 'react';
import useAuth from './auth';
import { Loading, Container, Text } from '@nextui-org/react';

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
            return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
                <Loading type="gradient" />
                <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
            </Container>
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
        const client = (typeof window === 'undefined') ? false : true;
        const router = client && useRouter();

        if (!props.validate?.success) {
            client && router.replace("/login");
            return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
                <Loading type="gradient" />
                <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
            </Container>
        }

        return <Component auth={auth} {...props} />
    }
}