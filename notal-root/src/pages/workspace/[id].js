import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import Cookies from "js-cookie";

import useAuth from "@hooks/auth";

import {
    ValidateToken,
    WorkboxInit,
    CheckToken
} from "@utils";

import {
    AcceptCookies,
    Navbar,
    WorkspaceAddFieldBanner,
    WorkspaceField,
    WorkspaceNotFound,
    WorkspaceSidebar,
    DeleteWorkspaceModal
} from "@components";

import { fetchWorkspace } from "@utils/fetcher";

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { id } = router.query;

    const workspaceData = useSWR(
        ["api/fetchWorkspace/" + id],
        () => fetchWorkspace({ token: Cookies.get("auth"), id })
    );

    // Modals
    const [privateModal, setPrivateModal] = useState({ visible: false, desc: "" });

    const [addFieldModal, setAddFieldModal] = useState(false);
    const [deleteWorkspaceModal, setDeleteWorkspace] = useState(false);
    const [addCardModal, setAddCardModal] = useState({ visible: false, field: "" });
    const [editCardModal, setEditCardModal] = useState({ visible: false, card: {}, fieldId: "" });

    const [editWorkspace, setEditWorkspace] = useState(false);
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
        WorkboxInit();
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token: token.res, props });
            if (!res) {
                setTimeout(() => router.replace(router.asPath), 1000);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
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
                _setWorkspace(workspaceData.data);
                setLoadingWorkspace(false);
                //console.log("workspace:", workspaceData?.data);
            }
            if (workspaceData.error) {
                console.error("Error with workspace: ", workspaceData.error);
            }
        })();
    }, [workspaceData]);

    const handle = {
        editWorkspace: async ({ title = _workspace?.data?.title, desc = _workspace?.data?.desc, workspaceVisible = _workspace?.data?.workspaceVisible ?? false }) => {
            if (_workspace?.data?.title != title || _workspace?.data?.desc != desc || _workspace?.data?.workspaceVisible != workspaceVisible) {

                /*
                if (_workspace?.data?.workspaceVisible != workspaceVisible) {
                    setPrivateModal({ ...privateModal, visible: true, desc: workspaceVisible ? "This workspace is now visible to everyone who has the link." : "This workspace is now set to private." })
                } else {
                    setPrivateModal({ ...privateModal, visible: false });
                }
                */

                const data = await auth.workspace.editWorkspace({ id: _workspace?.data?._id, title, desc, workspaceVisible });

                if (data.success) {
                    window.gtag('event', "editWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
                    //router.replace(router.asPath);
                    workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, title, desc, workspaceVisible } });
                } else if (data?.error) {
                    console.error("error on delete workspace: ", data.error);
                }
            }
        },
        starWorkspace: async () => {
            const data = await auth.workspace.starWorkspace({ id: _workspace?.data?._id });
            window.gtag('event', "starWorkspace", { login: props.validate.data.email, workspaceId: _workspace?.data?._id });
            workspaceData.mutate({ ..._workspace, data: { ..._workspace.data, starred: !_workspace?.data?.starred } });

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
            const data = await auth.workspace.deleteWorkspace({ id: _workspace?.data?._id });

            if (data.success) {
                router.replace("/home");
            } else if (data?.error) {
                console.error("error on delete workspace: ", data.error);
            }
        },
        addCardToField: async ({ fieldId, title, desc, color, tag }) => {
            const newFields = _workspace;
            newFields.fields[_workspace.fields.findIndex(el => el._id == fieldId)].cards?.push({ title, desc, color, createdAt: Date.now(), tag });
            _setWorkspace(newFields);

            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: _workspace._id,
                title,
                desc,
                color,
                tag
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
    }

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
            validating={_workspaceValidating}
        />

        <div className="relative flex flex-row flex-1 bg-white dark:bg-neutral-900 overflow-y-auto">
            {(!loadingWorkspace && !_workspace?.error && isOwner) && <WorkspaceSidebar
                workspaceStarred={_workspace?.data?.starred}
                workspaceVisible={_workspace?.data?.workspaceVisible}
                onStarred={() => handle.starWorkspace()}
                onSettings={() => { }}
                onDelete={() => setDeleteWorkspace(true)}
                onVisible={() => handle.editWorkspace({ workspaceVisible: _workspace?.data?.workspaceVisible ? !_workspace?.data?.workspaceVisible : true })}
                onAddField={() => { }}
                onEditWorkspace={() => { }}
            />}
            <div className="flex flex-1 flex-row overflow-y-auto pt-1 pb-2 pl-2 overflow-x-visible">
                {!loadingWorkspace ? _workspace?.data?.fields?.map((field) => (
                    <WorkspaceField field={field} key={field._id} />
                )) : [1, 2, 3, 4].map((item) => (
                    <WorkspaceField skeleton key={item} /> // show skeleton loaders
                ))}
                {(!loadingWorkspace && !notFound && (!_workspace?.data?.fields || _workspace?.data?.fields?.length == 0))
                    && <WorkspaceAddFieldBanner />}
            </div>
            {notFound && <WorkspaceNotFound />}
        </div>

        <DeleteWorkspaceModal
            open={deleteWorkspaceModal}
            onClose={() => setDeleteWorkspace(false)}
            onDelete={() => {
                setDeleteWorkspace(false);
                handle.deleteWorkspace();
            }}
        />

        <AcceptCookies />
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

        console.log("validate:", validate);
    }
    return { props: { validate, /*workspace, query: queryId*/ } }
}