import { Text, Grid, Card, Link as ALink, Tooltip } from '@nextui-org/react';
import Link from 'next/link';

import {
    VisibleOffIcon,
    StarFilledIcon
} from '../../icons';

const ProfileWorkspaceCard = ({ workspace }) => {

    return (<Grid xs={12} sm={4} lg={3} key={workspace._id}>
        <Link href="/workspace/[pid]" as={`/workspace/${workspace._id}`} passHref>
            <ALink css={{ width: "100%" }}>
                <Card color={'gradient'} css={{ height: 140, justifyContent: "flex-end", }} clickable>
                    <Grid.Container>
                        <Grid xs={10} css={{ fd: "column" }}>
                            <ALink>
                                <Text h3 color={"white"}>{workspace.title}</Text>
                            </ALink>
                            <ALink>
                                <Text h6 color={"white"}>{workspace.desc}</Text>
                            </ALink>
                        </Grid>
                        {(!workspace?.workspaceVisible || workspace?.starred) && <Grid xs={2} css={{ fd: "column" }} alignItems='flex-end' justify='flex-end'>
                            {!workspace?.workspaceVisible && <Tooltip content="This workspace is set to private." css={{ pointerEvents: "none" }}>
                                <VisibleOffIcon height={24} width={24} fill={"currentColor"} />
                            </Tooltip>}
                            {workspace?.starred && <Tooltip content={`Added to favorites`} css={{ pointerEvents: "none" }}>
                                <StarFilledIcon height={24} width={24} fill={"currentColor"} />
                            </Tooltip>}
                        </Grid>}
                    </Grid.Container>
                </Card>
            </ALink>
        </Link>
    </Grid>)
}

export default ProfileWorkspaceCard;