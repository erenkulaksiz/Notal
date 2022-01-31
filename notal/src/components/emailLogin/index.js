import { Button, Text, Grid, Input, Link as ALink } from '@nextui-org/react';
import { useState } from 'react';

import BackIcon from '../../../public/icons/back.svg';
import EmailIcon from '../../../public/icons/email.svg';
import PasswordIcon from '../../../public/icons/password.svg';
import LoginIcon from '../../../public/icons/login.svg';

const EmailLogin = ({ onLogin, onBack, setError, error, onForgot }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmit = () => {
        if (email.length == 0 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            setError({ ...error, email: "Please enter a valid e-mail.", password: false });
            return;
        }

        if (password.length < 3) {
            setError({ ...error, password: "Please enter a password.", email: false });
            return;
        }

        setError({ ...error, password: false, email: false });
        onLogin({ email, password });
    }

    return (<>
        <Grid xs={12}>
            <Button onClick={onBack} icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}>
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
                animated={false}
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
                animated={false}
            />
            {error.password != false && <Text color={"$error"}>{error.password}</Text>}
        </Grid>
        <Grid xs={12} css={{ fd: "column" }}>
            <ALink href={"#"} onClick={onForgot}>
                Forgot Password?
            </ALink>
        </Grid>
        {error.login != false && <Text color={"$error"}>{error.login}</Text>}
        <Grid xs={12} justify='center'>
            <Button onClick={onSubmit} color="gradient" size="xl" icon={<LoginIcon height={22} width={22} style={{ fill: "currentColor" }} />} >
                Sign In
            </Button>
        </Grid>
    </>)
}

export default EmailLogin;