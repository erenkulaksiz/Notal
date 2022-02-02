import { useState } from 'react';
import { Button, Text, Grid, Card, useTheme, Row, Tooltip } from '@nextui-org/react';

import StarFilledIcon from '../../../public/icons/star_filled.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import EditIcon from '../../../public/icons/edit.svg';

const WorkspaceNav = ({ title, desc, starred, onFavClick, onDeleteClick, onEditWorkspace }) => {
    const { isDark } = useTheme();

    return (<Card>
        <Grid.Container>
            <Grid xs={5} sm={8} css={{ flexDirection: "column" }}>
                <Tooltip css={{ pl: 8, pr: 8 }} content={<div style={{ display: "flex", flexDirection: "row" }}>
                    <Button size="sm" css={{ minWidth: 44 }} onClick={onEditWorkspace}>
                        <EditIcon size={24} fill={"currentColor"} />
                    </Button>
                </div>}>
                    <Row>
                        <Text h3>
                            {title}
                        </Text>
                    </Row>
                </Tooltip>
                <Tooltip css={{ pl: 8, pr: 8 }} content={<div style={{ display: "flex", flexDirection: "row" }}>
                    <Button size="sm" css={{ minWidth: 44 }} onClick={onEditWorkspace}>
                        <EditIcon size={24} fill={"currentColor"} />
                    </Button>
                </div>}>
                    <Row>
                        <Text css={{ fs: "1em", color: isDark ? "$gray400" : "$gray800" }}>
                            {desc}
                        </Text>
                    </Row>
                </Tooltip>
            </Grid>
            <Grid xs={7} sm={4}>
                <Grid.Container gap={0.5} css={{ justifyContent: "flex-end" }}>
                    <Grid xs={3} sm={2} md={2} lg={1} css={{ minHeight: 40, minWidth: 60, justifyContent: "flex-end" }} alignItems="center">
                        <Button css={{ bg: "$primary", minWidth: 60, height: 60, }} onClick={onFavClick}>
                            {starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                        </Button>
                    </Grid>
                    <Grid xs={3} sm={2} md={2} lg={1} css={{ minHeight: 40, minWidth: 60, justifyContent: "flex-end", marginLeft: 8 }} alignItems="center">
                        <Button css={{ bg: "$primary", minWidth: 60, height: 60 }} >
                            <VisibleIcon width={18} fill={"currentColor"} />
                        </Button>
                    </Grid>
                    <Grid xs={3} sm={2} md={2} lg={1} css={{ minHeight: 40, minWidth: 60, justifyContent: "flex-end", marginLeft: 8 }} alignItems="center">
                        <Button css={{ bg: "$primary", minWidth: 60, height: 60 }} onClick={onDeleteClick}>
                            <DeleteIcon size={24} fill={"currentColor"} />
                        </Button>
                    </Grid>
                </Grid.Container>
            </Grid>
        </Grid.Container>
    </Card>)
}

export default WorkspaceNav;