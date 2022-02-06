import { Spacer, Text, Grid, Card, Switch, useTheme, Row, Textarea } from '@nextui-org/react';

import {
    VisibleIcon,
    VisibleOffIcon
} from "../../icons";

const ProfileBio = ({ onBioChange, bio, bioText, editingProfile, onVisibilityChange, visibility }) => {
    const { isDark } = useTheme();

    return (<Grid xs={12} css={{ mt: 18, p: 0 }}>
        <Card bordered>
            <Grid.Container gap={editingProfile ? 1 : 0}>
                <Grid xs={12} md={editingProfile ? 6 : 12} css={{ whiteSpace: "pre-line", maxH: 200, fd: "column" }}>
                    <Text h4>Biography</Text>
                    <Spacer y={0.5} />
                    {editingProfile ?
                        <Textarea
                            css={{ minWidth: "100%" }}
                            placeholder="Enter your biography. You can also leave this empty."
                            onChange={onBioChange}
                            value={bioText}
                            maxLength={200}
                            maxRows={4}
                            animated={false}
                        />
                        :
                        <Text css={{ overflowWrap: "anywhere", fs: "1.1em" }}>{bio}</Text>}
                </Grid>
                <Grid xs={editingProfile ? 12 : 0} md={editingProfile ? 6 : 0} css={{ fd: "column" }}>
                    <Text h4>Profile Visibility</Text>
                    <Spacer y={0.5} />
                    <Card css={{ backgroundColor: isDark ? "#1c1c1c" : "$background", justifyContent: "center", height: "100%" }} shadow={false}>
                        <Row>
                            <Switch
                                checked={visibility}
                                onChange={onVisibilityChange}
                                size="lg"
                                iconOn={<VisibleIcon height={24} width={24} fill={"currentColor"} />}
                                iconOff={<VisibleOffIcon height={24} width={24} fill={"currentColor"} />}
                            />
                            <Text css={{ fs: "1.2em", fontWeight: "500", ml: 8 }}>
                                {visibility ? "Your profile is visible to public." : "Your profile is private."}
                            </Text>
                        </Row>
                    </Card>
                </Grid>
            </Grid.Container>
        </Card>
    </Grid>)
}

export default ProfileBio;