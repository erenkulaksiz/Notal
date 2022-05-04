import { Button, Text, Grid, Input, } from '@nextui-org/react';
import { useState } from 'react';

import {
    BackIcon,
    EmailIcon,
    RefreshIcon
} from '../../icons';

const ForgotPassword = ({ onForgotPassword, onBack, forgotError, setForgotError }) => {

    const [forgotEmail, setForgotEmail] = useState("");

    const onSubmit = () => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail))) {
            setForgotError("Please enter a valid email.");
            return;
        }
        if (forgotEmail == "royjce@gmail.com" || forgotEmail == "erenkulaksz@gmail.com") {
            setForgotError(":)");
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
                onChange={e => setForgotEmail(e.target.value)}
                value={forgotEmail}
                animated={false}
                fullWidth
            />
        </Grid>
        {forgotError != false && <Text color={"$error"}>{forgotError}</Text>}
        <Grid xs={12} justify='center'>
            <Button onClick={onSubmit} css={{ width: "100%", fs: "0.9em", "@xs": { fs: "1.2em" }, "@sm": { fs: "1.2em" } }} color="gradient" size="xl" icon={<RefreshIcon height={22} width={22} style={{ fill: "currentColor" }} />}>
                Send Password Reset Link
            </Button>
        </Grid>
    </>)
}

export default ForgotPassword;