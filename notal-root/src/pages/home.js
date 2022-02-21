import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import {
    Navbar,
    HomeSidebar,
    NavSelector
} from '@components';

import useAuth from '@hooks/auth';
import { withAuth } from '@hooks/route';

import {
    CheckToken,
    GetWorkspaces,
    ValidateToken,
    WorkboxInit
} from '@utils';

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

        <main className="flex flex-row flex-1 bg-white dark:bg-neutral-900">
            <HomeSidebar
                navCollapse={navCollapse}
                current={homeViewing}
                onViewingChange={({ nav }) => setHomeViewing(nav.id)}
                onCollapse={() => setNavCollapse(prev => !prev)}
            />
            {!loadingWorkspaces && <NavSelector
                nav={homeViewing}
                workspaces={props?.workspaces?.data}
                onAddWorkspace={() => setNewWorkspaceVisible(true)}
            />}
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