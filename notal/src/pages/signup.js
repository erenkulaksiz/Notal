import { Button, Card, Container, Grid, Input, Link as ALink, Spacer, Text, useTheme } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import {
    CheckIcon,
    EmailIcon,
    PasswordIcon,
    UserIcon
} from '../icons';

import { withPublic } from '../hooks/route';
import { WorkboxInit } from '../utils';
import useAuth from '../hooks/auth';

const Signup = (props) => {
    const router = useRouter();
    const { isDark } = useTheme();
    const auth = useAuth();

    const [fullname, setFullname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [PAAC, setPAAC] = useState("");

    const [error, setError] = useState({ fullname: false, email: false, password: false, username: false, paac: false });

    useEffect(() => {
        WorkboxInit();
    }, []);

    const onRegister = async (e) => {
        e.preventDefault();
        if (!email || email.length == 0 || !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))) {
            setError({ ...error, email: "Please enter a valid e-mail." });
            return;
        } else {
            setError({ ...error, email: false });
        }
        /*
        if (fullname.length < 3 || fullname == '') {
            setError({ ...error, fullname: "Please enter a valid fullname." });
            return;
        } else {
            setError({ ...error, fullname: false });
        }
        */
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
        if (PAAC.length == 0 || !PAAC) {
            setError({ ...error, paac: "Please enter a valid PAAC." });
            return;
        } else {
            setError({ ...error, paac: false });
        }

        setError({ email: false, password: false, fullname: false, username: false, paac: false });

        alert("Sign up with email is currently disabled.");

        //const register = await auth.users.createUser({ email: email.toLowerCase(), password, fullname, username: username.toLowerCase(), paac: PAAC });

        /*
        if (register?.authError?.errorCode == "auth/email-already-in-use") {
            setError({ email: "This email is already in use.", password: false, fullname: false, username: false });
            return;
        } else if (register?.authError?.errorCode == "auth/username-already-in-use") {
            setError({ email: false, password: false, fullname: false, paac: false, username: "This username is already in use." });
            return;
        } else if (register?.authError?.errorCode == "auth/weak-password") {
            setError({ email: false, password: "Weak password.", fullname: false, paac: false, username: false });
            return;
        } else if (register?.authError?.errorCode == "paac/invalid-code") {
            setError({ email: false, password: false, fullname: false, username: false, paac: "This access code is invalid." })
            return;
        } else if (register?.authError?.errorCode == "auth/username-too-long") {
            setError({ email: false, password: false, fullname: false, username: "This username is too long.", paac: false })
            return;
        } else if (register?.authError?.errorCode == "auth/username-too-short") {
            setError({ email: false, password: false, fullname: false, username: "This username is too short.", paac: false })
            return;
        } else if (register?.authError?.errorCode == "auth/username-contains-space") {
            setError({ email: false, password: false, fullname: false, username: "Username cannot contain spaces.", paac: false })
            return;
        } else {
            setError({ email: false, password: false, fullname: false, username: false });
        }
        */
    }

    return (<Container xs css={{ dflex: "center", ac: "center", ai: "center" }}>
        <Head>
            <title>Signup · Notal</title>
            <meta name="description" content="Signup to Notal, the greatest note app" />
            <link rel="icon" href="/favicon.ico" />
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
                <Spacer y={1} />
                <Grid xs={12}>
                    <Text h3>Sign up</Text>
                </Grid>
                <Grid xs={12} sm={6} css={{ fd: "column" }}>
                    <Input
                        color="primary"
                        labelLeft={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='Username'
                        bordered
                        animated={false}
                        fullWidth
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value.replace(/[^\w\s]/gi, '').replace(/\s/g, '').toLowerCase())}
                        maxLength={20}
                    />
                    {error.username != false && <Text color={"$error"}>{error.username}</Text>}
                </Grid>
                <Grid xs={12} sm={6} css={{ fd: "column" }}>
                    <Input
                        color="primary"
                        labelLeft={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='Fullname (optional)'
                        bordered
                        animated={false}
                        fullWidth
                        type="text"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
                    />
                    {error.fullname != false && <Text color={"$error"}>{error.fullname}</Text>}
                </Grid>
                <Grid xs={12} css={{ fd: "column" }}>
                    <Input
                        color="primary"
                        labelLeft={<EmailIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='E-Mail'
                        bordered
                        animated={false}
                        fullWidth
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {error.email != false && <Text color={"$error"}>{error.email}</Text>}
                </Grid>
                <Grid xs={12} sm={6} css={{ fd: "column" }}>
                    <Input.Password
                        color="primary"
                        labelLeft={<PasswordIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='Password'
                        bordered
                        animated={false}
                        fullWidth
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {error.password != false && <Text color={"$error"}>{error.password}</Text>}
                </Grid>
                <Grid xs={12} sm={6} css={{ fd: "column" }}>
                    <Input.Password
                        color="primary"
                        labelLeft={<PasswordIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='Confirm Password'
                        bordered
                        animated={false}
                        fullWidth
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} css={{ fd: "column" }}>
                    <Input.Password
                        color="primary"
                        labelLeft={<PasswordIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='PAAC'
                        bordered
                        animated={false}
                        fullWidth
                        value={PAAC}
                        onChange={e => setPAAC(e.target.value)}
                    />
                    {error.paac != false && <Text color={"$error"}>{error.paac}</Text>}
                </Grid>
                <Grid>
                    <Button onClick={onRegister} color="gradient" size="xl" icon={<CheckIcon height={24} width={24} style={{ fill: "currentColor" }} />} fullWidth>Sign Up</Button>
                </Grid>
            </Grid.Container>
        </Card>
        <Spacer y={1} />
        <Card css={{ boxShadow: "$xl" }} bordered>
            <Text span css={{ fontWeight: 400, ta: "center", fs: 18 }} justify="center">
                You already have an account? <Link href="/login" passHref>
                    <ALink>Sign in here</ALink>
                </Link>
            </Text>
        </Card>
    </Container>)
}

export default withPublic(Signup);
