//import { useState } from 'react';
import { Button, Text, Grid, Card, useTheme, Row, Tooltip, Avatar, Link as ALink, Loading } from '@nextui-org/react';
import Link from 'next/link';

import {
    WorkspaceLoading,
} from '../'

import {
    StarFilledIcon,
    StarOutlineIcon,
    VisibleIcon,
    DeleteIcon,
    EditIcon,
    UserIcon,
    VisibleOffIcon
} from '../../icons';

const WorkspaceNav = ({ title, desc, starred, onFavClick, onDeleteClick, onEditWorkspace, isOwner, user, onVisibleClick, visible, loading }) => {
    const { isDark } = useTheme();

    return (<Card css={{ bgBlur: isDark ? "#000000" : "#ffffff" }} shadow={false}>
        <Grid.Container justify='flex-end'>
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
            {isOwner ? <Grid xs={7} sm={4} justify="flex-end">
                <Grid.Container justify='flex-end' alignItems='center' gap={0.4} css={{ pb: 0 }}>
                    <Grid>
                        <WorkspaceLoading loading={loading} />
                    </Grid>
                    <Grid>
                        <Tooltip
                            content={starred == true ? "Remove from favorites" : "Add to favorites"}
                            css={{ pointerEvents: "none" }}
                        >
                            <Button css={{ bg: "$gradient", height: 60 }} auto onClick={onFavClick}>
                                {starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid>
                        <Tooltip
                            content="Change visibility"
                            css={{ pointerEvents: "none" }}
                        >
                            <Button css={{ bg: "$gradient", height: 60 }} auto onClick={onVisibleClick}>
                                {visible ? <VisibleIcon width={24} fill={"currentColor"} /> : <VisibleOffIcon width={24} fill={"currentColor"} />}
                            </Button>
                        </Tooltip>
                    </Grid>
                    <Grid>
                        <Tooltip
                            content="Delete"
                            css={{ pointerEvents: "none" }}
                        >
                            <Button css={{ bg: "$gradient", height: 60 }} auto onClick={onDeleteClick}>
                                <DeleteIcon size={24} fill={"currentColor"} />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid.Container>
            </Grid> : <Grid xs={7} sm={4} justify="flex-end">
                <Link href={`/profile/${user?.username}`} passHref>
                    <ALink>
                        <Tooltip content="Workspace Owner" css={{ pointerEvents: "none" }}>
                            <Card css={{ width: "60%", minWidth: 200, boxShadow: "$sm" }} clickable>
                                <Row css={{ fd: "row", alignItems: "center" }}>
                                    <Avatar size="md" color="gradient" bordered src={user?.avatar} referrerPolicy='no-refferer' icon={<UserIcon height={24} width={24} style={{ fill: "white" }} />} pointer />
                                    <Row css={{ fd: "column", p: 0 }}>
                                        <Text css={{ ml: 8, mb: 0, fs: "1.2em", fontWeight: "600" }}>{user.fullname ? user?.fullname : "@" + user?.username}</Text>
                                        {user.fullname && <Text css={{ ml: 8, fs: "0.8em" }}>@{user?.username}</Text>}
                                    </Row>
                                </Row>
                            </Card>
                        </Tooltip>
                    </ALink>
                </Link>
            </Grid>}
        </Grid.Container>
    </Card>)
}

export default WorkspaceNav;