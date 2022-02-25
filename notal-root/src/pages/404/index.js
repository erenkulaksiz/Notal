import { useRouter } from 'next/router';

import {
    BackIcon,
    HomeFilledIcon
} from '@icons';

import {
    Button
} from '@components';

import useAuth from '@hooks/auth';
import Head from 'next/head';

const Page404 = () => {
    const router = useRouter();
    const auth = useAuth();

    return (<div className="mx-auto sm:container min-h-screen items-center justify-center flex flex-col">
        <Head>
            <title>404 - Not Found</title>
        </Head>
        <div className="flex flex-col justify-center items-center dark:bg-neutral-800 bg-neutral-200/50 shadow-xl p-8 rounded-xl">
            <img
                src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
                alt="Michael Scott"
                style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
            />
            <h1 className="text-6xl font-bold text-center mt-4">[404]</h1>
            <h2 className="text-center mt-4">We couldnt find the page you were looking for.</h2>
            <Button
                icon={<HomeFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => router.replace(auth.authUser ? "/home" : "/")}
                className="mt-4 text-xl"
                size="lg"
                gradient
                fullWidth
            >
                Home
            </Button>
            <Button
                icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => router.back()}
                className="mt-4 text-xl"
                size="lg"
                gradient
                fullWidth
            >
                Back
            </Button>
        </div>
    </div>)
}

export default Page404;