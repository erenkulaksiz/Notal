import { Spacer, Text, Card, useTheme, Row, Link as ALink, Grid } from '@nextui-org/react';
import Link from 'next/link';
import PoweredByVercel from 'powered-by-vercel';
import styled from 'styled-components';

import {
    CodeIcon,
    HeartIcon
} from '../../icons';

const Footer = styled.footer`
    background-image: ${props => props.isDark ? "linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(11,11,11,1) 49%, rgba(0,0,0,0) 100%);" : "linear-gradient(0deg, rgba(139,139,139,1) 0%, rgba(139,139,139,0.3449754901960784) 60%, rgba(139,139,139,0) 100%)"};
    padding-top: 24px;
    padding-bottom: 24px;
`;

const LandingFooter = () => {
    const { isDark } = useTheme();

    return (<Footer isDark={isDark}>
        <Grid.Container>
            <Grid xs={2} md={4}></Grid>
            <Grid xs={8} md={4}>
                <Row css={{ alignItems: "center", justifyContent: "center" }}>
                    <CodeIcon size={20} fill="currentColor" style={{ marginRight: 4, transform: "scale(0.8)" }} />
                    <Text>with</Text>
                    <HeartIcon size={20} fill="red" style={{ marginLeft: 4, marginRight: 4, transform: "scale(0.8)" }} />
                    <Text css={{ mr: 8 }}>by</Text>
                    <Link href="https://github.com/erenkulaksiz" passHref>
                        <ALink color target="_blank">@Eren Kulaksiz</ALink>
                    </Link>
                </Row>
            </Grid>
            <Grid xs={2} md={4}></Grid>
            <Spacer y={1} />
            <Grid xs={12} justify="center">
                <PoweredByVercel utmSource="notal" />
            </Grid>
        </Grid.Container>
    </Footer>)
}

export default LandingFooter;