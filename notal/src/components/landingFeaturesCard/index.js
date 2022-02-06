import { Spacer, Text, Card, Row, Avatar, Grid, useTheme } from '@nextui-org/react';

const LandingFeaturesCard = ({ feature }) => {
    const { isDark } = useTheme();

    return (<Grid xs={12} sm={6} md={3}>
        <Card css={{ bf: "saturate(180%) blur(10px)", bg: isDark ? "#ffffff20" : "#ffffffa9" }}>
            <Row style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Avatar
                    squared
                    icon={feature.icon}
                />
                <Text h4 css={{ ml: 8 }}>
                    {feature.title}
                </Text>
            </Row>
            <Spacer y={0.5} />
            <Row>
                <Text>
                    {feature.desc}
                </Text>
            </Row>
        </Card>
    </Grid>)
}

export default LandingFeaturesCard;