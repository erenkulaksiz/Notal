import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';

import { isClient } from '@utils';

import {
    Navbar,
    HomeSidebar,
    AcceptCookies
} from '@components';

import useAuth from '@hooks/auth';
import { withAuth } from '@hooks/route';

import {
    CheckToken,
    ValidateToken
} from '@utils';
import { HomeRoutes } from '@utils/constants';
import useNotalUI from '@hooks/notalui';
import LocalSettings from '@utils/localstorage';

import Log from "@utils/logger"

const Home = (props) => {
    const auth = useAuth();
    const router = useRouter();
    const NotalUI = useNotalUI

    const [_workspacesValidating, _setWorkspacesValidating] = useState(true);

    // View/Filter
    const [homeViewing, setHomeViewing] = useState("workspaces");

    useEffect(() => {
        Log.debug("home props: ", props);
        (async () => {
            const token = await auth.users.getIdToken();
            const res = await CheckToken({ token: token.res, props, user: auth?.authUser });
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
            <meta name='twitter:image' content='https://notal.app/icon_big.png' />
            <meta property='og:image' content='https://notal.app/icon_big.png' />
            <meta name='apple-mobile-web-app-title' content='Notal' />
            <meta name='twitter:title' content='Notal' />
            <meta property='og:title' content='Notal' />
            <meta property='og:url' content='https://notal.app/home' />
        </Head>

        <Navbar
            user={props?.validate?.data}
            validating={_workspacesValidating}
            showCollapse
        />

        <main className="relative flex flex-1 flex-row bg-white dark:bg-neutral-900 overflow-y-auto overflow-x-hidden">
            {isClient && false && <HomeSidebar
                current={homeViewing}
                onViewingChange={({ nav }) => setHomeViewing(nav.id)}
            />}
            {HomeRoutes.map((Route) => {
                if (homeViewing != Route.id) return;

                if (!Route.Component) {
                    return <div className="w-full h-full flex items-center justify-center">
                        <h1 className="text-2xl">🚧 Cannot found this route. 🚧</h1>
                    </div>
                }
                return Route.Component(
                    {
                        props: { ...props },
                        isValidating: (val) => _setWorkspacesValidating(val)
                    }
                );
            })}
        </main>
    </div>)
}

export default withAuth(Home);

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;

        [validate, /*workspaces*/] = await Promise.all([
            ValidateToken({ token: authCookie }),
            //GetWorkspaces({ uid: validate?.data?.uid, token: authCookie }),
        ]);

        Log.debug("validate:", validate?.success, validate?.data?.uid, validate?.error);
    }
    return { props: { validate } }
}