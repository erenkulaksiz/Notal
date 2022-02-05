import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
//import { DragDropContext } from 'react-beautiful-dnd';
import { Button, Spacer, Container, Text, Grid, Card, useTheme, Loading, Modal, Row } from '@nextui-org/react';

import useAuth from '../../hooks/auth';

import Navbar from '../../components/navbar';
import Field from '../../components/field';
import WorkspaceNav from '../../components/workspaceNav';
import Workspace404 from '../../components/workspace404';
import DeleteWorkspaceModal from '../../components/modals/deleteWorkspace';
import AddCardModal from '../../components/modals/addCard';
import AddFieldModal from '../../components/modals/addField';

import AddIcon from '../../../public/icons/add.svg';

import { CheckToken, GetWorkspace, ValidateToken } from '../../utils';
import EditWorkspaceModal from '../../components/modals/editWorkspace';
import EditFieldModal from '../../components/modals/editField';
import WorkspaceAddField from '../../components/workspaceAddField';
import VisibilityWorkspaceModal from '../../components/modals/visibilityWorkspace';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    // Modals
    const [privateModal, setPrivateModal] = useState({ visible: false, desc: "" });

    const [addFieldModal, setAddFieldModal] = useState(false);
    const [deleteWorkspaceModal, setDeleteWorkspace] = useState(false);
    const [addCardModal, setAddCardModal] = useState({ visible: false, field: "" });

    const [editWorkspace, setEditWorkspace] = useState(false);
    const [editField, setEditField] = useState({ visible: false, title: "" });

    // Workspace
    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [_workspace, _setWorkspace] = useState(null);

    const isOwner = (_workspace ? _workspace?.owner == auth.authUser?.uid : false);

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
        editWorkspace: async ({ title = _workspace.title, desc = _workspace.desc, workspaceVisible = _workspace.workspaceVisible ?? false }) => {
            if (_workspace.title != title || _workspace.desc != desc || _workspace.workspaceVisible != workspaceVisible) {

                if (_workspace.workspaceVisible != workspaceVisible) {
                    setPrivateModal({ ...privateModal, visible: true, desc: workspaceVisible ? "This workspace is now visible to everyone who has the link." : "This workspace is now set to private." })
                } else {
                    setPrivateModal({ ...privateModal, visible: false });
                }

                const newWorkspace = { ..._workspace, title, desc, workspaceVisible };
                _setWorkspace(newWorkspace);

                const data = await auth.workspace.editWorkspace({ id: _workspace._id, title, desc, workspaceVisible });

                if (data.success) {
                    //window.gtag('event', "editWorkspace", { login: "type:google/" + user.email });
                    router.replace(router.asPath);
                } else if (data?.error) {
                    console.error("error on star workspace: ", data.error);
                }
            }
        },
        starWorkspace: async () => {
            const newWorkspace = { ..._workspace, starred: !_workspace.starred };
            _setWorkspace(newWorkspace);
            const data = await auth.workspace.starWorkspace({ id: _workspace._id });

            if (data.success != true) {
                console.log("error star workspace: ", data?.error);
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
            const newFields = _workspace;
            newFields.fields.splice(_workspace.fields.findIndex(el => el._id == id), 1);
            _setWorkspace({ ...newFields });

            const data = await auth.workspace.field.removeField({ id, workspaceId: _workspace._id });

            if (data.success != true) {
                console.log("delete field error: ", data?.error);
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
            const newFields = _workspace;
            newFields.fields[_workspace.fields.findIndex(el => el._id == fieldId)].cards?.push({ title, desc, color, createdAt: Date.now() });
            _setWorkspace(newFields);

            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: _workspace._id,
                title,
                desc,
                color
            });

            console.log("addCardToField res: ", data);

            if (data.success != true) {
                console.log("add card error: ", data?.error);
            } else {
                _setWorkspace({ ..._workspace, fields: data.data });
            }
        },
        deleteCard: async ({ id, fieldId }) => {
            const newFields = _workspace;
            const cardIndex = newFields.fields[_workspace.fields.findIndex(el => el._id == fieldId)].cards.findIndex(el => el._id == id);
            newFields.fields[_workspace.fields.findIndex(el => el._id == fieldId)].cards.splice(cardIndex, 1);
            _setWorkspace({ ...newFields });

            const data = await auth.workspace.field.removeCard({
                id,
                fieldId,
                workspaceId: _workspace._id,
            });
            console.log("data delete card: ", data);

            if (data.success != true) {
                console.log("delete card error: ", data?.error);
            }
        },
    }

    return (<Container fluid css={{ position: "relative", padding: 0, overflowX: "hidden" }}>
        <Head>
            <title>{_workspace?.title ?? "Not Found"}</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        {!props.workspace?.success ? <Workspace404 reason={props.workspace?.error == "user-workspace-private" ? "private" : "not-found"} />
            :
            <div style={{ display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ paddingLeft: 12, paddingRight: 12, position: "sticky", top: 70, zIndex: 500 }}>
                    {loadingWorkspace ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                        <Loading />
                    </div> : <WorkspaceNav
                        title={_workspace.title}
                        desc={_workspace.desc}
                        starred={_workspace.starred}
                        onFavClick={() => handle.starWorkspace()}
                        onVisibleClick={() => handle.editWorkspace({ workspaceVisible: _workspace?.workspaceVisible ? !_workspace?.workspaceVisible : true })}
                        onDeleteClick={() => setDeleteWorkspace(true)}
                        onEditWorkspace={() => setEditWorkspace(true)}
                        isOwner={isOwner}
                        visible={_workspace.workspaceVisible} // workspace visible
                        user={{
                            username: _workspace.username,
                            fullname: _workspace.fullname ?? "",
                            avatar: _workspace.avatar ?? "",
                        }}
                    />}
                </div>

                <div style={{ display: "flex", width: "100%", flexDirection: "column", paddingTop: 8, justifyContent: "center", alignContent: "center" }}>
                    {!loadingWorkspace && <Grid.Container gap={1} css={{ flexWrap: "nowrap", alignItems: "flex-start", justifyContent: "flex-start", overflowX: "auto" }}>
                        {(_workspace?.fields) && _workspace.fields.map(field => {
                            return (<Field
                                field={field}
                                key={field._id}
                                onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, field: field._id })}
                                onDeleteField={() => handle.deleteField({ id: field._id })}
                                onDeleteCard={({ id }) => handle.deleteCard({ id, fieldId: field._id })}
                                onEditClick={() => setEditField({ ...editField, visible: true, title: field.title, id: field._id })}
                                isOwner={isOwner}
                            />)
                        })}

                        {isOwner && <>
                            <WorkspaceAddField onClick={() => setAddFieldModal(true)} />
                            <Spacer x={1} />
                        </>}
                    </Grid.Container>}
                </div>
            </div>}
        {!loadingWorkspace && <>
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
                title={_workspace.title}
                desc={_workspace.desc}
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
            <VisibilityWorkspaceModal
                visible={privateModal.visible}
                desc={privateModal.desc}
                onClose={() => setPrivateModal({ ...privateModal, visible: false })}
            />
        </>}
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

        validate = await ValidateToken({ token: authCookie });
        workspace = await GetWorkspace({ id: queryId, token: authCookie });
    }
    return { props: { validate, workspace } }
}