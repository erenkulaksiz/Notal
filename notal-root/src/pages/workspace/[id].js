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
    EditFieldModal,
    Tab,
    EditCardModal,
    WorkspaceTabFields,
    WorkspaceTabChangelog
} from "@components";

import { fetchWorkspace } from "@utils/fetcher";
import BuildComponent from "@utils/buildComponent";
import useNotalUI from "@hooks/notalui";
import Handler from "@utils/handler";

import Log from "@utils/logger"

const WorkspaceTabs = [
    {
        title: "Board",
        id: "kanban"
    },
    {
        title: "Roadmap",
        id: "roadmap"
    },
    {
        title: "Bookmarks",
        id: "bookmarks"
    },
    {
        title: "Changelog",
        id: "changelog",
    }
];

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

    const [tab, setTab] = useState(0);

    const isOwner = (_workspace?.data ? (_workspace?.data?.owner == props?.validate?.uid) : false);
    const notFound = (_workspace?.error == "not-found" || _workspace?.error == "invalid-params" || _workspace?.error == "user-workspace-private")

    // Check for validation
    useEffect(() => {
        _setWorkspaceValidating(workspaceData.isValidating);
    }, [workspaceData.isValidating]);

    useEffect(() => {
        if (router.query.r) {
            // r route exist, check if its inside workspacetabs
            const routeIndex = WorkspaceTabs.findIndex(el => el.id == router.query.r);
            if (routeIndex != -1) {
                setTab(routeIndex);
            }
        }
    }, []);

    useEffect(() => {
        if (tab == 0) {
            router.push("/workspace/" + id, undefined, { shallow: true });
        } else {
            router.push("/workspace/" + id + "?r=" + WorkspaceTabs[tab].id, undefined, { shallow: true });
        }
    }, [tab]);

    useEffect(() => {
        Log.debug("workspace props: ", props);
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
            Log.debug("newData: ", workspaceData?.data?.data);
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
                //Log.debug("workspace:", workspaceData?.data);
            }
            if (workspaceData.error) {
                console.error("Error with workspace: ", workspaceData.error);
            }
        })();
    }, [workspaceData]);

    const BuildWorkspaceContainer = BuildComponent({
        name: "Workspace Container",
        defaultClasses: "relative flex flex-1 flex-row overflow-y-auto overflow-x-visible",
    });

    return (<div className="mx-auto h-full flex flex-col transition-colors duration-100">
        <Head>
            <title>{loadingWorkspace ? (props?.workspace?.data?.title ? `${props?.workspace?.data?.title} · notal.app` : "Loading...") : `${_workspace?.data?.title} • notal.app` ?? "Not Found"}</title>
            <meta property='twitter:description' name='twitter:description' content={props?.workspace?.data?.owner?.username ? `📍 @${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
            <meta property='og:description' name='og:description' content={props?.workspace?.data?.owner?.username ? `📍 @${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
            <meta property='description' name="description" content={props?.workspace?.data?.owner?.username ? `📍 @${props?.workspace?.data?.owner?.username}'s workspace` : "Take your notes to next level with Notal"} />
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
            <WorkspaceSidebar
                error={_workspace?.error}
                isOwner={isOwner}
                loadingWorkspace={loadingWorkspace}
                workspaceStarred={_workspace?.data?.starred}
                workspaceVisible={_workspace?.data?.workspaceVisible}
                workspaceUsers={_workspace?.data?.users}
                onStarred={() => Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).star()}
                onSettings={() => setSettingsModal(true)}
                onDelete={() => {
                    NotalUI.Alert.show({
                        title: "Delete Workspace",
                        titleIcon: <DeleteIcon size={24} fill="currentColor" />,
                        desc: `Are you sure want to delete ${_workspace?.data?.title} workspace?`,
                        showCloseButton: false,
                        buttons: [
                            <Button
                                onClick={() => NotalUI.Alert.close()}
                                key={1}
                                fullWidth="w-[49%]"
                                light="bg-red-500 hover:bg-red-600 active:bg-red-700 dark:bg-red-500 hover:dark:bg-red-500"
                            >
                                <CrossIcon size={24} fill="currentColor" />
                                Cancel
                            </Button>,
                            <Button
                                onClick={() => {
                                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI }).delete(router);
                                    NotalUI.Alert.close();
                                }}
                                key={2}
                                fullWidth="w-[49%]"
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
                    Handler.workspace({ workspaceData, auth, _workspace, props, NotalUI })
                        .edit({
                            workspaceVisible: _workspace?.data?.workspaceVisible ? !_workspace?.data?.workspaceVisible : true,
                            thumbnail: _workspace?.data?.thumbnail
                        })
                }}
                onAddField={() => setAddFieldModal({ visible: true, workspaceTitle: _workspace?.data?.title })}
            />
            <div className={BuildWorkspaceContainer.classes}>
                <Tab
                    selected={tab}
                    onSelect={({ index }) => setTab(index)}
                    id="workspaceIdTab"
                    views={WorkspaceTabs}
                    headerClassName="dark:bg-transparent bg-white sm:w-1/2 md:w-[60%] max-w-[1466px] w-full"
                    className="flex-1 flex flex-col"
                    headerContainerClassName="pl-2 pt-2 pr-2"
                    loadingWorkspace={loadingWorkspace}
                >
                    <Tab.TabView index={0} className="relative flex flex-1 flex-row overflow-y-auto p-2 overflow-x-visible gap-2">
                        <WorkspaceTabFields
                            _workspace={_workspace}
                            isOwner={isOwner}
                            loadingWorkspace={loadingWorkspace}
                            workspaceData={workspaceData}
                            notFound={notFound}
                            _workspaceValidating={_workspaceValidating}
                            props={props}
                        />
                    </Tab.TabView>
                    <Tab.TabView index={1} className="p-3 pt-2">
                        roadmap
                    </Tab.TabView>
                    <Tab.TabView index={2} className="p-3 pt-2">
                        bookmarks
                    </Tab.TabView>
                    <Tab.TabView index={3} className="p-3 pt-2">
                        <WorkspaceTabChangelog />
                    </Tab.TabView>
                </Tab>
            </div>
            {notFound && <WorkspaceNotFound />}
        </div>
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

        Log.debug("validate:", validate?.success, validate?.data?.uid, validate?.error);
        //Log.debug("workspace: ", workspace);
    }
    return { props: { validate, workspace, /*query: queryId*/ } }
}