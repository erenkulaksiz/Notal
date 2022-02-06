import { Avatar, Button, Card, Container, Grid, Input, Loading, Row, Spacer, Text, useTheme } from '@nextui-org/react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';

import useAuth from '../../hooks/auth';

import {
    EditIcon,
    CrossIcon,
    CheckIcon,
    UserIcon,
    AtIcon,
    DashboardIcon,
    LinkIcon,
    LockOutlineIcon
} from '../../icons';

import {
    CheckToken,
    GetProfile,
    ValidateToken,
    WorkboxInit
} from '../../utils';

import {
    AcceptCookies,
    EditLinksModal,
    Navbar,
    Profile404,
    ProfileBio,
    ProfileDetails,
    ProfileWorkspaceCard
} from '../../components';

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
    const [editingLinks, setEditingLinks] = useState(false);

    useEffect(() => {
        // reload page when logout
        console.log("Reload! /pages/profile/[username].js");
        setTimeout(() => {
            router.replace(router.asPath);
        }, 1000);
    }, [auth.authUser]);

    useEffect(() => {
        console.log("props on profile: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token, props });
            if (!res) {
                router.replace(router.asPath);
            }
        })();

        WorkboxInit();
    }, []);

    useEffect(() => {
        if (!auth.authUser) {
            setEditingProfile(false);
        }
    }, [auth.authUser]);

    useEffect(() => {
        if ((props.profile?.success == true) || (props.profile?.success == false && props.profile?.error == "cant-find-user")) {
            setLoadingProfile(false);
            setEditProfile({
                fullname: props.validate?.data?.fullname,
                username: props.validate?.data?.username,
                bio: props.validate?.data?.bio,
                visibility: props.validate?.data?.profileVisible,
            });
        }
    }, [props.profile]);

    const onFinishEditing = async ({ links }) => {
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

        if (editProfile.fullname != props.validate?.data?.fullname
            || editProfile.username != props.validate?.data?.username
            || editProfile.bio != props.validate?.data?.bio
            || editProfile.visibility != props.validate?.data?.profileVisible
            || links?.website != props.profile?.data?.links?.website
            || links?.instagram != props.profile?.data?.links?.instagram
            || links?.github != props.profile?.data?.links?.github
            || links?.twitter != props.profile?.data?.links?.twitter
        ) {
            const data = await auth.users.editUser({
                uid: auth.authUser?.uid,
                fullname: editProfile.fullname,
                username: editProfile.username,
                bio: editProfile.bio,
                profileVisible: editProfile.visibility,
                links: {
                    website: links?.website,
                    instagram: links?.instagram,
                    github: links?.github,
                    twitter: links?.twitter
                }
            });
            if (data.success) {
                router.replace(`/profile/${editProfile.username}`);
                setEditingProfile(false);
                setEditErrors({ ...editErrors, fullname: false, username: false, bio: false });
                setEditProfile({
                    fullname: props.validate?.data?.fullname,
                    username: props.validate?.data?.username,
                    bio: props.validate?.data?.bio,
                    visibility: props.validate?.data?.profileVisible,
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
            <meta property='og:description' name='og:description' content={props.profile?.success ? props.profile?.data?.username + "'s profile" : "Not Found"} />
            <meta name='twitter:description' content={props.profile?.success ? props.profile?.data?.username + "'s profile" : "Not Found"} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar user={props.validate?.data} />
        <Spacer y={2} />
        {loadingProfile ? <Card css={{ p: 12, dflex: "center" }}>
            <Loading />
            <Text css={{ mt: 24, fs: "1.4em" }}>Loading Profile...</Text>
        </Card> : props.profile?.success == false && props.profile?.error == "cant-find-user" ? <Container sm css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
            <Profile404 />
        </Container> : <Container sm>
            <Grid.Container gap={1}>
                <Grid xs={12} sm={12} md={2} lg={2} xl={2} justify="center" css={{ fd: "column", alignItems: "center" }}>
                    <Avatar bordered color="gradient" src={props.profile?.data?.avatar ?? ""} referrerPolicy="no-refferer" icon={<UserIcon size={12} style={{ fill: "white", transform: "scale(3)" }} />} size="xl" css={{ size: "128px", minWidth: 124 }} />
                    {editingProfile && <Button size="xs"
                        clickable={!editAvatarLoading}
                        css={{ mt: 6 }}
                        onClick={() => {
                            if (!editAvatarLoading) avatarInputRef.current.click();
                        }}>
                        {editAvatarLoading ? <Loading color="white" size="xs" /> : <>Change Avatar<input type="file" ref={avatarInputRef} style={{ display: "none" }} onChange={onAvatarEditChange} accept="image/png, image/jpeg" /></>}
                    </Button>}
                </Grid>
                <Grid xs={12} sm={12} md={4} lg={4} xl={4} css={{ fd: "column", "@mdMax": { alignItems: "center" }, }}>
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
                            {props.profile.data?.fullname ? props.profile.data?.fullname : `@${props.profile.data?.username}`}
                        </Text>
                        {props.profile.data?.profileVisible || <LockOutlineIcon height={24} width={24} style={{ fill: "currentColor", marginLeft: 8 }} />}
                    </div>}

                    {editErrors.fullname != false && <Text color={"$error"}>{editErrors.fullname}</Text>}

                    {editingProfile ? <Input
                        color="primary"
                        labelLeft={<AtIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                        placeholder='Username'
                        value={editProfile.username}
                        bordered
                        fullWidth
                        css={{ mt: 16 }}
                        onChange={e => setEditProfile({ ...editProfile, username: e.target.value.replace(/[^\w\s]/gi, "").replace(/\s/g, '').toLowerCase() })}
                        maxLength={20}
                    /> : props.profile.data.fullname && <Text css={{ fs: "1.2em", fontWeight: "600" }}>@{props.profile.data.username}</Text>}

                    {editErrors.username != false && <Text color={"$error"}>{editErrors.username}</Text>}

                    {((auth?.authUser?.uid == props.profile?.data?.uid) && !editingProfile) && <Button
                        size={"lg"}
                        css={{ mt: 16, mw: 300 }}
                        icon={<EditIcon height={24} width={24} fill={"currentColor"} />}
                        onClick={() => setEditingProfile(true)}
                        ghost
                    >
                        Edit Profile
                    </Button>}

                    {editingProfile && <Button
                        size={"lg"}
                        css={{ mt: 16, }}
                        icon={<LinkIcon height={24} width={24} fill={"currentColor"} />}
                        onClick={() => setEditingLinks(true)}
                        ghost
                    >
                        Edit Social Links
                    </Button>}
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={6} xl={6} css={{ p: 0, }}>
                    <ProfileDetails links={props.profile?.data?.links} createdAt={props.profile?.data?.createdAt} />
                </Grid>

                {(props.profile?.data?.bio || editingProfile) && <ProfileBio
                    onBioChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                    bio={props.profile?.data?.bio}
                    bioText={editProfile.bio}
                    visibility={editProfile.visibility}
                    onVisibilityChange={(e) => setEditProfile({ ...editProfile, visibility: e.target.checked })}
                    editingProfile={editingProfile}
                />}

                {((auth?.authUser?.uid == props.profile?.data?.uid) && editingProfile) && <Grid xs={12} css={{ pl: 0, pr: 0 }}>
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
                            onClick={() => onFinishEditing({
                                links: {
                                    website: props.profile?.data?.links?.website ?? "",
                                    instagram: props.profile?.data?.links?.instagram ?? "",
                                    twitter: props.profile?.data?.links?.twitter ?? "",
                                    github: props.profile?.data?.links?.github ?? ""
                                }
                            })}
                        >
                            Edit
                        </Button>
                    </Row>
                </Grid>}
            </Grid.Container>
            <Spacer y={1} />

            {props.profile?.data?.workspaces != "user-profile-private" ? editingProfile ? null : props.profile?.data?.workspaces.length > 0 && <Card bordered>
                <Grid.Container gap={1}>
                    <Grid xs={12}>
                        <Avatar
                            squared
                            icon={<DashboardIcon size={20} fill="currentColor" />}
                        />
                        <Spacer x={0.5} />
                        <Text h3>{props.profile.data?.fullname ? props.profile.data?.fullname + "'s Workspaces" : "@" + props.profile.data?.username + "'s Workspaces"}</Text>
                    </Grid>
                    <Grid xs={12}>
                        <Grid.Container gap={1} css={{ padding: 0 }}>
                            {props.profile?.data?.workspaces && props.profile?.data?.workspaces != "user-profile-private" ?
                                props.profile.data.workspaces.map(workspace => <ProfileWorkspaceCard key={workspace._id} workspace={workspace} />)
                                : <Text>This user has no workspaces</Text>}
                        </Grid.Container>
                    </Grid>
                </Grid.Container>
            </Card> : <Card css={{ padding: 24 }}>
                <Text css={{ fs: "1.6em" }}>
                    {props.profile.data?.fullname ? props.profile.data?.fullname + "'s profile is set to private." : "@" + props.profile.data?.username + "'s profile is set to private."}
                </Text>
            </Card>}
        </Container>}
        <EditLinksModal
            visible={editingLinks}
            onClose={() => setEditingLinks(false)}
            links={{
                website: props.profile?.data?.links?.website ?? "",
                instagram: props.profile?.data?.links?.instagram ?? "",
                twitter: props.profile?.data?.links?.twitter ?? "",
                github: props.profile?.data?.links?.github ?? "",
            }}
            onEdit={({ website, instagram, twitter, github }) => {
                setEditingLinks(false);
                onFinishEditing({ links: { website, instagram, github, twitter } });
            }}
        />
        {Cookies.get('cookies') != "true" && <AcceptCookies
            style={{ position: "fixed" }}
            visible={Cookies.get('cookies') != "true"}
            onAccept={() => {
                Cookies.set('cookies', 'true');
                router.replace(router.asPath);
            }}
        />}
    </Container>)
}

export default Profile;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let profile = {};

    const queryUsername = query?.username;

    if (req) {
        const authCookie = req.cookies.auth;

        validate = await ValidateToken({ token: authCookie });
        profile = await GetProfile({ username: queryUsername, token: authCookie })
    }
    return { props: { validate, profile } }
}