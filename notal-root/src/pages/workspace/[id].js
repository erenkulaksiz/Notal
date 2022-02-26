import { useRouter } from "next/router";
import Head from "next/head";

import useAuth from "@hooks/auth";
import { ValidateToken, GetWorkspace } from "@utils";
import { Navbar } from "@components";

const Workspace = (props) => {
    const auth = useAuth();
    const router = useRouter();

    return (<div className="mx-auto max-h-screen min-h-screen flex flex-col transition-colors duration-100">
        <Head>
            <title>Workspace · Notal</title>
            <meta name='twitter:description' content='Take your notes to next level with Notal' />
            <meta property='og:description' content='Take your notes to next level with Notal' />
            <meta name='description' content='Take your notes to next level with Notal' />
        </Head>

        <Navbar user={props?.validate?.data} showHomeButton />
    </div>)
}

export default Workspace;

export async function getServerSideProps(ctx) {
    const { req, res, query } = ctx;
    let validate = {};
    let workspace = {};

    const queryId = query?.id;

    if (req) {
        const authCookie = req.cookies.auth;

        validate = await ValidateToken({ token: authCookie });
        console.log("validate:", validate);
        workspace = await GetWorkspace({ id: queryId, token: authCookie });
    }
    return { props: { validate, workspace } }
}