import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import styles from '../../../styles/App.module.scss';

import useAuth from '../../hooks/auth';
import { server } from '../../config';

import BackIcon from '../../../public/icons/back.svg';
import EditIcon from '../../../public/icons/edit.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';
import UserIcon from '../../../public/icons/user.svg';

import Header from '../../components/header';
import Button from '../../components/button';
import Input from '../../components/input';

const Profile = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [menuToggle, setMenuToggle] = useState(false);

    const [editingProfile, setEditingProfile] = useState(false);
    const [editProfile, setEditProfile] = useState({ fullname: props.validate?.data?.fullname });

    useEffect(() => {
        console.log("props: ", props);
    }, []);

    const onFinishEditing = async () => {
        setEditingProfile(false);
        if (editProfile.fullname != props.validate?.data?.fullname) {
            const data = await auth.editUser({ uid: auth.authUser?.uid, fullname: editProfile.fullname });

            if (data.success) {
                // editing fullname works but it doesnt update immideatly #TODO: fix
            }
        }
    }

    return (<div className={styles.container}>
        <Head>
            <title>Notal</title>
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
            onLogout={() => auth.logout()}
            profileVisible={auth?.authUser?.uid != props.profile?.uid}
            onProfile={() => router.push(`/profile/${props.validate?.data?.username}`)}
            onHeaderHome={() => router.push("/")}
            showCreate={false}
        />

        <div className={styles.content_profile}>
            {
                (props.profile?.success == false && props.profile?.error == "cant-find-user") && <div className={styles.errorFindUser}>
                    <h1>We couldn't reach to this user.</h1>
                    <Button
                        text="Back"
                        icon={<BackIcon height={24} width={24} fill={"#fff"} style={{ marginRight: 8 }} />}
                        style={{ marginTop: 24, width: "50%" }}
                        onClick={() => router.back()}
                    />
                </div>
            }
            {
                props.profile?.success == true && <div className={styles.profile}>
                    <div className={styles.header}>
                        <div className={styles.avatarSide}>
                            <img
                                src={props.profile.data.avatar}
                                alt="Avatar of a profile"
                                width={128}
                                height={128}
                            />
                        </div>
                        <div className={styles.usernameSide}>
                            <div className={styles.fullname}>
                                {editingProfile ? <Input
                                    type="text"
                                    placeholder="Fullname"
                                    onChange={e => setEditProfile({ ...editProfile, fullname: e.target.value })}
                                    value={editProfile.fullname}
                                    icon={<UserIcon height={24} width={24} fill={"#19181e"} />}
                                    style={{ marginTop: 0 }}
                                /> : <h1>{props.profile.data.fullname}</h1>}
                                {((auth?.authUser?.uid == props.profile?.uid) && !editingProfile) && <Button
                                    text="Edit Profile"
                                    icon={<EditIcon height={24} width={24} fill={"#000"} style={{ marginRight: 8 }} />}
                                    style={{ width: "50%", height: 48 }}
                                    onClick={() => setEditingProfile(true)}
                                    reversed
                                />}
                                {((auth?.authUser?.uid == props.profile?.uid) && editingProfile) && <div style={{ display: "flex", flexDirection: "row" }}>
                                    <Button
                                        text="Cancel"
                                        icon={<CrossIcon height={24} width={24} fill={"#000"} style={{ marginRight: 8 }} />}
                                        style={{ width: "70%", height: 48 }}
                                        onClick={() => setEditingProfile(false)}
                                        reversed
                                    />
                                    <Button
                                        text="Save"
                                        icon={<CheckIcon height={24} width={24} fill={"#000"} style={{ marginRight: 8 }} />}
                                        style={{ width: "70%", height: 48 }}
                                        onClick={() => onFinishEditing()}
                                        reversed
                                    />
                                </div>}
                            </div>
                            <div className={styles.username}>
                                <h1>@{props.profile.data.username}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    </div>)
}

export default Profile

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let profile = {};

    const queryUsername = query?.username;

    if (req) {
        const authCookie = req.cookies.auth;
        //const emailCookie = req.cookies.email;

        const profileData = await fetch(`${server}/api/profile/${queryUsername}`, {
            'Content-Type': 'application/json',
            method: "POST",
        }).then(response => response.json());
        console.log("profile: ", profileData);

        profile = { ...profileData };

        if (authCookie) {
            const data = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json());

            console.log("data (index.js): ", data);
            if (data.success) {
                validate = { ...data };
            }
        }
    }
    return { props: { validate, profile } }
}