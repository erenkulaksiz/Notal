//import { useState } from 'react';
import { Button, Text, Grid, Card, useTheme, Row, Tooltip, Avatar, Link as ALink } from '@nextui-org/react';
import Link from 'next/link';

import StarFilledIcon from '../../../public/icons/star_filled.svg';
import StarOutlineIcon from '../../../public/icons/star_outline.svg';
import VisibleIcon from '../../../public/icons/visible.svg';
import VisibleOffIcon from '../../../public/icons/visible_off.svg';
import DeleteIcon from '../../../public/icons/delete.svg';
import EditIcon from '../../../public/icons/edit.svg';
import UserIcon from '../../../public/icons/user.svg';

const WorkspaceNav = ({ title, desc, starred, onFavClick, onDeleteClick, onEditWorkspace, isOwner, user, onVisibleClick, visible }) => {
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
                <Tooltip
                    content={starred == true ? "Remove from favorites" : "Add to favorites"}
                    css={{ pointerEvents: "none" }}
                >
                    <Button css={{ bg: "$gradient", height: 60, minWidth: 60, mr: 8 }} onClick={onFavClick}>
                        {starred ? <StarFilledIcon style={{ fill: "#dbb700" }} /> : <StarOutlineIcon fill={"currentColor"} />}
                    </Button>
                </Tooltip>
                <Tooltip
                    content="Change visibility"
                    css={{ pointerEvents: "none" }}
                >
                    <Button css={{ bg: "$gradient", height: 60, minWidth: 60, mr: 8 }} onClick={onVisibleClick}>
                        {visible ? <VisibleIcon width={18} fill={"currentColor"} /> : <VisibleOffIcon width={18} fill={"currentColor"} />}
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
            </Grid> : <Grid xs={7} sm={4} justify="flex-end">
                <Link href={`/profile/${user?.username}`} passHref>
                    <ALink>
                        <Tooltip content="Workspace Owner" css={{ pointerEvents: "none" }}>
                            <Card css={{ width: "60%", minWidth: 200 }} clickable>
                                <Row css={{ fd: "row", alignItems: "center" }}>
                                    <Avatar size="xl" color="gradient" bordered src={user?.avatar} referrerPolicy='no-refferer' icon={<UserIcon height={24} width={24} style={{ fill: "white" }} />} pointer />
                                    <Row css={{ fd: "column", p: 0 }}>
                                        <Text css={{ ml: 8, mb: 0, fs: "1.2em", fontWeight: "600" }}>{user.fullname ? user?.fullname : "@" + user?.username}</Text>
                                        {user.fullname && <Text css={{ ml: 8, }}>@{user?.username}</Text>}
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