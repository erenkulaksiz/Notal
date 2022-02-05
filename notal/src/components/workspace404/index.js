import { Button, Container, Text, Card } from '@nextui-org/react';
import { useRouter } from "next/router";

import HomeFilledIcon from '../../../public/icons/home_filled.svg';
import BackIcon from '../../../public/icons/back.svg';

const Workspace404 = ({ reason }) => {
    const router = useRouter();

    return (<Container sm css={{ dflex: "center", ac: "center", ai: "center", fd: "column" }}>
        <Card css={{ textAlign: "center", dflex: "center", py: 32, mt: 48 }}>
            <img
                src="https://i.pinimg.com/originals/ee/d0/d0/eed0d023bdf444d37050e27d46364f0b.png"
                alt="Michael Scott"
                style={{ maxHeight: "100%", maxWidth: "100%", width: 200 }}
            />
            <Text h1>[404]</Text>
            <Text h3 css={{ textAlign: "center" }}>{reason == "private" ? "You have no permission to view this workspace." : "We couldnt find this workspace."}</Text>
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
        </Card>
    </Container>)
}

export default Workspace404;