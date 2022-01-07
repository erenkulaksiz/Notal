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

import Header from '../../components/header';
import Button from '../../components/button';

import { server } from '../../config';

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [menuToggle, setMenuToggle] = useState(false);

    // editing states
    const [editing, setEditing] = useState(false);
    const [editedField, setEditedFiled] = useState({
        title: props.workspace?.success ? props.workspace?.data.title : null,
        desc: props.workspace?.success ? props.workspace?.data.desc : null
    });

    useEffect(() => {
        console.log("props: ", props);
    }, []);

    const handle = {
        fieldEditing: async (e) => {
            if (e.key === "Enter") {
                // finish editing workspace
                handle.finishEditing();
            }
        },
        finishEditing: async () => {
            setEditing(false);
            if (props.workspace.data.title != editedField.title || props.workspace.data.desc != editedField.desc) {
                const res = await auth.workspace.editWorkspace({ id: props.workspace.data.id, title: editedField.title, desc: editedField.desc });

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
                router.push("/login");
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
                        <div className={styles.details}>
                            {editing ? <input type="text"
                                onKeyDown={handle.fieldEditing}
                                defaultValue={props.workspace?.data?.title}
                                onChange={e => setEditedFiled({ ...editedField, title: e.target.value })}
                                placeholder={"Workspace Title"}
                            /> : <h1>{props.workspace?.data?.title}</h1>}

                            {editing ? <input type="text"
                                onKeyDown={handle.fieldEditing}
                                defaultValue={props.workspace?.data?.desc}
                                onChange={e => setEditedFiled({ ...editedField, desc: e.target.value })}
                                placeholder={"Workspace Description"}
                            /> : <span>{props.workspace?.data?.desc}</span>}
                        </div>
                        {isOwner && (editing ? <div className={styles.editBtn}>
                            <button onClick={() => setEditing(false)} style={{ marginRight: 8 }}>
                                <CrossIcon height={24} width={24} fill={"#19181e"} />
                            </button>
                            <button onClick={() => handle.finishEditing()}>
                                <CheckIcon height={24} width={24} fill={"#19181e"} />
                            </button>
                        </div> : <div className={styles.editBtn}>
                            <button onClick={() => setEditing(true)}>
                                <EditIcon height={24} width={24} fill={"#19181e"} style={{ marginLeft: 8, marginRight: 8, }} />
                            </button>
                        </div>)}
                    </div>
                    <div className={styles.star}>
                        <button onClick={() => handle.starWorkspace()} >
                            {props.workspace?.data?.starred ? <StarFilledIcon height={24} width={24} style={{ fill: "#dbb700" }} /> : <StarOutlineIcon height={24} width={24} />}
                        </button>
                    </div>
                    <div className={styles.visibility}>
                        <button onClick={() => { }} >
                            <VisibleIcon height={24} width={24} />
                        </button>
                    </div>
                </div>
                <div className={styles.wrapper}>

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

        workspace = { ...dataWorkspace, data: { ...dataWorkspace.data, id: queryId } };

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
        }
    }
    return { props: { validate, workspace } }
}