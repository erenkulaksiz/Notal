import { Button, Text, Grid, Card, Link as ALink, Switch, Avatar, useTheme } from '@nextui-org/react';
import styled from 'styled-components'
import { useTheme as useNextTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import UserIcon from '../../../public/icons/user.svg';
import DarkIcon from '../../../public/icons/dark.svg';
import LightIcon from '../../../public/icons/light.svg';
import LogoutIcon from '../../../public/icons/logout.svg';
import LoginIcon from '../../../public/icons/login.svg';

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
        background: transparent;
    }
`;

const Header = styled.div`
    //backdrop-filter: saturate(180%) blur(10px);
    background-color: ${props => props.isDark ? "black" : "white"};
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
    const router = useRouter();
    const auth = useAuth();

    return (<Header isDark={isDark}>
        <Grid.Container justify="center" >
            <Grid xs={6} sm={4} alignItems='center'>
                <ALink onClick={() => router.push("/home")}>
                    <img
                        src={isDark ? "/icon_white.png" : "/icon_galactic.png"}
                        alt="Logo of Notal"
                        style={{ maxHeight: "100%", width: 160, }}
                    />
                </ALink>
            </Grid>
            <Grid xs={0} sm={4} justify='center' alignItems='center'>

            </Grid>
            <Grid xs={6} sm={4} justify='flex-end' alignItems='center'>
                <Switch
                    color="primary"
                    initialChecked={isDark}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    css={{ mr: 12 }}
                />
                {auth.authUser ? <Details style={{
                    position: "relative",
                    display: "inline-block",
                    backgroundColor: "transparent"
                }}>
                    <summary style={{
                        userSelect: "none",
                        "&::WebkitDetailsMarket": {
                            display: "none",
                        }
                    }}>
                        <Avatar size="md" color="gradient" bordered src={user?.avatar} icon={<UserIcon height={24} width={24} style={{ fill: "white" }} />} pointer />
                    </summary>
                    <Card css={{ zIndex: 2, position: "absolute", right: 0, top: "100%", width: "auto" }}>
                        <Text h4>{user?.fullname || "@" + user?.username}</Text>
                        <Text span>{user?.email}</Text>
                        <Button
                            icon={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                            onClick={() => router.push(`/profile/${user?.username}`)}
                            css={{ mt: 12 }}
                            size="md"
                            color="gradient"
                        >
                            Profile
                        </Button>
                        <Button
                            icon={<LogoutIcon height={24} width={24} style={{ fill: "currentColor", }} />}
                            onClick={() => {
                                auth.users.logout();
                                router.replace(router.asPath);
                            }}
                            css={{ mt: 8 }}
                            size="md"
                            color="gradient"
                        >
                            Sign Out
                        </Button>
                    </Card>
                </Details> : <>
                    <Button
                        icon={<LoginIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        onClick={() => router.push(`/login`)}
                        size="sm"
                        color="gradient"
                    >
                        Sign In
                    </Button>
                </>}
            </Grid>
        </Grid.Container>
    </Header >)
}

export default Navbar;