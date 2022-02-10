import { Button, Spacer, Container, Text, Card, useTheme, Row, Link as ALink, Grid, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
//import styled from 'styled-components';

import {
    TwitterIcon,
    SyncIcon
} from '@icons';

import {
    AcceptCookies,
    LandingFeaturesCard,
    LandingFooter,
    Navbar,
    FieldCard,
    HomeWorkspaceCard,
    Field,
    AddCardModal,
} from '@components';

import useAuth from '@hooks/auth';
import { withPublic } from '@hooks/route';

import {
    CheckToken,
    ValidateToken,
    WorkboxInit,
} from '@utils';

import {
    Features,
    Fields,
    Workspaces,
} from '@utils/constants';

const Landing = (props) => {
    const router = useRouter();
    const { isDark } = useTheme();
    const [_fields, _setFields] = useState([...JSON.parse(JSON.stringify(Fields))]);
    const [_workspaces, _setWorkspaces] = useState([...Workspaces]);
    const [addCardModal, setAddCardModal] = useState({ visible: false, field: "" });
    const [_fieldsChanged, _setFieldsChanged] = useState(false);

    useEffect(() => {
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
            <div className="notal-image-wrapper-1" />
            <div className="notal-image-wrapper-2" />
            <div style={{ opacity: isDark ? 0.6 : 0.9 }}>
                <Image
                    src="/landing_bg_banner_1.png"
                    layout="fill"
                    objectFit='cover'
                    loading="eager" />
            </div>
        </div>
        <Container md css={{ position: "relative" }}>
            <Spacer y={12} />
            <Grid.Container gap={2} css={{ zIndex: "$1", position: "relative" }}>
                <Grid xs={12} css={{ fd: "column" }} >
                    <Row>
                        <Text h1 css={{
                            color: "$textInvert",
                            textShadow: "0 2px 80px rgba(144, 144, 144, 0.8)",
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
                        <Text b css={{ fs: "1.2em", color: "$textTitle" }}>{`Developer's solution from an developer. Keep focus on your project, not on your planning.`}</Text>
                    </Row>
                    <Spacer y={1} />
                    <Row>
                        <Button css={{ minWidth: 140 }} onClick={() => router.push("/login")} rounded>
                            Discover More
                        </Button>
                    </Row>
                </Grid>
            </Grid.Container>
            <Spacer y={2} />
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
                    <Text b css={{ fs: "1.2em", color: "$gray500" }}>You can add images, cards and fields to workspaces. You can also customize your workspaces and more.</Text>
                </Grid>
                <Grid xs={12} sm={7}>
                    <Grid.Container gap={1} css={{ position: "relative" }}>
                        {_workspaces && _workspaces?.map((workspace, index) => (<Grid xs={12} sm={4} key={index}>
                            <HomeWorkspaceCard
                                workspace={workspace}
                                onStarClick={() => {
                                    const newWorkspaces = _workspaces;
                                    const workspaceIndex = newWorkspaces.findIndex(el => el._id == workspace._id);
                                    newWorkspaces[workspaceIndex].starred = !newWorkspaces[workspaceIndex].starred;
                                    _setWorkspaces([...newWorkspaces]);
                                }}
                                onDeleteClick={() => {
                                    if (workspace.deleteAble) {
                                        const newWorkspaces = _workspaces;
                                        const workspaceIndex = newWorkspaces.findIndex(el => el._id == workspace._id);
                                        newWorkspaces.splice(workspaceIndex, 1);
                                        _setWorkspaces([...newWorkspaces]);
                                    }
                                }} />
                        </Grid>))}
                        {_workspaces?.length != Workspaces.length && <Grid xs={12} sm={4}>
                            <Tooltip content="Undo Workspace Changes" css={{ pointerEvents: "none" }}>
                                <Button css={{ minWidth: 40 }} onClick={() => _setWorkspaces([...Workspaces])}>
                                    <SyncIcon size={24} fill="currentColor" />
                                </Button>
                            </Tooltip>
                        </Grid>}
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
                <Grid xs={12} css={{ position: "relative" }}>
                    <Grid.Container gap={1} css={{ alignItems: "flex-start" }}>
                        {_fields.map((field, index) => (<Grid xs={12} sm={4} md={4} key={index}>
                            <Field
                                isOwner={true}
                                onAddCard={() => {
                                    const fieldIndex = _fields.findIndex(el => el.id == field.id);
                                    const _tfield = _fields[fieldIndex];
                                    if (_tfield.cards.length < 6) {
                                        setAddCardModal({ visible: true, field: field.id });
                                    }
                                }}
                                onEditCard={() => { }}
                                onDeleteCard={({ id }) => {
                                    const newFields = _fields;
                                    const fieldIndex = newFields.findIndex(el => el.id == field.id);
                                    const cardIndex = newFields[fieldIndex].cards.findIndex(el => el._id == id);
                                    if (newFields[fieldIndex].cards.length > 1) {
                                        newFields[fieldIndex].cards.splice(cardIndex, 1);
                                        _setFields([...newFields]);
                                        _setFieldsChanged(true);
                                    }
                                }}
                                onDeleteField={() => {
                                    if (_fields.length != 1) {
                                        const newFields = _fields;
                                        const fieldIndex = newFields.findIndex(el => el.id == field.id);
                                        newFields.splice(fieldIndex, 1);
                                        _setFields([...newFields]);
                                        _setFieldsChanged(true);
                                    }
                                }}
                                field={field} />
                        </Grid>))}
                        <Grid xs={12}>
                            {_fieldsChanged && <Tooltip content="Undo Field Changes" css={{ pointerEvents: "none" }}>
                                <Button css={{ minWidth: 40, }} onClick={() => {
                                    _setFields([...JSON.parse(JSON.stringify(Fields))]);
                                    console.log("Fields: ", Fields);
                                    _setFieldsChanged(false);
                                }}>
                                    <SyncIcon size={24} fill="currentColor" />
                                </Button>
                            </Tooltip>}
                        </Grid>
                    </Grid.Container>
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
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 3, left: -400, top: 50, opacity: isDark ? 0.2 : 0.3, backgroundImage: "url(./landing_bg_2.png)", backgroundRepeat: "no-repeat", background: "contain" }} />
            <div style={{ width: 740, height: 740, position: "absolute", zIndex: 3, right: -300, top: -20, opacity: isDark ? 0.2 : 0.1, backgroundImage: "url(./landing_bg_3.png)", backgroundRepeat: "no-repeat", background: "contain", }} />
        </Container>
        <LandingFooter />
        <AddCardModal
            visible={addCardModal.visible}
            onClose={() => setAddCardModal({ ...addCardModal, visible: false, field: "" })}
            onAdd={({ title, desc, color, tag }) => {
                const newFields = _fields;
                const fieldIndex = newFields.findIndex(el => el.id == addCardModal.field);
                newFields[fieldIndex].cards.push({ title, desc, color, _id: Date.now(), tag });
                setAddCardModal({ visible: false, field: "" });
                _setFieldsChanged(true);
            }}
        />
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
        <style jsx global>{`
            html[class="dark-theme"] {
                --niw-1-wrapper: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.2) 100%);
                --niw-2-wrapper-bg: black;
                --niw-2-wrapper-op: .2;
            }
            html[class="light-theme"]{
                --niw-1-wrapper: linear-gradient(0deg, rgba(255,255,255,1) 10%, rgba(0,0,0,0) 62%);
                --niw-2-wrapper-bg: white;
                --niw-2-wrapper-op: .6;
            }
            .notal-image-container{
                width: 100%;
                height: 700px;
                position: absolute;
                background-color: black;
            }
            .notal-image-wrapper-1{
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 1;
                background-image: var(--niw-1-wrapper);
            }
            .notal-image-wrapper-2{
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 2;
                background: var(--niw-2-wrapper-bg);
                opacity: var(--niw-2-wrapper-op);
            }
        `}</style>
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