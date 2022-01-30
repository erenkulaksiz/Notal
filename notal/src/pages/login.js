import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
//import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, Switch, useTheme, Tooltip, Input, Row, Divider } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';

import useAuth from '../hooks/auth';
import { withPublic } from '../hooks/route';

import QuestionIcon from '../../public/icons/question.svg';

import AuthService from '../service/AuthService';

// Components
import ForgotPassword from '../components/forgotPassword';
import EmailLogin from '../components/emailLogin';
import LoginSelector from '../components/loginSelector';

const Login = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const { isDark } = useTheme();

    const [forgotError, setForgotError] = useState("");

    const [view, setView] = useState(null);
    const [error, setError] = useState({ email: false, password: false, login: false });
    const [oauthError, setOauthError] = useState(false);

    const onLoginWithGoogle = async () => {
        const login = await auth.login.google();

        console.log("google login errors: ", login?.authError);
    }

    const onLoginWithGithub = async () => {
        const login = await auth.login.github();

        console.log("github login errors: ", login?.authError);

        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
        }
    }

    const onLogin = async ({ email, password }) => {
        const login = await auth.login.password({ email, password });

        if (login?.authError?.errorCode == "auth/user-not-found" || login?.authError?.errorCode == "auth/wrong-password") {
            setError({ ...error, login: "This email and password combination is incorrect.", password: false, email: false });
        } else {
            setError({ ...error, login: false });
        }
    }

    const onForgotPassword = async ({ email }) => {
        const sendLink = await AuthService.sendPasswordResetLink({ email });
        if (sendLink?.error) {
            if (sendLink?.error?.code == "auth/user-not-found") {
                setForgotError("Cannot find a user with this email.");
                return;
            }
        }
        if (sendLink.success) {
            setView("sentEmail");
        }
    }

    return (<Container xs css={{ dflex: "center", ac: "center", ai: "center" }}>
        <Head>
            <title>Login · Notal</title>
            <meta name="description" content="Login to Notal, the greatest note app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Spacer y={1} />
        <Card css={{ minWidth: 300 }}>
            <Grid.Container gap={2} justify="center">
                <Grid xs={12} sm={12} alignItems="center" justify="center">
                    <img
                        src={isDark ? "./icon_white.png" : "./icon_galactic.png"}
                        alt="Logo of Notal"
                        width={210}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                        height={60}
                    />
                </Grid>
                {/*<Grid xs={12} sm={6} alignItems="center" justify="center">
                    <Tooltip content={'Learn more about Notal'}>
                        <Button onClick={() => router.push("/about")} size="lg" icon={<QuestionIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                            About
                        </Button>
                    </Tooltip>
                </Grid>*/}
                {!view && <LoginSelector
                    onLogin={() => setView("email")} // Login with email
                    onLoginWithGithub={onLoginWithGithub}
                    onLoginWithGoogle={onLoginWithGoogle}
                />}
                {view == "email" && <EmailLogin
                    onBack={() => {
                        setView(null);
                        setError({ ...error, login: false, email: false, password: false });
                    }}
                    onLogin={onLogin}
                    setError={setError}
                    error={error}
                    onForgot={() => {
                        setView("forgot");
                        setForgotError("");
                    }}
                />}
                {view == "forgot" && <ForgotPassword
                    onForgotPassword={({ email }) => onForgotPassword({ email })}
                    onBack={() => {
                        setView("email");
                        setError({ ...error, login: false, email: false, password: false });
                    }}
                    setForgotError={setForgotError}
                    forgotError={forgotError}
                />}
            </Grid.Container>
        </Card>
        <Spacer y={1} />
        <Card >
            <Text span css={{ fontWeight: 400, ta: "center", fs: 18 }} justify="center">
                You dont have an account? <Link href="/signup" passHref>
                    <ALink>Sign up here!</ALink>
                </Link>
            </Text>
        </Card>
    </Container>)
}

export default withPublic(Login);