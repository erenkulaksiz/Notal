import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '../../../styles/App.module.scss';
import useAuth from '../../hooks/auth';

import EditIcon from '../../../public/icons/edit.svg';
import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import StarFilledIcon from '../../../public/icons/star_filled.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import AddIcon from '../../../public/icons/add.svg';
import MoreIcon from '../../../public/icons/more.svg';
import SyncIcon from '../../../public/icons/sync.svg';

import Header from '../../components/header';
import Button from '../../components/button';
import Input from '../../components/input';
import Alert from '../../components/alert';
import Card from '../../components/card';
import AddCard from '../../components/addCard';

import { server } from '../../config';
import { CheckToken } from '../../utils';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [menuToggle, setMenuToggle] = useState(false);

    // editing states
    const [editingWorkspace, setEditingWorkspace] = useState(false);
    const [editedWorkspace, setEditedWorkspace] = useState({
        title: props.workspace?.success ? props.workspace?.data.title : null,
        desc: props.workspace?.success ? props.workspace?.data.desc : null
    });
    const [editingField, setEditingField] = useState({ editing: false, fieldId: "" });
    const [editedField, setEditedField] = useState({ title: "" });
    const [addingField, setAddingField] = useState(false);
    const [addField, setAddField] = useState({ title: "" });
    //

    // add card
    const [addingCard, setAddingCard] = useState({ fieldId: "", adding: false });

    // delete modal
    const [deleteWorkspaceModal, setDeleteWorkspaceModal] = useState(false);
    const [deleteField, setDeleteField] = useState({ fieldId: "", deleting: false });

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
        fieldEditing: async (e) => {
            if (e.key === "Enter") {
                // finish editing workspace
                handle.finishEditing();
            }
        },
        finishEditing: async () => {
            setEditingWorkspace(false);
            if (props.workspace.data.title != editedWorkspace.title || props.workspace.data.desc != editedWorkspace.desc) {
                const res = await auth.workspace.editWorkspace({ id: props.workspace.data.id, title: editedWorkspace.title, desc: editedWorkspace.desc });

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
        addingField: async (e) => {
            if (e.key === "Enter") {
                handle.addField();
            }
        },
        addField: async () => {
            setAddingField(false);
            if (addField.title.length != 0) {
                const data = await auth.workspace.field.addField({ title: addField.title, id: props.workspace.data.id });
                setAddField({ ...addField, title: "" });
                if (data.success) {
                    router.replace(router.asPath);
                } else {
                    console.log("addfield error: ", data?.error);
                }
            }
        },
        editField: async ({ id }) => {
            const data = await auth.workspace.field.editField({ id, title: editedField.title, workspaceId: props.workspace.data.id });

            if (data.success) {
                setEditedField({ ...editedField, title: "" });
                setEditingField({ ...editingField, editing: false, fieldId: "" });
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
                setAddingCard({ ...addingCard, fieldId: "", adding: false });
                router.replace(router.asPath);
            } else {
                console.log("add card error: ", data?.error);
            }
        },
        deleteCard: async ({ cardId, fieldId }) => {
            const data = await auth.workspace.field.removeCard({
                id: cardId,
                fieldId,
                workspaceId: props.workspace.data.id,
            });

            if (data.success) {
                setCardMore({ ...cardMore, visible: false, cardId: "", fieldId: "" });
                router.replace(router.asPath);
            } else {
                console.log("rem card error: ", data?.error);
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
            userData={{ fullname: props.validate?.data?.fullname, email: auth?.authUser?.email }}
            avatarURL={props.validate.data?.avatar}
            loggedIn={auth?.authUser != null}
            onLogin={() => router.push("/login")}
            onLogout={() => {
                auth.users.logout();
                //router.push("/login");
            }}
            onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
            onHeaderHome={() => router.push("/")}
            showCreate={false}
            showBackButton
            onBack={() => router.back()}
        />

        <div className={styles.content_workspace}>
            {props.workspace.success == true ? <>
                <div className={styles.nav}>
                    <div className={styles.meta}>
                        {addingField ? <div className={styles.addField}>
                            <Input
                                type="text"
                                placeholder="Field Name"
                                onChange={e => setAddField({ ...addField, title: e.target.value })}
                                style={{ width: "100%" }}
                                onKeyDown={e => (e.key === "Enter") && handle.addField()}
                                autoFocus
                            />
                            <div className={styles.editBtn}>
                                <button onClick={() => {
                                    setAddingField(false);
                                    setAddField({ ...addField, title: "" });
                                }}
                                    style={{ marginRight: 8 }}>
                                    <CrossIcon height={24} width={24} fill={"#19181e"} />
                                </button>
                                <button onClick={() => handle.addField()}>
                                    <CheckIcon height={24} width={24} fill={"#19181e"} />
                                </button>
                            </div>
                        </div> : <div className={styles.details}>
                            {editingWorkspace ? <input type="text"
                                onKeyDown={e => e.key === "Enter" && handle.finishEditing()}
                                defaultValue={props.workspace?.data?.title}
                                onChange={e => setEditedWorkspace({ ...editedWorkspace, title: e.target.value })}
                                placeholder={"Workspace Title"}
                            /> : <h1>{props.workspace?.data?.title}</h1>}

                            {editingWorkspace ? <input type="text"
                                onKeyDown={e => e.key === "Enter" && handle.finishEditing()}
                                defaultValue={props.workspace?.data?.desc}
                                onChange={e => setEditedWorkspace({ ...editedWorkspace, desc: e.target.value })}
                                placeholder={"Workspace Description"}
                            /> : <span>{props.workspace?.data?.desc}</span>}
                        </div>}
                        {(isOwner && !addingField) && (editingWorkspace ? <div className={styles.editBtn}>
                            <button onClick={() => setEditingWorkspace(false)} style={{ marginRight: 8 }}>
                                <CrossIcon height={24} width={24} fill={"#19181e"} />
                            </button>
                            <button onClick={() => handle.finishEditing()}>
                                <CheckIcon height={24} width={24} fill={"#19181e"} />
                            </button>
                        </div> : <div className={styles.editBtn}>
                            <button onClick={() => setEditingWorkspace(true)}>
                                <EditIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                            </button>
                        </div>)}
                    </div>
                    {!isOwner && <div className={styles.workspaceOwnerWrapper}>
                        <Link href="/profile/[username]" as={`/profile/${props.workspace?.data?.profile?.username}`} passHref>
                            <a>
                                <div className={styles.avatar}>
                                    <img
                                        src={props.workspace?.data?.profile?.avatar}
                                        alt="Avatar"
                                        width={33}
                                        height={33}
                                    />
                                </div>
                                <div className={styles.data}>
                                    <h1>{props.workspace?.data?.profile?.fullname}</h1>
                                    <h2>@{props.workspace?.data?.profile?.username}</h2>
                                </div>
                            </a>
                        </Link>
                    </div>}
                    {!editingWorkspace && !addingField && isOwner && <>
                        <div className={styles.workspaceBtn}>
                            <button onClick={() => handle.starWorkspace()} >
                                {props.workspace?.data?.starred ? <StarFilledIcon height={24} width={24} style={{ fill: "#dbb700" }} /> : <StarOutlineIcon height={24} width={24} />}
                            </button>
                        </div>
                        <div className={styles.workspaceBtn}>
                            <button onClick={() => { }} >
                                <VisibleIcon height={24} width={24} />
                            </button>
                        </div>
                        <div className={styles.workspaceBtn}>
                            <button onClick={() => setDeleteWorkspaceModal(true)} >
                                <DeleteIcon height={24} width={24} />
                            </button>
                        </div>
                        <div className={styles.workspaceBtn}>
                            <button onClick={() => setAddingField(true)} >
                                <AddIcon height={24} width={24} />
                            </button>
                        </div>
                    </>}
                </div>
                <div className={styles.wrapper}>
                    <div className={styles.fields}>
                        {props.workspace?.data?.fields.length == 0 ? <div>no fields to list. press + icon on top nav bar</div> :
                            props.workspace?.data?.fields.map(el => {

                                return <div className={styles.field} key={el.id}>
                                    <div className={styles.header}>
                                        {(editingField.editing && editingField.fieldId == el.id) ? <div>
                                            <Input
                                                type="text"
                                                placeholder="Field Title"
                                                onChange={e => {
                                                    //#TODO: not working enter btn
                                                    if (e.key === "Enter" || e.keyCode === 13) {
                                                        handle.editField({ id: el.id });
                                                    } else {
                                                        setEditedField({ ...editedField, title: e.target.value });
                                                    }
                                                }}
                                                defaultValue={el.title}
                                                style={{ width: "90%" }}
                                            />
                                        </div> : <a href="#" onClick={() => isOwner && setEditingField({ ...editingField, editing: true, fieldId: el.id })}>
                                            {el.title}
                                            {isOwner && <EditIcon height={24} width={24} fill={"#fff"} style={{ marginLeft: 8, marginRight: 8, }} />}
                                        </a>}
                                        {(editingField.editing && editingField.fieldId == el.id) ? <div className={styles.controls}>
                                            <button onClick={() => setEditingField({ ...editingField, editing: false, fieldId: "" })} style={{ marginLeft: 0 }}>
                                                <CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                            </button>
                                            <button style={{ marginLeft: 4 }} onClick={() => handle.editField({ id: el.id })}>
                                                <CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                            </button>
                                        </div> : <div className={styles.controls}>
                                            {!(isOwner && deleteField.fieldId == el.id) ? (isOwner && <button onClick={() => setDeleteField({ ...deleteField, deleting: true, fieldId: el.id })}>
                                                <DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                            </button>) :
                                                <button onClick={() => setDeleteField({ ...deleteField, deleting: false, fieldId: "" })}>
                                                    <CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>}
                                            {!(isOwner && deleteField.fieldId == el.id) ? (isOwner && <button>
                                                <MoreIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                            </button>) :
                                                <button onClick={() => {
                                                    setDeleteField({ ...deleteField, deleting: false, fieldId: "" });
                                                    handle.deleteField({ id: deleteField.fieldId });
                                                }}>
                                                    <CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>}
                                        </div>}
                                    </div>
                                    <div className={styles.cardContainer}>
                                        {el.cards && el.cards.map((card, index) => {
                                            return <Card
                                                key={index}
                                                card={card}
                                                isOwner={isOwner}
                                                cardMore={cardMore}
                                                onMoreClick={() => setCardMore({ ...cardMore, visible: (cardMore.cardId == card.id ? !cardMore.visible : true), cardId: card.id })}
                                                onDeleteClick={() => handle.deleteCard({ cardId: card.id, fieldId: el.id })}
                                                onEditClick={() => setCardEditing({ ...cardEditing, editing: true, id: card.id })}
                                                editing={cardEditing.editing && (cardEditing.id == card.id)}
                                            />
                                        })}
                                    </div>
                                    <div className={styles.addCardBtn}>
                                        {(isOwner && addingCard.fieldId != el.id) && <Button
                                            text="Add a card..."
                                            onClick={() => setAddingCard({ ...addingCard, fieldId: el.id, adding: true })}
                                            style={{ height: 48, borderRadius: 8, marginTop: 10, border: "none" }}
                                            icon={<AddIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                                            reversed
                                        />}
                                    </div>
                                    {addingCard.adding && addingCard.fieldId == el.id && <AddCard
                                        onCancel={() => {
                                            setAddingCard({ ...addingCard, adding: false, fieldId: "" });
                                        }}
                                        onSubmit={({ title, desc, color }) => {
                                            handle.addCardToField({ fieldId: el.id, title, desc, color })
                                        }} />}

                                </div>
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
                console.log("fields:", el);
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