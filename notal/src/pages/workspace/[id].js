import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, useTheme, Loading, Row, Tooltip, Modal, Input } from '@nextui-org/react';
import styled from 'styled-components';

import { server } from '../../config';
import useAuth from '../../hooks/auth';

import Navbar from '../../components/navbar';
import WorkspaceNav from '../../components/workspaceNav';
import DeleteWorkspaceModal from '../../components/modals/deleteWorkspace';
import AddCardModal from '../../components/modals/addCard';
import AddFieldModal from '../../components/modals/addField';

import DeleteIcon from '../../../public/icons/delete.svg';
import EditIcon from '../../../public/icons/edit.svg';
import AddIcon from '../../../public/icons/add.svg';
import MoreIcon from '../../../public/icons/more.svg';

import { CheckToken } from '../../utils';
import EditWorkspaceModal from '../../components/modals/editWorkspace';

const CardColor = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${props => props.color};
    z-index: 5;
    border-radius: 100%;
`;

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    // Modals
    const [addFieldModal, setAddFieldModal] = useState(false);
    const [deleteWorkspaceModal, setDeleteWorkspace] = useState(false);
    const [addCardModal, setAddCardModal] = useState({ visible: false, field: "" });

    const [editWorkspace, setEditWorkspace] = useState(false);

    // Workspace
    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [_workspace, _setWorkspace] = useState(null);

    useEffect(() => {
        console.log("props workspace: ", props);

        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (!res) {
                router.replace(router.asPath);
            }
        })();
    }, []);

    useEffect(() => {
        if (props.workspace?.success == true) {
            setLoadingWorkspace(false);
            _setWorkspace(props.workspace?.data);
        }
    }, [props.workspace]);

    const handle = {
        editWorkspace: async ({ title, desc }) => {
            if (_workspace.title != title || _workspace.desc != desc) {
                const data = await auth.workspace.editWorkspace({ id: _workspace._id, title, desc });

                if (data.success) {
                    router.replace(router.asPath);
                } else if (data?.error) {
                    console.error("error on star workspace: ", data.error);
                }
            }
        },
        starWorkspace: async () => {
            const data = await auth.workspace.starWorkspace({ id: _workspace._id });

            if (data.success) {
                router.replace(router.asPath);
            } else if (data?.error) {
                console.error("error on star workspace: ", data.error);
            }
        },
        addField: async ({ title }) => {
            const data = await auth.workspace.field.addField({ title: title, id: _workspace._id, filterBy: "index" });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("addfield error: ", data?.error);
            }
        },
        editField: async ({ id, title }) => {
            const data = await auth.workspace.field.editField({ id, title, workspaceId: _workspace._id });

            if (data.success) {
                router.replace(router.asPath);
            } else if (data?.error) {
                console.error("error on edit field: ", data.error);
            }
        },
        deleteField: async ({ id }) => {
            const data = await auth.workspace.field.removeField({ id, workspaceId: _workspace._id });

            if (data.success) {
                router.replace(router.asPath);
            } else if (data?.error) {
                console.error("error on delete field: ", data.error);
            }
        },
        deleteWorkspace: async () => {
            const data = await auth.workspace.deleteWorkspace({ id: _workspace._id });

            if (data.success) {
                router.replace("/home");
            } else if (data?.error) {
                console.error("error on delete workspace: ", data.error);
            }
        },
        addCardToField: async ({ fieldId, title, desc, }) => {
            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: _workspace._id,
                title,
                desc,
                color: "red"
            });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("add card error: ", data?.error);
            }
        },
        deleteCard: async ({ id, fieldId }) => {
            const data = await auth.workspace.field.removeCard({
                id,
                fieldId,
                workspaceId: _workspace._id,
            });

            console.log("data delete card: ", data);

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("add card error: ", data?.error);
            }
        },
    }


    return (<Container xl css={{ position: "relative", padding: 0, overflow: "hidden", overflow: "auto", overflowX: "hidden", }}>
        <Head>
            <title>{props.workspace?.data?.title ?? "Not Found"}</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        <div style={{ display: "flex", flexDirection: "column", }}>

            <div style={{ paddingLeft: 6, paddingRight: 6 }}>
                <WorkspaceNav
                    title={props.workspace?.data?.title}
                    desc={props.workspace?.data?.desc}
                    starred={props.workspace?.data?.starred}
                    onFavClick={() => handle.starWorkspace()}
                    onDeleteClick={() => setDeleteWorkspace(true)}
                    onEditWorkspace={() => setEditWorkspace(true)}
                />
            </div>

            <div style={{ width: "100%", flexDirection: "column", paddingTop: 8 }}>
                <Grid.Container gap={1} css={{ flexWrap: "nowrap", alignItems: "flex-start", justifyContent: "flex-start", overflowX: "auto", }}>
                    {/* FIELD */}
                    {props.workspace.data?.fields && props.workspace.data.fields.map((field, index) => {
                        return (<Grid css={{ minWidth: 380, maxWidth: 400 }} key={field._id}>
                            <Card css={{ display: "flex", maxHeight: "78vh", }}>
                                <div style={{ display: "flex", }}>
                                    <Grid.Container>
                                        <Grid xs={12} css={{ position: "sticky", top: 0, zIndex: "$3" }}>
                                            <Card bordered shadow>
                                                <Grid.Container>
                                                    <Grid xs={6} sm={6}>
                                                        <Text h4>
                                                            {field.title}
                                                        </Text>
                                                    </Grid>
                                                    <Grid xs={6} sm={6} css={{ justifyContent: "flex-end" }}>
                                                        <Tooltip
                                                            content={
                                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                                    <Button size="sm" css={{ minWidth: 44, mr: 4 }} onClick={() => handle.deleteField({ id: field._id })}>
                                                                        <DeleteIcon size={24} fill={"currentColor"} />
                                                                    </Button>
                                                                    <Button size="sm" css={{ minWidth: 44, }}>
                                                                        <EditIcon size={24} fill={"currentColor"} />
                                                                    </Button>
                                                                </div>}>
                                                            <Button size="sm" css={{ minWidth: 44 }}>
                                                                <MoreIcon size={24} fill={"currentColor"} />
                                                            </Button>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid.Container>
                                            </Card>
                                        </Grid>
                                        {field?.cards && field.cards.map((card, index) => {
                                            return (<Grid xs={12} css={{ mt: 8, }} key={card._id}>
                                                <Card bordered css={{ width: "100%" }}>
                                                    <Grid.Container>
                                                        <Grid xs={10} sm={10}>
                                                            <Text h4>
                                                                {card.title}
                                                            </Text>
                                                        </Grid>
                                                        <Grid xs={2} sm={2} justify='flex-end' alignItems='center'>
                                                            <div style={{ marginRight: 16, marginBottom: 10, position: "relative" }}>
                                                                <CardColor color={card.color} />
                                                            </div>
                                                            <Tooltip
                                                                content={
                                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                                        <Button size="sm" css={{ minWidth: 44, mr: 4 }} onClick={() => handle.deleteCard({ id: card._id, fieldId: field._id })}>
                                                                            <DeleteIcon size={24} fill={"currentColor"} />
                                                                        </Button>
                                                                        <Button size="sm" css={{ minWidth: 44 }} onClick={() => { }}>
                                                                            <EditIcon size={24} fill={"currentColor"} />
                                                                        </Button>
                                                                    </div>}>
                                                                <Button size="sm" css={{ minWidth: 44 }}>
                                                                    <MoreIcon size={24} fill={"currentColor"} />
                                                                </Button>
                                                            </Tooltip>
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
                                        <Grid xs={12} css={{ mt: 8 }}>
                                            <Card
                                                css={{ dflex: "center", borderColor: "$primary", color: "$primary", bg: "transparent" }}
                                                bordered
                                                clickable
                                                onClick={() => setAddCardModal({ ...addCardModal, visible: true, field: field._id })}>
                                                <AddIcon size={24} fill={"currentColor"} />
                                                <Text h4 css={{ color: "$primary" }}>
                                                    Add a card
                                                </Text>
                                            </Card>
                                        </Grid>
                                    </Grid.Container>
                                </div>
                            </Card>
                        </Grid>)
                    })}
                    <Grid xs={12} sm={6} md={4} lg={3} >
                        <Card
                            css={{ dflex: "center", borderColor: "$primary", color: "$primary", bg: "transparent", pb: 16, pt: 16, minWidth: 380, maxWidth: 400 }}
                            bordered
                            clickable
                            onClick={() => setAddFieldModal(true)}
                        >
                            <AddIcon size={24} fill={"currentColor"} />
                            <Text h4 css={{ color: "$primary" }}>
                                Add a field
                            </Text>
                        </Card>
                    </Grid>
                </Grid.Container>
            </div>
        </div>
        <EditWorkspaceModal
            visible={editWorkspace}
            onClose={() => setEditWorkspace(false)}
            title={props.workspace?.data?.title}
            desc={props.workspace?.data?.desc}
            onEdit={({ title, desc }) => {
                setEditWorkspace(false);
                handle.editWorkspace({ title, desc });
            }}
        />
        <AddFieldModal
            visible={addFieldModal}
            onClose={() => setAddFieldModal(false)}
            onAdd={(({ title }) => {
                setAddFieldModal(false)
                handle.addField({ title });
            })}
        />
        <AddCardModal
            visible={addCardModal.visible}
            onClose={() => setAddCardModal({ ...addCardModal, visible: false, field: "" })}
            onAdd={({ title, desc }) => {
                setAddCardModal({ visible: false, field: "" });
                handle.addCardToField({ fieldId: addCardModal.field, title, desc });
            }}
        />
        <DeleteWorkspaceModal
            visible={deleteWorkspaceModal}
            onClose={() => setDeleteWorkspace(false)}
            onDelete={() => {
                setDeleteWorkspace(false);
                handle.deleteWorkspace();
            }}
        />
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

        if (dataWorkspace.success) {
            workspace = { ...dataWorkspace, data: dataWorkspace.data };
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
            console.log("validate: ", dataValidate);


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