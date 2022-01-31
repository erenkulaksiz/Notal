import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, useTheme, Loading, Row, Tooltip } from '@nextui-org/react';
import styled from 'styled-components';

import { server } from '../../config';
import useAuth from '../../hooks/auth';

import Navbar from '../../components/navbar';

import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import SyncIcon from '../../../public/icons/sync.svg';
import CheckIcon from '../../../public/icons/check.svg';
import EditIcon from '../../../public/icons/edit.svg';
import StarFilledIcon from '../../../public/icons/star_filled.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import AddIcon from '../../../public/icons/add.svg';
import MoreIcon from '../../../public/icons/more.svg';

import { CheckToken } from '../../utils';
import { withCheckUser } from '../../hooks/route';

const CardColor = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${props => props.color};
    z-index: 5;
    border-radius: 100%;
`

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    useEffect(() => {
        console.log("props workspace: ", props);
    }, []);

    return (<Container xl css={{ position: "relative", padding: 0 }}>
        <Head>
            <title>{props.workspace.data.title}</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        <Spacer y={1} />

        <Container xl>
            <Grid.Container gap={1}>
                <Grid xs={12} sm={2}>
                    <Card>
                        <Row>
                            <Text h3>
                                {props.workspace.data.title}
                            </Text>
                        </Row>
                        <Row>
                            <Text css={{ fs: "1em", color: isDark ? "$gray400" : "$gray800" }}>
                                {props.workspace.data.desc}
                            </Text>
                        </Row>
                    </Card>
                </Grid>
                <Grid xs={12} sm={10}>
                    <Grid.Container gap={1}>
                        <Grid xs={3} sm={1} md={0.8} css={{ minHeight: 80, minWidth: 60, /*padding:0*/ }} alignItems="center">
                            <Button css={{ bg: "$primary", minWidth: 60, height: "80%", width: "100%" }} size="sm">
                                {props.workspace?.data?.starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                            </Button>
                        </Grid>
                        <Grid xs={3} sm={1} md={0.8} css={{ minHeight: 80, minWidth: 60, /*padding:0*/ }} alignItems="center">
                            <Button css={{ bg: "$primary", minWidth: 60, height: "80%", width: "100%" }} style={{ minWidth: 60, width: "100%", height: "80%" }}>
                                <VisibleIcon height={20} width={20} fill={"currentColor"} />
                            </Button>
                        </Grid>
                        <Grid xs={3} sm={1} md={0.8} css={{ minHeight: 80, minWidth: 60, /*padding:0*/ }} alignItems="center">
                            <Button css={{ bg: "$primary", minWidth: 60, height: "80%", width: "100%" }} style={{ minWidth: 60, width: "100%", height: "80%" }}>
                                <DeleteIcon fill={"currentColor"} />
                            </Button>
                        </Grid>
                        <Grid xs={3} sm={1} md={0.8} css={{ minHeight: 80, minWidth: 60, /*padding:0*/ }} alignItems="center">
                            <Button css={{ bg: "$primary", minWidth: 60, height: "80%", width: "100%" }} style={{ minWidth: 60, width: "100%", height: "80%" }}>
                                <AddIcon fill={"currentColor"} />
                            </Button>
                        </Grid>
                    </Grid.Container>
                </Grid>
            </Grid.Container>

            <Grid.Container gap={1} css={{ alignItems: "flex-start" }}>
                {/* FIELD */}


                {props.workspace.data?.fields && props.workspace.data.fields.map((field, index) => {
                    return (<Grid xs={12} sm={6} md={4} lg={3} key={field.id}>
                        <Card>
                            <Grid.Container>
                                <Grid xs={12}>
                                    <Card bordered>
                                        <Grid.Container>
                                            <Grid xs={6} sm={6}>
                                                <Text h4>
                                                    {field.title}
                                                </Text>
                                            </Grid>
                                            <Grid xs={6} sm={6} css={{ justifyContent: "flex-end" }}>
                                                <Button size="sm" css={{ minWidth: 44, mr: 8 }}>
                                                    <EditIcon size={24} fill={"currentColor"} />
                                                </Button>
                                                <Button size="sm" css={{ minWidth: 44, mr: 8 }}>
                                                    <DeleteIcon size={24} fill={"currentColor"} />
                                                </Button>
                                                <Button size="sm" css={{ minWidth: 44 }}>
                                                    <MoreIcon size={24} fill={"currentColor"} />
                                                </Button>
                                            </Grid>
                                        </Grid.Container>
                                    </Card>
                                </Grid>
                                {field?.cards && field.cards.map((card, index) => {
                                    return (<Grid xs={12} css={{ mt: 8 }} key={card.id}>
                                        <Card bordered>
                                            <Grid.Container>
                                                <Grid xs={10} sm={10}>
                                                    <Text h4>
                                                        {card.title}
                                                    </Text>
                                                </Grid>
                                                <Grid xs={2} sm={2} justify='flex-end' alignItems='center'>
                                                    <div style={{ marginRight: 24, marginBottom: 8, position: "relative" }}>
                                                        <CardColor color={card.color} />
                                                    </div>
                                                    <Button size="sm" css={{ minWidth: 44 }}>
                                                        <MoreIcon size={24} fill={"currentColor"} />
                                                    </Button>
                                                </Grid>
                                                <Grid xs={12}>
                                                    <Text>
                                                        {card.desc}
                                                    </Text>
                                                </Grid>
                                            </Grid.Container>
                                        </Card>
                                    </Grid>)
                                })}
                            </Grid.Container>
                        </Card>
                    </Grid>)
                })}

            </Grid.Container>
        </Container>
    </Container >)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspace = {};

    const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;
        //const emailCookie = req.cookies.email;

        const dataWorkspace = await fetch(`${server}/api/workspace`, {
            'Content-Type': 'application/json',
            method: "POST",
            body: JSON.stringify({ id: queryId, action: "GET_WORKSPACE" }),
        }).then(response => response.json());

        let fields = [];

        if (dataWorkspace.data?.fields) {
            fields = Object.keys(dataWorkspace.data.fields).map((el, index) => {
                return { ...dataWorkspace.data?.fields[el], id: Object.keys(dataWorkspace.data.fields)[index] }
            });
            fields.map((el, index) => {
                if (el.cards) {
                    const cards = Object.keys(el.cards).map((elx, index) => {
                        return { ...el.cards[elx], id: Object.keys(el.cards)[index] }
                    })

                    fields[index].cards = cards;
                }
            })
        }

        if (dataWorkspace.success) {
            workspace = { ...dataWorkspace, data: { ...dataWorkspace.data, id: queryId, fields: [...fields] } };
        } else {
            workspace = { success: false }
        }
        console.log("RES DATA WORKSPACE: ", dataWorkspace);

        if (authCookie) {
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json());

            if (dataValidate.success) {
                validate = { ...dataValidate };
            } else {
                validate = { error: dataValidate?.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate, workspace } }
}