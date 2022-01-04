import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from '../../styles/App.module.scss';
import { useRouter } from 'next/router';

import Logo from '/public/icon_white.png';
import EmailIcon from '../../public/icons/email.svg';
import PasswordIcon from '../../public/icons/password.svg';
import LoginIcon from '../../public/icons/login.svg';
import SignupIcon from '../../public/icons/signup.svg';
import UserIcon from '../../public/icons/user.svg';
import CheckIcon from '../../public/icons/check.svg';

import Button from '../components/button';
import Input from '../components/input';
import Alert from '../components/alert';

import useAuth from '../hooks/auth';
import { withPublic } from '../hooks/route';

const Signup = (props) => {
    const router = useRouter();

    const { createUser, authError } = useAuth();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [error, setError] = useState({ fullname: false, email: false, password: false, username: false });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const [successAlert, setSuccessAlert] = useState(false);

    const onRegister = async (e) => {
        e.preventDefault();
        if (!email || email.length == 0 || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            setError({ ...error, email: "Please enter a valid e-mail." });
            return;
        } else {
            setError({ ...error, email: false });
        }
        if (fullname.length < 3 || fullname == '') {
            setError({ ...error, fullname: "Please enter a valid fullname." });
            return;
        } else {
            setError({ ...error, fullname: false });
        }
        if (!(password == passwordConfirm)) {
            setError({ ...error, password: "These passwords does not match." });
            return;
        } else {
            setError({ ...error, password: false });
        }
        if (password.length == 0 || !password) {
            setError({ ...error, password: "Please enter a valid password." });
            return;
        } else {
            setError({ ...error, password: false });
        }
        if (username.length == 0 || !username) {
            setError({ ...error, username: "Please enter a valid username." });
            return;
        } else {
            setError({ ...error, username: false });
        }

        setError({ email: false, password: false, fullname: false, username: false });

        const register = await createUser({ email: email.toLowerCase(), password, fullname, username: username.toLowerCase() });

        console.log("Autherror: ", register?.authError);

        if (register?.authError?.errorCode == "auth/email-already-in-use") {
            setError({ email: "This email is already in use.", password: false, fullname: false, username: false });
            return;
        } else if (register?.authError?.errorCode == "auth/username-already-in-use") {
            setError({ email: false, password: false, fullname: false, username: "This username is already in use." });
            return;
        } else if (register?.authError?.errorCode == "auth/weak-password") {
            setError({ email: false, password: "Weak password.", fullname: false, username: false });
            return;
        } else {
            setError({ email: false, password: false, fullname: false, username: false });
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Signup · Notal</title>
                <meta name="description" content="Signup to Notal, the greatest note app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.content_signup}>
                <div className={styles.signup}>
                    <form id="signup" onSubmit={e => onRegister(e)}>
                        <Image
                            src={Logo}
                            alt="Logo of Notal"
                            priority={true}
                            width={210}
                            height={60}
                            layout="fixed"
                            quality={100}
                        />
                        <h1>Sign up</h1>

                        <div style={{ display: "flex", flexDirection: "row", marginTop: 18, justifyContent: "space-between" }}>

                            <div style={{ width: "48%" }}>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    onChange={e => setUsername(e.target.value.replace(/[^\w\s]/gi, "").replace(/\s/g, '').toLowerCase())}
                                    value={username}
                                    icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                                    error={error.username != false}
                                    required
                                    style={{ width: "100%" }}
                                    maxLength={16}
                                />

                                {error.username != false && <p className={styles.errorMsg}>{error.username}</p>}

                            </div>

                            <div style={{ width: "48%" }}>
                                <Input
                                    type="text"
                                    placeholder="Fullname"
                                    onChange={e => setFullname(e.target.value)}
                                    value={fullname}
                                    icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                                    error={error.fullname != false}
                                    required
                                    maxLength={64}
                                    style={{ width: "100%" }}
                                />

                                {error.fullname != false && <p className={styles.errorMsg}>{error.fullname}</p>}
                            </div>

                        </div>


                        <Input
                            type="email"
                            placeholder="E-mail"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            icon={<EmailIcon height={24} width={24} fill={"#19181e"} />}
                            error={error.email != false}
                            required
                            style={{ marginTop: 18 }}
                        />

                        {error.email != false && <p className={styles.errorMsg}>{error.email}</p>}

                        <Input
                            type="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            icon={<PasswordIcon height={24} width={24} fill={"#19181e"} />}
                            error={error.password != false}
                            visible={passwordVisible}
                            onVisibilityPress={() => setPasswordVisible(!passwordVisible)}
                            visibleButton
                            required
                            style={{ marginTop: 18 }}
                        />

                        {error.password != false && <p className={styles.errorMsg}>{error.password}</p>}

                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            onChange={e => setPasswordConfirm(e.target.value)}
                            value={passwordConfirm}
                            icon={<PasswordIcon height={24} width={24} fill={"#19181e"} />}
                            error={error.password != false}
                            visible={confirmVisible}
                            onVisibilityPress={() => setConfirmVisible(!confirmVisible)}
                            visibleButton
                            required
                            style={{ marginTop: 18 }}
                        />

                        <Button
                            text="Sign Up"
                            type="submit"
                            icon={<CheckIcon height={24} width={24} fill={"#000"} style={{ marginRight: 8 }} />}
                            style={{ marginTop: 24, border: "none" }}
                            reversed
                        />
                    </form>
                </div>
                <div className={styles.login}>
                    <Link href="/login" passHref>
                        <span>You already have an account? <a>Sign in here!</a></span>
                    </Link>
                </div>
            </div>
            <Alert
                visible={successAlert}
                icon={<CheckIcon height={24} width={24} fill={"#27a614"} style={{ marginRight: 8 }} />}
                title="Success!"
                textColor="#27a614"
                text="Welcome to Notal! You have been registered succesfully. See you on the other side! :)"
                buttons={[
                    <Button
                        text="Close"
                        onClick={() => setSuccessAlert(false)}
                        key={0}
                    />,
                    <Link href="/login" key={1} passHref>
                        <Button
                            text="Login"
                            icon={<LoginIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                            style={{ borderStyle: "none" }}
                            reversed
                        />
                    </Link>]}
            />
        </div>
    )
}

export default withPublic(Signup);