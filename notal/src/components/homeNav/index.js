import { Button, Card, Grid, Link as ALink, Row, Spacer, Text } from '@nextui-org/react';

import {
    DashboardIcon,
    StarFilledIcon,
    VisibleOffIcon
} from '../../icons';

const HomeNav = ({ viewing, onViewChange }) => {
    return (<Grid.Container gap={1}>
        <Grid xs={12} sm={4} md={2}>
            <Button
                icon={<DashboardIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => onViewChange("workspaces")}
                css={{ minWidth: "100%" }}
                bordered={viewing != "workspaces"}
                size="lg"
            >
                Workspaces
            </Button>
        </Grid>
        <Grid xs={12} sm={4} md={2}>
            <Button
                icon={<StarFilledIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => onViewChange("favorites")}
                css={{ minWidth: "100%" }}
                bordered={viewing != "favorites"}
                size="lg"
            >
                Favorites
            </Button>
        </Grid>
        <Grid xs={12} sm={4} md={2}>
            <Button
                icon={<VisibleOffIcon height={24} width={24} style={{ fill: "currentColor" }} />}
                onClick={() => onViewChange("privateWorkspaces")}
                css={{ minWidth: "100%" }}
                bordered={viewing != "privateWorkspaces"}
                size="lg"
            >
                Private
            </Button>
        </Grid>
    </Grid.Container>)
}

export default HomeNav;