import styled from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Text, Grid, Card, Link as ALink, Switch, Avatar, useTheme, Row, Tooltip } from '@nextui-org/react';

import {
    UserIcon,
    DarkIcon,
    LightIcon,
    LogoutIcon,
    LoginIcon
} from '../../icons';

import useAuth from '../../hooks/auth';

const Details = styled.details`
    position: relative;
    display: inline-block;
    background-color: transparent;
    &[open] > summary:before {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: block;
        cursor: default;
        content: " ";
    }
`;

const Header = styled.nav`
    //backdrop-filter: saturate(180%) blur(10px);
    background-color: ${props => props.isDark ? "black" : "white"};
    overflow: visible;
    border-radius: 0;
    padding: 12px;
    paddingTop: 18px;
    position: sticky;
    top: 0px;
    z-index: 999;
`;

const Navbar = ({ user }) => {
    const { setTheme } = useNextTheme();
    const { isDark } = useTheme();
    const auth = useAuth();
    const router = useRouter();

    return (<Header isDark={isDark}>
        <Grid.Container justify="center">
            <Grid xs={6} sm={4} alignItems='center'>
                <Link href={auth?.authUser ? "/home" : "/login"} passHref>
                    <ALink>
                        <img
                            src={isDark ? "/icon_white.png" : "/icon_galactic.png"}
                            alt="Logo of Notal"
                            style={{ maxHeight: "100%", width: 160, }}
                        />
                    </ALink>
                </Link>
            </Grid>
            <Grid xs={0} sm={4} justify='center' alignItems='center'>

            </Grid>
            <Grid xs={6} sm={4} justify='flex-end' alignItems='center'>
                {!auth?.authUser && <Switch
                    color="primary"
                    initialChecked={isDark}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    css={{ mr: 12 }}
                    size="sm"
                />}
                {auth?.authUser ? <Details>
                    <summary style={{
                        userSelect: "none",
                        "&::WebkitDetailsMarket": {
                            display: "none",
                        }
                    }}>
                        <Avatar size="md" color="gradient" bordered src={user?.avatar} referrerPolicy='no-refferer' icon={<UserIcon height={24} width={24} style={{ fill: "white" }} />} pointer />
                    </summary>
                    <Card css={{ zIndex: 2, position: "absolute", right: 0, top: "100%", width: "auto", boxShadow: "$lg" }}>
                        <Row css={{ mt: 0, justifyContent: "flex-end", }}>
                            {auth?.authUser && <div style={{ position: "absolute", right: 0, top: 0, display: "flex", flexDirection: "row" }}>
                                <Text css={{ mr: 8, color: "$accents3" }}>v{process.env.NEXT_PUBLIC_APP_VERSION}</Text>
                                <Switch
                                    color="primary"
                                    initialChecked={isDark}
                                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                                    iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                    iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                    size="sm"
                                /></div>}
                        </Row>
                        <Text h4 css={{ mt: 8 }}>{user?.fullname || "@" + user?.username}</Text>
                        <Text span>{user?.email}</Text>
                        <Link href="/profile/[username]" as={`/profile/${user?.username}`} passHref>
                            <ALink css={{ mt: 16 }}>
                                <Button
                                    icon={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                    css={{ mt: 12 }}
                                    size="md"
                                    color="gradient"
                                >
                                    Profile
                                </Button>
                            </ALink>
                        </Link>
                        <Button
                            icon={<LogoutIcon height={24} width={24} style={{ fill: "currentColor", }} />}
                            onClick={() => {
                                auth.users.logout();
                                router.replace(router.asPath);
                            }}
                            css={{ mt: 8, mb: 8 }}
                            size="md"
                            color="gradient"
                        >
                            Sign Out
                        </Button>
                    </Card>
                </Details> : <>
                    <Button
                        onClick={() => router.push(`/login`)}
                        css={{ minWidth: 20, "@sm": { minWidth: 100 }, height: "80%" }}
                        color="gradient"
                    >
                        <LoginIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                        <Text css={{ display: "none", "@sm": { display: "flex" }, fontWeight: "600", color: "$white", fs: "1em" }}>Sign In</Text>
                    </Button>
                </>}
            </Grid>
        </Grid.Container>
    </Header>)
}

export default Navbar;