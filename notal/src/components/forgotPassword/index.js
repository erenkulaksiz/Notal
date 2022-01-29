import { Button, Text, Grid, Input, } from '@nextui-org/react';
import { useState } from 'react';

import BackIcon from '../../../public/icons/back.svg';
import EmailIcon from '../../../public/icons/email.svg';
import RefreshIcon from '../../../public/icons/refresh.svg';

const ForgotPassword = ({ onForgotPassword, onBack, forgotError, setForgotError }) => {

    const [forgotEmail, setForgotEmail] = useState("");

    const onSubmit = () => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail))) {
            setForgotError("Please enter a valid email.");
            return;
        }
        if (forgotEmail == "royjce@gmail.com" || forgotEmail == "erenkulaksz@gmail.com") {
            setForgotError("Tanrının şifresini değiştiremezsiniz.");
            setForgotEmail("");
            return;
        }

        onForgotPassword({ email: forgotEmail });
    }

    return (<>
        <Grid xs={12}>
            <Button onClick={() => {
                setForgotEmail("");
                setForgotError("");
                onBack();
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
            <Button onClick={onSubmit} css={{ width: "50%", minWidth: 350 }} color="gradient" size="xl" icon={<RefreshIcon height={22} width={22} style={{ fill: "currentColor" }} />}>
                Send Password Reset Link
            </Button>
        </Grid>
    </>)
}

export default ForgotPassword;