import { Avatar, Card, Container, Grid, Loading, Spacer, Text, Row, Button } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
//import Confetti from 'react-confetti'; // :)
import styled from 'styled-components';

import addworkspacebanner from '../../public/addfieldbanner.png';

import {
    AddIcon,
    BookmarkIcon,
    DashboardIcon,
    StarFilledIcon,
    VisibleOffIcon
} from '@icons';

import {
    AcceptCookies,
    AddWorkspaceModal,
    DeleteWorkspaceModal,
    HomeNav,
    HomeWorkspaceCard,
    Navbar,
} from '@components';

import useAuth from '@hooks/auth';

import {
    CheckToken,
    GetWorkspaces,
    ValidateToken,
    WorkboxInit
} from '@utils';

import { withAuth } from '@hooks/route';

const StyledNavLeft = styled.a`
    width: 100%;
    height: 44px;
    background-color: red;
    margin-bottom: 8px;
`

const Home = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const client = (typeof window === 'undefined') ? false : true;

    const [homeViewing, setHomeViewing] = useState("workspaces");

    // View/Filter
    const [workspaceViewing, setWorkspaceViewing] = useState("workspaces");
    const [filter, setFilter] = useState(null);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState({ workspace: -1, visible: false });

    // Add Workspace Modal
    const [newWorkspaceVisible, setNewWorkspaceVisible] = useState(false);

    const [_workspaces, _setWorkspaces] = useState([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

    useEffect(() => {
        switch (workspaceViewing) {
            case "favorites":
                setFilter("favorites");
                break;
            case "privateWorkspaces":
                setFilter("privateWorkspaces");
                break;
            default:
                setFilter(null);
                break;
        }
    }, [workspaceViewing]);

    useEffect(() => {
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
        if (props.workspaces?.success == true) {
            _setWorkspaces(props.workspaces.data);
            setLoadingWorkspaces(false);
        }
    }, [props.workspaces]);

    const workspace = {
        create: async ({ title, desc, starred }) => {
            const newWorkspaces = _workspaces;
            newWorkspaces.push({ title, desc, starred, createdAt: Date.now(), workspaceVisible: false });
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.createWorkspace({ title, desc, starred, workspaceVisible: false });

            const authCookie = Cookies.get("auth");
            const workspaces = await GetWorkspaces({ uid: props.validate?.uid, token: authCookie });
            _setWorkspaces([...workspaces.data]);
        },
        delete: async ({ id }) => {
            setDeleteModal({ visible: false, workspace: -1 }); // set visiblity to false and id to -1

            const newWorkspaces = _workspaces;
            newWorkspaces.splice(_workspaces.findIndex(el => el._id == id), 1);
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.deleteWorkspace({ id });
        },
        star: async ({ id }) => {
            const newWorkspaces = _workspaces;
            const workspaceIndex = newWorkspaces.findIndex(el => el._id == id)
            newWorkspaces[workspaceIndex].starred = !newWorkspaces[workspaceIndex].starred;
            _setWorkspaces([...newWorkspaces]);

            const data = await auth.workspace.starWorkspace({ id });
            if (data?.error) console.error("error on star workspace: ", data.error);
        },
        closeModal: () => {
            setNewWorkspaceVisible(false);
            setNewWorkspaceErr({ ...newWorkspace, desc: false, title: false });
            setNewWorkspace({ ...newWorkspace, title: "", desc: "", starred: "" });
        },
        getWorkspacesWithFilter: (workspaces) => {
            switch (filter) {
                case "favorites":
                    if (workspaces) return workspaces.filter(el => el.starred == true);
                    else return []
                case "privateWorkspaces":
                    if (workspaces) return workspaces.filter(el => !!el?.workspaceVisible == false);
                    else return []
                default:
                    if (workspaces) return workspaces;
                    else return []
            }
        }
    }

    return (<Container xl css={{ position: "relative", padding: 0, overflowX: "hidden" }}>
        <Head>
            <title>Home · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props.validate?.data} />

        <div style={{ display: "flex", flexDirection: "row", flex: 1, backgroundColor: "Orange" }}>
            <div style={{ display: "flex", minWidth: 280, flexDirection: "column", backgroundColor: "blue", height: "100%", paddingTop: 12, marginRight: 16 }}>
                <StyledNavLeft>
                    asdasd
                </StyledNavLeft>
                <StyledNavLeft>
                    asdasd
                </StyledNavLeft>
            </div>
            <Grid.Container gap={2} css={{ pl: 0 }}>
                <Grid xs={12}>
                    <Card css={{ jc: "center", borderRadius: 0, height: "100%" }}>
                        {loadingWorkspaces ? <Card css={{ p: 12, dflex: "center" }}>
                            <Loading />
                            <Text css={{ mt: 24, fs: "1.4em" }}>Loading Workspaces...</Text>
                        </Card> : <Grid.Container gap={1}>
                            <HomeNav viewing={workspaceViewing} onViewChange={(viewingName) => setWorkspaceViewing(viewingName)} />
                            <Spacer y={1} />
                            <Grid xs={12}>
                                <Avatar
                                    squared
                                    icon={workspaceViewing == "favorites" ? <StarFilledIcon size={20} fill="currentColor" /> : workspaceViewing == "privateWorkspaces" ? <VisibleOffIcon width={20} height={20} fill="currentColor" /> : <DashboardIcon size={20} fill="currentColor" />}
                                />
                                <Spacer x={0.5} />
                                <Text h3>{workspaceViewing == "favorites" ? "Favorite Workspaces" : workspaceViewing == "privateWorkspaces" ? "Private Workspaces" : "Your Workspaces"}</Text>
                            </Grid>
                            {workspace.getWorkspacesWithFilter(_workspaces).length > 0 ?
                                workspace.getWorkspacesWithFilter(_workspaces).map((workspaceItem, index) => <Grid xs={12} sm={4} lg={2} key={workspaceItem._id ?? index}>
                                    <HomeWorkspaceCard
                                        workspace={workspaceItem}
                                        onDeleteClick={() => setDeleteModal({ ...deleteModal, visible: true, workspace: workspaceItem._id })}
                                        onStarClick={() => workspace.star({ id: workspaceItem._id })}
                                    />
                                </Grid>) : <Grid xs={12} sm={4} lg={2}>
                                    <Card
                                        bordered
                                        shadow={false}
                                        css={{ dflex: "center", height: 140, borderColor: "$accents4" }}
                                        onClick={() => setNewWorkspaceVisible(true)}
                                    >
                                        <Image src={addworkspacebanner} style={{ zIndex: 50 }} width={64} height={64} placeholder="blur" objectFit='contain' priority={true} />
                                        <Text h6 css={{ color: "$accents4" }}>No workspaces found.</Text>
                                    </Card>
                                </Grid>}
                            <Grid xs={12} sm={4} lg={2}>
                                <Card
                                    bordered
                                    css={{ borderColor: "$primary", dflex: "center", color: "$primary", height: 140, }}
                                    clickable
                                    onClick={() => setNewWorkspaceVisible(true)}
                                >
                                    <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
                                    Add Workspace
                                </Card>
                            </Grid>
                        </Grid.Container>}
                    </Card>
                </Grid>
                {/*<Grid xs={12}>
                    <Card>
                        <Grid.Container>
                            <Grid xs={12}>
                                <Avatar
                                    squared
                                    icon={<BookmarkIcon size={20} fill="currentColor" />}
                                />
                                <Spacer x={0.5} />
                                <Text h3>Bookmarks</Text>
                            </Grid>
                        </Grid.Container>
                    </Card>
                            </Grid>*/}
            </Grid.Container>
        </div>

        <DeleteWorkspaceModal
            visible={deleteModal.visible}
            onClose={() => setDeleteModal({ ...deleteModal, visible: false })}
            onDelete={() => {
                setDeleteModal({ ...deleteModal, visible: false });
                workspace.delete({ id: deleteModal.workspace })
            }}
        />
        <AddWorkspaceModal
            setNewWorkspaceVisible={setNewWorkspaceVisible}
            newWorkspaceVisible={newWorkspaceVisible}
            onAdd={({ title, desc, starred }) => workspace.create({ title, desc, starred })}
        />
        {Cookies.get('cookies') != "true" && <AcceptCookies
            style={{ position: "fixed" }}
            visible={Cookies.get('cookies') != "true"}
            onAccept={() => {
                Cookies.set('cookies', 'true');
                router.replace(router.asPath);
            }}
        />}
    </Container>
    )
}

export default withAuth(Home);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspaces = {};

    if (req) {
        const authCookie = req.cookies.auth;

        validate = await ValidateToken({ token: authCookie });
        console.log("validate:", validate);
        workspaces = await GetWorkspaces({ uid: validate?.data?.uid, token: authCookie });
    }
    return { props: { validate, workspaces } }
}