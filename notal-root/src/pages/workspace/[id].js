import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import useAuth from "@hooks/auth";

import {
    ValidateToken,
    GetWorkspace,
    WorkboxInit,
    CheckToken
} from "@utils";

import {
    AcceptCookies,
    Navbar
} from "@components";

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

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
    const [_workspace, _setWorkspace] = useState(null);

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
        if (props.workspace?.success == true) {
            setLoadingWorkspace(false);
            _setWorkspace(props.workspace?.data);
        }
    }, [props.workspace]);

    return (<div className="mx-auto max-h-screen min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>{loadingWorkspace ? "Loading..." : _workspace?.title ?? "Not Found"}</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} showHomeButton />

        <AcceptCookies />
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

        validate = await ValidateToken({ token: authCookie });
        workspace = await GetWorkspace({ id: queryId, token: authCookie });

        [validate, workspace] = await Promise.all([
            ValidateToken({ token: authCookie }),
            GetWorkspace({ id: queryId, token: authCookie })
        ]);

        console.log("validate:", validate);
    }
    return { props: { validate, workspace } }
}