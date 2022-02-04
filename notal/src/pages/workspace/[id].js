import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spacer, Container, Text, Grid, Card, useTheme, Row, Tooltip, Checkbox } from '@nextui-org/react';

import { server } from '../../config';
import useAuth from '../../hooks/auth';

import Navbar from '../../components/navbar';
import Field from '../../components/field';
import WorkspaceNav from '../../components/workspaceNav';
import DeleteWorkspaceModal from '../../components/modals/deleteWorkspace';
import AddCardModal from '../../components/modals/addCard';
import AddFieldModal from '../../components/modals/addField';

import DeleteIcon from '../../../public/icons/delete.svg';
import EditIcon from '../../../public/icons/edit.svg';
import AddIcon from '../../../public/icons/add.svg';
import MoreIcon from '../../../public/icons/more.svg';
import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';

import { CheckToken } from '../../utils';
import EditWorkspaceModal from '../../components/modals/editWorkspace';
import EditFieldModal from '../../components/modals/editField';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    // Modals
    const [addFieldModal, setAddFieldModal] = useState(false);
    const [deleteWorkspaceModal, setDeleteWorkspace] = useState(false);
    const [addCardModal, setAddCardModal] = useState({ visible: false, field: "" });

    const [editWorkspace, setEditWorkspace] = useState(false);
    const [editField, setEditField] = useState({ visible: false, title: "" });

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
                    //window.gtag('event', "editWorkspace", { login: "type:google/" + user.email });
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
        addCardToField: async ({ fieldId, title, desc, color }) => {
            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: _workspace._id,
                title,
                desc,
                color
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

    return (<Container fluid css={{ position: "relative", padding: 0, overflowX: "hidden" }}>
        <Head>
            <title>{props.workspace?.data?.title ?? "Not Found"}</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        {!props.workspace?.success ? <Container sm css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
            <Card css={{ textAlign: "center", dflex: "center", py: 32, mt: 48 }}>
                <img
                    src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
                    alt="Michael Scott"
                    style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
                />
                <Text h1>[404]</Text>
                <Text h3 css={{ textAlign: "center" }}>We couldnt find this workspace.</Text>
                <Button
                    icon={<HomeFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => router.replace("/home")}
                    css={{ mt: 18 }}
                    size="xl"
                    color="gradient"
                >
                    Home
                </Button>
                <Button
                    icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => router.back()}
                    css={{ mt: 18 }}
                    size="xl"
                    color="gradient"
                >
                    Back
                </Button>
            </Card>
        </Container> : <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>

            <div style={{ paddingLeft: 12, paddingRight: 12, position: "sticky", top: 70, zIndex: 500 }}>
                <WorkspaceNav
                    title={props.workspace?.data?.title}
                    desc={props.workspace?.data?.desc}
                    starred={props.workspace?.data?.starred}
                    onFavClick={() => handle.starWorkspace()}
                    onDeleteClick={() => setDeleteWorkspace(true)}
                    onEditWorkspace={() => setEditWorkspace(true)}
                />
            </div>

            <div style={{ display: "flex", width: "100%", flexDirection: "column", paddingTop: 8 }}>
                <Grid.Container gap={1} css={{ flexWrap: "nowrap", alignItems: "flex-start", justifyContent: "flex-start", overflowX: "auto" }}>

                    {props.workspace.data?.fields && props.workspace.data.fields.map(field => {
                        return (<Field
                            field={field}
                            key={field._id}
                            onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, field: field._id })}
                            onDeleteField={() => handle.deleteField({ id: field._id })}
                            onDeleteCard={({ id }) => handle.deleteCard({ id, fieldId: field._id })}
                            onEditClick={() => setEditField({ ...editField, visible: true, title: field.title, id: field._id })}
                        />)
                    })}

                    <Card
                        css={{ dflex: "center", borderColor: "$primary", color: "$primary", bg: "transparent", pb: 16, pt: 16, ml: 8, mt: 5, minWidth: 300, maxWidth: 400 }}
                        bordered
                        clickable
                        onClick={() => setAddFieldModal(true)}
                        shadow={false}
                    >
                        <AddIcon size={24} fill={"currentColor"} />
                        <Text h4 css={{ color: "$primary" }}>
                            Add a field
                        </Text>
                    </Card>
                    <Spacer x={1} />
                </Grid.Container>
            </div>
        </div>}
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
            onAdd={({ title, desc, color }) => {
                setAddCardModal({ visible: false, field: "" });
                handle.addCardToField({ fieldId: addCardModal.field, title, desc, color });
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
        <EditFieldModal
            visible={editField.visible}
            onClose={() => setEditField({ ...editField, visible: false })}
            title={editField.title}
            onEdit={({ title }) => {
                handle.editField({ id: editField.id, title });
                setEditField({ ...editField, visible: false });
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