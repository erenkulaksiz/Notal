import Head from "next/head";

import { ValidateToken } from "@utils";

import {
    Navbar,
    AcceptCookies
} from "@components";

const Cookies = (props) => {
    return (<div className="mx-auto max-h-screen min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>Cookies · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} />

        <div className="sm:container px-8 sm:px-16 md:px-32 lg:px-32 z-10 pt-8">
            <div className="text-4xl font-medium">
                Cookies
            </div>
        </div>

        <AcceptCookies />
    </div>)
}

export default Cookies;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};

    if (req) {
        const authCookie = req.cookies.auth;

        [validate] = await Promise.all([
            ValidateToken({ token: authCookie })
        ]);
    }
    return { props: { validate } }
}