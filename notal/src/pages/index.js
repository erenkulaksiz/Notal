import { Button, Spacer, Container, Text, Card, useTheme, Row, Avatar, Link as ALink, Grid } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
import PoweredByVercel from 'powered-by-vercel';
import styled from 'styled-components';

import {
    CodeIcon,
    EditIcon,
    HeartIcon,
    PeopleIcon,
    ShareIcon,
    UserIcon,
    WarningIcon
} from '../icons';

import {
    AcceptCookies,
    Navbar
} from '../components';

import useAuth from '../hooks/auth';

import {
    CheckToken,
    ValidateToken,
    WorkboxInit
} from '../utils';

const ImageContainer = styled.div`
    width: 100%;
    height: 500px;
    position: absolute;
    opacity: ${props => props.isDark ? 0.4 : 1};
    background-color: black;
`;

const Landing = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    useEffect(() => {
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (!res) {
                router.replace(router.asPath);
            }
        })();

        WorkboxInit();
    }, []);

    return (<Container xl css={{ position: "relative", padding: 0, width: "100%", height: "100%", overflowX: "hidden" }}>
        <Head>
            <title>Home · Notal</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar user={props.validate?.data} />
        <ImageContainer isDark={isDark}>
            <img src="./landing_bg_1.png" style={{ width: "100%", height: "100%", objectFit: "cover", }} />
        </ImageContainer>
        <Container md css={{ position: "relative" }}>
            <Spacer y={6} />
            <Grid.Container gap={2} css={{ zIndex: "$1", position: "relative" }}>
                <Grid xs={12}>
                    <Card css={{ fill: "$warning", width: "50%", "@mdMax": { width: "100%" } }}>
                        <Row>
                            <WarningIcon size={20} style={{ transform: "scale(0.8)" }} />
                            <Text h5 css={{ color: "$warningDark", ml: 4 }}>Alpha Warning</Text>
                        </Row>
                        <Text b>This project is currently in private alpha and not for public access.</Text>
                    </Card>
                </Grid>
                <Grid xs={12} sm={10} css={{ fd: "column" }} >
                    <Row>
                        <Text h1 css={{
                            color: "$white",
                            fs: "2em",
                            "@xs": {
                                fs: "2em",
                            },
                            "@md": {
                                fs: "3.5em"
                            }
                        }}>Take planning to <Text span css={{ bg: "$gradient", backgroundImage: "$textGradient", "-webkit-background-clip": 'text', "-webkit-text-fill-color": 'transparent' }}>next</Text> level with Notal 🚀</Text>
                    </Row>
                    <Row>
                        <Text b css={{ fs: "1.2em", color: isDark ? "$gray500" : "$gray200" }}>{`Developer's solution from an developer. Keep focus on your project, not on your planning.`}</Text>
                    </Row>
                    <Spacer y={1} />
                    <Row>
                        <Button css={{ minWidth: 140 }} onClick={() => router.push("/login")} rounded>
                            Discover More
                        </Button>
                        <Spacer x={1} />
                        {/*<Button css={{ minWidth: 140 }} ghost onClick={() => { }} rounded>
                            Changelog & Info
                        </Button>*/}
                    </Row>
                </Grid>
                <Grid xs={0} sm={2}>

                </Grid>
            </Grid.Container>
            <Grid.Container gap={2} css={{ zIndex: "$1", position: "relative" }}>
                <Grid xs={12} sm={6} md={3}> {/* #TODO: make this a component */}
                    <Card css={{ bf: "saturate(180%) blur(10px)", bg: isDark ? "#ffffff20" : "#ffffffa9" }}>
                        <Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Avatar
                                squared
                                icon={<EditIcon size={20} fill="currentColor" />}
                            />
                            <Text h4 css={{ ml: 8 }}>
                                Take notes
                            </Text>
                        </Row>
                        <Spacer y={0.5} />
                        <Row>
                            <Text>
                                Add workspaces, add notes into them. You can also create fields, which you can fill in them with cards you like.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Card css={{ bf: "saturate(180%) blur(10px)", bg: isDark ? "#ffffff20" : "#ffffffa9" }}>
                        <Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Avatar
                                squared
                                icon={<UserIcon size={20} fill="currentColor" />}
                            />
                            <Text h4 css={{ ml: 8 }}>
                                Personalize your profile
                            </Text>
                        </Row>
                        <Spacer y={0.5} />
                        <Row>
                            <Text>
                                You can add a bio, change your avatar and do more on your profile.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Card css={{ bf: "saturate(180%) blur(10px)", bg: isDark ? "#ffffff20" : "#ffffffa9" }}>
                        <Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Avatar
                                squared
                                icon={<ShareIcon size={20} fill="currentColor" />}
                            />
                            <Text h4 css={{ ml: 8, fs: "1.2em" }}>
                                Share Notes & Workspaces
                            </Text>
                        </Row>
                        <Spacer y={0.5} />
                        <Row>
                            <Text>
                                You can share your notes and workspaces, you can also set their visibility to private.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                    <Card css={{ bf: "saturate(180%) blur(10px)", bg: isDark ? "#ffffff20" : "#ffffffa9" }}>
                        <Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Avatar
                                squared
                                icon={<PeopleIcon size={20} fill="currentColor" />}
                            />
                            <Text h4 css={{ ml: 8 }}>
                                Create Teams
                            </Text>
                        </Row>
                        <Spacer y={0.5} />
                        <Row>
                            <Text>
                                You can invite whoever you want to your team. You can create notes & workspaces inside teams and work together.
                            </Text>
                        </Row>
                    </Card>
                </Grid>
            </Grid.Container>
            <Spacer y={12} />
            <Text h1 css={{
                color: isDark ? "$white" : "$black",
                fs: "2em",
                "@xs": {
                    fs: "2em",
                },
                "@md": {
                    fs: "4em"
                },
                position: "relative",
                zIndex: "$1"
            }}>Focus on your
                <Text span css={{ color: "$primary" }}> projects.</Text>
            </Text>
            <Text b css={{ fs: "1.2em", color: "$gray500" }}>Keep focus on your project, not on your planning.</Text>
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 1, left: -200, top: -20, opacity: isDark ? 0.3 : 0.7, backgroundImage: "url(./landing_bg_2.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 1, right: -250, top: -20, opacity: 0.1, backgroundImage: "url(./landing_bg_3.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            <Spacer y={12} />
            <footer>
                <Grid.Container>
                    <Grid xs={1} md={4}></Grid>
                    <Grid xs={10} md={4}>
                        <Card>
                            <Row css={{ alignItems: "center", justifyContent: "center" }}>
                                <CodeIcon size={20} fill="currentColor" style={{ marginRight: 4, transform: "scale(0.8)" }} />
                                <Text>with</Text>
                                <HeartIcon size={20} fill="red" style={{ marginLeft: 4, marginRight: 4, transform: "scale(0.8)" }} />
                                <Text css={{ mr: 8 }}>by</Text>
                                <Link href="https://github.com/erenkulaksiz" passHref>
                                    <ALink color>@Eren Kulaksiz</ALink>
                                </Link>
                            </Row>
                        </Card>
                    </Grid>
                    <Grid xs={1} md={4}></Grid>
                    <Spacer y={2} />
                    <Grid xs={12} justify="center">
                        <PoweredByVercel utmSource="notal" />
                    </Grid>
                </Grid.Container>
            </footer>
            <Spacer y={2} />
        </Container>
        {Cookies.get('cookies') != "true" && <AcceptCookies
            style={{ position: "fixed" }}
            visible={Cookies.get('cookies') != "true"}
            onAccept={() => {
                Cookies.set('cookies', 'true');
                router.replace(router.asPath);
            }}
        />}
    </Container>
    )
}

export default Landing;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;
        validate = await ValidateToken({ token: authCookie });
    }
    return { props: { validate } }
}