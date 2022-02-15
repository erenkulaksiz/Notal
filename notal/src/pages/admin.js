import { Button, Card, Container, Grid, Link as ALink, Row, Spacer, Text, useTheme } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { withAuth } from '@hooks/route';
import { withCheckuser } from '@hooks/checkuser';
import { WorkboxInit, ValidateToken } from '@utils';
import useAuth from '@hooks/auth';

// Icons
import {
    BackIcon,
    CheckOutlineIcon
} from '@icons';

// Components
import {
    AcceptCookies,
    EmailLogin,
    ForgotPassword,
    LoginSelector
} from '@components';

const Admin = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const { isDark } = useTheme();

    useEffect(() => {
        WorkboxInit();
    }, []);

    return (<Container md css={{ dflex: "center", ac: "center", ai: "center" }}>
        <Head>
            <title>Login · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>
        <Button onClick={() => alert("just kidding sir you cant ban everyone")}>Ban everyone</Button>
    </Container>)
}

export default withAuth(Admin);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;

        validate = await ValidateToken({ token: authCookie });
        if (!validate?.admin) {
            return {
                redirect: {
                    permanent: false,
                    destination: "/home"
                }
            }
        }
    }
    return { props: { validate, workspaces } }
}