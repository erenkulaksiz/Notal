import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
//import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, Switch, useTheme, Tooltip, Input } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';

import useAuth from '../hooks/auth';
import { withPublic } from '../hooks/route';

//import Button from '../components/button';

import EmailIcon from '../../public/icons/email.svg';
import PasswordIcon from '../../public/icons/password.svg';
import LoginIcon from '../../public/icons/login.svg';
//import SignupIcon from '../../public/icons/signup.svg';
//import WarningIcon from '../../public/icons/warning.svg';
import BackIcon from '../../public/icons/back.svg';
import GoogleIcon from '../../public/icons/google.svg';
import GithubIcon from '../../public/icons/github.svg';
import RefreshIcon from '../../public/icons/refresh.svg';
import CheckIcon from '../../public/icons/check.svg';
import QuestionIcon from '../../public/icons/question.svg';
import DarkIcon from '../../public/icons/dark.svg';
import LightIcon from '../../public/icons/light.svg';

import AuthService from '../service/AuthService';

const Login = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const { setTheme } = useNextTheme();
    const { isDark } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");

    const [view, setView] = useState(null);
    const [error, setError] = useState({ email: false, password: false, login: false });
    const [oauthError, setOauthError] = useState(false);

    useEffect(() => {
        if (view == "forgot") {
            if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
                setForgotEmail(email);
        }
    }, [view]);

    const onLoginWithGoogle = async (e) => {
        const login = await auth.login.google();

        console.log("google login errors: ", login?.authError);
    }

    const onLoginWithGithub = async (e) => {
        const login = await auth.login.github();

        console.log("github login errors: ", login?.authError);

        if (login?.authError?.errorCode == "auth/account-exists-with-different-credential") {
            setOauthError("This account exist with different credential. Please try another method.");
        }
    }

    const onLogin = async (e) => {
        if (email.length == 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setError({ ...error, email: "Please enter a valid e-mail.", password: false });
            return;
        }

        if (password.length < 3) {
            setError({ ...error, password: "Please enter a password.", email: false });
            return;
        }

        setError({ ...error, password: false, email: false });

        const login = await auth.login.password({ email, password });

        if (login?.authError?.errorCode == "auth/user-not-found" || login?.authError?.errorCode == "auth/wrong-password") {
            setError({ ...error, login: "This email and password combination is incorrect.", password: false, email: false });
        } else {
            setError({ ...error, login: false });
        }
    }

    const onForgotPassword = async (e) => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail))) {
            setForgotError("Please enter a valid email.");
            return;
        }
        if (forgotEmail == "royjce@gmail.com" || forgotEmail == "erenkulaksz@gmail.com") {
            setForgotError("Tanrının şifresini değiştiremezsiniz.");
            setForgotEmail("");
            return;
        }
        const sendLink = await AuthService.sendPasswordResetLink({ email: forgotEmail });
        if (sendLink?.error) {
            if (sendLink?.error?.code == "auth/user-not-found") {
                setForgotError("Cannot find a user with this email.");
                return;
            }
        }
        if (sendLink.success) {
            setForgotError(false);
            setView("sentEmail");
        }
    }

    const renderForgotPassword = () => <>
        <Grid xs={12}>
            <Button onClick={() => {
                setView("email");
                setForgotEmail("");
                setForgotError("");
                setError({ ...error, login: false, email: false, password: false });
            }}
                icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                Back
            </Button>
        </Grid>
        <Grid xs={12}>
            <Text h3>Forgot Password</Text>
        </Grid>
        <Grid xs={12} css={{ fd: "column" }}>
            <Input
                color="primary"
                labelLeft={<EmailIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                placeholder='E-mail'
                bordered
                fullWidth
                onChange={e => setForgotEmail(e.target.value)}
                value={forgotEmail}
            />
        </Grid>
        {forgotError != false && <Text color={"$error"}>{forgotError}</Text>}
        <Grid xs={12} justify='center'>
            <Button onClick={onForgotPassword} css={{ width: "50%", minWidth: 350 }} color="gradient" size="xl" icon={<RefreshIcon height={22} width={22} style={{ fill: "currentColor" }} />}>
                Send Password Reset Link
            </Button>
        </Grid>
    </>

    const renderEmailLogin = () => <>
        <Grid xs={12}>
            <Button onClick={() => {
                setView(null);
                setError({ ...error, login: false, email: false, password: false });
            }}
                icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                Back
            </Button>
        </Grid>
        <Grid xs={12}>
            <Text h3>Sign in with E-mail</Text>
        </Grid>
        <Grid xs={12} css={{ fd: "column" }}>
            <Input
                color="primary"
                labelLeft={<EmailIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                placeholder='E-mail'
                bordered
                fullWidth
                onChange={e => setEmail(e.target.value)}
            />
            {error.email != false && <Text color={"$error"}>{error.email}</Text>}
        </Grid>
        <Grid xs={12} css={{ fd: "column" }}>
            <Input.Password
                color="primary"
                labelLeft={<PasswordIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                placeholder='Password'
                bordered
                fullWidth
                onChange={e => setPassword(e.target.value)}
            />
            {error.password != false && <Text color={"$error"}>{error.password}</Text>}
        </Grid>
        <Grid xs={12} css={{ fd: "column" }}>
            <ALink href={"#"} onClick={() => {
                setView("forgot");
                setForgotError("")
            }}>
                Forgot Password?
            </ALink>
        </Grid>
        {error.login != false && <Text color={"$error"}>{error.login}</Text>}
        <Grid xs={12} justify='center'>
            <Button onClick={onLogin} color="gradient" size="xl" icon={<LoginIcon height={22} width={22} style={{ fill: "currentColor" }} />} >
                Sign In
            </Button>
        </Grid>
    </>

    const renderLogin = () => <>
        <Grid xs={12} alignItems="center" justify="center">
            <Text h3>Sign in using...</Text>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6 }}>
            <Tooltip content={'Sign in using GitHub'}>
                <Button onClick={onLoginWithGithub} color="gradient" size="xl" icon={<GithubIcon height={24} width={24} style={{ fill: "currentColor" }} />} >
                    GitHub
                </Button>
            </Tooltip>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6 }}>
            <Tooltip content={'Sign in using Google'}>
                <Button onClick={onLoginWithGoogle} color="gradient" size="xl" icon={<GoogleIcon height={28} width={28} style={{ fill: "currentColor", }} />}>
                    Google
                </Button>
            </Tooltip>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6, pb: 12 }}>
            <Tooltip content={'Sign in using Email'}>
                <Button onClick={() => setView("email")} color="gradient" size="xl" icon={<EmailIcon height={22} width={22} style={{ fill: "currentColor" }} />} >
                    Email
                </Button>
            </Tooltip>
        </Grid>
        <Switch
            color="primary"
            initialChecked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
        />
    </>

    return (<Container xs css={{ dflex: "center", ac: "center", ai: "center" }}>
        <Head>
            <title>Login · Notal</title>
            <meta name="description" content="Login to Notal, the greatest note app" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Card css={{ minWidth: 300 }}>
            <Grid.Container gap={2} justify="center">
                <Grid xs={12} sm={6} alignItems="center" justify="center">
                    <img
                        src={isDark ? "./icon_white.png" : "./icon_galactic.png"}
                        alt="Logo of Notal"
                        width={210}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                        height={60}
                    />
                </Grid>
                <Grid xs={12} sm={6} alignItems="center" justify="center">
                    <Tooltip content={'Learn more about Notal'}>
                        <Button onClick={() => router.push("/about")} size="lg" icon={<QuestionIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
                            About
                        </Button>
                    </Tooltip>
                </Grid>
                {!view && renderLogin()}
                {view == "email" && renderEmailLogin()}
                {view == "forgot" && renderForgotPassword()}
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