import { Avatar, Card, Container, Grid, Loading, Spacer, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Link from 'next/link';
//import Confetti from 'react-confetti'; // :)

import {
    AddIcon,
    BookmarkIcon,
    UserIcon
} from '../icons';

import {
    AcceptCookies,
    AddWorkspaceModal,
    DeleteWorkspaceModal,
    HomeSideNav,
    HomeWorkspaceCard,
    Navbar,
} from '../components';

import { withAuth } from '../hooks/route';

import {
    CheckToken,
    GetWorkspaces,
    ValidateToken,
    WorkboxInit
} from '../utils';

const Home = (props) => {
    //const auth = useAuth();
    const router = useRouter();
    const { auth } = props;

    // View/Filter
    const [viewing, setViewing] = useState("workspaces");
    const [filter, setFilter] = useState(null);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState({ workspace: -1, visible: false });

    // Add Workspace Modal
    const [newWorkspaceVisible, setNewWorkspaceVisible] = useState(false);

    const [_workspaces, _setWorkspaces] = useState([]);
    const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

    useEffect(() => {
        if (viewing == "favorites") {
            setFilter("favorites");
        } else {
            setFilter(null);
        }
    }, [viewing]);

    useEffect(() => {
        if (viewing == "favorites") {
            setFilter("favorites");
        } else {
            setFilter(null);
        }
    }, [viewing]);

    useEffect(() => {
        console.log("props home: ", props);

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
        if (props.workspaces?.success == true) {
            _setWorkspaces(props.workspaces.data);
            setLoadingWorkspaces(false);
        }
    }, [props.workspaces]);

    const workspace = {
        create: async ({ title, desc, starred }) => {
            const data = await auth.workspace.createWorkspace({ title, desc, starred, workspaceVisible: false });

            console.log("data: ", data);

            if (data?.success) {
                router.replace(router.asPath);
            }
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
            if (filter == "favorites") {
                if (workspaces) return workspaces.filter(el => el.starred == true);
                else return []
            } else {
                // no filter
                if (workspaces) return workspaces;
                else return []
            }
        }
    }

    return (<Container xl css={{ position: "relative", padding: 0, overflowX: "hidden" }}>
        <Head>
            <title>Home · Notal</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        <Grid.Container gap={2}>

            <Grid xs={12}>
                <Card css={{ jc: "center" }}>
                    {loadingWorkspaces ? <Card css={{ p: 12, dflex: "center" }}>
                        <Loading />
                        <Text css={{ mt: 24, fs: "1.4em" }}>Loading Workspaces...</Text>
                    </Card> : <Grid.Container gap={1}>
                        <HomeSideNav viewing={viewing} onViewChange={(viewingName) => setViewing(viewingName)} />
                        <Grid xs={12}>
                            <Avatar
                                squared
                                icon={<UserIcon size={20} fill="currentColor" />}
                            />
                            <Spacer x={0.5} />
                            <Text h3>{viewing == "favorites" ? "Favorite Workspaces" : "Workspaces"}</Text>
                        </Grid>
                        {workspace.getWorkspacesWithFilter(_workspaces).length > 0 ?
                            workspace.getWorkspacesWithFilter(_workspaces).map(workspaceItem => <HomeWorkspaceCard
                                key={workspaceItem._id}
                                workspace={workspaceItem}
                                onDeleteClick={() => setDeleteModal({ ...deleteModal, visible: true, workspace: workspaceItem._id })}
                                onStarClick={() => workspace.star({ id: workspaceItem._id })}
                            />) : null}
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
            <Grid xs={12}>
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
            </Grid>
        </Grid.Container>
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
        workspaces = await GetWorkspaces({ uid: validate?.data?.uid, token: authCookie });
    }
    return { props: { validate, workspaces } }
}