import { useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Text, Grid, Card, Link as ALink, Switch, Avatar, useTheme, Row, } from '@nextui-org/react';
import Image from 'next/image';

import {
    UserIcon,
    DarkIcon,
    LightIcon,
    LogoutIcon,
    LoginIcon
} from '../../icons';

import {
    LoginModal
} from '../';

import useAuth from '../../hooks/auth';

const Navbar = ({ user }) => {
    const { setTheme } = useNextTheme();
    const { isDark } = useTheme();
    const auth = useAuth();
    const router = useRouter();
    const client = (typeof window === 'undefined') ? false : true;

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <nav style={{ backgroundColor: client && (isDark ? "black" : "white") }}>
                <Grid.Container justify="center" css={{ height: "100%" }}>
                    <Grid xs={6} sm={4} alignItems='center'>
                        <Link href={user ? "/home" : "/login"} passHref>
                            <Image
                                src={isDark ? "/icon_white.png" : "/icon_galactic.png"}
                                alt="Logo of Notal"
                                width={160}
                                height={40}
                                objectFit='contain'
                                loading="eager"
                            />
                        </Link>
                    </Grid>
                    <Grid xs={0} sm={4} justify='center' alignItems='center'>

                    </Grid>
                    <Grid xs={6} sm={4} justify='flex-end' alignItems='center'>
                        {(!user && !auth.authLoading) && <Switch
                            color="primary"
                            initialChecked={isDark}
                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                            iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                            iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                            css={{ mr: 12 }}
                            size="sm"
                        />}
                        {user ? <details>
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
                                    {auth?.authUser && <div style={{ position: "absolute", right: 0, top: 0, display: "flex", flexDirection: "column" }}>
                                        <Switch
                                            color="primary"
                                            initialChecked={isDark}
                                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                                            iconOn={<LightIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                            iconOff={<DarkIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                            size="sm"
                                        />
                                        <Text css={{ mr: 8, color: "$accents3" }}>v{process.env.NEXT_PUBLIC_APP_VERSION}</Text>
                                    </div>}
                                </Row>
                                <Text h4 css={{ mt: 8 }}>{user?.fullname || "@" + user?.username}</Text>
                                <Text span>{user?.email}</Text>
                                <Link href="/profile/[username]" as={`/profile/${user?.username}`} passHref>
                                    <ALink css={{ mt: 16 }}>
                                        <Button
                                            icon={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                                            css={{ mt: 12, width: "100%" }}
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
                        </details> : <>
                            <Button
                                onClick={() => setModalVisible(true)}
                                css={{ minWidth: 20, "@sm": { minWidth: 100 }, height: "80%" }}
                                color="gradient"
                            >
                                <LoginIcon height={24} width={24} style={{ fill: "currentColor", transform: "scale(0.8)", marginRight: 4 }} />
                                <Text css={{ display: "none", "@sm": { display: "flex" }, fontWeight: "600", color: "$white", fs: "1em" }}>Sign In</Text>
                            </Button>
                        </>}
                    </Grid>
                </Grid.Container>
                <LoginModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onLoginSuccess={() => {
                        setModalVisible(false);
                        router.replace(router.asPath);
                    }}
                />

            </nav>
            <style jsx>{`
            nav {
                overflow: visible;
                border-radius: 0;
                padding: 12px;
                paddingTop: 18px;
                position: sticky;
                top: 0px;
                z-index: 999;
            }
            details {
                position: relative;
                display: inline-block;
                background-color: transparent;
            }
            details[open] > summary:before {
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
        `}</style>
        </>)
}

export default Navbar;