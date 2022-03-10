import Head from "next/head";

import { ValidateToken } from "@utils";

import { SecureIcon } from "@icons";

import {
    Navbar,
    AcceptCookies
} from "@components";

const PrivacyPolicy = (props) => {
    return (<div className="mx-auto max-h-screen min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>Privacy Policy · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} showHomeButton />

        <div className="sm:container px-8 sm:px-16 md:px-32 lg:px-32 z-10 pt-8 mx-auto">
            <div className="text-3xl font-medium flex flex-row items-center">
                <SecureIcon size={24} fill="currentColor" style={{ transform: "scale(1.4)" }} />
                <h1 className="ml-3">
                    Privacy Policy
                </h1>
            </div>
        </div>

        <AcceptCookies />
    </div>)
}

export default PrivacyPolicy;

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