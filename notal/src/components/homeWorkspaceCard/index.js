import { Button, Card, Grid, Link as ALink, Text, Tooltip } from '@nextui-org/react';
import Link from 'next/link';

import {
    StarFilledIcon,
    StarOutlineIcon,
    DeleteIcon
} from '../../icons';

const HomeWorkspaceCard = ({ workspace, onStarClick, onDeleteClick }) => {
    return (<Grid xs={12} sm={4} lg={2}>
        <Card color={'gradient'} css={{ height: 140, justifyContent: "flex-end" }}>
            <Grid.Container>
                <Grid xs={10} css={{ fd: "column" }} justify='flex-end'>
                    <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`}>
                        <ALink>
                            <Text h3 color={"white"}>{workspace.title}</Text>
                        </ALink>
                    </Link>
                    {workspace.desc && <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`}>
                        <ALink>
                            <Text h6 color={"white"}>{workspace.desc}</Text>
                        </ALink>
                    </Link>}
                </Grid>
                <Grid xs={2} justify='flex-end' alignItems='flex-end' css={{ fd: "column" }}>
                    <Tooltip
                        content={workspace.starred == true ? "Remove from favorites" : "Add to favorites"}
                        css={{ pointerEvents: "none" }}
                    >
                        <Button
                            icon={
                                workspace.starred == true ?
                                    <StarFilledIcon height={24} width={24} style={{ fill: "white" }} /> :
                                    <StarOutlineIcon height={24} width={24} style={{ fill: "white" }} />
                            }
                            onClick={onStarClick}
                            css={{ minWidth: 20, justifyContent: "flex-end" }}
                            light
                        />
                    </Tooltip>
                    <Tooltip content="Delete this workspace" css={{ pointerEvents: "none" }}>
                        <Button
                            icon={<DeleteIcon height={24} width={24} style={{ fill: "white" }} />}
                            onClick={onDeleteClick}
                            css={{ minWidth: 20, justifyContent: "flex-end" }}
                            light
                        />
                    </Tooltip>
                </Grid>
            </Grid.Container>
        </Card>
    </Grid>)
}

export default HomeWorkspaceCard;