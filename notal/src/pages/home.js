import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Spacer, Container, Text, Grid, Card, Link as ALink, Loading, Avatar } from '@nextui-org/react';
//import Confetti from 'react-confetti'; // :)

import { server } from '../config';

import DashboardIcon from '../../public/icons/dashboard.svg';
import StarOutlineIcon from '../../public/icons/star_outline.svg';
import StarFilledIcon from '../../public/icons/star_filled.svg';
import AddIcon from '../../public/icons/add.svg';
import DeleteIcon from '../../public/icons/delete.svg';
import UserIcon from '../../public/icons/user.svg';

import AddWorkspaceModal from '../components/modals/addWorkspace';
import DeleteWorkspaceModal from '../components/modals/deleteWorkspace';
import Navbar from '../components/navbar';

import { withAuth } from '../hooks/route';
import useAuth from '../hooks/auth';
import { CheckToken } from '../utils';

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
    }, []);

    useEffect(() => {
        if (props.workspaces?.success == true) {
            _setWorkspaces(props.workspaces.data);
            setLoadingWorkspaces(false);
        }
    }, [props.workspaces]);

    const workspace = {
        create: async ({ title, desc, starred }) => {

            const data = await auth.workspace.createWorkspace({ title, desc, starred });

            console.log("data: ", data);

            if (data?.success) {
                router.replace(router.asPath);
            }
        },
        delete: async ({ id }) => {
            setDeleteModal({ visible: false, workspace: -1 }); // set visiblity to false and id to -1

            const data = await auth.workspace.deleteWorkspace({ id });

            if (data.success) {
                router.replace(router.asPath);
            }
        },
        star: async ({ id }) => {
            const data = await auth.workspace.starWorkspace({ id });
            if (data?.error) console.error("error on star workspace: ", data.error);
            //#TODO: make this work immideatly
            if (data.success) {
                router.replace(router.asPath);
            }
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

    return (<Container xl css={{ position: "relative", padding: 0 }}>
        <Head>
            <title>Home · Notal</title>
            <meta name="description" content="Notal. The next generation taking notes and sharing todo snippets platform." />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Navbar user={props.validate?.data} />

        <Grid.Container gap={2} justify="center">
            <Grid xs={12} sm={3} md={3} css={{ fd: "column" }}>
                <Button
                    icon={<DashboardIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => setViewing("workspaces")}
                    css={{ minWidth: "100%" }}
                    bordered={viewing != "workspaces"}
                >
                    Workspaces
                </Button>
                <Spacer y={1} />
                <Button
                    icon={<StarFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                    onClick={() => setViewing("favorites")}
                    css={{ minWidth: "100%" }}
                    bordered={viewing != "favorites"}
                >
                    Favorites
                </Button>
            </Grid>
            <Grid xs={12} sm={9} md={9}>
                <Card css={{ jc: "center", minHeight: 80 }}>
                    {/*<Grid.Container>
                        <Grid xs alignItems='center' css={{ fd: "row" }}>
                        <UserIcon height={24} width={24} style={{ fill: "currentColor", }} />
                        <Text span>Your Workspaces</Text>
                        </Grid>
                    </Grid.Container>*/}
                    <Grid.Container gap={1}>
                        {/*<Grid xs={12} sm={6} md={3}>
                                <Button auto css={{ width: "100%" }} onClick={() => setNewWorkspaceVisible(true)}>
                                    <AddIcon height={24} width={24} style={{ fill: "currentColor" }} />
                                    Add Workspace
                                </Button>
                                </Grid>
                                <Grid xs={12} sm={6} md={3}>
                                    <Button auto css={{ width: "100%" }} onClick={() => setDeleteModal({ ...deleteModal, visible: false })}>
                                        <QuestionIcon height={24} width={24} style={{ fill: "currentColor" }} />
                                        About
                                    </Button>
                        </Grid>*/}
                    </Grid.Container>
                </Card>
            </Grid>
            <Grid xs={12}>
                <Card css={{ jc: "center" }}>
                    {loadingWorkspaces ? <Card css={{ p: 12, dflex: "center" }}>
                        <Loading />
                        <Text css={{ mt: 24, fs: "1.4em" }}>Loading Workspaces...</Text>
                    </Card> : <Grid.Container gap={1}>
                        <Grid xs={12}>
                            <Avatar
                                squared
                                icon={<UserIcon size={20} fill="currentColor" />}
                            />
                            <Spacer x={0.5} />
                            <Text h3>Your Workspaces</Text>
                        </Grid>
                        {workspace.getWorkspacesWithFilter(_workspaces).length > 0 ? workspace.getWorkspacesWithFilter(_workspaces).map((element, index) =>
                            <Grid xs={12} sm={3} lg={2} key={index}>
                                <Card color={'gradient'} css={{ height: 140, justifyContent: "flex-end", }}>
                                    <Grid.Container>
                                        <Grid xs={10} css={{ fd: "column" }} justify='flex-end'>
                                            <Link href="/workspace/[pid]" as={`/workspace/${element._id}`}>
                                                <ALink>
                                                    <Text h3 color={"white"}>{element.title}</Text>
                                                </ALink>
                                            </Link>
                                            <Link href="/workspace/[pid]" as={`/workspace/${element._id}`}>
                                                <ALink>
                                                    <Text h6 color={"white"}>{element.desc}</Text>
                                                </ALink>
                                            </Link>
                                        </Grid>
                                        <Grid xs={2} justify='flex-end' alignItems='flex-end' css={{ fd: "column" }}>
                                            <Button
                                                icon={
                                                    element.starred == true ?
                                                        <StarFilledIcon height={24} width={24} style={{ fill: "white" }} /> :
                                                        <StarOutlineIcon height={24} width={24} style={{ fill: "white" }} />
                                                }
                                                onClick={() => workspace.star({ id: element._id })}
                                                css={{ minWidth: 20, justifyContent: "flex-end" }}
                                                light
                                            />
                                            <Button
                                                icon={<DeleteIcon height={24} width={24} style={{ fill: "white" }} />}
                                                onClick={() => setDeleteModal({ ...deleteModal, visible: true, workspace: element._id })}
                                                css={{ minWidth: 20, justifyContent: "flex-end" }}
                                                light
                                            />
                                        </Grid>
                                    </Grid.Container>
                                </Card>
                            </Grid>) : null}
                        <Grid xs={12} sm={3} lg={2}>
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
        //const emailCookie = req.cookies.email;

        if (authCookie) {
            const dataValidate = await fetch(`${server}/api/validate`, {
                'Content-Type': 'application/json',
                method: "POST",
                body: JSON.stringify({ token: authCookie }),
            }).then(response => response.json()).catch(error => {
                return { success: false, error: { code: "validation-error", errorMessage: error } }
            });

            console.log("data-validate: ", dataValidate);

            if (dataValidate.success) {
                validate = { ...dataValidate };

                const dataWorkspaces = await fetch(`${server}/api/workspace`, {
                    'Content-Type': 'application/json',
                    method: "POST",
                    body: JSON.stringify({ uid: dataValidate.data.uid, action: "GET_WORKSPACES" }),
                }).then(response => response.json());

                console.log("data workspaces: ", dataWorkspaces);

                if (dataWorkspaces?.success) {
                    if (dataWorkspaces?.data) {
                        workspaces = { data: dataWorkspaces?.data, success: true };
                    } else {
                        workspaces = { success: true }
                    }
                }
            } else {
                validate = { error: dataValidate?.error?.code }
            }
        } else {
            validate = { error: "no-token" }
        }
    }
    return { props: { validate, workspaces } }
}