import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from "framer-motion";

import addworkspacebanner from '../../public/addfieldbanner.png';

import {
    AddIcon,
    StarFilledIcon,
    VisibleOffIcon,
    DashboardFilledIcon,
    BackIcon
} from '@icons';

import {
    Navbar,
    HomeNavItem,
    HomeNavWorkspaces,
    HomeNavBookmarks,
} from '@components';

import useAuth from '@hooks/auth';
import { withAuth } from '@hooks/route';

import {
    CheckToken,
    GetWorkspaces,
    ValidateToken,
    WorkboxInit
} from '@utils';

import {
    HomeRoutes
} from '@utils/constants';

const NavSelector = ({ nav, workspaces, onAddWorkspace }) => {
    switch (nav) {
        case "workspaces":
            return <HomeNavWorkspaces workspaces={workspaces} onAddWorkspace={onAddWorkspace} />

        case "bookmarks":
            return <HomeNavBookmarks />
    }
}

const Home = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [navCollapse, setNavCollapse] = useState(false);

    // View/Filter
    const [homeViewing, setHomeViewing] = useState("workspaces");

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
        console.log("home props: ", props);
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

    return (<div className="mx-auto min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>Home · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} />

        <main className="flex flex-1 flex-row bg-white dark:bg-neutral-900">
            <motion.div
                animate={navCollapse ? "collapse" : "open"}
                transition={{ type: "tween", stiffness: 50 }}
                variants={{
                    collapse: {
                        width: "2.8rem"
                    },
                    open: {
                        width: "14rem"
                    }
                }}
            >
                <nav className="h-full bg-white dark:bg-neutral-800 flex flex-col">
                    <div className="w-full h-10 flex justify-end">
                        <button className="p-2 bg-white dark:bg-neutral-800 hover:bg-neutral-200 transition-colors ease-in-out" onClick={() => setNavCollapse(!navCollapse)}>
                            <motion.div
                                animate={navCollapse ? "collapse" : "open"}
                                transition={{ type: "tween", stiffness: 50 }}
                                variants={{
                                    collapse: {
                                        rotate: 180
                                    },
                                    open: {
                                        rotate: 0
                                    }
                                }}
                            >
                                <BackIcon size={24} fill={"currentColor"} />
                            </motion.div>
                        </button>
                    </div>
                    {HomeRoutes.map((nav, index) => <HomeNavItem nav={nav} key={index} onClick={() => setHomeViewing(nav.id)} current={homeViewing} navCollapse={navCollapse} />)}
                </nav>
            </motion.div>
            {!loadingWorkspaces && <NavSelector nav={homeViewing} workspaces={props?.workspaces?.data} onAddWorkspace={() => setNewWorkspaceVisible(true)} />}
        </main>
    </div>)
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