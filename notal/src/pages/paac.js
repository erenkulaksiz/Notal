import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';

import { server } from '../config';

import useAuth from '../hooks/auth';
import { withAuth } from '../hooks/route';

import Button from '../components/button';
import Input from '../components/input';

import PasswordIcon from '../../public/icons/password.svg';
import CheckIcon from '../../public/icons/check.svg';
import LogoutIcon from '../../public/icons/logout.svg';

import useTheme from '../hooks/theme';
import { CheckToken } from '../utils';

const Paac = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const theme = useTheme();

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
        e.preventDefault();

        const data = await fetch(`${server}/api/checkPaac`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ paac, uid: auth?.authUser?.uid }),
        }).then(response => response.json());

        console.log("response: ", data);

        if (data?.success) {
            router.replace("/");
        } else if (!data?.success && data?.error == "paac/invalid-code") {
            setError("This code is invalid. Please contact to erenkulaksz@gmail.com");
        }
    }

    return (
        <div className={styles.container} data-theme={theme.UITheme}>
            <Head>
                <title>Enter Code · Notal</title>
                <meta name="description" content="Login to Notal, the greatest note app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.content_paac}>
                <div className={styles.paac}>
                    <div className={styles.details}>
                        <h1>Enter Prealpha Access Code</h1>
                        <span>Thanks for your interest on notal. But we require an access code.</span>
                    </div>
                    <form onSubmit={onSubmit}>
                        <Input
                            type="text"
                            placeholder="Code..."
                            onChange={e => setPaac(e.target.value)}
                            value={paac}
                            icon={<PasswordIcon height={24} width={24} />}
                            required
                            style={{ marginTop: 18 }}
                            error={error != false}
                        />
                        {error != false && <p className={styles.errorMsg}>{error}</p>}
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <Button
                                text="Log out"
                                icon={<LogoutIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                style={{ marginTop: 12, border: "none", width: "48%" }}
                                onClick={() => {
                                    auth.users.logout();
                                    router.replace("/login");
                                }}
                            />
                            <Button
                                text="Submit Code"
                                type="submit"
                                icon={<CheckIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                style={{ marginTop: 12, border: "none", width: "48%" }}
                                reversed
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
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