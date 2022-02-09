import { Button, Spacer, Container, Text, Card, useTheme, Row, Link as ALink, Grid } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
//import styled from 'styled-components';

import {
    PeopleIcon,
    ShareIcon,
    UserIcon,
    WarningIcon,
    AddIcon,
    TwitterIcon
} from '@icons';

import {
    AcceptCookies,
    LandingFeaturesCard,
    LandingFooter,
    Navbar,
    FieldCard,
    HomeWorkspaceCard,
    Field
} from '@components';

import useAuth from '@hooks/auth';
import { withPublic } from '@hooks/route';

import {
    CheckToken,
    ValidateToken,
    WorkboxInit,
} from '@utils';

const Features = [
    {
        title: "Create Workspace",
        desc: "You can create workspace and add fields, cards & images.",
        icon: <AddIcon size={20} fill="currentColor" />
    },
    {
        title: "Personalize your profile",
        desc: "You can customize your profile how you'd like, change your bio, add social links and more.",
        icon: <UserIcon size={20} fill="currentColor" />
    },
    {
        title: "Share Bookmarks & Workspaces",
        desc: "You can share your bookmarks and workspaces with a link, you can also set their visibility to private.",
        icon: <ShareIcon size={20} fill="currentColor" />
    },
    {
        title: "Create Teams",
        desc: "You can invite whoever you want to your team. You can create bookmarks & workspaces inside teams and work together with your teammates!",
        icon: <PeopleIcon size={20} fill="currentColor" />
    },
]

const Landing = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    useEffect(() => {
        /*
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (!res) {
                router.replace(router.asPath);
            }
        })();
        */
        console.log("home props->", props);
        WorkboxInit();
    }, []);

    return (<Container xl css={{ position: "relative", padding: 0, width: "100%", height: "100%", overflowX: "hidden" }}>
        <Head>
            <title>Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>
        <Navbar user={props.validate?.data} />
        <div className="notal-image-container">
            <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 1, backgroundImage: isDark ? "linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%)" : "linear-gradient(0deg, rgba(255,255,255,1) 10%, rgba(0,0,0,0) 62%)" }} />
            <div style={{ position: "absolute", width: "100%", height: "100%", zIndex: 2, background: isDark ? "black" : "white", opacity: isDark ? .5 : .2 }} />
            <div style={{ opacity: isDark ? 0.4 : 0.9 }}>
                <Image
                    src="/landing_bg_banner_1.png"
                    layout="fill"
                    objectFit='cover'
                    loading="eager" />
            </div>
        </div>
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
                <Grid xs={12} css={{ fd: "column" }} >
                    <Row>
                        <Text h1 css={{
                            color: isDark ? "$white" : "$black",
                            textShadow: "0 40px 80px rgba(20, 20, 20, 0.8)",
                            fs: "2em",
                            "@xs": {
                                fs: "2em",
                            },
                            "@md": {
                                fs: "3.5em"
                            }
                        }}>Organize & Plan your <Text span css={{ bg: "$gradient", backgroundImage: "$textGradient", "-webkit-background-clip": 'text', "-webkit-text-fill-color": 'transparent' }}>next</Text> project with Notal 🚀</Text>
                    </Row>
                    <Row>
                        <Text b css={{ fs: "1.2em", color: isDark ? "$gray400" : "$gray900" }}>{`Developer's solution from an developer. Keep focus on your project, not on your planning.`}</Text>
                    </Row>
                    <Spacer y={1} />
                    <Row>
                        <Button css={{ minWidth: 140 }} onClick={() => router.push("/login")} rounded>
                            Discover More
                        </Button>
                    </Row>
                </Grid>
            </Grid.Container>
            <Spacer y={6} />
            <Grid.Container gap={2} css={{ zIndex: "$1", position: "relative" }}>
                {Features.map((feature, index) => <LandingFeaturesCard key={index} feature={feature} />)}
            </Grid.Container>
            <Spacer y={12} />
            <Grid.Container>
                <Grid xs={12} sm={5} css={{ fd: "column" }}>
                    <Text h1 css={{
                        color: isDark ? "$white" : "$black",
                        fs: "2em",
                        "@md": {
                            fs: "4em"
                        },
                        position: "relative",
                        zIndex: "$1"
                    }}>Create
                        <Text span css={{ color: "$primary" }}> workspaces.</Text>
                    </Text>
                    <Text b css={{ fs: "1.2em", color: "$gray500" }}>You can add images, cards and fields to workspaces. You can also customize your workspaces by adding images to background, changing workspace thumbnail and more.</Text>
                </Grid>
                <Grid xs={12} sm={7}>
                    <Grid.Container gap={1}>
                        <Grid xs={12} sm={4}>
                            <HomeWorkspaceCard workspace={{ title: "Notal Roadmap", workspaceVisible: true, _id: "61fe5d1e999f4cd55e0f3de0" }} />
                        </Grid>
                        <Grid xs={12} sm={4}>
                            <HomeWorkspaceCard workspace={{ title: "My first workspace.", desc: "Hello world!", }} />
                        </Grid>
                        <Grid xs={12} sm={4}>
                            <HomeWorkspaceCard workspace={{ title: "My first workspace.", desc: "Hello world!", }} />
                        </Grid>
                    </Grid.Container>
                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={1}>
                <Grid xs={12} css={{ fd: "column" }}>
                    <Text h1 css={{
                        color: isDark ? "$white" : "$black",
                        fs: "2em",
                        "@md": {
                            fs: "4em"
                        },
                        position: "relative",
                        zIndex: "$1"
                    }}>Create fields
                        <Text span css={{ color: "$primary" }}> and fill them with cards.</Text>
                    </Text>
                    <Text b css={{ fs: "1.2em", color: "$gray500" }}>Fields can have all sorts of data from image, cards, links to bookmarks. You can drag drop items around to change their field.</Text>
                </Grid>
                <Grid xs={12}>
                    <Grid.Container gap={1} css={{ alignItems: "flex-start" }}>
                        <Grid xs={12} sm={4} md={4}>
                            <Field
                                isOwner={true}
                                onEditCard={() => { }}
                                onDeleteCard={() => { }}
                                onDeleteField={() => { }}
                                field={{
                                    title: "Bugs",
                                    cards: [{
                                        "title": "Full height field",
                                        "desc": "Full height fields overflow screen and scroll bar should be on fields, not the container",
                                        "color": "#a30b0b",
                                    },
                                    {
                                        "title": "Load times of images",
                                        "desc": "Placeholder of workspaces is loading slow.",
                                        "color": "#a30b0b",
                                    },
                                    {
                                        "title": "Mobile version",
                                        "desc": "Fix workspace title and workspaceNav collapse to each other",
                                        "color": "currentColor",
                                    },
                                    {
                                        "title": "Card color",
                                        "desc": "If card color 'None' selected, currentColor is applied to cardColor",
                                        "color": "#a30b0b",
                                    }]
                                }} />
                        </Grid>
                        <Grid xs={12} sm={4} md={4}>
                            <Field
                                isOwner={true}
                                onEditCard={() => { }}
                                onDeleteCard={() => { }}
                                onDeleteField={() => { }}
                                field={{
                                    title: "Do Later",
                                    cards: [{
                                        "title": "Database",
                                        "desc": "Merge database from Firebase to MongoDB.",
                                        "color": "#10AC63",
                                    },
                                    {
                                        "title": "Cards",
                                        "desc": "Editing a card now will show create and update time of that card on 'card details' section.",
                                        "color": "#10AC63",
                                    },
                                    {
                                        "title": "Cards",
                                        "desc": "While adding and editing a card, description field is now a textarea instead of text input. Now you can enter longer descriptions!",
                                        "color": "#10AC63",
                                    },
                                    {
                                        "title": "Placeholders",
                                        "desc": "Empty workspace and empty home now show 'add workspace' placeholder with image instead of showing blank space.",
                                        "color": "#10AC63",
                                    }]
                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={4} md={4}>
                            <Field
                                onEditCard={() => { }}
                                onDeleteCard={() => { }}
                                onDeleteField={() => { }}
                                isOwner={true}
                                field={{
                                    title: "Done",
                                    cards: [{
                                        "title": "Card title breaks if too long",
                                        "desc": "Card title was breaking if title was too long, but its fixed.",
                                        "color": "#10AC63",
                                        "checked": "true"
                                    }]
                                }}
                            />
                        </Grid>
                    </Grid.Container>
                    {/*<FieldCard
                        card={{
                            title: "#TODO: Add more stuff to landing page.",
                            desc: "Add cards with descriptions, also fix the dark mode bug.",
                            color: "#FF0000"
                        }}
                        isOwner={true}
                        onDelete={() => { }}
                        onEdit={() => { }}
                    />*/}
                </Grid>
            </Grid.Container>
            <Spacer y={6} />
            <Row css={{ fd: "column" }}>
                <Text h1 css={{
                    color: isDark ? "$white" : "$black",
                    fs: "2em",
                    "@md": {
                        fs: "4em"
                    },
                    position: "relative",
                    zIndex: "$1"
                }}>{"And yet, there's more to"}
                    <Text span css={{ color: "$primary" }}> come.</Text>
                </Text>
                <Text b css={{ fs: "1.2em", color: "$gray500" }}>Wait for 24 March, 2022 v1.0.0 release.</Text>
                <Spacer y={1} />
                <ALink href="https://twitter.com/notalapp" target="_blank">
                    <Button css={{ minWidth: 180 }} onClick={() => router.push("/login")} icon={<TwitterIcon width={24} height={24} color="currentColor" />} rounded>
                        Follow Us
                    </Button>
                </ALink>
            </Row>
            <Spacer y={6} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 3, left: -400, top: 150, opacity: isDark ? 0.2 : 0.3, backgroundImage: "url(./landing_bg_2.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 3, right: -300, top: -20, opacity: isDark ? 0.2 : 0.1, backgroundImage: "url(./landing_bg_3.png)", backgroundRepeat: "no-repeat", background: "contain", }} />
        </Container>
        <LandingFooter />
        {
            Cookies.get('cookies') != "true" && <AcceptCookies
                style={{ position: "fixed" }}
                visible={Cookies.get('cookies') != "true"}
                onAccept={() => {
                    Cookies.set('cookies', 'true');
                    router.replace(router.asPath);
                }}
            />
        }
        <style jsx>{`
            .notal-image-container{
                width: 100%;
                height: 700px;
                position: absolute;
                background-color: black;
            }
        `}</style>
    </Container>
    )
}

export default withPublic(Landing);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;
        validate = await ValidateToken({ token: authCookie });
    }
    return { props: { validate } }
}