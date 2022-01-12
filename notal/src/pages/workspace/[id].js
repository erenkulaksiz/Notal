import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import cookie from 'js-cookie';

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
import DragIcon from '../../../public/icons/drag.svg';

import Header from '../../components/header';
import Button from '../../components/button';
import Input from '../../components/input';
import Alert from '../../components/alert';

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
    const [editingField, setEditingField] = useState({ editing: false, field: -1 });
    const [editedField, setEditedField] = useState({ title: "" });
    //

    // adding field states
    const [addingField, setAddingField] = useState(false);
    const [addField, setAddField] = useState({ title: "" });

    // delete modal
    const [deleteModal, setDeleteModal] = useState(false);


    useEffect(() => {
        console.log("props: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });

            console.log("toeeeen:", token);

            if (props.validate?.error == "no-token" || res) {
                router.replace(router.asPath);
            }
        })();
    }, []);

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
        deleteField: async ({ id }) => {
            const data = await auth.workspace.field.removeField({ id, workspaceId: props.workspace.data.id });

            if (data.success) {
                router.replace(router.asPath);
            } else {
                console.log("delete field error: ", data?.error);
            }
        }
    }

    const isOwner = (props.workspace?.success == true ? props.workspace.data.owner == auth.authUser?.uid : false);

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
                            <button onClick={() => setDeleteModal(true)} >
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
                                return <div className={styles.fieldWrapper} key={el.id}>
                                    <div className={styles.field}>
                                        <div className={styles.header}>
                                            {editingField.editing ? <div>
                                                <Input
                                                    type="text"
                                                    placeholder="Field Name"
                                                    onChange={e => setEditedField({ title: e.target.value })}
                                                    defaultValue={"Yapılacaklar"}
                                                    style={{ width: "100%" }}
                                                />
                                            </div> : <a href="#" onClick={() => setEditingField({ ...editingField, editing: true })}>
                                                {el.title}
                                            </a>}
                                            {editingField.editing ? <div className={styles.controls}>
                                                <button onClick={() => setEditingField({ ...editingField, editing: false })}>
                                                    <CrossIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>
                                                <button>
                                                    <CheckIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>
                                            </div> : <div className={styles.controls}>
                                                {isOwner && <button onClick={() => handle.deleteField({ id: el.id })}>
                                                    <DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>}
                                                <button>
                                                    <MoreIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                                                </button>
                                            </div>}
                                        </div>
                                        <div className={styles.todo}>
                                            <div className={styles.content}>
                                                <div className={styles.title}>
                                                    <AddIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8, }} />
                                                    <h1>Selam bu bir todo</h1>
                                                </div>
                                                <div className={styles.desc}>
                                                    loremdfgfffffffffffffffffffffffffffffffsdfgfddfs
                                                </div>
                                            </div>
                                            <div className={styles.controls}>
                                                <div className={styles.color} style={{ backgroundColor: "red" }} />
                                                <button>
                                                    <MoreIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 2, marginRight: 2, }} />
                                                </button>
                                                {isOwner && <button>
                                                    <DragIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 2, marginRight: 2, }} />
                                                </button>}
                                            </div>
                                        </div>
                                        {isOwner && <Button
                                            text="Add a card..."
                                            onClick={() => { }}
                                            style={{ height: 48, borderRadius: 8, marginTop: 10, border: "none" }}
                                            icon={<AddIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                                            reversed
                                        />}
                                    </div>
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
            visible={deleteModal}
            icon={<DeleteIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
            title="Delete Workspace"
            textColor="#fff"
            text="Are you sure want to delete this workspace?"
            closeVisible
            onCloseClick={() => {
                setDeleteModal(false)
            }}
            buttons={[
                <Button
                    text="Cancel"
                    onClick={() => setDeleteModal(false)}
                    key={0}
                />,
                <Button
                    text="Delete"
                    icon={<DeleteIcon height={24} width={24} fill={"#19181e"} style={{ marginRight: 8 }} />}
                    style={{ borderStyle: "none" }}
                    onClick={() => { }}
                    reversed
                    key={1}
                />
            ]}
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