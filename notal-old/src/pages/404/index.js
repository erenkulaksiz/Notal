import { useRouter } from 'next/router';
import { Button, Container, Text, Card } from '@nextui-org/react';

import {
    BackIcon,
    HomeFilledIcon
} from '@icons';

import useAuth from '@hooks/auth';
import Head from 'next/head';

const Page404 = () => {
    const router = useRouter();
    const auth = useAuth();

    return (<Container xs css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
        <Head>
            <title>404 - Not Found</title>
        </Head>
        <Card css={{ textAlign: "center", dflex: "center", py: 32 }}>
            <img
                src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
                alt="Michael Scott"
                style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
            />
            <Text h1>[404]</Text>
            <Text h2 css={{ textAlign: "center", fs: "1.2em", "@sm": { fs: "1.8em" } }}>We couldnt find the page you were looking for.</Text>
            <Button
                icon={<HomeFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => router.replace(auth.authUser ? "/home" : "/")}
                css={{ mt: 18 }}
                size="xl"
                color="gradient"
            >
                Home
            </Button>
            <Button
                icon={<BackIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => router.back()}
                css={{ mt: 18 }}
                size="xl"
                color="gradient"
            >
                Back
            </Button>
        </Card>
    </Container>)
}

export default Page404;