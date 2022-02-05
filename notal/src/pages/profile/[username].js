import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Switch, useTheme, Input, Row, Avatar, Textarea, Loading, Link as ALink, Tooltip, Modal, useInput } from '@nextui-org/react';

import useAuth from '../../hooks/auth';

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
import DashboardIcon from '../../../public/icons/dashboard.svg';
import GithubIcon from '../../../public/icons/github_2.svg';
import WebsiteIcon from '../../../public/icons/website.svg';
import TwitterIcon from '../../../public/icons/twitter.svg';
import InstagramIcon from '../../../public/icons/instagram.svg';
import CakeIcon from '../../../public/icons/cake.svg';
import LinkIcon from '../../../public/icons/link.svg';
import StarFilledIcon from '../../../public/icons/star_filled.svg';

import { CheckToken, GetProfile, ValidateToken } from '../../utils';

import Navbar from '../../components/navbar';
import EditLinksModal from '../../components/modals/editLinks';

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

        /*console.log("website: ", links?.website != props.profile?.data?.links?.website);
        console.log("instagram: ", links?.instagram != props.profile?.data?.links?.instagram);
        console.log("github: ", links?.github != props.profile?.data?.links?.github);
        console.log("twitter: ", links?.twitter != props.profile?.data?.links?.twitter);
        console.log("twitter: ", links?.twitter, " propTwitter:", props.profile?.data?.links?.twitter);*/

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
        </Container> : <Container sm css={{ pb: 24 }}>
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
                    <Grid.Container>
                        <Grid xs={12} css={{ fd: "column", }}>
                            {props.profile?.data?.links && (props.profile?.data?.links?.twitter.length != 0
                                || props.profile?.data?.links?.github.length != 0
                                || props.profile?.data?.links?.instagram.length != 0
                                || props.profile?.data?.links?.website.length != 0) && <Row css={{ justifyContent: "flex-end", pt: 0, pb: 0, "@mdMax": { justifyContent: "center", pt: 20, pb: 12, }, alignItems: "flex-start" }}>
                                    {props.profile?.data?.links?.twitter.length != 0 && <Tooltip content="Twitter">
                                        <Link href={"https://twitter.com/" + props.profile?.data?.links?.twitter ?? ""} passHref>
                                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                                <TwitterIcon height={24} width={24} fill={"currentColor"} />
                                            </ALink>
                                        </Link>
                                    </Tooltip>}
                                    {props.profile?.data?.links?.github.length != 0 && <Tooltip content="GitHub">
                                        <Link href={"https://github.com/" + props.profile?.data?.links?.github ?? ""} passHref>
                                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                                <GithubIcon height={24} width={24} fill={"currentColor"} />
                                            </ALink>
                                        </Link>
                                    </Tooltip>}
                                    {props.profile?.data?.links?.instagram.length != 0 && <Tooltip content="Instagram">
                                        <Link href={"https://instagram.com/" + props.profile?.data?.links?.instagram ?? ""} passHref>
                                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                                <InstagramIcon height={24} width={24} fill={"currentColor"} />
                                            </ALink>
                                        </Link>
                                    </Tooltip>}
                                    {props.profile?.data?.links?.website.length != 0 && <Tooltip content={props.profile?.data?.links?.website}>
                                        <Link href={"https://" + props.profile?.data?.links?.website + "?utm_source=notalapp"} passHref target="_blank">
                                            <ALink css={{ color: "currentColor", padding: 8, pr: 8, "@md": { pr: 0 } }} target="_blank">
                                                <WebsiteIcon height={24} width={24} fill={"currentColor"} />
                                            </ALink>
                                        </Link>
                                    </Tooltip>}
                                </Row>}
                            <Row css={{ justifyContent: "flex-end", pt: 8, pb: 0, fill: "$gray500", "@mdMax": { justifyContent: "center", pt: 12, pb: 12, }, alignItems: "flex-start" }}>
                                <CakeIcon height={24} width={24} style={{ transform: "scale(0.8)" }} />
                                <Text css={{ ml: 4, fs: "1em", color: "$gray500", fontWeight: "600" }}>
                                    {`Joined 
                                    ${new Date(props.profile?.data?.createdAt).getDate()} 
                                    ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(props.profile?.data?.createdAt).getMonth()]},
                                    ${new Date(props.profile?.data?.createdAt).getFullYear()}
                                    `}
                                </Text>
                            </Row>
                        </Grid>
                    </Grid.Container>
                </Grid>

                {(props.profile?.data?.bio || editingProfile) && <Grid xs={12} css={{ mt: 18, p: 0 }}>
                    <Card bordered>
                        <Grid.Container gap={editingProfile ? 1 : 0}>
                            <Grid xs={12} md={editingProfile ? 6 : 12} css={{ whiteSpace: "pre-line", maxH: 200, fd: "column" }}>
                                <Text h4>Biography</Text>
                                <Spacer y={0.5} />
                                {editingProfile ?
                                    <Textarea
                                        css={{ minWidth: "100%" }}
                                        placeholder="Enter your biography. You can also leave this empty."
                                        onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                                        value={editProfile.bio}
                                        maxLength={200}
                                        maxRows={4}
                                        animated={false}
                                    />
                                    :
                                    <Text css={{ overflowWrap: "anywhere", fs: "1.1em" }}>{props.profile?.data?.bio}</Text>}
                            </Grid>
                            <Grid xs={editingProfile ? 12 : 0} md={editingProfile ? 6 : 0} css={{ fd: "column" }}>
                                <Text h4>Profile Visibility</Text>
                                <Spacer y={0.5} />
                                <Card css={{ backgroundColor: isDark ? "#1c1c1c" : "$background", justifyContent: "center", height: "100%" }} shadow={false}>
                                    <Row>
                                        <Switch
                                            checked={editProfile.visibility}
                                            onChange={e => setEditProfile({ ...editProfile, visibility: e.target.checked })}
                                            size="lg"
                                            iconOn={<VisibleIcon height={24} width={24} fill={"currentColor"} />}
                                            iconOff={<VisibleOffIcon height={24} width={24} fill={"currentColor"} />}
                                        />
                                        <Text css={{ fs: "1.2em", fontWeight: "500", ml: 8 }}>
                                            {editProfile.visibility ? "Your profile is visible to public." : "Your profile is private."}
                                        </Text>
                                    </Row>
                                </Card>
                            </Grid>
                        </Grid.Container>
                    </Card>
                </Grid>}

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
                        <div style={{ width: "100%", height: "100%" }}>
                            <Grid.Container gap={1} css={{ padding: 0 }}>
                                {props.profile?.data?.workspaces && props.profile?.data?.workspaces != "user-profile-private" ? props.profile.data.workspaces.map((workspace, index) => {
                                    return (<Grid xs={12} sm={4} lg={3} key={workspace._id}>
                                        <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`} passHref>
                                            <Card color={'gradient'} css={{ height: 140, justifyContent: "flex-end", }} clickable>
                                                <Grid.Container>
                                                    <Grid xs={10} css={{ fd: "column" }}>
                                                        <ALink>
                                                            <Text h3 color={"white"}>{workspace.title}</Text>
                                                        </ALink>
                                                        <ALink>
                                                            <Text h6 color={"white"}>{workspace.desc}</Text>
                                                        </ALink>
                                                    </Grid>
                                                    {(!workspace?.workspaceVisible || workspace?.starred) && <Grid xs={2} css={{ fd: "column" }} alignItems='flex-end' justify='flex-end'>
                                                        {!workspace?.workspaceVisible && <Tooltip content="This workspace is set to private." css={{ pointerEvents: "none" }}>
                                                            <VisibleOffIcon height={24} width={24} fill={"currentColor"} />
                                                        </Tooltip>}
                                                        {workspace?.starred && <Tooltip content={`Added to favorites`} css={{ pointerEvents: "none" }}>
                                                            <StarFilledIcon height={24} width={24} fill={"currentColor"} />
                                                        </Tooltip>}
                                                    </Grid>}
                                                </Grid.Container>
                                            </Card>
                                        </Link>
                                    </Grid>)
                                }) : <Text>This user has no workspaces</Text>}
                            </Grid.Container>
                        </div>
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

        validate = await ValidateToken({ token: authCookie });
        profile = await GetProfile({ username: queryUsername, token: authCookie })
    }
    return { props: { validate, profile } }
}