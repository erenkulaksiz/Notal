import { Button, Card, Container, Grid, Link as ALink, Row, Spacer, Text, useTheme } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';


import { withPublic } from '../hooks/route';
import { WorkboxInit } from '../utils';
import AuthService from '../service/AuthService';
import useAuth from '../hooks/auth';

// Icons
import {
    BackIcon,
    CheckOutlineIcon
} from '../icons';

// Components
import {
    AcceptCookies,
    EmailLogin,
    ForgotPassword,
    LoginSelector
} from '../components';

const Login = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const { isDark } = useTheme();

    const [forgotError, setForgotError] = useState("");

    const [view, setView] = useState(null);
    const [error, setError] = useState({ email: false, password: false, login: false });
    const [oauthError, setOauthError] = useState(false);

    useEffect(() => {
        WorkboxInit();
    }, []);

    const onLoginWithGoogle = async () => {
        const login = await auth.login.google();
        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError(`This account exist with different credential. Please try another method.`);
        }
    }

    const onLoginWithGithub = async () => {
        const login = await auth.login.github();
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
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>
        <ALink onClick={() => router.push("/")}>
            <img
                src={isDark ? "./icon_white.png" : "./icon_galactic.png"}
                alt="Logo of Notal"
                width={210}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
                height={60}
            />
        </ALink>
        <Card css={{ minWidth: 300, mt: 64, boxShadow: "$xl" }} bordered>
            <Grid.Container gap={2} justify="center">
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
                    oauthError={oauthError}
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
                {view == "sentEmail" && <>
                    <Row css={{ mt: 6 }}>
                        <Button onClick={() => setView(null)}
                            icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                            Back
                        </Button>
                    </Row>
                    <Spacer y={1} />
                    <Card css={{ bg: "$gradient" }}>
                        <Grid.Container gap={2}>
                            <Grid xs={12} justify='center'>
                                <CheckOutlineIcon height={24} width={24} style={{ fill: "white", transform: "scale(2)" }} />
                            </Grid>
                            <Grid xs={12} justify='center'>
                                <Text h3>An email has been sent to reset your password.</Text>
                            </Grid>
                        </Grid.Container>
                    </Card>
                </>}
            </Grid.Container>
        </Card>
        {/*<Spacer y={1} />
        <Card css={{ boxShadow: "$xl" }} bordered>
            <Text span css={{ fontWeight: 400, ta: "center", fs: 18 }} justify="center">
                You dont have an account? <Link href="/signup" passHref>
                    <ALink>Sign up here</ALink>
                </Link>
            </Text>
        </Card>*/}
        {Cookies.get('cookies') != "true" && <AcceptCookies
            style={{ position: "absolute" }}
            visible={Cookies.get('cookies') != "true"}
            onAccept={() => {
                Cookies.set('cookies', 'true');
                router.replace(router.asPath);
            }}
        />}
    </Container>)
}

export default withPublic(Login);