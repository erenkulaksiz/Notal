import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '../../../styles/App.module.scss';
import useAuth from '../../hooks/auth';

import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import SyncIcon from '../../../public/icons/sync.svg';

import Header from '../../components/header';
import Button from '../../components/button';
import Alert from '../../components/alert';
import WorkspaceNav from '../../components/workspaceNav';
import Field from '../../components/field';

import { server } from '../../config';
import { CheckToken } from '../../utils';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [menuToggle, setMenuToggle] = useState(false);

    // add card
    const [addingCard, setAddingCard] = useState({ fieldId: "", adding: false });

    // delete modal
    const [deleteWorkspaceModal, setDeleteWorkspaceModal] = useState(false);

    const [loadingWorkspace, setLoadingWorkspace] = useState(true);

    // card state
    const [cardMore, setCardMore] = useState({ visible: false, cardId: "" });
    const [cardEditing, setCardEditing] = useState({ editing: false, id: "", title: "", desc: "", color: "red" });

    useEffect(() => {
        console.log("props: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (props.validate?.error == "no-token" || res || props.validate?.error == "validation-error" || props.valite?.error == "auth/id-token-expired") {
                router.replace(router.asPath);
            }
        })();
    }, []);

    useEffect(() => {
        if (props.workspace?.success == true) setLoadingWorkspace(false);
    }, [props.workspace]);

    const handle = {
        finishEditing: async ({ title, desc }) => {
            if (props.workspace.data.title != title || props.workspace.data.desc != desc) {
                const res = await auth.workspace.editWorkspace({ id: props.workspace.data.id, title, desc });

                console.log("res ->>", res);

                if (res.success) {
                    router.replace(router.asPath);
                } else {
                    console.log("error on edit: ", res.error);
                }
            }
        },
        starWorkspace: async () => {
            const data = await auth.workspace.starWorkspace({ id: props.workspace.data.id });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("star error: ", data?.error);
            }
        },
        addField: async ({ title }) => {
            const data = await auth.workspace.field.addField({ title: title, id: props.workspace.data.id });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("addfield error: ", data?.error);
            }
        },
        editField: async ({ id, title }) => {
            const data = await auth.workspace.field.editField({ id, title, workspaceId: props.workspace.data.id });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("edit field error: ", data?.error);
            }
        },
        deleteField: async ({ id }) => {
            const data = await auth.workspace.field.removeField({ id, workspaceId: props.workspace.data.id });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("delete field error: ", data?.error);
            }
        },
        deleteWorkspace: async () => {
            const data = await auth.workspace.deleteWorkspace({ id: props.workspace.data.id });

            if (data.success) {
                router.replace("/");
            } else {
                console.log("delete workspace error: ", data?.error);
            }
        },
        addCardToField: async ({ fieldId, title, desc, color }) => {
            const data = await auth.workspace.field.addCard({
                id: fieldId,
                workspaceId: props.workspace.data.id,
                title: title,
                desc: desc,
                color: color,
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
                workspaceId: props.workspace.data.id,
            });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("rem card error: ", data?.error);
            }
        },
        editCard: async ({ title, desc, color, id, fieldId }) => {
            const data = await auth.workspace.field.editCard({
                id: id,
                fieldId,
                workspaceId: props.workspace.data.id,
                title,
                desc,
                color,
            });

            if (data.success) {
                setCardEditing({ ...cardEditing, editing: false, id: "" });
                setCardMore({ ...cardMore, visible: false, cardId: "" });
                router.replace(router.asPath);
            } else {
                console.log("edit card error: ", data?.error);
            }
        }
    }

    const isOwner = (props.workspace?.success == true ? props.workspace.data.owner == auth.authUser?.uid : false);

    if (loadingWorkspace) {
        return <div style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <SyncIcon height={24} width={24} fill={"#19181e"} className={styles.loadingIconAuth} style={{ marginTop: 24 }} />
            <span style={{ marginTop: 24, fontSize: "1.2em", fontWeight: "500" }}>Loading Workspace...</span>
        </div>
    }

    return (<div className={styles.container}>
        <Head>
            <title>{props.workspace?.success == true ? props.workspace.data.title : "404"}</title>
            <meta name="description" content="Notal" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header
            menuToggle={menuToggle}
            onMenuToggle={val => setMenuToggle(val)}
            userData={{ fullname: props.validate?.data?.fullname, email: props.validate?.data?.email }}
            avatarURL={props.validate.data?.avatar}
            loggedIn={props.validate.success == true}
            onLogin={() => router.push("/login")}
            onLogout={() => {
                auth.users.logout();
                //router.push("/login");
            }}
            onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
            onHeaderHome={() => router.push("/")}
            leftContainer={<Button
                text="Home"
                onClick={() => router.replace("/")}
                style={{ height: 44, borderRadius: 8, }}
                icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            />}
        />

        <div className={styles.content_workspace}>
            {props.workspace.success == true ? <>
                <WorkspaceNav
                    isOwner={isOwner}
                    workspace={props.workspace}
                    onAddField={({ title }) => handle.addField({ title })}
                    onFinishEditing={({ title, desc }) => handle.finishEditing({ title, desc })}
                    onDeletePress={() => setDeleteWorkspaceModal(true)}
                    onStarPress={() => handle.starWorkspace()}
                />
                <div className={styles.wrapper}>
                    <div className={styles.fields}>
                        {props.workspace?.data?.fields.length == 0 ? <div>no fields to list. press + icon on top nav bar</div> :
                            props.workspace?.data?.fields.map(el => {
                                return <Field
                                    isOwner={isOwner}
                                    key={el.id}
                                    field={el}
                                    onEditField={({ id, title }) => {
                                        handle.editField({ id, title });
                                    }}
                                    onDeleteField={({ id }) => {
                                        handle.deleteField({ id });
                                    }}
                                    onAddCardToField={({ fieldId, title, desc, color }) => {
                                        handle.addCardToField({ fieldId, title, desc, color });
                                    }}
                                    onDeleteCard={({ id, fieldId }) => {
                                        handle.deleteCard({ id, fieldId });
                                    }}
                                    onEditCard={({ title, desc, color, cardId, fieldId }) => {
                                        handle.editCard({ title, desc, color, id: cardId, fieldId });
                                    }}
                                />
                            })}
                    </div>
                </div>
            </> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%", height: "100%" }}>
                <h1 style={{ marginBottom: 24, fontSize: "4em", fontWeight: "600", textAlign: "center" }}>[404]</h1>
                <div style={{ fontSize: "1.8em", fontWeight: "600", textAlign: "center" }}>
                    We couldnt find this workspace in the galaxy.<br />Its probably on a another galaxy.
                </div>
                <Button
                    text="Home"
                    onClick={() => router.replace("/")}
                    style={{ height: 54, borderRadius: 8, width: 380, marginTop: 24 }}
                    icon={<HomeFilledIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                />
                <Button
                    text="Back"
                    onClick={() => router.back()}
                    style={{ height: 54, borderRadius: 8, width: 380, marginTop: 12 }}
                    icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                />
            </div>
            }
        </div>
        <Alert
            visible={deleteWorkspaceModal}
            icon={<DeleteIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            title="Delete Workspace"
            textColor="#fff"
            text="Are you sure want to delete this workspace?"
            closeVisible
            onCloseClick={() => {
                setDeleteWorkspaceModal(false)
            }}
            buttons={[
                <Button
                    text="Cancel"
                    onClick={() => setDeleteWorkspaceModal(false)}
                    icon={<CrossIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                    key={0}
                />,
                <Button
                    text="Delete"
                    icon={<DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                    style={{ borderStyle: "none" }}
                    onClick={() => handle.deleteWorkspace()}
                    reversed
                    key={1}
                />
            ]}
        />
    </div >)
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
                    });
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