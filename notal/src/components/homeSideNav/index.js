import { Button, Card, Grid, Link as ALink, Row, Spacer, Text } from '@nextui-org/react';

import {
    DashboardIcon,
    StarFilledIcon,
    WarningIcon,
} from '../../icons';

const HomeSideNav = ({ viewing, onViewChange }) => {
    return (<Grid xs={12} sm={3} md={2} css={{ fd: "column" }}>
        <Button
            icon={<DashboardIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            onClick={() => onViewChange("workspaces")}
            css={{ minWidth: "100%" }}
            bordered={viewing != "workspaces"}
            size="lg"
        >
            Workspaces
        </Button>
        <Spacer y={1} />
        <Button
            icon={<StarFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
            onClick={() => onViewChange("favorites")}
            css={{ minWidth: "100%" }}
            bordered={viewing != "favorites"}
            size="lg"
        >
            Favorites
        </Button>
        <Spacer y={1} />
        <Card css={{ fill: "$warning", "@mdMax": { width: "100%" } }}>
            <Row>
                <WarningIcon size={20} style={{ transform: "scale(0.8)" }} />
                <Text h5 css={{ color: "$warningDark", ml: 4 }}>Alpha Warning v{process.env.NEXT_PUBLIC_APP_VERSION}</Text>
            </Row>
            <Text b>This project is currently in private alpha.</Text>
            <Row css={{ mt: 12 }}>
                <ALink href='mailto:erenkulaksz@gmail.com'>
                    Feedback
                </ALink>
            </Row>
        </Card>
    </Grid>)
}

export default HomeSideNav;