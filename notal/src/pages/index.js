import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, useTheme, Loading, Row, Avatar } from '@nextui-org/react';

import { server } from '../config';

import DashboardIcon from '../../public/icons/dashboard.svg';
import EditIcon from '../../public/icons/edit.svg';
import UserIcon from '../../public/icons/user.svg';
import ShareIcon from '../../public/icons/share.svg';
import PeopleIcon from '../../public/icons/people.svg';
import LandingImg_shape_1 from '../../public/landing_img_right_1.svg';

import Navbar from '../components/navbar';

import useAuth from '../hooks/auth';
import { CheckToken } from '../utils';

const Landing = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    useEffect(() => {
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });

            if (props.validate?.error == "no-token" || res || props.validate?.error == "validation-error" || props.validate?.error == "auth/id-token-expired") {
                router.replace(router.asPath);
            }

            if (props.validate.success && !props.validate?.data?.paac) {
                router.replace("/paac");
                return;
            }
        })();
    }, []);

    return (<Container xl css={{ position: "relative", padding: 0 }}>
        <Head>
            <title>Home · Notal</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar user={props.validate?.data} />
        <div style={{ width: "100%", height: 500, position: "absolute", opacity: isDark ? 0.4 : 1 }}>
            <img src="./landing_bg_1.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <Container md css={{ position: "relative" }}>
            <Spacer y={6} />
            <Card css={{ width: "50%" }}>
                <Text h5>ALPHA!</Text>
                <Text b css={{ color: "$warningDark" }}>This project is in currently private alpha and not for public access.</Text>
            </Card>
            <Grid.Container>
                <Grid xs={12} sm={10} css={{ fd: "column" }} >
                    <Row>
                        <Text h1 css={{
                            color: "$white",
                            "@xs": {
                                fs: "2em",
                            },
                            "@md": {
                                fs: "4em"
                            }
                        }}>Take notes to <Text span css={{ color: "$primary" }}>next</Text> level with Notal.</Text>
                    </Row>
                    <Row>
                        <Text b css={{ fs: "1.2em", color: "$gray500" }}>Keep focus on your project, not on your planning with Notal.</Text>
                    </Row>
                    <Spacer y={1} />
                    <Row>
                        <Button css={{ width: "20%" }} onClick={() => alert("Soon!")}>
                            Discover More
                        </Button>
                    </Row>
                </Grid>
                <Grid xs={0} sm={2}>

                </Grid>
            </Grid.Container>
            <Spacer y={10} />
            <Grid.Container gap={2}>
                <Grid xs={6} sm={3}>
                    <Card>
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
                <Grid xs={6} sm={3}>
                    <Card css={{ backdropFilter: "" }}>
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
                <Grid xs={6} sm={3}>
                    <Card css={{ backdropFilter: "" }}>
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
                <Grid xs={6} sm={3}>
                    <Card css={{ backdropFilter: "" }}>
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
        </Container>

    </Container>
    )
}

export default Landing;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;
        //const emailCookie = req.cookies.email;

        if (authCookie) {
            const data = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json());

            console.log("data (index.js): ", data);
            if (data.success) {
                validate = { ...data };
            } else {
                validate = { error: data.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate } }
}