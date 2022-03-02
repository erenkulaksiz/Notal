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
    WorkspaceField
} from "@components";

import { fetchWorkspace } from "@utils/fetcher";

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const workspaceData = useSWR(
        ["api/fetchWorkspace/" + props.query],
        () => fetchWorkspace({ token: Cookies.get("auth"), id: props.query })
    );

    const [savingWorkspace, setSavingWorkspace] = useState(false);

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

    const isOwner = (_workspace ? _workspace?.owner == props?.validate?.uid : false);

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
        if (workspaceData.data) {
            console.log("workspaceData: ", workspaceData.data);
            if (workspaceData?.data?.error?.code == "auth/id-token-expired") {
                router.replace(router.asPath);
            } else {
                _setWorkspace(workspaceData.data);
                setLoadingWorkspace(false);
                console.log("workspace:", workspaceData?.data);
            }
        }
        if (workspaceData.error) {
            console.error("Error with workspace: ", workspaceData.error);
        }
    }, [workspaceData]);

    return (<div className="mx-auto max-h-screen min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>{loadingWorkspace ? "Loading..." : _workspace?.data?.title ?? "Not Found"}</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} showHomeButton />

        <div className="relative flex flex-row flex-1 bg-white dark:bg-neutral-900 overflow-y-auto overflow-x-hidden">
            <div className="h-full sticky top-0 w-14 bg-red-900">
                asd
            </div>
            <div className="flex flex-1 flex-row overflow-y-auto pt-1 pl-1">
                {!loadingWorkspace && _workspace?.data?.fields?.map((field, index) =>
                    <WorkspaceField field={field} key={field._id} />
                )}
            </div>
        </div>

        <AcceptCookies />
    </div>)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    //let workspace = {};

    const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;

        [validate, /*workspace*/] = await Promise.all([
            ValidateToken({ token: authCookie }),
            //GetWorkspace({ id: queryId, token: authCookie })
        ]);

        console.log("validate:", validate);
    }
    return { props: { validate, /*workspace*/query: queryId } }
}