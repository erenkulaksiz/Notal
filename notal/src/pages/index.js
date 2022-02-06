import { Button, Spacer, Container, Text, Card, useTheme, Row, Avatar, Grid } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import styled from 'styled-components';

import {
    EditIcon,
    PeopleIcon,
    ShareIcon,
    UserIcon,
    WarningIcon
} from '../icons';

import {
    AcceptCookies,
    LandingFeaturesCard,
    LandingFooter,
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

const Features = [
    {
        title: "Take Notes",
        desc: "Add workspaces, add notes into them. You can also create fields, which you can fill in them with cards you like.",
        icon: <EditIcon size={20} fill="currentColor" />
    },
    {
        title: "Personalize your profile",
        desc: "You can add a bio, change your avatar and do more on your profile.",
        icon: <UserIcon size={20} fill="currentColor" />
    },
    {
        title: "Share Notes & Workspaces",
        desc: "You can share your notes and workspaces, you can also set their visibility to private.",
        icon: <ShareIcon size={20} fill="currentColor" />
    },
    {
        title: "Create Teams",
        desc: "You can invite whoever you want to your team. You can create notes & workspaces inside teams and work together.",
        icon: <PeopleIcon size={20} fill="currentColor" />
    },
]

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
            <img src="./landing_bg_1.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                {Features.map((feature, index) => <LandingFeaturesCard key={index} feature={feature} />)}
            </Grid.Container>
            <Spacer y={12} />
            <Text h1 css={{
                color: isDark ? "$white" : "$black",
                fs: "2em",
                "@md": {
                    fs: "4em"
                },
                position: "relative",
                zIndex: "$1"
            }}>Focus on your
                <Text span css={{ color: "$primary" }}> projects.</Text>
            </Text>
            <Text b css={{ fs: "1.2em", color: "$gray500" }}>Keep focus on your project, not on your planning.</Text>
            <Spacer y={16} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 1, left: -200, top: -20, opacity: isDark ? 0.3 : 0.7, backgroundImage: "url(./landing_bg_2.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 1, right: -250, top: -20, opacity: 0.1, backgroundImage: "url(./landing_bg_3.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            {/*<div style={{ width: 300, height: 300, position: "absolute", zIndex: 1, left: -50, bottom: 600, opacity: 1, backgroundImage: "url(./landing_bg_5.svg)", backgroundRepeat: "no-repeat", background: "contain", transform: "scale(2) rotate(-45deg)" }} />*/}
        </Container>
        <LandingFooter />
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