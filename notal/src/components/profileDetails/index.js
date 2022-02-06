import { Text, Grid, Row, Link as ALink, Tooltip } from '@nextui-org/react';
import Link from 'next/link';

import {
    TwitterIcon,
    Github2Icon as GithubIcon,
    InstagramIcon,
    WebsiteIcon,
    CakeIcon
} from "../../icons";

const ProfileDetails = ({ links, createdAt }) => {

    return (<Grid.Container>
        <Grid xs={12} css={{ fd: "column", }}>
            {links && (links?.twitter.length != 0
                || links?.github.length != 0
                || links?.instagram.length != 0
                || links?.website.length != 0) && <Row css={{ justifyContent: "flex-end", pt: 0, pb: 0, "@mdMax": { justifyContent: "center", pt: 20, pb: 12, }, alignItems: "flex-start" }}>
                    {links?.twitter.length != 0 && <Tooltip content="Twitter">
                        <Link href={"https://twitter.com/" + links?.twitter ?? ""} passHref>
                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                <TwitterIcon height={24} width={24} fill={"currentColor"} />
                            </ALink>
                        </Link>
                    </Tooltip>}
                    {links?.github.length != 0 && <Tooltip content="GitHub">
                        <Link href={"https://github.com/" + links?.github ?? ""} passHref>
                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                <GithubIcon height={24} width={24} fill={"currentColor"} />
                            </ALink>
                        </Link>
                    </Tooltip>}
                    {links?.instagram.length != 0 && <Tooltip content="Instagram">
                        <Link href={"https://instagram.com/" + links?.instagram ?? ""} passHref>
                            <ALink css={{ color: "currentColor", padding: 8 }} target="_blank">
                                <InstagramIcon height={24} width={24} fill={"currentColor"} />
                            </ALink>
                        </Link>
                    </Tooltip>}
                    {links?.website.length != 0 && <Tooltip content={links?.website}>
                        <Link href={"https://" + links?.website + "?utm_source=notalapp"} passHref target="_blank">
                            <ALink css={{ color: "currentColor", padding: 8, pr: 8, "@md": { pr: 0 } }} target="_blank">
                                <WebsiteIcon height={24} width={24} fill={"currentColor"} />
                            </ALink>
                        </Link>
                    </Tooltip>}
                </Row>}
            <Row css={{ justifyContent: "flex-end", pt: 8, pb: 0, fill: "$gray500", "@mdMax": { justifyContent: "center", pt: 12, pb: 12, }, alignItems: "flex-start" }}>
                <CakeIcon height={24} width={24} style={{ transform: "scale(0.8)" }} />
                <Text css={{ ml: 4, fs: "1em", color: "$gray500", fontWeight: "600" }}>
                    {`Joined 
                    ${new Date(createdAt).getDate()} 
                    ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date(createdAt).getMonth()]},
                    ${new Date(createdAt).getFullYear()}
                    `}
                </Text>
            </Row>
        </Grid>
    </Grid.Container>)
}

export default ProfileDetails