import { useRouter } from 'next/router';
import Head from 'next/head';
import { SyncIcon } from '@icons';
import { Button } from '@components';

const Offline = () => {
    const router = useRouter();
    //const auth = useAuth();

    return (<div className="mx-auto sm:container min-h-screen items-center justify-center flex flex-col">
        <Head>
            <title>Offline.</title>
        </Head>
        <div className="flex flex-col justify-center items-center dark:bg-neutral-800 bg-neutral-200/50 shadow-xl p-8 px-16 rounded-xl">
            <h1 className="text-6xl font-bold text-center mt-4">[404]</h1>
            <h2 className="text-center text-lg font-semibold mt-4">You are offline.</h2>
            <Button
                onClick={() => router.reload()}
                className="mt-4 text-xl"
                size="lg"
                gradient
                fullWidth
            >
                <SyncIcon height={24} width={24} style={{ fill: "currentColor" }} />
                <span className="text-bold text-lg ml-2">Refresh</span>
            </Button>
        </div>
    </div>)
}

export default Offline;