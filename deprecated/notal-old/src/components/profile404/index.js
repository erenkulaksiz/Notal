import { Button, Card, Text } from '@nextui-org/react';
import { useRouter } from 'next/router';

import {
    BackIcon,
    HomeFilledIcon
} from '../../icons';

const Profile404 = () => {
    const router = useRouter();

    return (<Card css={{ textAlign: "center", dflex: "center", py: 32 }}>
        <img
            src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
            alt="Michael Scott"
            style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
        />
        <Text h1>[404]</Text>
        <Text h3 css={{ textAlign: "center" }}>We couldnt find this user.</Text>
        <Button
            icon={<HomeFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            onClick={() => router.replace("/home")}
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
    </Card>)
}

export default Profile404;