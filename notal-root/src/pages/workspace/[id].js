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
    CheckToken,
    GetWorkspaceData
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
    Button,
    EditFieldModal
} from "@components";

import { fetchWorkspace } from "@utils/fetcher";
import BuildComponent from "@utils/buildComponent";
import useNotalUI from "@hooks/notalui";
import Handler from "@utils/handler";

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

    const [addFieldModal, setAddFieldModal] = useState({ visible: false, workspaceTitle: "" });
    const [addCardModal, setAddCardModal] = useState({ visible: false, fieldId: "", fieldTitle: "" });
    const [editCardModal, setEditCardModal] = useState({ visible: false, card: {}, fieldId: "" });

    const [settingsModal, setSettingsModal] = useState(false);
    const [editField, setEditField] = useState({ visible: false, title: "", fieldId: "" });

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

    const BuildWorkspaceContainer = BuildComponent({
        name: "Workspace Container",
        defaultClasses: "relative flex flex-1 flex-row overflow-y-auto pt-1 pb-2 pl-2 overflow-x-visible",
    });

    return (<div className="mx-auto h-full flex flex-col transition-colors duration-100">
        <Head>
            <title>{loadingWorkspace ? (props?.workspace?.data?.title ? `${props?.workspace?.data?.title} · notal.app` : "Loading...") : `${_workspace?.data?.title} • notal.app` ?? "Not Found"}</title>
            <meta property='twitter:description' name='twitter:description' content={props?.workspace?.data?.owner?.username ? `@${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
            <meta property='og:description' name='og:description' content={props?.workspace?.data?.owner?.username ? `@${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
            <meta property='description' name="description" content={props?.workspace?.data?.owner?.username ? `@${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
            <meta property='twitter:image' name="twitter:image" content={props?.workspace?.data?.thumbnail?.type == "image" ? props?.workspace?.data?.thumbnail?.file : "https://notal.app/icon_big.png"} />
            <meta property='og:image' name="og:image" content={props?.workspace?.data?.thumbnail?.type == "image" ? props?.workspace?.data?.thumbnail?.file : "https://notal.app/icon_big.png"} />
            <meta property='apple-mobile-web-app-title' name="apple-mobile-web-app-title" content={props?.workspace?.data?.title ? `${props?.workspace?.data?.title} • notal.app` : "Notal"} />
            <meta property='twitter:title' name="twitter:title" content={props?.workspace?.data?.title ? `${props?.workspace?.data?.title} • notal.app` : "Notal"} />
            <meta property='og:title' name="og:title" content={props?.workspace?.data?.title ? `${props?.workspace?.data?.title} • notal.app` : "Notal"} />
            <meta property='og:url' name="og:url" content={props?.workspace?.data?.id ? `https://notal.app/workspace/${props?.workspace?.data?.id}` : `https://notal.app/workspace/${id}`} />
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
                onStarred={() => Handler.workspace({ workspaceData, auth, _workspace, props }).star()}
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
                                    Handler.workspace({ workspaceData, auth, _workspace, props }).delete(router);
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
                onVisible={() => {
                    //handle.editWorkspace({ workspaceVisible: _workspace?.data?.workspaceVisible ? !_workspace?.data?.workspaceVisible : true, thumbnail: _workspace?.data?.thumbnail })
                    Handler.workspace({ workspaceData, auth, _workspace, props })
                        .edit({
                            workspaceVisible: _workspace?.data?.workspaceVisible ? !_workspace?.data?.workspaceVisible : true,
                            thumbnail: _workspace?.data?.thumbnail
                        })
                }}
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
                        onDelete={() => Handler.workspace({ workspaceData, auth, _workspace, props }).field.delete({ id: field._id })}
                        onAddCard={() => setAddCardModal({ ...addCardModal, visible: true, fieldId: field._id, fieldTitle: field.title })}
                        onDeleteCard={({ id }) => Handler.workspace({ workspaceData, auth, _workspace, props }).card.delete({ id, fieldId: field._id })}
                        onCollapse={() => Handler.workspace({ workspaceData, auth, _workspace, props }).field.collapse({ id: field._id })}
                        onSettings={() => setEditField({ ...editField, visible: true, title: field?.title, fieldId: field._id })}
                        isOwner={isOwner}
                        workspaceUsers={_workspace?.data?.users}
                    />
                ))}
                {(!loadingWorkspace && !notFound && !_workspaceValidating && (!_workspace?.data?.fields || _workspace?.data?.fields?.length == 0))
                    && <WorkspaceAddFieldBanner />}
            </div>
            {notFound && <WorkspaceNotFound />}
        </div>
        <EditFieldModal
            open={editField.visible}
            title={editField.title}
            onClose={() => setEditField({ ...editField, visible: false })}
            onEdit={({ title }) => {
                Handler.workspace({ workspaceData, auth, _workspace, props }).field.edit({ title, fieldId: editField.fieldId });
                setEditField({ ...editField, visible: false });
            }}
        />
        <WorkspaceSettingsModal
            open={settingsModal}
            workspace={_workspace?.data}
            onClose={() => setSettingsModal(false)}
            onSubmit={({ title, desc, thumbnail }) => {
                Handler.workspace({ workspaceData, auth, _workspace, props }).edit({ title, desc, thumbnail });
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
                Handler.workspace({ workspaceData, auth, _workspace, props }).card.add({ title, desc, color, tag, fieldId: addCardModal.fieldId });
                setAddCardModal({ ...addCardModal, visible: false });
            }}
        />
        <AddFieldModal
            open={addFieldModal.visible}
            workspaceTitle={addFieldModal.workspaceTitle}
            onClose={() => setAddFieldModal({ ...addFieldModal, visible: false })}
            onAdd={({ title }) => {
                Handler.workspace({ workspaceData, auth, _workspace, props }).field.add({ title, sortBy: "index" });
                setAddFieldModal({ ...addFieldModal, visible: false });
            }}
        />
    </div>)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspace = {};

    const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;

        [validate, workspace] = await Promise.all([
            ValidateToken({ token: authCookie }),
            GetWorkspaceData({ id: queryId, token: authCookie }),
        ]);

        console.log("validate:", validate?.success, validate?.data?.uid, validate?.error);
        //console.log("workspace: ", workspace);
    }
    return { props: { validate, workspace, /*query: queryId*/ } }
}