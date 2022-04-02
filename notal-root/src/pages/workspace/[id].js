import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import Cookies from "js-cookie";

import useAuth from "@hooks/auth";

import {
    DeleteIcon,
    CrossIcon,
    CheckIcon
} from "@icons";

import {
    ValidateToken,
    CheckToken
} from "@utils";

import {
    Navbar,
    WorkspaceAddFieldBanner,
    WorkspaceField,
    WorkspaceNotFound,
    WorkspaceSidebar,
    AddFieldModal,
    AddCardModal,
    WorkspaceSettingsModal,
    Button
} from "@components";

import { fetchWorkspace } from "@utils/fetcher";
import BuildComponent from "@utils/buildComponent";
import useNotalUI from "@hooks/notalui";

const Workspace = (props) => {
    const NotalUI = useNotalUI();
    const auth = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const workspaceData = useSWR(
        ["api/fetchWorkspace/" + id],
        () => fetchWorkspace({ token: Cookies.get("auth"), id, uid: props?.validate?.data?.uid }) // get token from cookie
    );

    // Modals
    const [privateModal, setPrivateModal] = useState({ visible: false, desc: "" });

    const [addFieldModal, setAddFieldModal] = useState({ visible: false, workspaceTitle: "" });
    const [addCardModal, setAddCardModal] = useState({ visible: false, fieldId: "", fieldTitle: "" });
    const [editCardModal, setEditCardModal] = useState({ visible: false, card: {}, fieldId: "" });

    const [settingsModal, setSettingsModal] = useState(false);
    const [editField, setEditField] = useState({ visible: false, title: "" });

    // Workspace
    const [loadingWorkspace, setLoadingWorkspace] = useState(true);
    const [_workspace, _setWorkspace] = useState({});
    const [_workspaceValidating, _setWorkspaceValidating] = useState(true);

    const isOwner = (_workspace?.data ? (_workspace?.data?.owner == props?.validate?.uid) : false);
    const notFound = (_workspace?.error == "not-found" || _workspace?.error == "invalid-params" || _workspace?.error == "user-workspace-private")

    // Check for validation
    useEffect(() => {
        _setWorkspaceValidating(workspaceData.isValidating);
    }, [workspaceData.isValidating]);

    useEffect(() => {
        console.log("workspace props: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token: token.res, props, user: auth?.authUser });
            if (!res) {
                setTimeout(() => router.replace(router.asPath), 1000);
            }
        })();
    }, [_workspaceValidating]);

    useEffect(() => {
        (async () => {
            console.log("newData: ", workspaceData?.data?.data);
            if (workspaceData?.data?.error) {
                console.error("swr error workspaceData: ", workspaceData?.data);
            }
            if (workspaceData?.data?.error?.code == "auth/id-token-expired") {
                const token = await auth.users.getIdToken();
                setTimeout(() => {
                    router.replace(router.asPath);
                    workspaceData.mutate();
                }, 5000);
            } else {
                if (workspaceData.data) {
                    _setWorkspace(workspaceData.data);
                    setLoadingWorkspace(false);
                }
                //console.log("workspace:", workspaceData?.data);
            }
            if (workspaceData.error) {
                console.error("Error with workspace: ", workspaceData.error);
            }
        })();
    }, [workspaceData]);

    const handle = {
        editWorkspace: async ({ title = _workspace?.data?.title, desc = _workspace?.data?.desc, workspaceVisible = _workspace?.data?.workspaceVisible ?? false, thumbnail }) => {
            /*
            // check for any changes
            if (
                _workspace?.data?.title == title
                && _workspace?.data?.desc == desc
                && _workspace?.data?.workspaceVisible == workspaceVisible
                && _workspace?.data?.thumbnail != thumbnail) return;
                */
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, title, desc, workspaceVisible, thumbnail } }, false);
            const data = await auth.workspace.editWorkspace({ id: _workspace?.data?._id, title, desc, workspaceVisible, thumbnail });
            window.gtag("event", "editWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
            console.log("editData:", data);
        },
        starWorkspace: async () => {
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, starred: !_workspace?.data?.starred } }, false);
            const data = await auth.workspace.starWorkspace({ id: _workspace?.data?._id });
            console.log("starData:", data);
            window.gtag("event", "starWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
        },
        addField: async ({ title, filterBy }) => {
            const currFields = _workspace?.data?.fields || [];
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: [...currFields, { _id: "1", title, updatedAt: Date.now(), createdAt: Date.now(), filterBy, owner: auth.authUser.uid, cards: [] }] } }, false)
            const data = await auth.workspace.field.addField({ title, id: _workspace?.data?._id, filterBy });
            workspaceData.mutate(); // Refresh data in order to get new ID's
            console.log("addField data: ", data);
            window.gtag("event", "addField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
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
            const newFields = _workspace?.data?.fields;
            newFields.splice(_workspace?.data?.fields.findIndex(el => el._id == id), 1);
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
            const data = await auth.workspace.field.removeField({ id, workspaceId: _workspace?.data?._id });
            console.log("deleteField data: ", data);
            window.gtag("event", "deleteField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
        },
        deleteWorkspace: async () => {
            const data = await auth.workspace.deleteWorkspace({ id: _workspace?.data?._id });
            if (data.success) router.replace("/home");
            else if (data?.error) console.error("error on delete workspace: ", data.error);
        },
        addCardToField: async ({ fieldId, title, desc, color, tag }) => {
            const newFields = _workspace?.data?.fields;
            newFields[_workspace?.data?.fields?.findIndex(el => el._id == fieldId)].cards?.push({ title, desc, color, createdAt: Date.now(), updatedAt: Date.now(), tag, owner: auth.authUser.uid });
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
            const data = await auth.workspace.field.addCard({
                id: fieldId, workspaceId: _workspace?.data?._id, title, desc, color, tag
            });
            console.log("addCardToField data: ", data);
            workspaceData.mutate();
            window.gtag("event", "addCardToField", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
        },
        deleteCard: async ({ id, fieldId }) => {
            const newFields = _workspace?.data?.fields;
            const cardIndex = newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.findIndex(el => el._id == id);
            newFields[_workspace?.data?.fields.findIndex(el => el._id == fieldId)].cards.splice(cardIndex, 1);
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
            const data = await auth.workspace.field.removeCard({ id, fieldId, workspaceId: _workspace?.data?._id });
            console.log("removeCard data: ", data);
            if (data.success != true) {
                console.log("delete card error: ", data?.error);
            }
        },
        editCard: async ({ title, desc, color, id, fieldId }) => {
            const data = await auth.workspace.field.editCard({
                id,
                fieldId,
                workspaceId: _workspace._id,
                title,
                desc,
                color,
            });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("edit card error: ", data?.error);
            }
        },
        collapseField: async ({ id }) => {
            const newFields = _workspace?.data?.fields;
            const fieldIndex = _workspace?.data?.fields.findIndex(el => el._id == id);
            if (newFields[fieldIndex]["collapsed"]) {
                newFields[fieldIndex]["collapsed"] = false;
            } else {
                newFields[fieldIndex]["collapsed"] = true;
            }
            await workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, fields: newFields } }, false);
            await auth.workspace.field.editField({
                id,
                field: {
                    title: newFields[fieldIndex]?.title,
                    filterBy: newFields[fieldIndex]?.filterBy,
                    collapsed: !!newFields[fieldIndex]?.collapsed,
                },
                workspaceId: _workspace?.data?._id,
            });
        }
    }

    const BuildWorkspaceContainer = BuildComponent({
        name: "Workspace Container",
        defaultClasses: "relative flex flex-1 flex-row overflow-y-auto pt-1 pb-2 pl-2 overflow-x-visible",
    });

    return (<div className="mx-auto h-full flex flex-col transition-colors duration-100">
        <Head>
            <title>{loadingWorkspace ? "Loading..." : _workspace?.data?.title ?? "Not Found"}</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar
            user={props?.validate?.data}
            showHomeButton
            showCollapse
            validating={_workspaceValidating}
            workspace={{
                loadingWorkspace,
                _workspace,
                isOwner,
            }}
        />

        <div className="relative flex flex-row flex-1 bg-white dark:bg-neutral-900 overflow-y-auto">
            {(!loadingWorkspace && !_workspace?.error && isOwner) && <WorkspaceSidebar
                workspaceStarred={_workspace?.data?.starred}
                workspaceVisible={_workspace?.data?.workspaceVisible}
                workspaceUsers={_workspace?.data?.users}
                onStarred={() => handle.starWorkspace()}
                onSettings={() => setSettingsModal(true)}
                onDelete={() => {
                    NotalUI.Alert.show({
                        title: "Delete Workspace",
                        titleIcon: <DeleteIcon size={24} fill="currentColor" />,
                        desc: `Are you sure want to delete ${_workspace?.data?.title} workspace?`,
                        showCloseButton: false,
                        buttons: [
                            <Button
                                className="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500 h-10"
                                onClick={() => NotalUI.Alert.close()}
                                key={1}
                            >
                                <CrossIcon size={24} fill="currentColor" />
                                Cancel
                            </Button>,
                            <Button
                                onClick={() => {
                                    handle.deleteWorkspace();
                                    NotalUI.Alert.close();
                                }}
                                key={2}
                            >
                                <CheckIcon size={24} fill="currentColor" />
                                Delete
                            </Button>
                        ]
                    })
                }}
                // refactor onVisible.
                onVisible={() => handle.editWorkspace({ workspaceVisible: _workspace?.data?.workspaceVisible ? !_workspace?.data?.workspaceVisible : true, thumbnail: _workspace?.data?.thumbnail })}
                onAddField={() => setAddFieldModal({ visible: true, workspaceTitle: _workspace?.data?.title })}
            />}
            <div className={BuildWorkspaceContainer.classes}>
                {loadingWorkspace && [1, 2, 3, 4].map((item) => (
                    <WorkspaceField skeleton key={item} /> // show skeleton loaders
                ))}
                {!loadingWorkspace && _workspace?.data?.fields?.map((field) => (
                    <WorkspaceField
                        field={field}
                        key={field._id}
                        onDelete={() => handle.deleteField({ id: field._id })}
                        onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, fieldId: field._id, fieldTitle: field.title })}
                        onDeleteCard={({ id }) => handle.deleteCard({ id, fieldId: field._id })}
                        onCollapse={() => handle.collapseField({ id: field._id })}
                        isOwner={isOwner}
                        workspaceUsers={_workspace?.data?.users}
                    />
                ))}
                {(!loadingWorkspace && !notFound && !_workspaceValidating && (!_workspace?.data?.fields || _workspace?.data?.fields?.length == 0))
                    && <WorkspaceAddFieldBanner />}
            </div>
            {notFound && <WorkspaceNotFound />}
        </div>

        <WorkspaceSettingsModal
            open={settingsModal}
            workspace={_workspace?.data}
            onClose={() => setSettingsModal(false)}
            onSubmit={({ title, desc, thumbnail }) => {
                handle.editWorkspace({ title, desc, thumbnail });
                setSettingsModal(false);
            }}
            onUserChange={() => {
                workspaceData.mutate();
                //setSettingsModal(false);
            }}
        />
        <AddCardModal
            open={addCardModal.visible}
            fieldTitle={addCardModal.fieldTitle}
            onClose={() => setAddCardModal({ ...addCardModal, visible: false })}
            onAdd={({ title, desc, color, tag }) => {
                handle.addCardToField({ fieldId: addCardModal.fieldId, title, desc, color, tag });
                setAddCardModal({ ...addCardModal, visible: false });
            }}
        />
        <AddFieldModal
            open={addFieldModal.visible}
            workspaceTitle={addFieldModal.workspaceTitle}
            onClose={() => setAddFieldModal({ ...addFieldModal, visible: false })}
            onAdd={({ title }) => {
                handle.addField({ title, filterBy: "index" });
                setAddFieldModal({ ...addFieldModal, visible: false });
            }}
        />
    </div>)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    //let workspace = {};

    //const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;

        [validate, /*workspace*/] = await Promise.all([
            ValidateToken({ token: authCookie }),
            //GetWorkspace({ id: queryId, token: authCookie })
        ]);

        console.log("validate:", validate?.success, validate?.data?.uid, validate?.error);
    }
    return { props: { validate, /*workspace, query: queryId*/ } }
}