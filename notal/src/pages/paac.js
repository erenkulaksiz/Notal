import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';
import { Button, Container, Text, Grid, Card, Input } from '@nextui-org/react';

import { server } from '../config';

import useAuth from '../hooks/auth';
import { withAuth } from '../hooks/route';

import PasswordIcon from '../../public/icons/password.svg';
import CheckIcon from '../../public/icons/check.svg';
import LogoutIcon from '../../public/icons/logout.svg';

import { CheckToken } from '../utils';

const Paac = (props) => {
    const router = useRouter();
    const auth = useAuth();

    const [paac, setPaac] = useState("");

    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });

            if (props.validate?.error == "no-token" || res || props.validate?.error == "validation-error" || props.validate?.error == "auth/id-token-expired") {
                router.replace(router.asPath);
            }
        })();
    }, []);

    const onSubmit = async (e) => {
        if (paac.length == 0) {
            setError("Please enter a paac code.");
            return;
        }

        const data = await fetch(`${server}/api/checkPaac`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ paac, uid: auth?.authUser?.uid }),
        }).then(response => response.json());

        if (data?.success) {
            router.replace("/");
        } else if (!data?.success && data?.error == "paac/invalid-code") {
            setError("This code is invalid. Please contact to erenkulaksz@gmail.com");
        }
    }

    return (<Container xs css={{ dflex: "center", ac: "center", ai: "center" }}>
        <Head>
            <title>Enter Code · Notal</title>
            <meta name="description" content="Login to Notal, the greatest note app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Card>
            <Grid.Container gap={2} justify="center">
                <Grid xs={12} css={{ fd: "column" }}>
                    <Text h3>Enter Prealpha Access Code</Text>
                    <span>Thanks for your interest on notal. But we require an access code.</span>
                </Grid>
                <Grid xs={12} css={{ fd: "column" }}>
                    <Input
                        color="primary"
                        labelLeft={<PasswordIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='PAAC'
                        bordered
                        fullWidth
                        onChange={e => setPaac(e.target.value)}
                        value={paac}
                    />
                    {error != false && <Text color={"$error"}>{error}</Text>}
                </Grid>
                <Grid xs={6} justify='center'>
                    <Button
                        text="Log out"
                        icon={<LogoutIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        onClick={() => {
                            auth.users.logout();
                            router.replace("/login");
                        }}
                        size="lg"
                        style={{ width: "100%" }}>
                        Log out
                    </Button>
                </Grid>
                <Grid xs={6} justify='center'>
                    <Button
                        onClick={onSubmit}
                        icon={<CheckIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        size="lg"
                        style={{ width: "100%" }}
                    >
                        Submit Code
                    </Button>
                </Grid>
            </Grid.Container>
        </Card>
    </Container>)
}

export default withAuth(Paac);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    if (req) {
        const authCookie = req.cookies.auth;
        if (authCookie) {
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json()).catch(error => {
                return { success: false, error: { code: "validation-error", errorMessage: error } }
            });

            if (dataValidate.success) {
                validate = { ...dataValidate };
                if (dataValidate.data?.paac) {
                    return {
                        redirect: {
                            destination: '/',
                            permanent: false,
                        },
                    }
                }
            } else {
                validate = { error: dataValidate?.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate } }
}