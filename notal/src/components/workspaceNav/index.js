import { useState } from 'react';
import { Button, Text, Grid, Card, useTheme, Row, Tooltip } from '@nextui-org/react';

import StarFilledIcon from '../../../public/icons/star_filled.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import EditIcon from '../../../public/icons/edit.svg';

const WorkspaceNav = ({ title, desc, starred, onFavClick, onDeleteClick, onEditWorkspace }) => {
    const { isDark } = useTheme();

    return (<Card css={{ bgBlur: isDark ? "#000000" : "#ffffff" }} shadow={false}>
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
                {desc && <Tooltip css={{ pl: 8, pr: 8 }} content={<div style={{ display: "flex", flexDirection: "row" }}>
                    <Button size="sm" css={{ minWidth: 44 }} onClick={onEditWorkspace}>
                        <EditIcon size={24} fill={"currentColor"} />
                    </Button>
                </div>}>
                    <Row>
                        <Text css={{ fs: "1em", color: isDark ? "$gray400" : "$gray800" }}>
                            {desc}
                        </Text>
                    </Row>
                </Tooltip>}
            </Grid>
            <Grid xs={7} sm={4} justify="flex-end">
                <Tooltip
                    content={starred == true ? "Remove from favorites" : "Add to favorites"}
                    css={{ pointerEvents: "none" }}
                >
                    <Button css={{ bg: "$gradient", height: 60, minWidth: 60, mr: 8 }} onClick={onFavClick}>
                        {starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                    </Button>
                </Tooltip>
                <Tooltip
                    content="Edit visibility"
                    css={{ pointerEvents: "none" }}
                >
                    <Button css={{ bg: "$gradient", height: 60, minWidth: 60, mr: 8 }} >
                        <VisibleIcon width={18} fill={"currentColor"} />
                    </Button>
                </Tooltip>
                <Tooltip
                    content="Delete"
                    css={{ pointerEvents: "none" }}
                >
                    <Button css={{ bg: "$gradient", height: 60, minWidth: 60 }} onClick={onDeleteClick}>
                        <DeleteIcon size={24} fill={"currentColor"} />
                    </Button>
                </Tooltip>
            </Grid>
        </Grid.Container>
    </Card>)
}

export default WorkspaceNav;