import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Switch, useTheme, Input, Row, Avatar, Textarea, Loading } from '@nextui-org/react';

import useAuth from '../../hooks/auth';
import { server } from '../../config';

import BackIcon from '../../../public/icons/back.svg';
import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import EditIcon from '../../../public/icons/edit.svg';
import CrossIcon from '../../../public/icons/cross.svg';
import CheckIcon from '../../../public/icons/check.svg';
import UserIcon from '../../../public/icons/user.svg';
import AtIcon from '../../../public/icons/at.svg';
import LockIcon from '../../../public/icons/lock_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import VisibleOffIcon from '../../../public/icons/visible_off.svg';

import { CheckToken } from '../../utils';

import Navbar from '../../components/navbar';

const Profile = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    const avatarInputRef = useRef();

    //loading
    const [loadingProfile, setLoadingProfile] = useState(true);

    const [editingProfile, setEditingProfile] = useState(false);
    const [editProfile, setEditProfile] = useState(null);
    const [editErrors, setEditErrors] = useState({ fullname: false, username: false, bio: false });
    const [editAvatarLoading, setEditAvatarLoading] = useState(false);

    useEffect(() => {
        console.log("props on profile: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (!res) {
                router.replace(router.asPath);
            }
        })();
    }, []);

    useEffect(() => {
        if ((props.profile?.success == true) || (props.profile?.success == false && props.profile?.error == "cant-find-user")) {
            setLoadingProfile(false);
            setEditProfile({
                fullname: props.validate?.data?.fullname,
                username: props.validate?.data?.username,
                bio: props.validate?.data?.bio,
                visibility: props.validate?.data?.profileVisible
            });
        }
    }, [props.profile]);

    const onFinishEditing = async (e) => {
        if (editProfile.username.length < 3) {
            setEditErrors({ ...editErrors, username: "Please enter a valid username." });
            return;
        } else {
            setEditErrors({ ...editErrors, username: false });
        }

        if (editProfile.fullname.length != 0 && !editProfile.fullname.replace(/\s/g, '').length) {
            setEditErrors({ ...editErrors, fullname: "You cant just use whitespace fullname. Theres remove icon on the right." });
            return;
        }

        if (editProfile.fullname.length != 0 && editProfile.fullname.length < 3) {
            setEditErrors({ ...editErrors, fullname: "Fullname must be minimum 3 characters." });
            return;
        }

        if (editProfile.fullname != props.validate?.data?.fullname || editProfile.username != props.validate?.data?.username || editProfile.bio != props.validate?.data?.bio || editProfile.visibility != props.validate?.data?.profileVisible) {
            const data = await auth.users.editUser({
                uid: auth.authUser?.uid,
                fullname: editProfile.fullname,
                username: editProfile.username,
                bio: editProfile.bio,
                profileVisible: editProfile.visibility,
            });
            if (data.success) {
                router.replace(`/profile/${editProfile.username}`);
                setEditingProfile(false);
                setEditErrors({ ...editErrors, fullname: false, username: false, bio: false });
                setEditProfile({
                    fullname: props.validate?.data?.fullname,
                    username: props.validate?.data?.username,
                    bio: props.validate?.data?.bio,
                    visibility: props.validate?.data?.profileVisible
                });
            } else if (data.success == false && data.error.error == "auth/username-already-in-use") {
                setEditErrors({ fullname: false, username: "This username is already in use.", bio: false });
                return;
            } else if (data.success == false && data.error.error == "auth/username-too-long") {
                setEditErrors({ fullname: false, username: "I see what you are doing. You cant have a long username, sorry.", bio: false });
                return;
            } else if (data.success == false && data.error.error == "auth/username-too-short") {
                setEditErrors({ fullname: false, username: "Im really sorry. You cant get the username 'a' or 'b', please enter a username that has min 3 length.", bio: false });
                return;
            }
        } else {
            setEditingProfile(false);
            setEditErrors({ ...editErrors, fullname: false, username: false, bio: false });
            setEditProfile({
                fullname: props.validate?.data?.fullname,
                username: props.validate?.data?.username,
                bio: props.validate?.data?.bio,
                visibility: props.validate?.data?.profileVisible
            });
        }
    }

    const onAvatarEditChange = async (e) => {
        if (e.target.files[0]) {
            if (e.target.files[0].type == "image/jpeg" || e.target.files[0].type == "image/png" || e.target.files[0].type == "image/jpg") {
                setEditAvatarLoading(true);
                const res = await auth.users.uploadAvatar({ avatar: e.target.files[0], uid: auth?.authUser?.uid });
                if (res.success) {
                    setEditAvatarLoading(false);
                    setEditingProfile(false);
                    setEditErrors({ ...editErrors, fullname: false, username: false, bio: false });
                    setEditProfile({
                        fullname: props.validate?.data?.fullname,
                        username: props.validate?.data?.username,
                        bio: props.validate?.data?.bio,
                        visibility: props.validate?.data?.profileVisible
                    });
                    router.replace(`/profile/${editProfile.username}`);
                } else {
                    console.log("avatar upload error: ", res);
                    setEditAvatarLoading(false);
                }
            } else {
                alert("only png, jpeg and jpg is allowed");
            }
        }
    }

    return (<Container xl css={{ position: "relative", padding: 0 }}>
        <Head>
            <title>{props.profile?.success == true ? props.profile?.data?.username + "'s profile" : "Not Found"}</title>
            <meta name="description" content="Notal" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar user={props.validate?.data} />
        <Spacer y={2} />
        {loadingProfile ? <Card css={{ p: 12, dflex: "center" }}>
            <Loading />
            <Text css={{ mt: 24, fs: "1.4em" }}>Loading Profile...</Text>
        </Card> : props.profile?.success == false && props.profile?.error == "cant-find-user" ? <Container sm css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
            <Card css={{ textAlign: "center", dflex: "center", py: 32 }}>
                <img
                    src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
                    alt="Michael Scott"
                    style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
                />
                <Text h1>[404]</Text>
                <Text h3 css={{ textAlign: "center" }}>We couldnt find this user.</Text>
                <Button
                    icon={<HomeFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => router.replace("/home")}
                    css={{ mt: 18 }}
                    size="xl"
                    color="gradient"
                >
                    Home
                </Button>
                <Button
                    icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => router.back()}
                    css={{ mt: 18 }}
                    size="xl"
                    color="gradient"
                >
                    Back
                </Button>
            </Card>
        </Container> : <Container sm>
            <Card>
                <Grid.Container gap={1}>
                    <Grid xs={12} sm={12} md={2} lg={2} xl={2} justify="center" css={{ fd: "column", alignItems: "center", }}>
                        <Avatar bordered color="gradient" src={props.profile?.data?.avatar ?? ""} referrerPolicy='no-refferer' icon={<UserIcon size={12} style={{ fill: "white", transform: "scale(3)" }} />} size="xl" css={{ size: "128px", minWidth: 124 }} />
                        {editingProfile && <Button size="xs"
                            clickable={!editAvatarLoading}
                            onClick={() => {
                                if (!editAvatarLoading) avatarInputRef.current.click();
                            }}>
                            {editAvatarLoading ? <Loading color="white" size="xs" /> : <>Change Avatar<input type="file" ref={avatarInputRef} style={{ display: "none" }} onChange={onAvatarEditChange} accept="image/png, image/jpeg" /></>}
                        </Button>}
                    </Grid>
                    <Grid xs={12} sm={12} md={10} lg={10} xl={10} css={{ fd: "column", "@mdMax": { alignItems: "center" } }}>
                        {editingProfile ? <Input
                            color="primary"
                            labelLeft={<UserIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                            placeholder='Fullname'
                            value={editProfile.fullname}
                            bordered
                            fullWidth
                            onChange={e => setEditProfile({ ...editProfile, fullname: e.target.value })}
                            maxLength={32}
                            clearable
                        /> : <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Text h3 style={{ alignItems: "center" }} >
                                {props.profile.data?.fullname ? props.profile.data?.fullname : "@" + props.profile.data?.username}
                            </Text>
                            {props.profile.data?.profileVisible || <LockIcon height={24} width={24} style={{ fill: "currentColor", marginLeft: 8 }} />}
                        </div>}

                        {editErrors.fullname != false && <Text color={"$error"}>{editErrors.fullname}</Text>}

                        {editingProfile ? <Input
                            color="primary"
                            labelLeft={<AtIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                            placeholder='Username'
                            value={editProfile.username}
                            bordered
                            css={{ mt: 16 }}
                            fullWidth
                            onChange={e => setEditProfile({ ...editProfile, username: e.target.value.replace(/[^\w\s]/gi, "").replace(/\s/g, '').toLowerCase() })}
                            maxLength={20}
                        /> : props.profile.data.fullname && <Text css={{ fs: "1.2em", fontWeight: "600" }}>@{props.profile.data.username}</Text>}

                        {editErrors.username != false && <Text color={"$error"}>{editErrors.username}</Text>}

                        {((auth?.authUser?.uid == props.profile?.data?.uid) && !editingProfile) && <Button
                            size={"lg"}
                            css={{ width: "50%", mt: 16, mw: 300 }}
                            icon={<EditIcon height={24} width={24} fill={"currentColor"} />}
                            onClick={() => setEditingProfile(true)}
                            ghost
                        >
                            Edit Profile
                        </Button>}
                    </Grid>
                    {(props.profile?.data?.bio || editingProfile) && <Grid xs={12}>
                        <Row css={{ mt: 12 }}>
                            <Card css={{ bg: "$gradient" }}>
                                <Grid.Container gap={editingProfile ? 1 : 0}>
                                    <Grid xs={12} md={editingProfile ? 6 : 12} css={{ whiteSpace: "pre-line", maxH: 200, fd: "column" }}>
                                        <Text h4 css={{ color: "$white" }}>Biography</Text>
                                        <Spacer y={0.5} />
                                        {editingProfile ?
                                            <Textarea
                                                css={{ minWidth: "100%", }}
                                                placeholder="Enter your biography. You can also leave this empty."
                                                onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                                                value={editProfile.bio}
                                                maxLength={200}
                                                maxRows={4}
                                                animated={false}
                                            /> :
                                            <Text css={{ color: "$white", overflowWrap: "anywhere" }}>{props.profile?.data?.bio}</Text>}
                                    </Grid>
                                    <Grid xs={editingProfile ? 12 : 0} md={editingProfile ? 6 : 0} css={{ fd: "column" }}>
                                        <Text h4 css={{ color: "$white" }}>Profile Visibility</Text>
                                        <Spacer y={0.5} />
                                        <Card css={{ backgroundColor: isDark ? "$gray900" : "$background", justifyContent: "center", height: "100%" }}>
                                            <Row>
                                                <Switch
                                                    checked={editProfile.visibility}
                                                    onChange={e => setEditProfile({ ...editProfile, visibility: e.target.checked })}
                                                    size="lg"
                                                    iconOn={<VisibleIcon height={24} width={24} fill={"currentColor"} />}
                                                    iconOff={<VisibleOffIcon height={24} width={24} fill={"currentColor"} />}
                                                />
                                                <Text css={{ fs: "1.2em", fontWeight: "500", ml: 8 }}>
                                                    {editProfile.visibility ? "Your profile is public." : "Your profile is private."}
                                                </Text>
                                            </Row>
                                        </Card>
                                    </Grid>
                                </Grid.Container>
                            </Card>
                        </Row>
                    </Grid>}
                    {((auth?.authUser?.uid == props.profile?.data?.uid) && editingProfile) && <Grid xs={12}>
                        <Row css={{ mt: 12, justifyContent: "space-between" }}>
                            <Button
                                size={"lg"}
                                icon={<CrossIcon height={24} width={24} fill={"currentColor"} />}
                                css={{ width: "49%", minWidth: 100 }}
                                onClick={() => {
                                    setEditingProfile(false);
                                    setEditErrors({ ...editErrors, fullname: false, username: false, bio: false });
                                    setEditProfile({
                                        fullname: props.validate?.data?.fullname,
                                        username: props.validate?.data?.username,
                                        bio: props.validate?.data?.bio,
                                        visibility: props.validate?.data?.profileVisible
                                    });
                                }}
                                ghost
                            >
                                Cancel
                            </Button>
                            <Button
                                size={"lg"}
                                icon={<CheckIcon height={24} width={24} fill={"currentColor"} />}
                                css={{ width: "49%", minWidth: 100 }}
                                onClick={onFinishEditing}
                            >
                                Edit
                            </Button>
                        </Row>
                    </Grid>}
                </Grid.Container>
            </Card>
            <Spacer y={1} />
            {/*<Card>
                <Text>asdksaj</Text>
            </Card>*/}
        </Container>}
    </Container >)
}

export default Profile;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let profile = {};

    const queryUsername = query?.username;

    if (req) {
        const authCookie = req.cookies.auth;
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
            if (data.success) {
                validate = { ...data };
            } else {
                validate = { error: data.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate, profile } }
}