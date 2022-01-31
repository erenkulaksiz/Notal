import { useRouter } from 'next/router';
import React from 'react';
import useAuth from './auth';
import { Loading, Container, Text } from '@nextui-org/react';

/**
 * Check user if has paac
 *
 * @return {React.Component} with auth and ...props
 */
export function withCheckUser(Component) {
    return function WithCheckUser(props) {
        //const auth = useAuth();
        const router = useRouter();
        if (props.validate?.success == true && !props.validate?.data?.paac) {
            router.replace("/paac");
            return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
                <Loading type="gradient" />
                <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
            </Container>
        }/* else {
            if (props.validate?.success == true && !props.validate?.data.username) {
                router.replace("/home");
            }
        }*/

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

        if (auth.authUser) {
            router.replace("/home");
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
        const router = useRouter();

        if (!auth.authUser) {
            router.replace("/login");
            return <Container css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
                <Loading type="gradient" />
                <Text css={{ mt: 16, fs: "1.2em" }}>Loading...</Text>
            </Container>
        }
        return <Component auth={auth} {...props} />
    }
}