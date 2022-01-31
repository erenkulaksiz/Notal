import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, useTheme, Loading, Row, Modal } from '@nextui-org/react';

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

import { CheckToken } from '../../utils';
import { withCheckUser } from '../../hooks/route';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    return (<Container xl css={{ position: "relative", padding: 0 }}>
        <Head>
            <title>{props.workspace.data.title}</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        <Spacer y={1} />

        <Container lg>
            <Card>
                <Grid.Container gap={1} css={{ p: 0 }}>
                    <Grid xs={12} sm={2} md={2} css={{ fd: "column" }}>
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
                    </Grid>
                    <Grid xs={3} sm={2} md={0.8}>
                        <Button css={{ bg: "$gradient" }} style={{ minWidth: 20, width: "100%", height: "100%" }}>
                            {props.workspace?.data?.starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                        </Button>
                    </Grid>
                    <Grid xs={3} sm={2} md={0.8}>
                        <Button css={{ bg: "$gradient" }} style={{ minWidth: 20, width: "100%", height: "100%" }}>
                            <VisibleIcon height={20} width={20} fill={"currentColor"} />
                        </Button>
                    </Grid>
                    <Grid xs={3} sm={2} md={0.8}>
                        <Button css={{ bg: "$gradient" }} style={{ minWidth: 20, width: "100%", height: "100%" }}>
                            <DeleteIcon fill={"currentColor"} />
                        </Button>
                    </Grid>
                    <Grid xs={3} sm={2} md={0.8}>
                        <Button css={{ bg: "$gradient" }} style={{ minWidth: 20, width: "100%", height: "100%" }}>
                            <AddIcon fill={"currentColor"} />
                        </Button>
                    </Grid>
                </Grid.Container>
            </Card>
            <Spacer y={1} />
            <Card css={{ height: "100%" }}>
                sdfsd
            </Card>
        </Container>

    </Container>)
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