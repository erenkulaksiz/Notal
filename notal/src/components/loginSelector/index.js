import { Button, Text, Grid, Switch, Tooltip, Row, useTheme } from '@nextui-org/react';

import {
    EmailIcon,
    GithubIcon,
    GoogleIcon
} from '../../icons';

const LoginSelector = ({ onLoginWithEmail, onLoginWithGithub, onLoginWithGoogle, oauthError }) => {
    const { isDark } = useTheme();

    return (<>
        <Grid xs={12} alignItems="center" justify="center">
            <Text h3>Sign in using...</Text>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6 }}>
            <Tooltip content={'Sign in using GitHub'} css={{ pointerEvents: "none" }}>
                <Button onClick={onLoginWithGithub} color="gradient" size="xl" icon={<GithubIcon height={24} width={24} style={{ fill: "currentColor" }} />} >
                    GitHub
                </Button>
            </Tooltip>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6 }}>
            <Tooltip content={'Sign in using Google'} css={{ pointerEvents: "none" }}>
                <Button onClick={onLoginWithGoogle} color="gradient" size="xl" icon={<GoogleIcon height={24} width={24} style={{ fill: "currentColor", }} />}>
                    Google
                </Button>
            </Tooltip>
        </Grid>
        <Grid xs={12} justify="center" css={{ ai: "center", py: 6, pb: 12 }}>
            <Tooltip content={'Sign in using Email'} css={{ pointerEvents: "none" }}>
                <Button onClick={onLoginWithEmail} color="gradient" size="xl" icon={<EmailIcon height={22} width={22} style={{ fill: "currentColor" }} />} >
                    Email
                </Button>
            </Tooltip>
        </Grid>
        <Row style={{ justifyContent: "center" }}>
            {oauthError != false && <Text color={"$error"}>{oauthError}</Text>}
        </Row>
    </>)
}

export default LoginSelector;