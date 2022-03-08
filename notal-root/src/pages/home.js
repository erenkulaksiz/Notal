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
    GetWorkspaces,
    ValidateToken,
    WorkboxInit
} from '@utils';
import { HomeRoutes } from '@utils/constants';

import useNotalUI from '@hooks/notalui';

const Home = (props) => {
    const auth = useAuth();
    const router = useRouter();

    const [_workspacesValidating, _setWorkspacesValidating] = useState(true);

    const [navCollapse, setNavCollapse] = useState(false);

    // View/Filter
    const [homeViewing, setHomeViewing] = useState("workspaces");

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

        <main className="relative flex flex-row flex-1 bg-white dark:bg-neutral-900 overflow-y-auto overflow-x-hidden">
            <HomeSidebar
                navCollapse={navCollapse}
                current={homeViewing}
                onViewingChange={({ nav }) => setHomeViewing(nav.id)}
                onCollapse={() => setNavCollapse(prev => !prev)}
            />
            {HomeRoutes.map((Route) => {
                if (homeViewing == Route.id) {
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
        <style jsx global>{`
            html,
            body,
            body > div:first-child,
            div#__next,
            div#__next > div {
              height: 100%;
            }
        `}</style>
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

        console.log("validate:", validate);
    }
    return { props: { validate } }
}