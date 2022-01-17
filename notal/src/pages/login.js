import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';

import useAuth from '../hooks/auth';
import { withPublic } from '../hooks/route';

import Button from '../components/button';
import Input from '../components/input';

import EmailIcon from '../../public/icons/email.svg';
import PasswordIcon from '../../public/icons/password.svg';
import LoginIcon from '../../public/icons/login.svg';
import SignupIcon from '../../public/icons/signup.svg';
import WarningIcon from '../../public/icons/warning.svg';
import BackIcon from '../../public/icons/back.svg';
import GoogleIcon from '../../public/icons/google.svg';
import GithubIcon from '../../public/icons/github.svg';
import RefreshIcon from '../../public/icons/refresh.svg';
import CheckIcon from '../../public/icons/check.svg';
import QuestionIcon from '../../public/icons/question.svg';
import DarkIcon from '../../public/icons/dark.svg';
import LightIcon from '../../public/icons/light.svg';

import AuthService from '../service/AuthService';
import useTheme from '../hooks/theme';

const Login = (props) => {
    const router = useRouter();
    const auth = useAuth();
    const theme = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");

    const [passwordVisible, setPasswordVisible] = useState(false);

    //const [rememberMe, setRememberMe] = useState(false);

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
        e.preventDefault();

        if (!email || email.length == 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setError({ ...error, email: "Please enter a valid e-mail." });
            return;
        } else {
            setError({ ...error, email: false });
        }

        if (!password || password.length == 0) {
            setError({ ...error, password: "Please enter a password." });
            return;
        } else {
            setError({ ...error, password: false });
        }

        const login = await auth.login.password({ email, password });

        console.log("errors: ", login?.authError);

        if (login?.authError?.errorCode == "auth/user-not-found" || login?.authError?.errorCode == "auth/wrong-password") {
            setError({ ...error, login: "This email and password combination is incorrect." });
            return;
        } else {
            setError({ ...error, login: false });
        }
    }

    const onForgotPassword = async (e) => {
        if (!forgotEmail || forgotEmail.length == 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail))) {
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

    return (
        <div className={styles.container} data-theme={theme.UITheme}>
            <Head>
                <title>Login · Notal</title>
                <meta name="description" content="Login to Notal, the greatest note app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles.content_login}>
                <div className={styles.login}>
                    <div className={styles.themeSwitchContainer}>
                        <button onClick={() => theme.toggleTheme()}>
                            {theme.UITheme == "theme-dark" ? <LightIcon height={32} width={32} className={styles.themeIcon} /> : <DarkIcon height={32} width={32} className={styles.themeIcon} />}
                        </button>
                    </div>
                    <form id="login" onSubmit={e => onLogin(e)}>
                        <div className={styles.logoContainer}>
                            <img
                                src={"./icon_white.png"}
                                alt="Logo of Notal"
                                width={210}
                                height={60}
                            />
                            <Button
                                text="What's Notal?"
                                type="button"
                                icon={<QuestionIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                style={{ marginTop: 24, border: "none", height: 48 }}
                                onClick={() => router.push("/about")}
                                reversed
                            />
                        </div>
                        {
                            view == "email" ? <>
                                <Button
                                    text="Back"
                                    type="button"
                                    icon={<BackIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 24, border: "none", height: 48, width: "25%", minWidth: 160 }}
                                    onClick={() => {
                                        setView(null);
                                        setError({ email: false, password: false, login: false });
                                        setEmail("");
                                        setPassword("");
                                        setPasswordVisible(false);
                                    }}
                                    reversed
                                />
                                <h1>Sign in with E-mail</h1>
                                <Input
                                    type="email"
                                    placeholder="E-mail"
                                    onChange={e => setEmail(e.target.value)}
                                    value={email}
                                    icon={<EmailIcon height={24} width={24} />}
                                    required
                                    style={{ marginTop: 18 }}
                                    error={error.email != false || error.login}
                                />
                                {error.email != false && <p className={styles.errorMsg}>{error.email}</p>}
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => setPassword(e.target.value)}
                                    value={password}
                                    icon={<PasswordIcon height={24} width={24} />}
                                    visible={passwordVisible}
                                    onVisibilityPress={() => setPasswordVisible(!passwordVisible)}
                                    visibleButton
                                    required
                                    style={{ marginTop: 18 }}
                                    error={error.password != false || error.login}
                                />
                                {error.password != false && <p className={styles.errorMsg}>{error.password}</p>}
                                {error.login != false && <p className={styles.errorMsg}>{error.login}</p>}
                                <div className={styles.alt}>
                                    {/* contains remember me checkbox and forgot password link */}
                                    <div className={styles.forgot}>
                                        <a href="#" onClick={() => { setView("forgot"); setForgotError("") }}>Forgot Password?</a>
                                    </div>
                                    <div className={styles.remember}>
                                        {/*<input name="rememberme" type="checkbox" id="rememberme" value={rememberMe} onClick={() => setRememberMe(!rememberMe)} />
                                        <label htmlFor="rememberme" >Remember Me</label>*/}
                                    </div>
                                </div>
                                <Button
                                    text="Login"
                                    type="submit"
                                    icon={<LoginIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 18, border: "none" }}
                                    reversed
                                    onClick={onLogin}
                                />
                            </> : view == "forgot" ? <>
                                <Button
                                    text="Back"
                                    type="button"
                                    icon={<BackIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 24, border: "none", height: 48, width: "25%", minWidth: 160 }}
                                    onClick={() => {
                                        setView("email");
                                        setForgotEmail("");
                                        setForgotError("");
                                    }}
                                    reversed
                                />
                                <h1>Forgot Password</h1>
                                <Input
                                    type="email"
                                    placeholder="E-mail"
                                    onChange={e => setForgotEmail(e.target.value)}
                                    value={forgotEmail}
                                    icon={<EmailIcon height={24} width={24} />}
                                    required
                                    style={{ marginTop: 18 }}
                                    error={forgotError.length != 0}
                                />
                                {forgotError && <p className={styles.errorMsg}>{forgotError}</p>}
                                <Button
                                    text="Send Password Reset Link"
                                    type="button"
                                    icon={<RefreshIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 24, border: "none" }}
                                    reversed
                                    onClick={onForgotPassword}
                                />
                            </> : view == "sentEmail" ? <>
                                <Button
                                    text="Login"
                                    type="button"
                                    icon={<BackIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 12, border: "none", height: 48, width: "25%", minWidth: 160 }}
                                    onClick={() => setView(null)}
                                    reversed
                                />
                                <h1 className={styles.sentPasswordReset}>
                                    <CheckIcon height={24} width={24} style={{ marginRight: 8 }} />
                                    A password reset link has been sent.
                                </h1>
                            </> : <><h1>Sign in using...</h1>
                                <Button
                                    text="GitHub"
                                    type="button"
                                    icon={<GithubIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 24, border: "none" }}
                                    reversed
                                    onClick={onLoginWithGithub}
                                />
                                <Button
                                    text="Google"
                                    type="button"
                                    icon={<GoogleIcon height={30} width={30} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 12, border: "none" }}
                                    reversed
                                    onClick={onLoginWithGoogle}
                                />
                                <Button
                                    text="E-mail"
                                    type="button"
                                    icon={<EmailIcon height={24} width={24} style={{ marginRight: 8 }} />}
                                    style={{ marginTop: 12, border: "none" }}
                                    onClick={() => setView("email")}
                                    reversed
                                />

                                {oauthError != false && <p className={styles.errorMsg}>{oauthError}</p>}
                            </>
                        }
                    </form>
                </div>
                <div className={styles.signup}>
                    <Link href="/signup" passHref>
                        <span>{"You don't have an account?"} <a>Sign up here!</a></span>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default withPublic(Login);