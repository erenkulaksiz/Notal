import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

import {
    Navbar,
    HomeSidebar,
    AcceptCookies
} from '@components';

import useAuth from '@hooks/auth';
import { withAuth } from '@hooks/route';

import {
    CheckToken,
    ValidateToken,
    WorkboxInit
} from '@utils';
import { HomeRoutes } from '@utils/constants';

const Home = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [_workspacesValidating, _setWorkspacesValidating] = useState(true);

    const [navCollapse, setNavCollapse] = useState(undefined);

    // View/Filter
    const [homeViewing, setHomeViewing] = useState("workspaces");

    useEffect(() => {
        const homeNavCollapsed = localStorage.getItem("homeNavCollapsed");
        if (typeof homeNavCollapsed == "undefined") {
            localStorage.setItem("homeNavCollapsed", false);
            setNavCollapse(false);
        } else {
            setNavCollapse(JSON.parse(homeNavCollapsed));
        }
    }, []);

    const onCollapse = () => {
        localStorage.setItem("homeNavCollapsed", !navCollapse);
        setNavCollapse(!navCollapse);
    }

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
    }, [_workspacesValidating]);

    return (<div className="mx-auto h-full flex flex-col transition-colors duration-100">
        <Head>
            <title>Home · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar
            user={props?.validate?.data}
            validating={_workspacesValidating}
        />

        <main className="relative flex flex-1 flex-row bg-white dark:bg-neutral-900 overflow-y-auto overflow-x-hidden">
            {typeof navCollapse != "undefined" && <HomeSidebar
                navCollapse={navCollapse}
                current={homeViewing}
                onViewingChange={({ nav }) => setHomeViewing(nav.id)}
                onCollapse={() => onCollapse()}
            />}
            {HomeRoutes.map((Route) => {
                if (homeViewing == Route.id) {
                    if (!Route.Component) {
                        return <div>
                            no route found!
                        </div>
                    }
                    return Route.Component(
                        {
                            props: { ...props },
                            isValidating: (val) => _setWorkspacesValidating(val)
                        }
                    );
                }
            })}
        </main>
        <AcceptCookies />
    </div>)
}

export default withAuth(Home);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspaces = {};

    if (req) {
        const authCookie = req.cookies.auth;

        [validate, /*workspaces*/] = await Promise.all([
            ValidateToken({ token: authCookie }),
            //GetWorkspaces({ uid: validate?.data?.uid, token: authCookie }),
        ]);

        console.log("validate:", validate?.success, validate?.data?.uid, validate?.error);
    }
    return { props: { validate } }
}